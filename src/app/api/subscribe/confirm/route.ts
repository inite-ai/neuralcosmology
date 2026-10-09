import { NextResponse, type NextRequest } from "next/server";
import { siteUrl } from "@/lib/auth";
import { dbConfigured } from "@/lib/db";
import { setStatus } from "@/lib/subscribe";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const t = req.nextUrl.searchParams.get("t") ?? "";
  const row = dbConfigured() && t ? await setStatus(t, "confirmed") : null;
  return NextResponse.redirect(new URL(`/${row?.lang ?? "en"}/books?subscribed=${row ? 1 : 0}`, siteUrl()));
}
