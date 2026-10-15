/**
 * GROQ parameters for the chapter and offer routes.
 *
 * The queries name the document being read `$slug`: the chapter's own slug on
 * a chapter page, the offer's on an offer page. The route values call them
 * `chapter` and `offer`. Spreading the route values into `params` left `$slug`
 * unset, and Sanity answers a referenced but missing parameter with a
 * `queryParseError`, which reached readers as the error page the first time a
 * chapter was published (16 October 2026). `detail-params.test.ts` checks that
 * every parameter a query references is supplied here.
 */

export interface DetailRoute {
  unit: string
  side: string
  chapter: string
  offer?: string | undefined
}

export function chapterQueryParams(route: DetailRoute, locale: string) {
  return {
    locale,
    unit: route.unit,
    side: route.side,
    slug: route.chapter,
  }
}

export function offerQueryParams(route: Required<DetailRoute>, locale: string) {
  return {
    locale,
    unit: route.unit,
    side: route.side,
    chapter: route.chapter,
    slug: route.offer,
  }
}
