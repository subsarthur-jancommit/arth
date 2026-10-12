/**
 * Configuration for the standalone Sanity Studio — run it with
 * `bunx sanity dev` from this directory, or `bunx sanity deploy`
 * to host it at https://<project>.sanity.studio.
 */

import { CogIcon } from '@sanity/icons/Cog'
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { internationalizedArray } from 'sanity-plugin-internationalized-array'
import {
  defineDocuments,
  defineLocations,
  presentationTool,
} from 'sanity/presentation'
import type { StructureResolver } from 'sanity/structure'
import { structureTool } from 'sanity/structure'

import {
  ApproveArthurDocumentAction,
  isArthurContentType,
  PublishApprovedArthurDocumentAction,
} from './document-actions'
import { apiVersion, dataset, previewURL, projectId } from './env'
import { schema } from './schemas'

/**
 * Preview URL resolution — kept in sync with `resolveDocumentUrl` in
 * `./utils/link.ts` (this file can't import that module: it's dual-compiled
 * into the client bundle for the Studio route).
 *
 * Paths are locale-prefixed because routing is `localePrefix: 'always'` — the
 * unprefixed form only ever redirects, and Presentation's visual editing
 * breaks on a redirect. The prefix is duplicated here rather than imported
 * for the same client-bundle reason; `sanity-config.test.ts` asserts it stays
 * in step with `lib/i18n/routing.ts`.
 *
 * `PREVIEW_LOCALE` is the default locale: Presentation previews one URL per
 * document, and previewing the source language is the useful default. An
 * editor working in Indonesian can switch locale inside the previewed site.
 */
const PREVIEW_LOCALE = 'id'

// The legacy type stays registered only so existing production content can be
// recovered during the planned migration. New singleton documents are exposed
// through fixed entries below, never through a generic create list.
const SINGLETON_TYPES = new Set(['siteSettings', 'studioSettings', 'howWeWork'])
const ARTHUR_HIERARCHY_TYPES = new Set(['unit', 'side', 'bab', 'offer'])
const SUPPORTING_CONTENT_TYPES = new Set(['sequence', 'faq', 'page'])
const MANAGED_TYPES = new Set([
  ...SINGLETON_TYPES,
  ...ARTHUR_HIERARCHY_TYPES,
  ...SUPPORTING_CONTENT_TYPES,
])

const structure: StructureResolver = (S) =>
  S.list()
    .title('Arthur')
    .items([
      S.listItem()
        .title('Pengaturan situs')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Pengaturan Arthur')
        ),
      S.listItem()
        .title('Cara kami bekerja')
        .child(
          S.document()
            .schemaType('howWeWork')
            .documentId('howWeWork')
            .title('Cara kami bekerja')
        ),
      S.divider(),
      S.listItem()
        .title('Struktur offer')
        .child(
          S.list()
            .title('Struktur offer')
            .items([
              S.listItem().title('1. Unit').child(S.documentTypeList('unit')),
              S.listItem().title('2. Sisi').child(S.documentTypeList('side')),
              S.listItem().title('3. Bab').child(S.documentTypeList('bab')),
              S.listItem().title('4. Offer').child(S.documentTypeList('offer')),
              S.divider(),
              S.listItem()
                .title('Perlu Anda')
                .child(
                  S.documentList()
                    .title('Perlu Anda')
                    .schemaType('offer')
                    .filter('_type == $type && statusTinjauan == $status')
                    .params({ type: 'offer', status: 'perlu-anda' })
                ),
            ])
        ),
      S.listItem()
        .title('Isi pendukung')
        .child(
          S.list()
            .title('Isi pendukung')
            .items([
              S.listItem()
                .title('Rangkaian tiga unit')
                .child(S.documentTypeList('sequence')),
              S.listItem()
                .title('Tanya jawab')
                .child(S.documentTypeList('faq')),
              S.listItem()
                .title('Halaman tetap')
                .child(S.documentTypeList('page')),
            ])
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !MANAGED_TYPES.has(item.getId() ?? '')
      ),
    ])

function resolveHref(documentType?: string, slug?: string): string | undefined {
  switch (documentType) {
    // `home` is not special-cased: `/${PREVIEW_LOCALE}` is the developer-owned
    // starter page, so a `home` document previews at `/en/home` like any other
    // slug.
    case 'page':
      return slug ? `/${PREVIEW_LOCALE}/halaman/${slug}` : undefined
    case 'project':
      return slug ? `/${PREVIEW_LOCALE}/work/${slug}` : undefined
    default:
      console.warn('Invalid document type:', documentType)
      return undefined
  }
}

/**
 * `null` when Sanity isn't configured (no projectId) — `defineConfig` throws
 * on an empty projectId, so this must not be called during CI/preview
 * builds that have no Sanity secrets set. The studio page checks this and
 * renders a 404 instead of mounting `NextStudio`.
 *
 * Gated on the values from `./env`, NOT on `isConfigured('sanity')`. This
 * module is dual-compiled into the client bundle (the Studio route imports
 * it across a `'use client'` boundary), and `isConfigured` validates the
 * whole `process.env` object — which the browser `process` polyfill defines
 * as a permanently empty `{}`. Only literal `process.env.NEXT_PUBLIC_X`
 * reads get inlined at build time, so the schema check was always false in
 * the browser and 404'd a correctly configured Studio after hydration.
 */
export default projectId && dataset
  ? defineConfig({
      basePath: '/cms',
      projectId,
      dataset,
      schema,
      document: {
        actions: (previous, { schemaType }) => {
          if (!isArthurContentType(schemaType)) return previous

          const withoutPublish = previous.filter(
            (action) => action.action !== 'publish'
          )

          return [
            ...withoutPublish,
            ApproveArthurDocumentAction,
            PublishApprovedArthurDocumentAction,
          ]
        },
      },
      plugins: [
        // Presentation tool for visual editing
        presentationTool({
          resolve: {
            // Map routes to documents and GROQ filters
            mainDocuments: defineDocuments([
              // Static segments win over the catch-all — keep this first so
              // the tutorial page (a real static route) resolves ahead of
              // the generic page-by-slug entry below.
              // Routes carry the `:locale` segment because every page is
              // served under one. Without it these never match and
              // Presentation silently falls back to no document mapping.
              {
                route: '/:locale/work/:slug',
                filter: `_type == "project" && slug.current == $slug`,
              },
              {
                route: '/:locale/halaman/:slug',
                filter: `_type == "page" && slug.current == $slug`,
              },
            ]),
            locations: {
              page: defineLocations({
                select: {
                  title: 'coalesce(judul[_key == "id"][0].value, title)',
                  slug: 'slug.current',
                },
                resolve: (doc) => ({
                  locations: [
                    {
                      title: doc?.title ?? 'Untitled Page',
                      href: resolveHref('page', doc?.slug)!,
                    },
                  ],
                }),
              }),
              project: defineLocations({
                select: {
                  title: 'title',
                  slug: 'slug.current',
                },
                resolve: (doc) => ({
                  locations: [
                    {
                      title: doc?.title ?? 'Untitled Project',
                      href: resolveHref('project', doc?.slug)!,
                    },
                  ],
                }),
              }),
            },
          },
          previewUrl: {
            origin: previewURL,
            draftMode: {
              enable: '/api/draft-mode/enable',
              disable: '/api/draft-mode/disable',
            },
          },
        }),
        // Field-level localization. Sanity's own guidance is explicit that
        // localized OBJECTS ({ en, id }) hit document attribute limits, and
        // recommends this plugin instead: it stores each field as an array of
        // { _key: locale, value }, which grows a row per language rather than
        // an attribute per language.
        //
        // Languages are written out here rather than imported from
        // lib/i18n/routing.ts because this module is dual-compiled into the
        // Studio's client bundle, and importing the routing module would drag
        // next-intl in with it. `sanity-config.test.ts` asserts these stay in
        // step with the app's real locales.
        internationalizedArray({
          languages: [
            { id: 'en', title: 'English' },
            { id: 'id', title: 'Bahasa Indonesia' },
          ],
          // Generates `internationalizedArrayString`, `…Text` and
          // `…RichText`. Adding a type here is what makes it available to
          // schemas — a field referencing an unregistered one silently
          // disappears from the Studio.
          fieldTypes: ['string', 'text', 'richText'],
        }),
        structureTool({ structure }),
        // Vision is for querying with GROQ from inside the Studio
        // https://www.sanity.io/docs/the-vision-plugin
        visionTool({ defaultApiVersion: apiVersion }),
      ],
    })
  : null
