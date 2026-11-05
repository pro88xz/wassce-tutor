// Single source of truth for page <head> metadata.
//
// Used in two places:
//  1. Route `head` options (rendered by <HeadContent /> in __root.tsx), so the
//     title / description / canonical update on every in-app navigation.
//  2. The build plugin in vite.config.ts, which writes a static HTML file per
//     public page (about.html, privacy.html, ...) with the same tags baked in,
//     so crawlers and link previews (WhatsApp, Facebook) that don't run
//     JavaScript still see the right title and description.
//
// Keep this file free of browser-only and Node-only imports: it is loaded by
// both the app bundle and vite.config.ts.

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

type MetaTag = { title: string } | { name: string; content: string } | { property: string; content: string }
type LinkTag = { rel: string; href: string }
export type HeadTags = { meta: MetaTag[]; links: LinkTag[] }

export function absoluteUrl(path: string): string {
  return path === '/' ? `${SITE.origin}/` : `${SITE.origin}${path}`
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

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * Render tags as static HTML for index.html and the prerendered page shells.
 * Each tag carries `data-page-meta` so main.tsx can remove the static copies
 * before <HeadContent /> renders the live ones (avoiding duplicate <title>s).
 */
export function tagsToHtml({ meta, links }: HeadTags): string {
  const lines: string[] = []
  for (const m of meta) {
    if ('title' in m) lines.push(`<title data-page-meta>${escapeAttr(m.title)}</title>`)
    else if ('name' in m) lines.push(`<meta data-page-meta name="${escapeAttr(m.name)}" content="${escapeAttr(m.content)}" />`)
    else lines.push(`<meta data-page-meta property="${escapeAttr(m.property)}" content="${escapeAttr(m.content)}" />`)
  }
  for (const l of links) lines.push(`<link data-page-meta rel="${escapeAttr(l.rel)}" href="${escapeAttr(l.href)}" />`)
  return lines.join('\n    ')
}
