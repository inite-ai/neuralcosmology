"use client";
import { useCallback } from "react";
import { ReaderInteractive as SharedReader, type Swatch } from "@inite/reader/react";
import "@inite/reader/reader.css";
import { authorName } from "@/lib/reader/quote";
import { loadProgress } from "./progress";

// Интерактивный слой читалки — общий пакет @inite/reader: пометки, обсуждения на
// полях, ИИ-компаньон, пересказ, фокус, «Поделиться», место чтения. Здесь — только
// настройки сайта: префикс nc- для меток в тексте (стили в globals.css), цвета
// выделений, автор подписи и статусы глав, которые хранит оглавление.

const COLORS: Swatch[] = [
  { id: "accent", swatch: "#6d74f0" },
  { id: "yellow", swatch: "#f2c230" },
  { id: "green", swatch: "#3fbf7f" },
  { id: "rose", swatch: "#f0607a" },
];

export default function ReaderInteractive(props: {
  book: string;
  lang: string;
  chapter: string;
  locale: string;
  bookTitle: string;
  signedIn: boolean;
  loginHref: string;
  aiEnabled: boolean;
  chapterIndex: number;
}) {
  const { book, lang } = props;
  const progressExtra = useCallback(() => ({ chapters: loadProgress(book, lang).chapters }), [book, lang]);
  return (
    <SharedReader
      {...props}
      author={authorName(lang)}
      prefix="nc"
      prose=".reader-prose"
      root="#reader"
      colors={COLORS}
      progressExtra={progressExtra}
    />
  );
}
