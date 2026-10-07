## Summary

<!-- Brief description of what this PR does -->

## Changes

-

## Local gates

<!-- docs/PROSEDUR-KERJA.md §3 step 2. Paste each command's result. -->

- [ ] `bun --version` prints `1.3.5`
- [ ] `bun run check` passes (oxlint + oxfmt + type-aware lint + tsc + unit tests + assets)
- [ ] `bun run build` passes — required when `app/`, `lib/`, `components/`, `vault/`, `proxy.ts` or `next.config.ts` changed

## Risk and rollback

<!-- What could break in production, and how to back it out (Vercel Instant Rollback, or a revert PR). -->

## Checklist

- [ ] No `[skip ci]` on any commit in this PR
- [ ] No breaking changes (or documented in summary)
- [ ] If this changes documented behaviour, the docs that state it changed in the same diff (README, `docs/`, JSDoc)
