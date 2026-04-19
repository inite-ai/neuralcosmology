export const SUPPORTED_LOCALES = ["en", "ru", "pt", "es"] as const;
export const DEFAULT_LOCALE: SupportedLocale = "en";

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(locale);
}
