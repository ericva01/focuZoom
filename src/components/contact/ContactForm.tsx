"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { Send, CheckCircle2, Mail, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/Button";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setIsSubmitting(false);
    setIsSuccess(true);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#38bdf8", "#818cf8", "#c084fc", "#34d399"],
      });
    } catch {
      // ignore
    }
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
    <div className="relative rounded-2xl p-6 sm:p-8 glass-panel-elevated">
      {/* Success Confirmation View */}
      {isSuccess ? (
        <div className="py-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-400/30 text-sky-300 mx-auto flex items-center justify-center shadow-glass-md">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-white tracking-tight">Message Delivered</h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
              Thank you, <strong className="text-white">{formData.name}</strong>. Our engineering team has received your message regarding{" "}
              <span className="text-sky-300">&ldquo;{formData.subject}&rdquo;</span> and will respond to{" "}
              <span className="text-white font-mono">{formData.email}</span> shortly.
            </p>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="secondary"
              onClick={handleReset}
              className="w-full sm:w-auto"
            >
              Send Another Message
            </Button>

            <Link href="/editor" className="w-full sm:w-auto">
              <Button
                variant="primary"
                className="w-full sm:w-auto"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Go to Studio
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* Form View */
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div>
              <h2 className="text-lg font-semibold text-white tracking-tight">Send a Message</h2>
              <p className="text-xs text-slate-400">Fill out the details below and we will get right back to you.</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-sky-300">
              <Mail className="w-4 h-4" />
            </div>
          </div>

          {/* Name Field */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-xs font-mono font-medium text-slate-300 uppercase tracking-wider">
              Your Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Eric Va"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`glass-input w-full px-3.5 py-2.5 rounded-lg text-white text-xs placeholder-slate-500 ${
                errors.name ? "border-rose-400/60 focus:border-rose-400" : ""
              }`}
            />
            {errors.name && (
              <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-mono font-medium text-slate-300 uppercase tracking-wider">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="ericva014@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`glass-input w-full px-3.5 py-2.5 rounded-lg text-white text-xs placeholder-slate-500 ${
                errors.email ? "border-rose-400/60 focus:border-rose-400" : ""
              }`}
            />
            {errors.email && (
              <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Subject Options (Pills) */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-medium text-slate-300 uppercase tracking-wider">
              Message Subject
            </label>
            <div className="flex flex-wrap gap-2">
              {subjectOptions.map((opt) => {
                const isSelected = formData.subject === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFormData({ ...formData, subject: opt })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      isSelected
                        ? "bg-sky-500/25 text-sky-200 border border-sky-400/40 shadow-glass-sm"
                        : "bg-white/[0.04] text-slate-300 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="message" className="block text-xs font-mono font-medium text-slate-300 uppercase tracking-wider">
                Message
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {formData.message.length} chars
              </span>
            </div>
            <textarea
              id="message"
              rows={4}
              placeholder="Tell us what feature you'd like to see, or any questions about local video processing..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className={`glass-input w-full px-3.5 py-2.5 rounded-lg text-white text-xs placeholder-slate-500 resize-none ${
                errors.message ? "border-rose-400/60 focus:border-rose-400" : ""
              }`}
            />
            {errors.message && (
              <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.message}</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="w-full mt-2"
            leftIcon={<Send className="w-4 h-4" />}
          >
            Send Message
          </Button>
        </form>
      )}
    </div>
  );
}
