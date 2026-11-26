import type { SupportedLocale } from "@/lib/get-locale";

// Что сайт собирает на самом деле (по коду). Меняете сбор данных — правьте и этот текст.
export const PRIVACY_UPDATED = "2026-11-25";
type Doc = { title: string; updated: string; lede: string; sections: { h: string; p: string[] }[] };
const MAIL = "info@neuralcosmology.com";

export const PRIVACY: Record<SupportedLocale, Doc> = {
  ru: {
    title: "Приватность",
    updated: "Обновлено",
    lede: "Что собирает этот сайт, зачем и как это удалить.",
    sections: [
      { h: "Кто отвечает", p: [`Сайт ведёт Михаил Савченко. Вопросы о данных: ${MAIL}.`] },
      { h: "Что вы оставляете сами", p: [
        "Форма связи сохраняет имя, адрес почты и сообщение в базе сайта и отправляет мне письмом. Запрос прав для издательств сохраняет ещё издательство, книгу и территорию.",
        "Подписка сохраняет адрес, язык и место, где вы его оставили. Письма о новых главах приходят только после подтверждения, отписаться можно по ссылке в каждом из них.",
        "Если вы вошли, сайт хранит имя и адрес почты, которые передаёт аккаунт, время первого и последнего входа, прогресс чтения, пометки, комментарии, настройки и число вопросов к ИИ. Вход идёт через INITE, оплата через INITE Billing и платёжного провайдера. Номера карт сайт не видит.",
        "Вопросы к ИИ в читалке обрабатывает Anthropic. Комментарии перед публикацией тоже проверяет ИИ.",
        "В платные главы вшита невидимая метка аккаунта: по ней можно найти, откуда утёк текст.",
      ] },
      { h: "Аналитика и реклама", p: [
        "Ещё сайт ведёт собственный счёт: какую страницу открыли, какую главу начали или дочитали, пошли ли платить и купили ли книгу, с какого сайта пришли и из какой страны. Посетитель в этом счёте - хеш IP-адреса и браузера с ключом, который меняется каждый день и потом удаляется, поэтому одного человека нельзя проследить от дня ко дню, а сам IP не сохраняется. Кук для этого нет. Записи удаляются через тринадцать месяцев.",
        "Google Analytics 4 считает страницы, главы, опыты, покупки. В ЕЭЗ, Великобритании и Швейцарии его куки выключены, туда уходят только обезличенные сигналы. Вошедшему читателю передаётся непрозрачный номер, не сам аккаунт.",
        "Вне этих стран пиксель Meta и Conversions API получают те же события, IP-адрес, сведения о браузере и, если вы оставили почту, её хеш SHA-256.",
      ] },
      { h: "Кто ещё это видит", p: ["Mailgun доставляет письма, Cloudflare проводит трафик, база и сайт стоят на арендованном сервере. Данные не продаются."] },
      { h: "Сколько хранится и как удалить", p: [
        "Данные хранятся, пока вы пользуетесь сайтом. В кабинете их можно скачать и удалить. После удаления остаются метка платного текста без адреса, обезличенные комментарии и покупки в биллинге.",
        `Без аккаунта напишите на ${MAIL} с того же адреса: пришлю копию, исправлю или удалю.`,
      ] },
    ],
  },
  en: {
    title: "Privacy",
    updated: "Updated",
    lede: "What this site collects, why, and how to have it deleted.",
    sections: [
      { h: "Who is responsible", p: [`Mikhail Savchenko runs this site. Questions about your data: ${MAIL}.`] },
      { h: "What you give yourself", p: [
        "The contact form stores your name, email address and message in the site’s database and emails them to me. The rights request for publishers also stores the publisher, the book and the territory.",
        "A subscription stores the address, your language and where you left it. Emails about new chapters start only after you confirm, and each carries an unsubscribe link.",
        "If you sign in, the site keeps the name and email address the account passes on, when you first and last signed in, your reading progress, notes, comments, settings and the number of AI questions. Sign-in goes through INITE, payment through INITE Billing and its payment provider. The site never sees card numbers.",
        "Questions to the AI in the reader are processed by Anthropic. Comments are also checked by AI before they appear.",
        "Paid chapters carry an invisible mark of your account, so that a leaked text can be traced.",
      ] },
      { h: "Analytics and advertising", p: [
        "The site also keeps its own count: which page was opened, which chapter was started or read to the end, a checkout started or a book bought, the referring site and the country. The visitor in that count is a hash of your IP address and browser with a key that changes every day and is then deleted, so the same person cannot be followed from one day to the next and the IP is never stored. No cookie is used for it. Records are deleted after thirteen months.",
        "Google Analytics 4 counts pages, chapters, experiments and purchases. In the EEA, the UK and Switzerland its cookies are off and it receives only cookieless signals. A signed-in reader is sent as an opaque number, never as the account.",
        "Outside those countries the Meta pixel and Conversions API receive the same events, your IP address, browser details and, if you left an email, its SHA-256 hash.",
      ] },
      { h: "Who else sees it", p: ["Mailgun delivers the emails, Cloudflare carries the traffic, and the database and site run on a rented server. Nothing is sold."] },
      { h: "How long, and how to delete it", p: [
        "Data is kept while you use the site. You can download and delete it in your account. After deletion there remain the mark in paid text without your address, anonymised comments and purchases in billing.",
        `Without an account, write to ${MAIL} from the same address and I will send a copy, correct it or delete it.`,
      ] },
    ],
  },
  pt: {
    title: "Privacidade",
    updated: "Atualizado em",
    lede: "O que este site coleta, por quê e como apagar.",
    sections: [
      { h: "Quem é responsável", p: [`Mikhail Savchenko mantém este site. Dúvidas sobre seus dados: ${MAIL}.`] },
      { h: "O que você mesmo informa", p: [
        "O formulário de contato guarda nome, e-mail e mensagem no banco de dados do site e os envia para mim por e-mail. O pedido de direitos para editoras guarda também a editora, o livro e o território.",
        "A inscrição guarda o endereço, o idioma e onde ele foi informado. Os e-mails sobre novos capítulos só começam depois da confirmação, e cada um traz um link para cancelar.",
        "Se você entra na conta, o site guarda o nome e o e-mail que a conta repassa, quando você entrou pela primeira e pela última vez, progresso de leitura, notas, comentários, configurações e o número de perguntas à IA. O login passa pela INITE, o pagamento pela INITE Billing e pelo provedor de pagamento. O site não vê números de cartão.",
        "As perguntas à IA no leitor são processadas pela Anthropic. Os comentários também são verificados por IA antes de aparecer.",
        "Os capítulos pagos levam uma marca invisível da sua conta, para rastrear um texto vazado.",
      ] },
      { h: "Análise e publicidade", p: [
        "O site também faz a própria contagem: que página foi aberta, que capítulo foi começado ou lido até o fim, se alguém foi pagar ou comprou um livro, de que site veio e de que país. O visitante nessa contagem é um hash do endereço IP e do navegador com uma chave que muda todo dia e depois é apagada, então a mesma pessoa não pode ser seguida de um dia para o outro e o IP não é guardado. Nenhum cookie é usado para isso. Os registros são apagados depois de treze meses.",
        "O Google Analytics 4 conta páginas, capítulos, experimentos e compras. No EEE, no Reino Unido e na Suíça os cookies ficam desligados e ele recebe apenas sinais sem cookies. O leitor conectado é enviado como um número opaco, nunca como a conta.",
        "Fora desses países, o pixel da Meta e a Conversions API recebem os mesmos eventos, o endereço IP, dados do navegador e, se você informou o e-mail, o hash SHA-256 dele.",
      ] },
      { h: "Quem mais vê", p: ["A Mailgun entrega os e-mails, a Cloudflare conduz o tráfego, e o banco de dados e o site ficam em um servidor alugado. Nada é vendido."] },
      { h: "Por quanto tempo e como apagar", p: [
        "Os dados ficam guardados enquanto você usa o site. Na conta você pode baixá-los e apagá-los. Depois permanecem a marca no texto pago sem o seu endereço, os comentários anônimos e as compras no sistema de cobrança.",
        `Sem conta, escreva para ${MAIL} do mesmo endereço: envio uma cópia, corrijo ou apago.`,
      ] },
    ],
  },
  es: {
    title: "Privacidad",
    updated: "Actualizado el",
    lede: "Qué recoge este sitio, para qué y cómo borrarlo.",
    sections: [
      { h: "Quién responde", p: [`Mikhail Savchenko mantiene este sitio. Preguntas sobre sus datos: ${MAIL}.`] },
      { h: "Lo que usted mismo deja", p: [
        "El formulario de contacto guarda nombre, correo y mensaje en la base de datos del sitio y me los envía por correo. La consulta de derechos para editoriales guarda además la editorial, el libro y el territorio.",
        "La suscripción guarda la dirección, el idioma y dónde la dejó. Los correos sobre capítulos nuevos empiezan solo después de confirmar, y cada uno lleva un enlace de baja.",
        "Si inicia sesión, el sitio guarda el nombre y el correo que transmite la cuenta, cuándo entró por primera y por última vez, el progreso de lectura, las notas, los comentarios, los ajustes y el número de preguntas a la IA. El acceso pasa por INITE, el pago por INITE Billing y su proveedor de pago. El sitio no ve números de tarjeta.",
        "Las preguntas a la IA en el lector las procesa Anthropic. Los comentarios también se revisan con IA antes de publicarse.",
        "Los capítulos de pago llevan una marca invisible de su cuenta, para rastrear un texto filtrado.",
      ] },
      { h: "Analítica y publicidad", p: [
        "El sitio también lleva su propio recuento: qué página se abrió, qué capítulo se empezó o se leyó hasta el final, si alguien fue a pagar o compró un libro, de qué sitio vino y de qué país. El visitante en ese recuento es un hash de la dirección IP y del navegador con una clave que cambia cada día y luego se borra, así que a la misma persona no se la puede seguir de un día a otro y la IP no se guarda. No se usa ninguna cookie para esto. Los registros se borran a los trece meses.",
        "Google Analytics 4 cuenta páginas, capítulos, experimentos y compras. En el EEE, el Reino Unido y Suiza sus cookies están apagadas y recibe solo señales sin cookies. El lector con sesión se envía como un número opaco, nunca como la cuenta.",
        "Fuera de esos países, el píxel de Meta y la Conversions API reciben los mismos eventos, la dirección IP, datos del navegador y, si dejó un correo, su hash SHA-256.",
      ] },
      { h: "Quién más lo ve", p: ["Mailgun entrega los correos, Cloudflare lleva el tráfico, y la base de datos y el sitio están en un servidor alquilado. Nada se vende."] },
      { h: "Cuánto tiempo y cómo borrarlo", p: [
        "Los datos se guardan mientras usa el sitio. En su cuenta puede descargarlos y borrarlos. Después quedan la marca del texto de pago sin su dirección, los comentarios anónimos y las compras en la facturación.",
        `Sin cuenta, escriba a ${MAIL} desde la misma dirección: le envío una copia, lo corrijo o lo borro.`,
      ] },
    ],
  },
};
