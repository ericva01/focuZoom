"use client";

import { useState, useRef, memo } from "react";
import {
  Upload,
  Sliders,
  Palette,
  MousePointer,
  Video,
  FileVideo,
  Check,
  Ban,
  Paintbrush,
  LayoutTemplate,
  Cuboid,
  Square,
  Circle,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import {
  CanvasConfig,
  FramePreset,
  CursorStyle,
  EasingType,
  VideoMetadata,
  ScreenAnglePreset,
  FramingStyle,
} from "@/types/editor";

interface LeftSettingsProps {
  config: CanvasConfig;
  onChangeConfig: (newConfig: Partial<CanvasConfig>) => void;
  metadata: VideoMetadata | null;
  onFileUpload: (file: File) => void;
  onLoadDemo: () => void;
  isGeneratingDemo: boolean;
  isRecording?: boolean;
  recordingDuration?: number;
  clickCount?: number;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
}

function LeftSettingsBase({
  config,
  onChangeConfig,
  metadata,
  onFileUpload,
  onLoadDemo,
  isGeneratingDemo,
  isRecording = false,
  recordingDuration = 0,
  clickCount = 0,
  onStartRecording,
  onStopRecording,
}: LeftSettingsProps) {
  const [activeTab, setActiveTab] = useState<"3d" | "frame" | "video" | "zoom" | "cursor">("3d");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChangeConfig({
          backgroundType: "image",
          customBackgroundImage: reader.result,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const imagePresets = [
    {
      id: "dark-mesh",
      name: "Dark Mesh Tech",
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80",
    },
    {
      id: "emerald-prism",
      name: "Emerald Prism",
      url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1920&q=80",
    },
    {
      id: "minimal-studio",
      name: "Studio Minimal",
      url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1920&q=80",
    },
    {
      id: "deep-space",
      name: "Deep Cosmic Field",
      url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80",
    },
  ];

  // 3D Screen Angle Presets
  const anglePresets: { id: ScreenAnglePreset; name: string; desc: string }[] = [
    {
      id: "simple-smooth",
      name: "Simple Smooth",
      desc: "Smooth zoom in & out without 3D tilt",
    },
    {
      id: "studio-front",
      name: "Studio Frontal",
      desc: "Front-facing luxury perspective with specular sheen",
    },
    {
      id: "floating-dynamic",
      name: "Floating Dynamic",
      desc: "Subtle organic tilt with breathing hover in 3D space",
    },
    {
      id: "isometric",
      name: "Isometric Angle",
      desc: "High-tech diagonal elevation with depth separation",
    },
    {
      id: "cinematic-slant",
      name: "Cinematic Slant",
      desc: "Dynamic filmic angle maximizing edge highlights",
    },
  ];

  // Smart Framing Styles
  const framingStyles: { id: FramingStyle; name: string; desc: string }[] = [
    {
      id: "focus-click",
      name: "Focus on Click",
      desc: "Dramatic smooth 3D camera dolly-in centered on click events",
    },
    {
      id: "auto-follow",
      name: "Auto-Follow Cursor",
      desc: "Camera glides fluidly along the focal coordinate trajectory",
    },
    {
      id: "static",
      name: "Static Studio",
      desc: "Maintain wide perspective framing with floating motion",
    },
  ];

  // Sleek Dark Tech & Vibrant Abstract presets
  const gradientPresets: {
    id: FramePreset;
    name: string;
    category: "Dark Tech" | "Vibrant Abstract";
    gradientCss: string;
    colors: string;
  }[] = [
    {
      id: "mesh-purple",
      name: "Cyber Violet",
      category: "Dark Tech",
      gradientCss: "from-purple-950 via-indigo-950 to-dark-950",
      colors: "#7c3aed to #090a0f",
    },
    {
      id: "cosmic-blue",
      name: "Cosmic Deep Space",
      category: "Dark Tech",
      gradientCss: "from-amber-950 via-blue-950 to-dark-950",
      colors: "#e11d48 to #090a0f",
    },
    {
      id: "obsidian-dark",
      name: "Stealth Obsidian",
      category: "Dark Tech",
      gradientCss: "from-zinc-900 via-zinc-950 to-black",
      colors: "#27272a to #000000",
    },
    {
      id: "emerald-matrix",
      name: "Emerald Matrix",
      category: "Dark Tech",
      gradientCss: "from-emerald-950 via-teal-950 to-dark-950",
      colors: "#059669 to #022c22",
    },
    {
      id: "midnight-titanium",
      name: "Midnight Titanium",
      category: "Dark Tech",
      gradientCss: "from-slate-800 via-slate-900 to-dark-950",
      colors: "#475569 to #020617",
    },
    {
      id: "aurora-glow",
      name: "Aurora Borealis",
      category: "Vibrant Abstract",
      gradientCss: "from-teal-900 via-emerald-900 to-indigo-950",
      colors: "#0d9488 to #064e3b",
    },
    {
      id: "sunset",
      name: "Sunset Crimson",
      category: "Vibrant Abstract",
      gradientCss: "from-amber-950 via-amber-950 to-zinc-950",
      colors: "#e11d48 to #d97706",
    },
    {
      id: "hyper-neon",
      name: "Hyper Miami Neon",
      category: "Vibrant Abstract",
      gradientCss: "from-cyan-950 via-fuchsia-950 to-dark-950",
      colors: "#FF6B2C to #d946ef",
    },
    {
      id: "solar-flare",
      name: "Solar Flare Flame",
      category: "Vibrant Abstract",
      gradientCss: "from-orange-950 via-red-950 to-black",
      colors: "#ea580c to #dc2626",
    },
    {
      id: "pastel-dream",
      name: "Pastel Dreamscape",
      category: "Vibrant Abstract",
      gradientCss: "from-indigo-900 via-purple-900 to-pink-950",
      colors: "#6366f1 to #ec4899",
    },
  ];

  const solidColorChips = [
    { color: "#06402B", label: "Classic Deep Green" },
    { color: "#042C1D", label: "Charcoal Green" },
    { color: "#084D35", label: "Forest Accent" },
    { color: "#0A1F1C", label: "Tech Dark Green" },
    { color: "#08090d", label: "Deep Obsidian" },
    { color: "#0f172a", label: "Studio Navy" },
    { color: "#1e293b", label: "Slate" },
    { color: "#18181b", label: "Zinc Dark" },
    { color: "#000000", label: "Pitch Black" },
    { color: "#ffffff", label: "Clean White" },
  ];

  const easingOptions: { id: EasingType; name: string; desc: string }[] = [
    { id: "spring", name: "Spring Physics", desc: "Organic momentum with subtle bounce" },
    { id: "cubic-out", name: "Cubic Ease-Out", desc: "Smooth filmic camera deceleration" },
    { id: "smooth-step", name: "Smooth Step", desc: "Classic cinematic S-curve velocity" },
    { id: "linear", name: "Linear", desc: "Constant mathematical speed" },
  ];

  const cursorStyles: { id: CursorStyle; name: string }[] = [
    { id: "macos-arrow", name: "macOS Arrow" },
    { id: "neon-dot", name: "Neon Dot" },
    { id: "cyber-ring", name: "Cyber Ring" },
    { id: "crosshair", name: "Crosshair" },
  ];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <aside className="w-full border-r border-white/[0.08] bg-[#090D16]/80 backdrop-blur-xl flex flex-col h-full overflow-hidden select-none">
      {/* Navigation Tabs Header */}
      <div className="grid grid-cols-5 border-b border-white/[0.08] bg-white/[0.02] p-1.5 gap-1 text-xs">
        <button
          onClick={() => setActiveTab("3d")}
          className={`py-2 rounded-xl flex flex-col items-center gap-1 font-semibold transition-all duration-200 ${
            activeTab === "3d"
              ? "bg-[#FF6B2C]/20 text-[#FF8A4C] border border-[#FF6B2C]/40 shadow-glass-sm font-bold"
              : "text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent"
          }`}
          title="3D Cinematic Compositing Engine"
        >
          <Cuboid className="w-3.5 h-3.5" />
          <span className="text-[10px]">3D Motion</span>
        </button>

        <button
          onClick={() => setActiveTab("frame")}
          className={`py-2 rounded-xl flex flex-col items-center gap-1 font-semibold transition-all duration-200 ${
            activeTab === "frame"
              ? "bg-[#FF6B2C]/20 text-[#FF8A4C] border border-[#FF6B2C]/40 shadow-glass-sm font-bold"
              : "text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent"
          }`}
          title="Canvas Frame & Background"
        >
          <Palette className="w-3.5 h-3.5" />
          <span className="text-[10px]">Backdrop</span>
        </button>

        <button
          onClick={() => setActiveTab("video")}
          className={`py-2 rounded-xl flex flex-col items-center gap-1 font-semibold transition-all duration-200 ${
            activeTab === "video"
              ? "bg-[#FF6B2C]/20 text-[#FF8A4C] border border-[#FF6B2C]/40 shadow-glass-sm font-bold"
              : "text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent"
          }`}
          title="Video Input & Demo"
        >
          <Video className="w-3.5 h-3.5" />
          <span className="text-[10px]">Media</span>
        </button>

        <button
          onClick={() => setActiveTab("zoom")}
          className={`py-2 rounded-xl flex flex-col items-center gap-1 font-semibold transition-all duration-200 ${
            activeTab === "zoom"
              ? "bg-[#FF6B2C]/20 text-[#FF8A4C] border border-[#FF6B2C]/40 shadow-glass-sm font-bold"
              : "text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent"
          }`}
          title="Zoom & Motion Easing"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span className="text-[10px]">Camera</span>
        </button>

        <button
          onClick={() => setActiveTab("cursor")}
          className={`py-2 rounded-xl flex flex-col items-center gap-1 font-semibold transition-all duration-200 ${
            activeTab === "cursor"
              ? "bg-[#FF6B2C]/20 text-[#FF8A4C] border border-[#FF6B2C]/40 shadow-glass-sm font-bold"
              : "text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent"
          }`}
          title="Cursor & Click FX"
        >
          <MousePointer className="w-3.5 h-3.5" />
          <span className="text-[10px]">Cursor</span>
        </button>
      </div>

      {/* Settings Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs text-slate-300">
        {/* ========================================================= */}
        {/* ========================================================= */}
        {/* 1. 3D CINEMATIC COMPOSITING ENGINE CONTROLS */}
        {/* ========================================================= */}
        {activeTab === "3d" && (
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-1.5 text-[#FF6B2C] font-bold text-[10px] uppercase tracking-wider mb-1">
                <Cuboid className="w-3.5 h-3.5" />
                <span>WebGL 3D Compositing</span>
              </div>
              <h3 className="font-bold text-white text-sm">
                Cinematic 3D Screen Motion
              </h3>
              <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                Physical camera dolly zooms, glass reflections, and conditional on-click keyframing.
              </p>
            </div>

            {/* Screen Resolution & Quality Selector */}
            <div className="glass-panel p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-semibold text-white block">Screen Render Resolution</label>
                  <p className="text-[10px] text-slate-400 mt-0.5">High-DPI canvas supersampling for crisp text</p>
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

            {/* Conditional On-Click Only Animation Status Card */}
            <div className="p-4 rounded-xl glass-panel space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#FF8A4C] font-bold text-xs">
                  <span className="w-2 h-2 rounded-full bg-[#FF6B2C] animate-pulse" />
                  <span>On-Click Only Zoom Active</span>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-lg bg-[#FF6B2C]/20 text-[#FF8A4C] border border-[#FF6B2C]/40 font-mono font-semibold">
                  Static Wide Default
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Continuous automatic tracking and background camera drifting are disabled. The camera stays completely static and wide, and smoothly dollies in only when reaching Click Keyframes on the timeline.
              </p>
            </div>

            {/* 3D Angle Presets */}
            <div className="space-y-2.5 glass-panel p-4 rounded-xl">
              <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                <span>3D Screen Orientation</span>
                <span className="text-[10px] text-[#FF6B2C] font-mono">Perspective Camera</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                {anglePresets.map((ap) => {
                  const isSelected = config.screenAnglePreset === ap.id;
                  return (
                    <button
                      key={ap.id}
                      onClick={() => onChangeConfig({ screenAnglePreset: ap.id })}
                      className={`p-2.5 rounded-xl text-left border transition-all duration-200 ${
                        isSelected
                          ? "bg-[#FF6B2C]/20 border-[#FF6B2C]/40 text-white shadow-glass-sm"
                          : "bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-slate-200 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-white">{ap.name}</span>
                        {isSelected && <Check className="w-3 h-3 text-[#FF6B2C]" />}
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">{ap.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Smart-Framing Modes */}
            <div className="space-y-2.5 glass-panel p-4 rounded-xl">
              <label className="text-xs font-semibold text-slate-200">
                FocuSee Dynamic Smart-Framing
              </label>
              <div className="space-y-2">
                {framingStyles.map((fs) => {
                  const isSelected = config.framingStyle === fs.id;
                  return (
                    <button
                      key={fs.id}
                      onClick={() => onChangeConfig({ framingStyle: fs.id })}
                      className={`w-full p-2.5 rounded-xl text-left border transition-all duration-200 flex items-start justify-between ${
                        isSelected
                          ? "bg-[#FF6B2C]/20 border-[#FF6B2C]/40 text-white shadow-glass-sm"
                          : "bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-white">{fs.name}</div>
                        <div className="text-[10px] text-slate-400">{fs.desc}</div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#FF6B2C] mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Organic 3D Floating / Breathing Toggle */}
            <div className="space-y-3 glass-panel p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-200">Organic 3D Floating Motion</div>
                  <div className="text-[10px] text-slate-400">Gentle sinusoidal hovering & breathing pitch</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.enableFloatingMotion}
                  onChange={(e) => onChangeConfig({ enableFloatingMotion: e.target.checked })}
                  className="w-4 h-4 accent-sky-400 cursor-pointer rounded"
                />
              </div>

              {/* Interactive Mouse Parallax Toggle & Slider */}
              <div className="pt-3 border-t border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Interactive Mouse Parallax</div>
                    <div className="text-[10px] text-slate-400">Screen tilts dynamically to track cursor</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.enableMouseParallax}
                    onChange={(e) => onChangeConfig({ enableMouseParallax: e.target.checked })}
                    className="w-4 h-4 accent-sky-400 cursor-pointer rounded"
                  />
                </div>

                {config.enableMouseParallax && (
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Tilt Weight</span>
                      <span className="font-mono text-[#FF6B2C]">
                        {Math.round((config.mouseParallaxIntensity ?? 0.65) * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="1.0"
                      step="0.05"
                      value={config.mouseParallaxIntensity ?? 0.65}
                      onChange={(e) =>
                        onChangeConfig({ mouseParallaxIntensity: parseFloat(e.target.value) })
                      }
                      className="w-full accent-sky-400 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Glass Clearcoat & Studio Specular Reflection Slider */}
            <div className="space-y-2.5 glass-panel p-4 rounded-xl">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs font-semibold text-slate-200">Glass Clearcoat & Reflections</div>
                  <div className="text-[10px] text-slate-400">Glossy surface sheen under studio keylights</div>
                </div>
                <span className="text-[#FF6B2C] font-mono font-bold text-xs">
                  {Math.round((config.glassReflectionIntensity ?? 0.85) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={config.glassReflectionIntensity ?? 0.85}
                onChange={(e) =>
                  onChangeConfig({ glassReflectionIntensity: parseFloat(e.target.value) })
                }
                className="w-full accent-sky-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Matte (0%)</span>
                <span>Studio Glass (85%)</span>
                <span>Hyper Sheen (100%)</span>
              </div>
            </div>

            {/* Corner Radius / Round Border in 3D Tab */}
            <div className="space-y-3 glass-panel p-4 rounded-xl relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-white cursor-pointer">
                    <Square className="w-4 h-4 text-[#FF6B2C]" />
                    <span>Corner Radius / Round Border</span>
                  </label>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                    3D Screen card corner curvature (0px to 64px)
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-black/30 px-2.5 py-1 rounded-lg border border-white/[0.08]">
                  <input
                    type="number"
                    min="0"
                    max="64"
                    value={config.cornerRadius}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      const safeVal = isNaN(val) ? 0 : Math.max(0, Math.min(64, val));
                      onChangeConfig({ cornerRadius: safeVal });
                    }}
                    className="w-10 bg-transparent text-right text-[#FF6B2C] font-mono font-bold text-xs outline-none"
                  />
                  <span className="text-slate-400 font-mono text-[11px]">px</span>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="64"
                step="1"
                value={config.cornerRadius}
                onChange={(e) => onChangeConfig({ cornerRadius: parseInt(e.target.value) || 0 })}
                className="w-full accent-sky-400 cursor-pointer h-1.5 bg-white/[0.08] rounded-lg"
              />

              <div className="grid grid-cols-6 gap-1 pt-1 border-t border-white/[0.08]">
                {[
                  { rad: 0, label: "0px" },
                  { rad: 12, label: "12px" },
                  { rad: 20, label: "20px" },
                  { rad: 32, label: "32px" },
                  { rad: 48, label: "48px" },
                  { rad: 64, label: "64px" },
                ].map(({ rad, label }) => (
                  <button
                    key={rad}
                    onClick={() => onChangeConfig({ cornerRadius: rad })}
                    className={`py-1 rounded-lg text-[10px] font-mono transition-all ${
                      config.cornerRadius === rad
                        ? "bg-[#FF6B2C]/20 text-[#FF8A4C] font-bold border border-[#FF6B2C]/30 shadow-glass-sm"
                        : "bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. FRAME & BACKDROP CONTROLS */}
        {/* ========================================================= */}
        {activeTab === "frame" && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-1.5 text-[#FF6B2C] font-bold text-[10px] uppercase tracking-wider mb-1">
                <LayoutTemplate className="w-3.5 h-3.5" />
                <span>Visual Canvas Controls</span>
              </div>
              <h3 className="font-bold text-white text-sm">
                Frame Geometry & Backdrop
              </h3>
              <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                Adjust padding, rounded corners, custom images, and transparent background before export.
              </p>
            </div>

            {/* PADDING CONTROL (0px to 120px) */}
            <div className="space-y-2.5 glass-panel p-4 rounded-xl">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-200">Canvas Inset (Padding)</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={config.padding}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      onChangeConfig({ padding: Math.max(0, Math.min(120, val)) });
                    }}
                    className="w-14 bg-black/30 border border-white/[0.08] text-right px-2 py-0.5 rounded-lg text-[#FF6B2C] font-mono font-bold text-xs outline-none focus:border-[#FF6B2C]"
                  />
                  <span className="text-slate-400 font-mono text-xs">px</span>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="120"
                step="2"
                value={config.padding}
                onChange={(e) => onChangeConfig({ padding: parseInt(e.target.value) })}
                className="w-full accent-sky-400 cursor-pointer"
              />

              <div className="grid grid-cols-5 gap-1.5 pt-1">
                {[0, 24, 48, 80, 120].map((pad) => (
                  <button
                    key={pad}
                    onClick={() => onChangeConfig({ padding: pad })}
                    className={`py-1 rounded-lg text-[10px] font-mono transition-all duration-200 ${
                      config.padding === pad
                        ? "bg-[#FF6B2C]/20 text-[#FF8A4C] font-bold border border-[#FF6B2C]/30 shadow-glass-sm"
                        : "bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent"
                    }`}
                  >
                    {pad}px
                  </button>
                ))}
              </div>
            </div>

            {/* DEDICATED ROUND BORDER / CORNER RADIUS CONTROL (0px to 64px) */}
            <div className="space-y-3 glass-panel p-4 rounded-xl relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-white cursor-pointer">
                    <Square className="w-4 h-4 text-[#FF6B2C]" />
                    <span>Corner Radius / Round Border</span>
                  </label>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                    Dynamically adjust video card corner curvature in real-time
                  </p>
                </div>

                {/* Prominent numerical input box */}
                <div className="flex items-center gap-1 bg-black/30 px-2.5 py-1 rounded-lg border border-white/[0.08] focus-within:border-[#FF6B2C] transition-colors">
                  <input
                    type="number"
                    min="0"
                    max="64"
                    value={config.cornerRadius}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      const safeVal = isNaN(val) ? 0 : Math.max(0, Math.min(64, val));
                      onChangeConfig({ cornerRadius: safeVal });
                    }}
                    className="w-10 bg-transparent text-right text-[#FF6B2C] font-mono font-bold text-xs outline-none"
                  />
                  <span className="text-slate-400 font-mono text-[11px]">px</span>
                </div>
              </div>

              {/* Prominent Range Slider */}
              <div className="space-y-1.5 pt-1">
                <input
                  type="range"
                  min="0"
                  max="64"
                  step="1"
                  value={config.cornerRadius}
                  onChange={(e) => onChangeConfig({ cornerRadius: parseInt(e.target.value) || 0 })}
                  className="w-full accent-sky-400 cursor-pointer h-1.5 bg-white/[0.08] rounded-lg"
                />

                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-500">0px (Sharp)</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FF6B2C]/20 border border-[#FF6B2C]/30 text-[#FF8A4C] font-bold text-[10px]">
                    {config.cornerRadius === 0 ? "0px - Sharp Square" : `${config.cornerRadius}px Rounded Border`}
                  </span>
                  <span className="text-slate-500">64px (Pill)</span>
                </div>
              </div>

              {/* Quick preset chips */}
              <div className="grid grid-cols-6 gap-1 pt-1 border-t border-white/[0.08]">
                {[
                  { rad: 0, label: "0px" },
                  { rad: 12, label: "12px" },
                  { rad: 20, label: "20px" },
                  { rad: 32, label: "32px" },
                  { rad: 48, label: "48px" },
                  { rad: 64, label: "64px" },
                ].map(({ rad, label }) => (
                  <button
                    key={rad}
                    onClick={() => onChangeConfig({ cornerRadius: rad })}
                    className={`py-1 rounded-lg text-[10px] font-mono transition-all duration-200 ${
                      config.cornerRadius === rad
                        ? "bg-[#FF6B2C]/20 text-[#FF8A4C] font-bold border border-[#FF6B2C]/30 shadow-glass-sm"
                        : "bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* BACKDROP ENVIRONMENT (Custom Image, Solid Color, Gradient, Transparent) */}
            <div className="space-y-3 glass-panel p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200 block">
                  Backdrop Environment
                </label>
                {config.backgroundType === "transparent" ? (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FF6B2C]/20 text-[#FF8A4C] font-semibold border border-[#FF6B2C]/30">
                    Transparent Active
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onChangeConfig({ backgroundType: "transparent" })}
                    className="text-[10px] text-slate-400 hover:text-[#FF8A4C] flex items-center gap-1 transition-colors"
                  >
                    <Ban className="w-3 h-3" />
                    <span>Disable Background</span>
                  </button>
                )}
              </div>

              {/* Mode Selectors */}
              <div className="grid grid-cols-4 p-1 rounded-xl bg-black/30 border border-white/[0.08] text-[11px] gap-1">
                <button
                  type="button"
                  onClick={() => onChangeConfig({ backgroundType: "image" })}
                  className={`py-1.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-1 ${
                    config.backgroundType === "image"
                      ? "bg-[#FF6B2C]/20 text-[#FF8A4C] shadow-glass-sm font-semibold border border-[#FF6B2C]/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title="Custom Image Background"
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>Image</span>
                </button>

                <button
                  type="button"
                  onClick={() => onChangeConfig({ backgroundType: "solid" })}
                  className={`py-1.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-1 ${
                    config.backgroundType === "solid"
                      ? "bg-[#FF6B2C]/20 text-[#FF8A4C] shadow-glass-sm font-semibold border border-[#FF6B2C]/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title="Solid Color Background"
                >
                  <Paintbrush className="w-3 h-3" />
                  <span>Solid</span>
                </button>

                <button
                  type="button"
                  onClick={() => onChangeConfig({ backgroundType: "gradient" })}
                  className={`py-1.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-1 ${
                    config.backgroundType === "gradient"
                      ? "bg-[#FF6B2C]/20 text-[#FF8A4C] shadow-glass-sm font-semibold border border-[#FF6B2C]/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title="Gradient Preset Background"
                >
                  <Palette className="w-3 h-3" />
                  <span>Gradient</span>
                </button>

                <button
                  type="button"
                  onClick={() => onChangeConfig({ backgroundType: "transparent" })}
                  className={`py-1.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-1 ${
                    config.backgroundType === "transparent"
                      ? "bg-[#FF6B2C]/20 text-[#FF8A4C] font-bold shadow-glass-sm border border-[#FF6B2C]/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title="No Background / Transparent Video"
                >
                  <Ban className="w-3 h-3" />
                  <span>No BG</span>
                </button>
              </div>

              {/* 1. CUSTOM IMAGE MODE */}
              {config.backgroundType === "image" && (
                <div className="space-y-3 pt-1">
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageUpload(e.target.files[0]);
                      }
                    }}
                  />

                  {/* Upload button / Dropzone */}
                  <div
                    onClick={() => imageInputRef.current?.click()}
                    className="border border-dashed border-white/20 hover:border-[#FF6B2C]/50 rounded-xl p-3.5 text-center cursor-pointer transition-colors bg-white/[0.02] hover:bg-[#FF6B2C]/10 group"
                  >
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-300 group-hover:text-white">
                      <Upload className="w-3.5 h-3.5 text-[#FF8A4C]" />
                      <span className="font-semibold">Upload Custom Background</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, or WebP image</p>
                  </div>

                  {/* Active Custom Image Preview if available */}
                  {config.customBackgroundImage && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.04] border border-white/[0.1]">
                      <div className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={config.customBackgroundImage}
                          alt="Custom Background"
                          className="w-10 h-7 rounded-lg object-cover border border-white/20"
                        />
                        <span className="text-[11px] text-[#FF8A4C] font-medium">
                          Custom Image Applied
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onChangeConfig({ customBackgroundImage: null })}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#FF6B2C] hover:bg-white/[0.08] transition-colors"
                        title="Remove custom background image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Curated Wallpaper Presets */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Curated Wallpapers
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {imagePresets.map((wp) => {
                        const isSelected = config.customBackgroundImage === wp.url;
                        return (
                          <button
                            key={wp.id}
                            type="button"
                            onClick={() =>
                              onChangeConfig({
                                backgroundType: "image",
                                customBackgroundImage: wp.url,
                              })
                            }
                            className={`p-2 rounded-xl text-left border transition-all relative overflow-hidden flex flex-col justify-end h-16 group ${
                              isSelected
                                ? "border-[#FF6B2C] ring-1 ring-[#FF6B2C] shadow-glass-sm"
                                : "border-white/[0.08] hover:border-white/20 bg-white/[0.02]"
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={wp.url}
                              alt={wp.name}
                              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-black/40" />
                            <div className="relative z-10 flex items-center justify-between w-full">
                              <span className="text-[10px] font-bold text-white truncate drop-shadow">
                                {wp.name}
                              </span>
                              {isSelected && (
                                <Check className="w-3 h-3 text-[#FF8A4C] stroke-[3]" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. SOLID COLOR MODE */}
              {config.backgroundType === "solid" && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-200">Custom Solid</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.solidBackgroundColor || "#090D16"}
                        onChange={(e) => onChangeConfig({ solidBackgroundColor: e.target.value })}
                        className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 outline-none"
                      />
                      <input
                        type="text"
                        value={config.solidBackgroundColor || "#090D16"}
                        onChange={(e) => onChangeConfig({ solidBackgroundColor: e.target.value })}
                        className="w-20 glass-input text-xs font-mono uppercase px-2 py-1 rounded-lg text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5">
                    {solidColorChips.map((chip) => (
                      <button
                        key={chip.color}
                        onClick={() => onChangeConfig({ solidBackgroundColor: chip.color })}
                        className={`h-7 rounded-lg border transition-transform flex items-center justify-center ${
                          config.solidBackgroundColor === chip.color
                            ? "scale-110 border-white shadow-md ring-1 ring-white"
                            : "border-white/20 hover:scale-105"
                        }`}
                        style={{ backgroundColor: chip.color }}
                        title={chip.label}
                      >
                        {config.solidBackgroundColor === chip.color && (
                          <Check className={`w-3.5 h-3.5 ${chip.color === "#ffffff" ? "text-black" : "text-white"}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. GRADIENT MODE */}
              {config.backgroundType === "gradient" && (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
                    {gradientPresets.map((p) => {
                      const isSelected = config.backgroundPreset === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => onChangeConfig({ backgroundPreset: p.id })}
                          className={`p-2 rounded-xl text-left border transition-all flex flex-col justify-between h-16 relative overflow-hidden ${
                            isSelected
                              ? "border-[#FF6B2C] ring-1 ring-[#FF6B2C] shadow-glass-sm"
                              : "border-white/[0.08] hover:border-white/20 bg-white/[0.02]"
                          }`}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br ${p.gradientCss} opacity-40`} />
                          <div className="relative z-10 flex items-center justify-between w-full">
                            <span className="text-[11px] font-bold text-white truncate max-w-[100px]">
                              {p.name}
                            </span>
                            {isSelected && (
                              <span className="w-4 h-4 rounded-full bg-[#FF6B2C]/40 text-white flex items-center justify-center border border-[#FF6B2C]/40">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </span>
                            )}
                          </div>
                          <span className="relative z-10 text-[9px] text-slate-300">
                            {p.category}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. TRANSPARENT MODE */}
              {config.backgroundType === "transparent" && (
                <div className="p-4 rounded-xl glass-panel space-y-2">
                  <div className="flex items-center gap-2 text-[#FF6B2C] font-bold text-xs">
                    <Ban className="w-4 h-4" />
                    <span>No Background / Transparent Active</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Background fill is completely disabled (alpha 0). The video frame floats with its rounded corners and padding over a transparent canvas, ready for transparent overlays and clean compositing in video editors.
                  </p>
                </div>
              )}
            </div>

            {/* Frame Shadow */}
            <div className="space-y-2 glass-panel p-4 rounded-xl">
              <label className="text-xs font-semibold text-slate-200">Frame Shadow & Glow</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(["none", "subtle", "cinematic", "neon"] as const).map((sh) => (
                  <button
                    key={sh}
                    onClick={() => onChangeConfig({ shadowIntensity: sh })}
                    className={`py-1.5 px-2.5 rounded-lg text-xs capitalize font-medium transition-all duration-200 ${
                      config.shadowIntensity === sh
                        ? "bg-[#FF6B2C]/20 text-[#FF8A4C] shadow-glass-sm font-semibold border border-[#FF6B2C]/30"
                        : "bg-white/[0.03] text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] border border-transparent"
                    }`}
                  >
                    {sh}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. MEDIA TAB */}
        {activeTab === "video" && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-white text-sm">Video Source & Capture</h3>
              <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                Record your screen directly, upload local captures, or test procedural demos.
              </p>
            </div>

            {/* Built-in Screen Recorder with Click Logging */}
            <div
              className={`p-4 rounded-xl transition-all ${
                isRecording
                  ? "glass-panel-elevated border-[#FF6B2C]/60 shadow-[0_0_30px_rgba(244,63,94,0.25)]"
                  : "glass-panel"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-bold text-xs text-white">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isRecording ? "bg-[#FF6B2C] animate-ping" : "bg-[#FF6B2C] shadow-[0_0_8px_rgba(255,107,44,0.6)]"
                    }`}
                  />
                  <span>Native Screen Recording</span>
                </div>
                {isRecording && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FF6B2C]/20 text-[#FF8A4C] font-bold border border-[#FF6B2C]/40">
                    REC
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                {isRecording
                  ? "Recording is live! Click anywhere on your display — coordinates and timestamps will be automatically logged into zoom keyframes."
                  : "Record any screen, window, or tab with audio. Mouse clicks are automatically logged as zoom keyframes."}
              </p>

              {isRecording ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-black/30 px-3 py-1.5 rounded-lg border border-[#FF6B2C]/30 text-xs font-mono">
                    <span className="text-slate-400">Duration:</span>
                    <span className="text-[#FF6B2C] font-bold">
                      {Math.floor(recordingDuration / 60).toString().padStart(2, "0")}:
                      {Math.floor(recordingDuration % 60).toString().padStart(2, "0")}
                    </span>
                    <span className="text-slate-600">|</span>
                    <span className="text-slate-400">Clicks:</span>
                    <span className="text-[#FF8A4C] font-bold">{clickCount}</span>
                  </div>

                  <button
                    onClick={onStopRecording}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#E85A1F] hover:bg-[#FF6B2C] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <Square className="w-3.5 h-3.5 fill-white" />
                    <span>Stop Recording & Import</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={onStartRecording}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#FF6B2C]/20 hover:bg-[#FF6B2C]/30 text-[#FF8A4C] hover:text-white font-semibold text-xs border border-[#FF6B2C]/30 shadow-glass-sm flex items-center justify-center gap-2 transition-all group"
                >
                  <Circle className="w-3.5 h-3.5 fill-sky-300 text-[#FF8A4C] group-hover:scale-110 transition-transform" />
                  <span>Start Screen Recording</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1 pb-0.5">
              <div className="h-px bg-white/[0.08] flex-1" />
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">or import file</span>
              <div className="h-px bg-white/[0.08] flex-1" />
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/20 hover:border-[#FF6B2C] rounded-2xl p-5 text-center cursor-pointer transition-colors bg-white/[0.02] hover:bg-[#FF6B2C]/5 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    onFileUpload(e.target.files[0]);
                  }
                }}
              />
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] group-hover:bg-[#FF6B2C]/20 flex items-center justify-center mx-auto mb-2 text-slate-300 group-hover:text-[#FF8A4C] transition-colors border border-white/[0.1] group-hover:border-[#FF6B2C]/40">
                <Upload className="w-5 h-5" />
              </div>
              <p className="font-medium text-white mb-0.5">Click or drag video here</p>
              <p className="text-[10px] text-slate-400">Supports MP4, WebM (up to 4K)</p>
            </div>

            <div className="pt-1">
              <button
                onClick={onLoadDemo}
                disabled={isGeneratingDemo}
                className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#FF8A4C] border border-white/[0.1] text-xs font-semibold flex items-center justify-center gap-2 transition-all group disabled:opacity-50 shadow-glass-sm"
              >
                <FileVideo
                  className={`w-4 h-4 text-[#FF8A4C] ${
                    isGeneratingDemo ? "animate-spin" : "group-hover:scale-105"
                  } transition-transform`}
                />
                <span>{isGeneratingDemo ? "Generating 60 FPS Demo..." : "Load Sample Screen Recording"}</span>
              </button>
            </div>

            {metadata && (
              <div className="p-4 rounded-xl glass-panel space-y-2 mt-4">
                <div className="flex items-center gap-2 text-white font-medium">
                  <FileVideo className="w-4 h-4 text-[#FF6B2C]" />
                  <span className="truncate">{metadata.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-2 border-t border-white/[0.08]">
                  <div>
                    Resolution: <span className="text-white font-mono">{metadata.width}×{metadata.height}</span>
                  </div>
                  <div>
                    Duration: <span className="text-white font-mono">{metadata.duration.toFixed(1)}s</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. CAMERA & DOLLY TAB */}
        {activeTab === "zoom" && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-white text-sm">3D Camera & Dolly Depth</h3>
              <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                Configure physical Z-axis dolly zoom and spring easing physics.
              </p>
            </div>

            <div className="space-y-2 glass-panel p-4 rounded-xl">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-slate-200">Dolly Zoom Depth</label>
                <span className="text-[#FF6B2C] font-mono font-bold text-xs">
                  {config.defaultZoomScale.toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min="1.2"
                max="3.5"
                step="0.1"
                value={config.defaultZoomScale}
                onChange={(e) => onChangeConfig({ defaultZoomScale: parseFloat(e.target.value) })}
                className="w-full accent-sky-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1.2x (Subtle)</span>
                <span>2.2x (Cinematic)</span>
                <span>3.5x (Close-Up)</span>
              </div>
            </div>

            <div className="space-y-2.5 glass-panel p-4 rounded-xl">
              <label className="text-xs font-medium text-slate-200">Camera Easing Physics</label>
              <div className="space-y-1.5">
                {easingOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => onChangeConfig({ zoomEasing: opt.id })}
                    className={`w-full p-2.5 rounded-xl text-left transition-all duration-200 flex items-start justify-between ${
                      config.zoomEasing === opt.id
                        ? "bg-[#FF6B2C]/20 border border-[#FF6B2C]/30 text-white shadow-glass-sm"
                        : "bg-white/[0.03] hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    <div>
                      <div className="font-medium text-xs text-white">{opt.name}</div>
                      <div className="text-[10px] text-slate-400">{opt.desc}</div>
                    </div>
                    {config.zoomEasing === opt.id && (
                      <Check className="w-3.5 h-3.5 text-[#FF6B2C] flex-shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 glass-panel p-4 rounded-xl">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-slate-200">Camera Dolly Speed</label>
                <span className="text-[#FF6B2C] font-mono font-bold text-xs">
                  {config.zoomDuration.toFixed(2)}s
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.0"
                step="0.05"
                value={config.zoomDuration}
                onChange={(e) => onChangeConfig({ zoomDuration: parseFloat(e.target.value) })}
                className="w-full accent-sky-400 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* 5. CURSOR & HALO TAB */}
        {activeTab === "cursor" && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-white text-sm">3D Cursor & Luminous Halos</h3>
              <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                Custom pointer graphics floating over the 3D screen with click wave halos.
              </p>
            </div>

            <div className="space-y-2.5 glass-panel p-4 rounded-xl">
              <label className="text-xs font-medium text-slate-200">Cursor Overlay Style</label>
              <div className="grid grid-cols-2 gap-2">
                {cursorStyles.map((cs) => (
                  <button
                    key={cs.id}
                    onClick={() => onChangeConfig({ cursorStyle: cs.id })}
                    className={`p-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                      config.cursorStyle === cs.id
                        ? "bg-[#FF6B2C]/20 text-[#FF8A4C] shadow-glass-sm font-semibold border border-[#FF6B2C]/30"
                        : "bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]"
                    }`}
                  >
                    {cs.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 glass-panel p-4 rounded-xl">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-slate-200">Cursor Size</label>
                <span className="text-[#FF6B2C] font-mono font-bold text-xs">{config.cursorSize}px</span>
              </div>
              <input
                type="range"
                min="14"
                max="36"
                step="2"
                value={config.cursorSize}
                onChange={(e) => onChangeConfig({ cursorSize: parseInt(e.target.value) })}
                className="w-full accent-sky-400 cursor-pointer"
              />
            </div>

            <div className="space-y-3 glass-panel p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-slate-200">Luminous Click Halo Waves</div>
                  <div className="text-[10px] text-slate-400">Expanding glowing rings on click events</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.showRipple}
                  onChange={(e) => onChangeConfig({ showRipple: e.target.checked })}
                  className="w-4 h-4 accent-sky-400 cursor-pointer rounded"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export const LeftSettings = memo(LeftSettingsBase);
