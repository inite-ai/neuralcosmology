import "server-only";
import type { Session } from "@/lib/auth";
import type { LibraryChapter } from "@/lib/library";

// Кто что может читать.
//
//   free-глава (из demo-файла книги)  → всем, индексируется
//   остальное                          → после входа
//   PAYWALL_ENABLED=true               → после входа И покупки
//
// Покупка проверяется в INITE Billing: у пользователя должен быть активный
// entitlement `neuralcosmology:library` (вся библиотека) или
// `neuralcosmology:book:<slug>` (одна книга).

export type Gate = "open" | "login" | "purchase";

export const ENTITLEMENT_LIBRARY = "neuralcosmology:library";
export const entitlementForBook = (slug: string) => `neuralcosmology:book:${slug}`;

export function paywallEnabled(): boolean {
  return process.env.PAYWALL_ENABLED === "true";
}

interface Entitlement {
  key: string;
  status: string;
  expiresAt?: string | null;
}

const ENT_TTL_MS = 60_000;
const ENT_EMPTY_TTL_MS = 10_000;
const entCache = new Map<string, { at: number; keys: Set<string> }>();

async function entitlementKeys(userId: string, fresh = false): Promise<Set<string>> {
  const hit = entCache.get(userId);
  // Пустой набор держим недолго: только что купивший не должен ждать минуту.
  const ttl = hit && hit.keys.size > 0 ? ENT_TTL_MS : ENT_EMPTY_TTL_MS;
  if (!fresh && hit && Date.now() - hit.at < ttl) return hit.keys;
  // ?purchased=1 перечитывает права мимо кэша — но не чаще раза в 5 секунд,
  // чтобы ссылкой с этим параметром нельзя было долбить биллинг.
  if (fresh && hit && Date.now() - hit.at < 5_000) return hit.keys;

  const base = process.env.BILLING_API_URL;
  const apiKey = process.env.BILLING_API_KEY;
  if (!base || !apiKey) return new Set();

  try {
    const res = await fetch(`${base}/v1/entitlements/${encodeURIComponent(userId)}`, {
      headers: { "x-api-key": apiKey },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`billing ${res.status}`);
    const list = (await res.json()) as Entitlement[];
    const now = Date.now();
    const keys = new Set(
      list
        .filter((e) => e.status === "active")
        .filter((e) => !e.expiresAt || Date.parse(e.expiresAt) > now)
        .map((e) => e.key),
    );
    entCache.set(userId, { at: now, keys });
    return keys;
  } catch (err) {
    console.error("[access] entitlements lookup failed:", err instanceof Error ? err.message : err);
    // Биллинг недоступен — не открываем платное, но и не кэшируем отказ.
    return hit?.keys ?? new Set();
  }
}

export async function ownsBook(
  session: Session | null,
  slug: string,
  fresh = false,
): Promise<boolean> {
  if (!session) return false;
  if (!paywallEnabled()) return true;
  const keys = await entitlementKeys(session.sub, fresh);
  return keys.has(ENTITLEMENT_LIBRARY) || keys.has(entitlementForBook(slug));
}

export async function chapterGate(
  chapter: Pick<LibraryChapter, "free">,
  slug: string,
  session: Session | null,
  fresh = false,
): Promise<Gate> {
  if (chapter.free) return "open";
  // С пейволлом анониму честно показываем покупку (вход встроен в оплату);
  // без пейволла достаточно войти.
  if (!session) return paywallEnabled() ? "purchase" : "login";
  return (await ownsBook(session, slug, fresh)) ? "open" : "purchase";
}

/** Какой замок показывать закрытым главам в оглавлении. */
export async function lockedGate(slug: string, session: Session | null): Promise<Gate> {
  if (!session) return paywallEnabled() ? "purchase" : "login";
  return (await ownsBook(session, slug)) ? "open" : "purchase";
}
