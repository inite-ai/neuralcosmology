"use client";
import { useState } from "react";
import type { Prefs } from "@/lib/account";

type Labels = { name: string; namePh: string; currency: string; notify: string; notifyAll: string; save: string; saved: string };

// Настройки читателя: имя в обсуждениях, валюта, письма о новых главах.
export default function AccountSettings({ initial, books, currencies, locale, labels }: {
  initial: Prefs;
  books: { slug: string; title: string }[];
  currencies: readonly string[];
  locale: string;
  labels: Labels;
}) {
  const [p, setP] = useState(initial);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const save = async () => {
    setState("saving");
    const r = await fetch("/api/account/prefs", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...p, lang: locale }) }).catch(() => null);
    setState(r?.ok ? "saved" : "error");
    if (r?.ok) window.dispatchEvent(new Event("nc-currency"));
  };
  const toggleBook = (slug: string) =>
    setP((x) => ({ ...x, notifyBooks: x.notifyBooks.includes(slug) ? x.notifyBooks.filter((s) => s !== slug) : [...x.notifyBooks, slug] }));
  const field = "w-full rounded-sm hairline bg-bg-raised px-4 py-3 text-base text-fg outline-none focus:border-primary";
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <label className="block">
        <span className="label text-muted mb-2 block">{labels.name}</span>
        <input className={field} maxLength={40} value={p.displayName ?? ""} placeholder={labels.namePh} onChange={(e) => setP({ ...p, displayName: e.target.value })} />
      </label>
      {currencies.length > 1 && (
        <label className="block">
          <span className="label text-muted mb-2 block">{labels.currency}</span>
          <select className={field} value={p.currency ?? ""} onChange={(e) => setP({ ...p, currency: e.target.value || null })}>
            <option value="">Auto</option>
            {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
      )}
      <div className="md:col-span-2">
        <label className="flex items-center gap-3">
          <input type="checkbox" className="h-4 w-4 accent-[var(--color-primary)]" checked={p.notify} onChange={(e) => setP({ ...p, notify: e.target.checked })} />
          <span>{labels.notify}</span>
        </label>
        {p.notify && (
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 pl-7">
            {books.map((b) => (
              <label key={b.slug} className="flex items-center gap-2 text-fg-secondary">
                <input type="checkbox" className="h-4 w-4" checked={p.notifyBooks.length === 0 || p.notifyBooks.includes(b.slug)} onChange={() => toggleBook(b.slug)} />
                {b.title}
              </label>
            ))}
            <span className="label text-muted self-center">{labels.notifyAll}</span>
          </div>
        )}
      </div>
      <div className="md:col-span-2 flex items-center gap-4">
        <button type="button" onClick={save} disabled={state === "saving"} className="inline-flex min-h-11 items-center rounded-sm bg-fg px-6 label text-bg hover:bg-primary disabled:opacity-60">
          {labels.save}
        </button>
        {state === "saved" && <span className="label text-primary">{labels.saved}</span>}
        {state === "error" && <span className="label text-[#f2a3a3]">Error</span>}
      </div>
    </div>
  );
}
