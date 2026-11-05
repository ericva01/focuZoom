"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  Settings,
  Bot,
  User,
  CheckCircle2,
  AlertCircle,
  Clock,
  Ratio,
  Maximize2,
  Trash2,
  Key,
  Layers,
  ArrowRight,
  Loader2,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { aiAgentService } from "@/lib/aiAgentService";
import {
  AiChatMessage,
  AiToolCall,
  EditorActionPayload,
  EditorStateSnapshot,
} from "@/types/aiAgent";

interface AiAgentPanelProps {
  stateSnapshot: EditorStateSnapshot;
  onExecuteAction: (action: EditorActionPayload) => Promise<any> | any;
  onOpenSettings: () => void;
}

export function AiAgentPanel({
  stateSnapshot,
  onExecuteAction,
  onOpenSettings,
}: AiAgentPanelProps) {
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const config = aiAgentService.getConfig();
  const hasKeyOrLocal = config.provider === "ollama" || Boolean(config.apiKey);

  useEffect(() => {
    // Load persisted chat history
    const history = aiAgentService.loadHistory();
    if (history.length > 0) {
      setMessages(history);
    } else {
      // Welcome message
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content:
            "Hello! I'm your FucuFlow AI Copilot. I can dynamically direct your video, place 3D zoom keyframes on actions, reformat for TikTok/YouTube, adjust camera perspectives, and customize color grading. How can I help with your project?",
          timestamp: Date.now(),
        },
      ]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || inputText).trim();
    if (!prompt || isLoading) return;

    if (!hasKeyOrLocal) {
      onOpenSettings();
      return;
    }

    const userMsg: AiChatMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      content: prompt,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText("");
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await aiAgentService.sendMessage({
        userPrompt: prompt,
        history: newHistory,
        state: stateSnapshot,
        onExecuteAction,
      });

      const updated = [...newHistory, response.assistantMessage];
      setMessages(updated);
      aiAgentService.saveHistory(updated);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to communicate with AI agent.");
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    {
      label: "⚡ Smart 3D Zooms",
      prompt: "Analyze my video duration and place 4 dynamic 3D zoom keyframes focused on key screen areas with smooth cubic-out easing.",
    },
    {
      label: "📱 TikTok / Reels (9:16)",
      prompt: "Reformat this project for TikTok / Instagram Reels: set aspect ratio to 9:16 and apply the Hyper Neon backdrop preset.",
    },
    {
      label: "🎬 Cinematic YouTube (16:9)",
      prompt: "Transform this recording into a cinematic 16:9 YouTube video with Obsidian Dark background and isometric 3D camera angle.",
    },
    {
      label: "✨ Vivid Color Grade",
      prompt: "Apply a vibrant color grade: boost contrast to 1.15, saturation to 1.25, and add a subtle warm amber temperature (+0.15).",
    },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900/60 dark:bg-[#090D16]/90 border-l border-slate-200 dark:border-white/[0.08] text-slate-100 select-none">
      
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between bg-white/50 dark:bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF6B2C] to-amber-500 flex items-center justify-center text-white shadow-md shadow-[#FF6B2C]/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">AI Copilot</span>
              <span className="text-[10px] font-semibold text-[#FF6B2C] bg-[#FF6B2C]/10 px-1.5 py-0.5 rounded border border-[#FF6B2C]/20 uppercase">
                {config.provider === "gemini"
                  ? "Gemini"
                  : config.provider === "openai"
                  ? "OpenAI"
                  : config.provider === "ollama"
                  ? "Ollama"
                  : "Custom"}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {config.model || "gemini-2.0-flash"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onOpenSettings}
            title="Configure AI Providers & MCP Bridge"
          >
            <Settings className="w-4 h-4 text-slate-400 hover:text-[#FF6B2C]" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              aiAgentService.clearHistory();
              setMessages([
                {
                  id: "welcome",
                  role: "assistant",
                  content: "Chat cleared. What would you like to edit next?",
                  timestamp: Date.now(),
                },
              ]);
            }}
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-400" />
          </Button>
        </div>
      </div>

      {/* Project Snapshot Context Bar */}
      <div className="px-4 py-2 border-b border-slate-200 dark:border-white/[0.06] bg-slate-100/50 dark:bg-black/20 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-[#FF6B2C]" />
          {stateSnapshot.duration.toFixed(1)}s
        </span>
        <span className="flex items-center gap-1.5">
          <Ratio className="w-3 h-3 text-cyan-400" />
          {stateSnapshot.aspectRatio}
        </span>
        <span className="flex items-center gap-1.5">
          <Layers className="w-3 h-3 text-emerald-400" />
          {stateSnapshot.keyframeCount} Keyframes
        </span>
        <span className="text-[10px] uppercase font-semibold text-slate-500">
          {stateSnapshot.screenAnglePreset.replace("-", " ")}
        </span>
      </div>

      {/* No API key alert banner */}
      {!hasKeyOrLocal && (
        <div className="p-3 mx-3 my-2 rounded-xl bg-[#FF6B2C]/10 border border-[#FF6B2C]/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-[#FF6B2C]" />
            <span className="text-xs font-medium text-slate-200">
              Connect your AI Agent API Key to get started
            </span>
          </div>
          <Button variant="primary" size="sm" onClick={onOpenSettings}>
            Connect Key
          </Button>
        </div>
      )}

      {/* Quick Action Chips */}
      <div className="px-3 py-2 border-b border-slate-200 dark:border-white/[0.04] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(qp.prompt)}
            disabled={isLoading}
            className="flex-shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-200/50 dark:bg-white/[0.06] hover:bg-[#FF6B2C]/20 hover:text-[#FF6B2C] border border-transparent hover:border-[#FF6B2C]/30 text-slate-600 dark:text-slate-300 transition-all"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-[#FF6B2C] to-amber-500 flex items-center justify-center text-white flex-shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 space-y-2 ${
                  isUser
                    ? "bg-[#FF6B2C] text-white rounded-tr-xs"
                    : "bg-slate-100 dark:bg-white/[0.06] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/[0.06] rounded-tl-xs"
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed select-text font-sans">
                  {msg.content}
                </div>

                {/* Render Tool Calls Execution Badges */}
                {msg.toolCalls && msg.toolCalls.length > 0 && (
                  <div className="pt-1.5 space-y-1.5 border-t border-white/10">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                      Actions Applied ({msg.toolCalls.length}):
                    </span>
                    {msg.toolCalls.map((tc) => (
                      <div
                        key={tc.id}
                        className="px-2 py-1 rounded bg-black/30 border border-white/10 text-[11px] font-mono flex items-center gap-1.5 text-emerald-400"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        <span className="font-semibold text-slate-300">{tc.name}</span>
                        <span className="text-[10px] text-slate-400 truncate">
                          {JSON.stringify(tc.args)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-6 h-6 rounded-md bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 flex-shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-2.5 items-center text-slate-400 text-xs italic animate-pulse">
            <div className="w-6 h-6 rounded-md bg-[#FF6B2C]/20 flex items-center justify-center text-[#FF6B2C]">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            </div>
            <span>FucuFlow Copilot is directing video adjustments...</span>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{errorMessage}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-slate-200 dark:border-white/[0.08] bg-white/50 dark:bg-black/30">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              hasKeyOrLocal
                ? "Ask agent: 'Add zooms on clicks', 'Make it vertical for Reels'..."
                : "Connect AI Agent API key to start editing..."
            }
            disabled={isLoading}
            className="w-full bg-white dark:bg-black/50 border border-slate-300 dark:border-white/10 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-[#FF6B2C] shadow-inner"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-[#FF6B2C] text-white hover:bg-[#FF8A4C] disabled:opacity-40 disabled:hover:bg-[#FF6B2C] transition-all"
            title="Send prompt to agent"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
