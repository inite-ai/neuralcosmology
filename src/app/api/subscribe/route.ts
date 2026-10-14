import type { NextRequest } from "next/server";
import { isSupportedLocale } from "@/lib/get-locale";
import { clip, fail, json, noDb } from "@/lib/reader/http";
import { READ_PATH, subscribe, validEmail, type SubscribeKind } from "@/lib/subscribe";
import { getExperiment } from "@/lib/interactive";
import { getBookBySlug } from "@/content/books";
import { capiUser, sendCapi } from "@/lib/meta-capi";

export const dynamic = "force-dynamic";

// POST { email, lang, book?, source?, kind?, item?, to? } — подписка без аккаунта;
// kind later — прислать опыт item и его главу, kind unlock — ссылку, открывающую главу to.
// Не больше 5 попыток
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
  const source = clip(body.source, 40) || null;
  const kind: SubscribeKind = body.kind === "later" || body.kind === "unlock" ? body.kind : "confirm";
  const item = kind === "later" && getExperiment(clip(body.item, 60)) ? clip(body.item, 60) : null;
  const to = kind === "unlock" && READ_PATH.test(clip(body.to, 140)) ? clip(body.to, 140) : null;
  if ((kind === "later" && !item) || (kind === "unlock" && !to)) return fail("bad_request", 400);
  const status = await subscribe(email, lang, book, source, { kind, item, to });
  // Lead в Meta Conversions API — с тем же event_id, что у пикселя в браузере.
  const eventId = clip(body.event_id, 64);
  if (eventId) {
    const url = req.headers.get("referer");
    const user = capiUser(req.headers, (n) => req.cookies.get(n)?.value, url);
    await sendCapi({ name: "Lead", id: eventId, url, custom: { content_name: source ?? undefined, content_category: book ?? undefined } }, { ...user, email });
  }
  return json({ status });
}
