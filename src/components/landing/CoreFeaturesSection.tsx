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
  Bot,
  Sparkles,
  Terminal,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function CoreFeaturesSection() {
  const { t } = useLanguage();

  const features = [
    {
      id: "record",
      badge: t.features.cards.record.badge,
      title: t.features.cards.record.title,
      description: t.features.cards.record.desc,
      icon: Video,
      variant: "white",
      highlight: t.features.cards.record.highlight,
      link: "/editor",
    },
    {
      id: "ai-copilot",
      badge: "AI Agent & MCP",
      title: "Direct & Edit Videos with Autonomous AI Agents",
      description: "Automate zooms, keyframe camera tilts, trim silences, and split clips with natural language or connect Cursor & Claude Desktop via local Model Context Protocol.",
      icon: Bot,
      variant: "soft-orange",
      highlight: "14 Video Tools & Local MCP Server",
      link: "/features",
    },
    {
      id: "collaborate",
      badge: t.features.cards.collaborate.badge,
      title: t.features.cards.collaborate.title,
      description: t.features.cards.collaborate.desc,
      icon: Users,
      variant: "white",
      highlight: t.features.cards.collaborate.highlight,
      link: "/features",
    },
    {
      id: "share",
      badge: t.features.cards.share.badge,
      title: t.features.cards.share.title,
      description: t.features.cards.share.desc,
      icon: Share2,
      variant: "white",
      highlight: t.features.cards.share.highlight,
      link: "/editor",
    },
    {
      id: "canvas",
      badge: t.features.cards.canvas.badge,
      title: t.features.cards.canvas.title,
      description: t.features.cards.canvas.desc,
      icon: Boxes,
      variant: "soft-orange",
      highlight: t.features.cards.canvas.highlight,
      link: "/features",
    },
    {
      id: "manage",
      badge: t.features.cards.manage.badge,
      title: t.features.cards.manage.title,
      description: t.features.cards.manage.desc,
      icon: FolderKanban,
      variant: "dark",
      highlight: t.features.cards.manage.highlight,
      link: "/download",
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
            <span>{t.features.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111318]">
            {t.features.title}
          </h2>
          <p className="text-[#667085] text-base sm:text-lg leading-relaxed">
            {t.features.subtitle}
          </p>
        </div>

        {/* 6 Modular Cards Grid (Combination of White, Soft Orange, and Dark) */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item) => {
            const Icon = item.icon;

            if (item.variant === "dark") {
              return (
                <div
                  key={item.id}
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
                  key={item.id}
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
                key={item.id}
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

        {/* AI Agent & MCP Protocol Spotlight Banner */}
        <div className="mt-14 rounded-3xl bg-gradient-to-br from-[#17191F] via-[#1E222B] to-[#12141A] p-8 sm:p-10 text-white border border-white/10 shadow-xl overflow-hidden relative">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#FF6B2C]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B2C]/20 border border-[#FF6B2C]/40 text-xs font-semibold text-[#FF8A4C]">
                <Sparkles size={14} className="text-[#FF6B2C]" />
                <span>Next-Gen Video Automation</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Connect your AI agent to edit videos autonomously
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                FucuFlow features a built-in AI Copilot powered by Gemini, OpenAI, and local Ollama, plus a zero-dependency Model Context Protocol (MCP) server so external agents like Claude Desktop, Cursor, and Windsurf can control timeline edits in real time.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 size={16} className="text-[#FF6B2C] shrink-0 mt-0.5" />
                  <span><strong>14 Editing Tools:</strong> Zoom, tilt, trim, split, aspect ratio, audio & filters.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 size={16} className="text-[#FF6B2C] shrink-0 mt-0.5" />
                  <span><strong>MCP Server Included:</strong> Plug-and-play with Claude Desktop and Cursor.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 size={16} className="text-[#FF6B2C] shrink-0 mt-0.5" />
                  <span><strong>Full Undo / Redo:</strong> Review each action or revert instantly with one click.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 size={16} className="text-[#FF6B2C] shrink-0 mt-0.5" />
                  <span><strong>100% Local Ollama:</strong> Run offline models with zero API costs and total privacy.</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/editor"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B2C] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-[#E85A1F] transition-colors"
                >
                  <Bot size={16} />
                  <span>Try AI Agent in Studio</span>
                  <ArrowRight size={14} />
                </Link>
                <Link
                  href="/resources"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  <Terminal size={15} className="text-[#FF8A4C]" />
                  <span>View MCP Integration Guide</span>
                </Link>
              </div>
            </div>

            {/* Interactive Code / Prompt Preview */}
            <div className="lg:col-span-5 bg-black/60 rounded-2xl border border-white/10 p-5 font-mono text-xs shadow-inner space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-2 text-slate-300 font-sans font-bold">claude_desktop_config.json</span>
                </div>
                <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  mcp 2.0 ready
                </span>
              </div>

              <pre className="text-slate-300 text-[11px] leading-relaxed overflow-x-auto py-1">
{`{
  "mcpServers": {
    "fucuflow": {
      "command": "node",
      "args": ["scripts/mcp-server/index.mjs"]
    }
  }
}`}
              </pre>

              <div className="p-3 rounded-xl bg-[#FF6B2C]/10 border border-[#FF6B2C]/20 text-[11px] text-slate-200 space-y-1">
                <div className="text-[#FF8A4C] font-sans font-bold flex items-center gap-1">
                  <Sparkles size={12} />
                  <span>Prompt Claude or Cursor:</span>
                </div>
                <p className="text-slate-300 italic font-sans text-xs">
                  &quot;Trim silences, add a 2.4x zoom onto the code snippet at 0:18, and set aspect ratio to 9:16 for TikTok.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
