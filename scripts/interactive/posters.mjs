// Копирует обложки YouTube-вставок (content/interactive, widget "youtube") в
// public/book/media/<id>.jpg, чтобы до нажатия «смотреть» страница не ходила к YouTube.
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const base = join(root, "content/interactive");
const out = join(root, "public/book/media");
mkdirSync(out, { recursive: true });

const ids = new Set();
for (const book of readdirSync(base).filter((d) => statSync(join(base, d)).isDirectory()))
  for (const f of readdirSync(join(base, book)).filter((f) => f.endsWith(".json")))
    for (const it of JSON.parse(readFileSync(join(base, book, f), "utf8")).items) if (it.widget === "youtube") ids.add(it.props.id);

for (const id of ids) {
  const file = join(out, `${id}.jpg`);
  if (existsSync(file)) continue;
  let buf = null;
  for (const q of ["maxresdefault", "sddefault", "hqdefault"]) {
    const r = await fetch(`https://i.ytimg.com/vi/${id}/${q}.jpg`);
    if (r.ok) {
      buf = Buffer.from(await r.arrayBuffer());
      if (q !== "maxresdefault" || buf.length > 5000) break;
    }
  }
  if (!buf) {
    console.error(`no poster for ${id}`);
    process.exitCode = 1;
    continue;
  }
  // У sd/hq-обложек чёрные поля сверху и снизу: режем до 16:9.
  const img = sharp(buf);
  const { width, height } = await img.metadata();
  const h = Math.round((width * 9) / 16);
  await img.extract({ left: 0, top: Math.max(0, Math.round((height - h) / 2)), width, height: Math.min(h, height) }).resize({ width: 1280, withoutEnlargement: true }).jpeg({ quality: 78, mozjpeg: true }).toFile(file);
  console.log(`poster ${id}`);
}
