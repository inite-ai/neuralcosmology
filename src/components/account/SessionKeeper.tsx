"use client";
import { useEffect } from "react";
import { refreshSession } from "@inite/auth/client";

const EVERY = 4 * 60_000;

// Access token живёт около десяти минут, а главу читают дольше: пока вошедший читатель
// на странице, продлеваем его, иначе прогресс и пометки перестанут сохраняться. Вкладки
// по очереди (Web Locks): refresh token одноразовый.
export default function SessionKeeper() {
  useEffect(() => {
    let signedIn = false;
    const KEY = "nc-session-kept";
    const read = () => {
      try { return Number(localStorage.getItem(KEY)) || 0; } catch { return 0; }
    };
    const write = () => {
      try { localStorage.setItem(KEY, String(Date.now())); } catch {}
    };
    const keep = async () => {
      if (!signedIn || document.visibilityState !== "visible") return;
      const renew = async () => {
        if (Date.now() - read() < EVERY) return;
        if (await refreshSession()) write();
      };
      if (navigator.locks) await navigator.locks.request("nc-session", renew);
      else await renew();
    };
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { uid?: string | null } | null) => {
        signedIn = Boolean(j?.uid);
      })
      .catch(() => {});
    const t = setInterval(() => void keep(), 60_000);
    const onVisible = () => void keep();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);
  return null;
}
