import Link from "next/link";
import { Empty, Part, Tabs, Title, plural } from "@/components/admin/ui";
import { owner } from "@/lib/admin/guard";
import { PERIODS, periodOf, siteStats, type BookFunnel } from "@/lib/admin/stats";

type P = { params: Promise<{ locale: string }>; searchParams: Promise<{ days?: string }> };

const num = (n: number) => n.toLocaleString("ru-RU");
const share = (part: number, whole: number) => (whole > 0 ? `${Math.round((part / whole) * 100)}%` : "");
const dayLabel = (d: string) => new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${d}T12:00:00Z`));
const row = "flex flex-wrap items-baseline gap-x-4 gap-y-1 rule-b py-3";

/** Все дни периода, пустые тоже: пропуск — тоже сведение. */
function fillDays(rows: { d: string; visitors: number; views: number }[], days: number) {
  const out: { d: string; visitors: number; views: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86_400_000).toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
    out.push(rows.find((r) => r.d === d) ?? { d, visitors: 0, views: 0 });
  }
  return out;
}

function Days({ rows }: { rows: { d: string; visitors: number; views: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.visitors));
  return (
    <figure className="m-0">
      <div className="flex h-36 items-end gap-[2px] rule-b" role="img" aria-label="Посетители по дням">
        {rows.map((r) => (
          <div key={r.d} className="group relative flex h-full min-w-0 flex-1 items-end">
            <div className="w-full rounded-t-[4px] bg-primary/80 group-hover:bg-primary" style={{ height: r.visitors ? `${Math.max(2, (r.visitors / max) * 100)}%` : 0 }} />
            <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded-sm bg-fg px-2 py-1 text-xs text-bg group-hover:block">
              {dayLabel(r.d)}: {num(r.visitors)} пос., {num(r.views)} стр.
            </span>
          </div>
        ))}
      </div>
      <figcaption className="mt-1 flex justify-between text-xs text-muted">
        <span>{dayLabel(rows[0].d)}</span>
        <span>макс. {num(max)} в день</span>
        <span>{dayLabel(rows[rows.length - 1].d)}</span>
      </figcaption>
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-muted">Таблицей</summary>
        <table className="mt-2 w-full max-w-md text-left tabular-nums">
          <thead className="text-muted"><tr><th className="font-normal">День</th><th className="text-right font-normal">Посетители</th><th className="text-right font-normal">Страницы</th></tr></thead>
          <tbody>
            {[...rows].reverse().map((r) => (
              <tr key={r.d} className="rule-t"><td>{dayLabel(r.d)}</td><td className="text-right">{num(r.visitors)}</td><td className="text-right">{num(r.views)}</td></tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

function Funnel({ b }: { b: BookFunnel }) {
  const steps: [string, number][] = [
    ["Страница книги", b.page],
    ["Открыли главу", b.opened],
    ["Дочитали первую", b.finishedFirst],
    ...(b.free ? ([["Оставили почту", b.signedUp]] as [string, number][]) : ([["Пошли платить", b.checkout], ["Купили", b.bought]] as [string, number][])),
  ];
  return (
    <li className="rule-b py-4">
      <div className="mb-2 flex flex-wrap items-baseline gap-x-3">
        <span className="font-display text-lg">{b.title}</span>
        <span className="text-sm text-muted">{b.free ? "за контакт" : "платная"}</span>
      </div>
      <ol className="m-0 grid list-none grid-cols-2 gap-x-6 gap-y-2 p-0 sm:grid-cols-3 lg:grid-cols-5">
        {steps.map(([label, n], i) => (
          <li key={label}>
            <span className="block text-xs text-muted">{label}</span>
            <span className="text-xl tabular-nums">{num(n)}</span>
            {i > 0 && steps[i - 1][1] > 0 && <span className="ml-2 text-sm text-muted">{share(n, steps[i - 1][1])}</span>}
          </li>
        ))}
      </ol>
      {b.chapters.some((c) => c.opened > 0) && (
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer text-muted">По главам: где перестают читать</summary>
          <table className="mt-2 w-full text-left tabular-nums">
            <thead className="text-muted"><tr><th className="font-normal">Глава</th><th className="text-right font-normal">Открыли</th><th className="text-right font-normal">Дочитали</th></tr></thead>
            <tbody>
              {b.chapters.map((c) => (
                <tr key={c.id} className="rule-t">
                  <td className="py-1 pr-3">{c.title}</td>
                  <td className="text-right">{num(c.opened)}</td>
                  <td className="text-right">{num(c.read)} <span className="text-muted">{share(c.read, c.opened)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      )}
    </li>
  );
}

export default async function Stats({ params, searchParams }: P) {
  const { locale } = await params;
  const base = `/${locale}/admin/stats`;
  await owner(base);
  const days = periodOf((await searchParams).days);
  const s = await siteStats(days);
  const daily = fillDays(s.daily, days);

  return (
    <>
      <Title lead="Сайт считает сам, без кук и без сохранения IP. Посетитель - это человек в пределах одного дня, назавтра он считается заново, поэтому за месяц это сумма дней, а не число людей. Ваши заходы под своим аккаунтом не считаются.">
        Статистика
      </Title>
      <Tabs items={PERIODS.map((d) => ({ href: `${base}?days=${d}`, label: `${d} дней`, on: d === days }))} />

      {s.totals.visitors === 0 ? (
        <Empty>За {plural(days, "день", "дня", "дней")} ничего не записано. Счёт идёт с того дня, как появилась эта страница.</Empty>
      ) : (
        <>
          <dl className="m-0 grid grid-cols-3 gap-6">
            {([["Посетители", s.totals.visitors], ["Страницы", s.totals.views], ["Открыли главу", s.totals.readers]] as const).map(([k, v]) => (
              <div key={k}>
                <dt className="text-sm text-muted">{k}</dt>
                <dd className="m-0 font-display text-3xl tabular-nums">{num(v)}</dd>
              </div>
            ))}
          </dl>

          <Part title="По дням"><Days rows={daily} /></Part>

          <Part title="Книги">
            <ul className="m-0 list-none p-0 rule-t">{s.books.map((b) => <Funnel key={b.slug} b={b} />)}</ul>
            {(s.library.checkout > 0 || s.library.bought > 0) && (
              <p className="mt-3 text-sm text-muted">Вся библиотека: пошли платить {num(s.library.checkout)}, купили {num(s.library.bought)}.</p>
            )}
          </Part>

          <Part title="Откуда приходят">
            {s.sources.length === 0 ? <Empty>Все заходы прямые или без источника.</Empty> : (
              <ul className="m-0 list-none p-0 rule-t">
                {s.sources.map((r) => (
                  <li key={r.source} className={row}><span className="min-w-0 flex-1 truncate">{r.source}</span><span className="tabular-nums">{num(r.visitors)}</span></li>
                ))}
              </ul>
            )}
          </Part>

          <Part title="Страницы">
            <ul className="m-0 list-none p-0 rule-t">
              {s.pages.map((r) => (
                <li key={r.path} className={row}>
                  <Link href={r.path} className="min-w-0 flex-1 truncate hover:text-primary">{r.path}</Link>
                  <span className="tabular-nums">{num(r.visitors)}</span>
                  <span className="w-20 text-right text-sm text-muted tabular-nums">{num(r.views)} просм.</span>
                </li>
              ))}
            </ul>
          </Part>

          {s.countries.length > 0 && (
            <Part title="Страны">
              <ul className="m-0 list-none p-0 rule-t">
                {s.countries.map((r) => (
                  <li key={r.country} className={row}><span className="flex-1">{r.country}</span><span className="tabular-nums">{num(r.visitors)}</span></li>
                ))}
              </ul>
            </Part>
          )}
        </>
      )}
    </>
  );
}
