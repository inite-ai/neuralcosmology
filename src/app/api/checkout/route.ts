import { NextResponse, type NextRequest } from "next/server";
import { getSession, safeReturnTo, siteUrl } from "@/lib/auth";
import { getBookBySlug } from "@/content/books";
import { CURRENCY_COOKIE, LIBRARY_ITEM, currencyFromAcceptLanguage, isCurrency, priceCodeFor, type Currency } from "@/content/pricing";
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

  // Валюта: выбор читателя (cookie) или язык браузера — как в компоненте цены.
  const picked = req.cookies.get(CURRENCY_COOKIE)?.value;
  const currency: Currency = isCurrency(picked) ? picked : currencyFromAcceptLanguage(req.headers.get("accept-language"));

  const success = new URL(back);
  success.searchParams.set("purchased", "1");
  success.searchParams.set("item", item);

  const create = (cur: Currency) =>
    fetch(`${base}/v1/checkout/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify({
        priceCode: priceCodeFor(item, cur),
        mode: "PAYMENT",
        userId: session.sub,
        successUrl: success.toString(),
        errorUrl: back.toString(),
        metadata: { source: "neuralcosmology.com", item, currency: cur, email: session.email },
      }),
      signal: AbortSignal.timeout(10_000),
    });

  try {
    let res = await create(currency);
    // Цены в этой валюте ещё нет в биллинге — продаём в долларах, а не теряем покупку.
    if (!res.ok && currency !== "USD") {
      console.error(`[checkout] ${currency} failed (${res.status}), falling back to USD`);
      res = await create("USD");
    }
    if (!res.ok) throw new Error(`billing ${res.status}: ${await res.text()}`);
    const { checkoutUrl } = (await res.json()) as { checkoutUrl?: string };
    if (!checkoutUrl) throw new Error("no checkoutUrl in billing response");
    return NextResponse.redirect(checkoutUrl);
  } catch (err) {
    console.error("[checkout] failed:", err instanceof Error ? err.message : err);
    return NextResponse.redirect(back);
  }
}
