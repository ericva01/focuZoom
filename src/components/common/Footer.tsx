"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import { Check, ArrowRight } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
    }, 2500);
  };

  return (
    <footer className="border-t border-[#E5E7EB] bg-white text-[#111318] select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-[#E5E7EB]">
          
          {/* Col 1: Brand & Newsletter */}
          <div className="col-span-2 md:col-span-4 space-y-4">
            <Link href="/" aria-label="FucuFlow home">
              <Logo size="md" theme="light" />
            </Link>
            <p className="text-xs text-[#667085] leading-relaxed max-w-sm">
              The modern video collaboration workspace. Record, auto-zoom, polish, and communicate with high-impact clarity. 100% free and open source.
            </p>

            <div className="pt-2">
              <p className="text-xs font-semibold text-[#111318] mb-2">Subscribe to product updates</p>
              {subscribed ? (
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
                  <Check size={14} className="text-emerald-600" />
                  <span>You’re subscribed to updates!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center gap-2 max-w-sm">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your work email"
                    required
                    className="w-full rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] px-3.5 py-2 text-xs text-[#111318] placeholder-[#667085] focus:outline-none focus:border-[#FF6B2C] focus:bg-white transition-colors"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-[#FF6B2C] hover:bg-[#E85A1F] text-white px-4 py-2 text-xs font-semibold shrink-0 transition-colors shadow-xs active:scale-95 cursor-pointer"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>

            <div className="pt-1">
              <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>All studio systems operational</span>
              </span>
            </div>
          </div>

          {/* Col 2: Product */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#111318]">Product</p>
            <ul className="space-y-2 text-xs text-[#667085]">
              <li><Link href="/product" className="hover:text-[#FF6B2C] transition-colors">Overview</Link></li>
              <li><Link href="/features" className="hover:text-[#FF6B2C] transition-colors">Features</Link></li>
              <li><Link href="/editor" className="hover:text-[#FF6B2C] transition-colors">Web Studio</Link></li>
              <li><Link href="/desktop" className="hover:text-[#FF6B2C] transition-colors">Desktop App</Link></li>
              <li><Link href="/open-source" className="hover:text-[#FF6B2C] transition-colors">Open Source (MIT)</Link></li>
              <li><Link href="/download" className="hover:text-[#FF6B2C] transition-colors">Downloads &amp; Releases</Link></li>
            </ul>
          </div>

          {/* Col 3: Solutions */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#111318]">Solutions</p>
            <ul className="space-y-2 text-xs text-[#667085]">
              <li><Link href="/solutions#engineering" className="hover:text-[#FF6B2C] transition-colors">Engineering Demos</Link></li>
              <li><Link href="/solutions#design" className="hover:text-[#FF6B2C] transition-colors">Design Critiques</Link></li>
              <li><Link href="/solutions#success" className="hover:text-[#FF6B2C] transition-colors">Customer Success</Link></li>
              <li><Link href="/solutions#standups" className="hover:text-[#FF6B2C] transition-colors">Async Standups</Link></li>
              <li><Link href="/solutions#sales" className="hover:text-[#FF6B2C] transition-colors">Sales Outreach</Link></li>
            </ul>
          </div>

          {/* Col 4: Resources */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#111318]">Resources</p>
            <ul className="space-y-2 text-xs text-[#667085]">
              <li><Link href="/resources" className="hover:text-[#FF6B2C] transition-colors">Documentation</Link></li>
              <li><Link href="/resources" className="hover:text-[#FF6B2C] transition-colors">Shortcuts</Link></li>
              <li><Link href="/about" className="hover:text-[#FF6B2C] transition-colors">About FucuFlow</Link></li>
              <li><Link href="/contact" className="hover:text-[#FF6B2C] transition-colors">Contact Us</Link></li>
              <li><a href="https://github.com/ericva01/focuZoom" target="_blank" rel="noreferrer" className="hover:text-[#FF6B2C] transition-colors">GitHub Repository</a></li>
            </ul>
          </div>

          {/* Col 5: Trust & Community */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#111318]">Trust &amp; Legal</p>
            <ul className="space-y-2 text-xs text-[#667085]">
              <li><Link href="/open-source" className="hover:text-[#FF6B2C] transition-colors">MIT License</Link></li>
              <li><Link href="/open-source" className="hover:text-[#FF6B2C] transition-colors">Privacy Architecture</Link></li>
              <li><Link href="/contact" className="hover:text-[#FF6B2C] transition-colors">Report an Issue</Link></li>
              <li><Link href="/contact" className="hover:text-[#FF6B2C] transition-colors">Security &amp; Audits</Link></li>
              <li><a href="https://github.com/ericva01/focuZoom/releases" target="_blank" rel="noreferrer" className="hover:text-[#FF6B2C] transition-colors">Changelog</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#667085]">
          <p>© {new Date().getFullYear()} FucuFlow. Built by Eric Va &amp; Contributors. 100% Free &amp; Open Source.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/ericva01/focuZoom"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#FF6B2C] transition-colors flex items-center gap-1.5"
              aria-label="GitHub Repository"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#FF6B2C] transition-colors flex items-center gap-1.5"
              aria-label="Twitter / X"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>X / Twitter</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
