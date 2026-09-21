"use client";

import { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import {
  Play,
  Pause,
  Crosshair,
  Check,
  Cuboid,
  Camera,
  Film,
  Maximize,
  Minimize,
} from "lucide-react";
import { ClickEvent, CanvasConfig, AspectRatio, CursorPoint, TimelineClip } from "@/types/editor";
import { useThreeAnimationEngine } from "@/hooks/useThreeAnimationEngine";
import { clamp } from "@/utils/easing";

interface VideoCanvasProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  videoSrc: string | null;
  events: ClickEvent[];
  config: CanvasConfig;
  isPlaying: boolean;
  onTogglePlay: () => void;
  isAddMode: boolean;
  onAddClickAtCoords: (x: number, y: number) => void;
  aspectRatio: AspectRatio;
  cursorTrail?: CursorPoint[];
  selectedEventId?: string | null;
  onUpdateEvent?: (id: string, updates: Partial<ClickEvent>) => void;
  webcamStream?: MediaStream | null;
  webcamUrl?: string | null;
  isWebcamHidden?: boolean;
  onChangeConfig?: (updates: Partial<CanvasConfig>) => void;
  clips?: TimelineClip[];
  currentTime?: number;
  hasActiveClip?: boolean;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
}

function VideoCanvasBase({
  videoRef,
  canvasRef,
  videoSrc,
  events,
  config,
  isPlaying,
  onTogglePlay,
  isAddMode,
  onAddClickAtCoords,
  aspectRatio,
  cursorTrail,
  selectedEventId,
  onUpdateEvent,
  webcamStream,
  webcamUrl,
  isWebcamHidden = false,
  onChangeConfig,
  clips,
  currentTime,
  hasActiveClip,
  onToggleFullscreen,
  isFullscreen,
}: VideoCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoverCoords, setHoverCoords] = useState<{ x: number; y: number } | null>(null);
  const [justAddedToast, setJustAddedToast] = useState<{ x: number; y: number } | null>(null);
  const [isRightClickDragging, setIsRightClickDragging] = useState<boolean>(false);
  const [rightDragEvent, setRightDragEvent] = useState<ClickEvent | null>(null);

  // Mouse normalized coordinates for 3D perspective parallax tracking (-1.0 to 1.0)
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Webcam PiP video element ref & drag state
  const webcamVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isDraggingWebcam, setIsDraggingWebcam] = useState<boolean>(false);
  const webcamDragStartRef = useRef<{ startX: number; startY: number; initCustomX: number; initCustomY: number }>({
    startX: 0,
    startY: 0,
    initCustomX: 0.85,
    initCustomY: 0.82,
  });

  const effectiveWebcamUrl = webcamUrl || config.webcamConfig?.url || null;

  // Robust attachment of stream or URL directly to video element upon mount
  const setWebcamVideoEl = useCallback(
    (el: HTMLVideoElement | null) => {
      webcamVideoRef.current = el;
      if (!el) return;

      // Prefer recorded/imported video file over live preview stream during editor playback
      if (effectiveWebcamUrl) {
        if (el.src !== effectiveWebcamUrl) {
          el.srcObject = null;
          el.src = effectiveWebcamUrl;
        }
        if (videoRef.current) {
          try {
            el.currentTime = videoRef.current.currentTime || 0;
          } catch {}
          if (!videoRef.current.paused) {
            el.play().catch(() => {});
          }
        }
      } else if (webcamStream) {
        if (el.srcObject !== webcamStream) {
          el.srcObject = webcamStream;
          el.play().catch(() => {});
        }
      }
    },
    [webcamStream, effectiveWebcamUrl, videoRef]
  );

  // Keep attached stream/url updated when props or config change
  useEffect(() => {
    const el = webcamVideoRef.current;
    if (!el) return;
    if (effectiveWebcamUrl) {
      if (el.src !== effectiveWebcamUrl) {
        el.srcObject = null;
        el.src = effectiveWebcamUrl;
        el.play().catch(() => {});
      }
    } else if (webcamStream) {
      if (el.srcObject !== webcamStream) {
        el.srcObject = webcamStream;
        el.play().catch(() => {});
      }
    }
  }, [webcamStream, effectiveWebcamUrl]);

  // Synchronize webcam video playback with main video playback
  useEffect(() => {
    const mainVid = videoRef.current;
    const camVid = webcamVideoRef.current;
    if (!mainVid || !camVid || !effectiveWebcamUrl) return;

    const handleTimeUpdate = () => {
      if (Math.abs(camVid.currentTime - mainVid.currentTime) > 0.15) {
        camVid.currentTime = mainVid.currentTime;
      }
    };
    const handlePlay = () => {
      camVid.play().catch(() => {});
    };
    const handlePause = () => {
      camVid.pause();
    };
    const handleSeeking = () => {
      camVid.currentTime = mainVid.currentTime;
    };

    if (!mainVid.paused && camVid.paused) {
      camVid.play().catch(() => {});
    }
    if (mainVid.currentTime > 0) {
      camVid.currentTime = mainVid.currentTime;
    }

    mainVid.addEventListener("timeupdate", handleTimeUpdate);
    mainVid.addEventListener("play", handlePlay);
    mainVid.addEventListener("pause", handlePause);
    mainVid.addEventListener("seeking", handleSeeking);

    return () => {
      mainVid.removeEventListener("timeupdate", handleTimeUpdate);
      mainVid.removeEventListener("play", handlePlay);
      mainVid.removeEventListener("pause", handlePause);
      mainVid.removeEventListener("seeking", handleSeeking);
    };
  }, [videoRef, webcamStream, effectiveWebcamUrl, config.webcamConfig?.enabled]);

  // Determine if a video clip is actively present on the timeline
  const effectiveHasActiveClip = useMemo(() => {
    if (hasActiveClip !== undefined) return hasActiveClip;
    if (!clips) return true;
    if (clips.length === 0) return false;
    if (currentTime === undefined) return clips.length > 0;
    return clips.some((c) => currentTime >= c.startTimeline && currentTime <= c.endTimeline);
  }, [hasActiveClip, clips, currentTime]);

  // Initialize Three.js 3D WebGL animation engine
  const { cameraState, getVideoCoordinatesAtCanvasPos } = useThreeAnimationEngine(
    videoRef,
    canvasRef,
    videoSrc,
    events,
    config,
    mousePosRef,
    cursorTrail,
    effectiveHasActiveClip,
    currentTime,
    clips
  );

  // Set internal canvas resolution based on Aspect Ratio
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let w = 1920;
    let h = 1080;

    switch (aspectRatio) {
      case "9:16":
        w = 1080;
        h = 1920;
        break;
      case "4:3":
        w = 1440;
        h = 1080;
        break;
      case "1:1":
        w = 1080;
        h = 1080;
        break;
      case "16:9":
      default:
        w = 1920;
        h = 1080;
        break;
    }

    canvas.width = w;
    canvas.height = h;
  }, [aspectRatio, canvasRef]);

  // Handle clicking on the canvas to place a zoom point with precise video-frame mapping
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isAddMode) {
      onTogglePlay();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const videoCoords = getVideoCoordinatesAtCanvasPos(e.clientX, e.clientY);
    const normX = videoCoords
      ? videoCoords.x
      : Math.max(0.05, Math.min(0.95, (e.clientX - rect.left) / rect.width));
    const normY = videoCoords
      ? videoCoords.y
      : Math.max(0.05, Math.min(0.95, (e.clientY - rect.top) / rect.height));

    onAddClickAtCoords(normX, normY);

    setJustAddedToast({ x: normX, y: normY });
    setTimeout(() => setJustAddedToast(null), 1500);
  };

  // Right-click drag to directly reposition zoom target focus
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 2) {
      e.preventDefault();
      e.stopPropagation();

      const targetEv =
        (selectedEventId && events.find((ev) => ev.id === selectedEventId)) ||
        cameraState?.activeEvent ||
        events[0] ||
        null;

      const videoCoords = getVideoCoordinatesAtCanvasPos(e.clientX, e.clientY);
      if (videoCoords) {
        setIsRightClickDragging(true);
        setRightDragEvent(targetEv);
        setHoverCoords(videoCoords);
        if (targetEv && onUpdateEvent) {
          onUpdateEvent(targetEv.id, { x: videoCoords.x, y: videoCoords.y });
        }
      }
    }
  };

  const handleCanvasMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 2 && isRightClickDragging) {
      e.preventDefault();
      e.stopPropagation();
      setIsRightClickDragging(false);
      setRightDragEvent(null);
      if (hoverCoords) {
        setJustAddedToast(hoverCoords);
        setTimeout(() => setJustAddedToast(null), 1500);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    // 1. Update 3D parallax coordinates for Three.js
    const mx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const my = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    mousePosRef.current = { x: clamp(mx, -1, 1), y: clamp(my, -1, 1) };

    // 2. Right-click drag to live-reposition target point
    if (isRightClickDragging && rightDragEvent && onUpdateEvent) {
      const videoCoords = getVideoCoordinatesAtCanvasPos(e.clientX, e.clientY);
      if (videoCoords) {
        onUpdateEvent(rightDragEvent.id, { x: videoCoords.x, y: videoCoords.y });
        setHoverCoords(videoCoords);
      }
      return;
    }

    // 3. Add-mode coordinate crosshair HUD mapped to video stream coordinates
    if (isAddMode) {
      const videoCoords = getVideoCoordinatesAtCanvasPos(e.clientX, e.clientY);
      setHoverCoords(
        videoCoords || {
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        }
      );
    } else if (hoverCoords && !isRightClickDragging) {
      setHoverCoords(null);
    }
  };

  const handleMouseLeave = () => {
    if (!isRightClickDragging) {
      mousePosRef.current = { x: 0, y: 0 };
      setHoverCoords(null);
    }
  };

  const aspectCss =
    aspectRatio === "16:9"
      ? "16 / 9"
      : aspectRatio === "9:16"
      ? "9 / 16"
      : aspectRatio === "4:3"
      ? "4 / 3"
      : "1 / 1";

  const defaultWidth =
    aspectRatio === "9:16" ? 1080 : aspectRatio === "4:3" ? 1440 : aspectRatio === "1:1" ? 1080 : 1920;
  const defaultHeight = aspectRatio === "9:16" ? 1920 : 1080;

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-0 bg-transparent flex flex-col items-center justify-center p-2 sm:p-3 overflow-hidden relative select-none"
    >
      {/* Ambient background glow */}
      <div className="absolute w-[600px] h-[450px] bg-[#FF6B2C]/[0.05] rounded-full blur-[140px] pointer-events-none" />

      {/* Hidden HTML5 Video element used as texture source - ALWAYS mounted so videoRef is immediately available */}
      <video
        ref={videoRef}
        src={videoSrc || undefined}
        playsInline
        muted
        crossOrigin="anonymous"
        className="hidden"
      />

      {/* Empty Timeline Stage Overlay when video clip has been deleted */}
      {clips !== undefined && clips.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 p-4 animate-in fade-in duration-200">
          <div className="flex flex-col items-center gap-2.5 px-6 py-5 rounded-2xl bg-white/90 dark:bg-[#090D16]/85 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-glass-lg max-w-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-[#FF6B2C]/10 border border-[#FF6B2C]/20 flex items-center justify-center text-[#FF6B2C]">
              <Film className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">Timeline is Empty</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                The video clip was deleted from the timeline. Record screen or import video to continue editing.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Right-Click Moving Banner Overlay */}
      {isRightClickDragging && (
        <div className="absolute top-6 z-30 flex items-center gap-2 px-4 py-2 rounded-xl glass-panel-elevated border-[#FF6B2C]/60 bg-[#17191F]/95 text-white font-bold text-xs shadow-glass-md animate-pulse">
          <Crosshair className="w-4 h-4 text-[#FF8A4C] animate-spin" />
          <span>Moving Focus Point: ({Math.round((hoverCoords?.x ?? 0.5) * 100)}%, {Math.round((hoverCoords?.y ?? 0.5) * 100)}%) · Release to save</span>
        </div>
      )}

      {/* Mode Banner Overlay */}
      {isAddMode && !isRightClickDragging && (
        <div className="absolute top-6 z-30 flex items-center gap-2 px-4 py-2 rounded-xl glass-panel-elevated border-[#FF6B2C]/40 text-white font-bold text-xs shadow-glass-md animate-pulse">
          <Crosshair className="w-4 h-4 text-[#FF6B2C]" />
          <span>3D Focal Target Mode: Click on any element on the 3D screen to set a camera dolly target!</span>
        </div>
      )}

      {/* Just Added Confirmation Toast */}
      {justAddedToast && (
        <div className="absolute top-16 z-30 flex items-center gap-2 px-3.5 py-1.5 rounded-xl glass-panel-elevated border-[#FF6B2C]/50 text-white font-semibold text-xs shadow-glass-md animate-in fade-in zoom-in duration-200">
          <Check className="w-4 h-4 text-[#FF6B2C]" />
          <span>3D Target set at ({Math.round(justAddedToast.x * 100)}%, {Math.round(justAddedToast.y * 100)}%)!</span>
        </div>
      )}

      {/* Canvas Wrapper - Centered Bounding Box */}
      <div
        onContextMenu={(e) => e.preventDefault()}
        className={`relative flex items-center justify-center max-h-full max-w-full rounded-2xl overflow-hidden shadow-glass-lg border border-slate-300 dark:border-white/[0.12] group ${
          config.backgroundType === "transparent"
            ? "bg-slate-200 dark:bg-[#090D16] [background-image:linear-gradient(45deg,rgba(0,0,0,0.05)_25%,transparent_25%),linear-gradient(-45deg,rgba(0,0,0,0.05)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,rgba(0,0,0,0.05)_75%),linear-gradient(-45deg,transparent_75%,rgba(0,0,0,0.05)_75%)] [background-size:20px_20px] [background-position:0_0,0_10px,10px_-10px,-10px_0px]"
            : "bg-transparent"
        }`}
        style={{
          aspectRatio: aspectCss,
        }}
      >
        <canvas
          ref={canvasRef}
          width={defaultWidth}
          height={defaultHeight}
          onClick={handleCanvasClick}
          onDoubleClick={(e) => {
            e.stopPropagation();
            if (!isAddMode && onToggleFullscreen) {
              onToggleFullscreen();
            }
          }}
          onMouseDown={handleCanvasMouseDown}
          onMouseUp={handleCanvasMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onContextMenu={(e) => e.preventDefault()}
          className={`block max-h-full max-w-full object-contain ${
            isRightClickDragging ? "cursor-move" : isAddMode ? "cursor-crosshair" : "cursor-pointer"
          }`}
          style={{
            aspectRatio: aspectCss,
          }}
        />

        {/* Floating Fullscreen Button on Hover */}
        {onToggleFullscreen && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFullscreen();
            }}
            title={isFullscreen ? "Exit Fullscreen (Esc / F)" : "Fullscreen (F)"}
            className="absolute top-4 right-4 z-30 p-2 rounded-xl glass-panel text-slate-300 hover:text-white shadow-glass-md backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        )}

        {/* Center Hover Play/Pause Overlay indicator when not in Add mode */}
        {!isAddMode && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-14 h-14 rounded-2xl glass-panel-elevated text-white flex items-center justify-center shadow-glass-lg scale-95 group-hover:scale-100 transition-transform backdrop-blur-xl">
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-0.5 fill-white" />
              )}
            </div>
          </div>
        )}

        {/* Live 3D Camera Zoom Indicator HUD Badge */}
        <div className="absolute bottom-4 left-4 z-20 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-xl glass-panel text-xs shadow-glass-md backdrop-blur-xl">
          <Cuboid className={`w-3.5 h-3.5 ${cameraState.isZoomed ? "text-[#FF6B2C] animate-pulse" : "text-slate-400"}`} />
          <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider hidden sm:inline">
            3D Studio
          </span>
          <span className="font-mono text-white font-bold">
            {cameraState.scale.toFixed(2)}x Dolly
          </span>
          {cameraState.isZoomed && (
            <span className="text-[10px] text-[#FF8A4C] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FF6B2C]/20 border border-[#FF6B2C]/30 shadow-glass-sm">
              Focus Active
            </span>
          )}
        </div>

        {/* Coordinate Crosshair Tracker during Add Mode */}
        {isAddMode && hoverCoords && (
          <div
            className="absolute pointer-events-none z-20 px-2.5 py-1 rounded-lg glass-panel text-[#FF8A4C] font-mono text-[10px] border-[#FF6B2C]/40 shadow-glass-sm -translate-x-1/2 -translate-y-8"
            style={{
              left: `${hoverCoords.x * 100}%`,
              top: `${hoverCoords.y * 100}%`,
            }}
          >
            {Math.round(hoverCoords.x * 100)}%, {Math.round(hoverCoords.y * 100)}%
          </div>
        )}

        {/* Floating Draggable Webcam PiP Overlay */}
        {Boolean(effectiveWebcamUrl || webcamStream) && !isWebcamHidden && (
          (() => {
            const wConfig = config.webcamConfig || {
              enabled: true,
              shape: "circle",
              position: "bottom-right",
              customX: 0.85,
              customY: 0.82,
              size: 180,
              borderColor: "#FF6B2C",
              borderWidth: 3,
              shadow: true,
              mirror: true,
            };

            const shapeClasses =
              wConfig.shape === "circle"
                ? "rounded-full"
                : wConfig.shape === "rounded-rect"
                ? "rounded-2xl"
                : "rounded-none";

            const posX = wConfig.customX ?? 0.85;
            const posY = wConfig.customY ?? 0.82;

            const handleWebcamMouseDown = (e: React.MouseEvent) => {
              if (e.button !== 0) return;
              e.stopPropagation();
              setIsDraggingWebcam(true);
              webcamDragStartRef.current = {
                startX: e.clientX,
                startY: e.clientY,
                initCustomX: posX,
                initCustomY: posY,
              };

              const handleMouseMoveGlobal = (me: MouseEvent) => {
                const canvasEl = canvasRef.current;
                if (!canvasEl) return;
                const rect = canvasEl.getBoundingClientRect();
                const deltaX = (me.clientX - webcamDragStartRef.current.startX) / (rect.width || 1);
                const deltaY = (me.clientY - webcamDragStartRef.current.startY) / (rect.height || 1);

                const newX = Math.max(0.05, Math.min(0.95, webcamDragStartRef.current.initCustomX + deltaX));
                const newY = Math.max(0.05, Math.min(0.95, webcamDragStartRef.current.initCustomY + deltaY));

                if (onChangeConfig) {
                  onChangeConfig({
                    webcamConfig: {
                      ...wConfig,
                      position: "custom",
                      customX: newX,
                      customY: newY,
                    },
                  });
                }
              };

              const handleMouseUpGlobal = () => {
                setIsDraggingWebcam(false);
                window.removeEventListener("mousemove", handleMouseMoveGlobal);
                window.removeEventListener("mouseup", handleMouseUpGlobal);
              };

              window.addEventListener("mousemove", handleMouseMoveGlobal);
              window.addEventListener("mouseup", handleMouseUpGlobal);
            };

            return (
              <div
                onMouseDown={handleWebcamMouseDown}
                title="Drag to reposition webcam bubble"
                className={`absolute z-30 cursor-move group/pip transition-shadow ${
                  isDraggingWebcam ? "ring-2 ring-[#FF6B2C] scale-105" : "hover:scale-[1.02]"
                }`}
                style={{
                  left: `${posX * 100}%`,
                  top: `${posY * 100}%`,
                  transform: "translate(-50%, -50%)",
                  width: `${wConfig.size}px`,
                  height: `${wConfig.size}px`,
                }}
              >
                <div
                  className={`w-full h-full overflow-hidden relative ${shapeClasses} ${
                    wConfig.shadow ? "shadow-[0_10px_35px_rgba(0,0,0,0.6)]" : ""
                  }`}
                  style={{
                    border: `${wConfig.borderWidth}px solid ${wConfig.borderColor || "#FF6B2C"}`,
                  }}
                >
                  <video
                    ref={setWebcamVideoEl}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover pointer-events-none select-none ${
                      wConfig.mirror ? "scale-x-[-1]" : ""
                    } ${webcamStream || effectiveWebcamUrl ? "opacity-100" : "opacity-0"}`}
                  />
                  {!(webcamStream || effectiveWebcamUrl) && (
                    <div className="absolute inset-0 bg-white/90 dark:bg-[#090D16]/90 flex flex-col items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400 p-2 text-center pointer-events-none">
                      <Camera className="w-6 h-6 text-[#FF6B2C] animate-pulse" />
                      <span className="text-[9px] font-mono text-slate-700 dark:text-slate-300">Camera Active</span>
                    </div>
                  )}
                  {/* Subtle hover badge */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/pip:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-semibold text-white bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
                      Drag PiP
                    </span>
                  </div>
                </div>
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
}

export const VideoCanvas = memo(VideoCanvasBase);
