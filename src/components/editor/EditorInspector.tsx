"use client";

import { useState, useRef, memo } from "react";
import {
  Scissors,
  Focus,
  Upload,
  MousePointer,
  Palette,
  Check,
  Image as ImageIcon,
  Trash2,
  Combine,
  Plus,
  Film,
  Clock,
  Timer,
  EyeOff,
  Camera,
  Ungroup,
} from "lucide-react";
import {
  CanvasConfig,
  ClickEvent,
  TimelineClip,
  VideoMetadata,
  FramePreset,
  CursorStyle,
  ScreenAnglePreset,
  WebcamShape,
  WebcamPosition,
} from "@/types/editor";
import { Button } from "@/components/ui/Button";
import { formatSMPTETimecode } from "./MultiTrackTimeline";

interface EditorInspectorProps {
  config: CanvasConfig;
  onChangeConfig: (updates: Partial<CanvasConfig>) => void;
  clips: TimelineClip[];
  selectedClipId: string | null;
  onSelectClip: (id: string | null) => void;
  onSplitClip: (clipId: string, time: number) => void;
  onTrimClip: (clipId: string, start: number, end: number) => void;
  onDeleteClip: (clipId: string) => void;
  onRippleDeleteClip: (clipId: string) => void;
  currentTime: number;
  onSeek?: (time: number) => void;
  events: ClickEvent[];
  selectedEventId?: string | null;
  onSelectEvent: (event: ClickEvent) => void;
  onUpdateEvent: (id: string, updates: Partial<ClickEvent>) => void;
  onDeleteEvent: (id: string) => void;
  onUngroupEvent?: (id: string) => void;
  onAddCurrentTimeEvent: () => void;
  metadata: VideoMetadata | null;
  onFileUpload: (file: File) => void;
  onLoadDemo: () => void;
  isGeneratingDemo: boolean;
  isRecording: boolean;
  recordingDuration: number;
  clickCount: number;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  availableCameras?: { deviceId: string; label: string }[];
  enableWebcam?: boolean;
  onToggleWebcam?: () => void;
  onOpenWebcamReview?: () => void;
  selectedCameraId?: string | null;
  onSelectCameraId?: (id: string) => void;
  onUploadWebcamFile?: (file: File) => void;
}

type InspectorTab = "clip" | "canvas" | "keyframes" | "media" | "cursor" | "webcam";

function EditorInspectorBase({
  config,
  onChangeConfig,
  clips,
  selectedClipId,
  onSelectClip,
  onSplitClip,
  onTrimClip,
  onDeleteClip,
  onRippleDeleteClip,
  currentTime,
  onSeek,
  events,
  selectedEventId,
  onSelectEvent,
  onUpdateEvent,
  onDeleteEvent,
  onUngroupEvent,
  onAddCurrentTimeEvent,
  metadata,
  onFileUpload,
  onLoadDemo,
  isGeneratingDemo,
  isRecording,
  recordingDuration,
  clickCount,
  onStartRecording,
  onStopRecording,
  availableCameras = [],
  enableWebcam = false,
  onToggleWebcam,
  onOpenWebcamReview,
  selectedCameraId,
  onSelectCameraId,
  onUploadWebcamFile,
}: EditorInspectorProps) {
  const [activeTab, setActiveTab] = useState<InspectorTab>("canvas");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const customBgInputRef = useRef<HTMLInputElement | null>(null);
  const webcamFileInputRef = useRef<HTMLInputElement | null>(null);

  const activeClip =
    clips.find((c) => c.id === selectedClipId) ||
    clips.find((c) => currentTime >= c.startTimeline && currentTime <= c.endTimeline) ||
    clips[0] ||
    null;

  const selectedEvent = events.find((e) => e.id === selectedEventId) || null;

  // Handle custom image upload
  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    onChangeConfig({
      backgroundType: "image",
      customBackgroundImage: url,
    });
  };

  const presetGradients: { id: FramePreset; name: string; class: string }[] = [
    { id: "mesh-purple", name: "Cyber Purple", class: "from-indigo-600 via-purple-600 to-pink-500" },
    { id: "cosmic-blue", name: "Deep Navy", class: "from-blue-600 via-cyan-600 to-indigo-900" },
    { id: "obsidian-dark", name: "Obsidian", class: "from-slate-900 via-slate-800 to-zinc-950" },
    { id: "emerald-matrix", name: "Forest Matrix", class: "from-emerald-700 via-teal-800 to-slate-900" },
    { id: "midnight-titanium", name: "Titanium", class: "from-zinc-800 via-stone-900 to-black" },
    { id: "aurora-glow", name: "Aurora Cyan", class: "from-teal-500 via-cyan-600 to-indigo-800" },
    { id: "hyper-neon", name: "Hyper Neon", class: "from-fuchsia-600 via-pink-600 to-cyan-500" },
    { id: "sunset", name: "Sunset Gold", class: "from-amber-600 via-orange-600 to-orange-700" },
    { id: "solar-flare", name: "Solar Flare", class: "from-red-600 via-amber-600 to-orange-500" },
    { id: "pastel-dream", name: "Pastel Dream", class: "from-indigo-900 via-purple-900 to-pink-900" },
  ];

  const solidColors = [
    { label: "Classic Dark Green", hex: "#06402B" },
    { label: "Deep Forest", hex: "#042C1D" },
    { label: "Dark Emerald", hex: "#084D35" },
    { label: "Rich Slate", hex: "#0F172A" },
    { label: "Charcoal Black", hex: "#090D16" },
    { label: "Neutral Studio", hex: "#1E293B" },
  ];

  return (
    <div className="h-full flex flex-col bg-white/95 dark:bg-[#090D16]/90 backdrop-blur-xl border-l border-slate-200 dark:border-white/[0.08] select-none overflow-hidden text-slate-800 dark:text-slate-100">
      {/* 1. Inspector Tab Dock */}
      <div className="p-2 border-b border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] flex items-center gap-1">
        <button
          type="button"
          onClick={() => setActiveTab("clip")}
          className={`flex-1 py-1.5 px-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
            activeTab === "clip"
              ? "bg-[#FF6B2C]/15 text-[#FF6B2C] dark:text-[#FF8A4C] border border-[#FF6B2C]/40 shadow-glass-sm font-semibold"
              : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.04]"
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clip</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("canvas")}
          className={`flex-1 py-1.5 px-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
            activeTab === "canvas"
              ? "bg-[#FF6B2C]/15 text-[#FF6B2C] dark:text-[#FF8A4C] border border-[#FF6B2C]/40 shadow-glass-sm font-semibold"
              : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.04]"
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">3D</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("keyframes")}
          className={`flex-1 py-1.5 px-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
            activeTab === "keyframes"
              ? "bg-[#FF6B2C]/15 text-[#FF6B2C] dark:text-[#FF8A4C] border border-[#FF6B2C]/40 shadow-glass-sm font-semibold"
              : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.04]"
          }`}
        >
          <Focus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Zoom</span>
          {events.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#FF6B2C]/20 text-[#FF6B2C] dark:text-[#FF8A4C] text-[10px] font-mono flex items-center justify-center">
              {events.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("webcam")}
          className={`flex-1 py-1.5 px-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
            activeTab === "webcam"
              ? "bg-[#FF6B2C]/15 text-[#FF6B2C] dark:text-[#FF8A4C] border border-[#FF6B2C]/40 shadow-glass-sm font-semibold"
              : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.04]"
          }`}
          title="Webcam Facecam PiP settings"
        >
          <Camera className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Face</span>
          {enableWebcam && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("cursor")}
          className={`flex-1 py-1.5 px-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
            activeTab === "cursor"
              ? "bg-[#FF6B2C]/15 text-[#FF6B2C] dark:text-[#FF8A4C] border border-[#FF6B2C]/40 shadow-glass-sm font-semibold"
              : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.04]"
          }`}
        >
          <MousePointer className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Cursor</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("media")}
          className={`flex-1 py-1.5 px-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
            activeTab === "media"
              ? "bg-[#FF6B2C]/15 text-[#FF6B2C] dark:text-[#FF8A4C] border border-[#FF6B2C]/40 shadow-glass-sm font-semibold"
              : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.04]"
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Media</span>
        </button>
      </div>

      {/* 2. Scrollable Panel Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ============================================================ */}
        {/* TAB 1: CLIP & VIDEO EDITING CONTROLS */}
        {/* ============================================================ */}
        {activeTab === "clip" && (
          <div className="space-y-4">
            {clips.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {clips.map((clip, idx) => (
                  <button
                    key={clip.id}
                    type="button"
                    onClick={() => onSelectClip(clip.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                      selectedClipId === clip.id
                        ? "bg-[#FF6B2C]/25 text-[#FF8A4C] border border-[#FF6B2C]/40 font-semibold"
                        : "bg-white/[0.04] text-slate-400 hover:text-white border border-transparent"
                    }`}
                  >
                    Clip #{idx + 1}
                  </button>
                ))}
              </div>
            )}

            {activeClip ? (
              <>
                {/* Active Clip Card */}
                <div className="glass-panel p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800 dark:text-white">Active Clip Properties</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF6B2C]/15 text-[#FF6B2C] dark:text-[#FF8A4C] border border-[#FF6B2C]/30">
                      ID: {activeClip.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Timeline In / Out</span>
                      <span className="font-mono text-slate-800 dark:text-white font-medium">
                        {formatSMPTETimecode(activeClip.startTimeline).substring(3, 8)} - {formatSMPTETimecode(activeClip.endTimeline).substring(3, 8)}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Duration</span>
                      <span className="font-mono text-[#FF6B2C] dark:text-[#FF8A4C] font-semibold">
                        {activeClip.duration.toFixed(2)}s
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Edit Actions */}
                <div className="glass-panel p-4 rounded-xl space-y-3">
                  <span className="text-xs font-semibold text-slate-800 dark:text-white block">Cut & Trim Shortcuts</span>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onSplitClip(activeClip.id, currentTime)}
                      leftIcon={<Scissors className="w-3.5 h-3.5 text-[#FF6B2C]" />}
                      className="w-full justify-start"
                    >
                      Split Here
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDeleteClip(activeClip.id)}
                      leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                      className="w-full justify-start"
                    >
                      Delete Clip
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onTrimClip(activeClip.id, currentTime, activeClip.endTimeline)}
                      className="w-full justify-start text-[11px]"
                    >
                      Trim Start to Playhead
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onTrimClip(activeClip.id, activeClip.startTimeline, currentTime)}
                      className="w-full justify-start text-[11px]"
                    >
                      Trim End to Playhead
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onRippleDeleteClip(activeClip.id)}
                      leftIcon={<Combine className="w-3.5 h-3.5 text-amber-400" />}
                      className="w-full justify-start text-[11px] col-span-2"
                    >
                      Ripple Delete (Close Gap)
                    </Button>
                  </div>
                </div>

                {/* Speed Multiplier */}
                <div className="glass-panel p-4 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-200">Clip Playback Speed</label>
                    <span className="text-xs font-mono text-[#FF6B2C] font-bold">{config.playbackSpeed}x</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[0.5, 1.0, 1.5, 2.0].map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => onChangeConfig({ playbackSpeed: spd })}
                        className={`py-1.5 rounded-lg text-xs font-mono transition-all ${
                          config.playbackSpeed === spd
                            ? "bg-[#FF6B2C]/20 text-[#FF8A4C] font-bold border border-[#FF6B2C]/30 shadow-glass-sm"
                            : "bg-white/[0.04] text-slate-300 hover:text-white border border-transparent"
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs glass-panel rounded-xl">
                No video clip selected. Upload a video or load demo recording.
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: 3D CANVAS & BACKGROUND STYLING */}
        {/* ============================================================ */}
        {activeTab === "canvas" && (
          <div className="space-y-4">
            {/* Screen Resolution & Crisp Quality Selector */}
            <div className="glass-panel p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-semibold text-white block">Screen Render Resolution</label>
                  <p className="text-[10px] text-slate-400 mt-0.5">High-DPI canvas supersampling for razor sharp text</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FF6B2C]/20 text-[#FF8A4C] border border-[#FF6B2C]/30 font-bold">
                  {(config.resolutionPreset || "4k").toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "4k" as const, name: "4K UHD", desc: "3840×2160 Ultra" },
                  { id: "2k" as const, name: "2K QHD", desc: "2560×1440 Crisp" },
                  { id: "1080p" as const, name: "1080p", desc: "1920×1080 Std" },
                ].map((res) => {
                  const isSelected = (config.resolutionPreset || "4k") === res.id;
                  return (
                    <button
                      key={res.id}
                      type="button"
                      onClick={() => onChangeConfig({ resolutionPreset: res.id })}
                      className={`p-2 rounded-xl text-center border transition-all ${
                        isSelected
                          ? "bg-[#FF6B2C]/20 text-[#FF8A4C] border-[#FF6B2C]/40 shadow-glass-sm font-bold"
                          : "bg-white/[0.03] text-slate-300 border-white/10 hover:bg-white/[0.06]"
                      }`}
                    >
                      <div className="text-xs font-semibold">{res.name}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">{res.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3D Perspective Preset */}
            <div className="glass-panel p-4 rounded-xl space-y-3">
              <label className="text-xs font-semibold text-white block">3D Stage Orientation</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "simple-smooth" as ScreenAnglePreset, name: "Simple Smooth", desc: "Smooth Zoom In & Out (Zero Tilt)" },
                  { id: "studio-front" as ScreenAnglePreset, name: "Front Studio", desc: "Clean & Direct" },
                  { id: "floating-dynamic" as ScreenAnglePreset, name: "Breathing Tilt", desc: "Organic Depth" },
                  { id: "isometric" as ScreenAnglePreset, name: "Isometric 3D", desc: "Diagonal View" },
                  { id: "cinematic-slant" as ScreenAnglePreset, name: "Filmic Slant", desc: "High Specular" },
                ].map((preset, pIdx) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onChangeConfig({ screenAnglePreset: preset.id })}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      pIdx === 0 ? "col-span-2" : ""
                    } ${
                      config.screenAnglePreset === preset.id
                        ? "bg-[#FF6B2C]/20 text-[#FF8A4C] border border-[#FF6B2C]/40 shadow-glass-sm"
                        : "bg-white/[0.03] text-slate-300 border-white/10 hover:bg-white/[0.06]"
                    }`}
                  >
                    <div className="text-xs font-semibold text-white">{preset.name}</div>
                    <div className="text-[10px] text-slate-400">{preset.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* DYNAMIC PADDING / INSET SLIDER (0px to 120px) */}
            <div className="glass-panel p-4 rounded-xl space-y-2.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-white">Stage Inset (Padding)</label>
                <div className="flex items-center gap-1 font-mono text-xs text-[#FF6B2C] font-bold">
                  <span>{config.padding}</span>
                  <span className="text-slate-400">px</span>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="120"
                step="2"
                value={config.padding}
                onChange={(e) => onChangeConfig({ padding: parseInt(e.target.value) })}
                className="w-full accent-sky-400 cursor-pointer h-1 bg-white/10 rounded"
              />

              <div className="grid grid-cols-5 gap-1.5 pt-1">
                {[0, 24, 48, 80, 120].map((pad) => (
                  <button
                    key={pad}
                    type="button"
                    onClick={() => onChangeConfig({ padding: pad })}
                    className={`py-1 rounded-lg text-[10px] font-mono transition-all ${
                      config.padding === pad
                        ? "bg-[#FF6B2C]/20 text-[#FF8A4C] font-bold border border-[#FF6B2C]/30"
                        : "bg-white/[0.04] text-slate-400 hover:text-white"
                    }`}
                  >
                    {pad}px
                  </button>
                ))}
              </div>
            </div>

            {/* CORNER RADIUS (0px to 64px) */}
            <div className="glass-panel p-4 rounded-xl space-y-2.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-white">Corner Curvature</label>
                <div className="flex items-center gap-1 font-mono text-xs text-[#FF6B2C] font-bold">
                  <span>{config.cornerRadius}</span>
                  <span className="text-slate-400">px</span>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="64"
                step="2"
                value={config.cornerRadius}
                onChange={(e) => onChangeConfig({ cornerRadius: parseInt(e.target.value) })}
                className="w-full accent-sky-400 cursor-pointer h-1 bg-white/10 rounded"
              />

              <div className="grid grid-cols-5 gap-1.5 pt-1">
                {[0, 12, 20, 32, 64].map((rad) => (
                  <button
                    key={rad}
                    type="button"
                    onClick={() => onChangeConfig({ cornerRadius: rad })}
                    className={`py-1 rounded-lg text-[10px] font-mono transition-all ${
                      config.cornerRadius === rad
                        ? "bg-[#FF6B2C]/20 text-[#FF8A4C] font-bold border border-[#FF6B2C]/30"
                        : "bg-white/[0.04] text-slate-400 hover:text-white"
                    }`}
                  >
                    {rad}px
                  </button>
                ))}
              </div>
            </div>

            {/* Background Type & Presets */}
            <div className="glass-panel p-4 rounded-xl space-y-3">
              <label className="text-xs font-semibold text-slate-800 dark:text-white block">Background Style</label>
              <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-xs">
                {[
                  { id: "gradient" as const, label: "Gradient" },
                  { id: "solid" as const, label: "Solid" },
                  { id: "transparent" as const, label: "Alpha" },
                  { id: "image" as const, label: "Image" },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => onChangeConfig({ backgroundType: type.id })}
                    className={`py-1 rounded-lg text-xs font-medium transition-all ${
                      config.backgroundType === type.id
                        ? "bg-[#FF6B2C]/20 text-[#FF6B2C] dark:text-[#FF8A4C] font-bold border border-[#FF6B2C]/40 shadow-glass-sm"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              {/* Gradient Presets Palette */}
              {config.backgroundType === "gradient" && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {presetGradients.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => onChangeConfig({ backgroundPreset: g.id })}
                      className={`h-10 rounded-xl bg-gradient-to-r ${g.class} p-2 text-left flex items-end justify-between border transition-all ${
                        config.backgroundPreset === g.id
                          ? "border-white ring-2 ring-[#FF6B2C]/60 shadow-glass-md"
                          : "border-white/15 opacity-80 hover:opacity-100"
                      }`}
                    >
                      <span className="text-[10px] font-semibold text-white drop-shadow">
                        {g.name}
                      </span>
                      {config.backgroundPreset === g.id && (
                        <Check className="w-3.5 h-3.5 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Solid Color Palette */}
              {config.backgroundType === "solid" && (
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {solidColors.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => onChangeConfig({ solidBackgroundColor: c.hex })}
                      className={`h-10 rounded-xl p-2 text-left border flex items-end justify-between transition-all ${
                        config.solidBackgroundColor === c.hex
                          ? "border-white ring-2 ring-[#FF6B2C]/60"
                          : "border-white/15 opacity-80 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      <span className="text-[10px] font-mono text-white drop-shadow">
                        {c.label.split(" ")[1] || c.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Custom Image Upload */}
              {config.backgroundType === "image" && (
                <div className="pt-1">
                  <input
                    ref={customBgInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCustomBgUpload}
                    className="hidden"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => customBgInputRef.current?.click()}
                    leftIcon={<ImageIcon className="w-3.5 h-3.5 text-[#FF6B2C]" />}
                  >
                    Select Background Image
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: ZOOM KEYFRAME INSPECTOR & TIMING CONTROLS */}
        {/* ============================================================ */}
        {activeTab === "keyframes" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Focus className="w-4 h-4 text-[#FF6B2C]" />
                <span className="text-xs font-semibold text-white">Zoom Keyframes</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#FF6B2C]/20 text-[#FF8A4C] border border-[#FF6B2C]/30">
                  {events.length}
                </span>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={onAddCurrentTimeEvent}
                leftIcon={<Plus className="w-3 h-3" />}
              >
                Add at Playhead
              </Button>
            </div>

            {/* Dedicated Selected Zoom Effect Inspector */}
            {selectedEvent && (
              <div className="glass-panel p-4 rounded-xl border border-blue-400/40 bg-blue-950/30 space-y-3.5 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-400/40">
                      Selected Zoom
                    </span>
                    <span className="text-xs font-bold text-white">
                      Zoom {selectedEvent.zoom || 2}X
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {selectedEvent.targets && selectedEvent.targets.length > 1 && onUngroupEvent && (
                      <button
                        type="button"
                        onClick={() => onUngroupEvent(selectedEvent.id)}
                        className="flex items-center gap-1 text-amber-300 hover:text-amber-200 text-xs px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 transition-colors cursor-pointer"
                        title={`Ungroup into ${selectedEvent.targets.length} discrete zoom keyframes`}
                      >
                        <Ungroup className="w-3 h-3" />
                        <span>Ungroup ({selectedEvent.targets.length})</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onDeleteEvent(selectedEvent.id)}
                      className="flex items-center gap-1 text-[#FF6B2C] hover:text-[#FF8A4C] text-xs px-2 py-1 rounded bg-[#FF6B2C]/10 hover:bg-[#FF6B2C]/20 transition-colors cursor-pointer"
                      title="Delete this zoom effect (or press Delete key)"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* Zoom Magnification Scale Pills */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-slate-300 block">Zoom Scale (Only for this effect)</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1.5, 2.0, 2.5, 3.0].map((scale) => (
                      <button
                        key={scale}
                        type="button"
                        onClick={() => onUpdateEvent(selectedEvent.id, { zoom: scale })}
                        className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          selectedEvent.zoom === scale
                            ? "bg-blue-600 text-white border-blue-400 shadow-md ring-1 ring-blue-300"
                            : "bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]"
                        }`}
                      >
                        {scale}X
                      </button>
                    ))}
                  </div>
                </div>

                {/* Independent 3D Stage Orientation for THIS Zoom Effect */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-slate-300 block">3D Stage Angle (Only for this effect)</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: "simple-smooth" as ScreenAnglePreset, name: "Simple Smooth", desc: "Smooth Zoom In & Out (Zero Tilt)" },
                      { id: "studio-front" as ScreenAnglePreset, name: "Front Studio", desc: "Clean & Flat" },
                      { id: "floating-dynamic" as ScreenAnglePreset, name: "Breathing Tilt", desc: "Organic Depth" },
                      { id: "isometric" as ScreenAnglePreset, name: "Isometric 3D", desc: "Diagonal View" },
                      { id: "cinematic-slant" as ScreenAnglePreset, name: "Filmic Slant", desc: "High Specular" },
                    ].map((preset, pIdx) => {
                      const isPresetActive = (selectedEvent.screenAnglePreset || config.screenAnglePreset) === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => onUpdateEvent(selectedEvent.id, { screenAnglePreset: preset.id })}
                          className={`p-2 rounded-lg text-left border transition-all ${
                            pIdx === 0 ? "col-span-2" : ""
                          } ${
                            isPresetActive
                              ? "bg-blue-500/20 text-blue-200 border-blue-400/50 shadow-sm"
                              : "bg-white/[0.03] text-slate-400 border-white/10 hover:bg-white/[0.06] hover:text-white"
                          }`}
                        >
                          <div className="text-[11px] font-medium text-white">{preset.name}</div>
                          <div className="text-[9px] text-slate-400">{preset.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Focal Target Position on Screen */}
                <div className="space-y-2 pt-2 border-t border-white/[0.08]">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-medium text-slate-300">Focus Target Position</span>
                    <span className="font-mono text-blue-300 text-[10px]">
                      X: {Math.round(selectedEvent.x * 100)}% · Y: {Math.round(selectedEvent.y * 100)}%
                    </span>
                  </div>

                  {/* Quick Position Buttons */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { name: "Left", x: 0.2, y: 0.5 },
                      { name: "Center", x: 0.5, y: 0.5 },
                      { name: "Right", x: 0.8, y: 0.5 },
                    ].map((pos) => (
                      <button
                        key={pos.name}
                        type="button"
                        onClick={() => onUpdateEvent(selectedEvent.id, { x: pos.x, y: pos.y })}
                        className={`py-1 rounded-lg text-[10px] font-medium border transition-all ${
                          Math.abs(selectedEvent.x - pos.x) < 0.08 && Math.abs(selectedEvent.y - pos.y) < 0.08
                            ? "bg-blue-600 text-white border-blue-400 font-bold shadow-sm"
                            : "bg-white/[0.03] text-slate-300 border-white/10 hover:bg-white/[0.06]"
                        }`}
                      >
                        {pos.name}
                      </button>
                    ))}
                  </div>

                  {/* Horizontal Position Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400">Horizontal (Left ↔ Right)</span>
                      <span className="font-mono text-blue-400 font-bold">{Math.round(selectedEvent.x * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.95"
                      step="0.01"
                      value={selectedEvent.x}
                      onChange={(e) =>
                        onUpdateEvent(selectedEvent.id, { x: parseFloat(e.target.value) })
                      }
                      className="w-full accent-blue-400 cursor-pointer h-1 bg-white/10 rounded"
                    />
                  </div>

                  {/* Vertical Position Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400">Vertical (Top ↔ Bottom)</span>
                      <span className="font-mono text-blue-400 font-bold">{Math.round(selectedEvent.y * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.95"
                      step="0.01"
                      value={selectedEvent.y}
                      onChange={(e) =>
                        onUpdateEvent(selectedEvent.id, { y: parseFloat(e.target.value) })
                      }
                      className="w-full accent-blue-400 cursor-pointer h-1 bg-white/10 rounded"
                    />
                  </div>
                </div>

                {/* Timing controls for THIS Zoom Effect */}
                <div className="space-y-2 pt-2 border-t border-white/[0.08]">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400">Hold Focus Duration</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {(selectedEvent.holdDuration ?? 1.4).toFixed(1)}s
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="6.0"
                    step="0.1"
                    value={selectedEvent.holdDuration ?? 1.4}
                    onChange={(e) =>
                      onUpdateEvent(selectedEvent.id, { holdDuration: parseFloat(e.target.value) })
                    }
                    className="w-full accent-emerald-400 cursor-pointer h-1 bg-white/10 rounded"
                  />
                </div>
              </div>
            )}

            {/* Global Default Zoom Timing Card */}
            <div className="glass-panel p-3.5 rounded-xl space-y-3 border-white/10 bg-white/[0.02]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                  <Clock className="w-3.5 h-3.5 text-[#FF6B2C]" />
                  <span>Default Camera Timing</span>
                </div>
                <span className="text-[10px] text-slate-400">Global defaults</span>
              </div>

              {/* Timing Quick Presets */}
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { name: "Snappy", in: 0.3, hold: 0.8, out: 0.3 },
                  { name: "Balanced", in: 0.6, hold: 1.4, out: 0.6 },
                  { name: "Cinematic", in: 1.0, hold: 2.4, out: 1.0 },
                ].map((preset) => {
                  const isActive =
                    config.zoomDuration === preset.in &&
                    config.zoomHoldDuration === preset.hold &&
                    config.zoomOutDuration === preset.out;

                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() =>
                        onChangeConfig({
                          zoomDuration: preset.in,
                          zoomHoldDuration: preset.hold,
                          zoomOutDuration: preset.out,
                        })
                      }
                      className={`py-1 px-2 rounded-lg text-[10px] font-medium border transition-all ${
                        isActive
                          ? "bg-[#FF6B2C]/20 text-[#FF8A4C] border border-[#FF6B2C]/40 font-semibold"
                          : "bg-white/[0.03] text-slate-400 border-white/10 hover:text-white hover:bg-white/[0.06]"
                      }`}
                    >
                      {preset.name}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/[0.06]">
                {/* Default Dolly In */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">Dolly-In</span>
                    <span className="font-mono text-[#FF6B2C] font-bold">{(config.zoomDuration ?? 0.6).toFixed(2)}s</span>
                  </div>
                  <input
                    type="range"
                    min="0.15"
                    max="2.0"
                    step="0.05"
                    value={config.zoomDuration ?? 0.6}
                    onChange={(e) => onChangeConfig({ zoomDuration: parseFloat(e.target.value) })}
                    className="w-full accent-sky-400 cursor-pointer h-1 bg-white/10 rounded"
                  />
                </div>

                {/* Default Hold */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">Hold</span>
                    <span className="font-mono text-emerald-400 font-bold">{(config.zoomHoldDuration ?? 1.4).toFixed(1)}s</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="5.0"
                    step="0.1"
                    value={config.zoomHoldDuration ?? 1.4}
                    onChange={(e) => onChangeConfig({ zoomHoldDuration: parseFloat(e.target.value) })}
                    className="w-full accent-emerald-400 cursor-pointer h-1 bg-white/10 rounded"
                  />
                </div>

                {/* Default Zoom-Out */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">Zoom-Out</span>
                    <span className="font-mono text-[#FF6B2C] font-bold">{(config.zoomOutDuration ?? 0.6).toFixed(2)}s</span>
                  </div>
                  <input
                    type="range"
                    min="0.15"
                    max="2.0"
                    step="0.05"
                    value={config.zoomOutDuration ?? 0.6}
                    onChange={(e) => onChangeConfig({ zoomOutDuration: parseFloat(e.target.value) })}
                    className="w-full accent-sky-400 cursor-pointer h-1 bg-white/10 rounded"
                  />
                </div>
              </div>
            </div>

            {/* List of keyframe events */}
            <div className="space-y-3">
              {events.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs glass-panel rounded-xl">
                  No zoom keyframes logged. Click on the canvas or press &quot;Add at Playhead&quot;.
                </div>
              ) : (
                events.map((ev, index) => {
                  const isNearCurrent = Math.abs(currentTime - ev.timestamp) < 0.3;
                  const inDur = ev.zoomInDuration ?? config.zoomDuration ?? 0.6;
                  const holdDur = ev.holdDuration ?? config.zoomHoldDuration ?? 1.4;
                  const outDur = ev.zoomOutDuration ?? config.zoomOutDuration ?? 0.6;
                  const totalSpan = inDur + holdDur + outDur;

                  return (
                    <div
                      key={ev.id}
                      onClick={() => {
                        onSelectEvent(ev);
                        onSeek?.(ev.timestamp);
                      }}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-3 ${
                        isNearCurrent
                          ? "bg-[#FF6B2C]/15 border-[#FF6B2C]/50 shadow-glass-md"
                          : "bg-slate-100 dark:bg-black/40 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-200/50 dark:hover:bg-white/[0.03]"
                      }`}
                    >
                      {/* Top Bar: Identifier, Timestamp, Delete */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-[#FF6B2C]/20 border border-[#FF6B2C]/30 text-[#FF6B2C] dark:text-[#FF8A4C] font-mono text-[10px] flex items-center justify-center font-bold">
                            #{index + 1}
                          </span>
                          <span className="text-xs font-semibold text-slate-800 dark:text-white">
                            {ev.label || `Zoom Target ${index + 1}`}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectEvent(ev);
                              onSeek?.(ev.timestamp);
                            }}
                            className="px-2 py-0.5 rounded-md bg-slate-200/70 hover:bg-[#FF6B2C]/20 text-[11px] font-mono text-[#FF6B2C] dark:text-[#FF8A4C] border border-slate-300 dark:border-white/10 hover:border-[#FF6B2C]/40 dark:bg-white/[0.06] transition-colors cursor-pointer"
                            title="Jump playhead to this keyframe"
                          >
                            {formatSMPTETimecode(ev.timestamp).substring(3, 8)}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteEvent(ev.id);
                            }}
                            className="text-slate-400 hover:text-[#FF6B2C] dark:text-slate-500 p-1 transition-colors cursor-pointer"
                            title="Delete Keyframe"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Timestamp Adjuster with Real-Time Video Seek */}
                      <div className="space-y-2 bg-slate-100 dark:bg-black/30 p-2.5 rounded-lg border border-slate-200 dark:border-white/[0.06]">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Keyframe Time:</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const newTime = Math.max(0, Math.round((ev.timestamp - 0.1) * 100) / 100);
                                onUpdateEvent(ev.id, { timestamp: newTime });
                                onSeek?.(newTime);
                              }}
                              className="w-5 h-5 rounded bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 text-xs flex items-center justify-center font-mono cursor-pointer"
                              title="Step Back 0.1s"
                            >
                              -
                            </button>
                            <span className="font-mono text-xs text-[#FF6B2C] font-semibold w-12 text-center">
                              {ev.timestamp.toFixed(2)}s
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const newTime = Math.round((ev.timestamp + 0.1) * 100) / 100;
                                onUpdateEvent(ev.id, { timestamp: newTime });
                                onSeek?.(newTime);
                              }}
                              className="w-5 h-5 rounded bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 text-xs flex items-center justify-center font-mono cursor-pointer"
                              title="Step Forward 0.1s"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Real-time smooth scrub slider */}
                        <div className="pt-0.5">
                          <input
                            type="range"
                            min="0"
                            max={Math.max(15, currentTime + 5, ev.timestamp + 5)}
                            step="0.05"
                            value={ev.timestamp}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              const val = Math.round(parseFloat(e.target.value) * 100) / 100;
                              onUpdateEvent(ev.id, { timestamp: val });
                              onSeek?.(val);
                            }}
                            className="w-full accent-sky-400 cursor-pointer h-1 bg-white/10 rounded"
                            title="Drag to smoothly scrub and move video time in real-time"
                          />
                        </div>
                      </div>

                      {/* Magnification adjustment */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 text-[11px]">Magnification:</span>
                        <div className="flex items-center gap-1">
                          {[1.8, 2.2, 2.8].map((scale) => (
                            <button
                              key={scale}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdateEvent(ev.id, { zoom: scale });
                              }}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                                ev.zoom === scale
                                  ? "bg-[#FF6B2C]/25 text-[#FF8A4C] border border-[#FF6B2C]/40 font-bold"
                                  : "bg-white/[0.04] text-slate-400 hover:text-white border border-transparent"
                              }`}
                            >
                              {scale}x
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Timing & Durations Control Panel */}
                      <div className="pt-2 border-t border-white/[0.06] space-y-2.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-medium text-slate-300 flex items-center gap-1">
                            <Timer className="w-3 h-3 text-[#FF6B2C]" />
                            Zoom & Hold Timing
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            Span: <span className="text-[#FF8A4C] font-semibold">{totalSpan.toFixed(2)}s</span>
                          </span>
                        </div>

                        {/* 1. Dolly-In Speed / Duration */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-slate-400">Dolly-In Duration</span>
                            <span className="font-mono text-[#FF6B2C] font-bold">{inDur.toFixed(2)}s</span>
                          </div>
                          <input
                            type="range"
                            min="0.15"
                            max="2.5"
                            step="0.05"
                            value={inDur}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              onUpdateEvent(ev.id, { zoomInDuration: parseFloat(e.target.value) });
                            }}
                            className="w-full accent-sky-400 cursor-pointer h-1 bg-white/10 rounded"
                          />
                        </div>

                        {/* 2. Hold Duration */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-slate-400">Hold Focus Duration</span>
                            <span className="font-mono text-emerald-400 font-bold">{holdDur.toFixed(2)}s</span>
                          </div>
                          <input
                            type="range"
                            min="0.2"
                            max="6.0"
                            step="0.1"
                            value={holdDur}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              onUpdateEvent(ev.id, { holdDuration: parseFloat(e.target.value) });
                            }}
                            className="w-full accent-emerald-400 cursor-pointer h-1 bg-white/10 rounded"
                          />
                        </div>

                        {/* 3. Zoom-Out Duration */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-slate-400">Zoom-Out Duration</span>
                            <span className="font-mono text-[#FF6B2C] font-bold">{outDur.toFixed(2)}s</span>
                          </div>
                          <input
                            type="range"
                            min="0.15"
                            max="2.5"
                            step="0.05"
                            value={outDur}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              onUpdateEvent(ev.id, { zoomOutDuration: parseFloat(e.target.value) });
                            }}
                            className="w-full accent-sky-400 cursor-pointer h-1 bg-white/10 rounded"
                          />
                        </div>

                        {/* Visual Timeline Span Bar */}
                        <div className="pt-1">
                          <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-black/40 overflow-hidden flex border border-slate-300 dark:border-white/[0.06]">
                            <div
                              style={{ width: `${(inDur / totalSpan) * 100}%` }}
                              className="bg-[#FF6B2C] h-full"
                              title={`Dolly-In: ${inDur.toFixed(2)}s`}
                            />
                            <div
                              style={{ width: `${(holdDur / totalSpan) * 100}%` }}
                              className="bg-emerald-400 h-full"
                              title={`Hold: ${holdDur.toFixed(2)}s`}
                            />
                            <div
                              style={{ width: `${(outDur / totalSpan) * 100}%` }}
                              className="bg-[#FF6B2C] h-full"
                              title={`Zoom-Out: ${outDur.toFixed(2)}s`}
                            />
                          </div>
                          <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-1">
                            <span>{ev.timestamp.toFixed(1)}s</span>
                            <span>Hold ({(ev.timestamp + inDur).toFixed(1)}s)</span>
                            <span>{(ev.timestamp + totalSpan).toFixed(1)}s</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: MEDIA & RECORDING HUB */}
        {/* ============================================================ */}
        {activeTab === "media" && (
          <div className="space-y-4">
            {/* Screen Recording Controls */}
            <div className="glass-panel p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Screen Capture Hub</span>
                {isRecording && (
                  <span className="flex items-center gap-1 text-[#FF6B2C] font-mono text-[11px] font-bold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-[#FF6B2C]" />
                    REC
                  </span>
                )}
              </div>

              {isRecording ? (
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-[#17191F] border border-[#FF6B2C]/30 flex items-center justify-between font-mono text-xs">
                    <span className="text-slate-300">Elapsed:</span>
                    <span className="text-[#FF6B2C] font-bold">
                      {Math.floor(recordingDuration / 60)
                        .toString()
                        .padStart(2, "0")}
                      :
                      {Math.floor(recordingDuration % 60)
                        .toString()
                        .padStart(2, "0")}
                    </span>
                    <span className="text-slate-400">Clicks: {clickCount}</span>
                  </div>

                  <Button
                    variant="danger"
                    size="md"
                    className="w-full"
                    onClick={onStopRecording}
                  >
                    Stop Recording & Import
                  </Button>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={onStartRecording}
                >
                  Start Screen Recording
                </Button>
              )}
            </div>

            {/* Load Sample Demo Video */}
            <div className="glass-panel p-4 rounded-xl space-y-2.5">
              <span className="text-xs font-semibold text-white block">Sample Content</span>
              <Button
                variant="secondary"
                size="md"
                className="w-full"
                onClick={onLoadDemo}
                isLoading={isGeneratingDemo}
                leftIcon={<Film className="w-3.5 h-3.5 text-[#FF6B2C]" />}
              >
                Load Sample Screen Recording
              </Button>
            </div>

            {/* Upload Custom Video */}
            <div className="glass-panel p-4 rounded-xl space-y-2.5">
              <span className="text-xs font-semibold text-white block">Upload Video</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onFileUpload(file);
                }}
                className="hidden"
              />
              <Button
                variant="secondary"
                size="md"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
                leftIcon={<Upload className="w-3.5 h-3.5" />}
              >
                Upload MP4 / WebM
              </Button>
            </div>

            {/* Video Metadata Card */}
            {metadata && (
              <div className="glass-panel p-4 rounded-xl space-y-2 text-xs">
                <span className="text-xs font-semibold text-white block">Source Metadata</span>
                <div className="space-y-1 font-mono text-[11px] text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">File:</span>
                    <span className="text-white truncate max-w-[160px]">{metadata.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dimensions:</span>
                    <span>{metadata.width} x {metadata.height}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Duration:</span>
                    <span>{metadata.duration.toFixed(1)}s</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: CURSOR & INTERACTION FX */}
        {/* ============================================================ */}
        {activeTab === "cursor" && (
          <div className="space-y-4">
            {/* Master Cursor Overlay Switch */}
            <div className="glass-panel p-4 rounded-xl space-y-3 border-[#FF6B2C]/30 bg-gradient-to-r from-amber-950/20 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all ${
                      config.showCursor
                        ? "bg-[#FF6B2C]/20 border-[#FF6B2C]/40 text-[#FF8A4C] shadow-glass-sm"
                        : "bg-white/[0.04] border-white/10 text-slate-500"
                    }`}
                  >
                    {config.showCursor ? (
                      <MousePointer className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block">Custom Cursor Overlay</span>
                    <span className="text-[10px] text-slate-400">
                      {config.showCursor ? "Visible across preview & export render" : "Hidden across preview & export render"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onChangeConfig({ showCursor: !config.showCursor })}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    config.showCursor ? "bg-[#FF6B2C] shadow-[0_0_12px_rgba(255,107,44,0.5)]" : "bg-white/15"
                  }`}
                  title={config.showCursor ? "Hide cursor overlay" : "Show cursor overlay"}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform shadow-md ${
                      config.showCursor ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className={`space-y-4 transition-opacity ${config.showCursor ? "opacity-100" : "opacity-60 pointer-events-none"}`}>
            <div className="glass-panel p-4 rounded-xl space-y-3">
              <label className="text-xs font-semibold text-white block">Cursor Pointer Style</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "macos-arrow" as CursorStyle, label: "macOS Arrow" },
                  { id: "neon-dot" as CursorStyle, label: "Neon Dot" },
                  { id: "crosshair" as CursorStyle, label: "Precision Target" },
                  { id: "cyber-ring" as CursorStyle, label: "Cyber Ring" },
                ].map((cur) => (
                  <button
                    key={cur.id}
                    type="button"
                    onClick={() => onChangeConfig({ cursorStyle: cur.id })}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      config.cursorStyle === cur.id
                        ? "bg-[#FF6B2C]/20 text-[#FF8A4C] border border-[#FF6B2C]/40 shadow-glass-sm"
                        : "bg-white/[0.03] text-slate-300 border-white/10 hover:bg-white/[0.06]"
                    }`}
                  >
                    <span className="text-xs font-semibold text-white">{cur.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cursor Size */}
            <div className="glass-panel p-4 rounded-xl space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-white">Cursor Size</label>
                <span className="font-mono text-[#FF6B2C] font-bold">{config.cursorSize}px</span>
              </div>
              <input
                type="range"
                min="14"
                max="36"
                value={config.cursorSize}
                onChange={(e) => onChangeConfig({ cursorSize: parseInt(e.target.value) })}
                className="w-full accent-sky-400 cursor-pointer h-1 bg-white/10 rounded"
              />
            </div>

            {/* Click Ripple Wave Toggle */}
            <div className="glass-panel p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Click Wave Ripples</span>
                <button
                  type="button"
                  onClick={() => onChangeConfig({ showRipple: !config.showRipple })}
                  className={`w-10 h-5 rounded-full transition-colors relative ${
                    config.showRipple ? "bg-[#FF6B2C]" : "bg-white/10"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                      config.showRipple ? "left-5.5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Renders expanding concentric wave rings on recorded mouse clicks mapped to the 3D screen.
              </p>
            </div>
            </div>
          </div>
        )}

        {/* 6. Webcam Facecam PiP Panel */}
        {activeTab === "webcam" && (
          <div className="space-y-4">
            {/* Webcam Master Enable Switch */}
            <div className="glass-panel p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-white">Record Webcam Face</h3>
                  <p className="text-[11px] text-slate-400">
                    Captures your webcam alongside the screen and overlays a floating bubble.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (onToggleWebcam) {
                      onToggleWebcam();
                    } else {
                      const cur = config.webcamConfig?.enabled ?? false;
                      onChangeConfig({
                        webcamConfig: {
                          ...(config.webcamConfig || {
                            enabled: !cur,
                            shape: "circle",
                            position: "bottom-right",
                            customX: 0.85,
                            customY: 0.82,
                            size: 180,
                            borderColor: "#FF6B2C",
                            borderWidth: 3,
                            shadow: true,
                            mirror: true,
                          }),
                          enabled: !cur,
                        },
                      });
                    }
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    enableWebcam || config.webcamConfig?.enabled
                      ? "bg-emerald-500 shadow-[0_0_12px_rgba(52,211,153,0.5)]"
                      : "bg-white/15"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform shadow-md ${
                      enableWebcam || config.webcamConfig?.enabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Quick Button to Launch Webcam Review Modal */}
            {onOpenWebcamReview && (
              <Button
                variant="secondary"
                size="md"
                className="w-full text-xs font-semibold"
                onClick={onOpenWebcamReview}
                leftIcon={<Camera className="w-3.5 h-3.5 text-[#FF6B2C]" />}
              >
                Open Camera Review & Setup
              </Button>
            )}

            {/* Import / Upload Webcam Video File */}
            <div className="glass-panel p-4 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white">Import Webcam Video File</h4>
                  <p className="text-[11px] text-slate-400">
                    Attach a recorded webcam video (MP4/WebM) to overlay as PiP on this project.
                  </p>
                </div>
              </div>
              <input
                ref={webcamFileInputRef}
                type="file"
                accept="video/mp4,video/webm"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (onUploadWebcamFile) {
                      onUploadWebcamFile(file);
                    } else {
                      const url = URL.createObjectURL(file);
                      onChangeConfig({
                        webcamConfig: {
                          ...(config.webcamConfig || {
                            shape: "circle",
                            position: "bottom-right",
                            customX: 0.85,
                            customY: 0.82,
                            size: 180,
                            borderColor: "#FF6B2C",
                            borderWidth: 3,
                            shadow: true,
                            mirror: true,
                          }),
                          enabled: true,
                          url,
                        },
                      });
                    }
                  }
                }}
              />
              <div className="flex items-center gap-2 pt-1">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => webcamFileInputRef.current?.click()}
                  leftIcon={<Upload className="w-3.5 h-3.5 text-[#FF6B2C]" />}
                >
                  {config.webcamConfig?.url ? "Replace Webcam Video" : "Upload Webcam Video (MP4/WebM)"}
                </Button>
                {config.webcamConfig?.url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-[#FF8A4C] hover:text-[#FF8A4C] px-2 flex-shrink-0"
                    title="Remove Webcam Overlay"
                    onClick={() => {
                      onChangeConfig({
                        webcamConfig: {
                          ...(config.webcamConfig || {
                            shape: "circle",
                            position: "bottom-right",
                            customX: 0.85,
                            customY: 0.82,
                            size: 180,
                            borderColor: "#FF6B2C",
                            borderWidth: 3,
                            shadow: true,
                            mirror: true,
                          }),
                          enabled: false,
                          url: null,
                        },
                      });
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
              {config.webcamConfig?.url && (
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 pt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Webcam video active</span>
                </div>
              )}
            </div>

            {/* Camera Device Selector */}
            {availableCameras.length > 0 && (
              <div className="glass-panel p-4 rounded-xl space-y-2.5">
                <label className="text-xs font-semibold text-white block">Camera Device</label>
                <select
                  value={selectedCameraId || config.webcamConfig?.deviceId || ""}
                  onChange={(e) => {
                    const devId = e.target.value;
                    if (onSelectCameraId) onSelectCameraId(devId);
                    onChangeConfig({
                      webcamConfig: {
                        ...(config.webcamConfig || {
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
                        }),
                        deviceId: devId,
                      },
                    });
                  }}
                  className="w-full bg-slate-100 dark:bg-[#090D16] border border-slate-300 dark:border-white/15 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:border-[#FF6B2C] transition-colors"
                >
                  {availableCameras.map((cam) => (
                    <option key={cam.deviceId} value={cam.deviceId}>
                      {cam.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Shape Selector */}
            <div className="glass-panel p-4 rounded-xl space-y-3">
              <label className="text-xs font-semibold text-white block">PiP Shape</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "circle" as WebcamShape, label: "Circle (Bubble)" },
                  { id: "rounded-rect" as WebcamShape, label: "Rounded" },
                  { id: "square" as WebcamShape, label: "Square" },
                ].map((sh) => {
                  const currentShape = config.webcamConfig?.shape || "circle";
                  return (
                    <button
                      key={sh.id}
                      type="button"
                      onClick={() =>
                        onChangeConfig({
                          webcamConfig: {
                            ...(config.webcamConfig || {
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
                            }),
                            shape: sh.id,
                          },
                        })
                      }
                      className={`p-2.5 rounded-xl text-center border transition-all ${
                        currentShape === sh.id
                          ? "bg-[#FF6B2C]/20 text-[#FF8A4C] border border-[#FF6B2C]/40 shadow-glass-sm"
                          : "bg-white/[0.03] text-slate-300 border-white/10 hover:bg-white/[0.06]"
                      }`}
                    >
                      <span className="text-xs font-semibold">{sh.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Position Corner Presets */}
            <div className="glass-panel p-4 rounded-xl space-y-3">
              <label className="text-xs font-semibold text-white block">Corner Preset</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "bottom-right" as WebcamPosition, label: "Bottom Right", x: 0.85, y: 0.82 },
                  { id: "bottom-left" as WebcamPosition, label: "Bottom Left", x: 0.15, y: 0.82 },
                  { id: "top-right" as WebcamPosition, label: "Top Right", x: 0.85, y: 0.18 },
                  { id: "top-left" as WebcamPosition, label: "Top Left", x: 0.15, y: 0.18 },
                ].map((pos) => {
                  const currentPos = config.webcamConfig?.position || "bottom-right";
                  return (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() =>
                        onChangeConfig({
                          webcamConfig: {
                            ...(config.webcamConfig || {
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
                            }),
                            position: pos.id,
                            customX: pos.x,
                            customY: pos.y,
                          },
                        })
                      }
                      className={`p-2 rounded-xl text-center border transition-all text-xs font-medium ${
                        currentPos === pos.id
                          ? "bg-[#FF6B2C]/20 text-[#FF8A4C] border border-[#FF6B2C]/40 font-semibold"
                          : "bg-white/[0.03] text-slate-300 border-white/10 hover:bg-white/[0.06]"
                      }`}
                    >
                      {pos.label}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-500 italic">
                * You can also drag the bubble anywhere on the preview canvas to position freely!
              </p>
            </div>

            {/* Size Slider */}
            <div className="glass-panel p-4 rounded-xl space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-white">Bubble Size</label>
                <span className="font-mono text-[#FF6B2C] font-bold">
                  {config.webcamConfig?.size || 180}px
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="360"
                value={config.webcamConfig?.size || 180}
                onChange={(e) =>
                  onChangeConfig({
                    webcamConfig: {
                      ...(config.webcamConfig || {
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
                      }),
                      size: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full accent-[#FF6B2C] cursor-pointer h-1 bg-white/10 rounded"
              />
            </div>

            {/* Mirror Toggle & Drop Shadow */}
            <div className="glass-panel p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">Mirror Video</span>
                  <span className="text-[11px] text-slate-400">Flips video horizontally (natural mirror look)</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onChangeConfig({
                      webcamConfig: {
                        ...(config.webcamConfig || {
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
                        }),
                        mirror: !(config.webcamConfig?.mirror ?? true),
                      },
                    })
                  }
                  className={`w-10 h-5 rounded-full transition-colors relative ${
                    config.webcamConfig?.mirror ?? true ? "bg-[#FF6B2C]" : "bg-white/10"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                      config.webcamConfig?.mirror ?? true ? "left-5.5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                <div>
                  <span className="text-xs font-semibold text-white block">Cinematic Shadow</span>
                  <span className="text-[11px] text-slate-400">Deep ambient shadow behind bubble</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onChangeConfig({
                      webcamConfig: {
                        ...(config.webcamConfig || {
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
                        }),
                        shadow: !(config.webcamConfig?.shadow ?? true),
                      },
                    })
                  }
                  className={`w-10 h-5 rounded-full transition-colors relative ${
                    config.webcamConfig?.shadow ?? true ? "bg-[#FF6B2C]" : "bg-white/10"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                      config.webcamConfig?.shadow ?? true ? "left-5.5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Border Width & Color */}
            <div className="glass-panel p-4 rounded-xl space-y-3">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-white">Border Width</label>
                <span className="font-mono text-[#FF6B2C] font-bold">
                  {config.webcamConfig?.borderWidth ?? 3}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                value={config.webcamConfig?.borderWidth ?? 3}
                onChange={(e) =>
                  onChangeConfig({
                    webcamConfig: {
                      ...(config.webcamConfig || {
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
                      }),
                      borderWidth: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full accent-[#FF6B2C] cursor-pointer h-1 bg-white/10 rounded"
              />

              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                <label className="text-xs font-semibold text-white">Border Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.webcamConfig?.borderColor || "#FF6B2C"}
                    onChange={(e) =>
                      onChangeConfig({
                        webcamConfig: {
                          ...(config.webcamConfig || {
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
                          }),
                          borderColor: e.target.value,
                        },
                      })
                    }
                    className="w-7 h-7 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                  />
                  <span className="font-mono text-xs text-slate-300 uppercase">
                    {config.webcamConfig?.borderColor || "#FF6B2C"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const EditorInspector = memo(EditorInspectorBase, (prev, next) => {
  if (prev.config !== next.config) return false;
  if (prev.clips !== next.clips) return false;
  if (prev.selectedClipId !== next.selectedClipId) return false;
  if (prev.events !== next.events) return false;
  if (prev.selectedEventId !== next.selectedEventId) return false;
  if (prev.metadata !== next.metadata) return false;
  if (prev.isGeneratingDemo !== next.isGeneratingDemo) return false;
  if (prev.isRecording !== next.isRecording) return false;
  if (prev.recordingDuration !== next.recordingDuration) return false;
  if (prev.clickCount !== next.clickCount) return false;
  if (prev.enableWebcam !== next.enableWebcam) return false;
  if (prev.selectedCameraId !== next.selectedCameraId) return false;
  if (prev.availableCameras !== next.availableCameras) return false;
  if (prev.onUploadWebcamFile !== next.onUploadWebcamFile) return false;
  // Throttle playhead time to 4Hz (every 0.25s) to eliminate 93% of Virtual DOM tree reconciliations
  if (Math.floor(prev.currentTime * 4) !== Math.floor(next.currentTime * 4)) return false;
  return true;
});
