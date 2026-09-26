// Цены онлайн-доступа. Источник правды — INITE Billing (service
// `neuralcosmology`); здесь только коды цен и подписи для кнопок.
// Разовая покупка, доступ бессрочный.

export const LIBRARY_ITEM = "library";

export const pricing = {
  book: { amount: 15, currency: "USD", label: "$15" },
  library: { amount: 50, currency: "USD", label: "$50" },
} as const;

export function priceCodeFor(item: string): string {
  return item === LIBRARY_ITEM
    ? "neuralcosmology-library-usd"
    : `neuralcosmology-book-${item}-usd`;
}
