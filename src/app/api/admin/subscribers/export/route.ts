import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, dbConfigured } from "@/lib/db";
import { isAuthor } from "@/lib/reader/context";
import { act } from "@/lib/admin/guard";

export const dynamic = "force-dynamic";

// Ячейка, начинающаяся с = + - @, в таблице стала бы формулой.
const cell = (v: unknown) => {
  const s = String(v ?? "");
  return `"${(/^[=+\-@\t\r]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`;
};

export async function GET() {
  if (!isAuthor(await getSession())) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!dbConfigured()) return NextResponse.json({ error: "storage_unavailable" }, { status: 503 });
  const sql = await db();
  const rows = await sql`SELECT email, lang, book, source, created_at, confirmed_at FROM subscribers WHERE status = 'confirmed' ORDER BY confirmed_at DESC NULLS LAST`;
  await act("subscriber.export", `${rows.length}`);
  const head = ["email", "lang", "book", "source", "created_at", "confirmed_at"];
  const csv = [head.join(","), ...rows.map((r) => head.map((h) => cell(r[h] instanceof Date ? (r[h] as Date).toISOString() : r[h])).join(","))].join("\r\n");
  return new NextResponse("﻿" + csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="subscribers.csv"', "Cache-Control": "private, no-store" } });
}
