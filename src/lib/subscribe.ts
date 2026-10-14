import "server-only";
import { randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import { emailHtml } from "@/lib/email-layout";
import { mailConfigured, sendMail } from "@/lib/mail";
import { experimentView } from "@/lib/experiments";
import { getExperiment } from "@/lib/interactive";
import { getManifest } from "@/lib/library";
import { getBookBySlug } from "@/content/books";
import { pickLocalized } from "@/lib/i18n";
import type { SupportedLocale } from "@/lib/get-locale";

// Подписка на новые главы и опыты без аккаунта. Двойное подтверждение: письмо со
// ссылкой, адрес становится confirmed только после неё. Пока почта не настроена,
// адрес лежит в pending; POST /api/admin/subscribers рассылает подтверждения позже.
//
// Кроме обычной подписки адрес оставляют ради дела: «пришлите опыт и главу на почту»
// (kind later) и «откройте следующую главу» (kind unlock). Письмо уходит сразу — о нём
// попросили, — и в нём та же ссылка подтверждения: по ней адрес становится confirmed,
// а браузер получает cookie nc-sub, которой открывается первая платная глава книги.
// Рассылка новостей — только подтверждённым, как и раньше.

export type SubscribeKind = "confirm" | "later" | "unlock";
export const SUB_COOKIE = "nc-sub";

const SITE = "https://neuralcosmology.com";

type Copy = { subject: string; preheader: string; title: string; lead: string; cta: string; notYou: string; footer: string; unsub: string; signature: string };

const COPY: Record<SupportedLocale, Copy> = {
  ru: {
    subject: "Подтвердите подписку на Нейронную космологию",
    preheader: "Одно нажатие, и письма о новых главах и опытах будут приходить сюда.",
    title: "Подтвердите подписку",
    lead: "Вы оставили этот адрес на neuralcosmology.com. Подтвердите его, и я буду писать, когда выходят новые главы и опыты, не чаще раза в неделю.",
    cta: "Подтвердить подписку",
    notYou: "Если это были не вы, просто ничего не делайте: без подтверждения писем не будет.",
    footer: "Письмо пришло, потому что этот адрес оставили на сайте.",
    unsub: "Отписаться",
    signature: "Михаил Савченко",
  },
  en: {
    subject: "Confirm your Neural Cosmology subscription",
    preheader: "One click, and emails about new chapters and experiments will come here.",
    title: "Confirm your subscription",
    lead: "You left this address on neuralcosmology.com. Confirm it and I will write when new chapters and experiments come out, at most once a week.",
    cta: "Confirm subscription",
    notYou: "If this wasn’t you, do nothing: without confirmation no emails will follow.",
    footer: "You’re getting this because the address was entered on the site.",
    unsub: "Unsubscribe",
    signature: "Mikhail Savchenko",
  },
  pt: {
    subject: "Confirme a sua inscrição na Cosmologia Neural",
    preheader: "Um clique, e os e-mails sobre novos capítulos e experimentos chegarão aqui.",
    title: "Confirme a sua inscrição",
    lead: "Você deixou este endereço em neuralcosmology.com. Confirme e eu escreverei quando saírem novos capítulos e experimentos, no máximo uma vez por semana.",
    cta: "Confirmar inscrição",
    notYou: "Se não foi você, não faça nada: sem confirmação, nenhum e-mail será enviado.",
    footer: "Você recebeu este e-mail porque o endereço foi informado no site.",
    unsub: "Cancelar inscrição",
    signature: "Mikhail Savchenko",
  },
  es: {
    subject: "Confirme su suscripción a Cosmología Neural",
    preheader: "Un clic, y los correos sobre capítulos y experimentos nuevos llegarán aquí.",
    title: "Confirme su suscripción",
    lead: "Dejó esta dirección en neuralcosmology.com. Confírmela y le escribiré cuando salgan capítulos y experimentos nuevos, como mucho una vez por semana.",
    cta: "Confirmar suscripción",
    notYou: "Si no fue usted, no haga nada: sin confirmación no llegará ningún correo.",
    footer: "Recibe este correo porque la dirección se introdujo en el sitio.",
    unsub: "Darse de baja",
    signature: "Mikhail Savchenko",
  },
};

type ActionCopy = { footer: string; unsub: string; signature: string };

const LATER: Record<SupportedLocale, ActionCopy & { subject: (t: string) => string; preheader: string; title: string; lead: string; experiment: string; chapter: string; confirmLead: string; confirm: string }> = {
  ru: {
    subject: (t) => `${t}: опыт и глава`,
    preheader: "Опыт и глава, из которой он взят, — открыть, когда будет время.",
    title: "Опыт и глава — для спокойного чтения",
    lead: "Вы просили прислать ссылки. Опыт открывается и на компьютере, а глава объясняет, что вы видели.",
    experiment: "Опыт", chapter: "Глава",
    confirmLead: "Хотите письма о новых главах и опытах, не чаще раза в неделю? Подтвердите адрес, и заодно откроется первая платная глава книги.",
    confirm: "Подтвердить и получать",
    footer: "Письмо пришло, потому что вы попросили прислать опыт на этот адрес.", unsub: "Больше не писать", signature: "Михаил Савченко",
  },
  en: {
    subject: (t) => `${t}: the experiment and the chapter`,
    preheader: "The experiment and the chapter it comes from, for when you have time.",
    title: "The experiment and the chapter, for later",
    lead: "You asked for the links. The experiment works on a computer too, and the chapter explains what you saw.",
    experiment: "Experiment", chapter: "Chapter",
    confirmLead: "Want an email when new chapters and experiments come out, at most once a week? Confirm the address, and the book’s first paid chapter opens too.",
    confirm: "Confirm and subscribe",
    footer: "You’re getting this because you asked for the experiment at this address.", unsub: "Don’t email me again", signature: "Mikhail Savchenko",
  },
  pt: {
    subject: (t) => `${t}: o experimento e o capítulo`,
    preheader: "O experimento e o capítulo de onde ele vem, para abrir com calma.",
    title: "O experimento e o capítulo, para ler com calma",
    lead: "Você pediu os links. O experimento também funciona no computador, e o capítulo explica o que você viu.",
    experiment: "Experimento", chapter: "Capítulo",
    confirmLead: "Quer um e-mail quando saírem novos capítulos e experimentos, no máximo uma vez por semana? Confirme o endereço, e o primeiro capítulo pago do livro também abre.",
    confirm: "Confirmar e receber",
    footer: "Você recebeu este e-mail porque pediu o experimento neste endereço.", unsub: "Não me escreva mais", signature: "Mikhail Savchenko",
  },
  es: {
    subject: (t) => `${t}: el experimento y el capítulo`,
    preheader: "El experimento y el capítulo de donde viene, para abrir con calma.",
    title: "El experimento y el capítulo, para leer con calma",
    lead: "Pidió los enlaces. El experimento también funciona en el ordenador, y el capítulo explica lo que vio.",
    experiment: "Experimento", chapter: "Capítulo",
    confirmLead: "¿Quiere un correo cuando salgan capítulos y experimentos nuevos, como mucho una vez por semana? Confirme la dirección y también se abrirá el primer capítulo de pago del libro.",
    confirm: "Confirmar y recibir",
    footer: "Recibe este correo porque pidió el experimento en esta dirección.", unsub: "No escribirme más", signature: "Mikhail Savchenko",
  },
};

const UNLOCK: Record<SupportedLocale, ActionCopy & { subject: (c: string) => string; preheader: string; title: (c: string) => string; lead: string; cta: string; after: string }> = {
  ru: {
    subject: (c) => `Глава «${c}» открыта`, preheader: "Одна ссылка — и глава откроется на этом устройстве.",
    title: (c) => `Глава «${c}» ждёт вас`,
    lead: "Нажмите кнопку на том устройстве, где хотите читать: глава откроется там.",
    cta: "Открыть главу",
    after: "Заодно адрес подтвердится, и я буду писать о новых главах и опытах, не чаще раза в неделю. Отписка в одно нажатие.",
    footer: "Письмо пришло, потому что этот адрес оставили, чтобы открыть главу.", unsub: "Больше не писать", signature: "Михаил Савченко",
  },
  en: {
    subject: (c) => `“${c}” is open`, preheader: "One link, and the chapter opens on this device.",
    title: (c) => `“${c}” is waiting`,
    lead: "Tap the button on the device you want to read on: the chapter opens there.",
    cta: "Open the chapter",
    after: "It also confirms the address: I’ll write when new chapters and experiments come out, at most once a week. Unsubscribe in one click.",
    footer: "You’re getting this because the address was entered to open a chapter.", unsub: "Don’t email me again", signature: "Mikhail Savchenko",
  },
  pt: {
    subject: (c) => `“${c}” está aberto`, preheader: "Um link, e o capítulo abre neste aparelho.",
    title: (c) => `“${c}” espera por você`,
    lead: "Toque no botão no aparelho em que quer ler: o capítulo abre ali.",
    cta: "Abrir o capítulo",
    after: "Isso também confirma o endereço: escreverei quando saírem novos capítulos e experimentos, no máximo uma vez por semana. Cancele com um clique.",
    footer: "Você recebeu este e-mail porque o endereço foi informado para abrir um capítulo.", unsub: "Não me escreva mais", signature: "Mikhail Savchenko",
  },
  es: {
    subject: (c) => `«${c}» está abierto`, preheader: "Un enlace, y el capítulo se abre en este dispositivo.",
    title: (c) => `«${c}» le espera`,
    lead: "Pulse el botón en el dispositivo donde quiere leer: el capítulo se abre allí.",
    cta: "Abrir el capítulo",
    after: "También confirma la dirección: le escribiré cuando salgan capítulos y experimentos nuevos, como mucho una vez por semana. Baja con un clic.",
    footer: "Recibe este correo porque la dirección se introdujo para abrir un capítulo.", unsub: "No escribirme más", signature: "Mikhail Savchenko",
  },
};

const confirmUrl = (token: string, to?: string | null) =>
  `${SITE}/api/subscribe/confirm?t=${token}${to ? `&to=${encodeURIComponent(to)}` : ""}`;
const unsubUrl = (token: string) => `${SITE}/api/subscribe/unsubscribe?t=${token}`;

/** Путь главы, который можно открыть по ссылке из письма: /<lang>/read/<book>/<chapter>. */
export const READ_PATH = /^\/(ru|en|pt|es)\/read\/([a-z0-9-]{1,60})\/([A-Za-z0-9_-]{1,60})$/;

/** Первая глава книги, закрытая для гостя: её открывает подтверждённая почта. */
export function leadChapterId(book: string, lang: SupportedLocale): string | null {
  return getManifest(book, lang)?.chapters.find((c) => !c.free)?.id ?? null;
}

async function sendLater(email: string, lang: SupportedLocale, token: string, item: string): Promise<boolean> {
  const it = getExperiment(item);
  const v = it && experimentView(it, lang);
  if (!v) return false;
  const c = LATER[lang] ?? LATER.en;
  const expUrl = `${SITE}/${lang}/experiments/${v.id}`;
  const chUrl = `${SITE}${v.href}`;
  const items = [{ title: v.title, href: expUrl, meta: c.experiment }];
  if (v.chapter) items.push({ title: v.chapter.title, href: chUrl, meta: `${v.bookTitle}${v.chapter.number ? ` · ${c.chapter} ${v.chapter.number}` : ""}` });
  const lead = leadChapterId(v.bookSlug, v.lang);
  const to = lead ? `/${v.lang}/read/${v.bookSlug}/${lead}` : null;
  const quote = v.passage.join(" ");
  const text = `${c.title}\n\n${c.lead}\n\n${items.map((x) => `${x.meta}: ${x.title} — ${x.href}`).join("\n")}\n\n${c.confirmLead}\n${confirmUrl(token, to)}\n\n${c.signature}\n\n${c.footer} ${c.unsub}: ${unsubUrl(token)}`;
  const html = emailHtml({
    lang,
    preheader: c.preheader,
    title: c.title,
    blocks: [
      { kind: "p", text: c.lead },
      { kind: "links", items },
      ...(quote ? [{ kind: "quote" as const, text: quote.length > 420 ? `${quote.slice(0, quote.lastIndexOf(" ", 400))} …` : quote, source: v.bookTitle }] : []),
      { kind: "p", text: c.confirmLead },
      { kind: "button", label: c.confirm, href: confirmUrl(token, to) },
    ],
    signature: c.signature,
    footer: { text: c.footer, link: { label: c.unsub, href: unsubUrl(token) } },
  });
  return sendMail(email, c.subject(v.title), text, html);
}

async function sendUnlock(email: string, lang: SupportedLocale, token: string, to: string): Promise<boolean> {
  const m = READ_PATH.exec(to);
  if (!m) return false;
  const chapter = getManifest(m[2], m[1] as SupportedLocale)?.chapters.find((ch) => ch.id === m[3]);
  const book = getBookBySlug(m[2]);
  if (!chapter || !book) return false;
  const c = UNLOCK[lang] ?? UNLOCK.en;
  const link = confirmUrl(token, to);
  const text = `${c.title(chapter.title)}\n\n${c.lead}\n\n${c.cta}: ${link}\n\n${c.after}\n\n${c.signature}\n\n${c.footer} ${c.unsub}: ${unsubUrl(token)}`;
  const html = emailHtml({
    lang,
    preheader: c.preheader,
    title: c.title(chapter.title),
    blocks: [
      { kind: "p", text: c.lead },
      ...(chapter.excerpt ? [{ kind: "quote" as const, text: chapter.excerpt, source: pickLocalized(book.titles, lang) }] : []),
      { kind: "button", label: c.cta, href: link },
      { kind: "p", text: c.after },
    ],
    signature: c.signature,
    footer: { text: c.footer, link: { label: c.unsub, href: unsubUrl(token) } },
  });
  return sendMail(email, c.subject(chapter.title), text, html);
}

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;
export const validEmail = (e: string) => EMAIL.test(e);

export async function sendConfirmation(email: string, lang: SupportedLocale, token: string): Promise<boolean> {
  const c = COPY[lang] ?? COPY.en;
  const confirm = `${SITE}/api/subscribe/confirm?t=${token}`;
  const unsub = `${SITE}/api/subscribe/unsubscribe?t=${token}`;
  const text = `${c.title}\n\n${c.lead}\n\n${c.cta}: ${confirm}\n\n${c.notYou}\n\n${c.signature}\n\n${c.footer} ${c.unsub}: ${unsub}`;
  const html = emailHtml({
    lang,
    preheader: c.preheader,
    title: c.title,
    blocks: [
      { kind: "p", text: c.lead },
      { kind: "button", label: c.cta, href: confirm },
      { kind: "p", text: c.notYou },
    ],
    signature: c.signature,
    footer: { text: c.footer, link: { label: c.unsub, href: unsub } },
  });
  return sendMail(email, c.subject, text, html);
}

/** Новая или повторная подписка. Возвращает статус, который видит читатель. */
export async function subscribe(
  email: string,
  lang: SupportedLocale,
  book: string | null,
  source: string | null,
  opts: { kind?: SubscribeKind; item?: string | null; to?: string | null } = {},
): Promise<"sent" | "saved" | "already"> {
  const sql = await db();
  const token = randomBytes(18).toString("base64url");
  const [row] = await sql`
    INSERT INTO subscribers (email, lang, book, source, token)
    VALUES (${email}, ${lang}, ${book}, ${source}, ${token})
    ON CONFLICT (email) DO UPDATE SET
      status = CASE WHEN subscribers.status = 'unsubscribed' THEN 'pending' ELSE subscribers.status END,
      lang = EXCLUDED.lang
    RETURNING status, token`;
  const kind = opts.kind ?? "confirm";
  // Письмо «по делу» уходит и подтверждённым: его попросили сейчас (на новом устройстве
  // ссылка из него и открывает главу).
  if (kind === "later" && opts.item) return mailConfigured() && (await sendLater(email, lang, row.token as string, opts.item)) ? "sent" : "saved";
  if (kind === "unlock" && opts.to) return mailConfigured() && (await sendUnlock(email, lang, row.token as string, opts.to)) ? "sent" : "saved";
  if (row.status === "confirmed") return "already";
  if (!mailConfigured()) return "saved";
  return (await sendConfirmation(email, lang, row.token as string)) ? "sent" : "saved";
}

export async function setStatus(token: string, status: "confirmed" | "unsubscribed"): Promise<{ lang: string } | null> {
  const sql = await db();
  const [row] =
    status === "confirmed"
      ? await sql`UPDATE subscribers SET status = 'confirmed', confirmed_at = now() WHERE token = ${token} AND status <> 'unsubscribed' RETURNING lang`
      : await sql`UPDATE subscribers SET status = 'unsubscribed' WHERE token = ${token} RETURNING lang`;
  return row ? { lang: row.lang as string } : null;
}

/** Открывает ли cookie nc-sub первую платную главу: токен подтверждённого подписчика. */
export async function subscriberUnlocked(token: string | undefined): Promise<boolean> {
  if (!token || token.length > 64) return false;
  const sql = await db();
  const [row] = await sql`SELECT 1 FROM subscribers WHERE token = ${token} AND status = 'confirmed'`;
  return Boolean(row);
}
