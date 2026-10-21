import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { isSupportedLocale } from "@/lib/get-locale";
import { fail } from "@/lib/reader/http";
import { authorSession, callbackUrl, STATE_COOKIE } from "@/lib/social/accounts";
import { facebookAuthUrl, facebookConfigured, threadsAuthUrl, threadsConfigured } from "@/lib/social/networks";

export const dynamic = "force-dynamic";

// GET /api/admin/social/connect/{threads|facebook}?lang=ru&ui=ru → окно входа Meta.
// state живёт в cookie десять минут и сверяется в callback.

export async function GET(req: NextRequest, { params }: { params: Promise<{ network: string }> }) {
  const { network } = await params;
  if (!(await authorSession())) return fail("forbidden", 403);
  const lang = req.nextUrl.searchParams.get("lang") || "";
  const ui = req.nextUrl.searchParams.get("ui") || "ru";
  if (!isSupportedLocale(lang) || !isSupportedLocale(ui)) return fail("bad_request", 400);
  const state = randomBytes(18).toString("base64url");
  let url: string;
  if (network === "threads" && threadsConfigured()) url = threadsAuthUrl(callbackUrl(network), state);
  else if (network === "facebook" && facebookConfigured()) url = facebookAuthUrl(callbackUrl(network), state);
  else return fail("not_configured", 404);
  const res = NextResponse.redirect(url);
  res.cookies.set(STATE_COOKIE, [network, lang, ui, state].join("."), { httpOnly: true, secure: true, sameSite: "lax", maxAge: 600, path: "/api/admin/social" });
  return res;
}
