"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, Check, Copy, MessageSquare, Bug, GitPullRequest } from "lucide-react";

export function ContactInfo() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("ericva014@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 select-none">
      {/* Brand Visual Card */}
      <div className="rounded-3xl border border-[#E5E7EB] bg-gradient-to-br from-[#FFF1E8] via-white to-[#F8F9FB] p-8 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF6B2C] bg-[#FFF1E8] px-3 py-1 rounded-full border border-[#FF6B2C]/20">
            CONNECT // DIRECT
          </span>
          <span className="text-xs font-mono text-[#667085]">24H RESPONSE</span>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-16 h-16 rounded-2xl bg-white shadow-sm border border-[#E5E7EB] p-2 flex items-center justify-center shrink-0">
            <Image
              src="/icon.png"
              alt="FucuFlow Icon"
              width={48}
              height={48}
              className="object-contain drop-shadow-[0_4px_10px_rgba(255,107,44,0.2)]"
            />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#111318]">FucuFlow Community</h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              Open communication channel with Eric Va and contributors.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#E5E7EB]">
          <div className="flex items-center gap-2.5 text-xs text-[#111318]">
            <MessageSquare size={15} className="text-[#FF6B2C] shrink-0" />
            <span>Feature suggestions & UI feedback</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-[#111318]">
            <Bug size={15} className="text-[#FF6B2C] shrink-0" />
            <span>Bug triage & desktop bridge questions</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-[#111318]">
            <GitPullRequest size={15} className="text-[#FF6B2C] shrink-0" />
            <span>Open source pull request reviews</span>
          </div>
        </div>
      </div>

      {/* Direct Developer Email Card */}
      <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#FFF1E8] border border-[#FF6B2C]/20 flex items-center justify-center text-[#FF6B2C]">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-[#667085] font-mono">Direct Developer Email</div>
            <div className="text-sm font-semibold text-[#111318] font-mono">ericva014@gmail.com</div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleCopyEmail}
          className="px-3.5 py-1.5 rounded-xl bg-[#F8F9FB] hover:bg-[#FFF1E8] text-xs font-mono text-[#111318] hover:text-[#FF6B2C] border border-[#E5E7EB] hover:border-[#FF6B2C]/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-[#FF6B2C]" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-[#667085]" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Community Links Card */}
      <div className="p-5 rounded-2xl bg-[#111318] text-white border border-[#111318] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-[#FF8A4C]" />
          <div>
            <div className="text-xs font-bold text-white">GitHub Discussions</div>
            <div className="text-[11px] text-slate-400">Join the public community debate</div>
          </div>
        </div>
        <a
          href="https://github.com/ericva01/focuZoom/discussions"
          target="_blank"
          rel="noreferrer"
          className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-[#FF6B2C] text-xs font-semibold text-white transition-all"
        >
          Visit Forum
        </a>
      </div>
    </div>
  );
}
