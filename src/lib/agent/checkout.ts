import "server-only";
import { BillingError, type WalletPayment } from "@inite/billing/purchases";
import { getBookBySlug } from "@/content/books";
import { isInLibrary } from "@/lib/library";
import { LIBRARY_ITEM, isCurrency, priceCodeFor, schemaOfferFor, type Currency } from "@/content/pricing";
import type { SupportedLocale } from "@/lib/get-locale";
import { siteUrl } from "@/lib/auth";
import { billing } from "@/lib/billing";

// Заказ, который открывает агент. На аккаунт читателя, если агент вошёл от
// его имени (OAuth), иначе на почту: гостевой id neuralcosmology:<sha256(email)>,
// а при входе на сайт с этой почтой покупка переходит на аккаунт.
// Вошедшему читателю заказ сразу пробуем оплатить из его кошелька INITE,
// если он разрешил это сайту; иначе биллинг даёт страницу, где он разрешает.

export class CheckoutError extends Error {}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function guestIdFor(email: string): string {
  return billing().guestUserId(email);
}

export async function createAgentCheckout(input: {
  item: string;
  locale: SupportedLocale;
  currency?: string;
  email?: string;
  userId?: string;
}): Promise<{
  checkoutUrl: string;
  x402Url?: string;
  currency: Currency;
  item: string;
  forAccount: boolean;
  wallet?: WalletPayment;
}> {
  const { item, locale } = input;
  if (item !== LIBRARY_ITEM && !(getBookBySlug(item) && isInLibrary(item))) {
    throw new CheckoutError(`Unknown item "${item}". Use a book slug from list_books, or "library".`);
  }
  const email = input.email?.trim();
  if (!input.userId && !(email && EMAIL.test(email))) {
    throw new CheckoutError("The reader's email is required: the purchase is tied to it until they sign in.");
  }
  if (!billing().configured) throw new CheckoutError("Checkout is not available right now.");

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

  const userId = input.userId ?? guestIdFor(email!);
  const create = (cur: Currency) =>
    billing().createPurchase({
      priceCode: priceCodeFor(item, cur),
      userId,
      successUrl,
      errorUrl,
      locale,
      metadata: { source: "neuralcosmology.com", via: "mcp", item, currency: cur, ...(email ? { email } : {}) },
    });

  // Цены в валюте читателя может не оказаться у биллинга: тогда в долларах.
  let session;
  let used = currency;
  try {
    session = await create(currency);
  } catch (err) {
    if (currency === "USD") throw failed(err);
    try {
      session = await create("USD");
      used = "USD";
    } catch (again) {
      throw failed(again);
    }
  }
  if (!session.checkoutUrl) throw new CheckoutError("Checkout could not be created.");

  const wallet = input.userId
    ? await billing().payFromWallet(session.sessionId, input.userId, { returnTo: `${site}${readPath}` })
    : undefined;
  return {
    checkoutUrl: session.checkoutUrl,
    // x402Url: агент с кошельком платит сам, USDC на Base (биллинг отдаёт его, когда x402 включён).
    ...(session.x402Url ? { x402Url: session.x402Url } : {}),
    currency: used,
    item,
    forAccount: !!input.userId,
    ...(wallet && wallet.status !== "unavailable" ? { wallet } : {}),
  };
}

function failed(err: unknown): CheckoutError {
  return new CheckoutError(
    err instanceof BillingError ? `Checkout could not be created (billing ${err.status}).` : "Checkout could not be created.",
  );
}
