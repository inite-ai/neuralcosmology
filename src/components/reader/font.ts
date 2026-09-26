import { Literata } from "next/font/google";

// Книжная гарнитура для читалки: кириллица + латиница + диакритика pt/es.
export const readerFont = Literata({
  subsets: ["latin", "latin-ext", "cyrillic"],
  style: ["normal", "italic"],
  variable: "--font-reader",
  display: "swap",
});
