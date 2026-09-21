"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Download, Menu } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { DownloadModal } from "@/components/common/DownloadModal";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const navLinks = [
  { label: "Product", href: "/product" },
  { label: "Features", href: "/features" },
  { label: "Solutions", href: "/solutions" },
  { label: "Open Source", href: "/open-source" },
  { label: "Resources", href: "/resources" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/90 backdrop-blur-md transition-colors duration-200">
      <a href="#main-content" className="website-skip-link">
        Skip to content
      </a>

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" aria-label="Glideo home" className="flex items-center gap-2">
          <Logo size="md" theme="light" />
        </Link>

        {/* Centered Navigation */}
        <nav aria-label="Main navigation" className="hidden items-center gap-8 text-sm font-medium lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
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
        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/ericva01/focuZoom"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#111318] border border-[#E5E7EB] rounded-xl hover:bg-[#F8F9FB] transition-colors md:inline-flex"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
            <span className="px-1.5 py-0.5 rounded bg-[#FFF1E8] text-[#FF6B2C] text-[10px] font-bold">★ Open Source</span>
          </a>

          <button
            type="button"
            onClick={() => setDownloadOpen(true)}
            className="hidden items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#111318] border border-[#E5E7EB] rounded-xl hover:bg-[#F8F9FB] transition-colors lg:inline-flex cursor-pointer shadow-xs active:scale-95"
          >
            <Download size={14} className="text-[#FF6B2C]" />
            <span>Download</span>
          </button>

          <Link
            href="/editor"
            className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B2C] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all duration-150 hover:bg-[#E85A1F] hover:shadow-[0_4px_14px_rgba(255,107,44,0.35)] active:scale-95"
          >
            <span>Launch Studio</span>
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
              <nav aria-label="Mobile navigation" className="mt-8 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-[#667085] transition-colors hover:bg-[#FFF1E8] hover:text-[#FF6B2C]"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/desktop"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-[#667085] transition-colors hover:bg-[#F8F9FB] hover:text-[#111318]"
                >
                  Log in to Workspace
                </Link>
              </nav>

              <div className="mt-auto space-y-2 pt-6">
                <Link
                  href="/editor"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6B2C] py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#E85A1F]"
                >
                  <span>Get Started Free</span>
                  <ArrowRight size={16} />
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    setDownloadOpen(true);
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] py-2.5 text-xs font-medium text-[#667085] hover:bg-[#F8F9FB]"
                >
                  <Download size={14} /> Download Desktop Client
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <DownloadModal isOpen={downloadOpen} onClose={() => setDownloadOpen(false)} />
    </header>
  );
}
