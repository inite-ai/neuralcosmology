import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const supportedLocales = ["en", "ru", "pt", "es"] as const;
const defaultLocale = "en";

type Locale = (typeof supportedLocales)[number];

const ROOT_SURFACES = new Set<string>([
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.webmanifest",
  "/site.webmanifest",
  "/favicon.ico",
]);

function detectLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get("i18nextLng")?.value;
  if (cookieLocale && (supportedLocales as readonly string[]).includes(cookieLocale)) {
    return cookieLocale as Locale;
  }

  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const browserLocales = acceptLanguage
      .split(",")
      .map((lang) => lang.split(";")[0].trim().toLowerCase());
    for (const loc of browserLocales) {
      if ((supportedLocales as readonly string[]).includes(loc)) return loc as Locale;
      const short = loc.split("-")[0];
      if ((supportedLocales as readonly string[]).includes(short)) return short as Locale;
    }
  }
  return defaultLocale;
}

function pathnameHasLocale(pathname: string): boolean {
  const seg = pathname.split("/").filter(Boolean)[0];
  return !!seg && (supportedLocales as readonly string[]).includes(seg);
}

// Локаль уходит в заголовок запроса — корневой layout ставит по ней <html lang>.
function nextWithLocale(request: NextRequest, locale: Locale) {
  const headers = new Headers(request.headers);
  headers.set("x-locale", locale);
  return NextResponse.next({ request: { headers } });
}

function withSeoHeaders(
  request: NextRequest,
  response: NextResponse,
  locale: Locale,
  pathname: string,
) {
  const currentCookie = request.cookies.get("i18nextLng")?.value;
  if (!currentCookie || currentCookie !== locale) {
    response.cookies.set("i18nextLng", locale, {
      maxAge: 365 * 24 * 60 * 60,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  response.headers.set("x-locale", locale);
  response.headers.set("x-pathname", pathname);
  response.headers.set("x-robots-tag", "index, follow");
  response.headers.set("x-content-type-options", "nosniff");
  response.headers.set("x-frame-options", "DENY");
  response.headers.set("referrer-policy", "strict-origin-when-cross-origin");
  response.headers.set("Vary", "Accept-Language, Accept-Encoding");


  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next/") || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Один хост: www → основной домен.
  const host = request.headers.get("host") ?? "";
  if (host.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.host = host.slice(4);
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  if (ROOT_SURFACES.has(pathname)) {
    return withSeoHeaders(request, NextResponse.next(), detectLocale(request), pathname);
  }

  if (pathname.includes(".")) {
    return NextResponse.next();
  }

  const detectedLocale = detectLocale(request);

  if (pathnameHasLocale(pathname)) {
    const urlLocale = pathname.split("/").filter(Boolean)[0] as Locale;
    return withSeoHeaders(request, nextWithLocale(request, urlLocale), urlLocale, pathname);
  }

  const target = request.nextUrl.clone();
  target.pathname = `/${detectedLocale}${pathname === "/" ? "" : pathname}`;
  const redirect = NextResponse.redirect(target, 307);
  if (request.cookies.get("i18nextLng")?.value !== detectedLocale) {
    redirect.cookies.set("i18nextLng", detectedLocale, {
      maxAge: 365 * 24 * 60 * 60,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }
  return redirect;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|favicons|covers|pdfs|fonts|media|og/|stars.svg|og-default.svg|file.svg|globe.svg|next.svg|vercel.svg|window.svg).*)",
  ],
};
