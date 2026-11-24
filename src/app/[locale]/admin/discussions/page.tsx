import Link from "next/link";
import { Act, Danger } from "@/components/admin/forms";
import { Empty, Pager, Tabs, Tag, Title, when } from "@/components/admin/ui";
import { deleteComment, setComment } from "@/lib/admin/actions";
import { owner } from "@/lib/admin/guard";
import { bookTitle, chapterTitle, discussions } from "@/lib/admin/data";

type P = { params: Promise<{ locale: string }>; searchParams: Promise<{ all?: string; page?: string }> };

export default async function Discussions({ params, searchParams }: P) {
  const { locale } = await params;
  const base = `/${locale}/admin/discussions`;
  await owner(base);
  const sp = await searchParams;
  const all = sp.all === "1";
  const page = Math.max(1, Number(sp.page) || 1);
  const { rows, total } = await discussions({ held: !all, page });
  return (
    <>
      <Title lead="Комментарии к главам. Сомнительное ИИ не публикует, а оставляет вам.">Обсуждения</Title>
      <Tabs items={[{ href: base, label: "На проверке", on: !all }, { href: `${base}?all=1`, label: "Все", on: all }]} />
      {rows.length === 0 ? <Empty>{all ? "Комментариев пока нет." : "Проверять нечего."}</Empty> : (
        <ul className="rule-t">
          {rows.map((c) => (
            <li key={c.id} className="rule-b py-5">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <Link href={`/${locale}/admin/readers/person?id=${encodeURIComponent(c.user_id)}`} className="font-display text-lg hover:text-primary">{c.author_name}</Link>
                <Tag on={c.status === "hidden"}>{c.status === "hidden" ? "Скрыт" : "Опубликован"}</Tag>
                {c.is_author && <Tag>автор</Tag>}
                <span className="ml-auto text-sm text-muted">{when(c.created_at)}</span>
              </div>
              <p className="mt-1 text-sm text-muted"><Link className="underline underline-offset-4" href={`/${c.lang}/read/${c.book}/${c.chapter}${c.anchor ? `#a-${c.anchor}` : ""}`}>{bookTitle(c.book)}, {chapterTitle(c.book, c.lang, c.chapter)}</Link></p>
              {c.quote && <p className="mt-3 max-w-[70ch] border-l border-primary pl-3 text-fg-secondary">{c.quote}</p>}
              <p className="mt-3 max-w-[70ch] whitespace-pre-wrap break-words">{c.body}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {c.status === "hidden"
                  ? <Act tone="main" action={setComment} values={{ id: c.id, status: "published" }}>Опубликовать</Act>
                  : <Act action={setComment} values={{ id: c.id, status: "hidden" }}>Скрыть</Act>}
                <Danger action={deleteComment} values={{ id: c.id }} ask="Удалить вместе с ответами?">Удалить</Danger>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Pager page={page} total={total} href={(p) => `${base}?${new URLSearchParams({ ...(all ? { all: "1" } : {}), page: String(p) })}`} />
    </>
  );
}
