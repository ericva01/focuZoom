"use client";

import { useState, memo } from "react";
import Link from "next/link";
import { Logo } from "@/components/common/Logo";
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
  Undo2,
  Redo2,
  Settings,
  Sun,
  Moon,
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
  // Webcam Facecam Toggle & Review
  enableWebcam?: boolean;
  onToggleWebcam?: () => void;
  onOpenWebcamReview?: () => void;
  hasWebcamRecorded?: boolean;
  // Undo & Redo Controls
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  // Sidebar Toggles
  isLeftCollapsed?: boolean;
  onToggleLeftCollapse?: () => void;
  isRightCollapsed?: boolean;
  onToggleRightCollapse?: () => void;
  // Theme & Settings
  theme?: "dark" | "light" | "system";
  onToggleTheme?: () => void;
  onOpenSettings?: () => void;
  autoSaveStatus?: string | null;
}

function EditorHeaderBase({
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
  enableWebcam = false,
  onToggleWebcam,
  onOpenWebcamReview,
  hasWebcamRecorded = false,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  isLeftCollapsed = false,
  onToggleLeftCollapse,
  isRightCollapsed = false,
  onToggleRightCollapse,
  theme = "dark",
  onToggleTheme,
  onOpenSettings,
  autoSaveStatus,
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
    <header className="h-14 border-b border-slate-200 dark:border-white/[0.08] bg-white/90 dark:bg-[#090D16]/80 backdrop-blur-xl px-4 flex items-center justify-between z-30 select-none text-slate-800 dark:text-slate-100">
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
              <PanelLeftOpen className="w-4 h-4 text-[#FF6B2C]" />
            ) : (
              <PanelLeftClose className="w-4 h-4 text-slate-500 dark:text-slate-400" />
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
          <Link href="/" title="FucuFlow Home">
            <Logo size="sm" showText={false} />
          </Link>

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
                className="glass-input text-slate-900 dark:text-white text-xs font-semibold px-2.5 py-1 rounded-lg outline-none w-48"
              />
            ) : (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/[0.06] px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 group border border-transparent hover:border-slate-300 dark:hover:border-white/[0.08]"
              >
                <span>{projectName}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 group-hover:text-[#FF8A4C]">✎</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Center: Aspect Ratio Selector */}
      <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-white/[0.03] p-1 rounded-xl border border-slate-200 dark:border-white/[0.08] backdrop-blur-md text-xs">
        <div className="flex items-center gap-1 px-2.5 text-slate-500 dark:text-slate-400 text-[11px] font-medium">
          <Ratio className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>Canvas:</span>
        </div>
        {aspectRatios.map((ratio) => (
          <button
            key={ratio.value}
            onClick={() => onAspectRatioChange(ratio.value)}
            className={`px-3 py-1 rounded-lg font-medium transition-all duration-200 ${
              aspectRatio === ratio.value
                ? "bg-[#FF6B2C]/20 text-[#FF6B2C] dark:text-[#FF8A4C] font-semibold border border-[#FF6B2C]/40 shadow-glass-sm"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-white/[0.05]"
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
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FF6B2C]/10 border border-[#FF6B2C]/30 text-[10px] font-mono text-[#FF8A4C]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2C] animate-pulse" />
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
            leftIcon={<FolderOpen className="w-3.5 h-3.5 text-[#FF8A4C]" />}
          >
            <span className="hidden sm:inline">Open File</span>
          </Button>
        )}

        {/* Webcam Facecam Quick Toggle & Review Button */}
        {(onOpenWebcamReview || onToggleWebcam) && (
          <Button
            variant={enableWebcam ? "secondary" : "ghost"}
            size="sm"
            onClick={onOpenWebcamReview || onToggleWebcam}
            title={
              enableWebcam
                ? "Camera is ON — Click to review framing & settings"
                : "Camera is OFF — Click to review camera preview before recording"
            }
            className={
              enableWebcam
                ? "border-emerald-400/40 text-emerald-200 bg-emerald-500/15 shadow-glass-sm"
                : hasWebcamRecorded
                ? "border-white/10 text-slate-300 hover:text-white"
                : "border-white/10 text-slate-400 hover:text-white"
            }
            leftIcon={<Camera className={`w-3.5 h-3.5 ${enableWebcam ? "text-emerald-400" : "text-slate-400"}`} />}
          >
            <span className="hidden sm:inline">Webcam</span>
            <span
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded ml-1 font-bold ${
                enableWebcam
                  ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                  : "bg-white/[0.08] text-slate-400"
              }`}
            >
              {enableWebcam ? "REVIEW" : "OFF"}
            </span>
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
            leftIcon={<span className="w-2 h-2 rounded-full bg-[#FF6B2C] animate-pulse" />}
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
                ? "border-[#FF6B2C]/40 text-[#FF8A4C] bg-[#FF6B2C]/15 shadow-glass-sm"
                : "border-white/10 text-slate-400 hover:text-white"
            }
            leftIcon={
              showCursor ? (
                <MousePointer className="w-3.5 h-3.5 text-[#FF8A4C]" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 text-slate-500" />
              )
            }
          >
            <span>Cursor</span>
            <span
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded ml-1 font-bold ${
                showCursor
                  ? "bg-[#FF6B2C]/20 text-[#FF8A4C] border border-[#FF6B2C]/30"
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
          leftIcon={<Camera className="w-3.5 h-3.5 text-[#FF8A4C]" />}
        >
          <span className="hidden sm:inline">Snapshot</span>
        </Button>

        {onUndo && (
          <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-white/[0.04] p-0.5 rounded-lg border border-slate-200 dark:border-white/[0.08]">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onUndo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
            </Button>
            {onRedo && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onRedo}
                disabled={!canRedo}
                title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
              >
                <Redo2 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
              </Button>
            )}
          </div>
        )}

        {onSaveProject && (
          <div className="flex items-center gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={onSaveProject}
              disabled={!isReady}
              title="Save project to local offline storage (Ctrl/Cmd+S)"
              leftIcon={
                isSavedFeedback ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Save className="w-3.5 h-3.5 text-[#FF6B2C]" />
                )
              }
            >
              <span>{isSavedFeedback ? "Saved!" : "Save"}</span>
            </Button>
            {autoSaveStatus && (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400/90 font-mono hidden xl:inline animate-in fade-in">
                {autoSaveStatus}
              </span>
            )}
          </div>
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

        {onToggleTheme && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggleTheme}
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "light" ? (
              <Moon className="w-3.5 h-3.5 text-slate-600 hover:text-slate-900" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-400 hover:text-amber-300" />
            )}
          </Button>
        )}

        {onOpenSettings && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onOpenSettings}
            title="Settings (Theme, 5s Auto-Save, Storage)"
          >
            <Settings className="w-3.5 h-3.5 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white" />
          </Button>
        )}

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
              <PanelRightOpen className="w-4 h-4 text-[#FF6B2C]" />
            ) : (
              <PanelRightClose className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            )}
          </Button>
        )}
      </div>
    </header>
  );
}

export const EditorHeader = memo(EditorHeaderBase);
