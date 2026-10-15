import "server-only";
import { createBillingPurchases, type BillingPurchases } from "@inite/billing/purchases";

// Биллинг INITE для сайта: общий клиент из inite-shared (@inite/billing/purchases,
// в vendor/ через scripts/sync-inite-shared.mjs). Гостевой id —
// neuralcosmology:<sha256(email)[:32]>, как и раньше.
//
// Оплата из кошелька INITE выключена, пока не задан WALLET_PAY_ENABLED=1:
// эндпоинт биллинга уже есть, но платёж пройдёт только когда у кошелька
// комиссий биллинга есть ETH на Base.

let instance: BillingPurchases | null = null;

export function billing(): BillingPurchases {
  instance ??= createBillingPurchases({
    url: process.env.BILLING_API_URL ?? "",
    apiKey: process.env.BILLING_API_KEY ?? "",
    site: "neuralcosmology",
    walletPay: process.env.WALLET_PAY_ENABLED === "1",
  });
  return instance;
}
