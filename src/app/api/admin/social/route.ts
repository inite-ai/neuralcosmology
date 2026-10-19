import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { isSupportedLocale } from "@/lib/get-locale";
import { clip, fail, json, noDb } from "@/lib/reader/http";
import { authorSession, saveAccount, validTz } from "@/lib/social/accounts";
import { facebookConfigured, telegramConnect, threadsConfigured } from "@/lib/social/networks";
import { queued, refill } from "@/lib/social/quotes";
import { postNow } from "@/lib/social/run";

export const dynamic = "force-dynamic";

// Кабинет автопостинга (только автор).
// GET → аккаунты (без токенов), последние посты, очередь цитат по языкам.
// POST {action, ...} → telegram | update | remove | skip | post | refill | resolve.

export async function GET() {
  const off = noDb();
  if (off) return off;
  if (!(await authorSession())) return fail("forbidden", 403);
  const sql = await db();
  const accounts = await sql`SELECT id, network, name, lang, hour, tz, enabled, token_expires_at FROM social_accounts ORDER BY created_at`;
  const posts = await sql`SELECT p.id, p.account_id, p.slot, p.status, p.attempts, p.url, p.error, p.updated_at, s.quote, s.lang
    FROM social_posts p JOIN shares s ON s.id = p.share_id ORDER BY p.created_at DESC LIMIT 40`;
  const langs = [...new Set(accounts.map((a) => a.lang as string))];
  const queue = Object.fromEntries(await Promise.all(langs.map(async (l) => [l, await queued(l, 10)])));
  return json({ accounts, posts, queue, threads: threadsConfigured(), facebook: facebookConfigured() });
}

export async function POST(req: NextRequest) {
  const off = noDb();
  if (off) return off;
  if (!(await authorSession())) return fail("forbidden", 403);
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const sql = await db();
  const lang = clip(b.lang, 5);

  switch (b.action) {
    case "telegram": {
      const token = clip(b.token, 200);
      const channel = clip(b.channel, 100);
      if (!token || !channel || !isSupportedLocale(lang)) return fail("bad_request", 400);
      try {
        const chat = await telegramConnect(token, channel);
        await saveAccount({ network: "telegram", id: chat.id, name: chat.name, lang, token });
        return json({ ok: true, name: chat.name });
      } catch (e) {
        return fail(e instanceof Error ? e.message : "telegram_failed", 422);
      }
    }
    case "update": {
      const id = clip(b.id, 40);
      if (lang && !isSupportedLocale(lang)) return fail("bad_request", 400);
      const tz = clip(b.tz, 60);
      if (tz && !validTz(tz)) return fail("bad_tz", 400);
      const hour = typeof b.hour === "number" && Number.isInteger(b.hour) && b.hour >= 0 && b.hour <= 23 ? b.hour : null;
      const enabled = typeof b.enabled === "boolean" ? b.enabled : null;
      await sql`UPDATE social_accounts SET
        lang = COALESCE(${lang || null}, lang), tz = COALESCE(${tz || null}, tz),
        hour = COALESCE(${hour}, hour), enabled = COALESCE(${enabled}, enabled)
        WHERE id = ${id}`;
      return json({ ok: true });
    }
    case "remove":
      await sql`DELETE FROM social_accounts WHERE id = ${clip(b.id, 40)}`;
      return json({ ok: true });
    case "skip":
      await sql`UPDATE social_quotes SET skipped = true WHERE share_id = ${clip(b.shareId, 8)}`;
      return json({ ok: true });
    case "post": {
      const nonce = clip(b.nonce, 40);
      if (!/^[A-Za-z0-9-]{8,40}$/.test(nonce)) return fail("bad_request", 400);
      return json({ status: await postNow(clip(b.id, 40), nonce) });
    }
    case "refill":
      if (!isSupportedLocale(lang)) return fail("bad_request", 400);
      return json({ added: await refill(lang, []) });
    case "resolve": {
      // Исход неизвестен (обрыв связи): автор проверил сеть и говорит, вышел пост или нет.
      // «Не вышел» повтора не запускает: слот закрыт, следующий пост выйдет по расписанию.
      const posted = b.posted === true;
      await sql`UPDATE social_posts SET status = ${posted ? "posted" : "failed"}, attempts = 99,
        url = COALESCE(${clip(b.url, 300) || null}, url), updated_at = now()
        WHERE id = ${clip(b.id, 40)} AND status = 'unknown'`;
      return json({ ok: true });
    }
    default:
      return fail("bad_request", 400);
  }
}
