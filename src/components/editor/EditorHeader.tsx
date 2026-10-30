"use client";

import { useState, memo } from "react";
import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import {
  ArrowLeft,
  Download,
  Save,
  Check,
  Circle,
  Square,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { AspectRatio } from "@/types/editor";
import { Button } from "@/components/ui/Button";

interface EditorHeaderProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  aspectRatio?: AspectRatio;
  onAspectRatioChange?: (ratio: AspectRatio) => void;
  onTakeSnapshot?: () => void;
  onOpenExport: () => void;
  onSaveProject?: () => void;
  isSavedFeedback?: boolean;
  onOpenGoogleDrive?: () => void;
  isGoogleDriveConnected?: boolean;
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
  hideDeviceCursor?: boolean;
  onToggleHideDeviceCursor?: () => void;
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
  onOpenExport,
  onSaveProject,
  isSavedFeedback = false,
  isReady,
  isElectron = false,
  isRecording = false,
  recordingDuration = 0,
  clickCount = 0,
  onStartRecording,
  onStopRecording,
  isLeftCollapsed = false,
  onToggleLeftCollapse,
}: EditorHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);

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
            title={isLeftCollapsed ? "Expand Left Panel" : "Collapse Left Panel"}
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
                className="bg-white dark:bg-black/50 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white text-xs font-semibold px-2.5 py-1 rounded-lg outline-none w-48 shadow-xs focus:border-[#FF6B2C]"
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

      {/* Right: Only recordscreen (icon), save (icon), and export */}
      <div className="flex items-center gap-2">
        {/* Screen Recording Button (Icon only) */}
        {isRecording ? (
          <Button
            variant="danger"
            size="icon-sm"
            onClick={onStopRecording}
            className="animate-pulse border-red-500/50 shadow-sm shadow-red-500/30"
            title={`Stop Recording (${formatRecTime(recordingDuration)})${clickCount > 0 ? ` - ${clickCount} clicks logged` : ""}`}
          >
            <Square className="w-3.5 h-3.5 fill-white text-white" />
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="icon-sm"
            onClick={onStartRecording}
            title="Record Screen with click logging"
            className="group hover:border-[#FF6B2C]/50"
          >
            <Circle className="w-3.5 h-3.5 fill-[#FF6B2C] text-[#FF6B2C] group-hover:scale-110 transition-transform" />
          </Button>
        )}

        {/* Save Project Button (Icon only) */}
        {onSaveProject && (
          <Button
            variant={isSavedFeedback ? "active" : "secondary"}
            size="icon-sm"
            onClick={onSaveProject}
            disabled={!isReady}
            title={isSavedFeedback ? "Project saved successfully!" : "Save project to local offline storage (Ctrl+S)"}
            className={isSavedFeedback ? "border-emerald-500/50 text-emerald-500 bg-emerald-500/10" : ""}
          >
            {isSavedFeedback ? (
              <Check className="w-4 h-4 text-emerald-500 animate-in zoom-in-75 duration-200" />
            ) : (
              <Save className="w-4 h-4 text-[#FF6B2C]" />
            )}
          </Button>
        )}

        {/* Export Video Button */}
        <Button
          variant="primary"
          size="sm"
          onClick={onOpenExport}
          disabled={!isReady}
          leftIcon={<Download className="w-3.5 h-3.5" />}
          title="Export Video (MP4 / WebM)"
        >
          <span>Export Video</span>
        </Button>
      </div>
    </header>
  );
}

export const EditorHeader = memo(EditorHeaderBase);
