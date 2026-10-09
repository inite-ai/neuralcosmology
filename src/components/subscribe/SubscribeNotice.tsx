"use client";

import { useEffect, useState } from "react";
import { track } from "@/components/analytics/Analytics";

// Строка после перехода по ссылке из письма (?subscribed=1 / ?unsubscribed=1).
// Читает адрес на клиенте, чтобы страница оставалась статической.
const T: Record<string, { ok: string; bad: string; off: string }> = {
  ru: { ok: "Подписка подтверждена. Напишу, когда выйдут новые главы и опыты.", bad: "Ссылка устарела или уже использована.", off: "Вы отписались. Писем больше не будет." },
  en: { ok: "Subscription confirmed. I’ll write when new chapters and experiments come out.", bad: "This link has expired or was already used.", off: "You’ve unsubscribed. No more emails." },
  pt: { ok: "Inscrição confirmada. Vou escrever quando saírem novos capítulos e experimentos.", bad: "O link expirou ou já foi usado.", off: "Inscrição cancelada. Não haverá mais e-mails." },
  es: { ok: "Suscripción confirmada. Le escribiré cuando salgan capítulos y experimentos nuevos.", bad: "El enlace caducó o ya se usó.", off: "Se dio de baja. No habrá más correos." },
};

export default function SubscribeNotice({ locale }: { locale: string }) {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const t = T[locale] ?? T.en;
    if (q.has("subscribed")) {
      const ok = q.get("subscribed") === "1";
      setMsg(ok ? t.ok : t.bad);
      if (ok) track("sign_up", { method: "email_confirm" });
    } else if (q.has("unsubscribed")) setMsg(q.get("unsubscribed") === "1" ? t.off : t.bad);
  }, [locale]);
  if (!msg) return null;
  return (
    <p role="status" className="rule-t py-5 md:px-10 font-display text-xl text-primary">
      {msg}
    </p>
  );
}
