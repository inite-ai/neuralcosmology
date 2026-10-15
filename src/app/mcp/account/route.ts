import { serveMcp, noStream, preflight, CORS } from "@/lib/agent/http";
import { siteUrl, verifyAgentToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

// MCP от имени читателя: агент получает токен в INITE Auth (OAuth 2.1 +
// PKCE, динамическая регистрация клиента), заказы идут на аккаунт читателя,
// купленные книги читаются целиком.
export async function POST(req: Request) {
  const site = siteUrl();
  const token = req.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  const reader = token ? await verifyAgentToken(token, [`${site}/mcp/account`, `${site}/mcp`, site]) : null;
  if (!reader) {
    return new Response(JSON.stringify({ error: "invalid_token", error_description: "Sign in with INITE to use this endpoint." }), {
      status: 401,
      headers: {
        ...CORS,
        "Content-Type": "application/json",
        "WWW-Authenticate": `Bearer resource_metadata="${site}/.well-known/oauth-protected-resource/mcp/account"`,
      },
    });
  }
  return serveMcp(req, { sub: reader.sub, email: reader.emailVerified ? reader.email : undefined });
}
export const GET = noStream;
export const OPTIONS = preflight;
