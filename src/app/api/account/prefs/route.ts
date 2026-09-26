import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { getPrefs, savePrefs } from "@/lib/account";
import { books } from "@/content/books";
import { CURRENCY_COOKIE, isCurrency } from "@/content/pricing";
import { clip, fail, json, noDb } from "@/lib/reader/http";

export const dynamic = "force-dynamic";

// GET → настройки читателя; PUT {displayName, currency, notify, notifyBooks} → сохранить.
export async function GET() {
  const session = await getSession();
  if (!session) return fail("unauthorized", 401);
  return noDb() ?? json(await getPrefs(session.sub));
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return fail("unauthorized", 401);
  const bad = noDb();
  if (bad) return bad;
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const name = clip(b.displayName, 40).replace(/[<>\u0000-\u001f​-‍]/g, "");
  const currency = isCurrency(b.currency) ? b.currency : null;
  const known = new Set(books.map((x) => x.slug));
  const notifyBooks = Array.isArray(b.notifyBooks) ? b.notifyBooks.filter((s): s is string => typeof s === "string" && known.has(s)) : [];
  const lang = typeof b.lang === "string" && /^(en|ru|pt|es)$/.test(b.lang) ? b.lang : null;
  const prefs = { displayName: name || null, currency, notify: b.notify === true, notifyBooks, lang };
  await savePrefs(session.sub, session.email, prefs);
  const res = json(prefs);
  if (currency) res.cookies.set(CURRENCY_COOKIE, currency, { path: "/", maxAge: 31536000, sameSite: "lax" });
  return res;
}
