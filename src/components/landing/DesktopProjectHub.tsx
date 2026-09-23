"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  FolderOpen,
  Video,
  Clock,
  Trash2,
  Play,
  Monitor,
  Smartphone,
  ChevronRight,
  HardDrive,
  FileVideo,
} from "lucide-react";
import { getSavedProjects, deleteProject, saveProject, SavedProject } from "@/utils/projectStorage";
import { AspectRatio } from "@/types/editor";
import { desktopBridge } from "@/lib/desktopBridge";

export function DesktopProjectHub() {
  const router = useRouter();
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [isElectron, setIsElectron] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "16:9" | "9:16">("all");

  useEffect(() => {
    setProjects(getSavedProjects());
    setIsElectron(desktopBridge.isDesktop);
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this project from your workspace?")) {
      const updated = deleteProject(id);
      setProjects(updated);
    }
  };

  const handleOpenLocalVideo = async () => {
    if (desktopBridge.isDesktop) {
      try {
        const result = await desktopBridge.openVideoDialog();
        if (!result.canceled && result.dataUrl) {
          // Create temporary project and redirect to editor
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
        console.error("Failed to open native video:", err);
      }
    }

    // Fallback: standard file input
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
        };
        saveProject(newProj);
        router.push(`/editor?id=${newProj.id}`);
      }
    };
    input.click();
  };

  const handleCreateNew = (ratio: AspectRatio = "16:9") => {
    const newProj: SavedProject = {
      id: "proj-" + Date.now(),
      name: `Untitled Project (${ratio})`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      duration: 10,
      aspectRatio: ratio,
      clipCount: 1,
      keyframeCount: 1,
      config: {
        aspectRatio: ratio,
      },
    };
    saveProject(newProj);
    router.push(`/editor?id=${newProj.id}`);
  };

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === "all") return true;
    return p.aspectRatio === activeFilter;
  });

  const formatTimestamp = (ms: number) => {
    const diff = Date.now() - ms;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 5) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(ms).toLocaleDateString();
  };

  return (
    <section id="workspace" className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Background celestial glow aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#FF6B2C]/10 via-indigo-500/10 to-transparent blur-[120px] pointer-events-none" />

      {/* Header & Status Indicator */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B2C]/10 border border-[#FF6B2C]/20 text-xs font-mono text-[#FF8A4C] mb-3 shadow-[0_0_15px_rgba(255,107,44,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2C] animate-pulse" />
            <span>{isElectron ? "DESKTOP OFFLINE WORKSPACE" : "LOCAL CREATOR WORKSPACE"}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">{projects.length} Saved Files</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Create, Edit & Saved Projects
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
            Jump back into your recent timeline edits, open local video files with native OS dialogs, or start a new 3D cinematic canvas.
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleOpenLocalVideo}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 text-sm font-medium text-slate-200 hover:text-white transition-all cursor-pointer active:scale-95"
          >
            <FolderOpen className="w-4 h-4 text-[#FF6B2C]" />
            <span>Open Local File</span>
          </button>

          <button
            onClick={() => handleCreateNew("16:9")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black hover:bg-slate-100 text-sm font-semibold shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* 3 Quick Action Starter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        {/* Card 1: 16:9 Landscape Blank */}
        <div className="group relative rounded-2xl p-5 bg-gradient-to-b from-[#0B1020]/90 to-[#070B16]/90 border border-white/[0.08] hover:border-[#FF6B2C]/40 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#FF6B2C]/10 border border-[#FF6B2C]/20 flex items-center justify-center text-[#FF6B2C] mb-4 group-hover:scale-110 transition-transform">
              <Monitor className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white group-hover:text-[#FF8A4C] transition-colors">
              16:9 Widescreen Studio
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Tailored for YouTube tutorials, product presentations, and desktop software demos.
            </p>
          </div>
          <div className="pt-5 mt-4 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">1920 × 1080</span>
            <button
              onClick={() => handleCreateNew("16:9")}
              className="text-xs font-semibold text-[#FF6B2C] hover:text-[#FF8A4C] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
            >
              <span>Create</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: 9:16 Vertical Reel */}
        <div className="group relative rounded-2xl p-5 bg-gradient-to-b from-[#0B1020]/90 to-[#070B16]/90 border border-white/[0.08] hover:border-[#FF6B2C]/40 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#FF6B2C]/10 border border-[#FF6B2C]/20 flex items-center justify-center text-[#FF6B2C] mb-4 group-hover:scale-110 transition-transform">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white group-hover:text-[#FF8A4C] transition-colors">
              9:16 TikTok / Reel
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Optimized for mobile storytelling, social shorts, and Instagram Reels with dynamic pan.
            </p>
          </div>
          <div className="pt-5 mt-4 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">1080 × 1920</span>
            <button
              onClick={() => handleCreateNew("9:16")}
              className="text-xs font-semibold text-[#FF6B2C] hover:text-[#FF8A4C] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
            >
              <span>Create</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Screen Recording Direct */}
        <div className="group relative rounded-2xl p-5 bg-gradient-to-b from-[#0B1020]/90 to-[#070B16]/90 border border-white/[0.08] hover:border-emerald-400/40 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white group-hover:text-emerald-300 transition-colors">
              Direct Screen Capture
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Record active window or full monitor with automated click logging and instant timeline import.
            </p>
          </div>
          <div className="pt-5 mt-4 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">Native FPS</span>
            <Link
              href="/editor?action=record"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
            >
              <span>Record</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Saved Projects Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-[#FF6B2C]" />
          <span className="text-sm font-semibold text-white">Saved Project Files</span>
          <span className="text-xs font-mono text-slate-400 bg-white/[0.06] px-2 py-0.5 rounded-full">
            {filteredProjects.length}
          </span>
        </div>

        {/* Aspect Ratio Filter */}
        <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-lg border border-white/[0.08]">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              activeFilter === "all"
                ? "bg-[#FF6B2C]/20 text-[#FF8A4C] font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter("16:9")}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              activeFilter === "16:9"
                ? "bg-[#FF6B2C]/20 text-[#FF8A4C] font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            16:9
          </button>
          <button
            onClick={() => setActiveFilter("9:16")}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              activeFilter === "9:16"
                ? "bg-[#FF6B2C]/20 text-[#FF8A4C] font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            9:16
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.08] bg-[#080D1A]/50 p-12 text-center">
          <FileVideo className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <p className="text-sm font-semibold text-white">No saved projects found</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Create your first project or import a local recording to begin editing.
          </p>
          <button
            onClick={() => handleCreateNew("16:9")}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-slate-100 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Project</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => router.push(`/editor?id=${project.id}`)}
              className="group relative rounded-2xl bg-[#080D1A]/80 border border-white/[0.08] hover:border-[#FF6B2C]/40 hover:shadow-[0_10px_35px_rgba(255,107,44,0.15)] transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
            >
              {/* Thumbnail / Simulated Preview Canvas */}
              <div className="relative aspect-video w-full bg-[#050811] overflow-hidden border-b border-white/[0.06] flex items-center justify-center group-hover:scale-[1.01] transition-transform">
                {project.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.thumbnail}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full p-4 flex flex-col justify-between relative bg-gradient-to-br from-[#0B1328] via-[#080D1A] to-[#04060E]">
                    {/* Simulated canvas window */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#FF6B2C]/80" />
                        <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                        <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF6B2C]/10 border border-[#FF6B2C]/20 text-[#FF8A4C]">
                        {project.aspectRatio}
                      </span>
                    </div>

                    {/* Center Icon & play trigger on hover */}
                    <div className="self-center flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-[#FF6B2C] group-hover:text-black text-white flex items-center justify-center backdrop-blur-md transition-all shadow-lg">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Timeline bar preview */}
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden flex gap-1 p-0.5">
                      <div className="h-full bg-[#FF6B2C] rounded-full w-2/5" />
                      <div className="h-full bg-indigo-400 rounded-full w-1/4" />
                      <div className="h-full bg-[#FF6B2C]/40 rounded-full flex-1" />
                    </div>
                  </div>
                )}

                {/* Floating Aspect Ratio Badge */}
                <div className="absolute top-2.5 right-2.5">
                  <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono font-medium text-white">
                    {project.aspectRatio}
                  </span>
                </div>
              </div>

              {/* Card Meta & Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-[#FF8A4C] transition-colors truncate">
                    {project.name}
                  </h4>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1.5 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {formatTimestamp(project.updatedAt)}
                    </span>
                    <span>·</span>
                    <span>{project.duration}s</span>
                    <span>·</span>
                    <span className="text-[#FF8A4C]/90">{project.keyframeCount || 1} Keyframes</span>
                  </div>
                </div>

                {/* Bottom Actions: Open in Studio & Delete */}
                <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium group-hover:text-white transition-colors flex items-center gap-1">
                    <span>Open & Edit</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>

                  <button
                    onClick={(e) => handleDelete(project.id, e)}
                    title="Delete project"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-[#FF6B2C] hover:bg-[#FF6B2C]/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
