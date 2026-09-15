"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  Camera,
  Mic,
  MicOff,
  RefreshCw,
  Check,
  X,
  FlipHorizontal,
  Circle,
  Square,
  Video,
  VideoOff,
  Layers,
  Play,
} from "lucide-react";
import { CanvasConfig, WebcamShape, WebcamPosition } from "@/types/editor";
import { Button } from "@/components/ui/Button";

export interface WebcamReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: CanvasConfig;
  onChangeConfig: (newConfig: Partial<CanvasConfig>) => void;
  liveWebcamStream: MediaStream | null;
  availableCameras: { deviceId: string; label: string }[];
  onStartWebcamPreview: (deviceId?: string | null) => Promise<MediaStream | null>;
  onStopWebcamPreview: () => void;
  onRefreshCameras: () => Promise<{ deviceId: string; label: string }[]>;
  enableWebcam?: boolean;
  onSetEnableWebcam: (enabled: boolean) => void;
  onStartRecording: () => Promise<boolean>;
  isRecording?: boolean;
}

const BORDER_COLORS = [
  { name: "Rose", hex: "#fb7185", class: "bg-rose-400" },
  { name: "Emerald", hex: "#10b981", class: "bg-emerald-500" },
  { name: "Sky", hex: "#38bdf8", class: "bg-sky-400" },
  { name: "Amber", hex: "#f59e0b", class: "bg-amber-500" },
  { name: "Violet", hex: "#a855f7", class: "bg-purple-500" },
  { name: "White", hex: "#ffffff", class: "bg-white" },
];

export function WebcamReviewModal({
  isOpen,
  onClose,
  config,
  onChangeConfig,
  liveWebcamStream,
  availableCameras,
  onStartWebcamPreview,
  onStopWebcamPreview,
  onRefreshCameras,
  onSetEnableWebcam,
  onStartRecording,
  isRecording = false,
}: WebcamReviewModalProps) {
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [micVolume, setMicVolume] = useState<number>(0);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const wConfig = useMemo(
    () =>
      config.webcamConfig || {
        enabled: true,
        shape: "circle" as const,
        position: "bottom-right" as const,
        customX: 0.85,
        customY: 0.82,
        size: 180,
        borderColor: "#fb7185",
        borderWidth: 3,
        shadow: true,
        mirror: true,
      },
    [config.webcamConfig]
  );

  // Helper to update webcam config seamlessly
  const updateWebcam = useCallback(
    (updates: Partial<typeof wConfig>) => {
      onChangeConfig({
        webcamConfig: {
          ...wConfig,
          ...updates,
          enabled: true,
        },
      });
    },
    [onChangeConfig, wConfig]
  );

  // Auto start webcam stream when modal opens
  useEffect(() => {
    if (isOpen) {
      if (!liveWebcamStream) {
        onStartWebcamPreview(wConfig.deviceId || null).then(() => {
          onSetEnableWebcam(true);
        });
      } else {
        onSetEnableWebcam(true);
      }
    }
  }, [isOpen, liveWebcamStream, onStartWebcamPreview, onSetEnableWebcam, wConfig.deviceId]);

  // Attach live video stream to preview video element
  useEffect(() => {
    if (!isOpen) return;
    const vid = previewVideoRef.current;
    if (vid && liveWebcamStream) {
      vid.srcObject = liveWebcamStream;
      vid.play().catch(() => {});
    }
  }, [isOpen, liveWebcamStream]);

  // Audio level analyzer for microphone test meter
  useEffect(() => {
    if (!isOpen) {
      // Clean up audio
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((t) => t.stop());
        audioStreamRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      return;
    }

    let isMounted = true;
    async function initMic() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) return;
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        audioStreamRef.current = stream;
        setHasMicPermission(true);

        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.6;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const checkVolume = () => {
          if (!isMounted) return;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          const normalized = Math.min(100, Math.round((avg / 128) * 100));
          setMicVolume(normalized);
          animFrameRef.current = requestAnimationFrame(checkVolume);
        };
        checkVolume();
      } catch {
        if (isMounted) setHasMicPermission(false);
      }
    }

    initMic();

    return () => {
      isMounted = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((t) => t.stop());
        audioStreamRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const shapeClasses =
    wConfig.shape === "circle"
      ? "rounded-full aspect-square"
      : wConfig.shape === "rounded-rect"
      ? "rounded-3xl aspect-square"
      : "rounded-xl aspect-square";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-3xl rounded-2xl glass-panel-elevated p-5 sm:p-6 relative overflow-hidden space-y-5 border-white/[0.15] shadow-glass-lg max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-300 shadow-glass-sm">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm text-white tracking-wide">
                  Webcam Review & Setup
                </h2>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[10px] font-mono text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Preview
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Check your framing, camera device, and styling before starting recording
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
            title="Close Review"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Modal Body - Split into Live Monitor and Configuration Panel */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 flex-1 min-h-0 overflow-y-auto pr-1">
          {/* Left Column: Interactive Live Preview Monitor */}
          <div className="md:col-span-6 flex flex-col items-center justify-center bg-black/40 rounded-2xl border border-white/[0.08] p-4 relative min-h-[260px] overflow-hidden group">
            {/* Ambient Backing Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/10 via-transparent to-purple-500/10 pointer-events-none" />

            {/* Live Camera Bubble Feed */}
            <div
              className={`relative overflow-hidden transition-all duration-300 flex items-center justify-center ${shapeClasses} ${
                wConfig.shadow ? "shadow-[0_15px_40px_rgba(0,0,0,0.8)]" : ""
              }`}
              style={{
                width: `${Math.min(220, Math.max(140, wConfig.size))}px`,
                height: `${Math.min(220, Math.max(140, wConfig.size))}px`,
                border: `${wConfig.borderWidth}px solid ${wConfig.borderColor || "#fb7185"}`,
              }}
            >
              {liveWebcamStream ? (
                <video
                  ref={previewVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover select-none ${
                    wConfig.mirror ? "scale-x-[-1]" : ""
                  }`}
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 p-4 text-center bg-slate-900/80 text-slate-400 text-xs">
                  <VideoOff className="w-6 h-6 text-slate-500 animate-pulse" />
                  <span>Activating camera...</span>
                </div>
              )}

              {/* Mirror mode quick badge */}
              <button
                type="button"
                onClick={() => updateWebcam({ mirror: !wConfig.mirror })}
                className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-white text-[10px] border border-white/20 backdrop-blur-md flex items-center gap-1 transition-all"
                title="Toggle Mirror Flip"
              >
                <FlipHorizontal className="w-3 h-3 text-rose-300" />
                <span className="text-[9px] font-mono font-medium hidden sm:inline">
                  {wConfig.mirror ? "Mirrored" : "Normal"}
                </span>
              </button>
            </div>

            {/* Status info under preview */}
            <div className="mt-4 flex items-center gap-3 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Video className="w-3.5 h-3.5 text-rose-400" />
                <span>720p HD</span>
              </span>
              <span>•</span>
              <span className="capitalize">{wConfig.shape}</span>
              <span>•</span>
              <span>{wConfig.size}px</span>
            </div>

            {/* Live Microphone Audio Level Meter */}
            <div className="w-full mt-3 pt-3 border-t border-white/[0.08] flex items-center gap-2.5 px-2">
              <div className="flex items-center gap-1 text-[11px] text-slate-400 flex-shrink-0">
                {hasMicPermission === false ? (
                  <MicOff className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <Mic className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span className="text-[10px] font-mono">Mic:</span>
              </div>

              {/* Volume Bars Meter */}
              <div className="flex-1 h-3 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/10 flex items-center gap-0.5">
                {[...Array(16)].map((_, i) => {
                  const threshold = (i / 16) * 100;
                  const isActive = micVolume > threshold;
                  const isHigh = i > 12;
                  return (
                    <div
                      key={i}
                      className={`flex-1 h-full rounded-sm transition-all duration-75 ${
                        isActive
                          ? isHigh
                            ? "bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.8)]"
                            : "bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.8)]"
                          : "bg-white/[0.05]"
                      }`}
                    />
                  );
                })}
              </div>

              <span className="text-[10px] font-mono text-slate-400 w-8 text-right">
                {micVolume}%
              </span>
            </div>
          </div>

          {/* Right Column: Camera Settings & Styling Controls */}
          <div className="md:col-span-6 space-y-3.5 text-xs">
            {/* 1. Camera Device Selector */}
            <div className="glass-panel p-3 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-white flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-rose-400" />
                  Camera Device
                </label>
                <button
                  type="button"
                  onClick={async () => {
                    setIsRefreshing(true);
                    await onRefreshCameras();
                    setTimeout(() => setIsRefreshing(false), 500);
                  }}
                  className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                  title="Rescan video devices"
                >
                  <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>

              <select
                value={wConfig.deviceId || availableCameras[0]?.deviceId || ""}
                onChange={(e) => {
                  const newDevId = e.target.value;
                  updateWebcam({ deviceId: newDevId });
                  onStartWebcamPreview(newDevId);
                }}
                className="w-full bg-[#090D16] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-rose-400 transition-colors"
              >
                {availableCameras.length > 0 ? (
                  availableCameras.map((cam) => (
                    <option key={cam.deviceId} value={cam.deviceId}>
                      {cam.label}
                    </option>
                  ))
                ) : (
                  <option value="">Default Web Camera</option>
                )}
              </select>
            </div>

            {/* 2. Shape Preset */}
            <div className="glass-panel p-3 rounded-xl space-y-1.5">
              <label className="text-[11px] font-semibold text-white block">Bubble Shape</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "circle" as WebcamShape, label: "Circle", icon: Circle },
                  { id: "rounded-rect" as WebcamShape, label: "Rounded", icon: Layers },
                  { id: "square" as WebcamShape, label: "Square", icon: Square },
                ].map((sh) => {
                  const isCurrent = (wConfig.shape || "circle") === sh.id;
                  const Icon = sh.icon;
                  return (
                    <button
                      key={sh.id}
                      type="button"
                      onClick={() => updateWebcam({ shape: sh.id })}
                      className={`p-2 rounded-lg text-center border flex items-center justify-center gap-1.5 transition-all ${
                        isCurrent
                          ? "bg-rose-500/25 text-rose-200 border-rose-400/50 shadow-glass-sm font-semibold"
                          : "bg-white/[0.03] text-slate-300 border-white/10 hover:bg-white/[0.06]"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-rose-300" />
                      <span className="text-[11px]">{sh.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Corner Preset Placement */}
            <div className="glass-panel p-3 rounded-xl space-y-1.5">
              <label className="text-[11px] font-semibold text-white block">Corner Placement</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "bottom-right" as WebcamPosition, label: "Bottom Right", x: 0.85, y: 0.82 },
                  { id: "bottom-left" as WebcamPosition, label: "Bottom Left", x: 0.15, y: 0.82 },
                  { id: "top-right" as WebcamPosition, label: "Top Right", x: 0.85, y: 0.18 },
                  { id: "top-left" as WebcamPosition, label: "Top Left", x: 0.15, y: 0.18 },
                ].map((pos) => {
                  const isCurrent = (wConfig.position || "bottom-right") === pos.id;
                  return (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() =>
                        updateWebcam({
                          position: pos.id,
                          customX: pos.x,
                          customY: pos.y,
                        })
                      }
                      className={`p-1.5 rounded-lg text-left px-2.5 border transition-all ${
                        isCurrent
                          ? "bg-rose-500/25 text-rose-200 border-rose-400/50 shadow-glass-sm font-semibold"
                          : "bg-white/[0.03] text-slate-300 border-white/10 hover:bg-white/[0.06]"
                      }`}
                    >
                      <span className="text-[11px]">{pos.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Size & Border Customization */}
            <div className="glass-panel p-3 rounded-xl space-y-2.5">
              {/* Size Slider */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-300">Bubble Size</span>
                  <span className="font-mono text-rose-400 font-bold">{wConfig.size}px</span>
                </div>
                <input
                  type="range"
                  min="120"
                  max="320"
                  step="10"
                  value={wConfig.size}
                  onChange={(e) => updateWebcam({ size: parseInt(e.target.value) })}
                  className="w-full accent-rose-500 cursor-pointer h-1 bg-white/10 rounded"
                />
              </div>

              {/* Border Color Swatches */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-300">Border Accent</span>
                  <span className="font-mono text-slate-400 text-[10px]">
                    {wConfig.borderWidth}px
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {BORDER_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => updateWebcam({ borderColor: c.hex })}
                      className={`w-6 h-6 rounded-full ${c.class} transition-transform flex items-center justify-center ${
                        wConfig.borderColor === c.hex
                          ? "ring-2 ring-white scale-110 shadow-md"
                          : "opacity-75 hover:opacity-100"
                      }`}
                      title={c.name}
                    >
                      {wConfig.borderColor === c.hex && (
                        <Check className={`w-3.5 h-3.5 ${c.hex === "#ffffff" ? "text-black" : "text-white"}`} />
                      )}
                    </button>
                  ))}
                  <div className="flex-1 ml-2">
                    <input
                      type="range"
                      min="0"
                      max="8"
                      value={wConfig.borderWidth}
                      onChange={(e) => updateWebcam({ borderWidth: parseInt(e.target.value) })}
                      className="w-full accent-rose-500 cursor-pointer h-1 bg-white/10 rounded"
                      title="Border thickness"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="border-t border-white/[0.08] pt-3.5 flex flex-col sm:flex-row items-center justify-between gap-2.5 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onStopWebcamPreview();
              onSetEnableWebcam(false);
              onClose();
            }}
            className="text-slate-400 hover:text-rose-300 text-xs w-full sm:w-auto"
            leftIcon={<VideoOff className="w-3.5 h-3.5" />}
          >
            Turn Off Camera
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                onSetEnableWebcam(true);
                onClose();
              }}
              className="text-xs"
              leftIcon={<Check className="w-3.5 h-3.5 text-emerald-400" />}
            >
              Keep Camera Ready
            </Button>

            {!isRecording && (
              <Button
                variant="primary"
                size="sm"
                onClick={async () => {
                  onSetEnableWebcam(true);
                  onClose();
                  await onStartRecording();
                }}
                className="text-xs font-bold shadow-md shadow-rose-600/30"
                leftIcon={<Play className="w-3.5 h-3.5 fill-white" />}
              >
                Start Recording Screen
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
