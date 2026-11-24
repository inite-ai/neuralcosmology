import { type NextRequest, NextResponse } from "next/server";
import { auth, siteUrl } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Вход, выход, продление, back-channel logout — @inite/auth. returnTo — прежнее имя
// параметра на этом сайте; у выхода пакет знает только return_to.
const run = (req: NextRequest) => {
  const a = auth();
  if (!a) return NextResponse.redirect(new URL("/", siteUrl()));
  const back = req.nextUrl.searchParams.get("returnTo");
  if (!back || req.method !== "GET") return a.route.GET(req);
  const url = new URL(req.url);
  url.searchParams.set("return_to", back);
  return a.route.GET(new Request(url, { headers: req.headers }));
};
export const GET = run;
export const POST = run;
