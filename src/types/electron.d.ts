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

export interface ElectronAPI {
  isElectron: boolean;
  platform: string;
  openVideoDialog: () => Promise<OpenVideoResult>;
  saveProjectDialog: (options: { defaultPath?: string; data: string }) => Promise<SaveDialogResult>;
  saveExportedVideo: (defaultName: string, buffer: ArrayBuffer) => Promise<SaveDialogResult>;
  readFile: (filePath: string, asBase64?: boolean) => Promise<string>;
  writeFile: (filePath: string, content: string | ArrayBuffer) => Promise<boolean>;
  getDesktopSources: (options?: { types?: Array<"window" | "screen"> }) => Promise<DesktopSourceInfo[]>;
  getAppInfo: () => Promise<AppInfo>;
  openExternal: (url: string) => Promise<void>;
  showItemInFolder: (fullPath: string) => Promise<void>;
  onMenuAction: (callback: (action: string) => void) => () => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
