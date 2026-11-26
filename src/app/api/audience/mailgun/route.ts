import type { NextRequest } from "next/server";
import { readMailgunEvent } from "@inite/audience";
import { audience } from "@/lib/audience.server";

// Mailgun event webhook for mail.neuralcosmology.com: a permanent bounce, a spam
// complaint or Mailgun's unsubscribe puts the address on the shared stop list.
// Verified with the account's HTTP webhook signing key; anything else is ignored.

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const key = (process.env.MAILGUN_WEBHOOK_SIGNING_KEY ?? "").trim();
  if (!key) return new Response("not configured", { status: 503 });
  const event = readMailgunEvent(key, await req.json().catch(() => null));
  const a = await audience();
  if (event && a) await a.suppress(event.email, event.reason, event.detail).catch((e) => console.error("[audience] suppress failed:", e instanceof Error ? e.message : e));
  return new Response("ok");
}
