"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { FaqSection } from "@/components/landing/FaqSection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { useLanguage } from "@/context/LanguageContext";
import {
  BookOpen,
  HardDrive,
  Keyboard,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Terminal,
  Copy,
  Check,
  Cpu,
  Server,
  Zap,
} from "lucide-react";

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

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const mcpClaudeSnippet = JSON.stringify(
    {
      mcpServers: {
        fucuflow: {
          command: "node",
          args: ["./scripts/mcp-server/index.mjs"],
        },
      },
    },
    null,
    2
  );

  const mcpCursorSnippet = JSON.stringify(
    {
      mcpServers: {
        fucuflow: {
          command: "node",
          args: ["scripts/mcp-server/index.mjs"],
        },
      },
    },
    null,
    2
  );

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

        {/* AI Agent & MCP Server Documentation Section */}
        <section className="py-20 border-b border-[#E5E7EB] bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/20 text-xs font-semibold text-[#FF6B2C] mb-4">
                <Sparkles size={14} />
                <span>{isKhmer ? "ការណែនាំភ្ជាប់ AI Agent" : "AI Agent & MCP Integration Guide"}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111318]">
                {isKhmer ? "ភ្ជាប់ AI Agent ជាមួយ FucuFlow Studio" : "Connect Your AI Agent to FucuFlow"}
              </h2>
              <p className="mt-4 text-base text-[#667085] leading-relaxed">
                {isKhmer
                  ? "ស្វែងយល់ពីរបៀបភ្ជាប់ In-App AI Copilot (Google Gemini, OpenAI, Ollama) និងការប្រើប្រាស់ Model Context Protocol (MCP) ជាមួយ Claude Desktop, Cursor និង Antigravity។"
                  : "Learn how to direct videos using natural language with the In-App AI Copilot (Gemini, OpenAI, Ollama) or connect external AI agents via Model Context Protocol (MCP)."}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Architecture 1: In-App AI Copilot */}
              <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8F9FB] p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF6B2C] to-amber-500 text-white flex items-center justify-center shadow-sm">
                      <Cpu size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#111318]">
                        {isKhmer ? "១. In-App AI Copilot (BYO Key)" : "1. In-App AI Copilot (BYO Key)"}
                      </h3>
                      <p className="text-xs text-[#667085]">
                        Google Gemini • OpenAI • Local Ollama
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold">
                    Built-in
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#475467] leading-relaxed">
                  {isKhmer
                    ? "ចុចប៊ូតុង 'AI Agent' ក្នុង Editor ឬ Tab 'AI' នៅខាងស្តាំ។ បញ្ចូល API Key របស់អ្នក (ត្រូវបានរក្សាទុកតែលើ Browser/Device របស់អ្នកប៉ុណ្ណោះ) រួចបញ្ជាតាមរយៈ Prompt ភាសាធម្មជាតិ។"
                    : "Click the 'AI Agent' button in the studio or open the 'AI' tab in the right inspector. Enter your API key (stored strictly in your local device storage) and prompt naturally."}
                </p>

                <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6B2C] block">
                    {isKhmer ? "គំរូ Prompts ដែលពេញនិយម:" : "Popular Prompt Examples:"}
                  </span>
                  <div className="space-y-2 text-xs font-mono text-[#344054]">
                    <div className="p-2 rounded-lg bg-[#F8F9FB] border border-[#E5E7EB]">
                      &quot;Place 4 dynamic 3D zoom keyframes focused on key action points.&quot;
                    </div>
                    <div className="p-2 rounded-lg bg-[#F8F9FB] border border-[#E5E7EB]">
                      &quot;Reformat this project for TikTok / Reels: 9:16 vertical + Hyper-Neon.&quot;
                    </div>
                    <div className="p-2 rounded-lg bg-[#F8F9FB] border border-[#E5E7EB]">
                      &quot;Apply warm cinematic color grading and obsidian dark frame.&quot;
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={localePath("/editor")}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#FF6B2C] hover:underline"
                  >
                    <span>{isKhmer ? "បើកស្ទូឌីយោដើម្បីសាកល្បង AI Copilot" : "Launch Studio to Try AI Copilot"}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Architecture 2: External Agent & MCP Server */}
              <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8F9FB] p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
                      <Server size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#111318]">
                        {isKhmer ? "២. Model Context Protocol (MCP)" : "2. Model Context Protocol (MCP)"}
                      </h3>
                      <p className="text-xs text-[#667085]">
                        Claude Desktop • Cursor • Antigravity
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 border border-purple-500/20 font-bold">
                    Stdio Protocol
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#475467] leading-relaxed">
                  {isKhmer
                    ? "អនុញ្ញាតឱ្យ AI Agent ខាងក្រៅ (ដូចជា Claude Desktop ឬ Cursor) គ្រប់គ្រង FucuFlow ដោយផ្ទាល់តាមរយៈឧបករណ៍ចំនួន ១៤។"
                    : "Allows external autonomous AI agents in Claude Desktop, Cursor, or scripts to directly manipulate your video timeline via 14 studio tools."}
                </p>

                {/* Claude Desktop Config Snippet */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#344054]">
                      claude_desktop_config.json
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(mcpClaudeSnippet, "claude-doc")}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF6B2C] hover:underline"
                    >
                      {copiedId === "claude-doc" ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      <span>{copiedId === "claude-doc" ? "Copied" : "Copy Config"}</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-[#090D16] text-[11px] font-mono text-slate-300 overflow-x-auto border border-black/10">
                    {mcpClaudeSnippet}
                  </pre>
                </div>

                {/* Terminal Bridge Command */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#344054]">
                      Start Local Agent Bridge:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy("npm run agent:bridge", "bridge-cmd")}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF6B2C] hover:underline"
                    >
                      {copiedId === "bridge-cmd" ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      <span>{copiedId === "bridge-cmd" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <pre className="p-2.5 rounded-xl bg-[#090D16] text-[11px] font-mono text-emerald-400 border border-black/10">
                    npm run agent:bridge
                  </pre>
                </div>
              </div>
            </div>

            {/* 14 MCP Studio Tools Table */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden shadow-xs">
              <div className="px-6 py-4 border-b border-[#E5E7EB] bg-[#F8F9FB] flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-bold text-[#111318] flex items-center gap-2">
                  <Zap size={16} className="text-[#FF6B2C]" />
                  <span>{isKhmer ? "តារាងឧបករណ៍ស្វ័យប្រវត្តិទាំង ១៤ របស់ MCP Server" : "Available MCP Studio Tools (14 Tools)"}</span>
                </h4>
                <span className="text-[11px] font-mono text-[#667085]">Standard JSON-RPC 2.0</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#344054]">
                  <thead className="bg-[#F8F9FB] text-[11px] font-bold uppercase text-[#667085] border-b border-[#E5E7EB]">
                    <tr>
                      <th className="px-6 py-3">Tool Name</th>
                      <th className="px-6 py-3">Key Parameters</th>
                      <th className="px-6 py-3">Action Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] font-mono">
                    {[
                      { name: "fucuflow_add_zoom_keyframe", params: "timestamp, zoom, x, y, holdDuration, label", desc: "Places 3D camera dolly zoom at timestamp with focal coordinates." },
                      { name: "fucuflow_auto_generate_zooms", params: "count, zoomScale, pattern", desc: "Distributes rhythmic cinematic 3D zoom keyframes across video duration." },
                      { name: "fucuflow_set_aspect_ratio", params: "aspectRatio ('16:9' | '9:16' | '4:3' | '1:1')", desc: "Instantly reformats video for YouTube, TikTok, Reels, or Square." },
                      { name: "fucuflow_update_canvas_config", params: "backgroundPreset, screenAnglePreset, cornerRadius, padding", desc: "Sets 3D tilt perspective, aesthetic frame presets, and margins." },
                      { name: "fucuflow_set_color_grading", params: "brightness, contrast, saturation, temperature, tint", desc: "Live color balance, warm amber/cool blue temperature, and tint." },
                      { name: "fucuflow_split_clip", params: "timestamp, clipId", desc: "Splits video timeline clip at the given timecode." },
                      { name: "fucuflow_trim_clip", params: "clipId, start, end", desc: "Trims start and end boundaries of a clip." },
                      { name: "fucuflow_configure_webcam", params: "enabled, shape, position, size, borderColor", desc: "Configures picture-in-picture facecam bubble layout and borders." },
                      { name: "fucuflow_get_state", params: "none", desc: "Queries current project duration, playhead, aspect ratio, clips, and styling." },
                      { name: "fucuflow_trigger_export", params: "preset ('4k' | '2k' | '1080p')", desc: "Opens video export modal to render hardware-accelerated video." },
                    ].map((t) => (
                      <tr key={t.name} className="hover:bg-[#F8F9FB] transition-colors">
                        <td className="px-6 py-3 font-bold text-[#FF6B2C]">{t.name}</td>
                        <td className="px-6 py-3 text-slate-500 text-[11px]">{t.params}</td>
                        <td className="px-6 py-3 font-sans text-xs text-[#344054]">{t.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
