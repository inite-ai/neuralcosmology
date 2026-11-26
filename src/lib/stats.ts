// Браузерная сторона своего счёта (lib/stats.server). Маяк с тем, что за страница,
// и на первой странице визита — откуда пришли. В браузере для этого ничего не хранится.

type Event = "page" | "chapter_open" | "chapter_complete";

export function stat(n: Event, extra: { b?: string; c?: string; l?: string } = {}): void {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify({ n, p: window.location.pathname + window.location.search, r: document.referrer, ...extra });
    if (!navigator.sendBeacon?.("/api/stats", new Blob([body], { type: "application/json" }))) {
      void fetch("/api/stats", { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true }).catch(() => {});
    }
  } catch {
    // Счёт не должен ронять страницу.
  }
}
