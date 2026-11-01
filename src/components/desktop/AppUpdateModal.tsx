"use client";

import { Download, ExternalLink, Sparkles, X } from "lucide-react";
import { AppReleaseInfo } from "@/hooks/useAppUpdater";
import { desktopBridge } from "@/lib/desktopBridge";

interface AppUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentVersion: string;
  releaseInfo: AppReleaseInfo | null;
  onDownload: () => void;
  isLight?: boolean;
}

export function AppUpdateModal({
  isOpen,
  onClose,
  currentVersion,
  releaseInfo,
  onDownload,
  isLight = false,
}: AppUpdateModalProps) {
  if (!isOpen || !releaseInfo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-200">
      <div
        className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden transition-all animate-in zoom-in-95 duration-200 ${
          isLight
            ? "bg-white border-slate-200 text-slate-900"
            : "bg-[#0B1020] border-white/10 text-white"
        }`}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-slate-200 dark:border-white/10 bg-gradient-to-r from-[#FF6B2C]/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6B2C] text-white flex items-center justify-center shadow-lg shadow-[#FF6B2C]/30 flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">New Update Available!</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF6B2C] text-white">
                  v{releaseInfo.version}
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                Current version: v{currentVersion} • Released {new Date(releaseInfo.publishedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`absolute top-5 right-5 p-2 rounded-xl transition-colors cursor-pointer ${
              isLight
                ? "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                : "text-slate-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Release Notes Body */}
        <div className="p-6 max-h-72 overflow-y-auto space-y-3 text-xs leading-relaxed">
          <h3 className={`font-semibold uppercase tracking-wider text-[11px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>
            What's New in {releaseInfo.name || `v${releaseInfo.version}`}:
          </h3>

          <div
            className={`p-4 rounded-2xl border font-mono whitespace-pre-wrap ${
              isLight
                ? "bg-slate-50 border-slate-200 text-slate-700"
                : "bg-white/[0.03] border-white/10 text-slate-300"
            }`}
          >
            {releaseInfo.body || "Performance improvements, bug fixes, and new features."}
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`p-5 border-t flex items-center justify-between gap-3 ${
          isLight ? "border-slate-200 bg-slate-50" : "border-white/10 bg-white/[0.02]"
        }`}>
          <button
            type="button"
            onClick={() => desktopBridge.openExternal(releaseInfo.htmlUrl)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              isLight
                ? "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                : "text-slate-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <span>View on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                isLight
                  ? "border-slate-200 text-slate-600 hover:bg-slate-100"
                  : "border-white/10 text-slate-300 hover:bg-white/10"
              }`}
            >
              Later
            </button>
            <button
              type="button"
              onClick={() => {
                onDownload();
                onClose();
              }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#FF6B2C] hover:bg-[#E85A1F] text-white text-xs font-bold transition-all shadow-md shadow-[#FF6B2C]/25 cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download & Update</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
