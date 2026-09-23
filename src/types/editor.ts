export type AspectRatio = "16:9" | "9:16" | "4:3" | "1:1";

export type ResolutionPreset = "4k" | "2k" | "1080p";

export type EasingType = "cubic-out" | "spring" | "smooth-step" | "linear";

export type BackgroundType = "gradient" | "solid" | "image" | "transparent";

export type RenderMode = "3d-cinematic" | "2d-flat";

export type ScreenAnglePreset =
  | "simple-smooth"
  | "studio-front"
  | "floating-dynamic"
  | "isometric"
  | "cinematic-slant";

export type FramingStyle = "auto-follow" | "focus-click" | "static";

export type CursorHaloStyle = "expanding-ring" | "glowing-halo" | "pulse-ripple";

export type FramePreset =
  | "mesh-purple"
  | "cosmic-blue"
  | "obsidian-dark"
  | "emerald-matrix"
  | "midnight-titanium"
  | "aurora-glow"
  | "sunset"
  | "hyper-neon"
  | "solar-flare"
  | "pastel-dream";

export type CursorStyle = "macos-arrow" | "neon-dot" | "cyber-ring" | "crosshair";

export interface ClickTarget {
  timestamp: number; // in seconds
  x: number; // normalized 0.0 to 1.0
  y: number; // normalized 0.0 to 1.0
  label?: string;
  zoom?: number;
}

export interface CursorPoint {
  timestamp: number; // in seconds relative to video start
  x: number; // normalized 0.0 to 1.0 (relative to video width)
  y: number; // normalized 0.0 to 1.0 (relative to video height)
}

export interface ClickEvent {
  id: string;
  timestamp: number; // in seconds
  x: number; // normalized 0.0 to 1.0 (relative to video width)
  y: number; // normalized 0.0 to 1.0 (relative to video height)
  zoom: number; // e.g. 2.0x (3D dolly magnification)
  duration?: number; // total duration of zoom in seconds
  zoomInDuration?: number; // Dolly-in transition duration in seconds (0.15s - 3.0s)
  holdDuration?: number; // Hold focus duration in seconds (0.2s - 10.0s)
  zoomOutDuration?: number; // Zoom-out transition duration in seconds (0.15s - 3.0s)
  label?: string;
  enabled: boolean;
  framingStyle?: FramingStyle;
  dollyDepth?: number;
  screenAnglePreset?: ScreenAnglePreset;
  targets?: ClickTarget[]; // Sequential click targets within a continuous zoom sequence
  cursorTrail?: CursorPoint[]; // Continuous cursor trajectory during this zoom sequence
}

export interface CanvasConfig {
  // 3D Engine Configurations
  renderMode: RenderMode;
  screenAnglePreset: ScreenAnglePreset;
  enableFloatingMotion: boolean;
  enableMouseParallax: boolean;
  mouseParallaxIntensity: number; // 0.0 to 1.0
  glassReflectionIntensity: number; // 0.0 to 1.0
  depthOfField: boolean;
  framingStyle: FramingStyle;
  cursorHaloStyle: CursorHaloStyle;

  // Background & Frame Geometry
  backgroundType: BackgroundType;
  backgroundPreset: FramePreset;
  solidBackgroundColor: string;
  customBackgroundImage?: string | null;
  customGradientFrom: string;
  customGradientTo: string;
  cornerRadius: number; // 0 to 64px
  padding: number; // 0 to 120px
  shadowIntensity: "none" | "subtle" | "cinematic" | "neon";
  showWindowBar: boolean;

  // Camera Zoom & Motion
  defaultZoomScale: number; // e.g. 2.0
  zoomEasing: EasingType;
  zoomDuration: number; // Dolly-in transition duration
  zoomHoldDuration: number; // Hold focus duration
  zoomOutDuration: number; // Zoom-out transition duration

  // Cursor & Halos
  showCursor: boolean; // Master toggle to show/hide custom cursor overlay
  cursorStyle: CursorStyle;
  cursorColor: string;
  cursorSize: number;
  showRipple: boolean;
  rippleColor: string;

  // General Playback & Canvas
  aspectRatio: AspectRatio;
  resolutionPreset?: ResolutionPreset; // "4k" (3840x2160), "2k" (2560x1440), "1080p" (1920x1080)
  playbackSpeed: number;

  // Webcam Picture-in-Picture (PiP) Configuration
  webcamConfig?: WebcamConfig;
}

export type WebcamShape = "circle" | "rounded-rect" | "square";
export type WebcamPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left" | "custom";

export interface WebcamConfig {
  enabled: boolean;
  shape: WebcamShape; // "circle" (bubble), "rounded-rect", "square"
  position: WebcamPosition; // preset corner or custom position
  customX: number; // normalized 0.0 to 1.0 (relative to canvas width)
  customY: number; // normalized 0.0 to 1.0 (relative to canvas height)
  size: number; // diameter or width in pixels (100 to 360)
  borderColor: string;
  borderWidth: number; // 0 to 8
  shadow: boolean;
  mirror: boolean; // flip horizontally
  url?: string | null; // recorded webcam blob URL or null
  deviceId?: string | null; // chosen camera input device ID
}

export interface VideoMetadata {
  name: string;
  duration: number;
  width: number;
  height: number;
  fileSize?: string;
  url: string;
  webcamUrl?: string;
  cursorTrail?: CursorPoint[];
}

export interface TimelineClip {
  id: string;
  name: string;
  sourceStart: number; // in seconds within source video
  sourceEnd: number;   // in seconds within source video
  duration: number;    // sourceEnd - sourceStart
  startTimeline: number; // in seconds on the multi-track timeline
  endTimeline: number;   // startTimeline + duration
  color: string;
  speed: number;
  volume?: number;     // 0.0 to 1.0
  muted?: boolean;
}

export type TimelineTrackType = "keyframe" | "video" | "audio";

export function getCanvasResolution(
  aspectRatio: AspectRatio,
  resolutionPreset: ResolutionPreset = "4k"
): { width: number; height: number; label: string } {
  switch (resolutionPreset) {
    case "4k": {
      switch (aspectRatio) {
        case "9:16":
          return { width: 2160, height: 3840, label: "4K UHD" };
        case "4:3":
          return { width: 2880, height: 2160, label: "4K UHD" };
        case "1:1":
          return { width: 2160, height: 2160, label: "4K UHD" };
        case "16:9":
        default:
          return { width: 3840, height: 2160, label: "4K UHD" };
      }
    }
    case "2k": {
      switch (aspectRatio) {
        case "9:16":
          return { width: 1440, height: 2560, label: "2K QHD" };
        case "4:3":
          return { width: 1920, height: 1440, label: "2K QHD" };
        case "1:1":
          return { width: 1440, height: 1440, label: "2K QHD" };
        case "16:9":
        default:
          return { width: 2560, height: 1440, label: "2K QHD" };
      }
    }
    case "1080p":
    default: {
      switch (aspectRatio) {
        case "9:16":
          return { width: 1080, height: 1920, label: "1080p FHD" };
        case "4:3":
          return { width: 1440, height: 1080, label: "1080p FHD" };
        case "1:1":
          return { width: 1080, height: 1080, label: "1080p FHD" };
        case "16:9":
        default:
          return { width: 1920, height: 1080, label: "1080p FHD" };
      }
    }
  }
}

