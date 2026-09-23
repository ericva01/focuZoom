"use client";

import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { RecordingWorkflow } from "@/components/landing/RecordingWorkflow";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { ArrowRight, Focus, ShieldCheck, Sliders, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function ProductView() {
  const { t, localePath } = useLanguage();

  return (
    <div className="website-ui min-h-screen flex flex-col bg-[#F8F9FB] text-[#111318] selection:bg-[#FFF1E8] selection:text-[#FF6B2C]">
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-20 border-b border-[#E5E7EB] bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/20 text-xs font-semibold text-[#FF6B2C] mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2C]" />
                <span>{t.productPage.badge}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111318] leading-[1.15]">
                {t.productPage.titleMain} <span className="text-[#FF6B2C]">{t.productPage.titleHighlight}</span>.
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-[#667085] leading-relaxed">
                {t.productPage.description}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href={localePath("/editor")}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B2C] px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-[#E85A1F] transition-all"
                >
                  <span>{t.productPage.launchStudio}</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href={localePath("/features")}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-6 py-3.5 text-sm font-bold text-[#111318] hover:bg-[#F8F9FB] transition-all"
                >
                  <span>{t.productPage.exploreFeatures}</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Core Value Pillars */}
        <section className="py-20 border-b border-[#E5E7EB] bg-[#F8F9FB]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-[#111318]">
                {t.productPage.pillarsHeader.title}
              </h2>
              <p className="mt-3 text-sm text-[#667085]">
                {t.productPage.pillarsHeader.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Zoom Pillar */}
              <div className="rounded-3xl border border-[#E5E7EB] bg-white p-8 shadow-xs hover:border-[#FF6B2C]/40 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF1E8] text-[#FF6B2C] flex items-center justify-center mb-6">
                  <Focus size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#111318]">{t.productPage.pillars.zoom.title}</h3>
                <p className="mt-3 text-sm text-[#667085] leading-relaxed">
                  {t.productPage.pillars.zoom.desc}
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-[#111318] font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#FF6B2C] shrink-0" />
                    <span>{t.productPage.pillars.zoom.f1}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#FF6B2C] shrink-0" />
                    <span>{t.productPage.pillars.zoom.f2}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#FF6B2C] shrink-0" />
                    <span>{t.productPage.pillars.zoom.f3}</span>
                  </li>
                </ul>
              </div>

              {/* Privacy Pillar */}
              <div className="rounded-3xl border border-[#E5E7EB] bg-white p-8 shadow-xs hover:border-[#FF6B2C]/40 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF1E8] text-[#FF6B2C] flex items-center justify-center mb-6">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#111318]">{t.productPage.pillars.privacy.title}</h3>
                <p className="mt-3 text-sm text-[#667085] leading-relaxed">
                  {t.productPage.pillars.privacy.desc}
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-[#111318] font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#FF6B2C] shrink-0" />
                    <span>{t.productPage.pillars.privacy.f1}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#FF6B2C] shrink-0" />
                    <span>{t.productPage.pillars.privacy.f2}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#FF6B2C] shrink-0" />
                    <span>{t.productPage.pillars.privacy.f3}</span>
                  </li>
                </ul>
              </div>

              {/* Timeline Pillar */}
              <div className="rounded-3xl border border-[#E5E7EB] bg-white p-8 shadow-xs hover:border-[#FF6B2C]/40 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF1E8] text-[#FF6B2C] flex items-center justify-center mb-6">
                  <Sliders size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#111318]">{t.productPage.pillars.timeline.title}</h3>
                <p className="mt-3 text-sm text-[#667085] leading-relaxed">
                  {t.productPage.pillars.timeline.desc}
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-[#111318] font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#FF6B2C] shrink-0" />
                    <span>{t.productPage.pillars.timeline.f1}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#FF6B2C] shrink-0" />
                    <span>{t.productPage.pillars.timeline.f2}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#FF6B2C] shrink-0" />
                    <span>{t.productPage.pillars.timeline.f3}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <RecordingWorkflow />

        {/* Final CTA */}
        <FinalCtaSection />
      </main>

      <Footer />
    </div>
  );
}
