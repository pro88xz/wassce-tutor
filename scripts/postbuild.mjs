// Runs after `vite build` (see package.json "build").
//
// TanStack Start writes dist/client/_shell.html: the client-only app frame that
// vercel.json serves for every app screen (/subjects, /lesson/:id, /admin, ...).
// It is rendered from the /subjects route, so it carries that route's title.
// This script:
//   1. removes that title from the shell: each screen adds its own once it
//      loads, and a leftover static <title> would linger as a duplicate
//   2. writes dist/client/404.html from the shell, which Vercel serves with a
//      real 404 status for unknown URLs; the router then shows its not-found page
//
// The Android app (capacitor.config.ts webDir) uses dist/client as-is: it
// starts at the prerendered index.html, where the boot script in __root.tsx
// hides the marketing page behind a spinner until the app has routed.
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const client = path.join(root, 'dist/client')
const shellPath = path.join(client, '_shell.html')

if (!fs.existsSync(shellPath)) {
  console.error('[postbuild] dist/client/_shell.html not found: did the TanStack Start SPA shell prerender run?')
  process.exit(1)
}

const TITLE_RE = /<title>[^<]*<\/title>/
const ROBOTS_RE = /<meta name="robots" content="[^"]*"\/>/
const shell = fs.readFileSync(shellPath, 'utf8')
if (!TITLE_RE.test(shell) || !ROBOTS_RE.test(shell)) {
  console.error('[postbuild] shell is missing its <title> or robots meta; check the /subjects route head')
  process.exit(1)
}

const neutralShell = shell.replace(TITLE_RE, '')
fs.writeFileSync(shellPath, neutralShell)

// Unknown URLs: the client renders the catch-all route (src/routes/$.tsx),
// which sets the "Page not found" title.
const notFound = neutralShell.replace(ROBOTS_RE, '<meta name="robots" content="noindex"/>')
fs.writeFileSync(path.join(client, '404.html'), notFound)

console.log('[postbuild] updated _shell.html and wrote 404.html')

// /llms.txt (https://llmstxt.org): a plain-language map of the public site
// for AI assistants and answer engines. Built from the sitemap and the
// prerendered pages' own <title> and meta description, so it never drifts
// from what the pages say. Contact details come from src/lib/contact.ts.
{
  const SITE = 'https://wasscetutor.com'
  const contactSrc = fs.readFileSync(path.join(root, 'src/lib/contact.ts'), 'utf8')
  const contact = Object.fromEntries([...contactSrc.matchAll(/^\s+(\w+): '([^']*)',$/gm)].map((m) => [m[1], m[2]]))
  for (const k of ['email', 'phoneDisplay', 'whatsapp', 'whatsappGroup', 'locality', 'country']) {
    if (!contact[k]) {
      console.error(`[postbuild] llms.txt: could not read ${k} from src/lib/contact.ts`)
      process.exit(1)
    }
  }

  const unescape = (s) =>
    s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'")
  const sitemap = fs.readFileSync(path.join(client, 'sitemap.xml'), 'utf8')
  const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, '') || '/')

  const pages = paths.map((p) => {
    const file = path.join(client, p === '/' ? 'index.html' : `${p.slice(1)}.html`)
    if (!fs.existsSync(file)) {
      console.error(`[postbuild] llms.txt: ${p} is in the sitemap but ${path.relative(root, file)} is missing`)
      process.exit(1)
    }
    const html = fs.readFileSync(file, 'utf8')
    const title = unescape(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '').replace(/\s*\|\s*WASSCE Tutor$/, '')
    const description = unescape(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '')
    return { path: p, url: p === '/' ? `${SITE}/` : `${SITE}${p}`, title, description }
  })
  const line = (pg) => `- [${pg.title}](${pg.url})${pg.description ? `: ${pg.description}` : ''}`
  const depth = (p) => p.split('/').filter(Boolean).length
  const pick = (test) => pages.filter((pg) => test(pg.path))

  const MAIN = ['/', '/wassce', '/wassce/subjects', '/tutors', '/about', '/contact']
  const sections = [
    ['Start here', pick((p) => MAIN.includes(p)).sort((a, b) => MAIN.indexOf(a.path) - MAIN.indexOf(b.path))],
    ['WASSCE subjects', pick((p) => p.startsWith('/wassce/') && p !== '/wassce/subjects' && depth(p) === 2)],
    ['WASSCE topics', pick((p) => p.startsWith('/wassce/') && depth(p) === 3)],
    ['Free lessons', pick((p) => p.startsWith('/wassce/') && depth(p) === 4)],
    ['Book a tutor by subject', pick((p) => p.startsWith('/tutors/'))],
    ['Optional', pick((p) => p === '/privacy' || p === '/terms')],
  ]

  const out = [
    '# WASSCE Tutor',
    '',
    `> WASSCE preparation for students in Sierra Leone, built in ${contact.locality}: lessons written to the WASSCE syllabus, original exam-style practice questions with full working, an AI tutor, and one-to-one human tutors.`,
    '',
    'Key facts:',
    '',
    '- Who it is for: SSS1 to SSS3 students, private candidates, and the parents and teachers who support them, preparing for the West African Senior School Certificate Examination (WASSCE) in Sierra Leone.',
    '- Practice questions are original WASSCE-style questions written by WASSCE Tutor to match the syllabus and exam format. They are not WAEC past papers, and WASSCE Tutor is not affiliated with WAEC.',
    '- AI tutor answers are labelled as AI. Book a tutor connects students with real teachers for lessons online or at home, arranged on WhatsApp.',
    `- A free account (no time limit) opens every subject's syllabus, the first lesson of every topic and a starter practice set in every subject. Paid plans unlock everything: Term pass 10 NLe for 4 months, Academic year 25 NLe for 12 months, paid with Orange Money or AfriMoney and arranged on WhatsApp. No automatic renewal: ${SITE}/#plans`,
    `- Contact: WhatsApp ${contact.phoneDisplay} (https://wa.me/${contact.whatsapp}), email ${contact.email}. Based in ${contact.locality}, ${contact.country}; serves students across the country online.`,
    `- WhatsApp group: ${contact.whatsappGroup}`,
    '',
    ...sections.flatMap(([heading, list]) => (list.length ? [`## ${heading}`, '', ...list.map(line), ''] : [])),
  ]
  fs.writeFileSync(path.join(client, 'llms.txt'), out.join('\n'))
  console.log(`[postbuild] wrote llms.txt (${pages.length} pages)`)
}
