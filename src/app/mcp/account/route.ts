import { accountAudiences, accountEndpoint } from "@/lib/agent/mcp";
import { verifyAgentToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

// MCP от имени читателя: агент получает токен в INITE Auth (OAuth 2.1 +
// PKCE, динамическая регистрация клиента), заказы идут на аккаунт читателя,
// купленные книги читаются целиком. Без токена — 401 с resource_metadata,
// по которому MCP-клиент сам проводит читателя через вход. Области токена
// (neuralcosmology:discuss, neuralcosmology:author) проверяются на инструментах читалки.

// Один обработчик на процесс: в нём счётчик лимита частоты (60 в минуту с адреса).
let route: ReturnType<typeof accountEndpoint> | undefined;
const endpoint = () => (route ??= accountEndpoint((token) => verifyAgentToken(token, accountAudiences())));

export const POST = (req: Request) => endpoint().POST(req);
export const GET = () => endpoint().GET();
export const OPTIONS = () => endpoint().OPTIONS();
