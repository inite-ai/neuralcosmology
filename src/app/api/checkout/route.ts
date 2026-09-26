import { NextResponse, type NextRequest } from "next/server";
import { getSession, safeReturnTo, siteUrl } from "@/lib/auth";
import { getBookBySlug } from "@/content/books";
import { LIBRARY_ITEM, priceCodeFor } from "@/content/pricing";
import { ownsBook, paywallEnabled } from "@/lib/access";

export const dynamic = "force-dynamic";

// /api/checkout?item=<book-slug>|library&returnTo=/ru/read/...
// Создаёт checkout-сессию в INITE Billing от имени сервиса и отправляет
// читателя на страницу оплаты биллинга. После оплаты биллинг выдаёт
// entitlement и возвращает на returnTo с ?purchased=1.
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const item = params.get("item") ?? "";
  const returnTo = safeReturnTo(params.get("returnTo"));
  const back = new URL(returnTo, siteUrl());

  if (item !== LIBRARY_ITEM && !getBookBySlug(item)) {
    return NextResponse.redirect(back);
  }

  const session = await getSession();
  if (!session) {
    const self = `/api/checkout?${new URLSearchParams({ item, returnTo })}`;
    return NextResponse.redirect(
      new URL(`/api/auth/login?returnTo=${encodeURIComponent(self)}`, siteUrl()),
    );
  }

  // Уже куплено (или пейволл выключен) — второй раз не продаём.
  if (!paywallEnabled() || (item !== LIBRARY_ITEM && (await ownsBook(session, item, true)))) {
    return NextResponse.redirect(back);
  }

  const base = process.env.BILLING_API_URL;
  const apiKey = process.env.BILLING_API_KEY;
  if (!base || !apiKey) {
    console.error("[checkout] BILLING_API_URL / BILLING_API_KEY not set");
    return NextResponse.redirect(back);
  }

  const success = new URL(back);
  success.searchParams.set("purchased", "1");

  try {
    const res = await fetch(`${base}/v1/checkout/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify({
        priceCode: priceCodeFor(item),
        mode: "PAYMENT",
        userId: session.sub,
        successUrl: success.toString(),
        errorUrl: back.toString(),
        metadata: { source: "neuralcosmology.com", item, email: session.email },
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`billing ${res.status}: ${await res.text()}`);
    const { checkoutUrl } = (await res.json()) as { checkoutUrl?: string };
    if (!checkoutUrl) throw new Error("no checkoutUrl in billing response");
    return NextResponse.redirect(checkoutUrl);
  } catch (err) {
    console.error("[checkout] failed:", err instanceof Error ? err.message : err);
    return NextResponse.redirect(back);
  }
}
