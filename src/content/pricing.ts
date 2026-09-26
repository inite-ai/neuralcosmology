// Цены онлайн-доступа. Суммы — src/content/prices.json (оттуда же их берёт
// workflow billing-prices и заводит в INITE Billing). Разовая покупка, доступ бессрочный.
import prices from "./prices.json";

export const LIBRARY_ITEM = "library";

export const CURRENCIES = ["USD", "RUB", "BRL", "ARS"] as const;
export type Currency = (typeof CURRENCIES)[number];
export const CURRENCY_COOKIE = "nc-cur";

export const PRICES: Record<"book" | "library", Record<Currency, number>> = {
  book: prices.book,
  library: prices.library,
};

// Валюты, в которых реально можно заплатить картой (см. prices.json → active).
export const ACTIVE_CURRENCIES = CURRENCIES.filter((c) => (prices.active as string[]).includes(c));
export const isCurrency = (v: unknown): v is Currency => ACTIVE_CURRENCIES.includes(v as Currency);

export function priceCodeFor(item: string, currency: Currency = "USD"): string {
  const cur = currency.toLowerCase();
  return item === LIBRARY_ITEM ? `neuralcosmology-library-${cur}` : `neuralcosmology-book-${item}-${cur}`;
}

export const kindOf = (item: string): "book" | "library" => (item === LIBRARY_ITEM ? "library" : "book");

// Валюта по языкам браузера: русский → рубли, бразильский португальский → реалы,
// аргентинский испанский → песо, остальные → доллары.
export function currencyFromLanguages(langs: readonly string[]): Currency {
  const c = preferredCurrency(langs);
  return ACTIVE_CURRENCIES.includes(c) ? c : "USD";
}

function preferredCurrency(langs: readonly string[]): Currency {
  for (const raw of langs) {
    const l = raw.toLowerCase().trim();
    if (/^ru\b/.test(l)) return "RUB";
    if (l === "pt-br" || l === "pt") return "BRL";
    if (l === "es-ar") return "ARS";
    if (/^(en|es|pt|de|fr|it)\b/.test(l)) return "USD";
  }
  return "USD";
}

export function currencyFromAcceptLanguage(header: string | null): Currency {
  return currencyFromLanguages((header ?? "").split(",").map((p) => p.split(";")[0]));
}

const FORMAT: Record<Currency, { locale: string; display: "narrowSymbol" | "code" }> = {
  USD: { locale: "en-US", display: "narrowSymbol" },
  RUB: { locale: "ru-RU", display: "narrowSymbol" },
  BRL: { locale: "pt-BR", display: "narrowSymbol" },
  ARS: { locale: "es-AR", display: "code" },
};

export function formatPrice(amount: number, currency: Currency): string {
  const f = FORMAT[currency];
  return new Intl.NumberFormat(f.locale, { style: "currency", currency, currencyDisplay: f.display, maximumFractionDigits: 0 }).format(amount);
}

// Базовая (долларовая) цена — для JSON-LD и значений по умолчанию.
export const pricing = {
  book: { amount: PRICES.book.USD, currency: "USD", label: formatPrice(PRICES.book.USD, "USD") },
  library: { amount: PRICES.library.USD, currency: "USD", label: formatPrice(PRICES.library.USD, "USD") },
} as const;
