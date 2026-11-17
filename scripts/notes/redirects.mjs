#!/usr/bin/env node
// Permanent redirects for retired lessons.
//
//   npm run notes:redirects                  write them into vercel.json
//   node scripts/notes/redirects.mjs --check fail if a retired lesson has none (CI)
//
// A note in content/notes/manifest.json can "retire" older lessons in its
// topic: scripts/sync-notes.mjs unpublishes them, so their public pages
// (/wassce/{subject}/{topic}/{slug}) start returning 404. Google keeps asking
// for the URLs it had indexed, and Search Console reported several of them,
// one with clicks. Each retired slug gets a permanent redirect to the lesson
// that replaced it when that lesson has a public page (it is in the sitemap),
// otherwise to the topic page, which lists it.
//
// Old slugs could hold any character ("topic-9:-equilibrium-of-forces",
// "newton's-laws-of-motion-(dynamics)"), and Vercel reads ":" and "(" in a
// redirect source as pattern syntax. So every run of characters other than
// a-z, 0-9 and "-" becomes the wildcard (.*), which matches the character
// whether or not the request percent-encodes it.
//
// Writing needs the list of live pages, to pick each destination and to make
// sure no redirect hides a live page: it reads the live sitemap, or a built
// one with --sitemap dist/client/sitemap.xml. scripts/postbuild.mjs checks
// the redirects against each build's sitemap and warns about any that point
// at a missing page or hide a live one.
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const ORIGIN = 'https://wasscetutor.com'

/** The lesson slug: the same rule as scripts/sync-notes.mjs and import_lessons(). */
const slugOf = (title) =>
  title.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-').toLowerCase().replace(/-+/g, '-').replace(/^-|-$/g, '')
/** Subject name to its URL slug ("ICT / Computer Studies" -> "ict-computer-studies"). */
const subjectSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/** A Vercel redirect source for a slug: anything outside [a-z0-9-] becomes (.*). */
const sourceSlug = (slug) => slug.toLowerCase().replace(/[^a-z0-9-]+/g, '(.*)')

/** A redirect source as a RegExp over request paths, for checking it against live pages. */
export const sourceRegex = (source) =>
  new RegExp(`^${source.split('(.*)').map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*')}$`)

/** Redirects are generated for sources under this prefix; vercel.json's other redirects are left alone. */
export const GENERATED_PREFIX = '/wassce/'

/** Every retired lesson in the manifest: its redirect source and where it can go. */
export function retiredLessons() {
  const { lessons } = JSON.parse(readFileSync(join(root, 'content/notes/manifest.json'), 'utf8'))
  // Slugs of current notes, per topic: never redirect one of these.
  const current = new Set(lessons.map((e) => `${subjectSlug(e.subject)}/${e.topic}/${e.slug || slugOf(e.title)}`))
  const bySource = new Map()
  for (const e of lessons) {
    if (!Array.isArray(e.retire)) continue
    const topic = `/wassce/${subjectSlug(e.subject)}/${e.topic}`
    const replacement = `${topic}/${e.slug || slugOf(e.title)}`
    for (const slug of e.retire) {
      if (current.has(`${subjectSlug(e.subject)}/${e.topic}/${slug}`)) continue
      const source = `${topic}/${sourceSlug(slug)}`
      if (!bySource.has(source)) bySource.set(source, { source, retired: `${topic}/${slug}`, replacement, topic })
    }
  }
  return [...bySource.values()].sort((a, b) => a.source.localeCompare(b.source))
}

/** Paths in a sitemap.xml ("/", "/wassce/physics", ...). */
export const sitemapPaths = (xml) =>
  new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(ORIGIN, '') || '/'))

/** Problems with the generated redirects against a set of live pages: missing destinations and hidden pages. */
export function redirectProblems(redirects, live) {
  const problems = []
  for (const r of redirects.filter((r) => r.source.startsWith(GENERATED_PREFIX))) {
    if (!live.has(r.destination)) problems.push(`${r.source} -> ${r.destination}: the destination is not a live page`)
    const re = sourceRegex(r.source)
    for (const p of live) if (re.test(p)) problems.push(`${r.source} hides the live page ${p}`)
  }
  return problems
}

async function readSitemap(arg) {
  if (arg) return readFileSync(arg, 'utf8')
  const res = await fetch(`${ORIGIN}/sitemap.xml`)
  if (!res.ok) throw new Error(`could not fetch the live sitemap: HTTP ${res.status}`)
  return res.text()
}

async function main() {
  const vercelPath = join(root, 'vercel.json')
  const vercel = JSON.parse(readFileSync(vercelPath, 'utf8'))
  const retired = retiredLessons()

  if (process.argv.includes('--check')) {
    const have = new Set((vercel.redirects ?? []).map((r) => r.source))
    const missing = retired.filter((r) => !have.has(r.source))
    if (missing.length) {
      console.error(`[redirects] ${missing.length} retired lesson(s) have no redirect in vercel.json:`)
      for (const r of missing) console.error(`  ${r.retired}`)
      console.error('[redirects] Run "npm run notes:redirects" and commit vercel.json.')
      process.exit(1)
    }
    console.log(`[redirects] all ${retired.length} retired lessons redirect.`)
    return
  }

  const at = process.argv.indexOf('--sitemap')
  const live = sitemapPaths(await readSitemap(at > 0 ? process.argv[at + 1] : undefined))
  if (live.size < 50) throw new Error(`the sitemap lists only ${live.size} pages; refusing to pick destinations from it`)

  const generated = retired.map((r) => ({
    source: r.source,
    destination: live.has(r.replacement) ? r.replacement : r.topic,
    permanent: true,
  }))
  const problems = redirectProblems(generated, live)
  if (problems.length) {
    console.error('[redirects] not written:')
    for (const p of problems) console.error(`  ${p}`)
    console.error('[redirects] Take the slug out of the note\'s "retire" list if the lesson is live again.')
    process.exit(1)
  }

  vercel.redirects = [...(vercel.redirects ?? []).filter((r) => !r.source.startsWith(GENERATED_PREFIX)), ...generated]
  writeFileSync(vercelPath, JSON.stringify(vercel, null, 2) + '\n')
  const toLesson = generated.filter((r) => r.destination !== retired.find((x) => x.source === r.source).topic).length
  console.log(`[redirects] wrote ${generated.length} redirects: ${toLesson} to the replacing lesson, ${generated.length - toLesson} to the topic page.`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(`[redirects] ${e.message}`)
    process.exit(1)
  })
}
