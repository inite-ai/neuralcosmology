import type { NextRequest } from "next/server";
import { isSupportedLocale } from "@/lib/get-locale";
import { clip, fail, json, noDb } from "@/lib/reader/http";
import { subscribe, validEmail } from "@/lib/subscribe";
import { getBookBySlug } from "@/content/books";

export const dynamic = "force-dynamic";

// POST { email, lang, book?, source? } — подписка без аккаунта. Не больше 5 попыток
// с одного адреса за 10 минут; поле company — ловушка для ботов.
const hits = new Map<string, number[]>();

export async function POST(req: NextRequest) {
  const blocked = noDb();
  if (blocked) return blocked;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 600_000);
  if (recent.length >= 5) return fail("rate_limited", 429);
  hits.set(ip, [...recent, now]);

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  if (clip(body.company, 100)) return json({ status: "sent" });
  const email = clip(body.email, 254).toLowerCase();
  if (!validEmail(email)) return fail("invalid_email", 400);
  const lang = isSupportedLocale(String(body.lang)) ? (String(body.lang) as "ru" | "en" | "pt" | "es") : "en";
  const bookSlug = clip(body.book, 60);
  const book = bookSlug && getBookBySlug(bookSlug) ? bookSlug : null;
  const status = await subscribe(email, lang, book, clip(body.source, 40) || null);
  return json({ status });
}
