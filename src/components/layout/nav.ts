import type { SupportedLocale } from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";

// Общие для шапки (клиент) и героя (сервер) ссылки меню и подписи.

export const menuLabel: Record<SupportedLocale, { open: string; close: string; read: string }> = {
  en: { open: "Menu", close: "Close", read: "Read online" },
  ru: { open: "Меню", close: "Закрыть", read: "Читать онлайн" },
  pt: { open: "Menu", close: "Fechar", read: "Ler online" },
  es: { open: "Menú", close: "Cerrar", read: "Leer en línea" },
};

export function mainNav(locale: SupportedLocale) {
  const dict = getDict(locale);
  return [
    { href: `/${locale}/books`, label: dict.nav.books },
    { href: `/${locale}/science`, label: dict.nav.science },
    { href: `/${locale}/essays`, label: dict.nav.essays },
    { href: `/${locale}/lectures`, label: dict.nav.lectures },
    { href: `/${locale}/about`, label: dict.nav.about },
  ];
}

export const readLabel = (locale: SupportedLocale) => menuLabel[locale].read;
