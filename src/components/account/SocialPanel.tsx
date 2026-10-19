"use client";
import { useCallback, useEffect, useState } from "react";

// Кабинет автопостинга: подключение аккаунтов, расписание, очередь цитат и журнал постов.

type Account = { id: string; network: string; name: string; lang: string; hour: number; tz: string; enabled: boolean; token_expires_at: string | null };
type Post = { id: string; account_id: string; slot: string; status: string; url: string | null; error: string | null; quote: string; updated_at: string };
type Queued = { share_id: string; quote: string };
type State = { accounts: Account[]; posts: Post[]; queue: Record<string, Queued[]>; threads: boolean; facebook: boolean };

export type SocialLabels = Record<
  | "connect" | "lang" | "botToken" | "botHint" | "channel" | "add" | "threads" | "facebook" | "notConfigured"
  | "accounts" | "none" | "hour" | "tz" | "on" | "postNow" | "remove" | "queue" | "skip" | "more" | "empty"
  | "log" | "noLog" | "posted" | "failed" | "unknown" | "sending" | "itPosted" | "notPosted" | "expires" | "connected",
  string
>;

const LANGS = ["ru", "en", "pt", "es"];
const field = "w-full rounded-sm hairline bg-bg-raised px-3 py-2 text-base text-fg outline-none focus:border-primary";
const btn = "inline-flex min-h-10 items-center rounded-sm hairline px-4 label hover:bg-fg hover:text-bg disabled:opacity-40";
const primary = "inline-flex min-h-11 items-center rounded-sm bg-fg px-6 label text-bg hover:bg-primary disabled:opacity-60";

export default function SocialPanel({ locale, labels: t, connected }: { locale: string; labels: SocialLabels; connected: string | null }) {
  const [s, setS] = useState<State | null>(null);
  const [lang, setLang] = useState(locale);
  const [tg, setTg] = useState({ token: "", channel: "" });
  const [busy, setBusy] = useState("");
  const [note, setNote] = useState(connected ? `${t.connected}: ${connected}` : "");

  const load = useCallback(async () => {
    const r = await fetch("/api/admin/social", { cache: "no-store" });
    if (r.ok) setS(await r.json());
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const act = async (key: string, body: Record<string, unknown>) => {
    setBusy(key);
    const r = await fetch("/api/admin/social", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).catch(() => null);
    const data = r ? await r.json().catch(() => ({})) : { error: "network" };
    setNote(data.error ? `Error: ${data.error}` : data.status ? (data.status === "nothing_to_post" ? t.empty : `${t[data.status as keyof SocialLabels] ?? data.status}`) : data.name ? `${t.connected}: ${data.name}` : "");
    setBusy("");
    await load();
    return r?.ok;
  };

  if (!s) return <p className="text-muted">…</p>;
  const nameOf = (id: string) => s.accounts.find((a) => a.id === id);

  return (
    <div className="grid gap-14">
      {note && <p className="label text-primary">{note}</p>}

      <section>
        <h2 className="font-display text-2xl mb-6">{t.connect}</h2>
        <label className="mb-6 block max-w-xs">
          <span className="label text-muted mb-2 block">{t.lang}</span>
          <select className={field} value={lang} onChange={(e) => setLang(e.target.value)}>
            {LANGS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="hairline p-5 grid gap-3 content-start">
            <p className="font-display text-xl">Telegram</p>
            <p className="text-sm text-muted">{t.botHint}</p>
            <input className={field} type="password" autoComplete="off" placeholder={t.botToken} value={tg.token} onChange={(e) => setTg({ ...tg, token: e.target.value })} />
            <input className={field} placeholder={t.channel} value={tg.channel} onChange={(e) => setTg({ ...tg, channel: e.target.value })} />
            <button type="button" className={primary} disabled={!tg.token || !tg.channel || busy === "tg"}
              onClick={async () => (await act("tg", { action: "telegram", lang, ...tg })) && setTg({ token: "", channel: "" })}>
              {t.add}
            </button>
          </div>
          {(["threads", "facebook"] as const).map((n) => (
            <div key={n} className="hairline p-5 grid gap-3 content-start">
              <p className="font-display text-xl">{n === "threads" ? "Threads" : "Facebook"}</p>
              <p className="text-sm text-muted">{t[n]}</p>
              {s[n] ? (
                <a className={primary} href={`/api/admin/social/connect/${n}?${new URLSearchParams({ lang, ui: locale })}`}>{t.add}</a>
              ) : (
                <p className="text-sm text-muted">{t.notConfigured}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-6">{t.accounts}</h2>
        {s.accounts.length === 0 ? <p className="text-muted">{t.none}</p> : (
          <ul className="rule-t">
            {s.accounts.map((a) => (
              <li key={a.id} className="rule-b py-4 grid gap-3 md:grid-cols-[1.4fr_5rem_5rem_10rem_auto_auto] md:items-center">
                <div>
                  <p className="font-display text-lg">{a.name}</p>
                  <p className="label text-muted">
                    {a.network}
                    {a.token_expires_at && ` · ${t.expires} ${new Date(a.token_expires_at).toLocaleDateString(locale)}`}
                  </p>
                </div>
                <select className={field} value={a.lang} onChange={(e) => act(`u${a.id}`, { action: "update", id: a.id, lang: e.target.value })}>
                  {LANGS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
                <input className={field} type="number" min={0} max={23} aria-label={t.hour} defaultValue={a.hour}
                  onBlur={(e) => Number(e.target.value) !== a.hour && act(`u${a.id}`, { action: "update", id: a.id, hour: Number(e.target.value) })} />
                <input className={field} aria-label={t.tz} defaultValue={a.tz}
                  onBlur={(e) => e.target.value !== a.tz && act(`u${a.id}`, { action: "update", id: a.id, tz: e.target.value.trim() })} />
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4" checked={a.enabled} onChange={(e) => act(`u${a.id}`, { action: "update", id: a.id, enabled: e.target.checked })} />
                  <span className="label">{t.on}</span>
                </label>
                <div className="flex gap-2">
                  <button type="button" className={btn} disabled={!!busy} onClick={() => act(`p${a.id}`, { action: "post", id: a.id, nonce: crypto.randomUUID() })}>{t.postNow}</button>
                  <button type="button" className={btn} disabled={!!busy} onClick={() => act(`r${a.id}`, { action: "remove", id: a.id })}>{t.remove}</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-sm text-muted">{t.hour} · {t.tz}</p>
      </section>

      {Object.keys(s.queue).length > 0 && (
        <section>
          <h2 className="font-display text-2xl mb-6">{t.queue}</h2>
          {Object.entries(s.queue).map(([l, items]) => (
            <div key={l} className="mb-8">
              <div className="mb-3 flex items-center gap-4">
                <span className="label">{l}</span>
                <button type="button" className={btn} disabled={!!busy} onClick={() => act(`f${l}`, { action: "refill", lang: l })}>{busy === `f${l}` ? "…" : t.more}</button>
              </div>
              {items.length === 0 ? <p className="text-muted">{t.empty}</p> : (
                <ul className="rule-t">
                  {items.map((q) => (
                    <li key={q.share_id} className="rule-b py-3 grid gap-3 md:grid-cols-[1fr_auto] md:items-start">
                      <a href={`/${l}/q/${q.share_id}`} className="font-display text-lg leading-snug hover:text-primary">{q.quote}</a>
                      <button type="button" className={btn} disabled={!!busy} onClick={() => act(`s${q.share_id}`, { action: "skip", shareId: q.share_id })}>{t.skip}</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      <section>
        <h2 className="font-display text-2xl mb-6">{t.log}</h2>
        {s.posts.length === 0 ? <p className="text-muted">{t.noLog}</p> : (
          <ul className="rule-t">
            {s.posts.map((p) => (
              <li key={p.id} className="rule-b py-3 grid gap-2 md:grid-cols-[12rem_1fr_auto] md:items-start">
                <p className="label text-muted">
                  {nameOf(p.account_id)?.name ?? "—"} · {p.slot.startsWith("manual:") ? new Date(p.updated_at).toLocaleDateString(locale) : p.slot}
                  <br />
                  <span className={p.status === "posted" ? "text-primary" : p.status === "unknown" ? "text-[#f2a3a3]" : ""}>{t[p.status as keyof SocialLabels] ?? p.status}</span>
                </p>
                <div>
                  <p className="text-fg-secondary">{p.quote.length > 160 ? `${p.quote.slice(0, 160)}…` : p.quote}</p>
                  {p.error && <p className="text-sm text-muted mt-1">{p.error}</p>}
                </div>
                <div className="flex gap-2">
                  {p.url && <a className={btn} href={p.url} target="_blank" rel="noopener noreferrer">↗</a>}
                  {p.status === "unknown" && (
                    <>
                      <button type="button" className={btn} onClick={() => act(`k${p.id}`, { action: "resolve", id: p.id, posted: true })}>{t.itPosted}</button>
                      <button type="button" className={btn} onClick={() => act(`k${p.id}`, { action: "resolve", id: p.id, posted: false })}>{t.notPosted}</button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
