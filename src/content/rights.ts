import type { SupportedLocale } from "@/lib/get-locale";

// Страница для литагентов, издательств и прессы: /[locale]/rights.
// О том, какие права свободны, она не говорит: это зависит от книги, языка и
// страны и устареет с первым подписанным договором. Форма спрашивает, что нужно,
// ответ приходит письмом.

export type RightsCopy = {
  title: string;
  lede: string;
  booksHeading: string;
  textIn: (langs: string) => string;
  comparables: string;
  covers: string;
  authorHeading: string;
  authorLink: string;
  formHeading: string;
  formLede: string;
  form: {
    name: string;
    email: string;
    publisher: string;
    book: string;
    allBooks: string;
    territory: string;
    territoryHint: string;
    message: string;
    messageHint: string;
    send: string;
    sending: string;
    sent: string;
    failed: string;
  };
  langNames: Record<SupportedLocale, string>;
};

const MAIL = "info@neuralcosmology.com";

export const RIGHTS: Record<SupportedLocale, RightsCopy> = {
  en: {
    title: "Translation and publishing rights",
    lede: "The books of Neural Cosmology, their covers, and a form for publishers, literary agents and the press. Which rights are open depends on the book and the territory, so tell me what you have in mind and I will answer by email.",
    booksHeading: "The books",
    textIn: (langs) => `Full text on this site in ${langs}`,
    comparables: "For readers of",
    covers: "Cover, PNG 600×900",
    authorHeading: "The author",
    authorLink: "More about the author",
    formHeading: "Ask about rights",
    formLede: "A name, an address and a few lines are enough. If you already know the language, the territory or the format, say so and the answer will be specific.",
    form: {
      name: "Your name",
      email: "Email",
      publisher: "Publisher, agency or outlet",
      book: "Book",
      allBooks: "All the books",
      territory: "Language and territory",
      territoryHint: "e.g. German, worldwide",
      message: "Message",
      messageHint: "Format, timing, a review copy, an interview",
      send: "Send the request",
      sending: "Sending…",
      sent: "Received. The answer will come to the address you gave.",
      failed: `It did not go through. Write to ${MAIL} directly.`,
    },
    langNames: { en: "English", ru: "Russian", pt: "Portuguese", es: "Spanish" },
  },
  ru: {
    title: "Права на перевод и издание",
    lede: "Книги «Нейронной космологии», обложки к ним и форма для издательств, литературных агентов и прессы. Какие права свободны, зависит от книги и страны, поэтому напишите, что вы задумали, и я отвечу письмом.",
    booksHeading: "Книги",
    textIn: (langs) => `Полный текст на сайте: ${langs}`,
    comparables: "Для читателей",
    covers: "Обложка, PNG 600×900",
    authorHeading: "Автор",
    authorLink: "Подробнее об авторе",
    formHeading: "Запросить права",
    formLede: "Хватит имени, адреса и пары строк. Если уже понятны язык, территория или формат, укажите их, и ответ будет предметным.",
    form: {
      name: "Имя",
      email: "Почта",
      publisher: "Издательство, агентство или издание",
      book: "Книга",
      allBooks: "Все книги",
      territory: "Язык и территория",
      territoryHint: "например, немецкий, весь мир",
      message: "Сообщение",
      messageHint: "Формат, сроки, экземпляр для рецензии, интервью",
      send: "Отправить запрос",
      sending: "Отправляю…",
      sent: "Запрос получен. Ответ придёт на указанную почту.",
      failed: `Не отправилось. Напишите напрямую на ${MAIL}.`,
    },
    langNames: { en: "английский", ru: "русский", pt: "португальский", es: "испанский" },
  },
  pt: {
    title: "Direitos de tradução e publicação",
    lede: "Os livros da Cosmologia Neural, as capas e um formulário para editoras, agentes literários e imprensa. Quais direitos estão livres depende do livro e do território, então conte o que você tem em mente e eu respondo por email.",
    booksHeading: "Os livros",
    textIn: (langs) => `Texto completo no site em ${langs}`,
    comparables: "Para leitores de",
    covers: "Capa, PNG 600×900",
    authorHeading: "O autor",
    authorLink: "Mais sobre o autor",
    formHeading: "Pedir direitos",
    formLede: "Nome, endereço e algumas linhas bastam. Se você já sabe o idioma, o território ou o formato, diga, e a resposta será concreta.",
    form: {
      name: "Seu nome",
      email: "Email",
      publisher: "Editora, agência ou veículo",
      book: "Livro",
      allBooks: "Todos os livros",
      territory: "Idioma e território",
      territoryHint: "por exemplo, alemão, mundo todo",
      message: "Mensagem",
      messageHint: "Formato, prazos, exemplar para resenha, entrevista",
      send: "Enviar o pedido",
      sending: "Enviando…",
      sent: "Recebido. A resposta vai para o endereço que você informou.",
      failed: `Não foi enviado. Escreva direto para ${MAIL}.`,
    },
    langNames: { en: "inglês", ru: "russo", pt: "português", es: "espanhol" },
  },
  es: {
    title: "Derechos de traducción y publicación",
    lede: "Los libros de la Cosmología Neural, sus cubiertas y un formulario para editoriales, agentes literarios y prensa. Qué derechos están libres depende del libro y del territorio, así que cuéntame lo que tienes en mente y te respondo por correo.",
    booksHeading: "Los libros",
    textIn: (langs) => `Texto completo en el sitio en ${langs}`,
    comparables: "Para lectores de",
    covers: "Cubierta, PNG 600×900",
    authorHeading: "El autor",
    authorLink: "Más sobre el autor",
    formHeading: "Consultar derechos",
    formLede: "Bastan un nombre, una dirección y unas líneas. Si ya sabes el idioma, el territorio o el formato, indícalo y la respuesta será concreta.",
    form: {
      name: "Tu nombre",
      email: "Correo",
      publisher: "Editorial, agencia o medio",
      book: "Libro",
      allBooks: "Todos los libros",
      territory: "Idioma y territorio",
      territoryHint: "por ejemplo, alemán, todo el mundo",
      message: "Mensaje",
      messageHint: "Formato, plazos, ejemplar para reseña, entrevista",
      send: "Enviar la consulta",
      sending: "Enviando…",
      sent: "Recibido. La respuesta llegará a la dirección que indicaste.",
      failed: `No se envió. Escribe directamente a ${MAIL}.`,
    },
    langNames: { en: "inglés", ru: "ruso", pt: "portugués", es: "español" },
  },
};
