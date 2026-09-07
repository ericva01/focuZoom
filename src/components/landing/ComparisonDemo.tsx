"use client";

import { useState } from "react";
import { SlidersHorizontal, Check, X } from "lucide-react";

export function ComparisonDemo() {
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  return (
    <section className="py-20 relative overflow-hidden border-t border-white/[0.08]">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-sky-500/[0.06] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="glass-badge text-sky-300 border-sky-400/20 bg-sky-500/10">
            Visual Comparison
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            See the transformation in real time.
          </h2>
          <p className="text-slate-300 text-sm">
            Drag the slider to compare raw unedited screen captures against FocuFlow&apos;s auto-zoomed studio output.
          </p>
        </div>

        {/* Interactive Comparison Container */}
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden glass-panel-elevated border-white/[0.15] aspect-[16/9] select-none">
            {/* 1. Behind / Full: Cinematic Version */}
            <div className="absolute inset-0 bg-[#090D16]/90 p-6 sm:p-10 flex items-center justify-center">
              <div className="w-full h-full rounded-xl bg-white/[0.04] border border-white/[0.12] shadow-glass-inner backdrop-blur-md p-6 relative overflow-hidden flex flex-col justify-center items-center text-center">
                {/* Visual elements of zoomed cinematic state */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80 shadow-[0_0_8px_rgba(251,113,133,0.5)]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                  <span className="text-xs font-mono text-slate-300 ml-2">FocuFlow Studio (Zoomed & Framed)</span>
                </div>

                <div className="scale-125 transition-transform duration-300 space-y-2.5">
                  <div className="px-4 py-2 rounded-lg bg-sky-500/20 text-sky-200 font-medium text-xs border border-sky-400/30 shadow-glass-sm backdrop-blur-md inline-flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <span>Click Target: Auto-Zoom 2.2x</span>
                  </div>
                  <p className="text-xs text-sky-300/80 font-mono">
                    Smooth Easing Pan · Technical Ripple Active
                  </p>
                </div>

                {/* Animated Ripple Mock */}
                <div className="absolute w-28 h-28 rounded-full border border-sky-400/40 animate-ping pointer-events-none" />
                <div className="absolute w-14 h-14 rounded-full bg-sky-500/15 border border-sky-400/50 backdrop-blur-sm pointer-events-none" />
              </div>
            </div>

            {/* 2. Overlaid / Clipped: Raw Standard Version */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden bg-[#0D121F] border-r border-sky-400/80 shadow-[0_0_15px_rgba(56,189,248,0.4)]"
              style={{ width: `${sliderPosition}%` }}
            >
              <div className="w-[896px] h-full p-4 sm:p-8 flex items-center justify-center bg-[#090D16]/95">
                <div className="w-full h-full border border-white/[0.08] rounded-xl p-4 bg-white/[0.02] flex flex-col justify-center items-center text-center space-y-2 opacity-60">
                  <div className="text-xs font-mono text-slate-400">Standard Raw Recording (Flat, Tiny Text)</div>
                  <div className="text-xs text-slate-400 max-w-sm">
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
              <div className="w-7 h-7 rounded-full bg-white/90 text-[#090D16] shadow-glass-md border border-white flex items-center justify-center font-bold text-xs backdrop-blur-md">
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
              <span className="px-3 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-black/40 text-slate-300 border border-white/10 backdrop-blur-md shadow-glass-sm">
                Before: Flat Raw Capture
              </span>
            </div>

            <div className="absolute top-4 right-4 z-10 pointer-events-none">
              <span className="px-3 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-sky-950/50 text-sky-200 border border-sky-400/20 backdrop-blur-md shadow-glass-sm">
                After: Cinematic Auto-Zoom
              </span>
            </div>
          </div>

          {/* Bottom comparison checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="p-5 rounded-xl glass-panel space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-medium text-xs">
                <X className="w-4 h-4" />
                <span>Traditional Screen Recordings</span>
              </div>
              <ul className="text-xs text-slate-400 space-y-1.5 pl-5 list-disc">
                <li>Viewers miss subtle button clicks and terminal commands.</li>
                <li>Requires hours in video software to manually keyframe pans.</li>
                <li>Default OS borders with distracting clutter.</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl glass-panel-elevated border-sky-500/20 space-y-2">
              <div className="flex items-center gap-2 text-sky-300 font-medium text-xs">
                <Check className="w-4 h-4 text-sky-400" />
                <span>With FocuFlow Studio</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 pl-5 list-disc">
                <li>Automatic zoom jumps directly into active focal points.</li>
                <li>Spring physics smoothing provides fluid camera motion.</li>
                <li>Configurable stage padding and glass background styling.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
