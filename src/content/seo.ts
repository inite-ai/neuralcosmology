import type { SupportedLocale } from "@/lib/get-locale";

// Поисковые заголовки (<title> и превью) под реальный спрос. Заголовки на самих
// страницах (H1) остаются авторскими — здесь только то, что видит выдача.
type Key = "home" | "books" | "essays" | "lectures" | "science" | "about";

export const seoTitle: Record<SupportedLocale, Record<Key, string> & { suffix: string }> = {
  en: {
    suffix: "Neural Cosmology",
    home: "Neural Cosmology — consciousness and the universe as a network",
    books: "Books on consciousness and the universe — read online",
    essays: "Essays on consciousness, physics and the universe",
    lectures: "Lectures on consciousness and cosmology — video and transcripts",
    science: "Research: Pointer Architecture, information and consciousness",
    about: "Mikhail Savchenko — researcher of consciousness and cosmology",
  },
  ru: {
    suffix: "Нейронная космология",
    home: "Нейронная космология — сознание и Вселенная как сеть",
    books: "Книги о сознании и Вселенной — читать онлайн",
    essays: "Эссе о сознании, физике и Вселенной",
    lectures: "Лекции о сознании и космологии — видео и расшифровки",
    science: "Исследования: Pointer Architecture, информация и сознание",
    about: "Михаил Савченко — исследователь сознания и космологии",
  },
  pt: {
    suffix: "Cosmologia Neural",
    home: "Cosmologia Neural — a consciência e o universo como rede",
    books: "Livros sobre consciência e o universo — leia online",
    essays: "Ensaios sobre consciência, física e o universo",
    lectures: "Palestras sobre consciência e cosmologia — vídeos e transcrições",
    science: "Pesquisa: Pointer Architecture, informação e consciência",
    about: "Mikhail Savchenko — pesquisador da consciência e da cosmologia",
  },
  es: {
    suffix: "Cosmología Neural",
    home: "Cosmología Neural — la conciencia y el universo como red",
    books: "Libros sobre la conciencia y el universo — leer en línea",
    essays: "Ensayos sobre la conciencia, la física y el universo",
    lectures: "Charlas sobre conciencia y cosmología — vídeos y transcripciones",
    science: "Investigación: Pointer Architecture, información y conciencia",
    about: "Mikhail Savchenko — investigador de la conciencia y la cosmología",
  },
};
