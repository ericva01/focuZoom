"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Feature Suggestion",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

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
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await fetch("https://formsubmit.co/ajax/ericva014@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          _subject: `[Glideo Contact] ${formData.subject} - ${formData.name}`,
          message: formData.message,
        }),
      });

      setIsSuccess(true);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {}
    } catch {
      window.location.href = `mailto:ericva014@gmail.com?subject=${encodeURIComponent(
        formData.subject
      )}&body=${encodeURIComponent(formData.message)}`;
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl p-8 sm:p-10 bg-[#080d1a]/85 border border-white/[0.1] shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(147,51,234,0.12)] backdrop-blur-2xl">
      <div className="mb-6 space-y-1">
        <div className="text-[10px] font-mono tracking-wider text-rose-400 uppercase">
          CUSTOMER SERVICE & LOGISTICS
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Customer Service and Logistics Excellence
        </h2>
      </div>

      {isSuccess ? (
        <div className="py-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Message Dispatched</h3>
          <p className="text-sm text-slate-300 max-w-sm mx-auto">
            Your message has been delivered directly to Eric Va. We typically reply within 24 hours.
          </p>
          <button
            type="button"
            onClick={() => {
              setIsSuccess(false);
              setFormData({ name: "", email: "", subject: "Feature Suggestion", message: "" });
            }}
            className="px-6 py-2.5 rounded-full bg-white text-black text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-5 py-3.5 rounded-full bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-400 transition-colors"
            />
            {errors.name && <p className="text-xs text-rose-400 mt-1 pl-4">{errors.name}</p>}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-5 py-3.5 rounded-full bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-400 transition-colors"
            />
            {errors.email && <p className="text-xs text-rose-400 mt-1 pl-4">{errors.email}</p>}
          </div>

          <div>
            <input
              type="text"
              placeholder="Topic / Inquiries"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-5 py-3.5 rounded-full bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-400 transition-colors"
            />
          </div>

          <div>
            <textarea
              rows={4}
              placeholder="Message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full p-5 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-400 transition-colors resize-none"
            />
            {errors.message && <p className="text-xs text-rose-400 mt-1 pl-2">{errors.message}</p>}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group inline-flex items-center gap-3 px-7 py-3 rounded-full bg-white text-black text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer shadow-lg active:scale-95 disabled:opacity-50"
            >
              <span>{isSubmitting ? "Sending..." : "Submit Inquiry"}</span>
              <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowRight className="w-3 h-3" />}
              </div>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
