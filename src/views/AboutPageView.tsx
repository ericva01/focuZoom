"use client";

import { SiteShell } from "@/components/site/SiteShell";
import { ContactSection } from "@/components/site/ContactSection";
import { useSiteCopy, container, pageTitle, h2, GITHUB_URL } from "@/components/site/ui";

export function AboutPageView() {
  const copy = useSiteCopy().about;

  return (
    <SiteShell>
      <section className={`${container} pt-14`}>
        <h1 className={`${pageTitle} max-w-[15em] !text-[clamp(2.4rem,4.6vw,4.1rem)]`}>{copy.title}</h1>
      </section>

      <section className={`${container} flex flex-wrap gap-x-[72px] gap-y-10 pt-14`}>
        <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-5 text-xl leading-[1.6] text-studio-body">
          {copy.story.map((paragraph) => (
            <p key={paragraph} className="max-w-[30em]">
              {paragraph}
            </p>
          ))}
          <p className="max-w-[30em] text-[17px] text-studio-slate">{copy.maintainer}</p>
        </div>
        <dl className="grid min-w-0 flex-[1.2_1_440px] grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] content-start gap-x-12">
          {copy.principles.map((principle) => (
            <div key={principle.title} className="border-t border-studio-line pb-7 pt-5">
              <dt className="font-display text-xl font-medium">{principle.title}</dt>
              <dd className="mt-1.5 text-studio-body">{principle.body}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-[104px] bg-studio-ink text-studio-ground">
        <div className={`${container} flex flex-wrap items-center gap-x-[72px] gap-y-8 py-[88px]`}>
          <div className="flex min-w-0 flex-[1.4_1_420px] flex-col gap-4">
            <h2 className={h2}>{copy.openTitle}</h2>
            <p className="max-w-[34em] text-studio-mist">{copy.openBody}</p>
          </div>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[48px] items-center rounded-md bg-studio-ground px-6 font-display text-lg font-medium text-studio-ink transition-colors hover:bg-white"
          >
            {copy.viewSource}
          </a>
        </div>
      </section>

      <ContactSection />
    </SiteShell>
  );
}
