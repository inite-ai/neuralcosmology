// /.well-known/mcp/server-card.json — карточка сервера семейства из реестра дверей INITE (@inite/mcp/registry).
import { serverCardResponse } from "@inite/mcp/registry";

export const dynamic = "force-static";

export function GET() {
  return serverCardResponse("https://neuralcosmology.com");
}
