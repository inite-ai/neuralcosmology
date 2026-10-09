import "server-only";
import { createHash } from "node:crypto";
import { pixels } from "@/content/pixels";

// Meta Conversions API: серверный дубль событий пикселя. Браузер и сервер шлют одно
// событие с одним event_id, Meta склеивает их и не считает дважды; зато событие
// доходит и тогда, когда пиксель срезал блокировщик или ITP. Без META_CAPI_TOKEN
// ничего не отправляется. META_TEST_EVENT_CODE — для вкладки «Test events».

const GRAPH = "https://graph.facebook.com/v23.0";
const sha = (s: string) => createHash("sha256").update(s.trim().toLowerCase()).digest("hex");

export type CapiUser = { ip?: string; ua?: string; fbp?: string; fbc?: string; email?: string; externalId?: string };

/** IP, user agent и cookies пикселя из запроса; fbc собираем из fbclid, если cookie ещё нет. */
export function capiUser(h: Headers, cookie: (name: string) => string | undefined, url?: string | null): CapiUser {
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || undefined;
  let fbc = cookie("_fbc");
  if (!fbc && url) {
    try {
      const id = new URL(url).searchParams.get("fbclid");
      if (id) fbc = `fb.1.${Date.now()}.${id}`;
    } catch {}
  }
  return { ip, ua: h.get("user-agent") || undefined, fbp: cookie("_fbp"), fbc };
}

export type CapiEvent = { name: string; id: string; url?: string | null; custom?: Record<string, unknown> };

export async function sendCapi(ev: CapiEvent, user: CapiUser): Promise<void> {
  const token = process.env.META_CAPI_TOKEN;
  if (!token || !pixels.meta) return;
  const user_data: Record<string, unknown> = {
    client_ip_address: user.ip,
    client_user_agent: user.ua,
    fbp: user.fbp,
    fbc: user.fbc,
  };
  if (user.email) user_data.em = [sha(user.email)];
  if (user.externalId) user_data.external_id = [sha(user.externalId)];
  const test = process.env.META_TEST_EVENT_CODE;
  const body = {
    data: [{
      event_name: ev.name,
      event_time: Math.floor(Date.now() / 1000),
      event_id: ev.id,
      event_source_url: ev.url ?? undefined,
      action_source: "website",
      user_data,
      custom_data: ev.custom,
    }],
    ...(test ? { test_event_code: test } : {}),
  };
  try {
    const r = await fetch(`${GRAPH}/${pixels.meta}/events?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) console.error("[capi]", ev.name, r.status, (await r.text()).slice(0, 300));
  } catch (err) {
    console.error("[capi]", err instanceof Error ? err.message : err);
  }
}
