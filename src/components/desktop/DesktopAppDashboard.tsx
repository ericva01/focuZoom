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
  Settings,
  Cpu,
  Save,
  Moon,
  Sun,
  HardDrive,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  LogIn,
  RefreshCw,
  Sparkles,
  Download,
  Terminal,
  Copy,
  Check,
  Radio,
  Key,
  Server,
} from "lucide-react";
import { getSavedProjects, deleteProject, saveProject, SavedProject } from "@/utils/projectStorage";
import { SignInButton, Show, UserButton, ClerkLoaded, ClerkLoading, ClerkFailed } from "@clerk/react";
import { AspectRatio } from "@/types/editor";
import { desktopBridge } from "@/lib/desktopBridge";
import { ThemeMode } from "@/components/editor/EditorSettingsModal";
import { GoogleDriveModal, GoogleDriveIcon } from "@/components/editor/GoogleDriveModal";
import { googleDriveService } from "@/lib/googleDriveService";
import { aiAgentService } from "@/lib/aiAgentService";
import { agentLocalBridge } from "@/lib/agentLocalBridge";
import { AiAgentConfig, AiAgentProvider } from "@/types/aiAgent";
import { useAppUpdater } from "@/hooks/useAppUpdater";
import { AppUpdateBanner } from "@/components/desktop/AppUpdateBanner";
import { AppUpdateModal } from "@/components/desktop/AppUpdateModal";

type DashboardTab = "overview" | "videos" | "settings" | "ai";

export function DesktopAppDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [filterRatio, setFilterRatio] = useState<string>("all");

  const {
    currentVersion,
    latestVersion,
    isChecking: isCheckingUpdate,
    updateAvailable,
    isDismissed: isUpdateDismissed,
    releaseInfo,
    error: updateError,
    lastChecked,
    checkForUpdates,
    dismissUpdate,
    downloadUpdate,
  } = useAppUpdater();

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      const saved = (localStorage.getItem("fucuflow_theme") || localStorage.getItem("glideo_theme")) as ThemeMode | null;
      return saved || "dark";
    }
    return "dark";
  });

  const [effectiveTheme, setEffectiveTheme] = useState<"dark" | "light">("dark");

  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fucuflow_autosave_enabled") ?? localStorage.getItem("glideo_autosave_enabled");
      return saved !== "false";
    }
    return true;
  });

  const [autoSaveInterval, setAutoSaveInterval] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fucuflow_autosave_interval") || localStorage.getItem("glideo_autosave_interval");
      return parseInt(saved || "5", 10);
    }
    return 5;
  });

  const [isGDriveModalOpen, setIsGDriveModalOpen] = useState<boolean>(false);
  const [gdriveStatus, setGdriveStatus] = useState(() => googleDriveService.getDriveStatus());

  // AI Agent & MCP State
  const [aiConfig, setAiConfig] = useState<AiAgentConfig>(() => aiAgentService.loadConfig());
  const [bridgeStatus, setBridgeStatus] = useState<"connected" | "disconnected" | "connecting">("disconnected");
  const [isTestingAi, setIsTestingAi] = useState(false);
  const [aiTestResult, setAiTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedAiId, setCopiedAiId] = useState<string | null>(null);
  const [showAiKey, setShowAiKey] = useState(false);

  useEffect(() => {
    setBridgeStatus(agentLocalBridge.getStatus());
    const unsub = agentLocalBridge.onStatusChange((status) => {
      setBridgeStatus(status);
    });
    return () => unsub();
  }, []);

  const handleSaveAiConfig = (updated: Partial<AiAgentConfig>) => {
    const saved = aiAgentService.saveConfig(updated);
    setAiConfig(saved);
    if (saved.enableLocalBridge) {
      agentLocalBridge.connect(saved.localBridgePort);
    } else {
      agentLocalBridge.disconnect();
    }
  };

  const handleTestAi = async () => {
    setIsTestingAi(true);
    setAiTestResult(null);
    try {
      const res = await aiAgentService.testConnection(aiConfig);
      setAiTestResult(res);
    } catch (err: any) {
      setAiTestResult({ success: false, message: err.message || "Failed to reach AI service." });
    } finally {
      setIsTestingAi(false);
    }
  };

  const handleCopyAi = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAiId(id);
    setTimeout(() => setCopiedAiId(null), 2000);
  };

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
      localStorage.setItem("fucuflow_theme", newTheme);
    }
  };

  const handleToggleAutoSave = (enabled: boolean) => {
    setAutoSaveEnabled(enabled);
    if (typeof window !== "undefined") {
      localStorage.setItem("fucuflow_autosave_enabled", enabled ? "true" : "false");
    }
  };

  const handleChangeAutoSaveInterval = (interval: number) => {
    setAutoSaveInterval(interval);
    if (typeof window !== "undefined") {
      localStorage.setItem("fucuflow_autosave_interval", interval.toString());
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
    input.accept = "video/mp4,video/webm,video/quicktime,.fucuflow,.glideo";
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
      {/* 1. LEFT NAVIGATION SIDEBAR (FucuFlow Obsidian & Orange Brand)              */}
      {/* ========================================================================= */}
      <aside className={`w-60 flex-shrink-0 flex flex-col justify-between p-4 z-20 ${isLight ? "bg-white border-r border-slate-200" : "bg-[#080D1A] border-r border-white/[0.08]"}`}>
        <div className="space-y-6">
          {/* FucuFlow Workspace Header */}
          <div className="flex items-center gap-3 px-1.5 py-1.5 transition-all cursor-pointer group select-none">
            <div className="relative w-8 h-8 flex-shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/icon.png"
                alt="FucuFlow"
                width={32}
                height={32}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`text-xs font-bold uppercase tracking-wider truncate ${isLight ? "text-slate-900" : "text-white"}`}>
                FUCUFLOW
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
                    : "bg-[#FF6B2C]/15 text-[#FF8A4C] font-bold border border-[#FF6B2C]/30 shadow-xs"
                  : isLight
                  ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
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
                    : "bg-[#FF6B2C]/15 text-[#FF8A4C] font-bold border border-[#FF6B2C]/30 shadow-xs"
                  : isLight
                  ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
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
                    : "bg-[#FF6B2C]/20 text-[#FF8A4C] border border-[#FF6B2C]/30"
                }`}>
                  {savedProjects.length}
                </span>
              )}
            </button>

            {/* 3. AI Agent & MCP Hub */}
            <button
              onClick={() => setActiveTab("ai")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === "ai"
                  ? isLight
                    ? "bg-[#FFF1E8] text-[#FF6B2C] font-bold border border-[#FF6B2C]/30 shadow-xs"
                    : "bg-[#FF6B2C]/15 text-[#FF8A4C] font-bold border border-[#FF6B2C]/30 shadow-xs"
                  : isLight
                  ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className={`w-4 h-4 ${activeTab === "ai" ? "text-[#FF6B2C]" : isLight ? "text-slate-500" : "text-slate-400"}`} />
                <span>AI Agent & MCP</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FF6B2C]/15 text-[#FF6B2C] border border-[#FF6B2C]/25 font-bold uppercase">
                Copilot
              </span>
            </button>

            {/* 4. Settings */}
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === "settings"
                  ? isLight
                    ? "bg-[#FFF1E8] text-[#FF6B2C] font-bold border border-[#FF6B2C]/30 shadow-xs"
                    : "bg-[#FF6B2C]/15 text-[#FF8A4C] font-bold border border-[#FF6B2C]/30 shadow-xs"
                  : isLight
                  ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings className={`w-4 h-4 ${activeTab === "settings" ? "text-[#FF6B2C]" : isLight ? "text-slate-500" : "text-slate-400"}`} />
                <span>Settings</span>
              </div>
              {updateAvailable && (
                <span className="w-2 h-2 rounded-full bg-[#FF6B2C] animate-pulse" title="Update available" />
              )}
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
              {updateAvailable && (
                <span className="w-2 h-2 rounded-full bg-[#FF6B2C] animate-pulse" title="Update available" />
              )}
            </button>

            {/* User Profile / Login Button */}
            <div
              className={`flex items-center gap-2.5 pl-3 border-l ${isLight ? "border-slate-200" : "border-white/10"}`}
            >
              <ClerkLoading>
                <button
                  type="button"
                  onClick={() => router.push("/sign-in")}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 ${
                    isLight
                      ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
                      : "bg-white/[0.06] hover:bg-white/[0.12] border-white/15 text-slate-200 hover:text-white"
                  }`}
                  title="Login"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#FF6B2C]" />
                  <span>Login</span>
                </button>
              </ClerkLoading>

              <ClerkFailed>
                <button
                  type="button"
                  onClick={() => router.push("/sign-in")}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 ${
                    isLight
                      ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
                      : "bg-white/[0.06] hover:bg-white/[0.12] border-white/15 text-slate-200 hover:text-white"
                  }`}
                  title="Login"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#FF6B2C]" />
                  <span>Login</span>
                </button>
              </ClerkFailed>

              <ClerkLoaded>
                <Show when="signed-in">
                  <UserButton />
                </Show>
                <Show when="signed-out">
                  <SignInButton mode="modal">
                    <button
                      type="button"
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 ${
                        isLight
                          ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
                          : "bg-white/[0.06] hover:bg-white/[0.12] border-white/15 text-slate-200 hover:text-white"
                      }`}
                      title="Login"
                    >
                      <LogIn className="w-3.5 h-3.5 text-[#FF6B2C]" />
                      <span>Login</span>
                    </button>
                  </SignInButton>
                </Show>
              </ClerkLoaded>
            </div>
          </div>
        </header>

        {/* ======================================================================= */}
        {/* Scrollable Body Content based on Active Tab                             */}
        {/* ======================================================================= */}
        <div className="p-6 sm:p-8 space-y-8 flex-1 max-w-7xl mx-auto w-full">
          {/* In-App Update Notification Banner */}
          {updateAvailable && !isUpdateDismissed && (
            <AppUpdateBanner
              releaseInfo={releaseInfo}
              onOpenDetails={() => setIsUpdateModalOpen(true)}
              onDownload={downloadUpdate}
              onDismiss={dismissUpdate}
              isLight={isLight}
            />
          )}
          {/* ===================================================================== */}
          {/* TAB 1: OVERVIEW (CREATE VIDEO + QUICK PREVIEWS)                       */}
          {/* ===================================================================== */}
          {activeTab === "overview" && (
            <>
              {/* 4 Quick Creation & Agent Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

                {/* Card 4: AI Agent Copilot & MCP */}
                <button
                  onClick={() => setActiveTab("ai")}
                  className={`p-4 rounded-2xl border transition-all text-left group flex items-start gap-3.5 cursor-pointer shadow-xs ${
                    isLight
                      ? "bg-white hover:bg-slate-50 border-slate-200 hover:border-[#FF6B2C]/60"
                      : "bg-[#080D1A]/90 hover:bg-[#0E152B] border-white/[0.08] hover:border-[#FF6B2C]/50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF6B2C] to-amber-500 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 shadow-sm transition-all">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className={`text-xs font-bold transition-colors ${isLight ? "text-slate-900 group-hover:text-[#FF6B2C]" : "text-white group-hover:text-white"}`}>
                        Connect AI Agent
                      </h3>
                      <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-[#FF6B2C]/20 text-[#FF6B2C] border border-[#FF6B2C]/30 font-bold">
                        MCP
                      </span>
                    </div>
                    <p className={`text-[11px] mt-1 leading-relaxed ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                      Direct edits via Gemini/OpenAI or Claude & Cursor MCP.
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
                    <span>FucuFlow 3D Dolly Engine</span>
                  </div>
                </div>

                {/* Right Headline & Description & Button */}
                <div className="flex-1 max-w-xl text-left space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF1E8]/10 border border-[#FF6B2C]/30 text-[#FF8A4C] text-xs font-mono font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2C]" />
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
              <div className={`p-6 rounded-3xl border space-y-5 transition-all ${
                isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#0C1120] border-white/10 shadow-lg"
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF1E8] dark:bg-[#FF6B2C]/15 text-[#FF6B2C] border border-[#FF6B2C]/30 flex items-center justify-center">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold ${isLight ? "text-slate-900" : "text-white"}`}>Interface Theme</h3>
                    <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>Select your preferred desktop appearance mode.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                  {[
                    { id: "dark" as const, label: "Dark Obsidian", desc: "Deep cinematic studio", icon: Moon },
                    { id: "light" as const, label: "Clean Light", desc: "High-clarity daytime", icon: Sun },
                    { id: "system" as const, label: "System Auto", desc: "Matches OS preference", icon: Monitor },
                  ].map(({ id, label, desc, icon: Icon }) => {
                    const isSelected = theme === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => handleThemeChange(id)}
                        className={`relative p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer group ${
                          isSelected
                            ? isLight
                              ? "bg-[#FFF1E8] border-2 border-[#FF6B2C] shadow-sm text-slate-900"
                              : "bg-[#FF6B2C]/10 border-2 border-[#FF6B2C] shadow-[0_0_20px_rgba(255,107,44,0.15)] text-white"
                            : isLight
                            ? "bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700 hover:text-slate-900"
                            : "bg-[#070B16] hover:bg-[#0E1426] border-white/10 text-slate-300 hover:text-white"
                        }`}
                      >
                        {/* Top Icon & Active Indicator */}
                        <div className="flex items-center justify-between">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                            isSelected
                              ? "bg-[#FF6B2C] text-white"
                              : isLight
                              ? "bg-slate-200/80 text-slate-600 group-hover:text-slate-900"
                              : "bg-white/10 text-slate-400 group-hover:text-white"
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-[#FF6B2C] text-white flex items-center justify-center text-[11px] font-bold shadow-xs">
                              ✓
                            </span>
                          )}
                        </div>

                        {/* Title & Description */}
                        <div>
                          <div className="text-xs font-bold leading-tight">{label}</div>
                          <div className={`text-[10px] mt-0.5 ${isSelected ? (isLight ? "text-slate-600" : "text-slate-300") : (isLight ? "text-slate-500" : "text-slate-400")}`}>
                            {desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Setting Section 2: Auto-Save Engine */}
              <div className={`p-6 rounded-3xl border space-y-4 transition-all ${
                isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#0C1120] border-white/10 shadow-lg"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF1E8] dark:bg-[#FF6B2C]/15 text-[#FF6B2C] border border-[#FF6B2C]/30 flex items-center justify-center">
                      <Save className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`text-sm font-bold ${isLight ? "text-slate-900" : "text-white"}`}>Periodic Auto-Save</h3>
                      <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>Automatically checkpoint timeline edits to local storage.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={autoSaveEnabled}
                    onClick={() => handleToggleAutoSave(!autoSaveEnabled)}
                    className={`w-12 h-6.5 rounded-full transition-colors relative flex items-center px-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]/50 ${
                      autoSaveEnabled ? "bg-[#FF6B2C]" : isLight ? "bg-slate-300" : "bg-white/20"
                    }`}
                  >
                    <div
                      className={`w-4.5 h-4.5 rounded-full bg-white transition-transform shadow-md ${
                        autoSaveEnabled ? "translate-x-5.5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {autoSaveEnabled && (
                  <div className={`pt-3 border-t flex items-center justify-between ${isLight ? "border-slate-100" : "border-white/[0.06]"}`}>
                    <span className={`text-xs font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}>Auto-Save Interval</span>
                    <select
                      value={autoSaveInterval}
                      onChange={(e) => handleChangeAutoSaveInterval(Number(e.target.value))}
                      className={`border rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#FF6B2C] font-medium cursor-pointer ${
                        isLight
                          ? "bg-slate-50 border-slate-300 text-slate-900"
                          : "bg-[#070B16] border-white/15 text-white"
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
              <div className={`p-6 rounded-3xl border space-y-4 transition-all ${
                isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#0C1120] border-white/10 shadow-lg"
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF1E8] dark:bg-[#FF6B2C]/15 text-[#FF6B2C] border border-[#FF6B2C]/30 flex items-center justify-center">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold ${isLight ? "text-slate-900" : "text-white"}`}>Local Hardware Acceleration</h3>
                    <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>GPU video encode via client-side WebCodecs & WebGL.</p>
                  </div>
                </div>

                <div className="pt-2 space-y-2.5 text-xs">
                  <div className={`flex items-center justify-between p-3.5 rounded-2xl border ${
                    isLight ? "bg-slate-50/80 border-slate-200" : "bg-white/[0.03] border-white/[0.08]"
                  }`}>
                    <span className={isLight ? "text-slate-700 font-semibold" : "text-slate-300 font-medium"}>GPU Decode / Encode Pipeline</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Active (Direct3D / Vulkan / Metal)</span>
                    </span>
                  </div>

                  <div className={`flex items-center justify-between p-3.5 rounded-2xl border ${
                    isLight ? "bg-slate-50/80 border-slate-200" : "bg-white/[0.03] border-white/[0.08]"
                  }`}>
                    <span className={isLight ? "text-slate-700 font-semibold" : "text-slate-300 font-medium"}>Privacy Status</span>
                    <span className="text-[#FF6B2C] dark:text-[#FF8A4C] font-mono text-xs font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FF6B2C]/10 border border-[#FF6B2C]/20">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#FF6B2C]" />
                      <span>100% Local (Zero Cloud)</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Setting Section 4: Personal Google Drive Cloud Save */}
              <div className={`p-6 rounded-3xl border space-y-4 transition-all ${
                isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#0C1120] border-white/10 shadow-lg"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-xs">
                      <GoogleDriveIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`text-sm font-bold flex items-center gap-2 ${isLight ? "text-slate-900" : "text-white"}`}>
                        <span>Personal Google Drive</span>
                        {gdriveStatus.isConnected && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            Connected
                          </span>
                        )}
                      </h3>
                      <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                        {gdriveStatus.isConnected && gdriveStatus.user?.email
                          ? `Connected as ${gdriveStatus.user.email} (Folder: FucuFlow Studio Videos)`
                          : "Save rendered videos and backed-up projects directly to Google Drive."}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsGDriveModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#FF6B2C] hover:bg-[#E85A1F] text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                  >
                    {gdriveStatus.isConnected ? "Manage Account" : "Connect Drive"}
                  </button>
                </div>
              </div>

              {/* Setting Section 5: Application Updates & Version */}
              <div className={`p-6 rounded-3xl border space-y-4 transition-all ${
                isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#0C1120] border-white/10 shadow-lg"
              }`}>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#FF6B2C]/10 text-[#FF6B2C] border border-[#FF6B2C]/30 flex items-center justify-center shadow-xs">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`text-sm font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
                          FucuFlow Studio Desktop
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF6B2C]/15 text-[#FF6B2C] border border-[#FF6B2C]/30">
                          v{currentVersion}
                        </span>
                      </div>
                      <p className={`text-xs mt-0.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                        {updateAvailable
                          ? `New version v${latestVersion} is available to install!`
                          : "You are running the latest version."}
                        {lastChecked && ` • Checked at ${lastChecked}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => checkForUpdates()}
                      disabled={isCheckingUpdate}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50 ${
                        isLight
                          ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800"
                          : "bg-white/10 hover:bg-white/15 border-white/15 text-white"
                      }`}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-[#FF6B2C] ${isCheckingUpdate ? "animate-spin" : ""}`} />
                      <span>{isCheckingUpdate ? "Checking..." : "Check for Updates"}</span>
                    </button>

                    {updateAvailable && (
                      <button
                        type="button"
                        onClick={() => setIsUpdateModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF6B2C] hover:bg-[#E85A1F] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Update to v{latestVersion}</span>
                      </button>
                    )}
                  </div>
                </div>

                {updateError && (
                  <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">
                    {updateError}
                  </p>
                )}
              </div>

              {/* Setting Section 6: About & Open Source */}
              <div className={`p-6 rounded-3xl border space-y-3 shadow-xs ${
                isLight ? "bg-white border-slate-200" : "bg-[#080D1A] border-white/[0.08]"
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-sm font-bold ${isLight ? "text-slate-900" : "text-white"}`}>About FucuFlow Studio</h3>
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

          {/* ===================================================================== */}
          {/* TAB 4: AI AGENT & MODEL CONTEXT PROTOCOL (MCP) HUB                    */}
          {/* ===================================================================== */}
          {activeTab === "ai" && (
            <div className="space-y-8 max-w-4xl">
              {/* Header */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className={`text-2xl font-bold tracking-tight flex items-center gap-2.5 ${isLight ? "text-slate-900" : "text-white"}`}>
                    <span>AI Agent & MCP Studio Hub</span>
                    <span className="text-xs uppercase font-mono px-2 py-0.5 rounded-full bg-[#FF6B2C]/15 text-[#FF6B2C] border border-[#FF6B2C]/30 font-bold">
                      Hybrid Architecture
                    </span>
                  </h2>
                  <p className={`text-xs mt-1 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                    Configure your in-studio AI Copilot (Gemini, OpenAI, Ollama) or connect external AI agents (Claude Desktop, Cursor, Antigravity) via MCP.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push("/editor")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF6B2C] hover:bg-[#E85A1F] text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Launch Studio with AI</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Live Bridge Status Card */}
              <div className={`p-5 rounded-3xl border transition-all ${
                isLight ? "bg-white border-slate-200 shadow-sm" : "bg-[#0C1120] border-white/10 shadow-lg"
              }`}>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative flex items-center justify-center">
                      <span className={`w-3.5 h-3.5 rounded-full ${
                        bridgeStatus === "connected"
                          ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.9)] animate-pulse"
                          : bridgeStatus === "connecting"
                          ? "bg-amber-500 animate-ping"
                          : "bg-slate-400"
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`text-sm font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
                          Local Agent WebSocket Bridge
                        </h3>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/40 text-slate-300 border border-white/10">
                          ws://127.0.0.1:{aiConfig.localBridgePort || 9876}/editor
                        </span>
                      </div>
                      <p className={`text-xs mt-0.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                        {bridgeStatus === "connected"
                          ? "Ready! External AI agents running in Claude Desktop, Cursor, or scripts can control FucuFlow in real time."
                          : "Local bridge daemon is currently idle. Run 'npm run agent:bridge' in terminal to enable external agent sync."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSaveAiConfig({ enableLocalBridge: !aiConfig.enableLocalBridge })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        aiConfig.enableLocalBridge
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                          : "bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-500"
                      }`}
                    >
                      {aiConfig.enableLocalBridge ? "Bridge Enabled" : "Bridge Disabled"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 1: In-App AI Copilot (Bring Your Own Key) */}
              <div className={`p-6 rounded-3xl border space-y-5 transition-all ${
                isLight ? "bg-white border-slate-200 shadow-sm" : "bg-[#0C1120] border-white/10 shadow-lg"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#FF6B2C]/10 text-[#FF6B2C] border border-[#FF6B2C]/30 flex items-center justify-center">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`text-sm font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
                        In-App AI Copilot (BYO Key)
                      </h3>
                      <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                        Direct video timeline edits and 3D zooms using natural language prompts.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Provider Selector Cards */}
                <div>
                  <label className={`text-xs font-semibold block mb-2 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                    Select AI Provider
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: "gemini" as const, name: "Google Gemini", badge: "Free Tier / Fast", defaultModel: "gemini-2.0-flash" },
                      { id: "openai" as const, name: "OpenAI", badge: "GPT-4o / 4o-mini", defaultModel: "gpt-4o-mini" },
                      { id: "ollama" as const, name: "Ollama (Local)", badge: "100% Free & Offline", defaultModel: "llama3.2" },
                      { id: "custom" as const, name: "Custom / OpenRouter", badge: "Groq / vLLM", defaultModel: "default" },
                    ].map((p) => {
                      const isSelected = aiConfig.provider === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            handleSaveAiConfig({
                              provider: p.id,
                              model: aiConfig.provider !== p.id ? p.defaultModel : aiConfig.model,
                              customEndpoint: p.id === "ollama" ? "http://localhost:11434/v1" : aiConfig.customEndpoint,
                            });
                            setAiTestResult(null);
                          }}
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#FFF1E8] dark:bg-[#FF6B2C]/15 border-[#FF6B2C] ring-2 ring-[#FF6B2C]/20 text-[#FF6B2C] font-bold"
                              : isLight
                              ? "bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300"
                              : "bg-white/[0.03] border-white/10 text-slate-200 hover:border-white/20"
                          }`}
                        >
                          <div className="text-xs font-bold flex items-center justify-between">
                            <span>{p.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#FF6B2C]" />}
                          </div>
                          <span className={`text-[10px] block mt-1 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                            {p.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* API Key Input (if not Ollama) */}
                {aiConfig.provider !== "ollama" && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className={`text-xs font-semibold flex items-center gap-1.5 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                        <Key className="w-3.5 h-3.5 text-[#FF6B2C]" />
                        <span>API Key</span>
                      </label>
                      {aiConfig.provider === "gemini" && (
                        <a
                          href="https://aistudio.google.com/app/apikey"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-[#FF6B2C] hover:underline flex items-center gap-1 font-semibold"
                        >
                          Get Free Gemini Key <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {aiConfig.provider === "openai" && (
                        <a
                          href="https://platform.openai.com/api-keys"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-[#FF6B2C] hover:underline flex items-center gap-1 font-semibold"
                        >
                          Get OpenAI Key <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showAiKey ? "text" : "password"}
                        value={aiConfig.apiKey}
                        onChange={(e) => handleSaveAiConfig({ apiKey: e.target.value })}
                        placeholder={aiConfig.provider === "gemini" ? "AIzaSy..." : "sk-proj-..."}
                        className={`w-full rounded-xl px-3.5 py-2.5 text-xs font-mono outline-none border focus:border-[#FF6B2C] pr-20 ${
                          isLight ? "bg-white border-slate-300 text-slate-900" : "bg-black/50 border-white/15 text-white"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowAiKey(!showAiKey)}
                        className={`absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold px-2 py-1 rounded cursor-pointer ${
                          isLight ? "bg-slate-100 text-slate-600" : "bg-white/10 text-slate-300"
                        }`}
                      >
                        {showAiKey ? "Hide" : "Show"}
                      </button>
                    </div>
                    <p className={`text-[10px] mt-1 flex items-center gap-1 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      Saved locally on your machine only. Never transmitted to third-party tracking servers.
                    </p>
                  </div>
                )}

                {/* Endpoint (for Ollama or Custom) */}
                {(aiConfig.provider === "ollama" || aiConfig.provider === "custom") && (
                  <div>
                    <label className={`text-xs font-semibold block mb-1.5 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                      API Base Endpoint URL
                    </label>
                    <input
                      type="text"
                      value={aiConfig.customEndpoint || ""}
                      onChange={(e) => handleSaveAiConfig({ customEndpoint: e.target.value })}
                      placeholder="http://localhost:11434/v1"
                      className={`w-full rounded-xl px-3.5 py-2.5 text-xs font-mono outline-none border focus:border-[#FF6B2C] ${
                        isLight ? "bg-white border-slate-300 text-slate-900" : "bg-black/50 border-white/15 text-white"
                      }`}
                    />
                    <p className={`text-[10px] mt-1 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                      {aiConfig.provider === "ollama"
                        ? "Default Ollama local server is http://localhost:11434/v1. Run 'ollama serve' in your terminal."
                        : "OpenAI-compatible base URL (e.g. OpenRouter, vLLM, Groq)."}
                    </p>
                  </div>
                )}

                {/* Model Selection */}
                <div>
                  <label className={`text-xs font-semibold block mb-1.5 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                    Model Name
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={aiConfig.model}
                      onChange={(e) => handleSaveAiConfig({ model: e.target.value })}
                      className={`flex-1 rounded-xl px-3.5 py-2 text-xs font-mono outline-none border focus:border-[#FF6B2C] ${
                        isLight ? "bg-white border-slate-300 text-slate-900" : "bg-black/50 border-white/15 text-white"
                      }`}
                    />
                    {aiConfig.provider === "gemini" && (
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSaveAiConfig({ model: "gemini-2.0-flash" })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                            aiConfig.model === "gemini-2.0-flash"
                              ? "bg-[#FF6B2C] text-white border-[#FF6B2C]"
                              : isLight ? "bg-slate-100 border-slate-200 text-slate-700" : "bg-white/10 border-white/10 text-slate-300"
                          }`}
                        >
                          2.0 Flash
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveAiConfig({ model: "gemini-1.5-pro" })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                            aiConfig.model === "gemini-1.5-pro"
                              ? "bg-[#FF6B2C] text-white border-[#FF6B2C]"
                              : isLight ? "bg-slate-100 border-slate-200 text-slate-700" : "bg-white/10 border-white/10 text-slate-300"
                          }`}
                        >
                          1.5 Pro
                        </button>
                      </div>
                    )}
                    {aiConfig.provider === "openai" && (
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSaveAiConfig({ model: "gpt-4o-mini" })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                            aiConfig.model === "gpt-4o-mini"
                              ? "bg-[#FF6B2C] text-white border-[#FF6B2C]"
                              : isLight ? "bg-slate-100 border-slate-200 text-slate-700" : "bg-white/10 border-white/10 text-slate-300"
                          }`}
                        >
                          4o-mini
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveAiConfig({ model: "gpt-4o" })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                            aiConfig.model === "gpt-4o"
                              ? "bg-[#FF6B2C] text-white border-[#FF6B2C]"
                              : isLight ? "bg-slate-100 border-slate-200 text-slate-700" : "bg-white/10 border-white/10 text-slate-300"
                          }`}
                        >
                          GPT-4o
                        </button>
                      </div>
                    )}
                    {aiConfig.provider === "ollama" && (
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSaveAiConfig({ model: "llama3.2" })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                            aiConfig.model === "llama3.2"
                              ? "bg-[#FF6B2C] text-white border-[#FF6B2C]"
                              : isLight ? "bg-slate-100 border-slate-200 text-slate-700" : "bg-white/10 border-white/10 text-slate-300"
                          }`}
                        >
                          llama3.2
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveAiConfig({ model: "qwen2.5" })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                            aiConfig.model === "qwen2.5"
                              ? "bg-[#FF6B2C] text-white border-[#FF6B2C]"
                              : isLight ? "bg-slate-100 border-slate-200 text-slate-700" : "bg-white/10 border-white/10 text-slate-300"
                          }`}
                        >
                          qwen2.5
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Test Connection Button & Result */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleTestAi}
                    disabled={isTestingAi || (!aiConfig.apiKey && aiConfig.provider !== "ollama")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isTestingAi ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Radio className="w-3.5 h-3.5 text-[#FF6B2C]" />
                    )}
                    <span>{isTestingAi ? "Testing..." : "Test Connection"}</span>
                  </button>

                  {aiTestResult && (
                    <div className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-xl border ${
                      aiTestResult.success
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
                    }`}>
                      {aiTestResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <ShieldCheck className="w-4 h-4 shrink-0 text-red-500" />}
                      <span>{aiTestResult.message}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 2: External Agent & Model Context Protocol (MCP) Integration */}
              <div className={`p-6 rounded-3xl border space-y-5 transition-all ${
                isLight ? "bg-white border-slate-200 shadow-sm" : "bg-[#0C1120] border-white/10 shadow-lg"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-600/10 text-purple-500 border border-purple-500/30 flex items-center justify-center">
                      <Server className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`text-sm font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
                        Model Context Protocol (MCP) Integration
                      </h3>
                      <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                        Connect Claude Desktop, Cursor, or Antigravity to direct FucuFlow via autonomous tools.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 font-bold">
                    JSON-RPC 2.0
                  </span>
                </div>

                {/* Claude Desktop Config Snippet */}
                <div className={`p-4 rounded-2xl border space-y-2.5 ${
                  isLight ? "bg-slate-50 border-slate-200" : "bg-black/30 border-white/10"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                      Claude Desktop (claude_desktop_config.json)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyAi(
                        JSON.stringify({
                          mcpServers: {
                            fucuflow: {
                              command: "node",
                              args: ["./scripts/mcp-server/index.mjs"],
                            },
                          },
                        }, null, 2),
                        "claude-dash"
                      )}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6B2C] hover:underline cursor-pointer"
                    >
                      {copiedAiId === "claude-dash" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedAiId === "claude-dash" ? "Copied!" : "Copy JSON"}</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-black/60 text-[11px] font-mono text-slate-300 overflow-x-auto border border-white/5">
{`{
  "mcpServers": {
    "fucuflow": {
      "command": "node",
      "args": ["./scripts/mcp-server/index.mjs"]
    }
  }
}`}
                  </pre>
                </div>

                {/* Cursor & Antigravity Config Snippet */}
                <div className={`p-4 rounded-2xl border space-y-2.5 ${
                  isLight ? "bg-slate-50 border-slate-200" : "bg-black/30 border-white/10"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                      Cursor / Antigravity (.cursor/mcp.json)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyAi(
                        JSON.stringify({
                          mcpServers: {
                            fucuflow: {
                              command: "node",
                              args: ["scripts/mcp-server/index.mjs"],
                            },
                          },
                        }, null, 2),
                        "cursor-dash"
                      )}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6B2C] hover:underline cursor-pointer"
                    >
                      {copiedAiId === "cursor-dash" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedAiId === "cursor-dash" ? "Copied!" : "Copy JSON"}</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-black/60 text-[11px] font-mono text-slate-300 overflow-x-auto border border-white/5">
{`{
  "mcpServers": {
    "fucuflow": {
      "command": "node",
      "args": ["scripts/mcp-server/index.mjs"]
    }
  }
}`}
                  </pre>
                </div>

                {/* Terminal Commands */}
                <div className={`p-4 rounded-2xl border space-y-2.5 ${
                  isLight ? "bg-slate-50 border-slate-200" : "bg-black/30 border-white/10"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                      Start Local Agent Bridge in Terminal:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyAi("npm run agent:bridge", "cmd-dash")}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6B2C] hover:underline cursor-pointer"
                    >
                      {copiedAiId === "cmd-dash" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedAiId === "cmd-dash" ? "Copied!" : "Copy Command"}</span>
                    </button>
                  </div>
                  <pre className="p-2.5 rounded-xl bg-black/60 text-[11px] font-mono text-emerald-400 border border-white/5">
                    npm run agent:bridge
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Google Drive Connection Modal */}
      <GoogleDriveModal
        isOpen={isGDriveModalOpen}
        onClose={() => {
          setIsGDriveModalOpen(false);
          setGdriveStatus(googleDriveService.getDriveStatus());
        }}
        onConnected={() => {
          setGdriveStatus(googleDriveService.getDriveStatus());
        }}
      />

      {/* App Update Details Modal */}
      <AppUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        currentVersion={currentVersion}
        releaseInfo={releaseInfo}
        onDownload={downloadUpdate}
        isLight={isLight}
      />
    </div>
  );
}
