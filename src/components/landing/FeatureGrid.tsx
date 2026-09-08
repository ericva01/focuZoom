"use client";

import {
  Maximize2,
  MousePointer,
  ShieldCheck,
  Palette,
  Sliders,
  Zap,
} from "lucide-react";

export function FeatureGrid() {
  const features = [
    {
      icon: Maximize2,
      tag: "Signature Engine",
      title: "Automatic Click-to-Zoom",
      description:
        "Effortlessly guide your viewer's focus. Our engine smoothly animates cubic and spring easing pans directly into every button click or code edit without manual keyframing.",
      preview: {
        headline: "Intelligent Focal Centering",
        detail: "Clamps camera viewport to avoid letterboxing while maintaining 60 FPS fluidity.",
      },
    },
    {
      icon: MousePointer,
      tag: "Motion Physics",
      title: "Dynamic Cursor Effects",
      description:
        "Replace clunky system cursors with sleek technical pointers. Enjoy responsive spring-physics tracking, quick show/hide toggling, and expanding wave ripples on every click.",
      preview: {
        headline: "Micro-Interaction Ripple Waves",
        detail: "Concentric pulse rings, customizable cursor styles, and sub-pixel coordinate mapping.",
      },
    },
    {
      icon: ShieldCheck,
      tag: "100% Client-Side",
      title: "Zero Cloud Uploads",
      description:
        "Your proprietary code, credentials, and screen recordings never touch an external server. Everything processes locally inside your browser using WebCodecs & WebGL.",
      preview: {
        headline: "Complete Enterprise Privacy",
        detail: "Zero latency file transfers, no cloud subscription limits, and zero telemetry.",
      },
    },
    {
      icon: Palette,
      tag: "Studio Aesthetics",
      title: "3D Stage & Background Framing",
      description:
        "Transform raw recordings into polished demos with customizable stage inset, corner radius, 3D cinematic slant, and export with complete alpha transparency.",
      preview: {
        headline: "Solid & Transparent Framing",
        detail: "Seamlessly drop into video production pipelines with clean alpha export.",
      },
    },
    {
      icon: Sliders,
      tag: "Multi-Track Timeline",
      title: "Interactive Timeline Workspace",
      description:
        "Pinpoint exact timestamps down to milliseconds. Drag keyframe pins horizontally along tracks, adjust Dolly-in speed, hold durations, and trim clips with live playhead sync.",
      preview: {
        headline: "Draggable Keyframe Markers",
        detail: "Shift timestamps directly on the timeline with snapping and live visual feedback.",
      },
    },
    {
      icon: Zap,
      tag: "Export Engine",
      title: "Instant In-Browser Video Export",
      description:
        "Export your cinematic screen recording in high-bitrate WebM or MP4 format directly to your device with a single click. No rendering queues or server bottlenecks.",
      preview: {
        headline: "Lossless Stream Capture",
        detail: "Harness native browser MediaRecorder capabilities for immediate downloads.",
      },
    },
  ];

  return (
    <section id="features" className="py-24 lg:py-32 relative bg-[#060913] text-white overflow-hidden border-t border-white/[0.08] select-none">
      {/* Ambient background celestial lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-sky-500/[0.05] rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-18 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md text-xs font-medium text-sky-200">
            <svg className="w-3.5 h-3.5 text-sky-400 fill-current" viewBox="0 0 24 24">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
            <span>Core Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Engineered for high-impact <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-blue-200 to-indigo-100">
              developer demos & tutorials.
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Every feature is crafted to eliminate tedious keyframing so you can generate captivating,
            professionally framed screen recordings in seconds.
          </p>
        </div>

        {/* Feature Cards Grid in Dark Glass Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-2xl sm:rounded-3xl p-6 sm:p-7 bg-[#080D1A]/70 border border-white/10 hover:border-sky-400/40 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_35px_rgba(56,189,248,0.12)] flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Specular top border light */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-sky-400/60 transition-colors pointer-events-none" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-sky-400 group-hover:bg-sky-500/20 group-hover:border-sky-400/40 transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-white/[0.04] text-slate-300 border border-white/10 group-hover:border-sky-400/30 transition-colors">
                      {f.tag}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-white group-hover:text-sky-200 transition-colors">
                      {f.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                </div>

                {/* Sub-card feature well */}
                <div className="mt-6 pt-4 border-t border-white/[0.06]">
                  <div className="p-3 rounded-xl bg-black/30 border border-white/5 text-xs">
                    <div className="flex items-center gap-2 font-medium text-slate-200 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0" />
                      <span className="text-xs">{f.preview.headline}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">{f.preview.detail}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
