"use client";

import { Boxes, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

export function IntegrationsSection() {
  const tools = [
    {
      name: "Slack",
      category: "Messaging",
      desc: "Receive real-time notifications for time-stamped video comments, view video previews directly in channels, and record video replies.",
      badge: "Instant Bot",
    },
    {
      name: "Notion",
      category: "Documentation",
      desc: "Embed playable Glideo videos inside Notion pages with automated live sync and searchable interactive transcripts.",
      badge: "Native Embed",
    },
    {
      name: "Figma",
      category: "Design",
      desc: "Link Glideo screen walkthroughs directly to Figma frames and design system components for seamless critique.",
      badge: "Design Sync",
    },
    {
      name: "GitHub",
      category: "Engineering",
      desc: "Attach 60 FPS bug reproduction recordings and auto-zoomed feature demos right inside pull requests and issues.",
      badge: "PR Preview",
    },
    {
      name: "Jira",
      category: "Project Tracking",
      desc: "Auto-sync video attachments to Jira sprint tickets with zero compression loss and instant playback.",
      badge: "Webhook Sync",
    },
    {
      name: "Google Meet & Zoom",
      category: "Conferencing",
      desc: "Import recorded meetings into Glideo with one click for AI auto-zooming, focal centering, and cinematic re-export.",
      badge: "Auto Import",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#F8F9FB] border-t border-[#E5E7EB] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/20 text-xs font-bold uppercase tracking-wider text-[#FF6B2C]">
            <Boxes size={14} />
            <span>Connected Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111318]">
            Connect Glideo with the tools your team uses daily.
          </h2>
          <p className="text-[#667085] text-base sm:text-lg leading-relaxed">
            Plug into your existing toolchain in seconds. Trigger recordings from Slack, embed in Notion, and sync with GitHub.
          </p>
        </div>

        {/* 6 Integrations Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="rounded-2xl sm:rounded-3xl p-7 bg-white border border-[#E5E7EB] shadow-xs hover:border-[#FF6B2C]/40 hover:shadow-sm transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] font-bold text-sm text-[#111318] flex items-center justify-center group-hover:bg-[#FFF1E8] group-hover:text-[#FF6B2C] group-hover:border-[#FF6B2C]/30 transition-colors">
                      {tool.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#111318]">{tool.name}</h4>
                      <p className="text-[10px] text-[#667085]">{tool.category}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F8F9FB] text-[#667085] border border-[#E5E7EB]">
                    {tool.badge}
                  </span>
                </div>

                <p className="text-xs text-[#667085] leading-relaxed mb-6">
                  {tool.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <Check size={13} /> Verified Integration
                </span>
                <Link
                  href="/desktop?view=integrations"
                  className="text-xs font-semibold text-[#111318] group-hover:text-[#FF6B2C] flex items-center gap-1 transition-colors"
                >
                  <span>Connect</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
