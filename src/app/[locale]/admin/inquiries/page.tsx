import Link from "next/link";
import { Danger, Form, Submit } from "@/components/admin/forms";
import { Empty, KIND, Pager, STATUS, Tabs, Tag, Title, when, field } from "@/components/admin/ui";
import { deleteInquiry, setInquiry } from "@/lib/admin/actions";
import { owner } from "@/lib/admin/guard";
import { STATUSES, bookTitle, inquiries } from "@/lib/admin/data";

type P = { params: Promise<{ locale: string }>; searchParams: Promise<{ status?: string; kind?: string; page?: string }> };

export default async function Inquiries({ params, searchParams }: P) {
  const { locale } = await params;
  const base = `/${locale}/admin/inquiries`;
  await owner(base);
  const sp = await searchParams;
  const status = STATUSES.find((s) => s === sp.status);
  const kind = KIND[sp.kind ?? ""] ? sp.kind : undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const { rows, total, counts } = await inquiries({ status, kind, page });
  const url = (x: { status?: string; kind?: string; page?: number }) => {
    const p = new URLSearchParams(Object.entries({ status: x.status, kind: x.kind, page: x.page && x.page > 1 ? String(x.page) : undefined }).filter((e): e is [string, string] => Boolean(e[1])));
    return p.size ? `${base}?${p}` : base;
  };
  const all = Object.values(counts).reduce((a, b) => a + b, 0);
  return (
    <>
      <Title lead="Письма с сайта: вопросы, права на книги, пресса.">Обращения</Title>
      <Tabs items={[{ href: url({ kind }), label: "Все", n: all, on: !status }, ...STATUSES.map((s) => ({ href: url({ status: s, kind }), label: STATUS[s], n: counts[s] ?? 0, on: status === s }))]} />
      <Tabs items={[{ href: url({ status }), label: "Любые", on: !kind }, ...Object.entries(KIND).map(([k, label]) => ({ href: url({ status, kind: k }), label, on: kind === k }))]} />
      {rows.length === 0 ? (
        <Empty>{status || kind ? "В этом срезе пусто." : "Пока никто не писал. Форма стоит на главной странице."}</Empty>
      ) : (
        <ul className="rule-t">
          {rows.map((q) => (
            <li key={q.id} id={q.id} className="scroll-mt-28 rule-b py-6 target:bg-bg-sunk">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-display text-xl">{q.name}</span>
                <Tag on={q.status === "new"}>{STATUS[q.status]}</Tag>
                <Tag>{KIND[q.kind] ?? q.kind}</Tag>
                <span className="ml-auto text-sm text-muted">{when(q.created_at)}</span>
              </div>
              <p className="mt-1 text-sm text-muted">
                <Link href={`/${locale}/admin/readers?q=${encodeURIComponent(q.email)}`} className="underline underline-offset-4">{q.email}</Link>
                {q.book && `, ${bookTitle(q.book)}`}{q.lang && `, язык ${q.lang}`}
              </p>
              <p className="mt-3 max-w-[70ch] whitespace-pre-wrap break-words">{q.message}</p>
              <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-3">
                <Form action={setInquiry} className="flex min-w-0 basis-full flex-wrap items-end gap-2 lg:flex-1 lg:basis-0">
                  <input type="hidden" name="id" value={q.id} />
                  <label className="text-sm text-muted">Статус
                    <select key={q.status} name="status" defaultValue={q.status} className={`${field} mt-1 block w-44`}>
                      {STATUSES.map((s) => <option key={s} value={s}>{STATUS[s]}</option>)}
                    </select>
                  </label>
                  <label className="min-w-48 flex-1 basis-full sm:basis-0 text-sm text-muted">Заметка себе
                    <input name="note" defaultValue={q.note ?? ""} placeholder="Что обещали, кому переслали" className={`${field} mt-1`} />
                  </label>
                  <Submit>Сохранить</Submit>
                </Form>
                <a href={`mailto:${q.email}?subject=${encodeURIComponent("Re: Neural Cosmology")}`} className="inline-flex min-h-10 items-center rounded-sm hairline px-4 text-sm hover:bg-fg hover:text-bg">Ответить письмом</a>
                <Danger action={deleteInquiry} values={{ id: q.id }} ask="Удалить насовсем?">Удалить</Danger>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Pager page={page} total={total} href={(p) => url({ status, kind, page: p })} />
    </>
  );
}
