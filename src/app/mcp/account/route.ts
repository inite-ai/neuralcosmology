import { clientIp } from "@inite/mcp/site";
import { account, mcp } from "@/lib/agent/mcp";
import { siteUrl, verifyAgentToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

// MCP от имени читателя: агент получает токен в INITE Auth (OAuth 2.1 +
// PKCE, динамическая регистрация клиента), заказы идут на аккаунт читателя,
// купленные книги читаются целиком. Без токена — 401 с resource_metadata,
// по которому MCP-клиент сам проводит читателя через вход.
type Signed = { sub: string; email?: string; emailVerified: boolean };

const endpoint = () => {
  const site = siteUrl();
  return mcp.route({
    resource: account(),
    authenticate: (token) => verifyAgentToken(token, [`${site}/mcp/account`, `${site}/mcp`, site]),
    context: (req, principal) => {
      const r = principal as Signed;
      return { reader: { sub: r.sub, email: r.emailVerified ? r.email : undefined }, ip: clientIp(req) };
    },
  });
};

export const POST = (req: Request) => endpoint().POST(req);
export const GET = () => endpoint().GET();
export const OPTIONS = () => endpoint().OPTIONS();
