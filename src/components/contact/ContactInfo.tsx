"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, Check, Copy, Sparkles } from "lucide-react";

export function ContactInfo() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("ericva014@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 select-none">
      {/* 3D Curved Fluid Sculpture Asset for Contact (Opticore Style) */}
      <div className="relative w-full max-w-[420px] aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(251,113,133,0.2)] group backdrop-blur-2xl mx-auto lg:mx-0">
        <Image
          src="/liquid-contact.jpg"
          alt="3D Fluid Ribbon Sculpture"
          fill
          priority
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute bottom-4 left-4 p-3 rounded-2xl bg-black/60 border border-white/15 backdrop-blur-xl flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span className="text-xs font-mono text-white">DIRECT DIALOGUE // 24H SLA</span>
        </div>
      </div>

      {/* Direct Contact Card */}
      <div className="p-5 rounded-2xl bg-[#080d1a]/80 border border-white/10 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-rose-400">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-mono">Direct Developer Email</div>
            <div className="text-sm font-semibold text-white font-mono">ericva014@gmail.com</div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleCopyEmail}
          className="px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-slate-200 border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-rose-400" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-slate-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
