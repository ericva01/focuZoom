"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function ContactForm() {
  const { t, isKhmer } = useLanguage();

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
    if (!formData.name.trim()) {
      newErrors.name = isKhmer ? "សូមបញ្ចូលឈ្មោះរបស់អ្នក" : "Please enter your name";
    }
    if (!formData.email.trim()) {
      newErrors.email = isKhmer ? "សូមបញ្ចូលអ៊ីមែលរបស់អ្នក" : "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = isKhmer ? "សូមបញ្ចូលអ៊ីមែលឱ្យបានត្រឹមត្រូវ" : "Please enter a valid email address";
    }
    if (!formData.message.trim()) {
      newErrors.message = isKhmer ? "សូមសរសេរសាររបស់អ្នក" : "Please write a message";
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
          _subject: `[FucuFlow Contact] ${formData.subject} - ${formData.name}`,
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
    <div className="rounded-3xl p-8 sm:p-10 bg-white border border-[#E5E7EB] shadow-xs">
      <div className="mb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider text-[#FF6B2C] uppercase bg-[#FFF1E8] px-3 py-1 rounded-full border border-[#FF6B2C]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2C]" />
          <span>{t.contactPage?.badge || (isKhmer ? "ការសាកសួរ & មតិកែលម្អ" : "INQUIRIES & FEEDBACK")}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111318] tracking-tight">
          {t.contactPage?.title || (isKhmer ? "ផ្ញើសារទៅកាន់ Eric Va" : "Send a Message to Eric Va")}
        </h2>
        <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
          {t.contactPage?.subtitle || (isKhmer
            ? "មានគំនិតសម្រាប់មុខងារថ្មី ជួបបញ្ហា Bug ឬចង់ពិភាក្សាអំពីផែនការអភិវឌ្ឍន៍? សូមផ្ញើសារខាងក្រោម។"
            : "Have an idea for a feature, encountered a bug, or want to discuss the roadmap? Drop a note below.")}
        </p>
      </div>

      {isSuccess ? (
        <div className="py-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FFF1E8] text-[#FF6B2C] border border-[#FF6B2C]/30 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-[#111318]">
            {isKhmer ? "សារត្រូវបានបញ្ជូនជោគជ័យ" : "Message Dispatched"}
          </h3>
          <p className="text-xs sm:text-sm text-[#667085] max-w-sm mx-auto leading-relaxed">
            {t.contactPage?.form?.sentSuccess || (isKhmer
              ? "សាររបស់អ្នកត្រូវបានបញ្ជូនផ្ទាល់ទៅកាន់ Eric Va។ ជាទូទៅយើងឆ្លើយតបក្នុងរយៈពេល ២៤ ម៉ោង។"
              : "Your message has been delivered directly to Eric Va. We typically reply within 24 hours.")}
          </p>
          <button
            type="button"
            onClick={() => {
              setIsSuccess(false);
              setFormData({ name: "", email: "", subject: "Feature Suggestion", message: "" });
            }}
            className="px-6 py-2.5 rounded-xl bg-[#111318] text-white text-xs font-bold hover:bg-[#22252e] transition-all cursor-pointer"
          >
            {isKhmer ? "ផ្ញើសារមួយទៀត" : "Send Another Message"}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#111318] mb-1.5">
              {t.contactPage?.form?.name || (isKhmer ? "ឈ្មោះរបស់អ្នក" : "Your Name")}
            </label>
            <input
              type="text"
              placeholder={t.contactPage?.form?.namePlaceholder || (isKhmer ? "Eric Va" : "Eric Va")}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-[#111318] placeholder-[#9CA3AF] text-sm focus:outline-none focus:border-[#FF6B2C] focus:bg-white transition-colors"
            />
            {errors.name && <p className="text-xs text-rose-500 mt-1 pl-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111318] mb-1.5">
              {t.contactPage?.form?.email || (isKhmer ? "អ៊ីមែលរបស់អ្នក" : "Your Email")}
            </label>
            <input
              type="email"
              placeholder={t.contactPage?.form?.emailPlaceholder || (isKhmer ? "you@example.com" : "you@example.com")}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-[#111318] placeholder-[#9CA3AF] text-sm focus:outline-none focus:border-[#FF6B2C] focus:bg-white transition-colors"
            />
            {errors.email && <p className="text-xs text-rose-500 mt-1 pl-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111318] mb-1.5">
              {t.contactPage?.form?.category || (isKhmer ? "ប្រធានបទ / សំណើសុំ" : "Topic / Subject")}
            </label>
            <input
              type="text"
              placeholder={isKhmer ? "សំណើមុខងារថ្មី, រាយការណ៍កំហុស Bug, ល។" : "Feature Suggestion, Bug Report, etc."}
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-[#111318] placeholder-[#9CA3AF] text-sm focus:outline-none focus:border-[#FF6B2C] focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111318] mb-1.5">
              {t.contactPage?.form?.message || (isKhmer ? "ខ្លឹមសារសារ" : "Message")}
            </label>
            <textarea
              rows={4}
              placeholder={t.contactPage?.form?.messagePlaceholder || (isKhmer ? "រៀបរាប់ពីសំណូមពរ ឬសាររបស់អ្នកឱ្យបានលម្អិត..." : "Describe your suggestion or message in detail...")}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full p-4 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-[#111318] placeholder-[#9CA3AF] text-sm focus:outline-none focus:border-[#FF6B2C] focus:bg-white transition-colors resize-none"
            />
            {errors.message && <p className="text-xs text-rose-500 mt-1 pl-1">{errors.message}</p>}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FF6B2C] text-white text-xs font-bold hover:bg-[#E85A1F] transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
            >
              <span>{isSubmitting ? (isKhmer ? "កំពុងផ្ញើ..." : "Sending...") : (t.contactPage?.form?.sendBtn || (isKhmer ? "ផ្ញើសារ" : "Submit Inquiry"))}</span>
              {isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
