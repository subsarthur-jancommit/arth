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
 */
export const REMOVED_IN_F3 = {
  plates:
    'F3-01 removed the home work grid and its WebGL plates (E1.3); drawing plates return in R4 (P2)',
  passage:
    'F3-01 removed the pinned passage (E1.2); it returns with the drawing plates in R4',
  homeWork:
    'F3-01 removed the work grid from the home page (E1.3), so home links no project; R5 rebuilds the home page',
  practiceList:
    'F3-01 replaced the practice-list disclosure with unit doors (E1.4); R5 re-points this through the doors',
  studio:
    'F3-08 replaced the studio process with a Cara kerja page that awaits content and answers 404 since R0 (E3.1); re-tested in R5',
  copyAddress:
    'The copy control renders only with a real address, which waits for K5 (E1.7); returns in R5',
} as const
