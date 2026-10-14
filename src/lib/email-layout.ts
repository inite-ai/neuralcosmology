import "server-only";

// HTML-обёртка писем сайта: светлая карточка с логотипом, как в шапке сайта, кнопка
// цвета ссылок, подпись и мелкий подвал. Таблицы и инлайновые стили — так письмо
// одинаково выглядит в Gmail, Apple Mail и Outlook. Текстовая версия письма
// собирается отдельно и уходит вместе с этой.

const SITE = "https://neuralcosmology.com";
const C = { page: "#f4f4f1", card: "#ffffff", ink: "#0a0a0a", soft: "#3d3e47", muted: "#696969", line: "#e3e3df", accent: "#3d43c4" };
const SERIF = "Marcellus, Georgia, 'Times New Roman', serif";
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export type EmailBlock =
  | { kind: "p"; text: string }
  | { kind: "button"; label: string; href: string }
  | { kind: "links"; items: { title: string; href: string; meta?: string }[] }
  | { kind: "quote"; text: string; source?: string };

export type Email = {
  lang: string;
  /** Строка превью в списке писем. */
  preheader: string;
  title: string;
  blocks: EmailBlock[];
  signature?: string;
  /** Мелкий текст внизу: почему пришло письмо и ссылка на отписку. */
  footer: { text: string; link?: { label: string; href: string } };
};

function block(b: EmailBlock): string {
  switch (b.kind) {
    case "p":
      return `<p style="margin:0 0 16px;font:16px/1.6 ${SANS};color:${C.soft}">${esc(b.text)}</p>`;
    case "button":
      return (
        `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px"><tr>` +
        `<td style="background:${C.accent};border-radius:2px">` +
        `<a href="${esc(b.href)}" style="display:inline-block;padding:14px 26px;font:600 15px/1 ${SANS};letter-spacing:.02em;color:#ffffff;text-decoration:none">${esc(b.label)} &rarr;</a>` +
        `</td></tr></table>`
      );
    case "links":
      return (
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 20px;border-top:1px solid ${C.line}">` +
        b.items
          .map(
            (it) =>
              `<tr><td style="padding:14px 0;border-bottom:1px solid ${C.line}">` +
              `<a href="${esc(it.href)}" style="font:20px/1.3 ${SERIF};color:${C.ink};text-decoration:none">${esc(it.title)}</a>` +
              (it.meta ? `<div style="margin-top:4px;font:12px/1.4 ${SANS};letter-spacing:.06em;text-transform:uppercase;color:${C.muted}">${esc(it.meta)}</div>` : "") +
              `</td><td align="right" style="padding:14px 0 14px 12px;border-bottom:1px solid ${C.line};font:18px ${SANS};color:${C.accent}"><a href="${esc(it.href)}" style="color:${C.accent};text-decoration:none">&rarr;</a></td></tr>`,
          )
          .join("") +
        `</table>`
      );
    case "quote":
      return (
        `<div style="margin:4px 0 22px;padding:2px 0 2px 18px;border-left:2px solid ${C.accent}">` +
        `<p style="margin:0;font:19px/1.5 ${SERIF};color:${C.ink}">${esc(b.text)}</p>` +
        (b.source ? `<p style="margin:8px 0 0;font:12px/1.4 ${SANS};letter-spacing:.06em;text-transform:uppercase;color:${C.muted}">${esc(b.source)}</p>` : "") +
        `</div>`
      );
  }
}

export function emailHtml(e: Email): string {
  return `<!doctype html>
<html lang="${esc(e.lang)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>${esc(e.title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Marcellus&display=swap" rel="stylesheet"></head>
<body style="margin:0;padding:0;background:${C.page}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.page}">${esc(e.preheader)}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page}"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
<tr><td style="padding:0 4px 18px">
<a href="${SITE}/${esc(e.lang)}" style="text-decoration:none;color:${C.ink};font:22px/1.05 ${SERIF}">Neural<br><span style="font-style:italic">Cosmology</span></a>
</td></tr>
<tr><td style="background:${C.card};border:1px solid ${C.line};padding:36px 32px 28px">
<h1 style="margin:0 0 20px;font:400 28px/1.25 ${SERIF};color:${C.ink}">${esc(e.title)}</h1>
${e.blocks.map(block).join("\n")}
${e.signature ? `<p style="margin:24px 0 0;font:italic 17px/1.4 ${SERIF};color:${C.ink}">${esc(e.signature)}</p>` : ""}
</td></tr>
<tr><td style="padding:18px 4px 0;font:12px/1.6 ${SANS};color:${C.muted}">
${esc(e.footer.text)}${e.footer.link ? ` <a href="${esc(e.footer.link.href)}" style="color:${C.muted};text-decoration:underline">${esc(e.footer.link.label)}</a>` : ""}
<br><a href="${SITE}" style="color:${C.muted};text-decoration:none">neuralcosmology.com</a>
</td></tr>
</table>
</td></tr></table>
</body></html>`;
}
