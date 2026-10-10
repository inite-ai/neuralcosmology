import { createHash } from "node:crypto";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET → { uid } для вошедшего читателя, иначе { uid: null }. uid — хеш внутреннего id:
// GA4 берёт его как user_id (склеивает устройства), персональных данных в нём нет.
export async function GET() {
  const session = await getSession().catch(() => null);
  const uid = session ? createHash("sha256").update(`nc:${session.sub}`).digest("hex").slice(0, 32) : null;
  return Response.json({ uid }, { headers: { "Cache-Control": "private, no-store" } });
}
