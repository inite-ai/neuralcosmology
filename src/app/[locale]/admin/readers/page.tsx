import Link from "next/link";
import { Act, Form, Submit } from "@/components/admin/forms";
import { Empty, Pager, Part, Search, Title, day, when, field } from "@/components/admin/ui";
import { grantBook, setGrant } from "@/lib/admin/actions";
import { owner } from "@/lib/admin/guard";
import { bookTitle, grants, readers } from "@/lib/admin/data";
import { books } from "@/content/books";

type P = { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string; page?: string }> };

export default async function Readers({ params, searchParams }: P) {
  const { locale } = await params;
  const base = `/${locale}/admin/readers`;
  await owner(base);
  const sp = await searchParams;
  const q = sp.q?.trim().slice(0, 100) || undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const [list, given] = await Promise.all([readers({ q, page }), grants()]);
  return (
    <>
      <Title lead="Все, кто входил на сайт или читал книги под своим именем.">Читатели</Title>
      <Search q={q} placeholder="Почта, имя или номер аккаунта" />
      {list.rows.length === 0 ? (
        <Empty>{q ? "Никого не нашлось. Доступ можно выдать и на почту, с которой ещё не входили." : "Пока никто не входил."}</Empty>
      ) : (
        <ul className="rule-t">
          {list.rows.map((r) => (
            <li key={r.user_id} className="rule-b">
              <Link href={`${base}/person?id=${encodeURIComponent(r.user_id)}`} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3 hover:bg-bg-sunk">
                <span className="min-w-0 basis-full truncate md:flex-1 md:basis-0">{r.email ?? r.name ?? <span className="text-muted">{r.user_id.slice(-12)}</span>}{r.email && r.name ? <span className="text-muted">, {r.name}</span> : null}</span>
                <span className="min-w-0 truncate text-sm text-fg-secondary">{(r.books ?? []).map(bookTitle).join(", ") || "ничего не открывал"}</span>
                <span className="ml-auto text-right text-sm text-muted md:w-32">{when(r.seen)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Pager page={page} total={list.total} href={(p) => `${base}?${new URLSearchParams({ ...(q ? { q } : {}), page: String(p) })}`} />

      <Part title="Подарить доступ">
        <p className="mb-4 max-w-[60ch] text-fg-secondary">Рецензенту, издателю, другу. Книга откроется, когда человек войдёт с этой почтой и подтвердит её. Письмо само не уходит.</p>
        <Form action={grantBook} reset className="flex flex-wrap items-end gap-2">
          <label className="min-w-56 flex-1 text-sm text-muted">Почта<input name="email" type="email" required autoComplete="off" className={`${field} mt-1`} /></label>
          <label className="text-sm text-muted">Книга
            <select name="book" className={`${field} mt-1 block w-52`}><option value="library">Вся библиотека</option>{books.filter((b) => !b.freeForContact).map((b) => <option key={b.slug} value={b.slug}>{bookTitle(b.slug)}</option>)}</select>
          </label>
          <label className="min-w-40 flex-1 text-sm text-muted">Для чего<input name="note" placeholder="рецензия" className={`${field} mt-1`} /></label>
          <Submit>Выдать доступ</Submit>
        </Form>
      </Part>

      <Part title="Выданный доступ">
        {given.length === 0 ? <Empty>Подаренных доступов нет.</Empty> : (
          <ul className="rule-t">
            {given.map((g) => (
              <li key={g.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 rule-b py-3">
                <span className={`min-w-0 flex-1 truncate ${g.revoked_at ? "text-muted line-through" : ""}`}>{g.email ?? g.user_id}</span>
                <span className="text-sm">{bookTitle(g.book)}</span>
                <span className="text-sm text-muted">{g.note ? `${g.note}, ` : ""}{day(g.created_at)}</span>
                <Act action={setGrant} values={{ id: g.id, on: g.revoked_at ? "1" : "0" }}>{g.revoked_at ? "Вернуть" : "Снять"}</Act>
              </li>
            ))}
          </ul>
        )}
      </Part>
    </>
  );
}
