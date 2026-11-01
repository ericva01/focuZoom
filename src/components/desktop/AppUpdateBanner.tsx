"use client";

import { Download, Sparkles, X } from "lucide-react";
import { AppReleaseInfo } from "@/hooks/useAppUpdater";

interface AppUpdateBannerProps {
  releaseInfo: AppReleaseInfo | null;
  onOpenDetails: () => void;
  onDownload: () => void;
  onDismiss: () => void;
  isLight?: boolean;
}

export function AppUpdateBanner({
  releaseInfo,
  onOpenDetails,
  onDownload,
  onDismiss,
  isLight = false,
}: AppUpdateBannerProps) {
  if (!releaseInfo) return null;

  return (
    <div
      className={`relative flex items-center justify-between gap-4 p-4 rounded-2xl border transition-all animate-in slide-in-from-top-2 duration-300 shadow-md ${
        isLight
          ? "bg-gradient-to-r from-[#FFF1E8] via-white to-[#FFF1E8] border-[#FF6B2C]/30 text-slate-900"
          : "bg-gradient-to-r from-[#FF6B2C]/20 via-[#0B1020] to-[#FF6B2C]/10 border-[#FF6B2C]/40 text-white"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-[#FF6B2C] text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-[#FF6B2C]/40">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold">A new version of FucuFlow is ready!</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF6B2C] text-white">
              v{releaseInfo.version}
            </span>
          </div>
          <p className={`text-[11px] truncate mt-0.5 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
            {releaseInfo.name || "Includes performance improvements and bug fixes."}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={onOpenDetails}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
            isLight
              ? "border-slate-300 hover:bg-slate-100 text-slate-700"
              : "border-white/20 hover:bg-white/10 text-slate-200"
          }`}
        >
          What's New
        </button>

        <button
          type="button"
          onClick={onDownload}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FF6B2C] hover:bg-[#E85A1F] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Update Now</span>
        </button>

        <button
          type="button"
          onClick={onDismiss}
          title="Dismiss update notice"
          className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
            isLight
              ? "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              : "text-slate-400 hover:text-white hover:bg-white/10"
          }`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
