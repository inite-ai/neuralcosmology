# Meta: первая кампания (PT/ES)

Аккаунт `9000158743360364` (портфолио Neuralcosmology, валюта BRL), страница Neural Cosmology, пиксель `1307118051447861`. Всё создаётся на паузе; включает владелец.

Состояние на 9 октября 2026: кампания, обе группы и все восемь объявлений собраны в черновике Ads Manager (кампания 120253345881870415). Не опубликовано, деньги не тратятся. Запуск — «Preview to publish» → «Publish».

## Структура

**Кампания** «NC · Experiments · LATAM · test» — цель «Трафик», бюджет на уровне групп.

| Группа | Гео | Язык | Бюджет/день | Оптимизация | Плейсменты |
|---|---|---|---|---|---|
| PT · Brasil | Бразилия | португальский | R$ 50 | просмотры посадочной | Advantage+ (Reels, Stories, лента) |

Возраст 20–55, без интересов (широкая аудитория — алгоритму нужен простор; интересы «Astronomia», «Física», «Neurociência» — вторым тестом). Через 30–50 событий `experiment_start` — переключить оптимизацию на конверсию (пользовательская конверсия по событию `experiment_start`).

Две недели × 2 группы × R$ 25 ≈ R$ 700 (≈ 125 $).

## Объявления (в каждой группе по четыре)

Креативы: `marketing/ads/{pt|es}-<опыт>-4x5.mp4` (ленты) и `-9x16s.mp4` (Reels/Stories, через замену вертикального кропа; заголовок и адрес внутри безопасной зоны 270–1245 px, `scripts/marketing/compose-ads-safe916.py`). Квадрат 1:1 Instagram не берёт (нужно от 4:5 до 9:16), поэтому 4:5 сделан из квадрата полями сверху и снизу: `ffmpeg -i X-1x1.mp4 -vf pad=1080:1350:0:135:color=0x0b0c10 X-4x5.mp4`. Кнопка — «See details» (Meta сама переводит).

UTM задаются в поле «URL parameters» (Tracking), ссылка в объявлении без меток. Отключено: AI-картинки, Video touch-ups, Text improvements, Enhance CTA, Add details to ad layout. Пиксель подключён в Tracking → Website events.

### PT

| Опыт | Основной текст | Заголовок | Ссылка |
|---|---|---|---|
| слизевик | Um organismo de uma célula, sem cérebro, traça redes de transporte quase ótimas — e o mesmo algoritmo reconstrói a teia cósmica. Toque na tela e veja a rede se refazer. | Um bolor que desenha o cosmos | `https://neuralcosmology.com/pt/experiments/cc-ch02-physarum?utm_source=meta&utm_medium=paid&utm_campaign=latam-test&utm_content=physarum-pt` |
| планарии | Levin mudou o padrão elétrico de um verme sem tocar em um único gene — e os pedaços cresceram com duas cabeças. Corte você mesmo e veja o que acontece. | Corte o verme | `…/pt/experiments/cc-ch05-planaria?utm_source=meta&utm_medium=paid&utm_campaign=latam-test&utm_content=planaria-pt` |
| две щели | Fótons passam um a um por duas fendas e desenham faixas. Ligue o detector e as faixas desaparecem. Teste no navegador. | Olhe, e a onda some | `…/pt/experiments/cc-ch03-double-slit?utm_source=meta&utm_medium=paid&utm_campaign=latam-test&utm_content=slit-pt` |
| кубит | Catorze resultados iguais seguidos: uma chance em 16.384. Meça um qubit cem vezes e veja que séries aparecem sozinhas. | Catorze seguidas | `…/pt/experiments/ba-ch01-qubit?utm_source=meta&utm_medium=paid&utm_campaign=latam-test&utm_content=qubit-pt` |

### ES

| Опыт | Основной текст | Заголовок | Ссылка |
|---|---|---|---|
| слизевик | Un organismo de una sola célula, sin cerebro, traza redes de transporte casi óptimas, y el mismo algoritmo reconstruye la red cósmica. Toque la pantalla y vea cómo se rehace la red. | Un moho que dibuja el cosmos | `https://neuralcosmology.com/es/experiments/cc-ch02-physarum?utm_source=meta&utm_medium=paid&utm_campaign=latam-test&utm_content=physarum-es` |
| планарии | Levin cambió el patrón eléctrico de un gusano sin tocar un solo gen, y los trozos crecieron con dos cabezas. Córtelo usted y vea qué pasa. | Corte el gusano | `…/es/experiments/cc-ch05-planaria?utm_source=meta&utm_medium=paid&utm_campaign=latam-test&utm_content=planaria-es` |
| две щели | Los fotones pasan de uno en uno por dos rendijas y dibujan franjas. Encienda el detector y las franjas desaparecen. Pruébelo en el navegador. | Mire, y la onda se va | `…/es/experiments/cc-ch03-double-slit?utm_source=meta&utm_medium=paid&utm_campaign=latam-test&utm_content=slit-es` |
| кубит | Catorce resultados iguales seguidos: una posibilidad entre 16.384. Mida un cúbit cien veces y vea qué rachas aparecen solas. | Catorce seguidas | `…/es/experiments/ba-ch01-qubit?utm_source=meta&utm_medium=paid&utm_campaign=latam-test&utm_content=qubit-es` |

## Когда смотреть и что выключать

Через 3–4 дня: объявления с CPC выше медианы вдвое и CTR ниже 0,8 % — выключить. Через неделю сравнить группы по стоимости `experiment_start` (GA4: событие × `utm_content`). Цели и пороги — в `LAUNCH.md`.

## Решение 9 октября 2026

ES-группа удалена до запуска: испанского перевода четырёх книг нет (в godacademy `reader.config.json` только ru/en/pt), испанские страницы опытов ведут в английские главы. Её бюджет отдан Бразилии: PT · Brasil — R$ 50 в день. Тексты ES выше оставлены на случай перевода.

## Страница Facebook (9 октября 2026)

Page ID `1434152923104538` (портфолио `1665261024316659`). Восемь роликов опытов опубликованы как reels через Business Suite (только Facebook, без Instagram): фуллерены, правило 110, «Жизнь», стая, кубит, планарии, две щели, слизевик. Тексты в два абзаца, PT и EN, ссылка на `/pt/experiments/<id>?utm_source=facebook&utm_medium=social&utm_campaign=page`. Слизевик закреплён. Кнопка «Learn More» ведёт на `https://neuralcosmology.com/?utm_source=facebook&utm_medium=social&utm_campaign=page-button`.

Публиковать надёжнее из композера Business Suite: сначала снять галочку Instagram в «Post to», подождать пару секунд и только потом загружать ролик. Если переключить получателей во время загрузки, обработка зависает. Композер на самой странице Facebook на загрузке зависал.

## Instagram (9 октября 2026)

Восемь тех же опытов опубликованы как reels в @neuralcosmology через instagram.com: Business Suite в режиме «только Instagram» ролик не загружает. Ролики `pt-<опыт>-9x16s.mp4`. У четырёх опытов не из рекламы (стая, правило 110, «Жизнь», фуллерены) исходников записи нет, поэтому их 9:16 собран из квадрата: `ffmpeg -i X-1x1.mp4 -vf "scale=860:860,pad=1080:1920:110:340:color=0x0b0c10" X-9x16s.mp4`, весь текст остаётся внутри безопасной зоны. Подписи PT + EN с «link na bio / link in bio» и пятью хэштегами. Ссылка в шапке профиля: www.neuralcosmology.com.

Реклама в Instagram уже идёт: в объявлениях выбран профиль @neuralcosmology, площадки Advantage+. Сравнивать Facebook и Instagram — в Ads Manager, «Breakdown» → «By delivery» → «Platform» (и «Placement»): цена клика, CTR, стоимость просмотра посадочной.

Попытка дописать в UTM `utm_term={{site_source_name}}_{{placement}}` (чтобы в GA4 делить `experiment_start` по площадкам) упирается в ошибку #2446880 «WhatsApp number required». Любая правка опубликованного объявления требует номер WhatsApp, потому что в Advantage+ включён WhatsApp Status, а WhatsApp-аккаунта на номере нет. Исключение WhatsApp в группе ошибку не сняло. Черновики сброшены, живая версия не тронута. Вернуться к этому, когда номер будет зарегистрирован в WhatsApp Business, или в новой группе/копии объявлений.

## Аналитика: пиксель, Conversions API, GA4 (9 октября 2026)

**Пиксель.** Events Manager открывается из рекламного аккаунта (`?act=9000158743360364`): пиксель принадлежит личному рекламному аккаунту, а не портфолио, поэтому в настройках портфолио его нет. Пользовательская конверсия «Experiment start» — событие `experiment_start` на neuralcosmology.com. Для `chapter_complete` её можно будет создать, когда событие хоть раз придёт.

Код (`components/analytics/Analytics.tsx`): пиксель ставит официальный сниппет (без своего PageView), у каждого события есть event_id. Самописная загрузка fbevents.js не отправляла события — 9 октября с 21:05 до ~22:20 пиксель молчал, вернули сниппет. События, сработавшие до загрузки пикселя (ViewContent при входе в главу), ждут в очереди — раньше они терялись. Стандартные события несут `content_ids`.

**Conversions API** (`lib/meta-capi.ts`). Браузер дублирует события на `/api/e`, сервер пересылает их в Meta с тем же event_id, IP, user agent, `_fbp`/`_fbc` (fbc собирается из fbclid), для вошедших — хеш почты и id. Lead шлёт `/api/subscribe` с хешем почты, Purchase — страница главы после оплаты (event_id = transaction_id). Включается секретом `META_CAPI_TOKEN`: Events Manager → neuralcosmology.com → Settings → Conversions API → Generate access token, затем `gh secret set META_CAPI_TOKEN` и перезапуск деплоя. Проверка: `gh variable set META_TEST_EVENT_CODE --body TEST…` (код со вкладки Test events), после проверки переменную удалить.

Включить руками в Settings пикселя: Automatic advanced matching (почта, внешний id).

**GA4** (property 556044470). Хранение событий — 14 месяцев (было 2). Пользовательские измерения уровня события: item_id, widget, book, chapter, lang, method, source, content_type. Ключевые события: purchase, begin_checkout, generate_lead, sign_up, experiment_start, chapter_complete, login_start (последнее лишнее, снять в Admin → Events). Google Signals выключены сознательно: при малом трафике они включают пороги и прячут строки в отчётах. Measurement Protocol ждёт «Подтверждения сбора пользовательских данных».
