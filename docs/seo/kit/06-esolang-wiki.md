# esolangs.org: статья «Sixth»

Зарегистрироваться на esolangs.org, создать страницу `Sixth`, вставить текст ниже (разметка MediaWiki). На вики принято писать нейтрально и от третьего лица.

```
{{infobox proglang
|name=Sixth
|paradigms=[[Concatenative]], [[Stack-based]]
|author=Mikhail Savchenko
|year=[[:Category:2026|2026]]
|memsys=[[Stack-based]]
|dimensions=one-dimensional
|class=[[Turing complete]]
|majorimpl=[https://github.com/neuralcosmology/sixth Reference implementation] (Racket)
|influence=[[Forth]]
|files=<code>.6th</code>, <code>.rkt</code> with <code>#lang sixth</code>
}}

'''Sixth''' is a [[Forth]]-like concatenative, stack-based language hosted on [[Racket]]. Besides an ordinary stack tier it has a second tier of words that turn it into a hypergraph-rewriting machine. It was written as the reference implementation of Pointer Architecture, a formal model of a computational substrate.

== Overview ==
The language has 49 primitive words: 17 base words (stack manipulation, arithmetic, comparison, <code>if … else … then</code>, named memory, I/O) and 32 substrate words. Everything else — control helpers, Peano arithmetic, graph search, cellular automata — is written in Sixth itself and loaded with <code>use</code>. There are no loop constructs; tail-call optimisation is mandatory and recursion replaces loops. Word bodies are compiled to flat opcode vectors when a file is loaded.

The substrate tier works on a directed graph. <code>MARK</code> creates a new node, <code>EDGE+</code> adds a directed edge between two nodes, <code>NSET</code>/<code>NGET</code> attach and read a value on a node, and rewrite words such as <code>EACH</code> and <code>STEP-CA</code> transform the graph as a whole.

== Examples ==
=== Factorial ===
<pre>
#lang sixth
: factorial dup 1 > if dup 1 - factorial * else drop 1 then ;
5 factorial .   \ prints 120
</pre>

=== A node that points to itself ===
<pre>
use prelude
use debug

MARK "O" store
"O" load "O" load EDGE+

NODES 1 assert-eq
EDGES 1 assert-eq
"O" load "O" load EDGE? 1 assert-eq
</pre>

== Computational class ==
Sixth is [[Turing complete]]: the stack tier has recursion with conditionals and unbounded named memory, and the repository includes demonstrations of Rule 110 and of universal rewrite rules on the substrate tier.

== Implementation ==
The reference implementation is a Racket package providing a lexer, parser, compiler, virtual machine, module loader, REPL and a command-line runner. The repository ships 197 example programs checked by 2500 assertions (<code>make verify</code>).

== External links ==
* [https://github.com/neuralcosmology/sixth Source code]
* [https://neuralcosmology.com/en/science/pointer-architecture Pointer Architecture preprint]

[[Category:Languages]]
[[Category:2026]]
[[Category:Stack-based]]
[[Category:Concatenative]]
[[Category:Turing complete]]
[[Category:Implemented]]
```

Сверено с репозиторием: первый коммит 2026-05-20, Rule 110 — `examples/27-rule110.6th`, универсальность переписывания — `examples/109-rewrite-rule-universality.6th`.

## Rosetta Code
rosettacode.org → создать страницу категории `Category:Sixth` (текст — первый абзац выше) и решить задачи, где Sixth показывает себя: Hello world/Text, FizzBuzz, Factorial, Fibonacci sequence, Towers of Hanoi, Ackermann function, Conway's Game of Life (на субстрате), 99 bottles of beer. Каждое решение — проверенный код из `examples/` или новый, прогнанный через `racket -l sixth/cli -- run`. Могу написать и прогнать решения, если поставить Racket локально.
