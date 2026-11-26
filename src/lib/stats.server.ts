import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { db, dbConfigured } from "@/lib/db";

// Свой счёт сайта — из него собрана страница «Статистика» в бэкофисе.
// Никого не опознаёт: посетитель — sha256(соль дня, IP, браузер), 16 знаков.
// Соль живёт сутки (UTC) и удаляется: назавтра тот же человек — новый посетитель,
// а вчерашние хеши не может пересчитать никто, сайт тоже. Сам IP не пишется.
// Запись не бросает ошибок и ничего не задерживает.

export const STAT_EVENTS = ["page", "chapter_open", "chapter_complete", "checkout", "purchase"] as const;
export type StatEvent = (typeof STAT_EVENTS)[number];

export type StatInput = {
  name: StatEvent;
  path?: string | null;
  book?: string | null;
  chapter?: string | null;
  lang?: string | null;
  source?: string | null;
  key?: string | null;
};

// Краулеры, превью ссылок, мониторинг — не читатели.
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|headless|lighthouse|pingdom|uptime|curl|wget|python|go-http|node-fetch|axios|okhttp|java\//i;
export const isBot = (ua: string | null): boolean => !ua || BOT.test(ua);

let cached: { day: string; salt: string } | null = null;

async function saltFor(day: string): Promise<string> {
  if (cached?.day === day) return cached.salt;
  const sql = await db();
  await sql`INSERT INTO stats_salts (day, salt) VALUES (${day}, ${randomBytes(16).toString("hex")}) ON CONFLICT (day) DO NOTHING`;
  const [row] = await sql<{ salt: string }[]>`SELECT salt FROM stats_salts WHERE day = ${day}`;
  await sql`DELETE FROM stats_salts WHERE day < ${day}`;
  // Тринадцать месяцев — дальше страница ничего не спрашивает.
  await sql`DELETE FROM site_events WHERE at < now() - interval '400 days'`;
  cached = { day, salt: row.salt };
  return row.salt;
}

function ipOf(h: Headers): string {
  return h.get("cf-connecting-ip") || h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "";
}

const cut = (v: string | null | undefined, n: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, n) : null);

/** Одно событие для запроса с этими заголовками. Бот или нет базы — тихо ничего. */
export async function recordStat(h: Headers, input: StatInput): Promise<void> {
  try {
    if (!dbConfigured() || isBot(h.get("user-agent"))) return;
    const salt = await saltFor(new Date().toISOString().slice(0, 10));
    const visitor = createHash("sha256").update(`${salt}|${ipOf(h)}|${h.get("user-agent") ?? ""}`).digest("hex").slice(0, 16);
    const sql = await db();
    await sql`INSERT INTO site_events (name, visitor, path, book, chapter, lang, source, country, key)
      VALUES (${input.name}, ${visitor}, ${cut(input.path, 300)}, ${cut(input.book, 80)}, ${cut(input.chapter, 80)},
              ${cut(input.lang, 8)}, ${cut(input.source, 80)}, ${cut(h.get("cf-ipcountry"), 2)}, ${cut(input.key, 100)})
      ON CONFLICT (key) DO NOTHING`;
  } catch (err) {
    console.error("[stats] not recorded:", err instanceof Error ? err.message : err);
  }
}
