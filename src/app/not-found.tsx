"use client";

import Link from "next/link";
import { SiteShell } from "@/components/site/SiteShell";
import { useLanguage } from "@/context/LanguageContext";
import { container, pageTitle, lead, btnPrimary, btnSecondary } from "@/components/site/ui";

export default function NotFound() {
  const { isKhmer, localePath } = useLanguage();

  return (
    <SiteShell>
      <section className={`${container} flex flex-col gap-7 pb-28 pt-20`}>
        <h1 className={pageTitle}>{isKhmer ? "រកមិនឃើញទំព័រនេះទេ" : "This page does not exist"}</h1>
        <p className={`${lead} max-w-[32em]`}>
          {isKhmer
            ? "តំណដែលអ្នកបានចុចអាចចាស់ ឬទំព័រត្រូវបានប្តូរទីតាំង។ សូមត្រឡប់ទៅទំព័រដើម ឬបើកស្ទូឌីយោ។"
            : "The link you followed may be out of date, or the page has moved. Go back to the home page, or open the studio."}
        </p>
        <div className="flex flex-wrap gap-3.5">
          <Link href={localePath("/")} className={btnPrimary}>
            {isKhmer ? "ទៅទំព័រដើម" : "Go to the home page"}
          </Link>
          <Link href={localePath("/editor")} className={btnSecondary}>
            {isKhmer ? "បើកស្ទូឌីយោ" : "Open the studio"}
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
