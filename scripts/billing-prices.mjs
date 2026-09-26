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
const probe = process.argv.includes("--probe");
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

// Книга есть в src/content/books.ts, а товара в биллинге нет — заводим его по
// образцу уже существующей книги: тот же тип и moduleScope, метаданные с новым
// slug, entitlement neuralcosmology:book:<slug> (его проверяет src/lib/access.ts).
const booksSrc = await readFile(new URL("../src/content/books.ts", import.meta.url), "utf8");
const catalog = [...booksSrc.matchAll(/slug: "([^"]+)",\s*titles: \{\s*en: "([^"]+)"/g)].map((m) => ({ slug: m[1], title: m[2] }));
const bookCode = (slug) => `neuralcosmology-book-${slug}-usd`;
const templatePrice = prices.find((p) => /^neuralcosmology-book-.+-usd$/.test(p.code));
if (templatePrice) {
  const templateSlug = templatePrice.code.match(/^neuralcosmology-book-(.+)-usd$/)[1];
  const templateTitle = catalog.find((b) => b.slug === templateSlug)?.title ?? "\0";
  const productList = await api("GET", "/products");
  const products = Array.isArray(productList) ? productList : productList.data ?? productList.items ?? [];
  const template = products.find((p) => p.id === templatePrice.productId);
  const swap = (v, slug) => (v == null ? v : JSON.parse(JSON.stringify(v).replaceAll(templateSlug, slug)));
  for (const { slug, title } of catalog) {
    if (byCode.has(bookCode(slug))) continue;
    const metadata = { ...swap(template?.metadata ?? {}, slug), entitlementKey: `neuralcosmology:book:${slug}` };
    delete metadata.entitlements;
    const product = {
      code: template ? template.code.replaceAll(templateSlug, slug) : `neuralcosmology-book-${slug}`,
      name: template?.name.includes(templateTitle) ? template.name.replaceAll(templateTitle, title) : title,
      type: template?.type ?? "one_time",
      moduleScope: template?.moduleScope,
      metadata,
    };
    const existing = products.find((p) => p.code === product.code);
    console.log(`+ product ${product.code} «${product.name}» → ${metadata.entitlementKey}${existing ? " (exists)" : ""}`);
    const productId = existing?.id ?? (dry ? "dry-run" : (await api("POST", "/products", product)).id);
    const price = { productId, code: bookCode(slug), currency: "USD", amount: table.book.USD, metadata: swap(templatePrice.metadata ?? {}, slug) };
    console.log(`+ ${price.code} ${price.amount} USD`);
    const createdPrice = dry ? { ...price, id: "dry-run" } : await api("POST", "/prices", price);
    prices.push(createdPrice);
    byCode.set(createdPrice.code, createdPrice);
  }
}

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
// --probe: создаёт по тестовой сессии на валюту и печатает, каких провайдеров предложит оплата.
// Ничего не списывает; незавершённые сессии истекают сами.
if (probe) {
  for (const cur of ["USD", "RUB", "BRL", "ARS"]) {
    const r = await fetch(`${base}/v1/checkout/sessions`, {
      method: "POST",
      headers: { "x-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({ priceCode: `neuralcosmology-book-bugs-academy-${cur.toLowerCase()}`, mode: "PAYMENT", userId: "probe-neuralcosmology", successUrl: "https://neuralcosmology.com/", errorUrl: "https://neuralcosmology.com/", metadata: { probe: true } }),
    });
    const created = await r.json().catch(() => ({}));
    const id = created.sessionId ?? created.id ?? created.session?.id;
    if (!r.ok || !id) { console.log(`${cur}: session failed ${r.status} ${JSON.stringify(created).slice(0, 200)}`); continue; }
    const sess = await fetch(`${base}/v1/checkout/sessions/${id}`, { headers: { "x-api-key": key } }).then((x) => x.json());
    const methods = sess.paymentMethods ?? sess.providers ?? sess.availableProviders ?? [];
    console.log(`${cur}: ${methods.map((m) => m.code ?? m.name).join(", ") || "NO PROVIDERS"}`);
  }
}

console.log(`\n${items.length} products · created ${created} · updated ${updated} · unchanged ${same}${dry ? " (dry run)" : ""}`);
