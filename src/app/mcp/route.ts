import { clientIp } from "@inite/mcp/site";
import { mcp } from "@/lib/agent/mcp";

export const dynamic = "force-dynamic";

// MCP без входа: поиск, чтение, каталог, заказ на почту читателя.
export const { POST, GET, OPTIONS } = mcp.route({ context: (req) => ({ reader: null, ip: clientIp(req) }) });
