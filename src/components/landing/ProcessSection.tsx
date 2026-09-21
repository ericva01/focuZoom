"use client";

import { useState } from "react";
import { ArrowRight, Plus, Minus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProcessStep {
  id: string;
  code: string;
  tag: string;
  title: string;
  description: string;
  image?: string;
  bullets?: string[];
}

export function ProcessSection() {
  const [activeStep, setActiveStep] = useState<string>("B-02");

  const steps: ProcessStep[] = [
    {
      id: "step-1",
      code: "A-01",
      tag: "INPUT PIPELINE",
      title: "Drop or Capture Screen Footage",
      description:
        "Import any standard 4K/1080p MP4 or WebM video, or record your screen and webcam directly inside your browser with zero plugins.",
      bullets: ["Zero cloud upload latency", "Local browser memory caching", "WebCodecs hardware decode"],
    },
    {
      id: "step-2",
      code: "B-02",
      tag: "CORE ENGINE",
      title: "Intelligent Focal Centering & Auto-Zoom",
      description:
        "Our engine automatically identifies cursor clicks and code changes, gliding camera dolly zooms seamlessly without jumping or resetting to 1.0x.",
      image: "/liquid-purple.jpg",
      bullets: ["Unified multi-click clusters", "Catmull-Rom spline tracking", "Critically damped spring pans"],
    },
    {
      id: "step-3",
      code: "C-03",
      tag: "STUDIO STAGE",
      title: "3D Perspective Slant & Ambient Shadows",
      description:
        "Frame your recordings inside sleek curved bezels, customize background mesh gradients, and elevate your videos with volumetric glass lighting.",
      bullets: ["Three.js WebGL rendering", "Customizable padding & roundness", "Transparent alpha channel"],
    },
    {
      id: "step-4",
      code: "D-04",
      tag: "INSTANT RENDER",
      title: "Zero-Latency Client-Side 60 FPS Export",
      description:
        "Generate production-ready video files directly on your machine in seconds. No watermarks, no server queues, and total privacy for proprietary code.",
      bullets: ["60 FPS smooth rendering", "Lossless WebM & MP4 output", "100% private & client-side"],
    },
  ];

  return (
    <section id="process" className="py-24 lg:py-32 relative bg-[#04060b] text-white overflow-hidden select-none border-t border-white/[0.06]">
      {/* Background Subtle Ambient Aura */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-purple-900/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-3">
          <div className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
            HOW IT WORKS
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Our Production Process
          </h2>
        </div>

        {/* Process Items Stack */}
        <div className="space-y-4">
          {steps.map((step) => {
            const isActive = activeStep === step.code;

            return (
              <div
                key={step.code}
                onClick={() => setActiveStep(isActive ? "" : step.code)}
                className={`relative rounded-2xl sm:rounded-3xl transition-all duration-500 overflow-hidden cursor-pointer border ${
                  isActive
                    ? "bg-gradient-to-r from-purple-950/70 via-[#100720]/80 to-purple-950/70 border-purple-500/40 shadow-[0_15px_40px_rgba(147,51,234,0.18)]"
                    : "bg-[#080b14]/70 hover:bg-[#0c101d] border-white/[0.06] hover:border-white/[0.12]"
                }`}
              >
                {/* Collapsed/Header Row */}
                <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Left: Index & Code */}
                  <div className="flex items-center gap-6 sm:gap-10">
                    <span className="text-xs font-mono text-slate-500">
                      {step.code.slice(2)}
                    </span>
                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-mono">
                      {step.code}
                    </h3>
                  </div>

                  {/* Middle: Tag & Title */}
                  <div className="flex-1 md:px-8 space-y-1">
                    <div className="text-[10px] font-mono tracking-wider text-[#FF6B2C] uppercase">
                      {step.tag}
                    </div>
                    <div className="text-base sm:text-lg font-medium text-white">
                      {step.title}
                    </div>
                  </div>

                  {/* Right: Expand Icon */}
                  <div className="flex items-center justify-end">
                    <div
                      className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                        isActive
                          ? "bg-purple-500/20 border-purple-400/50 text-white"
                          : "border-white/10 text-slate-400 group-hover:text-white"
                      }`}
                    >
                      {isActive ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Content with Fluid Art Accent */}
                {isActive && (
                  <div className="px-6 pb-8 sm:px-8 sm:pb-10 pt-2 border-t border-white/[0.06] grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-in fade-in slide-in-from-top-3 duration-300">
                    <div className="md:col-span-7 space-y-4">
                      <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                        {step.description}
                      </p>

                      {step.bullets && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {step.bullets.map((b, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 rounded-full text-xs font-mono bg-white/[0.04] border border-white/10 text-slate-300"
                            >
                              • {b}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="pt-4">
                        <Link href="/editor">
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer shadow-sm active:scale-95"
                          >
                            <span>Try in Editor</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                      </div>
                    </div>

                    {step.image && (
                      <div className="md:col-span-5 relative h-44 sm:h-52 rounded-2xl overflow-hidden border border-purple-400/30 shadow-lg">
                        <Image
                          src={step.image}
                          alt={step.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-950/80 via-transparent to-transparent" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
