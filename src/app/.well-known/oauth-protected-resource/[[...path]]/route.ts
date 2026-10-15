import { protectedResourcesRoute } from "@inite/mcp/site";
import { account } from "@/lib/agent/mcp";

export const dynamic = "force-dynamic";

// RFC 9728: где агенту взять токен для /mcp/account.
export const GET = (req: Request, ctx: { params: Promise<{ path?: string[] }> }) =>
  protectedResourcesRoute([account()])(req, ctx);
