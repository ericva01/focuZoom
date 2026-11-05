"use client";

import {
  AiAgentConfig,
  AiChatMessage,
  AiToolCall,
  EditorActionPayload,
  EditorStateSnapshot,
} from "@/types/aiAgent";

const STORAGE_KEY = "fucuflow_ai_agent_config";
const HISTORY_KEY = "fucuflow_ai_agent_history";

export const DEFAULT_AI_CONFIG: AiAgentConfig = {
  provider: "gemini",
  apiKey: "",
  model: "gemini-1.5-flash",
  customEndpoint: "http://localhost:11434/v1",
  temperature: 0.3,
  enableLocalBridge: true,
  localBridgePort: 9876,
  systemPromptExtra: "",
};

export const AI_TOOLS_DEFINITIONS = [
  {
    name: "add_zoom_keyframe",
    description: "Add a 3D camera zoom keyframe to the video timeline at a specific timestamp.",
    parameters: {
      type: "object",
      properties: {
        timestamp: {
          type: "number",
          description: "Timestamp in seconds where the 3D zoom keyframe occurs (e.g. 2.5).",
        },
        zoom: {
          type: "number",
          description: "Magnification scale between 1.2 and 4.0 (default 2.2).",
        },
        x: {
          type: "number",
          description: "Normalized horizontal focal position from 0.0 (left) to 1.0 (right). Center is 0.5.",
        },
        y: {
          type: "number",
          description: "Normalized vertical focal position from 0.0 (top) to 1.0 (bottom). Center is 0.5.",
        },
        holdDuration: {
          type: "number",
          description: "Duration in seconds to hold the zoomed camera view before zooming back out (default 1.5).",
        },
        label: {
          type: "string",
          description: "Short descriptive label for this focal keyframe (e.g. 'Focus on search bar').",
        },
      },
      required: ["timestamp"],
    },
  },
  {
    name: "auto_generate_zooms",
    description: "Automatically generate a set of rhythmic, cinematic 3D zoom keyframes throughout the video.",
    parameters: {
      type: "object",
      properties: {
        count: {
          type: "number",
          description: "Number of zoom keyframes to distribute (default 4).",
        },
        zoomScale: {
          type: "number",
          description: "Magnification scale (e.g. 2.0 to 2.6, default 2.2).",
        },
        pattern: {
          type: "string",
          enum: ["dynamic", "alternating", "clicks"],
          description: "Pattern strategy: 'dynamic' (focal points across screen), 'alternating' (left/right/center), 'clicks' (follow detected cursor).",
        },
      },
    },
  },
  {
    name: "clear_zoom_keyframes",
    description: "Clear and delete all zoom keyframes on the timeline.",
    parameters: {
      type: "object",
      properties: {
        confirm: {
          type: "boolean",
          description: "Set to true to confirm deletion.",
        },
      },
      required: ["confirm"],
    },
  },
  {
    name: "remove_zoom_keyframe",
    description: "Remove a specific zoom keyframe by its timestamp or ID.",
    parameters: {
      type: "object",
      properties: {
        timestamp: {
          type: "number",
          description: "Timestamp in seconds of the keyframe to remove.",
        },
        id: {
          type: "string",
          description: "The unique keyframe ID to remove if known.",
        },
      },
    },
  },
  {
    name: "update_canvas_config",
    description: "Update canvas styling, background theme, 3D camera angles, and frame borders.",
    parameters: {
      type: "object",
      properties: {
        backgroundPreset: {
          type: "string",
          enum: [
            "mesh-purple",
            "cosmic-blue",
            "obsidian-dark",
            "emerald-matrix",
            "midnight-titanium",
            "aurora-glow",
            "sunset",
            "hyper-neon",
            "solar-flare",
            "pastel-dream",
          ],
          description: "Background aesthetic preset theme.",
        },
        screenAnglePreset: {
          type: "string",
          enum: [
            "simple-smooth",
            "studio-front",
            "floating-dynamic",
            "isometric",
            "cinematic-slant",
          ],
          description: "3D camera tilt angle and perspective depth.",
        },
        renderMode: {
          type: "string",
          enum: ["3d-cinematic", "2d-flat"],
          description: "Whether to render in 3D cinematic space or flat 2D.",
        },
        cornerRadius: {
          type: "number",
          description: "Video corner radius in pixels (0 to 64).",
        },
        padding: {
          type: "number",
          description: "Outer canvas margin / padding in pixels (0 to 120).",
        },
        shadowIntensity: {
          type: "string",
          enum: ["none", "subtle", "cinematic", "neon"],
          description: "Intensity of the 3D drop shadow.",
        },
        zoomEasing: {
          type: "string",
          enum: ["cubic-out", "spring", "smooth-step", "linear"],
          description: "Camera dolly easing curve.",
        },
      },
    },
  },
  {
    name: "set_aspect_ratio",
    description: "Change the video aspect ratio.",
    parameters: {
      type: "object",
      properties: {
        aspectRatio: {
          type: "string",
          enum: ["16:9", "9:16", "4:3", "1:1"],
          description: "'16:9' for YouTube/Desktop, '9:16' for TikTok/Shorts/Reels, '4:3' for retro/demos, '1:1' for square.",
        },
      },
      required: ["aspectRatio"],
    },
  },
  {
    name: "set_color_grading",
    description: "Adjust brightness, contrast, saturation, color temperature, and tint.",
    parameters: {
      type: "object",
      properties: {
        brightness: {
          type: "number",
          description: "Brightness multiplier (0.5 to 2.0, default 1.0).",
        },
        contrast: {
          type: "number",
          description: "Contrast multiplier (0.5 to 2.0, default 1.0).",
        },
        saturation: {
          type: "number",
          description: "Color saturation (0.0 grayscale to 2.0 vivid, default 1.0).",
        },
        temperature: {
          type: "number",
          description: "White balance temperature (-1.0 cool blue to 1.0 warm amber, default 0.0).",
        },
        tint: {
          type: "number",
          description: "White balance tint (-1.0 green to 1.0 magenta, default 0.0).",
        },
      },
    },
  },
  {
    name: "split_clip",
    description: "Split the active video clip at the given timestamp.",
    parameters: {
      type: "object",
      properties: {
        timestamp: {
          type: "number",
          description: "Timestamp in seconds where the split should occur.",
        },
      },
      required: ["timestamp"],
    },
  },
  {
    name: "trim_clip",
    description: "Trim the start or end of the video clip.",
    parameters: {
      type: "object",
      properties: {
        clipId: {
          type: "string",
          description: "ID of the clip to trim. If omitted, trims the primary clip.",
        },
        start: {
          type: "number",
          description: "New start time in seconds relative to original video.",
        },
        end: {
          type: "number",
          description: "New end time in seconds relative to original video.",
        },
      },
      required: ["start", "end"],
    },
  },
  {
    name: "configure_webcam",
    description: "Configure webcam picture-in-picture (PiP) appearance and layout.",
    parameters: {
      type: "object",
      properties: {
        enabled: { type: "boolean", description: "Enable or disable webcam PiP overlay." },
        shape: {
          type: "string",
          enum: ["circle", "rounded-rect", "square"],
          description: "Webcam framing shape.",
        },
        position: {
          type: "string",
          enum: ["bottom-right", "bottom-left", "top-right", "top-left"],
          description: "Corner placement.",
        },
        size: { type: "number", description: "Webcam size in pixels (100 to 360)." },
        borderColor: { type: "string", description: "Border accent color hex (e.g. '#FF6B2C')." },
      },
    },
  },
  {
    name: "set_playback_speed",
    description: "Adjust preview playback speed.",
    parameters: {
      type: "object",
      properties: {
        speed: {
          type: "number",
          description: "Playback speed (e.g. 0.5, 1.0, 1.25, 1.5, 2.0).",
        },
      },
      required: ["speed"],
    },
  },
  {
    name: "seek_to_time",
    description: "Seek timeline playhead to a specific timestamp in seconds.",
    parameters: {
      type: "object",
      properties: {
        time: { type: "number", description: "Target time in seconds." },
      },
      required: ["time"],
    },
  },
  {
    name: "trigger_export",
    description: "Open the export dialog to render and download the video.",
    parameters: {
      type: "object",
      properties: {
        preset: {
          type: "string",
          enum: ["4k", "2k", "1080p"],
          description: "Resolution preset for export.",
        },
      },
    },
  },
];

class AiAgentService {
  private config: AiAgentConfig = { ...DEFAULT_AI_CONFIG };

  constructor() {
    this.loadConfig();
  }

  public getConfig(): AiAgentConfig {
    return { ...this.config };
  }

  public saveConfig(newConfig: Partial<AiAgentConfig>): AiAgentConfig {
    this.config = { ...this.config, ...newConfig };
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
      } catch (err) {
        console.warn("Failed to persist AI config:", err);
      }
    }
    return { ...this.config };
  }

  public loadConfig(): AiAgentConfig {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          this.config = { ...DEFAULT_AI_CONFIG, ...parsed };
        }
      } catch (err) {
        console.warn("Failed to read AI config:", err);
      }
    }
    return { ...this.config };
  }

  public loadHistory(): AiChatMessage[] {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(HISTORY_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch {}
    }
    return [];
  }

  public saveHistory(history: AiChatMessage[]): void {
    if (typeof window !== "undefined") {
      try {
        // Keep last 30 messages to prevent storage bloat
        const trimmed = history.slice(-30);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
      } catch {}
    }
  }

  public clearHistory(): void {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(HISTORY_KEY);
      } catch {}
    }
  }

  /**
   * Tests connection with configured provider
   */
  public async testConnection(config: AiAgentConfig): Promise<{ success: boolean; message: string }> {
    try {
      if (config.provider === "gemini") {
        if (!config.apiKey) return { success: false, message: "Gemini API key is required." };
        const model = config.model || "gemini-1.5-flash";
        const makeGeminiRequest = async (m: string) => {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${encodeURIComponent(
            config.apiKey.trim()
          )}`;
          return fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: "Hello! Reply with 'OK' if you can read this." }] }],
            }),
          });
        };

        let res = await makeGeminiRequest(model);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const errMsg = errData.error?.message || `HTTP error ${res.status}`;
          
          // If the model is experiencing high demand (503/429/high demand), try stable gemini-1.5-flash
          const isHighDemand =
            res.status === 503 ||
            res.status === 429 ||
            errMsg.toLowerCase().includes("high demand") ||
            errMsg.toLowerCase().includes("overloaded") ||
            errMsg.toLowerCase().includes("temporarily unavailable");

          if (isHighDemand && model !== "gemini-1.5-flash") {
            const fallbackRes = await makeGeminiRequest("gemini-1.5-flash");
            if (fallbackRes.ok) {
              config.model = "gemini-1.5-flash";
              this.saveConfig(config);
              return {
                success: true,
                message: `'${model}' is currently overloaded on Google's free tier. Switched to 'gemini-1.5-flash' which connected successfully!`,
              };
            }
          }
          throw new Error(errMsg);
        }
        return { success: true, message: `Connected successfully to Google Gemini (${model})!` };
      }

      if (config.provider === "openai") {
        if (!config.apiKey) return { success: false, message: "OpenAI API key is required." };
        const model = config.model || "gpt-4o-mini";
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.apiKey.trim()}`,
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "user", content: "Ping" }],
            max_tokens: 5,
          }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error?.message || `HTTP error ${res.status}`);
        }
        return { success: true, message: `Connected successfully to OpenAI (${model})!` };
      }

      if (config.provider === "ollama") {
        const endpoint = (config.customEndpoint || "http://localhost:11434/v1").replace(/\/$/, "");
        const res = await fetch(`${endpoint}/models`, {
          method: "GET",
        }).catch(async () => {
          // Fallback to chat completion check
          return fetch(`${endpoint}/chat/completions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: config.model || "llama3.2",
              messages: [{ role: "user", content: "Ping" }],
              max_tokens: 5,
            }),
          });
        });
        if (!res.ok) {
          throw new Error(`Unable to reach Ollama at ${endpoint}. Make sure 'ollama serve' is running.`);
        }
        return { success: true, message: `Connected to local Ollama instance at ${endpoint}!` };
      }

      if (config.provider === "custom") {
        const endpoint = (config.customEndpoint || "http://localhost:11434/v1").replace(/\/$/, "");
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (config.apiKey) headers["Authorization"] = `Bearer ${config.apiKey.trim()}`;
        const res = await fetch(`${endpoint}/chat/completions`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            model: config.model || "default",
            messages: [{ role: "user", content: "Ping" }],
            max_tokens: 5,
          }),
        });
        if (!res.ok) {
          throw new Error(`Custom endpoint returned HTTP ${res.status}`);
        }
        return { success: true, message: `Connected to custom OpenAI-compatible agent endpoint!` };
      }

      return { success: true, message: "Configuration validated." };
    } catch (err: any) {
      return { success: false, message: err.message || "Connection failed." };
    }
  }

  /**
   * Builds the comprehensive studio system prompt with live state snapshot
   */
  private buildSystemPrompt(state: EditorStateSnapshot): string {
    return `You are FucuFlow Copilot, an elite AI creative director and automated video editor for FucuFlow Studio.
You have direct, programmatic access to control the video canvas, 3D camera dollies, keyframes, color grading, and timeline clips.

CURRENT PROJECT STATE:
- Project Name: "${state.projectName}"
- Video Duration: ${state.duration.toFixed(2)} seconds
- Current Playhead: ${state.currentTime.toFixed(2)}s
- Aspect Ratio: ${state.aspectRatio}
- 3D Render Mode: ${state.renderMode}
- Screen Angle Preset: ${state.screenAnglePreset}
- Background Preset: ${state.backgroundPreset}
- Number of Clips: ${state.clipsCount}
- Existing Keyframes: ${state.keyframeCount} (${state.keyframes.map((k) => `${k.timestamp.toFixed(1)}s [${k.zoom}x @ (${k.x.toFixed(2)},${k.y.toFixed(2)})]`).join(", ") || "none"})
- Color Adjustments: Brightness=${state.colorAdjustments.brightness}, Contrast=${state.colorAdjustments.contrast}, Saturation=${state.colorAdjustments.saturation}, Temp=${state.colorAdjustments.temperature}, Tint=${state.colorAdjustments.tint}
- Webcam PiP: ${state.webcamEnabled ? "Enabled" : "Disabled"}

YOUR INSTRUCTIONS:
1. When the user asks you to edit the video, reformat, adjust camera, or add zoom keyframes, you MUST call the appropriate tools.
2. For zoom keyframes:
   - Provide realistic coordinates x, y between 0.1 and 0.9.
   - When placing multiple keyframes across a video, ensure timestamps stay within the video duration (0.0 to ${state.duration.toFixed(1)}s).
   - Use hold durations between 1.0s and 2.5s for natural viewing.
3. For aspect ratio:
   - "TikTok", "Reels", "Shorts", "vertical", "phone" -> set_aspect_ratio to "9:16".
   - "YouTube", "desktop", "widescreen" -> set_aspect_ratio to "16:9".
   - "Instagram square" -> set_aspect_ratio to "1:1".
4. After executing tool calls, explain succinctly what modifications you made and why it elevates the video's cinematic appeal.
${this.config.systemPromptExtra ? `\nUSER CUSTOM PREFERENCES:\n${this.config.systemPromptExtra}` : ""}`;
  }

  /**
   * Main agent message invocation handler with function calling execution
   */
  public async sendMessage({
    userPrompt,
    history,
    state,
    onExecuteAction,
  }: {
    userPrompt: string;
    history: AiChatMessage[];
    state: EditorStateSnapshot;
    onExecuteAction: (action: EditorActionPayload) => Promise<any> | any;
  }): Promise<{ assistantMessage: AiChatMessage }> {
    const config = this.config;
    const systemPrompt = this.buildSystemPrompt(state);

    if (config.provider === "gemini") {
      return this.sendGeminiMessage({ userPrompt, history, systemPrompt, config, onExecuteAction });
    } else {
      // OpenAI / Ollama / Custom
      return this.sendOpenAIMessage({ userPrompt, history, systemPrompt, config, onExecuteAction });
    }
  }

  /**
   * Google Gemini Provider Implementation
   */
  private async sendGeminiMessage({
    userPrompt,
    history,
    systemPrompt,
    config,
    onExecuteAction,
  }: {
    userPrompt: string;
    history: AiChatMessage[];
    systemPrompt: string;
    config: AiAgentConfig;
    onExecuteAction: (action: EditorActionPayload) => Promise<any> | any;
  }): Promise<{ assistantMessage: AiChatMessage }> {
    if (!config.apiKey) {
      throw new Error("Gemini API key is missing. Please configure it in AI Agent Settings.");
    }

    let model = config.model || "gemini-1.5-flash";
    let url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
      config.apiKey.trim()
    )}`;

    // Convert tool definitions to Gemini format
    const geminiFunctionDeclarations = AI_TOOLS_DEFINITIONS.map((tool) => ({
      name: tool.name,
      description: tool.description,
      parameters: {
        type: "OBJECT",
        properties: Object.entries(tool.parameters.properties).reduce((acc: any, [key, val]: [string, any]) => {
          acc[key] = {
            type: val.type.toUpperCase(),
            description: val.description,
            ...(val.enum ? { enum: val.enum } : {}),
          };
          return acc;
        }, {}),
        required: tool.parameters.required || [],
      },
    }));

    // Convert history
    const contents: any[] = [];
    contents.push({
      role: "user",
      parts: [{ text: `${systemPrompt}\n\nUser request: ${userPrompt}` }],
    });

    const body = {
      contents,
      tools: [{ functionDeclarations: geminiFunctionDeclarations }],
      generationConfig: {
        temperature: config.temperature ?? 0.3,
      },
    };

    let res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      const errMsg = errJson.error?.message || `Gemini API returned error ${res.status}`;

      // High demand auto-fallback to stable gemini-1.5-flash
      const isHighDemand =
        res.status === 503 ||
        res.status === 429 ||
        errMsg.toLowerCase().includes("high demand") ||
        errMsg.toLowerCase().includes("overloaded");

      if (isHighDemand && model !== "gemini-1.5-flash") {
        console.warn(`[AiAgentService] ${model} is experiencing high demand. Falling back to gemini-1.5-flash.`);
        model = "gemini-1.5-flash";
        url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
          config.apiKey.trim()
        )}`;
        res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const fbErr = await res.json().catch(() => ({}));
          throw new Error(fbErr.error?.message || errMsg);
        }
      } else {
        throw new Error(errMsg);
      }
    }

    const data = await res.json();
    const candidate = data.candidates?.[0];
    const parts = candidate?.content?.parts || [];

    const toolCalls: AiToolCall[] = [];
    let assistantText = "";

    for (const part of parts) {
      if (part.text) {
        assistantText += part.text;
      }
      if (part.functionCall) {
        const { name, args } = part.functionCall;
        const toolCallId = `call_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const toolCall: AiToolCall = {
          id: toolCallId,
          name,
          args: args || {},
          status: "pending",
        };

        try {
          const actionPayload: EditorActionPayload = {
            action: name as any,
            params: args || {},
          };
          const execResult = await onExecuteAction(actionPayload);
          toolCall.result = execResult ?? { success: true };
          toolCall.status = "success";
        } catch (err: any) {
          toolCall.status = "error";
          toolCall.error = err.message || "Failed to execute tool.";
        }
        toolCalls.push(toolCall);
      }
    }

    if (!assistantText && toolCalls.length > 0) {
      const toolNames = toolCalls.map((t) => t.name.replace(/_/g, " ")).join(", ");
      assistantText = `Executed ${toolCalls.length} editing action(s): ${toolNames}.`;
    }

    return {
      assistantMessage: {
        id: `msg_${Date.now()}`,
        role: "assistant",
        content: assistantText || "I've reviewed your request.",
        timestamp: Date.now(),
        toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      },
    };
  }

  /**
   * OpenAI / Ollama / Custom Provider Implementation
   */
  private async sendOpenAIMessage({
    userPrompt,
    history,
    systemPrompt,
    config,
    onExecuteAction,
  }: {
    userPrompt: string;
    history: AiChatMessage[];
    systemPrompt: string;
    config: AiAgentConfig;
    onExecuteAction: (action: EditorActionPayload) => Promise<any> | any;
  }): Promise<{ assistantMessage: AiChatMessage }> {
    let endpoint = "https://api.openai.com/v1/chat/completions";
    const headers: Record<string, string> = { "Content-Type": "application/json" };

    if (config.provider === "ollama") {
      const base = (config.customEndpoint || "http://localhost:11434/v1").replace(/\/$/, "");
      endpoint = `${base}/chat/completions`;
    } else if (config.provider === "custom") {
      const base = (config.customEndpoint || "http://localhost:11434/v1").replace(/\/$/, "");
      endpoint = `${base}/chat/completions`;
      if (config.apiKey) headers["Authorization"] = `Bearer ${config.apiKey.trim()}`;
    } else {
      if (!config.apiKey) {
        throw new Error("OpenAI API key is missing. Please configure it in AI Agent Settings.");
      }
      headers["Authorization"] = `Bearer ${config.apiKey.trim()}`;
    }

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.slice(-8).map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user", content: userPrompt },
    ];

    const tools = AI_TOOLS_DEFINITIONS.map((tool) => ({
      type: "function",
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
      },
    }));

    const model = config.model || (config.provider === "ollama" ? "llama3.2" : "gpt-4o-mini");

    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages,
        tools,
        tool_choice: "auto",
        temperature: config.temperature ?? 0.3,
      }),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `Endpoint returned error HTTP ${res.status}`);
    }

    const data = await res.json();
    const choice = data.choices?.[0];
    const rawToolCalls = choice?.message?.tool_calls || [];
    let assistantText = choice?.message?.content || "";

    const toolCalls: AiToolCall[] = [];

    for (const raw of rawToolCalls) {
      const funcName = raw.function.name;
      let args: Record<string, any> = {};
      try {
        args = JSON.parse(raw.function.arguments || "{}");
      } catch {
        args = {};
      }

      const toolCall: AiToolCall = {
        id: raw.id || `call_${Date.now()}`,
        name: funcName,
        args,
        status: "pending",
      };

      try {
        const actionPayload: EditorActionPayload = {
          action: funcName as any,
          params: args,
        };
        const execResult = await onExecuteAction(actionPayload);
        toolCall.result = execResult ?? { success: true };
        toolCall.status = "success";
      } catch (err: any) {
        toolCall.status = "error";
        toolCall.error = err.message || "Failed to execute tool.";
      }
      toolCalls.push(toolCall);
    }

    if (!assistantText && toolCalls.length > 0) {
      const toolNames = toolCalls.map((t) => t.name.replace(/_/g, " ")).join(", ");
      assistantText = `Applied changes: ${toolNames}.`;
    }

    return {
      assistantMessage: {
        id: `msg_${Date.now()}`,
        role: "assistant",
        content: assistantText || "I've reviewed your request.",
        timestamp: Date.now(),
        toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      },
    };
  }
}

export const aiAgentService = new AiAgentService();
