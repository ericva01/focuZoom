"use client";

import { useState } from "react";
import { Mail, Clock, User, ShieldCheck, Check, Copy } from "lucide-react";

export function ContactInfo() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("ericva014@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 select-none">
      <div className="space-y-3.5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md text-xs font-medium text-rose-200">
          <svg className="w-3.5 h-3.5 text-rose-400 fill-current" viewBox="0 0 24 24">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
          <span>Direct channels</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
          Let’s craft better video tools together.
        </h1>

        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Have a question about custom aspect ratios, GPU canvas performance, or feature suggestions? We’d love to hear from you.
        </p>
      </div>

      <div className="space-y-3.5 pt-2">
        {/* Email card with copy */}
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#080D1A]/70 border border-white/10 hover:border-rose-400/40 backdrop-blur-xl transition-all duration-300 flex items-center justify-between group">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-rose-400 group-hover:bg-rose-500/20 group-hover:border-rose-400/40 transition-all">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Direct Email</div>
              <div className="text-sm font-semibold text-white font-mono">ericva014@gmail.com</div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopyEmail}
            className="px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-slate-200 border border-white/10 hover:border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-rose-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* SLA Card */}
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#080D1A]/70 border border-white/10 backdrop-blur-xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-rose-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Response Time</div>
            <div className="text-sm font-medium text-white">Average response within 2 hours</div>
          </div>
        </div>

        {/* Creator Card */}
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#080D1A]/70 border border-white/10 backdrop-blur-xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-rose-400">
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Creator & Lead Developer</div>
            <div className="text-sm font-medium text-white">Eric Va</div>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-rose-950/20 border border-rose-500/20 backdrop-blur-xl flex items-start gap-3.5">
          <ShieldCheck className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="text-xs font-semibold text-white">Local-First Security Assurance</div>
            <p className="text-xs text-slate-300/80 leading-relaxed">
              When using Glideo, your recorded video frames are rendered 100% on your local device. No video assets are uploaded to any server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
