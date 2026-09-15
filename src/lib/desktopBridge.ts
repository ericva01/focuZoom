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
   * Lets user choose an export destination folder
   */
  async chooseExportFolder(): Promise<{ canceled: boolean; folderPath?: string }> {
    if (isTauriEnvironment()) {
      try {
        const { open } = await import("@tauri-apps/plugin-dialog");
        const selected = await open({
          directory: true,
          multiple: false,
          title: "Select Destination Folder for Video Export",
        });
        if (!selected) return { canceled: true };
        const folderPath = typeof selected === "string" ? selected : selected[0];
        return { canceled: false, folderPath };
      } catch (err) {
        console.error("[DesktopBridge:Tauri] chooseExportFolder failed:", err);
        return { canceled: true };
      }
    }

    const extWin = typeof window !== "undefined" ? (window as unknown as {
      electronAPI?: {
        chooseExportFolder?: () => Promise<{ canceled: boolean; folderPath?: string }>;
        showItemInFolder?: (filePath: string) => Promise<void>;
      };
      showDirectoryPicker?: (opts?: { mode?: string }) => Promise<{ name: string }>;
      showSaveFilePicker?: (opts?: {
        suggestedName?: string;
        types?: Array<{ description: string; accept: Record<string, string[]> }>;
      }) => Promise<{
        name: string;
        createWritable: () => Promise<{
          write: (data: ArrayBuffer) => Promise<void>;
          close: () => Promise<void>;
        }>;
      }>;
    }) : undefined;

    if (isElectronEnvironment() && extWin?.electronAPI?.chooseExportFolder) {
      return extWin.electronAPI.chooseExportFolder();
    }

    // Modern browser Directory Picker API
    if (extWin?.showDirectoryPicker) {
      try {
        const dirHandle = await extWin.showDirectoryPicker({
          mode: "readwrite",
        });
        return { canceled: false, folderPath: dirHandle.name };
      } catch {
        return { canceled: true };
      }
    }

    return { canceled: true };
  },

  /**
   * Reveals a file or folder in the OS file manager (File Explorer on Windows, Finder on macOS)
   */
  async showInFolder(filePath: string): Promise<void> {
    if (!filePath) return;
    if (isTauriEnvironment()) {
      try {
        const { revealItemInDir } = await import("@tauri-apps/plugin-opener");
        await revealItemInDir(filePath);
        return;
      } catch (err) {
        console.warn("[DesktopBridge:Tauri] revealItemInDir failed:", err);
      }
    }
    const extWin = typeof window !== "undefined" ? (window as unknown as {
      electronAPI?: { showItemInFolder?: (p: string) => Promise<void> };
    }) : undefined;
    if (isElectronEnvironment() && extWin?.electronAPI?.showItemInFolder) {
      return extWin.electronAPI.showItemInFolder(filePath);
    }
  },

  /**
   * Native OS dialog to save exported video binary to chosen folder
   */
  async saveExportedVideo(
    defaultName: string,
    buffer: ArrayBuffer,
    destinationOverride?: string
  ): Promise<SaveDialogResult> {
    if (isTauriEnvironment()) {
      try {
        const { save } = await import("@tauri-apps/plugin-dialog");
        const { writeFile } = await import("@tauri-apps/plugin-fs");

        let targetPath: string | undefined = destinationOverride;

        if (targetPath) {
          // If destination is a folder, append file name
          if (!targetPath.endsWith(".webm") && !targetPath.endsWith(".mp4")) {
            const sep = targetPath.includes("/") ? "/" : "\\";
            targetPath = `${targetPath}${targetPath.endsWith(sep) ? "" : sep}${defaultName || "Glideo-Export.webm"}`;
          }
        } else {
          const selectedPath = await save({
            defaultPath: defaultName || "Glideo-Export.webm",
            filters: [
              {
                name: "WebM Video (*.webm)",
                extensions: ["webm"],
              },
              {
                name: "MP4 Video (*.mp4)",
                extensions: ["mp4"],
              },
            ],
          });
          targetPath = selectedPath || undefined;
        }

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

    // Modern browser Save File Picker API: lets user choose destination folder & file
    const extWin = typeof window !== "undefined" ? (window as unknown as {
      showSaveFilePicker?: (opts?: {
        suggestedName?: string;
        types?: Array<{ description: string; accept: Record<string, string[]> }>;
      }) => Promise<{
        name: string;
        createWritable: () => Promise<{
          write: (data: ArrayBuffer) => Promise<void>;
          close: () => Promise<void>;
        }>;
      }>;
    }) : undefined;

    if (extWin?.showSaveFilePicker) {
      try {
        const handle = await extWin.showSaveFilePicker({
          suggestedName: defaultName || "Glideo-Export.webm",
          types: [
            {
              description: "WebM Video (*.webm)",
              accept: { "video/webm": [".webm"] },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(buffer);
        await writable.close();
        return { canceled: false, filePath: handle.name };
      } catch (err: unknown) {
        if ((err as { name?: string })?.name === "AbortError") {
          return { canceled: true };
        }
        // Fall back to standard anchor download
      }
    }

    // Web fallback: trigger browser binary download
    try {
      const blob = new Blob([buffer], { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = defaultName || "Glideo-Export.webm";
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
