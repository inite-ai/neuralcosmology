# Google Ads — Бразилия, поиск

Кабинет 587-407-6492 (mike@inite.ai, R$, Бразилиа). Общий с INITE: там кампании «AI visibility».
Наши кампании называются с префиксом `NC |`, конверсии сайта не делаем основными на уровне
аккаунта — цель задаётся в настройках самой кампании, иначе собьётся оптимизация INITE.

## Сделано

- 2026-10-10: GA4 (ресурс 556044470) привязан к кабинету (`googleAdsLinks/16099637459`,
  персонализация рекламы и импорт метрик GA4 включены).
- 2026-10-10: конверсии из GA4 — `neuralcosmology.com (web)` experiment_start (Engagement),
  generate_lead, sign_up, purchase. Последние три — дополнительные (secondary); цель
  Engagement снята с account-default, чтобы не влиять на кампании INITE.
- 2026-10-10: опубликована кампания `NC | BR | PT | Search | Experimentos` (ID 24334510524):
  цель только Engagements, Maximize clicks с потолком R$1.50, R$25/день, только Google Search,
  Бразилия (presence), португальский, AI Max и text customization / final URL expansion
  выключены, UTM в final URL suffix, 4 sitelinks кампании (эксперименты, книги, ответы, эссе) —
  перекрывают sitelinks INITE. 5 групп (фразовое соответствие, по 10 заголовков):
  Dupla fenda → cc-ch03-double-slit, Bolor limoso → cc-ch02-physarum,
  Jogo da vida → cc-comp-life, Matéria escura → answers/galaxy-rotation-curves-without-dark-matter,
  Panpsiquismo → answers/panpsychism. Минус-слова кампании: pdf, download, baixar, resumo,
  trabalho escolar, wikipedia, filme.
- Подвохи интерфейса: пока «Confirm it's you» пропущен (Skip), изменения черновика молча не
  сохраняются (внизу «Changes failed to save»); бюджет требует подтверждения отдельно.
  Новая группа подставляет заголовки/URL предыдущей — поля надо очищать (cmd+A), а не дописывать.
  Логотип в объявлениях — аккаунтный (INITE).

- 2026-10-11: после привязки Ads gtag шлёт хиты на `analytics.google.com/g/collect` и
  `www.google.com/g/collect`; CSP (next.config.ts) их блокировал, и с ночи 10.10 GA4 видел ~10%
  трафика (Meta 10.10: 737 Landing Page Views, GA4: 74 визита). CSP расширен (10da867), хиты
  идут. Данные GA4 за 10–11.10 по Meta занижены — для сравнения брать цифры кабинета Meta.
- 2026-10-11: аккаунт Ads за 10.10 потратил R$0 по всем кампаниям — показов нет до пополнения.

- 2026-10-14: баланс кабинета R$0 — R$1 400 октября съели кампании INITE, наша не потратила ничего
  (с потолком R$1.50 не выигрывала аукционы). Потолок поднят до R$3.50. Объявление Bolor limoso
  переписано под слизевик (было копией двойной щели), URL `/pt/experiments/cc-ch02-physarum`.
- 2026-10-14: деление денег. Google не делит предоплату между кампаниями — каждая тратит до своего
  дневного бюджета, пока на счёте есть деньги. План — R$3 000/мес ≈ R$100/день, NC 25 %:
  NC R$25; Care R$20, LATAM ES R$17, MF BR R$9, MF MX R$9, LATAM PT R$8, Atlas R$7, EU ES R$5
  (было R$249/день при пополнениях ~R$47/день). Меняя пополнение, менять и бюджеты: сумма
  дневных бюджетов ≈ пополнение / 30.

## Спрос (DataForSEO, Brasil/pt, 2026-10-10)

По самой книге и идее поиска нет: «cosmologia neural», «universo consciente», «universo como
cérebro», «neurônios e galáxias» — 0–50 в месяц. По темам опытов — есть, конкуренция низкая:

| Запрос | В месяц | Верх выдачи, до |
|---|---|---|
| matéria escura | 22 200 | $0.61 |
| cosmologia | 9 900 | $0.42 |
| o que é consciência | 4 400 | $3.83 (не брать) |
| energia escura | 3 600 | — |
| experimento da dupla fenda + dupla fenda | 3 200 | — |
| origem do universo | 1 900 | — |
| livro física quântica | 1 600 | $0.40 |
| bolor limoso | 720 | — |
| panpsiquismo | 720 | — |
| consciência cósmica | 590 | — |
| livro sobre o universo | 590 | $0.28 |

## План кампании `NC | BR | PT | Search | Experimentos`

- Бразилия, португальский, только поиск (без КМС и партнёров), R$25/день,
  «максимум кликов» с потолком R$1.5; через 30+ конверсий — на «максимум конверсий».
- Цель кампании: `experiment_start` из GA4 (основная); `generate_lead`, `sign_up`,
  `purchase` — дополнительные.
- Группы → страницы:
  - двойная щель («experimento da dupla fenda», «dupla fenda») → `/pt/experiments/cc-ch03-double-slit`
  - слизевик («bolor limoso», «physarum») → `/pt/experiments/cc-ch02-physarum`
  - клеточные автоматы («jogo da vida conway», «autômato celular») → `/pt/experiments/cc-comp-life`
  - тёмная материя («matéria escura», «matéria escura existe») → `/pt/answers/galaxy-rotation-curves-without-dark-matter`
  - панпсихизм («panpsiquismo», «consciência cósmica», «universo consciente») → `/pt/answers/panpsychism`
  - книги («livro sobre o universo», «livro física quântica») → страница книги
- Минус-слова: «pdf», «download», «resumo», «trabalho escolar», «wikipedia», «filme».
- UTM: `utm_source=google&utm_medium=cpc&utm_campaign=nc_br_search&utm_term={keyword}`.

## Осталось

1. Через 3–4 дня: отчёт по поисковым запросам → новые минус-слова; сравнить стоимость
   experiment_start с Meta (GA4, utm_source=google vs facebook/instagram).
2. После 30+ конверсий — перейти на «максимум конверсий».
3. Пополнить баланс кабинета (висит «Balance is running low»).
4. Логотип Cosmologia Neural на уровне кампании.
5. Через 3–4 дня — YouTube Shorts / Demand Gen с роликами, лучшими в Meta.
