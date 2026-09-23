"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: "How does FucuFlow achieve 60 FPS recording directly inside the browser?",
      answer:
        "FucuFlow uses the modern W3C WebCodecs and WebGL 2.0 API standards. Rather than relying on heavyweight server queues or slow canvas capture, your local graphics hardware handles hardware-accelerated encoding (H.264/AV1/VP9) in real time with near-zero CPU overhead.",
      category: "Technology",
    },
    {
      question: "Do my screen captures or webcam recordings get uploaded to any cloud server?",
      answer:
        "No. FucuFlow is built completely local-first. All recordings, focal zoom processing, and video exports take place strictly on your local device hardware. Your video files remain on your local disk.",
      category: "Privacy",
    },
    {
      question: "How does the Automated Camera Zoom feature work?",
      answer:
        "FucuFlow tracks cursor activity, click clustering, and window events across time. It calculates Catmull-Rom spline curves with critically damped spring physics to glide the virtual camera seamlessly into the area of user focus, completely eliminating jarring visual cuts.",
      category: "Features",
    },
    {
      question: "Can I collaborate on video reviews with team members who don't have an account?",
      answer:
        "Yes! Public or password-protected review links permit teammates, clients, and external stakeholders to leave time-coded comments, reactions, and annotations directly without forcing them to register an account.",
      category: "Collaboration",
    },
    {
      question: "Does FucuFlow support desktop apps for macOS, Windows, and Linux?",
      answer:
        "Yes, in addition to the zero-install web application, FucuFlow offers lightweight native desktop applications built on Tauri and Rust, providing system tray quick recording, global hotkeys, and multi-monitor capture.",
      category: "Platforms",
    },
  ];

  return (
    <section id="resources" className="py-20 lg:py-28 bg-white border-t border-[#E5E7EB] select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/20 text-xs font-bold uppercase tracking-wider text-[#FF6B2C]">
            <HelpCircle size={14} />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111318]">
            Frequently asked questions
          </h2>
          <p className="text-[#667085] text-base sm:text-lg leading-relaxed">
            Everything you need to know about the product, local processing, and team collaboration.
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
