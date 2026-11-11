"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import type { StudioStageHandle } from "@/lib/studioStage";
import { StudioStage } from "@/components/site/StudioStage";
import { useSiteCopy } from "@/components/site/ui";

const DURATION = 12;
const KEYFRAMES = [0.25, 0.5, 0.75];
const MARKS = [0, 0.25, 0.5, 0.75, 1];

function prefersCalm() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function clock(seconds: number) {
  return `0:${seconds < 10 ? "0" : ""}${seconds}`;
}

/** Hero: the given text beside the 3D scene, with a scrubbable timeline ruler underneath. */
export function CameraDemo({ children }: { children: ReactNode }) {
  const copy = useSiteCopy().home;
  const stageRef = useRef<StudioStageHandle | null>(null);
  const scrubRef = useRef<HTMLInputElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const handleReady = useCallback((stage: StudioStageHandle) => {
    stageRef.current = stage;
    stage.onUpdate((progress, isPlaying) => {
      if (scrubRef.current) scrubRef.current.value = String(Math.round(progress * 1000));
      setSeconds(Math.floor(progress * DURATION + 0.001));
      setPlaying(isPlaying);
    });
    // One orchestrated move on load, then the visitor is in control.
    if (prefersCalm()) stage.setProgress(0.25);
    else stage.play();
  }, []);

  const toggle = () => {
    const stage = stageRef.current;
    if (!stage) return;
    if (stage.isPlaying()) stage.pause();
    else stage.play();
  };

  const goTo = (progress: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    if (prefersCalm()) stage.setProgress(progress);
    else stage.animateTo(progress, 1.6);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-12 gap-y-10">
        <div className="min-w-0 flex-[1.1_1_400px]">{children}</div>
        <div className="min-w-0 flex-[1.5_1_480px]">
          <StudioStage label={copy.stageLabel} fallback={copy.noGl} onReady={handleReady} />
        </div>
      </div>

      <div className="mt-7 font-display">
        <div className="flex justify-between text-sm tabular-nums text-studio-slate" aria-hidden="true">
          {MARKS.map((m) => (
            <span key={m}>{clock(m * DURATION)}</span>
          ))}
        </div>
        <div className="studio-ruler relative h-16 border-b border-t-[1.5px] border-b-studio-rail border-t-studio-ink">
          {KEYFRAMES.map((k) => (
            <span
              key={k}
              aria-hidden="true"
              className="absolute top-[34px] -ml-1.5 h-3 w-3 rotate-45 bg-studio-key"
              style={{ left: `${k * 100}%` }}
            />
          ))}
          <input
            ref={scrubRef}
            type="range"
            min={0}
            max={1000}
            step={1}
            defaultValue={0}
            aria-label={copy.scrubLabel}
            onChange={(e) => stageRef.current?.setProgress(Number(e.target.value) / 1000)}
            className="studio-scrub absolute left-0 top-0 h-16 w-full"
          />
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-3.5 text-base">
          <button
            type="button"
            onClick={toggle}
            className="min-h-[44px] min-w-[92px] rounded-md border-[1.5px] border-studio-ink px-4 font-medium transition-colors hover:bg-studio-ink hover:text-white"
          >
            {playing ? copy.pause : copy.play}
          </button>
          <span className="min-w-[5.5em] tabular-nums text-studio-slate">
            {clock(seconds)} {copy.of} {clock(DURATION)}
          </span>
          <div className="ml-auto flex flex-wrap gap-x-1.5 gap-y-1">
            {copy.marks.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => goTo(MARKS[i])}
                className="min-h-[44px] rounded-md px-3 underline decoration-studio-line underline-offset-[5px] hover:text-studio-keydeep"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-1.5 font-serif text-base text-studio-slate">{copy.scrubHint}</p>
      </div>
    </>
  );
}
