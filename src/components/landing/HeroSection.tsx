"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Download, MousePointer2, Play, ShieldCheck, Sparkles } from "lucide-react";
import { DownloadModal } from "@/components/common/DownloadModal";

export function HeroSection() {
  const [downloadOpen, setDownloadOpen] = useState(false);
  return (
    <section className="relative overflow-hidden bg-[#030509] pb-14 pt-14 text-white sm:pb-20 sm:pt-20 lg:pt-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_35%,rgba(139,92,246,0.12),transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-300/5 px-3 py-1.5 text-xs font-medium text-rose-200"><Sparkles size={14} /> A little motion. A big difference.</div>
            <h1 className="max-w-xl text-5xl font-semibold leading-[1.06] tracking-[-0.055em] sm:text-6xl xl:text-7xl">Your screen.<br />A better <span className="text-rose-300">story.</span></h1>
            <p className="mt-6 max-w-md text-base leading-7 text-slate-400 sm:text-lg">Turn everyday screen recordings into beautiful product demos. Smooth zooms, polished cursors, and a stage that makes your work shine.</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/editor" className="group inline-flex items-center gap-3 rounded-full bg-rose-300 px-6 py-3.5 text-sm font-semibold text-[#160b10] transition-colors hover:bg-rose-200">Start creating <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></Link>
              <a href="#process" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3.5 text-sm text-slate-200 hover:bg-white/5"><Play size={14} /> See how it works</a>
            </div>
            <div className="mt-7 flex items-center gap-2 text-xs text-slate-500"><ShieldCheck size={15} className="text-emerald-300" /> Local editing. Your recordings stay yours.</div>
          </div>
          <div className="relative min-w-0">
            <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#0d111b] shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-[10px] text-slate-400 sm:text-xs">
                <div className="flex items-center gap-1.5" aria-hidden="true"><span className="h-2 w-2 rounded-full bg-rose-300/70" /><span className="h-2 w-2 rounded-full bg-amber-200/70" /><span className="h-2 w-2 rounded-full bg-emerald-200/70" /></div>
                <span>Product walkthrough</span><span className="text-rose-200">Preview</span>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden p-6 sm:p-10">
                <Image src="/liquid-hero.jpg" alt="Iridescent purple and coral studio backdrop" fill priority sizes="(max-width: 1024px) 100vw, 640px" className="object-cover opacity-70" />
                <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-white/20 bg-[#101322]/95 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3"><span className="text-xs font-medium">Your next big idea</span><span className="rounded bg-white/5 px-2 py-1 text-[9px] text-slate-400">Workspace</span></div>
                  <div className="flex flex-1 gap-4 p-4 sm:p-5">
                    <div className="hidden w-16 shrink-0 space-y-3 border-r border-white/10 pr-3 sm:block"><div className="h-2 rounded bg-rose-300/50" /><div className="h-2 rounded bg-white/10" /><div className="h-2 rounded bg-white/10" /><div className="h-2 w-2/3 rounded bg-white/10" /></div>
                    <div className="flex min-w-0 flex-1 flex-col"><span className="text-[9px] uppercase tracking-widest text-slate-500">Overview</span><span className="mt-2 text-lg font-semibold sm:text-xl">Make something great.</span><div className="mt-4 grid flex-1 grid-cols-3 items-end gap-2 rounded-lg border border-white/5 bg-white/[0.02] p-3"><div className="h-1/2 rounded-t bg-purple-400/25" /><div className="h-3/4 rounded-t bg-purple-400/40" /><div className="h-full rounded-t bg-rose-300/70" /></div><div className="mt-3 flex items-center justify-between"><span className="text-[9px] text-slate-500">Ready when you are</span><span className="rounded-md bg-rose-300 px-3 py-1.5 text-[9px] font-semibold text-black">Create project</span></div></div>
                  </div>
                </div>
                <MousePointer2 aria-hidden="true" className="absolute bottom-10 right-10 fill-white text-white drop-shadow-lg sm:bottom-14 sm:right-14" size={26} />
                <div className="absolute left-3 top-4 flex items-center gap-2 rounded-full border border-white/20 bg-[#101322]/90 px-3 py-2 text-[10px] text-white backdrop-blur sm:left-5"><Sparkles size={12} className="text-rose-300" /> Auto-zoom, effortlessly</div>
              </div>
              <div className="flex items-center gap-3 border-t border-white/10 px-4 py-4"><Play size={12} className="text-rose-300" /><span className="text-[9px] tabular-nums text-slate-400">00:08</span><div className="relative h-6 flex-1 rounded bg-purple-400/15"><div className="absolute inset-y-1 left-1 w-2/3 rounded bg-gradient-to-r from-purple-400/30 to-rose-300/40" /><div className="absolute -bottom-1 -top-1 left-1/3 w-px bg-rose-200" /></div><span className="text-[9px] text-slate-500">00:24</span></div>
            </div>
            <p className="mt-4 text-center text-xs text-slate-500">A polished demo starts with a simple recording.</p>
          </div>
        </div>
        <div className="mt-16 flex flex-col justify-between gap-5 border-t border-white/10 pt-7 sm:flex-row sm:items-center lg:mt-20">
          <p className="text-sm text-slate-500">Built for <span className="text-slate-300">makers, educators, and teams.</span></p>
          <button onClick={() => setDownloadOpen(true)} className="inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-rose-200"><Download size={15} /> Prefer your desktop? Get the app <ArrowUpRight size={15} /></button>
        </div>
      </div>
      <DownloadModal isOpen={downloadOpen} onClose={() => setDownloadOpen(false)} />
    </section>
  );
}
