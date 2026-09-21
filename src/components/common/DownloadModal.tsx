"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  Sparkles,
} from "lucide-react";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_TAG = "v0.1.4";
const GITHUB_REPO = "ericva01/focuZoom";
const GITHUB_RELEASES_PAGE = `https://github.com/${GITHUB_REPO}/releases/latest`;

export function DownloadModal({ isOpen, onClose }: DownloadModalProps) {
  const [userOS, setUserOS] = useState<"win" | "mac" | "linux">("win");
  const [activeDownloadOS, setActiveDownloadOS] = useState<"win" | "mac" | "linux">("win");
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [releaseTag, setReleaseTag] = useState<string>(DEFAULT_TAG);
  const [downloadUrls, setDownloadUrls] = useState<{
    win: { url: string; filename: string };
    mac: { url: string; filename: string };
    linux: { url: string; filename: string };
  }>({
    win: {
      url: `https://github.com/${GITHUB_REPO}/releases/download/${DEFAULT_TAG}/FucuFlow_0.1.4_x64-setup.exe`,
      filename: "FucuFlow_0.1.4_x64-setup.exe",
    },
    mac: {
      url: `https://github.com/${GITHUB_REPO}/releases/download/${DEFAULT_TAG}/FucuFlow_0.1.4_aarch64.dmg`,
      filename: "FucuFlow_0.1.4_aarch64.dmg",
    },
    linux: {
      url: `https://github.com/${GITHUB_REPO}/releases/download/${DEFAULT_TAG}/FucuFlow_0.1.4_amd64.AppImage`,
      filename: "FucuFlow_0.1.4_amd64.AppImage",
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = window.navigator.userAgent.toLowerCase();
      if (ua.includes("mac")) {
        setUserOS("mac");
        setActiveDownloadOS("mac");
      } else if (ua.includes("linux")) {
        setUserOS("linux");
        setActiveDownloadOS("linux");
      } else {
        setUserOS("win");
        setActiveDownloadOS("win");
      }
    }
  }, []);

  // Dynamically fetch the latest release from GitHub API so download links always point to the newest version
  useEffect(() => {
    let isMounted = true;
    const fetchLatestRelease = async () => {
      try {
        const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`, {
          headers: { Accept: "application/vnd.github.v3+json" },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!isMounted || !data) return;

        const tag = data.tag_name || DEFAULT_TAG;
        setReleaseTag(tag);

        const assets: Array<{ name: string; browser_download_url: string }> = data.assets || [];
        const winAsset = assets.find((a) => a.name.endsWith(".exe") || a.name.endsWith(".msi"));
        const macAsset = assets.find((a) => a.name.endsWith(".dmg") || a.name.endsWith(".app.tar.gz"));
        const linuxAsset = assets.find((a) => a.name.endsWith(".AppImage") || a.name.endsWith(".deb"));

        setDownloadUrls({
          win: {
            url: winAsset?.browser_download_url || `https://github.com/${GITHUB_REPO}/releases/download/${tag}/FucuFlow_${tag.replace(/^v/, "")}_x64-setup.exe`,
            filename: winAsset?.name || `FucuFlow_${tag.replace(/^v/, "")}_x64-setup.exe`,
          },
          mac: {
            url: macAsset?.browser_download_url || `https://github.com/${GITHUB_REPO}/releases/download/${tag}/FucuFlow_${tag.replace(/^v/, "")}_aarch64.dmg`,
            filename: macAsset?.name || `FucuFlow_${tag.replace(/^v/, "")}_aarch64.dmg`,
          },
          linux: {
            url: linuxAsset?.browser_download_url || `https://github.com/${GITHUB_REPO}/releases/download/${tag}/FucuFlow_${tag.replace(/^v/, "")}_amd64.AppImage`,
            filename: linuxAsset?.name || `FucuFlow_${tag.replace(/^v/, "")}_amd64.AppImage`,
          },
        });
      } catch (err) {
        console.warn("[FucuFlow] Could not fetch latest release info:", err);
      }
    };

    fetchLatestRelease();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownload = (os: "win" | "mac" | "linux") => {
    setActiveDownloadOS(os);
    const target = downloadUrls[os];

    const link = document.createElement("a");
    link.href = target.url;
    link.setAttribute("download", target.filename);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadStarted(true);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-3 sm:p-4 md:p-6 flex min-h-screen items-center justify-center animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-lg sm:max-w-xl my-auto rounded-3xl bg-white border border-[#E5E7EB] shadow-[0_25px_70px_rgba(0,0,0,0.25)] p-6 sm:p-8 text-[#111318] max-h-[calc(100vh-2rem)] overflow-y-auto select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 rounded-xl text-[#667085] hover:text-[#111318] hover:bg-[#F8F9FB] border border-transparent hover:border-[#E5E7EB] transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
            <a
              href={GITHUB_RELEASES_PAGE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/25 text-xs font-mono font-bold text-[#FF6B2C] hover:bg-[#FFE6D6] transition-all cursor-pointer group"
            >
              <span className="w-2 h-2 rounded-full bg-[#FF6B2C] animate-pulse" />
              <span>NATIVE DESKTOP {releaseTag}</span>
              <ExternalLink className="w-3 h-3 text-[#FF6B2C] group-hover:translate-x-0.5 transition-transform" />
            </a>

            <a
              href={GITHUB_RELEASES_PAGE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center transition-opacity hover:opacity-85"
              title="Live Download Count from GitHub"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://img.shields.io/github/downloads/ericva01/focuZoom/total?style=flat&color=FF6B2C&labelColor=111318&label=Downloads"
                alt="Total Downloads"
                className="h-[22px] rounded-md shadow-2xs"
              />
            </a>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111318] tracking-tight">
            Download FucuFlow Desktop
          </h3>
          <p className="text-[#667085] text-xs sm:text-sm mt-1.5 max-w-md mx-auto leading-relaxed">
            Experience 100% offline recording, local hardware acceleration, and automated 3D camera zooms directly on your device.
          </p>
        </div>

        {/* Download Trigger Confirmation Alert */}
        {downloadStarted && (
          <div className="mb-5 p-4 rounded-2xl bg-[#FFF1E8] border border-[#FF6B2C]/30 flex items-start justify-between gap-3 text-left animate-in slide-in-from-top-2">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#FF6B2C] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[#111318]">
                  Your download has started!
                </p>
                <p className="text-xs text-[#667085] mt-1 leading-relaxed">
                  {activeDownloadOS === "win" && (
                    <>Run <code className="text-[#111318] font-bold font-mono bg-white px-1.5 py-0.5 rounded border border-[#E5E7EB]">{downloadUrls.win.filename}</code> once finished to install.</>
                  )}
                  {activeDownloadOS === "mac" && (
                    <>Open <code className="text-[#111318] font-bold font-mono bg-white px-1.5 py-0.5 rounded border border-[#E5E7EB]">{downloadUrls.mac.filename}</code> and drag FucuFlow to Applications.</>
                  )}
                  {activeDownloadOS === "linux" && (
                    <>Run in terminal: <code className="text-[#111318] font-bold font-mono bg-white px-1.5 py-0.5 rounded border border-[#E5E7EB]">chmod +x FucuFlow*.AppImage && ./FucuFlow*.AppImage</code></>
                  )}
                </p>
              </div>
            </div>
            <a
              href={GITHUB_RELEASES_PAGE}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#FF6B2C] hover:text-[#E85A1F] underline shrink-0 font-mono"
            >
              GitHub
            </a>
          </div>
        )}

        {/* Primary Recommended Download Button */}
        <div className="mb-5">
          <button
            onClick={() => handleDownload(userOS)}
            className="w-full flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#FF6B2C] text-white hover:bg-[#E85A1F] shadow-[0_8px_20px_rgba(255,107,44,0.3)] hover:shadow-[0_12px_28px_rgba(255,107,44,0.4)] transition-all group cursor-pointer active:scale-[0.98]"
          >
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0">
                {userOS === "win" && <Monitor className="w-6 h-6 text-white" />}
                {userOS === "mac" && <Apple className="w-6 h-6 text-white" />}
                {userOS === "linux" && <Terminal className="w-6 h-6 text-white" />}
              </div>
              <div>
                <div className="text-[10px] font-mono text-white/80 font-bold uppercase tracking-wider">
                  OFFICIAL INSTALLER ({releaseTag})
                </div>
                <div className="text-base sm:text-lg font-bold text-white leading-tight">
                  {userOS === "win"
                    ? "Download for Windows (.exe)"
                    : userOS === "mac"
                    ? "Download for macOS (.dmg)"
                    : "Download for Linux (.AppImage)"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pr-1">
              <span className="text-xs font-mono font-bold text-white bg-white/20 px-2.5 py-1 rounded-full hidden sm:inline">
                {releaseTag}
              </span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-[#FF6B2C] group-hover:scale-105 flex items-center justify-center transition-transform shrink-0 shadow-sm">
                <Download className="w-4 h-4 text-[#FF6B2C]" />
              </div>
            </div>
          </button>

          <div className="mt-2.5 text-center">
            <a
              href={GITHUB_RELEASES_PAGE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#667085] hover:text-[#FF6B2C] transition-colors"
            >
              <span>Or view release details & all platform assets on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#667085]" />
            </a>
          </div>
        </div>

        {/* Other Platform Options */}
        <div className="pt-4 border-t border-[#E5E7EB]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#667085] mb-3 text-center">
            All Available Platforms
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {/* Windows */}
            <button
              onClick={() => handleDownload("win")}
              className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                activeDownloadOS === "win"
                  ? "bg-[#FFF1E8] border-2 border-[#FF6B2C] text-[#111318] shadow-xs"
                  : "bg-[#F8F9FB] border-[#E5E7EB] text-[#667085] hover:text-[#111318] hover:bg-white hover:border-[#D1D5DB]"
              }`}
            >
              <Monitor className={`w-5 h-5 ${activeDownloadOS === "win" ? "text-[#FF6B2C]" : "text-[#667085]"}`} />
              <span className="text-xs font-bold">Windows</span>
              <span className="text-[10px] font-mono text-[#667085]">.exe (64-bit)</span>
            </button>

            {/* macOS */}
            <button
              onClick={() => handleDownload("mac")}
              className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                activeDownloadOS === "mac"
                  ? "bg-[#FFF1E8] border-2 border-[#FF6B2C] text-[#111318] shadow-xs"
                  : "bg-[#F8F9FB] border-[#E5E7EB] text-[#667085] hover:text-[#111318] hover:bg-white hover:border-[#D1D5DB]"
              }`}
            >
              <Apple className={`w-5 h-5 ${activeDownloadOS === "mac" ? "text-[#FF6B2C]" : "text-[#667085]"}`} />
              <span className="text-xs font-bold">macOS</span>
              <span className="text-[10px] font-mono text-[#667085]">.dmg (Universal)</span>
            </button>

            {/* Linux */}
            <button
              onClick={() => handleDownload("linux")}
              className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                activeDownloadOS === "linux"
                  ? "bg-[#FFF1E8] border-2 border-[#FF6B2C] text-[#111318] shadow-xs"
                  : "bg-[#F8F9FB] border-[#E5E7EB] text-[#667085] hover:text-[#111318] hover:bg-white hover:border-[#D1D5DB]"
              }`}
            >
              <Terminal className={`w-5 h-5 ${activeDownloadOS === "linux" ? "text-[#FF6B2C]" : "text-[#667085]"}`} />
              <span className="text-xs font-bold">Linux</span>
              <span className="text-[10px] font-mono text-[#667085]">.AppImage</span>
            </button>
          </div>

          {/* Link to all releases page */}
          <div className="mt-3.5 text-center">
            <Link
              href="/download"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF6B2C] hover:text-[#E85A1F] transition-colors"
            >
              <span>View all releases, architectures & changelog</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>

        {/* Feature badges */}
        <div className="mt-5 pt-4 border-t border-[#E5E7EB] flex items-center justify-around text-xs font-medium text-[#667085]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#FF6B2C]" />
            <span>100% Offline & Local</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#FF6B2C]" />
            <span>GPU Accelerated</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#FF6B2C]" />
            <span>MIT Open Source</span>
          </span>
        </div>
      </div>
    </div>
  );
}
