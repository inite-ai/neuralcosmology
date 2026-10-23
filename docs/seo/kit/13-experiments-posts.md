# Опыты: посты для Hacker News и Reddit

Отдельно от `05-english-posts.md` (там Sixth). Между Show HN про Sixth и этим — не меньше двух недель.
Публикует автор со своих аккаунтов, отвечает на комментарии первые 2–3 часа. Каждое размещение — в трекер `EXTERNAL-LINKS.md`.

---

## Show HN

**Title** (≤ 80 знаков):

Show HN: 17 browser experiments from my popular-science books (canvas, no engine)

**URL:** https://neuralcosmology.com/en/experiments

**First comment:**

I write popular-science books about physics, biology and the mind, and kept hitting the same wall: I could explain that the double-slit fringes vanish when you put a detector at the slits, but readers had to take my word for it. So the experiments now sit inside the chapters, and each also has its own page.

Some details that might interest HN:

- Double slit: every photon samples its landing point from |ψ₁+ψ₂|² (no detector) or |ψ₁|²+|ψ₂|² (detector on). No pre-drawn pattern; the fringes emerge from noise after a couple of hundred photons.
- Slime mould: Jeff Jones's 2010 agent model (the one behind the Monte Carlo Physarum Machine used to reconstruct the cosmic web), 9,000 particles on typed arrays, no WebGL.
- Conway's Life with an invisible margin that is wiped every step, so Gosper-gun gliders leave instead of wrapping around and wrecking the gun.
- Assembly index (Cronin & Walker) for words: exact iterative-deepening search with a node budget, falling back to a greedy upper bound and saying so.
- Yarbus's eye-movement study without an eye tracker: the painting is blurred except for a ~2° spot under your cursor, and fixations are extracted with I-DT.

Each caption says what is real data and what is a schematic (e.g. the Wow! signal column 6EQUJ5 is genuine, the printout around it is drawn). All of them pause off-screen and respect prefers-reduced-motion.

Any of them can be embedded with an iframe; there is an "Embed on your site" button under each. Corrections to the physics very welcome.

---

## Reddit

Правило: свой пост — не чаще раза в месяц на сабреддит; перед публикацией прочитать правила сабреддита (в некоторых самопиар только в еженедельных тредах).

### r/cellular_automata

**Title:** I made Conway's Life and all 256 elementary rules playable in the browser for a book chapter

**Body:**

Two of the experiments in my book on computation and physics are cellular automata, so I put them online:

- Conway's Life, draw with your finger, with Gosper gun, gliders and R-pentomino presets. The grid has an invisible margin that is cleared each step, so gliders fly off instead of wrapping around: https://neuralcosmology.com/en/experiments/cc-comp-life
- All 256 elementary (Wolfram) rules, with Rule 110 as the default: https://neuralcosmology.com/en/experiments/cc-comp-rule110

Both can be embedded on your own page (button under the experiment). Feedback welcome, especially on what presets you would add.

### r/Physics (только в еженедельном треде, если сабреддит не пускает ссылки)

**Text:**

I built a one-photon-at-a-time double-slit simulation where each photon is sampled from |ψ₁+ψ₂|² or, with the which-path detector on, from |ψ₁|²+|ψ₂|². There is also a mode based on Hackermüller et al. 2004, heating C₇₀ molecules until thermal photons give away the path (the visibility-vs-temperature curve is schematic, said so on the page). Happy to hear where the simplification misleads: https://neuralcosmology.com/en/experiments/cc-ch03-double-slit

### r/Physarum, r/slimemolds

**Title:** A browser model of Physarum building a network between food sources (Jones 2010 agent model)

**Body:**

9,000 agents sense the trail ahead and to the sides, turn toward the strongest, move and deposit; the trail diffuses and decays. Tap to place food and watch the network re-route. This is the same family of models that Burchett and Elek used to map the cosmic web. https://neuralcosmology.com/en/experiments/cc-ch02-physarum

### r/education, r/PhysicsTeachers, r/teachingresources

**Title:** Free embeddable physics and biology simulations for class (double slit, Landauer, blind spot, Conway's Life…)

**Body:**

I wrote these for my books, but they work on their own and can be embedded in a course page or LMS with an iframe (button under each experiment). No sign-up, no ads, available in English, Portuguese, Spanish and Russian. Full list: https://neuralcosmology.com/en/experiments
