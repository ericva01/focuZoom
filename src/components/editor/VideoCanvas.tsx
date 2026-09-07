"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Crosshair,
  Check,
  Cuboid,
} from "lucide-react";
import { ClickEvent, CanvasConfig, AspectRatio } from "@/types/editor";
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
}

export function VideoCanvas({
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
}: VideoCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoverCoords, setHoverCoords] = useState<{ x: number; y: number } | null>(null);
  const [justAddedToast, setJustAddedToast] = useState<{ x: number; y: number } | null>(null);

  // Mouse normalized coordinates for 3D perspective parallax tracking (-1.0 to 1.0)
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Initialize Three.js 3D WebGL animation engine
  const { cameraState, getVideoCoordinatesAtCanvasPos } = useThreeAnimationEngine(
    videoRef,
    canvasRef,
    events,
    config,
    mousePosRef
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

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    // 1. Update 3D parallax coordinates for Three.js
    const mx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const my = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    mousePosRef.current = { x: clamp(mx, -1, 1), y: clamp(my, -1, 1) };

    // 2. Add-mode coordinate crosshair HUD mapped to video stream coordinates
    if (isAddMode) {
      const videoCoords = getVideoCoordinatesAtCanvasPos(e.clientX, e.clientY);
      setHoverCoords(
        videoCoords || {
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        }
      );
    } else if (hoverCoords) {
      setHoverCoords(null);
    }
  };

  const handleMouseLeave = () => {
    mousePosRef.current = { x: 0, y: 0 };
    setHoverCoords(null);
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
      <div className="absolute w-[600px] h-[450px] bg-sky-500/[0.05] rounded-full blur-[140px] pointer-events-none" />

      {/* Hidden HTML5 Video element used as texture source */}
      {videoSrc && (
        <video
          ref={videoRef}
          src={videoSrc}
          playsInline
          muted
          crossOrigin="anonymous"
          className="hidden"
        />
      )}

      {/* Mode Banner Overlay */}
      {isAddMode && (
        <div className="absolute top-6 z-30 flex items-center gap-2 px-4 py-2 rounded-xl glass-panel-elevated border-sky-400/40 text-white font-bold text-xs shadow-glass-md animate-pulse">
          <Crosshair className="w-4 h-4 text-sky-400" />
          <span>3D Focal Target Mode: Click on any element on the 3D screen to set a camera dolly target!</span>
        </div>
      )}

      {/* Just Added Confirmation Toast */}
      {justAddedToast && (
        <div className="absolute top-16 z-30 flex items-center gap-2 px-3.5 py-1.5 rounded-xl glass-panel-elevated border-sky-400/50 text-white font-semibold text-xs shadow-glass-md animate-in fade-in zoom-in duration-200">
          <Check className="w-4 h-4 text-sky-400" />
          <span>3D Target logged at ({Math.round(justAddedToast.x * 100)}%, {Math.round(justAddedToast.y * 100)}%)!</span>
        </div>
      )}

      {/* Canvas Wrapper - Centered Bounding Box */}
      <div
        className={`relative flex items-center justify-center max-h-full max-w-full rounded-2xl overflow-hidden shadow-glass-lg border border-white/[0.12] group ${
          config.backgroundType === "transparent"
            ? "bg-[#090D16] [background-image:linear-gradient(45deg,rgba(255,255,255,0.03)_25%,transparent_25%),linear-gradient(-45deg,rgba(255,255,255,0.03)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,rgba(255,255,255,0.03)_75%),linear-gradient(-45deg,transparent_75%,rgba(255,255,255,0.03)_75%)] [background-size:20px_20px] [background-position:0_0,0_10px,10px_-10px,-10px_0px]"
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
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={`block max-h-full max-w-full object-contain ${
            isAddMode ? "cursor-crosshair" : "cursor-pointer"
          }`}
          style={{
            aspectRatio: aspectCss,
          }}
        />

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
          <Cuboid className={`w-3.5 h-3.5 ${cameraState.isZoomed ? "text-sky-400 animate-pulse" : "text-slate-400"}`} />
          <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider hidden sm:inline">
            3D Studio
          </span>
          <span className="font-mono text-white font-bold">
            {cameraState.scale.toFixed(2)}x Dolly
          </span>
          {cameraState.isZoomed && (
            <span className="text-[10px] text-sky-200 font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-500/20 border border-sky-400/30 shadow-glass-sm">
              Focus Active
            </span>
          )}
        </div>

        {/* Coordinate Crosshair Tracker during Add Mode */}
        {isAddMode && hoverCoords && (
          <div
            className="absolute pointer-events-none z-20 px-2.5 py-1 rounded-lg glass-panel text-sky-300 font-mono text-[10px] border-sky-400/40 shadow-glass-sm -translate-x-1/2 -translate-y-8"
            style={{
              left: `${hoverCoords.x * 100}%`,
              top: `${hoverCoords.y * 100}%`,
            }}
          >
            {Math.round(hoverCoords.x * 100)}%, {Math.round(hoverCoords.y * 100)}%
          </div>
        )}
      </div>
    </div>
  );
}
