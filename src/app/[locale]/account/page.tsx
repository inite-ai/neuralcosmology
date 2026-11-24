import type { Metadata } from "next";
import { Price } from "@/components/pricing/Price";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, authConfigured } from "@/lib/auth";
import { db, dbConfigured } from "@/lib/db";
import { books, getBookBySlug } from "@/content/books";
import { getManifest, resolveBookLang } from "@/lib/library";
import { isPaid, ownsBook, paywallEnabled } from "@/lib/access";
import { isAuthor } from "@/lib/reader/context";
import { isSupportedLocale, type SupportedLocale } from "@/lib/get-locale";
import { pickLocalized } from "@/lib/i18n";
import { LIBRARY_ITEM } from "@/content/pricing";
import { Sheet, Label } from "@/components/system";
import AccountSettings from "@/components/account/AccountSettings";
import DataControls from "@/components/account/DataControls";
import { getPrefs, purchases } from "@/lib/account";
import { ACTIVE_CURRENCIES } from "@/content/pricing";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: SupportedLocale = isSupportedLocale(raw) ? raw : "en";
  return { title: T[locale].title, robots: { index: false, follow: false } };
}

// Новые разделы кабинета: покупки, настройки, данные.
const A: Record<SupportedLocale, Record<string, string>> = {
  ru: { buys: "Мои покупки", noBuys: "Покупок пока нет: первые главы каждой книги открыты бесплатно.", libraryAll: "Вся библиотека", settings: "Настройки", name: "Имя в обсуждениях", namePh: "как вас подписывать", currency: "Валюта", notify: "Письмо, когда выходят новые главы", notifyAll: "ничего не отмечено — все книги", save: "Сохранить", saved: "Сохранено", data: "Мои данные", export: "Скачать мои данные (JSON)", del: "Удалить мои данные", confirm: "Да, удалить всё", cancel: "Отмена", done: "Удалено. Выходим…", note: "Удаляются прогресс, пометки, настройки, лимиты ИИ, подписка и обращения с подтверждённого адреса; ваши комментарии обезличиваются. Покупки сохраняются: доступ к книгам останется при следующем входе." },
  en: { buys: "My purchases", noBuys: "No purchases yet: the first chapters of every book are free.", libraryAll: "Whole library", settings: "Settings", name: "Name in discussions", namePh: "how you would like to sign", currency: "Currency", notify: "Email me when new chapters come out", notifyAll: "none ticked — all books", save: "Save", saved: "Saved", data: "My data", export: "Download my data (JSON)", del: "Delete my data", confirm: "Yes, delete everything", cancel: "Cancel", done: "Deleted. Signing out…", note: "Removes progress, notes, settings, AI limits, and the subscription and messages from your verified address; your comments are anonymised. Purchases are kept: book access returns on your next sign-in." },
  pt: { buys: "Minhas compras", noBuys: "Nenhuma compra ainda: os primeiros capítulos de cada livro são grátis.", libraryAll: "Biblioteca inteira", settings: "Configurações", name: "Nome nas discussões", namePh: "como você quer assinar", currency: "Moeda", notify: "Avise-me por e-mail quando saírem novos capítulos", notifyAll: "nada marcado — todos os livros", save: "Salvar", saved: "Salvo", data: "Meus dados", export: "Baixar meus dados (JSON)", del: "Excluir meus dados", confirm: "Sim, excluir tudo", cancel: "Cancelar", done: "Excluído. Saindo…", note: "Remove progresso, notas, configurações, limites de IA, e a inscrição e as mensagens do seu e-mail verificado; seus comentários ficam anônimos. As compras são mantidas: o acesso volta no próximo login." },
  es: { buys: "Mis compras", noBuys: "Aún no hay compras: los primeros capítulos de cada libro son gratis.", libraryAll: "Biblioteca completa", settings: "Ajustes", name: "Nombre en las conversaciones", namePh: "cómo firmarte", currency: "Moneda", notify: "Avísame por correo cuando salgan capítulos nuevos", notifyAll: "nada marcado — todos los libros", save: "Guardar", saved: "Guardado", data: "Mis datos", export: "Descargar mis datos (JSON)", del: "Eliminar mis datos", confirm: "Sí, eliminar todo", cancel: "Cancelar", done: "Eliminado. Cerrando sesión…", note: "Se eliminan el progreso, las notas, los ajustes, los límites de IA, y la suscripción y los mensajes de tu correo verificado; tus comentarios quedan anónimos. Las compras se conservan: el acceso vuelve al iniciar sesión." },
};

const T: Record<SupportedLocale, Record<string, string>> = {
  ru: { office: "Бэкофис", social: "Цитаты в соцсетях", hide: "Скрыть", show: "Показать", del: "Удалить", title: "Кабинет", library: "Моя библиотека", progress: "прочитано", cont: "Продолжить", start: "Начать", owned: "куплено", free: "доступ по входу", buy: "Купить", buyAll: "Вся библиотека", notes: "Пометки", noNotes: "Пока пусто: выделите текст в читалке.", talk: "Мои обсуждения", noTalk: "Вы ещё ничего не писали.", ai: "ИИ сегодня", aiLeft: "осталось вопросов", mod: "Модерация", noMod: "Новых сообщений нет.", out: "Выйти", held: "ждёт проверки автором" },
  en: { office: "Back office", social: "Quotes on social media", hide: "Hide", show: "Show", del: "Delete", title: "Account", library: "My library", progress: "read", cont: "Continue", start: "Start", owned: "owned", free: "sign-in access", buy: "Buy", buyAll: "Whole library", notes: "Notes", noNotes: "Nothing yet: select text in the reader.", talk: "My discussions", noTalk: "You haven't written anything yet.", ai: "AI today", aiLeft: "questions left", mod: "Moderation", noMod: "No new messages.", out: "Sign out", held: "awaiting the author's review" },
  pt: { office: "Painel do autor", social: "Citações nas redes sociais", hide: "Ocultar", show: "Mostrar", del: "Excluir", title: "Conta", library: "Minha biblioteca", progress: "lido", cont: "Continuar", start: "Começar", owned: "comprado", free: "acesso com login", buy: "Comprar", buyAll: "Biblioteca inteira", notes: "Notas", noNotes: "Nada ainda: selecione texto no leitor.", talk: "Minhas discussões", noTalk: "Você ainda não escreveu nada.", ai: "IA hoje", aiLeft: "perguntas restantes", mod: "Moderação", noMod: "Sem mensagens novas.", out: "Sair", held: "aguarda a revisão do autor" },
  es: { office: "Panel del autor", social: "Citas en redes sociales", hide: "Ocultar", show: "Mostrar", del: "Eliminar", title: "Cuenta", library: "Mi biblioteca", progress: "leído", cont: "Seguir", start: "Empezar", owned: "comprado", free: "acceso con sesión", buy: "Comprar", buyAll: "Biblioteca completa", notes: "Notas", noNotes: "Nada aún: selecciona texto en el lector.", talk: "Mis conversaciones", noTalk: "Aún no has escrito nada.", ai: "IA hoy", aiLeft: "preguntas restantes", mod: "Moderación", noMod: "No hay mensajes nuevos.", out: "Cerrar sesión", held: "espera la revisión del autor" },
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
  const a = A[locale];
  const [prefs, bought] = await Promise.all([dbConfigured() ? getPrefs(session.sub) : null, purchases(session.sub)]);
  const author = isAuthor(session);
  const sql = dbConfigured() ? await db() : null;

  const progress = sql ? await sql`SELECT book, lang, chapter, anchor, chapters FROM reading_progress WHERE user_id = ${session.sub}` : [];
  const notes = sql ? await sql`SELECT id, book, lang, chapter, anchor, kind, quote, note, created_at FROM annotations WHERE user_id = ${session.sub} ORDER BY created_at DESC LIMIT 200` : [];
  const mine = sql ? await sql`SELECT id, book, lang, chapter, anchor, body, status, created_at FROM comments WHERE user_id = ${session.sub} ORDER BY created_at DESC LIMIT 50` : [];
  const [usage] = sql ? await sql`SELECT count FROM ai_usage WHERE user_id = ${session.sub} AND day = current_date` : [];

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
            <p className="mb-4 text-sm text-muted">{session.email}{usage?.count ? `, ${t.ai}: ${usage.count}` : ""}</p>
            <h1 className="display-fluid text-balance">{prefs?.displayName || session.name || t.title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {author && (
              <Link href={`/${locale}/admin`} className="inline-flex min-h-11 items-center rounded-sm bg-fg px-5 label text-bg hover:bg-primary">
                {t.office}
              </Link>
            )}
            <a href={`/api/auth/logout?returnTo=/${locale}`} className="inline-flex min-h-11 items-center rounded-sm hairline border-fg/60 px-5 label hover:bg-fg hover:text-bg">
              {t.out}
            </a>
          </div>
        </header>

        <section className="rule-t py-12 md:px-10">
          <Label className="mb-6">{t.library}</Label>
          <div className="grid gap-[0.5px] md:grid-cols-2">
            {shelf.map(({ b, manifest, p, done, owned }) => {
              const total = manifest?.chapters.length ?? 0;
              const pct = total ? Math.round((done / total) * 100) : 0;
              const next = p?.chapter ?? manifest?.chapters[0]?.id;
              return (
                <div key={b.slug} className="flex flex-col gap-4 p-6 outline-[0.5px] outline-line md:p-8">
                  <div className="flex items-baseline justify-between gap-3">
                    <Link href={`/${locale}/books/${b.slug}`} className="font-display text-2xl leading-tight hover:text-primary">{pickLocalized(b.titles, locale)}</Link>
                    <span className="label text-muted whitespace-nowrap">{!isPaid(b.slug) ? t.free : author ? "" : owned ? t.owned : ""}</span>
                  </div>
                  <div className="h-px bg-line-soft"><div className="h-px bg-primary" style={{ width: `${pct}%` }} /></div>
                  <p className="text-sm text-muted">{done} / {total} · {t.progress} {pct}%</p>
                  <div className="mt-auto flex flex-wrap gap-3">
                    {next && (
                      <Link href={readHref(b.slug, next, p?.anchor)} className="inline-flex min-h-11 items-center rounded-sm bg-fg px-5 label text-bg hover:bg-primary">
                        {p ? t.cont : t.start}
                      </Link>
                    )}
                    {isPaid(b.slug) && !owned && (
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

        {paywallEnabled() && (
          <section className="rule-t py-12 md:px-10">
            <Label className="mb-6">{a.buys} · {bought.length}</Label>
            {bought.length === 0 ? (
              <p className="text-fg-secondary">{a.noBuys}</p>
            ) : (
              <ul className="rule-t">
                {bought.map((p) => (
                  <li key={p.item + p.at} className="flex items-baseline justify-between gap-4 rule-b py-4">
                    <span className="font-display text-xl">{p.item === "library" ? a.libraryAll : pickLocalized(getBookBySlug(p.item)?.titles ?? { en: p.item }, locale)}</span>
                    <span className="label text-muted">{p.at ? new Date(p.at).toLocaleDateString(locale) : ""} · {t.owned}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

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
                      {c.status !== "published" && ` · ${t.held}`}
                    </p>
                    <p className="mt-1 line-clamp-2 text-fg-secondary group-hover:text-fg">{c.body}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {prefs && (
          <section className="rule-t py-12 md:px-10">
            <Label className="mb-6">{a.settings}</Label>
            <AccountSettings
              initial={prefs}
              books={books.map((b) => ({ slug: b.slug, title: pickLocalized(b.titles, locale) }))}
              currencies={ACTIVE_CURRENCIES}
              locale={locale}
              labels={{ name: a.name, namePh: a.namePh, currency: a.currency, notify: a.notify, notifyAll: a.notifyAll, save: a.save, saved: a.saved }}
            />
          </section>
        )}

        {prefs && (
          <section className="rule-t py-12 md:px-10">
            <Label className="mb-6">{a.data}</Label>
            <DataControls locale={locale} labels={{ export: a.export, del: a.del, confirm: a.confirm, cancel: a.cancel, done: a.done, note: a.note }} />
          </section>
        )}
      </Sheet>
    </main>
  );
}

