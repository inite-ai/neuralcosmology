import { clientIp } from "@inite/mcp/site";
import { mcp } from "@/lib/agent/mcp";

export const dynamic = "force-dynamic";

// MCP без входа: поиск, чтение, каталог, заказ на почту читателя.
// 60 запросов в минуту с адреса: заголовки RateLimit в каждом ответе, на 429 точный Retry-After.
export const { POST, GET, OPTIONS } = mcp.route({
  context: (req) => ({ reader: null, ip: clientIp(req) }),
  rateLimit: { limit: 60, windowSeconds: 60 },
});
