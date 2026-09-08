"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Camera,
  Download,
  Ratio,
  ExternalLink,
  Square,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  MousePointer,
  EyeOff,
  FolderOpen,
  Save,
  Check,
} from "lucide-react";
import { AspectRatio } from "@/types/editor";

import { Button } from "@/components/ui/Button";

interface EditorHeaderProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  onTakeSnapshot: () => void;
  onOpenExport: () => void;
  onSaveProject?: () => void;
  isSavedFeedback?: boolean;
  isReady: boolean;
  // Electron Desktop props
  isElectron?: boolean;
  onNativeOpenVideo?: () => void;
  // Screen Recording Props
  isRecording?: boolean;
  recordingDuration?: number;
  clickCount?: number;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  // Cursor Overlay Toggle
  showCursor?: boolean;
  onToggleCursor?: () => void;
  // Sidebar Toggles
  isLeftCollapsed?: boolean;
  onToggleLeftCollapse?: () => void;
  isRightCollapsed?: boolean;
  onToggleRightCollapse?: () => void;
}

export function EditorHeader({
  projectName,
  onProjectNameChange,
  aspectRatio,
  onAspectRatioChange,
  onTakeSnapshot,
  onOpenExport,
  onSaveProject,
  isSavedFeedback = false,
  isReady,
  isElectron = false,
  onNativeOpenVideo,
  isRecording = false,
  recordingDuration = 0,
  clickCount = 0,
  onStartRecording,
  onStopRecording,
  showCursor = true,
  onToggleCursor,
  isLeftCollapsed = false,
  onToggleLeftCollapse,
  isRightCollapsed = false,
  onToggleRightCollapse,
}: EditorHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const aspectRatios: { value: AspectRatio; label: string }[] = [
    { value: "16:9", label: "16:9" },
    { value: "9:16", label: "9:16" },
    { value: "4:3", label: "4:3" },
    { value: "1:1", label: "1:1" },
  ];

  const formatRecTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <header className="h-14 border-b border-white/[0.08] bg-[#090D16]/80 backdrop-blur-xl px-4 flex items-center justify-between z-30 select-none">
      {/* Left: Brand, Back & Sidebar Toggle */}
      <div className="flex items-center gap-2">
        {onToggleLeftCollapse && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggleLeftCollapse}
            title={isLeftCollapsed ? "Expand Left Settings Panel" : "Collapse Left Settings Panel"}
          >
            {isLeftCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-sky-400" />
            ) : (
              <PanelLeftClose className="w-4 h-4 text-slate-400" />
            )}
          </Button>
        )}

        <Link href={isElectron ? "/desktop" : "/"}>
          <Button
            variant="ghost"
            size="icon-sm"
            title={isElectron ? "Return to Desktop Studio" : "Return to Landing Page"}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>

        <div className="flex items-center gap-2.5 ml-1">
          <div className="w-7 h-7 rounded-lg overflow-hidden border border-white/20 shadow-[0_0_12px_rgba(56,189,248,0.25)] flex-shrink-0">
            <Image src="/logo.png" alt="FocuFlow" width={28} height={28} className="w-full h-full object-cover" priority />
          </div>

          {/* Project Title inline editor */}
          <div className="flex items-center gap-1.5">
            {isEditingTitle ? (
              <input
                type="text"
                value={projectName}
                onChange={(e) => onProjectNameChange(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === "Enter" && setIsEditingTitle(false)}
                autoFocus
                className="glass-input text-white text-xs font-semibold px-2.5 py-1 rounded-lg outline-none w-48"
              />
            ) : (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/[0.06] px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 group border border-transparent hover:border-white/[0.08]"
              >
                <span>{projectName}</span>
                <span className="text-[10px] text-slate-500 group-hover:text-sky-300">✎</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Center: Aspect Ratio Selector */}
      <div className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.08] backdrop-blur-md text-xs">
        <div className="flex items-center gap-1 px-2.5 text-slate-400 text-[11px] font-medium">
          <Ratio className="w-3.5 h-3.5 text-slate-400" />
          <span>Canvas:</span>
        </div>
        {aspectRatios.map((ratio) => (
          <button
            key={ratio.value}
            onClick={() => onAspectRatioChange(ratio.value)}
            className={`px-3 py-1 rounded-lg font-medium transition-all duration-200 ${
              aspectRatio === ratio.value
                ? "bg-sky-500/20 text-sky-200 font-semibold border border-sky-400/30 shadow-glass-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]"
            }`}
          >
            {ratio.label}
          </button>
        ))}
      </div>

      {/* Right: Snapshot, Recording, Export Action & Right Sidebar Toggle */}
      <div className="flex items-center gap-2">
        {/* Electron Native Desktop Badge */}
        {isElectron && (
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/25 text-[10px] font-mono text-sky-300">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span>Desktop App</span>
          </div>
        )}

        {/* Native File Open Button */}
        {isElectron && onNativeOpenVideo && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onNativeOpenVideo}
            title="Import video file from computer (Ctrl/Cmd+O)"
            leftIcon={<FolderOpen className="w-3.5 h-3.5 text-sky-300" />}
          >
            <span className="hidden sm:inline">Open File</span>
          </Button>
        )}

        {/* Screen Recording Button */}
        {isRecording ? (
          <Button
            variant="danger"
            size="sm"
            onClick={onStopRecording}
            className="animate-pulse font-bold"
            leftIcon={<Square className="w-3 h-3 fill-white text-white" />}
          >
            <span>Stop ({formatRecTime(recordingDuration)})</span>
            {clickCount > 0 && (
              <span className="bg-black/40 px-1.5 py-0.5 rounded text-[10px] font-mono font-normal ml-1">
                {clickCount}
              </span>
            )}
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={onStartRecording}
            title="Record your screen, window, or tab with auto click logging"
            leftIcon={<span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />}
          >
            Record Screen
          </Button>
        )}

        {/* Cursor Overlay Quick Toggle */}
        {onToggleCursor && (
          <Button
            variant={showCursor ? "secondary" : "ghost"}
            size="sm"
            onClick={onToggleCursor}
            title={showCursor ? "Hide Simulated Cursor Overlay" : "Show Simulated Cursor Overlay"}
            className={
              showCursor
                ? "border-sky-400/40 text-sky-200 bg-sky-500/15 shadow-glass-sm"
                : "border-white/10 text-slate-400 hover:text-white"
            }
            leftIcon={
              showCursor ? (
                <MousePointer className="w-3.5 h-3.5 text-sky-300" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 text-slate-500" />
              )
            }
          >
            <span>Cursor</span>
            <span
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded ml-1 font-bold ${
                showCursor
                  ? "bg-sky-400/20 text-sky-300 border border-sky-400/30"
                  : "bg-white/[0.08] text-slate-400"
              }`}
            >
              {showCursor ? "ON" : "OFF"}
            </span>
          </Button>
        )}

        <Button
          variant="secondary"
          size="sm"
          onClick={onTakeSnapshot}
          disabled={!isReady}
          title="Save current canvas frame as high-res PNG"
          leftIcon={<Camera className="w-3.5 h-3.5 text-sky-300" />}
        >
          <span className="hidden sm:inline">Snapshot</span>
        </Button>

        {onSaveProject && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onSaveProject}
            disabled={!isReady}
            title="Save project to workspace and local storage (Ctrl/Cmd+S)"
            leftIcon={
              isSavedFeedback ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Save className="w-3.5 h-3.5 text-sky-400" />
              )
            }
          >
            <span>{isSavedFeedback ? "Saved!" : "Save"}</span>
          </Button>
        )}

        <Button
          variant="primary"
          size="sm"
          onClick={onOpenExport}
          disabled={!isReady}
          leftIcon={<Download className="w-3.5 h-3.5" />}
        >
          <span>Export Video</span>
        </Button>

        <Link href="/contact">
          <Button
            variant="ghost"
            size="icon-sm"
            title="Feedback & Contact"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </Link>

        {onToggleRightCollapse && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggleRightCollapse}
            title={isRightCollapsed ? "Expand Click Inspector" : "Collapse Click Inspector"}
          >
            {isRightCollapsed ? (
              <PanelRightOpen className="w-4 h-4 text-sky-400" />
            ) : (
              <PanelRightClose className="w-4 h-4 text-slate-400" />
            )}
          </Button>
        )}
      </div>
    </header>
  );
}
