"use client";

import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteCopy, container, GITHUB_URL } from "@/components/site/ui";

const linkClass = "underline decoration-studio-line underline-offset-[5px] hover:text-studio-keydeep";

export function Footer() {
  const { localePath } = useLanguage();
  const site = useSiteCopy();
  const copy = site.footer;

  return (
    <footer className="border-t-[1.5px] border-studio-ink font-display text-[17px]">
      <div className={`${container} flex flex-wrap gap-x-[72px] gap-y-10 pb-14 pt-12`}>
        <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-3">
          <Logo size="md" />
          <p className="max-w-[24em] font-serif text-base text-studio-slate">{copy.blurb}</p>
          <LanguageSwitcher variant="footer" />
        </div>
        <div className="flex flex-col gap-2.5">
          <span className="font-medium">{copy.product}</span>
          <Link href={localePath("/features")} className={linkClass}>{site.nav.features}</Link>
          <Link href={localePath("/download")} className={linkClass}>{site.nav.download}</Link>
          <Link href={localePath("/editor")} className={linkClass}>{site.nav.openStudio}</Link>
          <Link href={localePath("/resources")} className={linkClass}>{site.nav.resources}</Link>
        </div>
        <div className="flex flex-col gap-2.5">
          <span className="font-medium">{copy.project}</span>
          <Link href={localePath("/about")} className={linkClass}>{copy.aboutContact}</Link>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className={linkClass}>{copy.source}</a>
          <a href={`${GITHUB_URL}/releases`} target="_blank" rel="noreferrer" className={linkClass}>{copy.releases}</a>
        </div>
      </div>
    </footer>
  );
}
