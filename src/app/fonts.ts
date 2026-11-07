import { Marcellus, Forum, Geist, Geist_Mono } from "next/font/google";

// Шрифты сайта: общие для основного layout и страниц встраивания опытов (/embed).

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

// Заголовки как в образце: Marcellus (латиница) + Forum (кириллица) —
// одна и та же классическая «расклёшенная» антиква, 400, без жирного.
const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  display: "swap",
});

const forum = Forum({
  variable: "--font-forum",
  subsets: ["cyrillic", "cyrillic-ext", "latin"],
  weight: "400",
  display: "swap",
});

export const fontVariables = `${geistSans.variable} ${geistMono.variable} ${marcellus.variable} ${forum.variable}`;
