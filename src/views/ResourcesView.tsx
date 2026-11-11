"use client";

import { SiteShell, ClosingAction } from "@/components/site/SiteShell";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteCopy, container, pageTitle, h2, lead } from "@/components/site/ui";

export function ResourcesView() {
  const { t } = useLanguage();
  const site = useSiteCopy();
  const copy = site.resources;
  const { shortcuts, guides } = t.resourcesPage;

  return (
    <SiteShell>
      <section className={`${container} flex flex-col gap-6 pt-14`}>
        <h1 className={pageTitle}>{copy.title}</h1>
        <p className={`${lead} max-w-[34em]`}>{copy.lead}</p>
      </section>

      <section className={`${container} pt-[72px]`}>
        <h2 className={`${h2} mb-6`}>{copy.shortcutsTitle}</h2>
        <div className="overflow-x-auto border-t-[1.5px] border-studio-ink pt-5">
          <table className="w-full min-w-[560px] border-collapse">
            <thead>
              <tr className="text-left font-display text-[15px] text-studio-slate">
                <th scope="col" className="pb-3 pr-6 font-normal">{copy.key}</th>
                <th scope="col" className="pb-3 font-normal">{copy.action}</th>
              </tr>
            </thead>
            <tbody>
              {shortcuts.map((shortcut) => (
                <tr key={shortcut.key} className="border-t border-studio-rail align-baseline">
                  <th scope="row" className="whitespace-nowrap py-[18px] pr-6 text-left font-display text-[19px] font-medium">
                    {shortcut.key}
                  </th>
                  <td className="py-[18px] text-studio-body">
                    <span className="text-studio-ink">{shortcut.label}.</span> {shortcut.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={`${container} pt-[104px]`}>
        <h2 className={`${h2} mb-6`}>{copy.guidesTitle}</h2>
        <ul className="border-b border-t-[1.5px] border-b-studio-line border-t-studio-ink">
          {guides.map((guide, i) => (
            <li key={guide.title} className={`flex flex-wrap items-baseline gap-x-8 gap-y-1 py-5 ${i > 0 ? "border-t border-studio-rail" : ""}`}>
              <span className="min-w-0 flex-[1_1_280px] font-display text-xl font-medium">{guide.title}</span>
              <span className="min-w-0 flex-[1.6_1_360px] text-studio-body">{guide.desc}</span>
            </li>
          ))}
        </ul>
      </section>

      <ClosingAction title={site.features.closing} />
    </SiteShell>
  );
}
