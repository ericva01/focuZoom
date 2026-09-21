"use client";

import { BarChart3, TrendingUp, Users, Clock, Eye, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function AnalyticsSection() {
  const metrics = [
    { title: "Total Video Views", value: "142.8k", change: "+24.5%", icon: Eye },
    { title: "Avg. Watch Time", value: "84.2%", change: "+12.1%", icon: Clock },
    { title: "Unique Viewers", value: "38.6k", change: "+18.9%", icon: Users },
    { title: "Engagement Rate", value: "92.4%", change: "+6.8%", icon: TrendingUp },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white border-t border-[#E5E7EB] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/20 text-xs font-bold uppercase tracking-wider text-[#FF6B2C]">
            <BarChart3 size={14} />
            <span>Audience Insights</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111318]">
            Understand video engagement and activity.
          </h2>
          <p className="text-[#667085] text-base sm:text-lg leading-relaxed">
            Gain granular telemetry on what parts of your video viewers watched, replayed, or skipped.
          </p>
        </div>

        {/* Analytics Dashboard Grid */}
        <div className="space-y-6">
          {/* Top 4 Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {metrics.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.title}
                  className="rounded-2xl p-6 bg-[#F8F9FB] border border-[#E5E7EB] shadow-xs hover:border-[#FF6B2C]/40 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#667085]">{m.title}</span>
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center text-[#FF6B2C]">
                      <Icon size={16} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline justify-between">
                    <span className="text-3xl font-extrabold text-[#111318] tracking-tight">{m.value}</span>
                    <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {m.change}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Minimal Clean SVG Chart & Breakdown Container */}
          <div className="rounded-2xl sm:rounded-3xl border border-[#E5E7EB] bg-[#F8F9FB] p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Chart Area */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-sm font-bold text-[#111318]">Viewer Retention Curve</h4>
                  <p className="text-xs text-[#667085]">Playback retention vs. timeline duration</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-xs text-[#111318] font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B2C]" />
                    <span>Active Engagement</span>
                  </span>
                </div>
              </div>

              {/* Minimal SVG Trend Line with Orange Highlight */}
              <div className="relative h-56 w-full pt-4">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                  {/* Subtle Grid Lines */}
                  <line x1="0" y1="30" x2="500" y2="30" stroke="#E5E7EB" strokeDasharray="3 3" />
                  <line x1="0" y1="75" x2="500" y2="75" stroke="#E5E7EB" strokeDasharray="3 3" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke="#E5E7EB" strokeDasharray="3 3" />

                  {/* Gradient Area */}
                  <defs>
                    <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF6B2C" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#FF6B2C" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <path
                    d="M 0 45 Q 60 20 120 40 T 240 30 T 360 50 T 500 35 L 500 150 L 0 150 Z"
                    fill="url(#orangeGradient)"
                  />

                  {/* Trend Path */}
                  <path
                    d="M 0 45 Q 60 20 120 40 T 240 30 T 360 50 T 500 35"
                    fill="none"
                    stroke="#FF6B2C"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Data Points */}
                  <circle cx="120" cy="40" r="4.5" fill="#FFFFFF" stroke="#FF6B2C" strokeWidth="3" />
                  <circle cx="240" cy="30" r="4.5" fill="#FFFFFF" stroke="#FF6B2C" strokeWidth="3" />
                  <circle cx="360" cy="50" r="4.5" fill="#FFFFFF" stroke="#FF6B2C" strokeWidth="3" />
                </svg>

                <div className="flex items-center justify-between text-[11px] font-mono text-[#667085] mt-3">
                  <span>0:00</span>
                  <span>1:15 (Auto-Zoom Peak)</span>
                  <span>2:30</span>
                  <span>3:45</span>
                  <span>5:00 (Export)</span>
                </div>
              </div>
            </div>

            {/* Side: Popular Videos List */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E5E7EB] p-6 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#111318] mb-4">Top Performing Videos</h4>
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="min-w-0 pr-2">
                      <p className="font-semibold text-[#111318] truncate">Product Launch Demo v2</p>
                      <p className="text-[10px] text-[#667085]">14.2k views · 98% retention</p>
                    </div>
                    <span className="font-mono font-bold text-[#FF6B2C]">98%</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="min-w-0 pr-2">
                      <p className="font-semibold text-[#111318] truncate">API Architecture Overview</p>
                      <p className="text-[10px] text-[#667085]">8.9k views · 91% retention</p>
                    </div>
                    <span className="font-mono font-bold text-[#FF6B2C]">91%</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="min-w-0 pr-2">
                      <p className="font-semibold text-[#111318] truncate">Onboarding & Setup Guide</p>
                      <p className="text-[10px] text-[#667085]">6.4k views · 87% retention</p>
                    </div>
                    <span className="font-mono font-bold text-[#FF6B2C]">87%</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E7EB] mt-4">
                <Link
                  href="/desktop?view=analytics"
                  className="inline-flex items-center justify-between w-full text-xs font-bold text-[#FF6B2C] hover:text-[#E85A1F]"
                >
                  <span>Open detailed analytics suite</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
