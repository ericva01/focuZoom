"use client";

import { useState } from "react";
import { useSiteCopy, container, h2, body, textLink, GITHUB_URL } from "@/components/site/ui";

const CONTACT_EMAIL = "ericva014@gmail.com";
const labelClass = "font-display text-[17px] font-medium";
const fieldClass =
  "min-h-[48px] w-full rounded-md border border-studio-slate bg-white px-3.5 py-2.5 font-serif text-[17px] text-studio-ink";
const errorClass = "text-base text-[#A32B1B]";

export function ContactSection() {
  const copy = useSiteCopy().about;
  const form = copy.form;
  const [data, setData] = useState({ name: "", email: "", topic: form.topics[0], message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!data.name.trim()) next.name = form.needName;
    if (!data.email.trim()) next.email = form.needEmail;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) next.email = form.badEmail;
    if (!data.message.trim()) next.message = form.needMessage;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    try {
      await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          _subject: `[FucuFlow Contact] ${data.topic} - ${data.name}`,
          message: data.message,
        }),
      });
      setSent(true);
    } catch {
      // The form service is unreachable: hand the message to the visitor's mail app instead.
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(data.topic)}&body=${encodeURIComponent(
        data.message
      )}`;
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className={`${container} flex flex-wrap gap-x-[72px] gap-y-12 pb-28 pt-[104px]`}>
      <div className="flex min-w-0 flex-[1_1_340px] flex-col gap-5">
        <h2 className={h2}>{copy.contactTitle}</h2>
        <p className={`${body} max-w-[26em]`}>{copy.contactLead}</p>
        <dl className="mt-2 border-b border-studio-line">
          <div className="border-t border-studio-line py-[18px]">
            <dt className="font-display text-xl font-medium">{copy.emailTitle}</dt>
            <dd className={`${body} mt-1`}>
              <a href={`mailto:${CONTACT_EMAIL}`} className={textLink}>
                {CONTACT_EMAIL}
              </a>
              <br />
              {copy.emailBody}
            </dd>
          </div>
          <div className="border-t border-studio-line py-[18px]">
            <dt className="font-display text-xl font-medium">{copy.discussTitle}</dt>
            <dd className={`${body} mt-1`}>
              {copy.discussBody}{" "}
              <a href={`${GITHUB_URL}/discussions`} target="_blank" rel="noreferrer" className={textLink}>
                {copy.discussLink}
              </a>
            </dd>
          </div>
        </dl>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex min-w-0 flex-[1.3_1_440px] flex-col gap-5">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-name" className={labelClass}>{form.name}</label>
            <input
              id="contact-name"
              type="text"
              autoComplete="name"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
              className={fieldClass}
            />
            {errors.name && <p id="contact-name-error" className={errorClass}>{errors.name}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-email" className={labelClass}>{form.email}</label>
            <input
              id="contact-email"
              type="email"
              autoComplete="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
              className={fieldClass}
            />
            {errors.email && <p id="contact-email-error" className={errorClass}>{errors.email}</p>}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-topic" className={labelClass}>{form.topic}</label>
          <select
            id="contact-topic"
            value={data.topic}
            onChange={(e) => setData({ ...data, topic: e.target.value })}
            className={fieldClass}
          >
            {form.topics.map((topic) => (
              <option key={topic}>{topic}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-message" className={labelClass}>{form.message}</label>
          <textarea
            id="contact-message"
            rows={6}
            value={data.message}
            onChange={(e) => setData({ ...data, message: e.target.value })}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
            className={`${fieldClass} resize-y leading-[1.5]`}
          />
          {errors.message && <p id="contact-message-error" className={errorClass}>{errors.message}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <button
            type="submit"
            disabled={sending}
            className="min-h-[48px] rounded-md bg-studio-ink px-6 font-display text-lg font-medium text-white transition-colors hover:bg-studio-deep disabled:opacity-60"
          >
            {sending ? form.sending : form.send}
          </button>
          <p role="status" className="min-w-0 flex-[1_1_240px] text-base text-studio-body">
            {sent ? form.sent : ""}
          </p>
        </div>
      </form>
    </section>
  );
}
