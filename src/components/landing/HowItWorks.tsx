"use client";

import { Upload, Focus, Download, ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/Button";

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: Upload,
      title: "Drop or Record Video",
      description:
        "Import any MP4 or WebM screen capture. Or immediately test out the editor with our built-in 1-click synthetic demo recording.",
    },
    {
      step: "02",
      icon: Focus,
      title: "Mark or Auto-Zoom Clicks",
      description:
        "Click directly on the canvas to add instant zoom targets at that timestamp. Adjust zoom factor, easing curve, and frame padding in real time.",
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
    <section id="how-it-works" className="py-20 lg:py-24 relative border-t border-white/[0.08]">
      {/* Subtle atmospheric ambient light */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[400px] bg-indigo-500/[0.05] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="glass-badge text-sky-300 border-sky-400/20 bg-sky-500/10">
            Pipeline Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            From raw screen recording to export in under 60 seconds.
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Eliminate hours of manual keyframing in heavy video editing suites.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative rounded-2xl p-7 glass-panel-interactive flex flex-col justify-between group overflow-hidden"
              >
                {/* Subtle top specular accent */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-bold text-sky-400">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.12] shadow-glass-sm flex items-center justify-center text-sky-300 group-hover:scale-105 group-hover:border-sky-400/40 transition-all duration-200">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-white group-hover:text-sky-200 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA bar */}
        <div className="mt-14 text-center">
          <Link href="/editor">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Launch Web Studio Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
