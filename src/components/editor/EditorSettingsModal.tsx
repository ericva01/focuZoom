"use client";

import { useEffect, useState } from "react";
import {
  X,
  Moon,
  Sun,
  Laptop,
  Save,
  Clock,
  HardDrive,
  Trash2,
  Check,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getStorageUsage } from "@/utils/indexedDBStorage";

export type ThemeMode = "dark" | "light" | "system";

interface EditorSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  autoSaveEnabled: boolean;
  onToggleAutoSave: (enabled: boolean) => void;
  autoSaveInterval: number;
  onChangeAutoSaveInterval: (interval: number) => void;
  onSaveNow: () => void;
  onClearCache?: () => void;
}

export function EditorSettingsModal({
  isOpen,
  onClose,
  theme,
  onThemeChange,
  autoSaveEnabled,
  onToggleAutoSave,
  autoSaveInterval,
  onChangeAutoSaveInterval,
  onSaveNow,
  onClearCache,
}: EditorSettingsModalProps) {
  const [storageInfo, setStorageInfo] = useState<{ usedMB: number; quotaMB: number }>({
    usedMB: 0,
    quotaMB: 0,
  });
  const [clearedFeedback, setClearedFeedback] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      getStorageUsage().then(setStorageInfo);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const intervals = [
    { value: 5, label: "5 seconds (Recommended)", desc: "Continuous safety, minimal data loss" },
    { value: 10, label: "10 seconds", desc: "Balanced performance & safety" },
    { value: 30, label: "30 seconds", desc: "Lower background write frequency" },
    { value: 60, label: "1 minute", desc: "Infrequent periodic checkpoint" },
  ];

  const handleClear = () => {
    if (confirm("Are you sure you want to clear cached temporary data? Your active project in the editor will remain.")) {
      if (onClearCache) onClearCache();
      setClearedFeedback(true);
      setTimeout(() => setClearedFeedback(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md p-3 sm:p-4 md:p-6 flex min-h-screen items-center justify-center animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg my-auto rounded-3xl bg-[#090D18]/95 border border-white/15 p-6 shadow-2xl backdrop-blur-2xl text-slate-100 max-h-[calc(100vh-2rem)] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Save className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Editor Settings</h3>
              <p className="text-xs text-slate-400">Appearance, auto-save & local user storage</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-5 space-y-6">
          {/* 1. Theme Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              Theme & Appearance
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => onThemeChange("dark")}
                className={`p-3 rounded-2xl border text-left flex flex-col items-center gap-2 transition-all ${
                  theme === "dark"
                    ? "bg-rose-500/20 border-rose-400/50 text-white shadow-glass-sm"
                    : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                <Moon className={`w-5 h-5 ${theme === "dark" ? "text-rose-400" : ""}`} />
                <span className="text-xs font-bold">Dark Mode</span>
              </button>

              <button
                type="button"
                onClick={() => onThemeChange("light")}
                className={`p-3 rounded-2xl border text-left flex flex-col items-center gap-2 transition-all ${
                  theme === "light"
                    ? "bg-rose-500/20 border-rose-400/50 text-white shadow-glass-sm"
                    : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                <Sun className={`w-5 h-5 ${theme === "light" ? "text-amber-400" : ""}`} />
                <span className="text-xs font-bold">Light Mode</span>
              </button>

              <button
                type="button"
                onClick={() => onThemeChange("system")}
                className={`p-3 rounded-2xl border text-left flex flex-col items-center gap-2 transition-all ${
                  theme === "system"
                    ? "bg-rose-500/20 border-rose-400/50 text-white shadow-glass-sm"
                    : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                <Laptop className={`w-5 h-5 ${theme === "system" ? "text-rose-400" : ""}`} />
                <span className="text-xs font-bold">System</span>
              </button>
            </div>
          </div>

          {/* 2. Auto-Save Configuration */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-rose-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">Auto-Save</h4>
                  <p className="text-[11px] text-slate-400">Save timeline & zoom keyframes automatically</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onToggleAutoSave(!autoSaveEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoSaveEnabled ? "bg-rose-500" : "bg-white/20"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoSaveEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {autoSaveEnabled && (
              <div className="pt-2 border-t border-white/[0.08] space-y-2">
                <label className="block text-[11px] font-semibold text-slate-400">Auto-Save Interval</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {intervals.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => onChangeAutoSaveInterval(item.value)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                        autoSaveInterval === item.value
                          ? "bg-rose-500/20 border-rose-400/50 text-rose-200 font-bold"
                          : "bg-black/30 border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{item.label}</span>
                        {autoSaveInterval === item.value && <Check className="w-3.5 h-3.5 text-rose-400" />}
                      </div>
                      <p className="text-[10px] text-slate-500 font-normal mt-0.5">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. Persistent Local User Storage (IndexedDB) */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="flex items-center gap-2.5">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Local User Storage</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Active (IndexedDB)
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Video blobs and timeline keyframes are preserved on your local drive with zero cloud upload.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/[0.08] text-[11px] text-slate-400 font-mono">
              <span>Disk usage: ~{storageInfo.usedMB} MB</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-white/10 text-slate-400 hover:text-rose-300 hover:border-rose-400/30 transition-all text-xs"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{clearedFeedback ? "Cleared!" : "Clear Cache"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Changes persist automatically</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                onSaveNow();
                onClose();
              }}
            >
              Save Now & Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
