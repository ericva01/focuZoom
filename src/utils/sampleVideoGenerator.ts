import { ClickEvent, CursorPoint } from "@/types/editor";
import { clusterNearbyClicks } from "@/utils/clickClusterer";

/**
 * Procedurally generates a realistic 12-second 1280x720 developer screen recording
 * using an offscreen canvas and MediaRecorder.
 */
export async function generateSampleScreenRecording(): Promise<{
  blobUrl: string;
  duration: number;
  defaultEvents: ClickEvent[];
  cursorTrail: CursorPoint[];
}> {
  return new Promise((resolve, reject) => {
    try {
      const width = 1280;
      const height = 720;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Unable to create 2D canvas context"));
        return;
      }

      // 30 FPS stream
      const stream = canvas.captureStream(30);
      let mimeType = "video/webm;codecs=vp9";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/webm;codecs=vp8";
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/webm";
      }

      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 4000000,
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      const durationSeconds = 12;
      const totalFrames = durationSeconds * 30;
      let frame = 0;

      const sampleCursorTrail: CursorPoint[] = [];

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const blobUrl = URL.createObjectURL(blob);
        const defaultEvents: ClickEvent[] = [
          {
            id: "demo-event-1",
            timestamp: 2.4,
            x: 0.898,
            y: 0.033,
            zoom: 2.2,
            label: "Run Cinematic Build",
            enabled: true,
          },
          {
            id: "demo-event-2",
            timestamp: 5.8,
            x: 0.344,
            y: 0.749,
            zoom: 2.4,
            label: "Inspect Terminal Diagnostics",
            enabled: true,
          },
          {
            id: "demo-event-3",
            timestamp: 9.2,
            x: 0.828,
            y: 0.497,
            zoom: 2.0,
            label: "Deploy Instant Release",
            enabled: true,
          },
        ];

        const clustered = clusterNearbyClicks(defaultEvents, 0.8, 2.2, sampleCursorTrail);

        resolve({
          blobUrl,
          duration: durationSeconds,
          defaultEvents: clustered,
          cursorTrail: sampleCursorTrail,
        });
      };

      recorder.start();

      const renderFrame = () => {
        const t = frame / 30; // current time in seconds

        // 1. Dark IDE background
        ctx.fillStyle = "#0c0e17";
        ctx.fillRect(0, 0, width, height);

        // 2. Window title bar (macOS style)
        ctx.fillStyle = "#121522";
        ctx.fillRect(0, 0, width, 40);

        // Traffic light buttons
        ctx.fillStyle = "#ff5f56";
        ctx.beginPath();
        ctx.arc(22, 20, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffbd2e";
        ctx.beginPath();
        ctx.arc(42, 20, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#27c93f";
        ctx.beginPath();
        ctx.arc(62, 20, 6, 0, Math.PI * 2);
        ctx.fill();

        // Title text
        ctx.fillStyle = "#8b949e";
        ctx.font = "13px -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("FucuFlow — StudioEngine.tsx — 1280x720", width / 2, 25);

        // Top right Action Button: "Run Build" (Click target at x: 0.85, y: 0.12 => ~1088, 86)
        const isRunHovered = t > 1.8 && t < 3.2;
        ctx.fillStyle = isRunHovered ? "#4f46e5" : "#6366f1";
        ctx.beginPath();
        ctx.roundRect(width - 200, 8, 140, 24, 6);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("▶ Run Build (v2.4)", width - 130, 24);

        // 3. Left Sidebar (File Explorer)
        ctx.fillStyle = "#090a10";
        ctx.fillRect(0, 40, 220, height - 40);
        ctx.fillStyle = "#64748b";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("EXPLORER: STUDIO", 20, 65);

        const files = [
          "▸ node_modules",
          "▾ src",
          "  ▾ components",
          "      VideoCanvas.tsx",
          "      Timeline.tsx",
          "      ClickInspector.tsx",
          "  ▾ engine",
          "    ● StudioEngine.tsx",
          "      CubicEasing.ts",
          "  ▸ styles",
          "    package.json",
          "    README.md",
        ];

        files.forEach((f, idx) => {
          if (f.includes("StudioEngine.tsx")) {
            ctx.fillStyle = "#1e293b";
            ctx.fillRect(10, 80 + idx * 24 - 15, 200, 22);
            ctx.fillStyle = "#fb7185";
          } else {
            ctx.fillStyle = "#94a3b8";
          }
          ctx.font = "12px monospace";
          ctx.fillText(f, 20, 80 + idx * 24);
        });

        // 4. Editor Tab bar
        ctx.fillStyle = "#121626";
        ctx.fillRect(220, 40, width - 220, 36);

        ctx.fillStyle = "#1a1f36";
        ctx.fillRect(220, 40, 180, 36);
        ctx.fillStyle = "#fb7185";
        ctx.font = "12px monospace";
        ctx.fillText("StudioEngine.tsx", 240, 63);

        // 5. Code Editor Area with Animated Code Typing
        ctx.fillStyle = "#0f121e";
        ctx.fillRect(220, 76, width - 220, height - 260);

        const codeLines = [
          { text: "import { CinematicCamera, Easing } from '@fucuflow/core';", color: "#c084fc" },
          { text: "import { interpolatePanZoom } from '@/utils/easing';", color: "#c084fc" },
          { text: "", color: "" },
          { text: "export async function renderCinematicFrame(timestamp: number) {", color: "#60a5fa" },
          { text: "  const camera = new CinematicCamera({", color: "#e2e8f0" },
          { text: "    smoothing: 'spring-damped',", color: "#34d399" },
          { text: "    zoomScale: 2.2,", color: "#f59e0b" },
          { text: "    retinaHighDPI: true,", color: "#fb7185" },
          { text: "  });", color: "#e2e8f0" },
          { text: "", color: "" },
          { text: "  // Automatically track focus points & apply cubic easing", color: "#64748b" },
          { text: "  const activeTarget = camera.detectFocalTarget(timestamp);", color: "#e2e8f0" },
          { text: "  if (activeTarget) {", color: "#c084fc" },
          { text: "    camera.panTo(activeTarget.x, activeTarget.y, { duration: 1.2 });", color: "#a78bfa" },
          { text: "    camera.renderRipples({ color: '#fb7185', ringCount: 3 });", color: "#fb7185" },
          { text: "  }", color: "#c084fc" },
          { text: "  return camera.renderFrame();", color: "#34d399" },
          { text: "}", color: "#60a5fa" },
        ];

        // Typing progress
        const visibleLinesCount = Math.min(codeLines.length, Math.floor(t * 2) + 6);
        codeLines.slice(0, visibleLinesCount).forEach((line, idx) => {
          // Line number
          ctx.fillStyle = "#475569";
          ctx.font = "12px monospace";
          ctx.textAlign = "right";
          ctx.fillText((idx + 1).toString(), 250, 105 + idx * 22);

          // Code text
          ctx.fillStyle = line.color || "#e2e8f0";
          ctx.textAlign = "left";
          ctx.fillText(line.text, 270, 105 + idx * 22);
        });

        // Blinking cursor
        if (Math.floor(t * 3) % 2 === 0 && visibleLinesCount < codeLines.length) {
          ctx.fillStyle = "#fb7185";
          ctx.fillRect(270 + 200, 93 + (visibleLinesCount - 1) * 22, 8, 16);
        }

        // 6. Interactive Middle Card / Deploy Button (x: 0.75, y: 0.45 => ~960, 324)
        if (t > 6) {
          ctx.fillStyle = "rgba(22, 27, 44, 0.9)";
          ctx.strokeStyle = "rgba(99, 102, 241, 0.4)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(width - 380, 260, 320, 140, 10);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "#f8fafc";
          ctx.font = "bold 13px sans-serif";
          ctx.textAlign = "left";
          ctx.fillText("🚀 Instant Production Release", width - 360, 290);

          ctx.fillStyle = "#94a3b8";
          ctx.font = "11px sans-serif";
          ctx.fillText("Edge worker active · 100% Client-side execution", width - 360, 312);

          const isDeployHovered = t > 8.5 && t < 10.0;
          ctx.fillStyle = isDeployHovered ? "#10b981" : "#059669";
          ctx.beginPath();
          ctx.roundRect(width - 360, 335, 280, 38, 8);
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 12px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(
            isDeployHovered ? "✓ Deploying to Global Edge..." : "Deploy Instant Release",
            width - 220,
            358
          );
        }

        // 7. Bottom Terminal Panel (x: 0.32, y: 0.72 => ~410, 518)
        ctx.fillStyle = "#090a12";
        ctx.fillRect(220, height - 200, width - 220, 200);

        // Terminal header
        ctx.fillStyle = "#121626";
        ctx.fillRect(220, height - 200, width - 220, 30);
        ctx.fillStyle = "#94a3b8";
        ctx.font = "11px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("TERMINAL — zsh (active)", 235, height - 180);

        // Status pill button (target for second zoom)
        const isStatusHovered = t > 5.0 && t < 6.8;
        ctx.fillStyle = isStatusHovered ? "#e11d48" : "#0369a1";
        ctx.beginPath();
        ctx.roundRect(380, height - 195, 120, 20, 4);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Inspect Diagnostics", 440, height - 181);

        // Terminal text lines
        const termLines = [
          "$ npm run build:fucuflow",
          "✓ Bundled in 142ms (client-side WebCodecs)",
          "✓ Auto-zoom keyframes detected: 3 points",
          t > 3 ? "✓ Camera pan interpolation: 60 FPS verified" : "  Compiling...",
          t > 6 ? "✓ Video streams synchronized (0.00ms audio/visual drift)" : "",
          t > 9 ? "🎉 Ready for preview and cinematic export!" : "",
        ];

        termLines.filter(Boolean).forEach((tl, idx) => {
          ctx.fillStyle = tl.startsWith("✓") ? "#34d399" : tl.startsWith("🎉") ? "#f43f5e" : "#94a3b8";
          ctx.font = "11px monospace";
          ctx.textAlign = "left";
          ctx.fillText(tl, 235, height - 150 + idx * 20);
        });

        // 8. Simulated moving mouse cursor during demo
        let cursorX = 300;
        let cursorY = 300;
        if (t < 2.4) {
          // move towards Run Build
          const prog = Math.min(1, t / 2.4);
          cursorX = 300 + (width - 130 - 300) * prog;
          cursorY = 300 + (24 - 300) * prog;
        } else if (t < 5.8) {
          // move towards terminal diagnostics
          const prog = Math.min(1, (t - 2.4) / 3.4);
          cursorX = width - 130 + (440 - (width - 130)) * prog;
          cursorY = 24 + (height - 181 - 24) * prog;
        } else if (t < 9.2) {
          // move towards Deploy button
          const prog = Math.min(1, (t - 5.8) / 3.4);
          cursorX = 440 + (width - 220 - 440) * prog;
          cursorY = height - 181 + (358 - (height - 181)) * prog;
        } else {
          // subtle idle float
          cursorX = width - 220 + Math.sin(t * 3) * 15;
          cursorY = 358 + Math.cos(t * 3) * 10;
        }

        // Record continuous cursor trajectory for realistic camera tracking
        sampleCursorTrail.push({
          timestamp: Math.round(t * 100) / 100,
          x: Math.round((cursorX / width) * 1000) / 1000,
          y: Math.round((cursorY / height) * 1000) / 1000,
        });

        // Draw small pointer cursor
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cursorX, cursorY);
        ctx.lineTo(cursorX + 12, cursorY + 12);
        ctx.lineTo(cursorX + 6, cursorY + 13);
        ctx.lineTo(cursorX + 9, cursorY + 19);
        ctx.lineTo(cursorX + 6, cursorY + 20);
        ctx.lineTo(cursorX + 3, cursorY + 14);
        ctx.lineTo(cursorX, cursorY + 17);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        frame++;
        if (frame < totalFrames) {
          requestAnimationFrame(renderFrame);
        } else {
          recorder.stop();
        }
      };

      requestAnimationFrame(renderFrame);
    } catch (err) {
      reject(err);
    }
  });
}
