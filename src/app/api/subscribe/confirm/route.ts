import { NextResponse, type NextRequest } from "next/server";
import { siteUrl } from "@/lib/auth";
import { dbConfigured } from "@/lib/db";
import { READ_PATH, SUB_COOKIE, setStatus } from "@/lib/subscribe";

export const dynamic = "force-dynamic";

// Ссылка из письма: подтверждает адрес, кладёт в браузер cookie подписчика (ею
// открывается первая платная глава) и ведёт на главу to — или в библиотеку.
export async function GET(req: NextRequest) {
  const t = req.nextUrl.searchParams.get("t") ?? "";
  const to = req.nextUrl.searchParams.get("to") ?? "";
  const row = dbConfigured() && t ? await setStatus(t, "confirmed") : null;
  const target = row && READ_PATH.test(to) ? `${to}?unlocked=1` : `/${row?.lang ?? "en"}/books?subscribed=${row ? 1 : 0}`;
  const res = NextResponse.redirect(new URL(target, siteUrl()));
  if (row) res.cookies.set(SUB_COOKIE, t, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 });
  return res;
}
