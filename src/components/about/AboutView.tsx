"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Copy,
  Check,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function AboutView() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("ericva014@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-24 lg:space-y-36 select-none relative">
      {/* Huge Background Outline Watermark (Opticore Style) */}
      <div className="absolute -top-16 right-0 text-7xl sm:text-9xl lg:text-[14rem] font-extrabold tracking-widest text-white/[0.03] font-mono select-none pointer-events-none uppercase">
        ABOUT
      </div>

      {/* ========================================================================= */}
      {/* 1. HERO ABOUT SECTION (3D Liquid Silk on Left, Story on Right)            */}
      {/* ========================================================================= */}
      <section className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left: 3D Iridescent Purple Fluid Swirl Asset */}
        <div className="lg:col-span-6 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-700/25 via-rose-500/20 to-transparent rounded-full blur-[120px] pointer-events-none" />

          <div className="relative w-full max-w-[480px] aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(168,85,247,0.2)] group backdrop-blur-2xl">
            <Image
              src="/liquid-purple.jpg"
              alt="Glideo Liquid Fluid Sculpture"
              fill
              priority
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-4 left-4 p-3 rounded-2xl bg-black/60 border border-white/15 backdrop-blur-xl flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="text-xs font-mono text-white">VISION & CRAFT // ERIC VA</span>
            </div>
          </div>
        </div>

        {/* Right: Compelling Narrative (Opticore Style) */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-rose-300">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>THE STORY & PHILOSOPHY</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            Providing screen video intelligence tailored to creators worldwide.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Most screen recording tools either capture lifeless flat footage or force you into bloated desktop suites with tedious keyframe workflows. Glideo was engineered to eliminate this barrier through autonomous camera choreography.
          </p>

          <p className="text-slate-400 text-sm leading-relaxed">
            Every cubic spline pan, spring easing bounce, and bezel shadow is calculated dynamically on your device using hardware-accelerated WebGL—delivering cinematic quality at the speed of thought.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link href="/editor">
              <button
                type="button"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white text-black text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer shadow-md active:scale-95"
              >
                <span>Launch Web Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-rose-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? "Copied" : "ericva014@gmail.com"}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
