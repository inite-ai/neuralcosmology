import type { SupportedLocale } from "@/lib/get-locale";
import type { SocialLabels } from "@/components/account/SocialPanel";

export const SOCIAL_LABELS: Record<SupportedLocale, SocialLabels & { title: string; lead: string }> = {
  ru: {
    title: "Цитаты в соцсетях",
    lead: "Раз в день в каждый подключённый аккаунт уходит цитата из книги: карточка с цитатой, подпись и ссылка на то место в главе, откуда она взята. Цитаты подбирает ИИ, каждая сверяется с текстом главы слово в слово. Очередь видна ниже: любую цитату можно убрать до публикации.",
    connect: "Подключить", lang: "Язык цитат для нового аккаунта", botToken: "Токен бота", botHint: "Создайте бота у @BotFather, добавьте его администратором канала с правом публикации и вставьте сюда токен.", channel: "@канал", add: "Подключить",
    threads: "Откроется окно Threads: войдите в профиль, куда публиковать.", facebook: "Откроется окно Facebook: выберите страницу, которой управляете.", notConfigured: "Нужно приложение Meta: THREADS_APP_ID и THREADS_APP_SECRET или META_APP_ID и META_APP_SECRET в секретах репозитория.",
    accounts: "Аккаунты", none: "Пока ни одного.", hour: "Час публикации", tz: "Часовой пояс (например, Europe/Moscow)", on: "вкл.", postNow: "Опубликовать сейчас", remove: "Отключить",
    queue: "Очередь цитат", skip: "Убрать", more: "Подобрать ещё", empty: "Цитат в очереди нет.",
    log: "Журнал", noLog: "Постов ещё не было.", posted: "опубликовано", failed: "не вышло", unknown: "исход неизвестен: проверьте ленту", sending: "публикуется", itPosted: "Вышел", notPosted: "Не вышел", expires: "токен до", connected: "Подключено",
  },
  en: {
    title: "Quotes on social media",
    lead: "Once a day every connected account gets a quote from the books: a quote card, a caption and a link to the exact place in the chapter. The AI picks the quotes, and each one is checked word for word against the chapter. The queue is below: remove any quote before it goes out.",
    connect: "Connect", lang: "Quote language for the new account", botToken: "Bot token", botHint: "Create a bot with @BotFather, make it a channel admin allowed to post, and paste its token here.", channel: "@channel", add: "Connect",
    threads: "A Threads window opens: sign in to the profile to post to.", facebook: "A Facebook window opens: pick the Page you manage.", notConfigured: "Needs a Meta app: THREADS_APP_ID and THREADS_APP_SECRET or META_APP_ID and META_APP_SECRET in the repository secrets.",
    accounts: "Accounts", none: "None yet.", hour: "Posting hour", tz: "Time zone (e.g. America/New_York)", on: "on", postNow: "Post now", remove: "Disconnect",
    queue: "Quote queue", skip: "Remove", more: "Find more", empty: "No quotes queued.",
    log: "Log", noLog: "No posts yet.", posted: "posted", failed: "failed", unknown: "outcome unknown: check the feed", sending: "posting", itPosted: "It’s up", notPosted: "Not posted", expires: "token until", connected: "Connected",
  },
  pt: {
    title: "Citações nas redes sociais",
    lead: "Uma vez por dia, cada conta conectada recebe uma citação dos livros: um cartão com a citação, uma legenda e um link para o ponto exato do capítulo. A IA escolhe as citações, e cada uma é conferida palavra por palavra com o capítulo. A fila está abaixo: retire qualquer citação antes da publicação.",
    connect: "Conectar", lang: "Idioma das citações da nova conta", botToken: "Token do bot", botHint: "Crie um bot no @BotFather, torne-o administrador do canal com permissão para publicar e cole o token aqui.", channel: "@canal", add: "Conectar",
    threads: "Abre-se uma janela do Threads: entre no perfil onde publicar.", facebook: "Abre-se uma janela do Facebook: escolha a página que você administra.", notConfigured: "É preciso um app da Meta: THREADS_APP_ID e THREADS_APP_SECRET ou META_APP_ID e META_APP_SECRET nos segredos do repositório.",
    accounts: "Contas", none: "Nenhuma ainda.", hour: "Hora da publicação", tz: "Fuso horário (ex.: America/Sao_Paulo)", on: "ativa", postNow: "Publicar agora", remove: "Desconectar",
    queue: "Fila de citações", skip: "Retirar", more: "Buscar mais", empty: "Nenhuma citação na fila.",
    log: "Registro", noLog: "Nenhuma publicação ainda.", posted: "publicado", failed: "falhou", unknown: "resultado desconhecido: confira o feed", sending: "publicando", itPosted: "Saiu", notPosted: "Não saiu", expires: "token até", connected: "Conectado",
  },
  es: {
    title: "Citas en redes sociales",
    lead: "Una vez al día, cada cuenta conectada recibe una cita de los libros: una tarjeta con la cita, un texto y un enlace al lugar exacto del capítulo. La IA elige las citas, y cada una se comprueba palabra por palabra con el capítulo. La cola está abajo: quita cualquier cita antes de que se publique.",
    connect: "Conectar", lang: "Idioma de las citas de la nueva cuenta", botToken: "Token del bot", botHint: "Crea un bot con @BotFather, hazlo administrador del canal con permiso para publicar y pega aquí su token.", channel: "@canal", add: "Conectar",
    threads: "Se abre una ventana de Threads: entra en el perfil donde publicar.", facebook: "Se abre una ventana de Facebook: elige la página que administras.", notConfigured: "Hace falta una app de Meta: THREADS_APP_ID y THREADS_APP_SECRET o META_APP_ID y META_APP_SECRET en los secretos del repositorio.",
    accounts: "Cuentas", none: "Ninguna todavía.", hour: "Hora de publicación", tz: "Zona horaria (p. ej., America/Mexico_City)", on: "activa", postNow: "Publicar ahora", remove: "Desconectar",
    queue: "Cola de citas", skip: "Quitar", more: "Buscar más", empty: "No hay citas en la cola.",
    log: "Registro", noLog: "Aún no hay publicaciones.", posted: "publicado", failed: "falló", unknown: "resultado desconocido: revisa el feed", sending: "publicando", itPosted: "Salió", notPosted: "No salió", expires: "token hasta", connected: "Conectado",
  },
};
