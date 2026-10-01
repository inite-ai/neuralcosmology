# Zenodo: два DOI

## A. DOI для кода (автоматически при релизе)

`.zenodo.json` уже лежит в корне `neuralcosmology/sixth` — Zenodo возьмёт метаданные из него.

1. https://zenodo.org → Log in → GitHub (войти тем же аккаунтом).
2. Settings → GitHub → кнопка Sync → включить переключатель у `neuralcosmology/sixth`. (Если организации нет в списке: на GitHub → Settings → Applications → Authorized OAuth Apps → Zenodo → Grant для neuralcosmology.)
3. Создать релиз (могу сделать сам, когда переключатель включён):
   `gh release create v0.9.0 -R neuralcosmology/sixth --title "Sixth v0.9.0" --notes "Snapshot after 52 pre-registered cycles: 49 primitives, 197 demonstrations, 2500 checks. Reference implementation of Pointer Architecture v9.0."`
4. Через пару минут на странице релиза в Zenodo появится DOI и бейдж.

## B. DOI для препринта (загрузка вручную)

https://zenodo.org/uploads/new

| Поле | Значение |
|---|---|
| Files | PDF препринта v9.0 |
| Resource type | Publication → Preprint |
| Title | Pointer Architecture: An Operational Discrete Substrate from First Difference to Holographic Dark Energy |
| Creators | Savchenko, Mikhail — ORCID 0009-0006-2873-9925 — Role: none |
| Description | абстракт ниже |
| Licenses | Creative Commons Attribution 4.0 International |
| Keywords | pointer architecture; computational substrate; emergence; holographic dark energy; integrated information; consciousness; Forth; artificial life; neural cosmology |
| Version | 9.0 |
| Language | English |
| Publication date | дата v9.0 |
| Related works | `is documented by` → https://neuralcosmology.com/en/science/pointer-architecture (URL); `is supplemented by` → DOI кода из части A (DOI) |
| Communities (по желанию) | поиском: «consciousness», «complex systems», «artificial life» — присоединение модерируется, но даёт видимость |

**Description (абстракт):**
> We define Pointer Architecture (PA), a formal computational substrate S = (G, R, C, A, π), and give it an operational realisation as a small Forth-like language, Sixth, in 38 primitives. The substrate passes 40 emergence demonstrations (646 assertions, no failures) that climb from a single distinction through arithmetic, time, space, observers and universal computation to autopoiesis, a cosmogenesis bootstrap and the substrate's own measurement of a consciousness quantity Φ_PA. On this substrate we prove four complexity results within explicit scope (graph-isomorphism-hardness of pointer equivalence, #P-hardness of weighted path observables, a per-step commit-cost bound for M observers, Shannon-rate archive compression) and three correspondences with CRDTs, Petri nets and the actor model. A substrate-cone construction realises the holographic entropy cone and maps PA's primitives onto the algebraic-observer programme in quantum gravity; on the de Sitter horizon it reproduces standard holographic dark energy, ρ_Λ = 3H₀²c²/(16πG), within a factor of about 0.73 of the observed value. An empirical scope-control on Pythia language-model activations falsifies the naive hypothesis that hidden-activation covariance is a holographic entropy function. The paper is a structural-correspondence contribution with pre-stated falsifiers, not a solved theory of consciousness.

## После обоих DOI

Прислать DOI — пропишу: `papers.ts` (doi), `citation_doi` и ScholarlyArticle.identifier на странице препринта, CITATION.cff и бейдж в README репозитория, llms.txt, identity.json, Wikidata (пакет 4).

## Те же метаданные — дальше по списку
OSF Preprints (osf.io/preprints), PhilArchive (philarchive.org → Submit), Preprints.org, ResearchGate (Add research → Preprint), Academia.edu — поля те же, в «Related links» — страница препринта и DOI Zenodo. В PhilArchive категория: Philosophy of Mind → Consciousness; Philosophy of Physical Science → Philosophy of Cosmology.
