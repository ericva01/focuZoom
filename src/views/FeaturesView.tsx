"use client";

import { useCallback, useRef, useState } from "react";
import type { StudioStageHandle } from "@/lib/studioStage";
import { SiteShell, ClosingAction } from "@/components/site/SiteShell";
import { StudioStage } from "@/components/site/StudioStage";
import { useSiteCopy, container, pageTitle, lead, body } from "@/components/site/ui";

const MOVE_AT = [0, 0.25, 0.5, 0.75, 1];

export function FeaturesView() {
  const site = useSiteCopy();
  const copy = site.features;
  const stageRef = useRef<StudioStageHandle | null>(null);
  const [active, setActive] = useState(0);

  const handleReady = useCallback((stage: StudioStageHandle) => {
    stageRef.current = stage;
  }, []);

  const pick = (index: number) => {
    setActive(index);
    const stage = stageRef.current;
    if (!stage) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (calm) stage.setProgress(MOVE_AT[index]);
    else stage.animateTo(MOVE_AT[index], 1.8);
  };

  return (
    <SiteShell>
      <section className={`${container} flex flex-col gap-6 pt-14`}>
        <h1 className={`${pageTitle} max-w-[14em]`}>{copy.title}</h1>
        <p className={`${lead} max-w-[34em]`}>{copy.lead}</p>
      </section>

      <section className={`${container} pt-[72px]`}>
        <div className="flex flex-wrap items-center gap-x-14 gap-y-8">
          <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-5">
            <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-normal leading-[1.1] tracking-[-0.02em]">
              {copy.tryTitle}
            </h2>
            <div role="group" aria-label={copy.movesLabel} className="flex flex-col border-b border-studio-line font-display text-xl">
              {copy.moves.map((move, i) => (
                <button
                  key={move.label}
                  type="button"
                  onClick={() => pick(i)}
                  aria-pressed={i === active}
                  className={`flex min-h-[52px] w-full items-center gap-3.5 border-t border-studio-line py-2.5 text-left ${
                    i === active ? "font-medium" : "font-normal"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-2.5 w-2.5 flex-none rotate-45 ${i === active ? "bg-studio-key" : "bg-studio-rail"}`}
                  />
                  <span>{move.label}</span>
                </button>
              ))}
            </div>
            <p aria-live="polite" className={`${body} min-h-[5.2em] max-w-[26em]`}>
              {copy.moves[active].note}
            </p>
          </div>
          <div className="min-w-0 flex-[1.7_1_480px]">
            <StudioStage label={site.home.stageLabel} fallback={site.home.noGl} onReady={handleReady} />
          </div>
        </div>
      </section>

      <section className={`${container} pt-[104px]`}>
        <div className="border-b-[1.5px] border-studio-ink">
          {copy.groups.map((group) => (
            <div key={group.title} className="flex flex-wrap gap-x-[72px] gap-y-4 border-t-[1.5px] border-studio-ink pb-11 pt-9">
              <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-3">
                <h2 className="font-display text-[34px] font-normal leading-[1.1] tracking-[-0.015em]">{group.title}</h2>
                <p className={`${body} max-w-[24em]`}>{group.body}</p>
              </div>
              <ul className="min-w-0 flex-[1.5_1_460px]">
                {group.items.map((item, i) => (
                  <li key={item} className={`py-3.5 ${i < group.items.length - 1 ? "border-b border-studio-rail" : ""}`}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <ClosingAction title={copy.closing} />
    </SiteShell>
  );
}
