import Link from "next/link";
import { Logo } from "@/components/common/Logo";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#030509] text-slate-300 text-sm relative z-10 select-none overflow-hidden">
      {/* Massive Bold Headline Banner from Reference Image: 'Transform Into Success' */}
      <div className="pt-16 pb-10 text-center relative">
        <div className="text-4xl sm:text-7xl lg:text-9xl font-extrabold tracking-tight text-white uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] max-w-7xl mx-auto px-4 leading-[0.9]">
          Transform Into Cinema
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-white/[0.06]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-4">
            <Link href="/">
              <Logo size="sm" />
            </Link>
            <span className="text-xs text-slate-500 font-mono hidden md:inline">
              {"// Autonomous Camera Post-Processing"}
            </span>
          </div>

          {/* Quick Nav Links */}
          <div className="flex items-center gap-6 text-xs text-slate-400 font-medium">
            <Link href="/editor" className="hover:text-white transition-colors">
              Studio Editor
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
            <a
              href="mailto:ericva014@gmail.com"
              className="text-rose-400 hover:text-rose-300 transition-colors font-mono"
            >
              ericva014@gmail.com
            </a>
          </div>

          {/* Privacy & Copyright */}
          <div className="text-xs text-slate-500 font-mono">
            © {new Date().getFullYear()} Glideo · Crafted by Eric Va
          </div>
        </div>
      </div>
    </footer>
  );
}
