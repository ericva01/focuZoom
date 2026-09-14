import { contextBridge, ipcRenderer } from "electron";

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

export interface AppInfo {
  name: string;
  version: string;
  platform: string;
  arch: string;
  electronVersion: string;
}

const electronAPI = {
  isElectron: true as const,
  platform: process.platform,

  /**
   * Prompts native OS file picker for video files (.mp4, .mov, .webm, .mkv, .avi)
   */
  openVideoDialog: (): Promise<OpenVideoResult> => {
    return ipcRenderer.invoke("dialog:openVideo");
  },

  /**
   * Native OS dialog to save .glideo project configuration
   */
  saveProjectDialog: (options: { defaultPath?: string; data: string }): Promise<SaveDialogResult> => {
    return ipcRenderer.invoke("dialog:saveProject", options);
  },

  /**
   * Native OS dialog to save exported video binary
   */
  saveExportedVideo: (defaultName: string, buffer: ArrayBuffer): Promise<SaveDialogResult> => {
    return ipcRenderer.invoke("dialog:saveExportedVideo", { defaultName, buffer });
  },

  /**
   * Reads a local file from disk safely
   */
  readFile: (filePath: string, asBase64: boolean = false): Promise<string> => {
    return ipcRenderer.invoke("fs:readFile", { filePath, asBase64 });
  },

  /**
   * Writes data to a local file on disk
   */
  writeFile: (filePath: string, content: string | ArrayBuffer): Promise<boolean> => {
    return ipcRenderer.invoke("fs:writeFile", { filePath, content });
  },

  /**
   * Lists available desktop screens and application windows for native recording
   */
  getDesktopSources: (options?: { types?: Array<"window" | "screen"> }): Promise<DesktopSourceInfo[]> => {
    return ipcRenderer.invoke("screen:getSources", options);
  },

  /**
   * Gets app version and runtime architecture
   */
  getAppInfo: (): Promise<AppInfo> => {
    return ipcRenderer.invoke("app:getInfo");
  },

  /**
   * Safely open external hyperlinks in system default browser
   */
  openExternal: (url: string): Promise<void> => {
    return ipcRenderer.invoke("shell:openExternal", url);
  },

  /**
   * Show a file or folder in native file explorer
   */
  showItemInFolder: (fullPath: string): Promise<void> => {
    return ipcRenderer.invoke("shell:showItemInFolder", fullPath);
  },

  /**
   * Subscribes to application menu actions (e.g., File -> Open Video, etc.)
   */
  onMenuAction: (callback: (action: string) => void) => {
    const handler = (_event: any, action: string) => callback(action);
    ipcRenderer.on("menu:action", handler);
    return () => {
      ipcRenderer.removeListener("menu:action", handler);
    };
  },
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
