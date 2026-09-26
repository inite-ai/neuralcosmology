import { NextResponse, type NextRequest } from "next/server";
import { logoutUrl } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  return NextResponse.redirect(await logoutUrl(req.nextUrl.searchParams.get("returnTo") ?? "/"));
}
