import Link from "next/link";
import { Core, Empty, KIND, Part, Title, plural, when } from "@/components/admin/ui";
import { owner } from "@/lib/admin/guard";
import { bookStats, bookTitle, chapterTitle, discussions, inquiries, sentNotes, week } from "@/lib/admin/data";

type P = { params: Promise<{ locale: string }> };

export default async function Today({ params }: P) {
  const { locale } = await params;
  const base = `/${locale}/admin`;
  await owner(base);
  const [ask, held, notes, w, stats] = await Promise.all([inquiries({ status: "new", page: 1 }), discussions({ held: true, page: 1 }), sentNotes(5), week(), bookStats()]);
  const read = stats.filter((b) => b.readers > 0);
  const silent = stats.filter((b) => b.readers === 0);
  const waiting = ask.total + held.total;
  const row = "flex flex-wrap items-baseline gap-x-4 gap-y-1 rule-b py-3 hover:bg-bg-sunk";
  return (
    <>
      <Title>{waiting === 0 ? "Всё разобрано" : `${plural(waiting, "дело ждёт", "дела ждут", "дел ждут")} ответа`}</Title>

      {waiting > 0 && (
        <div className="rule-t">
          {ask.rows.slice(0, 6).map((q) => (
            <Link key={q.id} href={`${base}/inquiries#${q.id}`} className={row}>
              <span className="w-24 shrink-0 text-sm text-primary">{KIND[q.kind] ?? q.kind}</span>
              <span className="order-last min-w-0 basis-full line-clamp-2 md:order-none md:line-clamp-1 md:flex-1 md:basis-0">{q.name}: {q.message}</span>
              <span className="ml-auto text-sm text-muted">{when(q.created_at)}</span>
            </Link>
          ))}
          {held.rows.slice(0, 6).map((c) => (
            <Link key={c.id} href={`${base}/discussions`} className={row}>
              <span className="w-24 shrink-0 text-sm text-primary">На проверке</span>
              <span className="order-last min-w-0 basis-full line-clamp-2 md:order-none md:line-clamp-1 md:flex-1 md:basis-0">{c.author_name}: {c.body}</span>
              <span className="ml-auto text-sm text-muted">{when(c.created_at)}</span>
            </Link>
          ))}
        </div>
      )}

      <Part title="За семь дней">
        <p className="max-w-[60ch] text-lg leading-relaxed">
          {plural(w.readers, "вошедший читатель", "вошедших читателя", "вошедших читателей")} {w.readers === 1 ? "открывал" : "открывали"} книги, {plural(w.subs, "адрес подтверждён", "адреса подтверждены", "адресов подтверждено")} (неделей раньше {w.subsWas}),{" "}
          {plural(w.sales, "покупка", "покупки", "покупок")} (было {w.salesWas}), {plural(w.comments, "комментарий", "комментария", "комментариев")} (было {w.commentsWas}).
        </p>
      </Part>

      <Part title="Докуда дочитывают" aside={<Link href={`${base}/books`} className="text-sm text-primary underline underline-offset-4">Подробно</Link>}>
        <div className="grid gap-x-10 gap-y-6 lg:grid-cols-2">
          {read.map((b) => (
            <div key={b.slug}>
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <Link href={`${base}/books?book=${b.slug}`} className="font-display text-lg hover:text-primary">{b.title}</Link>
                <span className="text-sm text-muted">{plural(b.readers, "читатель", "читателя", "читателей")}</span>
              </div>
              <Core book={b} href={`${base}/books?book=${b.slug}`} />
            </div>
          ))}
        </div>
        {silent.length > 0 && <p className="mt-4 text-fg-secondary">Пока никто не открывал: {silent.map((b) => b.title).join(", ")}.</p>}
        <p className="mt-2 text-sm text-muted">Столбик — глава: светлое открыли, тёмное дочитали. Цветная черта снизу: глава открыта всем. Считаются только вошедшие.</p>
      </Part>

      <Part title="Заметки вам">
        {notes.length === 0 ? (
          <Empty>Читатели пока ничего не присылали. Заметку отправляют из читалки, она приходит и письмом.</Empty>
        ) : (
          <ul className="rule-t">
            {notes.map((n) => (
              <li key={n.id} className="rule-b py-4">
                <p className="font-display text-lg leading-snug">«{n.quote}»</p>
                {n.note && <p className="mt-1">{n.note}</p>}
                <p className="mt-1 text-sm text-muted">
                  <Link className="underline underline-offset-4" href={`${base}/readers/person?id=${encodeURIComponent(n.user_id)}`}>{n.name ?? n.email ?? "Читатель"}</Link>, {bookTitle(n.book)}, {chapterTitle(n.book, n.lang, n.chapter)}, {when(n.sent_at)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Part>
    </>
  );
}
