"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Scissors,
  Trash2,
  Combine,
  Magnet,
  Repeat,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ZoomIn,
  ZoomOut,
  Focus,
  Undo2,
  Redo2,
  Video as VideoIcon,
  Mic,
} from "lucide-react";
import { ClickEvent, TimelineClip } from "@/types/editor";

interface MultiTrackTimelineProps {
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
  onUpdateEvent?: (id: string, updates: Partial<ClickEvent>) => void;
  onDeleteEvent?: (id: string) => void;
  onAddKeyframeAtCurrentTime: () => void;
  clips: TimelineClip[];
  selectedClipId: string | null;
  onSelectClip: (id: string | null) => void;
  onSplitClip: (clipId: string, splitTime: number) => void;
  onTrimClip: (clipId: string, newStart: number, newEnd: number) => void;
  onMoveClip?: (clipId: string, newStart: number) => void;
  onDeleteClip: (clipId: string) => void;
  onRippleDeleteClip: (clipId: string) => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

/**
 * Formats seconds into HH:MM:SS:FF (30fps SMPTE style)
 */
export function formatSMPTETimecode(seconds: number, fps = 30): string {
  if (isNaN(seconds) || seconds < 0) return "00:00:00:00";
  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  const frames = Math.floor((seconds % 1) * fps);

  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}:${frames
    .toString()
    .padStart(2, "0")}`;
}

export function MultiTrackTimeline({
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
  onAddKeyframeAtCurrentTime,
  clips,
  selectedClipId,
  onSelectClip,
  onSplitClip,
  onTrimClip,
  onMoveClip,
  onDeleteClip,
  onRippleDeleteClip,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
}: MultiTrackTimelineProps) {
  const tracksScrollRef = useRef<HTMLDivElement | null>(null);

  // Timeline UI States
  const [zoomScale, setZoomScale] = useState<number>(1.0); // 0.5x (overview) to 3.0x (sub-second precision)
  const [snappingEnabled, setSnappingEnabled] = useState<boolean>(true);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isVideoHidden, setIsVideoHidden] = useState<boolean>(false);
  const [isKeyframeTrackLocked, setIsKeyframeTrackLocked] = useState<boolean>(false);

  // Interactive Dragging States
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);
  const [trimmingState, setTrimmingState] = useState<{
    clipId: string;
    handle: "start" | "end";
    initialTimelineStart: number;
    initialTimelineEnd: number;
    startX: number;
  } | null>(null);
  const [draggingClipState, setDraggingClipState] = useState<{
    clipId: string;
    initialStartTimeline: number;
    initialEndTimeline: number;
    duration: number;
    startX: number;
  } | null>(null);

  const safeDuration = Math.max(1, duration || 12);
  // Total virtual timeline duration can span several minutes (e.g. at least max clip end or 2 minutes)
  const totalTimelineDuration = Math.max(
    safeDuration,
    currentTime,
    clips.reduce((max, c) => Math.max(max, c.endTimeline), 0)
  );

  // Pixel width calculation based on zoomScale
  const basePixelsPerSecond = 50 * zoomScale;
  const timelineContentWidth = Math.max(900, totalTimelineDuration * basePixelsPerSecond);

  // Compute playhead position in pixels
  const playheadX = (currentTime / totalTimelineDuration) * timelineContentWidth;

  // Active clip under playhead
  const activeClipUnderPlayhead = clips.find(
    (c) => currentTime >= c.startTimeline && currentTime <= c.endTimeline
  );
  const activeSelectedClip = clips.find((c) => c.id === selectedClipId) || activeClipUnderPlayhead;

  // Time to pixel conversion helper
  const timeToPixel = useCallback(
    (time: number): number => {
      const ratio = Math.max(0, Math.min(1, time / totalTimelineDuration));
      return ratio * timelineContentWidth;
    },
    [timelineContentWidth, totalTimelineDuration]
  );

  // Apply snapping if active (snaps to 0, keyframes, clip boundaries, playhead)
  const applySnapping = useCallback(
    (time: number): number => {
      if (!snappingEnabled) return time;
      const snapThresholdSec = 8 / basePixelsPerSecond; // within 8 pixels

      const snapPoints: number[] = [0, totalTimelineDuration];
      // Add keyframes
      events.forEach((ev) => snapPoints.push(ev.timestamp));
      // Add clip bounds
      clips.forEach((c) => {
        snapPoints.push(c.startTimeline);
        snapPoints.push(c.endTimeline);
      });

      for (const pt of snapPoints) {
        if (Math.abs(time - pt) < snapThresholdSec) {
          return pt;
        }
      }
      return time;
    },
    [snappingEnabled, basePixelsPerSecond, totalTimelineDuration, events, clips]
  );

  // Exact coordinate to time converter accounting for 144px sticky left header and horizontal scroll
  const calculateTimeFromClientX = useCallback(
    (clientX: number): number => {
      if (!tracksScrollRef.current) return 0;
      const scrollContainer = tracksScrollRef.current;
      const containerRect = scrollContainer.getBoundingClientRect();
      const trackContentLeft = containerRect.left + 144 - scrollContainer.scrollLeft;
      const pixelOffset = clientX - trackContentLeft;
      const clampedPixel = Math.max(0, Math.min(timelineContentWidth, pixelOffset));
      const rawTime = (clampedPixel / timelineContentWidth) * totalTimelineDuration;
      return applySnapping(rawTime);
    },
    [timelineContentWidth, totalTimelineDuration, applySnapping]
  );

  // Handle Scrubbing Click & Drag starting anywhere on tracks or ruler
  const handleStartScrubbing = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const seekTime = calculateTimeFromClientX(e.clientX);
    onSeek(seekTime);
    setIsScrubbing(true);
  };

  useEffect(() => {
    if (!isScrubbing && !trimmingState && !draggingClipState) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isScrubbing) {
        const seekTime = calculateTimeFromClientX(e.clientX);
        onSeek(seekTime);
      } else if (trimmingState) {
        const deltaPixels = e.clientX - trimmingState.startX;
        const deltaTime = deltaPixels / basePixelsPerSecond;

        if (trimmingState.handle === "start") {
          const candidateStart = trimmingState.initialTimelineStart + deltaTime;
          const clampedStart = Math.max(
            0,
            Math.min(trimmingState.initialTimelineEnd - 0.25, candidateStart)
          );
          const snappedStart = applySnapping(clampedStart);
          onTrimClip(trimmingState.clipId, snappedStart, trimmingState.initialTimelineEnd);
        } else {
          const candidateEnd = trimmingState.initialTimelineEnd + deltaTime;
          const clampedEnd = Math.max(
            trimmingState.initialTimelineStart + 0.25,
            Math.min(totalTimelineDuration, candidateEnd)
          );
          const snappedEnd = applySnapping(clampedEnd);
          onTrimClip(trimmingState.clipId, trimmingState.initialTimelineStart, snappedEnd);
        }
      } else if (draggingClipState && onMoveClip) {
        const deltaPixels = e.clientX - draggingClipState.startX;
        const deltaTime = deltaPixels / basePixelsPerSecond;
        const candidateStart = Math.max(0, draggingClipState.initialStartTimeline + deltaTime);
        const snappedStart = applySnapping(candidateStart);
        onMoveClip(draggingClipState.clipId, snappedStart);
      }
    };

    const handleMouseUp = () => {
      setIsScrubbing(false);
      setTrimmingState(null);
      setDraggingClipState(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isScrubbing,
    trimmingState,
    draggingClipState,
    calculateTimeFromClientX,
    basePixelsPerSecond,
    totalTimelineDuration,
    applySnapping,
    onSeek,
    onTrimClip,
    onMoveClip,
  ]);

  // Split Action
  const handleTriggerSplit = () => {
    if (!activeClipUnderPlayhead) return;
    onSplitClip(activeClipUnderPlayhead.id, currentTime);
  };

  // Delete Action
  const handleTriggerDelete = () => {
    if (selectedClipId) {
      onDeleteClip(selectedClipId);
    } else if (activeClipUnderPlayhead) {
      onDeleteClip(activeClipUnderPlayhead.id);
    }
  };

  // Ripple Delete Action
  const handleTriggerRippleDelete = () => {
    if (selectedClipId) {
      onRippleDeleteClip(selectedClipId);
    } else if (activeClipUnderPlayhead) {
      onRippleDeleteClip(activeClipUnderPlayhead.id);
    }
  };

  // Generate dynamic ruler ticks (e.g., every 1s, 5s, 10s, 30s)
  const getRulerInterval = () => {
    if (zoomScale >= 2.0) return 1; // tick every 1s
    if (zoomScale >= 1.0) return 2; // tick every 2s
    if (zoomScale >= 0.7) return 5; // tick every 5s
    return 10; // tick every 10s
  };

  const rulerInterval = getRulerInterval();
  const rulerTicks: number[] = [];
  for (let t = 0; t <= totalTimelineDuration + rulerInterval; t += rulerInterval) {
    rulerTicks.push(t);
  }

  return (
    <div className="h-72 border-t border-white/[0.1] bg-[#090D16]/95 backdrop-blur-2xl flex flex-col select-none relative z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      {/* 1. Dedicated CapCut-Style Editing Toolbar */}
      <div className="h-11 px-4 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between gap-2 text-xs">
        {/* Left: Trim & Cut Action Controls */}
        <div className="flex items-center gap-1">
          {/* Split / Cut Button */}
          <button
            type="button"
            onClick={handleTriggerSplit}
            disabled={!activeClipUnderPlayhead}
            title="Split Clip at Playhead (S)"
            className="px-2.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-sky-500/20 text-slate-200 hover:text-sky-300 border border-white/10 hover:border-sky-400/40 font-medium flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:pointer-events-none shadow-glass-sm"
          >
            <Scissors className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-xs font-semibold">Split</span>
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={handleTriggerDelete}
            disabled={!activeSelectedClip}
            title="Delete Selected Clip (Del)"
            className="px-2.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-rose-500/20 text-slate-200 hover:text-rose-300 border border-white/10 hover:border-rose-400/40 font-medium flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:pointer-events-none shadow-glass-sm"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-xs">Delete</span>
          </button>

          {/* Ripple Delete Button */}
          <button
            type="button"
            onClick={handleTriggerRippleDelete}
            disabled={!activeSelectedClip}
            title="Ripple Delete: Close gap and shift subsequent clips (Shift+Del)"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-white/10 hover:border-amber-400/40 font-medium transition-all disabled:opacity-40 disabled:pointer-events-none shadow-glass-sm"
          >
            <Combine className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs">Ripple Delete</span>
          </button>

          <div className="h-4 w-px bg-white/15 mx-1" />

          {/* Add Zoom Keyframe Marker */}
          <button
            type="button"
            onClick={onAddKeyframeAtCurrentTime}
            title="Add 3D Dolly Zoom Target at Playhead (K)"
            className="px-2.5 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-400/30 font-medium flex items-center gap-1.5 transition-all shadow-glass-sm"
          >
            <Focus className="w-3.5 h-3.5" />
            <span className="text-xs">Add Zoom Keyframe</span>
          </button>

          {/* Undo / Redo */}
          <div className="hidden md:flex items-center gap-0.5 ml-1">
            <button
              type="button"
              onClick={onUndo}
              disabled={!canUndo}
              title="Undo"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onRedo}
              disabled={!canRedo}
              title="Redo"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center: Monospace Accurate Timecode Counter & Transport */}
        <div className="flex items-center gap-2">
          {/* Step Back */}
          <button
            type="button"
            onClick={() => onStepFrames(-1)}
            title="Step Back 1 Frame (Arrow Left)"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.08]"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          {/* Play / Pause Primary Button */}
          <button
            type="button"
            onClick={onTogglePlay}
            title={isPlaying ? "Pause (Space)" : "Play (Space)"}
            className="w-8 h-8 rounded-xl bg-gradient-to-b from-sky-400 to-sky-600 hover:from-sky-300 hover:to-sky-500 text-white flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.4)] transition-transform active:scale-95"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
          </button>

          {/* Step Forward */}
          <button
            type="button"
            onClick={() => onStepFrames(1)}
            title="Step Forward 1 Frame (Arrow Right)"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.08]"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Monospace SMPTE Timecode Badge */}
          <div className="ml-2 font-mono text-xs px-3 py-1 rounded-xl bg-black/40 border border-white/10 flex items-center gap-1.5 shadow-glass-inner">
            <span className="text-sky-300 font-semibold">{formatSMPTETimecode(currentTime)}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{formatSMPTETimecode(totalTimelineDuration)}</span>
          </div>

          {/* Playback speed selector */}
          <div className="hidden xl:flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-xl border border-white/10">
            {[1, 1.5, 2].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => onSpeedChange(spd)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-all ${
                  playbackSpeed === spd
                    ? "bg-sky-500/25 text-sky-200 font-bold border border-sky-400/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Right: Snapping & Timeline View Zoom Controls */}
        <div className="flex items-center gap-2">
          {/* Snapping Toggle */}
          <button
            type="button"
            onClick={() => setSnappingEnabled(!snappingEnabled)}
            title={snappingEnabled ? "Magnetic Snapping Enabled" : "Magnetic Snapping Disabled"}
            className={`p-1.5 rounded-lg border transition-all ${
              snappingEnabled
                ? "bg-sky-500/20 text-sky-300 border-sky-400/40 shadow-glass-sm"
                : "bg-white/[0.04] text-slate-400 border-white/10 hover:text-white"
            }`}
          >
            <Magnet className="w-3.5 h-3.5" />
          </button>

          {/* Loop Toggle */}
          <button
            type="button"
            onClick={onToggleLoop}
            title={isLooping ? "Timeline Loop Enabled" : "Timeline Loop Disabled"}
            className={`p-1.5 rounded-lg border transition-all ${
              isLooping
                ? "bg-sky-500/20 text-sky-300 border-sky-400/40 shadow-glass-sm"
                : "bg-white/[0.04] text-slate-400 border-white/10 hover:text-white"
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
          </button>

          {/* Timeline Zoom Slider */}
          <div className="hidden lg:flex items-center gap-1.5 bg-black/30 px-2.5 py-1 rounded-xl border border-white/10">
            <ZoomOut className="w-3 h-3 text-slate-400" />
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={zoomScale}
              onChange={(e) => setZoomScale(parseFloat(e.target.value))}
              className="w-18 accent-sky-400 cursor-pointer h-1 bg-white/10 rounded"
              title="Timeline Scale Zoom"
            />
            <ZoomIn className="w-3 h-3 text-slate-400" />
            <span className="font-mono text-[10px] text-slate-400 w-7 text-right">
              {Math.round(zoomScale * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* 2. Scrollable Timeline Canvas & Track Stack */}
      <div
        ref={tracksScrollRef}
        className="flex-1 overflow-x-auto overflow-y-auto flex flex-col relative"
      >
        {/* Timecode Ruler Bar */}
        <div className="sticky top-0 z-20 flex h-7 border-b border-white/[0.08] bg-[#090D16]/90 backdrop-blur-md">
          {/* Header left placeholder */}
          <div className="w-36 flex-shrink-0 border-r border-white/[0.08] bg-black/40 px-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>TRACKS</span>
            <span className="text-[10px] text-sky-400/80">30 FPS</span>
          </div>

          {/* Timecode Ruler Canvas */}
          <div
            onMouseDown={handleStartScrubbing}
            className="flex-1 relative cursor-pointer h-full"
            style={{ width: `${timelineContentWidth}px`, minWidth: "100%" }}
          >
            {rulerTicks.map((tickSec) => {
              const leftPx = timeToPixel(tickSec);
              const isMajor = tickSec % (rulerInterval * 2) === 0;
              return (
                <div
                  key={tickSec}
                  className="absolute top-0 bottom-0 pointer-events-none"
                  style={{ left: `${leftPx}px` }}
                >
                  <div
                    className={`w-px bg-white/[0.15] ${isMajor ? "h-3" : "h-1.5 mt-2"}`}
                  />
                  {isMajor && (
                    <span className="absolute top-1 left-1.5 text-[9px] font-mono text-slate-400 select-none">
                      {formatSMPTETimecode(tickSec).substring(3, 8)}
                    </span>
                  )}
                </div>
              );
            })}

            {/* Laser Scrubbing Playhead Indicator on Ruler */}
            <div
              className="absolute top-0 z-40 -translate-x-1/2 pointer-events-none"
              style={{ left: `${playheadX}px` }}
            >
              <div className="w-3 h-3 bg-sky-400 rotate-45 -mt-1.5 shadow-[0_0_10px_rgba(56,189,248,0.8)] border border-white" />
            </div>
          </div>
        </div>

        {/* Tracks Container */}
        <div
          className="flex-1 flex flex-col relative"
          style={{ width: `${timelineContentWidth + 144}px`, minWidth: "100%" }}
        >
          {/* Laser Playhead Needle running vertically across ALL tracks */}
          <div
            className="absolute top-0 bottom-0 w-px bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.9)] z-30 pointer-events-none"
            style={{ left: `${144 + playheadX}px` }}
          >
            <div className="w-2 h-2 rounded-full bg-sky-300 absolute -top-1 -left-0.5" />
          </div>

          {/* ============================================================ */}
          {/* TRACK 1: Action / Zoom Keyframe Track */}
          {/* ============================================================ */}
          <div className="h-10 flex border-b border-white/[0.06] bg-black/20 hover:bg-white/[0.01] transition-colors relative group">
            {/* Track Header */}
            <div className="w-36 flex-shrink-0 border-r border-white/[0.08] bg-black/40 px-3 flex items-center justify-between text-xs text-slate-300 sticky left-0 z-10">
              <div className="flex items-center gap-1.5 font-medium text-sky-300">
                <Focus className="w-3.5 h-3.5" />
                <span className="text-[11px]">Zoom AI</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsKeyframeTrackLocked(!isKeyframeTrackLocked)}
                  className="text-slate-500 hover:text-slate-300"
                >
                  {isKeyframeTrackLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Track Lane */}
            <div
              onMouseDown={handleStartScrubbing}
              className="flex-1 relative cursor-pointer overflow-hidden"
            >
              {events.map((ev) => {
                const leftPx = timeToPixel(ev.timestamp);
                const isNearCurrent = Math.abs(currentTime - ev.timestamp) < 0.3;

                return (
                  <div
                    key={ev.id}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      onSelectEvent(ev);
                      onSeek(ev.timestamp);
                    }}
                    style={{ left: `${leftPx}px` }}
                    title={`Zoom Target: ${ev.label || "Keyframe"} (${ev.zoom}x) at ${formatSMPTETimecode(ev.timestamp)}`}
                    className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer z-10 transition-transform hover:scale-125 group/pin ${
                      isNearCurrent ? "scale-125" : ""
                    }`}
                  >
                    {/* Diamond Marker */}
                    <div
                      className={`w-4 h-4 rotate-45 rounded-sm flex items-center justify-center border transition-all ${
                        ev.enabled
                          ? isNearCurrent
                            ? "bg-sky-400 border-white shadow-[0_0_12px_rgba(56,189,248,1)]"
                            : "bg-sky-500/80 border-sky-300 shadow-[0_0_8px_rgba(56,189,248,0.5)]"
                          : "bg-slate-600/70 border-slate-500"
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#090D16]" />
                    </div>

                    {/* Tooltip on hover */}
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-black/90 border border-white/20 text-[10px] font-mono text-white whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity pointer-events-none shadow-glass-sm z-30">
                      {ev.zoom}x · {formatSMPTETimecode(ev.timestamp).substring(3, 8)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ============================================================ */}
          {/* TRACK 2: Visual Video Track (Clips & Trim Handles) */}
          {/* ============================================================ */}
          <div className="h-16 flex border-b border-white/[0.06] bg-black/30 relative">
            {/* Track Header */}
            <div className="w-36 flex-shrink-0 border-r border-white/[0.08] bg-black/40 px-3 flex items-center justify-between text-xs text-slate-300 sticky left-0 z-10">
              <div className="flex items-center gap-1.5 font-medium text-emerald-300">
                <VideoIcon className="w-3.5 h-3.5" />
                <span className="text-[11px]">Video 1</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsVideoHidden(!isVideoHidden)}
                  className="text-slate-500 hover:text-slate-300"
                >
                  {isVideoHidden ? <EyeOff className="w-3 h-3 text-rose-400" /> : <Eye className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Track Lane with Visual Clip Blocks */}
            <div
              onMouseDown={handleStartScrubbing}
              className="flex-1 relative cursor-pointer"
            >
              {clips.map((clip, idx) => {
                const clipStartPx = timeToPixel(clip.startTimeline);
                const clipEndPx = timeToPixel(clip.endTimeline);
                const clipWidthPx = Math.max(16, clipEndPx - clipStartPx);
                const isSelected = selectedClipId === clip.id;

                return (
                  <div
                    key={clip.id}
                    onMouseDown={(e) => {
                      if (e.button !== 0) return;
                      e.stopPropagation();
                      onSelectClip(clip.id);
                      setDraggingClipState({
                        clipId: clip.id,
                        initialStartTimeline: clip.startTimeline,
                        initialEndTimeline: clip.endTimeline,
                        duration: clip.duration,
                        startX: e.clientX,
                      });
                    }}
                    style={{
                      left: `${clipStartPx}px`,
                      width: `${clipWidthPx}px`,
                    }}
                    className={`absolute top-1.5 bottom-1.5 rounded-xl border transition-all overflow-hidden flex items-center justify-between group/clip select-none cursor-grab active:cursor-grabbing hover:brightness-110 ${
                      isSelected
                        ? "bg-gradient-to-r from-sky-500/30 to-blue-600/30 border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.35)]"
                        : "bg-gradient-to-r from-sky-950/50 to-blue-950/50 border-white/15 hover:border-sky-400/50"
                    }`}
                  >
                    {/* Left Trim Handle */}
                    <div
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setTrimmingState({
                          clipId: clip.id,
                          handle: "start",
                          initialTimelineStart: clip.startTimeline,
                          initialTimelineEnd: clip.endTimeline,
                          startX: e.clientX,
                        });
                      }}
                      title="Drag to trim start of clip"
                      className="w-3 h-full bg-white/[0.08] hover:bg-sky-400 hover:text-black cursor-ew-resize flex items-center justify-center transition-colors group-hover/clip:bg-white/[0.15] z-10"
                    >
                      <div className="w-0.5 h-3 bg-white/60 rounded" />
                    </div>

                    {/* Clip Content Thumbnail & Metadata */}
                    <div className="flex-1 px-2 overflow-hidden flex items-center gap-2 pointer-events-none">
                      {/* Filmstrip perforation preview */}
                      <div className="w-6 h-6 rounded-md bg-white/[0.08] border border-white/10 flex items-center justify-center text-[9px] font-mono text-sky-300 flex-shrink-0">
                        #{idx + 1}
                      </div>

                      <div className="overflow-hidden">
                        <div className="text-[11px] font-medium text-white truncate">
                          {clip.name}
                        </div>
                        <div className="text-[9px] font-mono text-slate-400 truncate">
                          {clip.duration.toFixed(1)}s · {clip.speed}x
                        </div>
                      </div>
                    </div>

                    {/* Right Trim Handle */}
                    <div
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setTrimmingState({
                          clipId: clip.id,
                          handle: "end",
                          initialTimelineStart: clip.startTimeline,
                          initialTimelineEnd: clip.endTimeline,
                          startX: e.clientX,
                        });
                      }}
                      title="Drag to trim end of clip"
                      className="w-3 h-full bg-white/[0.08] hover:bg-sky-400 hover:text-black cursor-ew-resize flex items-center justify-center transition-colors group-hover/clip:bg-white/[0.15] z-10"
                    >
                      <div className="w-0.5 h-3 bg-white/60 rounded" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ============================================================ */}
          {/* TRACK 3: Audio Track with Waveform Visuals */}
          {/* ============================================================ */}
          <div className="h-14 flex border-b border-white/[0.06] bg-black/20 relative">
            {/* Track Header */}
            <div className="w-36 flex-shrink-0 border-r border-white/[0.08] bg-black/40 px-3 flex items-center justify-between text-xs text-slate-300 sticky left-0 z-10">
              <div className="flex items-center gap-1.5 font-medium text-indigo-300">
                <Mic className="w-3.5 h-3.5" />
                <span className="text-[11px]">Audio 1</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsAudioMuted(!isAudioMuted)}
                  className="text-slate-500 hover:text-slate-300"
                >
                  {isAudioMuted ? <VolumeX className="w-3 h-3 text-rose-400" /> : <Volume2 className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Track Lane with Audio Waveform Bars */}
            <div
              onMouseDown={handleStartScrubbing}
              className="flex-1 relative cursor-pointer"
            >
              {clips.map((clip) => {
                const clipStartPx = timeToPixel(clip.startTimeline);
                const clipEndPx = timeToPixel(clip.endTimeline);
                const clipWidthPx = Math.max(16, clipEndPx - clipStartPx);
                const isSelected = selectedClipId === clip.id;

                // Generate procedural waveform peaks
                const numBars = Math.max(10, Math.floor(clipWidthPx / 4));
                const waveformHeights = Array.from({ length: numBars }, (_, i) => {
                  const seed = (clip.id.charCodeAt(0) * 17 + i * 23) % 100;
                  return 20 + Math.sin(i * 0.4) * 15 + (seed % 35);
                });

                return (
                  <div
                    key={`audio-${clip.id}`}
                    onMouseDown={(e) => {
                      if (e.button !== 0) return;
                      e.stopPropagation();
                      onSelectClip(clip.id);
                      setDraggingClipState({
                        clipId: clip.id,
                        initialStartTimeline: clip.startTimeline,
                        initialEndTimeline: clip.endTimeline,
                        duration: clip.duration,
                        startX: e.clientX,
                      });
                    }}
                    style={{
                      left: `${clipStartPx}px`,
                      width: `${clipWidthPx}px`,
                    }}
                    className={`absolute top-1.5 bottom-1.5 rounded-xl border overflow-hidden flex items-center justify-between group/clip select-none cursor-grab active:cursor-grabbing transition-all ${
                      isSelected
                        ? "bg-indigo-600/30 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.35)]"
                        : isAudioMuted
                        ? "bg-slate-900/40 border-white/10 opacity-40 hover:opacity-60"
                        : "bg-indigo-950/40 border-indigo-500/25 hover:border-indigo-400/50 hover:bg-indigo-900/30"
                    }`}
                  >
                    {/* Left Trim Handle */}
                    <div
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setTrimmingState({
                          clipId: clip.id,
                          handle: "start",
                          initialTimelineStart: clip.startTimeline,
                          initialTimelineEnd: clip.endTimeline,
                          startX: e.clientX,
                        });
                      }}
                      title="Drag to trim start of audio"
                      className="w-2.5 h-full bg-white/[0.08] hover:bg-indigo-400 hover:text-black cursor-ew-resize flex items-center justify-center transition-colors group-hover/clip:bg-white/[0.15] z-10 flex-shrink-0"
                    >
                      <div className="w-0.5 h-2.5 bg-white/60 rounded" />
                    </div>

                    {/* Procedural Waveform Display */}
                    <div className="flex-1 h-full flex items-center px-1.5 gap-[2px] overflow-hidden pointer-events-none">
                      <span className="text-[9px] font-mono text-indigo-300 font-semibold truncate mr-1">
                        {clip.name}
                      </span>
                      {waveformHeights.map((h, i) => (
                        <div
                          key={i}
                          style={{ height: `${h}%` }}
                          className={`w-[2px] rounded-full flex-shrink-0 ${
                            isSelected ? "bg-indigo-300" : "bg-indigo-400/70"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Right Trim Handle */}
                    <div
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setTrimmingState({
                          clipId: clip.id,
                          handle: "end",
                          initialTimelineStart: clip.startTimeline,
                          initialTimelineEnd: clip.endTimeline,
                          startX: e.clientX,
                        });
                      }}
                      title="Drag to trim end of audio"
                      className="w-2.5 h-full bg-white/[0.08] hover:bg-indigo-400 hover:text-black cursor-ew-resize flex items-center justify-center transition-colors group-hover/clip:bg-white/[0.15] z-10 flex-shrink-0"
                    >
                      <div className="w-0.5 h-2.5 bg-white/60 rounded" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
