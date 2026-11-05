export type AiAgentProvider = "gemini" | "openai" | "anthropic" | "ollama" | "custom";

export interface AiAgentConfig {
  provider: AiAgentProvider;
  apiKey: string;
  model: string;
  customEndpoint?: string;
  temperature?: number;
  enableLocalBridge: boolean;
  localBridgePort: number;
  systemPromptExtra?: string;
}

export interface AiToolCall {
  id: string;
  name: string;
  args: Record<string, any>;
  result?: any;
  status: "pending" | "success" | "error";
  error?: string;
}

export interface AiChatMessage {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  timestamp: number;
  toolCalls?: AiToolCall[];
}

export interface EditorStateSnapshot {
  projectName: string;
  duration: number;
  currentTime: number;
  aspectRatio: string;
  renderMode: string;
  screenAnglePreset: string;
  backgroundPreset: string;
  keyframeCount: number;
  keyframes: {
    id: string;
    timestamp: number;
    zoom: number;
    x: number;
    y: number;
    label?: string;
  }[];
  clipsCount: number;
  clips: {
    id: string;
    name: string;
    start: number;
    end: number;
    duration: number;
    speed: number;
  }[];
  colorAdjustments: {
    brightness: number;
    contrast: number;
    saturation: number;
    temperature: number;
    tint: number;
  };
  webcamEnabled: boolean;
}

export type EditorActionType =
  | "add_zoom_keyframe"
  | "remove_zoom_keyframe"
  | "clear_zoom_keyframes"
  | "auto_generate_zooms"
  | "update_canvas_config"
  | "set_preset"
  | "set_aspect_ratio"
  | "set_color_grading"
  | "split_clip"
  | "trim_clip"
  | "delete_clip"
  | "set_playback_speed"
  | "configure_webcam"
  | "seek_to_time"
  | "trigger_export";

export interface EditorActionPayload {
  action: EditorActionType;
  params: Record<string, any>;
}
