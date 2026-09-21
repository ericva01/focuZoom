import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { RecordingWorkflow } from "@/components/landing/RecordingWorkflow";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { ArrowRight, Focus, ShieldCheck, Sparkles, Sliders, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Product Overview — FucuFlow Studio",
  description: "Discover FucuFlow's complete studio suite for modern screen recordings, automated zoom keyframes, and local-first video creation.",
};

export default function ProductPage() {
  return (
    <div className="website-ui min-h-screen flex flex-col bg-[#F8F9FB] text-[#111318] selection:bg-[#FFF1E8] selection:text-[#FF6B2C]">
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-20 border-b border-[#E5E7EB] bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/20 text-xs font-semibold text-[#FF6B2C] mb-6">
                <Sparkles size={14} />
                <span>The Video Studio Reimagined</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111318] leading-[1.1]">
                Every tool you need to create <span className="text-[#FF6B2C]">studio-grade</span> video.
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-[#667085] leading-relaxed">
                Glideo is a fast, modern, and open-source video creation suite. Record your screen, automatically animate smooth camera focus, trim multiple tracks, and export crisp 4K videos without subscription paywalls or cloud lock-in.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/editor"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B2C] px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-[#E85A1F] transition-all"
                >
                  <span>Launch Web Studio</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/features"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-6 py-3.5 text-sm font-bold text-[#111318] hover:bg-[#F8F9FB] transition-all"
                >
                  <span>Explore Features</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Core Value Pillars */}
        <section className="py-20 border-b border-[#E5E7EB] bg-[#F8F9FB]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-[#111318]">
                Engineered for speed, precision, and privacy.
              </h2>
              <p className="mt-3 text-sm text-[#667085]">
                Built from the ground up to replace clunky legacy recording tools with a browser and desktop engine.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="rounded-3xl border border-[#E5E7EB] bg-white p-8 shadow-xs hover:border-[#FF6B2C]/40 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF1E8] text-[#FF6B2C] flex items-center justify-center mb-6">
                  <Focus size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#111318]">Automated Zoom Framing</h3>
                <p className="mt-3 text-sm text-[#667085] leading-relaxed">
                  Automatically tracks your clicks and interactions, synthesizing smooth Catmull-Rom spline camera dollies so your audience never loses focus.
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-[#111318] font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#FF6B2C]" />
                    <span>Auto-burst click grouping</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#FF6B2C]" />
                    <span>Dynamic focal center calculation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#FF6B2C]" />
                    <span>Custom zoom speeds & hold spans</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-3xl border border-[#E5E7EB] bg-white p-8 shadow-xs hover:border-[#FF6B2C]/40 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF1E8] text-[#FF6B2C] flex items-center justify-center mb-6">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#111318]">100% Local User Storage</h3>
                <p className="mt-3 text-sm text-[#667085] leading-relaxed">
                  Your video files never upload to third-party cloud servers. Everything is recorded, processed, stored, and exported directly on your local device.
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-[#111318] font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#FF6B2C]" />
                    <span>Local disk & IndexedDB storage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#FF6B2C]" />
                    <span>Zero telemetry or tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#FF6B2C]" />
                    <span>Compliant with enterprise security</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-3xl border border-[#E5E7EB] bg-white p-8 shadow-xs hover:border-[#FF6B2C]/40 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF1E8] text-[#FF6B2C] flex items-center justify-center mb-6">
                  <Sliders size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#111318]">Pro Multi-Track Timeline</h3>
                <p className="mt-3 text-sm text-[#667085] leading-relaxed">
                  Split clips, ripple delete unwanted pauses, preview live audio waveforms, and snap keyframe timestamps with millisecond accuracy.
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-[#111318] font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#FF6B2C]" />
                    <span>Split (S) and Ripple Delete (Shift+Del)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#FF6B2C]" />
                    <span>Live Web Audio waveform rendering</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#FF6B2C]" />
                    <span>Sub-second precision magnetic snapping</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <RecordingWorkflow />

        {/* Final CTA */}
        <FinalCtaSection />
      </main>

      <Footer />
    </div>
  );
}
