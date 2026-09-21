"use client";

import Link from "next/link";
import { Logo } from "@/components/common/Logo";

export function Footer() {
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
              The modern video collaboration workspace. Record, polish, share, and communicate with high-impact clarity.
            </p>

            <div className="pt-2">
              <p className="text-xs font-semibold text-[#111318] mb-2">Subscribe to product updates</p>
              <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your work email"
                  className="w-full rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] px-3.5 py-2 text-xs text-[#111318] placeholder-[#667085] focus:outline-none focus:border-[#FF6B2C]"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[#FF6B2C] hover:bg-[#E85A1F] text-white px-4 py-2 text-xs font-semibold shrink-0 transition-colors shadow-xs"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

          {/* Col 2: Product */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#111318]">Product</p>
            <ul className="space-y-2 text-xs text-[#667085]">
              <li><Link href="/product" className="hover:text-[#FF6B2C] transition-colors">Overview</Link></li>
              <li><Link href="/features" className="hover:text-[#FF6B2C] transition-colors">Features</Link></li>
              <li><Link href="/editor" className="hover:text-[#FF6B2C] transition-colors">Screen Studio</Link></li>
              <li><Link href="/open-source" className="hover:text-[#FF6B2C] transition-colors">Open Source (MIT)</Link></li>
              <li><Link href="/desktop" className="hover:text-[#FF6B2C] transition-colors">Download App</Link></li>
            </ul>
          </div>

          {/* Col 3: Solutions */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#111318]">Solutions</p>
            <ul className="space-y-2 text-xs text-[#667085]">
              <li><Link href="/solutions" className="hover:text-[#FF6B2C] transition-colors">Engineering Demos</Link></li>
              <li><Link href="/solutions" className="hover:text-[#FF6B2C] transition-colors">Design Critiques</Link></li>
              <li><Link href="/solutions" className="hover:text-[#FF6B2C] transition-colors">Customer Success</Link></li>
              <li><Link href="/solutions" className="hover:text-[#FF6B2C] transition-colors">Async Standups</Link></li>
              <li><Link href="/solutions" className="hover:text-[#FF6B2C] transition-colors">Sales Outreach</Link></li>
            </ul>
          </div>

          {/* Col 4: Resources */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#111318]">Resources</p>
            <ul className="space-y-2 text-xs text-[#667085]">
              <li><Link href="/resources" className="hover:text-[#FF6B2C] transition-colors">Documentation</Link></li>
              <li><Link href="/resources" className="hover:text-[#FF6B2C] transition-colors">Shortcuts</Link></li>
              <li><Link href="/about" className="hover:text-[#FF6B2C] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[#FF6B2C] transition-colors">Contact</Link></li>
              <li><Link href="/contact" className="hover:text-[#FF6B2C] transition-colors">Community</Link></li>
            </ul>
          </div>

          {/* Col 5: Trust & Legal */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#111318]">Trust</p>
            <ul className="space-y-2 text-xs text-[#667085]">
              <li><Link href="/contact" className="hover:text-[#FF6B2C] transition-colors">Security & Trust</Link></li>
              <li><Link href="/about" className="hover:text-[#FF6B2C] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/about" className="hover:text-[#FF6B2C] transition-colors">Terms of Service</Link></li>
              <li><Link href="/about" className="hover:text-[#FF6B2C] transition-colors">System Status</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#667085]">
          <p>© {new Date().getFullYear()} FucuFlow Inc. All rights reserved. Crafted for high-impact teams.</p>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#FF6B2C] transition-colors" aria-label="GitHub">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#FF6B2C] transition-colors" aria-label="Twitter">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#FF6B2C] transition-colors" aria-label="LinkedIn">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
