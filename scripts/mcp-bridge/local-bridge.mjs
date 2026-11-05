#!/usr/bin/env node

/**
 * FucuFlow Agent Local Bridge Server
 * Zero-dependency standalone HTTP & WebSocket bridge that connects
 * external AI agents (Claude Desktop, Cursor, Antigravity, custom scripts, MCP server)
 * to the active FucuFlow editor instance in real time.
 */

import http from "node:http";
import crypto from "node:crypto";

const PORT = parseInt(process.env.FUCUFLOW_BRIDGE_PORT || "9876", 10);
const WS_GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

let activeEditorSocket = null;
let lastKnownState = null;
const pendingRequests = new Map(); // id -> { resolve, reject, timeout }

/**
 * Helper to encode server -> client WebSocket frame (unmasked)
 */
function encodeWsFrame(data) {
  const payload = Buffer.from(typeof data === "string" ? data : JSON.stringify(data), "utf-8");
  const len = payload.length;
  let header;

  if (len < 126) {
    header = Buffer.alloc(2);
    header[0] = 0x81; // FIN + text frame
    header[1] = len;
  } else if (len < 65536) {
    header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 126;
    header.writeUInt16BE(len, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x81;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(len), 2);
  }

  return Buffer.concat([header, payload]);
}

/**
 * Helper to parse client -> server WebSocket frames (masked)
 */
function parseWsFrames(buffer) {
  const frames = [];
  let offset = 0;

  while (offset + 2 <= buffer.length) {
    const byte1 = buffer[offset];
    const byte2 = buffer[offset + 1];
    const opcode = byte1 & 0x0f;
    const isMasked = (byte2 & 0x80) !== 0;
    let payloadLen = byte2 & 0x7f;
    let headerLen = 2;

    if (payloadLen === 126) {
      if (offset + 4 > buffer.length) break;
      payloadLen = buffer.readUInt16BE(offset + 2);
      headerLen = 4;
    } else if (payloadLen === 127) {
      if (offset + 10 > buffer.length) break;
      payloadLen = Number(buffer.readBigUInt64BE(offset + 2));
      headerLen = 10;
    }

    const maskLen = isMasked ? 4 : 0;
    const totalLen = headerLen + maskLen + payloadLen;
    if (offset + totalLen > buffer.length) break; // Incomplete frame

    let payload = buffer.subarray(offset + headerLen + maskLen, offset + totalLen);
    if (isMasked) {
      const maskKey = buffer.subarray(offset + headerLen, offset + headerLen + 4);
      const unmasked = Buffer.alloc(payloadLen);
      for (let i = 0; i < payloadLen; i++) {
        unmasked[i] = payload[i] ^ maskKey[i % 4];
      }
      payload = unmasked;
    }

    frames.push({ opcode, payload });
    offset += totalLen;
  }

  return { frames, remaining: buffer.subarray(offset) };
}

// -----------------------------------------------------------------------------
// HTTP & WebSocket Server
// -----------------------------------------------------------------------------

const server = http.createServer((req, res) => {
  // Global CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  // Health check
  if (url.pathname === "/health" || url.pathname === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "ok",
        service: "FucuFlow AI Agent Local Bridge",
        port: PORT,
        editorConnected: activeEditorSocket !== null && !activeEditorSocket.destroyed,
        timestamp: Date.now(),
      })
    );
    return;
  }

  // Query editor state
  if (url.pathname === "/api/state" && req.method === "GET") {
    if (!activeEditorSocket || activeEditorSocket.destroyed) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          connected: false,
          error: "FucuFlow editor is not connected to local bridge. Please keep FucuFlow open.",
          state: lastKnownState,
        })
      );
      return;
    }

    const reqId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const timer = setTimeout(() => {
      pendingRequests.delete(reqId);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          connected: true,
          timeout: true,
          state: lastKnownState,
        })
      );
    }, 3000);

    pendingRequests.set(reqId, {
      resolve: (state) => {
        clearTimeout(timer);
        lastKnownState = state;
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ connected: true, state }));
      },
      reject: (err) => {
        clearTimeout(timer);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message || "Failed to retrieve state" }));
      },
    });

    try {
      activeEditorSocket.write(
        encodeWsFrame({
          type: "get_state",
          id: reqId,
        })
      );
    } catch (err) {
      clearTimeout(timer);
      pendingRequests.delete(reqId);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to send request to editor" }));
    }
    return;
  }

  // Execute action on editor
  if (url.pathname === "/api/action" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      if (!activeEditorSocket || activeEditorSocket.destroyed) {
        res.writeHead(503, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: false,
            error: "FucuFlow editor is not currently connected to the local bridge.",
          })
        );
        return;
      }

      let payload;
      try {
        payload = JSON.parse(body);
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Invalid JSON body" }));
        return;
      }

      const reqId = `action_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const timer = setTimeout(() => {
        pendingRequests.delete(reqId);
        res.writeHead(504, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Editor action timed out after 5s." }));
      }, 5000);

      pendingRequests.set(reqId, {
        resolve: (result) => {
          clearTimeout(timer);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, result }));
        },
        reject: (err) => {
          clearTimeout(timer);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, error: err.message || "Action failed." }));
        },
      });

      try {
        activeEditorSocket.write(
          encodeWsFrame({
            type: "execute_action",
            id: reqId,
            payload,
          })
        );
      } catch (err) {
        clearTimeout(timer);
        pendingRequests.delete(reqId);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Failed to transmit action to editor." }));
      }
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Endpoint not found" }));
});

// -----------------------------------------------------------------------------
// WebSocket Upgrade Handling
// -----------------------------------------------------------------------------

server.on("upgrade", (req, socket, head) => {
  const secWsKey = req.headers["sec-websocket-key"];
  if (!secWsKey) {
    socket.destroy();
    return;
  }

  const hash = crypto.createHash("sha1").update(secWsKey + WS_GUID).digest("base64");
  const headers = [
    "HTTP/1.1 101 Switching Protocols",
    "Upgrade: websocket",
    "Connection: Upgrade",
    `Sec-WebSocket-Accept: ${hash}`,
    "\r\n",
  ];

  socket.write(headers.join("\r\n"));

  activeEditorSocket = socket;
  console.log(`[FucuFlow Bridge] Editor connected via WebSocket.`);

  let incomingBuffer = Buffer.alloc(0);

  socket.on("data", (data) => {
    incomingBuffer = Buffer.concat([incomingBuffer, data]);
    const { frames, remaining } = parseWsFrames(incomingBuffer);
    incomingBuffer = remaining;

    for (const frame of frames) {
      if (frame.opcode === 0x8) {
        // Close frame
        socket.end();
        break;
      }
      if (frame.opcode === 0x9) {
        // Ping -> Pong
        const pongHeader = Buffer.from([0x8a, 0x00]);
        socket.write(pongHeader);
        continue;
      }
      if (frame.opcode === 0x1) {
        // Text frame
        try {
          const text = frame.payload.toString("utf-8");
          const msg = JSON.parse(text);

          if (msg.type === "handshake") {
            console.log(`[FucuFlow Bridge] Handshake received from: ${msg.role}`);
          } else if (msg.type === "state_response") {
            const pending = pendingRequests.get(msg.id);
            if (pending) {
              pendingRequests.delete(msg.id);
              pending.resolve(msg.state);
            }
          } else if (msg.type === "action_response") {
            const pending = pendingRequests.get(msg.id);
            if (pending) {
              pendingRequests.delete(msg.id);
              if (msg.success) {
                pending.resolve(msg.result);
              } else {
                pending.reject(new Error(msg.error || "Action execution error"));
              }
            }
          }
        } catch (err) {
          console.warn("[FucuFlow Bridge] Error parsing message:", err);
        }
      }
    }
  });

  socket.on("close", () => {
    if (activeEditorSocket === socket) {
      activeEditorSocket = null;
      console.log(`[FucuFlow Bridge] Editor disconnected.`);
    }
  });

  socket.on("error", (err) => {
    console.warn(`[FucuFlow Bridge] Socket error:`, err.message);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`=======================================================`);
  console.log(`🎬 FucuFlow AI Agent Local Bridge running on port ${PORT}`);
  console.log(`📡 WebSocket endpoint: ws://127.0.0.1:${PORT}/editor`);
  console.log(`🌐 HTTP API endpoint:  http://127.0.0.1:${PORT}/api/action`);
  console.log(`=======================================================`);
});
