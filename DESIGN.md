---
version: alpha
name: Neural Cosmology
description: Research programme on consciousness and the computational structure of the universe. Night-ink sheet with hairline rails, classical display serif, one starlight accent.
colors:
  bg: "#0A0B10"
  bg-raised: "#101219"
  bg-sunk: "#07080C"
  fg: "#ECEAE4"
  fg-secondary: "#C2C0B9"
  muted: "#8C8B93"
  line: "#34353D"
  line-soft: "#1F2028"
  primary: "#A5B4FC"
  primary-strong: "#818CF8"
  on-primary: "#0A0B10"
typography:
  display:
    fontFamily: Cormorant Garamond
    fontSize: 5.5rem
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: -0.02em
  headline:
    fontFamily: Cormorant Garamond
    fontSize: 3.25rem
    fontWeight: 400
    lineHeight: 1.06
    letterSpacing: -0.015em
  title:
    fontFamily: Cormorant Garamond
    fontSize: 1.625rem
    fontWeight: 500
    lineHeight: 1.18
  number:
    fontFamily: Cormorant Garamond
    fontSize: 3.5rem
    fontWeight: 400
    lineHeight: 1
  body:
    fontFamily: Geist
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: Geist
    fontSize: 0.9375rem
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: Geist Mono
    fontSize: 0.6875rem
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0.14em
rounded:
  none: 0px
  sm: 4px
  full: 9999px
spacing:
  gutter: 20px
  gutter-md: 40px
  cell: 28px
  cell-md: 40px
  section: 72px
  section-md: 128px
  container: 1200px
---

# Design System: Neural Cosmology

## Overview

**Creative North Star: "The Plate Room".** An observatory archive at night: astronomical glass plates and lab micrographs laid out on a single sheet ruled with hairlines. The page reads like a scientific folio, calm and exact, with one cold point of starlight for the things that matter.

Mobile first. Every section is designed at 390px, then opened up at `md` (768) and `lg` (1024).

- One 1200px sheet with 0.5px `line` rails from `md` up; on phones the rails disappear and content sits on a 20px gutter.
- Sections are separated by 0.5px horizontal rules. No boxes floating in space, no glass, no glow.
- Imagery is generative: a seeded cosmic-web graph (nodes and filaments) drawn in SVG, which doubles as a neural network. Book covers keep their own art.
- One accent, `primary` (starlight indigo), only for labels, numbers, active states and links on hover.

## Colors

Night ink, warm paper-white type, one starlight accent.

- **Ink** (`bg`, `bg-raised`, `bg-sunk`): the sheet, raised cells (forms, reader panels), and sunk bands (footer).
- **Type** (`fg`, `fg-secondary`, `muted`): headlines in `fg`, lead copy in `fg-secondary`, secondary and meta text in `muted`.
- **Lines** (`line`, `line-soft`): rails, rules and cell borders at 0.5px; `line-soft` for rules inside cells.
- **Starlight** (`primary`, `primary-strong`): labels, 01–10 numbers, focus rings, the reading progress bar. Never a background band, never a gradient.
- The filled button is `fg` on `bg` (paper on ink). The outline button is a 0.5px `fg` rule.

## Typography

**Cormorant Garamond** for display, headlines, titles and numbers; **Geist** for body and UI; **Geist Mono** for labels. The book reader keeps **Literata**.

- `display`: hero headline, `clamp(2.75rem, 11vw, 5.5rem)`. The second clause is set in italic.
- `headline`: section headlines, `clamp(2.125rem, 7vw, 3.25rem)`.
- `title`: card and cell titles.
- `number`: 01–10 and stats, in `primary`.
- `body` 16px on phones (never smaller for running text), `body-sm` inside dense cells.
- `label`: Geist Mono, uppercase, +0.14em, `primary` above every section headline, `muted` for meta.
- Cormorant never goes bold: emphasis is italic or scale.

## Layout

- Sheet: `container` 1200px, centred, `gutter` 20px on phones, `gutter-md` 40px from `md`.
- Section rhythm: `section` 72px on phones, `section-md` 128px from `lg`.
- Cells: `cell` 28px padding on phones, `cell-md` 40px from `md`. Cell grids are 1 column on phones, 2 at `md`, 3–4 at `lg`, always sharing 0.5px borders (no gaps).
- Long lists that would stack past two screens on a phone become a horizontal snap row (the ten commandments).
- The header is a 56px bar with a hairline bottom. On phones: wordmark and a menu button that opens a full-screen sheet with serif links.

## Elevation & Depth

Flat. Depth comes from the generative plates and from `bg-sunk` bands, never from shadows or blur.

## Shapes

- Cells, plates, cards, covers: square (`none`).
- Buttons and inputs: `sm` (4px).
- Only the reading-progress dot and locale chips are `full`.
- Every rule is 0.5px. A rule that looks heavy is 1px and wrong.

## Components

- **Label**: mono uppercase `primary`, sits 12px above a headline.
- **Headline**: Cormorant, second clause italic, blur-in once on entry.
- **Cell**: 0.5px border, `cell` padding, `number` or label → `title` → body in `muted`.
- **Plate**: generative cosmic-web SVG in a 0.5px frame with a mono caption ("PL. 01 · COSMIC WEB").
- **Button (paper)**: 44px tall on phones (touch), 40px from `md`; `fg` fill, `bg` text, mono label.
- **Button (rule)**: same size, 0.5px `fg` border, transparent.
- **Row link**: full-width hairline row with title left, meta and arrow right; the whole row is the tap target.

## Do's and Don'ts

- Do design at 390px first; nothing may scroll horizontally except explicit snap rows.
- Do keep tap targets at least 44px on phones.
- Do set the second clause of display and section headlines in italic.
- Do use `primary` only for labels, numbers, focus and progress.
- Don't use gradients, glass, glows, particles or drop shadows.
- Don't use gradient text, emoji or filled icons. Icons are 1px line (lucide at `strokeWidth={1}`).
- Don't round cells or cards.
- Don't animate longer than 700ms or with bounce; respect `prefers-reduced-motion`.
