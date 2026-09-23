"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Video,
  Users,
  Share2,
  FolderKanban,
  BarChart3,
  Boxes,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export function CoreFeaturesSection() {
  const features = [
    {
      badge: "Record",
      title: "Capture high-quality video and meetings.",
      description:
        "High-definition 4K 60 FPS recording with automatic cursor zoom, noise-canceling mic isolation, and zero-latency client encoding.",
      icon: Video,
      variant: "white",
      highlight: "Auto-zoom & 60 FPS WebCodecs",
      link: "/editor",
    },
    {
      badge: "Collaborate",
      title: "Work together with your team in one workspace.",
      description:
        "Time-stamped comments, interactive video reviews, and live emoji reactions so remote teams stay aligned without back-and-forth emails.",
      icon: Users,
      variant: "soft-orange",
      highlight: "Time-coded comments & reactions",
      link: "/desktop",
    },
    {
      badge: "Share",
      title: "Share videos quickly with your team or clients.",
      description:
        "Instant link generation with customizable permissions, expiring links, password protection, and one-click embeddable players.",
      icon: Share2,
      variant: "white",
      highlight: "Instant link & password control",
      link: "/editor",
    },
    {
      badge: "Manage",
      title: "Organize meetings, recordings, and content.",
      description:
        "Categorize recordings with smart tags, workspace folders, and automated transcription indexing for lightning-fast retrieval.",
      icon: FolderKanban,
      variant: "dark",
      highlight: "Smart folders & automated indexing",
      link: "/desktop",
    },
    {
      badge: "Analyze",
      title: "Understand video engagement and activity.",
      description:
        "Track viewer retention curves, total watch time, drop-off percentages, and discover which segments your audience replayed most.",
      icon: BarChart3,
      variant: "white",
      highlight: "Retention curves & viewer drop-off",
      link: "/desktop",
    },
    {
      badge: "Integrate",
      title: "Connect FucuFlow with the tools your team already uses.",
      description:
        "Native two-way integrations with Slack, Notion, Jira, GitHub, and Figma to streamline daily asynchronous workflows.",
      icon: Boxes,
      variant: "soft-orange",
      highlight: "Slack, Notion, Figma & Jira sync",
      link: "/desktop",
    },
  ];

  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (headerRef.current) {
        tl.fromTo(
          headerRef.current.children,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.6,
            clearProps: "all",
          }
        );
      }

      if (gridRef.current) {
        tl.fromTo(
          gridRef.current.children,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.7,
            clearProps: "all",
          },
          "-=0.3"
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-[#F8F9FB] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={headerRef} className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/20 text-xs font-bold uppercase tracking-wider text-[#FF6B2C]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2C]" />
            <span>Modular Platform</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111318]">
            Modular video architecture for modern teams.
          </h2>
          <p className="text-[#667085] text-base sm:text-lg leading-relaxed">
            Everything you need to capture, organize, and collaborate through video in one structured ecosystem.
          </p>
        </div>

        {/* 6 Modular Cards Grid (Combination of White, Soft Orange, and Dark) */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item) => {
            const Icon = item.icon;

            if (item.variant === "dark") {
              return (
                <div
                  key={item.badge}
                  className="rounded-2xl sm:rounded-3xl p-7 bg-[#17191F] text-white border border-white/10 shadow-sm flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-white/10 text-white border border-white/15">
                        [ {item.badge} ]
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-[#FF6B2C] text-white flex items-center justify-center shadow-sm">
                        <Icon size={18} />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3">
                      {item.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-6">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-[#FF8A4C] font-medium flex items-center gap-1.5">
                      <CheckCircle2 size={14} />
                      {item.highlight}
                    </span>
                    <Link
                      href={item.link}
                      className="text-xs font-semibold text-white group-hover:text-[#FF6B2C] flex items-center gap-1 transition-colors"
                    >
                      <span>Explore</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            }

            if (item.variant === "soft-orange") {
              return (
                <div
                  key={item.badge}
                  className="rounded-2xl sm:rounded-3xl p-7 bg-[#FFF1E8] border border-[#FF6B2C]/30 shadow-sm flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-1 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-white text-[#FF6B2C] border border-[#FF6B2C]/20 shadow-xs">
                        [ {item.badge} ]
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#FF6B2C]/30 text-[#FF6B2C] flex items-center justify-center shadow-xs">
                        <Icon size={18} />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-[#111318] mb-3">
                      {item.title}
                    </h3>
                    <p className="text-[#667085] text-sm leading-relaxed mb-6">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#FF6B2C]/15 flex items-center justify-between">
                    <span className="text-xs text-[#FF6B2C] font-semibold flex items-center gap-1.5">
                      <CheckCircle2 size={14} />
                      {item.highlight}
                    </span>
                    <Link
                      href={item.link}
                      className="text-xs font-semibold text-[#111318] group-hover:text-[#FF6B2C] flex items-center gap-1 transition-colors"
                    >
                      <span>Explore</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            }

            // Default: White Card
            return (
              <div
                key={item.badge}
                className="rounded-2xl sm:rounded-3xl p-7 bg-white border border-[#E5E7EB] shadow-sm flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-1 hover:border-[#FF6B2C]/40 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#F8F9FB] text-[#111318] border border-[#E5E7EB]">
                      [ {item.badge} ]
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-[#111318] group-hover:bg-[#FFF1E8] group-hover:text-[#FF6B2C] group-hover:border-[#FF6B2C]/30 flex items-center justify-center transition-colors">
                      <Icon size={18} />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#111318] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[#667085] text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                  <span className="text-xs text-[#667085] font-medium flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-[#FF6B2C]" />
                    {item.highlight}
                  </span>
                  <Link
                    href={item.link}
                    className="text-xs font-semibold text-[#111318] group-hover:text-[#FF6B2C] flex items-center gap-1 transition-colors"
                  >
                    <span>Explore</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
