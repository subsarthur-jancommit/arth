# MOTION SPEC

How the motion in this project was built, and why. Derived from measured
production CSS of ten award-winning sites — see `TEARDOWN.md` for the
evidence and `teardown-data.json` for raw counts.

**This is a reference, not law.** `CLAUDE.md` demoted it there, and the fork
retired the parts of it that decided taste in advance — the duration bands,
the token-only easing, the "3D is an accent" ceiling. Read it to understand
what exists and to stay idiomatic, not to get permission.

Four motion rules do still bind, and they live in `CLAUDE.md`, not here:
animate `transform` and `opacity` (#4); `prefers-reduced-motion` is mandatory
and content must end fully visible under it (#5); one RAF loop, shared by
Lenis, GSAP and Tempus (#6); always clean up — `kill()` ScrollTriggers and
revert GSAP contexts on unmount (#7). Each protects a reader rather than a
preference.

The single most important idea: **motion quality comes from a small set of
consistent decisions, not from more animation.** A site with three timings
and two curves, applied consistently, reads as expensive. A site with
fifteen ad-hoc `gsap.to()` calls reads as cheap regardless of effort spent.

## Moments as built (F4-01, 6 November 2026)

Each named moment, the file that draws it and the e2e that proves it. §12
and §13 describe them; this is where to find them. Every named moment carries
its `data-epic` mark, so the interaction-grammar report
(`e2e/interaction-grammar.e2e.ts`) lists it; the last three rows are
mechanisms, not marked moments. `set-depth` and `offer-arrival` took their
marks in F4-01's follow-up, which also proved the three moments that had
none.

| Moment                             | Where                                | Drawn by                                                                     | Proved by                                                     |
| ---------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `practice-morph`                   | Home → unit                          | `vault/blocks/practice-list` → `vault/blocks/unit-hero` (`<ViewTransition>`) | `motion.e2e.ts`                                               |
| `practice-statement`               | Unit page                            | `vault/blocks/unit-hero`, `components/effects/progress-text`                 | `practice-statement.e2e.ts`, `unit-page.e2e.ts`               |
| `unit-method`                      | Unit page                            | `vault/blocks/capability-set`                                                | `unit-dialects.e2e.ts`                                        |
| `side-sheet-swap` (§13.1)          | Side → other side                    | `app/[locale]/[unit]/[side]/side-switcher.tsx` (Web Animations API)          | `side-sheet-swap.e2e.ts`, `one-navigation.e2e.ts`             |
| `side-buying-path`                 | Side page                            | `vault/blocks/step-sequence`                                                 | `side-page.e2e.ts`                                            |
| `side-chapter-table`               | Side page                            | `vault/blocks/side-chapter-table` (`crosshair`, `cover-preview`)             | `side-chapter-table.e2e.ts`                                   |
| `network-money-flow` (§13.4)       | `/id/peekabo/jaringan`               | `vault/blocks/network-side` (`plumb`, `stamp`)                               | `network-promise.e2e.ts`                                      |
| `bab-formwork`, `bab-sift` (§13.2) | Chapter page                         | `vault/blocks/chapter-offer-grid` (`formwork`, `flip`)                       | `bab-offer.e2e.ts`                                            |
| `offer-arrival` (§13.11)           | Chapter → offer                      | `vault/motion/offer-arrival` (Web Animations API)                            | `one-navigation.e2e.ts`                                       |
| `offer-fixings` (§13.3)            | Offer page                           | `vault/blocks/offer-boundaries` (`fixings`)                                  | `bab-offer.e2e.ts`                                            |
| `promise-stamp` (§13.6)            | `/id/metode`                         | `vault/blocks/promise-stamp` (`stamp`)                                       | `network-promise.e2e.ts`                                      |
| `situation-leader` (§13.8)         | Home                                 | `vault/blocks/situation-links` (`leader`)                                    | `situation-leader.e2e.ts`                                     |
| `three-unit-splice` (§13.5)        | `/id/layanan`, home                  | `vault/blocks/unit-sequence` (`splice`, `level`)                             | `three-unit-splice.e2e.ts`, `home-sequence.e2e.ts`            |
| `address-copy` (§13.7)             | `/id/kontak`                         | `vault/blocks/copy-address` (`stamp`)                                        | `address-copy.e2e.ts`, parked by `test.fixme` until K5        |
| `set-depth` (§13.10)               | Any Arthur page → another            | `vault/motion/page-transition`, `components/ui/link`                         | `set-depth.e2e.ts`, `motion.e2e.ts`, `one-navigation.e2e.ts`  |
| Back and Forward panel (§13.11)    | History navigation                   | `vault/motion/page-transition`, `lib/motion/use-history-navigation.ts`       | `journey.e2e.ts`, `set-depth.e2e.ts`, `one-navigation.e2e.ts` |
| The curtain                        | First page of a session              | `vault/motion/curtain`                                                       | `entrance.e2e.ts`, `one-navigation.e2e.ts`                    |
| Unit dialects (§12.1)              | Unit, side, situation and work pages | `lib/styles/css/dialects.css`, `vault/motion/dialect.ts`                     | `unit-dialects.e2e.ts`, `lib/styles/scripts/dialects.test.ts` |

---

## 0. Three categories, and which rules govern each

Everything in this document was written for two: transitions in CSS, and
timelines in GSAP. A third has been shipping since Tahap 33 and had no entry
anywhere — so four live mechanisms were governed by nothing, and §9.5's budget
could not say whether they counted.

| Category                | Band                  | Counted by §9.5?                                      | Governed by |
| ----------------------- | --------------------- | ----------------------------------------------------- | ----------- |
| **Micro / standard**    | 150–600ms (§2)        | no                                                    | §1–§5       |
| **Choreographed**       | 800–1200ms (§2)       | **yes** — at most two per page, each named in the DOM | §9.5        |
| **Continuous response** | none — it has no band | **no**                                                | §11         |

**What makes the third a category rather than three exceptions.** §9.5 already
excused the material layer with a reason — _"no band, no beginning and no end…
a reader meets it rather than watches it happen"_ — and Tahap 40 excused
`project-spine` with the same one. Three identical exemptions are not
exemptions; they are a category nobody had named. The spec did not need
breaking, it needed to admit what it had already practised three times.

### 0.1 What is in it, recorded late

All four were shipping before this section existed:

| Mechanism           | Where                                                      | Since    |
| ------------------- | ---------------------------------------------------------- | -------- |
| `--scroll-velocity` | `components/layout/lenis`, published every frame           | Tahap 33 |
| Plate parallax      | `vault/motion/parallax`                                    | Tahap 33 |
| The custom cursor   | `vault/primitives/cursor`, a permanent per-frame transform | the fork |
| Web Animations API  | `vault/motion/flip` (`catalogue-sift`), palette rows       | Tahap 39 |

`vault/blocks/project-spine` and `vault/webgl/material-image` belong here too;
their exclusions in §9.5 and §11 are this category, written before it had a
name.

**Added in Tahap 43**, and recorded when they shipped rather than nine stages
later:

| Mechanism             | Where                                              | Since    |
| --------------------- | -------------------------------------------------- | -------- |
| `constellation-drift` | `vault/blocks/project-grid`, per-column `distance` | Tahap 43 |
| The cursor's payload  | `vault/primitives/cursor`, `data-cursor-label`     | Tahap 43 |

Neither is counted by §9.5, and both satisfy §0.2 below. `constellation-drift`
is the existing parallax given a different `distance` per column — no new
mechanism, no second signal, and the reader registers the _difference_ between
the columns rather than either travel. The cursor's payload changes only
`opacity` and `transform` on a `aria-hidden` element whose text is required to
exist in the DOM as well, which `e2e/exploratory-layer.e2e.ts` holds.

**Added in Tahap 47–53**, and this table is now the record of them rather than
a reconstruction:

| Mechanism          | Where                                                            | Since            |
| ------------------ | ---------------------------------------------------------------- | ---------------- |
| `grid-pattern`     | `vault/blocks/hero`, `vault/blocks/passage`, `/work` masthead    | Tahap 47, 49, 51 |
| `dot-pattern`      | `/studio` ground, `/practice/<v>` ground                         | Tahap 47, 50, 52 |
| `noise-texture`    | `vault/blocks/hero` over the WebGL wash; site-wide under `Theme` | Tahap 47, 49, 53 |
| `reading-progress` | `vault/motion/reading-progress` on the three long pages          | Tahap 52         |
| The header's edge  | `components/layout/header`, one masked `backdrop-filter` layer   | Tahap 53         |

The first three declare **no duration and no easing at all** — they are
surfaces, and the reason they belong in this category is that they never move,
not that their movement was reclassified. `vendor-rules.test.ts` holds that
line for the whole of `vault/magic/`.

`reading-progress` is the one with a scroll linkage, and it is here for the
same test that excludes `project-spine`: no beginning, no band, no end. Under
reduced motion it is removed rather than frozen.

The header's edge moves nothing whatsoever; it is listed because it replaced a
`border-bottom`, and a reader looking for where the hairline went should find
the answer in the same place as everything else.

**One grain, and it took three copies to notice.** The grain shipped in the
home hero (Tahap 49) and on `/studio` (Tahap 50) before Tahap 53 put it under
`Theme` for the whole site. The hero keeps its own — not a duplicate, because
it sits over the WebGL wash, which is drawn above every negative `z-index` and
is therefore the one surface the site-wide layer cannot reach. `/studio`'s copy
was removed.

**Added in Tahap 80–81**, and it is the existing parallax rather than a new
mechanism — the same relationship `constellation-drift` has to it:

| Mechanism        | Where                                                   | Since    |
| ---------------- | ------------------------------------------------------- | -------- |
| Named planes     | `vault/motion/parallax` — `PARALLAX_PLANES`, four rungs | Tahap 80 |
| `journal-covers` | `app/[locale]/journal` row covers, on `subject`         | Tahap 81 |

Not counted by §9.5, for the reason this whole section exists: parallax has no
band, no beginning and no end. What Tahap 80 added is a **ladder** — the four
distances were already on screen, tuned one block at a time, and naming them is
what keeps two layers on one page related rather than merely both moving.

Tahap 81 spent it once, and refused it five times. `/journal`'s covers were the
only layer on the site that is media, travels with the page, and had no depth;
every other route's media is served by `project-card` or `project-gallery`,
which have carried it since Tahap 33 and 56. The refusals are recorded in
`docs/stages/TAHAP-81.md` §4.1a, and one of them belongs here rather than only
there: **the `/work` masthead's `grid-pattern` was proposed for a plane and
declined on this section's own words.** The sentence below — that these surfaces
belong to this category because they never move, _not_ because their movement
was reclassified — was written to refuse exactly that, and no gate enforces it.
A written decision no gate holds is only as strong as the next reading of it.

**What §0.2 refused in the same stage.** Tahap 43 planned `type-pressure` —
Syne's variable `wght` axis driven by `--scroll-velocity`. Measured on the
real header: across the proposed 640-760 range the wordmark grew from 42.61px
to 57.61px and the header's `<nav>` moved **10 pixels**; on the home page's
`<h1>`, weight 760 added a line and grew the heading from 204px to 306px. A
weight axis is neither `transform` nor `opacity`, and those two numbers are
why that rule exists. It was dropped rather than granted an exemption —
`docs/stages/TAHAP-43.md` §2.

### 0.2 Its rules are stricter, precisely because it never stops

A choreographed moment is over in a second. These run for the whole visit, so:

1. **`transform` and `opacity` only.** No exceptions — `CLAUDE.md` #4 with no
   room to argue, because a layout-triggering property here costs on every
   frame rather than once.
2. **Never on prose.** The parallax preset's own instruction, and what Tahap
   23 was right about. `e2e/continuous-motion.e2e.ts` enforces it.
3. **Never on an element `<ViewTransition>` photographs.** Tahap 33's lesson:
   the browser measures one box and animates another.
4. **Dead under `prefers-reduced-motion`** — switched off, not slowed down.
   Slowing a thing that never ends produces a thing that never ends.
5. **The signal must already exist.** `--scroll-velocity`, a ScrollTrigger, an
   IntersectionObserver, or the browser's own animation timeline. **Never a
   second `requestAnimationFrame` loop** (`CLAUDE.md` #6) — desynchronised
   loops produce jitter that reads as cheap even at 60fps.
6. **It is not counted, and that is not a loophole.** A page may not answer a
   full §9.5 budget by moving its motion into this category. What decides the
   category is whether the movement has a beginning and an end, not whether
   the budget is full.

---

## 1. Easing — pick from tokens, never author a curve

All curves live in `lib/styles/css/easings.css` as Tailwind v4 `@theme`
tokens, so `--ease-*` custom properties and `ease-*` utilities both work.

**Never write a raw `cubic-bezier()` in a component. Never use bare
`ease`, `ease-in-out`, or `linear` for meaningful motion.**

They are also re-exported with their GSAP equivalents from
`vault/motion/tokens.ts`, so a tween and a CSS transition can be written
against the same named curve.

### The four you will actually use

| Token                 | Curve                    | Use for                                           | Measured on                                         |
| --------------------- | ------------------------ | ------------------------------------------------- | --------------------------------------------------- |
| `--ease-out-quart`    | `(0.165, 0.84, 0.44, 1)` | **default for entrances**, reveals, most UI       | Minh Pham (60×), Iventions                          |
| `--ease-out-expo`     | `(0.19, 1, 0.22, 1)`     | large/hero moves, dramatic settle                 | Lando Norris                                        |
| `--ease-gleasing`     | `(0.4, 0, 0, 1)`         | darkroom's house curve; scroll-linked, transforms | Lusion (exact + 64× near-variants), basement.studio |
| `--ease-in-out-quart` | `(0.77, 0, 0.175, 1)`    | only when an element leaves **and returns**       | By-Kin                                              |

### Rules

- **Out-easing by default.** Elements arrive fast and settle slow. Almost
  every curve measured ends in `…,1)`.
- **In-easing only for exits** — something leaving toward the viewer's
  attention, never for an entrance.
- **In-out only for round trips.** A modal that opens and closes along the
  same path. Using in-out as a general default is the amateur tell.
- `linear` is correct for exactly two things: continuous marquees and
  progress indicators. Nothing else.

---

## 2. Duration — three bands, one default

| Band              | Range       | Default     | Applies to                                         |
| ----------------- | ----------- | ----------- | -------------------------------------------------- |
| **Micro**         | 150–250 ms  | **200 ms**  | hover, focus ring, colour change, small toggles    |
| **Standard**      | 300–600 ms  | **400 ms**  | element enter/exit, text reveal, menu open         |
| **Choreographed** | 800–1200 ms | **1000 ms** | page transition, hero sequence, full-viewport move |

**400 ms is the default.** It is the most-declared duration across the
measured sites (Lusion 40×, Minh Pham 39×, Iventions 21×).

**Never 300 ms as a global default.** It is the generic value that ships in
UI kits, and it is the reason a site reads as templated.

**Scale duration with distance and size.** A 24px nudge at 1000 ms feels
broken; a full-viewport panel at 200 ms feels cheap. Larger travel → longer
duration, within the band.

---

## 3. Stagger — the highest-value cheap trick

A group of elements animating in unison reads as one flat block. The same
group staggered reads as choreography. This is the biggest perceived-quality
gain per line of code in the whole spec.

| Context                    | Stagger      | Notes                                          |
| -------------------------- | ------------ | ---------------------------------------------- |
| Words / lines in a heading | **40–60 ms** | 50 ms default                                  |
| Characters                 | 15–25 ms     | only for short display text; never a paragraph |
| Cards in a grid            | 60–80 ms     | cap total at ~600 ms                           |
| Nav items                  | 40 ms        |                                                |
| List rows                  | 30–50 ms     |                                                |

**Cap the total.** `stagger × count` must not exceed ~600 ms for UI or
~900 ms for a hero. Twenty cards at 80 ms is 1.6s of waiting — that is not
elegance, it is latency. Use GSAP's `stagger: { each, from, amount }` and
prefer `amount` (total time) over `each` for large sets, so the total stays
fixed as the count grows.

---

## 4. What to animate

**Animate only `transform` and `opacity`.** These are the two properties the
compositor handles without layout or paint.

| Never animate                   | Use instead                                |
| ------------------------------- | ------------------------------------------ |
| `width` / `height`              | `transform: scale()`, or a clip-path       |
| `top`/`left`/`right`/`bottom`   | `transform: translate3d()`                 |
| `margin` / `padding`            | wrapper + transform                        |
| `box-shadow`                    | animate opacity of a shadow pseudo-element |
| `filter: blur()` on large areas | pre-rendered, or accept the cost knowingly |

`will-change` is a **last resort**, applied immediately before the animation
and removed after. Leaving it on permanently costs memory on every element
that carries it and can degrade the whole page.

---

## 5. `prefers-reduced-motion` — mandatory, no exceptions

Seven of ten measured award sites ship **zero** reduced-motion handling.
This project treats that as a defect to avoid, not a norm to copy.

**Reduced motion does not mean "no animation".** It means: no large
translation, no parallax, no scroll-hijacking, no spin or scale-from-zero,
no autoplaying loops. Opacity fades are generally fine and preserve the sense
that something changed.

### The contract every vault component honours

- Reads the preference at runtime, and **reacts to changes** (the user can
  flip it mid-session).
- Under reduced motion: content is **immediately visible and complete** —
  never left at `opacity: 0` because an animation was skipped. This is the
  bug that turns an accessibility feature into a blank page.
- WebGL scenes drop to a static frame or unmount entirely.
- Lenis smooth scroll is disabled; native scrolling takes over.

### CSS baseline

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

This is a safety net, not a substitute for handling it in the component —
a JS-driven GSAP timeline ignores it entirely.

---

## 6. Scroll

**Lenis is the only smooth-scroll implementation.** It is already wired at
`components/layout/lenis`. Do not add a second scroll library, and do not
hand-roll scroll smoothing.

**Lenis, GSAP and Tempus must share one RAF loop.** This is the single most
common way a site built from good parts still feels cheap: two independent
`requestAnimationFrame` loops produce a subtle desynchronisation between
scroll position and scroll-driven animation that reads as jitter even at a
solid 60fps. Tempus exists specifically to solve this. The correct wiring is
in `vault/motion/` with the reasoning written out.

**ScrollTrigger rules**

- `scrub: true` for position-linked motion; a number (e.g. `scrub: 0.5`) adds
  smoothing lag and usually feels better on large moves.
- Never scrub anything that triggers layout.
- Prefer `once: true` for entrance reveals — replaying on every scroll-back
  is noise.
- Always `kill()` triggers on unmount. Leaked ScrollTriggers are the standard
  memory-leak-and-jank source in React + GSAP projects.

---

## 7. Page transitions

**This section describes what ships.** It used to describe an intention, and
the two had drifted — Tahap 42 measured `vault/motion/page-transition` against
it and corrected the document rather than the code, because the code was
right.

What `page-transition.module.css` actually declares:

| Phase                      | Duration                   | Curve              |
| -------------------------- | -------------------------- | ------------------ |
| Cover, on a link press     | `--duration-fast` (200ms)  | `--ease-out-quart` |
| Uncover, on arrival        | `--duration` (400ms)       | `--ease-out-expo`  |
| Cover, from Back/Forward   | `--duration-micro` (150ms) | `--ease-out-quart` |
| Uncover, from Back/Forward | `--duration-fast` (200ms)  | `--ease-out-expo`  |

Faster for a navigation the reader started with the browser's own controls,
which is §9.4 rule 7.

- Never block the reader from navigating during a transition;
  `vault/motion/page-transition` carries a `maxWait` because this project has
  already had a stuck screen.
- **Under reduced motion the overlay is removed entirely** — not cross-faded.
  The document said "cross-fade only, ~200 ms" and no such cross-fade has ever
  existed. A reader who asked for no motion gets the new page, immediately.
- A navigation with a shared-element morph stands the overlay down instead:
  the two are mutually exclusive, and `lib/motion/navigation-signal.ts` is
  where that is decided.
- The transition must not delay data fetching. Overlap them.

---

## 8. Performance budget

| Metric                             | Budget                                               |
| ---------------------------------- | ---------------------------------------------------- |
| Frame time                         | ≤ 16.6 ms (60fps); ≤ 8.3 ms where 120Hz is realistic |
| Dropped frames during a transition | 0                                                    |
| Long tasks during scroll           | none > 50 ms                                         |
| CLS from animation                 | 0 — reserve space, never animate layout              |

**Honesty clause.** These are budgets, not measurements. Nothing in this
repo has been profiled on real hardware yet: the browser could not reach the
network from this environment (see `TEARDOWN.md`). Any performance claim
before `chrome-devtools-mcp` or a real profiling run is an estimate and must
be labelled as one.

---

## 9. The interaction grammar

Sections 1–8 describe **materials**: which curve, how long, how far apart,
what may move. None of them says what a **moment** is made of. A site can obey
every rule above and still feel like a document, because the curves are right
and nothing ever answers a press.

This section is the missing half. It was added in Tahap 12 after one command
made the gap concrete:

```bash
grep -rn ":active" --include=*.css app components vault lib
# → 0
```

Zero. Eighteen stylesheets used `:hover`; not one element in the site changed
when it was pressed. Between "I touched this" and "a new page appeared", the
site was silent.

### 9.1 One sentence, five nouns

Every pressable thing — a project card, the hero's call to action, a
discipline chip, a nav item, the contact address — moves through the **same**
sequence:

```
REST ──▶ INTENT ──▶ COMMIT ──▶ TRANSPORT ──▶ SETTLE ──▶ REST′
         hover      press       release       arrival
         focus      Enter       navigate      assembled
```

| State         | Band (§2)     | Token                      | Curve              | What happens                                               |
| ------------- | ------------- | -------------------------- | ------------------ | ---------------------------------------------------------- |
| **REST**      | —             | —                          | —                  | The rendered state. This is what ships without JavaScript. |
| **INTENT**    | micro         | `--duration-fast` (200ms)  | `--ease-out-quart` | The element declares itself alive.                         |
| **COMMIT**    | micro         | `--duration-micro` (150ms) | `--ease-out-quart` | **Anticipation** — a compression before the release.       |
| **TRANSPORT** | standard      | `--duration` (400ms)       | `--ease-out-expo`  | The pressed element becomes the stage.                     |
| **SETTLE**    | choreographed | `--duration-slow` (800ms)  | `--ease-out-expo`  | The destination assembles around what arrived.             |

Five separate effects would be five things to keep consistent. One sentence
with five nouns is one thing — the same restraint this project already applies
to colour and type.

The tokens live in `vault/motion/tokens.ts` as `interaction`, with the CSS
custom property and the GSAP value side by side. `vault/motion/tokens.test.ts`
asserts they agree, that every duration sits inside a band, and that the
sequence escalates (COMMIT shortest; SETTLE longest).

### 9.2 COMMIT is the state that matters

Anticipation is most of what separates game animation from a web transition.
Without a beat of compression before the release, a movement reads as
**announced** rather than **done**.

It is one beat, not a move: 150ms, the floor of the micro band. The plan for
Tahap 12 called for ~120ms; that would have been the first duration in this
project outside a declared band, which is exactly the ad-hoc drift the bands
exist to prevent. Against `out-quart` most of the movement lands in the first
60ms, so 150ms reads as immediate anyway.

**Write COMMIT in CSS, with `:active`.** It fires for Enter and Space on a
link or a button as well as for a pointer, which makes rule 3 below free
rather than something to remember. A `pointerdown` handler would be a second
state machine to keep in step with the first — the same shape of mistake as a
second RAF loop (§6).

### 9.3 Overshoot, rejected on the record

`ui-ux-pro-max` recommends `back.out(1.4)` and `elastic.out(1, 0.4)` for
interactions at this tier. Both are rejected, for two reasons that each stand
alone: they are raw curves, which rule #1 forbids in a component, and a bounce
is the wrong register for this site — rejected for the same reason in Tahap
11c. Settling happens through `--ease-out-expo`.

### 9.4 Seven rules that are not taste

These are not binding because this document says so — this document is a
reference. They hold for three other reasons, and it is worth knowing which is
which. **1–4** restate rules that bind from `CLAUDE.md` (#5 and #7) or protect
a reader directly: a stuck screen, a moment no keyboard can reach, content
stranded invisible, a page that does nothing without JavaScript. **6** is not a
preference at all — React strips a `view-transition-name` from an element
outside the viewport at commit, so the platform decides it. **5** and **7**
were kept through the fork on measured legibility, not on taste.

The count was wrong too: the heading said five and the list has seven.

1. **Interruptible, with a defined resolution.** A double click, or Back
   pressed mid-TRANSPORT, must never leave a stuck screen. This is a failure
   mode this project has already had; `vault/motion/page-transition` carries a
   `maxWait` because of it.
2. **Reachable by keyboard.** `:focus-visible` is INTENT, Enter and Space are
   COMMIT. A moment reachable only by cursor is not grammar, it is decoration.
3. **Reduced motion changes the duration, not the outcome.** States still
   change; the transitions become instant. Content always ends up correct.
4. **REST is the rendered state.** With JavaScript off, REST is what shows.
   The whole grammar is additive — which is what keeps the no-JS gate green.
5. **One shared-element morph per navigation.** More than one pair is not
   legible and is very hard to time.
6. **A morph requires the destination to open at the top.** This is not a
   preference, it is the condition React imposes: a `<ViewTransition>` is only
   given a `view-transition-name` when the element it wraps is **inside the
   viewport** at commit time, and the name is stripped again when it is not
   (`applyViewTransitionToHostInstancesRecursive` returns whether any host
   instance is in view; its caller restores the name otherwise). So a link that
   carries the reader's scroll offset into the next page silently downgrades
   every morph on the site to a cross-fade — `::view-transition-old(name)` with
   no group and no `new` half.

   Measured in Tahap 15b: `components/ui/link` had shipped `scroll={false}`
   since the fork, so pressing a practice from the home page at scroll 3520
   opened its page at 1522 with the heading 1136px above the fold. Both the
   landing and the morph were fixed by the same one-line change.
   `e2e/navigation-landing.e2e.ts` holds the cause; `e2e/motion.e2e.ts` holds
   the effect, now from a link far down the page as well as one near the top.

7. **A navigation the reader starts with the browser's own controls is dressed
   too, and faster.** Back and forward press no link, fire no `onNavigate`, and
   until Tahap 16a ran **no transition at all** — measured, zero
   pseudo-elements, the overlay never leaving `idle`. The reader got
   choreography one way and a jump-cut the other.

   They get the cover, never a morph: the destination is restored to a scroll
   position of its own, so the paired element may sit anywhere including
   outside the viewport, where rule 6 says the name is dropped. Promising a
   morph that silently degrades to a cross-fade is the defect Tahap 15b just
   removed.

   And it is quicker — 150ms + 200ms against a link's 200ms + 400ms. That
   asymmetry is the one piece of guidance `ui-ux-pro-max` carries about
   travelling backwards: _"exit should always resolve faster than entrance
   (asymmetric timing) so back/forward feels snappy"_. Its database says
   nothing at all about whether a back navigation should move, and
   `docs/stages/TAHAP-16.md` §2.4 records that rather than dressing a default
   as research.

   The signal comes from the Navigation API, not `popstate`: by the time a
   `popstate` listener here runs, the router has already committed and React
   has already re-rendered, so intent cannot be recovered. `navigate` fires
   before the commit and marks a hash press with `hashChange`, which is what
   keeps an in-page anchor from being swept by a full-viewport panel.

### 9.5 The epic-moment budget

> **Retired in the fork (`docs/FORK.md`).** No gate caps the moments on a
> route, no gate requires a long movement to be named, and
> `e2e/epic-sequence.e2e.ts` — the overlap rule quoted below — is deleted.
> `e2e/interaction-grammar.e2e.ts` prints each route's named moments and its
> unnamed long moves on every run: a report, not a ceiling. Naming a moment
> with `data-epic` is still worth doing — it is how that report says which
> moment did what — and reduced motion is still enforced, separately.
> Everything below is the history of how the budget worked.

Award sites do not make everything epic. They make **one or two** things epic
and keep everything else quiet.

**At most two choreographed-band movements per page, and every one is named.**

### The ceiling is twelve on four routes — widened in Tahap 60

> **Read this first; the section below it is the history that led here.**
>
> ARTH is an **agency**. The restraint this document spent forty stages
> building was scaffolding for two capabilities — a design system on long
> context and compact layout, and UI/UX precise enough to be re-themed — and
> both now exist. What the site is _for_ changed: stunning animation is the
> hook that brings a client in, not an indulgence to be rationed.
>
> So the count went from three to **twelve** on `/`, `/studio`, `/work` and
> `/practice/<value>`; to **six** on `/journal` and `/work/<slug>`; and to
> **three** on `/journal/<slug>`, which stays the tightest surface on the
> site. Holding back in one place is what makes the spending elsewhere read
> as a choice rather than a default.
>
> **The count is no longer the instrument.** §9.5 exists because a page where
> everything is epic has nothing epic — and on a short page, capping the
> number was a crude way to get there. On a page with a 110svh hero and a
> 300vh pinned passage it is the wrong instrument entirely: such a page can
> hold many moments **in sequence** without any two competing, and a count
> cannot tell the difference. The real invariant now lives in
> `e2e/epic-sequence.e2e.ts`:
>
> > Two moments with **different names**, neither **nested** inside the
> > other, may not occupy the same scroll range.
>
> Stricter about quality, far looser about quantity. Two exemptions in it are
> measured rather than assumed — a moment marked once per card is one moment
> rendered many times, and a per-item moment inside a list-level one is
> composition — and a moment's range is its **pin spacer** when GSAP made one,
> because a pinned passage owns 3150px of scroll while its box reports 900.
>
> **What did not move (in Tahap 60):** every movement past the standard band
> still had to sit inside a _named_ `[data-epic]`, and that assertion in
> `e2e/interaction-grammar.e2e.ts` was untouched then. The fork turned it into
> a report. Naming is the discipline;
> the number is only a tripwire now. Nor did the height of anything become a
> matter for this budget — **no gate limits the height of a hero or a
> section**, and Tahap 60 verified that across all 39 e2e files before
> writing a line.

### History — the ceiling was three on four routes, amended in Tahap 49, extended in 52

`/`, `/studio`, `/work` and `/practice/<value>` are allowed a **third**. Every
other route keeps two.

**Why an amendment rather than a reclassification.** The movement that forced
this — `arth-passage`, a pinned scrubbed sequence on the home page — has a
beginning, a resolution and an end. That is the definition of the
choreographed band. §0 gives a third category that this budget does not count,
and moving the passage there would have been the cheaper answer: no amendment,
no argument, nothing to defend. It would also have been a lie about what the
movement is. Calling a journey "continuous response" to slip it past the
budget is precisely the accounting §9.5 exists to prevent, and the first time
this document allows that, the budget stops meaning anything.

**Why four routes and not seven.** These are the surfaces that carry the
studio's image rather than its information: the home page, the studio page,
the catalogue, and a practice's own page. A ceiling that rises everywhere is
not a ceiling, and the three routes left at two are left there on purpose.

**And the fourth is an accounting correction, not a purchase.** Tahap 52
marked the two moments this table had listed for `/practice/<value>` since
Tahap 15 — neither had ever appeared in the DOM — and the gate then reported
**three**: `practice-morph`, `practice-statement`, `work-transport`. The third
is the card carrying itself into a project page, which `ProjectCard` brings
wherever it renders; the same defect Tahap 50 found on `/studio`. Every one of
the three ships today and shipped before the amendment. What changed is
whether this budget describes the site or contradicts it — and a budget that
contradicts the site is not a budget, it is a wish.

**A correction to this section's own text.** It used to say
`/journal/<slug>` "keeps its deliberate zero", in the same document whose
table gives it one and whose next page explains, at length, why Tahap 41 took
it from zero to one. Tahap 52 removed the sentence rather than the moment.
The restraint it was defending is real and still holds — that page has **no
scroll-linked motion of any kind** — but the claim as written was false.

**What a third moment costs, stated.** Two named moments per page was not an
arbitrary number: it is what the ten measured award sites do, and it is the
difference between a site with one thing to remember and a site that animates
everything. A third is a real spend, not a free slot, and a route at three has
nothing left. `/` is now at three.

The list, kept current as routes are added. A page missing from it has no
choreographed movement, and that is a legitimate answer — the journal _entry_
page is deliberately on this list at zero (`docs/stages/TAHAP-27.md` §5).

| Page                | Moments                                                                                                                                                                                                                                                                                                                                                               | Added                 |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| `/`                 | 1. **hero arrival** — once per load<br>2. **card → project page** — TRANSPORT plus SETTLE in full<br>3. **`arth-passage`** — the studio's own grid sharpening under the work's title, pinned and scrubbed; the way the work arrives                                                                                                                                   | Tahap 12e, 49         |
| `/practice/<value>` | 1. **`practice-morph`** — the home page's practice name becoming the hero<br>2. **`practice-statement`** — the scrubbed passage, `ProgressText`<br>3. **`practice-capabilities`** — what the practice covers, held while four statements pass; this route's first pin<br>4. **`work-transport`** — the practice's own work carrying into its project pages            | Tahap 15, 52, 65      |
| `/studio`           | 1. **`studio-statement`** — the scrubbed passage<br>2. **`studio-process`** — the held index<br>3. **`work-transport`** — the evidence strip's cards carrying into their project pages                                                                                                                                                                                | Tahap 24, 25, 50      |
| `/journal`          | 1. **`journal-index`** — the row being read leads<br>2. **`journal-transport`** — the headline chosen carries itself into the entry, spent on navigation rather than at load. Both marked in the DOM since Tahap 52                                                                                                                                                   | Tahap 27, 41, 52      |
| `/journal/<slug>`   | 1. **`journal-transport`** — the receiving half: the headline lands, then the prose settles under it. Marked in the DOM since Tahap 52                                                                                                                                                                                                                                | Tahap 26, 41, 52      |
| `/work`             | 1. **card → project page** — the same transition, `ProjectGrid` renders here too<br>2. **`catalogue-sift`** — the list rearranging under a filter                                                                                                                                                                                                                     | Tahap 11d, 39         |
| `/work/<slug>`      | 1. **`project-arrival`** — the receiving half of that transition, via `transitionName`. Marked in the DOM since Tahap 40; the name is older<br>2. **`project-chapters`** — the engagement's arc held while problem, journey and solution pass, via `StepSequence`. Renders only when an editor has written `chapters`; a project without them reads exactly as before | Tahap 11d, 19, 40, 79 |

Everything else is micro or standard. A filter chip does not get 1200ms —
and `catalogue-sift` is not the chip. The chip's own acknowledgment is the
200ms INTENT treatment every pressable noun gets under §9; the moment is what
the **grid** does afterwards, which is a movement with a start, a resolution
and an end, and therefore exactly what this budget counts.

`/` and `/studio` are at three and are full. **`/work` is at two of its three,
and the free slot is free for a measured reason** — Tahap 51 built
`catalogue-descent` for it and could not ship it: the descent and
`catalogue-sift` both want this grid's transforms, and isolating them (removing
the descent made the sift's gate pass again) showed the conflict is real rather
than a tuning problem. The sift is the filter's own feedback and outranks an
entrance. `docs/stages/TAHAP-51.md` §5 carries the measurement.

**`/studio`'s third was already there, and nobody had counted it.** Tahap 44
put an evidence strip of `ProjectCard`s on that page, and the card carries
`work-transport` wherever it renders. Measured in Tahap 50, the route declared
that name three times and **neither** of the two this table had listed for it
since Tahap 25 — the markers were never added at all. Both are named now, and
the strip is listed above. A budget nobody can count is not a budget, and this
one went uncounted for twenty-six stages.

**A page's heading arriving is not one of the two, and Tahap 40 is where that
was settled.** `vault/motion/text-reveal` ran at `duration.slow` — 800ms, the
choreographed band — on every `<h1>` on the site. The budget never saw it
because the sampler only ever ran on `/en`; widening it to all seven pages
turned **five** of them red on the same element, each page's own title.

The fix was not five new names. Award sites make one or two things epic and
keep everything else quiet, and a movement that happens identically on seven
pages is a default, not a moment. `TextReveal` takes a `pace` prop now:
`arrival` (400ms, the standard band) is the default every masthead gets, and
`epic` (800ms) is spent only where the heading arriving **is** the named
moment — the home hero and the project hero, both of which this table already
listed and both of which sit inside a `data-epic`.

**The spine is not counted either.** `vault/blocks/project-spine` responds to
reading position continuously: it has no band, no beginning and no end, which
is the same test that excludes the material layer below. `/work/<slug>` still
has one moment and one slot spare.

**`/journal/<slug>` went from zero to one in Tahap 41, and the amendment is
written here rather than made quietly.** Tahap 26 put it on this table at
_none, deliberately_ — it is a long read — and that decision was right about
what it was about: motion **during** reading. It never meant the page should
arrive with nothing. Arrival is not scroll-band motion and does not lengthen
the read, which is the identical reasoning `/work/<slug>` has carried since
Tahap 11d. The entry still has no scroll-linked motion of any kind, and its
`h1` is no longer split at all — so the page is _quieter_ while it is being
read than it was before this moment was added.

**Its duration is 400ms, not the choreographed band, and that is deliberate.**
`lib/styles/css/global.css` sets every `.morph` pair on this site to
`var(--duration)`, and the reason is in that file: 400ms is where the
`ui-ux-pro-max` morph guidance lands — "slow enough to register but fast
enough to feel direct". A journal morph three times longer than the work and
practice morphs would buy a consumer for `--duration-choreographed` at the
cost of the one standard `CLAUDE.md` closes on, restraint applied
_consistently_. The moment reaches the choreographed band by its **span** —
the morph, then the prose settling behind it at `--stagger-items` — which is
what this section counts: movement that starts, resolves, and is over.
`--duration-choreographed` therefore still has no consumer, and
`docs/stages/TAHAP-41.md` §2.1 records that as a decision rather than an
oversight.

**The material layer is not counted here, and this is where that is decided.**
`vault/webgl/material-image` renders on the home page beside the two moments
above, which would read as a third. It is not a choreographed-band movement:
it has no band, no beginning and no end — it is a continuous response to
pointer and scroll that is _always_ running while the plate is on screen, and
§11 governs it. A reader meets it rather than watches it happen. The budget in
this section counts movements that start, resolve, and are over.

---

## 10. Review checklist

Before any motion work is considered done:

- [ ] Every duration comes from a band in §2 — no ad-hoc values
- [ ] Every curve is an `--ease-*` token — no raw `cubic-bezier()`
- [ ] Only `transform` / `opacity` animated
- [ ] Reduced motion tested, and content is fully visible under it
- [ ] ScrollTriggers and GSAP contexts cleaned up on unmount
- [ ] Stagger total ≤ 600 ms (UI) / 900 ms (hero)
- [ ] No second RAF loop introduced
- [ ] Keyboard focus order unaffected by the animation
- [ ] Every pressable element answers a press — §9 COMMIT, not just `:hover`
- [ ] Every moment is reachable with Tab and Enter, not only with a cursor
- [ ] No more than two choreographed-band movements on the page, and both named
- [ ] Interrupting mid-TRANSPORT (double click, Back) leaves nothing stuck
- [ ] No DOM element is hidden because a mesh is _assumed_ to have replaced it — §11.2
- [ ] A mesh standing in for content hands it back at COMMIT — §11.3
- [ ] No `data-reveal-item` sits on an element that carries `data-press` — §11.4
- [ ] Every `data-press` noun is reachable without opening a disclosure — §11.4

---

## 11. The material layer

`vault/webgl/material-image`, added in Tahap 14a. This section exists because
the layer breaks two assumptions the rest of this document makes, and both
break silently.

### 11.1 When an image may become a mesh

Only when all four hold:

1. The route has decided to pay for three.js. Three do today: home, `/work`
   and a project page. `e2e/route-budget.e2e.ts` reports what each route
   loads; since the fork it reports rather than forbids, so the decision is
   the route's, written where it is made.
2. There is a **non-WebGL path that is the same design**, not a placeholder.
   For the work plates that path is the plain `<img>` — the thing that
   shipped in Tahap 12a — which is why this was a safe place to start.
3. The engine is fetched **inside an effect**, never at module scope. A
   static import puts three.js in the page graph and Next emits it as a
   parser-initiated script, downloaded by phones and by reduced-motion
   visitors who then see the fallback. Measured at 245.6 KB gzip.
4. The page stays usable and readable without it (`CLAUDE.md` #14; the
   "3D is an accent" rule, #13, was retired in the fork and kept only this
   half).

### 11.2 Never hide the DOM element on the assumption that a mesh replaced it

This is the rule the stage was written to earn.

Standing in a mesh for an `<img>` means hiding the `<img>`. Every DOM-shaped
check then passes whether or not a single pixel is drawn: the wrapper is
there, the attribute is there, the image is correctly at `opacity: 0`. Tahap
14a shipped that arrangement twice with four blank rectangles on the home
page, a green build, a green typecheck, a green lint, and every existing gate
passing — once because a full-viewport background quad was writing depth over
the plates, once because the mesh was placed from Lenis' _eased_ scroll
instead of the document's real one and sat 660px off screen.

So the contract is inverted: **the scene reports the first frame it could
have been drawn in — texture bound, rect measured, matrix written — and only
then may the DOM element be hidden.** A material that fails to draw is then a
no-op, not a missing work.

Two corollaries, both learned the same way:

- A background mesh scaled to the viewport declares itself one:
  `renderOrder={-1}` and `depthWrite={false}`. Otherwise it occludes every
  DOM-anchored mesh, which all sit at `z = 0` with it.
- A DOM-anchored mesh computes its placement **every frame** from
  `window.scrollY`, not from a scroll event and not from a smooth-scroll
  library's animated value. `lib/webgl/hooks/use-webgl-rect.ts` recomputes
  only on an event, which is enough for a page scrolled by a wheel and not in
  general.

### 11.3 The material stands down at COMMIT

A `<ViewTransition>` photographs real DOM. While a mesh is drawing, the
`<img>` behind it is at `opacity: 0`, so a morph that started in that state
would carry an empty box to the destination.

The fix is the grammar in §9, not a special case. The material lives in
**REST** and **INTENT**; at **COMMIT** it hands the surface back, before the
navigation, so **TRANSPORT** morphs real pixels. Both COMMIT paths raise it —
`pointerdown` and `keydown` for Enter or Space — because a keyboard user
reaches TRANSPORT without ever producing a pointer event.

### 11.4 A reveal marker never goes on a pressable noun

Added in Tahap 14b, and it is a cascade rule rather than a WebGL one.

`[data-reveal] [data-reveal-item]` in `global.css` sets a `transition`
shorthand, and a shorthand **replaces** an element's own rather than joining
it. Marked directly on the contact address, the reveal's 400ms silently
overwrote that link's 150ms COMMIT; `e2e/interaction-grammar.e2e.ts` measured
it as `email/commit: 400ms`, outside the micro band. Mark the container, never
the control.

**Fixed in F4-01's follow-up (6 November 2026).** F4-01 found one place
that broke this: `vault/blocks/next-practice`, the next-unit link at the foot
of every unit page, carried `data-reveal-item` on the link itself, which is
also `data-press`, so the reveal's shorthand replaced the link's own 150ms
COMMIT with the reveal's 400ms. The marker now sits on a plain wrapper inside
the `<aside>`, which is the reveal's container, and the link keeps its own
transition. `e2e/next-practice.e2e.ts` holds it on every unit page: the link
is not a reveal item, and once the reveal has arrived a press compresses it on
`transform` at `--duration-micro`. The unit dialects (§12.1) still leave
`[data-press]` items out of their retiming, so a pressable item that slips
through is never slowed further by a unit's tempo.

The same section adds the other half: **a noun marked `data-press` must be
reachable at rest.** A control that only exists once a disclosure is opened is
not hoverable, not focusable, and has no computed transition — so it cannot
answer the grammar, and marking it there makes the gate report a silent noun
whose CSS is perfect. In `vault/blocks/practice-list` the `<summary>` is the
marked noun, because opening a practice is the interaction the block adds; the
link inside the panel is ordinary navigation.

---

## 12. Arthur's motion language

Arthur treats motion as a working drawing built in front of the reader. A
working drawing turns intent into something that can be built; here, each
movement points to something being measured, joined, fixed, or stamped. It is
a plan, not proof: motion must not imply a result, client, quantity, or
capability that the page does not state. The same grammar serves all three
units, with a different lead and tempo for each; the movement itself carries
one piece of information.

The meanings below are the Arthur vocabulary for the existing motion
primitives. Use a primitive only for the meaning recorded here. They describe
design intent, not new components or permission to change the reader
protections in `CLAUDE.md`.

| Primitive                       | Working-drawing meaning                                     | Meaning in Arthur                                                             | Intended use                                      |
| ------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------- |
| `datum`                         | A fixed reference line from which other things are measured | The umbrella statement is the reference; the three units are measured from it | Home, hero                                        |
| `dimension`                     | A measurement line drawn before its number is read          | Scope is set before work: what is included, and where it ends                 | Offer scope; how-we-work page                     |
| `formwork`                      | Formwork is removed and the cast result stands on its own   | An offer leaves the catalogue and stands as a complete offer                  | Chapter, offer card                               |
| `fixings`                       | A plate is fixed at its four corners once it is in place    | Boundaries and terms are fixed and do not drift                               | Offer boundaries and terms                        |
| `stamp`                         | A stamp lands after something is checked or agreed          | What is agreed is written down before work begins                             | How we work; copy-address control                 |
| `splice`                        | Two bars are joined with a plate                            | A bridge between units                                                        | One client, three units; bridge block             |
| `brace`                         | A diagonal member steadies a frame                          | The system that keeps a business steady                                       | Technology unit                                   |
| `bearing`                       | A load lands on a beam, compresses it briefly, then rests   | A client's problem is carried by the right unit                               | Construction unit; unit entry                     |
| `level`                         | A beam becomes level when its supports arrive               | Work is complete when all its parts are in place                              | Completed step sequence                           |
| `plumb`                         | A plumb line follows the reader downward                    | Long-form writing stays upright and readable                                  | How we work; policies                             |
| `leader`                        | A line connects a note to the thing it describes            | A note points to the part being discussed                                     | Home situation-to-unit link; offer audience label |
| `tally`                         | Tally marks are counted in groups of five                   | A visible, real quantity, such as the number of published offers in a chapter | Side and chapter; real counts only                |
| `crop-marks`                    | Marks at the corners of a sheet show its crop               | The sheet currently selected                                                  | Offer card when highlighted                       |
| `crosshair` and `cover-preview` | A point is read from the grid edge                          | An offer is located in the chapter by its table and type                      | Side                                              |
| `entry-arrow`                   | An arrow marks an entrance on a plan                        | The point where the reader enters by following a link                         | Linked-to offer block                             |
| `north-arrow`                   | An arrow gives orientation                                  | A way back when the reader is lost                                            | 404 page                                          |
| `route-marker`                  | A marker identifies the sheet currently held                | The reader's position in the set                                              | Header; side switcher                             |

The plan also assigns the existing mechanisms these roles: `text-reveal`
makes a buyer's statement readable word by word; `horizontal` carries a row
sideways; `flip` filters cards; `page-transition` exchanges sheets; `curtain`
opens the set once per session; and `reading-progress` marks how far the
reader has read. These descriptions do not authorize invented buyer quotes,
claims, counters, or client marks.

**Where they are used, as built (F4-01, 6 November 2026).** "Intended use"
above is the brief. Where the code differs, this is what a reader meets today:

- On a route as intended: `dimension` (offer scope, `/metode`, `/work`'s
  measure), `formwork` (chapter cards), `fixings` (offer boundaries), `stamp`
  (`/metode`, the network side, the copy control), `splice` and `level`
  (`unit-sequence` on `/layanan` and home), `plumb` (`/metode`, the network
  side), `leader` (home's situations), `crosshair` and `cover-preview` (the
  side table, and `/work`'s catalogue), `route-marker` (header, side switcher),
  `north-arrow` (the wayfinder).
- On a route, but not the one intended: `bearing` frames `/work`'s catalogue,
  not the Konstruksi unit; `brace` steadies `/work/<slug>`'s engagements, not
  the Teknologi unit; `crop-marks` marks `/work`'s project cards, not offer
  cards; `entry-arrow` sits in the step sequences and the project spine, not a
  linked-to offer block. Konstruksi's dialect still lends every unit page
  `bearing`'s gesture (§12.1).
- On no route: `datum` (its blocks, `unit-doors` and `engagement-writing`,
  have no caller), `tally` (`practice-tally` has none), and `leader`'s offer
  audience label (`offer-audience` has none). They are kept, typechecked and
  ready, not shown.

### 12.1 Unit dialects

The grammar and tokens stay shared. Only the leading primitive and tempo vary;
the palette stays monochrome so the units are distinguished by motion and
working-drawing marks, not by colour.

| Unit       | Character           | Leading primitives                                     | Tempo                                                                                         | Avoid                               |
| ---------- | ------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------- | ----------------------------------- |
| Konstruksi | Weighty and precise | `bearing`, `formwork`, `level`, `fixings`, `dimension` | Long settle, 800–1200 ms with `ease-out-expo`; one object moves at a time                     | Light, floating movement            |
| Teknologi  | Sequenced           | `brace`, `dimension`, `step-sequence`, `leader`        | Short ordered steps, 150–200 ms each with `ease-out-quart`; the sequence reveals the workflow | Simultaneous movement without order |
| Peekabo    | Lively              | `text-reveal`, `horizontal`, `parallax`, `crop-marks`  | Scroll-linked with `ease-gleasing`, responsive to scroll velocity; rows travel sideways       | Overshoot and countdowns            |

The dialect is a parameter in one token file, not a separate component per
unit. The home page, One client / three units, and How we work use the base
grammar because they belong to Arthur, not to one unit; Kebijakan has no
dialect (§13.9).

**Built in F4-02 (5 November 2026).** The token file is
`lib/styles/css/dialects.css`. A unit route passes its unit to
`<Wrapper dialect>`, which writes `data-dialect` on `<main>`: the unit, side,
situation and work pages do, and no other page does. The base grammar is the
absence of a dialect, and every reader names its base value as a fallback
(`var(--dialect-settle, var(--duration))`), so a page outside a unit is
unchanged by construction. It sits on `<main>` and not on the document,
because the header and footer are Arthur's on every page.

Each dialect sets four parameters. The travel is the leading primitive's
gesture, lent to the shared arrivals:

| Parameter          | Sets                                                                | Konstruksi                            | Teknologi                  | Peekabo                                                   |
| ------------------ | ------------------------------------------------------------------- | ------------------------------------- | -------------------------- | --------------------------------------------------------- |
| `--dialect-settle` | How long one object takes to arrive or settle                       | 1000ms                                | 200ms                      | 400ms                                                     |
| `--dialect-ease`   | The curve of every arrival and settle                               | `ease-out-expo`                       | `ease-out-quart`           | `ease-gleasing`                                           |
| `--dialect-step`   | The interval between successive objects, and between a mark's beats | 400ms: expo is 95% home by then       | 200ms, equal to the settle | 40ms: one ripple, not a countdown                         |
| `--dialect-travel` | Where an arriving object comes from                                 | from above, half a gutter (`bearing`) | a quarter-gutter step      | sideways, 2 to 4 gutters with scroll speed (`horizontal`) |

What reads them:

- the shared reveal contract, retimed inside a dialect by `dialects.css`, so
  `global.css` is unchanged; a block's own `--reveal-transform` still wins
  over the unit's travel (`network-side` keeps its steps on the plumb line);
- `unit-method` and `side-buying-path`, and the entry arrow;
- `practice-statement`'s per-word curve, through `vault/motion/dialect.ts`,
  which maps the computed curve back to its GSAP name;
- `bab-formwork`, `bab-sift` (`flip` reads its tokens from the grid, which can
  see `<main>`), `offer-fixings`, the offer measure (`dimension`) and the
  offer plate's placing;
- `network-money-flow`'s scroll-linked branches;
- `side-sheet-swap`'s TRANSPORT and SETTLE, which run on the Web Animations
  API on the live sheets inside `<main>` and read the unit's settle and curve
  from the sheet's computed style (§13.1);
- `offer-arrival`'s card lift and title settle, the same way (§13.11, F4-03).

What does not: REST, INTENT and COMMIT, the press grammar of §9. Hover, focus
and press answer the reader's hand the same way on every page, so pressable
nouns (`data-press`), the route marker and the side table's crosshair keep
their shared beats. So does a sift's stagger, because it answers the reader's
own press. Two choices keep a card's rule where the dialect would bend it: a
fixing never waits less than its own beat, so §13.3's one at a time holds in
every dialect; and Peekabo's arrivals are timed rather than scrubbed, because
prose that moved with the scroll would drift against its column
(`e2e/continuous-motion.e2e.ts`). Only decoration is scroll-linked.

Under reduced motion every dialect collapses at the source: no travel, no
step, and an instant settle. `lib/styles/scripts/dialects.test.ts` holds the
file to the table at the head of this section, and `e2e/unit-dialects.e2e.ts`
measures `unit-method` and the reveal contract on the three unit pages, the
absence of any dialect on the base pages, and the reduced-motion end state;
`e2e/side-sheet-swap.e2e.ts` runs the sheet exchange on every unit.

## 13. Arthur moment cards

F1-08 wrote these cards as a brief, before any of them was built. They are
built now (R6, F4-02, F4-03), all but §13.7, which waits on a real contact
channel (K5). Each card's table states what is built; its notes record how,
when and why, and which e2e proves it. The base timings in the tables are the
base grammar: on a unit's pages a moment runs at that unit's tempo (§12.1).
The `data-epic` names are observability labels for the interaction-grammar
report, and every moment a card names carries its own (§13.9 names none);
`set-depth` and `offer-arrival` took theirs in F4-01's follow-up (§13.10,
§13.11). The page named by each card keeps its complete static state;
reduced motion changes the transition, never whether the information is
available. `CLAUDE.md`'s hard reader protections continue to apply.

### 13.1 Lembar ditukar — sheet exchange (F3-03)

| Field               | Specification                                                                                                                                                                                                                                                                                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `data-epic`         | `side-sheet-swap`                                                                                                                                                                                                                                                                                                                                                  |
| Trigger             | The reader activates the side switch, an ordinary link to the other side route.                                                                                                                                                                                                                                                                                    |
| Sequence and timing | INTENT 200 ms (`ease-out-quart`): the switch marker begins to move. TRANSPORT 400 ms (`ease-in-out-quart`): the old sheet lifts and fades. SETTLE 800 ms (`ease-out-expo`): the new sheet's title block settles. On a side page TRANSPORT and SETTLE run at the unit's settle and curve (§12.1); INTENT keeps its beat. Web Animations API, not a view transition. |
| Pinning             | None.                                                                                                                                                                                                                                                                                                                                                              |
| Touch               | Same sequence, triggered by a tap.                                                                                                                                                                                                                                                                                                                                 |
| Without JavaScript  | The link navigates normally.                                                                                                                                                                                                                                                                                                                                       |
| Reduced motion      | The new sheet appears immediately and focus moves to its page title.                                                                                                                                                                                                                                                                                               |
| Verification        | `e2e/side-sheet-swap.e2e.ts` (both halves, focus, a late page, each unit's tempo, reduced motion); `e2e/one-navigation.e2e.ts` (a double click); `e2e/side-page.e2e.ts` (without JavaScript).                                                                                                                                                                      |

**Built in R6 (5 November 2026), without a view transition.** INTENT is
the switcher's `RouteMarker` with `previews`, 200ms `ease-out-quart`. Both
links to the other side, the switcher's and the one at the sheet's foot
(§13.11), use the `morph` intent, so the page overlay stands aside.
TRANSPORT and SETTLE run on the Web Animations API, from
`app/[locale]/[unit]/[side]/side-switcher.tsx`. The press lifts and fades
every block under the switcher (400ms `ease-in-out-quart`), and the new
sheet's title block rises into place as it arrives (800ms `ease-out-expo`,
`transform` only).

**Why not a view transition.** Three CI runs on the first attempt (#66,
then #70) showed that a press makes one view transition, which carries
its type but changes nothing. The commit that actually swaps the sheets
starts none, because React starts one only for transition, retry and idle
lanes, and that commit runs in another.

**Behaviour at the edges.**

- The lift is cut short when Next hides the old sheet, which is the
  exchange landing.
- A late page never leaves the lifted sheet invisible: if the old sheet
  is still on screen when the lift ends, it plays back and waits,
  readable.
- The new title takes focus in both motion modes.
- Reduced motion moves nothing.

**At the unit's tempo (F4-02).** A side page belongs to one unit, so
TRANSPORT and SETTLE both run on that unit's settle and curve (§12.1): 1000ms
`ease-out-expo` on Konstruksi, 200ms `ease-out-quart` on Teknologi, 400ms
`ease-gleasing` on Peekabo. They are read from the sheet's computed style,
because `data-dialect` is on `<main>`. The 400ms and 800ms above are the
fallbacks, the base grammar. INTENT and the focus hand-over keep their shared
beat.

Covered by `e2e/side-sheet-swap.e2e.ts`.

### 13.2 Kartu dari bekisting — card from formwork (F3-04)

| Field               | Specification                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-epic`         | `bab-formwork` for arrival; `bab-sift` for filtering.                                                                                                                                                                                                                                                                                                                                                                                                |
| Trigger             | A card enters through the reveal contract; the reader activates a market filter.                                                                                                                                                                                                                                                                                                                                                                     |
| Sequence and timing | Cards arrive in reading order through the reveal contract; each card's form is struck as the card lands, a step after its neighbour's. Filtering moves the cards that stay with FLIP, `--stagger-cards` apart. All of it at the chapter's unit's tempo (§12.1): on Konstruksi a 1000 ms `ease-out-expo` settle, 400 ms between cards, and a 1000 ms sift. Outside a unit, the base: form struck 800 ms after its card, sift 400 ms `ease-out-quart`. |
| Pinning             | None.                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Touch               | Same behavior.                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Without JavaScript  | All cards are visible without formwork; the filter is not shown.                                                                                                                                                                                                                                                                                                                                                                                     |
| Reduced motion      | Cards appear without formwork; filtering updates results immediately.                                                                                                                                                                                                                                                                                                                                                                                |
| Verification        | `e2e/bab-offer.e2e.ts` (forms struck, the sift on the page's settle, reduced motion, without JavaScript); the chapter fixtures in route-sweep, `no-javascript` and `motion`.                                                                                                                                                                                                                                                                         |

**Built in R6 (5 November 2026).** `bab-formwork` did not run before this:
the chapter grid reveals per item, its container stays `hidden`, and
`Formwork` was keyed on the container alone, so every card kept its form
(measured on production, opacity 1 on all seven). The form is now asked of
the item too, stands a quarter gutter outside the card in `--line-strong`
so it reads as a frame of its own, and is struck 800ms after its card
arrives. `bab-sift` passes `SIFT_MOVE` to `useFlipGrid`: 400ms
`ease-out-quart` for the cards that stay, `--stagger-cards` apart; the
catalogue on `/work` keeps its 800ms default. The market chips are
`data-press="chip"`, with an inked edge as INTENT for a pointer and a
keyboard alike. Covered by `e2e/bab-offer.e2e.ts`.

### 13.3 Batas dipaku — boundaries fixed (F3-05)

| Field               | Specification                                                                                                                                                                                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-epic`         | `offer-fixings`                                                                                                                                                                                                                                                |
| Trigger             | The boundaries-and-terms block enters view.                                                                                                                                                                                                                    |
| Sequence and timing | Once the plate has settled, the four corner marks go in clockwise, one at a time, a step apart and never less than a fixing's own 200 ms, on the unit's curve (§12.1). On Konstruksi: 1000, 1400, 1800 and 2200 ms. Outside a unit: 400, 600, 800 and 1000 ms. |
| Pinning             | None.                                                                                                                                                                                                                                                          |
| Touch               | Same behavior.                                                                                                                                                                                                                                                 |
| Without JavaScript  | The block and marks are present in their final state.                                                                                                                                                                                                          |
| Reduced motion      | The corner marks are already in place.                                                                                                                                                                                                                         |
| Verification        | `e2e/bab-offer.e2e.ts` (one at a time, all fixed, reduced motion, without JavaScript).                                                                                                                                                                         |

**Built in R6 (5 November 2026).** The four fixings are set one at a time:
each waits for the one before it to be driven home (delays 400, 600, 800
and 1000ms, 200ms each), and each turns upright from an eighth of a turn
into its cross as it grows. They are a gutter wide and drawn in the text's
own ink, where they were three quarters of a gutter in `--line-strong`.
Like `Formwork`, the hidden state is asked of the plate as well as its
container. Covered by `e2e/bab-offer.e2e.ts`.

### 13.4 Alur uang empat langkah — four-step money flow (F3-06)

| Field               | Specification                                                                                                                                                                                                                                   |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-epic`         | `network-money-flow`                                                                                                                                                                                                                            |
| Trigger             | The reader scrolls through the referrer-path section.                                                                                                                                                                                           |
| Sequence and timing | A leader line follows scroll using a CSS view timeline, like `plumb`, with no JavaScript loop. Each step branches off it, node then branch, on its own view timeline, eased on Peekabo's gleasing (§12.1). Stamp each step when it enters view. |
| Pinning             | None; all four steps remain vertically ordered at every width.                                                                                                                                                                                  |
| Touch               | Same behavior.                                                                                                                                                                                                                                  |
| Without JavaScript  | The four steps, complete line, and stamps are visible (the CSS still draws the line as the reader scrolls).                                                                                                                                     |
| Reduced motion      | Same final state as without JavaScript.                                                                                                                                                                                                         |
| Content boundary    | No numbers, rates, or income simulation.                                                                                                                                                                                                        |
| Verification        | `e2e/network-promise.e2e.ts` (the line follows, every step branches, the prose never moves, reduced motion, without JavaScript).                                                                                                                |

**Built in R6 (5 November 2026).** The plumb line on `/id/peekabo/jaringan`
is the flow's leader, drawn in the text's ink (`--plumb-ink`), where it was
a 28% hairline. Its tip follows the bottom of the screen, so as it passes a
step's middle the step branches off it: a node lands on the line and a
branch runs out to the step, on each step's own view timeline
(`--money-step`, `entry 50%` to `entry 100%`). The stamp "Tahap n" is in
ink at a stamp's slant (`rotate`, so its strike keeps it). The words never
move. Without a script the CSS still draws it as the reader scrolls;
reduced motion shows it finished. Covered by `e2e/network-promise.e2e.ts`,
which also checks the step prose for the transform `continuous-motion`
looks for on `/work`.

### 13.5 Tiga batang disambung — three units joined (F3-07)

| Field               | Specification                                                                                                                                                                                                                          |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-epic`         | `three-unit-splice`                                                                                                                                                                                                                    |
| Trigger             | Each of the three unit steps enters the reading line.                                                                                                                                                                                  |
| Sequence and timing | Each step settles through the reveal contract; `splice` then joins it to the following unit. `level` settles after all three steps are in place.                                                                                       |
| Pinning             | None; the three steps remain an ordinary ordered list.                                                                                                                                                                                 |
| Touch               | Same scroll order, with vertical joints between cards.                                                                                                                                                                                 |
| Without JavaScript  | All three steps, both joints, and the level line are present in their final state.                                                                                                                                                     |
| Reduced motion      | Same final state as without JavaScript.                                                                                                                                                                                                |
| Content boundary    | The page labels the sequence as possible, never as a completed client project; every unit and offer must remain renderable through its approval gate.                                                                                  |
| Verification        | `e2e/three-unit-splice.e2e.ts` on `/id/layanan`: each joint stays open until its step arrives, its plate after its halves, the level last and level; reduced motion is final at once. `e2e/home-sequence.e2e.ts` checks home's markup. |

**As built (F4-01, 6 November 2026).** `vault/blocks/unit-sequence` draws it,
on `/id/layanan` and in home's Kafe baru sequence: each step settles through
the reveal contract, `splice` joins it to the next, and `level` settles once
all three stand. Both pages are Arthur's, so it runs in the base grammar.

### 13.6 Janji dicap — promises stamped (F3-08)

| Field               | Specification                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| `data-epic`         | `promise-stamp`                                                                                  |
| Trigger             | Each written promise enters view.                                                                |
| Sequence and timing | Use the `stamp` primitive's default timing, once per promise; do not replay when scrolling back. |
| Pinning             | None.                                                                                            |
| Touch               | Same behavior.                                                                                   |
| Without JavaScript  | The stamp is already visible.                                                                    |
| Reduced motion      | The stamp is already visible.                                                                    |
| Verification        | `e2e/network-promise.e2e.ts` (one strike, no replay, reduced motion, without JavaScript).        |

**Built in R6 (5 November 2026).** The block (`vault/blocks/promise-stamp`)
and its place on `/id/metode` already shipped in F3: each promise is a
per-item reveal, and its "Tertulis" stamp strikes once on the primitive's
own timing when the row arrives, never again on the way back. R6 sets the
stamp in the text's ink at a stamp's slant, where it was a muted label, and
adds the verification: `e2e/network-promise.e2e.ts` checks the single
strike, no replay, and the reduced-motion and no-JavaScript states.

### 13.7 Alamat nyata disalin — real address copied (F3-09)

| Field               | Specification                                                                                                                                                           |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-epic`         | `address-copy`, inherited from the shared copy control.                                                                                                                 |
| Trigger             | The reader copies a real, active email address.                                                                                                                         |
| Sequence and timing | The copy result receives the existing 350 ms `stamp`; the surrounding About and Contact page uses only the ordinary reveal contract.                                    |
| Pinning             | None.                                                                                                                                                                   |
| Touch               | Same button and status result.                                                                                                                                          |
| Without JavaScript  | The real address remains a selectable link; the copy control is absent.                                                                                                 |
| Reduced motion      | The copied state appears immediately.                                                                                                                                   |
| Content boundary    | A reserved-domain email or example street address is plain review text with a NOTE, never a link or copy action. No contact form exists before the security review.     |
| Verification        | `e2e/address-copy.e2e.ts` is written (the copy and its status, the control's absence without JavaScript) and parked with `test.fixme` until K5 supplies a real channel. |

**Not built yet (F4-01, 6 November 2026).** The control exists in
`vault/blocks/copy-address`, but the contact page's address is still a
placeholder (K5), so by this card's own content boundary it is not a copy
action yet. Nothing to change until K5 is decided.

### 13.8 Situasi menunjuk unit — situation points to a unit (F3-01)

| Field               | Specification                                                                                                                                |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-epic`         | `situation-leader`                                                                                                                           |
| Trigger             | Wide screens: hover or keyboard focus on a situation. Touch screens and viewports below 800 px: draw the line as the situation enters view.  |
| Sequence and timing | INTENT 200 ms (`ease-out-quart`), using the `leader` primitive.                                                                              |
| Pinning             | None.                                                                                                                                        |
| Without JavaScript  | Each situation is a link whose text names its destination unit.                                                                              |
| Reduced motion      | Do not draw the line; keep the destination unit named in text.                                                                               |
| Verification        | `e2e/situation-leader.e2e.ts` (the line, the phone's draw on arrival, reduced motion); the interaction-grammar sweep checks keyboard INTENT. |

**Built in R6 (5 November 2026).** On the home page's "Pilih situasi" the
leader has a grid track of its own between the situation and its unit, so
the line runs from one to the other. Its intent beat is 200ms in all: the
drop a quarter, the run three fifths, the dot the rest, and the unit is
inked as the dot lands. Leaving a row takes the line up in a micro beat.
The row no longer dims on hover. Each row is `data-press="situation"`, so
the interaction grammar's sweep checks its press and its keyboard INTENT;
`e2e/situation-leader.e2e.ts` checks the line itself, the phone's draw on
arrival, and reduced motion drawing none.

### 13.9 Kebijakan dibaca tenang (F3-10)

Halaman Kebijakan tidak memiliki momen gerak khusus. Dokumen hukum
dibaca sebagai lembar tenang: tidak ada pin, scrub, WebGL, entrance bertingkat,
atau transisi isi. Navigasi ke dan dari halaman ini memakai `set-depth` global
(§13.10), seperti halaman Arthur lain. Biayanya adalah halaman ini tidak
menunjukkan dialek gerak unit (§12.1: Kebijakan tidak memasang `dialect`);
manfaatnya, status peninjauan dan isi kebijakan tidak diperlakukan seperti
materi promosi.

### 13.10 Masuk lebih dalam ke set — enter deeper into the set (F4-03)

| Field               | Specification                                                                                                                                                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `data-epic`         | `set-depth`, on the overlay that draws the circle (`vault/motion/page-transition`), so the interaction-grammar report lists it. It is also the link's view-transition type (`DEPTH_TYPE`) and the root's `data-depth` state.         |
| Trigger             | Navigation between Arthur pages that have no dedicated transition in the navigation table.                                                                                                                                           |
| Sequence and timing | COMMIT 150 ms: the link is pressed. TRANSPORT 400 ms: a detail-circle expands from the link (`ease-in-out-quart`). SETTLE 800 ms: the destination title settles (`ease-out-expo`).                                                   |
| Back navigation     | Use a faster closing panel (150 + 200 ms), not a shrinking morph, per §9.4 rule 7: restored scroll position can put the paired element outside the viewport.                                                                         |
| Interruption        | A new navigation cancels the old transition and resolves directly to the new destination's final state.                                                                                                                              |
| Without JavaScript  | Ordinary navigation.                                                                                                                                                                                                                 |
| Reduced motion      | The page changes without a transition.                                                                                                                                                                                               |
| Verification        | `e2e/set-depth.e2e.ts` (the circle, the held snapshot and React's cancellation of it, Back's panel, a double press); `e2e/one-navigation.e2e.ts` (rapid Back and Forward); `instant-navigation` and `navigation-landing` stay green. |

**Built in R6 (1 November 2026).** `vault/motion/page-transition` draws it:
a ring round the press (COMMIT, `--duration-micro`), a circle in the pressed
link's `--color-secondary` opening to the farthest corner (TRANSPORT,
`--duration`, `ease-in-out-quart`), then a fade while the destination `h1`
settles by `transform` only (SETTLE, `--duration-slow`, `ease-out-expo`).
`<Link>` now defaults to the `depth` intent. Because a prefetched route
commits about 50ms after the press, the old page is held as a
view-transition snapshot until the circle has closed: the link navigates
with the `set-depth` transition type, a keyed `<ViewTransition>` mark in the
overlay activates for it, and `global.css` keys the hold on the root's
`data-depth` attribute. Navigation itself is never delayed. Back and Forward
keep the faster panel. Covered by `e2e/set-depth.e2e.ts`.

**Fixed 5 November 2026 (#71).** The hold never held in production. The
commit a press starts moves the URL and re-keys the mark, and changes
nothing outside a `<ViewTransition>`, so React cancelled the transition's
root: it set `view-transition-name: none` on `<html>`, hid
`::view-transition-group(root)` with a script animation and shrank
`::view-transition`. The swap then showed under a circle that had barely
opened. A strengthened `e2e/set-depth.e2e.ts` caught it (run
42044019856): it reads the transition's animations at `ready` and fails
on React's cancellation. React leaves the root alone when `<html>`
already names it inline, so the press now sets `view-transition-name:
root` (the browser's own name for it), and the release takes it off with
`data-depth`. It stays a view transition because only a snapshot can
hold the old page while the new one commits; the circle, its timings and
the settle are unchanged.

### 13.11 Navigation precedence

One activation starts exactly one transition. When more than one could apply,
use this precedence. Card 7 replaces the legacy per-route `work-transport`
and `journal-transport` transitions, except for the first three specific
pairs in this table. Its detail circle is the working-drawing mark that
references another sheet.

| From                                            | To                            | Transition                                                                                     |
| ----------------------------------------------- | ----------------------------- | ---------------------------------------------------------------------------------------------- |
| Home                                            | Unit                          | `practice-morph`: the unit name travels from its doorway.                                      |
| Side                                            | Another side in the same unit | Card 1, `side-sheet-swap`.                                                                     |
| Chapter                                         | Offer                         | `offer-arrival`, derived from `project-arrival` without a photo.                               |
| Any Arthur page                                 | Another Arthur page           | Card 7, `set-depth`, unless a more specific row above applies.                                 |
| Browser Back or Forward                         | The prior or next page        | A faster closing panel (150 + 200 ms), not a morph; the first-session curtain does not replay. |
| A new destination while a transition is running | The newly requested page      | Cancel the old transition and resolve directly to the new destination's final state.           |

The Back/Forward choice follows §9.4 rule 7: restored scroll position can put
the paired shared element outside the viewport. With JavaScript disabled, all
these links remain ordinary navigation.

**Built in F4-03 (6 November 2026).** Every row of the table now has its
transition. `offer-arrival` was the one missing (`vault/motion/offer-arrival`):
a chapter card's link to its offer navigates with the `morph` intent, so the
overlay stands aside and `set-depth` draws no circle, and the press lifts the
card out of the list (TRANSPORT) while the offer's title block rises into place
on arrival (SETTLE, `transform` only) and takes focus. It is derived from
`project-arrival` without the photo, and it runs on the Web Animations API, as
`side-sheet-swap` does, because a chapter and its offers are one route and a
view transition does not start inside one route (§13.1). Both halves take the
unit's settle and curve (§12.1), with 400ms `ease-in-out-quart` and 800ms
`ease-out-expo` as the fallbacks. `/work`'s `project-arrival` is unchanged.
Reduced motion moves nothing; without a script the link is a link.

`e2e/one-navigation.e2e.ts` proves what was not yet proved: a card press runs
`offer-arrival` and nothing else, a double click on the side switcher and rapid
Back and Forward each end at rest (no root attribute, overlay or faded block
left behind), and the curtain carries `Arthur` and runs once a session.
`set-depth.e2e.ts` and `motion.e2e.ts` already cover the circle, a double press
and Back mid-transition.

**As built, row by row (F4-01, 6 November 2026).** `practice-morph` is a
shared `<ViewTransition>`: home's unit list (`vault/blocks/practice-list`)
names each unit `morph-practice-<unit>`, and the unit page's nameplate
(`vault/blocks/unit-hero`) takes the same name, so the browser moves it
(`motion.e2e.ts`). `side-sheet-swap` and `offer-arrival` run on the Web
Animations API (§13.1). `set-depth` is the default of `<Link>`. Back and
Forward take the closing panel from `lib/motion/use-history-navigation.ts`.
`offer-arrival`'s halves are named by their animation ids
(`offer-arrival-lift`, `offer-arrival-settle`), which the e2e reads. Since
F4-01's follow-up the moment also carries `data-epic`, on what it moves: each
chapter card that has an offer page (the card the press lifts) and the offer
page's head (the block that settles). `set-depth` carries it on its overlay
(§13.10). `e2e/interaction-grammar.e2e.ts` asserts that the report lists both
on a chapter page and on an offer page.

The cards are subordinate to the navigation precedence defined by the Arthur
project context. If an implementation needs a value or behavior that conflicts
with a hard rule, pause and report both statements; do not resolve the conflict
by silently changing either this design brief or the hard rule.
