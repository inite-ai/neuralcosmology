import "server-only";
import { handleMcp, type Reader } from "@/lib/agent/mcp";

export const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Mcp-Session-Id, Mcp-Protocol-Version",
  "Access-Control-Expose-Headers": "WWW-Authenticate, Mcp-Session-Id",
};

export const clientIp = (req: Request) =>
  req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

export async function serveMcp(req: Request, reader: Reader | null): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }, { status: 400, headers: CORS });
  }
  const res = await handleMcp(body, { reader, ip: clientIp(req) });
  for (const [k, v] of Object.entries(CORS)) res.headers.set(k, v);
  return res;
}

// Сервер без сессий: потока событий по GET нет.
export const noStream = () => new Response("Method Not Allowed", { status: 405, headers: { ...CORS, Allow: "POST" } });
export const preflight = () => new Response(null, { status: 204, headers: CORS });
