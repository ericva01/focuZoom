"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { EditorHeader } from "@/components/editor/EditorHeader";
import { PreviewMonitor } from "@/components/editor/PreviewMonitor";
import { EditorInspector } from "@/components/editor/EditorInspector";
import { MultiTrackTimeline } from "@/components/editor/MultiTrackTimeline";
import { ExportModal } from "@/components/editor/ExportModal";
import { WebcamReviewModal } from "@/components/editor/WebcamReviewModal";
import { useVideoPlayback } from "@/hooks/useVideoPlayback";
import { useScreenRecorder } from "@/hooks/useScreenRecorder";
import { generateSampleScreenRecording } from "@/utils/sampleVideoGenerator";
import { clusterNearbyClicks } from "@/utils/clickClusterer";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import {
  AspectRatio,
  CanvasConfig,
  ClickEvent,
  VideoMetadata,
  TimelineClip,
} from "@/types/editor";
import { SavedProject } from "@/utils/projectStorage";
import {
  saveProjectWithMedia,
  loadProjectWithMedia,
  getLastActiveProjectId,
  setLastActiveProjectId,
  deleteProjectFromDB,
} from "@/utils/indexedDBStorage";
import { EditorSettingsModal, ThemeMode } from "@/components/editor/EditorSettingsModal";
import { desktopBridge } from "@/lib/desktopBridge";

export default function EditorPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoBlobRef = useRef<Blob | null>(null);
  const webcamBlobRef = useRef<Blob | null>(null);

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

  // Multi-track video clips & multi-selection state
  const [clips, setClips] = useState<TimelineClip[]>([]);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedClipIds, setSelectedClipIds] = useState<string[]>([]);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);

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
    customGradientTo: "#fb7185",
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
    cursorColor: "#fb7185",
    cursorSize: 22,
    showRipple: false,
    rippleColor: "#fb7185",

    aspectRatio: "16:9",
    playbackSpeed: 1.0,

    // Webcam Picture-in-Picture (PiP) Configuration
    webcamConfig: {
      enabled: false,
      shape: "circle",
      position: "bottom-right",
      customX: 0.85,
      customY: 0.82,
      size: 180,
      borderColor: "#fb7185",
      borderWidth: 3,
      shadow: true,
      mirror: true,
      url: null,
      deviceId: null,
    },
  });

  // Registered zoom events
  const [events, setEvents] = useState<ClickEvent[]>([]);

  // Effective project timeline duration computed from clips (stops playback at clip trim end like CapCut)
  const effectiveDuration = useMemo(() => {
    if (clips.length === 0) return 0;
    const maxEnd = clips.reduce((max, c) => Math.max(max, c.endTimeline), 0);
    return maxEnd;
  }, [clips]);

  // Video playback controller hook bounded by effective timeline duration
  const playback = useVideoPlayback(videoRef, effectiveDuration);

  // Comprehensive Undo / Redo history snapshot (capturing clips, events, and selections)
  type HistorySnapshot = {
    clips: TimelineClip[];
    events: ClickEvent[];
    selectedClipId: string | null;
    selectedEventId: string | null;
    selectedClipIds: string[];
    selectedEventIds: string[];
  };

  const [history, setHistory] = useState<HistorySnapshot[]>([]);
  const [future, setFuture] = useState<HistorySnapshot[]>([]);

  // Snapshot recording helper
  const recordHistory = useCallback(() => {
    setHistory((prev) => [
      ...prev.slice(-30),
      {
        clips,
        events,
        selectedClipId,
        selectedEventId,
        selectedClipIds,
        selectedEventIds,
      },
    ]);
    setFuture([]);
  }, [clips, events, selectedClipId, selectedEventId, selectedClipIds, selectedEventIds]);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setFuture((f) => [
      {
        clips,
        events,
        selectedClipId,
        selectedEventId,
        selectedClipIds,
        selectedEventIds,
      },
      ...f,
    ]);
    setClips(previous.clips);
    setEvents(previous.events);
    setSelectedClipId(previous.selectedClipId);
    setSelectedEventId(previous.selectedEventId);
    setSelectedClipIds(previous.selectedClipIds);
    setSelectedEventIds(previous.selectedEventIds);
  }, [history, clips, events, selectedClipId, selectedEventId, selectedClipIds, selectedEventIds]);

  const handleRedo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture((f) => f.slice(1));
    setHistory((h) => [
      ...h,
      {
        clips,
        events,
        selectedClipId,
        selectedEventId,
        selectedClipIds,
        selectedEventIds,
      },
    ]);
    setClips(next.clips);
    setEvents(next.events);
    setSelectedClipId(next.selectedClipId);
    setSelectedEventId(next.selectedEventId);
    setSelectedClipIds(next.selectedClipIds);
    setSelectedEventIds(next.selectedEventIds);
  }, [future, clips, events, selectedClipId, selectedEventId, selectedClipIds, selectedEventIds]);

  // Webcam state
  const [enableWebcam, setEnableWebcam] = useState<boolean>(false);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
  const [isWebcamHidden, setIsWebcamHidden] = useState<boolean>(false);
  const [isWebcamReviewOpen, setIsWebcamReviewOpen] = useState<boolean>(false);

  // Screen recording hook with automatic canvas import and click keyframe mapping
  const screenRecorder = useScreenRecorder({
    enableWebcam,
    webcamDeviceId: selectedCameraId,
    onImportRecording: ({ blobUrl, metadata: recMeta, events: recEvents, webcamBlobUrl, videoBlob, webcamBlob }) => {
      if (videoBlob) videoBlobRef.current = videoBlob;
      if (webcamBlob) webcamBlobRef.current = webcamBlob;
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
        color: "#e11d48",
        speed: 1.0,
      };
      recordHistory();
      setClips([initialClip]);
      setSelectedClipId(initialClip.id);

      // Yield live camera preview so the recorded webcam clip takes over playback
      setEnableWebcam(false);

      // If webcam was recorded, set up webcam config with recorded URL
      if (webcamBlobUrl) {
        setMetadata((prev) => (prev ? { ...prev, webcamUrl: webcamBlobUrl } : recMeta));
        setConfig((prev) => ({
          ...prev,
          webcamConfig: {
            ...(prev.webcamConfig || {
              shape: "circle",
              position: "bottom-right",
              customX: 0.85,
              customY: 0.82,
              size: 180,
              borderColor: "#fb7185",
              borderWidth: 3,
              shadow: true,
              mirror: true,
            }),
            enabled: true,
            url: webcamBlobUrl,
          },
        }));
      }

      if (recEvents && recEvents.length > 0) {
        setEvents(clusterNearbyClicks(recEvents, 1.8, config.defaultZoomScale, recMeta.cursorTrail));
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
  const handleUpdateConfig = useCallback((updates: Partial<CanvasConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  // Load procedural demo recording
  const handleLoadDemo = useCallback(async () => {
    setIsGeneratingDemo(true);
    try {
      const sample = await generateSampleScreenRecording();
      setVideoSrc(sample.blobUrl);
      setEvents(sample.defaultEvents);
      setMetadata({
        name: "glideo-demo-recording.webm",
        duration: sample.duration,
        width: 1280,
        height: 720,
        url: sample.blobUrl,
        cursorTrail: sample.cursorTrail,
      });

      const initialClip: TimelineClip = {
        id: "clip-demo-1",
        name: "Demo Screen Recording",
        sourceStart: 0,
        sourceEnd: sample.duration,
        duration: sample.duration,
        startTimeline: 0,
        endTimeline: sample.duration,
        color: "#e11d48",
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
    videoBlobRef.current = file;
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
        color: "#e11d48",
        speed: 1.0,
      };
      setClips([initialClip]);
      setSelectedClipId(initialClip.id);
      playback.seek(0);
    };
  }, [config.defaultZoomScale, playback]);

  // Handle user uploaded webcam video file (to attach to any screen recording or imported video)
  const handleUploadWebcamFile = useCallback((file: File) => {
    webcamBlobRef.current = file;
    const url = URL.createObjectURL(file);
    setMetadata((prev) => (prev ? { ...prev, webcamUrl: url } : {
      name: file.name,
      duration: 10,
      width: 1920,
      height: 1080,
      fileSize: (file.size / (1024 * 1024)).toFixed(1) + " MB",
      url,
      webcamUrl: url,
    }));
    setConfig((prev) => ({
      ...prev,
      webcamConfig: {
        ...(prev.webcamConfig || {
          shape: "circle",
          position: "bottom-right",
          customX: 0.85,
          customY: 0.82,
          size: 180,
          borderColor: "#fb7185",
          borderWidth: 3,
          shadow: true,
          mirror: true,
        }),
        enabled: true,
        url,
      },
    }));
  }, []);

  // Handle native desktop video import
  const handleNativeOpenVideo = useCallback(async () => {
    if (desktopBridge.isDesktop) {
      try {
        const result = await desktopBridge.openVideoDialog();
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

  // Auto-Save Configuration (default 5s interval)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("glideo_autosave_enabled");
      return saved !== null ? saved === "true" : true;
    }
    return true;
  });

  const [autoSaveInterval, setAutoSaveInterval] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("glideo_autosave_interval");
      return saved ? parseInt(saved, 10) || 5 : 5;
    }
    return 5;
  });

  const [autoSaveStatus, setAutoSaveStatus] = useState<string | null>(null);
  const isDirtyRef = useRef<boolean>(false);

  // Theme Mode (dark, light, system)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("glideo_theme") as ThemeMode | null;
      return saved || "dark";
    }
    return "dark";
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (isDark) {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.add("light");
        root.classList.remove("dark");
      }
    }
  }, [theme]);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("glideo_theme", newTheme);
    }
  };

  const handleToggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    handleThemeChange(next);
  };

  // Persistent Project Initial Mount Loader
  useEffect(() => {
    if (typeof window === "undefined") return;

    let isMounted = true;
    const loadInitialProject = async () => {
      const params = new URLSearchParams(window.location.search);
      const urlId = params.get("id");
      const lastId = getLastActiveProjectId();
      const targetId = urlId || lastId;
      const ratio = params.get("ratio") as AspectRatio | null;

      if (ratio) {
        setConfig((prev) => ({ ...prev, aspectRatio: ratio }));
      }

      if (targetId) {
        try {
          const loaded = await loadProjectWithMedia(targetId);
          if (loaded && isMounted) {
            const { project: saved, videoBlob, webcamBlob } = loaded;
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

            let liveVideoUrl: string | null = null;
            if (videoBlob) {
              videoBlobRef.current = videoBlob;
              liveVideoUrl = URL.createObjectURL(videoBlob);
              setVideoSrc(liveVideoUrl);
            }

            let liveWebcamUrl: string | null = null;
            if (webcamBlob) {
              webcamBlobRef.current = webcamBlob;
              liveWebcamUrl = URL.createObjectURL(webcamBlob);
            }

            if (liveVideoUrl) {
              setMetadata({
                name: saved.videoFileName || `${saved.name}.webm`,
                duration: saved.duration || 10,
                width: 1920,
                height: 1080,
                url: liveVideoUrl,
                webcamUrl: liveWebcamUrl || undefined,
              });
            }

            if (liveWebcamUrl) {
              setConfig((prev) => ({
                ...prev,
                webcamConfig: {
                  ...(prev.webcamConfig || {
                    shape: "circle",
                    position: "bottom-right",
                    customX: 0.85,
                    customY: 0.82,
                    size: 180,
                    borderColor: "#fb7185",
                    borderWidth: 3,
                    shadow: true,
                    mirror: true,
                  }),
                  enabled: true,
                  url: liveWebcamUrl,
                },
              }));
            }

            setLastActiveProjectId(saved.id);
            window.history.replaceState(null, "", `?id=${saved.id}`);
            return;
          }
        } catch (err) {
          console.warn("[Glideo] Error loading project from IndexedDB:", err);
        }
      }

      // If no saved project exists at all, load sample demo
      if (isMounted) {
        handleLoadDemo();
      }
    };

    loadInitialProject();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save current project state (supports manual Ctrl+S/button or silent auto-save)
  const handleSaveProject = useCallback(
    async (isSilent = false) => {
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

      try {
        await saveProjectWithMedia(projectData, videoBlobRef.current, webcamBlobRef.current);
        isDirtyRef.current = false;

        if (typeof window !== "undefined") {
          window.history.replaceState(null, "", `?id=${currentId}`);
        }

        if (!isSilent) {
          setIsSavedFeedback(true);
          setTimeout(() => setIsSavedFeedback(false), 2200);
        } else {
          setAutoSaveStatus("Auto-saved");
          setTimeout(() => setAutoSaveStatus(null), 3000);
        }

        if (typeof window !== "undefined" && window.electronAPI) {
          console.log("[Glideo] Project successfully saved to workspace:", projectData.name);
        }
      } catch (err) {
        console.error("[Glideo] Failed to save project:", err);
      }
    },
    [clips, config, events, metadata?.duration, metadata?.name, projectName]
  );

  // Mark dirty when user modifies clips, events, config, or project name
  useEffect(() => {
    isDirtyRef.current = true;
  }, [clips, events, config, projectName]);

  // Periodic Auto-Save Timer (runs every autoSaveInterval seconds)
  useEffect(() => {
    if (!autoSaveEnabled || autoSaveInterval <= 0) return;

    const timer = setInterval(() => {
      if (isDirtyRef.current && (videoSrc || clips.length > 0)) {
        handleSaveProject(true);
      }
    }, autoSaveInterval * 1000);

    return () => clearInterval(timer);
  }, [autoSaveEnabled, autoSaveInterval, handleSaveProject, videoSrc, clips.length]);

  const handleToggleAutoSave = (enabled: boolean) => {
    setAutoSaveEnabled(enabled);
    if (typeof window !== "undefined") {
      localStorage.setItem("glideo_autosave_enabled", enabled ? "true" : "false");
    }
  };

  const handleChangeAutoSaveInterval = (interval: number) => {
    setAutoSaveInterval(interval);
    if (typeof window !== "undefined") {
      localStorage.setItem("glideo_autosave_interval", interval.toString());
    }
  };

  // Global Ctrl+S keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSaveProject(false);
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
          handleSaveProject(false);
        } else if (action === "file:export") {
          setIsExportOpen(true);
        } else if (action === "file:new") {
          setClips([]);
          setEvents([]);
          setVideoSrc(null);
          setMetadata(null);
          videoBlobRef.current = null;
          webcamBlobRef.current = null;
          projectIdRef.current = `proj-${Date.now()}`;
          setProjectName("New Project");
        }
      });
      return cleanup;
    }
  }, [handleNativeOpenVideo, handleSaveProject]);

  // Multi-selection handler passed to MultiTrackTimeline
  const handleSelectMultiple = useCallback((clipIds: string[], eventIds: string[]) => {
    setSelectedClipIds(clipIds);
    setSelectedEventIds(eventIds);
    if (clipIds.length === 1 && eventIds.length === 0) {
      setSelectedClipId(clipIds[0]);
      setSelectedEventId(null);
    } else if (eventIds.length === 1 && clipIds.length === 0) {
      setSelectedEventId(eventIds[0]);
      setSelectedClipId(null);
    } else {
      setSelectedClipId(null);
      setSelectedEventId(null);
    }
  }, []);

  // Delete multiple items selected via marquee
  const handleDeleteMultiple = useCallback((clipIds: string[], eventIds: string[]) => {
    recordHistory();
    if (clipIds.length > 0) {
      setClips((prev) => {
        const remaining = prev.filter((c) => !clipIds.includes(c.id));
        if (remaining.length === 0) {
          if (playback.isPlaying) {
            playback.pause();
          }
          playback.seek(0);
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }
        }
        return remaining;
      });
    }
    if (eventIds.length > 0) {
      setEvents((prev) => prev.filter((e) => !eventIds.includes(e.id)));
    }
    setSelectedClipIds([]);
    setSelectedEventIds([]);
    setSelectedClipId(null);
    setSelectedEventId(null);
  }, [recordHistory, playback, videoRef]);

  // Split / Cut Clip Action
  const handleSplitClip = useCallback(
    (clipId: string, splitTime: number) => {
      recordHistory();
      setClips((prev) => {
        const clipIdx = prev.findIndex((c) => c.id === clipId);
        if (clipIdx === -1) return prev;
        const targetClip = prev[clipIdx];
        if (splitTime <= targetClip.startTimeline + 0.25 || splitTime >= targetClip.endTimeline - 0.25) {
          return prev;
        }

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
    [recordHistory]
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
      if (playback.currentTime > newEnd) {
        playback.seek(newEnd);
      }
    },
    [playback]
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
      recordHistory();
      setClips((prev) => {
        const remaining = prev.filter((c) => c.id !== clipId);
        if (remaining.length === 0) {
          if (playback.isPlaying) {
            playback.pause();
          }
          playback.seek(0);
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }
        }
        return remaining;
      });
      if (selectedClipId === clipId) setSelectedClipId(null);
    },
    [recordHistory, selectedClipId, playback, videoRef]
  );

  // Ripple Delete Clip Action
  const handleRippleDeleteClip = useCallback(
    (clipId: string) => {
      recordHistory();
      setClips((prev) => {
        const target = prev.find((c) => c.id === clipId);
        if (!target) return prev;

        const gap = target.duration;
        const remaining = prev.filter((c) => c.id !== clipId);
        if (remaining.length === 0) {
          if (playback.isPlaying) {
            playback.pause();
          }
          playback.seek(0);
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }
          return [];
        }
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
    [recordHistory, selectedClipId, playback, videoRef]
  );

  // Add click event from canvas click
  const handleAddClickAtCoords = useCallback((x: number, y: number) => {
    recordHistory();
    const newEvent: ClickEvent = {
      id: "click-" + Date.now(),
      timestamp: Math.round(playback.currentTime * 10) / 10,
      x: Math.round(x * 1000) / 1000,
      y: Math.round(y * 1000) / 1000,
      zoom: config.defaultZoomScale,
      label: `Target (${Math.round(x * 100)}%, ${Math.round(y * 100)}%)`,
      enabled: true,
    };

    setEvents((prev) =>
      clusterNearbyClicks([...prev, newEvent], 1.8, config.defaultZoomScale, metadata?.cursorTrail)
    );
    setIsAddMode(false);
  }, [playback.currentTime, config.defaultZoomScale, metadata?.cursorTrail, recordHistory]);

  // Add event at current playhead time
  const handleAddCurrentTimeEvent = useCallback(() => {
    recordHistory();
    const newEvent: ClickEvent = {
      id: "click-" + Date.now(),
      timestamp: Math.round(playback.currentTime * 10) / 10,
      x: 0.5,
      y: 0.5,
      zoom: config.defaultZoomScale,
      label: `Target at ${playback.currentTime.toFixed(1)}s`,
      enabled: true,
    };
    setEvents((prev) =>
      clusterNearbyClicks([...prev, newEvent], 1.8, config.defaultZoomScale, metadata?.cursorTrail)
    );
  }, [playback.currentTime, config.defaultZoomScale, metadata?.cursorTrail, recordHistory]);

  const handleUpdateEvent = useCallback((id: string, updates: Partial<ClickEvent>) => {
    recordHistory();
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const updated = { ...e, ...updates };
        if (updates.x !== undefined || updates.y !== undefined) {
          const newX = updates.x !== undefined ? updates.x : e.x;
          const newY = updates.y !== undefined ? updates.y : e.y;
          const dx = newX - e.x;
          const dy = newY - e.y;

          if (dx !== 0 || dy !== 0) {
            if (updated.targets && updated.targets.length > 0) {
              updated.targets = updated.targets.map((tgt) => ({
                ...tgt,
                x: Math.max(0.02, Math.min(0.98, Math.round((tgt.x + dx) * 1000) / 1000)),
                y: Math.max(0.02, Math.min(0.98, Math.round((tgt.y + dy) * 1000) / 1000)),
              }));
            }

            if (updated.cursorTrail && updated.cursorTrail.length > 0) {
              updated.cursorTrail = updated.cursorTrail.map((p) => ({
                ...p,
                x: Math.max(0.02, Math.min(0.98, Math.round((p.x + dx) * 1000) / 1000)),
                y: Math.max(0.02, Math.min(0.98, Math.round((p.y + dy) * 1000) / 1000)),
              }));
            }
          }
        }
        return updated;
      })
    );
  }, [recordHistory]);

  const handleDeleteEvent = useCallback((id: string) => {
    recordHistory();
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setSelectedEventId((prev) => (prev === id ? null : prev));
  }, [recordHistory]);

  const handleMergeNearbyClicks = useCallback(() => {
    recordHistory();
    setEvents((prev) => clusterNearbyClicks(prev, 1.8, config.defaultZoomScale, metadata?.cursorTrail));
  }, [config.defaultZoomScale, metadata?.cursorTrail, recordHistory]);

  const handleSelectEvent = useCallback((event: ClickEvent) => {
    setSelectedEventId(event.id);
    setSelectedClipId(null);
    playback.seek(event.timestamp);
  }, [playback]);

  const handleSelectClip = useCallback((clipId: string | null) => {
    setSelectedClipId(clipId);
    if (clipId) {
      setSelectedEventId(null);
    }
  }, []);

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
        if (selectedClipIds.length > 0 || selectedEventIds.length > 0) {
          e.preventDefault();
          handleDeleteMultiple(selectedClipIds, selectedEventIds);
        } else if (selectedEventId) {
          e.preventDefault();
          handleDeleteEvent(selectedEventId);
        } else if (selectedClipId) {
          e.preventDefault();
          if (e.shiftKey) {
            handleRippleDeleteClip(selectedClipId);
          } else {
            handleDeleteClip(selectedClipId);
          }
        }
      } else if (e.key === "k" || e.key === "K") {
        handleAddCurrentTimeEvent();
      } else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "z" || e.code === "KeyZ")) {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "y" || e.code === "KeyY")) {
        e.preventDefault();
        handleRedo();
      } else if (e.key === "Escape") {
        setIsAddMode(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    playback,
    clips,
    selectedClipId,
    selectedEventId,
    selectedClipIds,
    selectedEventIds,
    handleSplitClip,
    handleDeleteClip,
    handleRippleDeleteClip,
    handleDeleteEvent,
    handleDeleteMultiple,
    handleUndo,
    handleRedo,
    handleAddCurrentTimeEvent,
  ]);

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
    <div
      className={`flex flex-col h-screen w-screen transition-colors duration-200 ${
        theme === "light" ? "bg-[#F1F5F9] text-slate-800" : "bg-[#090D16] text-slate-100"
      } overflow-hidden font-sans select-none relative`}
    >
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
        enableWebcam={enableWebcam}
        onToggleWebcam={() => setIsWebcamReviewOpen(true)}
        onOpenWebcamReview={() => setIsWebcamReviewOpen(true)}
        hasWebcamRecorded={Boolean(metadata?.webcamUrl || config.webcamConfig?.url)}
        isRightCollapsed={isInspectorCollapsed}
        onToggleRightCollapse={() => setIsInspectorCollapsed((prev) => !prev)}
        canUndo={history.length > 0}
        canRedo={future.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
        autoSaveStatus={autoSaveStatus}
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
            <span className="text-rose-300 font-bold font-mono bg-rose-500/20 border border-rose-400/30 px-2 py-0.5 rounded-md text-[11px]">
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
            clips={clips}
            events={events}
            selectedEventId={selectedEventId}
            onUpdateEvent={handleUpdateEvent}
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
            cursorTrail={metadata?.cursorTrail}
            webcamStream={screenRecorder.liveWebcamStream}
            webcamUrl={metadata?.webcamUrl || config.webcamConfig?.url}
            isWebcamHidden={isWebcamHidden}
          />
        </div>

        {/* Draggable Divider between Monitor and Inspector */}
        <div
          onMouseDown={handleStartDragDivider}
          className="relative w-1.5 hover:w-2 bg-white/[0.06] hover:bg-rose-500/40 active:bg-rose-500/60 cursor-col-resize flex-shrink-0 transition-colors z-20 group flex items-center justify-center select-none"
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
              <ChevronLeft className="w-3 h-3 text-rose-400" />
            ) : (
              <ChevronRight className="w-3 h-3 text-slate-400" />
            )}
          </button>
        </div>

        {/* Top-Right: Consolidated Tabbed Inspector (Clip, 3D Canvas, Keyframes, Webcam, Cursor, Media) */}
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
              onSelectClip={handleSelectClip}
              onSplitClip={handleSplitClip}
              onTrimClip={handleTrimClip}
              onDeleteClip={handleDeleteClip}
              onRippleDeleteClip={handleRippleDeleteClip}
              currentTime={playback.currentTime}
              onSeek={playback.seek}
              events={events}
              selectedEventId={selectedEventId}
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
              availableCameras={screenRecorder.availableCameras}
              enableWebcam={enableWebcam}
              onToggleWebcam={() => {
                setEnableWebcam((prev) => !prev);
                handleUpdateConfig({
                  webcamConfig: {
                    ...(config.webcamConfig || {
                      shape: "circle",
                      position: "bottom-right",
                      customX: 0.85,
                      customY: 0.82,
                      size: 180,
                      borderColor: "#fb7185",
                      borderWidth: 3,
                      shadow: true,
                      mirror: true,
                    }),
                    enabled: !enableWebcam,
                  },
                });
              }}
              selectedCameraId={selectedCameraId}
              onSelectCameraId={setSelectedCameraId}
              onOpenWebcamReview={() => setIsWebcamReviewOpen(true)}
              onUploadWebcamFile={handleUploadWebcamFile}
            />
          </div>
        </div>
      </div>

      {/* 3. Bottom Full-Width Multi-Track Timeline Workspace */}
      <MultiTrackTimeline
        currentTime={playback.currentTime}
        duration={effectiveDuration}
        isPlaying={playback.isPlaying}
        onTogglePlay={playback.togglePlay}
        onSeek={playback.seek}
        onStepFrames={playback.stepFrames}
        playbackSpeed={playback.playbackSpeed}
        onSpeedChange={playback.setPlaybackSpeed}
        isLooping={playback.isLooping}
        onToggleLoop={() => playback.setIsLooping(!playback.isLooping)}
        events={events}
        selectedEventId={selectedEventId}
        selectedClipIds={selectedClipIds}
        selectedEventIds={selectedEventIds}
        onSelectEvent={handleSelectEvent}
        onSelectMultiple={handleSelectMultiple}
        onDeleteMultiple={handleDeleteMultiple}
        onUpdateEvent={handleUpdateEvent}
        onDeleteEvent={handleDeleteEvent}
        onAddKeyframeAtCurrentTime={handleAddCurrentTimeEvent}
        onMergeNearbyClicks={handleMergeNearbyClicks}
        clips={clips}
        selectedClipId={selectedClipId}
        onSelectClip={handleSelectClip}
        onSplitClip={handleSplitClip}
        onTrimClip={handleTrimClip}
        onMoveClip={handleMoveClip}
        onDeleteClip={handleDeleteClip}
        onRippleDeleteClip={handleRippleDeleteClip}
        canUndo={history.length > 0}
        canRedo={future.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onCommitHistory={recordHistory}
        webcamClip={
          (metadata?.webcamUrl || config.webcamConfig?.url)
            ? {
                id: "clip-facecam-1",
                name: "Facecam (PiP)",
                sourceStart: 0,
                sourceEnd: effectiveDuration,
                duration: effectiveDuration,
                startTimeline: 0,
                endTimeline: effectiveDuration,
                color: "#10b981",
                speed: 1.0,
              }
            : null
        }
        isWebcamHidden={isWebcamHidden}
        onToggleWebcamHidden={() => {
          setIsWebcamHidden((prev) => {
            const nextHidden = !prev;
            handleUpdateConfig({
              webcamConfig: {
                ...(config.webcamConfig || {
                  shape: "circle",
                  position: "bottom-right",
                  customX: 0.85,
                  customY: 0.82,
                  size: 180,
                  borderColor: "#fb7185",
                  borderWidth: 3,
                  shadow: true,
                  mirror: true,
                }),
                enabled: !nextHidden,
              },
            });
            return nextHidden;
          });
        }}
      />

      {/* 4. Export Video Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        canvasRef={canvasRef}
        videoRef={videoRef}
        duration={effectiveDuration}
        projectName={projectName}
        webcamConfig={config.webcamConfig}
        webcamUrl={metadata?.webcamUrl || config.webcamConfig?.url}
      />

      {/* 5. Pre-Recording Webcam Review & Setup Modal */}
      <WebcamReviewModal
        isOpen={isWebcamReviewOpen}
        onClose={() => setIsWebcamReviewOpen(false)}
        config={config}
        onChangeConfig={handleUpdateConfig}
        liveWebcamStream={screenRecorder.liveWebcamStream}
        availableCameras={screenRecorder.availableCameras}
        onStartWebcamPreview={screenRecorder.startWebcamPreview}
        onStopWebcamPreview={screenRecorder.stopWebcamPreview}
        onRefreshCameras={screenRecorder.refreshCameras}
        enableWebcam={enableWebcam}
        onSetEnableWebcam={(enabled) => {
          setEnableWebcam(enabled);
          handleUpdateConfig({
            webcamConfig: {
              ...(config.webcamConfig || {
                shape: "circle",
                position: "bottom-right",
                customX: 0.85,
                customY: 0.82,
                size: 180,
                borderColor: "#fb7185",
                borderWidth: 3,
                shadow: true,
                mirror: true,
              }),
              enabled,
            },
          });
        }}
        onStartRecording={screenRecorder.startRecording}
        isRecording={screenRecorder.isRecording}
      />

      {/* 6. Settings Modal (Theme, Auto-Save, Storage) */}
      <EditorSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onThemeChange={handleThemeChange}
        autoSaveEnabled={autoSaveEnabled}
        onToggleAutoSave={handleToggleAutoSave}
        autoSaveInterval={autoSaveInterval}
        onChangeAutoSaveInterval={handleChangeAutoSaveInterval}
        onSaveNow={() => handleSaveProject(false)}
        onClearCache={() => {
          if (projectIdRef.current) {
            deleteProjectFromDB(projectIdRef.current);
          }
        }}
      />
    </div>
  );
}
