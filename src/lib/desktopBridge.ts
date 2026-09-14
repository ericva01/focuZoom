"use client";

/**
 * Unified Desktop Bridge for Glideo
 * Seamlessly interfaces with both Tauri v2 and Electron desktop environments,
 * while providing graceful fallbacks for web browsers.
 */

export interface OpenVideoResult {
  canceled: boolean;
  filePath?: string;
  fileName?: string;
  dataUrl?: string;
  size?: number;
}

export interface SaveDialogResult {
  canceled: boolean;
  filePath?: string;
}

export interface DesktopSourceInfo {
  id: string;
  name: string;
  thumbnail: string;
}

declare global {
  interface Window {
    __TAURI_INTERNALS__?: unknown;
    __TAURI__?: unknown;
  }
}

// -----------------------------------------------------------------------------
// Environment Detection
// -----------------------------------------------------------------------------

export function isTauriEnvironment(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(window.__TAURI_INTERNALS__ || window.__TAURI__);
}

export function isElectronEnvironment(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(window.electronAPI?.isElectron);
}

export function isDesktopApp(): boolean {
  return isTauriEnvironment() || isElectronEnvironment();
}

// -----------------------------------------------------------------------------
// Unified Bridge API
// -----------------------------------------------------------------------------

export const desktopBridge = {
  get isDesktop(): boolean {
    return isDesktopApp();
  },

  get isTauri(): boolean {
    return isTauriEnvironment();
  },

  get isElectron(): boolean {
    return isElectronEnvironment();
  },

  /**
   * Prompts native OS file picker for video files (.mp4, .mov, .webm, .mkv, .avi)
   */
  async openVideoDialog(): Promise<OpenVideoResult> {
    if (isTauriEnvironment()) {
      try {
        const { open } = await import("@tauri-apps/plugin-dialog");
        const { convertFileSrc } = await import("@tauri-apps/api/core");

        const selected = await open({
          multiple: false,
          directory: false,
          filters: [
            {
              name: "Video Files",
              extensions: ["mp4", "mov", "webm", "mkv", "avi"],
            },
            {
              name: "All Files",
              extensions: ["*"],
            },
          ],
        });

        if (!selected) {
          return { canceled: true };
        }

        const filePath = typeof selected === "string" ? selected : "";
        if (!filePath) {
          return { canceled: true };
        }
        const fileName = filePath.split(/[\\/]/).pop() || "video.mp4";
        // Convert local filesystem path to asset URL for streaming into <video> tag
        const dataUrl = convertFileSrc(filePath);

        return {
          canceled: false,
          filePath,
          fileName,
          dataUrl,
        };
      } catch (err) {
        console.error("[DesktopBridge:Tauri] openVideoDialog failed:", err);
        return { canceled: true };
      }
    }

    if (isElectronEnvironment() && window.electronAPI?.openVideoDialog) {
      return window.electronAPI.openVideoDialog();
    }

    return { canceled: true };
  },

  /**
   * Native OS dialog to save .glideo project configuration
   */
  async saveProjectDialog(options: { defaultPath?: string; data: string }): Promise<SaveDialogResult> {
    if (isTauriEnvironment()) {
      try {
        const { save } = await import("@tauri-apps/plugin-dialog");
        const { writeTextFile } = await import("@tauri-apps/plugin-fs");

        const targetPath = await save({
          defaultPath: options.defaultPath || "project.glideo",
          filters: [
            {
              name: "Glideo Project (*.glideo)",
              extensions: ["glideo"],
            },
          ],
        });

        if (!targetPath) {
          return { canceled: true };
        }

        await writeTextFile(targetPath, options.data);
        return { canceled: false, filePath: targetPath };
      } catch (err) {
        console.error("[DesktopBridge:Tauri] saveProjectDialog failed:", err);
        return { canceled: true };
      }
    }

    if (isElectronEnvironment() && window.electronAPI?.saveProjectDialog) {
      return window.electronAPI.saveProjectDialog(options);
    }

    // Web fallback: trigger browser text download
    try {
      const blob = new Blob([options.data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = options.defaultPath || "project.glideo";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return { canceled: false };
    } catch {
      return { canceled: true };
    }
  },

  /**
   * Native OS dialog to save exported video binary
   */
  async saveExportedVideo(defaultName: string, buffer: ArrayBuffer): Promise<SaveDialogResult> {
    if (isTauriEnvironment()) {
      try {
        const { save } = await import("@tauri-apps/plugin-dialog");
        const { writeFile } = await import("@tauri-apps/plugin-fs");

        const targetPath = await save({
          defaultPath: defaultName || "Glideo-Export.mp4",
          filters: [
            {
              name: "MP4 Video (*.mp4)",
              extensions: ["mp4"],
            },
            {
              name: "WebM Video (*.webm)",
              extensions: ["webm"],
            },
          ],
        });

        if (!targetPath) {
          return { canceled: true };
        }

        await writeFile(targetPath, new Uint8Array(buffer));
        return { canceled: false, filePath: targetPath };
      } catch (err) {
        console.error("[DesktopBridge:Tauri] saveExportedVideo failed:", err);
        return { canceled: true };
      }
    }

    if (isElectronEnvironment() && window.electronAPI?.saveExportedVideo) {
      return window.electronAPI.saveExportedVideo(defaultName, buffer);
    }

    // Web fallback: trigger browser binary download
    try {
      const blob = new Blob([buffer], { type: "video/mp4" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = defaultName || "Glideo-Export.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return { canceled: false };
    } catch {
      return { canceled: true };
    }
  },

  /**
   * Opens external hyperlinks in system default web browser
   */
  async openExternal(url: string): Promise<void> {
    if (isTauriEnvironment()) {
      try {
        const { openUrl } = await import("@tauri-apps/plugin-opener");
        await openUrl(url);
        return;
      } catch {
        // fallback
      }
    }

    if (isElectronEnvironment() && window.electronAPI?.openExternal) {
      return window.electronAPI.openExternal(url);
    }

    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  },

  /**
   * Highlights a file or folder in native OS file explorer
   */
  async showItemInFolder(fullPath: string): Promise<void> {
    if (isTauriEnvironment()) {
      try {
        const { invoke } = await import("@tauri-apps/api/core");
        await invoke("show_item_in_folder", { path: fullPath });
        return;
      } catch (err) {
        console.error("[DesktopBridge:Tauri] showItemInFolder failed:", err);
      }
    }

    if (isElectronEnvironment() && window.electronAPI?.showItemInFolder) {
      return window.electronAPI.showItemInFolder(fullPath);
    }
  },

  /**
   * Lists available desktop screens and application windows (for Electron)
   */
  async getDesktopSources(): Promise<DesktopSourceInfo[]> {
    if (isElectronEnvironment() && window.electronAPI?.getDesktopSources) {
      return window.electronAPI.getDesktopSources();
    }
    // In Tauri / WebView2, standard navigator.mediaDevices.getDisplayMedia handles source picking
    return [];
  },

  /**
   * Starts native OS-level global mouse click tracking across all Windows apps
   */
  async startMouseTracking(): Promise<void> {
    if (isTauriEnvironment()) {
      try {
        const { invoke } = await import("@tauri-apps/api/core");
        await invoke("start_mouse_tracking");
      } catch (err) {
        console.warn("[DesktopBridge] start_mouse_tracking:", err);
      }
    }
  },

  /**
   * Stops native OS-level global mouse click tracking and returns logged clicks and cursor trail
   */
  async stopMouseTracking(): Promise<{
    clicks: Array<{ timestamp: number; x: number; y: number }>;
    trail: Array<{ timestamp: number; x: number; y: number }>;
  }> {
    if (isTauriEnvironment()) {
      try {
        const { invoke } = await import("@tauri-apps/api/core");
        const res = await invoke<{
          clicks?: Array<{ timestamp: number; x: number; y: number }>;
          trail?: Array<{ timestamp: number; x: number; y: number }>;
        } | Array<{ timestamp: number; x: number; y: number }>>("stop_mouse_tracking");
        if (Array.isArray(res)) {
          return { clicks: res, trail: [] };
        }
        return {
          clicks: res?.clicks || [],
          trail: res?.trail || [],
        };
      } catch (err) {
        console.warn("[DesktopBridge] stop_mouse_tracking:", err);
      }
    }
    return { clicks: [], trail: [] };
  },
};
