import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

// Карточка цитаты для соцсетей (og:image ссылок «Поделиться»): 1200×630,
// бумага, цитата набрана Forum, внизу книга и знак сайта.
export const runtime = "nodejs";

async function forum(text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Forum&text=${encodeURIComponent(text)}`,
      // Старый UA → Google отдаёт TTF (next/og не читает woff2).
      { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/534.30 (KHTML, like Gecko) Chrome/12.0.742.122 Safari/534.30" } },
    ).then((r) => r.text());
    const url = css.match(/src: url\(([^)]+)\)/)?.[1];
    return url ? await fetch(url).then((r) => r.arrayBuffer()) : null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const quote = (p.get("q") || "").slice(0, 280);
  const book = (p.get("b") || "").slice(0, 80);
  const author = (p.get("a") || "Mikhail Savchenko").slice(0, 60);
  const size = quote.length > 200 ? 46 : quote.length > 120 ? 56 : 68;
  const font = await forum(`«»—·${quote}${book}${author}Neural Cosmology`);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#f9f9f9", color: "#0a0a0a", padding: "64px 72px", fontFamily: font ? "Forum" : "serif" }}>
        <div style={{ display: "flex", flex: 1, border: "1px solid #b2b2b1", padding: "56px 64px", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: size, lineHeight: 1.15, letterSpacing: "-0.01em" }}>«{quote}»</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid #b2b2b1", paddingTop: 28 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 34 }}>{book}</div>
              <div style={{ fontSize: 22, color: "#696969", marginTop: 6 }}>{author}</div>
            </div>
            <div style={{ fontSize: 26, color: "#3d43c4" }}>Neural Cosmology</div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts: font ? [{ name: "Forum", data: font, style: "normal", weight: 400 }] : undefined, headers: { "Cache-Control": "public, max-age=86400, immutable" } },
  );
}
