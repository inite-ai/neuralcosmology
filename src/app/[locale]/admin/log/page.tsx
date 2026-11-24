import { Empty, Pager, Title, when } from "@/components/admin/ui";
import { owner } from "@/lib/admin/guard";
import { bookTitle, log } from "@/lib/admin/data";

const WHAT: Record<string, string> = {
  "inquiry.update": "Обращение: сменён статус", "inquiry.delete": "Обращение удалено", "grant.add": "Доступ выдан", "grant.revoke": "Доступ снят", "grant.restore": "Доступ возвращён",
  "comment.publish": "Комментарий опубликован", "comment.hide": "Комментарий скрыт", "comment.delete": "Комментарий удалён",
  "subscriber.stop": "Подписчику больше не пишем", "subscriber.delete": "Подписчик удалён", "subscriber.export": "Список подписчиков скачан",
};
type P = { params: Promise<{ locale: string }>; searchParams: Promise<{ page?: string }> };

export default async function Log({ params, searchParams }: P) {
  const { locale } = await params;
  const base = `/${locale}/admin/log`;
  await owner(base);
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const { rows, total } = await log(page);
  return (
    <>
      <Title lead="Кто и что менял в бэкофисе. Правки отсюда не удаляются.">Журнал</Title>
      {rows.length === 0 ? <Empty>Здесь появится первое же действие.</Empty> : (
        <ul className="rule-t">
          {rows.map((r) => (
            <li key={r.id} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 rule-b py-3">
              <span>{WHAT[r.action] ?? r.action}</span>
              <span className="min-w-0 flex-1 truncate text-sm text-fg-secondary">{r.target}{typeof r.detail.book === "string" ? `, ${bookTitle(r.detail.book)}` : ""}</span>
              <span className="text-sm text-muted">{r.actor}, {when(r.at)}</span>
            </li>
          ))}
        </ul>
      )}
      <Pager page={page} total={total} href={(p) => `${base}?page=${p}`} />
    </>
  );
}
