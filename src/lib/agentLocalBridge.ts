"use client";

import { EditorActionPayload, EditorStateSnapshot } from "@/types/aiAgent";

type StatusCallback = (status: "connected" | "disconnected" | "connecting") => void;
type ActionHandler = (payload: EditorActionPayload) => Promise<any> | any;
type StateProvider = () => EditorStateSnapshot;

class AgentLocalBridgeClient {
  private ws: WebSocket | null = null;
  private isEnabled: boolean = false;
  private port: number = 9876;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 2;
  private statusListeners: Set<StatusCallback> = new Set();
  private actionHandler: ActionHandler | null = null;
  private stateProvider: StateProvider | null = null;
  private currentStatus: "connected" | "disconnected" | "connecting" = "disconnected";

  public init({
    port = 9876,
    enabled = false,
    actionHandler,
    stateProvider,
  }: {
    port?: number;
    enabled?: boolean;
    actionHandler?: ActionHandler;
    stateProvider?: StateProvider;
  } = {}) {
    this.port = port;
    this.isEnabled = enabled;
    if (actionHandler) this.actionHandler = actionHandler;
    if (stateProvider) this.stateProvider = stateProvider;

    if (this.isEnabled) {
      this.reconnectAttempts = 0;
      this.connect();
    } else {
      this.disconnect();
    }
  }

  public setActionHandler(handler: ActionHandler) {
    this.actionHandler = handler;
  }

  public setStateProvider(provider: StateProvider) {
    this.stateProvider = provider;
  }

  public onStatusChange(callback: StatusCallback): () => void {
    this.statusListeners.add(callback);
    callback(this.currentStatus);
    return () => {
      this.statusListeners.delete(callback);
    };
  }

  private setStatus(status: "connected" | "disconnected" | "connecting") {
    if (this.currentStatus !== status) {
      this.currentStatus = status;
      this.statusListeners.forEach((cb) => cb(status));
    }
  }

  public getStatus() {
    return this.currentStatus;
  }

  public connect(port?: number) {
    if (port) this.port = port;
    this.isEnabled = true;

    if (typeof window === "undefined") return;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.setStatus("connecting");

    try {
      const wsUrl = `ws://127.0.0.1:${this.port}/editor`;
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        this.ws = socket;
        this.reconnectAttempts = 0;
        this.setStatus("connected");
        // Handshake
        socket.send(
          JSON.stringify({
            type: "handshake",
            role: "fucuflow-editor",
            timestamp: Date.now(),
          })
        );
      };

      socket.onmessage = async (event) => {
        try {
          const msg = JSON.parse(event.data);
          await this.handleIncomingMessage(msg);
        } catch (err) {
          console.warn("[AgentBridgeClient] Invalid message payload", err);
        }
      };

      socket.onclose = () => {
        this.ws = null;
        this.setStatus("disconnected");
        this.scheduleReconnect();
      };

      socket.onerror = () => {
        // Silently close and let onclose handle reconnect
        if (this.ws) {
          try {
            this.ws.close();
          } catch {}
        }
      };
    } catch {
      this.setStatus("disconnected");
      this.scheduleReconnect();
    }
  }

  public disconnect() {
    this.isEnabled = false;
    this.reconnectAttempts = 0;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      try {
        this.ws.close();
      } catch {}
      this.ws = null;
    }
    this.setStatus("disconnected");
  }

  private scheduleReconnect() {
    if (!this.isEnabled) return;
    if (this.reconnectTimer) return;
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      // Avoid infinite reconnection error logs if local bridge process isn't running
      return;
    }

    this.reconnectAttempts++;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (this.isEnabled) {
        this.connect();
      }
    }, 5000);
  }

  private async handleIncomingMessage(msg: any) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    if (msg.type === "get_state") {
      const state = this.stateProvider ? this.stateProvider() : null;
      this.ws.send(
        JSON.stringify({
          type: "state_response",
          id: msg.id,
          state,
        })
      );
      return;
    }

    if (msg.type === "execute_action") {
      if (!this.actionHandler) {
        this.ws.send(
          JSON.stringify({
            type: "action_response",
            id: msg.id,
            success: false,
            error: "No active action handler registered in FucuFlow editor.",
          })
        );
        return;
      }

      try {
        const result = await this.actionHandler(msg.payload);
        this.ws.send(
          JSON.stringify({
            type: "action_response",
            id: msg.id,
            success: true,
            result: result ?? { success: true },
          })
        );
      } catch (err: any) {
        this.ws.send(
          JSON.stringify({
            type: "action_response",
            id: msg.id,
            success: false,
            error: err.message || "Action execution failed in editor.",
          })
        );
      }
      return;
    }
  }
}

export const agentLocalBridge = new AgentLocalBridgeClient();
