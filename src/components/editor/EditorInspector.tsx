"use client";

import { useState, useRef } from "react";
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
} from "lucide-react";
import {
  CanvasConfig,
  ClickEvent,
  TimelineClip,
  VideoMetadata,
  FramePreset,
  CursorStyle,
  ScreenAnglePreset,
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
  events: ClickEvent[];
  onSelectEvent: (event: ClickEvent) => void;
  onUpdateEvent: (id: string, updates: Partial<ClickEvent>) => void;
  onDeleteEvent: (id: string) => void;
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
}

type InspectorTab = "clip" | "canvas" | "keyframes" | "media" | "cursor";

export function EditorInspector({
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
  events,
  onSelectEvent,
  onUpdateEvent,
  onDeleteEvent,
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
}: EditorInspectorProps) {
  const [activeTab, setActiveTab] = useState<InspectorTab>("canvas");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const customBgInputRef = useRef<HTMLInputElement | null>(null);

  // Active selected clip (or clip currently under playhead)
  const activeClip =
    clips.find((c) => c.id === selectedClipId) ||
    clips.find((c) => currentTime >= c.startTimeline && currentTime <= c.endTimeline) ||
    clips[0] ||
    null;

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
    { id: "sunset", name: "Sunset Gold", class: "from-amber-600 via-orange-600 to-rose-700" },
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
    <div className="h-full flex flex-col bg-[#090D16]/90 backdrop-blur-xl border-l border-white/[0.08] select-none overflow-hidden">
      {/* 1. Inspector Tab Dock */}
      <div className="p-2 border-b border-white/[0.08] bg-white/[0.02] flex items-center gap-1">
        <button
          type="button"
          onClick={() => setActiveTab("clip")}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "clip"
              ? "bg-sky-500/20 text-sky-200 border border-sky-400/30 shadow-glass-sm font-semibold"
              : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span>Clip</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("canvas")}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "canvas"
              ? "bg-sky-500/20 text-sky-200 border border-sky-400/30 shadow-glass-sm font-semibold"
              : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>3D Canvas</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("keyframes")}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "keyframes"
              ? "bg-sky-500/20 text-sky-200 border border-sky-400/30 shadow-glass-sm font-semibold"
              : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <Focus className="w-3.5 h-3.5" />
          <span>Zoom</span>
          {events.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-sky-400/20 text-sky-300 text-[10px] font-mono flex items-center justify-center">
              {events.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("media")}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "media"
              ? "bg-sky-500/20 text-sky-200 border border-sky-400/30 shadow-glass-sm font-semibold"
              : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Media</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("cursor")}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "cursor"
              ? "bg-sky-500/20 text-sky-200 border border-sky-400/30 shadow-glass-sm font-semibold"
              : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <MousePointer className="w-3.5 h-3.5" />
          <span>Cursor</span>
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
                        ? "bg-sky-500/25 text-sky-200 border border-sky-400/40 font-semibold"
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
                    <span className="text-xs font-semibold text-white">Active Clip Properties</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30">
                      ID: {activeClip.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-black/30 border border-white/10">
                      <span className="text-[10px] text-slate-400 block">Timeline In / Out</span>
                      <span className="font-mono text-white font-medium">
                        {formatSMPTETimecode(activeClip.startTimeline).substring(3, 8)} - {formatSMPTETimecode(activeClip.endTimeline).substring(3, 8)}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-black/30 border border-white/10">
                      <span className="text-[10px] text-slate-400 block">Duration</span>
                      <span className="font-mono text-sky-300 font-semibold">
                        {activeClip.duration.toFixed(2)}s
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Edit Actions */}
                <div className="glass-panel p-4 rounded-xl space-y-3">
                  <span className="text-xs font-semibold text-white block">Cut & Trim Shortcuts</span>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onSplitClip(activeClip.id, currentTime)}
                      leftIcon={<Scissors className="w-3.5 h-3.5 text-sky-400" />}
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
                    <span className="text-xs font-mono text-sky-400 font-bold">{config.playbackSpeed}x</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[0.5, 1.0, 1.5, 2.0].map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => onChangeConfig({ playbackSpeed: spd })}
                        className={`py-1.5 rounded-lg text-xs font-mono transition-all ${
                          config.playbackSpeed === spd
                            ? "bg-sky-500/20 text-sky-200 font-bold border border-sky-400/30 shadow-glass-sm"
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
            {/* 3D Perspective Preset */}
            <div className="glass-panel p-4 rounded-xl space-y-3">
              <label className="text-xs font-semibold text-white block">3D Stage Orientation</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "studio-front" as ScreenAnglePreset, name: "Front Studio", desc: "Clean & Direct" },
                  { id: "floating-dynamic" as ScreenAnglePreset, name: "Breathing Tilt", desc: "Organic Depth" },
                  { id: "isometric" as ScreenAnglePreset, name: "Isometric 3D", desc: "Diagonal View" },
                  { id: "cinematic-slant" as ScreenAnglePreset, name: "Filmic Slant", desc: "High Specular" },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onChangeConfig({ screenAnglePreset: preset.id })}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      config.screenAnglePreset === preset.id
                        ? "bg-sky-500/20 text-sky-200 border-sky-400/40 shadow-glass-sm"
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
                <div className="flex items-center gap-1 font-mono text-xs text-sky-400 font-bold">
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
                        ? "bg-sky-500/20 text-sky-200 font-bold border border-sky-400/30"
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
                <div className="flex items-center gap-1 font-mono text-xs text-sky-400 font-bold">
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
                        ? "bg-sky-500/20 text-sky-200 font-bold border border-sky-400/30"
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
              <label className="text-xs font-semibold text-white block">Background Style</label>
              <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
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
                        ? "bg-sky-500/25 text-sky-200 border border-sky-400/40 shadow-glass-sm"
                        : "text-slate-400 hover:text-white"
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
                          ? "border-white ring-2 ring-sky-400/60 shadow-glass-md"
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
                          ? "border-white ring-2 ring-sky-400/60"
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
                    leftIcon={<ImageIcon className="w-3.5 h-3.5 text-sky-400" />}
                  >
                    Select Background Image
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: ZOOM KEYFRAME INSPECTOR */}
        {/* ============================================================ */}
        {activeTab === "keyframes" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Click Keyframes</span>
              <Button
                variant="primary"
                size="sm"
                onClick={onAddCurrentTimeEvent}
                leftIcon={<Plus className="w-3 h-3" />}
              >
                Add at Playhead
              </Button>
            </div>

            {/* List of keyframe events */}
            <div className="space-y-2">
              {events.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs glass-panel rounded-xl">
                  No zoom keyframes logged. Click on the canvas or press &quot;Add at Playhead&quot;.
                </div>
              ) : (
                events.map((ev, index) => {
                  const isNearCurrent = Math.abs(currentTime - ev.timestamp) < 0.3;

                  return (
                    <div
                      key={ev.id}
                      onClick={() => onSelectEvent(ev)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                        isNearCurrent
                          ? "bg-sky-500/15 border-sky-400/50 shadow-glass-sm"
                          : "bg-black/30 border-white/10 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-sky-500/20 border border-sky-400/30 text-sky-300 font-mono text-[10px] flex items-center justify-center">
                            #{index + 1}
                          </span>
                          <span className="text-xs font-medium text-white">
                            {ev.label || `Zoom Target ${index + 1}`}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-mono text-sky-400 font-semibold">
                            {formatSMPTETimecode(ev.timestamp).substring(3, 8)}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteEvent(ev.id);
                            }}
                            className="text-slate-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Zoom factor adjustment */}
                      <div className="flex items-center justify-between text-xs pt-1">
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
                                  ? "bg-sky-500/25 text-sky-200 border border-sky-400/40"
                                  : "bg-white/[0.04] text-slate-400 hover:text-white"
                              }`}
                            >
                              {scale}x
                            </button>
                          ))}
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
                  <span className="flex items-center gap-1 text-rose-400 font-mono text-[11px] font-bold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    REC
                  </span>
                )}
              </div>

              {isRecording ? (
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/30 flex items-center justify-between font-mono text-xs">
                    <span className="text-slate-300">Elapsed:</span>
                    <span className="text-rose-400 font-bold">
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
                leftIcon={<Film className="w-3.5 h-3.5 text-sky-400" />}
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
                        ? "bg-sky-500/20 text-sky-200 border-sky-400/40 shadow-glass-sm"
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
                <span className="font-mono text-sky-400 font-bold">{config.cursorSize}px</span>
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
                    config.showRipple ? "bg-sky-500" : "bg-white/10"
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
        )}
      </div>
    </div>
  );
}
