/**
 * Why a test is marked `test.fixme` until the F3 revision brings its feature
 * back (`docs/RENCANA-REVISI-F3.md`; inventory in `docs/TINJAUAN-F01-F03.md`
 * E1 and E3).
 *
 * Decided by the owner on 2026-10-15, after the first e2e run on PR #18
 * failed 93 tests: a test whose feature F3 removed is marked here rather than
 * left red, so the rest of the suite can be read. Each reason names the
 * package that brings the feature back, and that package removes the mark.
 * Only tests checked to depend on the removed feature are marked; a test that
 * failed for another reason stays red.
 *
 * Fase 1 of `docs/RENCANA-KONTEKS-TAYANG.md` restored `main`'s home
 * composition (passage, work grid on the material, practice list), so the
 * marks for those features are gone and their tests run again.
 */
export const REMOVED_IN_F3 = {
  studio:
    'F3-08 replaced the studio process with a Cara kerja page that awaits content and answers 404 since R0 (E3.1); re-tested in R5',
  copyAddress:
    'The copy control renders only with a real address, which waits for K5 (E1.7); returns in R5',
} as const
