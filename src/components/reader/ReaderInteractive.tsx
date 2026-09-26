"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { MessageCircle, Bookmark, Sparkles, Focus, PenLine, Share2, Link2, Download, ArrowLeft } from "lucide-react";
import { loadProgress } from "./progress";

// Интерактивный слой читалки: пометки (закладки, выделения, заметки), обсуждения
// на полях, ИИ-компаньон, пересказ прошлых глав, режим фокуса, синхронизация места.
// Текст главы — серверный HTML; сюда приходят только якоря абзацев (p[data-a]).

type Lang = "en" | "ru" | "pt" | "es";
type Annotation = {
  id: string; chapter: string; anchor: string; kind: "bookmark" | "highlight" | "note";
  quote: string; start_off: number | null; end_off: number | null; color: string | null; note: string | null;
};
type Comment = {
  id: string; anchor: string | null; parent_id: string | null; author_name: string; is_author: boolean;
  quote: string | null; body: string; status: string; pinned: boolean; created_at: string;
  mine: boolean; likes: number; liked: boolean;
};
type Sel = { anchor: string; quote: string; start: number; end: number; rect: DOMRect };
type Tab = "discuss" | "notes" | "ai";
type ChatMsg = { role: "user" | "assistant"; content: string };

const T: Record<Lang, Record<string, string>> = {
  ru: {
    highlight: "Выделить", note: "Заметка", bookmark: "Закладка", discuss: "Обсудить", explain: "Объяснить", share: "Поделиться",
    tabDiscuss: "Обсуждение", tabNotes: "Пометки", tabAi: "ИИ", chapterThread: "Обсуждение главы", placeThread: "Обсуждение места",
    write: "Написать", reply: "Ответить", send: "Отправить", signIn: "Войдите, чтобы участвовать", empty: "Пока тихо. Начните разговор.",
    noNotes: "Выделите текст, чтобы сохранить цитату, заметку или закладку.", askPh: "Спросите о прочитанном…", ask: "Спросить",
    aiIntro: "ИИ знает только уже прочитанное и не раскрывает, что будет дальше.", limit: "Дневной лимит вопросов исчерпан.",
    aiOff: "ИИ-компаньон скоро появится.", recap: "Напомнить, что было", recapTitle: "Ранее", like: "Нравится",
    hide: "Скрыть", show: "Показать", pin: "Закрепить", unpin: "Открепить", del: "Удалить", author: "автор",
    notePh: "Ваша заметка…", save: "Сохранить", copied: "Ссылка скопирована", focus: "Фокус", resume: "Продолжить с места",
    rejected: "Сообщение не прошло модерацию.", close: "Закрыть", all: "Вся глава", delete: "Удалить",
  },
  en: {
    highlight: "Highlight", note: "Note", bookmark: "Bookmark", discuss: "Discuss", explain: "Explain", share: "Share",
    tabDiscuss: "Discussion", tabNotes: "Notes", tabAi: "AI", chapterThread: "Chapter discussion", placeThread: "On this passage",
    write: "Write", reply: "Reply", send: "Send", signIn: "Sign in to join", empty: "Quiet so far. Start the conversation.",
    noNotes: "Select text to save a quote, a note or a bookmark.", askPh: "Ask about what you've read…", ask: "Ask",
    aiIntro: "The AI knows only what you've already read and never reveals what comes next.", limit: "Daily question limit reached.",
    aiOff: "The AI companion is coming soon.", recap: "Remind me what happened", recapTitle: "Previously", like: "Like",
    hide: "Hide", show: "Show", pin: "Pin", unpin: "Unpin", del: "Delete", author: "author",
    notePh: "Your note…", save: "Save", copied: "Link copied", focus: "Focus", resume: "Continue where you left off",
    rejected: "The message didn't pass moderation.", close: "Close", all: "Whole chapter", delete: "Delete",
  },
  pt: {
    highlight: "Destacar", note: "Nota", bookmark: "Marcador", discuss: "Discutir", explain: "Explicar", share: "Compartilhar",
    tabDiscuss: "Discussão", tabNotes: "Notas", tabAi: "IA", chapterThread: "Discussão do capítulo", placeThread: "Sobre este trecho",
    write: "Escrever", reply: "Responder", send: "Enviar", signIn: "Entre para participar", empty: "Silêncio por enquanto. Comece a conversa.",
    noNotes: "Selecione um trecho para salvar citação, nota ou marcador.", askPh: "Pergunte sobre o que leu…", ask: "Perguntar",
    aiIntro: "A IA conhece só o que você já leu e não revela o que vem depois.", limit: "Limite diário de perguntas atingido.",
    aiOff: "O companheiro de IA chega em breve.", recap: "Lembrar o que aconteceu", recapTitle: "Anteriormente", like: "Curtir",
    hide: "Ocultar", show: "Mostrar", pin: "Fixar", unpin: "Desafixar", del: "Excluir", author: "autor",
    notePh: "Sua nota…", save: "Salvar", copied: "Link copiado", focus: "Foco", resume: "Continuar de onde parou",
    rejected: "A mensagem não passou na moderação.", close: "Fechar", all: "Capítulo inteiro", delete: "Excluir",
  },
  es: {
    highlight: "Resaltar", note: "Nota", bookmark: "Marcador", discuss: "Comentar", explain: "Explicar", share: "Compartir",
    tabDiscuss: "Conversación", tabNotes: "Notas", tabAi: "IA", chapterThread: "Conversación del capítulo", placeThread: "Sobre este pasaje",
    write: "Escribir", reply: "Responder", send: "Enviar", signIn: "Inicia sesión para participar", empty: "Todo tranquilo. Empieza la conversación.",
    noNotes: "Selecciona texto para guardar una cita, nota o marcador.", askPh: "Pregunta sobre lo que has leído…", ask: "Preguntar",
    aiIntro: "La IA solo conoce lo que ya leíste y no revela lo que viene.", limit: "Límite diario de preguntas alcanzado.",
    aiOff: "El compañero de IA llegará pronto.", recap: "Recordar lo que pasó", recapTitle: "Anteriormente", like: "Me gusta",
    hide: "Ocultar", show: "Mostrar", pin: "Fijar", unpin: "Desfijar", del: "Eliminar", author: "autor",
    notePh: "Tu nota…", save: "Guardar", copied: "Enlace copiado", focus: "Foco", resume: "Seguir donde lo dejaste",
    rejected: "El mensaje no pasó la moderación.", close: "Cerrar", all: "Todo el capítulo", delete: "Eliminar",
  },
};

const COLORS = ["accent", "yellow", "green", "rose"] as const;

// ---------- DOM helpers ----------

const paraOf = (node: Node | null): HTMLElement | null =>
  (node instanceof Element ? node : node?.parentElement)?.closest<HTMLElement>(".reader-prose p[data-a]") ?? null;

function offsetIn(p: HTMLElement, node: Node, off: number): number {
  const r = document.createRange();
  r.selectNodeContents(p);
  r.setEnd(node, off);
  return r.toString().length;
}

function rangeFor(p: HTMLElement, start: number, end: number): Range | null {
  const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
  let pos = 0;
  const r = document.createRange();
  let started = false;
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const len = n.textContent?.length ?? 0;
    if (!started && start <= pos + len) {
      r.setStart(n, Math.max(0, start - pos));
      started = true;
    }
    if (started && end <= pos + len) {
      r.setEnd(n, Math.max(0, end - pos));
      return r;
    }
    pos += len;
  }
  return null;
}

const para = (anchor: string) => document.querySelector<HTMLElement>(`.reader-prose p[data-a="${CSS.escape(anchor)}"]`);

// ---------- component ----------

export default function ReaderInteractive({
  book, lang, chapter, locale, bookTitle, signedIn, loginHref, aiEnabled, chapterIndex,
}: {
  book: string; lang: string; chapter: string; locale: Lang; bookTitle: string;
  signedIn: boolean; loginHref: string; aiEnabled: boolean; chapterIndex: number;
}) {
  const t = T[locale] ?? T.en;
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [canModerate, setCanModerate] = useState(false);
  const [sel, setSel] = useState<Sel | null>(null);
  const [panel, setPanel] = useState<{ tab: Tab; anchor?: string | null; quote?: string } | null>(null);
  const [toast, setToast] = useState("");
  const [resume, setResume] = useState<string | null>(null);
  const [focus, setFocus] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 2400);
  };

  // --- load ---
  const loadComments = useCallback(async () => {
    const r = await fetch(`/api/reader/comments?${new URLSearchParams({ book, lang, chapter })}`).catch(() => null);
    if (!r?.ok) return;
    const d = await r.json();
    setComments(d.comments ?? []);
    setCanModerate(Boolean(d.canModerate));
  }, [book, lang, chapter]);

  useEffect(() => {
    loadComments();
    if (!signedIn) return;
    fetch(`/api/reader/state?${new URLSearchParams({ book, lang })}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) return;
        setAnnotations(d.annotations ?? []);
        const p = d.progress;
        if (p?.chapter === chapter && p.anchor && !location.hash) setResume(p.anchor);
      })
      .catch(() => {});
  }, [book, lang, chapter, signedIn, loadComments]);

  // Глубокая ссылка на абзац (#a-xxxx) — подсветить и прокрутить.
  useEffect(() => {
    const id = location.hash.slice(1);
    const el = id ? document.getElementById(id) : null;
    if (el) {
      el.scrollIntoView({ block: "center" });
      el.classList.add("nc-flash");
      setTimeout(() => el.classList.remove("nc-flash"), 2400);
    }
  }, []);

  // --- paint: highlights (CSS Custom Highlight API), bookmarks, margin markers ---
  const mine = useMemo(() => annotations.filter((a) => a.chapter === chapter), [annotations, chapter]);
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of comments) if (c.anchor && c.status === "published") m.set(c.anchor, (m.get(c.anchor) ?? 0) + 1);
    return m;
  }, [comments]);

  useEffect(() => {
    const H = (globalThis as unknown as { Highlight?: new (...r: Range[]) => unknown }).Highlight;
    const reg = (CSS as unknown as { highlights?: Map<string, unknown> }).highlights;
    if (H && reg) {
      for (const c of COLORS) {
        const ranges = mine
          .filter((a) => a.kind !== "bookmark" && (a.color ?? "accent") === c && a.start_off != null && a.end_off != null)
          .map((a) => {
            const p = para(a.anchor);
            return p ? rangeFor(p, a.start_off!, a.end_off!) : null;
          })
          .filter((r): r is Range => Boolean(r));
        reg.set(`nc-${c}`, new H(...ranges));
      }
    }
    document.querySelectorAll(".nc-margin").forEach((e) => e.remove());
    document.querySelectorAll(".reader-prose p.nc-bm").forEach((e) => e.classList.remove("nc-bm"));
    for (const a of mine) if (a.kind === "bookmark") para(a.anchor)?.classList.add("nc-bm");
    const anchors = new Set<string>([...counts.keys(), ...mine.filter((a) => a.kind === "note").map((a) => a.anchor)]);
    for (const anchor of anchors) {
      const p = para(anchor);
      if (!p) continue;
      const n = counts.get(anchor) ?? 0;
      const hasNote = mine.some((a) => a.kind === "note" && a.anchor === anchor);
      const b = document.createElement("button");
      b.type = "button";
      b.className = "nc-margin";
      b.textContent = n ? String(n) : "✎";
      if (hasNote && n) b.textContent = `${n} ✎`;
      b.setAttribute("aria-label", t.discuss);
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        setPanel({ tab: n ? "discuss" : "notes", anchor });
      });
      p.appendChild(b);
    }
  }, [mine, counts, t.discuss]);

  // --- selection toolbar ---
  useEffect(() => {
    const onUp = () =>
      setTimeout(() => {
        const s = window.getSelection();
        if (!s || s.isCollapsed || !s.rangeCount) return setSel(null);
        const r = s.getRangeAt(0);
        const p = paraOf(r.startContainer);
        if (!p || paraOf(r.endContainer) !== p) return setSel(null);
        const quote = r.toString().trim();
        if (quote.length < 2) return setSel(null);
        setSel({
          anchor: p.dataset.a!,
          quote: quote.slice(0, 2000),
          start: offsetIn(p, r.startContainer, r.startOffset),
          end: offsetIn(p, r.endContainer, r.endOffset),
          rect: r.getBoundingClientRect(),
        });
      }, 10);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchend", onUp);
    const onScroll = () => setSel(null);
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchend", onUp);
      removeEventListener("scroll", onScroll);
    };
  }, []);

  // --- progress: самый верхний видимый абзац → сервер (раз в 4 секунды покоя) ---
  useEffect(() => {
    if (!signedIn) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const save = () => {
      const ps = [...document.querySelectorAll<HTMLElement>(".reader-prose p[data-a]")];
      const top = ps.find((p) => p.getBoundingClientRect().bottom > 90);
      const chapters = loadProgress(book, lang).chapters;
      fetch("/api/reader/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book, lang, chapter, anchor: top?.dataset.a, chapters }),
        keepalive: true,
      }).catch(() => {});
    };
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(save, 4000);
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      removeEventListener("scroll", onScroll);
    };
  }, [signedIn, book, lang, chapter]);

  useEffect(() => {
    document.getElementById("reader")?.classList.toggle("nc-focus", focus);
  }, [focus]);

  // --- actions ---
  const annotate = async (kind: Annotation["kind"], extra: Partial<{ color: string; note: string }> = {}) => {
    if (!sel) return;
    if (!signedIn) return (location.href = loginHref);
    const r = await fetch("/api/reader/annotations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ book, lang, chapter, anchor: sel.anchor, kind, quote: sel.quote, start: sel.start, end: sel.end, ...extra }),
    });
    if (r.ok) {
      const a = await r.json();
      setAnnotations((prev) => [...prev, a]);
      window.getSelection()?.removeAllRanges();
      setSel(null);
      if (kind === "note") setPanel({ tab: "notes", anchor: a.anchor });
    }
  };

  const removeAnnotation = async (id: string) => {
    await fetch(`/api/reader/annotations?id=${id}`, { method: "DELETE" });
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  };

  const saveNote = async (id: string, note: string) => {
    const r = await fetch("/api/reader/annotations", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, note }) });
    if (r.ok) {
      const a = await r.json();
      setAnnotations((prev) => prev.map((x) => (x.id === id ? a : x)));
    }
  };

  const [shareMode, setShareMode] = useState(false);
  useEffect(() => setShareMode(false), [sel?.anchor, sel?.start]);

  const shareLink = (quote: string, anchor: string) => {
    const u = new URL(location.href);
    u.hash = `a-${anchor}`;
    u.search = new URLSearchParams({ q: quote.slice(0, 280) }).toString();
    return u.toString();
  };

  const [aiSeed, setAiSeed] = useState<{ mode: "explain"; selection: string } | null>(null);

  // ---------- render ----------
  const toolbar =
    sel &&
    createPortal(
      <SelectionToolbar
        sel={sel}
        t={t}
        aiEnabled={aiEnabled}
        shareMode={shareMode}
        onShareMode={setShareMode}
        bookTitle={bookTitle}
        link={shareLink(sel.quote, sel.anchor)}
        onColor={(c) => annotate("highlight", { color: c })}
        onNote={() => annotate("note")}
        onBookmark={() => annotate("bookmark")}
        onDiscuss={() => { setPanel({ tab: "discuss", anchor: sel.anchor, quote: sel.quote }); setSel(null); }}
        onExplain={() => { setAiSeed({ mode: "explain", selection: sel.quote }); setPanel({ tab: "ai" }); setSel(null); }}
        onCopied={() => { flash(t.copied); setSel(null); }}
      />,
      document.getElementById("reader") ?? document.body,
    );

  const chapterCount = comments.filter((c) => c.status === "published").length;

  return (
    <>
      {/* ::highlight() не разбирается сборщиком CSS — правила живут здесь */}
      <style>{COLORS.map((c) => `::highlight(nc-${c}){background-color:var(--nc-hl-${c})}`).join("")}</style>
      {resume && (
        <button
          type="button"
          onClick={() => {
            para(resume)?.scrollIntoView({ block: "start", behavior: "smooth" });
            setResume(null);
          }}
          className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 r-hair bg-[var(--r-panel)] px-5 py-3 text-sm shadow-lg"
        >
          {t.resume} ↓
        </button>
      )}

      {chapterIndex > 0 && aiEnabled && <Recap book={book} lang={lang} chapter={chapter} ui={locale} t={t} />}

      {/* Док действий: обсуждение, пометки, ИИ, фокус */}
      <div className="fixed right-3 bottom-4 z-40 flex flex-col r-hair bg-[var(--r-panel)] md:right-5 md:bottom-6 [&>button]:flex [&>button]:h-12 [&>button]:w-12 [&>button]:flex-col [&>button]:items-center [&>button]:justify-center [&>button]:text-[10px] [&>button]:leading-tight [&>button]:text-[var(--r-soft)] [&>button:hover]:text-[var(--r-fg)] [&>button+button]:r-rule-t">
        <button type="button" onClick={() => setPanel({ tab: "discuss", anchor: null })} aria-label={t.tabDiscuss}>
          <MessageCircle className="h-4 w-4" strokeWidth={1.25} />
          {chapterCount > 0 && <span className="mt-0.5">{chapterCount}</span>}
        </button>
        <button type="button" onClick={() => setPanel({ tab: "notes" })} aria-label={t.tabNotes}>
          <Bookmark className="h-4 w-4" strokeWidth={1.25} />
        </button>
        {aiEnabled && (
          <button type="button" onClick={() => setPanel({ tab: "ai" })} aria-label={t.tabAi}>
            <Sparkles className="h-4 w-4 text-[var(--r-accent)]" strokeWidth={1.25} />
          </button>
        )}
        <button type="button" onClick={() => setFocus((f) => !f)} aria-pressed={focus} aria-label={t.focus}>
          <Focus className={cn("h-4 w-4", focus && "text-[var(--r-accent)]")} strokeWidth={1.25} />
        </button>
      </div>

      {mounted && toolbar}

      {mounted && panel &&
        createPortal(
          <div className="fixed inset-0 z-[70]">
            <button type="button" aria-label={t.close} className="absolute inset-0 bg-black/30" onClick={() => setPanel(null)} />
            <aside
              className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col bg-[var(--r-bg)] text-[var(--r-fg)] r-rule-t md:inset-y-0 md:right-0 md:left-auto md:max-h-none md:w-[26rem] md:border-t-0 md:r-hair"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <div className="flex h-14 shrink-0 items-stretch r-rule-b">
                {(["discuss", "notes", ...(aiEnabled ? ["ai"] : [])] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setPanel((p) => ({ ...p!, tab }))}
                    className={cn("flex-1 label", panel.tab === tab ? "text-[var(--r-accent)] shadow-[inset_0_-1px_0_var(--r-accent)]" : "text-[var(--r-muted)]")}
                  >
                    {tab === "discuss" ? t.tabDiscuss : tab === "notes" ? t.tabNotes : t.tabAi}
                  </button>
                ))}
                <button type="button" onClick={() => setPanel(null)} className="w-14 text-xl text-[var(--r-muted)] r-rule-l" aria-label={t.close}>
                  ×
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto">
                {panel.tab === "discuss" && (
                  <Discussion
                    t={t} book={book} lang={lang} chapter={chapter} signedIn={signedIn} loginHref={loginHref}
                    anchor={panel.anchor ?? null} quote={panel.quote} comments={comments} canModerate={canModerate}
                    onChange={loadComments} onAll={() => setPanel({ tab: "discuss", anchor: null })} flash={flash}
                  />
                )}
                {panel.tab === "notes" && (
                  <Notes t={t} items={annotations} chapter={chapter} signedIn={signedIn} loginHref={loginHref} onDelete={removeAnnotation} onSave={saveNote} focusAnchor={panel.anchor ?? undefined} onJump={(a) => { setPanel(null); para(a)?.scrollIntoView({ block: "center", behavior: "smooth" }); }} />
                )}
                {panel.tab === "ai" && (
                  <AiChat t={t} book={book} lang={lang} chapter={chapter} ui={locale} signedIn={signedIn} loginHref={loginHref} seed={aiSeed} onSeedUsed={() => setAiSeed(null)} onJump={(a) => { setPanel(null); para(a)?.scrollIntoView({ block: "center", behavior: "smooth" }); para(a)?.classList.add("nc-flash"); }} />
                )}
              </div>
            </aside>
          </div>,
          document.getElementById("reader") ?? document.body,
        )}

      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 bg-[var(--r-fg)] px-4 py-2 text-sm text-[var(--r-bg)]">
          {toast}
        </div>
      )}
    </>
  );
}

// ---------- Discussion ----------

function Discussion({
  t, book, lang, chapter, signedIn, loginHref, anchor, quote, comments, canModerate, onChange, onAll, flash,
}: {
  t: Record<string, string>; book: string; lang: string; chapter: string; signedIn: boolean; loginHref: string;
  anchor: string | null; quote?: string; comments: Comment[]; canModerate: boolean;
  onChange: () => void; onAll: () => void; flash: (m: string) => void;
}) {
  const [body, setBody] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const list = comments.filter((c) => (anchor ? c.anchor === anchor : true));
  const roots = list.filter((c) => !c.parent_id || !list.some((p) => p.id === c.parent_id));
  const shownQuote = quote ?? list.find((c) => c.quote)?.quote ?? null;

  const send = async () => {
    if (!body.trim() || busy) return;
    setBusy(true);
    const r = await fetch("/api/reader/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ book, lang, chapter, anchor, parentId: replyTo, quote: shownQuote, body }),
    });
    setBusy(false);
    if (r.status === 422) return flash(t.rejected);
    if (r.ok) {
      setBody("");
      setReplyTo(null);
      onChange();
    }
  };
  const act = async (id: string, action: string) => {
    await fetch(`/api/reader/comments/${id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
    onChange();
  };

  const item = (c: Comment, depth = 0): React.ReactNode => (
    <li key={c.id} className={cn("py-4", depth ? "ml-5 r-rule-t pl-0" : "r-rule-b px-5", c.status === "hidden" && "opacity-50")}>
      <div className="flex items-baseline gap-2 text-sm">
        <span className="font-medium text-[var(--r-fg)]">{c.author_name}</span>
        {c.is_author && <span className="label text-[var(--r-accent)]">{t.author}</span>}
        {c.pinned && <span className="label text-[var(--r-muted)]">{t.pin}</span>}
        <span className="ml-auto text-xs text-[var(--r-muted)]">{new Date(c.created_at).toLocaleDateString()}</span>
      </div>
      <p className="mt-2 whitespace-pre-line text-[0.9375rem] leading-relaxed text-[var(--r-soft)]">{c.body}</p>
      <div className="mt-2 flex flex-wrap gap-3 text-xs text-[var(--r-muted)] [&>button:hover]:text-[var(--r-fg)]">
        {signedIn && (
          <button type="button" onClick={() => act(c.id, c.liked ? "unlike" : "like")} className={c.liked ? "text-[var(--r-accent)]" : ""}>
            ♥ {c.likes || ""}
          </button>
        )}
        {signedIn && !depth && <button type="button" onClick={() => setReplyTo(c.id)}>{t.reply}</button>}
        {(c.mine || canModerate) && <button type="button" onClick={() => act(c.id, "delete")}>{t.del}</button>}
        {canModerate && <button type="button" onClick={() => act(c.id, c.status === "hidden" ? "show" : "hide")}>{c.status === "hidden" ? t.show : t.hide}</button>}
        {canModerate && !depth && <button type="button" onClick={() => act(c.id, c.pinned ? "unpin" : "pin")}>{c.pinned ? t.unpin : t.pin}</button>}
      </div>
      {list.some((x) => x.parent_id === c.id) && <ul className="mt-2">{list.filter((x) => x.parent_id === c.id).map((x) => item(x, depth + 1))}</ul>}
    </li>
  );

  return (
    <div className="flex min-h-full flex-col">
      <div className="px-5 pt-5">
        <div className="flex items-baseline justify-between">
          <p className="label text-[var(--r-accent)]">{anchor ? t.placeThread : t.chapterThread}</p>
          {anchor && <button type="button" onClick={onAll} className="text-xs text-[var(--r-muted)] underline">{t.all}</button>}
        </div>
        {anchor && shownQuote && (
          <blockquote className="mt-3 border-l-[0.5px] border-[var(--r-accent)] pl-3 font-display text-lg italic leading-snug text-[var(--r-soft)] line-clamp-4">
            {shownQuote}
          </blockquote>
        )}
      </div>
      <ul className="mt-4 flex-1 r-rule-t">
        {roots.length ? roots.map((c) => item(c)) : <li className="px-5 py-8 text-sm text-[var(--r-muted)]">{t.empty}</li>}
      </ul>
      <div className="sticky bottom-0 r-rule-t bg-[var(--r-bg)] p-4">
        {signedIn ? (
          <>
            {replyTo && (
              <p className="mb-2 text-xs text-[var(--r-muted)]">
                {t.reply} · <button type="button" className="underline" onClick={() => setReplyTo(null)}>×</button>
              </p>
            )}
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder={`${t.write}…`} className="w-full resize-none r-hair bg-[var(--r-panel)] p-3 text-base outline-none focus:border-[var(--r-accent)]" />
            <button type="button" disabled={busy || !body.trim()} onClick={send} className="mt-2 min-h-11 w-full bg-[var(--r-fg)] label text-[var(--r-bg)] disabled:opacity-40">
              {t.send}
            </button>
          </>
        ) : (
          <a href={loginHref} className="flex min-h-11 items-center justify-center bg-[var(--r-fg)] label text-[var(--r-bg)]">
            {t.signIn}
          </a>
        )}
      </div>
    </div>
  );
}

// ---------- Notes ----------

function Notes({
  t, items, chapter, signedIn, loginHref, onDelete, onSave, onJump, focusAnchor,
}: {
  t: Record<string, string>; items: Annotation[]; chapter: string; signedIn: boolean; loginHref: string;
  onDelete: (id: string) => void; onSave: (id: string, note: string) => void; onJump: (a: string) => void; focusAnchor?: string;
}) {
  if (!signedIn)
    return (
      <div className="p-5">
        <p className="text-sm text-[var(--r-muted)]">{t.noNotes}</p>
        <a href={loginHref} className="mt-4 flex min-h-11 items-center justify-center bg-[var(--r-fg)] label text-[var(--r-bg)]">{t.signIn}</a>
      </div>
    );
  const here = items.filter((a) => a.chapter === chapter);
  if (!here.length) return <p className="p-5 text-sm text-[var(--r-muted)]">{t.noNotes}</p>;
  return (
    <ul>
      {here.map((a) => (
        <NoteItem key={a.id} a={a} t={t} open={a.anchor === focusAnchor && a.kind === "note"} onDelete={onDelete} onSave={onSave} onJump={onJump} />
      ))}
    </ul>
  );
}

function NoteItem({ a, t, open, onDelete, onSave, onJump }: {
  a: Annotation; t: Record<string, string>; open: boolean; onDelete: (id: string) => void; onSave: (id: string, note: string) => void; onJump: (a: string) => void;
}) {
  const [note, setNote] = useState(a.note ?? "");
  const [edit, setEdit] = useState(open || (a.kind === "note" && !a.note));
  return (
    <li className="r-rule-b px-5 py-4">
      <div className="flex items-center justify-between">
        <span className="label text-[var(--r-accent)]">{a.kind === "bookmark" ? t.bookmark : a.kind === "note" ? t.note : t.highlight}</span>
        <button type="button" onClick={() => onDelete(a.id)} className="text-xs text-[var(--r-muted)] hover:text-[var(--r-fg)]">{t.delete}</button>
      </div>
      <button type="button" onClick={() => onJump(a.anchor)} className="mt-2 block text-left font-display text-[1.0625rem] italic leading-snug text-[var(--r-soft)] line-clamp-4 hover:text-[var(--r-fg)]">
        {a.quote}
      </button>
      {edit ? (
        <div className="mt-3">
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder={t.notePh} className="w-full resize-none r-hair bg-[var(--r-panel)] p-2.5 text-base outline-none" autoFocus={open} />
          <button type="button" onClick={() => { onSave(a.id, note); setEdit(false); }} className="mt-2 min-h-10 bg-[var(--r-fg)] px-4 label text-[var(--r-bg)]">{t.save}</button>
        </div>
      ) : (
        <button type="button" onClick={() => setEdit(true)} className="mt-2 block w-full text-left text-sm text-[var(--r-fg)]">
          {a.note || <span className="text-[var(--r-muted)]">+ {t.note}</span>}
        </button>
      )}
    </li>
  );
}

// ---------- AI ----------

function Answer({ text, onJump }: { text: string; onJump: (a: string) => void }) {
  // [[anchor]] → кликабельная ссылка на абзац
  const parts = text.split(/\[\[([0-9a-f]{8}(?:-\d+)?)\]\]/g);
  return (
    <p className="whitespace-pre-line text-[0.9375rem] leading-relaxed">
      {parts.map((p, i) =>
        i % 2 ? (
          <button key={i} type="button" onClick={() => onJump(p)} className="mx-0.5 align-super text-[0.7rem] text-[var(--r-accent)] underline">
            ¶
          </button>
        ) : (
          p
        ),
      )}
    </p>
  );
}

function AiChat({
  t, book, lang, chapter, ui, signedIn, loginHref, seed, onSeedUsed, onJump,
}: {
  t: Record<string, string>; book: string; lang: string; chapter: string; ui: string; signedIn: boolean; loginHref: string;
  seed: { mode: "explain"; selection: string } | null; onSeedUsed: () => void; onJump: (a: string) => void;
}) {
  const key = `nc-ai:${book}:${lang}:${chapter}`;
  const [msgs, setMsgs] = useState<ChatMsg[]>(() => {
    try {
      return JSON.parse(sessionStorage.getItem(key) || "[]");
    } catch {
      return [];
    }
  });
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(msgs.slice(-20)));
    } catch {}
    end.current?.scrollIntoView({ block: "end" });
  }, [msgs, key]);

  const run = useCallback(
    async (payload: { mode: "ask" | "explain"; question?: string; selection?: string }, shown: string) => {
      setBusy(true);
      setErr("");
      const history = msgs;
      setMsgs((m) => [...m, { role: "user", content: shown }, { role: "assistant", content: "" }]);
      const r = await fetch("/api/reader/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, book, lang, chapter, ui, history }),
      }).catch(() => null);
      if (!r?.ok || !r.body) {
        setErr(r?.status === 429 ? t.limit : r?.status === 503 ? t.aiOff : "—");
        setMsgs((m) => m.slice(0, -2));
        setBusy(false);
        return;
      }
      const reader = r.body.getReader();
      const dec = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = dec.decode(value, { stream: true });
        setMsgs((m) => [...m.slice(0, -1), { role: "assistant", content: m[m.length - 1].content + chunk }]);
      }
      setBusy(false);
    },
    [msgs, book, lang, chapter, ui, t.limit, t.aiOff],
  );

  useEffect(() => {
    if (seed && signedIn && !busy) {
      onSeedUsed();
      run({ mode: "explain", selection: seed.selection }, `${t.explain}: «${seed.selection.slice(0, 200)}»`);
    }
  }, [seed, signedIn, busy, onSeedUsed, run, t.explain]);

  if (!signedIn)
    return (
      <div className="p-5">
        <p className="text-sm text-[var(--r-muted)]">{t.aiIntro}</p>
        <a href={loginHref} className="mt-4 flex min-h-11 items-center justify-center bg-[var(--r-fg)] label text-[var(--r-bg)]">{t.signIn}</a>
      </div>
    );

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1 space-y-5 p-5">
        <p className="text-xs text-[var(--r-muted)]">{t.aiIntro}</p>
        {msgs.map((m, i) =>
          m.role === "user" ? (
            <p key={i} className="ml-8 bg-[var(--r-panel)] px-3 py-2 text-sm r-hair">{m.content}</p>
          ) : (
            <div key={i} className="text-[var(--r-fg)]">
              {m.content ? <Answer text={m.content} onJump={onJump} /> : <span className="animate-pulse text-[var(--r-accent)]">✦ ✦ ✦</span>}
            </div>
          ),
        )}
        {err && <p className="text-sm text-[var(--r-accent)]">{err}</p>}
        <div ref={end} />
      </div>
      <form
        className="sticky bottom-0 flex gap-2 r-rule-t bg-[var(--r-bg)] p-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!q.trim() || busy) return;
          const question = q.trim();
          setQ("");
          run({ mode: "ask", question }, question);
        }}
      >
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.askPh} className="min-h-11 flex-1 r-hair bg-[var(--r-panel)] px-3 text-base outline-none" />
        <button type="submit" disabled={busy || !q.trim()} className="min-h-11 bg-[var(--r-fg)] px-4 label text-[var(--r-bg)] disabled:opacity-40">
          {t.ask}
        </button>
      </form>
    </div>
  );
}

// ---------- Recap ----------

function Recap({ book, lang, chapter, ui, t }: { book: string; lang: string; chapter: string; ui: string; t: Record<string, string> }) {
  const [items, setItems] = useState<{ id: string; title: string; text: string }[] | null>(null);
  const [busy, setBusy] = useState(false);
  const load = async () => {
    setBusy(true);
    const r = await fetch("/api/reader/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "recap", book, lang, chapter, ui }),
    }).catch(() => null);
    setBusy(false);
    if (r?.ok) setItems((await r.json()).recap ?? []);
  };
  const target = typeof document !== "undefined" ? document.getElementById("nc-recap-slot") : null;
  if (!target) return null;
  return createPortal(
    items ? (
      items.length > 0 && (
        <div className="mb-10 r-hair bg-[var(--r-panel)] p-5" style={{ fontFamily: "var(--font-sans)" }}>
          <p className="label text-[var(--r-accent)]">{t.recapTitle}</p>
          {items.map((it) => (
            <div key={it.id} className="mt-3">
              <p className="font-display text-lg">{it.title}</p>
              <p className="mt-1 text-[0.9375rem] leading-relaxed text-[var(--r-soft)]">{it.text}</p>
            </div>
          ))}
        </div>
      )
    ) : (
      <button type="button" onClick={load} disabled={busy} className="mb-8 inline-flex min-h-10 items-center gap-2 label text-[var(--r-accent)]">
        ✦ {busy ? "…" : t.recap}
      </button>
    ),
    target,
  );
}

// ---------- Selection toolbar ----------

const SOCIAL: { id: string; name: string; href: (text: string, url: string, title: string) => string }[] = [
  { id: "tg", name: "Telegram", href: (t, u) => `https://t.me/share/url?${new URLSearchParams({ url: u, text: t })}` },
  { id: "vk", name: "VK", href: (t, u, title) => `https://vk.com/share.php?${new URLSearchParams({ url: u, title, comment: t })}` },
  { id: "x", name: "X", href: (t, u) => `https://twitter.com/intent/tweet?${new URLSearchParams({ text: t, url: u })}` },
  { id: "wa", name: "WhatsApp", href: (t, u) => `https://wa.me/?${new URLSearchParams({ text: `${t}\n${u}` })}` },
  { id: "fb", name: "Facebook", href: (_t, u) => `https://www.facebook.com/sharer/sharer.php?${new URLSearchParams({ u })}` },
  { id: "in", name: "LinkedIn", href: (_t, u) => `https://www.linkedin.com/sharing/share-offsite/?${new URLSearchParams({ url: u })}` },
  { id: "th", name: "Threads", href: (t, u) => `https://www.threads.net/intent/post?${new URLSearchParams({ text: `${t}\n${u}` })}` },
];

const SWATCH: Record<(typeof COLORS)[number], string> = { accent: "#6d74f0", yellow: "#f2c230", green: "#3fbf7f", rose: "#f0607a" };

function SelectionToolbar({
  sel, t, aiEnabled, shareMode, onShareMode, bookTitle, link, onColor, onNote, onBookmark, onDiscuss, onExplain, onCopied,
}: {
  sel: Sel; t: Record<string, string>; aiEnabled: boolean; shareMode: boolean; onShareMode: (v: boolean) => void;
  bookTitle: string; link: string; onColor: (c: (typeof COLORS)[number]) => void; onNote: () => void; onBookmark: () => void;
  onDiscuss: () => void; onExplain: () => void; onCopied: () => void;
}) {
  const mobile = typeof window !== "undefined" && innerWidth < 768;
  const above = sel.rect.top > 90;
  const text = `«${sel.quote.length > 240 ? `${sel.quote.slice(0, 237)}…` : sel.quote}» — ${bookTitle}`;
  const card = `/api/quote-card?${new URLSearchParams({ q: sel.quote.slice(0, 280), b: bookTitle })}`;
  const cell =
    "flex min-h-12 shrink-0 items-center gap-2 px-3.5 text-[0.8125rem] text-[var(--r-fg)] transition-colors hover:bg-[var(--r-faint)] [&+&]:border-l-[0.5px] [&+&]:border-[var(--r-line)]";

  return (
    <div
      role="toolbar"
      onMouseDown={(e) => e.preventDefault()}
      className={cn(
        "fixed z-[80] border-[0.5px] border-[var(--r-line)] bg-[var(--r-panel)] shadow-[0_18px_50px_-18px_rgb(0_0_0/.45)]",
        mobile ? "inset-x-2 bottom-[calc(env(safe-area-inset-bottom)+0.5rem)] rounded-md" : "-translate-x-1/2 rounded-md",
      )}
      style={
        mobile
          ? undefined
          : {
              left: Math.min(Math.max(sel.rect.left + sel.rect.width / 2, 260), innerWidth - 260),
              top: above ? sel.rect.top - 60 : sel.rect.bottom + 12,
            }
      }
    >
      <div className="flex items-stretch overflow-x-auto" style={{ fontFamily: "var(--font-sans)", scrollbarWidth: "none" }}>
        {shareMode ? (
          <>
            <button type="button" className={cell} onClick={() => onShareMode(false)} aria-label="←">
              <ArrowLeft className="h-4 w-4" strokeWidth={1.25} />
            </button>
            {SOCIAL.map((s) => (
              <a key={s.id} className={cell} href={s.href(text, link, bookTitle)} target="_blank" rel="noopener noreferrer">
                {s.name}
              </a>
            ))}
            <button
              type="button"
              className={cell}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(`${text}\n${link}`);
                } catch {}
                onCopied();
              }}
            >
              <Link2 className="h-4 w-4" strokeWidth={1.25} />
            </button>
            <a className={cell} href={card} download="quote.png" aria-label="PNG">
              <Download className="h-4 w-4" strokeWidth={1.25} />
            </a>
          </>
        ) : (
          <>
            <span className={cn(cell, "gap-1.5 hover:bg-transparent")}>
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`${t.highlight}: ${c}`}
                  onClick={() => onColor(c)}
                  className="h-5 w-5 rounded-full ring-offset-2 ring-offset-[var(--r-panel)] transition hover:ring-1 hover:ring-[var(--r-fg)]"
                  style={{ background: SWATCH[c] }}
                />
              ))}
            </span>
            <button type="button" className={cell} onClick={onNote}>
              <PenLine className="h-4 w-4" strokeWidth={1.25} /> {t.note}
            </button>
            <button type="button" className={cell} onClick={onBookmark}>
              <Bookmark className="h-4 w-4" strokeWidth={1.25} /> {t.bookmark}
            </button>
            <button type="button" className={cell} onClick={onDiscuss}>
              <MessageCircle className="h-4 w-4" strokeWidth={1.25} /> {t.discuss}
            </button>
            {aiEnabled && (
              <button type="button" className={cn(cell, "text-[var(--r-accent)]")} onClick={onExplain}>
                <Sparkles className="h-4 w-4" strokeWidth={1.25} /> {t.explain}
              </button>
            )}
            <button type="button" className={cell} onClick={() => onShareMode(true)}>
              <Share2 className="h-4 w-4" strokeWidth={1.25} /> {t.share}
            </button>
          </>
        )}
      </div>
      {!mobile && (
        <span
          aria-hidden
          className={cn(
            "absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-[var(--r-line)] bg-[var(--r-panel)]",
            above ? "-bottom-[5.5px] border-r-[0.5px] border-b-[0.5px]" : "-top-[5.5px] border-l-[0.5px] border-t-[0.5px]",
          )}
        />
      )}
    </div>
  );
}
