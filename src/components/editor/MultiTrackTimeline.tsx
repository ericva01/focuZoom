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
  Plus,
  X,
  Camera,
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
  selectedEventId?: string | null;
  onSelectEvent: (event: ClickEvent) => void;
  onUpdateEvent?: (id: string, updates: Partial<ClickEvent>) => void;
  onDeleteEvent?: (id: string) => void;
  onAddKeyframeAtCurrentTime: () => void;
  onMergeNearbyClicks?: () => void;
  clips: TimelineClip[];
  selectedClipId: string | null;
  selectedClipIds?: string[];
  selectedEventIds?: string[];
  onSelectClip: (id: string | null) => void;
  onSelectMultiple?: (clipIds: string[], eventIds: string[]) => void;
  onDeleteMultiple?: (clipIds: string[], eventIds: string[]) => void;
  onSplitClip: (clipId: string, splitTime: number) => void;
  onTrimClip: (clipId: string, newStart: number, newEnd: number) => void;
  onMoveClip?: (clipId: string, newStart: number) => void;
  onDeleteClip: (clipId: string) => void;
  onRippleDeleteClip: (clipId: string) => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  webcamClip?: TimelineClip | null;
  isWebcamHidden?: boolean;
  onToggleWebcamHidden?: () => void;
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
  selectedEventId,
  selectedClipIds = [],
  selectedEventIds = [],
  onSelectEvent,
  onSelectMultiple,
  onDeleteMultiple,
  onUpdateEvent,
  onDeleteEvent,
  onAddKeyframeAtCurrentTime,
  onMergeNearbyClicks,
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
  webcamClip,
  isWebcamHidden = false,
  onToggleWebcamHidden,
}: MultiTrackTimelineProps) {
  const tracksScrollRef = useRef<HTMLDivElement | null>(null);

  // Timeline UI States
  const [zoomScale, setZoomScale] = useState<number>(1.0); // 0.5x (overview) to 3.0x (sub-second precision)
  const [snappingEnabled, setSnappingEnabled] = useState<boolean>(true);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isVideoHidden, setIsVideoHidden] = useState<boolean>(false);
  const [isKeyframeTrackLocked, setIsKeyframeTrackLocked] = useState<boolean>(false);

  // Right-Click Marquee Box Selection State
  const [marqueeSelection, setMarqueeSelection] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    relStartX: number;
    relStartY: number;
    relCurrentX: number;
    relCurrentY: number;
  } | null>(null);

  // Interactive Dragging States
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);
  const [localScrubTime, setLocalScrubTime] = useState<number | null>(null);
  const scrubRafRef = useRef<number | null>(null);

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
  const [draggingKeyframeState, setDraggingKeyframeState] = useState<{
    eventId: string;
    mode: "move" | "trim-start" | "trim-end";
    startX: number;
    initialTimestamp: number;
    initialHoldDuration: number;
    currentDeltaSec: number;
    currentDurationDeltaSec: number;
  } | null>(null);

  const clipsMaxEnd = clips.reduce((max, c) => Math.max(max, c.endTimeline), 0);
  const totalTimelineDuration = Math.max(
    1,
    clipsMaxEnd > 0 ? clipsMaxEnd : (duration || 12)
  );

  // Pixel width calculation based on zoomScale
  const basePixelsPerSecond = 50 * zoomScale;
  const timelineContentWidth = Math.max(900, totalTimelineDuration * basePixelsPerSecond);

  // Compute playhead position in pixels (using localScrubTime when dragging for zero-latency 60fps tracking)
  const activeDisplayTime = isScrubbing && localScrubTime !== null ? localScrubTime : currentTime;
  const playheadX = (activeDisplayTime / totalTimelineDuration) * timelineContentWidth;

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
    setLocalScrubTime(seekTime);
    onSeek(seekTime);
    setIsScrubbing(true);
  };

  // Handle Right-Click Marquee Drag initiation on the Tracks Container
  const handleTracksMouseDown = (e: React.MouseEvent) => {
    if (e.button === 2) {
      e.preventDefault();
      e.stopPropagation();
      const rect = e.currentTarget.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      setMarqueeSelection({
        startX: e.clientX,
        startY: e.clientY,
        currentX: e.clientX,
        currentY: e.clientY,
        relStartX: relX,
        relStartY: relY,
        relCurrentX: relX,
        relCurrentY: relY,
      });
    }
  };

  useEffect(() => {
    if (
      !isScrubbing &&
      !trimmingState &&
      !draggingClipState &&
      !draggingKeyframeState &&
      !marqueeSelection
    ) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (marqueeSelection) {
        if (!tracksScrollRef.current) return;
        const tracksEl = tracksScrollRef.current.querySelector<HTMLElement>(".tracks-canvas-layer");
        const rect = tracksEl?.getBoundingClientRect() || tracksScrollRef.current.getBoundingClientRect();
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;
        setMarqueeSelection((prev) =>
          prev
            ? {
                ...prev,
                currentX: e.clientX,
                currentY: e.clientY,
                relCurrentX: relX,
                relCurrentY: relY,
              }
            : null
        );
        return;
      }

      if (isScrubbing) {
        const clientX = e.clientX;
        if (scrubRafRef.current === null) {
          scrubRafRef.current = requestAnimationFrame(() => {
            scrubRafRef.current = null;
            const seekTime = calculateTimeFromClientX(clientX);
            setLocalScrubTime(seekTime);
            onSeek(seekTime);
          });
        }
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
            candidateEnd
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
      } else if (draggingKeyframeState) {
        const deltaPixels = e.clientX - draggingKeyframeState.startX;
        const deltaTime = deltaPixels / basePixelsPerSecond;

        if (draggingKeyframeState.mode === "move" || draggingKeyframeState.mode === "trim-start") {
          setDraggingKeyframeState((prev) =>
            prev ? { ...prev, currentDeltaSec: deltaTime } : null
          );
        } else if (draggingKeyframeState.mode === "trim-end") {
          setDraggingKeyframeState((prev) =>
            prev ? { ...prev, currentDurationDeltaSec: deltaTime } : null
          );
        }
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (scrubRafRef.current !== null) {
        cancelAnimationFrame(scrubRafRef.current);
        scrubRafRef.current = null;
      }

      if (marqueeSelection) {
        const dragDist = Math.hypot(
          e.clientX - marqueeSelection.startX,
          e.clientY - marqueeSelection.startY
        );

        if (dragDist > 6 && onSelectMultiple) {
          // Convert client X range to timeline time range
          const timeA = calculateTimeFromClientX(marqueeSelection.startX);
          const timeB = calculateTimeFromClientX(e.clientX);
          const selStart = Math.min(timeA, timeB);
          const selEnd = Math.max(timeA, timeB);

          // Find clips overlapping this time span
          const matchedClips = clips
            .filter((c) => Math.max(c.startTimeline, selStart) <= Math.min(c.endTimeline, selEnd))
            .map((c) => c.id);

          // Find events overlapping this time span
          const matchedEvents = events
            .filter((ev) => {
              const evDur = (ev.zoomInDuration ?? 0.4) + (ev.holdDuration ?? 1.4) + (ev.zoomOutDuration ?? 0.4);
              const evEnd = ev.timestamp + evDur;
              return Math.max(ev.timestamp, selStart) <= Math.min(evEnd, selEnd);
            })
            .map((ev) => ev.id);

          onSelectMultiple(matchedClips, matchedEvents);
        }
        setMarqueeSelection(null);
      }

      if (draggingKeyframeState && onUpdateEvent) {
        const {
          eventId,
          mode,
          initialTimestamp,
          initialHoldDuration,
          currentDeltaSec,
          currentDurationDeltaSec,
        } = draggingKeyframeState;

        if (mode === "move") {
          const candidateTime = Math.max(0, initialTimestamp + currentDeltaSec);
          const snappedTime = applySnapping(candidateTime);
          const roundedTime = Math.round(snappedTime * 100) / 100;
          onUpdateEvent(eventId, { timestamp: roundedTime });
          onSeek(roundedTime);
        } else if (mode === "trim-start") {
          const candidateTime = Math.max(0, initialTimestamp + currentDeltaSec);
          const snappedTime = applySnapping(candidateTime);
          const roundedTime = Math.round(snappedTime * 100) / 100;
          const diff = roundedTime - initialTimestamp;
          const newHold = Math.max(0.2, Math.round((initialHoldDuration - diff) * 100) / 100);
          onUpdateEvent(eventId, { timestamp: roundedTime, holdDuration: newHold });
          onSeek(roundedTime);
        } else if (mode === "trim-end") {
          const newHold = Math.max(0.2, Math.round((initialHoldDuration + currentDurationDeltaSec) * 100) / 100);
          onUpdateEvent(eventId, { holdDuration: newHold });
        }
      }

      setIsScrubbing(false);
      setLocalScrubTime(null);
      setTrimmingState(null);
      setDraggingClipState(null);
      setDraggingKeyframeState(null);
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
    draggingKeyframeState,
    marqueeSelection,
    calculateTimeFromClientX,
    basePixelsPerSecond,
    totalTimelineDuration,
    applySnapping,
    onSeek,
    onTrimClip,
    onMoveClip,
    onUpdateEvent,
    onSelectMultiple,
    clips,
    events,
  ]);

  // Split Action
  const handleTriggerSplit = () => {
    if (!activeClipUnderPlayhead) return;
    onSplitClip(activeClipUnderPlayhead.id, currentTime);
  };

  // Delete Action
  const handleTriggerDelete = () => {
    if ((selectedClipIds.length > 0 || selectedEventIds.length > 0) && onDeleteMultiple) {
      onDeleteMultiple(selectedClipIds, selectedEventIds);
    } else if (selectedClipId) {
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
            className="px-2.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-rose-500/20 text-slate-200 hover:text-rose-300 border border-white/10 hover:border-rose-400/40 font-medium flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:pointer-events-none shadow-glass-sm"
          >
            <Scissors className="w-3.5 h-3.5 text-rose-400" />
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
            className="px-2.5 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-400/30 font-medium flex items-center gap-1.5 transition-all shadow-glass-sm"
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
            className="w-8 h-8 rounded-xl bg-gradient-to-b from-rose-400 to-rose-600 hover:from-rose-300 hover:to-rose-500 text-white flex items-center justify-center shadow-[0_0_15px_rgba(251,113,133,0.4)] transition-transform active:scale-95"
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
            <span className="text-rose-300 font-semibold">{formatSMPTETimecode(currentTime)}</span>
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
                    ? "bg-rose-500/25 text-rose-200 font-bold border border-rose-400/40"
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
                ? "bg-rose-500/20 text-rose-300 border-rose-400/40 shadow-glass-sm"
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
                ? "bg-rose-500/20 text-rose-300 border-rose-400/40 shadow-glass-sm"
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
            <span className="text-[10px] text-rose-400/80">30 FPS</span>
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
              <div className="w-3 h-3 bg-rose-400 rotate-45 -mt-1.5 shadow-[0_0_10px_rgba(251,113,133,0.8)] border border-white" />
            </div>
          </div>
        </div>

        {/* Tracks Container */}
        <div
          onMouseDown={handleTracksMouseDown}
          onContextMenu={(e) => e.preventDefault()}
          className="tracks-canvas-layer flex-1 flex flex-col relative"
          style={{ width: `${timelineContentWidth + 144}px`, minWidth: "100%" }}
        >
          {/* Marquee Selection Area Box (Active when holding right click and dragging across tracks) */}
          {marqueeSelection && (
            <div
              className="absolute z-50 pointer-events-none rounded-lg border-2 border-rose-400/90 bg-rose-500/20 backdrop-blur-[2px] shadow-[0_0_20px_rgba(251,113,133,0.35)]"
              style={{
                left: `${Math.min(marqueeSelection.relStartX, marqueeSelection.relCurrentX)}px`,
                top: `${Math.min(marqueeSelection.relStartY, marqueeSelection.relCurrentY)}px`,
                width: `${Math.abs(marqueeSelection.relCurrentX - marqueeSelection.relStartX)}px`,
                height: `${Math.abs(marqueeSelection.relCurrentY - marqueeSelection.relStartY)}px`,
              }}
            >
              <div className="absolute -top-7 left-2 px-2 py-0.5 rounded-md bg-[#090D16]/95 border border-rose-400/60 text-[10px] font-mono text-rose-200 shadow-md">
                Box Select (Release to select)
              </div>
            </div>
          )}

          {/* Laser Playhead Needle running vertically across ALL tracks */}
          <div
            className="absolute top-0 bottom-0 w-px bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.9)] z-30 pointer-events-none"
            style={{ left: `${144 + playheadX}px` }}
          >
            <div className="w-2 h-2 rounded-full bg-rose-300 absolute -top-1 -left-0.5" />
          </div>

          {/* ============================================================ */}
          {/* TRACK 1: Visual Video Track (Clips & Trim Handles) */}
          {/* ============================================================ */}
          <div className="h-14 flex border-b border-white/[0.06] bg-black/30 relative">
            {/* Track Header */}
            <div className="w-36 flex-shrink-0 border-r border-white/[0.08] bg-black/40 px-3 flex items-center justify-between text-xs text-slate-300 sticky left-0 z-10">
              <div className="flex items-center gap-1.5 font-medium text-purple-300">
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
                const isSelected = selectedClipId === clip.id || selectedClipIds.includes(clip.id);

                return (
                  <div
                    key={clip.id}
                    onMouseDown={(e) => {
                      if (e.button !== 0 && e.button !== 2) return;
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
                    onContextMenu={(e) => e.preventDefault()}
                    style={{
                      left: `${clipStartPx}px`,
                      width: `${clipWidthPx}px`,
                    }}
                    className={`absolute top-1.5 bottom-1.5 rounded-xl border transition-all overflow-hidden flex items-center justify-between group/clip select-none cursor-grab active:cursor-grabbing hover:brightness-110 ${
                      isSelected
                        ? "bg-gradient-to-r from-purple-600/70 to-indigo-600/70 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.35)] ring-2 ring-purple-400/80"
                        : "bg-gradient-to-r from-purple-950/70 to-indigo-950/70 border-white/15 hover:border-purple-400/50"
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
                      className="w-3 h-full bg-white/[0.08] hover:bg-purple-400 hover:text-black cursor-ew-resize flex items-center justify-center transition-colors group-hover/clip:bg-white/[0.15] z-10"
                    >
                      <div className="w-0.5 h-3 bg-white/60 rounded" />
                    </div>

                    {/* Clip Content Thumbnail & Metadata */}
                    <div className="flex-1 px-2 overflow-hidden flex items-center gap-2 pointer-events-none">
                      <div className="w-5 h-5 rounded-md bg-white/[0.08] border border-white/10 flex items-center justify-center text-[9px] font-mono text-purple-300 flex-shrink-0">
                        #{idx + 1}
                      </div>

                      <div className="overflow-hidden flex items-center gap-2">
                        <div className="text-[11px] font-medium text-white truncate">
                          {clip.name}
                        </div>
                        <div className="text-[9px] font-mono text-purple-200/80 truncate">
                          {clip.duration.toFixed(1)}s · {clip.speed}X
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
                      className="w-3 h-full bg-white/[0.08] hover:bg-purple-400 hover:text-black cursor-ew-resize flex items-center justify-center transition-colors group-hover/clip:bg-white/[0.15] z-10"
                    >
                      <div className="w-0.5 h-3 bg-white/60 rounded" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ============================================================ */}
          {/* TRACK 2: Action / Zoom AI Capsule Bar Track (FocuSee Style) */}
          {/* ============================================================ */}
          <div className="h-12 flex border-b border-white/[0.06] bg-black/20 hover:bg-white/[0.01] transition-colors relative group">
            {/* Track Header */}
            <div className="w-36 flex-shrink-0 border-r border-white/[0.08] bg-black/40 px-3 flex items-center justify-between text-xs text-slate-300 sticky left-0 z-10">
              <div className="flex items-center gap-1.5 font-medium text-blue-400">
                <Focus className="w-3.5 h-3.5" />
                <span className="text-[11px]">Zoom AI</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddKeyframeAtCurrentTime();
                  }}
                  className="px-1.5 py-0.5 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-[10px] font-medium border border-blue-400/30 flex items-center gap-1 transition-colors"
                  title="Add Zoom Effect at playhead"
                >
                  <Plus className="w-2.5 h-2.5" />
                  <span>Add</span>
                </button>
                {onMergeNearbyClicks && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMergeNearbyClicks();
                    }}
                    className="px-1.5 py-0.5 rounded bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-[10px] font-medium border border-indigo-400/30 flex items-center gap-1 transition-colors"
                    title="Group clicks within 1-2s into single continuous zoom sequences"
                  >
                    <span>Group Clicks</span>
                  </button>
                )}
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
                const inDur = ev.zoomInDuration ?? 0.4;
                const holdDur = ev.holdDuration ?? 1.4;
                const outDur = ev.zoomOutDuration ?? 0.4;

                // Live dynamic calculations during drag
                const isDragging = draggingKeyframeState?.eventId === ev.id;
                let effectiveTimestamp = ev.timestamp;
                let effectiveHoldDuration = holdDur;

                if (isDragging && draggingKeyframeState) {
                  if (draggingKeyframeState.mode === "move") {
                    effectiveTimestamp = Math.max(0, draggingKeyframeState.initialTimestamp + draggingKeyframeState.currentDeltaSec);
                  } else if (draggingKeyframeState.mode === "trim-start") {
                    effectiveTimestamp = Math.max(0, draggingKeyframeState.initialTimestamp + draggingKeyframeState.currentDeltaSec);
                    const diff = effectiveTimestamp - draggingKeyframeState.initialTimestamp;
                    effectiveHoldDuration = Math.max(0.2, draggingKeyframeState.initialHoldDuration - diff);
                  } else if (draggingKeyframeState.mode === "trim-end") {
                    effectiveHoldDuration = Math.max(0.2, draggingKeyframeState.initialHoldDuration + draggingKeyframeState.currentDurationDeltaSec);
                  }
                }

                const liveDuration = inDur + effectiveHoldDuration + outDur;
                const leftPx = timeToPixel(effectiveTimestamp);
                const widthPx = Math.max(80, timeToPixel(effectiveTimestamp + liveDuration) - leftPx);
                const isSelected = selectedEventId === ev.id || selectedEventIds.includes(ev.id);
                const isNearCurrent = currentTime >= effectiveTimestamp && currentTime <= (effectiveTimestamp + liveDuration);

                return (
                  <div
                    key={ev.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEvent(ev);
                      onSeek(effectiveTimestamp);
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                    style={{
                      left: `${leftPx}px`,
                      width: `${widthPx}px`,
                    }}
                    title={`Zoom Effect: ${ev.zoom || 2}X (${liveDuration.toFixed(1)}s). Left or Right-click & drag center to move, drag edges to trim.`}
                    className={`absolute top-1.5 bottom-1.5 rounded-xl border flex items-center justify-between z-10 select-none group/zoom transition-all cursor-grab active:cursor-grabbing ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 border-white text-white shadow-[0_0_18px_rgba(59,130,246,0.9)] ring-2 ring-blue-400 z-20 scale-[1.02]"
                        : isNearCurrent
                        ? "bg-gradient-to-r from-blue-600/90 via-blue-500/90 to-indigo-600/90 border-blue-400/70 text-white shadow-[0_0_12px_rgba(59,130,246,0.6)]"
                        : "bg-blue-600/75 hover:bg-blue-600 border-blue-400/40 text-white shadow-md hover:shadow-lg"
                    }`}
                  >
                    {/* Left Trim Handle */}
                    <div
                      onMouseDown={(e) => {
                        if (isKeyframeTrackLocked) return;
                        e.stopPropagation();
                        onSelectEvent(ev);
                        setDraggingKeyframeState({
                          eventId: ev.id,
                          mode: "trim-start",
                          startX: e.clientX,
                          initialTimestamp: ev.timestamp,
                          initialHoldDuration: holdDur,
                          currentDeltaSec: 0,
                          currentDurationDeltaSec: 0,
                        });
                      }}
                      title="Drag to adjust zoom start time"
                      className="w-2.5 h-full cursor-ew-resize hover:bg-white/40 flex items-center justify-center rounded-l-xl transition-colors z-20"
                    >
                      <div className="w-0.5 h-3 bg-white/70 rounded-full" />
                    </div>

                    {/* Center Drag Area & Zoom Pill Badge */}
                    <div
                      onMouseDown={(e) => {
                        if (isKeyframeTrackLocked) return;
                        if (e.button !== 0 && e.button !== 2) return;
                        e.stopPropagation();
                        onSelectEvent(ev);
                        setDraggingKeyframeState({
                          eventId: ev.id,
                          mode: "move",
                          startX: e.clientX,
                          initialTimestamp: ev.timestamp,
                          initialHoldDuration: holdDur,
                          currentDeltaSec: 0,
                          currentDurationDeltaSec: 0,
                        });
                      }}
                      className="flex-1 h-full flex items-center justify-center gap-1.5 px-2 truncate"
                    >
                      <Focus className="w-3.5 h-3.5 text-blue-100 flex-shrink-0" />
                      <span className="text-xs font-bold text-white tracking-wide truncate">
                        Zoom {ev.zoom || 2}X
                      </span>
                      {ev.targets && ev.targets.length > 1 && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold bg-white/25 text-white rounded-full flex-shrink-0 border border-white/25">
                          {ev.targets.length} Clicks
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-blue-200/90 hidden sm:inline">
                        {liveDuration.toFixed(1)}s
                      </span>
                    </div>

                    {/* Tick markers for multiple clicks inside the sequence */}
                    {ev.targets && ev.targets.length > 1 && (
                      <div className="absolute inset-x-3 bottom-0.5 pointer-events-none flex items-center h-1.5 overflow-hidden z-10">
                        {ev.targets.map((tgt, tIdx) => {
                          const relRatio = Math.max(0, Math.min(1, (tgt.timestamp - effectiveTimestamp) / liveDuration));
                          return (
                            <div
                              key={tIdx}
                              style={{ left: `${relRatio * 100}%` }}
                              className="absolute w-1 h-1.5 bg-white/80 rounded-full -translate-x-1/2 shadow-sm"
                              title={`Click ${tIdx + 1} at ${tgt.timestamp.toFixed(1)}s`}
                            />
                          );
                        })}
                      </div>
                    )}

                    {/* Quick Delete Button */}
                    {onDeleteEvent && (
                      <button
                        type="button"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteEvent(ev.id);
                        }}
                        className={`p-1 text-white/70 hover:text-white hover:bg-rose-500/30 rounded-md mr-1 transition-all z-20 cursor-pointer ${
                          isSelected ? "opacity-100 bg-black/20" : "opacity-0 group-hover/zoom:opacity-100"
                        }`}
                        title="Delete Zoom Effect (or press Delete key)"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}

                    {/* Right Trim Handle */}
                    <div
                      onMouseDown={(e) => {
                        if (isKeyframeTrackLocked) return;
                        e.stopPropagation();
                        onSelectEvent(ev);
                        setDraggingKeyframeState({
                          eventId: ev.id,
                          mode: "trim-end",
                          startX: e.clientX,
                          initialTimestamp: ev.timestamp,
                          initialHoldDuration: holdDur,
                          currentDeltaSec: 0,
                          currentDurationDeltaSec: 0,
                        });
                      }}
                      title="Drag to adjust zoom duration"
                      className="w-2.5 h-full cursor-ew-resize hover:bg-white/40 flex items-center justify-center rounded-r-xl transition-colors z-20"
                    >
                      <div className="w-0.5 h-3 bg-white/70 rounded-full" />
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
                const isSelected = selectedClipId === clip.id || selectedClipIds.includes(clip.id);

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
                      if (e.button !== 0 && e.button !== 2) return;
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
                    onContextMenu={(e) => e.preventDefault()}
                    style={{
                      left: `${clipStartPx}px`,
                      width: `${clipWidthPx}px`,
                    }}
                    className={`absolute top-1.5 bottom-1.5 rounded-xl border overflow-hidden flex items-center justify-between group/clip select-none cursor-grab active:cursor-grabbing transition-all ${
                      isSelected
                        ? "bg-indigo-600/30 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.35)] ring-2 ring-indigo-400/80"
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

          {/* ============================================================ */}
          {/* TRACK 4: Facecam / Webcam Track */}
          {/* ============================================================ */}
          {webcamClip && (
            <div className="h-14 flex border-b border-white/[0.06] bg-black/25 relative">
              {/* Track Header */}
              <div className="w-36 flex-shrink-0 border-r border-white/[0.08] bg-black/40 px-3 flex items-center justify-between text-xs text-slate-300 sticky left-0 z-10">
                <div className="flex items-center gap-1.5 font-medium text-emerald-400">
                  <Camera className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Facecam</span>
                </div>
                <div className="flex items-center gap-1">
                  {onToggleWebcamHidden && (
                    <button
                      type="button"
                      onClick={onToggleWebcamHidden}
                      className="text-slate-500 hover:text-slate-300"
                      title={isWebcamHidden ? "Show Facecam PiP" : "Hide Facecam PiP"}
                    >
                      {isWebcamHidden ? (
                        <EyeOff className="w-3 h-3 text-rose-400" />
                      ) : (
                        <Eye className="w-3 h-3 text-emerald-400" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Track Lane */}
              <div
                onMouseDown={handleStartScrubbing}
                className="flex-1 relative cursor-pointer"
              >
                {(() => {
                  const clipStartPx = timeToPixel(webcamClip.startTimeline);
                  const clipEndPx = timeToPixel(webcamClip.endTimeline);
                  const clipWidthPx = Math.max(16, clipEndPx - clipStartPx);
                  return (
                    <div
                      style={{
                        left: `${clipStartPx}px`,
                        width: `${clipWidthPx}px`,
                      }}
                      className={`absolute top-1.5 bottom-1.5 rounded-xl border overflow-hidden flex items-center justify-between group/clip select-none transition-all ${
                        isWebcamHidden
                          ? "bg-emerald-950/20 border-emerald-500/20 opacity-40"
                          : "bg-gradient-to-r from-emerald-900/60 to-teal-900/60 border-emerald-400/50 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                      }`}
                    >
                      <div className="flex-1 px-2.5 overflow-hidden flex items-center gap-2 pointer-events-none">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-[9px] font-mono text-emerald-300 flex-shrink-0">
                          <Camera className="w-2.5 h-2.5" />
                        </div>
                        <div className="overflow-hidden flex items-center gap-2">
                          <div className="text-[11px] font-medium text-emerald-200 truncate">
                            {webcamClip.name || "Webcam Overlay"}
                          </div>
                          <div className="text-[9px] font-mono text-emerald-300/70 truncate">
                            {webcamClip.duration.toFixed(1)}s (PiP)
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
