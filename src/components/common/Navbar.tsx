"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Download, Menu, LogIn, UserPlus } from "lucide-react";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/react";
import { Logo } from "@/components/common/Logo";
import { DownloadModal } from "@/components/common/DownloadModal";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const { t, localePath } = useLanguage();
  const hasClerkKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  const navLinks = [
    { label: t.nav.product, href: localePath("/product") },
    { label: t.nav.features, href: localePath("/features") },
    { label: t.nav.solutions, href: localePath("/solutions") },
    { label: t.nav.openSource, href: localePath("/open-source") },
    { label: t.nav.resources, href: localePath("/resources") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/90 backdrop-blur-md transition-colors duration-200">
      <a href="#main-content" className="website-skip-link">
        {t.nav.skipToContent}
      </a>

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href={localePath("/")} aria-label="FucuFlow home" className="flex items-center gap-2">
          <Logo size="md" theme="light" />
        </Link>

        {/* Centered Navigation */}
        <nav aria-label="Main navigation" className="hidden items-center gap-7 text-sm font-medium lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`transition-colors duration-150 ${
                  isActive
                    ? "text-[#FF6B2C] font-semibold"
                    : "text-[#667085] hover:text-[#111318]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <LanguageSwitcher variant="navbar" />

          {hasClerkKey && (
            <Suspense fallback={null}>
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button
                    aria-label="Sign In"
                    title="Sign In"
                    className="hidden items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#111318] border border-[#E5E7EB] rounded-xl hover:bg-[#F8F9FB] transition-colors sm:inline-flex cursor-pointer shadow-xs active:scale-95"
                  >
                    <LogIn size={14} className="text-[#667085]" />
                    <span>Sign In</span>
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button
                    aria-label="Sign Up"
                    title="Sign Up"
                    className="hidden items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#FF6B2C] border border-[#FF6B2C]/30 bg-[#FFF1E8] rounded-xl hover:bg-[#FFE6D8] transition-colors sm:inline-flex cursor-pointer shadow-xs active:scale-95"
                  >
                    <UserPlus size={14} className="text-[#FF6B2C]" />
                    <span>Sign Up</span>
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <div className="flex items-center gap-2">
                  <UserButton />
                </div>
              </Show>
            </Suspense>
          )}

          <Link
            href={localePath("/download")}
            className="hidden items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#111318] border border-[#E5E7EB] rounded-xl hover:bg-[#F8F9FB] transition-colors sm:inline-flex cursor-pointer shadow-xs active:scale-95"
          >
            <Download size={14} className="text-[#FF6B2C]" />
            <span>{t.nav.download}</span>
          </Link>

          <Link
            href={localePath("/desktop")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF6B2C] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all duration-150 hover:bg-[#E85A1F] hover:shadow-[0_4px_14px_rgba(255,107,44,0.35)] active:scale-95"
          >
            <span>{t.nav.launchApp}</span>
            <ArrowRight size={14} />
          </Link>

          {/* Mobile Navigation Trigger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Open navigation"
                className="rounded-xl border border-[#E5E7EB] p-2 text-[#667085] hover:bg-[#F8F9FB] hover:text-[#111318] lg:hidden"
              >
                <Menu size={20} />
              </button>
            </SheetTrigger>
            <SheetContent className="flex w-[min(320px,100vw)] flex-col border-[#E5E7EB] bg-white p-6">
              <SheetHeader>
                <SheetTitle>
                  <Logo theme="light" />
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6">
                <LanguageSwitcher variant="mobile" />
              </div>

              <nav aria-label="Mobile navigation" className="mt-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-[#667085] transition-colors hover:bg-[#FFF1E8] hover:text-[#FF6B2C]"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href={localePath("/desktop")}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-[#667085] transition-colors hover:bg-[#F8F9FB] hover:text-[#111318]"
                >
                  {t.nav.loginWorkspace}
                </Link>

                {hasClerkKey && (
                  <div className="pt-2 border-t border-[#E5E7EB] mt-2">
                    <Suspense fallback={null}>
                      <Show when="signed-out">
                        <div className="flex flex-col gap-2">
                          <SignInButton mode="modal">
                            <button
                              onClick={() => setOpen(false)}
                              aria-label="Sign In"
                              className="flex items-center gap-2.5 w-full text-left rounded-xl px-4 py-2.5 text-sm font-semibold text-[#111318] border border-[#E5E7EB] hover:bg-[#F8F9FB] transition-colors"
                            >
                              <LogIn size={15} className="text-[#667085]" />
                              <span>Sign In</span>
                            </button>
                          </SignInButton>
                          <SignUpButton mode="modal">
                            <button
                              onClick={() => setOpen(false)}
                              aria-label="Sign Up"
                              className="flex items-center gap-2.5 w-full text-left rounded-xl px-4 py-2.5 text-sm font-semibold text-[#FF6B2C] border border-[#FF6B2C]/30 bg-[#FFF1E8] hover:bg-[#FFE6D8] transition-colors"
                            >
                              <UserPlus size={15} className="text-[#FF6B2C]" />
                              <span>Sign Up</span>
                            </button>
                          </SignUpButton>
                        </div>
                      </Show>
                      <Show when="signed-in">
                        <div className="px-4 py-2 flex items-center gap-3">
                          <UserButton />
                          <span className="text-sm font-medium text-[#111318]">Account</span>
                        </div>
                      </Show>
                    </Suspense>
                  </div>
                )}
              </nav>

              <div className="mt-auto space-y-2 pt-6">
                <Link
                  href={localePath("/desktop")}
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6B2C] py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#E85A1F]"
                >
                  <span>{t.nav.launchApp}</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href={localePath("/download")}
                  onClick={() => setOpen(false)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] py-2.5 text-xs font-medium text-[#667085] hover:bg-[#F8F9FB] hover:text-[#111318]"
                >
                  <Download size={14} className="text-[#FF6B2C]" /> {t.nav.downloadClient}
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <DownloadModal isOpen={downloadOpen} onClose={() => setDownloadOpen(false)} />
    </header>
  );
}
