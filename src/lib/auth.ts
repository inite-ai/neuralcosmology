import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify, createRemoteJWKSet, base64url, type JWTVerifyGetKey } from "jose";
import { db, dbConfigured } from "@/lib/db";
import { claimGuestPurchases } from "@/lib/agent/claim";

// Вход через INITE Auth (auth-api.inite.ai): authorization code + PKCE на
// сервере, id_token проверяется по JWKS, дальше живём на своей подписанной
// httpOnly-сессии. Токены IdP в браузер не попадают и нигде не хранятся.
// Выход в INITE доходит сюда back-channel-уведомлением (/api/auth/backchannel-logout):
// момент выхода пишется в auth_logouts, и сессии, выданные раньше, больше не принимаются.

export interface Session {
  sub: string;
  email?: string;
  name?: string;
  /** INITE подтвердило адрес (email_verified в id_token при входе). */
  emailVerified?: boolean;
  /** Админ INITE (roles / metadata.isAdmin в id_token при входе). */
  admin?: boolean;
}

const SESSION_COOKIE = "nc_session";
const FLOW_COOKIE = "nc_oauth";
const SESSION_TTL = 60 * 60 * 24 * 30;

const issuer = () => process.env.INITE_AUTH_ISSUER || "https://auth-api.inite.ai";
const clientId = () => requireEnv("INITE_AUTH_CLIENT_ID");
const clientSecret = () => requireEnv("INITE_AUTH_CLIENT_SECRET");
export const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL || "https://neuralcosmology.com";
const redirectUri = () => `${siteUrl()}/api/auth/callback`;

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

function secret(): Uint8Array {
  return new TextEncoder().encode(requireEnv("SESSION_SECRET"));
}

export function authConfigured(): boolean {
  return Boolean(
    process.env.INITE_AUTH_CLIENT_ID &&
      process.env.INITE_AUTH_CLIENT_SECRET &&
      process.env.SESSION_SECRET,
  );
}

// ---------- discovery ----------

interface Discovery {
  authorization_endpoint: string;
  token_endpoint: string;
  jwks_uri: string;
  end_session_endpoint?: string;
}

let discovery: Promise<Discovery> | null = null;
let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getDiscovery(): Promise<Discovery> {
  discovery ??= fetch(`${issuer()}/.well-known/openid-configuration`)
    .then((r) => {
      if (!r.ok) throw new Error(`OIDC discovery failed: ${r.status}`);
      return r.json() as Promise<Discovery>;
    })
    .catch((err) => {
      discovery = null;
      throw err;
    });
  return discovery;
}

async function getJwks() {
  jwks ??= createRemoteJWKSet(new URL((await getDiscovery()).jwks_uri));
  return jwks;
}

// ---------- helpers ----------

const random = (bytes = 32) => base64url.encode(crypto.getRandomValues(new Uint8Array(bytes)));

async function s256(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return base64url.encode(new Uint8Array(digest));
}

/** Разрешаем возвращаться только на свои относительные пути. */
export function safeReturnTo(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return "/";
  }
  return value;
}

const cookieBase = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

// ---------- flow ----------

export async function beginLogin(returnTo: string): Promise<string> {
  const d = await getDiscovery();
  const state = random(16);
  const nonce = random(16);
  const verifier = random(32);

  const flow = await new SignJWT({ state, nonce, verifier, returnTo: safeReturnTo(returnTo) })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15m")
    .sign(secret());
  (await cookies()).set(FLOW_COOKIE, flow, { ...cookieBase, maxAge: 15 * 60 });

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId(),
    redirect_uri: redirectUri(),
    scope: "openid profile email",
    state,
    nonce,
    code_challenge: await s256(verifier),
    code_challenge_method: "S256",
  });
  return `${d.authorization_endpoint}?${params}`;
}

export async function completeLogin(code: string, state: string): Promise<string> {
  const jar = await cookies();
  const raw = jar.get(FLOW_COOKIE)?.value;
  jar.delete(FLOW_COOKIE);
  if (!raw) throw new Error("login flow expired");

  const { payload: flow } = await jwtVerify<{
    state: string;
    nonce: string;
    verifier: string;
    returnTo: string;
  }>(raw, secret());
  if (flow.state !== state) throw new Error("state mismatch");

  const d = await getDiscovery();
  const res = await fetch(d.token_endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri(),
      client_id: clientId(),
      client_secret: clientSecret(),
      code_verifier: flow.verifier,
    }),
  });
  if (!res.ok) throw new Error(`token exchange failed: ${res.status} ${await res.text()}`);
  const tokens = (await res.json()) as { id_token?: string };
  if (!tokens.id_token) throw new Error("no id_token in token response");

  const { payload } = await jwtVerify(tokens.id_token, await getJwks(), {
    issuer: issuer(),
    audience: clientId(),
  });
  if (payload.nonce !== flow.nonce) throw new Error("nonce mismatch");
  if (!payload.sub) throw new Error("id_token without sub");

  const email = typeof payload.email === "string" ? payload.email : undefined;
  await setSession({
    sub: payload.sub,
    email,
    name: typeof payload.name === "string" ? payload.name : undefined,
    emailVerified: payload.email_verified === true,
    admin: isAdminClaims(payload),
  });
  if (email && payload.email_verified === true) await claimGuestPurchases(payload.sub, email);
  return flow.returnTo;
}

/**
 * Access token агента (MCP-клиента), выданный INITE Auth от имени читателя.
 * Принимаем только токены, выпущенные для этого сайта: audience — адрес MCP
 * или сам сайт (RFC 8707), чужие токены не пропускаем.
 */
export interface AgentPrincipal {
  sub: string;
  email?: string;
  emailVerified: boolean;
  /** Админ INITE (roles или metadata.isAdmin), как и в сессии сайта. */
  admin: boolean;
  name?: string;
  /** Области токена (`scope` строкой или `scopes` списком): @inite/mcp/site сверяет их с областью инструмента. */
  scopes: string[];
}

/** Админ INITE: в токене roles содержит "admin" или metadata.isAdmin. */
export const isAdminClaims = (p: Record<string, unknown>): boolean =>
  (Array.isArray(p.roles) && p.roles.includes("admin")) ||
  (p.metadata as { isAdmin?: unknown } | undefined)?.isAdmin === true;

const scopesOf = (p: Record<string, unknown>): string[] =>
  Array.isArray(p.scopes)
    ? p.scopes.filter((s): s is string => typeof s === "string")
    : typeof p.scope === "string"
      ? p.scope.split(/\s+/).filter(Boolean)
      : [];

/** Ключи и издатель для проверки: по умолчанию JWKS и issuer INITE Auth; тесты подставляют свои. */
export type AgentKeys = { keys?: JWTVerifyGetKey; issuer?: string };

export async function verifyAgentToken(token: string, audiences: string[], with_: AgentKeys = {}): Promise<AgentPrincipal | null> {
  try {
    const { payload } = await jwtVerify(token, with_.keys ?? (await getJwks()), { issuer: with_.issuer ?? issuer(), audience: audiences });
    if (!payload.sub) return null;
    return {
      sub: payload.sub,
      email: typeof payload.email === "string" ? payload.email : undefined,
      emailVerified: payload.email_verified === true,
      admin: isAdminClaims(payload),
      name: typeof payload.name === "string" ? payload.name : undefined,
      scopes: scopesOf(payload),
    };
  } catch {
    return null;
  }
}

export async function logoutUrl(returnTo: string): Promise<string> {
  (await cookies()).delete(SESSION_COOKIE);
  const target = `${siteUrl()}${safeReturnTo(returnTo)}`;
  try {
    const d = await getDiscovery();
    if (!d.end_session_endpoint) return target;
    const params = new URLSearchParams({
      client_id: clientId(),
      post_logout_redirect_uri: target,
    });
    return `${d.end_session_endpoint}?${params}`;
  } catch {
    return target;
  }
}

// ---------- session ----------

async function setSession(s: Session) {
  const token = await new SignJWT({ email: s.email, name: s.name, ev: s.emailVerified === true, adm: s.admin === true })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(s.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL}s`)
    .sign(secret());
  (await cookies()).set(SESSION_COOKIE, token, { ...cookieBase, maxAge: SESSION_TTL });
}

export async function getSession(): Promise<Session | null> {
  if (!process.env.SESSION_SECRET) return null;
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const { payload } = await jwtVerify(raw, secret());
    if (!payload.sub) return null;
    if (await loggedOutSince(payload.sub, payload.iat ?? 0)) return null;
    return {
      sub: payload.sub,
      email: payload.email as string | undefined,
      name: payload.name as string | undefined,
      // Сессии, выданные до этих полей, их не несут: ни подтверждения, ни админа.
      emailVerified: payload.ev === true,
      admin: payload.adm === true,
    };
  } catch {
    return null;
  }
}

// ---------- back-channel logout ----------

const BACKCHANNEL_EVENT = "http://schemas.openid.net/event/backchannel-logout";

// Момент последнего выхода на пользователя. Кэш на минуту, чтобы не ходить в базу
// на каждый запрос; выход, принятый этим процессом, действует сразу.
const logouts = new Map<string, { at: number; checked: number }>();
const LOGOUT_CACHE_MS = 60_000;

async function loggedOutSince(sub: string, issuedAt: number): Promise<boolean> {
  if (!dbConfigured()) return false;
  let hit = logouts.get(sub);
  if (!hit || Date.now() - hit.checked > LOGOUT_CACHE_MS) {
    try {
      const sql = await db();
      const [row] = await sql<{ at: Date }[]>`SELECT at FROM auth_logouts WHERE sub = ${sub}`;
      hit = { at: row ? Math.floor(row.at.getTime() / 1000) : 0, checked: Date.now() };
      logouts.set(sub, hit);
    } catch {
      return false;
    }
  }
  return hit.at >= issuedAt;
}

/**
 * OIDC Back-Channel Logout: INITE присылает logout_token, когда пользователь
 * выходит у себя. Проверяем подпись, издателя, аудиторию и событие; все сессии
 * пользователя, выданные до этого момента, перестают действовать.
 */
export async function acceptLogoutToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, await getJwks(), {
      issuer: issuer(),
      audience: clientId(),
      maxTokenAge: "10m",
    });
    const events = payload.events as Record<string, unknown> | undefined;
    if (!payload.sub || !events || !(BACKCHANNEL_EVENT in events) || "nonce" in payload) return false;
    const sql = await db();
    await sql`INSERT INTO auth_logouts (sub, at) VALUES (${payload.sub}, now())
      ON CONFLICT (sub) DO UPDATE SET at = now()`;
    logouts.set(payload.sub, { at: Math.floor(Date.now() / 1000), checked: Date.now() });
    return true;
  } catch {
    return false;
  }
}
