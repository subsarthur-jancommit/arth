## Summary

<!-- Brief description of what this PR does -->

## Changes

-

## Gates

<!-- docs/PROSEDUR-KERJA.md §3 step 2. The gates are this PR's GitHub Actions jobs; nothing runs on the laptop. Fill in from the CI run on the head SHA once it finishes. -->

- CI run: #… (link), head `…`
- `ci` (`bun run build`, then `bun run check`): … — `bun test` … pass / … fail
- `e2e` (Playwright + axe): … — … passed / … skipped / … failed, or skipped (no UI-affecting changes)

## Risk and rollback

<!-- What could break in production, and how to back it out (Vercel Instant Rollback, or a revert PR). -->

## Checklist

- [ ] No `[skip ci]` on any commit in this PR
- [ ] No breaking changes (or documented in summary)
- [ ] If this changes documented behaviour, the docs that state it changed in the same diff (README, `docs/`, JSDoc)
