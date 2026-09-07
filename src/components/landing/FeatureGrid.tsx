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
        headline: "Intelligent Focal Point Centering",
        detail: "Clamps camera viewport to avoid letterboxing while maintaining 60 FPS fluidity.",
      },
    },
    {
      icon: MousePointer,
      tag: "Motion Physics",
      title: "Dynamic Cursor Effects",
      description:
        "Replace clunky system cursors with sleek technical pointers. Enjoy responsive spring-physics tracking and expanding wave ripples on every recorded click.",
      preview: {
        headline: "Micro-Interaction Ripple Waves",
        detail: "Custom ripple colors, concentric pulse rings, and sub-pixel coordinate mapping.",
      },
    },
    {
      icon: ShieldCheck,
      tag: "100% Client-Side",
      title: "Zero Cloud Uploads",
      description:
        "Your proprietary code, credentials, and screen recordings never touch an external server. Everything processes locally inside your browser using Canvas & WebCodecs.",
      preview: {
        headline: "Complete Enterprise Privacy",
        detail: "Zero latency file transfers, no cloud subscription limits, and zero telemetry.",
      },
    },
    {
      icon: Palette,
      tag: "Studio Aesthetics",
      title: "Canvas Stage & Transparency",
      description:
        "Transform raw recordings into polished demos with customizable padding, corner radius, solid background colors, or export with complete alpha transparency.",
      preview: {
        headline: "Solid & Transparent Framing",
        detail: "Seamlessly drop into video production pipelines with clean alpha export.",
      },
    },
    {
      icon: Sliders,
      tag: "Timeline Control",
      title: "Interactive Timeline Scrubber",
      description:
        "Pinpoint exact timestamps down to milliseconds. Click anywhere on the timeline to inspect keyframes, adjust zoom scales, or modify transition durations.",
      preview: {
        headline: "Visual Event Marker Pins",
        detail: "Hop directly between zoom intervals with instant visual preview feedback.",
      },
    },
    {
      icon: Zap,
      tag: "Export Engine",
      title: "Instant In-Browser Video Export",
      description:
        "Export your cinematic screen recording in high-bitrate WebM format directly to your device with a single click. No rendering queues or server bottlenecks.",
      preview: {
        headline: "Lossless Stream Capture",
        detail: "Harness native browser MediaRecorder capabilities for immediate downloads.",
      },
    },
  ];

  return (
    <section id="features" className="py-20 lg:py-28 relative border-t border-white/[0.08] bg-[#090D16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3.5">
          <h2 className="text-xs uppercase font-mono font-medium tracking-widest text-sky-400">
            Engine Specifications
          </h2>
          <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Engineered for high-impact product demos and tutorials.
          </p>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Every feature is crafted to remove tedious video editing work so you can generate captivating screen recordings in seconds.
          </p>
        </div>

        {/* Feature Cards Grid in Floating Frosted Glass Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="glass-panel-interactive rounded-2xl p-6 flex flex-col justify-between relative group"
              >
                {/* Top inner specular shine */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.08] border border-white/15 flex items-center justify-center text-sky-400 shadow-glass-inner group-hover:border-sky-400/40 group-hover:bg-white/[0.12] transition-all">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-medium uppercase px-2.5 py-0.5 rounded-lg bg-white/[0.06] text-sky-300 border border-white/10 shadow-glass-inner">
                      {f.tag}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-white group-hover:text-sky-300 transition-colors">
                      {f.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                </div>

                {/* Micro preview well */}
                <div className="mt-6 pt-4 border-t border-white/[0.08]">
                  <div className="p-3 rounded-xl bg-black/25 backdrop-blur-md border border-white/10 text-xs shadow-glass-inner">
                    <div className="flex items-center gap-2 font-medium text-slate-200 mb-0.5">
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
