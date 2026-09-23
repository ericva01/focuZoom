"use client";

import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { SecuritySection } from "@/components/landing/SecuritySection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { useLanguage } from "@/context/LanguageContext";
import {
  ArrowRight,
  Focus,
  Layers,
  Sliders,
  HardDrive,
  Eye,
  Maximize2,
  Zap,
  Palette,
  Video,
  CheckCircle2,
  Lock,
  Volume2,
} from "lucide-react";

export function FeaturesView() {
  const { t, localePath, isKhmer } = useLanguage();

  const featureCards = [
    {
      id: "focal-zoom",
      icon: Focus,
      title: isKhmer ? "ការពង្រីកផ្តោតដោយស្វ័យប្រវត្តិ" : "Focal Auto-Zoom",
      description: isKhmer
        ? "បង្កើតចលនាកាមេរ៉ារលូនតម្រង់ទៅកាន់ការចុច Mouse ជាមួយខ្សែកោង Spline ។"
        : "Animates smooth camera transitions toward clicks with spline curves.",
      badge: isKhmer ? "កាមេរ៉ា" : "Camera",
    },
    {
      id: "3d-stage",
      icon: Layers,
      title: isKhmer ? "ជម្រៅលំហ 3D" : "3D Stage Depth",
      description: isKhmer
        ? "បន្ថែមមុំបង្វិល Isometric Pitch និង Yaw ដើម្បីឱ្យវីដេអូមានវិមាត្រទាក់ទាញ។"
        : "Add isometric pitch and yaw rotation to give recordings dimension.",
      badge: isKhmer ? "រចនាបថ 3D" : "3D Styling",
    },
    {
      id: "multi-track",
      icon: Sliders,
      title: isKhmer ? "បន្ទាត់ពេលវេលាច្រើន Track" : "Multi-Track Timeline",
      description: isKhmer
        ? "កាត់ត បំបែក និងកំណត់ Keyframe កម្រិត 30/60 FPS ជាមួយប្រព័ន្ធស្រូបម៉ាញេទិច។"
        : "Split, trim, and adjust keyframes at 30/60 FPS with magnetic snapping.",
      badge: isKhmer ? "ការកាត់ត" : "Editing",
    },
    {
      id: "local-storage",
      icon: HardDrive,
      title: isKhmer ? "ផ្ទុកទិន្នន័យលើម៉ាស៊ីន ១០០%" : "100% Local Storage",
      description: isKhmer
        ? "រាល់ទិន្នន័យវីដេអូទាំងអស់ស្ថិតនៅលើឧបករណ៍របស់អ្នក ដោយគ្មានការបង្ហោះទៅ Cloud ឡើយ។"
        : "All media stays securely on your device with zero cloud dependency.",
      badge: isKhmer ? "ឯកជនភាព" : "Privacy",
    },
    {
      id: "facecam",
      icon: Video,
      title: isKhmer ? "កាមេរ៉ាមុខ Facecam PiP" : "Facecam PiP",
      description: isKhmer
        ? "ដាក់កាមេរ៉ាមុខជារាងមូល ឬចតុកោណកោងគែម ជាមួយស៊ុម និងស្រមោលស្អាតៗ។"
        : "Circular, squircle, or rounded rect camera overlays with custom borders.",
      badge: isKhmer ? "Webcam" : "Webcam",
    },
    {
      id: "studio-bg",
      icon: Palette,
      title: isKhmer ? "ផ្ទៃខាងក្រោយស្ទូឌីយោ" : "Studio Backgrounds",
      description: isKhmer
        ? "ជម្រើសពណ៌ Gradient ទំនើប ផ្ទាំងរូបភាព macOS និងពណ៌សុទ្ធតាមម៉ាកសញ្ញា។"
        : "Modern gradients, macOS wallpapers, and branded solid colors.",
      badge: isKhmer ? "ផ្ទៃខាងក្រោយ" : "Branding",
    },
    {
      id: "4k-export",
      icon: Zap,
      title: isKhmer ? "នាំចេញ 4K 60 FPS" : "4K 60 FPS Export",
      description: isKhmer
        ? "វីដេអូ WebM/MP4 ច្បាស់ត្រជាក់ភ្នែក ដំណើរការដោយ GPU គ្មានជាប់ Watermark ឡើយ។"
        : "Crystal clear hardware-accelerated WebM/MP4 with zero watermarks.",
      badge: isKhmer ? "ការនាំចេញ" : "Export",
    },
    {
      id: "multi-ratio",
      icon: Maximize2,
      title: isKhmer ? "ខ្នាតវីដេអូច្រើនជម្រើស" : "Multi-Ratio Canvas",
      description: isKhmer
        ? "ប្តូរទំហំដោយចុច ១ ដង រវាង 16:9 (YouTube), 9:16 (Shorts/TikTok) និង 1:1។"
        : "1-click switch between 16:9 (YouTube), 9:16 (Shorts/TikTok), and 1:1.",
      badge: isKhmer ? "ទម្រង់" : "Formats",
    },
    {
      id: "cursor-ripple",
      icon: Eye,
      title: isKhmer ? "រង្វង់រលកលើ Mouse" : "Cursor Ripple Rings",
      description: isKhmer
        ? "សម្រួលចលនា Mouse ឱ្យរលូន និងរំលេចការចុចដោយរង្វង់រលកច្បាស់ៗ។"
        : "Smooth out jittery mice and highlight clicks with concentric rings.",
      badge: isKhmer ? "Mouse" : "Pointer",
    },
  ];

  return (
    <div className="website-ui min-h-screen flex flex-col bg-[#F8F9FB] text-[#111318] selection:bg-[#FFF1E8] selection:text-[#FF6B2C]">
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* Features Header */}
        <section className="relative overflow-hidden pt-16 pb-20 border-b border-[#E5E7EB] bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/20 text-xs font-semibold text-[#FF6B2C] mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2C]" />
                <span>{t.featuresPage.badge}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111318] leading-[1.15]">
                {t.featuresPage.title}
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-[#667085] leading-relaxed">
                {t.featuresPage.subtitle}
              </p>
              <div className="mt-8 flex items-center gap-4">
                <Link
                  href={localePath("/editor")}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B2C] px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-[#E85A1F] transition-all"
                >
                  <span>{t.hero.launchStudio}</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href={localePath("/open-source")}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-6 py-3.5 text-sm font-bold text-[#111318] hover:bg-[#F8F9FB] transition-all"
                >
                  <span>{isKhmer ? "កូដចំហ ១០០%" : "100% Open Source"}</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Feature Deep Dives with Visual Spotlights */}
        <section className="py-20 border-b border-[#E5E7EB] bg-[#F8F9FB]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
            {t.featuresPage.deepDives.map((item, index) => {
              const mockType = index === 0 ? "zoom" : index === 1 ? "timeline" : index === 2 ? "3d" : "privacy";

              return (
                <div
                  key={item.id}
                  className={`rounded-3xl border border-[#E5E7EB] bg-white p-8 sm:p-12 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${
                    index % 2 === 1 ? "lg:grid-flow-dense" : ""
                  }`}
                >
                  <div className={`lg:col-span-6 space-y-5 ${index % 2 === 1 ? "lg:col-start-7" : ""}`}>
                    <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#FF6B2C] bg-[#FFF1E8] px-3 py-1 rounded-full border border-[#FF6B2C]/20">
                      {item.badge}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#111318] leading-snug">
                      {item.title}
                    </h2>
                    <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
                      {item.description}
                    </p>
                    <ul className="pt-2 space-y-3 text-xs sm:text-sm text-[#111318] font-medium">
                      {item.highlights.map((hl, i) => (
                        <li key={i} className="flex items-center gap-2.5">
                          <CheckCircle2 size={18} className="text-[#FF6B2C] shrink-0" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-4">
                      <Link
                        href={localePath("/editor")}
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#FF6B2C] hover:text-[#E85A1F] transition-colors"
                      >
                        <span>{isKhmer ? `សាកល្បង ${item.badge} ក្នុងស្ទូឌីយោ` : `Try ${item.badge} in the studio`}</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>

                  {/* Mockup Card */}
                  <div
                    className={`lg:col-span-6 rounded-2xl bg-[#17191F] border border-white/10 p-6 text-white shadow-xl min-h-[280px] flex flex-col justify-between ${
                      index % 2 === 1 ? "lg:col-start-1" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B2C] animate-pulse" />
                        <span className="text-xs font-mono text-slate-300">{item.badge} Studio Preview</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-[#FF8A4C]">
                        Live Engine
                      </span>
                    </div>

                    {mockType === "zoom" && (
                      <div className="py-8 space-y-4">
                        <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Focus className="text-[#FF8A4C] w-5 h-5" />
                            <div>
                              <p className="text-xs font-bold text-white">Target: Submit Button (x: 480, y: 320)</p>
                              <p className="text-[10px] text-slate-400 font-mono">Dolly Zoom: 2.5x | Ease: Catmull-Rom</p>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold text-[#FF8A4C]">0.60s span</span>
                        </div>
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#FF7A3D] to-[#FF6B2C] w-3/4 rounded-full" />
                        </div>
                      </div>
                    )}

                    {mockType === "timeline" && (
                      <div className="py-6 space-y-3 font-mono text-xs">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600/20 border border-blue-400/30 text-blue-300">
                          <Focus size={14} />
                          <span>TRACK 2: Auto Zoom (3 Keyframes Active)</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600/20 border border-indigo-400/30 text-indigo-300">
                          <Volume2 size={14} />
                          <span>TRACK 3: Audio (48 kHz Stereo Waveform)</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-white/10">
                          <span>Speed: 1.0x (30 FPS)</span>
                          <span className="text-emerald-400 font-bold">SMPTE 00:01:24:12</span>
                        </div>
                      </div>
                    )}

                    {mockType === "3d" && (
                      <div className="py-6 space-y-4">
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="p-3 rounded-xl bg-white/[0.06] border border-[#FF6B2C]/40 text-[#FF8A4C] font-bold">
                            Isometric L (-12°)
                          </div>
                          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300">
                            Front Studio (0°)
                          </div>
                          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300">
                            Isometric R (+12°)
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                          <span>Stage Radius: 24px</span>
                          <span>Padding: 48px</span>
                          <span className="text-[#FF8A4C]">Shadow: Deep</span>
                        </div>
                      </div>
                    )}

                    {mockType === "privacy" && (
                      <div className="py-6 space-y-4">
                        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3">
                          <Lock className="text-emerald-400 w-5 h-5" />
                          <div>
                            <p className="text-xs font-bold text-emerald-300">Local IndexedDB & Desktop Storage</p>
                            <p className="text-[10px] text-slate-400">Zero bytes uploaded to third-party clouds.</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span>Telemetry: Disabled</span>
                          <span className="text-emerald-400 font-bold">Air-Gapped Ready</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-white/10">
                      <span>FucuFlow Studio Pro Engine</span>
                      <span className="text-[#FF8A4C]">100% Free & Open Source</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* The 9 Pro Capabilities Grid */}
        <section className="py-20 border-b border-[#E5E7EB] bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-[#111318]">
                {isKhmer ? "មុខងារស្ទូឌីយោទាំងអស់ត្រូវបានរួមបញ្ចូល" : "Every studio capability included."}
              </h2>
              <p className="mt-3 text-sm text-[#667085]">
                {isKhmer
                  ? "FucuFlow រួមបញ្ចូលអ្វីៗគ្រប់យ៉ាងដែលត្រូវការដើម្បីថត កែសម្រួល និងនាំចេញវីដេអូកម្រិតអាជីពដោយគ្មានការទាមទារប្រាក់ប្រចាំខែ។"
                  : "FucuFlow includes everything needed to record, polish, and export pro videos without subscriptions."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureCards.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.id}
                    className="rounded-2xl border border-[#E5E7EB] bg-[#F8F9FB] p-6 shadow-xs hover:border-[#FF6B2C]/40 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#FFF1E8] text-[#FF6B2C] flex items-center justify-center">
                          <Icon size={20} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B2C] bg-white px-2.5 py-1 rounded-full border border-[#FF6B2C]/20">
                          {f.badge}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[#111318] mb-2">{f.title}</h3>
                      <p className="text-xs text-[#667085] leading-relaxed">{f.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Security & Analytics Components */}
        <div className="content-auto">
          <SecuritySection />
        </div>

        {/* Final CTA */}
        <FinalCtaSection />
      </main>

      <Footer />
    </div>
  );
}
