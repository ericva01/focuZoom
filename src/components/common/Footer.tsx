import Link from "next/link";
import { Code2, Shield } from "lucide-react";
import { Logo } from "@/components/common/Logo";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#090D16]/80 backdrop-blur-xl text-slate-300 text-sm relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="inline-block">
              <Logo size="sm" />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transform standard screen captures into high-impact cinematic videos with automatic zoom, camera easing, and studio frames. Built for creators and developers.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-white/[0.04] text-sky-300 border border-white/10 shadow-glass-inner">
                <Shield className="w-3.5 h-3.5 text-sky-400" />
                Zero Cloud Uploads
              </span>
            </div>
          </div>

          {/* Col 2: Product */}
          <div>
            <h4 className="text-white font-mono font-medium text-xs tracking-wider uppercase mb-3">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/editor" className="text-slate-400 hover:text-white transition-colors">
                  Web Studio Editor
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-slate-400 hover:text-white transition-colors">
                  Auto-Zoom Engine
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-slate-400 hover:text-white transition-colors">
                  Spring Physics Tracking
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-slate-400 hover:text-white transition-colors">
                  Canvas Stage Customizer
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h4 className="text-white font-mono font-medium text-xs tracking-wider uppercase mb-3">Resources</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-white transition-colors">
                  Feature Requests
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-slate-400 hover:text-white transition-colors">
                  Workflow Guide
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal */}
          <div>
            <h4 className="text-white font-mono font-medium text-xs tracking-wider uppercase mb-3">Legal & Privacy</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-white transition-colors">
                  Security Guarantee
                </Link>
              </li>
              <li className="text-slate-500 pt-2 text-[11px] leading-relaxed">
                All video decoding, animation rendering, and export operations execute 100% locally on your device.
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FocuFlow Studio. All rights reserved.</p>
          <div className="flex items-center gap-2 text-slate-400">
            <span>Crafted with modern classic glassmorphism</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
