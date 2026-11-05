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
  Copy,
  Check,
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
    tag_name: "v0.2.0",
    name: "FucuFlow v0.2.0",
    published_at: "2026-11-01T10:47:33Z",
    prerelease: false,
    html_url: `https://github.com/${GITHUB_REPO}/releases/tag/v0.2.0`,
    body: `### FucuFlow v0.2.0 Release
- Clerk authentication integration with secure login & profile management
- Automatic in-app update checker and notification banner
- Dynamic 3D camera pan & focal auto-zoom keyframe editor
- Multi-track timeline, zero-cloud local video storage, and 4K 60FPS export
- Native installers for Windows 10/11, macOS (Apple Silicon & Intel), and Linux`,
    assets: [
      {
        id: 201,
        name: "FucuFlow_0.2.0_x64-setup.exe",
        size: 7225188,
        download_count: 140,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.2.0/FucuFlow_0.2.0_x64-setup.exe`,
        created_at: "2026-11-01T10:47:33Z",
      },
      {
        id: 202,
        name: "FucuFlow_0.2.0_x64_en-US.msi",
        size: 9097216,
        download_count: 65,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.2.0/FucuFlow_0.2.0_x64_en-US.msi`,
        created_at: "2026-11-01T10:46:33Z",
      },
      {
        id: 203,
        name: "FucuFlow_0.2.0_aarch64.dmg",
        size: 9493747,
        download_count: 110,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.2.0/FucuFlow_0.2.0_aarch64.dmg`,
        created_at: "2026-11-01T10:42:01Z",
      },
      {
        id: 204,
        name: "FucuFlow_0.2.0_x64.dmg",
        size: 9586500,
        download_count: 55,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.2.0/FucuFlow_0.2.0_x64.dmg`,
        created_at: "2026-11-01T10:41:59Z",
      },
      {
        id: 205,
        name: "FucuFlow_0.2.0_amd64.AppImage",
        size: 98884088,
        download_count: 80,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.2.0/FucuFlow_0.2.0_amd64.AppImage`,
        created_at: "2026-11-01T10:47:33Z",
      },
      {
        id: 206,
        name: "FucuFlow_0.2.0_amd64.deb",
        size: 9953306,
        download_count: 45,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.2.0/FucuFlow_0.2.0_amd64.deb`,
        created_at: "2026-11-01T10:47:33Z",
      },
      {
        id: 207,
        name: "FucuFlow-0.2.0-1.x86_64.rpm",
        size: 9955626,
        download_count: 20,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.2.0/FucuFlow-0.2.0-1.x86_64.rpm`,
        created_at: "2026-11-01T10:47:33Z",
      },
    ],
  },
  {
    id: 2,
    tag_name: "v0.1.6",
    name: "FucuFlow v0.1.6",
    published_at: "2026-09-21T18:00:00Z",
    prerelease: false,
    html_url: `https://github.com/${GITHUB_REPO}/releases/tag/v0.1.6`,
    body: `### FucuFlow v0.1.6 Release
- High-performance desktop screen recorder and automated zoom editor
- Fixed mesh background rendering and instant playhead seeking
- Added cursor visibility toggle to hide real device cursor
- Native builds for Windows 10/11, macOS Apple Silicon & Intel, and Linux`,
    assets: [
      {
        id: 301,
        name: "FucuFlow_0.1.6_x64-setup.exe",
        size: 7063071,
        download_count: 120,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.6/FucuFlow_0.1.6_x64-setup.exe`,
        created_at: "2026-09-21T18:00:00Z",
      },
      {
        id: 302,
        name: "FucuFlow_0.1.6_x64_en-US.msi",
        size: 8470528,
        download_count: 45,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.6/FucuFlow_0.1.6_x64_en-US.msi`,
        created_at: "2026-09-21T18:00:00Z",
      },
      {
        id: 303,
        name: "FucuFlow_0.1.6_aarch64.dmg",
        size: 9349790,
        download_count: 85,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.6/FucuFlow_0.1.6_aarch64.dmg`,
        created_at: "2026-09-21T18:00:00Z",
      },
      {
        id: 304,
        name: "FucuFlow_0.1.6_x64.dmg",
        size: 9437417,
        download_count: 40,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.6/FucuFlow_0.1.6_x64.dmg`,
        created_at: "2026-09-21T18:00:00Z",
      },
      {
        id: 305,
        name: "FucuFlow_0.1.6_amd64.AppImage",
        size: 98740728,
        download_count: 65,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.6/FucuFlow_0.1.6_amd64.AppImage`,
        created_at: "2026-09-21T18:00:00Z",
      },
      {
        id: 306,
        name: "FucuFlow_0.1.6_amd64.deb",
        size: 9806768,
        download_count: 30,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.6/FucuFlow_0.1.6_amd64.deb`,
        created_at: "2026-09-21T18:00:00Z",
      },
      {
        id: 307,
        name: "FucuFlow-0.1.6-1.x86_64.rpm",
        size: 9808158,
        download_count: 15,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.6/FucuFlow-0.1.6-1.x86_64.rpm`,
        created_at: "2026-09-21T18:00:00Z",
      },
    ],
  },
  {
    id: 2,
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

export function WindowsIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="m9.84 12.663v9.39l-9.84-1.356v-8.034zm0-10.72v9.505h-9.84v-8.145zm14.16 10.72v11.337l-13.082-1.803v-9.534zm0-12.663v11.452h-13.082v-9.649z" />
    </svg>
  );
}

export function AppleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.94,5.19A4.38,4.38,0,0,0,16,2,4.44,4.44,0,0,0,13,3.52,4.17,4.17,0,0,0,12,6.61,3.69,3.69,0,0,0,14.94,5.19Zm2.52,7.44a4.51,4.51,0,0,1,2.16-3.81,4.66,4.66,0,0,0-3.66-2c-1.56-.16-3,.91-3.83.91s-2-.89-3.3-.87A4.92,4.92,0,0,0,4.69,9.39C2.93,12.45,4.24,17,6,19.47,6.8,20.68,7.8,22.05,9.12,22s1.75-.82,3.28-.82,2,.82,3.3.79,2.22-1.24,3.06-2.45a11,11,0,0,0,1.38-2.85A4.41,4.41,0,0,1,17.46,12.63Z" />
    </svg>
  );
}

export function LinuxIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.7 17.6c-.1-.2-.2-.4-.2-.6 0-.4-.2-.7-.5-1-.1-.1-.3-.2-.4-.2.6-1.8-.3-3.6-1.3-4.9-.8-1.2-2-2.1-1.9-3.7 0-1.9.2-5.4-3.3-5.1-3.6.2-2.6 3.9-2.7 5.2 0 1.1-.5 2.2-1.3 3.1-.2.2-.4.5-.5.7-1 1.2-1.5 2.8-1.5 4.3-.2.2-.4.4-.5.6-.1.1-.2.2-.2.3-.1.1-.3.2-.5.3-.4.1-.7.3-.9.7-.1.3-.2.7-.1 1.1.1.2.1.4 0 .7-.2.4-.2.9 0 1.4.3.4.8.5 1.5.6.5 0 1.1.2 1.6.4.5.3 1.1.5 1.7.5.3 0 .7-.1 1-.2.3-.2.5-.4.6-.7.4 0 1-.2 1.7-.2.6 0 1.2.2 2 .1 0 .1 0 .2.1.3.2.5.7.9 1.3 1h.2c.8-.1 1.6-.5 2.1-1.1.4-.4.9-.7 1.4-.9.6-.3 1-.5 1.1-1 .1-.7-.1-1.1-.5-1.7zM12.8 4.8c.6.1 1.1.6 1 1.2 0 .3-.1.6-.3.9h-.1c-.2-.1-.3-.1-.4-.2.1-.1.1-.3.2-.5 0-.4-.2-.7-.4-.7-.3 0-.5.3-.5.7v.1c-.1-.1-.3-.1-.4-.2V6c-.1-.5.3-1.1.9-1.2zm-.3 2c.1.1.3.2.4.2.1 0 .3.1.4.2.2.1.4.2.4.5s-.3.6-.9.8c-.2.1-.3.1-.4.2-.3.2-.6.3-1 .3-.3 0-.6-.2-.8-.4-.1-.1-.2-.2-.4-.3-.1-.1-.3-.3-.4-.6 0-.1.1-.2.2-.3.3-.2.4-.3.5-.4l.1-.1c.2-.3.6-.5 1-.5.3.1.6.2.9.4zM10.4 5c.4 0 .7.4.8 1.1v.2c-.1 0-.3.1-.4.2v-.2c0-.3-.2-.6-.4-.5-.2 0-.3.3-.3.6 0 .2.1.3.2.4 0 0-.1.1-.2.1-.2-.2-.4-.5-.4-.8 0-.6.3-1.1.7-1.1zm-1 16.1c-.7.3-1.6.2-2.2-.2-.6-.3-1.1-.4-1.8-.4-.5-.1-1-.1-1.1-.3-.1-.2-.1-.5.1-1 .1-.3.1-.6 0-.9-.1-.3-.1-.5 0-.8.1-.3.3-.4.6-.5.3-.1.5-.2.7-.4.1-.1.2-.2.3-.4.3-.4.5-.6.8-.6.6.1 1.1 1 1.5 1.9.2.3.4.7.7 1 .4.5.9 1.2.9 1.6 0 .5-.2.8-.5 1zm4.9-2.2c0 .1 0 .1-.1.2-1.2.9-2.8 1-4.1.3l-.6-.9c.9-.1.7-1.3-1.2-2.5-2-1.3-.6-3.7.1-4.8.1-.1.1 0-.3.8-.3.6-.9 2.1-.1 3.2 0-.8.2-1.6.5-2.4.7-1.3 1.2-2.8 1.5-4.3.1.1.1.1.2.1.1.1.2.2.3.2.2.3.6.4.9.4h.1c.4 0 .8-.1 1.1-.4.1-.1.2-.2.4-.2.3-.1.6-.3.9-.6.4 1.3.8 2.5 1.4 3.6.4.8.7 1.6.9 2.5.3 0 .7.1 1 .3.8.4 1.1.7 1 1.2H18c0-.3-.2-.6-.9-.9-.7-.3-1.3-.3-1.5.4-.1 0-.2.1-.3.1-.8.4-.8 1.5-.9 2.6.1.4 0 .7-.1 1.1zm4.6.6c-.6.2-1.1.6-1.5 1.1-.4.6-1.1 1-1.9.9-.4 0-.8-.3-.9-.7-.1-.6-.1-1.2.2-1.8.1-.4.2-.7.3-1.1.1-1.2.1-1.9.6-2.2 0 .5.3.8.7 1 .5 0 1-.1 1.4-.5h.2c.3 0 .5 0 .7.2.2.2.3.5.3.7 0 .3.2.6.3.9.5.5.5.8.5.9-.1.2-.5.4-.9.6zm-9-12c-.1 0-.1 0-.1.1 0 0 0 .1.1.1s.1.1.1.1c.3.4.8.6 1.4.7.5-.1 1-.2 1.5-.6l.6-.3c.1 0 .1-.1.1-.1 0-.1 0-.1-.1-.1-.2.1-.5.2-.7.3-.4.3-.9.5-1.4.5-.5 0-.9-.3-1.2-.6-.1 0-.2-.1-.3-.1z" />
    </svg>
  );
}

function getPlatformIcon(platform: PlatformType) {
  switch (platform) {
    case "win":
      return <WindowsIcon className="w-4 h-4 text-[#0078D4]" />;
    case "mac":
      return <AppleIcon className="w-4 h-4 text-slate-800" />;
    case "linux":
      return <LinuxIcon className="w-4 h-4 text-amber-500" />;
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
  const [activeCliTab, setActiveCliTab] = useState<PlatformType>("win");
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleCopy = (cmd: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(cmd);
      setCopiedCmd(cmd);
      setTimeout(() => setCopiedCmd(null), 2500);
    }
  };

  // Detect Client Operating System
  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = window.navigator.userAgent.toLowerCase();
      if (ua.includes("mac")) {
        setUserOS("mac");
        setActiveInstructionTab("mac");
        setActiveCliTab("mac");
      } else if (ua.includes("linux")) {
        setUserOS("linux");
        setActiveInstructionTab("linux");
        setActiveCliTab("linux");
      } else {
        setUserOS("win");
        setActiveInstructionTab("win");
        setActiveCliTab("win");
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
                {isKhmer ? (
                  <>
                    ទាញយក <span className="text-[#FF6B2C]">FucuFlow</span> Studio
                  </>
                ) : (
                  <>
                    Download <span className="text-[#FF6B2C]">FucuFlow</span> Studio
                  </>
                )}
              </h1>

              <p className="mt-4 text-base sm:text-lg text-[#667085] leading-relaxed max-w-2xl mx-auto">
                {isKhmer
                  ? "កម្មវិធីថតអេក្រង់កុំព្យូទ័រល្បឿនលឿន និងកម្មវិធីកាត់តពង្រីក (Zoom) ស្វ័យប្រវត្តិ។ ដំណើរការក្រៅបណ្តាញ 100% ជំនួយដោយ GPU និងឥតគិតថ្លៃ Open Source សម្រាប់ Windows, macOS, និង Linux។"
                  : "High-performance desktop screen recorder and automated zoom editor. 100% offline, GPU accelerated, and free open-source software for Windows, macOS, and Linux."}
              </p>
            </div>

            {/* Primary Recommended Download Card */}
            <div className="mt-10 max-w-4xl mx-auto">
              <div className="rounded-3xl border-2 border-[#FF6B2C]/30 bg-gradient-to-b from-white to-[#FFF9F6] p-7 sm:p-9 shadow-xl shadow-[#FF6B2C]/5 relative overflow-hidden">
                {/* Ribbon */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1E8] text-[#FF6B2C] text-xs font-bold border border-[#FF6B2C]/30 shadow-xs">
                    <CheckCircle2 size={13} />
                    <span>Auto-detected for your system</span>
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-[#667085]">
                      {userOS === "win" && <WindowsIcon className="w-4 h-4 text-[#0078D4]" />}
                      {userOS === "mac" && <AppleIcon className="w-4 h-4 text-slate-900" />}
                      {userOS === "linux" && <LinuxIcon className="w-4 h-4 text-amber-500" />}
                      <span>
                        {userOS === "win" && "Windows 10 / 11 (64-bit)"}
                        {userOS === "mac" && (macArch === "arm" ? "macOS (Apple Silicon M1-M4)" : "macOS (Intel x64)")}
                        {userOS === "linux" && "Linux (Universal AppImage / deb)"}
                      </span>
                    </div>

                    <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#111318] tracking-tight">
                      FucuFlow {latestRelease.tag_name}
                    </h2>

                    <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-[#667085]">
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
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                        Signed & Verified
                      </span>
                    </div>

                    {/* macOS Architecture toggle */}
                    {userOS === "mac" && (
                      <div className="mt-4 flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#667085] font-semibold">Mac Processor:</span>
                          <button
                            type="button"
                            onClick={() => setMacArch("arm")}
                            className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all cursor-pointer ${
                              macArch === "arm"
                                ? "bg-[#FF6B2C] text-white shadow-xs"
                                : "bg-[#F8F9FB] text-[#667085] hover:text-[#111318] border border-[#E5E7EB]"
                            }`}
                          >
                            Apple Silicon (M1/M2/M3/M4)
                          </button>
                          <button
                            type="button"
                            onClick={() => setMacArch("intel")}
                            className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all cursor-pointer ${
                              macArch === "intel"
                                ? "bg-[#FF6B2C] text-white shadow-xs"
                                : "bg-[#F8F9FB] text-[#667085] hover:text-[#111318] border border-[#E5E7EB]"
                            }`}
                          >
                            Intel Mac (x64)
                          </button>
                        </div>
                        <span className="text-[11px] text-[#667085]">
                          Check: Apple menu  → <em>About This Mac</em> → Chip/Processor
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Big Primary Download CTA */}
                  <div className="w-full sm:w-auto shrink-0">
                    {recommendedAsset ? (
                      <a
                        href={recommendedAsset.browser_download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={recommendedAsset.name}
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-2xl bg-[#FF6B2C] px-8 py-4 text-base font-bold text-white shadow-md hover:bg-[#E85A1F] hover:shadow-[0_8px_25px_rgba(255,107,44,0.35)] transition-all active:scale-[0.98] cursor-pointer"
                      >
                        <Download size={20} className="animate-bounce" />
                        <span>
                          {isKhmer
                            ? `ទាញយកសម្រាប់ ${userOS === "win" ? "Windows" : userOS === "mac" ? "macOS" : "Linux"}`
                            : `Download for ${userOS === "win" ? "Windows" : userOS === "mac" ? "macOS" : "Linux"}`}
                        </span>
                      </a>
                    ) : (
                      <a
                        href={latestRelease.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-[#FF6B2C] px-8 py-4 text-base font-bold text-white shadow-md hover:bg-[#E85A1F] transition-all cursor-pointer"
                      >
                        <Download size={20} />
                        <span>{isKhmer ? "មើលឯកសារដំឡើងទាំងអស់" : "View Release Assets"}</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* macOS Gatekeeper Helper Alert (Shown when downloading for Mac) */}
                {userOS === "mac" && (
                  <div className="mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-950 text-xs">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-bold text-slate-900">
                          macOS Gatekeeper Note & Quick Solution:
                        </p>
                        <p className="text-[11px] text-slate-700 mt-1 leading-relaxed">
                          Because FucuFlow is open-source community software, macOS may flag it with <em>&ldquo;FucuFlow is damaged and can&apos;t be opened&rdquo;</em> or <em>&ldquo;Unidentified developer&rdquo;</em>.
                          After dragging FucuFlow to <strong>/Applications</strong>, run this 1-second fix in Terminal:
                        </p>
                        <div className="mt-2.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <code className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 font-mono text-[11px] font-bold text-slate-900 flex-1 select-all shadow-xs">
                            xattr -cr /Applications/FucuFlow.app
                          </code>
                          <button
                            type="button"
                            onClick={() => handleCopy("xattr -cr /Applications/FucuFlow.app")}
                            className="px-3 py-1.5 rounded-xl bg-[#FF6B2C] hover:bg-[#E85A1F] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
                          >
                            {copiedCmd === "xattr -cr /Applications/FucuFlow.app" ? <Check size={13} /> : <Copy size={13} />}
                            <span>{copiedCmd === "xattr -cr /Applications/FucuFlow.app" ? "Copied!" : "Copy Fix Command"}</span>
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2">
                          Or via System Settings:  → System Settings → Privacy & Security → scroll down to Security → click <strong>&ldquo;Open Anyway&rdquo;</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* OS Switcher Buttons */}
                <div className="mt-6 pt-5 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-[#667085]">Looking for a different OS?</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setUserOS("win")}
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        userOS === "win"
                          ? "bg-[#111318] text-white shadow-xs"
                          : "bg-white border border-[#E5E7EB] text-[#667085] hover:text-[#111318] hover:border-slate-300"
                      }`}
                    >
                      <WindowsIcon className="w-3.5 h-3.5 text-[#0078D4]" />
                      <span>Windows</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserOS("mac")}
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        userOS === "mac"
                          ? "bg-[#111318] text-white shadow-xs"
                          : "bg-white border border-[#E5E7EB] text-[#667085] hover:text-[#111318] hover:border-slate-300"
                      }`}
                    >
                      <AppleIcon className="w-3.5 h-3.5 text-slate-900" />
                      <span>macOS</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserOS("linux")}
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        userOS === "linux"
                          ? "bg-[#111318] text-white shadow-xs"
                          : "bg-white border border-[#E5E7EB] text-[#667085] hover:text-[#111318] hover:border-slate-300"
                      }`}
                    >
                      <LinuxIcon className="w-3.5 h-3.5 text-amber-500" />
                      <span>Linux</span>
                    </button>
                    <Link
                      href="/editor"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#FFF1E8] text-[#FF6B2C] border border-[#FF6B2C]/20 hover:bg-[#FFE6D7] transition-colors"
                    >
                      <Zap size={13} />
                      <span>Web Studio (No Install)</span>
                    </Link>
                  </div>
                </div>

                {/* Secondary Available Formats for Latest Release */}
                {secondaryAssets.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-[#E5E7EB]/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <span className="font-bold text-slate-700 shrink-0">Other platform packages:</span>
                    <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
                      {secondaryAssets.slice(0, 5).map((asset) => {
                        const plat = getAssetPlatform(asset.name);
                        return (
                          <a
                            key={asset.id}
                            href={asset.browser_download_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={asset.name}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#FF6B2C]/40 text-[#475467] hover:text-[#FF6B2C] shadow-2xs transition-all font-mono text-[11px] font-medium"
                            title={asset.name}
                          >
                            {plat === "win" && <WindowsIcon className="w-3.5 h-3.5 text-[#0078D4]" />}
                            {plat === "mac" && <AppleIcon className="w-3.5 h-3.5 text-slate-800" />}
                            {plat === "linux" && <LinuxIcon className="w-3.5 h-3.5 text-amber-500" />}
                            <span className="truncate max-w-[170px]">{asset.name.replace(/^FucuFlow[_-]?/i, "")}</span>
                            <span className="text-[10px] text-slate-400">({formatBytes(asset.size)})</span>
                          </a>
                        );
                      })}
                      {secondaryAssets.length > 5 && (
                        <a href="#all-releases" className="text-[#FF6B2C] font-bold text-xs hover:underline pl-1">
                          +{secondaryAssets.length - 5} more ↓
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Feature Highlights & Trust Bento Grid */}
            <div className="mt-10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              {/* Feature 1: Privacy & Local Offline */}
              <div className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-[#FAFBFC] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:border-[#FF6B2C]/40 hover:shadow-[0_8px_25px_rgba(255,107,44,0.09)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF6B2C]/0 to-transparent group-hover:via-[#FF6B2C] transition-all duration-500" />
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FFF5EE] to-[#FFE7DC] border border-[#FF6B2C]/20 flex items-center justify-center text-[#FF6B2C] shadow-2xs group-hover:scale-105 group-hover:bg-[#FF6B2C] group-hover:text-white transition-all duration-300">
                      <ShieldCheck size={22} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
                      {isKhmer ? "ឯកជនភាព" : "Zero Cloud"}
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-[#111318] tracking-tight group-hover:text-[#FF6B2C] transition-colors">
                    {isKhmer ? "ដំណើរការលើម៉ាស៊ីន 100%" : "100% Local & Offline"}
                  </h4>
                  <p className="text-xs text-[#667085] leading-relaxed mt-1.5">
                    {isKhmer
                      ? "គ្មានការបញ្ជូនវីដេអូទៅកាន់ Cloud ឡើយ។ សុវត្ថិភាពទិន្នន័យឯកជន 100% លើកុំព្យូទ័ររបស់អ្នក។"
                      : "No video uploads to cloud. All recordings and editing stay 100% on your device."}
                  </p>
                </div>
              </div>

              {/* Feature 2: Hardware Acceleration & 60fps */}
              <div className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-[#FAFBFC] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:border-[#FF6B2C]/40 hover:shadow-[0_8px_25px_rgba(255,107,44,0.09)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF6B2C]/0 to-transparent group-hover:via-[#FF6B2C] transition-all duration-500" />
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FFF5EE] to-[#FFE7DC] border border-[#FF6B2C]/20 flex items-center justify-center text-[#FF6B2C] shadow-2xs group-hover:scale-105 group-hover:bg-[#FF6B2C] group-hover:text-white transition-all duration-300">
                      <Zap size={22} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B2C] bg-[#FFF1E8] px-2.5 py-0.5 rounded-full border border-[#FF6B2C]/30">
                      {isKhmer ? "ល្បឿន 60 FPS" : "60 FPS Native"}
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-[#111318] tracking-tight group-hover:text-[#FF6B2C] transition-colors">
                    {isKhmer ? "ជំនួយដោយ GPU" : "GPU Accelerated"}
                  </h4>
                  <p className="text-xs text-[#667085] leading-relaxed mt-1.5">
                    {isKhmer
                      ? "ដំណើរការ Render កម្រិត 4K យ៉ាងរហ័ស ជាមួយចលនាកាមេរ៉ាស្ព្រីង 60 FPS យ៉ាងរលូន។"
                      : "Ultra-fast 4K video rendering powered by silky 60fps spring camera dynamics."}
                  </p>
                </div>
              </div>

              {/* Feature 3: Free & Open Source MIT */}
              <div className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-[#FAFBFC] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:border-[#FF6B2C]/40 hover:shadow-[0_8px_25px_rgba(255,107,44,0.09)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF6B2C]/0 to-transparent group-hover:via-[#FF6B2C] transition-all duration-500" />
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FFF5EE] to-[#FFE7DC] border border-[#FF6B2C]/20 flex items-center justify-center text-[#FF6B2C] shadow-2xs group-hover:scale-105 group-hover:bg-[#FF6B2C] group-hover:text-white transition-all duration-300">
                      <Code2 size={22} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/80">
                      {isKhmer ? "កូដចំហ" : "MIT License"}
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-[#111318] tracking-tight group-hover:text-[#FF6B2C] transition-colors">
                    {isKhmer ? "កូដចំហ Open Source" : "Open Source (MIT)"}
                  </h4>
                  <p className="text-xs text-[#667085] leading-relaxed mt-1.5">
                    {isKhmer
                      ? "ឥតគិតថ្លៃរហូត កូដចំហមានតម្លាភាព អាចផ្ទៀងផ្ទាត់បាននៅលើ GitHub។"
                      : "Free forever for personal and commercial use. Transparent code auditable on GitHub."}
                  </p>
                </div>
              </div>
            </div>

            {/* Instant Terminal / Command-line Installation Card */}
            <div className="mt-12 max-w-4xl mx-auto rounded-3xl border border-[#E5E7EB] bg-gradient-to-b from-white to-[#F8F9FB] p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E7EB]">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111318] text-white text-[11px] font-mono font-bold mb-2 shadow-xs">
                    <Terminal size={13} className="text-[#FF6B2C]" />
                    <span>CLI &amp; SCRIPTABLE INSTALL</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#111318] tracking-tight">
                    {isKhmer ? "ដំឡើងតាមរយៈ Terminal / Command Line" : "Install with One Command Line"}
                  </h3>
                  <p className="text-xs text-[#667085] mt-1">
                    {isKhmer
                      ? "ដំឡើងស្វ័យប្រវត្តិតាមរយៈ Command Line សម្រាប់ Windows, macOS, និង Linux ដោយមិនបាច់ចុចទាញយកផ្ទាល់។"
                      : "Paste directly into your terminal or PowerShell for instant unattended installation."}
                  </p>
                </div>

                {/* OS Switcher Buttons */}
                <div className="flex items-center gap-1.5 bg-[#F1F3F7] p-1.5 rounded-2xl border border-[#E5E7EB] self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setActiveCliTab("win")}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeCliTab === "win"
                        ? "bg-white text-[#111318] shadow-xs"
                        : "text-[#667085] hover:text-[#111318]"
                    }`}
                  >
                    <WindowsIcon className={`w-3.5 h-3.5 ${activeCliTab === "win" ? "text-[#0078D4]" : "text-slate-400"}`} />
                    <span>Windows</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCliTab("mac")}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeCliTab === "mac"
                        ? "bg-white text-[#111318] shadow-xs"
                        : "text-[#667085] hover:text-[#111318]"
                    }`}
                  >
                    <AppleIcon className={`w-3.5 h-3.5 ${activeCliTab === "mac" ? "text-slate-900" : "text-slate-400"}`} />
                    <span>macOS</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCliTab("linux")}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeCliTab === "linux"
                        ? "bg-white text-[#111318] shadow-xs"
                        : "text-[#667085] hover:text-[#111318]"
                    }`}
                  >
                    <LinuxIcon className={`w-3.5 h-3.5 ${activeCliTab === "linux" ? "text-amber-500" : "text-slate-400"}`} />
                    <span>Linux</span>
                  </button>
                </div>
              </div>

              {/* Tab Contents */}
              <div className="mt-6 space-y-4">
                {activeCliTab === "win" && (
                  <div className="space-y-4">
                    {/* Method 1: PowerShell One-Liner */}
                    <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs">
                      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                        <span className="text-xs font-bold text-[#111318]">
                          1. Windows PowerShell (Recommended Auto-Install):
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              `powershell -ExecutionPolicy Bypass -Command "iwr -useb 'https://github.com/ericva01/focuZoom/releases/download/v0.1.6/FucuFlow_0.1.6_x64-setup.exe' -OutFile '$env:TEMP\\FucuFlow-setup.exe'; Start-Process '$env:TEMP\\FucuFlow-setup.exe' -Wait"`
                            )
                          }
                          className="px-2.5 py-1 rounded-lg bg-[#FFF1E8] hover:bg-[#FFE5D6] text-[#FF6B2C] font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors border border-[#FF6B2C]/20"
                        >
                          {copiedCmd?.includes("FucuFlow_0.1.6_x64-setup.exe") ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedCmd?.includes("FucuFlow_0.1.6_x64-setup.exe") ? "Copied!" : "Copy Command"}</span>
                        </button>
                      </div>
                      <pre className="p-3 rounded-xl bg-[#0C0F17] text-[#E2E8F0] font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800 select-all">
                        <code>powershell -ExecutionPolicy Bypass -Command &quot;iwr -useb &apos;https://github.com/ericva01/focuZoom/releases/download/v0.1.6/FucuFlow_0.1.6_x64-setup.exe&apos; -OutFile &apos;$env:TEMP\FucuFlow-setup.exe&apos;; Start-Process &apos;$env:TEMP\FucuFlow-setup.exe&apos; -Wait&quot;</code>
                      </pre>
                    </div>

                    {/* Method 2: MSI Enterprise Silent Install */}
                    <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs">
                      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                        <span className="text-xs font-bold text-[#111318]">
                          2. Windows MSI Package (Silent / Enterprise Install):
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              `msiexec /i "https://github.com/ericva01/focuZoom/releases/download/v0.1.6/FucuFlow_0.1.6_x64_en-US.msi" /qn`
                            )
                          }
                          className="px-2.5 py-1 rounded-lg bg-[#FFF1E8] hover:bg-[#FFE5D6] text-[#FF6B2C] font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors border border-[#FF6B2C]/20"
                        >
                          {copiedCmd?.includes(".msi") ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedCmd?.includes(".msi") ? "Copied!" : "Copy MSI Command"}</span>
                        </button>
                      </div>
                      <pre className="p-3 rounded-xl bg-[#0C0F17] text-[#E2E8F0] font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800 select-all">
                        <code>msiexec /i &quot;https://github.com/ericva01/focuZoom/releases/download/v0.1.6/FucuFlow_0.1.6_x64_en-US.msi&quot; /qn</code>
                      </pre>
                    </div>
                  </div>
                )}

                {activeCliTab === "mac" && (
                  <div className="space-y-4">
                    {/* Apple Silicon */}
                    <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs">
                      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                        <span className="text-xs font-bold text-[#111318]">
                          Apple Silicon (M1/M2/M3/M4) — Download, Install &amp; Auto-Authorize:
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              `curl -L -o /tmp/FucuFlow.dmg https://github.com/ericva01/focuZoom/releases/download/v0.1.6/FucuFlow_0.1.6_aarch64.dmg && hdiutil attach /tmp/FucuFlow.dmg -nobrowse && cp -R /Volumes/FucuFlow*/FucuFlow.app /Applications/ && hdiutil detach /Volumes/FucuFlow* && xattr -cr /Applications/FucuFlow.app && open /Applications/FucuFlow.app`
                            )
                          }
                          className="px-2.5 py-1 rounded-lg bg-[#FFF1E8] hover:bg-[#FFE5D6] text-[#FF6B2C] font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors border border-[#FF6B2C]/20"
                        >
                          {copiedCmd?.includes("aarch64") ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedCmd?.includes("aarch64") ? "Copied!" : "Copy Command"}</span>
                        </button>
                      </div>
                      <pre className="p-3 rounded-xl bg-[#0C0F17] text-[#E2E8F0] font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800 select-all">
                        <code>curl -L -o /tmp/FucuFlow.dmg https://github.com/ericva01/focuZoom/releases/download/v0.1.6/FucuFlow_0.1.6_aarch64.dmg &amp;&amp; hdiutil attach /tmp/FucuFlow.dmg -nobrowse &amp;&amp; cp -R /Volumes/FucuFlow*/FucuFlow.app /Applications/ &amp;&amp; hdiutil detach /Volumes/FucuFlow* &amp;&amp; xattr -cr /Applications/FucuFlow.app &amp;&amp; open /Applications/FucuFlow.app</code>
                      </pre>
                    </div>

                    {/* Intel Mac */}
                    <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs">
                      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                        <span className="text-xs font-bold text-[#111318]">
                          Intel Mac (x64) — Download, Install &amp; Auto-Authorize:
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              `curl -L -o /tmp/FucuFlow.dmg https://github.com/ericva01/focuZoom/releases/download/v0.1.6/FucuFlow_0.1.6_x64.dmg && hdiutil attach /tmp/FucuFlow.dmg -nobrowse && cp -R /Volumes/FucuFlow*/FucuFlow.app /Applications/ && hdiutil detach /Volumes/FucuFlow* && xattr -cr /Applications/FucuFlow.app && open /Applications/FucuFlow.app`
                            )
                          }
                          className="px-2.5 py-1 rounded-lg bg-[#FFF1E8] hover:bg-[#FFE5D6] text-[#FF6B2C] font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors border border-[#FF6B2C]/20"
                        >
                          {copiedCmd?.includes("0.1.6_x64.dmg") ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedCmd?.includes("0.1.6_x64.dmg") ? "Copied!" : "Copy Command"}</span>
                        </button>
                      </div>
                      <pre className="p-3 rounded-xl bg-[#0C0F17] text-[#E2E8F0] font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800 select-all">
                        <code>curl -L -o /tmp/FucuFlow.dmg https://github.com/ericva01/focuZoom/releases/download/v0.1.6/FucuFlow_0.1.6_x64.dmg &amp;&amp; hdiutil attach /tmp/FucuFlow.dmg -nobrowse &amp;&amp; cp -R /Volumes/FucuFlow*/FucuFlow.app /Applications/ &amp;&amp; hdiutil detach /Volumes/FucuFlow* &amp;&amp; xattr -cr /Applications/FucuFlow.app &amp;&amp; open /Applications/FucuFlow.app</code>
                      </pre>
                    </div>
                  </div>
                )}

                {activeCliTab === "linux" && (
                  <div className="space-y-4">
                    {/* AppImage Universal */}
                    <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs">
                      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                        <span className="text-xs font-bold text-[#111318]">
                          Universal Linux AppImage (Download &amp; Run):
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              `curl -LO https://github.com/ericva01/focuZoom/releases/download/v0.1.6/FucuFlow_0.1.6_amd64.AppImage && chmod +x FucuFlow_0.1.6_amd64.AppImage && ./FucuFlow_0.1.6_amd64.AppImage`
                            )
                          }
                          className="px-2.5 py-1 rounded-lg bg-[#FFF1E8] hover:bg-[#FFE5D6] text-[#FF6B2C] font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors border border-[#FF6B2C]/20"
                        >
                          {copiedCmd?.includes("AppImage") ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedCmd?.includes("AppImage") ? "Copied!" : "Copy Command"}</span>
                        </button>
                      </div>
                      <pre className="p-3 rounded-xl bg-[#0C0F17] text-[#E2E8F0] font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800 select-all">
                        <code>curl -LO https://github.com/ericva01/focuZoom/releases/download/v0.1.6/FucuFlow_0.1.6_amd64.AppImage &amp;&amp; chmod +x FucuFlow_0.1.6_amd64.AppImage &amp;&amp; ./FucuFlow_0.1.6_amd64.AppImage</code>
                      </pre>
                    </div>

                    {/* Debian / Ubuntu */}
                    <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs">
                      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                        <span className="text-xs font-bold text-[#111318]">
                          Debian / Ubuntu (.deb package):
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              `curl -LO https://github.com/ericva01/focuZoom/releases/download/v0.1.6/FucuFlow_0.1.6_amd64.deb && sudo dpkg -i FucuFlow_0.1.6_amd64.deb || sudo apt-get install -f`
                            )
                          }
                          className="px-2.5 py-1 rounded-lg bg-[#FFF1E8] hover:bg-[#FFE5D6] text-[#FF6B2C] font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors border border-[#FF6B2C]/20"
                        >
                          {copiedCmd?.includes(".deb") ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedCmd?.includes(".deb") ? "Copied!" : "Copy Command"}</span>
                        </button>
                      </div>
                      <pre className="p-3 rounded-xl bg-[#0C0F17] text-[#E2E8F0] font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800 select-all">
                        <code>curl -LO https://github.com/ericva01/focuZoom/releases/download/v0.1.6/FucuFlow_0.1.6_amd64.deb &amp;&amp; sudo dpkg -i FucuFlow_0.1.6_amd64.deb || sudo apt-get install -f</code>
                      </pre>
                    </div>
                  </div>
                )}
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
                  <WindowsIcon className="w-3.5 h-3.5" />
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
                  <AppleIcon className="w-3.5 h-3.5" />
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
                  <LinuxIcon className="w-3.5 h-3.5" />
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
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download={asset.name}
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
              <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-[#E5E7EB] pb-3">
                <button
                  type="button"
                  onClick={() => setActiveInstructionTab("win")}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeInstructionTab === "win"
                      ? "bg-[#FFF1E8] text-[#FF6B2C] border border-[#FF6B2C]/30 shadow-2xs"
                      : "text-[#667085] hover:text-[#111318]"
                  }`}
                >
                  <WindowsIcon className={`w-3.5 h-3.5 ${activeInstructionTab === "win" ? "text-[#0078D4]" : "text-slate-400"}`} />
                  <span>Windows Setup</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInstructionTab("mac")}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeInstructionTab === "mac"
                      ? "bg-[#FFF1E8] text-[#FF6B2C] border border-[#FF6B2C]/30 shadow-2xs"
                      : "text-[#667085] hover:text-[#111318]"
                  }`}
                >
                  <AppleIcon className={`w-3.5 h-3.5 ${activeInstructionTab === "mac" ? "text-slate-900" : "text-slate-400"}`} />
                  <span>macOS Gatekeeper</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInstructionTab("linux")}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeInstructionTab === "linux"
                      ? "bg-[#FFF1E8] text-[#FF6B2C] border border-[#FF6B2C]/30 shadow-2xs"
                      : "text-[#667085] hover:text-[#111318]"
                  }`}
                >
                  <LinuxIcon className={`w-3.5 h-3.5 ${activeInstructionTab === "linux" ? "text-amber-500" : "text-slate-400"}`} />
                  <span>Linux Permissions</span>
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
                  <div className="space-y-4">
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs leading-relaxed">
                      <p className="font-bold text-amber-950 flex items-center gap-1.5 mb-1">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        Why does macOS say &ldquo;FucuFlow is damaged&rdquo; or block it?
                      </p>
                      FucuFlow is a free, 100% open-source application and is not yet signed with a paid Apple Developer certificate ($99/year). macOS Gatekeeper flags all unsigned third-party binaries as quarantined. You can unlock it in 5 seconds using either method below:
                    </div>

                    <div className="space-y-2">
                      <p className="font-bold text-[#111318] text-xs">
                        Step 1: Install to Applications
                      </p>
                      <p className="text-xs text-[#475467]">
                        Open the downloaded <code>.dmg</code> file and drag the <strong>FucuFlow</strong> icon into your <code>/Applications</code> folder.
                      </p>
                    </div>

                    <div className="space-y-2.5 p-3.5 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB]">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-bold text-xs text-[#111318]">
                          Method A (Fastest): Run Terminal Command
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy("xattr -cr /Applications/FucuFlow.app")}
                          className="px-2.5 py-1 rounded-lg bg-[#FF6B2C] hover:bg-[#E85A1F] text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                        >
                          {copiedCmd === "xattr -cr /Applications/FucuFlow.app" ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedCmd === "xattr -cr /Applications/FucuFlow.app" ? "Copied!" : "Copy Command"}</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-[#475467]">
                        Open Terminal (press <kbd className="px-1 py-0.5 rounded bg-white border border-[#CBD5E1] text-[10px] font-mono">Cmd + Space</kbd>, type <em>Terminal</em>, press Enter) and paste:
                      </p>
                      <code className="block p-2 rounded-lg bg-white border border-[#CBD5E1] font-mono text-[11px] text-[#111318] select-all">
                        xattr -cr /Applications/FucuFlow.app
                      </code>
                      <p className="text-[11px] text-[#667085]">
                        This removes the quarantine flag so FucuFlow opens instantly without any warnings.
                      </p>
                    </div>

                    <div className="space-y-2 p-3.5 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB]">
                      <span className="font-bold text-xs text-[#111318] block">
                        Method B: macOS System Settings (Sequoia 15 &amp; Sonoma 14)
                      </span>
                      <ol className="list-decimal pl-5 space-y-1 text-[11px] text-[#475467]">
                        <li>Try opening <strong>FucuFlow</strong> from your Applications folder once. Click <strong>Done</strong> on the warning dialog.</li>
                        <li>Open <strong>System Settings</strong> (Apple menu  &rarr; System Settings).</li>
                        <li>Click <strong>Privacy &amp; Security</strong> in the sidebar.</li>
                        <li>Scroll down to the <strong>Security</strong> section. You will see: <em>&ldquo;FucuFlow was blocked from use because it is not from an identified developer&rdquo;</em>.</li>
                        <li>Click the <strong>&ldquo;Open Anyway&rdquo;</strong> button, enter your Mac administrator password, and click <strong>Open</strong>.</li>
                      </ol>
                    </div>
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

