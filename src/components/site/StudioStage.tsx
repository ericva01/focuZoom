"use client";

import { useEffect, useRef, useState } from "react";
import { createStudioStage, type StudioStageHandle } from "@/lib/studioStage";

interface StudioStageProps {
  /** Described to screen readers in place of the canvas. */
  label: string;
  /** Shown when WebGL is unavailable. */
  fallback: string;
  start?: number;
  onReady?: (stage: StudioStageHandle) => void;
  className?: string;
}

/** The Three.js stage: a sample recording seen through the moving camera. */
export function StudioStage({ label, fallback, start = 0, onReady, className = "" }: StudioStageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const readyRef = useRef(onReady);
  readyRef.current = onReady;
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const stage = createStudioStage(canvas, { start });
    if (!stage) {
      setFailed(true);
      return;
    }
    readyRef.current?.(stage);
    return () => stage.dispose();
  }, [start]);

  return (
    <div className={`relative aspect-[3/2] min-h-[300px] w-full ${className}`}>
      <canvas ref={canvasRef} role="img" aria-label={label} className="absolute inset-0 block h-full w-full" />
      {failed && (
        <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-studio-slate">{fallback}</p>
      )}
    </div>
  );
}
