import { readFile } from "node:fs/promises";
import { join, normalize } from "node:path";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { googleFont } from "@/lib/og-fonts";

// Превью ссылок 1200×630 в системе «The Plate Room»: бумага, линия-рамка,
// заголовок Forum, подпись Geist, справа — обложка или пластина раздела.
export const runtime = "nodejs";

const LABELS: Record<string, Record<string, string>> = {
  en: { answers: "Questions", answer: "Answer", home: "Research programme", books: "Library", book: "Book", chapter: "Read online", essays: "Essays", essay: "Essay", lectures: "Lectures", lecture: "Lecture", science: "Science", preprint: "Preprint", about: "Author", page: "Neural Cosmology" },
  ru: { answers: "Вопросы", answer: "Ответ", home: "Исследовательская программа", books: "Библиотека", book: "Книга", chapter: "Читать онлайн", essays: "Эссе", essay: "Эссе", lectures: "Лекции", lecture: "Лекция", science: "Наука", preprint: "Препринт", about: "Автор", page: "Нейронная космология" },
  pt: { answers: "Perguntas", answer: "Resposta", home: "Programa de pesquisa", books: "Biblioteca", book: "Livro", chapter: "Ler online", essays: "Ensaios", essay: "Ensaio", lectures: "Palestras", lecture: "Palestra", science: "Ciência", preprint: "Preprint", about: "Autor", page: "Cosmologia Neural" },
  es: { answers: "Preguntas", answer: "Respuesta", home: "Programa de investigación", books: "Biblioteca", book: "Libro", chapter: "Leer en línea", essays: "Ensayos", essay: "Ensayo", lectures: "Charlas", lecture: "Charla", science: "Ciencia", preprint: "Preprint", about: "Autor", page: "Cosmología Neural" },
};
const AUTHOR: Record<string, string> = { en: "Mikhail Savchenko", ru: "Михаил Савченко", pt: "Mikhail Savchenko", es: "Mikhail Savchenko" };

// Картинка раздела по умолчанию, если страница своей не передала.
const DEFAULT_IMAGE: Record<string, string> = {
  home: "/og/media/hero-web.jpg",
  books: "/og/media/observatory.jpg",
  chapter: "/og/media/observatory.jpg",
  essays: "/og/media/neurons.jpg",
  essay: "/og/media/neurons.jpg",
  lectures: "/og/media/landauer.jpg",
  lecture: "/og/media/landauer.jpg",
  science: "/og/media/plate-galaxy.jpg",
  preprint: "/og/media/plate-galaxy.jpg",
  about: "/og/media/observatory.jpg",
  answers: "/og/media/hero-web.jpg",
  answer: "/og/media/hero-web.jpg",
};

const MIME: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png" };

// Только растровые файлы из public/og и кадры иллюстраций книг (public/book/ill/*.og.jpg) —
// никаких внешних URL и выхода из папки.
async function localImage(path: string | null): Promise<{ src: string; cover: boolean } | null> {
  if (!path) return null;
  const clean = normalize(path).replace(/^\/+/, "");
  const ext = clean.split(".").pop()?.toLowerCase() ?? "";
  const allowed = clean.startsWith("og/") || (clean.startsWith("book/ill/") && clean.endsWith(".og.jpg"));
  if (!allowed || clean.includes("..") || !MIME[ext]) return null;
  try {
    const buf = await readFile(join(process.cwd(), "public", clean));
    return { src: `data:${MIME[ext]};base64,${buf.toString("base64")}`, cover: clean.startsWith("og/covers/") };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  // Старые ссылки (?title=&subtitle=&kind=) продолжают работать.
  const title = (p.get("t") || p.get("title") || "Neural Cosmology").slice(0, 140);
  const subtitle = (p.get("s") || p.get("subtitle") || "").slice(0, 220);
  const kind = (p.get("k") || p.get("kind") || "page").toLowerCase();
  const lang = LABELS[p.get("l") || ""] ? (p.get("l") as string) : /[а-яё]/i.test(title) ? "ru" : "en";
  const label = LABELS[lang][kind] ?? LABELS[lang].page;
  const author = AUTHOR[lang];
  const img = (await localImage(p.get("i"))) ?? (await localImage(DEFAULT_IMAGE[kind] ?? null));

  // Чем длиннее заголовок, тем мельче кегль и короче подпись — всё помещается в рамку.
  const n = title.length;
  const size = n > 80 ? 46 : n > 55 ? 54 : n > 34 ? 66 : 84;
  const room = n > 80 ? 0 : n > 55 ? 90 : n > 34 ? 120 : 170;
  const sub = subtitle.length > room ? (room ? `${subtitle.slice(0, room - 3).replace(/\s+\S*$/, "")}…` : "") : subtitle;

  const [forum, geist] = await Promise.all([
    googleFont("Forum", `${title}«»—–…’`),
    googleFont("Geist", `${label.toUpperCase()}${sub}${author}NEURAL COSMOLOGY/neuralcosmology.com…`),
  ]);
  const fonts = [
    forum && { name: "Forum", data: forum, style: "normal" as const, weight: 400 as const },
    geist && { name: "Geist", data: geist, style: "normal" as const, weight: 400 as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; style: "normal"; weight: 400 }[];

  const ink = "#0a0a0a";
  const muted = "#696969";
  const rule = "#b2b2b1";
  const accent = "#3d43c4";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#f9f9f9", padding: 40, fontFamily: "Geist" }}>
        <div style={{ display: "flex", flex: 1, border: `1px solid ${rule}` }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "44px 52px" }}>
            <div style={{ display: "flex", alignItems: "center", fontSize: 19, letterSpacing: "0.14em", color: muted }}>
              <span style={{ color: ink }}>NEURAL COSMOLOGY</span>
              <span style={{ margin: "0 14px", color: rule }}>/</span>
              <span style={{ color: accent }}>{label.toUpperCase()}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", marginBottom: "auto" }}>
              <div style={{ display: "flex", fontFamily: "Forum", fontSize: size, lineHeight: 1.04, letterSpacing: "-0.01em", color: ink }}>{title}</div>
              {sub ? <div style={{ display: "flex", marginTop: 24, fontSize: 25, lineHeight: 1.4, color: "#3c3c3c" }}>{sub}</div> : null}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${rule}`, paddingTop: 20, fontSize: 19, color: muted, letterSpacing: "0.04em" }}>
              <span>{author}</span>
              <span>neuralcosmology.com</span>
            </div>
          </div>
          {img ? (
            <div style={{ display: "flex", width: img.cover ? 330 : 390, borderLeft: `1px solid ${rule}`, alignItems: "center", justifyContent: "center", background: img.cover ? "#efefee" : ink, padding: img.cover ? 34 : 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt="" width={img.cover ? 262 : 390} height={img.cover ? 349 : 548} style={img.cover ? { boxShadow: "0 12px 30px rgba(0,0,0,0.25)" } : {}} />
            </div>
          ) : null}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: fonts.length ? fonts : undefined,
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800" },
    },
  );
}
