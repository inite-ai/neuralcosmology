"use client";

import { WIDGETS } from "./ChapterWidgets";
import type { Lang } from "./kit";

// Опыт вне главы — на своей странице /<locale>/experiments/<id>.
export default function Standalone({ widget, lang, props }: { widget: string; lang: Lang; props?: Record<string, unknown> }) {
  const W = WIDGETS[widget];
  return W ? <W lang={lang} props={props} /> : null;
}
