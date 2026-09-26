import { NextResponse, type NextRequest } from "next/server";
import { authConfigured, beginLogin, safeReturnTo, siteUrl } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const returnTo = safeReturnTo(req.nextUrl.searchParams.get("returnTo"));
  if (!authConfigured()) {
    return NextResponse.redirect(new URL(returnTo, siteUrl()));
  }
  return NextResponse.redirect(await beginLogin(returnTo));
}
