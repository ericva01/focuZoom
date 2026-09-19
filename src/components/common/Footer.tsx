import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/common/Logo";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#030509] text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-7 py-16 sm:flex-row sm:items-center">
          <div><p className="mb-3 text-xs text-rose-300">YOUR NEXT GREAT DEMO STARTS HERE</p><h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Give your work its moment.</h2></div>
          <Link href="/editor" className="inline-flex shrink-0 items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition-colors hover:bg-rose-100">Open Glideo studio <ArrowUpRight size={17} /></Link>
        </div>
        <div className="flex flex-col justify-between gap-7 border-t border-white/10 py-8 md:flex-row md:items-center">
          <Link href="/" aria-label="Glideo home"><Logo size="sm" /></Link>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3 text-sm"><Link href="/editor" className="hover:text-white">Studio</Link><Link href="/about" className="hover:text-white">About</Link><Link href="/contact" className="hover:text-white">Contact</Link><a href="mailto:ericva014@gmail.com" className="hover:text-white">Say hello <span aria-hidden="true">↗</span></a></nav>
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} Glideo. Crafted by Eric Va.</p>
        </div>
      </div>
    </footer>
  );
}
