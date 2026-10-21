# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Read first

**This branch is a fork, and [`docs/FORK.md`](./docs/FORK.md) governs it.**
It removed the rules that constrained design and kept the ones that protect a
reader. Where anything below or in an older document disagrees with it, the
fork document wins.

**Engineering standards live in [AGENTS.md](./AGENTS.md).** React 19 /
Next.js 16 / Tailwind v4 specifics, integrations, commands.

This is **an agency site** whose motion is what brings a client in. Build it
boldly. The layer that used to decide in advance how much a page could do —
budgets, quotas, token-only vocabulary, mandatory rituals — is gone. What is
left is short, and every line of it protects a reader or keeps a claim honest.

| Document                                             | Covers                                                                                             |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [`docs/FORK.md`](./docs/FORK.md)                     | **What this fork removed, what it kept, and why.** Read this first.                                |
| [`docs/PROSEDUR-KERJA.md`](./docs/PROSEDUR-KERJA.md) | **Binding.** Branch → PR → CI → merge → production, and credentials. Read before the first commit. |
| [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md)         | Shipping it. Env vars, hosts, and the security checklist.                                          |
| [`docs/PROVENANCE.md`](./docs/PROVENANCE.md)         | Licensing. Read before copying anything.                                                           |
| [`docs/MOTION-SPEC.md`](./docs/MOTION-SPEC.md)       | How existing motion was built. Reference, not law.                                                 |
| [`docs/DESIGN-SYSTEM.md`](./docs/DESIGN-SYSTEM.md)   | The tokens that exist. A default idiom, not a requirement.                                         |
| [`docs/TEARDOWN.md`](./docs/TEARDOWN.md)             | Measured evidence from ten award sites. Inspiration, not a ceiling.                                |
| [`docs/stages/`](./docs/stages/)                     | The history of the first hundred stages. Archive; no longer added to.                              |
| [`references/`](./references/)                       | Architecture notes on code we may **not** copy.                                                    |

Two design skills are vendored at `.claude/skills/` (`ui-ux-pro-max`,
`taste-skill`). They are curated assets and they stay. **Consulting them is
optional** — the old rule that no UI could be designed before running them is
gone, and so is the rule that a decision only counted if a pattern database
already contained it.

---

## Hard rules

These protect a reader or keep a claim honest. They keep their **original
numbers** because the code cites them — `#5` alone is referenced 33 times —
so a gap in the numbering is deliberate.

### Motion

4. **Animate `transform` and `opacity`.** Animating `width`, `height`,
   `top`/`left`, `margin` or `box-shadow` forces layout on every frame, and a
   reader feels that as jank.
5. **`prefers-reduced-motion` is mandatory**, and under it content must end
   **fully visible** — never stranded at `opacity: 0` because an animation was
   skipped.
6. **One RAF loop.** Lenis, GSAP and Tempus share it. A second
   `requestAnimationFrame` loop produces jitter that reads as broken even at
   60fps.
7. **Always clean up.** `kill()` ScrollTriggers and revert GSAP contexts on
   unmount.

### Colour and layout

11. **Never silence `contrast.test.ts`.** Fix the colour, or record a
    deliberate baseline with `bun run contrast:accept`. Text contrast on the
    rendered page is also measured by `e2e/contrast-situ.e2e.ts`, whatever the
    colour was written as.
12. **Grid children use `minmax(0, 1fr)`**, never bare `1fr` — a bare `1fr`
    lets long content overflow its track.

### WebGL

14. **Always ship a non-WebGL path**, and no page may depend on WebGL to be
    usable or readable. The fallback should look intentional, not broken.
15. **Dispose geometries, materials, and textures** on unmount. Leaked GPU
    memory is the standard R3F failure, and `e2e/webgl-lifecycle.e2e.ts` checks
    that no live context is ever orphaned.

### Licensing

16. **No `LICENSE` file in the source → do not copy the code.** A public
    repository without a licence is all rights reserved. Study it, write your
    own implementation, record the distinction.
17. **Every file in `vault/` carries a provenance header** — origin, licence,
    and whether code was copied or the file is original.
18. **Verify licences by reading the source's own `LICENSE`**, never a badge,
    an article, or a search result.

### Honesty

19. **Never claim a performance number you did not measure.** Say "estimate"
    unless a profiler produced it. The container renders WebGL through
    SwiftShader with no GPU, so a WebGL frame time is a software floor, never a
    user-facing number.
20. **Never claim accessibility you did not test.** `@axe-core/playwright` is
    installed; run it.
21. **If something was skipped or failed, say so explicitly** rather than
    quietly narrowing scope.

### Merge and production

Added 2026-10-07. Every merge to `main` is live on the site within minutes, and
until the owner turns on the ruleset in its §5, nothing on GitHub stops a
broken one. The procedure, its evidence and that one-time setup are in
[`docs/PROSEDUR-KERJA.md`](./docs/PROSEDUR-KERJA.md).

22. **Nothing reaches `main` except a pull request** whose `ci` and `e2e`
    checks are green on the exact head SHA being merged. No direct push, no
    force-push, and no `[skip ci]` on a commit headed for `main`.
23. **Merge only after the owner has reviewed the protected Vercel preview**
    and the PR is current with `main`, with `ci` and `e2e` green on the exact
    head SHA being merged. No separate `ok merge #<n>` phrase is required.
    Any later commit requires both checks to pass again on the new head.
24. **Verify production after every merge** — the deployment for the merge
    SHA is READY and the smoke checks pass — and report it. Never promote, roll
    back or redeploy on Vercel; propose it to the owner.
25. **Never change GitHub, Vercel or Sanity settings, and never write to
    Sanity** outside the procedure's §6. Never print a secret's value; its name
    and "set" or "not set" are enough.
26. **The session runs Bun 1.3.5**, the `packageManager` in `package.json`. If
    `bun --version` says otherwise, stop: another Bun lays out `node_modules`
    differently and `tsc` fails.

### Retired in the fork

Kept here only so that an old citation still resolves. None of these is a
rule any more.

| #   | was                                                                                         |
| --- | ------------------------------------------------------------------------------------------- |
| 1   | no raw `cubic-bezier()` — easing only from `--ease-*` tokens                                |
| 2   | no bare `ease` / `ease-in-out`                                                              |
| 3   | "never 300 ms as a default; the default is 400 ms", and fixed duration bands                |
| 8   | no hardcoded design values — no raw hex, no `16px`, no `400ms`                              |
| 9   | semantic tokens only, never literals                                                        |
| 10  | colour authored only in `oklch()`                                                           |
| 13  | "3D is an accent", kept behind a feature flag — its reader-protecting half now lives in #14 |

---

## Working here

```bash
bun install
bun dev                # dev server
bun run build          # production build
bun run typecheck      # tsc --noEmit
bun run lint           # oxlint — warnings report, they do not fail
bun test               # unit tests
bun run test:e2e       # Playwright + axe-core (CI only — see "Melihat hasil")
bun run storybook      # component catalogue
bun run format         # oxfmt in place; also sorts imports and Tailwind classes
bun run lint:types     # type-aware oxlint (no-floating/misused-promises); not in the hook
bun run check          # lint + format check + lint:types + tsc + bun test + asset check
```

A single unit test: `bun test lib/content/units.test.ts`, or filter by name
with `bun test -t "<pattern>"`. Unit tests are `*.test.ts` beside the code
(preloaded by `lib/scripts/test-setup.ts`, happy-dom); e2e specs are
`e2e/*.e2e.ts` and only Playwright collects them. A single e2e spec, where
browsers exist: `bunx playwright test e2e/not-found.e2e.ts`. The anti-slop lint
plugin's own tests are `*.ruletest.ts`, run by `bun run test:oxlint-plugin`.

`bun run check` does **not** build; CI runs `bun run build` separately, and
`next build` does not typecheck (`ignoreBuildErrors` is on), so `tsc` in
`check` is the only type gate.

`lefthook` runs oxfmt, oxlint and typecheck on every commit, and `bun test` on
pre-push. An **error** stops the commit; a **warning** is reported and does
not. A branch switch clears `.next/types`; it regenerates on the next build.

`next dev` appends a `nextjs-agent-rules` block to `AGENTS.md`. `AGENTS.md`
itself says to revert it and never commit it.

### Architecture in one pass

- **Routing.** Every public page lives under `app/[locale]/` (`en`, `id`;
  `localePrefix: 'always'`). Indonesian is the default and the only published
  locale: the root redirects to `/id`, browser language detection is off, and
  an `/en` page without approved English answers 307 to its `/id` twin —
  except in draft mode, so Sanity can preview English fields. That list is
  `UNTRANSLATED_SEGMENTS` in `lib/i18n/public-locale-redirect.ts`; a new
  Indonesian-only route is added there in the same change. Locales are defined
  once in `lib/i18n/routing.ts`; UI strings are in `messages/{en,id}.json`
  (next-intl). `app/(chrome)/` holds what sits outside the locale tree — the
  embedded Sanity Studio at `/cms`. `app/sitemap.ts`, `robots.ts` and
  `llms.txt` are generated from the same sources.
- **`proxy.ts`** (Next 16's replacement for middleware) runs next-intl's
  locale redirect and the Markdown rewrite that serves agent-readable mirrors
  of pages. `lib/seo/alternates.ts` is the one source of canonical and
  hreflang URLs; the sitemap, the head and `/llms.txt` all derive from it.
- **Content.** Sanity is the CMS (`lib/integrations/sanity/`: schemas,
  GROQ `queries.ts`, generated `sanity.types.ts`). Every integration
  self-disables when its env vars are absent, so `lib/content/*-fallback.ts`
  supplies what renders without the CMS. Read env only through `@/lib/env`.
  `app/api/revalidate` and `app/api/draft-mode` are the webhook and preview
  entry points.
- **Motion.** Lenis, GSAP and Tempus share a single RAF (rule #6); route
  transitions and scroll velocity live in `lib/motion/`; reusable effects in
  `components/effects/`.
- **WebGL.** One root R3F canvas, mounted either in the shared layout
  (`<OptionalFeatures webgl />`, persists across navigation) or per page
  (`<Wrapper webgl>`) — never both; the store enforces a single root. Scenes
  reach it through `<WebGLTunnel>` rather than mounting their own canvas. See
  `lib/webgl/README.md`.
- **Components.** `components/ui/` (primitives — always import `Image` and
  `Link` from here, never `next/image`/`next/link` or raw `<img>`/`<a>`),
  `components/layout/` (header, footer, page wrapper), `components/effects/`.
  Imports use `@/` aliases; `../../` is a lint error.
- **Server Components by default**, React Compiler on (no `useMemo` /
  `useCallback` / `memo`), Cache Components on. Next 16 differs from training
  data — read `node_modules/next/dist/docs/` before relying on an API.

Deeper detail: `ARCHITECTURE.md`, and the `README.md` inside `app/`, `lib/`,
`lib/webgl/`, `lib/seo/` and `lib/integrations/`.

### `vault/` — what it is

`vault/` is a library of motion wiring, WebGL shells, primitives and blocks.
Every file typechecks, honours reduced motion, and carries a provenance header.
Tokens are the default idiom there, not a requirement.

### What matters here

This fork exists because the old closing line of this file was _"when in doubt,
do less"_, and the site had become careful where it was supposed to be
arresting. The measured award sites in `docs/TEARDOWN.md` are evidence of what
works, not a limit on what may be tried.

Try the bigger idea. Look at it on a real screen. Keep what earns its place,
cut what does not — and let that be judged by looking, not by a quota decided
in advance.

## Melihat hasil

The site is live at <https://arth-test-01.vercel.app>, and production is
`main`. Work is looked at there, not on a local build:

- **Per PR:** the Vercel preview for the PR (a `vercel[bot]` deployment, or its
  comment). Every preview URL sits behind Vercel's login — measured
  2026-10-07, each answers `302` to `vercel.com/sso-api` — so the owner is the
  one who opens it.
- **Production:** the URL above, public. To see which commit is live, ask the
  deployments API: `gh api repos/subsarthur-jancommit/arth/deployments`.
- **No dev server and no local e2e suite.** CI on GitHub Actions is the one
  place `bunx playwright test` runs. In the session: `bun run check`, and one
  `bun run build` when a change touches rendering (`docs/PROSEDUR-KERJA.md`
  §3). Measured in the cloud session on 2026-10-07: the build takes 66 s and
  about 4.5 GB of memory at its peak on a 15 GB machine. Nothing is left
  running.
- **Screenshots** of the live site: one headless Chromium, sequential, saved
  outside the repository.
