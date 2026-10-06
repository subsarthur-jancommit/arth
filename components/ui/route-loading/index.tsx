import s from './route-loading.module.css'

/**
 * The fallback a route shows while its dynamic part is still streaming.
 *
 * ## Why this is a component and not four copies of `loading.tsx`
 *
 * It used to be one `app/[locale]/loading.tsx`, which put a Suspense boundary
 * around **every** localized route — including the ones that read no request
 * data at all. The consequence was measured and much wider than the audit
 * first recorded: with JavaScript disabled, `/en`, `/id`, `/en/work` and every
 * project page rendered 28 characters — "Skip to main content Loading" — with
 * the real content sitting in the DOM inside a `<div hidden>` that only an
 * inline script reveals. The header was hidden too.
 *
 * Only routes that genuinely read request data need the boundary:
 * `work` (searchParams), and the three that read `draftMode()`. The home page
 * reads neither, so it is now prerendered whole and readable without
 * JavaScript — which is a roadmap §1.5 exit criterion that had been passing
 * only because the dataset used to be empty.
 *
 * ## A way out without JavaScript
 *
 * One route still ends here for a reader without JavaScript: the 404, and any
 * `[...slug]` URL, whose answer streams into a hole only a script can fill
 * (`e2e/site-reach.e2e.ts` records the two fixes that were tried and failed).
 * Measured on the live site on 2026-10-05, that reader got three grey bars and
 * nothing to press (`docs/HANDOFF.md` §4.8, A3). The `<noscript>` block below
 * is what they get now: one sentence in each language and the two front
 * doors. A browser running scripts never builds it.
 *
 * Both languages, because this fallback is static and knows no locale; the
 * links name their own.
 *
 * Plain anchors, not `components/ui/link`. That component reads the router's
 * pathname, and a fallback that must prerender as part of a dynamic route's
 * shell cannot: with it, the production build failed. Nothing here needs the
 * client router anyway — `<noscript>` content only exists when there is no
 * script to run one.
 *
 * ## No `<Wrapper>`
 *
 * With `cacheComponents` this must be statically renderable, and Wrapper
 * mounts `<Theme>`, which reads uncached data and fails the prerender. Keep it
 * free of anything that reads request data.
 */
export function RouteLoading() {
  return (
    <div className={s.loading}>
      {/* `<output>` carries an implicit role="status", so the role is redundant. */}
      <output aria-busy="true" className={s.status}>
        <span className="sr-only">Loading</span>
        <div className={s.bars} aria-hidden="true">
          <div className={s.bar} />
          <div className={s.bar} />
          <div className={s.bar} />
        </div>
      </output>
      <noscript>
        <div className={s.noscript}>
          <p className={s.note}>
            This page needs JavaScript to finish loading.
          </p>
          <p className={s.note} lang="id">
            Halaman ini butuh JavaScript untuk selesai dimuat.
          </p>
          <ul className={s.doors}>
            <li>
              {/* oxlint-disable-next-line react/forbid-elements, nextjs/no-html-link-for-pages -- no-JS fallback inside a prerendered shell; see the note above */}
              <a href="/en" className={s.door}>
                Arth — English
              </a>
            </li>
            <li lang="id">
              {/* oxlint-disable-next-line react/forbid-elements, nextjs/no-html-link-for-pages -- no-JS fallback inside a prerendered shell; see the note above */}
              <a href="/id" className={s.door}>
                Arth — Bahasa Indonesia
              </a>
            </li>
          </ul>
        </div>
      </noscript>
    </div>
  )
}
