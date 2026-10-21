"use client";

/**
 * Google Drive Cloud Storage Service for FucuFlow Studio
 * Enables users to connect their personal Google Drive account to save
 * rendered videos and backed-up project files directly into a dedicated folder.
 */

export interface GoogleDriveUser {
  email: string;
  name?: string;
  picture?: string;
}

export interface GoogleDriveUploadResult {
  id: string;
  name: string;
  webViewLink?: string;
  webContentLink?: string;
  size?: string;
}

export interface GoogleDriveStatus {
  isConnected: boolean;
  user: GoogleDriveUser | null;
  folderId: string | null;
  clientId: string;
}

const STORAGE_TOKEN_KEY = "fucuflow_gdrive_access_token";
const STORAGE_EXPIRES_KEY = "fucuflow_gdrive_expires_at";
const STORAGE_CLIENT_ID_KEY = "fucuflow_gdrive_client_id";
const STORAGE_USER_KEY = "fucuflow_gdrive_user";
const STORAGE_FOLDER_KEY = "fucuflow_gdrive_folder_id";

// Default public client ID (can be configured by developer or overridden by user in settings)
const DEFAULT_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "";

const FOLDER_NAME = "FucuFlow Studio Videos";

// Scopes: drive.file (safe, grants access ONLY to files created by this app) + userinfo.email + profile
const SCOPES = [
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
].join(" ");

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string; expires_in?: number }) => void;
            error_callback?: (err: unknown) => void;
          }) => {
            requestAccessToken: (opts?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

class GoogleDriveService {
  private scriptLoadingPromise: Promise<boolean> | null = null;

  /**
   * Loads Google Identity Services client script dynamically
   */
  public async loadGoogleScript(): Promise<boolean> {
    if (typeof window === "undefined") return false;
    if (window.google?.accounts?.oauth2) return true;

    if (this.scriptLoadingPromise) return this.scriptLoadingPromise;

    this.scriptLoadingPromise = new Promise((resolve) => {
      const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existing) {
        let attempts = 0;
        const checkInterval = setInterval(() => {
          attempts++;
          if (window.google?.accounts?.oauth2) {
            clearInterval(checkInterval);
            resolve(true);
          } else if (attempts > 30) {
            clearInterval(checkInterval);
            resolve(false);
          }
        }, 100);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        let attempts = 0;
        const checkInterval = setInterval(() => {
          attempts++;
          if (window.google?.accounts?.oauth2) {
            clearInterval(checkInterval);
            resolve(true);
          } else if (attempts > 20) {
            clearInterval(checkInterval);
            resolve(false);
          }
        }, 50);
      };
      script.onerror = () => {
        console.warn("[FucuFlow:GoogleDrive] Failed to load Google Identity client script.");
        resolve(false);
      };
      document.body.appendChild(script);
    });

    return this.scriptLoadingPromise;
  }

  public getStoredClientId(): string {
    if (typeof window === "undefined") return DEFAULT_CLIENT_ID;
    return localStorage.getItem(STORAGE_CLIENT_ID_KEY) || DEFAULT_CLIENT_ID;
  }

  public setStoredClientId(clientId: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_CLIENT_ID_KEY, clientId.trim());
  }

  public getStoredToken(): string | null {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem(STORAGE_TOKEN_KEY);
    if (!token) return null;

    const expiresAt = localStorage.getItem(STORAGE_EXPIRES_KEY);
    if (expiresAt && Date.now() > parseInt(expiresAt, 10)) {
      // Token has expired
      this.clearToken();
      return null;
    }

    return token;
  }

  public setStoredToken(token: string, expiresInSeconds: number = 3600): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_TOKEN_KEY, token);
    const expiresAt = Date.now() + (expiresInSeconds - 60) * 1000;
    localStorage.setItem(STORAGE_EXPIRES_KEY, expiresAt.toString());
  }

  public clearToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_EXPIRES_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    localStorage.removeItem(STORAGE_FOLDER_KEY);
  }

  public getUserProfile(): GoogleDriveUser | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as GoogleDriveUser;
    } catch {
      return null;
    }
  }

  public setUserProfile(user: GoogleDriveUser | null): void {
    if (typeof window === "undefined") return;
    if (!user) {
      localStorage.removeItem(STORAGE_USER_KEY);
    } else {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    }
  }

  public getStoredFolderId(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_FOLDER_KEY);
  }

  public setStoredFolderId(folderId: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_FOLDER_KEY, folderId);
  }

  /**
   * Fetches the user's basic Google profile (email, name, picture) using the access token
   */
  public async fetchUserProfile(token: string): Promise<GoogleDriveUser | null> {
    try {
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return null;
      const data = await res.json();
      const user: GoogleDriveUser = {
        email: data.email,
        name: data.name || data.given_name || data.email,
        picture: data.picture,
      };
      this.setUserProfile(user);
      return user;
    } catch (err) {
      console.warn("[FucuFlow:GoogleDrive] Could not fetch user profile:", err);
      return null;
    }
  }

  /**
   * Initiates Google OAuth2 token request flow via Google Identity Services
   */
  public async requestGoogleDriveAccess(customClientId?: string): Promise<{ success: boolean; error?: string }> {
    const isLoaded = await this.loadGoogleScript();
    if (!isLoaded || !window.google?.accounts?.oauth2) {
      return { success: false, error: "Google Identity client could not be loaded. Please check your internet connection." };
    }

    const clientId = customClientId?.trim() || this.getStoredClientId();
    if (!clientId) {
      return {
        success: false,
        error: "A Google Client ID is required to connect to personal Google Drive. Enter your Client ID in Settings or Google Drive modal.",
      };
    }

    return new Promise((resolve) => {
      try {
        const client = window.google!.accounts!.oauth2!.initTokenClient({
          client_id: clientId,
          scope: SCOPES,
          callback: async (response) => {
            if (response.error) {
              resolve({ success: false, error: `Google OAuth Error: ${response.error}` });
              return;
            }

            if (response.access_token) {
              const expiresIn = response.expires_in || 3600;
              this.setStoredToken(response.access_token, expiresIn);
              this.setStoredClientId(clientId);
              await this.fetchUserProfile(response.access_token);
              // Pre-fetch or create folder
              this.getOrCreateFucuFlowFolder(response.access_token).catch(() => {});
              resolve({ success: true });
            } else {
              resolve({ success: false, error: "No access token returned by Google." });
            }
          },
          error_callback: (err: unknown) => {
            const msg = typeof err === "object" && err !== null && "message" in err ? String((err as { message: unknown }).message) : "Authentication cancelled or failed";
            resolve({ success: false, error: msg });
          },
        });

        client.requestAccessToken({ prompt: "consent" });
      } catch (err) {
        resolve({
          success: false,
          error: err instanceof Error ? err.message : "Failed to initiate Google OAuth request.",
        });
      }
    });
  }

  /**
   * Connects via manual/direct access token (convenient for local desktop and testing)
   */
  public async connectWithAccessToken(token: string): Promise<{ success: boolean; error?: string }> {
    const cleanToken = token.trim();
    if (!cleanToken) return { success: false, error: "Access token is empty." };

    try {
      const user = await this.fetchUserProfile(cleanToken);
      if (!user) {
        return { success: false, error: "The provided token is invalid or expired. Check permissions." };
      }

      this.setStoredToken(cleanToken, 3600);
      await this.getOrCreateFucuFlowFolder(cleanToken);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to validate Google Drive access token.",
      };
    }
  }

  /**
   * Finds or creates a dedicated folder in Google Drive: "FucuFlow Studio Videos"
   */
  public async getOrCreateFucuFlowFolder(accessToken: string): Promise<string> {
    const cachedId = this.getStoredFolderId();
    if (cachedId) {
      // Validate that cached folder still exists and is accessible
      try {
        const verifyRes = await fetch(
          `https://www.googleapis.com/drive/v3/files/${cachedId}?fields=id,name,trashed`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (verifyRes.ok) {
          const folderData = await verifyRes.json();
          if (!folderData.trashed) {
            return cachedId;
          }
        }
      } catch {
        // Fall through to re-search
      }
    }

    // Query for existing folder by name
    const query = encodeURIComponent(`mimeType='application/vnd.google-apps.folder' and name='${FOLDER_NAME}' and trashed=false`);
    const searchRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)&spaces=drive`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (searchRes.ok) {
      const data = await searchRes.json();
      if (data.files && data.files.length > 0) {
        const folderId = data.files[0].id as string;
        this.setStoredFolderId(folderId);
        return folderId;
      }
    }

    // Create the folder
    const createRes = await fetch("https://www.googleapis.com/drive/v3/files?fields=id,name", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: FOLDER_NAME,
        mimeType: "application/vnd.google-apps.folder",
        description: "Exported cinematic videos and project backups from FucuFlow Studio",
      }),
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      console.warn("[FucuFlow:GoogleDrive] Failed to create dedicated folder, will upload to root:", errText);
      return "root";
    }

    const folderData = await createRes.json();
    const newFolderId = folderData.id as string;
    this.setStoredFolderId(newFolderId);
    return newFolderId;
  }

  /**
   * Uploads a video Blob to Google Drive using multipart upload with live progress tracking
   */
  public async uploadVideoToGoogleDrive(params: {
    blob: Blob;
    fileName: string;
    folderId?: string;
    description?: string;
    onProgress?: (percent: number) => void;
  }): Promise<GoogleDriveUploadResult> {
    const token = this.getStoredToken();
    if (!token) {
      throw new Error("Not signed in to Google Drive. Please connect your account first.");
    }

    let targetFolder = params.folderId || this.getStoredFolderId();
    if (!targetFolder) {
      targetFolder = await this.getOrCreateFucuFlowFolder(token);
    }

    const boundary = "-------FucuFlowUploadBoundary" + Date.now();
    const mimeType = params.blob.type || "video/webm";

    const metadata = {
      name: params.fileName,
      mimeType,
      parents: targetFolder && targetFolder !== "root" ? [targetFolder] : undefined,
      description: params.description || "Rendered with FucuFlow Studio — Autonomous 3D Screen Recording Post-Processing",
    };

    const metadataPart =
      `--${boundary}\r\n` +
      `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
      JSON.stringify(metadata) +
      `\r\n`;

    const binaryHeader =
      `--${boundary}\r\n` +
      `Content-Type: ${mimeType}\r\n\r\n`;

    const binaryFooter = `\r\n--${boundary}--`;

    const multipartBlob = new Blob([metadataPart, binaryHeader, params.blob, binaryFooter], {
      type: `multipart/related; boundary=${boundary}`,
    });

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink,size"
      );
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.setRequestHeader("Content-Type", `multipart/related; boundary=${boundary}`);

      if (xhr.upload && params.onProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.min(100, Math.max(0, Math.round((e.loaded / e.total) * 100)));
            params.onProgress!(percent);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            const sizeMb = data.size ? `${(parseInt(data.size, 10) / (1024 * 1024)).toFixed(2)} MB` : undefined;
            resolve({
              id: data.id,
              name: data.name,
              webViewLink: data.webViewLink,
              webContentLink: data.webContentLink,
              size: sizeMb,
            });
          } catch {
            reject(new Error("Failed to parse Google Drive upload response."));
          }
        } else if (xhr.status === 401) {
          this.clearToken();
          reject(new Error("Google Drive access token expired. Please reconnect your Google account."));
        } else {
          try {
            const errJson = JSON.parse(xhr.responseText);
            reject(new Error(errJson.error?.message || `Google Drive error (HTTP ${xhr.status})`));
          } catch {
            reject(new Error(`Upload failed with HTTP ${xhr.status}: ${xhr.statusText}`));
          }
        }
      };

      xhr.onerror = () => {
        reject(new Error("Network error occurred during Google Drive upload."));
      };

      xhr.onabort = () => {
        reject(new Error("Google Drive upload cancelled."));
      };

      xhr.send(multipartBlob);
    });
  }

  /**
   * Uploads project JSON backup to Google Drive
   */
  public async uploadProjectToGoogleDrive(params: {
    projectJson: string;
    fileName: string;
    onProgress?: (percent: number) => void;
  }): Promise<GoogleDriveUploadResult> {
    const blob = new Blob([params.projectJson], { type: "application/json" });
    return this.uploadVideoToGoogleDrive({
      blob,
      fileName: params.fileName.endsWith(".fucuflow") ? params.fileName : `${params.fileName}.fucuflow`,
      description: "FucuFlow Studio Project Backup",
      onProgress: params.onProgress,
    });
  }

  public getDriveStatus(): GoogleDriveStatus {
    const token = this.getStoredToken();
    return {
      isConnected: Boolean(token),
      user: this.getUserProfile(),
      folderId: this.getStoredFolderId(),
      clientId: this.getStoredClientId(),
    };
  }
}

export const googleDriveService = new GoogleDriveService();
