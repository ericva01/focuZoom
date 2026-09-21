"use client";

import { useRef, useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Clock,
  Repeat,
  Crosshair,
} from "lucide-react";
import { ClickEvent } from "@/types/editor";
import { formatTimecode } from "@/utils/easing";

import { Button } from "@/components/ui/Button";

interface TimelineProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onStepFrames: (delta: number) => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  isLooping: boolean;
  onToggleLoop: () => void;
  events: ClickEvent[];
  onSelectEvent: (event: ClickEvent) => void;
  isAddMode: boolean;
  onToggleAddMode: () => void;
}

export function Timeline({
  currentTime,
  duration,
  isPlaying,
  onTogglePlay,
  onSeek,
  onStepFrames,
  playbackSpeed,
  onSpeedChange,
  isLooping,
  onToggleLoop,
  events,
  onSelectEvent,
  isAddMode,
  onToggleAddMode,
}: TimelineProps) {
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const [hoverTime, setHoverTime] = useState<number | null>(null);

  const safeDuration = duration > 0 ? duration : 1;
  const progressPercent = Math.min(100, (currentTime / safeDuration) * 100);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * duration);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const hoverX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, hoverX / rect.width));
    setHoverTime(ratio * duration);
  };

  return (
    <div className="h-24 border-t border-white/[0.08] bg-[#090D16]/85 backdrop-blur-xl px-6 flex flex-col justify-center gap-2 select-none z-20">
      {/* 1. Scrubber Track */}
      <div className="relative flex items-center group">
        <div
          ref={progressBarRef}
          onClick={handleTimelineClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverTime(null)}
          className="h-3 w-full bg-black/40 hover:bg-black/30 rounded-full cursor-pointer relative overflow-visible border border-white/[0.1] transition-colors shadow-inner"
        >
          {/* Played Progress bar */}
          <div
            className="h-full bg-gradient-to-r from-[#FF7A3D] to-[#FF8A4C] rounded-full relative shadow-[0_0_12px_rgba(255,107,44,0.4)]"
            style={{ width: `${progressPercent}%` }}
          >
            {/* Playhead thumb */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-glass-md border-2 border-[#FF6B2C] scale-90 group-hover:scale-110 transition-transform" />
          </div>

          {/* Hover indicator tooltip */}
          {hoverTime !== null && (
            <div
              className="absolute -top-7 -translate-x-1/2 px-2 py-0.5 rounded-lg glass-panel text-[10px] font-mono text-white border border-white/[0.15] shadow-glass-sm pointer-events-none"
              style={{ left: `${(hoverTime / safeDuration) * 100}%` }}
            >
              {formatTimecode(hoverTime)}
            </div>
          )}

          {/* Interactive Click Event Marker Pins */}
          {events.map((ev) => {
            const eventPercent = (ev.timestamp / safeDuration) * 100;
            return (
              <button
                key={ev.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectEvent(ev);
                }}
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full z-10 transition-transform hover:scale-150 flex items-center justify-center border border-white/60 ${
                  ev.enabled ? "bg-[#FF6B2C] shadow-[0_0_8px_rgba(255,107,44,0.6)]" : "bg-slate-600 opacity-60"
                }`}
                style={{ left: `${eventPercent}%` }}
                title={`Zoom Event: ${ev.label || "Click target"} at ${formatTimecode(ev.timestamp)} (${ev.zoom}x)`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#090D16]" />
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Control bar */}
      <div className="flex items-center justify-between text-xs text-slate-300">
        {/* Left: Timecode & Add Click Event Mode Button */}
        <div className="flex items-center gap-3">
          <div className="font-mono text-xs font-semibold text-white bg-white/[0.04] px-3 py-1 rounded-xl border border-white/[0.08] flex items-center gap-1.5 shadow-glass-sm">
            <Clock className="w-3.5 h-3.5 text-[#FF6B2C]" />
            <span>{formatTimecode(currentTime)}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{formatTimecode(duration)}</span>
          </div>

          <Button
            variant={isAddMode ? "active" : "secondary"}
            size="sm"
            onClick={onToggleAddMode}
            leftIcon={<Crosshair className={`w-3.5 h-3.5 ${isAddMode ? "animate-spin" : ""}`} />}
            title="Click directly on the preview canvas to place a zoom keyframe"
          >
            {isAddMode ? "Click Canvas to Place Target" : "Add Click Event"}
          </Button>
        </div>

        {/* Center: Playback Controls */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onSeek(0)}
            title="Restart Video (00:00)"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onStepFrames(-1)}
            title="Step back 1 second"
          >
            <SkipBack className="w-4 h-4" />
          </Button>

          <Button
            variant="primary"
            size="icon-md"
            onClick={onTogglePlay}
            className="w-10 h-10 rounded-xl"
            title={isPlaying ? "Pause Video (Space)" : "Play Video (Space)"}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5 fill-white" />}
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onStepFrames(1)}
            title="Step forward 1 second"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Right: Playback Speed & Loop Toggle */}
        <div className="flex items-center gap-2">
          {/* Speed selector */}
          <div className="flex items-center bg-white/[0.03] rounded-xl p-1 border border-white/[0.08] backdrop-blur-md">
            {[0.5, 1, 1.5, 2].map((spd) => (
              <button
                key={spd}
                onClick={() => onSpeedChange(spd)}
                className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono transition-all duration-200 ${
                  playbackSpeed === spd
                    ? "bg-[#FF6B2C]/20 text-[#FF8A4C] font-bold border border-[#FF6B2C]/30 shadow-glass-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Loop toggle */}
          <Button
            variant={isLooping ? "active" : "ghost"}
            size="icon-sm"
            onClick={onToggleLoop}
            title={isLooping ? "Loop enabled" : "Loop disabled"}
          >
            <Repeat className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
