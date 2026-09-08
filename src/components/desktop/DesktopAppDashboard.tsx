"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Home,
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
} from "lucide-react";
import { getSavedProjects, deleteProject, saveProject, SavedProject } from "@/utils/projectStorage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from "@/types/editor";
import { AboutView } from "@/components/about/AboutView";

export function DesktopAppDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"home" | "projects" | "about">("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);

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
      },
    };
    saveProject(newProj);
    router.push(`/editor?id=${newProj.id}`);
  };

  const handleNativeImport = async () => {
    if (typeof window !== "undefined" && window.electronAPI) {
      try {
        const result = await window.electronAPI.openVideoDialog();
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
          };
          saveProject(newProj);
          router.push(`/editor?id=${newProj.id}`);
          return;
        }
      } catch (err) {
        console.error("Failed to import via Electron dialog:", err);
      }
    }

    // Fallback: standard file picker
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/mp4,video/webm,video/quicktime,.focuflow";
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
        };
        saveProject(newProj);
        router.push(`/editor?id=${newProj.id}`);
      }
    };
    input.click();
  };

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this project from your desktop workspace?")) {
      const updated = deleteProject(id);
      setSavedProjects(updated);
    }
  };

  const filteredProjects = savedProjects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-screen bg-[#060913] text-[#F8FAFC] font-sans select-none overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. LEFT NAVIGATION SIDEBAR (FocuFlow Obsidian & Sky-Blue Design System)   */}
      {/* ========================================================================= */}
      <aside className="w-60 flex-shrink-0 bg-[#080D1A] border-r border-white/[0.08] flex flex-col justify-between p-4 z-20">
        <div className="space-y-6">
          {/* FocuFlow Twin-Star Workspace Header */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-sky-400/30 transition-all cursor-pointer group">
            {/* Generated High-Res FocuFlow Studio App Logo */}
            <div className="relative w-8 h-8 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(56,189,248,0.35)] border border-sky-400/30 group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="FocuFlow"
                width={32}
                height={32}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-white uppercase tracking-wider truncate">
                FOCUFLOW
              </span>
              <span className="text-[10px] text-sky-300/80 font-mono">Desktop Edition</span>
            </div>
          </div>

          {/* Primary Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab("home")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === "home"
                  ? "bg-white/[0.08] text-white font-semibold border border-white/10 shadow-inner"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
            >
              <Home className={`w-4 h-4 ${activeTab === "home" ? "text-sky-400" : "text-slate-400"}`} />
              <span>Studio</span>
            </button>

            <button
              onClick={() => setActiveTab("projects")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === "projects"
                  ? "bg-white/[0.08] text-white font-semibold border border-white/10 shadow-inner"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Film className={`w-4 h-4 ${activeTab === "projects" ? "text-sky-400" : "text-slate-400"}`} />
                <span>Projects</span>
              </div>
              {savedProjects.length > 0 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-sky-500/15 text-sky-300 border border-sky-400/20">
                  {savedProjects.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("about")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === "about"
                  ? "bg-white/[0.08] text-white font-semibold border border-white/10 shadow-inner"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
            >
              <Sparkles className={`w-4 h-4 ${activeTab === "about" ? "text-sky-400" : "text-slate-400"}`} />
              <span>About Creator</span>
            </button>
          </nav>
        </div>

        {/* Bottom Offline System Status Badge */}
        <div className="pt-4 border-t border-white/[0.08]">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-semibold text-slate-200 truncate">100% Offline Engine</span>
              <span className="text-[10px] text-slate-500 font-mono">Hardware Accelerated</span>
            </div>
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500 ml-auto flex-shrink-0" />
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN DESKTOP WORKSPACE VIEW                                            */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#060913] overflow-y-auto">
        {/* Top Desktop Bar */}
        <header className="h-16 flex-shrink-0 px-6 sm:px-8 border-b border-white/[0.08] flex items-center justify-between gap-6 bg-[#080D1A]/80 backdrop-blur-xl sticky top-0 z-30">
          {/* Search Bar Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved projects..."
              className="w-full bg-[#0B1020] border border-white/10 focus:border-sky-400/60 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 outline-none transition-colors"
            />
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Signature Solid White Capsule Pill CTA */}
            <button
              onClick={() => handleCreateNew("16:9")}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Video</span>
            </button>

            {/* User Profile Avatar */}
            <div
              onClick={() => setActiveTab("about")}
              title="About Eric (Creator)"
              className="flex items-center gap-2.5 pl-3 border-l border-white/10 cursor-pointer group"
            >
              <Avatar className="h-8 w-8 ring-1 ring-sky-400/40 group-hover:ring-sky-400 transition-all bg-[#0E1526]">
                <AvatarImage src="/avatar.jpg" alt="Eric Va" />
                <AvatarFallback className="bg-[#0E1526] text-xs font-bold text-white group-hover:text-sky-300">EV</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <div className="p-6 sm:p-8 space-y-8 flex-1 max-w-7xl mx-auto w-full">
          {activeTab === "about" ? (
            <div className="py-2">
              <AboutView />
            </div>
          ) : (
            <>
              {/* 3 Authentic Quick Creation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: 16:9 Landscape Video */}
            <button
              onClick={() => handleCreateNew("16:9")}
              className="p-4 rounded-2xl bg-[#080D1A]/90 hover:bg-[#0E152B] border border-white/[0.08] hover:border-sky-400/50 transition-all text-left group flex items-start gap-3.5 cursor-pointer shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400 flex-shrink-0 group-hover:scale-105 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                  16:9 Landscape Video
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Blank canvas for desktop tutorials & SaaS demos.
                </p>
              </div>
            </button>

            {/* Card 2: 9:16 Vertical Reel */}
            <button
              onClick={() => handleCreateNew("9:16")}
              className="p-4 rounded-2xl bg-[#080D1A]/90 hover:bg-[#0E152B] border border-white/[0.08] hover:border-sky-400/50 transition-all text-left group flex items-start gap-3.5 cursor-pointer shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400 flex-shrink-0 group-hover:scale-105 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                  9:16 Vertical Reel
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Vertical format for TikTok, Reels & YouTube Shorts.
                </p>
              </div>
            </button>

            {/* Card 3: Open Local Video */}
            <button
              onClick={handleNativeImport}
              className="p-4 rounded-2xl bg-[#080D1A]/90 hover:bg-[#0E152B] border border-white/[0.08] hover:border-sky-400/50 transition-all text-left group flex items-start gap-3.5 cursor-pointer shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400 flex-shrink-0 group-hover:scale-105 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all">
                <FolderOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                  Open Video File
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Import local MP4, WebM, or MOV video from disk.
                </p>
              </div>
            </button>
          </div>

          {/* ======================================================================= */}
          {/* Main Hero Banner (Celestial Obsidian & Electric Ice-Blue)               */}
          {/* ======================================================================= */}
          <div className="relative rounded-3xl bg-gradient-to-r from-[#080D1A] via-[#0D152B] to-[#080D1A] border border-white/[0.08] p-6 sm:p-10 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Background subtle radial sky glow */}
            <div className="absolute right-0 top-0 w-96 h-96 bg-sky-500/[0.08] blur-[100px] pointer-events-none" />

            {/* Left Preview Card with Video Canvas Mockup */}
            <div
              onClick={() => handleCreateNew("16:9")}
              className="relative w-full md:w-96 aspect-video rounded-2xl bg-[#060913] border border-white/10 shadow-2xl overflow-hidden flex items-center justify-center cursor-pointer group flex-shrink-0"
            >
              {/* Circular framing graphic */}
              <div className="w-36 h-36 rounded-full border border-sky-400/20 flex items-center justify-center relative">
                <div className="w-28 h-28 rounded-full bg-[#0E152B]/80 border border-sky-400/30 flex items-center justify-center backdrop-blur-md">
                  {/* Play Button Icon */}
                  <div className="w-12 h-12 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.4)] group-hover:scale-110 transition-all">
                    <Play className="w-5 h-5 fill-current ml-0.5 text-slate-950" />
                  </div>
                </div>
              </div>

              {/* Tag in bottom left */}
              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                <span>FocuFlow 3D Dolly Engine</span>
              </div>
            </div>

            {/* Right Headline & Description & Button */}
            <div className="flex-1 max-w-xl text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Native Desktop Studio</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Create your first video with 3D cinematic camera zooms!
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-lg">
                Automate keyframe zooms, camera tilts, dynamic cursor highlights, and smooth cinematic pans offline with desktop hardware acceleration.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => handleCreateNew("16:9")}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 text-xs sm:text-sm font-bold shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] transition-all cursor-pointer active:scale-95"
                >
                  <span>Get Started</span>
                  <ChevronRight className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* Saved Recent Projects Section (Clean slate with empty state)             */}
          {/* ======================================================================= */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-sky-400" />
                <h3 className="text-base font-bold text-white tracking-tight">Recent Projects</h3>
                <span className="text-xs font-mono text-sky-300 bg-sky-500/15 border border-sky-400/20 px-2 py-0.5 rounded-full">
                  {savedProjects.length}
                </span>
              </div>
            </div>

            {filteredProjects.length === 0 ? (
              /* Clean Empty State when no user projects exist */
              <div className="p-12 rounded-2xl border border-white/[0.08] bg-[#080D1A]/50 backdrop-blur-md text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0E152B] border border-white/10 flex items-center justify-center text-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.15)]">
                  <Film className="w-7 h-7 text-sky-400 stroke-[1.5]" />
                </div>
                <div className="max-w-md space-y-1">
                  <h4 className="text-sm font-bold text-white">No saved projects yet</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Create a new video or import a local recording to start editing with 3D camera zooms.
                  </p>
                </div>
                <button
                  onClick={() => handleCreateNew("16:9")}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create First Video</span>
                </button>
              </div>
            ) : (
              /* Populated Projects Grid in FocuFlow Colors */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => router.push(`/editor?id=${project.id}`)}
                    className="group relative rounded-2xl bg-[#080D1A] border border-white/[0.08] hover:border-sky-400/50 hover:bg-[#0D1429] transition-all p-4 cursor-pointer flex items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-[#0E152B] border border-white/10 flex items-center justify-center text-sky-400 flex-shrink-0 group-hover:scale-105 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors truncate">
                          {project.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-1">
                          <span className="text-sky-400/80">{project.aspectRatio}</span>
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
                        title="Delete project"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
