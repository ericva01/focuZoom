import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { ArrowRight, Sparkles, Code2, Heart, Terminal, Lock, CheckCircle2, Cpu } from "lucide-react";

export const metadata = {
  title: "Open Source — Glideo Studio",
  description: "Glideo is 100% Free & Open Source under the permissive MIT License. Zero telemetry, local-first architecture, and community driven.",
};

export default function OpenSourcePage() {
  return (
    <div className="website-ui min-h-screen flex flex-col bg-[#F8F9FB] text-[#111318] selection:bg-[#FFF1E8] selection:text-[#FF6B2C]">
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* Open Source Header */}
        <section className="relative overflow-hidden pt-16 pb-20 border-b border-[#E5E7EB] bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/20 text-xs font-semibold text-[#FF6B2C] mb-6">
                <Sparkles size={14} />
                <span>MIT Licensed Software</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111318] leading-[1.1]">
                100% Free & <span className="text-[#FF6B2C]">Open Source</span>.
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-[#667085] leading-relaxed">
                We believe video creation software should be open, private, and accessible to everyone. No recurring subscription fees, no artificial export limitations, and no cloud surveillance.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="https://github.com/ericva01/focuZoom"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#111318] hover:bg-[#22252e] text-white px-6 py-3.5 text-sm font-bold shadow-sm transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>Star on GitHub</span>
                  <span className="px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-mono">MIT</span>
                </a>
                <Link
                  href="/editor"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B2C] px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-[#E85A1F] transition-all"
                >
                  <span>Launch Web Studio</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* The 4 Tenets */}
        <section className="py-20 border-b border-[#E5E7EB] bg-[#F8F9FB]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#FFF1E8] text-[#FF6B2C] flex items-center justify-center mb-4">
                  <Heart size={20} />
                </div>
                <h3 className="text-base font-bold text-[#111318] mb-2">Permissive MIT License</h3>
                <p className="text-xs text-[#667085] leading-relaxed">
                  Use Glideo for personal, educational, commercial, or team projects with zero licensing restrictions.
                </p>
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#FFF1E8] text-[#FF6B2C] flex items-center justify-center mb-4">
                  <Lock size={20} />
                </div>
                <h3 className="text-base font-bold text-[#111318] mb-2">Local User Storage</h3>
                <p className="text-xs text-[#667085] leading-relaxed">
                  Every byte of video recorded is stored directly on your computer. Zero server uploads, zero surveillance.
                </p>
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#FFF1E8] text-[#FF6B2C] flex items-center justify-center mb-4">
                  <Code2 size={20} />
                </div>
                <h3 className="text-base font-bold text-[#111318] mb-2">Transparent Source Code</h3>
                <p className="text-xs text-[#667085] leading-relaxed">
                  Audit every line of code on GitHub. Built with Next.js 14, React 18, Web Audio API, and HTML5 Canvas.
                </p>
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#FFF1E8] text-[#FF6B2C] flex items-center justify-center mb-4">
                  <Cpu size={20} />
                </div>
                <h3 className="text-base font-bold text-[#111318] mb-2">Self-Hostable</h3>
                <p className="text-xs text-[#667085] leading-relaxed">
                  Run Glideo entirely offline on your internal network, air-gapped machine, or deploy your own private web instance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Developer Quickstart */}
        <section className="py-20 border-b border-[#E5E7EB] bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8F9FB] border border-[#E5E7EB] text-xs font-mono text-[#667085]">
                  <Terminal size={14} />
                  <span>Developer Quickstart</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-[#111318]">
                  Clone and run locally in seconds.
                </h2>
                <p className="text-sm text-[#667085] leading-relaxed">
                  Glideo is built with standard web technologies. No complex docker containers or database setups required. Just clone, install, and run.
                </p>
                <div className="space-y-3 text-xs text-[#111318]">
                  <div className="flex items-center gap-2 font-medium">
                    <CheckCircle2 size={16} className="text-[#FF6B2C]" />
                    <span>Works fully offline without an internet connection</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <CheckCircle2 size={16} className="text-[#FF6B2C]" />
                    <span>Desktop Electron support for global shortcuts</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <CheckCircle2 size={16} className="text-[#FF6B2C]" />
                    <span>Active community roadmap and pull request review</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-[#17191F] rounded-2xl p-6 border border-white/10 text-white font-mono text-xs shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-slate-400 text-[11px]">bash terminal</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-slate-500"># 1. Clone the repository</p>
                  <p className="text-[#FF8A4C]">git clone https://github.com/ericva01/focuZoom.git</p>
                  <p className="text-slate-500 pt-2"># 2. Navigate into workspace</p>
                  <p className="text-[#FF8A4C]">cd focuZoom</p>
                  <p className="text-slate-500 pt-2"># 3. Install dependencies</p>
                  <p className="text-[#FF8A4C]">npm install</p>
                  <p className="text-slate-500 pt-2"># 4. Start local development server</p>
                  <p className="text-[#FF8A4C]">npm run dev</p>
                  <p className="text-emerald-400 pt-3 font-semibold">
                    ✓ Ready on http://localhost:3000
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <FinalCtaSection />
      </main>

      <Footer />
    </div>
  );
}
