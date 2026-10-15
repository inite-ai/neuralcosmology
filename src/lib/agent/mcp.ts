import "server-only";
import { SUPPORTED_LOCALES, isSupportedLocale, type SupportedLocale } from "@/lib/get-locale";
import { markdownFor } from "@/lib/agent/markdown";
import { search } from "@/lib/agent/search";
import { catalog } from "@/lib/agent/catalog";
import { CheckoutError, createAgentCheckout } from "@/lib/agent/checkout";
import { ownsBook } from "@/lib/access";
import { books } from "@/content/books";
import { siteUrl } from "@/lib/auth";
import { createSiteMcp, protectedResource, textResult, jsonResult, type SiteTool, type ToolResult } from "@inite/mcp/site";

// MCP-сервер сайта на @inite/mcp/site (Streamable HTTP без сессий, ответы
// JSON). Две точки: /mcp — без входа; /mcp/account — агент вошёл от имени
// читателя через INITE Auth (OAuth), заказы ложатся на его аккаунт, купленные
// книги читаются целиком, заказ сразу оплачивается из кошелька INITE, если
// читатель это разрешил.

export type Reader = { sub: string; email?: string };
export type Ctx = { reader: Reader | null; ip: string };

/** /mcp/account: метаданные RFC 9728 и 401, с которого MCP-клиент начинает вход. */
export const account = () =>
  protectedResource({ site: siteUrl(), path: "/mcp/account", name: "Neural Cosmology", documentation: `${siteUrl()}/llms.txt` });

const localeSchema = { type: "string", enum: [...SUPPORTED_LOCALES], description: "Language: en, ru, pt or es." };

function tools(ctx: Ctx) {
  const list = [
    {
      name: "search",
      title: "Search the site",
      description:
        "Search Neural Cosmology: answers to questions about consciousness, cosmology, physics and biology; essays; interactive experiments; books and their chapters. Returns titles, URLs and markdown URLs to pass to read.",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "What to look for, in any of the four languages." },
          locale: localeSchema,
          limit: { type: "integer", minimum: 1, maximum: 25, default: 10 },
        },
        required: ["query"],
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    {
      name: "read",
      title: "Read a page",
      description: ctx.reader
        ? "Read any page of the site as markdown: an answer, essay, experiment, book page or chapter. Chapters of books the signed-in reader owns come in full; other paid chapters give their open opening."
        : "Read any page of the site as markdown: an answer, essay, experiment, book page or chapter. Paid chapters give their open opening and how to buy the book.",
      inputSchema: {
        type: "object",
        properties: { url: { type: "string", description: "Page URL or path, e.g. /en/answers/what-is-dark-matter." } },
        required: ["url"],
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    {
      name: "list_books",
      title: "List books and prices",
      description:
        "The books, their languages, chapters (free, open opening, or paid) and prices of online access in each currency.",
      inputSchema: { type: "object", properties: {} },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    {
      name: "create_checkout",
      title: "Open a checkout",
      description: ctx.reader
        ? "Open a checkout for online access to a book (or the whole library) for the signed-in reader. Returns a payment link to give to the reader; nothing is charged until they pay."
        : "Open a checkout for online access to a book (or the whole library) for a reader, tied to their email. Returns a payment link to give to the reader; nothing is charged until they pay. After paying, the reader signs in on the site with that email and the book is theirs.",
      inputSchema: {
        type: "object",
        properties: {
          item: { type: "string", description: 'A book slug from list_books, or "library".' },
          email: ctx.reader
            ? { type: "string", description: "Not needed: the order goes to the signed-in reader." }
            : { type: "string", description: "The reader's email." },
          currency: { type: "string", description: "USD, RUB or BRL. Default: by language." },
          locale: localeSchema,
        },
        required: ctx.reader ? ["item"] : ["item", "email"],
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
  ];
  if (ctx.reader) {
    list.push({
      name: "my_library",
      title: "The reader's books",
      description: "Which books the signed-in reader owns and can read in full.",
      inputSchema: { type: "object", properties: {} },
      annotations: { readOnlyHint: true, openWorldHint: false },
    });
  }
  return list;
}

const text = textResult;
const json = jsonResult;

const str = (v: unknown) => (typeof v === "string" ? v : undefined);
const loc = (v: unknown): SupportedLocale | undefined => (typeof v === "string" && isSupportedLocale(v) ? v : undefined);

// Не больше нескольких заказов в минуту с одного адреса: инструмент открыт всем.
const checkouts = new Map<string, number[]>();
function allowCheckout(ip: string): boolean {
  const now = Date.now();
  const recent = (checkouts.get(ip) ?? []).filter((t) => now - t < 60_000);
  if (recent.length >= 5) return false;
  checkouts.set(ip, [...recent, now]);
  return true;
}

async function owned(reader: Reader): Promise<Set<string>> {
  const out = new Set<string>();
  for (const b of books) if (await ownsBook({ sub: reader.sub }, b.slug)) out.add(b.slug);
  return out;
}

async function callTool(name: string, args: Record<string, unknown>, ctx: Ctx): Promise<ToolResult | null> {
  switch (name) {
    case "search": {
      const query = str(args.query);
      if (!query) return text("query is required", true);
      const limit = typeof args.limit === "number" ? args.limit : 10;
      return json({ results: search(query, loc(args.locale), limit) });
    }
    case "read": {
      const raw = str(args.url);
      if (!raw) return text("url is required", true);
      let path = raw.trim();
      try {
        const u = new URL(path, siteUrl());
        if (u.origin !== new URL(siteUrl()).origin) return text("Only pages of this site can be read.", true);
        path = u.pathname;
      } catch {
        return text("Not a URL or path of this site.", true);
      }
      const mine = ctx.reader ? await owned(ctx.reader) : new Set<string>();
      const md = markdownFor(path, { unlocked: (slug) => mine.has(slug) });
      return md ? text(md.body) : text(`No page at ${path}. Use search to find one.`, true);
    }
    case "list_books":
      return json(catalog());
    case "create_checkout": {
      const item = str(args.item);
      if (!item) return text("item is required", true);
      if (!allowCheckout(ctx.ip)) return text("Too many checkouts from here; try again in a minute.", true);
      try {
        const res = await createAgentCheckout({
          item,
          locale: loc(args.locale) ?? "en",
          currency: str(args.currency),
          email: ctx.reader ? ctx.reader.email : str(args.email),
          userId: ctx.reader?.sub,
        });
        if (res.wallet?.status === "paid") {
          return json({
            ...res,
            instructions: res.wallet.confirming
              ? "Paid from the reader's INITE wallet; the payment is being confirmed on Base and the book opens in a minute or two. Do not send the checkoutUrl."
              : "Paid from the reader's INITE wallet. The book is open on the site under their account. Do not send the checkoutUrl.",
          });
        }
        if (res.wallet?.status === "needs_approval") {
          return json({
            ...res,
            instructions:
              "Give the reader the wallet.approveUrl: one page where they allow this site to charge their INITE wallet (with a passkey), top up if needed, and pay this order. Or give them the checkoutUrl to pay by card or PIX.",
          });
        }
        return json({
          ...res,
          instructions:
            (res.forAccount
              ? "Give the reader the checkoutUrl. Once paid, the book opens on the site under their account."
              : "Give the reader the checkoutUrl. After paying they are asked to sign in on the site; signing in with the same email gives them the book.") +
            (res.x402Url
              ? " If you hold a wallet and the reader agreed to the price, you can pay yourself instead: x402Url speaks x402 (USDC on Base) — GET it for the terms (HTTP 402), then repeat with a signed payment. An agent connected to the reader's INITE wallet (https://billing.inite.ai/mcp/wallet) can simply call its `pay` tool with x402Url and the price as maxAmount."
              : ""),
        });
      } catch (err) {
        return text(err instanceof CheckoutError ? err.message : "Checkout could not be created.", true);
      }
    }
    case "my_library": {
      if (!ctx.reader) return text("Sign in first (use the /mcp/account endpoint).", true);
      const mine = await owned(ctx.reader);
      return json({ books: books.filter((b) => mine.has(b.slug)).map((b) => ({ slug: b.slug, title: b.titles.en })) });
    }
    default:
      return null;
  }
}

const INSTRUCTIONS =
  "Neural Cosmology by Mikhail Savchenko: answers, essays, experiments and books on consciousness, cosmology and computation, in English, Russian, Portuguese and Spanish. Use search, then read. Paid book chapters show an open opening; create_checkout opens a payment link for a reader.";

export const mcp = createSiteMcp<Ctx>({
  name: "neuralcosmology",
  title: "Neural Cosmology",
  version: "1.1.0",
  instructions: (ctx) =>
    INSTRUCTIONS +
    (ctx.reader
      ? " You are signed in as the reader: their books read in full, and orders are paid from their INITE wallet when they allowed this site."
      : " To act as a signed-in reader, connect to /mcp/account instead."),
  tools: (ctx): SiteTool<Ctx>[] =>
    tools(ctx).map((tool) => ({
      ...tool,
      call: async (args: Record<string, unknown>) =>
        (await callTool(tool.name, args, ctx)) ?? text(`Unknown tool: ${tool.name}`, true),
    })),
});
