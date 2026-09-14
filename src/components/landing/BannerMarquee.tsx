"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";

export function BannerMarquee() {
  const techLogos = [
    { name: "WebCodecs", category: "Hardware Decode" },
    { name: "Three.js", category: "3D Perspective" },
    { name: "WebGL 2.0", category: "GPU Acceleration" },
    { name: "Tailwind CSS", category: "Modern UI" },
    { name: "Tauri Rust", category: "Native Core" },
    { name: "MediaRecorder", category: "Lossless Stream" },
  ];

  return (
    <section className="relative bg-[#030509] overflow-hidden select-none border-t border-white/[0.06] py-20 lg:py-28">
      {/* 3D Flow Banner Image Backdrop */}
      <div className="relative w-full h-64 sm:h-80 lg:h-96 overflow-hidden">
        <Image
          src="/liquid-banner.jpg"
          alt="Luminous 3D Fluid Stream"
          fill
          priority
          className="object-cover object-center opacity-85 brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030509] via-transparent to-[#030509]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030509] via-transparent to-[#030509]" />

        {/* Center Luminous Headline overlaying the 3D wave */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/60 border border-white/15 backdrop-blur-xl text-xs font-mono text-rose-300 mb-4 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>UNCOMPROMISING PRECISION</span>
          </div>
          <h2 className="text-3xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)] max-w-5xl">
            Where Precision Meets Cinema
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-300 max-w-xl drop-shadow-md">
            The studio camera movement you always wished existed in screen recorders, crafted natively for your browser.
          </p>
        </div>
      </div>

      {/* Tech Stack / Capability Badges Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {techLogos.map((tech, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#080c18]/80 hover:bg-[#0f1629] border border-white/[0.08] hover:border-purple-400/40 backdrop-blur-xl transition-all duration-300 text-center group cursor-default shadow-sm hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]"
            >
              <div className="text-sm font-semibold text-white group-hover:text-purple-200 transition-colors">
                {tech.name}
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-1">
                {tech.category}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
