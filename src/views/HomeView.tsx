"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DesktopAppDashboard } from "@/components/desktop/DesktopAppDashboard";
import { isTauriEnvironment, isElectronEnvironment, isDesktopApp } from "@/lib/desktopBridge";
import { useLanguage } from "@/context/LanguageContext";
import { SiteShell, StudioActions, ClosingAction } from "@/components/site/SiteShell";
import { CameraDemo } from "@/components/site/CameraDemo";
import { useSiteCopy, container, h1, h2, h3, lead, body, textLink } from "@/components/site/ui";

// Plan-view sketches of each camera move, in the manner of a film blocking diagram.
const INK = "#1C2733";
const KEY = "#F26A21";
const sketches = [
  <svg key="push" viewBox="0 0 240 120" aria-hidden="true" className="h-auto w-60 max-w-full">
    <line x1="40" y1="16" x2="200" y2="16" stroke={INK} strokeWidth="4" />
    <circle cx="150" cy="16" r="6" fill={KEY} />
    <path d="M120 104 L148 34" fill="none" stroke={KEY} strokeWidth="2" strokeDasharray="5 5" />
    <path d="M142 40 L149 30 L154 42" fill="none" stroke={KEY} strokeWidth="2" />
    <rect x="108" y="98" width="24" height="16" rx="2" fill={INK} />
    <path d="M114 98 L110 90 L130 90 L126 98 Z" fill={INK} />
  </svg>,
  <svg key="tilt" viewBox="0 0 240 120" aria-hidden="true" className="h-auto w-60 max-w-full">
    <line x1="40" y1="16" x2="200" y2="16" stroke={INK} strokeWidth="4" />
    <path d="M52 92 Q120 124 188 92" fill="none" stroke={KEY} strokeWidth="2" strokeDasharray="5 5" />
    <path d="M178 88 L190 91 L184 102" fill="none" stroke={KEY} strokeWidth="2" />
    <g transform="rotate(-28 52 88)">
      <rect x="40" y="82" width="24" height="16" rx="2" fill={INK} />
      <path d="M46 82 L42 74 L62 74 L58 82 Z" fill={INK} />
    </g>
    <line x1="56" y1="72" x2="112" y2="22" stroke="#9AA5AE" strokeWidth="1" />
  </svg>,
  <svg key="pip" viewBox="0 0 240 120" aria-hidden="true" className="h-auto w-60 max-w-full">
    <rect x="42" y="10" width="156" height="100" rx="6" fill="none" stroke={INK} strokeWidth="2" />
    <line x1="58" y1="32" x2="130" y2="32" stroke="#9AA5AE" strokeWidth="2" />
    <line x1="58" y1="48" x2="110" y2="48" stroke="#9AA5AE" strokeWidth="2" />
    <circle cx="166" cy="78" r="20" fill={INK} />
    <circle cx="166" cy="78" r="24" fill="none" stroke={KEY} strokeWidth="2" />
  </svg>,
];

export function HomeView() {
  const [isDesktopMode, setIsDesktopMode] = useState<boolean>(false);
  const { localePath } = useLanguage();
  const site = useSiteCopy();
  const copy = site.home;

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Clean up any stale/legacy localStorage desktop flags so web visitors always see the marketing landing page
      try {
        localStorage.removeItem("fucuflow_is_desktop");
        sessionStorage.removeItem("fucuflow_is_desktop");
      } catch {
        // ignore
      }

      // If running inside authentic native desktop wrapper runtime (Tauri or Electron),
      // render DesktopAppDashboard and route to the dedicated desktop dashboard
      if (isTauriEnvironment() || isElectronEnvironment() || isDesktopApp()) {
        setIsDesktopMode(true);
        window.location.replace("/desktop");
      }
    }
  }, []);

  if (isDesktopMode) {
    return <DesktopAppDashboard />;
  }

  return (
    <SiteShell>
      <section className={`${container} pt-10`}>
        <CameraDemo>
          <div className="flex flex-col gap-7">
            <h1 className={h1}>{copy.title}</h1>
            <p className={`${lead} max-w-[30em]`}>{copy.lead}</p>
            <StudioActions />
          </div>
        </CameraDemo>
      </section>

      <section className={`${container} pt-[120px]`}>
        <h2 className={`${h2} mb-14 max-w-[16em]`}>{copy.movesTitle}</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-x-14 gap-y-12">
          {copy.moves.map((move, i) => (
            <div key={move.title} className="flex flex-col gap-3.5">
              {sketches[i]}
              <h3 className={h3}>{move.title}</h3>
              <p className={body}>{move.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={`${container} pt-[120px]`}>
        <h2 className={`${h2} mb-10`}>{copy.stepsTitle}</h2>
        <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-x-14">
          {copy.steps.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-2 border-t-[1.5px] border-studio-ink pb-8 pt-6">
              <span aria-hidden="true" className="font-display text-[64px] font-light leading-none text-studio-slate">
                {i + 1}
              </span>
              <h3 className={h3}>{step.title}</h3>
              <p className={body}>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-24 bg-studio-ink text-studio-ground">
        <div className={`${container} flex flex-wrap gap-x-[72px] gap-y-12 py-24`}>
          <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-5">
            <h2 className={h2}>{copy.agentTitle}</h2>
            <p className="max-w-[32em] text-studio-mist">{copy.agentBody}</p>
            <p className="font-display text-[17px]">
              <Link href={localePath("/features")} className="text-white underline underline-offset-[5px]">
                {copy.agentLink}
              </Link>
            </p>
          </div>
          <div className="min-w-0 flex-[1_1_420px]">
            <h3 className="mb-2 font-display text-lg font-medium text-studio-mist">{copy.agentAsk}</h3>
            <ul className="border-b border-studio-slate text-xl italic leading-[1.5]">
              {copy.agentPrompts.map((prompt) => (
                <li key={prompt} className="border-t border-studio-slate py-5">
                  {prompt}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={`${container} flex flex-wrap gap-x-[72px] gap-y-10 pt-[120px]`}>
        <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-5">
          <h2 className={h2}>{copy.localTitle}</h2>
          <p className={`${body} max-w-[30em]`}>{copy.localBody}</p>
        </div>
        <dl className="grid min-w-0 flex-[1.3_1_480px] grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-x-12">
          {copy.localFacts.map((fact) => (
            <div key={fact.title} className="border-t border-studio-line pb-7 pt-5">
              <dt className="font-display text-xl font-medium">{fact.title}</dt>
              <dd className={`${body} mt-1.5`}>{fact.body}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={`${container} flex flex-wrap gap-x-[72px] gap-y-8 pt-[120px]`}>
        <h2 className={`${h2} flex-[1_1_300px]`}>{copy.faqTitle}</h2>
        <div className="min-w-0 flex-[1.6_1_520px] border-b border-studio-line">
          {copy.faqs.map((faq, i) => (
            <details key={faq.q} className="border-t border-studio-line py-5">
              <summary className="cursor-pointer font-display text-xl font-medium">{faq.q}</summary>
              <p className={`${body} mt-3 max-w-[38em]`}>
                {faq.a}
                {i === 2 && (
                  <>
                    {" "}
                    <Link href={localePath("/download")} className={textLink}>
                      {site.nav.download}
                    </Link>
                  </>
                )}
              </p>
            </details>
          ))}
        </div>
      </section>

      <ClosingAction title={copy.closing} large />
    </SiteShell>
  );
}
