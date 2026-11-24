import Link from "next/link";
import { notFound } from "next/navigation";
import { Act, Form, Submit } from "@/components/admin/forms";
import { Empty, Part, STATUS, SUB, Tag, Title, day, when, field } from "@/components/admin/ui";
import { grantBook, setGrant } from "@/lib/admin/actions";
import { owner } from "@/lib/admin/guard";
import { bookTitle, chapterTitle, reader } from "@/lib/admin/data";
import { purchases } from "@/lib/account";
import { getManifest } from "@/lib/library";
import { books } from "@/content/books";
import type { SupportedLocale } from "@/lib/get-locale";

type P = { params: Promise<{ locale: string }>; searchParams: Promise<{ id?: string }> };

export default async function Person({ params, searchParams }: P) {
  const { locale } = await params;
  const base = `/${locale}/admin`;
  await owner(`${base}/readers`);
  const id = (await searchParams).id?.slice(0, 200) ?? "";
  const [r, bought] = await Promise.all([id ? reader(id) : null, id ? purchases(id) : []]);
  if (!r) notFound();
  return (
    <>
      <p className="mb-3 text-sm"><Link href={`${base}/readers`} className="text-primary underline underline-offset-4">Все читатели</Link></p>
      <Title lead={[r.name, r.first_seen ? `с нами с ${day(r.first_seen)}` : null, r.last_seen ? `входил ${when(r.last_seen)}` : null].filter(Boolean).join(", ")}>
        <span className="break-all">{r.email ?? r.name ?? "Читатель без почты"}</span>
      </Title>
      <div className="flex flex-wrap gap-2">
        {r.email && <Tag>{r.email_verified === null ? "подтверждение почты неизвестно" : r.email_verified ? "почта подтверждена" : "почта не подтверждена"}</Tag>}
        {r.subscription && <Tag>Подписка: {SUB[r.subscription.status] ?? r.subscription.status}</Tag>}
        {r.notify && <Tag>Письма о главах включены</Tag>}
        <Tag>Пометок: {r.notes}, прислано вам: {r.sent}</Tag>
      </div>

      <Part title="Что читает">
        {r.progress.length === 0 ? <Empty>Книг не открывал.</Empty> : (
          <ul className="rule-t">
            {r.progress.map((p) => {
              const total = getManifest(p.book, p.lang as SupportedLocale)?.chapters.length ?? 0;
              const read = Object.values(p.chapters ?? {}).filter((v) => v === "read").length;
              return (
                <li key={p.book + p.lang} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 rule-b py-3">
                  <span className="font-display text-lg">{bookTitle(p.book)}</span>
                  <span className="text-sm text-fg-secondary">{chapterTitle(p.book, p.lang, p.chapter)}</span>
                  <span className="ml-auto text-sm text-muted tabular-nums">дочитано {read} из {total}, {when(p.updated_at)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </Part>

      <Part title="Куплено" aside={<a href="https://billing.inite.ai/admin" target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline underline-offset-4">Возврат денег в биллинге</a>}>
        {bought.length === 0 ? <Empty>Покупок нет, или биллинг сейчас не отвечает.</Empty> : (
          <ul className="rule-t">{bought.map((p) => <li key={p.item + p.at} className="flex justify-between gap-4 rule-b py-3"><span>{bookTitle(p.item)}</span><span className="text-sm text-muted">{p.status === "active" ? "действует" : p.status}{p.at ? `, ${day(new Date(p.at))}` : ""}</span></li>)}</ul>
        )}
      </Part>

      <Part title="Подарено">
        {r.grants.length > 0 && (
          <ul className="mb-4 rule-t">
            {r.grants.map((g) => (
              <li key={g.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 rule-b py-3">
                <span className={`flex-1 ${g.revoked_at ? "text-muted line-through" : ""}`}>{bookTitle(g.book)}</span>
                <span className="text-sm text-muted">{g.note ? `${g.note}, ` : ""}{day(g.created_at)}</span>
                <Act action={setGrant} values={{ id: g.id, on: g.revoked_at ? "1" : "0" }}>{g.revoked_at ? "Вернуть" : "Снять"}</Act>
              </li>
            ))}
          </ul>
        )}
        <Form action={grantBook} reset className="flex flex-wrap items-end gap-2">
          <input type="hidden" name="userId" value={r.id} />
          <label className="text-sm text-muted">Книга
            <select name="book" className={`${field} mt-1 block w-52`}><option value="library">Вся библиотека</option>{books.filter((b) => !b.freeForContact).map((b) => <option key={b.slug} value={b.slug}>{bookTitle(b.slug)}</option>)}</select>
          </label>
          <label className="min-w-40 flex-1 text-sm text-muted">Для чего<input name="note" className={`${field} mt-1`} /></label>
          <Submit>Выдать доступ</Submit>
        </Form>
      </Part>

      {r.inquiries.length > 0 && (
        <Part title="Писал вам">
          <ul className="rule-t">{r.inquiries.map((q) => <li key={q.id} className="rule-b py-3"><Link href={`${base}/inquiries#${q.id}`} className="block hover:text-primary"><span className="line-clamp-2">{q.message}</span><span className="text-sm text-muted">{STATUS[q.status]}, {when(q.created_at)}</span></Link></li>)}</ul>
        </Part>
      )}
      {r.comments.length > 0 && (
        <Part title="В обсуждениях">
          <ul className="rule-t">{r.comments.map((c) => <li key={c.id} className="rule-b py-3"><p className="line-clamp-3">{c.body}</p><p className="text-sm text-muted">{bookTitle(c.book)}, {chapterTitle(c.book, c.lang, c.chapter)}, {when(c.created_at)}</p></li>)}</ul>
        </Part>
      )}
    </>
  );
}
