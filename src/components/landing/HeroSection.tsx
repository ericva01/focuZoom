"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, Sun, Bell, MousePointer2, Download } from "lucide-react";
import { DownloadModal } from "@/components/common/DownloadModal";

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "simulator">("dashboard");
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState<boolean>(true);
  const [zoomTarget, setZoomTarget] = useState<{ x: number; y: number; label: string }>({
    x: 0.72,
    y: 0.38,
    label: "Order Action",
  });

  // Interactive mini canvas preview when simulator tab is active
  useEffect(() => {
    if (activeTab !== "simulator") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let currentScale = 1.0;
    let currentX = 0.5;
    let currentY = 0.5;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      const targetScale = isZoomed ? 2.2 : 1.0;
      const targetX = isZoomed ? zoomTarget.x : 0.5;
      const targetY = isZoomed ? zoomTarget.y : 0.5;

      currentScale += (targetScale - currentScale) * 0.12;
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      ctx.clearRect(0, 0, width, height);

      // Deep canvas background
      ctx.fillStyle = "#070B16";
      ctx.fillRect(0, 0, width, height);

      // Soft radial glow inside canvas
      const grad = ctx.createRadialGradient(width * 0.5, height * 0.4, 20, width * 0.5, height * 0.4, 400);
      grad.addColorStop(0, "rgba(251, 113, 133, 0.15)");
      grad.addColorStop(0.6, "rgba(99, 102, 241, 0.05)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      const pad = 24;
      const fW = width - pad * 2;
      const fH = height - pad * 2;
      const radius = 14;

      ctx.save();
      ctx.fillStyle = "rgba(13, 19, 33, 0.85)";
      ctx.beginPath();
      ctx.roundRect(pad, pad, fW, fH, radius);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(pad, pad, fW, fH, radius);
      ctx.clip();

      const centerX = pad + fW / 2;
      const centerY = pad + fH / 2;
      const panX = -(currentX - 0.5) * fW;
      const panY = -(currentY - 0.5) * fH;

      ctx.translate(centerX, centerY);
      ctx.scale(currentScale, currentScale);
      ctx.translate(panX, panY);
      ctx.translate(-fW / 2, -fH / 2);

      // Header row
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.fillRect(0, 0, fW, 38);

      ctx.fillStyle = "#fb7185";
      ctx.beginPath();
      ctx.arc(20, 19, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px -apple-system, sans-serif";
      ctx.fillText("Glideo Engine", 34, 23);

      // Rows inside simulated window
      for (let i = 0; i < 6; i++) {
        const rowY = 56 + i * 44;
        ctx.fillStyle = i % 2 === 0 ? "rgba(255, 255, 255, 0.02)" : "rgba(255, 255, 255, 0.04)";
        ctx.beginPath();
        ctx.roundRect(16, rowY, fW - 32, 34, 8);
        ctx.fill();

        ctx.fillStyle = "#94a3b8";
        ctx.font = "10px -apple-system, sans-serif";
        ctx.fillText(`Action Event #${i + 1} · Timestamp ${(i * 1.8).toFixed(1)}s`, 32, rowY + 21);

        ctx.fillStyle = i === 2 ? "#fb7185" : "#64748b";
        ctx.beginPath();
        ctx.roundRect(fW - 96, rowY + 9, 68, 16, 6);
        ctx.fill();

        ctx.fillStyle = i === 2 ? "#090d16" : "#ffffff";
        ctx.font = "bold 9px monospace";
        ctx.fillText(i === 2 ? "2.2x ZOOM" : "1.0x BASE", fW - 86, rowY + 21);
      }

      // Animated target ripple
      if (isZoomed) {
        const tx = zoomTarget.x * fW;
        const ty = zoomTarget.y * fH;
        ctx.save();
        ctx.strokeStyle = "#fb7185";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(tx, ty, 18, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "#fb7185";
        ctx.beginPath();
        ctx.arc(tx, ty, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();

      // Border outline
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(pad, pad, fW, fH, radius);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [activeTab, isZoomed, zoomTarget]);

  return (
    <section className="relative overflow-hidden bg-[#060913] text-white pt-12 pb-24 lg:pt-18 lg:pb-36 select-none">
      {/* ========================================================================= */}
      {/* 1. SIGNATURE CELESTIAL GLOWING HORIZON DOME ARCH (From Reference Design)   */}
      {/* ========================================================================= */}
      <div className="absolute top-0 inset-x-0 h-[680px] pointer-events-none overflow-hidden flex items-start justify-center">
        {/* Soft vertical beam rays shooting upward into the cosmos */}
        <div className="absolute -top-10 w-[780px] sm:w-[1080px] h-[380px] bg-gradient-to-b from-rose-400/[0.16] via-rose-500/[0.06] to-transparent blur-3xl" />

        {/* Scattered Stardust Twinkle Micro-Particles */}
        <div className="absolute top-28 left-[18%] w-1 h-1 rounded-full bg-white/70 animate-ping" />
        <div className="absolute top-44 left-[32%] w-1.5 h-1.5 rounded-full bg-rose-200/60 blur-[0.5px]" />
        <div className="absolute top-36 right-[24%] w-1 h-1 rounded-full bg-white/80 animate-pulse" />
        <div className="absolute top-52 right-[36%] w-1.5 h-1.5 rounded-full bg-orange-200/50" />
        <div className="absolute top-20 right-[15%] w-1 h-1 rounded-full bg-rose-300/40" />
        <div className="absolute top-64 left-[48%] w-1 h-1 rounded-full bg-white/50" />

        {/* The Massive Glowing Curved Horizon Dome Arch */}
        <div className="relative w-[850px] sm:w-[1250px] lg:w-[1550px] h-[750px] mt-6 sm:mt-10 flex-shrink-0">
          <svg
            viewBox="0 0 1600 700"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <defs>
              {/* Radial gradient for the horizon crest light */}
              <radialGradient
                id="horizonGlow"
                cx="50%"
                cy="0%"
                r="60%"
                fx="50%"
                fy="0%"
              >
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="25%" stopColor="#fda4af" stopOpacity="0.9" />
                <stop offset="55%" stopColor="#fb7185" stopOpacity="0.4" />
                <stop offset="85%" stopColor="#e11d48" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#060913" stopOpacity="0" />
              </radialGradient>

              {/* Inner ambient diffuse aura */}
              <radialGradient
                id="domeAura"
                cx="50%"
                cy="10%"
                r="50%"
                fx="50%"
                fy="10%"
              >
                <stop offset="0%" stopColor="#fb7185" stopOpacity="0.25" />
                <stop offset="45%" stopColor="#1e3a8a" stopOpacity="0.12" />
                <stop offset="90%" stopColor="#060913" stopOpacity="0" />
              </radialGradient>

              {/* Laser sharp crest stroke gradient */}
              <linearGradient id="crestStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fb7185" stopOpacity="0" />
                <stop offset="20%" stopColor="#fb7185" stopOpacity="0.3" />
                <stop offset="40%" stopColor="#fda4af" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="60%" stopColor="#fda4af" stopOpacity="0.95" />
                <stop offset="80%" stopColor="#fb7185" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
              </linearGradient>

              {/* Blur filter for soft atmosphere */}
              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="16" result="blur1" />
                <feGaussianBlur stdDeviation="35" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Inner Atmospheric Dome Fill */}
            <path
              d="M 100 680 C 350 160, 1250 160, 1500 680 Z"
              fill="url(#domeAura)"
            />

            {/* Deep Atmosphere Glow Line */}
            <path
              d="M 120 680 C 360 170, 1240 170, 1480 680"
              stroke="url(#horizonGlow)"
              strokeWidth="32"
              fill="none"
              filter="url(#softGlow)"
              opacity="0.8"
            />

            {/* Sharp Luminous Horizon Arc Line */}
            <path
              d="M 120 680 C 360 170, 1240 170, 1480 680"
              stroke="url(#crestStroke)"
              strokeWidth="2.5"
              fill="none"
            />
          </svg>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. HERO CONTENT CONTAINER                                                 */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Early Access Beta Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/15 backdrop-blur-xl text-xs font-medium text-rose-200 shadow-[0_0_20px_rgba(251,113,133,0.15)] mb-7 hover:border-rose-400/40 transition-colors">
          <div className="relative flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-rose-400 fill-current" viewBox="0 0 24 24">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>
          <span>Early Access Beta</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
          Build faster with Glideo
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base lg:text-lg text-slate-300/90 max-w-2xl mx-auto leading-relaxed mb-8">
          A minimal AI-powered system that transforms raw screen recordings into clear, glowing,
          effortless product demos — helping you ship ideas faster.
        </p>

        {/* Centered Pill Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16 sm:mb-20">
          <Link href="/editor">
            <button
              type="button"
              className="rounded-full bg-white text-black text-sm font-semibold px-7 py-3 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:bg-slate-100 hover:shadow-[0_0_45px_rgba(255,255,255,0.45)] transition-all duration-300 cursor-pointer active:scale-95"
            >
              Get Started
            </button>
          </Link>

          <button
            type="button"
            onClick={() => setActiveTab(activeTab === "dashboard" ? "simulator" : "dashboard")}
            className="rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/15 text-sm font-medium px-7 py-3 backdrop-blur-xl transition-all duration-300 cursor-pointer flex items-center gap-2 active:scale-95 shadow-glass-sm"
          >
            <span>{activeTab === "dashboard" ? "Watch Demo" : "View Dashboard"}</span>
          </button>

          <button
            type="button"
            onClick={() => setDownloadModalOpen(true)}
            className="rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-200 border border-rose-400/30 hover:border-rose-400/60 text-sm font-semibold px-6 py-3 backdrop-blur-xl transition-all duration-300 cursor-pointer flex items-center gap-2 active:scale-95 shadow-[0_0_20px_rgba(251,113,133,0.15)]"
          >
            <Download className="w-4 h-4 text-rose-400" />
            <span>Download Desktop App (.exe)</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 3. PRODUCT MOCKUP / DASHBOARD CARD (From Reference Design)                */}
        {/* ========================================================================= */}
        <div className="max-w-5xl mx-auto relative">
          {/* Cyan Horizon Aura Reflection beneath the top edge of the card */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[70%] h-20 bg-rose-400/[0.22] blur-3xl rounded-full pointer-events-none" />

          {/* Window Container */}
          <div className="rounded-2xl sm:rounded-3xl bg-[#080D1A]/90 border border-white/15 shadow-[0_20px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(251,113,133,0.12)] backdrop-blur-2xl overflow-hidden text-left relative">
            {/* Window Top Navigation Bar */}
            <div className="px-4 sm:px-6 py-3.5 bg-black/40 border-b border-white/10 flex items-center justify-between gap-3 text-xs">
              {/* Left Brand Mark & Breadcrumbs */}
              <div className="flex items-center gap-3 sm:gap-6 min-w-0">
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="relative flex items-center justify-center">
                    <svg className="w-4 h-4 text-rose-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                    </svg>
                    <svg className="w-2 h-2 text-white fill-current absolute -top-0.5 -right-0.5" viewBox="0 0 24 24">
                      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                    </svg>
                  </div>
                  <span className="font-bold tracking-wider text-white text-xs uppercase hidden sm:inline">
                    GLIDEO
                  </span>
                </div>

                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono truncate">
                  <span>Dashboards</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-rose-300 font-medium truncate">Default Studio</span>
                </div>
              </div>

              {/* Right: Search Box, Mode Switch & Utility Icons */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Search Pill */}
                <div className="hidden sm:flex items-center gap-2 bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-full text-slate-400 text-xs w-44">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[11px]">Search (/)</span>
                </div>

                {/* Simulator Mode Toggle */}
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === "dashboard" ? "simulator" : "dashboard")}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    activeTab === "simulator"
                      ? "bg-rose-500/20 text-rose-200 border-rose-400/40"
                      : "bg-white/[0.04] text-slate-300 border-white/10 hover:text-white"
                  }`}
                >
                  {activeTab === "simulator" ? "Simulator ON" : "Test Engine"}
                </button>

                <div className="w-7 h-7 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-300">
                  <Sun className="w-3.5 h-3.5 text-slate-300" />
                </div>
              </div>
            </div>

            {/* Window Body: Either Simulated Engine Canvas or Modern Dark Dashboard View */}
            {activeTab === "simulator" ? (
              <div className="relative aspect-[16/9] w-full bg-[#070B16] cursor-crosshair">
                <canvas
                  ref={canvasRef}
                  width={960}
                  height={540}
                  className="w-full h-full object-contain block"
                  onClick={(e) => {
                    const canvas = canvasRef.current;
                    if (!canvas) return;
                    const rect = canvas.getBoundingClientRect();
                    const clickX = (e.clientX - rect.left) / rect.width;
                    const clickY = (e.clientY - rect.top) / rect.height;
                    setZoomTarget({
                      x: Math.max(0.15, Math.min(0.85, clickX)),
                      y: Math.max(0.15, Math.min(0.85, clickY)),
                      label: `Point (${Math.round(clickX * 100)}%, ${Math.round(clickY * 100)}%)`,
                    });
                    setIsZoomed(true);
                  }}
                />
                <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-xs text-slate-200">
                  <MousePointer2 className="w-3 h-3 text-rose-400" />
                  <span>Click anywhere on canvas to pan zoom focal target</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-12 min-h-[360px] sm:min-h-[420px] text-xs">
                {/* Left Sidebar inside Mockup */}
                <div className="hidden md:block col-span-3 border-r border-white/10 bg-white/[0.01] p-4 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 px-2 block">
                      Favorites
                    </span>
                    <div className="space-y-0.5 text-slate-300">
                      <div className="px-2.5 py-1.5 rounded-lg bg-rose-500/15 text-rose-200 font-medium flex items-center gap-2 border border-rose-400/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        <span>Overview</span>
                      </div>
                      <div className="px-2.5 py-1.5 rounded-lg hover:bg-white/[0.04] text-slate-400 hover:text-slate-200 flex items-center gap-2 cursor-pointer">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                        <span>Projects</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 px-2 block">
                      Dashboards
                    </span>
                    <div className="space-y-0.5 text-slate-400">
                      <div className="px-2.5 py-1.5 rounded-lg hover:bg-white/[0.04] hover:text-slate-200 cursor-pointer">
                        Default Studio
                      </div>
                      <div className="px-2.5 py-1.5 rounded-lg hover:bg-white/[0.04] hover:text-slate-200 cursor-pointer">
                        Analytics View
                      </div>
                      <div className="px-2.5 py-1.5 rounded-lg hover:bg-white/[0.04] hover:text-slate-200 cursor-pointer">
                        E-commerce Demos
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center Content: Order List / Video Tracks */}
                <div className="col-span-12 md:col-span-6 p-4 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-sm">Order List</span>
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <span className="bg-white/[0.04] border border-white/10 px-2.5 py-1 rounded-md">
                        Filter
                      </span>
                    </div>
                  </div>

                  {/* Mock Table Rows */}
                  <div className="space-y-2">
                    {[
                      { id: "#CM9801", user: "Natali Craig", project: "Landing Page", date: "Just now", status: "In Progress", color: "text-rose-400 bg-rose-500/10 border-rose-400/20" },
                      { id: "#CM9802", user: "Kate Morrison", project: "CRM Admin", date: "A minute ago", status: "Complete", color: "text-emerald-400 bg-emerald-500/10 border-emerald-400/20" },
                      { id: "#CM9803", user: "Drew Cano", project: "Client Portal", date: "1 hour ago", status: "Pending", color: "text-amber-400 bg-amber-500/10 border-amber-400/20" },
                      { id: "#CM9804", user: "Orlando Diggs", project: "Video Keyframes", date: "Yesterday", status: "Complete", color: "text-emerald-400 bg-emerald-500/10 border-emerald-400/20" },
                    ].map((row) => (
                      <div
                        key={row.id}
                        className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 flex items-center justify-between text-xs transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-slate-400 text-[11px]">{row.id}</span>
                          <span className="text-white font-medium">{row.user}</span>
                        </div>
                        <span className="text-slate-400 hidden sm:inline">{row.project}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${row.color}`}>
                          {row.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Panel: Notifications & Activity */}
                <div className="hidden md:block col-span-3 border-l border-white/10 bg-white/[0.01] p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-xs">Notifications</span>
                    <Bell className="w-3.5 h-3.5 text-slate-400" />
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                      <div className="text-white font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        <span>You fixed a bug</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">Just now</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                      <div className="text-white font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>New user registered</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">59 minutes ago</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                      <div className="text-white font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        <span>Zoom keyframe rendered</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">12 hours ago</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <DownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
      />
    </section>
  );
}
