// Single source of truth for page <head> metadata.
//
// Used in two places:
//  1. Route `head` options, rendered by <HeadContent /> in __root.tsx. Public
//     routes are prerendered at build time (TanStack Start), so these tags are
//     in the static HTML that crawlers and link previews (WhatsApp, Facebook)
//     read, and they update on every in-app navigation.
//  2. vite.config.ts, which prerenders every PUBLIC_PAGES entry and lists it
//     in /sitemap.xml with its lastmod.
//
// Keep this file free of browser-only and Node-only imports: it is loaded by
// both the app bundle and vite.config.ts.

import type { AnyRouteMatch } from '@tanstack/react-router'

export const SITE = {
  origin: 'https://wasscetutor.com',
  name: 'WASSCE Tutor',
} as const

type PublicPage = {
  /** Full <title>, keyword first, brand last. Aim for <= 65 characters. */
  title: string
  /** Meta description. Aim for 120-160 characters, and keep it true. */
  description: string
  /** Title for link previews; defaults to `title`. */
  ogTitle?: string
  /** Date the page's content last changed meaningfully (YYYY-MM-DD), for the sitemap. */
  lastmod: string
}

// Indexable pages. Every key here gets a self-referencing canonical, a static
// HTML file at build time, and an entry in /sitemap.xml.
export const PUBLIC_PAGES = {
  '/': {
    title: 'WASSCE Past Questions & AI Tutor for Sierra Leone | WASSCE Tutor',
    ogTitle: 'WASSCE Tutor: Pass WASSCE with confidence',
    description:
      'Prepare for WASSCE with past questions, lessons and an AI tutor built for Sierra Leone students. Plans from NLe 25 a month, 7 days free.',
    lastmod: '2026-11-05',
  },
  '/about': {
    title: 'About WASSCE Tutor: WASSCE Prep Built in Sierra Leone',
    description:
      'WASSCE Tutor is a WASSCE preparation app built in Freetown for Sierra Leonean students: past WAEC papers, lessons with diagrams and maths, and an AI tutor.',
    lastmod: '2026-06-11',
  },
  '/privacy': {
    title: 'Privacy Policy | WASSCE Tutor',
    description:
      'What information WASSCE Tutor collects when you use the website or Android app, how it is stored and used, and the choices you have.',
    lastmod: '2026-06-08',
  },
  '/terms': {
    title: 'Terms of Service | WASSCE Tutor',
    description:
      'The terms that apply when you create an account or use WASSCE Tutor, including subscriptions, payments and acceptable use.',
    lastmod: '2026-06-08',
  },
} as const satisfies Record<string, PublicPage>

export type PublicPath = keyof typeof PUBLIC_PAGES

// Same shapes the router's `head` option returns.
export type HeadTags = {
  meta: NonNullable<AnyRouteMatch['meta']>
  links: NonNullable<AnyRouteMatch['links']>
  scripts?: NonNullable<AnyRouteMatch['headScripts']>
}

/** A <script type="application/ld+json"> head tag; "<" is escaped so the JSON can't close the script. */
function jsonLd(data: Record<string, unknown>): NonNullable<AnyRouteMatch['headScripts']>[number] {
  return { type: 'application/ld+json', children: JSON.stringify(data).replace(/</g, '\\u003c') }
}

export function absoluteUrl(path: string): string {
  return path === '/' ? `${SITE.origin}/` : `${SITE.origin}${path}`
}

// Organization + WebSite + app entity graph, on the homepage only.
const HOME_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE.origin}/#organization`,
      name: SITE.name,
      url: `${SITE.origin}/`,
      logo: `${SITE.origin}/favicon-512.png`,
      description: 'WASSCE preparation platform built in Freetown, Sierra Leone, with past papers, lessons and an AI tutor.',
      address: { '@type': 'PostalAddress', addressLocality: 'Freetown', addressCountry: 'SL' },
      areaServed: { '@type': 'Country', name: 'Sierra Leone' },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE.origin}/#website`,
      name: SITE.name,
      url: `${SITE.origin}/`,
      inLanguage: 'en',
      publisher: { '@id': `${SITE.origin}/#organization` },
    },
    {
      '@type': 'SoftwareApplication',
      name: SITE.name,
      description: 'WASSCE preparation app built in Sierra Leone with past papers, lessons and an AI tutor.',
      url: `${SITE.origin}/`,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Android, Web',
      inLanguage: 'en',
      audience: {
        '@type': 'Audience',
        audienceType: 'WASSCE candidates',
        geographicArea: { '@type': 'Country', name: 'Sierra Leone' },
      },
      offers: { '@type': 'AggregateOffer', priceCurrency: 'SLE', lowPrice: '25', highPrice: '220', offerCount: '3' },
      provider: { '@id': `${SITE.origin}/#organization` },
    },
  ],
}

/** Tags for an indexable page: unique title + description, self canonical, OG/Twitter text. */
export function publicPageTags(path: PublicPath): HeadTags {
  const page: PublicPage = PUBLIC_PAGES[path]
  const url = absoluteUrl(path)
  const ogTitle = page.ogTitle ?? page.title
  return {
    meta: [
      { title: page.title },
      { name: 'description', content: page.description },
      { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large' },
      { property: 'og:title', content: ogTitle },
      { property: 'og:description', content: page.description },
      { property: 'og:url', content: url },
      { name: 'twitter:title', content: ogTitle },
      { name: 'twitter:description', content: page.description },
    ],
    links: [{ rel: 'canonical', href: url }],
    scripts: path === '/' ? [jsonLd(HOME_JSON_LD)] : [],
  }
}

/** Tags for app screens and private pages: a readable tab title, never indexed. */
export function privatePageTags(title: string): HeadTags {
  return {
    meta: [
      { title: `${title} | ${SITE.name}` },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
    links: [],
  }
}

/** Route `head` option for an indexable page. */
export const publicHead = (path: PublicPath) => () => publicPageTags(path)

/** Route `head` option for a non-indexable screen. */
export const privateHead = (title: string) => () => privatePageTags(title)
