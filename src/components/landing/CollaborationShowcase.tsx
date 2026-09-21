"use client";

import { useState } from "react";
import {
  MessageSquare,
  CheckCircle2,
  Send,
  Play,
  Share2,
  Clock,
  Check,
} from "lucide-react";

export function CollaborationShowcase() {
  const [activeTab, setActiveTab] = useState<"comments" | "transcription" | "activity">("comments");
  const [newComment, setNewComment] = useState("");

  const initialComments = [
    {
      id: "1",
      author: "Sarah Chen",
      role: "Lead Designer",
      time: "01:24",
      text: "The camera easing into the navigation bar at this mark feels super crisp. Can we hold here for 1.5s longer?",
      avatar: "SC",
      status: "Resolved",
      reactions: ["👍 3", "🔥 2"],
    },
    {
      id: "2",
      author: "Alex Rivera",
      role: "Product Manager",
      time: "03:45",
      text: "Approved! The client demo is ready to share with stakeholders. Loving the orange badge accents.",
      avatar: "AR",
      status: "Approved",
      reactions: ["🎉 5", "❤️ 4"],
    },
  ];

  return (
    <section id="solutions" className="py-20 lg:py-28 bg-white border-t border-[#E5E7EB] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/20 text-xs font-bold uppercase tracking-wider text-[#FF6B2C]">
            <MessageSquare size={14} />
            <span>Collaboration Engine</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111318]">
            Feedback right where the video happens.
          </h2>
          <p className="text-[#667085] text-base sm:text-lg leading-relaxed">
            Eliminate ambiguity. Leave time-coded comments, draw directly on frames, and get approvals 3x faster.
          </p>
        </div>

        {/* Interactive Collaboration Mockup */}
        <div className="rounded-2xl sm:rounded-3xl border border-[#E5E7EB] bg-[#F8F9FB] p-4 sm:p-6 lg:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Video Player with Time-coded Markers */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-[#17191F] aspect-[16/10] shadow-md border border-white/10 flex flex-col justify-between p-5">
                {/* Top overlay pills */}
                <div className="flex items-center justify-between z-10">
                  <span className="rounded-lg bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-medium text-white border border-white/10">
                    Design Review: Mobile Navigation Flow v3
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-0.5 text-xs font-semibold">
                      <Check size={12} /> 2 Approvals
                    </span>
                  </div>
                </div>

                {/* Center Visual Mock */}
                <div className="text-center my-auto z-10 select-none">
                  <div className="w-14 h-14 rounded-full bg-[#FF6B2C] text-white flex items-center justify-center mx-auto shadow-lg hover:scale-105 transition-transform cursor-pointer">
                    <Play size={22} className="fill-current ml-1" />
                  </div>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur-sm">
                    <Clock size={12} className="text-[#FF6B2C]" />
                    <span>01:24 — Sarah Chen left a comment</span>
                  </div>
                </div>

                {/* Timeline with Interactive Comment Markers */}
                <div className="space-y-2 z-10">
                  <div className="relative h-2.5 bg-white/20 rounded-full cursor-pointer">
                    <div className="bg-[#FF6B2C] h-full w-2/5 rounded-full" />
                    {/* Marker 1 */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-[35%] w-4 h-4 rounded-full bg-white border-2 border-[#FF6B2C] shadow-sm cursor-pointer hover:scale-125 transition-transform" />
                    {/* Marker 2 */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-[65%] w-3 h-3 rounded-full bg-white border-2 border-emerald-500 shadow-sm cursor-pointer hover:scale-125 transition-transform" />
                    {/* Marker 3 */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-[82%] w-3 h-3 rounded-full bg-white border-2 border-purple-500 shadow-sm cursor-pointer hover:scale-125 transition-transform" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span>01:24</span>
                    <span>04:15 total</span>
                  </div>
                </div>
              </div>

              {/* Action shortcuts */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#667085]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#111318]">Hotkeys:</span>
                  <span className="rounded bg-white border border-[#E5E7EB] px-2 py-0.5 font-mono">C</span> comment,
                  <span className="rounded bg-white border border-[#E5E7EB] px-2 py-0.5 font-mono">Space</span> play/pause,
                  <span className="rounded bg-white border border-[#E5E7EB] px-2 py-0.5 font-mono">J/L</span> jump 5s
                </div>
                <div className="flex items-center gap-2 text-[#FF6B2C] font-semibold cursor-pointer">
                  <Share2 size={13} />
                  <span>Copy share link with timestamp</span>
                </div>
              </div>
            </div>

            {/* Right: Comments Thread & Activity Panel */}
            <div className="lg:col-span-5 rounded-2xl bg-white border border-[#E5E7EB] p-5 shadow-xs flex flex-col h-full min-h-[420px]">
              {/* Tabs */}
              <div className="flex items-center border-b border-[#E5E7EB] pb-3 mb-4 gap-4 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab("comments")}
                  className={`pb-1 transition-colors ${
                    activeTab === "comments"
                      ? "text-[#FF6B2C] border-b-2 border-[#FF6B2C]"
                      : "text-[#667085] hover:text-[#111318]"
                  }`}
                >
                  Comments (3)
                </button>
                <button
                  onClick={() => setActiveTab("transcription")}
                  className={`pb-1 transition-colors ${
                    activeTab === "transcription"
                      ? "text-[#FF6B2C] border-b-2 border-[#FF6B2C]"
                      : "text-[#667085] hover:text-[#111318]"
                  }`}
                >
                  Transcript & Notes
                </button>
                <button
                  onClick={() => setActiveTab("activity")}
                  className={`pb-1 transition-colors ${
                    activeTab === "activity"
                      ? "text-[#FF6B2C] border-b-2 border-[#FF6B2C]"
                      : "text-[#667085] hover:text-[#111318]"
                  }`}
                >
                  Activity
                </button>
              </div>

              {/* Threaded Comments List */}
              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                {initialComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3.5 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] hover:border-[#FF6B2C]/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#111318] text-white flex items-center justify-center font-bold text-xs">
                          {comment.avatar}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#111318]">{comment.author}</p>
                          <p className="text-[10px] text-[#667085]">{comment.role}</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded bg-[#FFF1E8] text-[#FF6B2C] font-mono text-[11px] font-bold px-2 py-0.5">
                        <Clock size={10} />
                        {comment.time}
                      </span>
                    </div>

                    <p className="text-xs text-[#111318] leading-relaxed">
                      {comment.text}
                    </p>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#E5E7EB]/60">
                      <div className="flex items-center gap-1.5">
                        {comment.reactions.map((r, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-white border border-[#E5E7EB] px-2 py-0.5 text-[10px] font-medium"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                      <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 size={12} /> {comment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Box */}
              <div className="pt-4 border-t border-[#E5E7EB] mt-4">
                <div className="relative">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a timestamped comment at 01:24..."
                    className="w-full rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] pl-3 pr-10 py-2.5 text-xs text-[#111318] placeholder-[#667085] focus:border-[#FF6B2C] focus:outline-none"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-[#FF6B2C] text-white flex items-center justify-center hover:bg-[#E85A1F] transition-colors">
                    <Send size={12} />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
