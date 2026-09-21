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
  Heart,
  ShieldCheck,
  Code2,
} from "lucide-react";

export function AboutView() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("ericva014@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-20 lg:space-y-28 relative select-none">
      {/* 1. HERO ABOUT SECTION */}
      <section className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left: Brand Icon Showcase / Visual Card */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="relative w-full max-w-[420px] aspect-square rounded-3xl overflow-hidden border border-[#E5E7EB] bg-gradient-to-br from-[#FFF1E8] via-white to-[#F8F9FB] shadow-xl p-8 flex flex-col justify-between group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF6B2C] bg-[#FFF1E8] px-3 py-1 rounded-full border border-[#FF6B2C]/20">
                ORIGIN // 2026
              </span>
              <span className="text-xs font-mono text-[#667085]">v2.4 STABLE</span>
            </div>

            <div className="my-auto flex flex-col items-center text-center">
              <div className="relative w-28 h-28 rounded-3xl bg-white shadow-md border border-[#E5E7EB] p-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <Image
                  src="/icon.png"
                  alt="Glideo Logo"
                  width={80}
                  height={80}
                  className="object-contain drop-shadow-[0_8px_16px_rgba(255,107,44,0.25)]"
                  priority
                />
              </div>
              <h2 className="mt-6 text-2xl font-black tracking-tight text-[#111318]">Glideo Studio</h2>
              <p className="mt-1 text-xs text-[#667085] font-medium">Screen Recording & Editing Redefined</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B2C] animate-pulse" />
                <span className="text-xs font-mono font-semibold text-[#111318]">VISION & CRAFT // ERIC VA</span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-[#111318] text-white px-2 py-0.5 rounded">MIT</span>
            </div>
          </div>
        </div>

        {/* Right: Compelling Narrative */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/20 text-xs font-bold font-mono text-[#FF6B2C]">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B2C]" />
            <span>THE STORY & PHILOSOPHY</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#111318] tracking-tight leading-[1.1]">
            A clearer way to share what happens on your screen.
          </h1>

          <p className="text-[#667085] text-base sm:text-lg leading-relaxed">
            Glideo is an open-source screen recording and editing studio that turns everyday walkthroughs into polished videos. Bring your recording into the studio, guide attention with smooth automated zooms, and give your work a presentation that feels your own.
          </p>

          <p className="text-[#667085] text-sm sm:text-base leading-relaxed">
            The idea is simple: explaining your work should take less effort. Glideo brings camera motion, cursor effects, 3D stage angles, and webcam overlays into one workspace — running 100% on your local device without cloud surveillance or subscription fees.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link href="/editor">
              <button
                type="button"
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-[#FF6B2C] text-white text-xs font-bold hover:bg-[#E85A1F] transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <span>Launch Web Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-[#F8F9FB] text-[#111318] border border-[#E5E7EB] text-xs font-mono transition-all cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#FF6B2C]" /> : <Copy className="w-3.5 h-3.5 text-[#667085]" />}
              <span>{copied ? "Copied" : "ericva014@gmail.com"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. WHY GLIDEO EXISTS */}
      <section aria-labelledby="purpose-heading" className="border-t border-[#E5E7EB] pt-12 sm:pt-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#FF6B2C]">Why Glideo exists</p>
            <h2 id="purpose-heading" className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111318]">
              Good ideas deserve a clear demonstration.
            </h2>
          </div>
          <div className="space-y-4 text-base leading-relaxed text-[#667085]">
            <p>
              A standard screen recording shows every detail and still leaves viewers wondering where to look. Glideo helps you bring the important moments forward, from a single button click in a code editor to a complete product walkthrough.
            </p>
            <p>
              Its purpose is to make thoughtful video presentation part of your everyday workflow. Start with the footage you have, refine how it looks and moves with smooth Catmull-Rom spline curves, and export a video you can proudly share.
            </p>
          </div>
        </div>
      </section>

      {/* 3. CAPABILITIES */}
      <section aria-labelledby="capabilities-heading">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#FF6B2C]">Inside the studio</p>
          <h2 id="capabilities-heading" className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111318]">
            From raw recording to a polished story.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Focus,
              title: "Guide the viewer",
              description: "Use camera zooms, perspective, and cursor effects to draw attention to the details that matter. Adjust focal points on the timeline as you refine your video.",
            },
            {
              icon: Palette,
              title: "Make it feel like you",
              description: "Shape your presentation with backgrounds, padding, rounded frames, and shadows. Add a webcam overlay when your explanation needs a personal touch.",
            },
            {
              icon: Monitor,
              title: "Work on your device",
              description: "Edit in the web studio or use the desktop app. Video processing and rendering happen on your device with zero cloud tracking.",
            },
          ].map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-2xl sm:rounded-3xl border border-[#E5E7EB] bg-white p-8 shadow-xs hover:border-[#FF6B2C]/40 transition-colors">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF1E8] text-[#FF6B2C]">
                <Icon size={22} aria-hidden="true" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-[#111318]">{title}</h3>
              <p className="text-sm leading-relaxed text-[#667085]">{description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 4. AUDIENCE */}
      <section aria-labelledby="audience-heading" className="grid gap-10 rounded-3xl border border-[#E5E7EB] bg-white p-8 sm:p-12 lg:grid-cols-2 shadow-xs">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#FF6B2C]">Made for everyday explanations</p>
          <h2 id="audience-heading" className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111318]">
            For people with something to show.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#667085]">
            Whether you are teaching a process, introducing a product, or sharing progress with your team, Glideo makes your screen effortless to follow.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {[
            ["Product teams", "Demonstrate a feature, walk through an update, or explain how your product works."],
            ["Educators", "Create tutorials and lessons that keep the next step in clear focus."],
            ["Designers & developers", "Present an interface, explain a workflow, or share a project pull request."],
            ["Creators", "Give screen-based videos a consistent, high-production look for your audience."],
          ].map(([title, description]) => (
            <div key={title} className="space-y-1">
              <h3 className="text-base font-bold text-[#111318]">{title}</h3>
              <p className="text-xs leading-relaxed text-[#667085]">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. WORKFLOW */}
      <section aria-labelledby="workflow-heading">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#FF6B2C]">Your first video</p>
          <h2 id="workflow-heading" className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111318]">
            A simple place to start.
          </h2>
        </div>

        <ol className="grid gap-6 md:grid-cols-3">
          {[
            ["Bring your footage", "Record your screen directly in the studio or import an existing video recording."],
            ["Refine the presentation", "Set your framing, adjust camera motion, trim clips, and preview live on the timeline."],
            ["Export and share", "Choose export settings, render your video with GPU acceleration, and save it locally."],
          ].map(([title, description], index) => (
            <li key={title} className="rounded-2xl sm:rounded-3xl border border-[#E5E7EB] bg-white p-8 shadow-xs">
              <span className="text-xs font-mono font-bold text-[#FF6B2C] bg-[#FFF1E8] px-2.5 py-1 rounded-md">
                0{index + 1}
              </span>
              <h3 className="mb-2 mt-4 text-lg font-bold text-[#111318]">{title}</h3>
              <p className="text-xs leading-relaxed text-[#667085]">{description}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 6. CREATOR & GET IN TOUCH */}
      <section aria-labelledby="creator-heading" className="grid gap-8 border-t border-[#E5E7EB] pt-12 sm:pt-16 lg:grid-cols-2 lg:gap-16 items-center">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#FF6B2C]">Behind Glideo</p>
          <h2 id="creator-heading" className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111318]">
            Created by Eric Va.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#667085]">
            Glideo is an open-source project by Eric Va, combining screen recording and cinematic camera motion into a focused editing workspace. Have a question, found an issue, or want to contribute a feature? Get in touch and let us know.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#FF6B2C] hover:text-[#E85A1F] transition-colors"
            >
              <span>Contact Eric</span>
              <ArrowUpRight size={16} />
            </Link>
            <a
              href="https://github.com/ericva01/focuZoom"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#111318] hover:text-[#FF6B2C] transition-colors"
            >
              <span>GitHub Repository</span>
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>

        <div className="rounded-3xl border border-[#111318] bg-[#111318] text-white p-8 sm:p-10 shadow-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#FF8A4C] mb-4">
            <Sparkles size={13} />
            <span>Ready to create?</span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-white">
            Give your next recording a little more focus.
          </h3>
          <p className="mt-3 text-xs leading-relaxed text-slate-400">
            Open the studio in your browser or desktop app and start with a recording of your own.
          </p>
          <div className="mt-6">
            <Link
              href="/editor"
              className="inline-flex items-center gap-3 rounded-xl bg-[#FF6B2C] hover:bg-[#E85A1F] px-6 py-3.5 text-xs font-bold text-white transition-all shadow-sm active:scale-95"
            >
              <span>Open studio</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
