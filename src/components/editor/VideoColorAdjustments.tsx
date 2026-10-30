"use client";

import React, { memo } from "react";
import {
  SunMedium,
  Sparkles,
  RotateCcw,
  Sliders,
  Palette,
  Thermometer,
  Flame,
  Droplets,
} from "lucide-react";
import { CanvasConfig } from "@/types/editor";

interface VideoColorAdjustmentsProps {
  config: CanvasConfig;
  onChangeConfig: (newConfig: Partial<CanvasConfig>) => void;
  compact?: boolean;
}

export const VideoColorAdjustments = memo(function VideoColorAdjustments({
  config,
  onChangeConfig,
  compact = false,
}: VideoColorAdjustmentsProps) {
  const brightness = config.videoBrightness ?? 1.0;
  const contrast = config.videoContrast ?? 1.0;
  const saturation = config.videoSaturation ?? 1.0;
  const temperature = config.videoTemperature ?? 0.0;
  const tint = config.videoTint ?? 0.0;

  const isModified =
    Math.abs(brightness - 1.0) > 0.01 ||
    Math.abs(contrast - 1.0) > 0.01 ||
    Math.abs(saturation - 1.0) > 0.01 ||
    Math.abs(temperature - 0.0) > 0.01 ||
    Math.abs(tint - 0.0) > 0.01;

  const resetAll = () => {
    onChangeConfig({
      videoBrightness: 1.0,
      videoContrast: 1.0,
      videoSaturation: 1.0,
      videoTemperature: 0.0,
      videoTint: 0.0,
    });
  };

  const presets = [
    {
      name: "Natural",
      b: 1.0,
      c: 1.0,
      s: 1.0,
      temp: 0.0,
      tint: 0.0,
      icon: "☀️",
    },
    {
      name: "Fix Dark (+25%)",
      b: 1.25,
      c: 1.08,
      s: 1.1,
      temp: 0.0,
      tint: 0.0,
      icon: "⚡",
    },
    {
      name: "Super Bright",
      b: 1.45,
      c: 1.15,
      s: 1.15,
      temp: 0.0,
      tint: 0.0,
      icon: "💡",
    },
    {
      name: "Warm Sunlight",
      b: 1.15,
      c: 1.05,
      s: 1.2,
      temp: 0.38,
      tint: 0.0,
      icon: "🌅",
    },
    {
      name: "Cool Studio",
      b: 1.15,
      c: 1.05,
      s: 1.1,
      temp: -0.35,
      tint: 0.05,
      icon: "❄️",
    },
    {
      name: "Vivid / Pop",
      b: 1.2,
      c: 1.25,
      s: 1.35,
      temp: 0.0,
      tint: 0.0,
      icon: "🎨",
    },
  ];

  return (
    <div className="glass-panel p-4 rounded-xl space-y-3.5 border-l-2 border-l-[#FF6B2C] select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#FF6B2C]/15 flex items-center justify-center text-[#FF6B2C]">
            <SunMedium className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-800 dark:text-white block">
                Color, Brightness &amp; White Balance
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-500 font-mono">
                GPU 60fps
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Fix dark screen recordings, boost clarity &amp; tune warm/cool tones
            </p>
          </div>
        </div>

        {isModified && (
          <button
            type="button"
            onClick={resetAll}
            className="flex items-center gap-1 text-[10px] text-[#FF6B2C] hover:text-[#ff8a4c] font-medium px-2 py-0.5 rounded-md hover:bg-[#FF6B2C]/10 transition-colors"
            title="Reset all color and white balance settings to default"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 1-Click Quick Presets */}
      <div>
        <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#FF6B2C]" />
          <span>Quick 1-Click Presets</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {presets.map((preset) => {
            const isCurrent =
              Math.abs(brightness - preset.b) < 0.04 &&
              Math.abs(contrast - preset.c) < 0.04 &&
              Math.abs(saturation - preset.s) < 0.04 &&
              Math.abs(temperature - preset.temp) < 0.05 &&
              Math.abs(tint - preset.tint) < 0.05;

            return (
              <button
                key={preset.name}
                type="button"
                onClick={() =>
                  onChangeConfig({
                    videoBrightness: preset.b,
                    videoContrast: preset.c,
                    videoSaturation: preset.s,
                    videoTemperature: preset.temp,
                    videoTint: preset.tint,
                  })
                }
                className={`py-1.5 px-2 rounded-lg text-[10px] font-medium flex items-center justify-center gap-1 transition-all border ${
                  isCurrent
                    ? "bg-[#FF6B2C] text-white border-[#FF6B2C] shadow-sm font-semibold"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:text-slate-300 dark:border-white/10"
                }`}
              >
                <span>{preset.icon}</span>
                <span className="truncate">{preset.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-slate-200 dark:bg-white/[0.06] my-1" />

      {/* Sliders Group 1: Brightness & Contrast */}
      <div className="space-y-2.5">
        {/* Brightness */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-700 dark:text-slate-300 text-[11px] font-medium flex items-center gap-1">
              <SunMedium className="w-3 h-3 text-amber-500" />
              <span>Brightness (Exposure)</span>
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[#FF6B2C] font-bold text-[11px]">
                {Math.round(brightness * 100)}%
              </span>
              {Math.abs(brightness - 1.0) > 0.01 && (
                <button
                  type="button"
                  onClick={() => onChangeConfig({ videoBrightness: 1.0 })}
                  className="text-[9px] text-slate-400 hover:text-white"
                  title="Reset Brightness"
                >
                  ↺
                </button>
              )}
            </div>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.02"
            value={brightness}
            onChange={(e) =>
              onChangeConfig({ videoBrightness: parseFloat(e.target.value) })
            }
            className="w-full accent-[#FF6B2C] cursor-pointer h-1.5 bg-slate-200 dark:bg-white/10 rounded"
          />
          <div className="flex justify-between text-[9px] text-slate-400 font-mono px-0.5">
            <span>50% (Dark)</span>
            <span>100% (Normal)</span>
            <span>200% (Max)</span>
          </div>
        </div>

        {/* Contrast */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-700 dark:text-slate-300 text-[11px] font-medium flex items-center gap-1">
              <Sliders className="w-3 h-3 text-indigo-400" />
              <span>Contrast (Dynamic Range)</span>
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[#FF6B2C] font-bold text-[11px]">
                {Math.round(contrast * 100)}%
              </span>
              {Math.abs(contrast - 1.0) > 0.01 && (
                <button
                  type="button"
                  onClick={() => onChangeConfig({ videoContrast: 1.0 })}
                  className="text-[9px] text-slate-400 hover:text-white"
                  title="Reset Contrast"
                >
                  ↺
                </button>
              )}
            </div>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.02"
            value={contrast}
            onChange={(e) =>
              onChangeConfig({ videoContrast: parseFloat(e.target.value) })
            }
            className="w-full accent-[#FF6B2C] cursor-pointer h-1.5 bg-slate-200 dark:bg-white/10 rounded"
          />
        </div>

        {/* Saturation / Color */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-700 dark:text-slate-300 text-[11px] font-medium flex items-center gap-1">
              <Palette className="w-3 h-3 text-pink-500" />
              <span>Color Saturation (Vibrance)</span>
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[#FF6B2C] font-bold text-[11px]">
                {Math.round(saturation * 100)}%
              </span>
              {Math.abs(saturation - 1.0) > 0.01 && (
                <button
                  type="button"
                  onClick={() => onChangeConfig({ videoSaturation: 1.0 })}
                  className="text-[9px] text-slate-400 hover:text-white"
                  title="Reset Saturation"
                >
                  ↺
                </button>
              )}
            </div>
          </div>
          <input
            type="range"
            min="0.0"
            max="2.0"
            step="0.02"
            value={saturation}
            onChange={(e) =>
              onChangeConfig({ videoSaturation: parseFloat(e.target.value) })
            }
            className="w-full accent-[#FF6B2C] cursor-pointer h-1.5 bg-slate-200 dark:bg-white/10 rounded"
          />
          <div className="flex justify-between text-[9px] text-slate-400 font-mono px-0.5">
            <span>0% (B&amp;W)</span>
            <span>100% (Natural)</span>
            <span>200% (Vivid)</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-200 dark:bg-white/[0.06] my-1" />

      {/* Sliders Group 2: White Balance (Temperature & Tint) */}
      <div className="space-y-2.5">
        <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 flex items-center gap-1">
          <Thermometer className="w-3 h-3 text-cyan-400" />
          <span>White Balance &amp; Tones</span>
        </div>

        {/* Temperature: Cool (-1.0) to Warm (+1.0) */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-700 dark:text-slate-300 text-[11px] font-medium flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-500" />
              <span>Color Temperature (Warm / Cool)</span>
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={`font-mono font-bold text-[11px] ${
                  temperature > 0.05
                    ? "text-amber-500"
                    : temperature < -0.05
                    ? "text-sky-400"
                    : "text-slate-400"
                }`}
              >
                {temperature > 0.05
                  ? `+${Math.round(temperature * 100)} Warm`
                  : temperature < -0.05
                  ? `${Math.round(temperature * 100)} Cool`
                  : "Neutral"}
              </span>
              {Math.abs(temperature) > 0.01 && (
                <button
                  type="button"
                  onClick={() => onChangeConfig({ videoTemperature: 0.0 })}
                  className="text-[9px] text-slate-400 hover:text-white"
                  title="Reset Temperature"
                >
                  ↺
                </button>
              )}
            </div>
          </div>
          <div className="relative flex items-center">
            <input
              type="range"
              min="-1.0"
              max="1.0"
              step="0.02"
              value={temperature}
              onChange={(e) =>
                onChangeConfig({ videoTemperature: parseFloat(e.target.value) })
              }
              className="w-full cursor-pointer h-2 rounded appearance-none outline-none"
              style={{
                background:
                  "linear-gradient(to right, #38bdf8 0%, #cbd5e1 50%, #f59e0b 100%)",
              }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-slate-400 font-mono px-0.5">
            <span className="text-sky-400">Cool (Blue)</span>
            <span>Neutral</span>
            <span className="text-amber-500">Warm (Amber)</span>
          </div>
        </div>

        {/* Tint: Green (-1.0) to Magenta (+1.0) */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-700 dark:text-slate-300 text-[11px] font-medium flex items-center gap-1">
              <Droplets className="w-3 h-3 text-emerald-400" />
              <span>Tint (Green / Magenta)</span>
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={`font-mono font-bold text-[11px] ${
                  tint > 0.05
                    ? "text-fuchsia-400"
                    : tint < -0.05
                    ? "text-emerald-400"
                    : "text-slate-400"
                }`}
              >
                {tint > 0.05
                  ? `+${Math.round(tint * 100)} Magenta`
                  : tint < -0.05
                  ? `${Math.round(tint * 100)} Green`
                  : "Neutral"}
              </span>
              {Math.abs(tint) > 0.01 && (
                <button
                  type="button"
                  onClick={() => onChangeConfig({ videoTint: 0.0 })}
                  className="text-[9px] text-slate-400 hover:text-white"
                  title="Reset Tint"
                >
                  ↺
                </button>
              )}
            </div>
          </div>
          <div className="relative flex items-center">
            <input
              type="range"
              min="-1.0"
              max="1.0"
              step="0.02"
              value={tint}
              onChange={(e) =>
                onChangeConfig({ videoTint: parseFloat(e.target.value) })
              }
              className="w-full cursor-pointer h-2 rounded appearance-none outline-none"
              style={{
                background:
                  "linear-gradient(to right, #10b981 0%, #cbd5e1 50%, #ec4899 100%)",
              }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-slate-400 font-mono px-0.5">
            <span className="text-emerald-400">Green</span>
            <span>Neutral</span>
            <span className="text-fuchsia-400">Magenta</span>
          </div>
        </div>
      </div>
    </div>
  );
});
