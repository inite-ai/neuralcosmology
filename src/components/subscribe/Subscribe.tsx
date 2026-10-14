"use client";

import { useState } from "react";
import { newEventId, track } from "@/components/analytics/Analytics";
import { channels } from "@/content/channels";

// Подписка на новые главы и опыты без аккаунта (POST /api/subscribe, двойное
// подтверждение письмом). Ставится под барьером закрытой главы, в середине и в конце
// бесплатных глав и на страницах опытов. В середине главы (variant="inline") заголовок
// обращается к тому, кто уже читает.

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

const WHATSAPP: Record<Lang, string> = {
  ru: "Или следите в WhatsApp",
  en: "Or follow on WhatsApp",
  pt: "Ou siga no WhatsApp",
  es: "O síganos en WhatsApp",
};

const INLINE: Record<Lang, string> = {
  ru: "Нравится? Новые главы и опыты — на почту",
  en: "Enjoying it? New chapters and experiments by email",
  pt: "Está gostando? Novos capítulos e experimentos no seu e-mail",
  es: "¿Le gusta? Capítulos y experimentos nuevos en su correo",
};

// Адрес ради дела: прислать опыт и главу (later) или ссылку, открывающую главу (unlock).
const ACTION: Record<"later" | "unlock", Record<Lang, { title: (ch?: string) => string; text: string; cta: string; sent: string }>> = {
  later: {
    ru: { title: () => "Нет времени сейчас? Пришлём на почту", text: "Опыт и главу, из которой он взят, чтобы открыть спокойно, хоть на компьютере. Без регистрации.", cta: "Прислать", sent: "Готово: письмо уже в почте." },
    en: { title: () => "No time now? We’ll email it", text: "The experiment and the chapter it comes from, to open later, even on a computer. No account needed.", cta: "Send it", sent: "Done: it’s in your inbox." },
    pt: { title: () => "Sem tempo agora? Mandamos para o seu e-mail", text: "O experimento e o capítulo de onde ele vem, para abrir com calma, até no computador. Sem cadastro.", cta: "Enviar", sent: "Pronto: já está no seu e-mail." },
    es: { title: () => "¿Sin tiempo ahora? Se lo enviamos", text: "El experimento y el capítulo de donde viene, para abrirlo con calma, incluso en el ordenador. Sin registro.", cta: "Enviar", sent: "Listo: ya está en su correo." },
  },
  unlock: {
    ru: { title: (c) => (c ? `Глава «${c}» бесплатно — за ваш e-mail` : "Следующая глава бесплатно — за ваш e-mail"), text: "Пришлём ссылку: по ней глава откроется на этом устройстве. Потом — новые главы и опыты, не чаще раза в неделю; отписка в одно нажатие.", cta: "Получить ссылку", sent: "Проверьте почту: ссылка откроет главу." },
    en: { title: (c) => (c ? `Read “${c}” free with your email` : "The next chapter free with your email"), text: "We’ll send a link that opens the chapter on this device. Then new chapters and experiments, at most once a week; unsubscribe in one click.", cta: "Get the link", sent: "Check your inbox: the link opens the chapter." },
    pt: { title: (c) => (c ? `Leia “${c}” de graça com o seu e-mail` : "O próximo capítulo de graça com o seu e-mail"), text: "Mandamos um link que abre o capítulo neste aparelho. Depois, novos capítulos e experimentos, no máximo uma vez por semana; cancele com um clique.", cta: "Receber o link", sent: "Veja seu e-mail: o link abre o capítulo." },
    es: { title: (c) => (c ? `Lea «${c}» gratis con su correo` : "El próximo capítulo gratis con su correo"), text: "Le enviamos un enlace que abre el capítulo en este dispositivo. Después, capítulos y experimentos nuevos, como mucho una vez por semana; baja con un clic.", cta: "Recibir el enlace", sent: "Revise su correo: el enlace abre el capítulo." },
  },
};

export default function Subscribe({
  locale,
  book,
  source,
  variant,
  kind,
  item,
  to,
  chapterTitle,
}: {
  locale: string;
  book?: string;
  source: string;
  variant?: "inline";
  kind?: "later" | "unlock";
  item?: string;
  to?: string;
  chapterTitle?: string;
}) {
  const lang = (["ru", "en", "pt", "es"].includes(locale) ? locale : "en") as Lang;
  const a = kind ? ACTION[kind][lang] : null;
  const t = a
    ? { ...T[lang], title: a.title(chapterTitle), text: a.text, cta: a.cta, done: { ...T[lang].done, sent: a.sent, already: a.sent } }
    : variant === "inline"
      ? { ...T[lang], title: INLINE[lang] }
      : T[lang];
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
        body: JSON.stringify({ email, lang, book, source, company, event_id: eventId, kind, item, to }),
      });
      const j = (await r.json().catch(() => ({}))) as { status?: State };
      const s = r.ok && j.status ? j.status : "error";
      setState(s);
      if (s !== "error") track("generate_lead", { method: kind ?? "email", source, book }, eventId);
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
      {channels.whatsapp && (
        <a
          href={channels.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("join_channel", { method: "whatsapp", source })}
          className="nc-sub-alt"
        >
          {WHATSAPP[lang]} →
        </a>
      )}
    </section>
  );
}
