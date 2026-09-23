"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function FinalCtaSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 lg:py-28 bg-[#F8F9FB] border-t border-[#E5E7EB] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#17191F] p-8 sm:p-12 lg:p-16 text-white text-center relative overflow-hidden shadow-xl border border-white/10">
          {/* Subtle Orange Glow Ambient Backdrop */}
          <div className="absolute top-0 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#FF6B2C]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold uppercase tracking-wider text-[#FF8A4C]">
              <span>{t.cta.badge}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {t.cta.title}
            </h2>

            <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              {t.cta.subtitle}
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/editor"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#FF6B2C] px-8 py-4 text-sm font-bold text-white shadow-md transition-all hover:bg-[#E85A1F] hover:shadow-[0_8px_25px_rgba(255,107,44,0.35)] active:scale-95"
              >
                <span>{t.cta.getStarted}</span>
                <ArrowRight size={16} />
              </Link>

              <a
                href="https://github.com/ericva01/focuZoom"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 px-8 py-4 text-sm font-bold text-white transition-all active:scale-95"
              >
                <span>{t.cta.starGithub}</span>
              </a>
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#FF6B2C]" /> {t.cta.badges.free}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#FF6B2C]" /> {t.cta.badges.browser}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#FF6B2C]" /> {t.cta.badges.local}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
