import "server-only";
import { db, dbConfigured } from "@/lib/db";

// Покупка, подтверждённая сервером: глава после оплаты открылась (entitlement есть),
// значит покупка была. Шлём её в GA4 через Measurement Protocol один раз на
// пару (читатель, товар) — даже если у читателя блокировщик или вкладка закрылась
// до клиентского события. Клиент шлёт тот же transaction_id, GA4 склеивает дубли.
// Без GA_API_SECRET ничего не отправляется.

const MEASUREMENT_ID = "G-3QLFL17GG2";

export function purchaseTxId(userId: string, item: string): string {
  return `${item}-${userId.replace(/[^A-Za-z0-9]/g, "").slice(0, 12)}`;
}

/** client_id из cookie _ga (GA1.1.<rand>.<ts> → <rand>.<ts>), иначе случайный. */
export function clientIdFrom(gaCookie: string | undefined): string {
  const m = gaCookie?.match(/^GA\d\.\d\.(\d+\.\d+)$/);
  return m ? m[1] : `${Math.floor(Math.random() * 2 ** 31)}.${Math.floor(Date.now() / 1000)}`;
}

export async function recordPurchase(userId: string, item: string, value: number, currency: string, gaCookie?: string): Promise<void> {
  if (!dbConfigured()) return;
  try {
    const sql = await db();
    const fresh = await sql`INSERT INTO purchases_tracked (user_id, item) VALUES (${userId}, ${item}) ON CONFLICT DO NOTHING RETURNING item`;
    const secret = process.env.GA_API_SECRET;
    if (!fresh.length || !secret) return;
    const body = {
      client_id: clientIdFrom(gaCookie),
      user_id: userId,
      events: [{ name: "purchase", params: { transaction_id: purchaseTxId(userId, item), value, currency, items: [{ item_id: item, price: value }] } }],
    };
    const r = await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${secret}`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (!r.ok) console.error("[ga-server] mp", r.status);
  } catch (err) {
    console.error("[ga-server]", err instanceof Error ? err.message : err);
  }
}
