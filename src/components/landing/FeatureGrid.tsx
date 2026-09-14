"use client";

import {
  Maximize2,
  MousePointer,
  ShieldCheck,
  Palette,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export function FeatureGrid() {
  const services = [
    {
      icon: Maximize2,
      tag: "AUTOMATION",
      title: "Dynamic Auto-Zoom",
      description:
        "Effortlessly guide your viewer's gaze. Our engine detects clicks and code changes, smoothly gliding camera zooms directly into buttons with zero manual keyframing.",
      category: "Dolly-In Scale",
    },
    {
      icon: MousePointer,
      tag: "PHYSICS",
      title: "Spring Cursor Followers",
      description:
        "Replace clunky OS pointers with sleek studio arrows. Enjoy critically damped spring smoothing, expanding neon ripple waves, and sub-pixel coordinates.",
      category: "Motion Engine",
    },
    {
      icon: Palette,
      tag: "ESTHETICS",
      title: "3D Stage & Backgrounds",
      description:
        "Elevate raw screencasts with beveled device chassis, cinematic drop shadows, customizable stage padding, and mesh backdrop gradient presets.",
      category: "Perspective",
    },
    {
      icon: ShieldCheck,
      tag: "SECURITY",
      title: "Zero-Cloud Client Privacy",
      description:
        "Your proprietary code, credentials, and screen recordings never touch an external server. Everything executes locally inside your browser via WebCodecs.",
      category: "Hardware Decode",
    },
  ];

  return (
    <section id="features" className="py-24 lg:py-32 relative bg-[#030509] text-white overflow-hidden select-none border-t border-white/[0.06]">
      {/* Background Subtle Glows */}
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[400px] bg-rose-600/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Outline Watermark (Opticore Style) */}
        <div className="relative mb-16 sm:mb-20">
          <div className="text-[11px] font-mono tracking-widest text-slate-400 uppercase mb-3">
            CAPABILITIES
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-xl">
              Elevate Your Screencasts With Tailored Video Solutions
            </h2>

            {/* Outlined Watermark Text */}
            <div className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-wider text-white/[0.04] font-mono select-none pointer-events-none uppercase">
              SERVICES
            </div>
          </div>
        </div>

        {/* 4 Cards Grid (Opticore Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-3xl p-6 sm:p-7 bg-[#080c18]/80 hover:bg-[#0f1629] border border-white/[0.08] hover:border-purple-500/40 backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_45px_rgba(147,51,234,0.15)]"
              >
                <div>
                  {/* Top Icon Emblem */}
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-purple-400 group-hover:text-rose-400 group-hover:border-rose-400/30 transition-all mb-6">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="text-[10px] font-mono text-purple-400 uppercase tracking-wider mb-1">
                    {item.tag}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Pill CTA Button */}
                <div className="pt-8">
                  <Link href="/editor">
                    <button
                      type="button"
                      className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-full bg-white/[0.04] group-hover:bg-white text-slate-300 group-hover:text-black text-xs font-semibold border border-white/10 group-hover:border-white transition-all cursor-pointer"
                    >
                      <span>Explore Feature</span>
                      <div className="w-6 h-6 rounded-full bg-white/[0.08] group-hover:bg-black text-white flex items-center justify-center transition-colors">
                        <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-white" />
                      </div>
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
