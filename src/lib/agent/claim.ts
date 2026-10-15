import "server-only";

// Покупки, оформленные агентом на почту читателя (гостевой заказ
// neuralcosmology:<sha256(email)>), переходят на аккаунт, когда читатель
// входит с этой почтой и провайдер её подтвердил. Без этого купленная
// агентом книга не открылась бы: доступ проверяется по DID.
export async function claimGuestPurchases(sub: string, email: string): Promise<void> {
  const base = process.env.BILLING_API_URL;
  const apiKey = process.env.BILLING_API_KEY;
  if (!base || !apiKey) return;
  try {
    const res = await fetch(`${base}/v1/orders/claim-guest-purchases`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify({ userId: sub, email }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`billing ${res.status}`);
    const { claimed } = (await res.json()) as { claimed?: string[] };
    if (claimed?.length) console.log(`[claim] ${claimed.length} guest order(s) moved to ${sub.slice(0, 20)}`);
  } catch (err) {
    // Следующий вход попробует снова.
    console.error("[claim] failed:", err instanceof Error ? err.message : err);
  }
}
