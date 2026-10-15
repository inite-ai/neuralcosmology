// Подтверждение домена для MCP-реестра (registry.modelcontextprotocol.io):
// публичный ключ, которым подписан вход при публикации com.neuralcosmology/*.
export function GET() {
  return new Response("v=MCPv1; k=ed25519; p=JOce9fadHLDqJgOG1U9qxF+Kd9MfADn7cEffuaAgrKM=\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
