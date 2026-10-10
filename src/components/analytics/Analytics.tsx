"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PRICES, kindOf } from "@/content/pricing";
import { readCurrency } from "@/components/pricing/Price";
import { verification } from "@/content/verification";
import { pixels } from "@/content/pixels";

// GA4 + воронка продаж книг + рекламные пиксели (content/pixels.ts). Без баннера:
// в ЕЭЗ/UK/CH cookies аналитики и рекламы по умолчанию запрещены (Consent Mode шлёт
// обезличенные пинги, пиксели не грузятся), в остальных регионах разрешены.
export const GA_ID = "G-3QLFL17GG2";

const EEA = ["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE","IS","LI","NO","GB","CH"];

type Gtag = (...args: unknown[]) => void;
const gtag: Gtag = (...args) => {
  const w = window as unknown as { gtag?: Gtag };
  w.gtag?.(...args);
};
const MID = verification.metrika;

// Часовые пояса Европы вне ЕЭЗ/UK/CH: там пиксели можно грузить без баннера.
const NON_EEA_TZ = /^Europe\/(Moscow|Minsk|Kaliningrad|Samara|Volgograd|Kirov|Astrakhan|Saratov|Ulyanovsk|Simferopol|Istanbul|Kyiv|Kiev|Uzhgorod|Zaporozhye|Chisinau|Belgrade|Sarajevo|Podgorica|Skopje|Tirane)$/;
export function inEEA(): boolean {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    return /^(Europe\/|Atlantic\/(Reykjavik|Canary|Madeira|Azores|Faroe))/.test(tz) && !NON_EEA_TZ.test(tz);
  } catch {
    return true;
  }
}

type W = {
  ym?: (...a: unknown[]) => void;
  fbq?: (...a: unknown[]) => void;
  rdt?: (...a: unknown[]) => void;
  _tmr?: unknown[];
};

// Наши события → стандартные события пикселей.
const META: Record<string, string> = { read_chapter: "ViewContent", begin_checkout: "InitiateCheckout", purchase: "Purchase", generate_lead: "Lead", sign_up: "CompleteRegistration" };
const REDDIT: Record<string, string> = { read_chapter: "ViewContent", begin_checkout: "AddToCart", purchase: "Purchase", generate_lead: "Lead", sign_up: "SignUp" };
const CUSTOM = new Set(["experiment_start", "video_play", "chapter_complete", "share"]);

export function newEventId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

// Дубль события пикселя на сервер (/api/e → Meta Conversions API) с тем же event_id.
function relay(name: string, id: string, custom: Record<string, unknown>) {
  const body = JSON.stringify({ name, id, url: window.location.href, custom });
  try {
    if (navigator.sendBeacon?.("/api/e", new Blob([body], { type: "application/json" }))) return;
  } catch {}
  fetch("/api/e", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
}

// Lead и Purchase шлёт сервер сам (с почтой и суммой) — сюда их не дублируем.
const SERVER_SENT = new Set(["generate_lead", "purchase"]);

// Без fbq (пиксель срезал блокировщик) событие всё равно уходит на сервер.
function metaPageView() {
  const w = window as unknown as W;
  const id = newEventId();
  w.fbq?.("track", "PageView", {}, { eventID: id });
  relay("PageView", id, {});
}

let pending: (() => void)[] | null = [];
let adsAllowed = false;

function metaEvent(event: string, params: Record<string, unknown>, money: Record<string, unknown>, eventId?: string) {
  const w = window as unknown as W;
  const id = eventId ?? (typeof params.transaction_id === "string" ? params.transaction_id : newEventId());
  const ref = params.item_id ?? params.book;
  const data: Record<string, unknown> = META[event]
    ? { ...money, ...(ref ? { content_ids: [String(ref)], content_type: "product" } : {}) }
    : { item_id: params.item_id, widget: params.widget, book: params.book, chapter: params.chapter, method: params.method };
  const name = META[event] ?? event;
  w.fbq?.(META[event] ? "track" : "trackCustom", name, data, { eventID: id });
  if (!SERVER_SENT.has(event)) relay(name, id, data);
}

/** eventId — когда тот же id уже ушёл на сервер (подписка); для покупки берётся transaction_id. */
export function track(event: string, params: Record<string, unknown> = {}, eventId?: string) {
  gtag("event", event, params);
  const w = window as unknown as W;
  // Те же события — целями в Метрике и VK, событиями в Meta и Reddit.
  if (MID && w.ym) w.ym(Number(MID), "reachGoal", event, params);
  if (pixels.vk && w._tmr) w._tmr.push({ id: pixels.vk, type: "reachGoal", goal: event, value: params.value });
  const money = params.value !== undefined ? { value: params.value, currency: params.currency } : {};
  if (META[event] || CUSTOM.has(event)) {
    // Пиксель ставится после гидрации: ранние события (read_chapter на входе) ждут его в очереди.
    if (pending) pending.push(() => metaEvent(event, params, money, eventId));
    else if (w.fbq || adsAllowed) metaEvent(event, params, money, eventId);
  }

  if (w.rdt) {
    if (REDDIT[event]) w.rdt("track", REDDIT[event], { ...money, transactionId: params.transaction_id });
    else if (CUSTOM.has(event)) w.rdt("track", "Custom", { customEventName: event });
  }
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
      const w = window as unknown as W;
      if (adsAllowed) metaPageView();
      w.rdt?.("track", "PageVisit");
      if (pixels.vk) w._tmr?.push({ id: pixels.vk, type: "pageView", url: url.href, start: Date.now() });
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
          // Тот же transaction_id шлёт сервер (Measurement Protocol) — GA4 склеит дубль.
          const tx = document.querySelector<HTMLElement>("[data-nc-tx]")?.dataset.ncTx ?? `${item}-${Date.now()}`;
          track("purchase", { currency: cur, value, transaction_id: tx, items: [{ item_id: item, price: value }] });
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

  // Пиксели — только вне ЕЭЗ и только если ID задан.
  const [ads, setAds] = useState(false);
  useEffect(() => {
    const ok = !inEEA() && Boolean(pixels.meta);
    if (!ok) pending = null;
    adsAllowed = ok;
    setAds(!inEEA());
  }, []);
  // Пиксель ставит официальный сниппет ниже (без своего PageView). Как только fbq
  // появился — первый PageView с event_id и события из очереди (read_chapter на входе).
  useEffect(() => {
    if (!ads || !pixels.meta) return;
    let tries = 0;
    const t = setInterval(() => {
      const w = window as unknown as W;
      if (!w.fbq && ++tries < 100) return;
      clearInterval(t);
      metaPageView();
      const q = pending ?? [];
      pending = null;
      q.forEach((f) => f());
    }, 50);
    return () => clearInterval(t);
  }, [ads]);

  return (
    <>
      {ads && pixels.meta && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixels.meta}');${pixels.metaLegacy ? `fbq('init','${pixels.metaLegacy}');` : ""}`}
        </Script>
      )}
      {ads && pixels.vk && (
        <Script id="vk-pixel" strategy="afterInteractive">
          {`var _tmr=window._tmr||(window._tmr=[]);_tmr.push({id:"${pixels.vk}",type:"pageView",start:(new Date()).getTime()});(function(d,w,id){if(d.getElementById(id))return;var ts=d.createElement("script");ts.type="text/javascript";ts.async=true;ts.id=id;ts.src="https://top-fwz1.mail.ru/js/code.js";var f=function(){var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(ts,s);};if(w.opera=="[object Opera]"){d.addEventListener("DOMContentLoaded",f,false);}else{f();}})(document,window,"tmr-code");`}
        </Script>
      )}
      {ads && pixels.reddit && (
        <Script id="reddit-pixel" strategy="afterInteractive">
          {`!function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);rdt('init','${pixels.reddit}');rdt('track','PageVisit');`}
        </Script>
      )}
      <Script id="ga-consent" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',region:${JSON.stringify(EEA)}});
gtag('consent','default',{analytics_storage:'granted',ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});
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
