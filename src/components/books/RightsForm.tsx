"use client";
import { useState } from "react";
import type { SupportedLocale } from "@/lib/get-locale";
import type { RightsCopy } from "@/content/rights";
import { cn } from "@/lib/utils";

const field =
  "w-full rounded-sm hairline bg-bg-raised px-4 py-3 text-base text-fg placeholder:text-muted/70 outline-none transition-colors focus:border-primary disabled:opacity-50";

// Запрос прав: /api/contact с kind=rights. Поле company — ловушка для ботов,
// поэтому издательство называется publisher.
export default function RightsForm({
  locale,
  books,
  initialBook,
  copy,
}: {
  locale: SupportedLocale;
  books: { slug: string; title: string }[];
  initialBook: string;
  copy: RightsCopy["form"];
}) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "sending") return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, book: data.book === "all" ? "" : data.book, kind: "rights", lang: locale }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setState("sent");
    } catch {
      setState("failed");
    }
  }

  const busy = state === "sending";
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="label text-muted mb-2 block">{copy.name}</span>
          <input name="name" autoComplete="name" required maxLength={120} disabled={busy} className={field} />
        </label>
        <label className="block">
          <span className="label text-muted mb-2 block">{copy.email}</span>
          <input name="email" type="email" autoComplete="email" inputMode="email" required maxLength={254} disabled={busy} className={field} />
        </label>
      </div>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="nc-sub-trap" />
      <label className="block">
        <span className="label text-muted mb-2 block">{copy.publisher}</span>
        <input name="publisher" autoComplete="organization" maxLength={120} disabled={busy} className={field} />
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="label text-muted mb-2 block">{copy.book}</span>
          <select name="book" defaultValue={initialBook} disabled={busy} className={field}>
            <option value="all">{copy.allBooks}</option>
            {books.map((b) => (
              <option key={b.slug} value={b.slug}>{b.title}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="label text-muted mb-2 block">{copy.territory}</span>
          <input name="territory" maxLength={120} placeholder={copy.territoryHint} disabled={busy} className={field} />
        </label>
      </div>
      <label className="block">
        <span className="label text-muted mb-2 block">{copy.message}</span>
        <textarea name="message" rows={5} maxLength={8000} placeholder={copy.messageHint} disabled={busy} className={cn(field, "resize-y min-h-32")} />
      </label>
      <button
        type="submit"
        disabled={busy}
        className="inline-flex min-h-11 items-center justify-center rounded-sm bg-fg px-6 label text-bg transition-colors hover:bg-primary disabled:opacity-60"
      >
        {busy ? copy.sending : copy.send}
      </button>
      <p role="status" aria-live="polite" className={cn("text-sm", state === "sent" ? "text-primary" : "text-[#f2a3a3]")}>
        {state === "sent" ? copy.sent : state === "failed" ? copy.failed : ""}
      </p>
    </form>
  );
}
