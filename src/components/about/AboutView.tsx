"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Copy,
  Check,
  ArrowRight,
  Focus,
  Monitor,
  ArrowUpRight,
  Code2,
  Cpu,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function AboutView() {
  const [copied, setCopied] = useState(false);
  const { t, localePath, isKhmer } = useLanguage();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("ericva014@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const principlesIcons = [Lock, Cpu, Focus, Code2];

  const principlesList = t.aboutPage?.principles?.length
    ? t.aboutPage.principles
    : [
        {
          title: isKhmer ? "ផ្ទុកទិន្នន័យលើម៉ាស៊ីន & ឯកជនភាព ១០០%" : "100% Local & Private",
          badge: isKhmer ? "គ្មាន Cloud" : "Zero Cloud",
          description: isKhmer
            ? "ការថតអេក្រង់ និងកាមេរ៉ារបស់អ្នកមិនដែលប៉ះពាល់ Server ឡើយ។ ការកែច្នៃ ការពង្រីក និងការ Render ដំណើរការទាំងស្រុងលើម៉ាស៊ីនរបស់អ្នកតាមរយៈ IndexedDB និង GPU shaders។"
            : "Your screen captures and webcam feeds never touch a cloud server. Video processing, zooming, and rendering happen entirely on your machine via IndexedDB and local GPU shaders.",
        },
        {
          title: isKhmer ? "ជំនួយល្បឿនដោយ WebCodecs & GPU" : "Hardware-Accelerated WebCodecs",
          badge: isKhmer ? "ស្នូល 60 FPS" : "60 FPS Core",
          description: isKhmer
            ? "បង្កើតឡើងលើស្តង់ដារទំនើប W3C WebCodecs និង WebGL 2.0 ដើម្បីផ្តល់នូវការ Render 4K ក្នុងពេលជាក់ស្តែងយ៉ាងរលូន និងមិនស៊ីថ្ម។"
            : "Built on modern W3C WebCodecs and WebGL 2.0 to deliver real-time 4K rendering with silky-smooth frame rates and negligible battery consumption.",
        },
        {
          title: isKhmer ? "កាមេរ៉ាពង្រីកផ្តោតឆ្លាតវៃ" : "Intelligent Focal Camera Easing",
          badge: isKhmer ? "ចលនារលូន" : "Spring Dynamics",
          description: isKhmer
            ? "ខ្សែកោង Catmull-Rom spline ជាមួយរូបវិទ្យា Spring Dynamics រំកិលកាមេរ៉ាយ៉ាងរលូនទៅកាន់ចំណុចអន្តរកម្ម ដោយគ្មានការកាត់ប្តូរប្លុកៗឡើយ។"
            : "Catmull-Rom spline curves with critically damped spring physics glide the virtual camera effortlessly into user interactions, banishing abrupt, jarring zoom cuts.",
        },
        {
          title: isKhmer ? "កូដចំហក្រោមអាជ្ញាប័ណ្ណ MIT" : "Permissive MIT Open Source",
          badge: isKhmer ? "ឥតគិតថ្លៃរហូត" : "Free Forever",
          description: isKhmer
            ? "គ្រប់បន្ទាត់កូដទាំងអស់ត្រូវបានបើកចំហលើ GitHub។ គ្មានការបិទបាំងទាមទារលុយ គ្មានថ្លៃជាវប្រចាំខែ និងគ្មានការលួចតាមដានឡើយ។"
            : "Every single line of code is open on GitHub. No subscription gates, no feature paywalls, and no hidden telemetry. Built by developers, for creators.",
        },
      ];

  const milestones = [
    {
      year: "2026",
      label: isKhmer ? "v0.1.4 គ្រប់ប្រព័ន្ធប្រតិបត្តិការ" : "v0.1.4 Cross-Platform",
      detail: isKhmer
        ? "កញ្ចប់ដំឡើង macOS DMG, Windows installer, និង Linux AppImage ដំណើរការដោយ Tauri Rust។"
        : "Universal macOS DMG, Windows installer, and Linux AppImage packages powered by Tauri Rust.",
    },
    {
      year: "2026",
      label: isKhmer ? "បំពង់ Render WebGL GPU" : "WebGL GPU Pipeline",
      detail: isKhmer
        ? "បង្វិល Canvas 3D ក្នុងពេលជាក់ស្តែងដោយ GPU, គំរូមុំ Isometric, និងបែបផែនរលក Mouse។"
        : "Hardware-accelerated real-time 3D canvas tilts, isometric angle presets, and cursor ripple effects.",
    },
    {
      year: "2026",
      label: isKhmer ? "ប្រព័ន្ធពង្រីក Focal Spline" : "Focal Spline Engine",
      detail: isKhmer
        ? "តាមដាន Mouse ដោយស្វ័យប្រវត្តិតាមចង្កោម និងប្រព័ន្ធស្រូប Keyframe កម្រិតមីលីវិនាទី។"
        : "Autonomous mouse tracking with cluster-based zoom anchors and sub-second timeline keyframe snapping.",
    },
    {
      year: "ORIGIN",
      label: isKhmer ? "ការចាប់ផ្តើមកូដចំហ" : "Open Source Genesis",
      detail: isKhmer
        ? "បង្កើតឡើងដោយ Eric Va ដើម្បីផ្តល់នូវជម្រើសកូដចំហ Local-First ជំនួសកម្មវិធីបិទជិត។"
        : "Founded by Eric Va to provide an open-source, local-first alternative to closed screen recording tools.",
    },
  ];

  return (
    <div className="space-y-24 lg:space-y-32 relative select-none">
      
      {/* 1. HERO ABOUT SECTION */}
      <section className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left: Brand Icon Showcase / Visual Studio Card */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="relative w-full max-w-[420px] rounded-3xl overflow-hidden border border-[#E5E7EB] bg-gradient-to-br from-[#FFF1E8] via-white to-[#F8F9FB] shadow-xl p-7 flex flex-col justify-between group transition-all duration-300 hover:shadow-2xl hover:border-[#FF6B2C]/30">
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#FF6B2C] bg-[#FFF1E8] px-3 py-1 rounded-full border border-[#FF6B2C]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2C]" />
                ORIGIN // 2026
              </span>
              <span className="text-xs font-mono text-[#667085] bg-white px-2.5 py-1 rounded-lg border border-[#E5E7EB] shadow-2xs">
                v0.1.4 STABLE
              </span>
            </div>

            {/* Studio Icon & Branding */}
            <div className="my-8 flex flex-col items-center text-center">
              <div className="relative w-28 h-28 rounded-3xl bg-white shadow-md border border-[#E5E7EB] p-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <Image
                  src="/icon.png"
                  alt="FucuFlow Logo"
                  width={80}
                  height={80}
                  className="object-contain drop-shadow-[0_8px_16px_rgba(255,107,44,0.25)]"
                  priority
                />
              </div>
              <h2 className="mt-5 text-2xl font-black tracking-tight text-[#111318]">FucuFlow Studio</h2>
              <p className="mt-1 text-xs text-[#667085] font-medium">
                {isKhmer ? "កន្លែងថតអេក្រង់កម្រិតភាពយន្ត & ពង្រីកផ្តោតដោយស្វ័យប្រវត្តិ" : "Cinematic Screen Recording & Auto-Zoom Workspace"}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white text-[#111318] border border-[#E5E7EB]">WebCodecs</span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white text-[#111318] border border-[#E5E7EB]">WebGL 2.0</span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white text-[#111318] border border-[#E5E7EB]">Tauri Rust</span>
              </div>
            </div>

            {/* Bottom Status Pill */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-xs font-mono font-semibold text-[#111318]">CRAFTED BY ERIC VA</span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-[#F8F9FB] border border-[#E5E7EB] text-[#667085] px-2 py-0.5 rounded font-bold">
                MIT LICENSE
              </span>
            </div>
          </div>
        </div>

        {/* Right: Narrative & Purpose */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/20 text-xs font-bold font-mono text-[#FF6B2C]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2C]" />
            <span>{t.aboutPage.badge || (isKhmer ? "រឿងរ៉ាវ & ទស្សនវិជ្ជា" : "THE STORY & PHILOSOPHY")}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#111318] tracking-tight leading-[1.12]">
            {t.aboutPage.title}
          </h1>

          <p className="text-[#667085] text-base sm:text-lg leading-relaxed">
            {t.aboutPage.subtitle}
          </p>

          <p className="text-[#667085] text-sm sm:text-base leading-relaxed">
            {t.aboutPage.storyP1 || (isKhmer
              ? "ការបង្ហាញការងាររបស់អ្នកមិនគួរតម្រូវឱ្យមានកម្មវិធីថ្លៃៗប្រចាំខែ ឬបង្ហោះវីដេអូការងារសម្ងាត់ទៅកាន់ Server របស់ក្រុមហ៊ុនដទៃឡើយ។ FucuFlow រួមបញ្ចូលគ្នានូវការពង្រីកផ្តោតដោយស្វ័យប្រវត្តិ ចលនា Mouse រលូន មុំ 3D និងកាមេរ៉ាមុខ ទៅក្នុងកន្លែងកាត់តតែមួយដែលមានល្បឿនលឿន និងដំណើរការលើម៉ាស៊ីនរបស់អ្នក ១០០%។"
              : "Explaining your work shouldn’t require expensive subscription software or uploading confidential company footage to third-party cloud servers. FucuFlow unites automated focal zooming, cursor physics, 3D stage angles, and webcam overlays into a single, high-performance workspace — running 100% offline on your device.")}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link href={localePath("/editor")}>
              <button
                type="button"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#FF6B2C] text-white text-xs font-bold hover:bg-[#E85A1F] transition-all cursor-pointer shadow-sm hover:shadow-[0_6px_20px_rgba(255,107,44,0.3)] active:scale-95"
              >
                <span>{isKhmer ? "បើកស្ទូឌីយោ Web" : "Launch Web Studio"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-[#F8F9FB] text-[#111318] border border-[#E5E7EB] text-xs font-mono transition-all cursor-pointer shadow-xs active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#FF6B2C]" /> : <Copy className="w-3.5 h-3.5 text-[#667085]" />}
              <span>{copied ? (isKhmer ? "បានចម្លង" : "Copied") : "ericva014@gmail.com"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. STATS & ARCHITECTURE BAR */}
      <section className="rounded-3xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[#E5E7EB]">
          <div className="pt-4 md:pt-0">
            <div className="text-2xl sm:text-3xl font-black text-[#111318]">100%</div>
            <div className="text-xs font-medium text-[#667085] mt-1">{isKhmer ? "ផ្ទុកទិន្នន័យលើម៉ាស៊ីន Offline" : "Local & Offline Storage"}</div>
          </div>
          <div className="pt-4 md:pt-0">
            <div className="text-2xl sm:text-3xl font-black text-[#FF6B2C]">60 FPS</div>
            <div className="text-xs font-medium text-[#667085] mt-1">{isKhmer ? "កាមេរ៉ា GPU Spring រលូន" : "GPU Spring Camera Interpolation"}</div>
          </div>
          <div className="pt-4 md:pt-0">
            <div className="text-2xl sm:text-3xl font-black text-[#111318]">0 MB</div>
            <div className="text-xs font-medium text-[#667085] mt-1">{isKhmer ? "គ្មានការលួចបង្ហោះទិន្នន័យ" : "Cloud Video Telemetry"}</div>
          </div>
          <div className="pt-4 md:pt-0">
            <div className="text-2xl sm:text-3xl font-black text-[#111318]">MIT</div>
            <div className="text-xs font-medium text-[#667085] mt-1">{isKhmer ? "អាជ្ញាប័ណ្ណកូដចំហសេរី" : "Permissive Open Source License"}</div>
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE ENGINEERING PILLARS */}
      <section aria-labelledby="principles-heading">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/20 text-xs font-bold text-[#FF6B2C] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2C]" />
            <span>{isKhmer ? "គោលការណ៍គ្រឹះ" : "CORE PRINCIPLES"}</span>
          </div>
          <h2 id="principles-heading" className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111318]">
            {t.aboutPage.principlesHeader || (isKhmer ? "រចនាឡើងសម្រាប់ឯកជនភាព ល្បឿន និងគុណភាពខ្ពស់។" : "Engineered for privacy, speed, and craftsmanship.")}
          </h2>
          <p className="mt-3 text-sm text-[#667085]">
            {isKhmer ? "មូលហេតុដែលយើងបង្កើត FucuFlow ខុសប្លែកពីកម្មវិធីថត Cloud ដទៃទៀត។" : "Why we built FucuFlow differently than commercial cloud screen recorders."}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {principlesList.map((p, idx) => {
            const Icon = principlesIcons[idx % principlesIcons.length];
            return (
              <div
                key={p.title}
                className="rounded-3xl border border-[#E5E7EB] bg-white p-8 shadow-xs hover:border-[#FF6B2C]/40 transition-all group"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF1E8] text-[#FF6B2C] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon size={22} />
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-[#F8F9FB] border border-[#E5E7EB] text-[#667085]">
                    {p.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#111318] mb-2">{p.title}</h3>
                <p className="text-sm text-[#667085] leading-relaxed">{p.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. THE EDITORIAL COMPARISON: RAW VS FUCUFLOW */}
      <section className="rounded-3xl border border-[#E5E7EB] bg-white p-8 sm:p-12 shadow-xs">
        <div className="grid gap-8 lg:grid-cols-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/20 text-xs font-bold text-[#FF6B2C]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2C]" />
              <span>{isKhmer ? "ភាពខុសគ្នា" : "THE DIFFERENCE"}</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#111318]">
              {isKhmer ? "ការថតធម្មតា vs. ការបង្ហាញជាមួយ FucuFlow" : "Standard screen captures vs. FucuFlow Presentation"}
            </h2>
            <p className="text-sm text-[#667085] leading-relaxed">
              {isKhmer
                ? "ការថតធម្មតាបង្ខំឱ្យអ្នកទស្សនាមើលពិបាកស្វែងរកប៊ូតុងតូចៗដែលបានចុច។ FucuFlow បង្កើតចលនាពង្រីកកាមេរ៉ាស្វ័យប្រវត្តិតាមការចុចយ៉ាងច្បាស់។"
                : "Standard recordings force viewers to squint at high-resolution monitors to find which tiny button was clicked. FucuFlow creates automatic focal journeys."}
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl p-5 border border-red-200 bg-red-50/30 text-left space-y-2">
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                {isKhmer ? "កម្មវិធីថតចាស់ៗ" : "Traditional Recorders"}
              </span>
              <ul className="text-xs text-slate-600 space-y-2 pt-1">
                <li className="flex items-start gap-1.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>{isKhmer ? "ផ្ទាំង 2D រាបស្មើ អក្សរតូចមើលមិនច្បាស់" : "Flat 2D canvas with unreadable tiny interface fonts"}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>{isKhmer ? "ត្រូវកំណត់ Keyframe ពង្រីកកាមេរ៉ាដោយដៃ" : "Requires manual keyframing of every camera pan"}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>{isKhmer ? "បង្ហោះវីដេអូឯកជនទៅកាន់ Cloud ក្រុមហ៊ុនដទៃ" : "Uploads private work recordings to third-party clouds"}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>{isKhmer ? "ជាប់ថ្លៃជាវប្រចាំខែ និងជាប់សញ្ញា Watermark" : "Monthly recurring subscription costs & watermarks"}</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl p-5 border border-emerald-200 bg-emerald-50/30 text-left space-y-2">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                {isKhmer ? "ស្ទូឌីយោ FucuFlow" : "FucuFlow Studio"}
              </span>
              <ul className="text-xs text-slate-700 space-y-2 pt-1">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{isKhmer ? "ពង្រីកកាមេរ៉ាស្វ័យប្រវត្តិតាមការចុច Mouse" : "Cinematic auto-zooming targeting mouse clicks"}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{isKhmer ? "ចលនារលូន Spline Easing ជាមួយទិដ្ឋភាព 3D ពិតៗ" : "Spline spring easing with realistic 3D perspective"}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{isKhmer ? "ផ្ទុកលើម៉ាស៊ីន Offline ១០០% តាម IndexedDB & Tauri" : "100% offline device storage via IndexedDB & Tauri"}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{isKhmer ? "ឥតគិតថ្លៃ & កូដចំហ ១០០% ក្រោមអាជ្ញាប័ណ្ណ MIT" : "100% Free & Open Source under permissive MIT License"}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. EVOLUTION & MILESTONES */}
      <section aria-labelledby="milestones-heading">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/20 text-xs font-bold text-[#FF6B2C] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2C]" />
            <span>{isKhmer ? "ការវិវត្តន៍ & ផែនទីបង្ហាញផ្លូវ" : "PROGRESS & ROADMAP"}</span>
          </div>
          <h2 id="milestones-heading" className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111318]">
            {isKhmer ? "ការវិវត្តយ៉ាងលឿនក្នុងលក្ខណៈកូដចំហ។" : "Rapid evolution in the open."}
          </h2>
          <p className="mt-3 text-sm text-[#667085]">
            {isKhmer ? "បង្កើតឡើងដោយតម្លាភាព និងកែសម្រួលផ្ទាល់តាមមតិយោបល់សហគមន៍។" : "Built with transparency and shaped directly by community feedback."}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {milestones.map((m, idx) => (
            <div key={idx} className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-xs relative">
              <span className="text-xs font-mono font-bold text-[#FF6B2C] bg-[#FFF1E8] px-2.5 py-1 rounded-md">
                {m.year}
              </span>
              <h3 className="text-base font-bold text-[#111318] mt-4 mb-1.5">{m.label}</h3>
              <p className="text-xs leading-relaxed text-[#667085]">{m.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CREATOR & COMMUNITY CALLOUT */}
      <section aria-labelledby="creator-heading" className="grid gap-8 border-t border-[#E5E7EB] pt-12 sm:pt-16 lg:grid-cols-2 lg:gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/20 text-xs font-bold text-[#FF6B2C] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2C]" />
            <span>{isKhmer ? "អំពីអ្នកបង្កើត FUCUFLOW" : "BEHIND FUCUFLOW"}</span>
          </div>
          <h2 id="creator-heading" className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111318]">
            {isKhmer ? "បង្កើតឡើងដោយ Eric Va។" : "Created by Eric Va."}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#667085]">
            {isKhmer
              ? "FucuFlow ត្រូវបានរចនា និងថែទាំដោយ Eric Va។ វាផ្គុំឡើងពីបច្ចេកវិទ្យាថតអេក្រង់ ចលនាកាមេរ៉ា Spline រលូន និងឯកជនភាពលើម៉ាស៊ីន ទៅជាបរិយាកាសកាត់តវីដេអូទំនើប និងស្អាត។"
              : "FucuFlow is designed and maintained by Eric Va. It combines screen capture technology, dynamic spline camera choreography, and offline privacy into a clean, focused editing environment."}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#667085]">
            {isKhmer
              ? "ប្រសិនបើអ្នកជួបបញ្ហា ចង់បានចលនាកាមេរ៉ាថ្មីៗ ឬចង់ចូលរួមអភិវឌ្ឍន៍មុខងារ Desktop Bridge សូមទាក់ទងមក Eric ឬបើក Pull Request លើ GitHub។"
              : "Found an issue, need a specific easing curve, or want to contribute a desktop bridge feature? Connect with Eric or open a pull request on GitHub."}
          </p>
          
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href={localePath("/contact")}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#FF6B2C] hover:text-[#E85A1F] transition-colors"
            >
              <span>{isKhmer ? "ទាក់ទង Eric" : "Contact Eric"}</span>
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

        {/* Action Callout Box */}
        <div className="rounded-3xl border border-[#111318] bg-[#111318] text-white p-8 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-[#FF6B2C]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#FF8A4C]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2C]" />
              <span>{isKhmer ? "ត្រៀមខ្លួនបង្កើតវីដេអូ?" : "Ready to create?"}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {isKhmer ? "ធ្វើឱ្យការថតបន្ទាប់របស់អ្នកកាន់តែមានការផ្តោតអារម្មណ៍។" : "Give your next recording a little more focus."}
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-400">
              {isKhmer ? "បើកស្ទូឌីយោលើ Browser ឬកម្មវិធី Desktop ហើយចាប់ផ្តើមថតអេក្រង់ផ្ទាល់ខ្លួនរបស់អ្នក។" : "Open the studio in your browser or desktop app and start with a screen recording of your own."}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href={localePath("/editor")}
                className="inline-flex items-center gap-2.5 rounded-xl bg-[#FF6B2C] hover:bg-[#E85A1F] px-6 py-3.5 text-xs font-bold text-white transition-all shadow-sm hover:shadow-[0_6px_20px_rgba(255,107,44,0.35)] active:scale-95"
              >
                <span>{isKhmer ? "បើកស្ទូឌីយោ Web" : "Open Web Studio"}</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                href={localePath("/download")}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-all active:scale-95"
              >
                <Monitor size={15} />
                <span>{isKhmer ? "កម្មវិធី Desktop" : "Desktop App"}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
