import { type NextRequest, NextResponse } from "next/server";
import { auth, siteUrl } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Возврат из INITE: адрес общий для семьи. */
export const GET = (req: NextRequest) => auth()?.route.GET(req) ?? NextResponse.redirect(new URL("/", siteUrl()));
