"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  Focus,
  Palette,
  Monitor,
  ArrowUpRight,
} from "lucide-react";

export function AboutView() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("ericva014@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-20 lg:space-y-28 relative">
      {/* Huge Background Outline Watermark (Opticore Style) */}
      <div className="absolute -top-16 right-0 text-7xl sm:text-9xl lg:text-[14rem] font-extrabold tracking-widest text-white/[0.03] font-mono select-none pointer-events-none uppercase">
        ABOUT
      </div>

      {/* ========================================================================= */}
      {/* 1. HERO ABOUT SECTION (3D Liquid Silk on Left, Story on Right)            */}
      {/* ========================================================================= */}
      <section className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left: 3D Iridescent Purple Fluid Swirl Asset */}
        <div className="lg:col-span-6 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-700/25 via-rose-500/20 to-transparent rounded-full blur-[120px] pointer-events-none" />

          <div className="relative w-full max-w-[480px] aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(168,85,247,0.2)] group backdrop-blur-2xl">
            <Image
              src="/liquid-purple.jpg"
              alt="Glideo Liquid Fluid Sculpture"
              fill
              priority
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-4 left-4 p-3 rounded-2xl bg-black/60 border border-white/15 backdrop-blur-xl flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="text-xs font-mono text-white">VISION & CRAFT // ERIC VA</span>
            </div>
          </div>
        </div>

        {/* Right: Compelling Narrative (Opticore Style) */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-rose-300">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>THE STORY & PHILOSOPHY</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            A clearer way to share what happens on your screen.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Glideo is a screen recording and editing studio that turns everyday walkthroughs into polished videos. Bring your recording into the studio, guide attention with smooth zooms, and give your work a presentation that feels your own.
          </p>

          <p className="text-slate-400 text-sm leading-relaxed">
            The idea is simple: explaining your work should take less effort. Glideo brings camera motion, cursor effects, framing, and webcam overlays into one workspace, so you can spend more time on your story.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link href="/editor">
              <button
                type="button"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white text-black text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer shadow-md active:scale-95"
              >
                <span>Launch Web Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-rose-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? "Copied" : "ericva014@gmail.com"}</span>
            </button>
          </div>
        </div>
      </section>

      <section aria-labelledby="purpose-heading" className="border-t border-white/10 pt-12 sm:pt-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-rose-300">Why Glideo exists</p>
            <h2 id="purpose-heading" className="max-w-lg text-3xl font-semibold tracking-tight sm:text-4xl">Good ideas deserve a clear demonstration.</h2>
          </div>
          <div className="space-y-4 text-base leading-7 text-slate-400">
            <p>A screen recording can show every detail and still leave viewers wondering where to look. Glideo helps you bring the important moments forward, from a single button click to a complete product walkthrough.</p>
            <p>Its purpose is to make thoughtful video presentation part of your everyday workflow. Start with the footage you have, refine how it looks and moves, and export a video you can share.</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="capabilities-heading">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-rose-300">Inside the studio</p>
        <h2 id="capabilities-heading" className="mb-8 text-3xl font-semibold tracking-tight sm:text-4xl">From raw recording to a polished story.</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Focus, title: "Guide the viewer", description: "Use camera zooms, perspective, and cursor effects to draw attention to the details that matter. Adjust focal points on the timeline as you refine your video." },
            { icon: Palette, title: "Make it feel like you", description: "Shape your presentation with backgrounds, padding, rounded frames, and shadows. Add a webcam overlay when your explanation needs a personal touch." },
            { icon: Monitor, title: "Work on your device", description: "Edit in the web studio or use the Windows desktop app. Video processing and rendering happen on your device, with an export you can save and share." },
          ].map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-400/10 text-purple-300"><Icon size={22} aria-hidden="true" /></div>
              <h3 className="mb-3 text-xl font-medium text-white">{title}</h3>
              <p className="text-sm leading-7 text-slate-400">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="audience-heading" className="grid gap-10 rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/[0.08] to-rose-500/[0.04] p-6 sm:p-10 lg:grid-cols-2 lg:p-12">
        <div>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-rose-300">Made for everyday explanations</p>
          <h2 id="audience-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">For people with something to show.</h2>
          <p className="mt-5 text-sm leading-7 text-slate-400">Whether you are teaching a process, introducing a product, or sharing progress with your team, Glideo helps make your screen easier to follow.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {[
            ["Product teams", "Demonstrate a feature, walk through an update, or explain how your product works."],
            ["Educators", "Create tutorials and lessons that keep the next step in focus."],
            ["Designers & developers", "Present an interface, explain a workflow, or share a project walkthrough."],
            ["Creators", "Give screen-based videos a consistent look for your audience."],
          ].map(([title, description]) => (
            <div key={title}><h3 className="mb-2 text-base font-medium text-white">{title}</h3><p className="text-sm leading-6 text-slate-400">{description}</p></div>
          ))}
        </div>
      </section>

      <section aria-labelledby="workflow-heading">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-rose-300">Your first video</p>
        <h2 id="workflow-heading" className="mb-8 text-3xl font-semibold tracking-tight sm:text-4xl">A simple place to start.</h2>
        <ol className="grid gap-8 md:grid-cols-3">
          {[
            ["Bring your footage", "Record your screen in the studio or import an existing recording to begin."],
            ["Refine the presentation", "Set your framing, adjust camera motion, and preview your changes on the timeline."],
            ["Export and share", "Choose your export settings, render your video, and save it to your device."],
          ].map(([title, description], index) => (
            <li key={title} className="border-t border-white/10 pt-6">
              <span className="text-sm font-mono text-rose-300">0{index + 1}</span>
              <h3 className="mb-3 mt-4 text-xl font-medium">{title}</h3>
              <p className="text-sm leading-7 text-slate-400">{description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="creator-heading" className="grid gap-8 border-t border-white/10 pt-12 sm:pt-16 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-rose-300">Behind Glideo</p>
          <h2 id="creator-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">Created by Eric Va.</h2>
          <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400">Glideo is a project by Eric Va, bringing screen recording and cinematic presentation into a focused editing workspace. Have a question, found an issue, or have an idea for the studio? Get in touch and share it.</p>
          <Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-rose-300 transition-colors hover:text-rose-200">Contact Eric <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className="flex flex-col items-start justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <h3 className="text-2xl font-semibold tracking-tight">Give your next recording a little more focus.</h3>
          <p className="mt-3 text-sm leading-7 text-slate-400">Open the studio and start with a recording of your own.</p>
          <Link href="/editor" className="mt-6 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-rose-100">Open studio <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </section>
    </div>
  );
}
