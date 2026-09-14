"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Menu,
  Ratio,
  Sparkles,
  ShieldCheck,
  FileCode,
  Zap,
  User,
  Sliders,
  Download,
} from "lucide-react";

import { Logo } from "@/components/common/Logo";
import { DownloadModal } from "@/components/common/DownloadModal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function Navbar() {
  const pathname = usePathname();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

  const scrollToSection = (id: string) => {
    if (pathname === "/") {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 select-none">
      <div
        className={`w-full transition-all duration-300 ${
          scrolled
            ? "bg-[#060914]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* 1. Left: Twin-star Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 rounded-lg group"
          >
            <Logo size="md" />
          </Link>

          {/* 2. Center: Minimalist Navigation Links with Dropdowns */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-sm font-medium text-slate-300">
            {/* Features anchor link */}
            <Link
              href="/#features"
              onClick={() => scrollToSection("features")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Features
            </Link>

            {/* Saved Projects Hub */}
            <Link
              href="/#workspace"
              onClick={() => scrollToSection("workspace")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Projects
            </Link>

            {/* Templates Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-white transition-colors focus:outline-none cursor-pointer">
                <span>Templates</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56 bg-[#080D1A]/95 border-white/10 backdrop-blur-2xl">
                <DropdownMenuLabel className="text-xs text-slate-400 uppercase font-mono">Aspect Ratios</DropdownMenuLabel>
                <Link href="/editor">
                  <DropdownMenuItem className="cursor-pointer">
                    <Ratio className="w-3.5 h-3.5 mr-2 text-rose-400" />
                    <span>16:9 Landscape Screen</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/editor">
                  <DropdownMenuItem className="cursor-pointer">
                    <Ratio className="w-3.5 h-3.5 mr-2 text-rose-400" />
                    <span>9:16 TikTok / Reel</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/editor">
                  <DropdownMenuItem className="cursor-pointer">
                    <Ratio className="w-3.5 h-3.5 mr-2 text-emerald-400" />
                    <span>1:1 Square Presentation</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuLabel className="text-xs text-slate-400 uppercase font-mono">Presets</DropdownMenuLabel>
                <Link href="/editor">
                  <DropdownMenuItem className="cursor-pointer">
                    <Sparkles className="w-3.5 h-3.5 mr-2 text-purple-400" />
                    <span>3D Slant & Dolly Cam</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Docs Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-white transition-colors focus:outline-none cursor-pointer">
                <span>Docs</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-60 bg-[#080D1A]/95 border-white/10 backdrop-blur-2xl">
                <DropdownMenuLabel className="text-xs text-slate-400 uppercase font-mono">Documentation</DropdownMenuLabel>
                <Link href="/#how-it-works" onClick={() => scrollToSection("how-it-works")}>
                  <DropdownMenuItem className="cursor-pointer">
                    <Zap className="w-3.5 h-3.5 mr-2 text-amber-400" />
                    <span>Quickstart Guide (60s)</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/editor">
                  <DropdownMenuItem className="cursor-pointer">
                    <FileCode className="w-3.5 h-3.5 mr-2 text-rose-400" />
                    <span>Keyframe Timing API</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem className="cursor-pointer">
                  <ShieldCheck className="w-3.5 h-3.5 mr-2 text-emerald-400" />
                  <span>100% In-Browser Privacy</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Direct About link */}
            <Link
              href="/about"
              className={`transition-colors cursor-pointer ${pathname === "/about" ? "text-white font-semibold" : "hover:text-white"}`}
            >
              About
            </Link>

            {/* Direct Contact link */}
            <Link
              href="/contact"
              className={`transition-colors cursor-pointer ${pathname === "/contact" ? "text-white font-semibold" : "hover:text-white"}`}
            >
              Contact
            </Link>
          </nav>

          {/* 3. Right: Sign In + Crisp White Get Started Pill Button */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* User Profile / Sign In Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-2 cursor-pointer focus:outline-none"
                >
                  <span>Sign in</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-[#080D1A]/95 border-white/10 backdrop-blur-2xl">
                <div className="flex items-center gap-3 p-2.5">
                  <Avatar className="h-9 w-9 ring-1 ring-rose-400/40">
                    <AvatarImage src="/avatar.jpg" alt="Eric Va" />
                    <AvatarFallback>EV</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-xs text-white truncate">Eric Va</span>
                    <span className="text-[11px] text-slate-400 font-mono truncate">ericva014@gmail.com</span>
                  </div>
                </div>

                <div className="px-2.5 py-1.5 mx-1 mb-1 rounded-lg bg-rose-500/10 border border-rose-400/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-rose-200">
                    Creator Community · 12,000+ creators
                  </span>
                </div>

                <DropdownMenuSeparator className="bg-white/10" />

                <Link href="/editor">
                  <DropdownMenuItem className="cursor-pointer">
                    <Sliders className="w-3.5 h-3.5 mr-2 text-rose-400" />
                    <span>Launch Studio</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/about">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="w-3.5 h-3.5 mr-2 text-rose-400" />
                    <span>About the Creator</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/contact">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="w-3.5 h-3.5 mr-2 text-slate-400" />
                    <span>Feedback & Inquiries</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Download Desktop App Button */}
            <button
              type="button"
              onClick={() => setDownloadModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-rose-400/35 text-slate-200 hover:text-white transition-all cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-rose-400" />
              <span>Download App</span>
            </button>

            {/* Signature Solid White Capsule Pill CTA */}
            <Link href="/editor">
              <button
                type="button"
                className="rounded-full bg-white text-black text-sm font-semibold px-5 sm:px-6 py-2 sm:py-2.5 shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:bg-slate-100 hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] transition-all duration-300 cursor-pointer active:scale-95"
              >
                Get Started
              </button>
            </Link>

            {/* Mobile Menu Hamburger */}
            <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Open mobile navigation menu"
                  className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-[#080D1A]/95 border-white/10 backdrop-blur-2xl flex flex-col justify-between">
                <div className="space-y-6 pt-4">
                  <SheetHeader className="text-left">
                    <SheetTitle>
                      <Logo size="sm" />
                    </SheetTitle>
                  </SheetHeader>

                  <div className="space-y-1">
                    <Link
                      href="/#features"
                      onClick={() => {
                        scrollToSection("features");
                        setMobileDrawerOpen(false);
                      }}
                      className="block px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:text-white hover:bg-white/[0.06] transition-colors"
                    >
                      Features
                    </Link>
                    <Link
                      href="/#how-it-works"
                      onClick={() => {
                        scrollToSection("how-it-works");
                        setMobileDrawerOpen(false);
                      }}
                      className="block px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:text-white hover:bg-white/[0.06] transition-colors"
                    >
                      How It Works
                    </Link>
                    <Link
                      href="/#workspace"
                      onClick={() => {
                        scrollToSection("workspace");
                        setMobileDrawerOpen(false);
                      }}
                      className="block px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:text-white hover:bg-white/[0.06] transition-colors"
                    >
                      Saved Projects
                    </Link>
                    <Link
                      href="/editor"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="block px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:text-white hover:bg-white/[0.06] transition-colors"
                    >
                      Studio Workspace
                    </Link>
                    <Link
                      href="/about"
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`block px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${pathname === "/about" ? "bg-white/[0.08] text-white font-semibold" : "text-slate-200 hover:text-white hover:bg-white/[0.06]"}`}
                    >
                      About
                    </Link>
                    <Link
                      href="/contact"
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`block px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${pathname === "/contact" ? "bg-white/[0.08] text-white font-semibold" : "text-slate-200 hover:text-white hover:bg-white/[0.06]"}`}
                    >
                      Contact
                    </Link>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 space-y-3">
                  <Link href="/editor" onClick={() => setMobileDrawerOpen(false)}>
                    <button className="w-full rounded-full bg-white text-black text-sm font-semibold py-2.5 shadow-lg hover:bg-slate-100 transition-all">
                      Get Started
                    </button>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      setDownloadModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-white text-xs font-semibold py-2.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-rose-400" />
                    <span>Download Desktop App</span>
                  </button>
                  <p className="text-center text-[11px] font-mono text-slate-400">
                    100% In-Browser & Offline Desktop Edition
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <DownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
      />
    </header>
  );
}
