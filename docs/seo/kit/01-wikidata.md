# Wikidata

Нужен аккаунт Wikidata (можно войти через аккаунт Википедии). Пакеты запускать в QuickStatements: https://quickstatements.toolforge.org → New batch → вставить → Import V1 commands → Run. После каждого пакета записать полученный Q-номер.

Перед первым запуском проверить в интерфейсе (поиск по названию), что QID-ы классов совпадают:
Q5 human · Q36180 writer · Q82594 computer scientist · Q9143 programming language · Q580922 preprint · Q7725634 literary work · Q24925 science fiction · Q11891 consciousness · Q338 cosmology · Q7737 Russian · Q1860 English · Q5146 Portuguese · Q1321 Spanish · Racket — найти поиском «Racket programming language».

## Пакет 1. Автор

```
CREATE
LAST	Len	"Mikhail Savchenko"
LAST	Lru	"Михаил Савченко"
LAST	Lpt	"Mikhail Savchenko"
LAST	Les	"Mikhail Savchenko"
LAST	Den	"AI engineer and writer; author of the Neural Cosmology research programme"
LAST	Dru	"инженер ИИ и писатель, автор исследовательской программы «Нейронная космология»"
LAST	Dpt	"engenheiro de IA e escritor, autor do programa de investigação Cosmologia Neural"
LAST	Des	"ingeniero de IA y escritor, autor del programa de investigación Cosmología Neural"
LAST	Aen	"Mike Fluff"
LAST	Aru	"Майк Флафф"
LAST	P31	Q5
LAST	P106	Q36180	S854	"https://neuralcosmology.com/en/about"
LAST	P106	Q82594	S854	"https://neuralcosmology.com/en/about"
LAST	P1412	Q7737
LAST	P1412	Q1860
LAST	P856	"https://neuralcosmology.com/en/about"
LAST	P496	"0009-0006-2873-9925"
LAST	P2037	"Mikefluff"
LAST	P2002	"mikefluff"
LAST	P6634	"mikefluff"
LAST	P3789	"neuralcosmology"
```
Полученный номер — `QAUTHOR` в пакетах ниже.

## Пакет 2. Язык Sixth

```
CREATE
LAST	Len	"Sixth"
LAST	Den	"Forth-like concatenative programming language with a hypergraph-rewriting substrate"
LAST	Dru	"Forth-подобный конкатенативный язык программирования с субстратом переписывания гиперграфов"
LAST	P31	Q9143
LAST	P178	QAUTHOR
LAST	P287	QAUTHOR
LAST	P1324	"https://github.com/neuralcosmology/sixth"
LAST	P856	"https://neuralcosmology.com/en/science/pointer-architecture"
LAST	P275	Q334661
```
(Q334661 — MIT License, проверить.) После — `P277` (programmed in) → QID Racket, `P737` (influenced by) → Forth (Q275472, проверить).

## Пакет 3. Книги

```
CREATE
LAST	Lru	"Академия Багов"
LAST	Len	"Bugs Academy"
LAST	Lpt	"Academia dos Bugs"
LAST	Les	"Academia de los Bugs"
LAST	Dru	"научно-фантастический роман Михаила Савченко"
LAST	Den	"science fiction novel by Mikhail Savchenko"
LAST	P31	Q7725634
LAST	P50	QAUTHOR
LAST	P407	Q7737
LAST	P136	Q24925
LAST	P1476	ru:"Академия Багов"
LAST	P856	"https://neuralcosmology.com/ru/books/bugs-academy"

CREATE
LAST	Lru	"Эра Архитекторов"
LAST	Len	"Era of Architects"
LAST	Lpt	"Era dos Arquitetos"
LAST	Les	"Era de los Arquitectos"
LAST	Dru	"научно-фантастический роман Михаила Савченко, продолжение «Академии Багов»"
LAST	Den	"science fiction novel by Mikhail Savchenko, sequel to Bugs Academy"
LAST	P31	Q7725634
LAST	P50	QAUTHOR
LAST	P407	Q7737
LAST	P136	Q24925
LAST	P1476	ru:"Эра Архитекторов"
LAST	P856	"https://neuralcosmology.com/ru/books/era-of-architects"

CREATE
LAST	Lru	"Небесный Код"
LAST	Len	"The Celestial Code"
LAST	Lpt	"O Código Celestial"
LAST	Les	"El Código Celestial"
LAST	Dru	"научно-популярная книга Михаила Савченко о сознании и космологии"
LAST	Den	"non-fiction book by Mikhail Savchenko on consciousness and cosmology"
LAST	P31	Q7725634
LAST	P50	QAUTHOR
LAST	P407	Q7737
LAST	P921	Q11891
LAST	P921	Q338
LAST	P1476	ru:"Небесный Код"
LAST	P856	"https://neuralcosmology.com/ru/books/celestial-code"

CREATE
LAST	Lru	"Осознанный Отбор"
LAST	Len	"Conscious Selection"
LAST	Lpt	"Seleção Consciente"
LAST	Les	"Selección Consciente"
LAST	Dru	"научно-популярная книга Михаила Савченко о том, как наблюдатель отбирает мир"
LAST	Den	"non-fiction book by Mikhail Savchenko on how an observer selects the world"
LAST	P31	Q7725634
LAST	P50	QAUTHOR
LAST	P407	Q7737
LAST	P921	Q11891
LAST	P1476	ru:"Осознанный Отбор"
LAST	P856	"https://neuralcosmology.com/ru/books/conscious-selection"
```
Потом: «Эре» — `P155` (follows) → Q «Академии Багов»; «Академии» — `P156` (followed by) → Q «Эры»; «Осознанному отбору» — `P155` → Q «Небесного Кода».

## Пакет 4. Препринт (после DOI)

```
CREATE
LAST	Len	"Pointer Architecture: An Operational Discrete Substrate from First Difference to Holographic Dark Energy"
LAST	Den	"2026 preprint by Mikhail Savchenko"
LAST	Dru	"препринт Михаила Савченко, 2026"
LAST	P31	Q580922
LAST	P50	QAUTHOR
LAST	P1476	en:"Pointer Architecture: An Operational Discrete Substrate from First Difference to Holographic Dark Energy"
LAST	P577	+2026-00-00T00:00:00Z/9
LAST	P407	Q1860
LAST	P356	"<DOI>"
LAST	P953	"https://neuralcosmology.com/en/science/pointer-architecture"
LAST	P921	Q11891
```

## Пакет 5. Связи у автора

```
QAUTHOR	P800	Q<Небесный Код>
QAUTHOR	P800	Q<Академия Багов>
QAUTHOR	P800	Q<препринт>
QAUTHOR	P800	Q<Sixth>
```

## После

Прислать все Q-номера: впишу `https://www.wikidata.org/wiki/Q…` в sameAs (Person, Organization, Book), identity.json, person.jsonld, llms.txt.

Чего не делать: не создавать статью в Википедии самому (конфликт интересов, удалят) — Wikidata для этого не нужна.
