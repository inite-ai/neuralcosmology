import { NextResponse, type NextRequest } from "next/server";
import { siteUrl } from "@/lib/auth";
import { dbConfigured } from "@/lib/db";
import { setStatus } from "@/lib/subscribe";

export const dynamic = "force-dynamic";

const off = async (req: NextRequest) => {
  const t = req.nextUrl.searchParams.get("t") ?? "";
  return dbConfigured() && t ? setStatus(t, "unsubscribed") : null;
};

export async function GET(req: NextRequest) {
  const row = await off(req);
  return NextResponse.redirect(new URL(`/${row?.lang ?? "en"}/books?unsubscribed=${row ? 1 : 0}`, siteUrl()));
}

// Отписка кнопкой почтового клиента (RFC 8058, List-Unsubscribe-Post).
export async function POST(req: NextRequest) {
  await off(req);
  return new NextResponse(null, { status: 200 });
}
