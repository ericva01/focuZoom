"use client";

import { useEffect, useState } from "react";
import {
  X,
  Key,
  Cpu,
  Sparkles,
  Server,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Radio,
  Wifi,
  WifiOff,
  AlertCircle,
  HelpCircle,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { aiAgentService, DEFAULT_AI_CONFIG } from "@/lib/aiAgentService";
import { agentLocalBridge } from "@/lib/agentLocalBridge";
import { AiAgentConfig, AiAgentProvider } from "@/types/aiAgent";

interface AiAgentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated?: (config: AiAgentConfig) => void;
  onClearHistory?: () => void;
}

export function AiAgentSettingsModal({
  isOpen,
  onClose,
  onConfigUpdated,
  onClearHistory,
}: AiAgentSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<"provider" | "mcp">("provider");
  const [config, setConfig] = useState<AiAgentConfig>(aiAgentService.getConfig());
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [bridgeStatus, setBridgeStatus] = useState<"connected" | "disconnected" | "connecting">("disconnected");
  const [discoveredModels, setDiscoveredModels] = useState<string[]>([]);
  const [isDetectingModels, setIsDetectingModels] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const current = aiAgentService.loadConfig();
      setConfig(current);
      setTestResult(null);
      setBridgeStatus(agentLocalBridge.getStatus());

      const unsubscribe = agentLocalBridge.onStatusChange((status) => {
        setBridgeStatus(status);
      });
      return () => unsubscribe();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = () => {
    const updated = aiAgentService.saveConfig(config);
    if (config.enableLocalBridge) {
      agentLocalBridge.connect(config.localBridgePort);
    } else {
      agentLocalBridge.disconnect();
    }
    if (onConfigUpdated) onConfigUpdated(updated);
    onClose();
  };

  const handleTestConnection = async (overrideConfig?: AiAgentConfig) => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const targetConfig = overrideConfig || config;
      const result = await aiAgentService.testConnection(targetConfig);
      // Synchronize modal state with any model auto-switched by fallback logic
      const updated = aiAgentService.getConfig();
      setConfig(updated);
      setTestResult(result);
    } catch (err: any) {
      setTestResult({ success: false, message: err.message || "Failed to reach agent service." });
    } finally {
      setIsTesting(false);
    }
  };

  const handleDetectModels = async () => {
    if (!config.apiKey?.trim()) return;
    setIsDetectingModels(true);
    try {
      const models = await aiAgentService.listGeminiModels(config.apiKey);
      setDiscoveredModels(models);
      if (models.length > 0 && !models.includes(config.model)) {
        const preferred = models.find((m) => m === "gemini-1.5-flash") || models.find((m) => m.includes("flash")) || models[0];
        setConfig((prev) => ({ ...prev, model: preferred }));
      }
    } catch (err) {
      console.error("Failed to detect Gemini models:", err);
    } finally {
      setIsDetectingModels(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const mcpClaudeConfig = JSON.stringify(
    {
      mcpServers: {
        fucuflow: {
          command: "node",
          args: ["./scripts/mcp-server/index.mjs"],
          env: {
            FUCUFLOW_BRIDGE_PORT: String(config.localBridgePort || 9876),
          },
        },
      },
    },
    null,
    2
  );

  const mcpCursorConfig = JSON.stringify(
    {
      mcpServers: {
        fucuflow: {
          command: "node",
          args: ["scripts/mcp-server/index.mjs"],
        },
      },
    },
    null,
    2
  );

  const curlExample = `curl -X POST http://127.0.0.1:${config.localBridgePort || 9876}/api/action \\
  -H "Content-Type: application/json" \\
  -d '{"action":"add_zoom_keyframe","params":{"timestamp":2.5,"zoom":2.4,"x":0.5,"y":0.4,"label":"Hero Section"}}'`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md p-3 sm:p-4 md:p-6 flex min-h-screen items-center justify-center animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF6B2C] to-amber-500 flex items-center justify-center text-white shadow-lg shadow-[#FF6B2C]/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                Connect AI Agent
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#FF6B2C]/10 text-[#FF6B2C] border border-[#FF6B2C]/20">
                  Studio Copilot & MCP
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure your in-editor AI Copilot or connect external AI agents via Model Context Protocol.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-black/20 px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab("provider")}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "provider"
                ? "border-[#FF6B2C] text-[#FF6B2C]"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Cpu className="w-4 h-4" />
            In-App Copilot (BYO Key)
          </button>
          <button
            onClick={() => setActiveTab("mcp")}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "mcp"
                ? "border-[#FF6B2C] text-[#FF6B2C]"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Server className="w-4 h-4" />
            External Agent & MCP Server
            <span
              className={`w-2 h-2 rounded-full ${
                bridgeStatus === "connected"
                  ? "bg-emerald-500 animate-pulse"
                  : bridgeStatus === "connecting"
                  ? "bg-amber-500 animate-ping"
                  : "bg-slate-400"
              }`}
            />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "provider" ? (
            <>
              {/* Provider Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                  Select AI Agent Provider
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: "gemini", name: "Google Gemini", badge: "Free tier / Fast", defaultModel: "gemini-1.5-flash" },
                    { id: "openai", name: "OpenAI", badge: "GPT-4o mini / 4o", defaultModel: "gpt-4o-mini" },
                    { id: "ollama", name: "Ollama (Local)", badge: "100% Free / Offline", defaultModel: "llama3.2" },
                    { id: "custom", name: "Custom / OpenRouter", badge: "Groq / vLLM", defaultModel: "default" },
                  ].map((p) => {
                    const isSelected = config.provider === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setConfig((prev) => ({
                            ...prev,
                            provider: p.id as AiAgentProvider,
                            model: prev.provider !== p.id ? p.defaultModel : prev.model,
                            customEndpoint:
                              p.id === "ollama" ? "http://localhost:11434/v1" : prev.customEndpoint,
                          }));
                          setTestResult(null);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "border-[#FF6B2C] bg-[#FF6B2C]/10 dark:bg-[#FF6B2C]/15 ring-2 ring-[#FF6B2C]/20"
                            : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-slate-50 dark:bg-white/[0.02]"
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                          {p.name}
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#FF6B2C]" />}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {p.badge}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* API Key Input (if not Ollama) */}
              {config.provider !== "ollama" && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-slate-400" />
                      API Key
                    </label>
                    {config.provider === "gemini" && (
                      <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-[#FF6B2C] hover:underline flex items-center gap-1"
                      >
                        Get Free Gemini Key <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {config.provider === "openai" && (
                      <a
                        href="https://platform.openai.com/api-keys"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-[#FF6B2C] hover:underline flex items-center gap-1"
                      >
                        Get OpenAI Key <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showApiKey ? "text" : "password"}
                      value={config.apiKey}
                      onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                      placeholder={
                        config.provider === "gemini"
                          ? "AIzaSy..."
                          : config.provider === "openai"
                          ? "sk-proj-..."
                          : "Enter provider API key"
                      }
                      className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/15 rounded-xl px-3.5 py-2 text-xs font-mono outline-none focus:border-[#FF6B2C] pr-20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 rounded bg-slate-100 dark:bg-white/[0.06]"
                    >
                      {showApiKey ? "Hide" : "Show"}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    Stored locally in your browser/device only. Never sent to our servers.
                  </p>
                </div>
              )}

              {/* Endpoint (for Ollama or Custom) */}
              {(config.provider === "ollama" || config.provider === "custom") && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                    API Base Endpoint
                  </label>
                  <input
                    type="text"
                    value={config.customEndpoint || ""}
                    onChange={(e) => setConfig({ ...config, customEndpoint: e.target.value })}
                    placeholder="http://localhost:11434/v1"
                    className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/15 rounded-xl px-3.5 py-2 text-xs font-mono outline-none focus:border-[#FF6B2C]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    {config.provider === "ollama"
                      ? "Default Ollama local server port is http://localhost:11434/v1. Run 'ollama serve' in your terminal."
                      : "OpenAI-compatible base URL (e.g., https://openrouter.ai/api/v1 or https://api.groq.com/openai/v1)."}
                  </p>
                </div>
              )}

              {/* Model Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                  Model Identifier
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={config.model}
                    onChange={(e) => setConfig({ ...config, model: e.target.value })}
                    className="flex-1 bg-white dark:bg-black/40 border border-slate-300 dark:border-white/15 rounded-xl px-3.5 py-2 text-xs font-mono outline-none focus:border-[#FF6B2C]"
                  />
                  {config.provider === "gemini" && (
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <Button
                        variant={config.model === "gemini-1.5-flash" ? "primary" : "secondary"}
                        size="sm"
                        onClick={() => setConfig({ ...config, model: "gemini-1.5-flash" })}
                        title="Google Gemini 1.5 Flash (Stable v1)"
                      >
                        1.5 Flash (Stable)
                      </Button>
                      <Button
                        variant={config.model === "gemini-2.0-flash" ? "primary" : "secondary"}
                        size="sm"
                        onClick={() => setConfig({ ...config, model: "gemini-2.0-flash" })}
                        title="Google Gemini 2.0 Flash"
                      >
                        2.0 Flash
                      </Button>
                      <Button
                        variant={config.model === "gemini-1.5-pro" ? "primary" : "secondary"}
                        size="sm"
                        onClick={() => setConfig({ ...config, model: "gemini-1.5-pro" })}
                        title="Google Gemini 1.5 Pro"
                      >
                        1.5 Pro
                      </Button>
                      <Button
                        variant={config.model === "gemini-1.5-flash-8b" ? "primary" : "secondary"}
                        size="sm"
                        onClick={() => setConfig({ ...config, model: "gemini-1.5-flash-8b" })}
                        title="Google Gemini 1.5 Flash-8B"
                      >
                        1.5 Flash-8B
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDetectModels}
                        disabled={isDetectingModels || !config.apiKey?.trim()}
                        title="Scan Google AI Studio for all models enabled on your API key"
                      >
                        {isDetectingModels ? "Scanning..." : "Scan Key Models"}
                      </Button>
                    </div>
                  )}
                  {config.provider === "openai" && (
                    <div className="flex gap-1.5">
                      <Button
                        variant={config.model === "gpt-4o-mini" ? "primary" : "secondary"}
                        size="sm"
                        onClick={() => setConfig({ ...config, model: "gpt-4o-mini" })}
                      >
                        4o-mini
                      </Button>
                      <Button
                        variant={config.model === "gpt-4o" ? "primary" : "secondary"}
                        size="sm"
                        onClick={() => setConfig({ ...config, model: "gpt-4o" })}
                      >
                        GPT-4o
                      </Button>
                    </div>
                  )}
                  {config.provider === "ollama" && (
                    <div className="flex gap-1.5">
                      <Button
                        variant={config.model === "llama3.2" ? "primary" : "secondary"}
                        size="sm"
                        onClick={() => setConfig({ ...config, model: "llama3.2" })}
                      >
                        llama3.2
                      </Button>
                      <Button
                        variant={config.model === "qwen2.5" ? "primary" : "secondary"}
                        size="sm"
                        onClick={() => setConfig({ ...config, model: "qwen2.5" })}
                      >
                        qwen2.5
                      </Button>
                    </div>
                  )}
                </div>

                {config.provider === "gemini" && discoveredModels.length > 0 && (
                  <div className="mt-2.5 p-2.5 bg-slate-100 dark:bg-white/[0.04] rounded-xl border border-slate-200 dark:border-white/10">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                      Models detected on your Google AI Studio key (click to select):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {discoveredModels.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setConfig({ ...config, model: m })}
                          className={`text-[10px] px-2.5 py-1 rounded-lg font-mono transition-colors ${
                            config.model === m
                              ? "bg-[#FF6B2C] text-white font-semibold shadow-sm"
                              : "bg-white dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-[#FF6B2C]/20 border border-slate-200 dark:border-white/10"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Test Connection Result */}
              {testResult && (
                <div
                  className={`p-3.5 rounded-xl border flex flex-col gap-2 text-xs ${
                    testResult.success
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                      : "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {testResult.success ? (
                      <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
                    )}
                    <div className="flex-1 font-medium">{testResult.message}</div>
                  </div>

                  {!testResult.success && config.provider === "gemini" && (
                    <div className="pt-2 border-t border-red-500/20 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-300">
                        Need an active model? Let FucuFlow find & connect to a working model:
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleTestConnection()}
                      >
                        ⚡ Auto-Detect & Connect Best Model
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Actions row */}
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleTestConnection()}
                  disabled={isTesting || (!config.apiKey && config.provider !== "ollama")}
                  leftIcon={
                    isTesting ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Radio className="w-3.5 h-3.5 text-[#FF6B2C]" />
                    )
                  }
                >
                  {isTesting ? "Testing..." : "Test Agent Connection"}
                </Button>

                {onClearHistory && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      aiAgentService.clearHistory();
                      if (onClearHistory) onClearHistory();
                    }}
                    leftIcon={<Trash2 className="w-3.5 h-3.5 text-slate-400" />}
                  >
                    Clear Chat History
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              {/* External Agent & MCP Integration Tab */}
              <div className="space-y-5">
                {/* Live Bridge Card */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          bridgeStatus === "connected"
                            ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                            : bridgeStatus === "connecting"
                            ? "bg-amber-500 animate-ping"
                            : "bg-slate-400"
                        }`}
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          Local Agent Bridge WebSocket
                          <span className="text-[10px] font-normal text-slate-400">
                            (ws://127.0.0.1:{config.localBridgePort || 9876}/editor)
                          </span>
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {bridgeStatus === "connected"
                            ? "Connected! External agents (Claude Desktop, Cursor, MCP) can control FucuFlow in real time."
                            : "Waiting for local bridge server to connect. Run 'npm run agent:bridge' in terminal."}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={config.enableLocalBridge ? "active" : "secondary"}
                      size="sm"
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          enableLocalBridge: !prev.enableLocalBridge,
                        }))
                      }
                    >
                      {config.enableLocalBridge ? "Bridge Enabled" : "Disabled"}
                    </Button>
                  </div>
                </div>

                {/* Claude Desktop Configuration */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        Claude Desktop MCP Integration
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Add to your <code className="text-[#FF6B2C]">claude_desktop_config.json</code> to let Claude control FucuFlow:
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleCopy(mcpClaudeConfig, "claude")}
                      leftIcon={
                        copiedKey === "claude" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )
                      }
                    >
                      {copiedKey === "claude" ? "Copied!" : "Copy JSON"}
                    </Button>
                  </div>
                  <pre className="p-3 rounded-lg bg-black/60 text-[11px] font-mono text-slate-300 overflow-x-auto border border-white/5">
                    {mcpClaudeConfig}
                  </pre>
                </div>

                {/* Cursor & Antigravity Configuration */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5 text-blue-400" />
                        Cursor & Antigravity MCP Config
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Save to your workspace <code className="text-[#FF6B2C]">.cursor/mcp.json</code> or project MCP settings:
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleCopy(mcpCursorConfig, "cursor")}
                      leftIcon={
                        copiedKey === "cursor" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )
                      }
                    >
                      {copiedKey === "cursor" ? "Copied!" : "Copy JSON"}
                    </Button>
                  </div>
                  <pre className="p-3 rounded-lg bg-black/60 text-[11px] font-mono text-slate-300 overflow-x-auto border border-white/5">
                    {mcpCursorConfig}
                  </pre>
                </div>

                {/* Terminal Commands */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                      Run Bridge or Test via cURL
                    </h4>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleCopy("npm run agent:bridge", "cmd")}
                      leftIcon={
                        copiedKey === "cmd" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )
                      }
                    >
                      {copiedKey === "cmd" ? "Copied!" : "Copy Command"}
                    </Button>
                  </div>
                  <pre className="p-2.5 rounded-lg bg-black/60 text-[11px] font-mono text-emerald-400 border border-white/5">
                    npm run agent:bridge
                  </pre>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]">
          <span className="text-[11px] text-slate-400">
            {config.provider === "gemini"
              ? "Using Google Gemini Flash Copilot"
              : config.provider === "openai"
              ? "Using OpenAI GPT Copilot"
              : config.provider === "ollama"
              ? "Using Local Ollama (Offline)"
              : "Using Custom Endpoint"}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              Save & Connect
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
