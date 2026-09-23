"use client";

import { Upload, Focus, Download, ArrowRight, Cpu } from "lucide-react";
import Link from "next/link";

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: Upload,
      title: "Drop or Record Video",
      description:
        "Import any MP4 or WebM screen capture. Or immediately test the editor with our built-in 1-click synthetic demo recording.",
    },
    {
      step: "02",
      icon: Focus,
      title: "Mark or Auto-Zoom Clicks",
      description:
        "Click directly on the canvas to add instant zoom targets at that timestamp. Adjust Dolly-In speed, hold duration, and frame padding in real time.",
    },
    {
      step: "03",
      icon: Download,
      title: "Export in 60 FPS WebM",
      description:
        "Render the final video directly inside your browser. No server waiting queues, no subscriptions required, and zero cloud uploads.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 lg:py-32 relative bg-[#060913] text-white border-t border-white/[0.08] overflow-hidden select-none">
      {/* Subtle atmospheric ambient glow */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[400px] bg-[#FF6B2C]/[0.04] rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md text-xs font-medium text-[#FF8A4C]">
            <Cpu className="w-3.5 h-3.5 text-[#FF6B2C]" />
            <span>Pipeline Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            From raw screen recording to export <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A4C] via-blue-200 to-indigo-100">
              in under 60 seconds.
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Eliminate hours of manual keyframing in heavy video editing suites with a simple, three-step client-side pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative rounded-2xl sm:rounded-3xl p-7 bg-[#080D1A]/70 border border-white/10 hover:border-[#FF6B2C]/40 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_35px_rgba(255,107,44,0.12)] flex flex-col justify-between group overflow-hidden"
              >
                {/* Subtle top specular accent */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-[#FF6B2C]/60 transition-colors pointer-events-none" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A3D] to-orange-300">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#FF6B2C] group-hover:scale-105 group-hover:border-[#FF6B2C]/40 group-hover:bg-[#FF6B2C]/20 transition-all duration-300">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-white group-hover:text-[#FF8A4C] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA bar with white pill button */}
        <div className="mt-16 text-center">
          <Link href="/editor">
            <button
              type="button"
              className="rounded-full bg-white text-black text-sm font-semibold px-8 py-3.5 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:bg-slate-100 hover:shadow-[0_0_45px_rgba(255,255,255,0.45)] transition-all duration-300 cursor-pointer inline-flex items-center gap-2 active:scale-95"
            >
              <span>Launch Web Studio Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
