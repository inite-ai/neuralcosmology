# English posts

## Show HN
Post Tuesday–Thursday, 15:00–17:00 UTC. Stay in the thread for the first two hours.

**Title (80 chars max):**
Show HN: Sixth – a Forth-like language with a pre-registered log of its failures

**URL:** https://github.com/neuralcosmology/sixth

**First comment (post it yourself right away):**
> Sixth is a small concatenative language hosted on Racket (`#lang sixth`): 17 ordinary stack words plus 32 that turn it into a hypergraph-rewriting engine. From three moves — make a node, draw a pointer, rewrite — the demos build counting, ordered time, Conway's Life, an autopoietic ring and a toy "cosmogenesis" with an observer node. 197 demos, 2500 assertions, `make verify` reproduces all of it.
>
> The part I'd most like criticism on is the research protocol. Since cycle 10, every experiment starts as a PREDICTIONS file whose SHA-256 goes into an append-only ledger tied to a git tag before anything is measured. 52 cycles so far, and the log is mostly nulls and retractions: most early signals vanished against degree-matched controls, and the latest Darwinian loop purifies a population (mean productivity 1.33 → 2.00) but does not climb past its parent. CLAIMS.md separates what is tested, what is shown on synthetic substrates and what is conjecture.
>
> It is the reference implementation of a preprint (Pointer Architecture v9.0) that tries to put consciousness on a measurable substrate and lists its own falsifiers: https://neuralcosmology.com/en/science/pointer-architecture

## dev.to / Medium / Hashnode
Set canonical URL to the Habr article (or to a future blog page on the site). Tags: `forth`, `racket`, `programminglanguages`, `artificiallife`.

**Title:** 49 words on a stack: a language where time and observers grow from one distinction — and a ledger of what failed

**Body:** English version of `04-habr-sixth.md`, sections in the same order; shorten the table of eras to five bullet lines.

## r/Forth
**Title:** Sixth: a Forth-like language on Racket where the second tier is a graph-rewriting substrate
> I built a small Forth-flavoured language as the engine for a research project and thought this sub might enjoy the design: 17 base words (stack, arithmetic, `if/else/then`, memory, I/O), mandatory TCO instead of loops, word bodies compiled to flat opcode vectors at load time. The unusual part is a second tier of 32 words — `MARK`, `EDGE+`, rewrite — that makes the language a hypergraph-rewriting machine; demos build Life, an autopoietic ring and so on from those. Repo with 197 runnable demos: https://github.com/neuralcosmology/sixth — curious what Forth people think of the stack discipline in the substrate words.

## Racket Discourse (Show & Tell)
**Title:** `#lang sixth` — a concatenative language with a hypergraph substrate
> Sixth is implemented as a Racket `#lang`: lexer, parser, compiler to opcode vectors, VM with TCO, module loader, REPL and CLI with `-D KEY=VAL`. Programs are `.rkt` files that start with `#lang sixth`, so DrRacket's Check Syntax and `raco make` just work. `raco pkg install --link .` then `make verify` runs 197 demos. Feedback on the `#lang` plumbing very welcome: https://github.com/neuralcosmology/sixth

## Lobsters (needs an invite)
Title as HN, tags `plt`, `science`. Link to the repo.
