"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  MousePointer2,
  Maximize2,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoomTarget, setZoomTarget] = useState<{ x: number; y: number; label: string }>({
    x: 0.75,
    y: 0.35,
    label: "Deploy Button",
  });
  const [isZoomed, setIsZoomed] = useState<boolean>(true);

  // Interactive mini canvas preview on the hero
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;
    let currentScale = 1.0;
    let currentX = 0.5;
    let currentY = 0.5;

    const render = () => {
      t += 0.02;
      const width = canvas.width;
      const height = canvas.height;

      // Target zoom state
      const targetScale = isZoomed ? 2.1 : 1.0;
      const targetX = isZoomed ? zoomTarget.x : 0.5;
      const targetY = isZoomed ? zoomTarget.y : 0.5;

      // Smooth interpolation
      currentScale += (targetScale - currentScale) * 0.12;
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      ctx.clearRect(0, 0, width, height);

      // Deep canvas background
      ctx.fillStyle = "#0A0E18";
      ctx.fillRect(0, 0, width, height);

      // Soft ambient background light inside canvas
      const grad = ctx.createRadialGradient(width * 0.7, height * 0.3, 20, width * 0.7, height * 0.3, 350);
      grad.addColorStop(0, "rgba(56, 189, 248, 0.12)");
      grad.addColorStop(0.5, "rgba(99, 102, 241, 0.05)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Rounded container frame
      const pad = 24;
      const fW = width - pad * 2;
      const fH = height - pad * 2;
      const radius = 12;

      // Base frosted card container
      ctx.save();
      ctx.fillStyle = "rgba(18, 24, 38, 0.75)";
      ctx.beginPath();
      ctx.roundRect(pad, pad, fW, fH, radius);
      ctx.fill();
      ctx.restore();

      // Clip inside frame
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(pad, pad, fW, fH, radius);
      ctx.clip();

      // Camera transformation around true center point
      const centerX = pad + fW / 2;
      const centerY = pad + fH / 2;
      const panX = -(currentX - 0.5) * fW;
      const panY = -(currentY - 0.5) * fH;

      ctx.translate(centerX, centerY);
      ctx.scale(currentScale, currentScale);
      ctx.translate(panX, panY);
      ctx.translate(-fW / 2, -fH / 2);

      // Draw simulated modern UI inside frame
      // 1. Header bar
      ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
      ctx.fillRect(0, 0, fW, 36);

      // Window dots
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(16, 18, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#eab308";
      ctx.beginPath();
      ctx.arc(30, 18, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.arc(44, 18, 4, 0, Math.PI * 2);
      ctx.fill();

      // 2. Sidebar
      ctx.fillStyle = "rgba(10, 14, 24, 0.6)";
      ctx.fillRect(0, 36, 120, fH - 36);

      ctx.fillStyle = "#64748B";
      ctx.font = "9px monospace";
      ctx.fillText("EXPLORER", 15, 55);
      ["src/index.ts", "components/Studio.tsx", "engine/Easing.ts", "package.json"].forEach((file, idx) => {
        ctx.fillStyle = idx === 1 ? "#38BDF8" : "#94A3B8";
        ctx.fillText(file, 15, 75 + idx * 18);
      });

      // 3. Code Editor
      ctx.fillStyle = "rgba(15, 22, 36, 0.85)";
      ctx.fillRect(120, 36, fW - 120, fH - 36);

      const codeSnippets = [
        { code: "const studio = new FocuFlow();", color: "#38BDF8" },
        { code: "studio.onUserClick((target) => {", color: "#F8FAFC" },
        { code: "  camera.smoothZoom({", color: "#818CF8" },
        { code: "    focalPoint: target.coordinates,", color: "#CBD5E1" },
        { code: "    scale: 2.2,", color: "#38BDF8" },
        { code: "    springEasing: true", color: "#22D3EE" },
        { code: "  });", color: "#818CF8" },
        { code: "});", color: "#F8FAFC" },
      ];

      codeSnippets.forEach((snippet, idx) => {
        ctx.fillStyle = snippet.color;
        ctx.font = "11px monospace";
        ctx.fillText(snippet.code, 140, 75 + idx * 20);
      });

      // 4. Interactive Target Card (Deploy Button) at (0.75, 0.35)
      const btnX = fW * 0.65;
      const btnY = fH * 0.3;
      const btnW = 140;
      const btnH = 34;

      ctx.fillStyle = "rgba(56, 189, 248, 0.22)";
      ctx.beginPath();
      ctx.roundRect(btnX, btnY, btnW, btnH, 8);
      ctx.fill();

      ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Deploy to Edge", btnX + btnW / 2, btnY + 21);
      ctx.textAlign = "left";

      // 5. Draw animated ripple if active
      if (isZoomed) {
        const ripplePhase = (t * 2) % 1;
        const fade = 1 - ripplePhase;
        ctx.strokeStyle = "rgba(56, 189, 248, " + fade * 0.8 + ")";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(zoomTarget.x * fW, zoomTarget.y * fH, 10 + ripplePhase * 40, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "rgba(99, 102, 241, " + fade * 0.5 + ")";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(zoomTarget.x * fW, zoomTarget.y * fH, 5 + ripplePhase * 25, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 6. Draw dynamic cursor
      const curX = zoomTarget.x * fW;
      const curY = zoomTarget.y * fH;
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#0B0F19";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(curX, curY);
      ctx.lineTo(curX + 11, curY + 11);
      ctx.lineTo(curX + 5, curY + 12);
      ctx.lineTo(curX + 8, curY + 18);
      ctx.lineTo(curX + 5, curY + 19);
      ctx.lineTo(curX + 2, curY + 13);
      ctx.lineTo(curX, curY + 16);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();

      // Border outline with glass specular light
      ctx.strokeStyle = "rgba(255, 255, 255, 0.14)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(pad, pad, fW, fH, radius);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isZoomed, zoomTarget]);

  // Click on canvas to change focal point
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / rect.width;
    const clickY = (e.clientY - rect.top) / rect.height;

    setZoomTarget({
      x: Math.max(0.15, Math.min(0.85, clickX)),
      y: Math.max(0.15, Math.min(0.85, clickY)),
      label: `Target (${Math.round(clickX * 100)}%, ${Math.round(clickY * 100)}%)`,
    });
    setIsZoomed(true);
  };

  return (
    <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 bg-[#090D16] bg-grid-pattern">
      {/* Soft Ambient Depth Glows */}
      <div className="ambient-backdrop" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Frosted Glass Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/12 backdrop-blur-md text-xs font-mono text-slate-200 shadow-glass-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span>Next-Gen Screen Recording Studio</span>
            <span className="w-1 h-1 rounded-full bg-sky-400/60" />
            <span className="text-sky-300 font-semibold">100% In-Browser</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
            Turn standard screen recordings into{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-300 to-indigo-200">
              cinematic developer demos.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Auto-detect key clicks, apply buttery-smooth spring easing pans, customize sleek frosted-glass backdrops, and render crisp 60 FPS demo videos directly inside your browser.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link href="/editor" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Start Editing Free
              </Button>
            </Link>

            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => setIsZoomed(!isZoomed)}
              leftIcon={
                <RefreshCw
                  className={`w-3.5 h-3.5 text-sky-400 ${isZoomed ? "rotate-180" : ""} transition-transform duration-500`}
                />
              }
            >
              {isZoomed ? "Reset Hero Zoom" : "Test Auto-Zoom"}
            </Button>
          </div>

          {/* Quick value badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-400" />
              <span className="text-slate-300">No software to install</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-400" />
              <span className="text-slate-300">100% Client-Side Privacy</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-400" />
              <span className="text-slate-300">Export in 4K / 60 FPS</span>
            </div>
          </div>
        </div>

        {/* Interactive Live Demo Preview Box in Floating Frosted Glass Housing */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="glass-panel-elevated rounded-2xl overflow-hidden shadow-glass-lg relative">
            {/* Window toolbar */}
            <div className="px-4 py-3 bg-white/[0.03] border-b border-white/10 flex items-center justify-between text-xs backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="text-slate-400 ml-2 font-mono text-[11px] hidden sm:inline">
                  Interactive Live Engine Simulator (Click canvas to pan focal point)
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.06] text-sky-300 border border-white/10 shadow-glass-inner flex items-center gap-1.5">
                  <Maximize2 className="w-3 h-3 text-sky-400" />
                  {isZoomed ? "2.1x Zoom Active" : "1.0x Flat"}
                </span>
                <Link
                  href="/editor"
                  className="text-[11px] font-medium text-sky-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  Open Studio <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Canvas stage */}
            <div className="relative aspect-[16/9] w-full bg-[#0A0E18] cursor-crosshair group">
              <canvas
                ref={canvasRef}
                width={960}
                height={540}
                onClick={handleCanvasClick}
                className="w-full h-full object-contain block"
              />

              {/* Floating hint pill */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto pointer-events-none flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/60 backdrop-blur-xl border border-white/15 text-xs text-slate-200 shadow-glass-md">
                <MousePointer2 className="w-3.5 h-3.5 text-sky-400 animate-bounce" />
                <span>
                  Click anywhere to move auto-zoom target:{" "}
                  <strong className="text-white font-mono">{zoomTarget.label}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
