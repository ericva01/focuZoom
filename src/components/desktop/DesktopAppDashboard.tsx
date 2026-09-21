"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  LayoutGrid,
  Film,
  Search,
  Plus,
  Play,
  Monitor,
  Smartphone,
  FolderOpen,
  Trash2,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Settings,
  Cpu,
  Save,
  Moon,
  Sun,
  HardDrive,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { getSavedProjects, deleteProject, saveProject, SavedProject } from "@/utils/projectStorage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from "@/types/editor";
import { desktopBridge } from "@/lib/desktopBridge";
import { ThemeMode } from "@/components/editor/EditorSettingsModal";

type DashboardTab = "overview" | "videos" | "settings";

export function DesktopAppDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [filterRatio, setFilterRatio] = useState<string>("all");

  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("glideo_theme") as ThemeMode | null;
      return saved || "dark";
    }
    return "dark";
  });

  const [effectiveTheme, setEffectiveTheme] = useState<"dark" | "light">("dark");

  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("glideo_autosave_enabled") !== "false";
    }
    return true;
  });

  const [autoSaveInterval, setAutoSaveInterval] = useState<number>(() => {
    if (typeof window !== "undefined") {
      return parseInt(localStorage.getItem("glideo_autosave_interval") || "5", 10);
    }
    return 5;
  });

  // Apply theme class to document element and compute effective theme
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    let current: "dark" | "light" = "dark";
    if (theme === "light") {
      current = "light";
    } else if (theme === "dark") {
      current = "dark";
    } else {
      current = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    setEffectiveTheme(current);
    if (current === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
  }, [theme]);

  const isLight = effectiveTheme === "light";

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("glideo_theme", newTheme);
    }
  };

  const handleToggleAutoSave = (enabled: boolean) => {
    setAutoSaveEnabled(enabled);
    if (typeof window !== "undefined") {
      localStorage.setItem("glideo_autosave_enabled", enabled ? "true" : "false");
    }
  };

  const handleChangeAutoSaveInterval = (interval: number) => {
    setAutoSaveInterval(interval);
    if (typeof window !== "undefined") {
      localStorage.setItem("glideo_autosave_interval", interval.toString());
    }
  };

  useEffect(() => {
    setSavedProjects(getSavedProjects());
  }, []);

  const handleCreateNew = (aspectRatio: AspectRatio = "16:9", title?: string) => {
    const newProj: SavedProject = {
      id: "proj-" + Date.now(),
      name: title || `Untitled Video (${aspectRatio})`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      duration: 10,
      aspectRatio,
      clipCount: 1,
      keyframeCount: 1,
      config: {
        aspectRatio,
        cursorColor: "#FF6B2C",
        rippleColor: "#FF6B2C",
      },
    };
    saveProject(newProj);
    router.push(`/editor?id=${newProj.id}`);
  };

  const handleNativeImport = async () => {
    if (desktopBridge.isDesktop) {
      try {
        const result = await desktopBridge.openVideoDialog();
        if (!result.canceled && result.dataUrl) {
          const newProj: SavedProject = {
            id: "proj-" + Date.now(),
            name: result.fileName ? result.fileName.replace(/\.[^/.]+$/, "") : "Imported Video",
            createdAt: Date.now(),
            updatedAt: Date.now(),
            duration: 10,
            aspectRatio: "16:9",
            clipCount: 1,
            keyframeCount: 1,
            videoSrc: result.dataUrl,
            videoFileName: result.fileName,
            config: {
              cursorColor: "#FF6B2C",
              rippleColor: "#FF6B2C",
            },
          };
          saveProject(newProj);
          router.push(`/editor?id=${newProj.id}`);
          return;
        }
      } catch (err) {
        console.error("Failed to import via desktop dialog:", err);
      }
    }

    // Fallback: standard file picker
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/mp4,video/webm,video/quicktime,.glideo";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const newProj: SavedProject = {
          id: "proj-" + Date.now(),
          name: file.name.replace(/\.[^/.]+$/, ""),
          createdAt: Date.now(),
          updatedAt: Date.now(),
          duration: 10,
          aspectRatio: "16:9",
          clipCount: 1,
          keyframeCount: 1,
          videoFileName: file.name,
          config: {
            cursorColor: "#FF6B2C",
            rippleColor: "#FF6B2C",
          },
        };
        saveProject(newProj);
        router.push(`/editor?id=${newProj.id}`);
      }
    };
    input.click();
  };

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this video from your desktop workspace?")) {
      const updated = deleteProject(id);
      setSavedProjects(updated);
    }
  };

  const filteredProjects = savedProjects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRatio = filterRatio === "all" || p.aspectRatio === filterRatio;
    return matchesSearch && matchesRatio;
  });

  return (
    <div className={`flex h-screen w-screen font-sans select-none overflow-hidden ${isLight ? "bg-[#F8F9FB] text-slate-900" : "bg-[#060913] text-[#F8FAFC]"}`}>
      {/* ========================================================================= */}
      {/* 1. LEFT NAVIGATION SIDEBAR (Glideo Obsidian & Orange Brand)              */}
      {/* ========================================================================= */}
      <aside className={`w-60 flex-shrink-0 flex flex-col justify-between p-4 z-20 ${isLight ? "bg-white border-r border-slate-200" : "bg-[#080D1A] border-r border-white/[0.08]"}`}>
        <div className="space-y-6">
          {/* Glideo Workspace Header */}
          <div className="flex items-center gap-3 px-1.5 py-1.5 transition-all cursor-pointer group select-none">
            <div className="relative w-8 h-8 flex-shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/icon.png"
                alt="Glideo"
                width={32}
                height={32}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`text-xs font-bold uppercase tracking-wider truncate ${isLight ? "text-slate-900" : "text-white"}`}>
                GLIDEO
              </span>
              <span className="text-[10px] text-[#FF6B2C] font-mono font-semibold">Desktop Edition</span>
            </div>
          </div>

          {/* Primary Navigation Links: 1. Overview (Create Video), 2. Videos, 3. Settings */}
          <nav className="space-y-1.5">
            {/* 1. Overview (Create Video) */}
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === "overview"
                  ? isLight
                    ? "bg-[#FFF1E8] text-[#FF6B2C] font-bold border border-[#FF6B2C]/30 shadow-xs"
                    : "bg-white/[0.08] text-white font-semibold border border-white/10 shadow-inner"
                  : isLight
                  ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
            >
              <LayoutGrid className={`w-4 h-4 ${activeTab === "overview" ? "text-[#FF6B2C]" : isLight ? "text-slate-500" : "text-slate-400"}`} />
              <span>Overview</span>
            </button>

            {/* 2. Videos */}
            <button
              onClick={() => setActiveTab("videos")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === "videos"
                  ? isLight
                    ? "bg-[#FFF1E8] text-[#FF6B2C] font-bold border border-[#FF6B2C]/30 shadow-xs"
                    : "bg-white/[0.08] text-white font-semibold border border-white/10 shadow-inner"
                  : isLight
                  ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Film className={`w-4 h-4 ${activeTab === "videos" ? "text-[#FF6B2C]" : isLight ? "text-slate-500" : "text-slate-400"}`} />
                <span>Videos</span>
              </div>
              {savedProjects.length > 0 && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
                  isLight
                    ? "bg-[#FFF1E8] text-[#FF6B2C] border border-[#FF6B2C]/30"
                    : "bg-[#FFF1E8]/15 text-[#FF8A4C] border border-[#FF6B2C]/30"
                }`}>
                  {savedProjects.length}
                </span>
              )}
            </button>

            {/* 3. Settings */}
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === "settings"
                  ? isLight
                    ? "bg-[#FFF1E8] text-[#FF6B2C] font-bold border border-[#FF6B2C]/30 shadow-xs"
                    : "bg-white/[0.08] text-white font-semibold border border-white/10 shadow-inner"
                  : isLight
                  ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
            >
              <Settings className={`w-4 h-4 ${activeTab === "settings" ? "text-[#FF6B2C]" : isLight ? "text-slate-500" : "text-slate-400"}`} />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Offline System Status Badge */}
        <div className={`pt-4 border-t ${isLight ? "border-slate-200" : "border-white/[0.08]"}`}>
          <div className={`flex items-center gap-2.5 p-3 rounded-2xl ${isLight ? "bg-slate-50 border border-slate-200" : "bg-white/[0.02] border border-white/[0.06]"}`}>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className={`text-[11px] font-semibold truncate ${isLight ? "text-slate-800" : "text-slate-200"}`}>100% Offline Engine</span>
              <span className={`text-[10px] font-mono ${isLight ? "text-slate-500" : "text-slate-500"}`}>Hardware Accelerated</span>
            </div>
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400 ml-auto flex-shrink-0" />
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN DESKTOP WORKSPACE VIEW                                            */}
      {/* ========================================================================= */}
      <main className={`flex-1 flex flex-col min-w-0 overflow-y-auto ${isLight ? "bg-[#F8F9FB]" : "bg-[#060913]"}`}>
        {/* Top Desktop Bar */}
        <header className={`h-16 flex-shrink-0 px-6 sm:px-8 border-b flex items-center justify-between gap-6 backdrop-blur-xl sticky top-0 z-30 ${
          isLight
            ? "bg-white/85 border-slate-200"
            : "bg-[#080D1A]/80 border-white/[0.08]"
        }`}>
          {/* Search Bar Input */}
          <div className="relative flex-1 max-w-md">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? "text-slate-400" : "text-slate-500"}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved videos..."
              className={`w-full rounded-full pl-10 pr-4 py-2 text-xs outline-none transition-colors ${
                isLight
                  ? "bg-slate-100 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#FF6B2C]"
                  : "bg-[#0B1020] border border-white/10 text-white placeholder:text-slate-500 focus:border-[#FF6B2C]/60"
              }`}
            />
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Quick Sun/Moon Theme Toggle Button */}
            <button
              onClick={() => handleThemeChange(isLight ? "dark" : "light")}
              className={`p-2 rounded-full border transition-all cursor-pointer shadow-xs active:scale-95 ${
                isLight
                  ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-amber-600"
                  : "bg-white/[0.06] hover:bg-white/[0.12] border-white/15 text-yellow-400"
              }`}
              title={isLight ? "Switch to Dark Obsidian Mode" : "Switch to Clean Light Mode"}
            >
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Signature Solid White Capsule Pill CTA */}
            <button
              onClick={() => handleCreateNew("16:9")}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FF6B2C] hover:bg-[#E85A1F] text-white text-xs font-bold shadow-[0_0_20px_rgba(255,107,44,0.3)] hover:shadow-[0_0_30px_rgba(255,107,44,0.5)] transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Video</span>
            </button>

            {/* Settings Quick Toggle Button */}
            <button
              onClick={() => setActiveTab("settings")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 ${
                activeTab === "settings"
                  ? isLight
                    ? "bg-[#FFF1E8] border-[#FF6B2C]/40 text-[#FF6B2C]"
                    : "bg-[#FFF1E8]/15 border-[#FF6B2C]/40 text-[#FF8A4C]"
                  : isLight
                  ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
                  : "bg-white/[0.06] hover:bg-white/[0.12] border-white/15 text-slate-200 hover:text-white"
              }`}
              title="Application Settings"
            >
              <Settings className="w-3.5 h-3.5 text-[#FF6B2C]" />
              <span>Settings</span>
            </button>

            {/* User Profile Avatar */}
            <div
              title="Creator: Eric Va"
              className={`flex items-center gap-2.5 pl-3 border-l ${isLight ? "border-slate-200" : "border-white/10"}`}
            >
              <Avatar className="h-8 w-8 ring-1 ring-[#FF6B2C]/40 bg-[#0E1526]">
                <AvatarImage src="/avatar.jpg" alt="Eric Va" />
                <AvatarFallback className="bg-[#0E1526] text-xs font-bold text-white">EV</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* ======================================================================= */}
        {/* Scrollable Body Content based on Active Tab                             */}
        {/* ======================================================================= */}
        <div className="p-6 sm:p-8 space-y-8 flex-1 max-w-7xl mx-auto w-full">
          {/* ===================================================================== */}
          {/* TAB 1: OVERVIEW (CREATE VIDEO + QUICK PREVIEWS)                       */}
          {/* ===================================================================== */}
          {activeTab === "overview" && (
            <>
              {/* 3 Quick Creation Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card 1: 16:9 Landscape Video */}
                <button
                  onClick={() => handleCreateNew("16:9")}
                  className={`p-4 rounded-2xl border transition-all text-left group flex items-start gap-3.5 cursor-pointer shadow-xs ${
                    isLight
                      ? "bg-white hover:bg-slate-50 border-slate-200 hover:border-[#FF6B2C]/60"
                      : "bg-[#080D1A]/90 hover:bg-[#0E152B] border-white/[0.08] hover:border-[#FF6B2C]/50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-[#FF6B2C] flex-shrink-0 group-hover:scale-105 group-hover:bg-[#FF6B2C] group-hover:text-white transition-all ${
                    isLight
                      ? "bg-[#FFF1E8] border-[#FF6B2C]/30"
                      : "bg-[#FFF1E8]/10 border-[#FF6B2C]/25"
                  }`}>
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`text-xs font-bold transition-colors ${isLight ? "text-slate-900 group-hover:text-[#FF6B2C]" : "text-white group-hover:text-white"}`}>
                      16:9 Landscape Video
                    </h3>
                    <p className={`text-[11px] mt-1 leading-relaxed ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                      Blank canvas for desktop tutorials & SaaS demos.
                    </p>
                  </div>
                </button>

                {/* Card 2: 9:16 Vertical Reel */}
                <button
                  onClick={() => handleCreateNew("9:16")}
                  className={`p-4 rounded-2xl border transition-all text-left group flex items-start gap-3.5 cursor-pointer shadow-xs ${
                    isLight
                      ? "bg-white hover:bg-slate-50 border-slate-200 hover:border-[#FF6B2C]/60"
                      : "bg-[#080D1A]/90 hover:bg-[#0E152B] border-white/[0.08] hover:border-[#FF6B2C]/50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-[#FF6B2C] flex-shrink-0 group-hover:scale-105 group-hover:bg-[#FF6B2C] group-hover:text-white transition-all ${
                    isLight
                      ? "bg-[#FFF1E8] border-[#FF6B2C]/30"
                      : "bg-[#FFF1E8]/10 border-[#FF6B2C]/25"
                  }`}>
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`text-xs font-bold transition-colors ${isLight ? "text-slate-900 group-hover:text-[#FF6B2C]" : "text-white group-hover:text-white"}`}>
                      9:16 Vertical Reel
                    </h3>
                    <p className={`text-[11px] mt-1 leading-relaxed ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                      Vertical format for TikTok, Reels & YouTube Shorts.
                    </p>
                  </div>
                </button>

                {/* Card 3: Open Local Video File */}
                <button
                  onClick={handleNativeImport}
                  className={`p-4 rounded-2xl border transition-all text-left group flex items-start gap-3.5 cursor-pointer shadow-xs ${
                    isLight
                      ? "bg-white hover:bg-slate-50 border-slate-200 hover:border-[#FF6B2C]/60"
                      : "bg-[#080D1A]/90 hover:bg-[#0E152B] border-white/[0.08] hover:border-[#FF6B2C]/50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-[#FF6B2C] flex-shrink-0 group-hover:scale-105 group-hover:bg-[#FF6B2C] group-hover:text-white transition-all ${
                    isLight
                      ? "bg-[#FFF1E8] border-[#FF6B2C]/30"
                      : "bg-[#FFF1E8]/10 border-[#FF6B2C]/25"
                  }`}>
                    <FolderOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`text-xs font-bold transition-colors ${isLight ? "text-slate-900 group-hover:text-[#FF6B2C]" : "text-white group-hover:text-white"}`}>
                      Open Video File
                    </h3>
                    <p className={`text-[11px] mt-1 leading-relaxed ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                      Import local MP4, WebM, or MOV video from disk.
                    </p>
                  </div>
                </button>
              </div>

              {/* Hero Showcase Card with Interactive 3D Dolly Preview */}
              <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#080D1A] via-[#0A1024] to-[#0D142E] border shadow-xl flex flex-col lg:flex-row items-center gap-8 relative overflow-hidden ${
                isLight ? "border-slate-300/80 shadow-md" : "border-white/10 shadow-xl"
              }`}>
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-[#FF6B2C]/10 via-[#FF7A3D]/5 to-transparent blur-3xl pointer-events-none" />

                {/* Left Preview Screen Player */}
                <div
                  onClick={() => handleCreateNew("16:9")}
                  className="relative w-full md:w-96 aspect-video rounded-2xl bg-[#060913] border border-white/10 shadow-2xl overflow-hidden flex items-center justify-center cursor-pointer group flex-shrink-0"
                >
                  <div className="w-36 h-36 rounded-full border border-[#FF6B2C]/20 flex items-center justify-center relative">
                    <div className="w-28 h-28 rounded-full bg-[#0E152B]/80 border border-[#FF6B2C]/30 flex items-center justify-center backdrop-blur-md">
                      <div className="w-12 h-12 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.4)] group-hover:scale-110 transition-all">
                        <Play className="w-5 h-5 fill-current ml-0.5 text-slate-950" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2C] animate-pulse" />
                    <span>Glideo 3D Dolly Engine</span>
                  </div>
                </div>

                {/* Right Headline & Description & Button */}
                <div className="flex-1 max-w-xl text-left space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF1E8]/10 border border-[#FF6B2C]/30 text-[#FF8A4C] text-xs font-mono font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF6B2C]" />
                    <span>Native Desktop Studio</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                    Create your first video with 3D cinematic camera zooms!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
                    Automate keyframe zooms, camera tilts, dynamic cursor highlights, and smooth cinematic pans offline with desktop hardware acceleration.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => handleCreateNew("16:9")}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FF6B2C] hover:bg-[#E85A1F] text-white text-xs sm:text-sm font-bold shadow-[0_0_25px_rgba(255,107,44,0.35)] hover:shadow-[0_0_35px_rgba(255,107,44,0.5)] transition-all cursor-pointer active:scale-95"
                    >
                      <span>Get Started</span>
                      <ChevronRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Recent Videos Section */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-[#FF6B2C]" />
                    <h3 className={`text-base font-bold tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>Recent Videos</h3>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-full font-bold ${
                      isLight ? "text-[#FF6B2C] bg-[#FFF1E8] border border-[#FF6B2C]/30" : "text-[#FF8A4C] bg-[#FFF1E8]/15 border border-[#FF6B2C]/30"
                    }`}>
                      {savedProjects.length}
                    </span>
                  </div>
                  {savedProjects.length > 3 && (
                    <button
                      onClick={() => setActiveTab("videos")}
                      className="text-xs font-bold text-[#FF6B2C] hover:text-[#FF7A3D] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>View All Videos</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {filteredProjects.length === 0 ? (
                  <div className={`p-10 rounded-2xl border backdrop-blur-md text-center flex flex-col items-center justify-center space-y-3 ${
                    isLight ? "bg-white border-slate-200 shadow-xs" : "bg-[#080D1A]/50 border-white/[0.08]"
                  }`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-[#FF6B2C] shadow-[0_0_25px_rgba(255,107,44,0.15)] ${
                      isLight ? "bg-[#FFF1E8] border border-[#FF6B2C]/30" : "bg-[#0E152B] border border-white/10"
                    }`}>
                      <Film className="w-6 h-6 text-[#FF6B2C] stroke-[1.5]" />
                    </div>
                    <div className="max-w-md space-y-1">
                      <h4 className={`text-sm font-bold ${isLight ? "text-slate-900" : "text-white"}`}>No saved videos yet</h4>
                      <p className={`text-xs leading-relaxed ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                        Create a new video or import a local recording to start editing with 3D camera zooms.
                      </p>
                    </div>
                    <button
                      onClick={() => handleCreateNew("16:9")}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FF6B2C] hover:bg-[#E85A1F] text-white text-xs font-bold shadow-[0_0_20px_rgba(255,107,44,0.3)] transition-all cursor-pointer active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create First Video</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProjects.slice(0, 6).map((project) => (
                      <div
                        key={project.id}
                        onClick={() => router.push(`/editor?id=${project.id}`)}
                        className={`group relative rounded-2xl border transition-all p-4 cursor-pointer flex items-center justify-between gap-4 shadow-xs ${
                          isLight
                            ? "bg-white border-slate-200 hover:border-[#FF6B2C]/50 hover:bg-slate-50"
                            : "bg-[#080D1A] border-white/[0.08] hover:border-[#FF6B2C]/50 hover:bg-[#0D1429]"
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-[#FF6B2C] flex-shrink-0 group-hover:scale-105 group-hover:bg-[#FF6B2C] group-hover:text-white transition-all ${
                            isLight ? "bg-[#FFF1E8] border-[#FF6B2C]/30" : "bg-[#0E152B] border-white/10"
                          }`}>
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className={`text-xs font-bold transition-colors truncate ${
                              isLight ? "text-slate-900 group-hover:text-[#FF6B2C]" : "text-white group-hover:text-[#FF8A4C]"
                            }`}>
                              {project.name}
                            </h4>
                            <div className={`flex items-center gap-2 text-[10px] font-mono mt-1 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                              <span className="text-[#FF6B2C] font-semibold">{project.aspectRatio}</span>
                              <span>·</span>
                              <span>{project.duration}s</span>
                              <span>·</span>
                              <span>{project.keyframeCount || 1} keyframes</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleDeleteProject(project.id, e)}
                            title="Delete video"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <ChevronRight className={`w-4 h-4 group-hover:translate-x-0.5 transition-all ${isLight ? "text-slate-400 group-hover:text-slate-900" : "text-slate-500 group-hover:text-white"}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ===================================================================== */}
          {/* TAB 2: VIDEOS (FULL DEDICATED VIDEOS GALLERY)                         */}
          {/* ===================================================================== */}
          {activeTab === "videos" && (
            <div className="space-y-6">
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${isLight ? "border-slate-200" : "border-white/[0.08]"}`}>
                <div>
                  <h2 className={`text-2xl font-bold tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>Your Videos</h2>
                  <p className={`text-xs mt-1 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                    Manage all screen recordings and projects stored locally on your device.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Aspect Ratio Filter */}
                  <div className={`flex items-center border rounded-xl p-1 text-xs ${
                    isLight ? "bg-white border-slate-200 shadow-xs" : "bg-[#080D1A] border-white/10"
                  }`}>
                    {["all", "16:9", "9:16"].map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => setFilterRatio(ratio)}
                        className={`px-3 py-1 rounded-lg font-medium transition-all ${
                          filterRatio === ratio
                            ? "bg-[#FF6B2C] text-white"
                            : isLight
                            ? "text-slate-600 hover:text-slate-900"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {ratio === "all" ? "All Formats" : ratio}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleCreateNew("16:9")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF6B2C] hover:bg-[#E85A1F] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Video</span>
                  </button>
                </div>
              </div>

              {filteredProjects.length === 0 ? (
                <div className={`p-16 rounded-3xl border text-center flex flex-col items-center justify-center space-y-4 ${
                  isLight ? "bg-white border-slate-200 shadow-xs" : "bg-[#080D1A]/50 border-white/[0.08]"
                }`}>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-[#FF6B2C] ${
                    isLight ? "bg-[#FFF1E8] border border-[#FF6B2C]/30" : "bg-[#0E152B] border border-white/10"
                  }`}>
                    <Film className="w-8 h-8" />
                  </div>
                  <h3 className={`text-base font-bold ${isLight ? "text-slate-900" : "text-white"}`}>No videos found</h3>
                  <p className={`text-xs max-w-sm ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                    {searchQuery
                      ? `No videos matching "${searchQuery}". Try clearing your search.`
                      : "Start by recording your screen or importing a local video."}
                  </p>
                  <button
                    onClick={() => handleCreateNew("16:9")}
                    className="px-5 py-2.5 rounded-xl bg-[#FF6B2C] hover:bg-[#E85A1F] text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    Create First Video
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredProjects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => router.push(`/editor?id=${project.id}`)}
                      className={`group rounded-3xl border transition-all p-5 cursor-pointer flex flex-col justify-between space-y-4 shadow-xs ${
                        isLight
                          ? "bg-white border-slate-200 hover:border-[#FF6B2C]/50 hover:bg-slate-50"
                          : "bg-[#080D1A] border-white/[0.08] hover:border-[#FF6B2C]/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-[#FF6B2C] flex-shrink-0 group-hover:scale-105 group-hover:bg-[#FF6B2C] group-hover:text-white transition-all ${
                          isLight ? "bg-[#FFF1E8] border-[#FF6B2C]/30" : "bg-[#0E152B] border-white/10"
                        }`}>
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                        <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold ${
                          isLight
                            ? "bg-[#FFF1E8] text-[#FF6B2C] border border-[#FF6B2C]/30"
                            : "bg-[#FFF1E8]/10 text-[#FF8A4C] border border-[#FF6B2C]/30"
                        }`}>
                          {project.aspectRatio}
                        </span>
                      </div>

                      <div>
                        <h4 className={`text-sm font-bold transition-colors truncate ${
                          isLight ? "text-slate-900 group-hover:text-[#FF6B2C]" : "text-white group-hover:text-[#FF8A4C]"
                        }`}>
                          {project.name}
                        </h4>
                        <div className={`flex items-center gap-2 text-xs font-mono mt-1.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                          <span>{project.duration}s duration</span>
                          <span>·</span>
                          <span>{project.keyframeCount || 1} keyframes</span>
                        </div>
                      </div>

                      <div className={`pt-3 border-t flex items-center justify-between text-xs ${isLight ? "border-slate-100" : "border-white/[0.06]"}`}>
                        <span className={`font-mono text-[11px] ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                          {new Date(project.updatedAt || project.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleDeleteProject(project.id, e)}
                            title="Delete video"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[#FF6B2C] group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-bold">
                            <span>Open</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 3: SETTINGS (IN-DASHBOARD DEDICATED SETTINGS)                      */}
          {/* ===================================================================== */}
          {activeTab === "settings" && (
            <div className="space-y-8 max-w-3xl">
              <div>
                <h2 className={`text-2xl font-bold tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>Desktop Studio Settings</h2>
                <p className={`text-xs mt-1 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                  Configure local storage preferences, hardware acceleration, and application appearance.
                </p>
              </div>

              {/* Setting Section 1: Appearance / Theme */}
              <div className={`p-6 rounded-3xl border space-y-4 shadow-xs ${
                isLight ? "bg-white border-slate-200" : "bg-[#080D1A] border-white/[0.08]"
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF1E8]/30 text-[#FF6B2C] border border-[#FF6B2C]/20 flex items-center justify-center">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold ${isLight ? "text-slate-900" : "text-white"}`}>Interface Theme</h3>
                    <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>Select your preferred desktop appearance mode.</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  {[
                    { id: "dark" as const, label: "Dark Obsidian", icon: Moon },
                    { id: "light" as const, label: "Clean Light", icon: Sun },
                    { id: "system" as const, label: "System Auto", icon: Monitor },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => handleThemeChange(id)}
                      className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                        theme === id
                          ? isLight
                            ? "bg-[#FFF1E8] border-2 border-[#FF6B2C] text-[#FF6B2C] font-bold"
                            : "bg-[#FFF1E8]/10 border-2 border-[#FF6B2C] text-white font-bold"
                          : isLight
                          ? "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300"
                          : "bg-[#060913] border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${theme === id ? "text-[#FF6B2C]" : isLight ? "text-slate-500" : "text-slate-400"}`} />
                      <span className="text-xs font-bold">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Setting Section 2: Auto-Save Engine */}
              <div className={`p-6 rounded-3xl border space-y-4 shadow-xs ${
                isLight ? "bg-white border-slate-200" : "bg-[#080D1A] border-white/[0.08]"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF1E8]/30 text-[#FF6B2C] border border-[#FF6B2C]/20 flex items-center justify-center">
                      <Save className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`text-sm font-bold ${isLight ? "text-slate-900" : "text-white"}`}>Periodic Auto-Save</h3>
                      <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>Automatically save timeline edits to local storage.</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoSaveEnabled}
                    onChange={(e) => handleToggleAutoSave(e.target.checked)}
                    className="w-5 h-5 accent-[#FF6B2C] rounded cursor-pointer"
                  />
                </div>

                {autoSaveEnabled && (
                  <div className={`pt-3 border-t flex items-center justify-between ${isLight ? "border-slate-100" : "border-white/[0.06]"}`}>
                    <span className={`text-xs font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}>Auto-Save Interval</span>
                    <select
                      value={autoSaveInterval}
                      onChange={(e) => handleChangeAutoSaveInterval(Number(e.target.value))}
                      className={`border rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#FF6B2C] ${
                        isLight
                          ? "bg-slate-50 border-slate-200 text-slate-900"
                          : "bg-[#0B1020] border-white/10 text-white"
                      }`}
                    >
                      <option value={3}>Every 3 seconds</option>
                      <option value={5}>Every 5 seconds (Recommended)</option>
                      <option value={10}>Every 10 seconds</option>
                      <option value={30}>Every 30 seconds</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Setting Section 3: Hardware Acceleration & Local Storage */}
              <div className={`p-6 rounded-3xl border space-y-4 shadow-xs ${
                isLight ? "bg-white border-slate-200" : "bg-[#080D1A] border-white/[0.08]"
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF1E8]/30 text-[#FF6B2C] border border-[#FF6B2C]/20 flex items-center justify-center">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold ${isLight ? "text-slate-900" : "text-white"}`}>Local Hardware Acceleration</h3>
                    <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>GPU video encode via client-side WebCodecs & WebGL.</p>
                  </div>
                </div>

                <div className="pt-2 space-y-2.5 text-xs">
                  <div className={`flex items-center justify-between p-3 rounded-xl border ${
                    isLight ? "bg-slate-50 border-slate-200" : "bg-white/[0.02] border-white/[0.06]"
                  }`}>
                    <span className={isLight ? "text-slate-700 font-medium" : "text-slate-300"}>GPU Decode / Encode Pipeline</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active (Direct3D / Vulkan)
                    </span>
                  </div>

                  <div className={`flex items-center justify-between p-3 rounded-xl border ${
                    isLight ? "bg-slate-50 border-slate-200" : "bg-white/[0.02] border-white/[0.06]"
                  }`}>
                    <span className={isLight ? "text-slate-700 font-medium" : "text-slate-300"}>Privacy Status</span>
                    <span className="text-[#FF6B2C] font-mono font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> 100% Local (Zero Cloud)
                    </span>
                  </div>
                </div>
              </div>

              {/* Setting Section 4: About & Open Source */}
              <div className={`p-6 rounded-3xl border space-y-3 shadow-xs ${
                isLight ? "bg-white border-slate-200" : "bg-[#080D1A] border-white/[0.08]"
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-sm font-bold ${isLight ? "text-slate-900" : "text-white"}`}>FucuFlow Studio Desktop v0.1.4</h3>
                    <p className={`text-xs mt-0.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Created by Eric Va • Permissive MIT License</p>
                  </div>
                  <a
                    href="https://github.com/ericva01/focuZoom"
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isLight
                        ? "bg-slate-100 hover:bg-[#FF6B2C] hover:text-white text-slate-800"
                        : "bg-white/10 hover:bg-[#FF6B2C] text-white"
                    }`}
                  >
                    <span>GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
