import http from "http";
import fs from "fs";
import path from "path";
import { URL } from "url";

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".wav": "audio/wav",
  ".mp3": "audio/mpeg",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
};

export interface LocalServerResult {
  server: http.Server;
  port: number;
  url: string;
}

/**
 * Starts a zero-latency local loopback HTTP server to serve the exported Next.js static files.
 * Supports partial content (HTTP 206) for video scrubbing & timeline playback.
 */
export function startStaticServer(staticDirPath: string): Promise<LocalServerResult> {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      // Allow only GET and HEAD
      if (req.method !== "GET" && req.method !== "HEAD") {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("Method Not Allowed");
        return;
      }

      try {
        const parsedUrl = new URL(req.url || "/", "http://127.0.0.1");
        let decodedPath = decodeURIComponent(parsedUrl.pathname);

        // Normalize path to prevent directory traversal
        let safeRelativePath = path.normalize(decodedPath).replace(/^(\.\.[\/\\])+/, "");
        if (safeRelativePath.startsWith("/") || safeRelativePath.startsWith("\\")) {
          safeRelativePath = safeRelativePath.slice(1);
        }

        let fullPath = path.join(staticDirPath, safeRelativePath);

        // Check if path is a directory, look for index.html
        if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
          fullPath = path.join(fullPath, "index.html");
        }

        // If file does not exist directly, check with .html extension
        if (!fs.existsSync(fullPath)) {
          if (fs.existsSync(fullPath + ".html")) {
            fullPath = fullPath + ".html";
          } else if (fs.existsSync(path.join(fullPath, "index.html"))) {
            fullPath = path.join(fullPath, "index.html");
          } else {
            // Fall back to 404.html or index.html for SPA routing
            const notFoundPath = path.join(staticDirPath, "404.html");
            const indexPath = path.join(staticDirPath, "index.html");
            if (fs.existsSync(notFoundPath)) {
              fullPath = notFoundPath;
            } else if (fs.existsSync(indexPath)) {
              fullPath = indexPath;
            }
          }
        }

        if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("Not Found");
          return;
        }

        const content = fs.readFileSync(fullPath);
        const ext = path.extname(fullPath).toLowerCase();
        const contentType = MIME_TYPES[ext] || "application/octet-stream";

        // Video and Audio range handling for scrubbing
        const range = req.headers.range;
        if (range && (ext === ".mp4" || ext === ".webm" || ext === ".mov" || ext === ".mp3" || ext === ".wav")) {
          const parts = range.replace(/bytes=/, "").split("-");
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : content.length - 1;
          const chunk = content.subarray(start, end + 1);

          res.writeHead(206, {
            "Content-Range": `bytes ${start}-${end}/${content.length}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunk.length,
            "Content-Type": contentType,
            "Access-Control-Allow-Origin": "*",
          });

          if (req.method === "HEAD") {
            res.end();
          } else {
            res.end(chunk);
          }
          return;
        }

        // Standard response
        res.writeHead(200, {
          "Content-Length": content.length,
          "Content-Type": contentType,
          "Accept-Ranges": "bytes",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=31536000",
        });

        if (req.method === "HEAD") {
          res.end();
          return;
        }

        res.end(content);
      } catch (err) {
        console.error("Server error serving path:", req.url, err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      }
    });

    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (address && typeof address === "object") {
        const port = address.port;
        const url = `http://127.0.0.1:${port}`;
        resolve({ server, port, url });
      } else {
        reject(new Error("Failed to obtain server address"));
      }
    });

    server.on("error", (err) => {
      reject(err);
    });
  });
}
