"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Download, Menu } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { DownloadModal } from "@/components/common/DownloadModal";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const links = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#process" },
  { label: "Projects", href: "/#workspace" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#030509]/90 backdrop-blur-xl">
      <a href="#main-content" className="website-skip-link">Skip to content</a>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Glideo home"><Logo size="md" /></Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-6 text-sm lg:flex">
          {links.map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined} className={`transition-colors hover:text-white ${pathname === link.href ? "text-rose-300" : "text-slate-400"}`}>{link.label}</Link>)}
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={() => setDownloadOpen(true)} className="hidden items-center gap-2 px-3 py-2 text-sm text-slate-400 transition-colors hover:text-white xl:inline-flex"><Download size={16} /> Download</button>
          <Link href="/editor" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-black transition-colors hover:bg-rose-100 sm:px-5 sm:text-sm">Open studio <ArrowUpRight size={16} /></Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild><button aria-label="Open navigation" className="rounded-lg p-2 text-slate-300 hover:bg-white/10 lg:hidden"><Menu size={22} /></button></SheetTrigger>
            <SheetContent className="flex w-[min(320px,100vw)] flex-col border-white/10 bg-[#080d18]">
              <SheetHeader><SheetTitle><Logo /></SheetTitle></SheetHeader>
              <nav aria-label="Mobile navigation" className="mt-8 flex flex-col gap-2">
                {links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-slate-300 hover:bg-white/5 hover:text-white">{link.label}</Link>)}
              </nav>
              <button onClick={() => { setOpen(false); setDownloadOpen(true); }} className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 py-3 text-sm"><Download size={16} /> Download desktop app</button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <DownloadModal isOpen={downloadOpen} onClose={() => setDownloadOpen(false)} />
    </header>
  );
}
