// Шрифты для next/og: Google Fonts с подмножеством глифов под конкретный текст.
// Старый UA → Google отдаёт TTF (satori не читает woff2).
const UA = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/534.30 (KHTML, like Gecko) Chrome/12.0.742.122 Safari/534.30";

export async function googleFont(family: string, text: string, weight = 400): Promise<ArrayBuffer | null> {
  try {
    const q = `family=${family.replace(/ /g, "+")}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await fetch(`https://fonts.googleapis.com/css2?${q}`, { headers: { "User-Agent": UA } }).then((r) => r.text());
    const url = css.match(/src: url\(([^)]+)\)/)?.[1];
    return url ? await fetch(url).then((r) => r.arrayBuffer()) : null;
  } catch {
    return null;
  }
}
