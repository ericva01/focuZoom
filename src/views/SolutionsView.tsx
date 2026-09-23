"use client";

import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { useLanguage } from "@/context/LanguageContext";
import {
  ArrowRight,
  Terminal,
  Palette,
  Headphones,
  Video,
  Rocket,
  CheckCircle2,
  LucideIcon,
} from "lucide-react";

export function SolutionsView() {
  const { t, localePath, isKhmer } = useLanguage();

  const iconMap: Record<string, LucideIcon> = {
    engineering: Terminal,
    design: Palette,
    success: Headphones,
    standups: Video,
    sales: Rocket,
  };

  return (
    <div className="website-ui min-h-screen flex flex-col bg-[#F8F9FB] text-[#111318] selection:bg-[#FFF1E8] selection:text-[#FF6B2C]">
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* Solutions Header */}
        <section className="relative overflow-hidden pt-16 pb-20 border-b border-[#E5E7EB] bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/20 text-xs font-semibold text-[#FF6B2C] mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2C]" />
                <span>{t.solutionsPage.badge}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111318] leading-[1.15]">
                {t.solutionsPage.title}
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-[#667085] leading-relaxed">
                {t.solutionsPage.subtitle}
              </p>
              <div className="mt-8 flex items-center gap-4">
                <Link
                  href={localePath("/editor")}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B2C] px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-[#E85A1F] transition-all"
                >
                  <span>{isKhmer ? "ចាប់ផ្តើមបង្កើតដោយឥតគិតថ្លៃ" : "Start Creating Free"}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Solutions Cards */}
        <section className="py-20 border-b border-[#E5E7EB] bg-[#F8F9FB]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {t.solutionsPage.solutions.map((sol, index) => {
                const Icon = iconMap[sol.id] || Terminal;
                return (
                  <div
                    key={sol.id}
                    id={sol.id}
                    className="rounded-3xl border border-[#E5E7EB] bg-white p-8 sm:p-10 shadow-xs hover:border-[#FF6B2C]/30 transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                  >
                    <div className="lg:col-span-7 space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#FFF1E8] text-[#FF6B2C] flex items-center justify-center">
                        <Icon size={24} />
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-[#111318]">{sol.title}</h2>
                      <p className="text-sm font-semibold text-[#FF6B2C]">{sol.subtitle}</p>
                      <p className="text-sm text-[#667085] leading-relaxed">{sol.description}</p>
                      <ul className="pt-2 space-y-2.5 text-xs text-[#111318] font-medium">
                        {sol.points.map((pt, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-[#FF6B2C] shrink-0" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="lg:col-span-5 bg-[#17191F] rounded-2xl p-6 text-white border border-white/10 shadow-lg">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                        <span className="text-xs font-mono text-[#FF8A4C]">FucuFlow Workflow #{index + 1}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                          {isKhmer ? "គ្មានអ៊ីនធឺណិត & លឿន" : "Offline & Fast"}
                        </span>
                      </div>
                      <p className="text-sm font-medium leading-relaxed text-slate-200">
                        {isKhmer
                          ? "«ការថតជាមួយ FucuFlow ចំណាយពេលត្រឹមតែ ២ នាទី ប៉ុន្តែជួយសន្សំពេលវេលាប្រជុំក្រុមការងារយើងបាន ៣០ នាទីក្នុងរាល់ Sprint។»"
                          : '"Recording with FucuFlow takes 2 minutes and saves our team 30 minutes of synchronous meeting time every sprint."'}
                      </p>
                      <div className="mt-6 flex items-center justify-between">
                        <Link
                          href={localePath("/editor")}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF8A4C] hover:text-[#FF7A3D] transition-colors"
                        >
                          <span>{isKhmer ? "សាកល្បងដំណើរការងារនេះ" : "Try this workflow"}</span>
                          <ArrowRight size={14} />
                        </Link>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {isKhmer ? "ឥតគិតថ្លៃ ១០០%" : "100% Free"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <FinalCtaSection />
      </main>

      <Footer />
    </div>
  );
}
