"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Download, Shield, Cpu } from "lucide-react";
import { DownloadModal } from "@/components/common/DownloadModal";

export function HeroSection() {
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden bg-[#030509] text-white select-none pt-12 pb-20">
      {/* Background Volumetric Glows */}
      <div className="absolute top-10 left-1/4 w-[600px] h-[500px] bg-purple-600/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[450px] bg-rose-500/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute -top-24 right-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Decorative Watermark & Coordinates */}
      <div className="absolute top-12 left-8 text-[10px] font-mono tracking-widest text-slate-600 hidden lg:block">
        SYS.V2.4 // LAT.00.4192 // LON.104.912
      </div>
      <div className="absolute top-12 right-8 text-[10px] font-mono tracking-widest text-slate-600 hidden lg:block">
        GLIDEO CORE // ZERO-CLOUD
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Bold Futuristic Typography & Actions (Opticore Style) */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Tag / Status */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl text-xs font-mono text-rose-300 shadow-[0_0_20px_rgba(251,113,133,0.15)]">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
              <span>NEXT-GEN SCREEN CINEMATOGRAPHY</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <div className="text-xs sm:text-sm font-mono tracking-widest text-slate-400 uppercase">
                WE ARE
              </div>
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-white uppercase leading-[0.95] drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] font-sans">
                GLIDEO<span className="text-rose-400">.</span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Transform standard screen recordings into hypnotic, studio-grade product demos with dynamic auto-zoom, critically damped spring physics, and sleek 3D perspective framing.
            </p>

            {/* Pill Action Button Group (Matching Reference Design) */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/editor">
                <button
                  type="button"
                  className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-white text-black font-bold text-sm shadow-[0_0_35px_rgba(255,255,255,0.35)] hover:bg-slate-100 hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] transition-all duration-300 cursor-pointer active:scale-95"
                >
                  <span>Launch Web Studio</span>
                  <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              </Link>

              <button
                type="button"
                onClick={() => setDownloadModalOpen(true)}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/15 text-sm font-medium backdrop-blur-xl transition-all duration-300 cursor-pointer active:scale-95 shadow-glass-sm hover:border-purple-400/50"
              >
                <Download className="w-4 h-4 text-purple-400" />
                <span>Desktop App (.exe)</span>
              </button>
            </div>

            {/* Key Micro Metrics / Badges */}
            <div className="pt-6 border-t border-white/[0.08] flex items-center gap-8 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>100% In-Browser Privacy</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>WebGL 60 FPS GPU</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Iridescent Liquid Ribbon Floating Asset */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Ambient Radial Spotlight behind 3D Sculpture */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 via-rose-500/20 to-cyan-400/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative w-[320px] sm:w-[420px] lg:w-[480px] aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(168,85,247,0.25)] backdrop-blur-2xl group transition-transform duration-700 hover:scale-[1.02]">
              <Image
                src="/liquid-hero.jpg"
                alt="Glideo 3D Iridescent Fluid Sculpture"
                fill
                priority
                className="object-cover object-center transition-all duration-700 group-hover:scale-105"
              />

              {/* High-tech overlay badges */}
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-black/60 border border-white/15 backdrop-blur-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />
                  <span className="text-xs font-mono text-white">AUTONOMOUS FOV v2.4</span>
                </div>
                <span className="text-[10px] font-mono text-purple-300">GPU RENDER</span>
              </div>
            </div>
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
