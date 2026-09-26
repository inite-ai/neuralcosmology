import type { Metadata } from "next";
import { Price } from "@/components/pricing/Price";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, authConfigured } from "@/lib/auth";
import { db, dbConfigured } from "@/lib/db";
import { books, getBookBySlug } from "@/content/books";
import { getManifest, resolveBookLang } from "@/lib/library";
import { ownsBook, paywallEnabled } from "@/lib/access";
import { isAuthor } from "@/lib/reader/context";
import { isSupportedLocale, type SupportedLocale } from "@/lib/get-locale";
import { pickLocalized } from "@/lib/i18n";
import { LIBRARY_ITEM } from "@/content/pricing";
import { Sheet, Label, Headline } from "@/components/system";
import ModerationActions from "@/components/account/ModerationActions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

const T: Record<SupportedLocale, Record<string, string>> = {
  ru: { hide: "Скрыть", show: "Показать", del: "Удалить", title: "Кабинет", library: "Моя библиотека", progress: "прочитано", cont: "Продолжить", start: "Начать", owned: "куплено", free: "доступ по входу", buy: "Купить", buyAll: "Вся библиотека", notes: "Пометки", noNotes: "Пока пусто: выделите текст в читалке.", talk: "Мои обсуждения", noTalk: "Вы ещё ничего не писали.", ai: "ИИ сегодня", aiLeft: "осталось вопросов", mod: "Модерация", noMod: "Новых сообщений нет.", out: "Выйти", hidden: "скрыто", rejected: "отклонено ИИ" },
  en: { hide: "Hide", show: "Show", del: "Delete", title: "Account", library: "My library", progress: "read", cont: "Continue", start: "Start", owned: "owned", free: "sign-in access", buy: "Buy", buyAll: "Whole library", notes: "Notes", noNotes: "Nothing yet: select text in the reader.", talk: "My discussions", noTalk: "You haven't written anything yet.", ai: "AI today", aiLeft: "questions left", mod: "Moderation", noMod: "No new messages.", out: "Sign out", hidden: "hidden", rejected: "rejected by AI" },
  pt: { hide: "Ocultar", show: "Mostrar", del: "Excluir", title: "Conta", library: "Minha biblioteca", progress: "lido", cont: "Continuar", start: "Começar", owned: "comprado", free: "acesso com login", buy: "Comprar", buyAll: "Biblioteca inteira", notes: "Notas", noNotes: "Nada ainda: selecione texto no leitor.", talk: "Minhas discussões", noTalk: "Você ainda não escreveu nada.", ai: "IA hoje", aiLeft: "perguntas restantes", mod: "Moderação", noMod: "Sem mensagens novas.", out: "Sair", hidden: "oculto", rejected: "rejeitado pela IA" },
  es: { hide: "Ocultar", show: "Mostrar", del: "Eliminar", title: "Cuenta", library: "Mi biblioteca", progress: "leído", cont: "Seguir", start: "Empezar", owned: "comprado", free: "acceso con sesión", buy: "Comprar", buyAll: "Biblioteca completa", notes: "Notas", noNotes: "Nada aún: selecciona texto en el lector.", talk: "Mis conversaciones", noTalk: "Aún no has escrito nada.", ai: "IA hoy", aiLeft: "preguntas restantes", mod: "Moderación", noMod: "No hay mensajes nuevos.", out: "Cerrar sesión", hidden: "oculto", rejected: "rechazado por IA" },
};

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: SupportedLocale = isSupportedLocale(raw) ? raw : "en";
  const session = await getSession();
  if (!session) {
    if (!authConfigured()) redirect(`/${locale}`);
    redirect(`/api/auth/login?returnTo=${encodeURIComponent(`/${locale}/account`)}`);
  }
  const t = T[locale];
  const author = isAuthor(session);
  const sql = dbConfigured() ? await db() : null;

  const progress = sql ? await sql`SELECT book, lang, chapter, anchor, chapters FROM reading_progress WHERE user_id = ${session.sub}` : [];
  const notes = sql ? await sql`SELECT id, book, lang, chapter, anchor, kind, quote, note, created_at FROM annotations WHERE user_id = ${session.sub} ORDER BY created_at DESC LIMIT 200` : [];
  const mine = sql ? await sql`SELECT id, book, lang, chapter, anchor, body, status, created_at FROM comments WHERE user_id = ${session.sub} ORDER BY created_at DESC LIMIT 50` : [];
  const [usage] = sql ? await sql`SELECT count FROM ai_usage WHERE user_id = ${session.sub} AND day = current_date` : [];
  const queue = sql && author
    ? await sql`SELECT id, book, lang, chapter, anchor, author_name, body, status, pinned, created_at FROM comments
        WHERE status <> 'published' OR created_at > now() - interval '14 days' ORDER BY created_at DESC LIMIT 100`
    : [];

  const shelf = await Promise.all(
    books.map(async (b) => {
      const lang = resolveBookLang(b.slug, locale);
      const manifest = lang ? getManifest(b.slug, lang) : null;
      const p = progress.find((r) => r.book === b.slug && r.lang === lang);
      const done = p ? Object.values(p.chapters as Record<string, string>).filter((v) => v === "read").length : 0;
      return { b, lang, manifest, p, done, owned: await ownsBook(session, b.slug) };
    }),
  );
  const ownsAll = paywallEnabled() ? shelf.every((s) => s.owned) : true;
  const chapterTitle = (book: string, lang: string, id: string) =>
    getManifest(book, lang as SupportedLocale)?.chapters.find((c) => c.id === id)?.title ?? id;
  const readHref = (book: string, id: string, anchor?: string | null) => `/${locale}/read/${book}/${id}${anchor ? `#a-${anchor}` : ""}`;

  return (
    <main className="pt-14">
      <Sheet>
        <header className="flex flex-col gap-6 pt-14 pb-10 md:flex-row md:items-end md:justify-between md:px-10 md:pt-20">
          <div>
            <Label className="mb-4">{session.email}</Label>
            <Headline as="h1" size="display">{session.name || t.title}</Headline>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="font-display text-4xl leading-none">{usage?.count ?? 0}</p>
              <p className="mt-2 label text-muted">{t.ai}</p>
            </div>
            <a href={`/api/auth/logout?returnTo=/${locale}`} className="inline-flex min-h-11 items-center rounded-sm hairline border-fg/60 px-5 label hover:bg-fg hover:text-bg">
              {t.out}
            </a>
          </div>
        </header>

        <section className="rule-t py-12 md:px-10">
          <Label className="mb-6">{t.library}</Label>
          <div className="grid gap-[0.5px] hairline bg-line md:grid-cols-2">
            {shelf.map(({ b, manifest, p, done, owned }) => {
              const total = manifest?.chapters.length ?? 0;
              const pct = total ? Math.round((done / total) * 100) : 0;
              const next = p?.chapter ?? manifest?.chapters[0]?.id;
              return (
                <div key={b.slug} className="flex flex-col gap-4 bg-bg p-6 md:p-8">
                  <div className="flex items-baseline justify-between gap-3">
                    <Link href={`/${locale}/books/${b.slug}`} className="font-display text-2xl leading-tight hover:text-primary">{pickLocalized(b.titles, locale)}</Link>
                    <span className="label text-muted whitespace-nowrap">{owned && paywallEnabled() ? t.owned : paywallEnabled() ? "" : t.free}</span>
                  </div>
                  <div className="h-px bg-line-soft"><div className="h-px bg-primary" style={{ width: `${pct}%` }} /></div>
                  <p className="text-sm text-muted">{done} / {total} · {t.progress} {pct}%</p>
                  <div className="mt-auto flex flex-wrap gap-3">
                    {next && (
                      <Link href={readHref(b.slug, next, p?.anchor)} className="inline-flex min-h-11 items-center rounded-sm bg-fg px-5 label text-bg hover:bg-primary">
                        {p ? t.cont : t.start}
                      </Link>
                    )}
                    {paywallEnabled() && !owned && (
                      <a href={`/api/checkout?${new URLSearchParams({ item: b.slug, returnTo: `/${locale}/account` })}`} className="inline-flex min-h-11 items-center rounded-sm hairline border-fg/60 px-5 label hover:bg-fg hover:text-bg">
                        {t.buy} · <Price item="book" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {paywallEnabled() && !ownsAll && (
            <a href={`/api/checkout?${new URLSearchParams({ item: LIBRARY_ITEM, returnTo: `/${locale}/account` })}`} className="mt-6 inline-flex min-h-11 items-center rounded-sm bg-fg px-6 label text-bg hover:bg-primary">
              {t.buyAll} · <Price item="library" />
            </a>
          )}
        </section>

        <section className="rule-t py-12 md:px-10">
          <Label className="mb-6">{t.notes} · {notes.length}</Label>
          {notes.length === 0 ? (
            <p className="text-muted">{t.noNotes}</p>
          ) : (
            <ul className="rule-t">
              {notes.map((n) => (
                <li key={n.id} className="rule-b py-5">
                  <Link href={readHref(n.book, n.chapter, n.anchor)} className="group block">
                    <p className="label text-muted">
                      {pickLocalized(getBookBySlug(n.book)?.titles ?? { en: n.book }, locale)} · {chapterTitle(n.book, n.lang, n.chapter)}
                    </p>
                    <p className="mt-2 font-display text-xl italic leading-snug group-hover:text-primary">«{n.quote}»</p>
                    {n.note && <p className="mt-2 text-fg-secondary">{n.note}</p>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rule-t py-12 md:px-10">
          <Label className="mb-6">{t.talk} · {mine.length}</Label>
          {mine.length === 0 ? (
            <p className="text-muted">{t.noTalk}</p>
          ) : (
            <ul className="rule-t">
              {mine.map((c) => (
                <li key={c.id} className="rule-b py-4">
                  <Link href={readHref(c.book, c.chapter, c.anchor)} className="group block">
                    <p className="label text-muted">
                      {chapterTitle(c.book, c.lang, c.chapter)}
                      {c.status !== "published" && ` · ${c.status === "hidden" ? t.hidden : t.rejected}`}
                    </p>
                    <p className="mt-1 line-clamp-2 text-fg-secondary group-hover:text-fg">{c.body}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {author && (
          <section className="rule-t py-12 md:px-10">
            <Label className="mb-6">{t.mod} · {queue.length}</Label>
            {queue.length === 0 ? (
              <p className="text-muted">{t.noMod}</p>
            ) : (
              <ul className="rule-t">
                {queue.map((c) => (
                  <li key={c.id} className="grid gap-3 rule-b py-4 md:grid-cols-[1fr_auto] md:items-start">
                    <div>
                      <p className="label text-muted">
                        {c.author_name} · {chapterTitle(c.book, c.lang, c.chapter)} ·{" "}
                        <span className={c.status === "published" ? "text-primary" : ""}>{c.status}</span>
                      </p>
                      <Link href={readHref(c.book, c.chapter, c.anchor)} className="mt-1 block text-fg-secondary hover:text-fg">{c.body}</Link>
                    </div>
                    <ModerationActions id={c.id} status={c.status} pinned={c.pinned} labels={{ hide: t.hide, show: t.show, del: t.del }} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </Sheet>
    </main>
  );
}

