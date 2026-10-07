# AI Agent Guide

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
23. **Merge only on the owner's `ok merge #<n>`**, given for that PR at its
    reported head SHA. Any later commit voids it, except a conflict-free merge
    of the latest `main`, which still needs green CI on the new head.
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
bun run test:e2e       # Playwright + axe-core
bun run storybook      # component catalogue
bun run check          # everything CI runs
```

`lefthook` runs oxfmt, oxlint and typecheck on every commit. An **error** stops
the commit; a **warning** is reported and does not.

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
