"use client";

import { useState } from "react";
import { Mail, Clock, User, ShieldCheck, Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/Button";

export function ContactInfo() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("ericva014@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="glass-badge text-sky-300 border-sky-400/20 bg-sky-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          <span>Direct Team Channels</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Let’s craft better video tools together.
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Have a question about custom aspect ratios, browser performance, or feature suggestions? We’d love to hear from you.
        </p>
      </div>

      <div className="space-y-3.5">
        {/* Email card with copy */}
        <div className="p-4 rounded-xl glass-panel-interactive flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/[0.06] border border-white/[0.12] flex items-center justify-center text-sky-300">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Direct Email</div>
              <div className="text-sm font-semibold text-white font-mono">ericva014@gmail.com</div>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopyEmail}
            leftIcon={copied ? <Check className="w-3.5 h-3.5 text-sky-300" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>

        {/* SLA Card */}
        <div className="p-4 rounded-xl glass-panel flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/[0.06] border border-white/[0.12] flex items-center justify-center text-sky-300">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Response SLA</div>
            <div className="text-sm font-medium text-white">Average response within 2 hours</div>
          </div>
        </div>

        {/* Creator Card */}
        <div className="p-4 rounded-xl glass-panel flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/[0.06] border border-white/[0.12] flex items-center justify-center text-sky-300">
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Creator & Lead Developer</div>
            <div className="text-sm font-medium text-white">Eric Va</div>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="p-4 rounded-xl glass-panel border-sky-500/20 bg-sky-950/20 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-sky-300 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="text-xs font-semibold text-white">Local-First Security Assurance</div>
            <p className="text-xs text-slate-300/80 leading-relaxed">
              When using FocuFlow Studio, your recorded video frames are rendered 100% on your local GPU & CPU. No video assets are uploaded to any server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
