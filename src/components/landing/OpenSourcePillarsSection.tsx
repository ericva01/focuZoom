"use client";

import { Check, ArrowRight, Heart } from "lucide-react";
import Link from "next/link";

export function OpenSourcePillarsSection() {
  const pillars = [
    {
      name: "Community Edition",
      badge: "Free Forever",
      highlight: true,
      price: "$0",
      period: "forever free for everyone",
      desc: "Full-featured studio for individual creators, engineers, and educators.",
      cta: "Launch Studio Free",
      ctaLink: "/editor",
      features: [
        "Unlimited 4K 60 FPS recording",
        "Automated focal camera zooms",
        "3D perspective slant & studio bezels",
        "Lossless WebM & MP4 export",
        "Zero watermarks or time limits",
        "100% local device storage",
      ],
    },
    {
      name: "Open Source Codebase",
      badge: "MIT License",
      highlight: false,
      price: "Free",
      period: "open source repository",
      desc: "Inspect the code, self-host, or contribute features directly on GitHub.",
      cta: "Star on GitHub",
      ctaLink: "https://github.com/ericva01/focuZoom",
      isExternal: true,
      features: [
        "Full source code under MIT License",
        "Modern Next.js 16 & TypeScript",
        "Tauri & Rust native desktop bridge",
        "Client-side WebCodecs & WebGL 2.0",
        "Community pull requests welcome",
        "Self-hostable with zero cloud ties",
      ],
    },
    {
      name: "Local Privacy First",
      badge: "Zero Cloud",
      highlight: false,
      price: "100%",
      period: "local & private on your device",
      desc: "Your recordings stay exclusively on your hardware. No cloud tracking.",
      cta: "Download Desktop Client",
      ctaLink: "/desktop",
      features: [
        "Zero cloud uploads or server storage",
        "All video data stored on local disk",
        "Works 100% offline without internet",
        "No analytics or proprietary telemetry",
        "Hardware-accelerated local GPU encode",
        "Safe for confidential codebases",
      ],
    },
  ];

  return (
    <section id="open-source" className="py-20 lg:py-28 bg-[#F8F9FB] border-t border-[#E5E7EB] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/20 text-xs font-bold uppercase tracking-wider text-[#FF6B2C]">
            <Heart size={14} className="fill-[#FF6B2C]" />
            <span>100% Free & Open Source</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111318]">
            Free forever. Community driven. Stored locally.
          </h2>
          <p className="text-[#667085] text-base sm:text-lg leading-relaxed">
            No subscription fees, no paywalls, and zero cloud lock-in. FucuFlow is built for creators and engineers who value privacy and open source freedom.
          </p>
        </div>

        {/* 3 Pillars Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {pillars.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl sm:rounded-3xl p-8 flex flex-col justify-between transition-all duration-200 ${
                plan.highlight
                  ? "bg-white border-2 border-[#FF6B2C] shadow-lg relative -translate-y-1"
                  : "bg-white border border-[#E5E7EB] shadow-xs hover:shadow-md hover:border-[#D1D5DB]"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#FF6B2C] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                  Recommended
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-[#111318]">{plan.name}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#FFF1E8] text-[#FF6B2C] border border-[#FF6B2C]/30">
                    {plan.badge}
                  </span>
                </div>

                <p className="text-xs text-[#667085] leading-relaxed min-h-[36px]">
                  {plan.desc}
                </p>

                <div className="mt-6 pb-6 border-b border-[#E5E7EB]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-[#111318] tracking-tight">{plan.price}</span>
                  </div>
                  <p className="text-[11px] text-[#667085] mt-1">{plan.period}</p>
                </div>

                {/* Features list */}
                <div className="mt-6 space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#111318]">Highlights:</p>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#111318]">
                      <Check size={15} className="text-[#FF6B2C] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 mt-6 border-t border-[#E5E7EB]">
                {plan.isExternal ? (
                  <a
                    href={plan.ctaLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#111318] hover:bg-[#222630] text-white py-3 text-xs font-bold transition-all shadow-xs active:scale-95"
                  >
                    <span>{plan.cta}</span>
                    <ArrowRight size={13} />
                  </a>
                ) : (
                  <Link
                    href={plan.ctaLink}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all shadow-xs active:scale-95 ${
                      plan.highlight
                        ? "bg-[#FF6B2C] text-white hover:bg-[#E85A1F] hover:shadow-orange-sm"
                        : "bg-[#F8F9FB] border border-[#E5E7EB] text-[#111318] hover:bg-[#FFF1E8] hover:text-[#FF6B2C] hover:border-[#FF6B2C]/30"
                    }`}
                  >
                    <span>{plan.cta}</span>
                    <ArrowRight size={13} />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
