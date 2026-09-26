"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { PRICES, kindOf } from "@/content/pricing";
import { readCurrency } from "@/components/pricing/Price";
import { verification } from "@/content/verification";

// GA4 + воронка продаж книг. Без баннера: в ЕЭЗ/UK/CH cookies аналитики по умолчанию
// запрещены (Consent Mode шлёт обезличенные пинги), в остальных регионах разрешены.
export const GA_ID = "G-3QLFL17GG2";

const EEA = ["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE","IS","LI","NO","GB","CH"];

type Gtag = (...args: unknown[]) => void;
const gtag: Gtag = (...args) => {
  const w = window as unknown as { gtag?: Gtag };
  w.gtag?.(...args);
};
const MID = verification.metrika;

export function track(event: string, params: Record<string, unknown> = {}) {
  gtag("event", event, params);
  // Те же события — целями в Метрике.
  const ym = (window as unknown as { ym?: (...a: unknown[]) => void }).ym;
  if (MID && ym) ym(Number(MID), "reachGoal", event, params);
}

const SHARE_HOSTS: [RegExp, string][] = [
  [/t\.me\/share/, "telegram"],
  [/vk\.com\/share/, "vk"],
  [/(twitter|x)\.com\/intent/, "x"],
  [/wa\.me|api\.whatsapp/, "whatsapp"],
  [/facebook\.com\/sharer/, "facebook"],
  [/linkedin\.com\/(sharing|shareArticle)/, "linkedin"],
  [/threads\.(net|com)\/intent/, "threads"],
];

export default function Analytics() {
  const pathname = usePathname();
  const first = useRef(true);

  // page_view на клиентских переходах (первый шлёт config), плюс события читалки и покупки.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (!first.current) {
      gtag("event", "page_view", { page_location: url.href, page_path: url.pathname });
      const ym = (window as unknown as { ym?: (...a: unknown[]) => void }).ym;
      if (MID && ym) ym(Number(MID), "hit", url.href);
    }
    first.current = false;

    const m = url.pathname.match(/^\/([a-z]{2})\/read\/([^/]+)\/([^/]+)/);
    if (m) track("read_chapter", { book: m[2], chapter: m[3], lang: m[1] });

    // Возврат из оплаты: /…/read/<book>/<chapter>?purchased=1
    if (url.searchParams.get("purchased") === "1") {
      const key = `nc-purchase-${url.pathname}`;
      try {
        if (!sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, "1");
          const item = url.searchParams.get("item") ?? m?.[2] ?? "book";
          const cur = readCurrency();
          const value = PRICES[kindOf(item)][cur];
          track("purchase", { currency: cur, value, transaction_id: `${item}-${Date.now()}`, items: [{ item_id: item, price: value }] });
        }
      } catch {}
    }
  }, [pathname]);

  // Клики: начало оплаты, шаринг, вход.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest("a");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (href.startsWith("/api/checkout")) {
        const item = new URLSearchParams(href.split("?")[1] ?? "").get("item") ?? "book";
        const cur = readCurrency();
        const value = PRICES[kindOf(item)][cur];
        track("begin_checkout", { currency: cur, value, items: [{ item_id: item, price: value }] });
      } else if (href.startsWith("/api/auth/login")) {
        track("login_start", {});
      } else {
        const hit = SHARE_HOSTS.find(([re]) => re.test(href));
        if (hit) track("share", { method: hit[1], content_type: "quote", item_id: window.location.pathname });
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <>
      <Script id="ga-consent" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',region:${JSON.stringify(EEA)}});
gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      {MID && (
        <Script id="ym" strategy="afterInteractive">
          {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(${MID},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:false});`}
        </Script>
      )}
    </>
  );
}
