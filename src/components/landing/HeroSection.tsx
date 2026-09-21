"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowRight,
  Play,
  Video,
  Mic,
  Share2,
  Search,
  Users,
  Clock,
  Sparkles,
  CheckCircle2,
  Layers,
  BarChart3,
  Sliders,
  Maximize2,
} from "lucide-react";
import { DownloadModal } from "@/components/common/DownloadModal";

export function HeroSection() {
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const containerRef = useRef<HTMLElement | null>(null);
  const pillRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const subtextRef = useRef<HTMLParagraphElement | null>(null);
  const actionsRef = useRef<HTMLDivElement | null>(null);
  const badgesRef = useRef<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

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

      if (previewRef.current) {
        tl.fromTo(
          previewRef.current,
          { y: 40, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            clearProps: "transform,opacity",
            onComplete: () => {
              gsap.to(previewRef.current, {
                y: -6,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
              });
            },
          },
          "-=0.4"
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
            <span className="text-[#FF6B2C] font-semibold">New</span>
            <span className="text-[#667085]">|</span>
            <span>Glideo 2.0 Studio Overview</span>
            <ArrowRight size={13} className="text-[#667085]" />
          </Link>
        </div>

        {/* Hero Headline & Supporting Text */}
        <div className="mt-8 text-center max-w-4xl mx-auto">
          <h1 ref={headlineRef} className="text-4xl font-bold tracking-tight text-[#111318] sm:text-6xl sm:leading-[1.12] lg:text-7xl">
            Everything you need to <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#111318] via-[#FF6B2C] to-[#E85A1F]">
              communicate through video.
            </span>
          </h1>

          <p ref={subtextRef} className="mt-6 text-base leading-7 text-[#667085] sm:text-xl sm:leading-8 max-w-2xl mx-auto">
            Create, share, record, and collaborate through video with a simple workspace built for modern teams.
          </p>

          {/* Action Buttons */}
          <div ref={actionsRef} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/editor"
              className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#FF6B2C] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#E85A1F] hover:shadow-[0_8px_20px_rgba(255,107,44,0.3)] active:scale-95"
            >
              <span>Get Started</span>
              <ArrowRight size={17} />
            </Link>

            <Link
              href="/desktop"
              className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-[#E5E7EB] bg-white px-7 py-3.5 text-sm font-semibold text-[#111318] shadow-sm transition-all duration-150 hover:bg-[#F8F9FB] hover:border-[#D1D5DB] active:scale-95"
            >
              <Play size={15} className="text-[#FF6B2C] fill-[#FF6B2C]" />
              <span>Explore Glideo</span>
            </Link>
          </div>

          {/* Micro social proof under CTA */}
          <div ref={badgesRef} className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#667085]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-[#FF6B2C]" />
              <span>100% Free & Open Source</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-[#FF6B2C]" />
              <span>MIT Licensed on GitHub</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-[#FF6B2C]" />
              <span>100% Local User Storage & Privacy</span>
            </div>
          </div>
        </div>

        {/* Hero Visual: Polished Glideo Video Workspace / Dashboard Preview */}
        <div ref={previewRef} className="mt-14 sm:mt-18 relative">
          {/* Subtle Outer Drop Shadow Card Frame */}
          <div className="relative rounded-2xl sm:rounded-3xl border border-[#E5E7EB] bg-white p-2 sm:p-3.5 shadow-[0_20px_50px_rgba(16,24,40,0.08)]">
            {/* Inner Dashboard Simulation */}
            <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-[#E5E7EB] bg-[#F8F9FB] flex flex-col md:flex-row min-h-[580px] lg:min-h-[640px]">
              
              {/* Left Workspace Mini Navigation */}
              <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-[#E5E7EB] bg-white p-4 flex flex-col justify-between shrink-0">
                <div>
                  {/* Workspace Switcher */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] mb-5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-[#FF6B2C] text-white flex items-center justify-center font-bold text-xs">
                        G
                      </div>
                      <span className="text-xs font-semibold text-[#111318] truncate">Glideo HQ</span>
                    </div>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#FFF1E8] text-[#FF6B2C]">Open Source</span>
                  </div>

                  {/* Navigation Links */}
                  <div className="space-y-1 text-xs font-medium">
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#FFF1E8] text-[#FF6B2C] font-semibold">
                      <Layers size={15} />
                      <span>Overview</span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg text-[#667085] hover:bg-[#F8F9FB] hover:text-[#111318] transition-colors">
                      <div className="flex items-center gap-2.5">
                        <Video size={15} />
                        <span>Meetings</span>
                      </div>
                      <span className="flex h-2 w-2 rounded-full bg-[#FF6B2C] animate-ping" />
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#667085] hover:bg-[#F8F9FB] hover:text-[#111318] transition-colors">
                      <Clock size={15} />
                      <span>Recordings</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#667085] hover:bg-[#F8F9FB] hover:text-[#111318] transition-colors">
                      <Users size={15} />
                      <span>Team</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#667085] hover:bg-[#F8F9FB] hover:text-[#111318] transition-colors">
                      <BarChart3 size={15} />
                      <span>Analytics</span>
                    </div>
                  </div>
                </div>

                {/* Left Mini Quick Action */}
                <div className="pt-4 border-t border-[#E5E7EB] mt-4 hidden md:block">
                  <div className="rounded-xl bg-[#FFF1E8] p-3 border border-[#FF6B2C]/20 text-center">
                    <p className="text-[11px] font-semibold text-[#FF6B2C]">Local Storage</p>
                    <div className="w-full bg-[#E5E7EB] rounded-full h-1.5 mt-2 overflow-hidden">
                      <div className="bg-[#FF6B2C] h-1.5 rounded-full w-2/5" />
                    </div>
                    <p className="text-[10px] text-[#667085] mt-1.5">Stored locally on your device (Private & Offline)</p>
                  </div>
                </div>
              </div>

              {/* Main Preview Content Canvas */}
              <div className="flex-1 flex flex-col min-w-0 bg-[#F8F9FB]">
                {/* Top Search & Status Bar */}
                <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-white px-5 py-3.5 gap-4">
                  {/* Search Input Simulation */}
                  <div className="flex items-center gap-2 rounded-lg bg-[#F8F9FB] border border-[#E5E7EB] px-3 py-1.5 text-xs text-[#667085] w-64 max-w-full">
                    <Search size={14} className="text-[#667085]" />
                    <span>Search videos, meetings, tags...</span>
                  </div>

                  {/* Right Status Actions */}
                  <div className="flex items-center gap-3">
                    {/* Live Recording Indicator */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6B2C]/30 bg-[#FFF1E8] px-3 py-1 text-xs font-semibold text-[#FF6B2C]">
                      <span className="h-2 w-2 rounded-full bg-[#FF6B2C] animate-pulse" />
                      <span>REC 00:14:28</span>
                    </div>

                    {/* Share Button with Orange Accent */}
                    <button className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-[#111318] shadow-sm hover:border-[#FF6B2C] hover:text-[#FF6B2C] transition-colors">
                      <Share2 size={13} className="text-[#FF6B2C]" />
                      <span>Share</span>
                    </button>

                    {/* Profile avatar */}
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#111318] to-[#667085] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      EV
                    </div>
                  </div>
                </div>

                {/* Dashboard Main Canvas */}
                <div className="p-4 sm:p-6 space-y-5 overflow-y-auto">
                  
                  {/* Top Live Active Meeting Component */}
                  <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-5 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-[#FFF1E8] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FF6B2C]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2C] animate-pulse" />
                            Active Meeting
                          </span>
                          <span className="text-xs text-[#667085]">Room: #eng-sync</span>
                        </div>
                        <h3 className="mt-1 text-base font-bold text-[#111318]">
                          Q3 Product Architecture & Video Engine Sync
                        </h3>
                      </div>

                      {/* Participants */}
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2 overflow-hidden">
                          <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-[#111318] text-white text-[11px] font-bold flex items-center justify-center">
                            JD
                          </div>
                          <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-[#FF6B2C] text-white text-[11px] font-bold flex items-center justify-center">
                            AL
                          </div>
                          <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-[#667085] text-white text-[11px] font-bold flex items-center justify-center">
                            SK
                          </div>
                          <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-[#E5E7EB] text-[#111318] text-[10px] font-bold flex items-center justify-center">
                            +4
                          </div>
                        </div>
                        <span className="text-xs font-medium text-[#667085]">7 active</span>
                      </div>
                    </div>

                    {/* Live Stream Viewport & Scrubber */}
                    <div className="mt-4 relative rounded-xl overflow-hidden bg-[#17191F] aspect-[16/9] max-h-[260px] flex items-center justify-center group">
                      {/* Active Video Screen simulation */}
                      <div className="absolute inset-0 p-5 flex flex-col justify-between">
                        {/* Stream Header */}
                        <div className="flex items-center justify-between z-10">
                          <div className="flex items-center gap-2">
                            <span className="rounded-md bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-medium text-white border border-white/10">
                              Screen: Glideo Studio Timeline (60 FPS)
                            </span>
                          </div>
                          <span className="flex items-center gap-1.5 rounded-full bg-[#FF6B2C]/90 text-white px-2.5 py-0.5 text-[10px] font-semibold">
                            <Mic size={10} /> Active Speaker: Alex L.
                          </span>
                        </div>

                        {/* Center Visual Mockup */}
                        <div className="text-center space-y-2 select-none z-10">
                          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white backdrop-blur-md">
                            <Sparkles size={13} className="text-[#FF6B2C]" />
                            <span>Smooth Focal Auto-Zoom 2.4x applied</span>
                          </div>
                          <p className="text-xs text-slate-400">Glideo Canvas Hardware Decode WebCodecs</p>
                        </div>

                        {/* Bottom Video Controls Bar */}
                        <div className="flex items-center justify-between rounded-lg bg-black/70 backdrop-blur-md px-3 py-2 border border-white/10 text-white text-xs z-10">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setIsPlaying(!isPlaying)}
                              className="w-6 h-6 rounded-full bg-[#FF6B2C] flex items-center justify-center text-white hover:bg-[#E85A1F] transition-colors"
                            >
                              <Play size={10} className="fill-current ml-0.5" />
                            </button>
                            <span className="text-[11px] tabular-nums text-slate-300">08:14 / 24:00</span>
                          </div>

                          {/* Waveform / Scrubber Progress Bar */}
                          <div className="flex-1 mx-4 relative h-2 bg-white/20 rounded-full overflow-hidden">
                            <div className="bg-[#FF6B2C] h-full w-[35%] rounded-full" />
                          </div>

                          <div className="flex items-center gap-2 text-slate-300">
                            <Sliders size={13} />
                            <Maximize2 size={13} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Recordings Mini Grid */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#111318]">
                        Recent Team Recordings
                      </h4>
                      <Link href="/desktop" className="text-xs font-semibold text-[#FF6B2C] hover:text-[#E85A1F] flex items-center gap-1">
                        <span>View all</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {/* Recording Card 1 */}
                      <div className="rounded-xl border border-[#E5E7EB] bg-white p-3 hover:border-[#FF6B2C]/50 hover:shadow-sm transition-all group cursor-pointer">
                        <div className="relative rounded-lg overflow-hidden bg-[#17191F] aspect-[16/10] flex items-center justify-center">
                          <div className="text-center text-white p-2">
                            <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#FF6B2C] flex items-center justify-center mx-auto transition-colors">
                              <Play size={14} className="fill-current ml-0.5" />
                            </div>
                          </div>
                          <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-mono text-white">
                            04:32
                          </span>
                        </div>
                        <div className="mt-2.5">
                          <p className="text-xs font-semibold text-[#111318] truncate">
                            Sprint 42 Demo & UI Walkthrough
                          </p>
                          <div className="mt-1 flex items-center justify-between text-[11px] text-[#667085]">
                            <span>Eric Va</span>
                            <span>1.4k views · 2h ago</span>
                          </div>
                        </div>
                      </div>

                      {/* Recording Card 2 */}
                      <div className="rounded-xl border border-[#E5E7EB] bg-white p-3 hover:border-[#FF6B2C]/50 hover:shadow-sm transition-all group cursor-pointer">
                        <div className="relative rounded-lg overflow-hidden bg-[#17191F] aspect-[16/10] flex items-center justify-center">
                          <div className="text-center text-white p-2">
                            <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#FF6B2C] flex items-center justify-center mx-auto transition-colors">
                              <Play size={14} className="fill-current ml-0.5" />
                            </div>
                          </div>
                          <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-mono text-white">
                            12:10
                          </span>
                        </div>
                        <div className="mt-2.5">
                          <p className="text-xs font-semibold text-[#111318] truncate">
                            Client Onboarding Video: Acme Corp
                          </p>
                          <div className="mt-1 flex items-center justify-between text-[11px] text-[#667085]">
                            <span>Sarah K.</span>
                            <span>892 views · 1d ago</span>
                          </div>
                        </div>
                      </div>

                      {/* Recording Card 3 */}
                      <div className="rounded-xl border border-[#E5E7EB] bg-white p-3 hover:border-[#FF6B2C]/50 hover:shadow-sm transition-all group cursor-pointer hidden lg:block">
                        <div className="relative rounded-lg overflow-hidden bg-[#17191F] aspect-[16/10] flex items-center justify-center">
                          <div className="text-center text-white p-2">
                            <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#FF6B2C] flex items-center justify-center mx-auto transition-colors">
                              <Play size={14} className="fill-current ml-0.5" />
                            </div>
                          </div>
                          <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-mono text-white">
                            02:45
                          </span>
                        </div>
                        <div className="mt-2.5">
                          <p className="text-xs font-semibold text-[#111318] truncate">
                            Bug Report: Timeline Keyframe Sync
                          </p>
                          <div className="mt-1 flex items-center justify-between text-[11px] text-[#667085]">
                            <span>David M.</span>
                            <span>312 views · 3d ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DownloadModal isOpen={downloadOpen} onClose={() => setDownloadOpen(false)} />
    </section>
  );
}
