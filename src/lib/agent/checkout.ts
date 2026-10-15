import "server-only";
import { createHash } from "node:crypto";
import { getBookBySlug } from "@/content/books";
import { isInLibrary } from "@/lib/library";
import { LIBRARY_ITEM, isCurrency, priceCodeFor, schemaOfferFor, type Currency } from "@/content/pricing";
import type { SupportedLocale } from "@/lib/get-locale";
import { siteUrl } from "@/lib/auth";

// Заказ, который открывает агент. На аккаунт читателя, если агент вошёл от
// его имени (OAuth), иначе на почту: гостевой id neuralcosmology:<sha256(email)>,
// а при входе на сайт с этой почтой покупка переходит на аккаунт.

export class CheckoutError extends Error {}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function guestIdFor(email: string): string {
  return `neuralcosmology:${createHash("sha256").update(email.trim().toLowerCase()).digest("hex").slice(0, 32)}`;
}

export async function createAgentCheckout(input: {
  item: string;
  locale: SupportedLocale;
  currency?: string;
  email?: string;
  userId?: string;
}): Promise<{ checkoutUrl: string; currency: Currency; item: string; forAccount: boolean }> {
  const { item, locale } = input;
  if (item !== LIBRARY_ITEM && !(getBookBySlug(item) && isInLibrary(item))) {
    throw new CheckoutError(`Unknown item "${item}". Use a book slug from list_books, or "library".`);
  }
  const email = input.email?.trim();
  if (!input.userId && !(email && EMAIL.test(email))) {
    throw new CheckoutError("The reader's email is required: the purchase is tied to it until they sign in.");
  }
  const base = process.env.BILLING_API_URL;
  const apiKey = process.env.BILLING_API_KEY;
  if (!base || !apiKey) throw new CheckoutError("Checkout is not available right now.");

  const currency: Currency = isCurrency(input.currency?.toUpperCase())
    ? (input.currency!.toUpperCase() as Currency)
    : schemaOfferFor(item === LIBRARY_ITEM ? "library" : "book", locale).currency;
  const site = siteUrl();
  const readPath = item === LIBRARY_ITEM ? `/${locale}/books` : `/${locale}/read/${item}`;
  // Гость после оплаты сразу входит на сайт: покупка переходит на аккаунт при входе.
  const successUrl = input.userId
    ? `${site}${readPath}?purchased=1&item=${encodeURIComponent(item)}`
    : `${site}/api/auth/login?returnTo=${encodeURIComponent(readPath)}`;
  const errorUrl = `${site}/${locale}/books${item === LIBRARY_ITEM ? "" : `/${item}`}`;

  const create = (cur: Currency) =>
    fetch(`${base}/v1/checkout/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify({
        priceCode: priceCodeFor(item, cur),
        mode: "PAYMENT",
        userId: input.userId ?? guestIdFor(email!),
        successUrl,
        errorUrl,
        locale,
        metadata: { source: "neuralcosmology.com", via: "mcp", item, currency: cur, ...(email ? { email } : {}) },
      }),
      signal: AbortSignal.timeout(10_000),
    });

  let res = await create(currency);
  let used = currency;
  if (!res.ok && currency !== "USD") {
    res = await create("USD");
    used = "USD";
  }
  if (!res.ok) throw new CheckoutError(`Checkout could not be created (billing ${res.status}).`);
  const { checkoutUrl } = (await res.json()) as { checkoutUrl?: string };
  if (!checkoutUrl) throw new CheckoutError("Checkout could not be created.");
  return { checkoutUrl, currency: used, item, forAccount: !!input.userId };
}
