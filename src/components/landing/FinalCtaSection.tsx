"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles, Star } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function FinalCtaSection() {
  const { t } = useLanguage();

  return (
    <section className="w-full relative overflow-hidden bg-gradient-to-b from-[#141720] via-[#0E1017] to-[#080A0F] py-24 sm:py-32 border-t border-white/[0.08] select-none text-white">
      {/* Background Ambient Glows & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-[#FF6B2C]/20 via-[#FF8A4C]/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-24 right-10 w-96 h-96 bg-[#FF6B2C]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-[11px] font-bold uppercase tracking-widest text-[#FF8A4C] shadow-glass-sm backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#FF6B2C]" />
          <span>{t.cta.badge}</span>
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] max-w-4xl mx-auto">
          {t.cta.title}
        </h2>

        {/* Subtitle */}
        <p className="text-slate-300 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-normal">
          {t.cta.subtitle}
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/editor"
            className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#FF6B2C] to-[#FF8A4C] px-8 py-4 text-sm font-bold text-white shadow-[0_10px_35px_rgba(255,107,44,0.35)] transition-all hover:shadow-[0_15px_45px_rgba(255,107,44,0.5)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{t.cta.getStarted}</span>
            <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
          </Link>

          <a
            href="https://github.com/ericva01/focuZoom"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-white/15 bg-white/[0.06] hover:bg-white/[0.12] hover:border-white/25 px-8 py-4 text-sm font-bold text-white backdrop-blur-md transition-all active:scale-[0.98] shadow-glass-sm"
          >
            <Star size={17} className="text-amber-400 fill-amber-400/20" />
            <span>{t.cta.starGithub}</span>
          </a>
        </div>

        {/* Feature Checkmarks */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm text-slate-300 font-medium">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#FF6B2C] shrink-0" /> {t.cta.badges.free}
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#FF6B2C] shrink-0" /> {t.cta.badges.browser}
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#FF6B2C] shrink-0" /> {t.cta.badges.local}
          </span>
        </div>
      </div>
    </section>
  );
}

