"use client";

import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export function RecordingWorkflow() {
  const steps = [
    {
      step: "01",
      title: "One-Click Capture",
      tag: "INPUT",
      description:
        "Capture your display, browser window, or webcam in crisp 4K 60 FPS. Zero third-party extensions or heavyweight desktop installers required.",
      features: ["Native WebCodecs pipeline", "Zero-latency audio capture", "System audio isolation"],
    },
    {
      step: "02",
      title: "Automated Camera Zooms & Framing",
      tag: "PROCESS",
      description:
        "Our engine automatically detects cursor clicks, inputs, and code edits, smoothly guiding the camera focal point without abrupt cuts.",
      features: ["Catmull-Rom spline curves", "Configurable zoom scale (1.5x–3.0x)", "3D perspective slant & bezels"],
    },
    {
      step: "03",
      title: "Instant 60 FPS Share",
      tag: "OUTPUT",
      description:
        "Generate private shareable links with customizable access controls, or export lossless MP4/WebM files rendered entirely on your local GPU.",
      features: ["Zero cloud upload wait", "Password & domain lock", "Instant Slack & Notion embeds"],
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#F8F9FB] border-t border-[#E5E7EB] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/20 text-xs font-bold uppercase tracking-wider text-[#FF6B2C]">
            <Zap size={14} />
            <span>Smooth Pipeline</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111318]">
            From raw screen recording to export in seconds.
          </h2>
          <p className="text-[#667085] text-base sm:text-lg leading-relaxed">
            Eliminate complex timelines, manual keyframing, and video rendering delays with an automated 3-step workflow.
          </p>
        </div>

        {/* 3-Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item) => (
            <div
              key={item.step}
              className="rounded-2xl sm:rounded-3xl p-8 bg-white border border-[#E5E7EB] shadow-sm flex flex-col justify-between hover:shadow-md hover:border-[#FF6B2C]/50 transition-all duration-200 group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-4xl font-extrabold text-[#111318] group-hover:text-[#FF6B2C] transition-colors">
                    {item.step}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md bg-[#FFF1E8] text-[#FF6B2C]">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#111318] mb-3">
                  {item.title}
                </h3>
                <p className="text-[#667085] text-sm leading-relaxed mb-6">
                  {item.description}
                </p>

                <div className="space-y-2.5 pt-4 border-t border-[#E5E7EB]">
                  {item.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-medium text-[#111318]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2C]" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <Link
                  href="/editor"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#111318] group-hover:text-[#FF6B2C] transition-colors"
                >
                  <span>Launch in Studio</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
