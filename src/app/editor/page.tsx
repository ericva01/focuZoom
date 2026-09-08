"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { EditorHeader } from "@/components/editor/EditorHeader";
import { PreviewMonitor } from "@/components/editor/PreviewMonitor";
import { EditorInspector } from "@/components/editor/EditorInspector";
import { MultiTrackTimeline } from "@/components/editor/MultiTrackTimeline";
import { ExportModal } from "@/components/editor/ExportModal";
import { useVideoPlayback } from "@/hooks/useVideoPlayback";
import { useScreenRecorder } from "@/hooks/useScreenRecorder";
import { generateSampleScreenRecording } from "@/utils/sampleVideoGenerator";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import {
  AspectRatio,
  CanvasConfig,
  ClickEvent,
  VideoMetadata,
  TimelineClip,
} from "@/types/editor";
import { getProjectById, saveProject, SavedProject } from "@/utils/projectStorage";

export default function EditorPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Inspector panel resize and collapse state (top-right)
  const [inspectorWidth, setInspectorWidth] = useState<number>(380);
  const [isInspectorCollapsed, setIsInspectorCollapsed] = useState<boolean>(false);
  const [isDraggingDivider, setIsDraggingDivider] = useState<boolean>(false);
  const dragDividerRef = useRef<boolean>(false);

  const [projectName, setProjectName] = useState("Cinematic Recording");
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [isGeneratingDemo, setIsGeneratingDemo] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isAddMode, setIsAddMode] = useState<boolean>(false);

  // Multi-track video clips state
  const [clips, setClips] = useState<TimelineClip[]>([]);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);

  // Undo / Redo history for clip edits
  const [history, setHistory] = useState<TimelineClip[][]>([]);
  const [future, setFuture] = useState<TimelineClip[][]>([]);

  // Editor styling and motion configurations
  const [config, setConfig] = useState<CanvasConfig>({
    // 3D Cinematic Compositing
    renderMode: "3d-cinematic",
    screenAnglePreset: "studio-front",
    enableFloatingMotion: false,
    enableMouseParallax: false,
    mouseParallaxIntensity: 0.5,
    glassReflectionIntensity: 0.85,
    depthOfField: false,
    framingStyle: "focus-click",
    cursorHaloStyle: "expanding-ring",

    // Backdrop & Geometry
    backgroundType: "gradient",
    backgroundPreset: "mesh-purple",
    solidBackgroundColor: "#06402B",
    customGradientFrom: "#1e1b4b",
    customGradientTo: "#06b6d4",
    cornerRadius: 20,
    padding: 36,
    shadowIntensity: "cinematic",
    showWindowBar: false,

    // Camera & Zoom
    defaultZoomScale: 2.2,
    zoomEasing: "spring",
    zoomDuration: 0.6,
    zoomHoldDuration: 1.4,
    zoomOutDuration: 0.6,

    // Cursor & FX
    showCursor: true,
    cursorStyle: "macos-arrow",
    cursorColor: "#06b6d4",
    cursorSize: 22,
    showRipple: false,
    rippleColor: "#06b6d4",

    aspectRatio: "16:9",
    playbackSpeed: 1.0,
  });

  // Registered zoom events
  const [events, setEvents] = useState<ClickEvent[]>([]);

  // Video playback controller hook
  const playback = useVideoPlayback(videoRef);

  // Helper to record history before mutating clips
  const pushHistory = useCallback((prevClips: TimelineClip[]) => {
    setHistory((h) => [...h.slice(-20), prevClips]);
    setFuture([]);
  }, []);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setFuture((f) => [clips, ...f]);
    setClips(previous);
  }, [history, clips]);

  const handleRedo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture((f) => f.slice(1));
    setHistory((h) => [...h, clips]);
    setClips(next);
  }, [future, clips]);

  // Screen recording hook with automatic canvas import and click keyframe mapping
  const screenRecorder = useScreenRecorder({
    onImportRecording: ({ blobUrl, metadata: recMeta, events: recEvents }) => {
      setVideoSrc(blobUrl);
      setMetadata(recMeta);
      setProjectName(recMeta.name.replace(/\.[^/.]+$/, ""));

      const recDuration = recMeta.duration || 12;
      const initialClip: TimelineClip = {
        id: "clip-rec-" + Date.now(),
        name: recMeta.name || "Screen Recording",
        sourceStart: 0,
        sourceEnd: recDuration,
        duration: recDuration,
        startTimeline: 0,
        endTimeline: recDuration,
        color: "#0284c7",
        speed: 1.0,
      };
      pushHistory(clips);
      setClips([initialClip]);
      setSelectedClipId(initialClip.id);

      if (recEvents && recEvents.length > 0) {
        setEvents(recEvents);
      } else {
        setEvents([
          {
            id: "rec-click-" + Date.now(),
            timestamp: Math.min(2.0, recDuration * 0.3),
            x: 0.5,
            y: 0.5,
            zoom: config.defaultZoomScale,
            label: "Center Focus",
            enabled: true,
          },
        ]);
      }

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(() => {});
        }
      }, 350);
    },
    defaultZoomScale: config.defaultZoomScale,
  });

  // Partial update helper for config
  const handleUpdateConfig = (updates: Partial<CanvasConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  // Load procedural demo recording
  const handleLoadDemo = useCallback(async () => {
    setIsGeneratingDemo(true);
    try {
      const sample = await generateSampleScreenRecording();
      setVideoSrc(sample.blobUrl);
      setEvents(sample.defaultEvents);
      setMetadata({
        name: "focuflow-demo-recording.webm",
        duration: sample.duration,
        width: 1280,
        height: 720,
        url: sample.blobUrl,
      });

      const initialClip: TimelineClip = {
        id: "clip-demo-1",
        name: "Demo Screen Recording",
        sourceStart: 0,
        sourceEnd: sample.duration,
        duration: sample.duration,
        startTimeline: 0,
        endTimeline: sample.duration,
        color: "#0284c7",
        speed: 1.0,
      };
      setClips([initialClip]);
      setSelectedClipId(initialClip.id);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(() => {});
        }
      }, 500);
    } catch (err) {
      console.error("Failed to generate demo recording:", err);
    } finally {
      setIsGeneratingDemo(false);
    }
  }, []);

  // Electron Integration State
  const [isElectron, setIsElectron] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.electronAPI?.isElectron) {
      setIsElectron(true);
    }
  }, []);

  // Handle user uploaded file
  const handleFileUpload = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setVideoSrc(url);

    const initialEvents: ClickEvent[] = [
      {
        id: "click-" + Date.now(),
        timestamp: 2.0,
        x: 0.5,
        y: 0.5,
        zoom: config.defaultZoomScale,
        label: "Center Focus",
        enabled: true,
      },
    ];
    setEvents(initialEvents);

    const tempVideo = document.createElement("video");
    tempVideo.src = url;
    tempVideo.onloadedmetadata = () => {
      const vidDur = tempVideo.duration || 10;
      setMetadata({
        name: file.name,
        duration: vidDur,
        width: tempVideo.videoWidth,
        height: tempVideo.videoHeight,
        fileSize: (file.size / (1024 * 1024)).toFixed(1) + " MB",
        url,
      });

      const initialClip: TimelineClip = {
        id: "clip-upload-" + Date.now(),
        name: file.name.replace(/\.[^/.]+$/, ""),
        sourceStart: 0,
        sourceEnd: vidDur,
        duration: vidDur,
        startTimeline: 0,
        endTimeline: vidDur,
        color: "#0284c7",
        speed: 1.0,
      };
      pushHistory(clips);
      setClips([initialClip]);
      setSelectedClipId(initialClip.id);
      playback.seek(0);
    };
  }, [clips, config.defaultZoomScale, playback, pushHistory]);

  // Handle native Electron video import
  const handleNativeOpenVideo = useCallback(async () => {
    if (typeof window !== "undefined" && window.electronAPI) {
      try {
        const result = await window.electronAPI.openVideoDialog();
        if (!result.canceled && (result.dataUrl || result.filePath)) {
          if (result.dataUrl) {
            const res = await fetch(result.dataUrl);
            const blob = await res.blob();
            const file = new File([blob], result.fileName || "imported-video.mp4", {
              type: blob.type || "video/mp4",
            });
            handleFileUpload(file);
          }
        }
      } catch (err) {
        console.error("Failed to open native video:", err);
      }
    }
  }, [handleFileUpload]);

  // Project Storage & Save State
  const projectIdRef = useRef<string | null>(null);
  const createdAtRef = useRef<number>(Date.now());
  const [isSavedFeedback, setIsSavedFeedback] = useState<boolean>(false);

  // Load project by ?id=... or set aspect ratio from ?ratio=...
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      const ratio = params.get("ratio") as AspectRatio | null;

      if (id) {
        const saved = getProjectById(id);
        if (saved) {
          projectIdRef.current = saved.id;
          createdAtRef.current = saved.createdAt;
          setProjectName(saved.name);
          if (saved.config) {
            setConfig((prev) => ({ ...prev, ...saved.config }));
          }
          if (saved.clips && saved.clips.length > 0) {
            setClips(saved.clips);
            setSelectedClipId(saved.clips[0].id);
          }
          if (saved.events && saved.events.length > 0) {
            setEvents(saved.events);
          }
          return;
        }
      }

      if (ratio) {
        setConfig((prev) => ({ ...prev, aspectRatio: ratio }));
      }
    }
  }, []);

  // Save current project state
  const handleSaveProject = useCallback(async () => {
    let thumbnail: string | undefined = undefined;
    if (canvasRef.current) {
      try {
        thumbnail = canvasRef.current.toDataURL("image/jpeg", 0.6);
      } catch (err) {
        console.warn("Could not capture thumbnail:", err);
      }
    }

    const currentId = projectIdRef.current || `proj-${Date.now()}`;
    projectIdRef.current = currentId;

    const calcDuration = clips.reduce(
      (max, c) => Math.max(max, c.endTimeline),
      metadata?.duration || 10
    );

    const projectData: SavedProject = {
      id: currentId,
      name: projectName,
      createdAt: createdAtRef.current,
      updatedAt: Date.now(),
      duration: Math.round(calcDuration * 10) / 10,
      aspectRatio: config.aspectRatio,
      clipCount: clips.length,
      keyframeCount: events.length,
      thumbnail,
      videoFileName: metadata?.name || "recording.mp4",
      config,
      clips,
      events,
    };

    saveProject(projectData);
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2200);

    if (typeof window !== "undefined" && window.electronAPI) {
      console.log("[FocuFlow] Project successfully saved to workspace:", projectData.name);
    }
  }, [clips, config, events, metadata?.duration, metadata?.name, projectName]);

  // Global Ctrl+S keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSaveProject();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSaveProject]);

  // Subscribe to native application menu shortcuts (Ctrl+O, Ctrl+S, Ctrl+E, Ctrl+N)
  useEffect(() => {
    if (typeof window !== "undefined" && window.electronAPI?.onMenuAction) {
      const cleanup = window.electronAPI.onMenuAction((action) => {
        if (action === "file:open") {
          handleNativeOpenVideo();
        } else if (action === "file:save") {
          handleSaveProject();
        } else if (action === "file:export") {
          setIsExportOpen(true);
        } else if (action === "file:new") {
          setClips([]);
          setEvents([]);
          setVideoSrc(null);
          setMetadata(null);
          projectIdRef.current = `proj-${Date.now()}`;
          setProjectName("New Project");
        }
      });
      return cleanup;
    }
  }, [handleNativeOpenVideo, handleSaveProject]);

  // Auto-load demo on initial mount if not loading a saved project
  useEffect(() => {
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    if (!params.get("id")) {
      handleLoadDemo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Split / Cut Clip Action
  const handleSplitClip = useCallback(
    (clipId: string, splitTime: number) => {
      setClips((prev) => {
        const clipIdx = prev.findIndex((c) => c.id === clipId);
        if (clipIdx === -1) return prev;
        const targetClip = prev[clipIdx];
        if (splitTime <= targetClip.startTimeline + 0.25 || splitTime >= targetClip.endTimeline - 0.25) {
          return prev;
        }

        pushHistory(prev);

        const offset = splitTime - targetClip.startTimeline;
        const splitSourceTime = targetClip.sourceStart + offset * targetClip.speed;

        const clipA: TimelineClip = {
          ...targetClip,
          id: `clip-${Date.now()}-A`,
          sourceEnd: splitSourceTime,
          duration: offset,
          endTimeline: splitTime,
        };

        const clipB: TimelineClip = {
          ...targetClip,
          id: `clip-${Date.now()}-B`,
          name: `${targetClip.name} (Part 2)`,
          sourceStart: splitSourceTime,
          duration: targetClip.duration - offset,
          startTimeline: splitTime,
          endTimeline: targetClip.endTimeline,
        };

        const updated = [...prev];
        updated.splice(clipIdx, 1, clipA, clipB);
        setSelectedClipId(clipB.id);
        return updated;
      });
    },
    [pushHistory]
  );

  // Trim Clip Action
  const handleTrimClip = useCallback(
    (clipId: string, newStart: number, newEnd: number) => {
      setClips((prev) => {
        const target = prev.find((c) => c.id === clipId);
        if (!target) return prev;

        const newDur = Math.max(0.25, newEnd - newStart);
        const startDelta = Math.max(0, newStart - target.startTimeline);

        return prev.map((c) => {
          if (c.id !== clipId) return c;
          return {
            ...c,
            startTimeline: newStart,
            endTimeline: newEnd,
            duration: newDur,
            sourceStart: c.sourceStart + startDelta * c.speed,
            sourceEnd: c.sourceStart + (startDelta + newDur) * c.speed,
          };
        });
      });
    },
    []
  );

  // Move / Reposition Clip on Timeline
  const handleMoveClip = useCallback(
    (clipId: string, newStart: number) => {
      setClips((prev) => {
        const target = prev.find((c) => c.id === clipId);
        if (!target) return prev;

        const safeStart = Math.max(0, newStart);
        const newEnd = safeStart + target.duration;

        return prev.map((c) => {
          if (c.id !== clipId) return c;
          return {
            ...c,
            startTimeline: safeStart,
            endTimeline: newEnd,
          };
        });
      });
    },
    []
  );

  // Delete Clip Action
  const handleDeleteClip = useCallback(
    (clipId: string) => {
      setClips((prev) => {
        pushHistory(prev);
        return prev.filter((c) => c.id !== clipId);
      });
      if (selectedClipId === clipId) setSelectedClipId(null);
    },
    [pushHistory, selectedClipId]
  );

  // Ripple Delete Clip Action
  const handleRippleDeleteClip = useCallback(
    (clipId: string) => {
      setClips((prev) => {
        const target = prev.find((c) => c.id === clipId);
        if (!target) return prev;
        pushHistory(prev);

        const gap = target.duration;
        const remaining = prev.filter((c) => c.id !== clipId);
        return remaining.map((c) => {
          if (c.startTimeline > target.startTimeline) {
            return {
              ...c,
              startTimeline: Math.max(0, c.startTimeline - gap),
              endTimeline: Math.max(0, c.endTimeline - gap),
            };
          }
          return c;
        });
      });
      if (selectedClipId === clipId) setSelectedClipId(null);
    },
    [pushHistory, selectedClipId]
  );

  // Add click event from canvas click
  const handleAddClickAtCoords = (x: number, y: number) => {
    const newEvent: ClickEvent = {
      id: "click-" + Date.now(),
      timestamp: Math.round(playback.currentTime * 10) / 10,
      x: Math.round(x * 1000) / 1000,
      y: Math.round(y * 1000) / 1000,
      zoom: config.defaultZoomScale,
      label: `Target (${Math.round(x * 100)}%, ${Math.round(y * 100)}%)`,
      enabled: true,
    };

    setEvents((prev) => [...prev, newEvent].sort((a, b) => a.timestamp - b.timestamp));
    setIsAddMode(false);
  };

  // Add event at current playhead time
  const handleAddCurrentTimeEvent = useCallback(() => {
    const newEvent: ClickEvent = {
      id: "click-" + Date.now(),
      timestamp: Math.round(playback.currentTime * 10) / 10,
      x: 0.5,
      y: 0.5,
      zoom: config.defaultZoomScale,
      label: `Target at ${playback.currentTime.toFixed(1)}s`,
      enabled: true,
    };
    setEvents((prev) => [...prev, newEvent].sort((a, b) => a.timestamp - b.timestamp));
  }, [playback.currentTime, config.defaultZoomScale]);

  const handleUpdateEvent = (id: string, updates: Partial<ClickEvent>) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const handleSelectEvent = (event: ClickEvent) => {
    playback.seek(Math.max(0, event.timestamp - 0.2));
  };

  // Take high-res snapshot PNG of current canvas
  const handleTakeSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${projectName.toLowerCase().replace(/\s+/g, "-")}-frame.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Global keyboard shortcuts (Space, Split: S, Delete: Del, Add Keyframe: K, Undo: Ctrl+Z, Redo: Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        playback.togglePlay();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        playback.stepFrames(-1);
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        playback.stepFrames(1);
      } else if (e.key === "s" || e.key === "S") {
        // Split at playhead
        const activeClip = clips.find(
          (c) => playback.currentTime >= c.startTimeline && playback.currentTime <= c.endTimeline
        );
        if (activeClip) {
          handleSplitClip(activeClip.id, playback.currentTime);
        }
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedClipId) {
          if (e.shiftKey) {
            handleRippleDeleteClip(selectedClipId);
          } else {
            handleDeleteClip(selectedClipId);
          }
        }
      } else if (e.key === "k" || e.key === "K") {
        handleAddCurrentTimeEvent();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        handleRedo();
      } else if (e.key === "Escape") {
        setIsAddMode(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playback, clips, selectedClipId, handleSplitClip, handleDeleteClip, handleRippleDeleteClip, handleUndo, handleRedo, handleAddCurrentTimeEvent]);

  // Global mousemove and mouseup listeners for resizable inspector divider
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragDividerRef.current) {
        const clampedWidth = Math.max(280, Math.min(540, window.innerWidth - e.clientX));
        setInspectorWidth(clampedWidth);
      }
    };

    const handleMouseUp = () => {
      if (dragDividerRef.current) {
        dragDividerRef.current = false;
        setIsDraggingDivider(false);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleStartDragDivider = (e: React.MouseEvent) => {
    e.preventDefault();
    dragDividerRef.current = true;
    setIsDraggingDivider(true);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#090D16] text-slate-100 overflow-hidden font-sans select-none relative">
      {/* Subtle atmospheric ambient glow */}
      <div className="ambient-backdrop pointer-events-none" />

      {/* 1. Editor Header */}
      <EditorHeader
        projectName={projectName}
        onProjectNameChange={setProjectName}
        aspectRatio={config.aspectRatio}
        onAspectRatioChange={(ratio) => handleUpdateConfig({ aspectRatio: ratio })}
        onTakeSnapshot={handleTakeSnapshot}
        onOpenExport={() => setIsExportOpen(true)}
        onSaveProject={handleSaveProject}
        isSavedFeedback={isSavedFeedback}
        isReady={Boolean(videoSrc && metadata)}
        isElectron={isElectron}
        onNativeOpenVideo={handleNativeOpenVideo}
        isRecording={screenRecorder.isRecording}
        recordingDuration={screenRecorder.recordingDuration}
        clickCount={screenRecorder.clickCount}
        onStartRecording={screenRecorder.startRecording}
        onStopRecording={screenRecorder.stopRecording}
        showCursor={config.showCursor}
        onToggleCursor={() => handleUpdateConfig({ showCursor: !config.showCursor })}
        isRightCollapsed={isInspectorCollapsed}
        onToggleRightCollapse={() => setIsInspectorCollapsed((prev) => !prev)}
      />

      {/* Floating Active Recording HUD Overlay */}
      {screenRecorder.isRecording && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3.5 px-5 py-2.5 rounded-xl glass-panel-elevated border-rose-500/40 shadow-[0_0_35px_rgba(244,63,94,0.25)] animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-bold text-white tracking-wide uppercase">
              Screen Recording Active
            </span>
          </div>

          <div className="h-4 w-px bg-white/20" />

          <div className="text-xs font-mono text-rose-400 font-bold">
            {Math.floor(screenRecorder.recordingDuration / 60).toString().padStart(2, "0")}:
            {Math.floor(screenRecorder.recordingDuration % 60).toString().padStart(2, "0")}
          </div>

          <div className="h-4 w-px bg-white/20" />

          <div className="text-xs text-slate-300 flex items-center gap-1.5">
            <span className="text-sky-300 font-bold font-mono bg-sky-500/20 border border-sky-400/30 px-2 py-0.5 rounded-md text-[11px]">
              {screenRecorder.clickCount}
            </span>
            <span className="text-[11px] text-slate-400">
              {screenRecorder.clickCount === 1 ? "click logged" : "clicks logged"}
            </span>
          </div>

          <div className="h-4 w-px bg-white/20" />

          <button
            onClick={screenRecorder.stopRecording}
            className="flex items-center gap-1.5 px-3.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all"
          >
            <span>Stop & Import</span>
          </button>
        </div>
      )}

      {/* Screen Recorder Error Notification */}
      {screenRecorder.error && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2.5 rounded-xl glass-panel border-rose-500/50 text-rose-200 text-xs shadow-xl backdrop-blur-xl">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{screenRecorder.error}</span>
          <button
            type="button"
            onClick={screenRecorder.clearError}
            className="text-rose-400 hover:text-white ml-2 p-0.5 rounded transition-colors cursor-pointer"
            title="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Classic Pro Split View: Top-Left Preview Monitor | Top-Right Inspector */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Top-Left: Large Preview Monitor with Canvas Stage & Transport */}
        <div className="flex-1 h-full min-w-0 overflow-hidden">
          <PreviewMonitor
            videoRef={videoRef}
            canvasRef={canvasRef}
            videoSrc={videoSrc}
            events={events}
            config={config}
            onChangeConfig={handleUpdateConfig}
            isPlaying={playback.isPlaying}
            onTogglePlay={playback.togglePlay}
            isAddMode={isAddMode}
            onToggleAddMode={() => setIsAddMode((prev) => !prev)}
            onAddClickAtCoords={handleAddClickAtCoords}
            currentTime={playback.currentTime}
            duration={playback.duration}
            onSeek={playback.seek}
            onStepFrames={playback.stepFrames}
            isLooping={playback.isLooping}
            onToggleLoop={() => playback.setIsLooping(!playback.isLooping)}
          />
        </div>

        {/* Draggable Divider between Monitor and Inspector */}
        <div
          onMouseDown={handleStartDragDivider}
          className="relative w-1.5 hover:w-2 bg-white/[0.06] hover:bg-sky-500/40 active:bg-sky-500/60 cursor-col-resize flex-shrink-0 transition-colors z-20 group flex items-center justify-center select-none"
          title="Drag to resize Inspector panel"
        >
          {/* Collapse / Expand toggle button on divider */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsInspectorCollapsed((prev) => !prev);
            }}
            className="absolute z-30 w-4 h-7 rounded-l-md bg-[#090D16]/90 hover:bg-white/[0.12] border border-r-0 border-white/[0.12] text-slate-300 hover:text-white flex items-center justify-center shadow-glass-sm -left-4 transition-colors backdrop-blur-md"
            title={isInspectorCollapsed ? "Expand Inspector" : "Collapse Inspector"}
          >
            {isInspectorCollapsed ? (
              <ChevronLeft className="w-3 h-3 text-sky-400" />
            ) : (
              <ChevronRight className="w-3 h-3 text-slate-400" />
            )}
          </button>
        </div>

        {/* Top-Right: Consolidated Tabbed Inspector (Clip, 3D Canvas, Keyframes, Media, Cursor) */}
        <div
          style={{ width: isInspectorCollapsed ? 0 : inspectorWidth }}
          className={`relative flex-shrink-0 h-full overflow-hidden ${
            isDraggingDivider ? "" : "transition-[width] duration-200 ease-out"
          }`}
        >
          <div style={{ width: inspectorWidth }} className="h-full">
            <EditorInspector
              config={config}
              onChangeConfig={handleUpdateConfig}
              clips={clips}
              selectedClipId={selectedClipId}
              onSelectClip={setSelectedClipId}
              onSplitClip={handleSplitClip}
              onTrimClip={handleTrimClip}
              onDeleteClip={handleDeleteClip}
              onRippleDeleteClip={handleRippleDeleteClip}
              currentTime={playback.currentTime}
              onSeek={playback.seek}
              events={events}
              onSelectEvent={handleSelectEvent}
              onUpdateEvent={handleUpdateEvent}
              onDeleteEvent={handleDeleteEvent}
              onAddCurrentTimeEvent={handleAddCurrentTimeEvent}
              metadata={metadata}
              onFileUpload={handleFileUpload}
              onLoadDemo={handleLoadDemo}
              isGeneratingDemo={isGeneratingDemo}
              isRecording={screenRecorder.isRecording}
              recordingDuration={screenRecorder.recordingDuration}
              clickCount={screenRecorder.clickCount}
              onStartRecording={screenRecorder.startRecording}
              onStopRecording={screenRecorder.stopRecording}
            />
          </div>
        </div>
      </div>

      {/* 3. Bottom Full-Width Multi-Track Timeline Workspace */}
      <MultiTrackTimeline
        currentTime={playback.currentTime}
        duration={playback.duration}
        isPlaying={playback.isPlaying}
        onTogglePlay={playback.togglePlay}
        onSeek={playback.seek}
        onStepFrames={playback.stepFrames}
        playbackSpeed={playback.playbackSpeed}
        onSpeedChange={playback.setPlaybackSpeed}
        isLooping={playback.isLooping}
        onToggleLoop={() => playback.setIsLooping(!playback.isLooping)}
        events={events}
        onSelectEvent={handleSelectEvent}
        onUpdateEvent={handleUpdateEvent}
        onAddKeyframeAtCurrentTime={handleAddCurrentTimeEvent}
        clips={clips}
        selectedClipId={selectedClipId}
        onSelectClip={setSelectedClipId}
        onSplitClip={handleSplitClip}
        onTrimClip={handleTrimClip}
        onMoveClip={handleMoveClip}
        onDeleteClip={handleDeleteClip}
        onRippleDeleteClip={handleRippleDeleteClip}
        canUndo={history.length > 0}
        canRedo={future.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />

      {/* 4. Export Video Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        canvasRef={canvasRef}
        videoRef={videoRef}
        duration={playback.duration}
        projectName={projectName}
      />
    </div>
  );
}
