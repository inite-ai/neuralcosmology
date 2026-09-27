import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { getBookBySlug } from "@/content/books";
import { dbConfigured } from "@/lib/db";
import { pickLocalized } from "@/lib/i18n";
import { googleFont } from "@/lib/og-fonts";
import { authorName, excerpt } from "@/lib/reader/quote";
import { getShare } from "@/lib/reader/share";

// Карточка цитаты для соцсетей (og:image страниц /q/{id} и кнопка «PNG»): 1200×630,
// бумага, цитата набрана Forum, внизу книга и знак сайта. Текст берётся только
// из сохранённой и сверенной с главой цитаты: произвольную фразу под именем
// автора через параметры не нарисовать.
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") || "";
  const s = dbConfigured() ? await getShare(id).catch(() => null) : null;
  const b = s && getBookBySlug(s.book);
  if (!s || !b) return new Response("not found", { status: 404 });

  const quote = excerpt(s.quote, 240);
  const book = pickLocalized(b.titles, s.lang);
  const author = authorName(s.lang);
  const [open, close] = s.lang === "ru" || s.lang === "es" ? ["«", "»"] : ["“", "”"];
  // Кегль подбирается под длину: строки ширины ~936px (средний знак Forum ≈ 0.55em),
  // высота текста не больше ~300px, чтобы цитата не наезжала на подпись.
  let size = 68;
  while (size > 30 && Math.ceil((quote.length * 0.55 * size) / 900) * size * 1.18 > 300) size -= 2;
  const site = ({ ru: "Нейронная космология", pt: "Cosmologia Neural", es: "Cosmología Neural" } as Record<string, string>)[s.lang] ?? "Neural Cosmology";
  const font = await googleFont("Forum", `«»“”—·…${quote}${book}${author}${site}`);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#f9f9f9", color: "#0a0a0a", padding: "64px 72px", fontFamily: font ? "Forum" : "serif" }}>
        <div style={{ display: "flex", flex: 1, border: "1px solid #b2b2b1", padding: "56px 64px", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: size, lineHeight: 1.18, letterSpacing: "-0.01em" }}>{`${open}${quote}${close}`}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid #b2b2b1", paddingTop: 28 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 34 }}>{book}</div>
              <div style={{ fontSize: 22, color: "#696969", marginTop: 6 }}>{author}</div>
            </div>
            <div style={{ fontSize: 26, color: "#3d43c4" }}>{site}</div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts: font ? [{ name: "Forum", data: font, style: "normal", weight: 400 }] : undefined, headers: { "Cache-Control": "public, max-age=86400, immutable" } },
  );
}
