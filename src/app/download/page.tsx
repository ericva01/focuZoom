"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { useLanguage } from "@/context/LanguageContext";
import {
  Download,
  Monitor,
  Apple,
  Terminal,
  ShieldCheck,
  Zap,
  Code2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  RefreshCw,
  Calendar,
  HardDrive,
  FileCode,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
} from "lucide-react";

interface ReleaseAsset {
  id: number;
  name: string;
  size: number;
  download_count: number;
  browser_download_url: string;
  created_at: string;
}

interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  published_at: string;
  body: string;
  prerelease: boolean;
  html_url: string;
  assets: ReleaseAsset[];
}

const GITHUB_REPO = "ericva01/focuZoom";
const CACHE_KEY = "fucuflow_github_releases_v2";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

// Hardcoded fallback data in case GitHub API rate limits or user is offline
const FALLBACK_RELEASES: GitHubRelease[] = [
  {
    id: 1,
    tag_name: "v0.1.4",
    name: "FucuFlow v0.1.4",
    published_at: "2026-09-21T08:11:29Z",
    prerelease: false,
    html_url: `https://github.com/${GITHUB_REPO}/releases/tag/v0.1.4`,
    body: `### FucuFlow v0.1.4 Release
- Rebranding to FucuFlow studio suite
- Light & dark mode full high-contrast theme support
- Ultra-smooth camera smoothing and sticky anchor locks for rapid clicks
- Timeline overlapping animation auto-grouping into segmented visual tracks
- Multi-track trimmer with precision scrubbing`,
    assets: [
      {
        id: 101,
        name: "FucuFlow_0.1.0_x64-setup.exe",
        size: 6510370,
        download_count: 1,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.4/FucuFlow_0.1.0_x64-setup.exe`,
        created_at: "2026-09-21T08:11:29Z",
      },
      {
        id: 102,
        name: "FucuFlow_0.1.0_x64_en-US.msi",
        size: 7905280,
        download_count: 0,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.4/FucuFlow_0.1.0_x64_en-US.msi`,
        created_at: "2026-09-21T08:11:29Z",
      },
      {
        id: 103,
        name: "FucuFlow_0.1.0_aarch64.dmg",
        size: 8770694,
        download_count: 0,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.4/FucuFlow_0.1.0_aarch64.dmg`,
        created_at: "2026-09-21T08:11:29Z",
      },
      {
        id: 104,
        name: "FucuFlow_0.1.0_x64.dmg",
        size: 8882212,
        download_count: 0,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.4/FucuFlow_0.1.0_x64.dmg`,
        created_at: "2026-09-21T08:11:29Z",
      },
      {
        id: 105,
        name: "FucuFlow_0.1.0_amd64.AppImage",
        size: 98179576,
        download_count: 0,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.4/FucuFlow_0.1.0_amd64.AppImage`,
        created_at: "2026-09-21T08:11:29Z",
      },
      {
        id: 106,
        name: "FucuFlow_0.1.0_amd64.deb",
        size: 9258278,
        download_count: 0,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.4/FucuFlow_0.1.0_amd64.deb`,
        created_at: "2026-09-21T08:11:29Z",
      },
      {
        id: 107,
        name: "FucuFlow-0.1.0-1.x86_64.rpm",
        size: 9259723,
        download_count: 0,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.4/FucuFlow-0.1.0-1.x86_64.rpm`,
        created_at: "2026-09-21T08:11:29Z",
      },
    ],
  },
  {
    id: 2,
    tag_name: "v0.1.3",
    name: "FucuFlow v0.1.3",
    published_at: "2026-09-21T03:50:48Z",
    prerelease: false,
    html_url: `https://github.com/${GITHUB_REPO}/releases/tag/v0.1.3`,
    body: `### FucuFlow v0.1.3 Release
- Cross-platform macOS universal build workflow
- Improved screen recording framerate stability
- Interactive canvas zoom handles`,
    assets: [
      {
        id: 201,
        name: "FucuFlow_0.1.0_x64-setup.exe",
        size: 6495374,
        download_count: 1,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.3/FucuFlow_0.1.0_x64-setup.exe`,
        created_at: "2026-09-21T03:50:48Z",
      },
      {
        id: 202,
        name: "FucuFlow_0.1.0_aarch64.dmg",
        size: 8758987,
        download_count: 0,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.3/FucuFlow_0.1.0_aarch64.dmg`,
        created_at: "2026-09-21T03:50:48Z",
      },
      {
        id: 203,
        name: "FucuFlow_0.1.0_amd64.AppImage",
        size: 98171384,
        download_count: 0,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.3/FucuFlow_0.1.0_amd64.AppImage`,
        created_at: "2026-09-21T03:50:48Z",
      },
      {
        id: 204,
        name: "FucuFlow_0.1.0_amd64.deb",
        size: 9245426,
        download_count: 0,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.3/FucuFlow_0.1.0_amd64.deb`,
        created_at: "2026-09-21T03:50:48Z",
      },
    ],
  },
  {
    id: 3,
    tag_name: "v0.1.2",
    name: "FucuFlow v0.1.2",
    published_at: "2026-09-19T02:14:23Z",
    prerelease: false,
    html_url: `https://github.com/${GITHUB_REPO}/releases/tag/v0.1.2`,
    body: `### FucuFlow v0.1.2 Release
- Enhanced camera choreography and spring dynamics
- WebGL GPU canvas acceleration
- Local file project export`,
    assets: [
      {
        id: 301,
        name: "FucuFlow_0.1.0_x64-setup.exe",
        size: 7681841,
        download_count: 0,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.2/FucuFlow_0.1.0_x64-setup.exe`,
        created_at: "2026-09-19T02:14:23Z",
      },
      {
        id: 302,
        name: "FucuFlow_0.1.0_aarch64.dmg",
        size: 10557052,
        download_count: 0,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.2/FucuFlow_0.1.0_aarch64.dmg`,
        created_at: "2026-09-19T02:14:23Z",
      },
      {
        id: 303,
        name: "FucuFlow_0.1.0_amd64.AppImage",
        size: 98806264,
        download_count: 1,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.2/FucuFlow_0.1.0_amd64.AppImage`,
        created_at: "2026-09-19T02:14:23Z",
      },
    ],
  },
  {
    id: 4,
    tag_name: "v0.1.1",
    name: "FucuFlow v0.1.0 - Initial Release",
    published_at: "2026-09-14T03:39:18Z",
    prerelease: false,
    html_url: `https://github.com/${GITHUB_REPO}/releases/tag/v0.1.1`,
    body: `### What's New
- Autonomous click-to-zoom camera choreography
- Critically damped spring cursor tracking
- 3D perspective stage framing & WebGL GPU rendering
- Zero-cloud local in-browser processing`,
    assets: [
      {
        id: 401,
        name: "FucuFlow_0.1.0_x64-setup.exe",
        size: 9953955,
        download_count: 6,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.1/FucuFlow_0.1.0_x64-setup.exe`,
        created_at: "2026-09-14T03:39:18Z",
      },
      {
        id: 402,
        name: "FucuFlow_0.1.0_x64_en-US.msi",
        size: 18857984,
        download_count: 0,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.1/FucuFlow_0.1.0_x64_en-US.msi`,
        created_at: "2026-09-14T03:39:18Z",
      },
    ],
  },
];

function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return "0 MB";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return isoString;
  }
}

type PlatformType = "win" | "mac" | "linux" | "other";

function getAssetPlatform(filename: string): PlatformType {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".exe") || lower.endsWith(".msi")) return "win";
  if (lower.endsWith(".dmg") || lower.includes("aarch64") || lower.includes("x64.app")) return "mac";
  if (lower.endsWith(".appimage") || lower.endsWith(".deb") || lower.endsWith(".rpm")) return "linux";
  return "other";
}

function getPlatformIcon(platform: PlatformType) {
  switch (platform) {
    case "win":
      return <Monitor className="w-4 h-4 text-blue-500" />;
    case "mac":
      return <Apple className="w-4 h-4 text-slate-800" />;
    case "linux":
      return <Terminal className="w-4 h-4 text-emerald-600" />;
    default:
      return <FileCode className="w-4 h-4 text-gray-500" />;
  }
}

export default function DownloadPage() {
  const { t, isKhmer, localePath } = useLanguage();
  const [releases, setReleases] = useState<GitHubRelease[]>(FALLBACK_RELEASES);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userOS, setUserOS] = useState<PlatformType>("win");
  const [macArch, setMacArch] = useState<"arm" | "intel">("arm");
  const [selectedOSFilter, setSelectedOSFilter] = useState<"all" | "win" | "mac" | "linux">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedChangelogs, setExpandedChangelogs] = useState<Record<string, boolean>>({});
  const [activeInstructionTab, setActiveInstructionTab] = useState<PlatformType>("win");

  // Detect Client Operating System
  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = window.navigator.userAgent.toLowerCase();
      if (ua.includes("mac")) {
        setUserOS("mac");
        setActiveInstructionTab("mac");
      } else if (ua.includes("linux")) {
        setUserOS("linux");
        setActiveInstructionTab("linux");
      } else {
        setUserOS("win");
        setActiveInstructionTab("win");
      }
    }
  }, []);

  // Fetch releases from GitHub API or local cache
  const fetchReleases = async (forceFresh = false) => {
    if (forceFresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Check cache if not forcing fresh fetch
      if (!forceFresh && typeof window !== "undefined") {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (parsed.timestamp && Date.now() - parsed.timestamp < CACHE_TTL_MS && Array.isArray(parsed.data) && parsed.data.length > 0) {
              setReleases(parsed.data);
              setLoading(false);
              return;
            }
          } catch {
            // cache corrupt, proceed to fetch
          }
        }
      }

      const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (res.ok) {
        const data: GitHubRelease[] = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setReleases(data);
          if (typeof window !== "undefined") {
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({
                timestamp: Date.now(),
                data,
              })
            );
          }
        }
      } else {
        console.warn("GitHub API returned non-OK status. Using cached/fallback releases.", res.status);
      }
    } catch (err) {
      console.warn("Failed to fetch releases from GitHub. Using fallback data.", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReleases(false);
  }, []);

  const latestRelease = releases[0] || FALLBACK_RELEASES[0];

  // Auto pick primary installer based on detected OS
  const recommendedAsset = useMemo(() => {
    if (!latestRelease || !latestRelease.assets) return null;
    const assets = latestRelease.assets;

    if (userOS === "win") {
      return assets.find((a) => a.name.endsWith(".exe")) || assets.find((a) => a.name.endsWith(".msi"));
    }
    if (userOS === "mac") {
      if (macArch === "arm") {
        return assets.find((a) => a.name.includes("aarch64") && a.name.endsWith(".dmg")) || assets.find((a) => a.name.endsWith(".dmg"));
      } else {
        return assets.find((a) => a.name.includes("x64") && a.name.endsWith(".dmg")) || assets.find((a) => a.name.endsWith(".dmg"));
      }
    }
    if (userOS === "linux") {
      return assets.find((a) => a.name.endsWith(".AppImage")) || assets.find((a) => a.name.endsWith(".deb"));
    }

    return assets[0] || null;
  }, [latestRelease, userOS, macArch]);

  // Secondary assets for latest release
  const secondaryAssets = useMemo(() => {
    if (!latestRelease || !latestRelease.assets) return [];
    return latestRelease.assets.filter((a) => a.id !== recommendedAsset?.id);
  }, [latestRelease, recommendedAsset]);

  // Toggle release changelog
  const toggleChangelog = (tag: string) => {
    setExpandedChangelogs((prev) => ({
      ...prev,
      [tag]: !prev[tag],
    }));
  };

  // Filtered releases based on OS filter and search query
  const filteredReleases = useMemo(() => {
    return releases.filter((release) => {
      // Query filter
      const matchesQuery =
        searchQuery.trim() === "" ||
        release.tag_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        release.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        release.body.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesQuery) return false;

      // Platform filter
      if (selectedOSFilter === "all") return true;

      const hasPlatformAsset = release.assets.some((asset) => {
        const plat = getAssetPlatform(asset.name);
        return plat === selectedOSFilter;
      });

      return hasPlatformAsset;
    });
  }, [releases, selectedOSFilter, searchQuery]);

  return (
    <div className="website-ui min-h-screen flex flex-col bg-[#F8F9FB] text-[#111318] selection:bg-[#FFF1E8] selection:text-[#FF6B2C]">
      <Navbar />

      <main id="main-content" className="flex-1 pb-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-16 border-b border-[#E5E7EB] bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/20 text-xs font-semibold text-[#FF6B2C] mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2C] animate-pulse" />
                <span>Latest Release: {latestRelease.tag_name}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2C]" />
                <span>Production Ready</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111318] leading-[1.15]">
                Download <span className="text-[#FF6B2C]">FucuFlow</span> Studio
              </h1>

              <p className="mt-4 text-base sm:text-lg text-[#667085] leading-relaxed max-w-2xl mx-auto">
                High-performance desktop screen recorder and automated zoom editor.
                100% offline, GPU accelerated, and free open-source software for Windows, macOS, and Linux.
              </p>
            </div>

            {/* Primary Recommended Download Card */}
            <div className="mt-10 max-w-3xl mx-auto">
              <div className="rounded-3xl border-2 border-[#FF6B2C]/30 bg-gradient-to-b from-white to-[#FFF9F6] p-6 sm:p-8 shadow-lg shadow-[#FF6B2C]/5 relative overflow-hidden">
                {/* Ribbon */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1E8] text-[#FF6B2C] text-xs font-bold border border-[#FF6B2C]/30">
                    <CheckCircle2 size={13} />
                    <span>Auto-detected for your system</span>
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#667085]">
                      {userOS === "win" && <Monitor className="w-4 h-4 text-blue-500" />}
                      {userOS === "mac" && <Apple className="w-4 h-4 text-slate-800" />}
                      {userOS === "linux" && <Terminal className="w-4 h-4 text-emerald-600" />}
                      <span>
                        {userOS === "win" && "Windows 10 / 11 (64-bit)"}
                        {userOS === "mac" && (macArch === "arm" ? "macOS (Apple Silicon M1-M4)" : "macOS (Intel x64)")}
                        {userOS === "linux" && "Linux (Universal AppImage)"}
                      </span>
                    </div>

                    <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#111318]">
                      FucuFlow {latestRelease.tag_name}
                    </h2>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#667085]">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} />
                        {formatDate(latestRelease.published_at)}
                      </span>
                      <span>•</span>
                      {recommendedAsset && (
                        <span className="flex items-center gap-1 font-mono font-medium text-[#111318]">
                          <HardDrive size={13} />
                          {formatBytes(recommendedAsset.size)}
                        </span>
                      )}
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Signed & Verified
                      </span>
                    </div>

                    {/* macOS Architecture toggle */}
                    {userOS === "mac" && (
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-xs text-[#667085] font-medium">Processor:</span>
                        <button
                          type="button"
                          onClick={() => setMacArch("arm")}
                          className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all ${
                            macArch === "arm"
                              ? "bg-[#FF6B2C] text-white"
                              : "bg-[#F8F9FB] text-[#667085] hover:text-[#111318] border border-[#E5E7EB]"
                          }`}
                        >
                          Apple Silicon (M1/M2/M3/M4)
                        </button>
                        <button
                          type="button"
                          onClick={() => setMacArch("intel")}
                          className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all ${
                            macArch === "intel"
                              ? "bg-[#FF6B2C] text-white"
                              : "bg-[#F8F9FB] text-[#667085] hover:text-[#111318] border border-[#E5E7EB]"
                          }`}
                        >
                          Intel Mac (x64)
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Big Primary Download CTA */}
                  <div className="w-full sm:w-auto shrink-0">
                    {recommendedAsset ? (
                      <a
                        href={recommendedAsset.browser_download_url}
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-2xl bg-[#FF6B2C] px-8 py-4 text-base font-bold text-white shadow-md hover:bg-[#E85A1F] hover:shadow-[0_6px_20px_rgba(255,107,44,0.35)] transition-all active:scale-[0.98]"
                      >
                        <Download size={20} className="animate-bounce" />
                        <span>Download for {userOS === "win" ? "Windows" : userOS === "mac" ? "macOS" : "Linux"}</span>
                      </a>
                    ) : (
                      <a
                        href={latestRelease.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-[#FF6B2C] px-8 py-4 text-base font-bold text-white shadow-md hover:bg-[#E85A1F] transition-all"
                      >
                        <Download size={20} />
                        <span>View Release Assets</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* OS Switcher Buttons */}
                <div className="mt-6 pt-5 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-[#667085]">Looking for a different OS?</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setUserOS("win")}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                        userOS === "win"
                          ? "bg-[#111318] text-white"
                          : "bg-white border border-[#E5E7EB] text-[#667085] hover:text-[#111318]"
                      }`}
                    >
                      <Monitor size={13} />
                      <span>Windows</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserOS("mac")}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                        userOS === "mac"
                          ? "bg-[#111318] text-white"
                          : "bg-white border border-[#E5E7EB] text-[#667085] hover:text-[#111318]"
                      }`}
                    >
                      <Apple size={13} />
                      <span>macOS</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserOS("linux")}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                        userOS === "linux"
                          ? "bg-[#111318] text-white"
                          : "bg-white border border-[#E5E7EB] text-[#667085] hover:text-[#111318]"
                      }`}
                    >
                      <Terminal size={13} />
                      <span>Linux</span>
                    </button>
                    <Link
                      href="/editor"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FFF1E8] text-[#FF6B2C] border border-[#FF6B2C]/20 hover:bg-[#FFE6D7] transition-colors"
                    >
                      <Zap size={13} />
                      <span>Web Studio (No Install)</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Secondary Available Formats for Latest Release */}
              {secondaryAssets.length > 0 && (
                <div className="mt-4 px-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-[#667085]">
                  <span className="font-semibold text-[#111318]">Other formats:</span>
                  {secondaryAssets.slice(0, 4).map((asset) => (
                    <a
                      key={asset.id}
                      href={asset.browser_download_url}
                      className="hover:text-[#FF6B2C] underline decoration-dotted transition-colors font-mono"
                    >
                      {asset.name} ({formatBytes(asset.size)})
                    </a>
                  ))}
                  {secondaryAssets.length > 4 && (
                    <a href="#all-releases" className="text-[#FF6B2C] font-semibold hover:underline">
                      +{secondaryAssets.length - 4} more below ↓
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Feature Pills */}
            <div className="mt-10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4.5 flex items-center gap-3.5 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#FFF1E8] text-[#FF6B2C] flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111318]">100% Local & Offline</h4>
                  <p className="text-[11px] text-[#667085] mt-0.5">No video uploads to cloud. Zero telemetry.</p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4.5 flex items-center gap-3.5 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#FFF1E8] text-[#FF6B2C] flex items-center justify-center shrink-0">
                  <Zap size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111318]">GPU Accelerated</h4>
                  <p className="text-[11px] text-[#667085] mt-0.5">Fast 4K rendering & silky 60fps spring camera.</p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4.5 flex items-center gap-3.5 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#FFF1E8] text-[#FF6B2C] flex items-center justify-center shrink-0">
                  <Code2 size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111318]">Open Source (MIT)</h4>
                  <p className="text-[11px] text-[#667085] mt-0.5">Free forever. Auditable code on GitHub.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* All Releases & Version History Section */}
        <section id="all-releases" className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E5E7EB]">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5E7EB] text-xs font-semibold text-[#667085] mb-2">
                  <Layers size={13} className="text-[#FF6B2C]" />
                  <span>Release Archive</span>
                </div>
                <h2 className="text-3xl font-extrabold text-[#111318] tracking-tight">
                  All Versions & Release History
                </h2>
                <p className="mt-2 text-sm text-[#667085]">
                  Direct download links for every release, architecture packages, and complete changelogs.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fetchReleases(true)}
                  disabled={isRefreshing}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#111318] border border-[#E5E7EB] bg-white hover:bg-[#F8F9FB] transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                  title="Check GitHub for newer releases"
                >
                  <RefreshCw size={13} className={`${isRefreshing ? "animate-spin text-[#FF6B2C]" : ""}`} />
                  <span>{isRefreshing ? "Checking..." : "Sync GitHub"}</span>
                </button>

                <a
                  href={`https://github.com/${GITHUB_REPO}/releases`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#667085] border border-[#E5E7EB] bg-white hover:text-[#111318] hover:bg-[#F8F9FB] transition-colors shadow-xs"
                >
                  <span>GitHub Releases</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Platform Filter Tabs */}
              <div className="flex items-center p-1 bg-white border border-[#E5E7EB] rounded-2xl w-full sm:w-auto shadow-xs">
                <button
                  type="button"
                  onClick={() => setSelectedOSFilter("all")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedOSFilter === "all"
                      ? "bg-[#111318] text-white shadow-xs"
                      : "text-[#667085] hover:text-[#111318]"
                  }`}
                >
                  All Platforms
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOSFilter("win")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all ${
                    selectedOSFilter === "win"
                      ? "bg-[#111318] text-white shadow-xs"
                      : "text-[#667085] hover:text-[#111318]"
                  }`}
                >
                  <Monitor size={13} />
                  <span>Windows</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOSFilter("mac")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all ${
                    selectedOSFilter === "mac"
                      ? "bg-[#111318] text-white shadow-xs"
                      : "text-[#667085] hover:text-[#111318]"
                  }`}
                >
                  <Apple size={13} />
                  <span>macOS</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOSFilter("linux")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all ${
                    selectedOSFilter === "linux"
                      ? "bg-[#111318] text-white shadow-xs"
                      : "text-[#667085] hover:text-[#111318]"
                  }`}
                >
                  <Terminal size={13} />
                  <span>Linux</span>
                </button>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-72">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]" />
                <input
                  type="text"
                  placeholder="Search version (e.g. 0.1.4)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white border border-[#E5E7EB] text-xs text-[#111318] placeholder-[#667085] focus:outline-none focus:border-[#FF6B2C] shadow-xs transition-colors"
                />
              </div>
            </div>

            {/* Releases List */}
            <div className="mt-8 space-y-6">
              {filteredReleases.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-[#E5E7EB] bg-white p-12 text-center">
                  <AlertCircle className="w-8 h-8 text-[#667085] mx-auto mb-3" />
                  <h3 className="text-base font-bold text-[#111318]">No releases match your filter</h3>
                  <p className="text-xs text-[#667085] mt-1">
                    Try searching for another version or switch back to &ldquo;All Platforms&rdquo;.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOSFilter("all");
                      setSearchQuery("");
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-[#FFF1E8] text-[#FF6B2C] text-xs font-bold hover:bg-[#FFE6D7] transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredReleases.map((release, index) => {
                  const isLatest = index === 0;
                  const isExpanded = !!expandedChangelogs[release.tag_name];
                  const totalDownloads = release.assets.reduce((sum, a) => sum + (a.download_count || 0), 0);

                  // Assets filtered by selected OS if any
                  const displayAssets = release.assets.filter((asset) => {
                    if (selectedOSFilter === "all") return true;
                    return getAssetPlatform(asset.name) === selectedOSFilter;
                  });

                  return (
                    <div
                      key={release.id || release.tag_name}
                      className={`rounded-3xl border transition-all ${
                        isLatest
                          ? "border-[#FF6B2C]/40 bg-white shadow-md shadow-[#FF6B2C]/5"
                          : "border-[#E5E7EB] bg-white shadow-xs"
                      }`}
                    >
                      {/* Release Card Header */}
                      <div className="p-6 sm:p-7 border-b border-[#E5E7EB]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xl font-extrabold text-[#111318]">
                              {release.tag_name}
                            </span>

                            {isLatest && (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                                Latest Release
                              </span>
                            )}

                            {release.prerelease && (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200">
                                Pre-release
                              </span>
                            )}

                            <span className="text-xs text-[#667085] hidden sm:inline">•</span>
                            <span className="text-xs text-[#667085] hidden sm:inline">
                              {formatDate(release.published_at)}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-[#667085] bg-[#F8F9FB] px-3 py-1 rounded-xl border border-[#E5E7EB]">
                              {totalDownloads} total downloads
                            </span>

                            <a
                              href={release.html_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-semibold text-[#667085] hover:text-[#FF6B2C] inline-flex items-center gap-1 transition-colors"
                            >
                              <span>Notes</span>
                              <ExternalLink size={12} />
                            </a>
                          </div>
                        </div>

                        {/* Title and small date on mobile */}
                        <div className="mt-2 text-xs sm:hidden text-[#667085]">
                          Released on {formatDate(release.published_at)}
                        </div>

                        {/* Release body / changelog */}
                        {release.body && (
                          <div className="mt-4">
                            <button
                              type="button"
                              onClick={() => toggleChangelog(release.tag_name)}
                              className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6B2C] hover:text-[#E85A1F] transition-colors"
                            >
                              <span>{isExpanded ? "Hide changelog" : "View release notes & changes"}</span>
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>

                            {isExpanded && (
                              <div className="mt-3 p-4 rounded-2xl bg-[#F8F9FB] border border-[#E5E7EB] text-xs text-[#475467] font-mono leading-relaxed whitespace-pre-line overflow-x-auto">
                                {release.body}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Release Assets Grid */}
                      <div className="p-6 sm:p-7 bg-[#FAFBFD] rounded-b-3xl">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#667085] mb-4">
                          Download Packages ({displayAssets.length})
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {displayAssets.map((asset) => {
                            const plat = getAssetPlatform(asset.name);
                            return (
                              <div
                                key={asset.id}
                                className="rounded-2xl border border-[#E5E7EB] bg-white p-4 flex flex-col justify-between gap-3 hover:border-[#FF6B2C]/40 hover:shadow-xs transition-all"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="p-2 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] shrink-0">
                                    {getPlatformIcon(plat)}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-xs font-bold text-[#111318] truncate" title={asset.name}>
                                      {asset.name}
                                    </p>
                                    <div className="mt-1 flex items-center gap-2 text-[11px] text-[#667085]">
                                      <span className="font-mono">{formatBytes(asset.size)}</span>
                                      <span>•</span>
                                      <span>{asset.download_count} downloads</span>
                                    </div>
                                  </div>
                                </div>

                                <a
                                  href={asset.browser_download_url}
                                  className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-[#F8F9FB] hover:bg-[#FFF1E8] border border-[#E5E7EB] hover:border-[#FF6B2C]/30 text-xs font-bold text-[#111318] hover:text-[#FF6B2C] transition-all cursor-pointer"
                                >
                                  <Download size={13} />
                                  <span>Download</span>
                                </a>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Installation Instructions & SmartScreen Help */}
            <div className="mt-16 rounded-3xl border border-[#E5E7EB] bg-white p-8 shadow-xs">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF1E8] text-xs font-semibold text-[#FF6B2C] mb-3">
                  <HelpCircle size={14} />
                  <span>Installation Guide</span>
                </div>
                <h3 className="text-2xl font-bold text-[#111318]">
                  How to install and run FucuFlow
                </h3>
                <p className="mt-2 text-xs text-[#667085]">
                  Because FucuFlow is an open-source community app that doesn&apos;t purchase \$500/year enterprise code-signing certificates, your OS may show a standard first-run prompt:
                </p>
              </div>

              {/* OS Tabs for Instructions */}
              <div className="mt-6 flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
                <button
                  type="button"
                  onClick={() => setActiveInstructionTab("win")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                    activeInstructionTab === "win"
                      ? "bg-[#FFF1E8] text-[#FF6B2C] border border-[#FF6B2C]/30"
                      : "text-[#667085] hover:text-[#111318]"
                  }`}
                >
                  Windows Setup
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInstructionTab("mac")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                    activeInstructionTab === "mac"
                      ? "bg-[#FFF1E8] text-[#FF6B2C] border border-[#FF6B2C]/30"
                      : "text-[#667085] hover:text-[#111318]"
                  }`}
                >
                  macOS Gatekeeper
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInstructionTab("linux")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                    activeInstructionTab === "linux"
                      ? "bg-[#FFF1E8] text-[#FF6B2C] border border-[#FF6B2C]/30"
                      : "text-[#667085] hover:text-[#111318]"
                  }`}
                >
                  Linux Permissions
                </button>
              </div>

              <div className="mt-6 text-xs text-[#475467] leading-relaxed">
                {activeInstructionTab === "win" && (
                  <div className="space-y-3">
                    <p className="font-semibold text-[#111318]">
                      Bypassing Windows SmartScreen (&ldquo;Windows protected your PC&rdquo;):
                    </p>
                    <ol className="list-decimal pl-5 space-y-1.5">
                      <li>Double-click the downloaded <code>.exe</code> installer.</li>
                      <li>When the blue Windows Defender SmartScreen window appears, click <strong>&ldquo;More info&rdquo;</strong> (underlined text).</li>
                      <li>Click the <strong>&ldquo;Run anyway&rdquo;</strong> button that appears at the bottom.</li>
                      <li>FucuFlow will install locally into your user directory without requiring administrative elevation.</li>
                    </ol>
                  </div>
                )}

                {activeInstructionTab === "mac" && (
                  <div className="space-y-3">
                    <p className="font-semibold text-[#111318]">
                      Opening on macOS (&ldquo;FucuFlow cannot be opened because Apple cannot check it for malicious software&rdquo;):
                    </p>
                    <ol className="list-decimal pl-5 space-y-1.5">
                      <li>Open the <code>.dmg</code> and drag <strong>FucuFlow</strong> to your <code>/Applications</code> folder.</li>
                      <li>Right-click (or Control-click) the FucuFlow icon in Applications and select <strong>Open</strong>.</li>
                      <li>In the dialog that appears, click <strong>Open</strong> to confirm.</li>
                      <li>Or run terminal command: <code>xattr -cr /Applications/FucuFlow.app</code> to permanently clear quarantine flags.</li>
                    </ol>
                  </div>
                )}

                {activeInstructionTab === "linux" && (
                  <div className="space-y-3">
                    <p className="font-semibold text-[#111318]">
                      Running the Universal AppImage on Linux:
                    </p>
                    <ol className="list-decimal pl-5 space-y-1.5">
                      <li>Make the downloaded AppImage executable:
                        <code className="block mt-1 p-2 rounded bg-[#F8F9FB] border border-[#E5E7EB] font-mono text-[11px]">
                          chmod +x FucuFlow*.AppImage &amp;&amp; ./FucuFlow*.AppImage
                        </code>
                      </li>
                      <li>For Debian/Ubuntu systems, install the <code>.deb</code> package:
                        <code className="block mt-1 p-2 rounded bg-[#F8F9FB] border border-[#E5E7EB] font-mono text-[11px]">
                          sudo dpkg -i fucuflow*.deb || sudo apt-get install -f
                        </code>
                      </li>
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export { DownloadPage as DownloadView };

