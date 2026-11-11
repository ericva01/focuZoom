"use client";

import { useLanguage } from "@/context/LanguageContext";
import { siteCopy } from "@/lib/i18n/siteCopy";

/** Website copy in the visitor's language. */
export function useSiteCopy() {
  const { locale } = useLanguage();
  return siteCopy[locale] ?? siteCopy.kh;
}

export const GITHUB_URL = "https://github.com/ericva01/focuZoom";

// Shared class recipes for the marketing site, so every page uses one scale.
export const container = "mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-16";
export const h1 = "font-display font-normal text-balance tracking-[-0.025em] leading-[1.03] text-[clamp(2.75rem,5.6vw,4.9rem)]";
export const pageTitle = "font-display font-normal text-balance tracking-[-0.025em] leading-[1.05] text-[clamp(2.5rem,5vw,4.5rem)]";
export const h2 = "font-display font-normal tracking-[-0.02em] leading-[1.1] text-[clamp(2rem,3.6vw,3rem)]";
export const h3 = "font-display font-medium text-2xl leading-tight";
export const lead = "text-xl leading-[1.55] text-studio-body";
export const body = "text-studio-body";
export const btnPrimary = "inline-flex min-h-[48px] items-center justify-center rounded-md bg-studio-ink px-6 font-display text-lg font-medium text-white transition-colors hover:bg-studio-deep";
export const btnSecondary = "inline-flex min-h-[48px] items-center justify-center rounded-md border-[1.5px] border-studio-ink px-6 font-display text-lg font-medium text-studio-ink transition-colors hover:bg-studio-ink hover:text-white";
export const textLink = "underline decoration-studio-line underline-offset-[5px] hover:text-studio-keydeep";
