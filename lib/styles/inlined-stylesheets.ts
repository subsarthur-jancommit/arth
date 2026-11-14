/**
 * The stylesheets a page already carries inline, declared to React as
 * present, so that no prefetch downloads them again.
 *
 * Provenance: original work for this project. No third-party code copied.
 *
 * ## The defect this exists for
 *
 * `experimental.inlineCss` (#80, `next.config.ts`) puts each page's CSS in
 * one `<style data-precedence data-href="a.css b.css …">`. React's stylesheet
 * dedupe never reads that element: `ReactDOM.preload(href, { as: 'style' })`
 * skips a file only when a `link[rel="preload"][as="style"]` or a
 * `link[rel="stylesheet"]` with that `href` exists, and so does the
 * stylesheet resource a navigation renders (`react-dom-client`, `preload`
 * and `getResource`). When the router prefetched a linked route that shares
 * those files, React preloaded them as missing and the browser downloaded
 * CSS the page had already applied. Measured in CI on `/en/work`: five of six
 * inlined files, 1.9 s after navigation, each answered by Chrome's
 * "preloaded using link preload but not used" (`e2e/stylesheet-preload.e2e.ts`).
 * Next documents that navigated-to pages get their CSS through `<link>` tags
 * under `inlineCss`, and no option turns that off.
 *
 * ## How
 *
 * During document parse, after the inline styles in `<head>`, one disabled
 * `<link rel="stylesheet">` is added for each inlined file. A disabled
 * stylesheet link is never fetched, and its rules are already applied by the
 * inline style. React then finds the `<link>` it looks for: `preload()` skips
 * the file, and a navigation adopts it as an already-loaded stylesheet
 * (`state.loading = 5`) instead of inserting one, so nothing waits on it and
 * nothing is downloaded. A file the page does not carry inline is untouched,
 * and still prefetched and loaded as before.
 *
 * `script-src` carries `'unsafe-inline'` as the documented base policy
 * (`lib/integrations/csp.ts`), as for the curtain's session guard
 * (`vault/motion/curtain`), so this adds no new exposure.
 */
export const INLINED_STYLESHEETS_SCRIPT =
  "(function(){var seen={},links=document.querySelectorAll('link[rel=\"stylesheet\"][href]'),styles=document.querySelectorAll('style[data-href]'),i,j,hrefs,link;for(i=0;i<links.length;i++)seen[links[i].getAttribute('href')]=1;for(i=0;i<styles.length;i++){hrefs=(styles[i].getAttribute('data-href')||'').split(' ');for(j=0;j<hrefs.length;j++){if(!hrefs[j]||seen[hrefs[j]])continue;seen[hrefs[j]]=1;link=document.createElement('link');link.setAttribute('rel','stylesheet');link.setAttribute('disabled','');link.setAttribute('data-inlined','');link.setAttribute('href',hrefs[j]);document.head.appendChild(link)}}})()"
