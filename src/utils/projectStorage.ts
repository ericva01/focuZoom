import { AspectRatio, CanvasConfig, ClickEvent, TimelineClip } from "@/types/editor";

export interface SavedProject {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  duration: number;
  aspectRatio: AspectRatio;
  clipCount: number;
  keyframeCount: number;
  thumbnail?: string;
  videoSrc?: string | null;
  videoFileName?: string;
  config?: Partial<CanvasConfig>;
  clips?: TimelineClip[];
  events?: ClickEvent[];
  localFilePath?: string;
}

const STORAGE_KEY = "fucuflow_saved_projects";
const LEGACY_STORAGE_KEY = "glideo_saved_projects";

export function getSavedProjects(): SavedProject[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Filter out any leftover initial dummy demo projects
      const cleaned = parsed.filter(
        (p) =>
          p.id !== "proj-onboarding-demo" &&
          p.id !== "proj-tiktok-teaser" &&
          p.id !== "proj-terminal-dolly"
      );
      if (cleaned.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
      }
      return cleaned;
    }
    return [];
  } catch (err) {
    console.error("Error reading saved projects from localStorage:", err);
    return [];
  }
}

export function saveProject(project: SavedProject): void {
  if (typeof window === "undefined") return;

  try {
    const projects = getSavedProjects();
    const existingIdx = projects.findIndex((p) => p.id === project.id);

    const projectToSave: SavedProject = {
      ...project,
      updatedAt: Date.now(),
    };

    if (existingIdx !== -1) {
      projects[existingIdx] = projectToSave;
    } else {
      projects.unshift(projectToSave);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error("Error saving project to localStorage:", err);
  }
}

export function deleteProject(id: string): SavedProject[] {
  if (typeof window === "undefined") return [];

  try {
    const projects = getSavedProjects().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return projects;
  } catch (err) {
    console.error("Error deleting project from localStorage:", err);
    return [];
  }
}

export function getProjectById(id: string): SavedProject | null {
  const projects = getSavedProjects();
  return projects.find((p) => p.id === id) || null;
}
