"use client";

import { useState } from "react";
import { newEventId, track } from "@/components/analytics/Analytics";

// Подписка на новые главы и опыты без аккаунта (POST /api/subscribe, двойное
// подтверждение письмом). Ставится под барьером закрытой главы, в конце бесплатных
// глав и на страницах опытов.

type Lang = "ru" | "en" | "pt" | "es";
type State = "idle" | "busy" | "sent" | "saved" | "already" | "error";

const T: Record<Lang, { title: string; text: string; placeholder: string; cta: string; done: Record<"sent" | "saved" | "already" | "error", string> }> = {
  ru: {
    title: "Письмо о новых главах и опытах",
    text: "Не чаще раза в неделю. Без регистрации, отписка в одно нажатие.",
    placeholder: "Ваш e-mail", cta: "Подписаться",
    done: { sent: "Проверьте почту: там ссылка для подтверждения.", saved: "Адрес сохранён. Письмо с подтверждением придёт на него.", already: "Вы уже подписаны.", error: "Не получилось. Проверьте адрес и попробуйте ещё раз." },
  },
  en: {
    title: "An email when new chapters and experiments come out",
    text: "At most once a week. No account needed; unsubscribe in one click.",
    placeholder: "Your email", cta: "Subscribe",
    done: { sent: "Check your inbox for the confirmation link.", saved: "Address saved. A confirmation email will follow.", already: "You’re already subscribed.", error: "That didn’t work. Check the address and try again." },
  },
  pt: {
    title: "Um e-mail quando saírem novos capítulos e experimentos",
    text: "No máximo uma vez por semana. Sem cadastro; cancele com um clique.",
    placeholder: "Seu e-mail", cta: "Inscrever-se",
    done: { sent: "Veja sua caixa de entrada: lá está o link de confirmação.", saved: "Endereço salvo. O e-mail de confirmação chegará nele.", already: "Você já está inscrito.", error: "Não deu certo. Confira o endereço e tente de novo." },
  },
  es: {
    title: "Un correo cuando salgan capítulos y experimentos nuevos",
    text: "Como mucho una vez por semana. Sin registro; baja con un clic.",
    placeholder: "Su correo", cta: "Suscribirse",
    done: { sent: "Revise su correo: allí está el enlace de confirmación.", saved: "Dirección guardada. Le llegará un correo de confirmación.", already: "Ya está suscrito.", error: "No funcionó. Revise la dirección e inténtelo de nuevo." },
  },
};

export default function Subscribe({ locale, book, source }: { locale: string; book?: string; source: string }) {
  const lang = (["ru", "en", "pt", "es"].includes(locale) ? locale : "en") as Lang;
  const t = T[lang];
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const company = (new FormData(e.currentTarget).get("company") as string) || "";
    setState("busy");
    // Один event_id на браузерный и серверный Lead (сервер шлёт его с хешем почты).
    const eventId = newEventId();
    try {
      const r = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lang, book, source, company, event_id: eventId }),
      });
      const j = (await r.json().catch(() => ({}))) as { status?: State };
      const s = r.ok && j.status ? j.status : "error";
      setState(s);
      if (s !== "error") track("generate_lead", { method: "email", source, book }, eventId);
    } catch {
      setState("error");
    }
  };

  const done = state === "sent" || state === "saved" || state === "already";
  return (
    <section className="nc-sub" aria-label={t.title}>
      <p className="nc-sub-title">{t.title}</p>
      <p className="nc-sub-text">{t.text}</p>
      {done ? (
        <p className="nc-sub-done" role="status">{t.done[state]}</p>
      ) : (
        <form onSubmit={submit} className="nc-sub-form">
          <input type="email" required autoComplete="email" inputMode="email" placeholder={t.placeholder} value={email} onChange={(e) => setEmail(e.target.value)} aria-label={t.placeholder} />
          <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="nc-sub-trap" />
          <button type="submit" disabled={state === "busy"}>{t.cta}</button>
        </form>
      )}
      {state === "error" && <p className="nc-sub-err" role="alert">{t.done.error}</p>}
    </section>
  );
}
