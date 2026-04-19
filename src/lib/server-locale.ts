import { cookies, headers } from "next/headers";
import {
  DEFAULT_LOCALE,
  isSupportedLocale,
  type SupportedLocale,
} from "@/lib/get-locale";

/**
 * Server-side locale resolution:
 *  1. URL path prefix (read from middleware's x-pathname header)
 *  2. i18nextLng cookie
 *  3. x-locale header (middleware writes this from Accept-Language)
 *  4. Accept-Language direct
 *  5. DEFAULT_LOCALE
 */
export async function getServerLocale(): Promise<SupportedLocale> {
  try {
    const headerStore = await headers();

    const pathname = headerStore.get("x-pathname") ?? "";
    const firstSeg = pathname.split("/").filter(Boolean)[0];
    if (firstSeg && isSupportedLocale(firstSeg)) return firstSeg;

    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get("i18nextLng")?.value;
    if (cookieLocale && isSupportedLocale(cookieLocale)) return cookieLocale;

    const headerLocale = headerStore.get("x-locale");
    if (headerLocale && isSupportedLocale(headerLocale)) return headerLocale;

    const acceptLanguage = headerStore.get("accept-language");
    if (acceptLanguage) {
      const browserLocales = acceptLanguage
        .split(",")
        .map((lang) => lang.split(";")[0].trim().toLowerCase());
      for (const loc of browserLocales) {
        if (isSupportedLocale(loc)) return loc;
        const short = loc.split("-")[0];
        if (isSupportedLocale(short)) return short;
      }
    }
  } catch {
    // Fall through to default
  }
  return DEFAULT_LOCALE;
}
