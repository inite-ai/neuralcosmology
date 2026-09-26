import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { isAuthor } from "@/lib/reader/context";
import { json, fail, noDb } from "@/lib/reader/http";

export const dynamic = "force-dynamic";

// POST {action: "like"|"unlike"|"hide"|"show"|"pin"|"unpin"|"delete"}
// like — любой вошедший; delete — автор комментария или автор книги; hide/show/pin — автор книги.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const blocked = noDb();
  if (blocked) return blocked;
  const session = await getSession();
  if (!session) return fail("unauthorized", 401);
  const { id } = await params;
  const { action } = (await req.json().catch(() => ({}))) as { action?: string };
  const sql = await db();
  const [c] = await sql`SELECT user_id FROM comments WHERE id = ${id}`;
  if (!c) return fail("not_found", 404);
  const moderator = isAuthor(session);
  switch (action) {
    case "like":
      await sql`INSERT INTO comment_reactions (comment_id, user_id) VALUES (${id}, ${session.sub}) ON CONFLICT DO NOTHING`;
      break;
    case "unlike":
      await sql`DELETE FROM comment_reactions WHERE comment_id = ${id} AND user_id = ${session.sub}`;
      break;
    case "delete":
      if (c.user_id !== session.sub && !moderator) return fail("forbidden", 403);
      await sql`DELETE FROM comments WHERE id = ${id}`;
      break;
    case "hide":
    case "show":
      if (!moderator) return fail("forbidden", 403);
      await sql`UPDATE comments SET status = ${action === "hide" ? "hidden" : "published"} WHERE id = ${id}`;
      break;
    case "pin":
    case "unpin":
      if (!moderator) return fail("forbidden", 403);
      await sql`UPDATE comments SET pinned = ${action === "pin"} WHERE id = ${id}`;
      break;
    default:
      return fail("bad_request", 400);
  }
  return json({ ok: true });
}
