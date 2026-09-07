"use client";

import {
  Focus,
  Plus,
  Trash2,
  Play,
  RotateCcw,
  Eye,
  EyeOff,
  Crosshair,
} from "lucide-react";
import { ClickEvent } from "@/types/editor";
import { formatTimecode } from "@/utils/easing";

import { Button } from "@/components/ui/Button";

interface ClickInspectorProps {
  events: ClickEvent[];
  currentTime: number;
  onSelectEvent: (event: ClickEvent) => void;
  onUpdateEvent: (id: string, updates: Partial<ClickEvent>) => void;
  onDeleteEvent: (id: string) => void;
  onAddCurrentTimeEvent: () => void;
  onResetDemoEvents: () => void;
  isAddMode: boolean;
  onToggleAddMode: () => void;
}

export function ClickInspector({
  events,
  currentTime,
  onSelectEvent,
  onUpdateEvent,
  onDeleteEvent,
  onAddCurrentTimeEvent,
  onResetDemoEvents,
  isAddMode,
  onToggleAddMode,
}: ClickInspectorProps) {
  return (
    <aside className="w-full border-l border-white/[0.08] bg-[#090D16]/80 backdrop-blur-xl flex flex-col h-full overflow-hidden select-none">
      {/* Header */}
      <div className="p-4 border-b border-white/[0.08] bg-white/[0.02] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center">
              <Focus className="w-3.5 h-3.5 text-sky-300" />
            </div>
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider">
              Zoom Keyframes
            </h3>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-400/30">
            {events.length} Points
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onAddCurrentTimeEvent}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            title="Log a zoom target at the current playback time"
          >
            Mark Time
          </Button>

          <Button
            variant={isAddMode ? "active" : "secondary"}
            size="sm"
            onClick={onToggleAddMode}
            leftIcon={<Crosshair className="w-3.5 h-3.5" />}
          >
            {isAddMode ? "Placing..." : "Click Canvas"}
          </Button>
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {events.length === 0 ? (
          <div className="py-12 text-center space-y-3 px-4 glass-panel rounded-2xl mx-1 my-2">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-slate-400">
              <Focus className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-xs text-slate-400">No zoom keyframes added yet.</p>
            <button
              onClick={onResetDemoEvents}
              className="text-xs text-sky-400 hover:text-sky-300 flex items-center justify-center gap-1.5 mx-auto font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Load standard demo points</span>
            </button>
          </div>
        ) : (
          events.map((ev, index) => {
            const isNearCurrentTime = Math.abs(currentTime - ev.timestamp) < 0.6;

            return (
              <div
                key={ev.id}
                className={`rounded-xl border transition-all duration-200 ${
                  isNearCurrentTime
                    ? "glass-panel-elevated border-sky-400/50 shadow-[0_0_20px_rgba(56,189,248,0.15)] bg-sky-950/20"
                    : "glass-panel hover:border-white/20"
                } p-3.5 space-y-2.5`}
              >
                {/* Event Top Row: Timecode, Label, Enable toggle */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectEvent(ev)}
                      className="px-2 py-0.5 rounded-lg bg-sky-500/20 border border-sky-400/30 text-[11px] font-mono text-sky-300 hover:bg-sky-500/30 transition-colors flex items-center gap-1 shadow-glass-sm"
                      title="Jump playhead to this event"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>{formatTimecode(ev.timestamp)}</span>
                    </button>

                    <span className="text-xs font-medium text-white truncate max-w-[110px]">
                      {ev.label || `Target #${index + 1}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onUpdateEvent(ev.id, { enabled: !ev.enabled })}
                      className={`p-1.5 rounded-lg hover:bg-white/[0.08] transition-colors ${
                        ev.enabled ? "text-sky-400" : "text-slate-500"
                      }`}
                      title={ev.enabled ? "Zoom point active" : "Zoom point disabled"}
                    >
                      {ev.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => onDeleteEvent(ev.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/[0.08] transition-colors"
                      title="Delete zoom point"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Event Details: Coordinates & 3D Dolly Depth */}
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300 bg-black/30 p-2.5 rounded-lg border border-white/[0.08]">
                  <div>
                    Target:{" "}
                    <span className="text-white font-mono">
                      {Math.round(ev.x * 100)}%, {Math.round(ev.y * 100)}%
                    </span>
                  </div>
                  <div className="text-right">
                    3D Dolly: <span className="text-sky-300 font-mono font-bold">{ev.zoom}x</span>
                  </div>
                </div>

                {/* 3D Dolly Zoom Depth Pills */}
                <div className="flex items-center justify-between pt-1 border-t border-white/[0.08]">
                  <span className="text-[10px] text-slate-400">Dolly-in:</span>
                  <div className="flex items-center gap-1">
                    {[1.5, 2.0, 2.6, 3.2].map((zm) => (
                      <button
                        key={zm}
                        onClick={() => onUpdateEvent(ev.id, { zoom: zm })}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-all duration-200 ${
                          ev.zoom === zm
                            ? "bg-sky-500/20 text-sky-200 font-bold border border-sky-400/30 shadow-glass-sm"
                            : "bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent"
                        }`}
                      >
                        {zm}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Footer: Reset Demo */}
      <div className="p-3 border-t border-white/[0.08] bg-white/[0.02]">
        <Button
          variant="secondary"
          size="sm"
          onClick={onResetDemoEvents}
          className="w-full"
          leftIcon={<RotateCcw className="w-3.5 h-3.5 text-sky-300" />}
        >
          Reset Sample Keyframes
        </Button>
      </div>
    </aside>
  );
}
