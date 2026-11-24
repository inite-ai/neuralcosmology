import "server-only";
import { cookies } from "next/headers";
import { jwtVerify, createRemoteJWKSet, type JWTVerifyGetKey } from "jose";
import { createIniteAuth, safePath, type RevocationStore } from "@inite/auth/next";
import { db, dbConfigured } from "@/lib/db";
import { claimGuestPurchases } from "@/lib/agent/claim";

// Вход через INITE — семейный @inite/auth: code flow с PKCE, httpOnly-cookie, короткий
// access token, который продлевает middleware и SessionKeeper. Выход в INITE приходит на
// /api/auth/backchannel-logout; момент выхода лежит в auth_logouts.

export interface Session {
  sub: string;
  email?: string;
  name?: string;
  /** INITE подтвердило адрес (email_verified в токене). */
  emailVerified?: boolean;
  /** Админ INITE (platform_role superadmin). */
  admin?: boolean;
}

const issuer = () => process.env.INITE_AUTH_ISSUER || "https://auth-api.inite.ai";
export const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL || "https://neuralcosmology.com";

export function authConfigured(): boolean {
  return Boolean(process.env.INITE_AUTH_CLIENT_ID && process.env.INITE_AUTH_CLIENT_SECRET);
}

/** Разрешаем возвращаться только на свои относительные пути. */
export const safeReturnTo = (value: string | null | undefined): string => safePath(value) ?? "/";

const revocations: RevocationStore = {
  async revokedAt(sub) {
    if (!dbConfigured()) return null;
    const sql = await db();
    const [row] = await sql<{ at: Date }[]>`SELECT at FROM auth_logouts WHERE sub = ${sub}`;
    return row ? Math.floor(row.at.getTime() / 1000) : null;
  },
  async revoke(sub, at) {
    if (!dbConfigured()) return;
    const sql = await db();
    await sql`INSERT INTO auth_logouts (sub, at) VALUES (${sub}, to_timestamp(${at}))
      ON CONFLICT (sub) DO UPDATE SET at = GREATEST(auth_logouts.at, EXCLUDED.at)`;
  },
};

let kit: ReturnType<typeof createIniteAuth> | null = null;
/** Клиент входа; null — вход не настроен (локально, при сборке). */
export function auth() {
  if (!authConfigured()) return null;
  kit ??= createIniteAuth({
    appUrl: siteUrl(),
    revocations,
    onSignIn: async (s) => {
      if (s.email && s.emailVerified) await claimGuestPurchases(s.userId, s.email);
    },
  });
  return kit;
}

export async function getSession(): Promise<Session | null> {
  const a = auth();
  const s = a ? await a.sessionFromCookies(await cookies()) : null;
  return s && !s.demo
    ? { sub: s.userId, email: s.email ?? undefined, name: s.name ?? undefined, emailVerified: s.emailVerified, admin: s.isAdmin }
    : null;
}

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;
const getJwks = () => (jwks ??= createRemoteJWKSet(new URL(`${issuer()}/.well-known/jwks.json`)));

/**
 * Access token агента (MCP-клиента), выданный INITE Auth от имени читателя.
 * Принимаем только токены, выпущенные для этого сайта: audience — адрес MCP
 * или сам сайт (RFC 8707), чужие токены не пропускаем.
 */
export interface AgentPrincipal {
  sub: string;
  email?: string;
  emailVerified: boolean;
  /** Админ INITE, как и в сессии сайта. */
  admin: boolean;
  name?: string;
  /** Области токена (`scope` строкой или `scopes` списком): @inite/mcp/site сверяет их с областью инструмента. */
  scopes: string[];
}

/** Админ INITE — как в @inite/auth: platform_role "superadmin" и ничто другое. Роли в компании не в счёт. */
export const isAdminClaims = (p: Record<string, unknown>): boolean => p.platform_role === "superadmin" && p.org_role !== "customer";

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
    const { payload } = await jwtVerify(token, with_.keys ?? getJwks(), { issuer: with_.issuer ?? issuer(), audience: audiences });
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
