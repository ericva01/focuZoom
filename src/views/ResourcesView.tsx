"use client";

import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { FaqSection } from "@/components/landing/FaqSection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { useLanguage } from "@/context/LanguageContext";
import { BookOpen, HardDrive, Keyboard, ArrowRight, ExternalLink, MessageSquare } from "lucide-react";

export function ResourcesView() {
  const { t, localePath, isKhmer } = useLanguage();

  const fallbackShortcuts = [
    { key: "Space", desc: isKhmer ? "ចាក់ ឬផ្អាកវីដេអូ" : "Play or Pause video playback" },
    { key: "S", desc: isKhmer ? "កាត់បំបែក Clip ត្រង់ទីតាំង Playhead" : "Split active clip at playhead position" },
    { key: "Del / Backspace", desc: isKhmer ? "លុប Clip ឬ Keyframe ដែលបានជ្រើសរើស" : "Delete selected clip or zoom keyframe" },
    { key: "Shift + Del", desc: isKhmer ? "Ripple Delete (លុប និងបិទចន្លោះទំនេរ)" : "Ripple delete selected clip (close the gap)" },
    { key: "K", desc: isKhmer ? "បន្ថែម Keyframe ពង្រីក 3D Dolly Zoom" : "Add 3D Dolly Zoom keyframe at playhead" },
    { key: "← / →", desc: isKhmer ? "រំកិលវីដេអូថយក្រោយ / ទៅមុខ ១ Frame" : "Step playback backwards / forwards by 1 frame" },
    { key: "Ctrl + Z", desc: isKhmer ? "ត្រឡប់សកម្មភាពចុងក្រោយ (Undo)" : "Undo last timeline or config edit" },
    { key: "Ctrl + Y / Shift + Z", desc: isKhmer ? "ធ្វើឡើងវិញនូវអ្វីដែលបានត្រឡប់ (Redo)" : "Redo last undone change" },
    { key: "Ctrl + S", desc: isKhmer ? "រក្សាទុកគម្រោងលើម៉ាស៊ីន (Offline Storage)" : "Save project locally to offline browser storage" },
    { key: "Ctrl + O", desc: isKhmer ? "បើកឯកសារវីដេអូពីកុំព្យូទ័រ" : "Open local video file from computer" },
  ];

  const shortcutsList = t.resourcesPage?.shortcuts?.length
    ? t.resourcesPage.shortcuts
    : fallbackShortcuts;

  return (
    <div className="website-ui min-h-screen flex flex-col bg-[#F8F9FB] text-[#111318] selection:bg-[#FFF1E8] selection:text-[#FF6B2C]">
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* Resources Header */}
        <section className="relative overflow-hidden pt-16 pb-20 border-b border-[#E5E7EB] bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/20 text-xs font-semibold text-[#FF6B2C] mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2C]" />
                <span>{t.resourcesPage.badge}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111318] leading-[1.15]">
                {t.resourcesPage.title}
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-[#667085] leading-relaxed">
                {t.resourcesPage.subtitle}
              </p>
              <div className="mt-8 flex items-center gap-4">
                <Link
                  href={localePath("/editor")}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B2C] px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-[#E85A1F] transition-all"
                >
                  <span>{isKhmer ? "បើកស្ទូឌីយោ" : "Open Studio"}</span>
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
                <h3 className="text-base font-bold text-[#111318] mb-2">
                  {isKhmer ? "មគ្គុទ្ទេសក៍ចាប់ផ្តើមរហ័ស" : "Getting Started Guide"}
                </h3>
                <p className="text-xs text-[#667085] leading-relaxed mb-4">
                  {isKhmer
                    ? "រៀនពីរបៀបថតអេក្រង់ ថតសំឡេង Microphone ពង្រីកកាមេរ៉ាស្វ័យប្រវត្តិតាមការចុច និងនាំចេញវីដេអូដំបូងក្នុងរយៈពេលក្រោម ៣ នាទី។"
                    : "Learn how to capture your screen, record microphone voiceover, auto-align camera focus, and export your first video in under 3 minutes."}
                </p>
                <Link href={localePath("/editor")} className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6B2C] hover:underline">
                  {isKhmer ? "បើកស្ទូឌីយោដើម្បីសាកល្បង" : "Launch interactive editor"} <ArrowRight size={12} />
                </Link>
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#FFF1E8] text-[#FF6B2C] flex items-center justify-center mb-4">
                  <HardDrive size={20} />
                </div>
                <h3 className="text-base font-bold text-[#111318] mb-2">
                  {isKhmer ? "ស្ថាបត្យកម្មផ្ទុកទិន្នន័យលើម៉ាស៊ីន" : "Local Storage Architecture"}
                </h3>
                <p className="text-xs text-[#667085] leading-relaxed mb-4">
                  {isKhmer
                    ? "យល់ដឹងពីរបៀបដែល FucuFlow រក្សាទុកទិន្នន័យគម្រោងដោយគ្មានអ៊ីនធឺណិតក្នុង IndexedDB និង File System ដោយមិនបង្ហោះវីដេអូទៅកាន់ Cloud ឡើយ។"
                    : "Understand how FucuFlow stores project data offline in IndexedDB and your local filesystem without uploading video buffers to cloud servers."}
                </p>
                <Link href={localePath("/open-source")} className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6B2C] hover:underline">
                  {isKhmer ? "អានស្ថាបត្យកម្មកូដចំហ" : "Read open source architecture"} <ArrowRight size={12} />
                </Link>
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#FFF1E8] text-[#FF6B2C] flex items-center justify-center mb-4">
                  <MessageSquare size={20} />
                </div>
                <h3 className="text-base font-bold text-[#111318] mb-2">
                  {isKhmer ? "សហគមន៍ & មតិកែលម្អ" : "Community & Feedback"}
                </h3>
                <p className="text-xs text-[#667085] leading-relaxed mb-4">
                  {isKhmer
                    ? "រាយការណ៍ពីកំហុស Bug ស្នើសុំខ្សែកោងកាមេរ៉ាថ្មីៗ ឬផ្ញើ Pull Request ដោយផ្ទាល់ទៅកាន់ GitHub Repository។"
                    : "Report bugs, request new camera zoom easing curves, or submit pull requests directly to the open source GitHub repository."}
                </p>
                <a href="https://github.com/ericva01/focuZoom/issues" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6B2C] hover:underline">
                  {isKhmer ? "បើកបញ្ហានៅលើ GitHub" : "Open an issue on GitHub"} <ExternalLink size={12} />
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
                <span>{isKhmer ? "ការកាត់តល្បឿនលឿន" : "Speed Editing"}</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-[#111318]">
                {t.resourcesPage.shortcutsTitle || (isKhmer ? "គ្រាប់ចុចកាត់ក្នុងស្ទូឌីយោ" : "Studio Keyboard Shortcuts")}
              </h2>
              <p className="mt-2 text-sm text-[#667085]">
                {t.resourcesPage.shortcutsSubtitle || (isKhmer ? "FucuFlow ត្រូវបានបង្កើតឡើងសម្រាប់ល្បឿន។ ប្រើគ្រាប់ចុចកាត់ទាំងនេះដើម្បីកាត់តយ៉ាងរហ័សដោយមិនបាច់ប៉ះ Mouse។" : "FucuFlow is built for speed. Use these standard timeline shortcuts to edit at pro speed without touching the mouse.")}
              </p>
            </div>

            <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8F9FB] p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shortcutsList.map((s, idx) => (
                  <div
                    key={s.key + idx}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-[#E5E7EB] shadow-xs"
                  >
                    <span className="text-xs font-medium text-[#111318]">{s.desc}</span>
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
