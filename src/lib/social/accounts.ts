import "server-only";
import { getSession, siteUrl } from "@/lib/auth";
import { db } from "@/lib/db";
import { isAuthor } from "@/lib/reader/context";
import type { Network } from "@/lib/social/networks";
import { seal } from "@/lib/social/seal";

// Аккаунты автопостинга: подключает и настраивает только автор (AUTHOR_EMAILS).

export const DEFAULT_TZ: Record<string, string> = { ru: "Europe/Moscow", en: "America/New_York", pt: "America/Sao_Paulo", es: "America/Mexico_City" };

export const STATE_COOKIE = "nc_social_oauth";
/** Адрес возврата из окна Meta; его же прописывают в настройках приложения Meta. */
export const callbackUrl = (network: string) => `${siteUrl()}/api/admin/social/callback/${network}`;

export async function authorSession() {
  const s = await getSession();
  return isAuthor(s) ? s : null;
}

/** Новый аккаунт или новый токен для уже подключённого; язык и расписание при переподключении не трогаем. */
export async function saveAccount(a: { network: Network; id: string; name: string; lang: string; token: string; expiresAt?: Date | null; enabled?: boolean }) {
  const sql = await db();
  await sql`INSERT INTO social_accounts (network, external_id, name, lang, token, token_expires_at, tz, enabled)
    VALUES (${a.network}, ${a.id}, ${a.name}, ${a.lang}, ${seal(a.token)}, ${a.expiresAt ?? null}, ${DEFAULT_TZ[a.lang] ?? "UTC"}, ${a.enabled ?? true})
    ON CONFLICT (network, external_id) DO UPDATE SET name = EXCLUDED.name, token = EXCLUDED.token, token_expires_at = EXCLUDED.token_expires_at`;
}

export function validTz(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}
