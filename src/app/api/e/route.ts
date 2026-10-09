import type { NextRequest } from "next/server";
import { capiUser, sendCapi } from "@/lib/meta-capi";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// POST { name, id, url, custom } — браузер дублирует сюда события пикселя, сервер
// пересылает их в Meta Conversions API с тем же event_id (components/analytics).
// Lead и Purchase сюда не идут: их шлют /api/subscribe и страница главы после оплаты,
// с почтой и суммой, которые знает только сервер.
const NAMES = new Set(["PageView", "ViewContent", "InitiateCheckout", "CompleteRegistration", "experiment_start", "video_play", "chapter_complete", "share"]);
const KEYS = ["value", "currency", "content_ids", "content_type", "item_id", "widget", "book", "chapter", "method"];
const hits = new Map<string, number[]>();

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  if (recent.length >= 60) return new Response(null, { status: 429 });
  hits.set(ip, [...recent, now]);
  if (hits.size > 5000) hits.clear();

  const b = (await req.json().catch(() => null)) as { name?: unknown; id?: unknown; url?: unknown; custom?: unknown } | null;
  const name = typeof b?.name === "string" ? b.name : "";
  const id = typeof b?.id === "string" ? b.id.slice(0, 64) : "";
  const url = typeof b?.url === "string" && b.url.startsWith("https://neuralcosmology.com") ? b.url.slice(0, 1000) : null;
  if (!NAMES.has(name) || !id || !url) return new Response(null, { status: 400 });

  const src = (b?.custom && typeof b.custom === "object" ? b.custom : {}) as Record<string, unknown>;
  const custom: Record<string, unknown> = {};
  for (const k of KEYS) {
    const v = src[k];
    if (typeof v === "number" || (typeof v === "string" && v.length <= 120)) custom[k] = v;
    else if (Array.isArray(v)) custom[k] = v.filter((x) => typeof x === "string").slice(0, 10);
  }

  const session = await getSession().catch(() => null);
  const user = capiUser(req.headers, (n) => req.cookies.get(n)?.value, url);
  if (session) Object.assign(user, { email: session.email, externalId: session.sub });
  await sendCapi({ name, id, url, custom }, user);
  return new Response(null, { status: 204 });
}
