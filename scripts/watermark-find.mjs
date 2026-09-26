#!/usr/bin/env node
// Находит водяные знаки в утёкшем тексте платной главы.
//   node scripts/watermark-find.mjs leaked.txt
// Печатает метки; владельца метки смотрят в БД сайта:
//   SELECT user_id, email, created_at FROM watermarks WHERE mark = '<метка>';
import { readFile } from "node:fs/promises";

const text = await readFile(process.argv[2] ?? "/dev/stdin", "utf8");
const found = new Map();
for (const m of text.matchAll(/‍([​‌]{32})‍/g)) {
  const bits = [...m[1]].map((c) => (c === "‌" ? "1" : "0")).join("");
  const mark = parseInt(bits, 2).toString(16).padStart(8, "0");
  found.set(mark, (found.get(mark) ?? 0) + 1);
}
if (!found.size) console.log("Меток нет: текст очищен от невидимых символов или взят из бесплатной главы.");
for (const [mark, n] of found) console.log(`${mark}  (${n}×)`);
