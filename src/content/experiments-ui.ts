import type { SupportedLocale } from "@/lib/get-locale";

// Подписи раздела «Опыты» (/<locale>/experiments).
export const experimentsUi: Record<SupportedLocale, {
  nav: string; title: string; lead: string; metaTitle: string; metaDescription: string;
  fromChapter: string; chapter: string; readFree: string; read: string; book: string; more: string; all: string; count: (n: number) => string;
}> = {
  ru: {
    nav: "Опыты",
    title: "Опыты",
    lead: "Опыты из книг, которые запускаются прямо в браузере: слизевик прокладывает сеть, фотоны проходят через две щели, кубит выпадает четырнадцать раз подряд. Каждый ведёт в главу, где объяснено, что вы видите.",
    metaTitle: "Опыты: слизевик, две щели, слепое пятно, кубит и другие — в браузере",
    metaDescription: "Интерактивные опыты из книг Михаила Савченко: модель слизевика, двухщелевой опыт, принцип Ландауэра, «Жизнь» Конвея, опыт Ярбуса, слепое пятно, индекс сборки, кубит.",
    fromChapter: "Откуда этот опыт", chapter: "Глава", readFree: "Читать главу бесплатно", read: "Читать главу", book: "О книге", more: "Другие опыты", all: "Все опыты",
    count: (n) => `${n} ${n % 10 === 1 && n % 100 !== 11 ? "опыт" : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? "опыта" : "опытов"}`,
  },
  en: {
    nav: "Experiments",
    title: "Experiments",
    lead: "Experiments from the books that run right in your browser: a slime mould lays out a network, photons cross two slits, a qubit lands the same way fourteen times in a row. Each one leads to the chapter that explains what you are seeing.",
    metaTitle: "Experiments: slime mould, double slit, blind spot, qubit and more, in your browser",
    metaDescription: "Interactive experiments from Mikhail Savchenko’s books: a slime-mould model, the double-slit experiment, Landauer’s principle, Conway’s Life, Yarbus’s eye-movement study, the blind spot, assembly index, a qubit.",
    fromChapter: "Where this comes from", chapter: "Chapter", readFree: "Read the chapter free", read: "Read the chapter", book: "About the book", more: "More experiments", all: "All experiments",
    count: (n) => `${n} experiment${n === 1 ? "" : "s"}`,
  },
  pt: {
    nav: "Experimentos",
    title: "Experimentos",
    lead: "Experimentos dos livros que rodam direto no navegador: um bolor limoso traça uma rede, fótons atravessam duas fendas, um qubit cai do mesmo jeito catorze vezes seguidas. Cada um leva ao capítulo que explica o que você está vendo.",
    metaTitle: "Experimentos: bolor limoso, fenda dupla, ponto cego, qubit e mais, no navegador",
    metaDescription: "Experimentos interativos dos livros de Mikhail Savchenko: modelo de bolor limoso, fenda dupla, princípio de Landauer, Jogo da Vida de Conway, experimento de Yarbus, ponto cego, índice de montagem, qubit.",
    fromChapter: "De onde vem este experimento", chapter: "Capítulo", readFree: "Ler o capítulo grátis", read: "Ler o capítulo", book: "Sobre o livro", more: "Outros experimentos", all: "Todos os experimentos",
    count: (n) => `${n} experimentos`,
  },
  es: {
    nav: "Experimentos",
    title: "Experimentos",
    lead: "Experimentos de los libros que funcionan en el navegador: un moho mucilaginoso traza una red, los fotones cruzan dos rendijas, un cúbit sale igual catorce veces seguidas. Cada uno lleva al capítulo que explica lo que está viendo.",
    metaTitle: "Experimentos: moho mucilaginoso, doble rendija, punto ciego, cúbit y más, en el navegador",
    metaDescription: "Experimentos interactivos de los libros de Mikhail Savchenko: modelo de moho mucilaginoso, doble rendija, principio de Landauer, Juego de la Vida de Conway, experimento de Yarbus, punto ciego, índice de ensamblaje, cúbit.",
    fromChapter: "De dónde viene este experimento", chapter: "Capítulo", readFree: "Leer el capítulo gratis", read: "Leer el capítulo", book: "Sobre el libro", more: "Otros experimentos", all: "Todos los experimentos",
    count: (n) => `${n} experimentos`,
  },
};
