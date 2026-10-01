// Генерирует и скачивает иллюстрации из content/illustrations/<book>/<chapter>.json.
// Идемпотентно: только недостающие картинки и изменившиеся промпты; approved не трогает.
//   node scripts/illustrations/illustrate.mjs [--dry] [--only id,id] [--book slug] [--force id,id] [--limit N] [--concurrency 3]
// Устроено как в nobodyquits (scripts/book/illustrate.mjs): gpt-image-2 в стиле дома,
// архивные фото — с Wikimedia Commons под свободной лицензией.

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const base = join(root, "content/illustrations");
const out = join(root, "public/book/ill");
mkdirSync(out, { recursive: true });
const style = JSON.parse(readFileSync(join(base, "style.json"), "utf8"));

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(`--${n}`);
const opt = (n) => {
  const i = argv.indexOf(`--${n}`);
  return i >= 0 ? argv[i + 1] : null;
};
const only = opt("only")?.split(",") ?? null;
const bookOnly = opt("book");
const force = new Set(opt("force")?.split(",") ?? []);
const limit = Number(opt("limit") ?? Infinity);
const concurrency = Number(opt("concurrency") ?? 3);

const files = readdirSync(base)
  .filter((d) => statSync(join(base, d)).isDirectory() && (!bookOnly || d === bookOnly))
  .flatMap((d) => readdirSync(join(base, d)).filter((f) => f.endsWith(".json")).map((f) => join(base, d, f)))
  .map((path) => ({ path, data: JSON.parse(readFileSync(path, "utf8")) }));
const items = files.flatMap((f) => f.data.items.map((it) => Object.assign(it, { __file: f })));
const save = (f) => writeFileSync(f.path, JSON.stringify(f.data, (k, v) => (k === "__file" ? undefined : v), 2) + "\n");

if (!process.env.OPENAI_API_KEY && existsSync(join(homedir(), ".skills.env"))) {
  const line = readFileSync(join(homedir(), ".skills.env"), "utf8").split("\n").find((l) => l.startsWith("OPENAI_API_KEY="));
  if (line) process.env.OPENAI_API_KEY = line.slice("OPENAI_API_KEY=".length).trim().replace(/^["']|["']$/g, "");
}

export const hashOf = (it) =>
  createHash("sha256")
    .update(it.kind === "archive" ? `archive|${it.source?.download}` : `${style.version}|${style.house}|${it.prompt}`)
    .digest("hex")
    .slice(0, 16);

const PRICE = { low: 0.02, medium: 0.05, high: 0.1 };

const todo = items
  .filter((it) => {
    if (only && !only.includes(it.id)) return false;
    if (force.has(it.id)) return true;
    if (it.status === "approved") return false;
    return !existsSync(join(out, `${it.id}.webp`)) || it.hash !== hashOf(it);
  })
  .slice(0, limit);

const paid = todo.filter((it) => it.kind !== "archive").length;
console.log(`${todo.length} to fetch/generate: ${todo.length - paid} archive (free), ${paid} generated ~$${(paid * PRICE[style.quality]).toFixed(2)} (${style.model}, ${style.quality})`);
if (flag("dry")) {
  for (const it of todo) console.log(" -", it.id);
  process.exit(0);
}
if (paid && !process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not set");

async function fetchArchive(it) {
  const res = await fetch(it.source.download, { headers: { "user-agent": "NeuralCosmology/1.0 (https://neuralcosmology.com; info@neuralcosmology.com)" } });
  if (!res.ok) throw new Error(`download ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function render(it) {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({ model: style.model, prompt: `${it.prompt}\n\n${style.house}`, size: style.size, quality: style.quality, n: 1, output_format: "png" }),
  });
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 300)}`);
  const b64 = (await res.json()).data?.[0]?.b64_json;
  if (!b64) throw new Error("no image in response");
  return Buffer.from(b64, "base64");
}

async function write(it, img) {
  const info = await sharp(img).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toFile(join(out, `${it.id}.webp`));
  it.width = info.width;
  it.height = info.height;
  // 1200×630 для превью ссылок (og:image главы); JPEG, потому что его читают satori и все краулеры.
  await sharp(img).resize(1200, 630, { fit: "cover", position: "attention" }).jpeg({ quality: 82, mozjpeg: true }).toFile(join(out, `${it.id}.og.jpg`));
  const tiny = await sharp(img).resize(24).webp({ quality: 40 }).toBuffer();
  it.placeholder = `data:image/webp;base64,${tiny.toString("base64")}`;
  it.hash = hashOf(it);
  it.generatedAt = new Date().toISOString();
  if (it.status !== "approved") it.status = "draft";
}

let done = 0;
const queue = [...todo];
await Promise.all(
  Array.from({ length: concurrency }, async () => {
    while (queue.length) {
      const it = queue.shift();
      try {
        await write(it, it.kind === "archive" ? await fetchArchive(it) : await render(it));
        done++;
        console.log(`✓ ${it.id} (${done}/${todo.length})`);
        save(it.__file);
      } catch (e) {
        console.error(`✗ ${it.id}: ${e.message}`);
      }
    }
  }),
);
for (const f of files) save(f);
