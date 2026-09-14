"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

export function ComparisonDemo() {
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  return (
    <section className="py-24 relative overflow-hidden bg-[#060913] text-white border-t border-white/[0.08] select-none">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-rose-500/[0.05] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md text-xs font-medium text-rose-200">
            <svg className="w-3.5 h-3.5 text-rose-400 fill-current" viewBox="0 0 24 24">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
            <span>Visual Comparison</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            See the transformation <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-blue-200 to-indigo-100">
              in real time.
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Drag the slider to compare raw unedited screen captures against Glideo&apos;s auto-zoomed studio output.
          </p>
        </div>

        {/* Interactive Comparison Container */}
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#080D1A]/90 border border-white/15 aspect-[16/9] shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(251,113,133,0.1)] backdrop-blur-2xl select-none">
            {/* 1. Behind / Full: Cinematic Version */}
            <div className="absolute inset-0 bg-[#080D1A] p-6 sm:p-10 flex items-center justify-center">
              <div className="w-full h-full rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md p-6 relative overflow-hidden flex flex-col justify-center items-center text-center">
                {/* Visual elements of zoomed state */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                  <span className="text-xs font-mono text-slate-300 ml-2">Glideo (Zoomed & Framed)</span>
                </div>

                <div className="scale-125 transition-transform duration-300 space-y-2.5">
                  <div className="px-4 py-2 rounded-full bg-rose-500/20 text-rose-200 font-medium text-xs border border-rose-400/30 shadow-[0_0_20px_rgba(251,113,133,0.2)] backdrop-blur-md inline-flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span>Click Target: Auto-Zoom 2.2x</span>
                  </div>
                  <p className="text-xs text-rose-300/80 font-mono">
                    Smooth Easing Pan · Technical Ripple Active
                  </p>
                </div>

                {/* Animated Ripple Mock */}
                <div className="absolute w-28 h-28 rounded-full border border-rose-400/40 animate-ping pointer-events-none" />
                <div className="absolute w-14 h-14 rounded-full bg-rose-500/15 border border-rose-400/50 backdrop-blur-sm pointer-events-none" />
              </div>
            </div>

            {/* 2. Overlaid / Clipped: Raw Standard Version */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden bg-[#060914] border-r border-rose-400/80 shadow-[0_0_20px_rgba(251,113,133,0.5)]"
              style={{ width: `${sliderPosition}%` }}
            >
              <div className="w-[896px] h-full p-4 sm:p-8 flex items-center justify-center bg-[#070A16]">
                <div className="w-full h-full border border-white/[0.08] rounded-2xl p-4 bg-white/[0.02] flex flex-col justify-center items-center text-center space-y-2 opacity-60">
                  <div className="text-xs font-mono text-slate-400">Standard Raw Recording (Flat, Tiny Text)</div>
                  <div className="text-xs text-slate-400 max-w-sm leading-relaxed">
                    No camera zoom. Viewers squint to see where your cursor clicked on high-resolution displays.
                  </div>
                  <div className="px-3 py-1 bg-white/[0.05] text-slate-300 text-xs rounded-md border border-white/[0.08]">
                    Tiny Unzoomed Button
                  </div>
                </div>
              </div>
            </div>

            {/* Slider Divider Bar Handle */}
            <div
              className="absolute inset-y-0 w-8 -ml-4 flex items-center justify-center cursor-ew-resize pointer-events-none z-20"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-7 h-7 rounded-full bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.5)] border border-white flex items-center justify-center font-bold text-xs backdrop-blur-md">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-900" />
              </div>
            </div>

            {/* Hidden Input for dragging */}
            <input
              type="range"
              min={5}
              max={95}
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize z-30 w-full h-full"
              aria-label="Comparison slider"
            />

            {/* Floating Labels */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
              <span className="px-3 py-1.5 rounded-full text-[11px] font-mono font-medium bg-black/60 text-slate-300 border border-white/10 backdrop-blur-md">
                Before: Flat Raw Capture
              </span>
            </div>

            <div className="absolute top-4 right-4 z-10 pointer-events-none">
              <span className="px-3 py-1.5 rounded-full text-[11px] font-mono font-medium bg-rose-500/20 text-rose-200 border border-rose-400/30 backdrop-blur-md shadow-[0_0_15px_rgba(251,113,133,0.3)]">
                After: Glideo
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
