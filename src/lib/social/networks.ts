import "server-only";

// Публикация в Telegram (бот — админ канала), Threads и на страницу Facebook.
// Каждая функция различает два вида неудачи: сеть ответила ошибкой — поста точно нет,
// можно повторить; ответа не было (обрыв, таймаут) — пост мог выйти, повтор запрещён.

export type Network = "telegram" | "threads" | "facebook";
export type Post = { text: string; html: string; image: string; link: string };
export type Published = { ok: true; postId: string; url: string | null } | { ok: false; definite: boolean; error: string };

const TIMEOUT = 30_000;
const GRAPH_FB = "https://graph.facebook.com/v25.0";
const GRAPH_THREADS = "https://graph.threads.net";

class ApiError extends Error {}

/** Запрос, после которого ясно, ответила ли сеть. ApiError — явный отказ; обрыв, таймаут и 5xx — Error. */
async function call(url: string, init: RequestInit = {}): Promise<Record<string, unknown>> {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT) });
  const body = (await res.json().catch(() => null)) as Record<string, unknown> | null;
  const err = body?.error as { message?: string; code?: number } | undefined;
  const message = err?.message || (body?.description as string) || `HTTP ${res.status}`;
  // 5xx — сеть могла успеть опубликовать: исход неизвестен.
  if (res.status >= 500) throw new Error(message);
  if (!body || !res.ok || err || body.ok === false) throw new ApiError(message);
  return body;
}

const form = (params: Record<string, string>) => ({
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams(params).toString(),
});

function failure(e: unknown): Published {
  return e instanceof ApiError ? { ok: false, definite: true, error: e.message } : { ok: false, definite: false, error: e instanceof Error ? e.message : String(e) };
}

// ---- Telegram ----

const tg = (token: string, method: string, params: Record<string, unknown>) =>
  call(`https://api.telegram.org/bot${token}/${method}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(params) }).then(
    (b) => b.result as Record<string, unknown>,
  );

/** Бот и канал: бот должен быть администратором с правом публикации. */
export async function telegramConnect(token: string, channel: string): Promise<{ id: string; name: string }> {
  const me = await tg(token, "getMe", {});
  const chat = await tg(token, "getChat", { chat_id: channel.startsWith("@") || /^-?\d+$/.test(channel) ? channel : `@${channel}` });
  const member = await tg(token, "getChatMember", { chat_id: chat.id, user_id: me.id });
  if (member.status !== "administrator" && member.status !== "creator") throw new Error("bot_not_admin");
  if (member.status === "administrator" && member.can_post_messages === false) throw new Error("bot_cannot_post");
  return { id: String(chat.id), name: chat.username ? `@${chat.username}` : String(chat.title ?? chat.id) };
}

async function telegramPublish(token: string, chatId: string, name: string, p: Post): Promise<Published> {
  try {
    const m = await tg(token, "sendPhoto", { chat_id: chatId, photo: p.image, caption: p.html, parse_mode: "HTML" });
    const id = String(m.message_id);
    return { ok: true, postId: id, url: name.startsWith("@") ? `https://t.me/${name.slice(1)}/${id}` : null };
  } catch (e) {
    return failure(e);
  }
}

// ---- Threads ----

export const threadsConfigured = () => Boolean(process.env.THREADS_APP_ID && process.env.THREADS_APP_SECRET);

export function threadsAuthUrl(redirectUri: string, state: string): string {
  const q = new URLSearchParams({ client_id: process.env.THREADS_APP_ID!, redirect_uri: redirectUri, scope: "threads_basic,threads_content_publish", response_type: "code", state });
  return `https://threads.com/oauth/authorize?${q}`;
}

/** Код → долгий токен (60 дней) и профиль. */
export async function threadsExchange(code: string, redirectUri: string): Promise<{ id: string; name: string; token: string; expiresAt: Date }> {
  const short = await call(`${GRAPH_THREADS}/oauth/access_token`, form({
    client_id: process.env.THREADS_APP_ID!,
    client_secret: process.env.THREADS_APP_SECRET!,
    code: code.replace(/#_$/, ""),
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
  }));
  const long = await call(`${GRAPH_THREADS}/access_token?${new URLSearchParams({ grant_type: "th_exchange_token", client_secret: process.env.THREADS_APP_SECRET!, access_token: String(short.access_token) })}`);
  const token = String(long.access_token);
  const me = await call(`${GRAPH_THREADS}/v1.0/me?${new URLSearchParams({ fields: "id,username", access_token: token })}`);
  return { id: String(me.id), name: `@${me.username}`, token, expiresAt: new Date(Date.now() + Number(long.expires_in) * 1000) };
}

/** Продление долгого токена ещё на 60 дней (можно, когда ему больше суток). */
export async function threadsRefresh(token: string): Promise<{ token: string; expiresAt: Date }> {
  const r = await call(`${GRAPH_THREADS}/refresh_access_token?${new URLSearchParams({ grant_type: "th_refresh_token", access_token: token })}`);
  return { token: String(r.access_token), expiresAt: new Date(Date.now() + Number(r.expires_in) * 1000) };
}

/**
 * Контейнер с картинкой, ожидание обработки, публикация. Контейнер сам по себе ничего
 * не публикует; onContainer сохраняет его до публикации, чтобы было видно, где остановились.
 */
async function threadsPublish(token: string, userId: string, p: Post, onContainer: (id: string) => Promise<void>): Promise<Published> {
  const base = `${GRAPH_THREADS}/v1.0/${userId}`;
  let container: string;
  try {
    container = String((await call(`${base}/threads`, form({ media_type: "IMAGE", image_url: p.image, text: p.text, access_token: token }))).id);
    await onContainer(container);
    for (let i = 0; i < 12; i++) {
      await new Promise((r) => setTimeout(r, i === 0 ? 10_000 : 5_000));
      const s = await call(`${GRAPH_THREADS}/v1.0/${container}?${new URLSearchParams({ fields: "status,error_message", access_token: token })}`);
      if (s.status === "FINISHED") break;
      if (s.status === "ERROR" || s.status === "EXPIRED") throw new ApiError(String(s.error_message || s.status));
    }
  } catch (e) {
    // До публикации пост не выходит ни при каком исходе.
    return { ok: false, definite: true, error: e instanceof Error ? e.message : String(e) };
  }
  try {
    const id = String((await call(`${base}/threads_publish`, form({ creation_id: container, access_token: token }))).id);
    const link = await call(`${GRAPH_THREADS}/v1.0/${id}?${new URLSearchParams({ fields: "permalink", access_token: token })}`).catch(() => null);
    return { ok: true, postId: id, url: (link?.permalink as string) ?? null };
  } catch (e) {
    return failure(e);
  }
}

// ---- Facebook ----

export const facebookConfigured = () => Boolean(process.env.META_APP_ID && process.env.META_APP_SECRET);

export function facebookAuthUrl(redirectUri: string, state: string): string {
  const q = new URLSearchParams({ client_id: process.env.META_APP_ID!, redirect_uri: redirectUri, state, response_type: "code", scope: "pages_show_list,pages_manage_posts,pages_read_engagement" });
  return `https://www.facebook.com/v25.0/dialog/oauth?${q}`;
}

/** Код → долгий токен человека → токены его страниц (у таких токенов нет срока). */
export async function facebookPages(code: string, redirectUri: string): Promise<{ id: string; name: string; token: string }[]> {
  const id = process.env.META_APP_ID!;
  const secret = process.env.META_APP_SECRET!;
  const short = await call(`${GRAPH_FB}/oauth/access_token?${new URLSearchParams({ client_id: id, client_secret: secret, redirect_uri: redirectUri, code })}`);
  const long = await call(`${GRAPH_FB}/oauth/access_token?${new URLSearchParams({ grant_type: "fb_exchange_token", client_id: id, client_secret: secret, fb_exchange_token: String(short.access_token) })}`);
  const pages = await call(`${GRAPH_FB}/me/accounts?${new URLSearchParams({ fields: "id,name,access_token,tasks", access_token: String(long.access_token) })}`);
  return ((pages.data as { id: string; name: string; access_token: string; tasks?: string[] }[]) ?? [])
    .filter((pg) => !pg.tasks || pg.tasks.includes("CREATE_CONTENT"))
    .map((pg) => ({ id: pg.id, name: pg.name, token: pg.access_token }));
}

async function facebookPublish(token: string, pageId: string, p: Post): Promise<Published> {
  try {
    const id = String((await call(`${GRAPH_FB}/${pageId}/feed`, form({ message: p.text, link: p.link, access_token: token }))).id);
    return { ok: true, postId: id, url: `https://www.facebook.com/${id}` };
  } catch (e) {
    return failure(e);
  }
}

export function publish(
  a: { network: Network; external_id: string; name: string },
  token: string,
  p: Post,
  onContainer: (id: string) => Promise<void>,
): Promise<Published> {
  if (a.network === "telegram") return telegramPublish(token, a.external_id, a.name, p);
  if (a.network === "threads") return threadsPublish(token, a.external_id, p, onContainer);
  return facebookPublish(token, a.external_id, p);
}
