"use client";
import { useEffect, useState } from "react";
import {
  CURRENCIES,
  CURRENCY_COOKIE,
  PRICES,
  currencyFromLanguages,
  formatPrice,
  isCurrency,
  type Currency,
} from "@/content/pricing";

// Цена в валюте читателя. Сервер рисует доллары (страницы статические), после
// монтирования подставляется валюта из cookie nc-cur или по языкам браузера.
// Та же логика выбирает валюту в /api/checkout, поэтому списывается ровно то, что показано.

const EVENT = "nc-currency";

export function readCurrency(): Currency {
  try {
    const m = document.cookie.match(new RegExp(`(?:^|; )${CURRENCY_COOKIE}=([A-Z]{3})`));
    if (m && isCurrency(m[1])) return m[1];
  } catch {}
  return currencyFromLanguages(typeof navigator !== "undefined" ? navigator.languages ?? [navigator.language] : []);
}

function useCurrency(): Currency {
  const [cur, setCur] = useState<Currency>("USD");
  useEffect(() => {
    setCur(readCurrency());
    const on = () => setCur(readCurrency());
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, []);
  return cur;
}

export function Price({ item }: { item: "book" | "library" }) {
  const cur = useCurrency();
  return <span suppressHydrationWarning>{formatPrice(PRICES[item][cur], cur)}</span>;
}

export function CurrencyPicker({ className }: { className?: string }) {
  const cur = useCurrency();
  const set = (c: Currency) => {
    document.cookie = `${CURRENCY_COOKIE}=${c}; path=/; max-age=31536000; samesite=lax`;
    window.dispatchEvent(new Event(EVENT));
  };
  return (
    <span className={className}>
      {CURRENCIES.map((c, i) => (
        <span key={c}>
          {i > 0 && <span className="text-line"> · </span>}
          <button
            type="button"
            onClick={() => set(c)}
            aria-pressed={c === cur}
            className={c === cur ? "text-fg" : "text-muted hover:text-fg transition-colors"}
          >
            {c}
          </button>
        </span>
      ))}
    </span>
  );
}
