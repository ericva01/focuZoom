"use client";

import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Repeat,
  Crosshair,
  Ratio,
} from "lucide-react";
import { ClickEvent, CanvasConfig, AspectRatio, CursorPoint } from "@/types/editor";
import { VideoCanvas } from "@/components/editor/VideoCanvas";
import { Button } from "@/components/ui/Button";
import { formatSMPTETimecode } from "./MultiTrackTimeline";

interface PreviewMonitorProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  videoSrc: string | null;
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
}

export function PreviewMonitor({
  videoRef,
  canvasRef,
  videoSrc,
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
}: PreviewMonitorProps) {
  const aspectRatios: { id: AspectRatio; label: string }[] = [
    { id: "16:9", label: "16:9 Landscape" },
    { id: "9:16", label: "9:16 Reel/TikTok" },
    { id: "1:1", label: "1:1 Square" },
    { id: "4:3", label: "4:3 Classic" },
  ];

  return (
    <div className="h-full flex flex-col bg-[#090D16]/50 select-none overflow-hidden relative">
      {/* 1. Monitor Top Control Bar */}
      <div className="h-10 px-4 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between gap-2 text-xs flex-shrink-0 z-20">
        {/* Left: Aspect Ratio Selector */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 shadow-glass-inner">
          <Ratio className="w-3.5 h-3.5 text-rose-400 ml-1 mr-0.5" />
          {aspectRatios.map((ar) => (
            <button
              key={ar.id}
              type="button"
              onClick={() => onChangeConfig({ aspectRatio: ar.id })}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-mono transition-all ${
                config.aspectRatio === ar.id
                  ? "bg-rose-500/25 text-rose-200 font-bold border border-rose-400/40 shadow-glass-sm"
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

        {/* Right: Add Keyframe Mode Toggle */}
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
        </div>
      </div>

      {/* 2. Main Video Canvas Viewport */}
      <div className="flex-1 min-h-0 w-full relative overflow-hidden flex items-center justify-center p-2 sm:p-3">
        <VideoCanvas
          videoRef={videoRef}
          canvasRef={canvasRef}
          videoSrc={videoSrc}
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
          onChangeConfig={onChangeConfig}
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
            className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 flex items-center justify-center border border-rose-400/30 shadow-glass-sm"
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

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToggleLoop}
            title={isLooping ? "Looping On" : "Looping Off"}
            className={`p-1.5 rounded-lg border transition-all ${
              isLooping
                ? "bg-rose-500/20 text-rose-300 border-rose-400/30"
                : "text-slate-400 hover:text-white border-transparent"
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
