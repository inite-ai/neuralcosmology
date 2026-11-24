import Link from "next/link";
import { Core, Empty, Tabs, Title, drop, plural } from "@/components/admin/ui";
import { owner } from "@/lib/admin/guard";
import { bookStats } from "@/lib/admin/data";

type P = { params: Promise<{ locale: string }>; searchParams: Promise<{ book?: string; lang?: string }> };

export default async function Books({ params, searchParams }: P) {
  const { locale } = await params;
  const base = `/${locale}/admin/books`;
  await owner(base);
  const sp = await searchParams;
  const all = await bookStats();
  const slug = all.find((b) => b.slug === sp.book)?.slug ?? [...all].sort((a, b) => b.readers - a.readers)[0]?.slug;
  const [b] = slug ? await bookStats({ slug, lang: sp.lang }) : [];
  const d = b ? drop(b) : null;
  return (
    <>
      <Title lead="Считаются вошедшие читатели: анонимное чтение сайт не хранит.">Книги</Title>
      <Tabs items={all.map((x) => ({ href: `${base}?book=${x.slug}`, label: x.title, n: x.readers, on: x.slug === slug }))} />
      {!b || b.chapters.length === 0 ? <Empty>Глав этой книги нет в библиотеке на сервере.</Empty> : (
        <>
          <p className="mb-6 max-w-[62ch] text-lg leading-relaxed">
            {plural(b.readers, "читатель", "читателя", "читателей")}, до последней главы дошли {b.finished}. {plural(b.sold, "покупка", "покупки", "покупок")}, {plural(b.shares, "цитата", "цитаты", "цитат")} в соцсетях, {plural(b.comments, "комментарий", "комментария", "комментариев")}.
            {d && <> Больше всего останавливаются после главы «{d.from.title}»: дальше не пошли {d.lost} из {d.from.opened}.</>}
          </p>
          {b.langs.length > 1 && <Tabs items={b.langs.map((l) => ({ href: `${base}?book=${b.slug}&lang=${l.lang}`, label: l.lang, n: l.readers, on: l.lang === b.lang }))} />}
          <Core book={b} tall />
          <p className="mt-3 text-sm text-muted">Столбик — глава: светлое открыли, тёмное дочитали. Цветная черта снизу: глава открыта всем.</p>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[30rem] text-left text-[0.9375rem]">
              <thead><tr className="rule-b text-sm text-muted"><th className="py-2 pr-4 font-normal">Глава</th><th className="py-2 pr-4 text-right font-normal">Открыли</th><th className="py-2 pr-4 text-right font-normal">Дочитали</th><th className="py-2 text-right font-normal">Доля</th></tr></thead>
              <tbody>
                {b.chapters.map((c) => (
                  <tr key={c.id} className="rule-b">
                    <td className="py-2 pr-4"><Link href={`/${b.lang}/read/${b.slug}/${c.id}`} className="hover:text-primary">{c.number != null ? `${c.number}. ` : ""}{c.title}</Link>{c.free && <span className="ml-2 text-sm text-primary">открыта всем</span>}</td>
                    <td className="py-2 pr-4 text-right tabular-nums">{c.opened}</td>
                    <td className="py-2 pr-4 text-right tabular-nums">{c.read}</td>
                    <td className="py-2 text-right tabular-nums text-muted">{c.opened ? `${Math.round((c.read / c.opened) * 100)}%` : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
