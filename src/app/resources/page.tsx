import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { FaqSection } from "@/components/landing/FaqSection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { BookOpen, HardDrive, Keyboard, ArrowRight, ExternalLink, Sparkles, MessageSquare } from "lucide-react";

export const metadata = {
  title: "Resources & Documentation — Glideo Studio",
  description: "User guides, keyboard shortcuts, documentation, and community resources for Glideo Studio.",
};

const shortcuts = [
  { key: "Space", action: "Play or Pause video playback" },
  { key: "S", action: "Split active clip at playhead position" },
  { key: "Del / Backspace", action: "Delete selected clip or zoom keyframe" },
  { key: "Shift + Del", action: "Ripple delete selected clip (close the gap)" },
  { key: "K", action: "Add 3D Dolly Zoom keyframe at playhead" },
  { key: "← / →", action: "Step playback backwards / forwards by 1 frame" },
  { key: "Ctrl + Z", action: "Undo last timeline or config edit" },
  { key: "Ctrl + Y / Shift + Z", action: "Redo last undone change" },
  { key: "Ctrl + S", action: "Save project locally to offline browser storage" },
  { key: "Ctrl + O", action: "Open local video file from computer" },
];

export default function ResourcesPage() {
  return (
    <div className="website-ui min-h-screen flex flex-col bg-[#F8F9FB] text-[#111318] selection:bg-[#FFF1E8] selection:text-[#FF6B2C]">
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* Resources Header */}
        <section className="relative overflow-hidden pt-16 pb-20 border-b border-[#E5E7EB] bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/20 text-xs font-semibold text-[#FF6B2C] mb-6">
                <Sparkles size={14} />
                <span>Documentation & Guides</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111318] leading-[1.1]">
                Everything you need to master <span className="text-[#FF6B2C]">Glideo</span>.
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-[#667085] leading-relaxed">
                Explore guides, reference keyboard shortcuts, understand local storage handling, and get answers to common questions.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <Link
                  href="/editor"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B2C] px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-[#E85A1F] transition-all"
                >
                  <span>Open Studio</span>
                  <ArrowRight size={16} />
                </Link>
                <a
                  href="https://github.com/ericva01/focuZoom"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-6 py-3.5 text-sm font-bold text-[#111318] hover:bg-[#F8F9FB] transition-all"
                >
                  <span>GitHub Repository</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Reference Cards */}
        <section className="py-16 border-b border-[#E5E7EB] bg-[#F8F9FB]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#FFF1E8] text-[#FF6B2C] flex items-center justify-center mb-4">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-base font-bold text-[#111318] mb-2">Getting Started Guide</h3>
                <p className="text-xs text-[#667085] leading-relaxed mb-4">
                  Learn how to capture your screen, record microphone voiceover, auto-align camera focus, and export your first video in under 3 minutes.
                </p>
                <Link href="/editor" className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6B2C] hover:underline">
                  Launch interactive editor <ArrowRight size={12} />
                </Link>
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#FFF1E8] text-[#FF6B2C] flex items-center justify-center mb-4">
                  <HardDrive size={20} />
                </div>
                <h3 className="text-base font-bold text-[#111318] mb-2">Local Storage Architecture</h3>
                <p className="text-xs text-[#667085] leading-relaxed mb-4">
                  Understand how Glideo stores project data offline in IndexedDB and your local filesystem without uploading video buffers to cloud servers.
                </p>
                <Link href="/open-source" className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6B2C] hover:underline">
                  Read open source architecture <ArrowRight size={12} />
                </Link>
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#FFF1E8] text-[#FF6B2C] flex items-center justify-center mb-4">
                  <MessageSquare size={20} />
                </div>
                <h3 className="text-base font-bold text-[#111318] mb-2">Community & Feedback</h3>
                <p className="text-xs text-[#667085] leading-relaxed mb-4">
                  Report bugs, request new camera zoom easing curves, or submit pull requests directly to the open source GitHub repository.
                </p>
                <a href="https://github.com/ericva01/focuZoom/issues" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6B2C] hover:underline">
                  Open an issue on GitHub <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Keyboard Shortcuts Section */}
        <section className="py-20 border-b border-[#E5E7EB] bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8F9FB] border border-[#E5E7EB] text-xs font-mono text-[#667085] mb-4">
                <Keyboard size={14} />
                <span>Speed Editing</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-[#111318]">
                Studio Keyboard Shortcuts
              </h2>
              <p className="mt-2 text-sm text-[#667085]">
                Glideo is built for speed. Use these standard timeline shortcuts to edit at pro speed without touching the mouse.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8F9FB] p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shortcuts.map((s) => (
                  <div
                    key={s.key}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-[#E5E7EB] shadow-xs"
                  >
                    <span className="text-xs font-medium text-[#111318]">{s.action}</span>
                    <kbd className="px-2.5 py-1 rounded-lg bg-[#F8F9FB] border border-[#E5E7EB] text-[11px] font-mono font-bold text-[#FF6B2C] shadow-xs">
                      {s.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <div className="content-auto">
          <FaqSection />
        </div>

        {/* Final CTA */}
        <FinalCtaSection />
      </main>

      <Footer />
    </div>
  );
}
