"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteShell } from "@/components/site/SiteShell";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteCopy, container, pageTitle, h2, lead, body, btnPrimary, textLink, GITHUB_URL } from "@/components/site/ui";
import type { SiteCopy } from "@/lib/i18n/siteCopy";
import { FALLBACK_RELEASES, GITHUB_REPO, type GitHubRelease, type ReleaseAsset } from "@/lib/releases";

const CACHE_KEY = "fucuflow_github_releases_v2";
const CACHE_TTL_MS = 10 * 60 * 1000;

type Platform = keyof SiteCopy["download"]["platforms"];
type Kind = keyof SiteCopy["download"]["kinds"];

// Read the platform and installer type from a release file name.
function describeAsset(name: string): { platform: Platform; kind: Kind; order: number } | null {
  const file = name.toLowerCase();
  if (file.endsWith(".exe")) return { platform: "win", kind: "exe", order: 0 };
  if (file.endsWith(".msi")) return { platform: "win", kind: "msi", order: 1 };
  if (file.endsWith(".dmg")) {
    const arm = file.includes("aarch64") || file.includes("arm64");
    return { platform: arm ? "macArm" : "macIntel", kind: "dmg", order: arm ? 2 : 3 };
  }
  if (file.endsWith(".appimage")) return { platform: "linux", kind: "appimage", order: 4 };
  if (file.endsWith(".deb")) return { platform: "deb", kind: "deb", order: 5 };
  if (file.endsWith(".rpm")) return { platform: "rpm", kind: "rpm", order: 6 };
  return null;
}

function formatSize(bytes: number) {
  const mb = bytes / (1024 * 1024);
  return `${mb >= 20 ? Math.round(mb) : mb.toFixed(1)} MB`;
}

// Release notes arrive as Markdown; keep the bullet lines as plain text.
function releaseNotes(markdown: string) {
  return markdown
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line))
    .map((line) => line.replace(/^[-*]\s+/, "").replace(/[*_`]/g, ""))
    // Some releases list their installer files as bullets; those are not release notes.
    .filter((line) => !/\.(exe|msi|dmg|deb|rpm|appimage)\b/i.test(line))
    .slice(0, 8);
}

export function DownloadView() {
  const { isKhmer, localePath } = useLanguage();
  const site = useSiteCopy();
  const copy = site.download;
  const [releases, setReleases] = useState<GitHubRelease[]>(FALLBACK_RELEASES);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.timestamp && Date.now() - parsed.timestamp < CACHE_TTL_MS && Array.isArray(parsed.data) && parsed.data.length > 0) {
            if (!cancelled) setReleases(parsed.data);
            return;
          }
        }
      } catch {
        // Unreadable cache: fetch fresh.
      }

      try {
        const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases`, {
          headers: { Accept: "application/vnd.github.v3+json" },
        });
        if (!res.ok) return;
        const data: GitHubRelease[] = await res.json();
        if (!Array.isArray(data) || data.length === 0 || cancelled) return;
        setReleases(data);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
        } catch {
          // Storage full or blocked: the page still works from memory.
        }
      } catch {
        // Offline or rate limited: keep the bundled release list.
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const latest = releases.find((release) => !release.prerelease && release.assets.length > 0) ?? releases[0];
  const version = latest.tag_name.replace(/^v/, "");
  const date = new Date(latest.published_at).toLocaleDateString(isKhmer ? "km-KH" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const rows = latest.assets
    .map((asset: ReleaseAsset) => ({ asset, info: describeAsset(asset.name) }))
    .filter((row): row is { asset: ReleaseAsset; info: NonNullable<ReturnType<typeof describeAsset>> } => row.info !== null)
    .sort((a, b) => a.info.order - b.info.order);
  const notes = releaseNotes(latest.body ?? "");
  const fill = (text: string) => text.replace("{version}", version).replace("{date}", date);
  const cell = "border-t border-studio-rail py-[18px] pr-6 align-baseline";
  const head = "pb-3 pr-6 text-left font-display text-[15px] font-normal text-studio-slate";

  return (
    <SiteShell>
      <section className={`${container} flex flex-col gap-5 pt-14`}>
        <h1 className={pageTitle}>{copy.title}</h1>
        <p className={`${lead} max-w-[34em]`}>{fill(copy.lead)}</p>
      </section>

      <section className={`${container} pt-14`}>
        <div className="overflow-x-auto border-t-[1.5px] border-studio-ink pt-5">
          <table className="w-full min-w-[680px] border-collapse">
            <thead>
              <tr>
                <th scope="col" className={head}>{copy.computer}</th>
                <th scope="col" className={head}>{copy.installer}</th>
                <th scope="col" className={head}>{copy.size}</th>
                <th scope="col" className={`${head} pr-0`}>
                  <span className="sr-only">{copy.get}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ asset, info }) => (
                <tr key={asset.name}>
                  <th scope="row" className={`${cell} whitespace-nowrap text-left font-display text-[19px] font-medium`}>
                    {copy.platforms[info.platform]}
                  </th>
                  <td className={`${cell} text-studio-body`}>{copy.kinds[info.kind]}</td>
                  <td className={`${cell} whitespace-nowrap tabular-nums text-studio-body`}>{formatSize(asset.size)}</td>
                  <td className={`${cell} whitespace-nowrap pr-0 text-right font-display text-[17px]`}>
                    <a href={asset.browser_download_url} aria-label={`${copy.get} ${asset.name}`} className={textLink}>
                      {copy.get}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-5 text-base text-studio-slate">{copy.macHint}</p>
      </section>

      <section className={`${container} flex flex-wrap gap-x-[72px] gap-y-10 pb-28 pt-[104px]`}>
        <div className="flex min-w-0 flex-[1_1_360px] flex-col items-start gap-5">
          <h2 className={h2}>{copy.studioTitle}</h2>
          <p className={`${body} max-w-[28em]`}>{copy.studioBody}</p>
          <Link href={localePath("/editor")} className={btnPrimary}>
            {site.nav.openStudio}
          </Link>
        </div>
        <div className="flex min-w-0 flex-[1.2_1_440px] flex-col gap-4">
          {notes.length > 0 && (
            <>
              <h2 className={h2}>{fill(copy.newTitle)}</h2>
              <ul className="border-b border-studio-rail">
                {notes.map((note) => (
                  <li key={note} className="border-t border-studio-rail py-3.5">
                    {note}
                  </li>
                ))}
              </ul>
            </>
          )}
          <p className="font-display text-[17px]">
            <a href={`${GITHUB_URL}/releases`} target="_blank" rel="noreferrer" className={textLink}>
              {copy.older}
            </a>
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
