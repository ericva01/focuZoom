"use client";

import { ShieldCheck, Lock, KeyRound, ServerOff, FileCheck, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function SecuritySection() {
  const { t } = useLanguage();

  const securityItems = [
    {
      id: "zero-cloud",
      icon: ServerOff,
      title: t.security.pillars.p1.title,
      desc: t.security.pillars.p1.desc,
    },
    {
      id: "offline-capable",
      icon: Lock,
      title: t.security.pillars.p2.title,
      desc: t.security.pillars.p2.desc,
    },
    {
      id: "hardware-accelerated",
      icon: KeyRound,
      title: t.security.pillars.p3.title,
      desc: t.security.pillars.p3.desc,
    },
    {
      id: "transparent-auditable",
      icon: FileCheck,
      title: t.security.pillars.p4.title,
      desc: t.security.pillars.p4.desc,
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#17191F] text-white select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold uppercase tracking-wider text-[#FF8A4C]">
            <ShieldCheck size={14} />
            <span>{t.security.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            {t.security.title}
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            {t.security.subtitle}
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {securityItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="p-8 rounded-2xl sm:rounded-3xl bg-[#0F1116] border border-white/10 shadow-sm hover:border-[#FF6B2C]/50 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FF6B2C]/20 border border-[#FF6B2C]/30 text-[#FF8A4C] flex items-center justify-center mb-6">
                  <Icon size={22} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Trust badges footer */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-8 text-xs font-semibold text-slate-400">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#FF6B2C]" /> 100% Local Device Storage
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#FF6B2C]" /> Permissive MIT License
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#FF6B2C]" /> Zero Telemetry or Analytics
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#FF6B2C]" /> Hardware Accelerated WebCodecs
          </span>
        </div>
      </div>
    </section>
  );
}
