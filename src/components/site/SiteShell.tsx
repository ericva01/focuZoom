"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteCopy, container, btnPrimary, btnSecondary } from "@/components/site/ui";

/** Page frame for every marketing page: navbar, main landmark, footer. */
export function SiteShell({ children }: { children: ReactNode }) {
  const { isKhmer } = useLanguage();
  return (
    <div data-lang={isKhmer ? "km" : "en"} className="website-ui flex min-h-screen flex-col bg-studio-ground font-serif text-lg leading-[1.6] text-studio-ink selection:bg-studio-ink selection:text-white">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <Footer />
    </div>
  );
}

/** The site's one primary action, with the desktop download beside it. */
export function StudioActions() {
  const { localePath } = useLanguage();
  const copy = useSiteCopy().home;
  return (
    <div className="flex flex-wrap gap-3.5">
      <Link href={localePath("/editor")} className={btnPrimary}>
        {copy.openStudio}
      </Link>
      <Link href={localePath("/download")} className={btnSecondary}>
        {copy.downloadApp}
      </Link>
    </div>
  );
}

/** Closing band used at the foot of a page. */
export function ClosingAction({ title, large = false }: { title: string; large?: boolean }) {
  return (
    <section className={`${container} flex flex-col gap-7 pb-28 pt-28`}>
      <h2
        className={`font-display font-normal tracking-[-0.025em] leading-[1.04] ${
          large ? "text-[clamp(2.5rem,5vw,4.5rem)]" : "text-[clamp(2.25rem,4.4vw,3.75rem)]"
        }`}
      >
        {title}
      </h2>
      <StudioActions />
    </section>
  );
}
