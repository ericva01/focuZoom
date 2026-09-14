"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Quote,
  Mail,
  Check,
  ArrowRight,
  ShieldCheck,
  Video,
  Laptop,
  Zap,
  Download,
  Code2,
} from "lucide-react";
import { DownloadModal } from "@/components/common/DownloadModal";

export function AboutView() {
  const [copied, setCopied] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("ericva014@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-16 lg:space-y-24 select-none">
      {/* ========================================================================= */}
      {/* 1. HERO & CREATOR MESSAGE HEADER                                          */}
      {/* ========================================================================= */}
      <section className="text-center max-w-3xl mx-auto space-y-5">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.15]">
          Crafting tools so you can showcase your best work.
        </h1>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Glideo was born from a simple desire: making professional screen demos effortless, beautiful, and accessible to creators worldwide.
        </p>
      </section>

      {/* ========================================================================= */}
      {/* 2. FEATURED CREATOR QUOTE BANNER (ERIC VA / ERIC LVIS)                     */}
      {/* ========================================================================= */}
      <section className="relative max-w-4xl mx-auto">
        <div className="relative p-6 sm:p-10 lg:p-12 rounded-3xl bg-[#080D1A] border border-white/[0.12] shadow-[0_20px_60px_rgba(0,0,0,0.6)] space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-rose-400 flex-shrink-0">
              <Quote className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">A note from the creator</div>
            </div>
          </div>

          {/* User's Exact Quote */}
          <blockquote className="text-lg sm:text-2xl lg:text-3xl font-medium text-white leading-snug sm:leading-relaxed font-sans">
            &ldquo;Hi Guy I&apos;m Eric Va or Eric Lvis , i make this for all of you guy to easy to make a demo it can help you a little bit hope you guy have a nice day and scucess on your project&rdquo;
          </blockquote>

          {/* Creator Profile Stamp */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-rose-400 to-indigo-600 p-[1.5px] shadow-[0_0_15px_rgba(251,113,133,0.3)]">
                <div className="w-full h-full rounded-full bg-[#080D1A] flex items-center justify-center font-bold text-sm text-white font-mono">
                  EV
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-white flex items-center gap-2">
                  <span>Eric Va</span>
                  <span className="text-xs font-normal text-slate-400">(Eric Lvis)</span>
                </div>
                <div className="text-xs text-rose-300 font-mono">Creator & Lead Developer · Glideo</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-xs font-medium text-slate-200 border border-white/10 hover:border-white/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-rose-400" />
                    <span>Copied ericva014@gmail.com</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-3.5 h-3.5 text-rose-400" />
                    <span>Email Eric</span>
                  </>
                )}
              </button>
              <Link
                href="/contact"
                className="px-3.5 py-1.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-xs font-medium text-rose-200 border border-rose-400/30 transition-all flex items-center gap-1"
              >
                <span>Send Message</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. THE STORY: WHY GLIDEO WAS BUILT                                      */}
      {/* ========================================================================= */}
      <section className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Why Glideo Was Built</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Traditional screen recording editors are bloated, expensive, and require endless manual keyframing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Easy Demos */}
          <div className="p-6 rounded-2xl sm:rounded-3xl bg-[#080D1A]/70 border border-white/10 hover:border-rose-400/30 backdrop-blur-xl transition-all space-y-4 group">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-400/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Effortless Demo Creation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No need to spend hours manually animating camera positions in complex NLEs. Drop in your screen capture, set keyframe focal targets, and let spring physics handle the smooth transitions.
            </p>
          </div>

          {/* Card 2: 100% Privacy */}
          <div className="p-6 rounded-2xl sm:rounded-3xl bg-[#080D1A]/70 border border-white/10 hover:border-rose-400/30 backdrop-blur-xl transition-all space-y-4 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">100% Privacy & In-Browser</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your confidential code, internal dashboards, and prototypes never get sent to third-party cloud servers. All rendering and frame export executes right on your device.
            </p>
          </div>

          {/* Card 3: Free & Accessible */}
          <div className="p-6 rounded-2xl sm:rounded-3xl bg-[#080D1A]/70 border border-white/10 hover:border-rose-400/30 backdrop-blur-xl transition-all space-y-4 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Built for All of You</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Whether you are an indie founder pitching on X, a student sharing a school project, or a dev team recording a changelog demo — Glideo is here to help you succeed.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CROSS-PLATFORM FREEDOM (WEB & DESKTOP)                                 */}
      {/* ========================================================================= */}
      <section className="max-w-5xl mx-auto p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#080D1A] via-[#0A1024] to-[#080D1A] border border-white/10 backdrop-blur-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-rose-300">
              <Laptop className="w-3.5 h-3.5 text-rose-400" />
              <span>Web + Desktop Hybrid</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Work where you are most productive.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed">
              Use Glideo directly in Google Chrome without installing anything, or download our dedicated standalone Electron desktop app for offline hardware-accelerated rendering and local file saving.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/editor">
                <button
                  type="button"
                  className="rounded-full bg-white text-black text-xs sm:text-sm font-semibold px-5 py-2.5 shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:bg-slate-100 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Zap className="w-4 h-4 fill-current text-black" />
                  <span>Launch Web Studio</span>
                </button>
              </Link>
              <button
                type="button"
                onClick={() => setDownloadModalOpen(true)}
                className="rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-rose-400/35 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4 text-rose-400" />
                <span>Get Desktop App</span>
              </button>
            </div>
          </div>

          {/* Quick Specs / Features Box */}
          <div className="space-y-3 p-5 rounded-2xl bg-black/40 border border-white/[0.06]">
            <div className="text-xs text-slate-400 font-medium mb-2">Technical specifications</div>
            <div className="flex items-center justify-between text-xs py-1.5 border-b border-white/[0.06]">
              <span className="text-slate-300">Dynamic 3D Camera Tilts</span>
              <span className="font-mono text-rose-400">Three.js + WebGL</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1.5 border-b border-white/[0.06]">
              <span className="text-slate-300">Fast Playhead Scrubbing</span>
              <span className="font-mono text-emerald-400">60fps fastSeek RAF</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1.5 border-b border-white/[0.06]">
              <span className="text-slate-300">Preset Aspect Ratios</span>
              <span className="font-mono text-slate-300">16:9, 9:16, 1:1, 4:3</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1.5 border-b border-white/[0.06]">
              <span className="text-slate-300">Typography</span>
              <span className="font-mono text-indigo-300">Google Sans</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1.5">
              <span className="text-slate-300">Developer</span>
              <span className="font-mono text-white">Eric Va (Eric Lvis)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. COMMUNITY WISH & CTA BANNER                                            */}
      {/* ========================================================================= */}
      <section className="text-center max-w-2xl mx-auto space-y-5 pb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          Have a nice day and success on your project! 🚀
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          If Glideo helps you make your product demo, share it with the community or drop Eric a note anytime.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-white text-xs sm:text-sm font-semibold transition-all flex items-center gap-2"
          >
            <Mail className="w-4 h-4 text-rose-400" />
            <span>Say Hello to Eric</span>
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-all flex items-center gap-2"
          >
            <Code2 className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        </div>
      </section>

      <DownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
      />
    </div>
  );
}
