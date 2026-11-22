import type { Book } from "@/types/book";

export const books: Book[] = [
  {
    slug: "celestial-code",
    titles: {
      en: "The Celestial Code",
      ru: "Небесный Код",
      pt: "O Código Celestial",
      es: "El Código Celestial",
    },
    hook: {
      en:
        "The network of galaxies and the network of neurons in the brain turned out to have similar connection statistics. The book works through this and other findings from peer-reviewed papers and puts forward a hypothesis together with the results that would refute it.",
      ru:
        "Сеть галактик и сеть нейронов мозга оказались похожи по статистике связей. Книга разбирает эту и другие находки по рецензируемым статьям и предлагает гипотезу вместе с результатами, которые её опровергнут.",
      pt:
        "A rede de galáxias e a rede de neurônios do cérebro mostraram estatísticas de conexão parecidas. O livro examina essa e outras descobertas a partir de artigos revisados por pares e propõe uma hipótese junto com os resultados que a refutariam.",
      es:
        "La red de galaxias y la red de neuronas del cerebro resultaron tener estadísticas de conexión parecidas. El libro examina este y otros hallazgos a partir de artículos revisados por pares y propone una hipótesis junto con los resultados que la refutarían.",
    },
    synopsis: {
      en:
        "The first non-fiction book of the series. The author, an AI engineer, brings together work on the large-scale structure of the universe, cellular bioelectricity (Michael Levin), the universe as a learning network (Vitaly Vanchurin), integrated information theory (Giulio Tononi) and the interface theory of perception (Donald Hoffman). Every claim is tied to a published paper, and his own hypothesis, Pointer Architecture, comes with a list of results that would prove it wrong. Between the chapters run autobiographical interludes: a cadet school, a Masonic lodge, the BOOM and AfrikaBurn festivals.",
      ru:
        "Первая книга нон-фикшн-линии. Автор, инженер ИИ, сводит вместе работы о крупномасштабной структуре Вселенной, биоэлектричестве клеток (Майкл Левин), Вселенной как обучающейся сети (Виталий Ванчурин), теории интегрированной информации (Джулио Тонони) и интерфейсной теории восприятия (Дональд Хоффман). Каждое утверждение опирается на опубликованную статью, а к собственной гипотезе автора, Pointer Architecture, приложен список результатов, которые её опровергнут. Главы перемежаются автобиографическими интерлюдиями: кадетский корпус, масонская ложа, фестивали BOOM и AfrikaBurn.",
      pt:
        "O primeiro livro de não ficção da série. O autor, engenheiro de IA, reúne trabalhos sobre a estrutura em grande escala do universo, a bioeletricidade das células (Michael Levin), o universo como rede que aprende (Vitaly Vanchurin), a teoria da informação integrada (Giulio Tononi) e a teoria da interface da percepção (Donald Hoffman). Cada afirmação se apoia em um artigo publicado, e a hipótese do próprio autor, a Pointer Architecture, vem com a lista de resultados que a derrubariam. Entre os capítulos há interlúdios autobiográficos: uma escola de cadetes, uma loja maçônica, os festivais BOOM e AfrikaBurn.",
      es:
        "El primer libro de no ficción de la serie. El autor, ingeniero de IA, reúne trabajos sobre la estructura a gran escala del universo, la bioelectricidad de las células (Michael Levin), el universo como red que aprende (Vitaly Vanchurin), la teoría de la información integrada (Giulio Tononi) y la teoría de la interfaz de la percepción (Donald Hoffman). Cada afirmación se apoya en un artículo publicado, y la hipótesis del propio autor, Pointer Architecture, viene con la lista de resultados que la refutarían. Entre los capítulos hay interludios autobiográficos: una escuela de cadetes, una logia masónica, los festivales BOOM y AfrikaBurn.",
    },
    status: "wip",
    statusLabel: {
      en:
        "211 pages · every chapter online",
      ru:
        "211 стр. · все главы онлайн",
      pt:
        "211 páginas · todos os capítulos online",
      es:
        "211 páginas · todos los capítulos en línea",
    },
    genre: "non-fiction",
    coverImage: "/covers/celestial-code.webp",
    comparables: [
      "The Order of Time — Carlo Rovelli",
      "I Am a Strange Loop — Douglas Hofstadter",
      "The Emperor's New Mind — Roger Penrose",
    ],
    companionPaperSlug: "pointer-architecture",
  },
  {
    slug: "conscious-selection",
    titles: {
      en: "Conscious Selection",
      ru: "Осознанный Отбор",
      pt: "Seleção Consciente",
      es: "Selección Consciente",
    },
    hook: {
      en:
        "The eye keeps only a spot the size of a fingernail in sharp focus, and a memory is rewritten every time it is recalled. The second book counts how many times the world is filtered before you choose anything, and reports what was left of the author's hypothesis after testing.",
      ru:
        "Глаз держит в резкости пятно размером с ноготь, а воспоминание переписывается каждый раз, когда его достают. Вторая книга считает, сколько раз мир отбирается до вашего выбора, и рассказывает, что осталось от гипотезы автора после проверки.",
      pt:
        "O olho mantém em foco só uma mancha do tamanho de uma unha, e uma lembrança é reescrita cada vez que é acessada. O segundo livro conta quantas vezes o mundo é filtrado antes de você escolher qualquer coisa e mostra o que sobrou da hipótese do autor depois do teste.",
      es:
        "El ojo solo mantiene enfocada una mancha del tamaño de una uña, y un recuerdo se reescribe cada vez que se evoca. El segundo libro cuenta cuántas veces se filtra el mundo antes de que elijas nada y muestra qué quedó de la hipótesis del autor tras ponerla a prueba.",
    },
    synopsis: {
      en:
        "The second non-fiction book of the series. Yarbus showed a subject the same Repin painting seven times and recorded seven different paths of the gaze, changing only the question asked beforehand. Nader showed that a recalled memory has to be consolidated again. Zurek explained why the environment leaves a quantum system only a few stable states. The book lines these results up into one argument: selection runs many times before a person gets to choose. At the end the author puts his own hypothesis from The Celestial Code through the same test and tells three stories of things that did not work, including a calculation of his that missed the Planck data by a hundred sigma.",
      ru:
        "Вторая книга нон-фикшн-линии. Ярбус семь раз показывал испытуемому одну и ту же картину Репина и получил семь разных маршрутов взгляда: менялся только вопрос, заданный перед показом. Надер показал, что поднятое из памяти воспоминание закрепляется заново. Зурек объяснил, почему среда оставляет от квантовой системы лишь немногие устойчивые состояния. Книга выстраивает эти работы в один ряд: отбор проходит много раз, прежде чем человек что-то выбирает. В конце автор прогоняет через ту же проверку собственную гипотезу из «Небесного Кода» и рассказывает три истории о том, что у него не получилось, в том числе о расчёте, разошедшемся с данными «Планка» на сотню сигм.",
      pt:
        "O segundo livro de não ficção da série. Yarbus mostrou o mesmo quadro de Repin a um voluntário sete vezes e registrou sete trajetos diferentes do olhar, mudando apenas a pergunta feita antes. Nader mostrou que uma lembrança evocada precisa ser consolidada de novo. Zurek explicou por que o ambiente deixa a um sistema quântico só alguns estados estáveis. O livro alinha esses resultados num só argumento: a seleção acontece muitas vezes antes que alguém chegue a escolher. No fim, o autor submete ao mesmo teste a própria hipótese de O Código Celestial e conta três histórias do que não deu certo, entre elas um cálculo seu que errou os dados do Planck por cem sigmas.",
      es:
        "El segundo libro de no ficción de la serie. Yarbus mostró a un voluntario el mismo cuadro de Repin siete veces y registró siete recorridos distintos de la mirada, cambiando solo la pregunta hecha antes. Nader mostró que un recuerdo evocado tiene que consolidarse de nuevo. Zurek explicó por qué el entorno le deja a un sistema cuántico solo unos pocos estados estables. El libro alinea estos resultados en un solo argumento: la selección ocurre muchas veces antes de que alguien llegue a elegir. Al final, el autor somete a la misma prueba su propia hipótesis de El Código Celestial y cuenta tres historias de lo que no le salió, entre ellas un cálculo suyo que falló frente a los datos de Planck por cien sigmas.",
    },
    status: "wip",
    statusLabel: {
      en:
        "Draft in proofreading · every chapter online",
      ru:
        "Черновик, идёт вычитка · все главы онлайн",
      pt:
        "Rascunho em revisão · todos os capítulos online",
      es:
        "Borrador en revisión · todos los capítulos en línea",
    },
    genre: "non-fiction",
    coverImage: "/covers/conscious-selection.webp",
    companionPaperSlug: "pointer-architecture",
  },
  {
    slug: "bugs-academy",
    titles: {
      en: "Bugs Academy",
      ru: "Академия Багов",
      pt: "Academia dos Bugs",
      es: "Academia de los Bugs",
    },
    hook: {
      en:
        "Moscow physicist Dan Reinov sees a car crash take shape a second before it happens. Then a man who is seven hundred years old calls and explains what really happened to his mother.",
      ru:
        "Московский физик Дан Рейнов за секунду до аварии видит, как она складывается. Потом ему звонит человек, которому семьсот лет, и объясняет, что на самом деле случилось с его матерью.",
      pt:
        "O físico moscovita Dan Reinov vê um acidente de trânsito se formar um segundo antes de acontecer. Depois, um homem de setecentos anos telefona e explica o que realmente aconteceu com a mãe dele.",
      es:
        "El físico moscovita Dan Reinov ve cómo se forma un accidente de tráfico un segundo antes de que ocurra. Luego le llama un hombre de setecientos años y le explica qué le pasó de verdad a su madre.",
    },
    synopsis: {
      en:
        "Daniil Reinov is twenty-eight, a quantum physicist in Moscow, and since childhood he has seen events assemble a second before they happen. Doctors called it apophenia. When the qubits in his lab start responding to his thoughts, he is found by Wei Lin, a teacher who is seven hundred years old, and taken to an Academy that looks like a country dacha outside Moscow. Four students like him study there, reality turns out to have six layers, and Dan's mother, who vanished twenty-one years ago, is alive in another body. A novel about immortality and what it costs.",
      ru:
        "Даниилу Рейнову двадцать восемь, он физик-квантовик из Москвы и с детства видит, как события собираются за секунду до того, как случаются. Врачи называли это апофенией. Когда кубиты в лаборатории начинают отзываться на его мысли, его находит Вэй Лин, учитель, которому семьсот лет, и привозит в Академию, похожую на подмосковную дачу. Там учатся ещё четверо таких же «багов», реальность оказывается шестислойной, а мать Дана, пропавшая двадцать один год назад, жива в другом теле. Роман о бессмертии и о том, чем за него платят.",
      pt:
        "Daniil Reinov tem vinte e oito anos, é físico quântico em Moscou e desde criança vê os acontecimentos se montarem um segundo antes de ocorrerem. Os médicos chamavam isso de apofenia. Quando os qubits do laboratório começam a responder aos pensamentos dele, Wei Lin, um mestre de setecentos anos, o encontra e o leva para uma Academia que parece uma casa de campo nos arredores de Moscou. Lá estudam mais quatro bugs como ele, a realidade tem seis camadas, e a mãe de Dan, desaparecida há vinte e um anos, está viva em outro corpo. Um romance sobre a imortalidade e o preço que se paga por ela.",
      es:
        "Daniil Reinov tiene veintiocho años, es físico cuántico en Moscú y desde niño ve cómo los sucesos se arman un segundo antes de ocurrir. Los médicos lo llamaban apofenia. Cuando los cúbits del laboratorio empiezan a responder a sus pensamientos, lo encuentra Wei Lin, un maestro de setecientos años, y lo lleva a una Academia que parece una casa de campo a las afueras de Moscú. Allí estudian otros cuatro bugs como él, la realidad tiene seis capas, y la madre de Dan, desaparecida hace veintiún años, está viva en otro cuerpo. Una novela sobre la inmortalidad y lo que cuesta.",
    },
    status: "forthcoming",
    statusLabel: {
      en:
        "Finished novel · 232 pages · seeking a publisher",
      ru:
        "Роман закончен · 232 стр. · ищет издателя",
      pt:
        "Romance concluído · 232 páginas · em busca de editora",
      es:
        "Novela terminada · 232 páginas · en busca de editorial",
    },
    genre: "sci-fi",
    pages: 232,
    coverImage: "/covers/bugs-academy.webp",
    comparables: [
      "Snow Crash — Neal Stephenson",
      "The Three-Body Problem — Liu Cixin",
      "Permutation City — Greg Egan",
    ],
  },
  {
    slug: "era-of-architects",
    titles: {
      en: "Era of Architects",
      ru: "Эра Архитекторов",
      pt: "Era dos Arquitetos",
      es: "Era de los Arquitectos",
    },
    hook: {
      en:
        "Moscow, 2033. The state opens an Institute of Awakening and licenses expanded perception, while Dan Reinov's seven-year-old daughter has had that perception since birth.",
      ru:
        "Москва, 2033 год. Государство открывает Институт Пробуждения и выдаёт лицензии на расширенное восприятие, а у семилетней дочери Дана Рейнова такое восприятие с рождения.",
      pt:
        "Moscou, 2033. O Estado abre um Instituto do Despertar e emite licenças de percepção ampliada, enquanto a filha de sete anos de Dan Reinov tem essa percepção desde que nasceu.",
      es:
        "Moscú, 2033. El Estado abre un Instituto del Despertar y expide licencias de percepción ampliada, mientras la hija de siete años de Dan Reinov tiene esa percepción desde que nació.",
    },
    synopsis: {
      en:
        "The sequel to Bugs Academy, seven years later. In the Moscow of 2033 the state certifies people who see reality as code; the system is run by Dan's former friend Artyom, and his old enemy Iero blows it up on prime-time television. Dan's daughter Lia was born with expanded perception, and the seven-hundred-year-old teacher prepares her for a decision she will have to make for the whole species fifteen years later. Behind them stand the archives of six civilisations that never got this far. The story is closed by an epilogue.",
      ru:
        "Продолжение «Академии Багов», семь лет спустя. В Москве 2033 года государство сертифицирует тех, кто видит реальность как код; систему возглавляет бывший друг Дана Артём, а старый враг Иеро взрывает её через прайм-тайм НТВ. Дочь Дана Лия родилась с расширенным восприятием, и семисотлетний учитель готовит её к решению, которое через пятнадцать лет ей придётся принять за весь вид. За ними стоят архивы шести цивилизаций, не дошедших до этого места. Историю закрывает эпилог.",
      pt:
        "A continuação de Academia dos Bugs, sete anos depois. Na Moscou de 2033, o Estado certifica quem enxerga a realidade como código; o sistema é comandado por Artiom, ex-amigo de Dan, e o velho inimigo Iero o explode em horário nobre na televisão. Lia, filha de Dan, nasceu com percepção ampliada, e o mestre de setecentos anos a prepara para uma decisão que, quinze anos depois, ela terá de tomar pela espécie inteira. Por trás deles estão os arquivos de seis civilizações que não chegaram até aqui. Um epílogo fecha a história.",
      es:
        "La continuación de Academia de los Bugs, siete años después. En el Moscú de 2033, el Estado certifica a quienes ven la realidad como código; el sistema lo dirige Artiom, antiguo amigo de Dan, y su viejo enemigo Iero lo hace estallar en horario estelar de televisión. Lía, la hija de Dan, nació con percepción ampliada, y el maestro de setecientos años la prepara para una decisión que, quince años después, tendrá que tomar por toda la especie. Detrás de ellos están los archivos de seis civilizaciones que no llegaron hasta aquí. Un epílogo cierra la historia.",
    },
    status: "forthcoming",
    statusLabel: {
      en:
        "Finished novel · 246 pages",
      ru:
        "Роман закончен · 246 стр.",
      pt:
        "Romance concluído · 246 páginas",
      es:
        "Novela terminada · 246 páginas",
    },
    genre: "literary-sci-fi",
    coverImage: "/covers/era-of-architects.webp",
  },
  {
    slug: "eternity",
    titles: {
      en: "Eternity",
      ru: "Вечность",
      pt: "Eternidade",
      es: "Eternidad",
    },
    hook: {
      en:
        "The narrator of this book hides in everything at once, from a fridge to a moth, and takes off seven masks one by one: name, memory, character, body, place, time and God. After each one it checks what is left.",
      ru:
        "Рассказчик этой книги прячется во всём сразу, от холодильника до мотылька, и по очереди снимает с себя семь масок: имя, память, характер, тело, место, время и Бога. После каждой он проверяет, что осталось.",
      pt:
        "O narrador deste livro se esconde em tudo ao mesmo tempo, da geladeira à mariposa, e tira sete máscaras, uma por uma: nome, memória, caráter, corpo, lugar, tempo e Deus. Depois de cada uma, verifica o que sobrou.",
      es:
        "El narrador de este libro se esconde en todo a la vez, de la nevera a la polilla, y se quita siete máscaras una tras otra: nombre, memoria, carácter, cuerpo, lugar, tiempo y Dios. Después de cada una comprueba qué queda.",
    },
    synopsis: {
      en:
        "The one the Indians called Brahman, Spinoza called Nature and Instagram stories call the Universe tells how it hides in a man who spends half the night rereading a single line in an empty file. Chapter by chapter it removes what a self is usually made of, and checks every removal against science: H.M. and Clive Wearing, who lost their memory, Phineas Gage and the iron rod through his skull, place cells and grid cells, the airborne clocks of Hafele and Keating, Einstein’s letter to the Besso family. Kurzweil, cryonics and dopamine fasting turn up as well, and get exactly the reverence they deserve. The word invariant is taken from physics literally: the book looks for a quantity that survives a change of carrier, the loss of memory, copying and stopped clocks. The answer rests on the Pointer Architecture of The Celestial Code, in which no record is ever deleted, and asks whether an eternal record has a reader.",
      ru:
        "Тот, кого индийцы звали Брахманом, Спиноза Природой, а сторис зовут Вселенной, рассказывает, как прячется в человеке, который полночи перечитывает одну строчку в пустом файле. Глава за главой он снимает то, из чего обычно собрано «я», и каждое снятие сверяет с наукой: Г. М. и Клайв Уиринг, потерявшие память, Финеас Гейдж с железным ломом через череп, клетки места и клетки решётки, часы Хафеле и Китинга на самолётах, письмо Эйнштейна семье Бессо. Курцвейл, крионика и дофаминовое голодание тоже появляются, и почтения им достаётся ровно столько, сколько они заслужили. Слово «инвариант» взято у физиков буквально: книга ищет величину, которая переживёт замену носителя, потерю памяти, копирование и остановку часов. Ответ опирается на Pointer Architecture из «Небесного кода», где ни одна запись не удаляется, и спрашивает, есть ли у вечной записи читатель.",
      pt:
        "Aquele que os indianos chamavam de Brahman, Espinosa de Natureza e os stories chamam de Universo conta como se esconde num homem que passa metade da noite relendo uma única linha num arquivo vazio. Capítulo a capítulo, ele tira aquilo de que um eu costuma ser feito e confere cada retirada com a ciência: H.M. e Clive Wearing, que perderam a memória, Phineas Gage e a barra de ferro que atravessou seu crânio, as células de lugar e as células de grade, os relógios de Hafele e Keating nos aviões, a carta de Einstein à família Besso. Kurzweil, a criônica e o jejum de dopamina também aparecem, e recebem exatamente a reverência que merecem. A palavra invariante vem da física, ao pé da letra: o livro procura uma grandeza que sobreviva à troca de suporte, à perda de memória, à cópia e aos relógios parados. A resposta se apoia na Pointer Architecture de O Código Celestial, em que nenhum registro é apagado, e pergunta se um registro eterno tem leitor.",
      es:
        "Aquel a quien los indios llamaban Brahman, Spinoza Naturaleza y las stories llaman Universo cuenta cómo se esconde en un hombre que pasa media noche releyendo una sola línea en un archivo vacío. Capítulo a capítulo se quita aquello de lo que suele estar hecho un yo y contrasta cada pérdida con la ciencia: H.M. y Clive Wearing, que perdieron la memoria, Phineas Gage y la barra de hierro que le atravesó el cráneo, las células de lugar y las células de rejilla, los relojes de Hafele y Keating en los aviones, la carta de Einstein a la familia Besso. Kurzweil, la criónica y el ayuno de dopamina también aparecen, y reciben exactamente la reverencia que merecen. La palabra invariante viene de la física, al pie de la letra: el libro busca una magnitud que sobreviva al cambio de soporte, a la pérdida de memoria, a la copia y a los relojes parados. La respuesta se apoya en la Pointer Architecture de El Código Celestial, en la que ningún registro se borra, y pregunta si un registro eterno tiene lector.",
    },
    status: "wip",
    statusLabel: {
      en:
        "First draft · 7 chapters · every chapter online",
      ru:
        "Первый черновик · 7 глав · все главы онлайн",
      pt:
        "Primeiro rascunho · 7 capítulos · todos os capítulos online",
      es:
        "Primer borrador · 7 capítulos · todos los capítulos en línea",
    },
    genre: "literary-sci-fi",
    coverImage: "/covers/eternity.webp",
    comparables: [
      "The Book — Alan Watts",
      "The End of Time — Julian Barbour",
      "Ficciones — Jorge Luis Borges",
    ],
    companionPaperSlug: "pointer-architecture",
  },
];

// Обложка на языке страницы: ru — оригинал из книги (/covers/<slug>.webp),
// en/pt/es — переведённые (/covers/<slug>-<lang>.webp). OG-версии — PNG 600×900 в /og/covers.
export function coverFor(book: Pick<Book, "coverImage">, locale: string): string {
  return locale === "ru" ? book.coverImage : book.coverImage.replace(/\.webp$/, `-${locale}.webp`);
}

export function ogCoverFor(slug: string, locale: string): string {
  return locale === "ru" ? `/og/covers/${slug}.png` : `/og/covers/${slug}-${locale}.png`;
}

export function getBookBySlug(slug: string): Book | undefined {
  return books.find((b) => b.slug === slug);
}
