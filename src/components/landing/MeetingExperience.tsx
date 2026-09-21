"use client";

import {
  Mic,
  Video,
  Share2,
  PhoneOff,
  Users,
  MessageSquare,
  Sparkles,
  Radio,
} from "lucide-react";
import Link from "next/link";

export function MeetingExperience() {
  const participants = [
    { name: "Alex Rivera (Host)", role: "Product", avatar: "AR", speaking: true },
    { name: "Sarah Chen", role: "Design", avatar: "SC", speaking: false },
    { name: "David Miller", role: "Frontend", avatar: "DM", speaking: false },
    { name: "Elena Rostova", role: "Backend", avatar: "ER", speaking: false },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white border-t border-[#E5E7EB] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/20 text-xs font-bold uppercase tracking-wider text-[#FF6B2C]">
            <Radio size={14} />
            <span>High-Def Video Rooms</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111318]">
            Meeting experience engineered for clarity.
          </h2>
          <p className="text-[#667085] text-base sm:text-lg leading-relaxed">
            Ultra-low latency audio, crisp screen sharing, and integrated live recording that doesn&apos;t drag down your CPU.
          </p>
        </div>

        {/* Meeting UI Showcase Card */}
        <div className="rounded-2xl sm:rounded-3xl border border-[#E5E7EB] bg-[#17191F] p-4 sm:p-6 lg:p-8 shadow-xl text-white">
          {/* Meeting Room Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-[#FF6B2C] px-2.5 py-1 text-xs font-bold text-white shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  LIVE
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Sprint Planning & Video Engine Review
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">Glideo Encrypted Room ID: #sync-9824</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-medium text-slate-300">
                00:32:18
              </span>
              <Link
                href="/desktop?view=meeting"
                className="rounded-xl bg-[#FF6B2C] hover:bg-[#E85A1F] px-4 py-2 text-xs font-bold text-white transition-all shadow-sm"
              >
                Join Room
              </Link>
            </div>
          </div>

          {/* Participant Grid */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Primary Main Speaker Video */}
            <div className="md:col-span-8 relative rounded-2xl bg-[#0F1116] border border-white/10 aspect-[16/10] overflow-hidden flex flex-col justify-between p-5">
              <div className="flex items-center justify-between z-10">
                <span className="rounded-lg bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-medium border border-white/10 flex items-center gap-1.5 text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Screen Share: Glideo Auto-Tracking Canvas (60 FPS)
                </span>
                <span className="rounded-lg bg-[#FF6B2C] px-2.5 py-0.5 text-xs font-bold text-white shadow-xs">
                  Speaker
                </span>
              </div>

              {/* Graphic Simulation */}
              <div className="text-center my-auto z-10 select-none">
                <div className="inline-flex items-center gap-2 rounded-full bg-black/70 border border-white/15 px-4 py-2 text-xs text-white backdrop-blur-md mb-2">
                  <Sparkles size={14} className="text-[#FF6B2C]" />
                  <span>Real-time adaptive bitrate: 1080p @ 6.2 Mbps</span>
                </div>
                <div className="flex items-center justify-center gap-1 h-8 mt-2">
                  <div className="w-1 bg-[#FF6B2C] h-3 animate-pulse rounded-full" />
                  <div className="w-1 bg-[#FF6B2C] h-6 animate-pulse rounded-full" />
                  <div className="w-1 bg-[#FF6B2C] h-8 animate-pulse rounded-full" />
                  <div className="w-1 bg-[#FF6B2C] h-4 animate-pulse rounded-full" />
                  <div className="w-1 bg-[#FF6B2C] h-7 animate-pulse rounded-full" />
                </div>
              </div>

              {/* Bottom Speaker Label */}
              <div className="flex items-center justify-between z-10 text-xs">
                <div className="flex items-center gap-2 rounded-lg bg-black/60 px-3 py-1.5 backdrop-blur-sm border border-white/10">
                  <Mic size={13} className="text-emerald-400" />
                  <span className="font-semibold text-white">Alex Rivera</span>
                </div>
                <span className="text-slate-400 text-[11px]">Lossless Opus Audio (48 kHz)</span>
              </div>
            </div>

            {/* Side Grid of 3 Participants */}
            <div className="md:col-span-4 flex flex-col gap-3">
              {participants.slice(1).map((p) => (
                <div
                  key={p.name}
                  className="rounded-xl bg-[#0F1116] border border-white/10 p-3.5 flex items-center justify-between hover:border-white/20 transition-all flex-1"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 text-white font-bold flex items-center justify-center text-xs">
                      {p.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{p.name}</p>
                      <p className="text-[10px] text-slate-400">{p.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                      <Mic size={12} />
                    </div>
                    <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                      <Video size={12} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Control Bar */}
          <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Audio: MacBook Pro Microphone</span>
            </div>

            {/* Central Controls */}
            <div className="flex items-center gap-2.5">
              <button className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors" title="Microphone">
                <Mic size={18} />
              </button>
              <button className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors" title="Camera">
                <Video size={18} />
              </button>
              <button className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors" title="Share Screen">
                <Share2 size={18} />
              </button>
              {/* Record Action with Orange Active State */}
              <button className="px-4 py-3 rounded-xl bg-[#FF6B2C] hover:bg-[#E85A1F] text-white flex items-center gap-2 font-bold text-xs shadow-sm transition-all" title="Recording">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>Recording Active</span>
              </button>
              <button className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors" title="Participants">
                <Users size={18} />
              </button>
              <button className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors" title="Chat">
                <MessageSquare size={18} />
              </button>
            </div>

            {/* Leave Room Action (Red only for destructive) */}
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors">
              <PhoneOff size={15} />
              <span>Leave Room</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
