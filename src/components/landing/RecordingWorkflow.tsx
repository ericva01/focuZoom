"use client";

import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export function RecordingWorkflow() {
  const { t } = useLanguage();

  const steps = [
    {
      step: "01",
      title: t.workflow.steps.step1.title,
      tag: "INPUT",
      description: t.workflow.steps.step1.desc,
      features: ["Native WebCodecs pipeline", "Zero-latency audio capture", "System audio isolation"],
    },
    {
      step: "02",
      title: t.workflow.steps.step2.title,
      tag: "PROCESS",
      description: t.workflow.steps.step2.desc,
      features: ["Catmull-Rom spline curves", "Configurable zoom scale (1.5x–3.0x)", "3D perspective slant & bezels"],
    },
    {
      step: "03",
      title: t.workflow.steps.step3.title,
      tag: "OUTPUT",
      description: t.workflow.steps.step3.desc,
      features: ["Zero cloud upload wait", "Password & domain lock", "Instant lossless export"],
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#F8F9FB] border-t border-[#E5E7EB] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/20 text-xs font-bold uppercase tracking-wider text-[#FF6B2C]">
            <Zap size={14} />
            <span>{t.workflow.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111318]">
            {t.workflow.title}
          </h2>
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
