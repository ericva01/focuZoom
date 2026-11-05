#!/usr/bin/env node

/**
 * FucuFlow Model Context Protocol (MCP) Server
 * Conforms to the standard MCP specification (JSON-RPC 2.0 over stdio).
 * Integrates Claude Desktop, Antigravity, Cursor, Windsurf, and custom AI agents
 * directly with FucuFlow Cinematic Studio.
 */

import readline from "node:readline";

const BRIDGE_PORT = parseInt(process.env.FUCUFLOW_BRIDGE_PORT || "9876", 10);
const BRIDGE_URL = `http://127.0.0.1:${BRIDGE_PORT}`;

// -----------------------------------------------------------------------------
// MCP Tools Manifest
// -----------------------------------------------------------------------------

const TOOLS = [
  {
    name: "fucuflow_get_state",
    description: "Get the complete active state of the FucuFlow project (video duration, playhead time, aspect ratio, canvas styling, existing zoom keyframes, timeline clips, and color adjustments).",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "fucuflow_add_zoom_keyframe",
    description: "Add a cinematic 3D camera dolly zoom keyframe at a specific timestamp in the video timeline.",
    inputSchema: {
      type: "object",
      properties: {
        timestamp: {
          type: "number",
          description: "Timestamp in seconds where the 3D zoom keyframe occurs (e.g. 3.25).",
        },
        zoom: {
          type: "number",
          description: "Magnification scale between 1.2 and 4.0 (default 2.2).",
        },
        x: {
          type: "number",
          description: "Normalized horizontal focal position from 0.0 (left) to 1.0 (right). Center is 0.5.",
        },
        y: {
          type: "number",
          description: "Normalized vertical focal position from 0.0 (top) to 1.0 (bottom). Center is 0.5.",
        },
        holdDuration: {
          type: "number",
          description: "Duration in seconds to hold focus before zooming back out (default 1.5).",
        },
        label: {
          type: "string",
          description: "Descriptive label for this keyframe (e.g. 'Focus on search bar').",
        },
      },
      required: ["timestamp"],
    },
  },
  {
    name: "fucuflow_auto_generate_zooms",
    description: "Automatically distribute a cinematic sequence of 3D zoom keyframes throughout the video.",
    inputSchema: {
      type: "object",
      properties: {
        count: {
          type: "number",
          description: "Number of zoom keyframes to create (default 4).",
        },
        zoomScale: {
          type: "number",
          description: "Magnification scale (e.g. 2.0 to 2.6, default 2.2).",
        },
        pattern: {
          type: "string",
          enum: ["dynamic", "alternating", "clicks"],
          description: "Distribution pattern.",
        },
      },
    },
  },
  {
    name: "fucuflow_clear_zoom_keyframes",
    description: "Clear and remove all zoom keyframes from the timeline.",
    inputSchema: {
      type: "object",
      properties: {
        confirm: {
          type: "boolean",
          description: "Set to true to confirm removal.",
        },
      },
      required: ["confirm"],
    },
  },
  {
    name: "fucuflow_remove_zoom_keyframe",
    description: "Remove a specific zoom keyframe by its timestamp or ID.",
    inputSchema: {
      type: "object",
      properties: {
        timestamp: {
          type: "number",
          description: "Timestamp in seconds of the keyframe to remove.",
        },
        id: {
          type: "string",
          description: "Keyframe ID to remove if known.",
        },
      },
    },
  },
  {
    name: "fucuflow_update_canvas_config",
    description: "Modify visual styling including background theme, 3D camera angles, frame corner radius, margin, and shadow.",
    inputSchema: {
      type: "object",
      properties: {
        backgroundPreset: {
          type: "string",
          enum: [
            "mesh-purple",
            "cosmic-blue",
            "obsidian-dark",
            "emerald-matrix",
            "midnight-titanium",
            "aurora-glow",
            "sunset",
            "hyper-neon",
            "solar-flare",
            "pastel-dream",
          ],
          description: "Background aesthetic preset theme.",
        },
        screenAnglePreset: {
          type: "string",
          enum: [
            "simple-smooth",
            "studio-front",
            "floating-dynamic",
            "isometric",
            "cinematic-slant",
          ],
          description: "3D camera tilt perspective angle.",
        },
        renderMode: {
          type: "string",
          enum: ["3d-cinematic", "2d-flat"],
          description: "3D cinematic vs flat 2D rendering mode.",
        },
        cornerRadius: {
          type: "number",
          description: "Corner radius in pixels (0 to 64).",
        },
        padding: {
          type: "number",
          description: "Outer canvas margin / padding (0 to 120).",
        },
        shadowIntensity: {
          type: "string",
          enum: ["none", "subtle", "cinematic", "neon"],
          description: "Drop shadow intensity.",
        },
        zoomEasing: {
          type: "string",
          enum: ["cubic-out", "spring", "smooth-step", "linear"],
          description: "Camera dolly easing curve.",
        },
      },
    },
  },
  {
    name: "fucuflow_set_aspect_ratio",
    description: "Change the video aspect ratio ('16:9' for YouTube, '9:16' for TikTok/Reels, '4:3', '1:1').",
    inputSchema: {
      type: "object",
      properties: {
        aspectRatio: {
          type: "string",
          enum: ["16:9", "9:16", "4:3", "1:1"],
          description: "Target aspect ratio.",
        },
      },
      required: ["aspectRatio"],
    },
  },
  {
    name: "fucuflow_set_color_grading",
    description: "Adjust video color grading: brightness, contrast, saturation, temperature, tint.",
    inputSchema: {
      type: "object",
      properties: {
        brightness: { type: "number", description: "0.5 to 2.0" },
        contrast: { type: "number", description: "0.5 to 2.0" },
        saturation: { type: "number", description: "0.0 to 2.0" },
        temperature: { type: "number", description: "-1.0 to 1.0" },
        tint: { type: "number", description: "-1.0 to 1.0" },
      },
    },
  },
  {
    name: "fucuflow_split_clip",
    description: "Split the video clip at the specified timestamp.",
    inputSchema: {
      type: "object",
      properties: {
        timestamp: { type: "number", description: "Timestamp in seconds." },
      },
      required: ["timestamp"],
    },
  },
  {
    name: "fucuflow_trim_clip",
    description: "Trim clip source boundaries.",
    inputSchema: {
      type: "object",
      properties: {
        clipId: { type: "string", description: "Optional clip ID." },
        start: { type: "number", description: "Start time in seconds." },
        end: { type: "number", description: "End time in seconds." },
      },
      required: ["start", "end"],
    },
  },
  {
    name: "fucuflow_set_playback_speed",
    description: "Adjust preview playback speed (0.25 to 2.0).",
    inputSchema: {
      type: "object",
      properties: {
        speed: { type: "number", description: "Speed multiplier." },
      },
      required: ["speed"],
    },
  },
  {
    name: "fucuflow_seek_to_time",
    description: "Seek the editor playhead to a timestamp.",
    inputSchema: {
      type: "object",
      properties: {
        time: { type: "number", description: "Target time in seconds." },
      },
      required: ["time"],
    },
  },
  {
    name: "fucuflow_trigger_export",
    description: "Trigger the video export dialog in FucuFlow.",
    inputSchema: {
      type: "object",
      properties: {
        preset: {
          type: "string",
          enum: ["4k", "2k", "1080p"],
          description: "Resolution preset.",
        },
      },
    },
  },
];

// -----------------------------------------------------------------------------
// Bridge API Communication
// -----------------------------------------------------------------------------

async function queryEditorState() {
  try {
    const res = await fetch(`${BRIDGE_URL}/api/state`, { method: "GET" });
    if (!res.ok) {
      return { error: `Bridge returned HTTP ${res.status}` };
    }
    return await res.json();
  } catch (err) {
    return {
      error: `Could not connect to FucuFlow Local Bridge on ${BRIDGE_URL}. Ensure FucuFlow is open and 'npm run agent:bridge' is running.`,
    };
  }
}

async function executeEditorAction(actionName, params) {
  try {
    // Strip "fucuflow_" prefix
    const cleanAction = actionName.replace(/^fucuflow_/, "");
    const res = await fetch(`${BRIDGE_URL}/api/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: cleanAction,
        params: params || {},
      }),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errJson.error || `Bridge returned HTTP ${res.status}`,
      };
    }
    return await res.json();
  } catch (err) {
    return {
      success: false,
      error: `Could not connect to FucuFlow Local Bridge on ${BRIDGE_URL}. Ensure FucuFlow is open and 'npm run agent:bridge' is running.`,
    };
  }
}

// -----------------------------------------------------------------------------
// Standard JSON-RPC 2.0 stdio Loop
// -----------------------------------------------------------------------------

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

function sendResponse(id, result, error) {
  const resp = { jsonrpc: "2.0", id };
  if (error) {
    resp.error = error;
  } else {
    resp.result = result;
  }
  process.stdout.write(JSON.stringify(resp) + "\n");
}

rl.on("line", async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  let msg;
  try {
    msg = JSON.parse(trimmed);
  } catch (err) {
    sendResponse(null, undefined, { code: -32700, message: "Parse error" });
    return;
  }

  const { id, method, params } = msg;

  if (method === "initialize") {
    sendResponse(id, {
      protocolVersion: "2024-11-05",
      capabilities: {
        tools: {},
      },
      serverInfo: {
        name: "fucuflow-mcp",
        version: "1.0.0",
      },
    });
    return;
  }

  if (method === "notifications/initialized") {
    // Notification from client; no response required
    return;
  }

  if (method === "ping") {
    sendResponse(id, {});
    return;
  }

  if (method === "tools/list") {
    sendResponse(id, { tools: TOOLS });
    return;
  }

  if (method === "tools/call") {
    const { name, arguments: args } = params || {};

    if (name === "fucuflow_get_state") {
      const stateResult = await queryEditorState();
      sendResponse(id, {
        content: [
          {
            type: "text",
            text: JSON.stringify(stateResult, null, 2),
          },
        ],
      });
      return;
    }

    const actionResult = await executeEditorAction(name, args);
    const textOutput = actionResult.success
      ? `Action '${name}' executed successfully in FucuFlow: ${JSON.stringify(actionResult.result || {})}`
      : `Failed to execute action '${name}': ${actionResult.error || "Unknown error"}`;

    sendResponse(id, {
      content: [
        {
          type: "text",
          text: textOutput,
        },
      ],
      isError: !actionResult.success,
    });
    return;
  }

  // Method not found
  if (id !== undefined && id !== null) {
    sendResponse(id, undefined, { code: -32601, message: `Method '${method}' not found` });
  }
});
