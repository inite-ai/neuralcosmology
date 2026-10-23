import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../../globals.css";
import { fontVariables } from "../../fonts";
import { isSupportedLocale } from "@/lib/get-locale";

// Отдельный корневой layout для опытов, встроенных на чужие сайты: без шапки, подвала,
// баннера и аналитики — только сам опыт и ссылка на источник. В поиск не идёт:
// у каждой рамки canonical на страницу опыта.

export const metadata: Metadata = {
  metadataBase: new URL("https://neuralcosmology.com"),
  robots: { index: false, follow: true },
};

export default async function EmbedLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  return (
    <html lang={locale === "pt" ? "pt-BR" : locale} suppressHydrationWarning className={fontVariables}>
      <head>
        {/* Тема берётся из ?theme=dark|light, иначе из системы. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "(function(){var d=document.documentElement;d.classList.add('js');var t=new URLSearchParams(location.search).get('theme');if(t==='dark'||t==='light')d.classList.add(t)})()",
          }}
        />
      </head>
      <body className="bg-bg text-fg antialiased">{children}</body>
    </html>
  );
}
