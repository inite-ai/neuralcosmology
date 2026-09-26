#!/usr/bin/env node
// Синхронизирует цены онлайн-доступа из src/content/prices.json с INITE Billing.
// Для каждой книги и библиотеки: находит товар по существующей долларовой цене,
// создаёт недостающие цены в других валютах и обновляет суммы, если они изменились.
// Запускается workflow billing-prices (секрет BILLING_API_KEY, переменная BILLING_API_URL).
//
//   BILLING_API_URL=... BILLING_API_KEY=... node scripts/billing-prices.mjs [--dry-run]
import { readFile } from "node:fs/promises";

const base = process.env.BILLING_API_URL;
const key = process.env.BILLING_API_KEY;
const dry = process.argv.includes("--dry-run");
if (!base || !key) {
  console.error("BILLING_API_URL / BILLING_API_KEY not set");
  process.exit(1);
}

const table = JSON.parse(await readFile(new URL("../src/content/prices.json", import.meta.url), "utf8"));
const api = async (method, path, body) => {
  const r = await fetch(`${base}/v1/service/catalog${path}`, {
    method,
    headers: { "x-api-key": key, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await r.text();
  if (!r.ok) throw new Error(`${method} ${path} → ${r.status}: ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
};

const list = await api("GET", "/prices");
const prices = Array.isArray(list) ? list : list.data ?? list.items ?? [];
const byCode = new Map(prices.map((p) => [p.code, p]));

// Товары определяем по долларовым ценам, которые уже есть в биллинге.
const items = prices
  .map((p) => p.code.match(/^neuralcosmology-(book-(.+)|library)-usd$/))
  .filter(Boolean)
  .map((m) => ({ item: m[1] === "library" ? "library" : m[2], usdCode: m[0] }));

let created = 0, updated = 0, same = 0;
for (const { item, usdCode } of items) {
  const usd = byCode.get(usdCode);
  const amounts = item === "library" ? table.library : table.book;
  for (const [currency, amount] of Object.entries(amounts)) {
    const code = usdCode.replace(/-usd$/, `-${currency.toLowerCase()}`);
    const existing = byCode.get(code);
    if (!existing) {
      console.log(`+ ${code} ${amount} ${currency}`);
      if (!dry) await api("POST", "/prices", { productId: usd.productId, code, currency, amount, metadata: usd.metadata ?? {} });
      created++;
    } else if (Number(existing.amount) !== amount || existing.isActive === false) {
      console.log(`~ ${code} ${existing.amount} → ${amount} ${currency}`);
      if (!dry) await api("PUT", `/prices/${existing.id}`, { amount, isActive: true });
      updated++;
    } else same++;
  }
}
console.log(`\n${items.length} products · created ${created} · updated ${updated} · unchanged ${same}${dry ? " (dry run)" : ""}`);
