import "server-only";
import { db, dbConfigured } from "@/lib/db";
import { isSupportedLocale } from "@/lib/get-locale";
import { getShare } from "@/lib/reader/share";
import { publish, threadsRefresh, type Network } from "@/lib/social/networks";
import { postFor, queued, refill } from "@/lib/social/quotes";
import { seal, unseal } from "@/lib/social/seal";

// Расписание автопостинга: каждый аккаунт раз в день в свой час по своему поясу.
//
// Пост выходит не больше одного раза:
// - слот (аккаунт + день) — уникальная строка social_posts; кто вставил строку, тот и публикует,
//   второй процесс или повторный тик получает конфликт и уходит;
// - повтор только после явной ошибки сети («поста нет»), не больше трёх попыток в окне слота;
// - если ответа не было (обрыв, таймаут, процесс упал посреди запроса), строка остаётся
//   unknown и сама не повторяется: автор смотрит в кабинете и решает.

export type Account = {
  id: string; network: Network; external_id: string; name: string; lang: string;
  token: string; token_expires_at: Date | null; hour: number; tz: string; enabled: boolean;
};

const WINDOW_HOURS = 3;
const MAX_ATTEMPTS = 3;
const STALE_MINUTES = 15;

/** Дата и час в поясе аккаунта. */
function local(tz: string, now = new Date()): { day: string; hour: number } {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hourCycle: "h23" })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  return { day: `${parts.year}-${parts.month}-${parts.day}`, hour: Number(parts.hour) };
}

/** Слот на сегодня, если сейчас его окно, иначе null. */
export function dueSlot(a: Pick<Account, "hour" | "tz">, now = new Date()): string | null {
  const { day, hour } = local(a.tz, now);
  return hour >= a.hour && hour < a.hour + WINDOW_HOURS ? day : null;
}

/** Токен Threads живёт 60 дней; продлеваем, когда до конца меньше двух недель. */
async function freshToken(a: Account): Promise<string> {
  const token = unseal(a.token);
  if (a.network !== "threads" || !a.token_expires_at || a.token_expires_at.getTime() - Date.now() > 14 * 86400_000) return token;
  try {
    const r = await threadsRefresh(token);
    const sql = await db();
    await sql`UPDATE social_accounts SET token = ${seal(r.token)}, token_expires_at = ${r.expiresAt} WHERE id = ${a.id}`;
    return r.token;
  } catch (e) {
    console.error(`[social] threads refresh failed for ${a.name}:`, e instanceof Error ? e.message : e);
    return token;
  }
}

/** Захват слота: новая строка с первой цитатой из очереди или повтор после явной ошибки. */
async function claim(a: Account, slot: string): Promise<{ id: string; share_id: string } | null> {
  const sql = await db();
  const [retry] = await sql<{ id: string; share_id: string }[]>`
    UPDATE social_posts SET status = 'sending', attempts = attempts + 1, error = NULL, updated_at = now()
    WHERE account_id = ${a.id} AND slot = ${slot} AND status = 'failed' AND attempts < ${MAX_ATTEMPTS}
    RETURNING id, share_id`;
  if (retry) return retry;
  if ((await sql`SELECT 1 FROM social_posts WHERE account_id = ${a.id} AND slot = ${slot}`).length) return null;
  if (isSupportedLocale(a.lang)) await refill(a.lang, [a.id]);
  const [next] = await queued(a.lang, 1, a.id);
  if (!next) {
    console.warn(`[social] no quotes left for ${a.lang} (${a.name})`);
    return null;
  }
  const [row] = await sql<{ id: string; share_id: string }[]>`
    INSERT INTO social_posts (account_id, slot, share_id) VALUES (${a.id}, ${slot}, ${next.share_id})
    ON CONFLICT DO NOTHING RETURNING id, share_id`;
  return row ?? null;
}

/** Публикует захваченный слот и записывает исход. */
async function send(a: Account, row: { id: string; share_id: string }): Promise<string> {
  const sql = await db();
  const share = await getShare(row.share_id);
  if (!share) {
    await sql`UPDATE social_posts SET status = 'failed', attempts = ${MAX_ATTEMPTS}, error = 'quote missing', updated_at = now() WHERE id = ${row.id}`;
    return "failed";
  }
  let token: string;
  try {
    token = await freshToken(a);
  } catch (e) {
    await sql`UPDATE social_posts SET status = 'failed', attempts = ${MAX_ATTEMPTS}, error = ${`token: ${e instanceof Error ? e.message : e}`}, updated_at = now() WHERE id = ${row.id}`;
    return "failed";
  }
  const r = await publish(a, token, postFor(share, a.network), async (container) => {
    await sql`UPDATE social_posts SET container_id = ${container}, updated_at = now() WHERE id = ${row.id}`;
  });
  if (r.ok) {
    await sql`UPDATE social_posts SET status = 'posted', post_id = ${r.postId}, url = ${r.url}, updated_at = now() WHERE id = ${row.id}`;
    return "posted";
  }
  const status = r.definite ? "failed" : "unknown";
  await sql`UPDATE social_posts SET status = ${status}, error = ${r.error.slice(0, 500)}, updated_at = now() WHERE id = ${row.id} AND status = 'sending'`;
  console.error(`[social] ${a.network} ${a.name}: ${status}: ${r.error}`);
  return status;
}

/** Один проход расписания. Возвращает исходы по аккаунтам. */
export async function tick(now = new Date()): Promise<Record<string, string>> {
  if (!dbConfigured()) return {};
  const sql = await db();
  // Запрос, оборвавшийся вместе с процессом, не повторяем: исход неизвестен.
  await sql`UPDATE social_posts SET status = 'unknown', error = 'interrupted', updated_at = now()
    WHERE status = 'sending' AND updated_at < now() - make_interval(mins => ${STALE_MINUTES})`;
  const accounts = await sql<Account[]>`SELECT * FROM social_accounts WHERE enabled`;
  const out: Record<string, string> = {};
  for (const a of accounts) {
    const slot = dueSlot(a, now);
    if (!slot) continue;
    try {
      const row = await claim(a, slot);
      if (row) out[`${a.network} ${a.name}`] = await send(a, row);
    } catch (e) {
      console.error(`[social] ${a.network} ${a.name}:`, e);
    }
  }
  return out;
}

/** «Опубликовать сейчас» из кабинета: nonce кнопки делает слот, двойной клик даёт один пост. */
export async function postNow(accountId: string, nonce: string): Promise<string> {
  const sql = await db();
  const [a] = await sql<Account[]>`SELECT * FROM social_accounts WHERE id = ${accountId}`;
  if (!a) return "not_found";
  const row = await claim(a, `manual:${nonce}`);
  return row ? send(a, row) : "nothing_to_post";
}

let running = false;
let timer: ReturnType<typeof setInterval> | null = null;

/** Запуск планировщика в процессе сервера: тик каждые 5 минут, проходы не накладываются. */
export function startScheduler() {
  if (timer || process.env.SOCIAL_AUTOPOST === "off" || !dbConfigured()) return;
  const run = async () => {
    if (running) return;
    running = true;
    try {
      const out = await tick();
      if (Object.keys(out).length) console.log("[social]", JSON.stringify(out));
    } catch (e) {
      console.error("[social] tick failed:", e);
    } finally {
      running = false;
    }
  };
  timer = setInterval(run, 5 * 60_000);
  setTimeout(run, 60_000);
}
