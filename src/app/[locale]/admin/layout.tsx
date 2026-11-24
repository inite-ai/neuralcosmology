import type { Metadata } from "next";
import Nav from "@/components/admin/Nav";
import { Sheet } from "@/components/system";
import { owner } from "@/lib/admin/guard";
import { inbox } from "@/lib/admin/data";
import { dbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Бэкофис", robots: { index: false, follow: false } };

// Бэкофис живёт внутри сайта: та же шапка, лист и подвал, разделы — колонкой слева.
// По-русски на любом языке сайта: читает его один человек.
export default async function AdminLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const base = `/${locale}/admin`;
  await owner(base);
  if (!dbConfigured())
    return (
      <main className="pt-14">
        <Sheet><p className="px-0 py-16 md:px-10">База не подключена (DATABASE_URL): показывать нечего.</p></Sheet>
      </main>
    );
  const n = await inbox();
  return (
    <main className="pt-14" lang="ru">
      <Sheet>
        <div className="grid gap-x-12 gap-y-6 py-8 md:grid-cols-[12.5rem_minmax(0,1fr)] md:px-10 md:py-14">
          <div className="min-w-0 md:sticky md:top-28 md:self-start">
            <Nav
              base={base}
              items={[
                { href: base, label: "Сегодня" },
                { href: `${base}/inquiries`, label: "Обращения", count: n.inquiries },
                { href: `${base}/discussions`, label: "Обсуждения", count: n.held },
                { href: `${base}/readers`, label: "Читатели" },
                { href: `${base}/subscribers`, label: "Подписчики" },
                { href: `${base}/books`, label: "Книги" },
                { href: `${base}/quotes`, label: "Цитаты в соцсетях" },
                { href: `${base}/log`, label: "Журнал" },
                { href: `/${locale}/account`, label: "Кабинет читателя" },
              ]}
            />
          </div>
          <div className="min-w-0">{children}</div>
        </div>
      </Sheet>
    </main>
  );
}
