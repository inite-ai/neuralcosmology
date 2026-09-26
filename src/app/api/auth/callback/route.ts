import { NextResponse, type NextRequest } from "next/server";
import { completeLogin, siteUrl } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const code = params.get("code");
  const state = params.get("state");
  if (!code || !state) {
    // Пользователь отменил вход или IdP вернул ошибку — просто возвращаем на сайт.
    return NextResponse.redirect(new URL("/", siteUrl()));
  }
  try {
    const returnTo = await completeLogin(code, state);
    return NextResponse.redirect(new URL(returnTo, siteUrl()));
  } catch (err) {
    console.error("[auth] callback failed:", err instanceof Error ? err.message : err);
    return NextResponse.redirect(new URL("/?auth=failed", siteUrl()));
  }
}
