import "server-only";
import { db, dbConfigured } from "@/lib/db";
import { ENTITLEMENT_LIBRARY } from "@/lib/access";

// Личный кабинет: настройки читателя и история покупок.

export type Prefs = { displayName: string | null; currency: string | null; notify: boolean; notifyBooks: string[]; lang?: string | null };
const EMPTY: Prefs = { displayName: null, currency: null, notify: false, notifyBooks: [] };

export async function getPrefs(userId: string): Promise<Prefs> {
  if (!dbConfigured()) return EMPTY;
  const sql = await db();
  const [r] = await sql`SELECT display_name, currency, notify, notify_books FROM reader_prefs WHERE user_id = ${userId}`;
  return r ? { displayName: r.display_name, currency: r.currency, notify: r.notify, notifyBooks: r.notify_books ?? [] } : EMPTY;
}

export async function savePrefs(userId: string, email: string | undefined, p: Prefs): Promise<void> {
  const sql = await db();
  await sql`INSERT INTO reader_prefs (user_id, email, display_name, currency, notify, notify_books, lang, updated_at)
    VALUES (${userId}, ${email ?? null}, ${p.displayName}, ${p.currency}, ${p.notify}, ${p.notifyBooks}, ${p.lang ?? null}, now())
    ON CONFLICT (user_id) DO UPDATE SET email = COALESCE(EXCLUDED.email, reader_prefs.email),
      display_name = EXCLUDED.display_name, currency = EXCLUDED.currency, notify = EXCLUDED.notify,
      notify_books = EXCLUDED.notify_books, lang = COALESCE(EXCLUDED.lang, reader_prefs.lang), updated_at = now()`;
}

export type Purchase = { item: string; at: string | null; status: string };

/** Что куплено и когда — по доступам (entitlements) в INITE Billing. */
export async function purchases(userId: string): Promise<Purchase[]> {
  const base = process.env.BILLING_API_URL;
  const key = process.env.BILLING_API_KEY;
  if (!base || !key) return [];
  try {
    const res = await fetch(`${base}/v1/entitlements/${encodeURIComponent(userId)}`, {
      headers: { "x-api-key": key },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const list = (await res.json()) as { key: string; status: string; createdAt?: string }[];
    return list
      .filter((e) => e.key === ENTITLEMENT_LIBRARY || e.key.startsWith("neuralcosmology:book:"))
      .map((e) => ({ item: e.key === ENTITLEMENT_LIBRARY ? "library" : e.key.slice("neuralcosmology:book:".length), at: e.createdAt ?? null, status: e.status }))
      .sort((a, b) => (b.at ?? "").localeCompare(a.at ?? ""));
  } catch {
    return [];
  }
}

/** Всё, что сайт хранит о читателе (для выгрузки и удаления). */
export const USER_TABLES = ["reading_progress", "annotations", "comment_reactions", "ai_usage", "reader_prefs"] as const;
// watermarks не удаляются: метка нужна, чтобы отследить утечку уже купленного текста.
