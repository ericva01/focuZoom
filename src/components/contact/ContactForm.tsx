"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { Send, CheckCircle2, AlertCircle, ArrowRight, Mail, Loader2 } from "lucide-react";
import Link from "next/link";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [sentVia, setSentVia] = useState<"api" | "client">("api");

  const subjectOptions = [
    "General Inquiry",
    "Feature Request",
    "Bug Report",
    "Commercial License",
    "Sponsorship / Media",
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Please enter your name";
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Please write a message";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getMailtoUri = () => {
    const subject = encodeURIComponent(`[Glideo] ${formData.subject} - ${formData.name || "Inquiry"}`);
    const body = encodeURIComponent(
      `Hello Eric Va,\n\n${formData.message}\n\n---\nSender: ${formData.name}\nEmail: ${formData.email}\nTopic: ${formData.subject}\nSent via Glideo Contact Form`
    );
    return `mailto:ericva014@gmail.com?subject=${subject}&body=${body}`;
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#fb7185", "#818cf8", "#c084fc", "#34d399"],
      });
    } catch {
      // ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Send directly to Eric Va's email via FormSubmit AJAX service
      const response = await fetch("https://formsubmit.co/ajax/ericva014@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          _subject: `[Glideo] ${formData.subject} from ${formData.name}`,
          topic: formData.subject,
          message: formData.message,
          _captcha: "false",
          _template: "table",
        }),
      });

      const data = await response.json();
      if (response.ok && (data.success === "true" || data.success === true)) {
        setSentVia("api");
        setIsSuccess(true);
        triggerConfetti();
      } else {
        // Fallback to native email client
        setSentVia("client");
        window.location.href = getMailtoUri();
        setIsSuccess(true);
        triggerConfetti();
      }
    } catch (err) {
      console.warn("Direct submission network error, opening default email client:", err);
      setSentVia("client");
      window.location.href = getMailtoUri();
      setIsSuccess(true);
      triggerConfetti();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEmailClientDirectly = () => {
    if (!validate()) return;
    setSentVia("client");
    window.location.href = getMailtoUri();
    setIsSuccess(true);
    triggerConfetti();
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      subject: "General Inquiry",
      message: "",
    });
    setIsSuccess(false);
    setErrors({});
  };

  return (
    <div className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 bg-[#080D1A]/85 border border-white/15 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(251,113,133,0.08)] select-none">
      {/* Specular top border light */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {/* Success Confirmation View */}
      {isSuccess ? (
        <div className="py-10 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-400/30 text-rose-300 mx-auto flex items-center justify-center shadow-[0_0_25px_rgba(251,113,133,0.3)]">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-400/20 text-[11px] font-mono text-rose-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{sentVia === "api" ? "Delivered via Mail Gateway" : "Dispatched via Mail Client"}</span>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Message Sent</h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-white">{formData.name}</strong>. Your message regarding{" "}
              <span className="text-rose-300">&ldquo;{formData.subject}&rdquo;</span> has been sent to{" "}
              <span className="text-white font-mono underline">ericva014@gmail.com</span>. We typically respond within 2 hours to{" "}
              <span className="text-white font-mono">{formData.email}</span>.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={getMailtoUri()}
              className="rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-rose-300 hover:text-white border border-white/15 px-5 py-2.5 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Open in Mail App (Copy)</span>
            </a>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/15 px-5 py-2.5 text-xs font-medium transition-all cursor-pointer"
            >
              Send Another Note
            </button>
            <Link href="/editor">
              <button
                type="button"
                className="rounded-full bg-white text-black text-xs font-semibold px-6 py-2.5 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-slate-100 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Launch Studio</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="border-b border-white/10 pb-4 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Send a Direct Note</h2>
              <p className="text-xs text-slate-400 mt-1">
                Have an idea, bug report, or questions about in-browser video processing? Drop us a message.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-rose-300 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-400/20">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              <span>To: ericva014@gmail.com</span>
            </div>
          </div>

          {/* Form Fields: Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-medium text-slate-300 block">
                Your Name <span className="text-rose-400">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
                placeholder="e.g. Alex Rivera"
                className={`w-full bg-black/40 border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400/50 transition-colors ${
                  errors.name ? "border-rose-500/50" : "border-white/10"
                }`}
              />
              {errors.name && (
                <div className="flex items-center gap-1 text-[11px] text-rose-400">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-slate-300 block">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                placeholder="alex@domain.com"
                className={`w-full bg-black/40 border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400/50 transition-colors ${
                  errors.email ? "border-rose-500/50" : "border-white/10"
                }`}
              />
              {errors.email && (
                <div className="flex items-center gap-1 text-[11px] text-rose-400">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Subject Pills */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 block">Inquiry Topic</label>
            <div className="flex flex-wrap gap-1.5">
              {subjectOptions.map((subj) => (
                <button
                  key={subj}
                  type="button"
                  onClick={() => setFormData({ ...formData, subject: subj })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                    formData.subject === subj
                      ? "bg-rose-500/20 text-rose-200 border-rose-400/40 shadow-[0_0_15px_rgba(251,113,133,0.2)]"
                      : "bg-white/[0.04] text-slate-400 hover:text-white border-white/10"
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>
          </div>

          {/* Message Textarea */}
          <div className="space-y-1.5">
            <label htmlFor="message" className="text-xs font-medium text-slate-300 block">
              Message <span className="text-rose-400">*</span>
            </label>
            <textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={(e) => {
                setFormData({ ...formData, message: e.target.value });
                if (errors.message) setErrors({ ...errors, message: "" });
              }}
              placeholder="Tell us what feature you need, report an issue, or ask a question..."
              className={`w-full bg-black/40 border rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400/50 transition-colors ${
                errors.message ? "border-rose-500/50" : "border-white/10"
              }`}
            />
            {errors.message && (
              <div className="flex items-center gap-1 text-[11px] text-rose-400">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.message}</span>
              </div>
            )}
          </div>

          {/* Submit Action Cluster */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleOpenEmailClientDirectly}
              className="text-xs text-slate-400 hover:text-rose-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Or open in Mail Client (Gmail / Outlook)</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto rounded-full bg-white text-black text-xs font-semibold px-7 py-3 shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:bg-slate-100 hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Sending to ericva014@gmail.com...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
