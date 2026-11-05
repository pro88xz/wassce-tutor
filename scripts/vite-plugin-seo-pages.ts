// Vite plugin: per-page HTML shells, 404 page and sitemap, generated from src/lib/seo.ts.
//
// The app is a client-rendered SPA, so without this every URL would be served
// the same index.html (same title, same canonical). At build time we write:
//
//   dist/index.html    homepage tags + homepage-only JSON-LD
//   dist/about.html    (and one file per other PUBLIC_PAGES entry) with that page's tags
//   dist/spa.html      shell for app screens (/subjects, /auth, /admin, ...): noindex, no canonical
//   dist/404.html      shell served by Vercel for unknown URLs, with a real 404 status
//   dist/sitemap.xml   every PUBLIC_PAGES entry with its lastmod
//
// vercel.json rewrites each route to the matching file. In dev, Vite serves
// index.html (homepage tags) for every route, and the router's <HeadContent />
// corrects the tags in the browser, exactly as it does in production.

import fs from 'node:fs'
import path from 'node:path'
import type { Plugin, ResolvedConfig } from 'vite'
import {
  PUBLIC_PAGES,
  SITE,
  absoluteUrl,
  publicPageTags,
  tagsToHtml,
  type HeadTags,
  type PublicPath,
} from '../src/lib/seo'

const PLACEHOLDER = '<!-- page-meta -->'
const BLOCK_RE = /<!-- page-meta:start -->[\s\S]*?<!-- page-meta:end -->/
const HOME_ONLY_RE = /[ \t]*<!-- home-only:start[\s\S]*?<!-- home-only:end -->\n?/

function block(tags: HeadTags): string {
  return `<!-- page-meta:start -->\n    ${tagsToHtml(tags)}\n    <!-- page-meta:end -->`
}

const SPA_SHELL_TAGS: HeadTags = {
  meta: [{ title: SITE.name }, { name: 'robots', content: 'noindex, nofollow' }],
  links: [],
}

const NOT_FOUND_TAGS: HeadTags = {
  meta: [{ title: `Page not found | ${SITE.name}` }, { name: 'robots', content: 'noindex' }],
  links: [],
}

function sitemapXml(): string {
  const urls = (Object.keys(PUBLIC_PAGES) as PublicPath[]).map(
    (p) => `  <url>\n    <loc>${absoluteUrl(p)}</loc>\n    <lastmod>${PUBLIC_PAGES[p].lastmod}</lastmod>\n  </url>`,
  )
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
}

export function seoPages(): Plugin {
  let config: ResolvedConfig
  return {
    name: 'wassce-seo-pages',
    configResolved(resolved) {
      config = resolved
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        if (!html.includes(PLACEHOLDER)) {
          throw new Error(`[seo-pages] index.html is missing the ${PLACEHOLDER} placeholder`)
        }
        return html.replace(PLACEHOLDER, block(publicPageTags('/')))
      },
    },
    closeBundle() {
      if (config.command !== 'build') return
      const outDir = path.resolve(config.root, config.build.outDir)
      const indexPath = path.join(outDir, 'index.html')
      if (!fs.existsSync(indexPath)) return
      const home = fs.readFileSync(indexPath, 'utf8')
      if (!BLOCK_RE.test(home)) throw new Error('[seo-pages] built index.html has no page-meta block')
      if (!HOME_ONLY_RE.test(home)) throw new Error('[seo-pages] built index.html has no home-only block')

      const page = (tags: HeadTags) => home.replace(BLOCK_RE, block(tags)).replace(HOME_ONLY_RE, '')
      const write = (file: string, contents: string) => fs.writeFileSync(path.join(outDir, file), contents)

      for (const p of Object.keys(PUBLIC_PAGES) as PublicPath[]) {
        if (p === '/') continue // index.html already has the homepage tags
        write(`${p.slice(1)}.html`, page(publicPageTags(p)))
      }
      write('spa.html', page(SPA_SHELL_TAGS))
      write('404.html', page(NOT_FOUND_TAGS))
      write('sitemap.xml', sitemapXml())
    },
  }
}
