"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, Show, UserButton, ClerkLoaded, ClerkLoading, ClerkFailed } from "@clerk/react";
import { Logo } from "@/components/common/Logo";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteCopy, container, GITHUB_URL } from "@/components/site/ui";

const linkClass = "py-2.5 hover:text-studio-keydeep";
const currentClass = "py-2.5 underline decoration-studio-key decoration-2 underline-offset-8";

export function Navbar() {
  const pathname = usePathname() ?? "";
  const { t, localePath } = useLanguage();
  const copy = useSiteCopy().nav;

  const links = [
    { label: copy.features, path: "/features" },
    { label: copy.download, path: "/download" },
    { label: copy.about, path: "/about" },
  ];

  const signInLink = (
    <Link href={localePath("/sign-in")} className={linkClass}>
      {copy.signIn}
    </Link>
  );

  return (
    <header className="font-display">
      <a href="#main-content" className="website-skip-link">
        {t.nav.skipToContent}
      </a>
      <div className={`${container} flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-6`}>
        <Link href={localePath("/")} aria-label="FucuFlow home" className="flex min-h-[44px] items-center">
          <Logo size="md" />
        </Link>

        <nav aria-label={copy.main} className="flex flex-wrap items-center gap-x-7 gap-y-1 text-[17px]">
          {links.map((link) => {
            const current = pathname.includes(link.path);
            return (
              <Link
                key={link.path}
                href={localePath(link.path)}
                aria-current={current ? "page" : undefined}
                className={current ? currentClass : linkClass}
              >
                {link.label}
              </Link>
            );
          })}
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className={linkClass}>
            {copy.github}
          </a>

          <ClerkLoading>{signInLink}</ClerkLoading>
          <ClerkFailed>{signInLink}</ClerkFailed>
          <ClerkLoaded>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button type="button" className={linkClass}>
                  {copy.signIn}
                </button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </ClerkLoaded>

          <LanguageSwitcher variant="navbar" />

          <Link
            href={localePath("/editor")}
            className="inline-flex min-h-[44px] items-center rounded-md bg-studio-ink px-[18px] font-medium text-white transition-colors hover:bg-studio-deep"
          >
            {copy.openStudio}
          </Link>
        </nav>
      </div>
    </header>
  );
}
