"use client";

import { useState, useEffect, useCallback } from "react";
import { desktopBridge } from "@/lib/desktopBridge";

export const APP_CURRENT_VERSION = "0.2.0";
const GITHUB_REPO = "ericva01/focuZoom";
const DISMISSED_UPDATE_KEY = "fucuflow_dismissed_update_version";
const LAST_CHECKED_KEY = "fucuflow_last_update_check";

export interface ReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

export interface AppReleaseInfo {
  version: string;
  name: string;
  body: string;
  publishedAt: string;
  htmlUrl: string;
  downloadUrl?: string;
  assets: ReleaseAsset[];
}

/**
 * Compares two semantic version strings (e.g. "0.2.1" vs "0.2.0" or "v0.2.1" vs "0.2.0").
 * Returns true if remote is strictly newer than current.
 */
export function isNewerVersion(remote: string, current: string): boolean {
  const cleanRemote = remote.replace(/^v/i, "").trim();
  const cleanCurrent = current.replace(/^v/i, "").trim();

  const rParts = cleanRemote.split(".").map((n) => parseInt(n, 10) || 0);
  const cParts = cleanCurrent.split(".").map((n) => parseInt(n, 10) || 0);

  const length = Math.max(rParts.length, cParts.length);
  for (let i = 0; i < length; i++) {
    const r = rParts[i] ?? 0;
    const c = cParts[i] ?? 0;
    if (r > c) return true;
    if (r < c) return false;
  }
  return false;
}

/**
 * Detects the user's OS platform to pick the matching release binary asset.
 */
function findBestPlatformAsset(assets: ReleaseAsset[]): string | undefined {
  if (typeof window === "undefined" || !assets.length) return undefined;

  const ua = window.navigator.userAgent.toLowerCase();
  const isMac = ua.includes("mac");
  const isWin = ua.includes("win");
  const isLinux = ua.includes("linux");

  if (isWin) {
    const exe = assets.find((a) => a.name.endsWith(".exe"));
    if (exe) return exe.browser_download_url;
    const msi = assets.find((a) => a.name.endsWith(".msi"));
    if (msi) return msi.browser_download_url;
  } else if (isMac) {
    // Check if Apple Silicon
    const isArm = ua.includes("arm") || ua.includes("apple");
    if (isArm) {
      const armDmg = assets.find((a) => a.name.includes("aarch64") && a.name.endsWith(".dmg"));
      if (armDmg) return armDmg.browser_download_url;
    }
    const macDmg = assets.find((a) => a.name.endsWith(".dmg"));
    if (macDmg) return macDmg.browser_download_url;
  } else if (isLinux) {
    const appImage = assets.find((a) => a.name.endsWith(".AppImage"));
    if (appImage) return appImage.browser_download_url;
    const deb = assets.find((a) => a.name.endsWith(".deb"));
    if (deb) return deb.browser_download_url;
  }

  // Fallback to first installer asset or release url
  return assets[0]?.browser_download_url;
}

export function useAppUpdater() {
  const [isChecking, setIsChecking] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [releaseInfo, setReleaseInfo] = useState<AppReleaseInfo | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<string | null>(null);

  const checkForUpdates = useCallback(async (isManual = false) => {
    setIsChecking(true);
    setError(null);

    try {
      const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`, {
        headers: { Accept: "application/vnd.github.v3+json" },
        cache: "no-store",
      });

      if (!response.ok) {
        if (response.status === 404) {
          // No releases yet
          setUpdateAvailable(false);
          return null;
        }
        throw new Error(`Failed to fetch release info (HTTP ${response.status})`);
      }

      const data = await response.json();
      const latestTag = data.tag_name || "";
      const rawAssets: ReleaseAsset[] = Array.isArray(data.assets)
        ? data.assets.map((a: { name: string; browser_download_url: string; size: number }) => ({
            name: a.name,
            browser_download_url: a.browser_download_url,
            size: a.size,
          }))
        : [];

      const info: AppReleaseInfo = {
        version: latestTag.replace(/^v/i, ""),
        name: data.name || latestTag,
        body: data.body || "",
        publishedAt: data.published_at || new Date().toISOString(),
        htmlUrl: data.html_url || `https://github.com/${GITHUB_REPO}/releases`,
        downloadUrl: findBestPlatformAsset(rawAssets) || data.html_url,
        assets: rawAssets,
      };

      const hasNewer = isNewerVersion(info.version, APP_CURRENT_VERSION);
      setReleaseInfo(info);
      setUpdateAvailable(hasNewer);

      const nowStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setLastChecked(nowStr);
      try {
        localStorage.setItem(LAST_CHECKED_KEY, nowStr);
      } catch {}

      if (hasNewer) {
        try {
          const dismissedVersion = localStorage.getItem(DISMISSED_UPDATE_KEY);
          if (dismissedVersion === info.version && !isManual) {
            setIsDismissed(true);
          } else {
            setIsDismissed(false);
          }
        } catch {}
      }

      return info;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to check for updates";
      setError(msg);
      return null;
    } finally {
      setIsChecking(false);
    }
  }, []);

  const dismissUpdate = useCallback(() => {
    if (releaseInfo) {
      try {
        localStorage.setItem(DISMISSED_UPDATE_KEY, releaseInfo.version);
      } catch {}
    }
    setIsDismissed(true);
  }, [releaseInfo]);

  const downloadUpdate = useCallback(async () => {
    const url = releaseInfo?.downloadUrl || releaseInfo?.htmlUrl || `https://github.com/${GITHUB_REPO}/releases/latest`;
    await desktopBridge.openExternal(url);
  }, [releaseInfo]);

  useEffect(() => {
    try {
      const savedLast = localStorage.getItem(LAST_CHECKED_KEY);
      if (savedLast) setLastChecked(savedLast);
    } catch {}

    // Check on initial load
    checkForUpdates(false);
  }, [checkForUpdates]);

  return {
    currentVersion: APP_CURRENT_VERSION,
    latestVersion: releaseInfo?.version || APP_CURRENT_VERSION,
    isChecking,
    updateAvailable,
    isDismissed,
    releaseInfo,
    error,
    lastChecked,
    checkForUpdates: () => checkForUpdates(true),
    dismissUpdate,
    downloadUpdate,
  };
}
