import { SavedProject, saveProject as saveToLocalStorage, getSavedProjects, deleteProject as deleteFromLocalStorage } from "./projectStorage";

const DB_NAME = "fucuflow_storage_db";
const DB_VERSION = 1;
const STORE_PROJECTS = "projects";
const STORE_MEDIA = "media";
const LAST_PROJECT_KEY = "fucuflow_last_active_project_id";
const LEGACY_LAST_PROJECT_KEY = "glideo_last_active_project_id";

export interface MediaRecord {
  id: string;
  videoBlob: Blob | null;
  webcamBlob: Blob | null;
  updatedAt: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not available in this environment"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_PROJECTS)) {
        db.createObjectStore(STORE_PROJECTS, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_MEDIA)) {
        db.createObjectStore(STORE_MEDIA, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Saves project data and video/webcam binary blobs persistently to IndexedDB
 */
export async function saveProjectWithMedia(
  project: SavedProject,
  videoBlob?: Blob | null,
  webcamBlob?: Blob | null
): Promise<void> {
  if (typeof window === "undefined") return;

  const projectToSave: SavedProject = {
    ...project,
    updatedAt: Date.now(),
  };

  try {
    const db = await openDB();

    // 1. Save project metadata to IndexedDB
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_PROJECTS, "readwrite");
      const store = tx.objectStore(STORE_PROJECTS);
      const req = store.put(projectToSave);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    // 2. Save media blobs if provided
    if (videoBlob || webcamBlob) {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_MEDIA, "readwrite");
        const store = tx.objectStore(STORE_MEDIA);

        // First check existing media record so we don't overwrite with null if already saved
        const getReq = store.get(project.id);
        getReq.onsuccess = () => {
          const existing = getReq.result as MediaRecord | undefined;
          const mediaRecord: MediaRecord = {
            id: project.id,
            videoBlob: videoBlob !== undefined ? videoBlob : existing?.videoBlob || null,
            webcamBlob: webcamBlob !== undefined ? webcamBlob : existing?.webcamBlob || null,
            updatedAt: Date.now(),
          };
          const putReq = store.put(mediaRecord);
          putReq.onsuccess = () => resolve();
          putReq.onerror = () => reject(putReq.error);
        };
        getReq.onerror = () => reject(getReq.error);
      });
    }

    // 3. Keep localStorage updated for rapid dashboard listing
    const lightweightProject: SavedProject = {
      ...projectToSave,
      thumbnail: projectToSave.thumbnail ? projectToSave.thumbnail.slice(0, 50000) : undefined,
    };
    saveToLocalStorage(lightweightProject);
    setLastActiveProjectId(project.id);
  } catch (err) {
    console.error("[FucuFlow DB] Error saving project to IndexedDB:", err);
    saveToLocalStorage(projectToSave);
    setLastActiveProjectId(project.id);
  }
}

/**
 * Loads project metadata and reconstructs media Blobs from IndexedDB
 */
export async function loadProjectWithMedia(
  id: string
): Promise<{ project: SavedProject; videoBlob: Blob | null; webcamBlob: Blob | null } | null> {
  if (typeof window === "undefined") return null;

  try {
    const db = await openDB();

    // 1. Fetch project metadata
    const project = await new Promise<SavedProject | null>((resolve, reject) => {
      const tx = db.transaction(STORE_PROJECTS, "readonly");
      const store = tx.objectStore(STORE_PROJECTS);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });

    if (!project) {
      const localList = getSavedProjects();
      const localProj = localList.find((p) => p.id === id);
      if (!localProj) return null;
      return { project: localProj, videoBlob: null, webcamBlob: null };
    }

    // 2. Fetch media blobs
    const media = await new Promise<MediaRecord | null>((resolve, reject) => {
      const tx = db.transaction(STORE_MEDIA, "readonly");
      const store = tx.objectStore(STORE_MEDIA);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });

    return {
      project,
      videoBlob: media?.videoBlob || null,
      webcamBlob: media?.webcamBlob || null,
    };
  } catch (err) {
    console.warn("[FucuFlow DB] Failed to read from IndexedDB, trying localStorage fallback:", err);
    const localList = getSavedProjects();
    const localProj = localList.find((p) => p.id === id);
    if (!localProj) return null;
    return { project: localProj, videoBlob: null, webcamBlob: null };
  }
}

/**
 * Lists all projects stored in IndexedDB (or fallback to localStorage)
 */
export async function getAllProjectsFromDB(): Promise<SavedProject[]> {
  if (typeof window === "undefined") return [];

  try {
    const db = await openDB();
    const projects = await new Promise<SavedProject[]>((resolve, reject) => {
      const tx = db.transaction(STORE_PROJECTS, "readonly");
      const store = tx.objectStore(STORE_PROJECTS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });

    if (projects.length > 0) {
      return projects.sort((a, b) => b.updatedAt - a.updatedAt);
    }
  } catch (err) {
    console.warn("[FucuFlow DB] Failed to get all projects from DB:", err);
  }

  return getSavedProjects();
}

/**
 * Deletes a project and its media records from IndexedDB and localStorage
 */
export async function deleteProjectFromDB(id: string): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const db = await openDB();
    const tx = db.transaction([STORE_PROJECTS, STORE_MEDIA], "readwrite");
    tx.objectStore(STORE_PROJECTS).delete(id);
    tx.objectStore(STORE_MEDIA).delete(id);
  } catch (err) {
    console.warn("[FucuFlow DB] Failed to delete from IndexedDB:", err);
  }

  deleteFromLocalStorage(id);

  if (getLastActiveProjectId() === id) {
    localStorage.removeItem(LAST_PROJECT_KEY);
    localStorage.removeItem(LEGACY_LAST_PROJECT_KEY);
  }
}

export function getLastActiveProjectId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LAST_PROJECT_KEY) || localStorage.getItem(LEGACY_LAST_PROJECT_KEY);
}

export function setLastActiveProjectId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LAST_PROJECT_KEY, id);
}

/**
 * Returns estimated IndexedDB disk storage usage
 */
export async function getStorageUsage(): Promise<{ usedMB: number; quotaMB: number }> {
  if (typeof window !== "undefined" && navigator.storage && navigator.storage.estimate) {
    try {
      const est = await navigator.storage.estimate();
      const usedMB = Math.round(((est.usage || 0) / (1024 * 1024)) * 10) / 10;
      const quotaMB = Math.round(((est.quota || 0) / (1024 * 1024)) * 10) / 10;
      return { usedMB, quotaMB };
    } catch {}
  }
  return { usedMB: 0, quotaMB: 0 };
}
