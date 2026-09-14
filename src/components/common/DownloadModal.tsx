"use client";

import { useState, useEffect } from "react";
import {
  Download,
  Monitor,
  Apple,
  Terminal,
  CheckCircle2,
  X,
  ShieldCheck,
  Zap,
  ExternalLink,
} from "lucide-react";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GITHUB_RELEASE_DOWNLOAD =
  process.env.NEXT_PUBLIC_DOWNLOAD_URL ||
  "https://github.com/ericva01/focuZoom/releases/download/v0.1.1/Glideo_0.1.0_x64-setup.exe";
const GITHUB_RELEASES_PAGE = "https://github.com/ericva01/focuZoom/releases/tag/v0.1.1";

export function DownloadModal({ isOpen, onClose }: DownloadModalProps) {
  const [userOS, setUserOS] = useState<"win" | "mac" | "linux">("win");
  const [downloadStarted, setDownloadStarted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = window.navigator.userAgent.toLowerCase();
      if (ua.includes("mac")) setUserOS("mac");
      else if (ua.includes("linux")) setUserOS("linux");
      else setUserOS("win");
    }
  }, []);

  if (!isOpen) return null;

  const handleDownload = (os: "win" | "mac" | "linux") => {
    if (os === "win") {
      // In local dev use local file if present, in production/Vercel use GitHub Release binary
      const isLocal =
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1");

      const downloadUrl = isLocal
        ? "/downloads/Glideo_0.1.0_x64-setup.exe"
        : GITHUB_RELEASE_DOWNLOAD;

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", "Glideo_0.1.0_x64-setup.exe");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadStarted(true);
    } else {
      window.open(GITHUB_RELEASES_PAGE, "_blank");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl rounded-3xl bg-[#080D1A]/95 border border-white/10 shadow-[0_20px_70px_rgba(0,0,0,0.9)] p-6 sm:p-8 overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient celestial top aura */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-36 bg-gradient-to-b from-rose-400/20 via-indigo-500/10 to-transparent blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <a
            href={GITHUB_RELEASES_PAGE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-400/20 text-xs font-mono text-rose-300 mb-3 hover:bg-rose-500/20 hover:border-rose-400/40 transition-all cursor-pointer group"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            <span>NATIVE DESKTOP EDITION (v0.1.1)</span>
            <ExternalLink className="w-3 h-3 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Download Glideo
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5 max-w-md mx-auto">
            Experience 100% offline video editing, local GPU acceleration, and automated 3D cinematic camera zooms on your desktop.
          </p>
        </div>

        {/* Download Trigger Confirmation Badge */}
        {downloadStarted && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-between gap-3 text-left animate-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-emerald-200">
                  Your download has started!
                </p>
                <p className="text-[11px] text-slate-400">
                  Run <code className="text-white font-mono">Glideo_0.1.0_x64-setup.exe</code> (9.5 MB) once completed to install on your PC.
                </p>
              </div>
            </div>
            <a
              href={GITHUB_RELEASES_PAGE}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-rose-400 hover:text-rose-300 underline font-mono flex items-center gap-1 flex-shrink-0"
            >
              <span>GitHub Release</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Primary Recommended Download Button */}
        <div className="mb-6">
          <button
            onClick={() => handleDownload(userOS)}
            className="w-full flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-white text-black hover:bg-slate-100 shadow-[0_0_35px_rgba(255,255,255,0.3)] hover:shadow-[0_0_45px_rgba(255,255,255,0.5)] transition-all group cursor-pointer active:scale-[0.98]"
          >
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                {userOS === "win" && <Monitor className="w-5 h-5 text-rose-400" />}
                {userOS === "mac" && <Apple className="w-5 h-5 text-white" />}
                {userOS === "linux" && <Terminal className="w-5 h-5 text-emerald-400" />}
              </div>
              <div>
                <div className="text-xs font-mono text-slate-500 uppercase">
                  Official Installer (v0.1.1)
                </div>
                <div className="text-base font-bold text-slate-950">
                  {userOS === "win"
                    ? "Download for Windows (.exe)"
                    : userOS === "mac"
                    ? "Download for macOS (.dmg)"
                    : "Download for Linux (.AppImage)"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pr-2">
              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 hidden sm:inline">
                {userOS === "win" ? "9.5 MB" : "Package"}
              </span>
              <div className="w-8 h-8 rounded-full bg-slate-200 group-hover:bg-slate-300 flex items-center justify-center transition-colors">
                <Download className="w-4 h-4 text-black" />
              </div>
            </div>
          </button>

          <div className="mt-2.5 text-center">
            <a
              href={GITHUB_RELEASES_PAGE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-300 transition-colors"
            >
              <span>Or view release details & all assets on GitHub</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>
        </div>

        {/* Other Platform Options */}
        <div className="pt-4 border-t border-white/10">
          <div className="text-[11px] font-mono text-slate-400 uppercase mb-3 text-center">
            All Available Platforms
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {/* Windows */}
            <button
              onClick={() => handleDownload("win")}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                userOS === "win"
                  ? "bg-rose-500/10 border-rose-400/40 text-white"
                  : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              <Monitor className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-semibold">Windows</span>
              <span className="text-[10px] font-mono text-slate-400">.exe (64-bit)</span>
            </button>

            {/* macOS */}
            <button
              onClick={() => handleDownload("mac")}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                userOS === "mac"
                  ? "bg-rose-500/10 border-rose-400/40 text-white"
                  : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              <Apple className="w-4 h-4 text-white" />
              <span className="text-xs font-semibold">macOS</span>
              <span className="text-[10px] font-mono text-slate-400">.dmg (Universal)</span>
            </button>

            {/* Linux */}
            <button
              onClick={() => handleDownload("linux")}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                userOS === "linux"
                  ? "bg-rose-500/10 border-rose-400/40 text-white"
                  : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold">Linux</span>
              <span className="text-[10px] font-mono text-slate-400">.AppImage</span>
            </button>
          </div>
        </div>

        {/* GitHub Releases & Source Link */}
        <div className="mt-4 pt-3 border-t border-white/[0.06] text-center">
          <a
            href={GITHUB_RELEASES_PAGE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-300 transition-colors group"
          >
            <span>View release assets, checksums & changelog on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-300 transition-colors" />
          </a>
        </div>

        {/* Feature badges */}
        <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-around text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Offline</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>GPU Accelerated</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5 text-rose-400" />
            <span>Cross-Platform</span>
          </span>
        </div>
      </div>
    </div>
  );
}
