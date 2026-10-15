import { serveMcp, noStream, preflight } from "@/lib/agent/http";

export const dynamic = "force-dynamic";

// MCP без входа: поиск, чтение, каталог, заказ на почту читателя.
export const POST = (req: Request) => serveMcp(req, null);
export const GET = noStream;
export const OPTIONS = preflight;
