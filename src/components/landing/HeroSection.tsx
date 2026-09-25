"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowRight,
  Play,
  CheckCircle2,
} from "lucide-react";
import { DownloadModal } from "@/components/common/DownloadModal";
import { useLanguage } from "@/context/LanguageContext";

export function HeroSection() {
  const [downloadOpen, setDownloadOpen] = useState(false);
  const { t } = useLanguage();

  const containerRef = useRef<HTMLElement | null>(null);
  const pillRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const subtextRef = useRef<HTMLParagraphElement | null>(null);
  const actionsRef = useRef<HTMLDivElement | null>(null);
  const badgesRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (pillRef.current) {
        tl.fromTo(
          pillRef.current,
          { y: -20, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.5)", clearProps: "all" }
        );
      }

      if (headlineRef.current) {
        tl.fromTo(
          headlineRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, clearProps: "all" },
          "-=0.4"
        );
      }

      if (subtextRef.current) {
        tl.fromTo(
          subtextRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, clearProps: "all" },
          "-=0.5"
        );
      }

      if (actionsRef.current) {
        tl.fromTo(
          actionsRef.current.children,
          { y: 20, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 0.5, ease: "back.out(1.5)", clearProps: "all" },
          "-=0.4"
        );
      }

      if (badgesRef.current) {
        tl.fromTo(
          badgesRef.current.children,
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, clearProps: "all" },
          "-=0.3"
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="relative overflow-hidden bg-[#F8F9FB] pb-16 pt-12 text-[#111318] sm:pb-24 sm:pt-20 lg:pb-28">
      {/* Subtle background radial glow in soft orange */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-[#FFF1E8]/70 via-[#FFF1E8]/20 to-transparent blur-3xl opacity-80"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Announcement Pill */}
        <div ref={pillRef} className="flex justify-center">
          <Link
            href="/product"
            className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-1.5 text-xs font-medium text-[#111318] shadow-sm transition-all hover:border-[#FF6B2C]/40"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#FF6B2C] animate-pulse" />
            <span className="text-[#FF6B2C] font-semibold">FucuFlow</span>
            <span className="text-[#667085]">|</span>
            <span>{t.hero.pill}</span>
            <ArrowRight size={13} className="text-[#667085]" />
          </Link>
        </div>

        {/* Hero Headline & Supporting Text */}
        <div className="mt-8 text-center max-w-4xl mx-auto">
          <h1 ref={headlineRef} className="text-4xl font-bold tracking-tight text-[#111318] sm:text-6xl sm:leading-[1.12] lg:text-7xl">
            {t.hero.titleMain} <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#111318] via-[#FF6B2C] to-[#E85A1F]">
              {t.hero.titleGradient}
            </span>
          </h1>

          <p ref={subtextRef} className="mt-6 text-base leading-7 text-[#667085] sm:text-xl sm:leading-8 max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>

          {/* Action Buttons */}
          <div ref={actionsRef} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/editor"
              className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#FF6B2C] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#E85A1F] hover:shadow-[0_8px_20px_rgba(255,107,44,0.3)] active:scale-95"
            >
              <span>{t.hero.launchStudio}</span>
              <ArrowRight size={17} />
            </Link>

            <Link
              href="/download"
              className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-[#E5E7EB] bg-white px-7 py-3.5 text-sm font-semibold text-[#111318] shadow-sm transition-all duration-150 hover:bg-[#F8F9FB] hover:border-[#D1D5DB] active:scale-95"
            >
              <Play size={15} className="text-[#FF6B2C] fill-[#FF6B2C]" />
              <span>{t.hero.downloadClient}</span>
            </Link>
          </div>

          {/* Micro social proof under CTA */}
          <div ref={badgesRef} className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#667085]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-[#FF6B2C]" />
              <span>{t.hero.badges.free}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-[#FF6B2C]" />
              <span>{t.hero.badges.privacy}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-[#FF6B2C]" />
              <span>{t.hero.badges.export4k}</span>
            </div>
          </div>
        </div>
      </div>

      <DownloadModal isOpen={downloadOpen} onClose={() => setDownloadOpen(false)} />
    </section>
  );
}
