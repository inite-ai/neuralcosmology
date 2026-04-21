#!/usr/bin/env -S npx tsx
/**
 * IndexNow ping — notifies Bing / Yandex / Seznam of URL updates.
 *
 * Usage:
 *   npx tsx scripts/indexnow-ping.ts /en/essays/new-essay /ru/essays/new-essay
 *   npx tsx scripts/indexnow-ping.ts --all-essays      # pings all essay URLs
 */

const KEY = "37027cd598c84365b750d23778b62330";
const HOST = "neuralcosmology.com";
const BASE = `https://${HOST}`;

async function ping(urls: string[]): Promise<void> {
  if (urls.length === 0) {
    console.error("no urls provided");
    process.exit(1);
  }
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: `${BASE}/${KEY}.txt`,
    urlList: urls.map((u) => (u.startsWith("http") ? u : `${BASE}${u.startsWith("/") ? u : `/${u}`}`)),
  };

  const endpoints = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
    "https://yandex.com/indexnow",
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      console.log(`${endpoint}: ${res.status} ${res.statusText}`);
    } catch (e) {
      console.error(`${endpoint}: ${(e as Error).message}`);
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--all-essays")) {
    const { getAllSlugs } = await import("../src/lib/essays");
    const slugs = getAllSlugs();
    const urls = slugs.flatMap((slug) =>
      ["en", "ru", "pt", "es"].map((l) => `/${l}/essays/${slug}`),
    );
    await ping(urls);
    return;
  }
  await ping(args);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
