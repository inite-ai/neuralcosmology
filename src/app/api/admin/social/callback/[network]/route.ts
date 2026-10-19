import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { siteUrl } from "@/lib/auth";
import { fail } from "@/lib/reader/http";
import { authorSession, callbackUrl, saveAccount, STATE_COOKIE } from "@/lib/social/accounts";
import { facebookPages, threadsExchange } from "@/lib/social/networks";

export const dynamic = "force-dynamic";

// Возврат из окна Meta: сверяем state, меняем код на токен, сохраняем аккаунт.
// Facebook отдаёт все страницы, которыми человек управляет; включена сразу только
// единственная, остальные автор включает в кабинете сам.
export async function GET(req: NextRequest, { params }: { params: Promise<{ network: string }> }) {
  const { network } = await params;
  if (!(await authorSession())) return fail("forbidden", 403);
  const [net, lang, ui, state] = (req.cookies.get(STATE_COOKIE)?.value || "").split(".");
  const got = req.nextUrl.searchParams.get("state") || "";
  const back = (result: string) => {
    const res = NextResponse.redirect(`${siteUrl()}/${ui || "ru"}/account/social?connected=${encodeURIComponent(result)}`);
    res.cookies.delete({ name: STATE_COOKIE, path: "/api/admin/social" });
    return res;
  };
  if (!state || net !== network || got.length !== state.length || !timingSafeEqual(Buffer.from(got), Buffer.from(state))) return back("bad_state");
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return back(req.nextUrl.searchParams.get("error") || "denied");
  try {
    if (network === "threads") {
      const a = await threadsExchange(code, callbackUrl(network));
      await saveAccount({ network: "threads", id: a.id, name: a.name, lang, token: a.token, expiresAt: a.expiresAt });
      return back(a.name);
    }
    if (network === "facebook") {
      const pages = await facebookPages(code, callbackUrl(network));
      if (!pages.length) return back("no_pages");
      for (const p of pages) await saveAccount({ network: "facebook", id: p.id, name: p.name, lang, token: p.token, enabled: pages.length === 1 });
      return back(pages.map((p) => p.name).join(", "));
    }
  } catch (e) {
    console.error(`[social] ${network} connect failed:`, e instanceof Error ? e.message : e);
    return back("failed");
  }
  return fail("not_found", 404);
}
