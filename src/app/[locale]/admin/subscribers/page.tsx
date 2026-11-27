import { Act, Danger } from "@/components/admin/forms";
import { Empty, Pager, Part, SUB, Search, Tabs, Title, day } from "@/components/admin/ui";
import { deleteSubscriber, stopSubscriber } from "@/lib/admin/actions";
import { owner } from "@/lib/admin/guard";
import { bookTitle, subscribers } from "@/lib/admin/data";
import { importAudience } from "@/lib/admin/actions";
import { Form, Submit } from "@/components/admin/forms";

type P = { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string; status?: string; page?: string }> };

export default async function Subscribers({ params, searchParams }: P) {
  const { locale } = await params;
  const base = `/${locale}/admin/subscribers`;
  await owner(base);
  const sp = await searchParams;
  const status = SUB[sp.status ?? ""] ? sp.status : undefined;
  const q = sp.q?.trim().slice(0, 100) || undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const { rows, total, counts, sources } = await subscribers({ q, status, page });
  const url = (x: Record<string, string | undefined>) => {
    const p = new URLSearchParams(Object.entries(x).filter((e): e is [string, string] => Boolean(e[1])));
    return p.size ? `${base}?${p}` : base;
  };
  const max = Math.max(1, ...sources.map((s) => s.n));
  return (
    <>
      <Title lead="Письма о новых главах получают только подтвердившие адрес." aside={<a href="/api/admin/subscribers/export" className="inline-flex min-h-10 items-center rounded-sm hairline px-4 text-sm hover:bg-fg hover:text-bg">Скачать подтверждённых (CSV)</a>}>Подписчики</Title>
      <Tabs items={[{ href: url({ q }), label: "Все", n: Object.values(counts).reduce((a, b) => a + b, 0), on: !status }, ...Object.entries(SUB).map(([k, label]) => ({ href: url({ q, status: k }), label, n: counts[k] ?? 0, on: status === k }))]} />
      <Search q={q} placeholder="Почта" keep={{ status }} />
      {rows.length === 0 ? <Empty>{q || status ? "В этом срезе никого." : "Подписчиков пока нет."}</Empty> : (
        <ul className="rule-t">
          {rows.map((s) => (
            <li key={s.email} className="flex flex-wrap items-center gap-x-4 gap-y-2 rule-b py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate">{s.email}</p>
                <p className="text-sm text-muted">{SUB[s.status]}, {s.lang}{s.book ? `, ${bookTitle(s.book)}` : ""}{s.source ? `, ${s.source}` : ""}, {day(s.created_at)}</p>
              </div>
              {s.status !== "unsubscribed" && <Act action={stopSubscriber} values={{ email: s.email }}>Больше не писать</Act>}
              <Danger action={deleteSubscriber} values={{ email: s.email }} ask="Стереть адрес?">Удалить</Danger>
            </li>
          ))}
        </ul>
      )}
      <Pager page={page} total={total} href={(p) => url({ q, status, page: String(p) })} />
      {sources.length > 0 && (
        <Part title="Где оставляют почту">
          <ul className="space-y-2">
            {sources.map((s) => (
              <li key={s.source} className="grid grid-cols-[minmax(7rem,14rem)_1fr_auto] items-center gap-3 text-sm">
                <span className="truncate">{s.source}</span>
                <span className="block h-3 bg-line-soft/60" style={{ width: `${(s.n / max) * 100}%` }}><span className="block h-full bg-fg" style={{ width: `${(s.confirmed / s.n) * 100}%` }} /></span>
                <span className="tabular-nums text-muted">подтвердили {s.confirmed} из {s.n}</span>
              </li>
            ))}
          </ul>
        </Part>
      )}
      <Part title="Адресная книга">
        <p className="mb-4 max-w-[60ch] text-fg-secondary">Переносит старые списки в общую адресную книгу. Подтвердившие подписку и включившие письма в кабинете будут отмечены как согласившиеся, отписавшиеся попадут в стоп-лист, авторы обращений станут контактами. Рассылка о новых главах сверяется со стоп-листом перед каждым письмом. Повторное нажатие ничего не меняет.</p>
        <Form action={importAudience}><Submit>Перенести в адресную книгу</Submit></Form>
      </Part>
    </>
  );
}
