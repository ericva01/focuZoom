"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ShieldCheck, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/common/Logo";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#features", label: "Features" },
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-3 sm:top-5 z-50 px-3 sm:px-6 w-full flex flex-col items-center pointer-events-none transition-all duration-300">
      {/* Floating Rounded Island Navbar */}
      <div
        className={`pointer-events-auto w-full max-w-4xl lg:max-w-5xl rounded-full transition-all duration-300 relative ${
          scrolled
            ? "bg-[#090D16]/90 shadow-[0_16px_48px_rgba(0,0,0,0.7),0_0_24px_rgba(56,189,248,0.18)] border-white/[0.18]"
            : "bg-[#090D16]/75 shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_18px_rgba(56,189,248,0.12)] border-white/[0.12]"
        } backdrop-blur-2xl border px-3 sm:px-5 py-2 flex items-center justify-between before:absolute before:inset-x-8 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:pointer-events-none`}
      >
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center pl-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-full">
          <Logo size="sm" />
        </Link>

        {/* Center: Desktop Navigation Links Pill Dock */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.04] p-1 rounded-full border border-white/[0.08] backdrop-blur-md shadow-glass-inner">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                  isActive
                    ? "text-white bg-white/[0.14] border border-white/20 shadow-glass-inner"
                    : "text-slate-300 hover:text-white hover:bg-white/[0.08]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Privacy badge */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-300 bg-white/[0.04] px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md shadow-glass-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono">100% In-Browser</span>
          </div>

          {/* Primary CTA */}
          <Link href="/editor">
            <Button
              variant="primary"
              size="sm"
              className="rounded-full !px-4 shadow-glass-glow-accent"
              rightIcon={<ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />}
            >
              Open Studio
            </Button>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="md:hidden w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Panel */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto md:hidden w-full max-w-4xl mt-2 rounded-2xl bg-[#090D16]/95 backdrop-blur-2xl border border-white/15 p-4 shadow-[0_20px_40px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "text-white bg-sky-500/20 border border-sky-400/30"
                      : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-2 mt-1 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="flex items-center gap-1.5 text-[11px] font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                Local GPU Processing
              </span>
              <span className="text-[11px] font-mono text-sky-300">v2.0</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
