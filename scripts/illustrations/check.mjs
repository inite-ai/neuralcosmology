// Сторожит иллюстрации: место (разрыв сцены) существует в русском оригинале,
// у главы есть файл, alt есть на четырёх языках, у архивных фото — подпись,
// источник и свободная лицензия. Без библиотеки (LIBRARY_DIR) места не сверяются.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const base = join(root, "content/illustrations");
const LANGS = ["ru", "en", "pt", "es"];
const FREE = /^(public domain|pd|cc0|cc[- ]by(-sa)?[- ]?\d(\.\d)?|no restrictions|nasa)/i;
const lib =
  process.env.LIBRARY_DIR ??
  readFileSync(join(root, ".env.local"), "utf8").match(/^LIBRARY_DIR=(.*)$/m)?.[1]?.trim();
const errors = [];
const warnings = [];
const ids = new Set();
let total = 0;

for (const book of readdirSync(base).filter((d) => statSync(join(base, d)).isDirectory())) {
  for (const f of readdirSync(join(base, book)).filter((f) => f.endsWith(".json"))) {
    const chapter = f.slice(0, -5);
    const html = lib && existsSync(join(lib, book, "ru", `${chapter}.html`)) ? readFileSync(join(lib, book, "ru", `${chapter}.html`), "utf8") : null;
    if (lib && !html) errors.push(`${book}/${chapter}: no such chapter in the library`);
    const scenes = html ? (html.match(/<hr class="scene"\s*\/?>/g) ?? []).length : null;
    for (const it of JSON.parse(readFileSync(join(base, book, f), "utf8")).items) {
      total++;
      if (ids.has(it.id)) errors.push(`duplicate id ${it.id}`);
      ids.add(it.id);
      if (it.book !== book || it.chapter !== chapter) errors.push(`${it.id}: book/chapter do not match its file`);
      if (scenes !== null && it.scene > scenes) errors.push(`${it.id}: after scene ${it.scene}, but ru/${chapter} has ${scenes}`);
      for (const l of LANGS) {
        if (!it.alt?.[l]) errors.push(`${it.id}: alt missing in ${l}`);
        if (it.kind === "archive" && !it.caption?.[l]) errors.push(`${it.id}: caption missing in ${l}`);
      }
      if (it.kind === "generated" && !it.prompt) errors.push(`${it.id}: prompt missing`);
      if (it.kind === "archive") {
        const s = it.source ?? {};
        if (!s.page || !s.download || !s.author || !s.license) errors.push(`${it.id}: archive source needs page, download, author, license`);
        else if (!FREE.test(s.license)) errors.push(`${it.id}: licence "${s.license}" is not free`);
      }
      if (!existsSync(join(root, "public/book/ill", `${it.id}.webp`))) warnings.push(`${it.id}: image not generated yet`);
    }
  }
}
for (const w of warnings) console.warn(`warn  ${w}`);
for (const e of errors) console.error(`error ${e}`);
console.log(`${total} illustrations, ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
