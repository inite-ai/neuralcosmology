"use client";

import { useState } from "react";
import { Play, type Dict, type WidgetProps } from "./kit";

// Видео или запись, о которой говорит текст. Пока читатель не нажал «смотреть»,
// страница показывает нашу копию обложки и ни с кем не разговаривает; потом
// на её месте встаёт плеер youtube-nocookie. Обложки: npm run interactive:posters.

const T: Dict<{ watch: string; listen: string; consent: string }> = {
  ru: { watch: "Смотреть", listen: "Слушать", consent: "Видео загрузится с YouTube" },
  en: { watch: "Watch", listen: "Listen", consent: "The video loads from YouTube" },
  pt: { watch: "Assistir", listen: "Ouvir", consent: "O vídeo carrega do YouTube" },
  es: { watch: "Ver", listen: "Escuchar", consent: "El vídeo se carga desde YouTube" },
};

export default function YouTube({ lang, props }: WidgetProps) {
  const t = T[lang];
  const id = String(props?.id ?? "");
  const start = Number(props?.start ?? 0);
  const channel = String(props?.channel ?? "");
  const listen = Boolean(props?.listen);
  const [on, setOn] = useState(false);
  const src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1${start ? `&start=${start}` : ""}`;

  return (
    <div className={`nc-yt${listen ? " nc-yt--listen" : ""}`}>
      {on ? (
        <div className="nc-yt-frame">
          <iframe src={src} title={channel} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
        </div>
      ) : (
        <button type="button" className="nc-yt-poster" onClick={() => setOn(true)} aria-label={`${listen ? t.listen : t.watch}: ${channel}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/book/media/${id}.jpg`} alt="" loading="lazy" decoding="async" />
          <span className="nc-yt-play"><Play /></span>
          <span className="nc-yt-meta">
            <b>{listen ? t.listen : t.watch}</b>
            <span>YouTube · {channel}</span>
            <em>{t.consent}</em>
          </span>
        </button>
      )}
    </div>
  );
}
