"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Repeat,
  Crosshair,
  Ratio,
  Maximize,
  Minimize,
} from "lucide-react";
import { ClickEvent, CanvasConfig, AspectRatio, CursorPoint, TimelineClip } from "@/types/editor";
import { VideoCanvas } from "@/components/editor/VideoCanvas";
import { Button } from "@/components/ui/Button";
import { formatSMPTETimecode } from "./MultiTrackTimeline";

interface PreviewMonitorProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  videoSrc: string | null;
  clips?: TimelineClip[];
  events: ClickEvent[];
  config: CanvasConfig;
  onChangeConfig: (updates: Partial<CanvasConfig>) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  isAddMode: boolean;
  onToggleAddMode: () => void;
  onAddClickAtCoords: (x: number, y: number) => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  onStepFrames: (delta: number) => void;
  isLooping: boolean;
  onToggleLoop: () => void;
  cursorTrail?: CursorPoint[];
  selectedEventId?: string | null;
  onUpdateEvent?: (id: string, updates: Partial<ClickEvent>) => void;
  webcamStream?: MediaStream | null;
  webcamUrl?: string | null;
  isWebcamHidden?: boolean;
}

export function PreviewMonitor({
  videoRef,
  canvasRef,
  videoSrc,
  clips,
  events,
  config,
  onChangeConfig,
  isPlaying,
  onTogglePlay,
  isAddMode,
  onToggleAddMode,
  onAddClickAtCoords,
  currentTime,
  duration,
  onSeek,
  onStepFrames,
  isLooping,
  onToggleLoop,
  cursorTrail,
  selectedEventId,
  onUpdateEvent,
  webcamStream,
  webcamUrl,
  isWebcamHidden = false,
}: PreviewMonitorProps) {
  const monitorRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        if (monitorRef.current?.requestFullscreen) {
          await monitorRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.warn("Fullscreen toggle error:", err);
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("webkitfullscreenchange", handleFsChange);
    };
  }, []);

  // Keyboard shortcut: Press 'F' to toggle fullscreen when not in an input field
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || "").toLowerCase();
      if (
        activeTag === "input" ||
        activeTag === "textarea" ||
        (document.activeElement as HTMLElement)?.isContentEditable
      ) {
        return;
      }
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleFullscreen]);

  const aspectRatios: { id: AspectRatio; label: string }[] = [
    { id: "16:9", label: "16:9 Landscape" },
    { id: "9:16", label: "9:16 Reel/TikTok" },
    { id: "1:1", label: "1:1 Square" },
    { id: "4:3", label: "4:3 Classic" },
  ];

  return (
    <div
      ref={monitorRef}
      className={`h-full flex flex-col select-none overflow-hidden relative transition-colors duration-200 ${
        isFullscreen ? "fixed inset-0 z-50 bg-[#06080F]" : "bg-[#090D16]/50"
      }`}
    >
      {/* 1. Monitor Top Control Bar */}
      <div className="h-10 px-4 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between gap-2 text-xs flex-shrink-0 z-20">
        {/* Left: Aspect Ratio Selector */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 shadow-glass-inner">
          <Ratio className="w-3.5 h-3.5 text-[#FF6B2C] ml-1 mr-0.5" />
          {aspectRatios.map((ar) => (
            <button
              key={ar.id}
              type="button"
              onClick={() => onChangeConfig({ aspectRatio: ar.id })}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-mono transition-all ${
                config.aspectRatio === ar.id
                  ? "bg-[#FF6B2C]/25 text-[#FF8A4C] font-bold border border-[#FF6B2C]/40 shadow-glass-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {ar.id}
            </button>
          ))}
        </div>

        {/* Center: Stage Status Badge */}
        <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-slate-400 bg-white/[0.03] px-3 py-1 rounded-xl border border-white/[0.08]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-white font-medium">Stage Monitor</span>
          <span className="text-slate-500">·</span>
          <span>{config.aspectRatio === "9:16" ? "1080x1920" : "1920x1080"} 60 FPS</span>
        </div>

        {/* Right: Add Keyframe Mode Toggle & Fullscreen Button */}
        <div className="flex items-center gap-2">
          <Button
            variant={isAddMode ? "active" : "secondary"}
            size="sm"
            onClick={onToggleAddMode}
            leftIcon={<Crosshair className={`w-3.5 h-3.5 ${isAddMode ? "animate-spin" : ""}`} />}
            className="text-[11px]"
          >
            {isAddMode ? "Click Video to Add Zoom" : "Click-to-Zoom Mode"}
          </Button>
          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen (Esc / F)" : "Fullscreen (F)"}
            className={`p-1.5 rounded-xl border transition-all ${
              isFullscreen
                ? "bg-[#FF6B2C]/20 text-[#FF8A4C] border-[#FF6B2C]/30"
                : "text-slate-400 hover:text-white border-white/10 bg-white/[0.04] hover:bg-white/[0.08]"
            }`}
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. Main Video Canvas Viewport */}
      <div className="flex-1 min-h-0 w-full relative overflow-hidden flex items-center justify-center p-2 sm:p-3">
        <VideoCanvas
          videoRef={videoRef}
          canvasRef={canvasRef}
          videoSrc={videoSrc}
          clips={clips}
          currentTime={currentTime}
          events={events}
          config={config}
          isPlaying={isPlaying}
          onTogglePlay={onTogglePlay}
          isAddMode={isAddMode}
          onAddClickAtCoords={onAddClickAtCoords}
          aspectRatio={config.aspectRatio}
          cursorTrail={cursorTrail}
          selectedEventId={selectedEventId}
          onUpdateEvent={onUpdateEvent}
          webcamStream={webcamStream}
          webcamUrl={webcamUrl}
          isWebcamHidden={isWebcamHidden}
          onChangeConfig={onChangeConfig}
          onToggleFullscreen={toggleFullscreen}
          isFullscreen={isFullscreen}
        />
      </div>

      {/* 3. Bottom Monitor Floating Transport Dock */}
      <div className="h-10 px-4 border-t border-white/[0.06] bg-black/40 flex items-center justify-between text-xs flex-shrink-0 z-20">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onSeek(0)}
            title="Restart Video"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onStepFrames(-1)}
            title="Step Back 1 Frame"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06]"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onTogglePlay}
            title={isPlaying ? "Pause" : "Play"}
            className="w-6 h-6 rounded-lg bg-[#FF6B2C]/20 text-[#FF8A4C] hover:bg-[#FF6B2C]/30 flex items-center justify-center border border-[#FF6B2C]/30 shadow-glass-sm"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
          </button>
          <button
            type="button"
            onClick={() => onStepFrames(1)}
            title="Step Forward 1 Frame"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06]"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="font-mono text-xs text-slate-300">
          <span className="text-white font-semibold">{formatSMPTETimecode(currentTime)}</span>
          <span className="text-slate-500"> / </span>
          <span className="text-slate-400">{formatSMPTETimecode(duration)}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleLoop}
            title={isLooping ? "Looping On" : "Looping Off"}
            className={`p-1.5 rounded-lg border transition-all ${
              isLooping
                ? "bg-[#FF6B2C]/20 text-[#FF8A4C] border-[#FF6B2C]/30"
                : "text-slate-400 hover:text-white border-transparent hover:bg-white/[0.06]"
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen (Esc / F)" : "Fullscreen (F)"}
            className={`p-1.5 rounded-lg border transition-all ${
              isFullscreen
                ? "bg-[#FF6B2C]/20 text-[#FF8A4C] border-[#FF6B2C]/30"
                : "text-slate-400 hover:text-white border-transparent hover:bg-white/[0.06]"
            }`}
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
