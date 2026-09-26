import "server-only";
import { createHmac } from "node:crypto";
import { db, dbConfigured } from "@/lib/db";

// Защита платного текста от утечек — «социальный DRM».
//
// 1. Водяной знак. В платные главы каждого покупателя вшивается невидимая метка
//    (символы нулевой ширины), уникальная для аккаунта. Текст читается и копируется
//    как обычно, но если он всплывёт на стороне, по метке видно, чей это аккаунт:
//    node scripts/watermark-find.mjs leaked.txt  → метка → таблица watermarks.
// 2. Лимит выкачивания. Живой читатель не открывает десятки платных глав за минуты;
//    скрипт, выкачивающий книгу, — открывает. Такой аккаунт получает паузу.

const ZERO = "​"; // бит 0
const ONE = "‌"; // бит 1
const FRAME = "‍"; // границы метки
const EVERY = 6; // метка в каждом шестом абзаце — переживает копирование фрагмента

export function markFor(userId: string): string {
  const secret = process.env.SESSION_SECRET ?? "nc-dev";
  return createHmac("sha256", secret).update(`wm:${userId}`).digest("hex").slice(0, 8);
}

function encode(mark: string): string {
  const bits = parseInt(mark, 16).toString(2).padStart(32, "0");
  return FRAME + [...bits].map((b) => (b === "1" ? ONE : ZERO)).join("") + FRAME;
}

// Вставка после первого пробела в тексте абзаца (вне тегов и сущностей).
function insertAfterFirstSpace(inner: string, code: string): string {
  let inTag = false;
  let inEntity = false;
  for (let i = 0; i < inner.length; i++) {
    const c = inner[i];
    if (c === "<") inTag = true;
    else if (c === ">") inTag = false;
    else if (!inTag && c === "&") inEntity = true;
    else if (inEntity && c === ";") inEntity = false;
    else if (!inTag && !inEntity && c === " " && i > 12) return inner.slice(0, i + 1) + code + inner.slice(i + 1);
  }
  return inner;
}

export function watermark(html: string, userId: string): string {
  const code = encode(markFor(userId));
  let n = 0;
  return html.replace(/(<p\b[^>]*>)([\s\S]*?)(<\/p>)/g, (m, open, inner, close) =>
    n++ % EVERY === 1 ? open + insertAfterFirstSpace(inner, code) + close : m,
  );
}

export const stripMarks = (s: string) => s.replace(/[​-‍⁠﻿]/g, "");

const seen = new Set<string>();

/** Запоминает, чья это метка (один раз на процесс на пользователя). */
export async function registerMark(userId: string, email?: string | null): Promise<void> {
  if (seen.has(userId) || !dbConfigured()) return;
  seen.add(userId);
  try {
    const sql = await db();
    await sql`INSERT INTO watermarks (mark, user_id, email) VALUES (${markFor(userId)}, ${userId}, ${email ?? null})
      ON CONFLICT (mark) DO UPDATE SET email = COALESCE(EXCLUDED.email, watermarks.email)`;
  } catch (err) {
    seen.delete(userId);
    console.error("[protect] registerMark:", err instanceof Error ? err.message : err);
  }
}

// ---- лимит выкачивания платных глав ----
const WINDOW_MS = 10 * 60_000;
const MAX_PAID_VIEWS = 40;
const views = new Map<string, number[]>();

/** false — аккаунт открывает платные главы быстрее, чем их можно прочитать. */
export function allowPaidView(userId: string): boolean {
  const now = Date.now();
  const list = (views.get(userId) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  views.set(userId, list);
  if (list.length === MAX_PAID_VIEWS + 1) console.warn(`[protect] paid-view limit hit by ${userId}`);
  return list.length <= MAX_PAID_VIEWS;
}
