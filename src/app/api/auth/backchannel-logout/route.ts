import { NextResponse, type NextRequest } from "next/server";
import { acceptLogoutToken } from "@/lib/auth";
import { dbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

// Адрес зарегистрирован у клиента neuralcosmology в INITE Auth как backchannel_logout_uri.
export async function POST(req: NextRequest) {
  const headers = { "Cache-Control": "no-store" };
  if (!dbConfigured()) return NextResponse.json({ error: "storage_unavailable" }, { status: 503, headers });
  const form = await req.formData().catch(() => null);
  const token = form?.get("logout_token");
  if (typeof token !== "string" || !(await acceptLogoutToken(token))) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400, headers });
  }
  return new NextResponse(null, { status: 200, headers });
}
