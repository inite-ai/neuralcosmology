"use client";
import { useState } from "react";
import type { SupportedLocale } from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const field =
  "w-full rounded-sm hairline bg-bg-raised px-4 py-3 text-base text-fg placeholder:text-muted/70 outline-none transition-colors focus:border-primary disabled:opacity-50";

export default function ContactForm({ locale }: { locale: SupportedLocale }) {
  const f = getDict(locale).home.callToClarity.form;
  const [data, setData] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setData((d) => ({ ...d, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("send failed");
      setStatus("success");
      setData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Contact submit error:", err);
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-10 space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="label text-muted mb-2 block">{f.name}</span>
          <input name="name" type="text" autoComplete="name" value={data.name} onChange={onChange} placeholder={f.namePlaceholder} required disabled={submitting} className={field} />
        </label>
        <label className="block">
          <span className="label text-muted mb-2 block">{f.email}</span>
          <input name="email" type="email" autoComplete="email" inputMode="email" value={data.email} onChange={onChange} placeholder={f.emailPlaceholder} required disabled={submitting} className={field} />
        </label>
      </div>
      <label className="block">
        <span className="label text-muted mb-2 block">{f.message}</span>
        <textarea name="message" value={data.message} onChange={onChange} placeholder={f.messagePlaceholder} required disabled={submitting} rows={5} className={cn(field, "resize-y min-h-32")} />
      </label>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-11 items-center justify-center rounded-sm bg-fg px-6 label text-bg transition-colors hover:bg-primary disabled:opacity-60"
        >
          {submitting ? f.sending : f.submit}
        </button>
        <p className="text-sm text-muted">
          {f.directEmail}{" "}
          <a href="mailto:info@neuralcosmology.com" className="text-fg-secondary underline decoration-line underline-offset-4 hover:text-fg">
            info@neuralcosmology.com
          </a>
        </p>
      </div>
      <p role="status" aria-live="polite" className={cn("text-sm", status === "success" ? "text-primary" : "text-[#f2a3a3]")}>
        {status === "success" ? f.success : status === "error" ? f.error : ""}
      </p>
    </form>
  );
}
