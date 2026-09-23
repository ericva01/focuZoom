"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { t } = useLanguage();

  const faqs: FaqItem[] = t.faq.items;

  return (
    <section id="resources" className="py-20 lg:py-28 bg-white border-t border-[#E5E7EB] select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/20 text-xs font-bold uppercase tracking-wider text-[#FF6B2C]">
            <HelpCircle size={14} />
            <span>{t.faq.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111318]">
            {t.faq.title}
          </h2>
          <p className="text-[#667085] text-base sm:text-lg leading-relaxed">
            {t.faq.subtitle}
          </p>
        </div>

        {/* Expandable Accordion Rows */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-[#FFF1E8]/40 border-[#FF6B2C]/30 shadow-xs"
                    : "bg-[#F8F9FB] border-[#E5E7EB] hover:border-[#D1D5DB]"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-[#E5E7EB] text-[#667085]">
                      {faq.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-[#111318]">
                      {faq.question}
                    </h3>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      isOpen
                        ? "bg-[#FF6B2C] text-white border-[#FF6B2C]"
                        : "bg-white border-[#E5E7EB] text-[#667085]"
                    }`}
                  >
                    {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-[#667085] leading-relaxed border-t border-[#E5E7EB]/60">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
