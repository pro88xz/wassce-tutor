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
import { CONTACT } from './contact'

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
    title: 'WASSCE Practice Questions & Lessons in Sierra Leone | WASSCE Tutor',
    ogTitle: 'WASSCE Tutor: Pass WASSCE with confidence',
    description:
      'WASSCE lessons and practice questions for Sierra Leone students, with full working, an AI tutor and one-to-one tutors. From NLe 25 a month, 7 days free.',
    lastmod: '2026-11-06',
  },
  '/about': {
    title: 'About WASSCE Tutor: WASSCE Prep Built in Sierra Leone',
    description:
      'WASSCE Tutor is a WASSCE preparation app built in Freetown for Sierra Leone students: syllabus lessons, exam-style practice questions and an AI tutor.',
    lastmod: '2026-11-06',
  },
  '/contact': {
    title: 'Contact WASSCE Tutor: WhatsApp, Email & Location | WASSCE Tutor',
    description:
      'Contact WASSCE Tutor in Freetown, Sierra Leone: WhatsApp +232 77 884195, email, and our WhatsApp study group. Help with plans, payments and tutors.',
    lastmod: '2026-11-06',
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

const ORG_ID = `${SITE.origin}/#organization`

// The business itself: an education service based in Freetown that serves
// the whole country online. Typed as both EducationalOrganization and
// LocalBusiness so search engines can show it for local searches. Add
// streetAddress, postalCode and sameAs (Google Business Profile, socials)
// here when they exist; never guess them.
const ORGANIZATION = {
  '@type': ['EducationalOrganization', 'LocalBusiness'],
  '@id': ORG_ID,
  name: SITE.name,
  url: `${SITE.origin}/`,
  logo: `${SITE.origin}/favicon-512.png`,
  image: `${SITE.origin}/og-image.jpg`,
  description:
    'WASSCE preparation for Sierra Leone students, built in Freetown: syllabus lessons, original exam-style practice questions, an AI tutor and one-to-one tutors.',
  email: CONTACT.email,
  telephone: CONTACT.phoneE164,
  address: {
    '@type': 'PostalAddress',
    addressLocality: CONTACT.locality,
    addressRegion: CONTACT.region,
    addressCountry: CONTACT.countryCode,
  },
  areaServed: { '@type': 'Country', name: CONTACT.country },
  priceRange: 'NLe 25–220',
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      telephone: CONTACT.phoneE164,
      email: CONTACT.email,
      areaServed: CONTACT.countryCode,
      availableLanguage: ['English'],
    },
  ],
  knowsAbout: ['WASSCE', 'West African Senior School Certificate Examination', 'Secondary education in Sierra Leone'],
}

// Organization + WebSite + app entity graph, on the homepage.
const HOME_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    ORGANIZATION,
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
      description: 'WASSCE preparation app built in Sierra Leone with syllabus lessons, exam-style practice questions and an AI tutor.',
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
      provider: { '@id': ORG_ID },
    },
  ],
}

// Contact page: the business entity in full, with the page about it.
const CONTACT_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    ORGANIZATION,
    {
      '@type': 'ContactPage',
      '@id': `${SITE.origin}/contact#page`,
      url: `${SITE.origin}/contact`,
      name: 'Contact WASSCE Tutor',
      inLanguage: 'en',
      about: { '@id': ORG_ID },
      mainEntity: { '@id': ORG_ID },
    },
  ],
}

const ABOUT_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    ORGANIZATION,
    {
      '@type': 'AboutPage',
      url: `${SITE.origin}/about`,
      name: 'About WASSCE Tutor',
      inLanguage: 'en',
      about: { '@id': ORG_ID },
    },
  ],
}

const PAGE_JSON_LD: Partial<Record<PublicPath, Record<string, unknown>[]>> = {
  '/': [HOME_JSON_LD],
  // breadcrumbJsonLd is a function declaration, so it is hoisted and usable here.
  '/about': [ABOUT_JSON_LD, breadcrumbJsonLd([['Home', '/'], ['About', '/about']])],
  '/contact': [CONTACT_JSON_LD, breadcrumbJsonLd([['Home', '/'], ['Contact', '/contact']])],
}

type IndexablePage = {
  path: string
  title: string
  description: string
  ogTitle?: string
  /** JSON-LD objects, each emitted as its own <script type="application/ld+json">. */
  jsonLd?: Record<string, unknown>[]
}

/** Tags for an indexable page: unique title + description, self canonical, OG/Twitter text, optional JSON-LD. */
export function indexablePageTags({ path, title, description, ogTitle = title, jsonLd: data = [] }: IndexablePage): HeadTags {
  const url = absoluteUrl(path)
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large' },
      { property: 'og:title', content: ogTitle },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { name: 'twitter:title', content: ogTitle },
      { name: 'twitter:description', content: description },
    ],
    links: [{ rel: 'canonical', href: url }],
    scripts: data.map(jsonLd),
  }
}

/** Tags for a fixed page listed in PUBLIC_PAGES. */
export function publicPageTags(path: PublicPath): HeadTags {
  const page: PublicPage = PUBLIC_PAGES[path]
  return indexablePageTags({
    path,
    title: page.title,
    description: page.description,
    ogTitle: page.ogTitle,
    jsonLd: PAGE_JSON_LD[path] ?? [],
  })
}

/** schema.org BreadcrumbList for a trail of [name, path] pairs, ending with the current page. */
export function breadcrumbJsonLd(trail: [name: string, path: string][]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: absoluteUrl(path),
    })),
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

/** schema.org Service for a tutoring page. */
export function tutoringServiceJsonLd({ name, description, path, subject }: { name: string; description: string; path: string; subject?: string }): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: absoluteUrl(path),
    serviceType: subject ? `${subject} tutoring` : 'Private tutoring',
    category: 'Education',
    provider: { '@type': 'Organization', '@id': ORG_ID, name: SITE.name, url: `${SITE.origin}/`, telephone: CONTACT.phoneE164 },
    areaServed: { '@type': 'Country', name: 'Sierra Leone' },
    audience: { '@type': 'EducationalAudience', educationalRole: 'student', audienceType: 'WASSCE candidates' },
    availableChannel: { '@type': 'ServiceChannel', serviceUrl: absoluteUrl(path), availableLanguage: 'en' },
  }
}

/** schema.org FAQPage from visible question/answer pairs (must match what the page shows). */
export function faqJsonLd(items: [question: string, answer: string][]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  }
}
