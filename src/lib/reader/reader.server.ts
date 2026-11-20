import "server-only";
import { anthropicReaderAi, createReader, isRejection, paragraphsFromHtml, type ReaderAi, type ReaderSession, type ReaderSite } from "@inite/reader";
import { getBookBySlug } from "@/content/books";
import { chapterGate, ownsBook } from "@/lib/access";
import { getSession, type Session } from "@/lib/auth";
import { dbConfigured } from "@/lib/db";
import { isSupportedLocale } from "@/lib/get-locale";
import { pickLocalized } from "@/lib/i18n";
import { getChapterHtml, getManifest } from "@/lib/library";
import { sendMail } from "@/lib/mail";
import { AI_BETAS, AI_MODEL, aiConfigured, complete } from "@/lib/reader/ai";
import { AUTHOR_EMAILS } from "@/lib/reader/context";
import { authorName } from "@/lib/reader/quote";
import { sqlReaderStore } from "@/lib/reader/store.server";

// Читалка сайта на @inite/reader: сессия, библиотека, доступ, почта и таблицы —
// наши, правила и маршруты — пакета. Через `reader` идут и /api/reader/*, и MCP.

/**
 * Читатель. В браузере (`web`) — своя сессия сайта: адрес в ней пришёл со входом
 * через INITE и подтверждённым не помечен, автора по нему узнаём как раньше.
 * У агента (MCP) — токен INITE: адрес есть, только если он подтверждён.
 */
export type SiteSession = ReaderSession & { web?: boolean };

export const fromWeb = (s: Session): SiteSession => ({
  sub: s.sub,
  email: s.email?.toLowerCase() ?? null,
  emailVerified: false,
  name: s.name ?? null,
  admin: false,
  web: true,
});

export const fromToken = (t: { sub: string; email?: string; emailVerified: boolean }): SiteSession => ({
  sub: t.sub,
  email: t.emailVerified && t.email ? t.email.toLowerCase() : null,
  emailVerified: Boolean(t.emailVerified && t.email),
  name: null,
  admin: false,
});

/** Глава издания: книга есть в каталоге и в библиотеке, язык поддержан. */
function chapterRef(book: string, lang: string, chapter: string) {
  const b = getBookBySlug(book);
  if (!b || !isSupportedLocale(lang)) return null;
  const manifest = getManifest(book, lang);
  const index = manifest?.chapters.findIndex((c) => c.id === chapter) ?? -1;
  if (!manifest || index < 0) return null;
  return { lang, index, chapter: manifest.chapters[index], bookTitle: pickLocalized(b.titles, lang) };
}

// Ответы компаньона — пакета, с сегодняшними моделью и настройками (адаптивное мышление,
// средний effort, серверный fallback). Пересказы и модерация — через свой complete():
// claude-opus-5 думает по умолчанию, и пакетные 400 / 8 токенов без effort ушли бы на
// мышление целиком; так они идут, как шли (effort low, fallback).
function readerAi(): ReaderAi | null {
  if (!aiConfigured()) return null;
  const base = anthropicReaderAi({
    apiKey: process.env.ANTHROPIC_API_KEY!,
    model: AI_MODEL(),
    maxTokens: 4000,
    answerExtras: { fallbacks: "default", thinking: { type: "adaptive" }, output_config: { effort: "medium" } },
    betas: AI_BETAS,
  });
  return {
    answer: base.answer,
    complete: ({ system, prompt, maxTokens }) => complete(system, prompt, Math.max(maxTokens, 600), "low"),
    async moderate({ system, prompt }) {
      try {
        return !isRejection(await complete(system, prompt, 16, "low"));
      } catch (err) {
        console.error("[reader-ai] moderation failed:", err instanceof Error ? err.message : err);
        return true;
      }
    },
  };
}

const CONTACT_EMAIL = () => process.env.CONTACT_EMAIL || "info@neuralcosmology.com";
const BASE = "https://neuralcosmology.com";

const site: ReaderSite = {
  siteUrl: BASE,
  siteName: "neuralcosmology.com",
  authorName,
  async session() {
    const s = await getSession();
    return s ? fromWeb(s) : null;
  },
  async chapter({ book, lang, chapter }) {
    const ref = chapterRef(book, lang, chapter);
    return ref ? { title: ref.chapter.title, index: ref.index, hash: ref.chapter.hash, bookTitle: ref.bookTitle } : null;
  },
  async paragraphs({ book, lang, chapter }) {
    if (!isSupportedLocale(lang)) return null;
    const html = getChapterHtml(book, lang, chapter);
    return html ? paragraphsFromHtml(html) : null;
  },
  async chapters(book, lang) {
    if (!isSupportedLocale(lang)) return [];
    return (getManifest(book, lang)?.chapters ?? []).map((c) => ({ id: c.id, title: c.title, hash: c.hash }));
  },
  // Тот же замок, что у страницы главы (src/lib/access.ts; с PAYWALL_ENABLED — покупка).
  async canRead(s, { book, lang, chapter }) {
    const ref = chapterRef(book, lang, chapter);
    if (!ref) return false;
    return (await chapterGate(ref.chapter, book, s ? { sub: s.sub } : null)) === "open";
  },
  // Без пейволла любой вошедший — «владелец» (большой лимит ИИ), как и раньше.
  async ownsBook(s, book) {
    return ownsBook(s ? { sub: s.sub } : null, book);
  },
  isAuthor(s) {
    if (s.admin) return true;
    const confirmed = s.emailVerified || Boolean((s as SiteSession).web);
    return Boolean(s.email && confirmed && AUTHOR_EMAILS().includes(s.email.toLowerCase()));
  },
  // Письма автору — на общий ящик; ответ уходит читателю. Без почты письмо «не ушло».
  async notify(letter) {
    const ok = await sendMail(CONTACT_EMAIL(), letter.subject, letter.text, letter.html, { replyTo: letter.replyTo, fromName: letter.fromName });
    if (!ok) throw new Error("mail is not configured or the send failed");
  },
  ai: readerAi(),
  limits: {
    aiPerDayOwner: Number(process.env.AI_DAILY_LIMIT_OWNER || 30),
    aiPerDayTrial: Number(process.env.AI_DAILY_LIMIT_TRIAL || 3),
  },
};

export const reader = createReader(site, sqlReaderStore, { letterLang: "ru" });

type Handler = (req: Request) => Promise<Response>;
/** Без базы читалка ничего не хранит: так и говорим, а не падаем дальше. */
export const withDb =
  <H extends Handler>(h: H): Handler =>
  (req) =>
    dbConfigured() ? h(req) : Promise.resolve(Response.json({ error: "storage_unavailable" }, { status: 503 }));
