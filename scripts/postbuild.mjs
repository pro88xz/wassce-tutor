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
//   3. writes each page's Content-Security-Policy <meta> (scripts/csp.mjs)
//
// The Android app (capacitor.config.ts webDir) uses dist/client as-is: it
// starts at the prerendered index.html, where the boot script in __root.tsx
// hides the marketing page behind a spinner until the app has routed.
import fs from 'node:fs'
import path from 'node:path'
import { headerPolicy, withPagePolicy } from './csp.mjs'
import { redirectProblems, sitemapPaths } from './notes/redirects.mjs'

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

// Content Security Policy (scripts/csp.mjs): every built page gets a <meta>
// policy listing the hashes of its own inline scripts, and the response
// header in vercel.json must be the one csp.mjs describes.
{
  const walk = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : e.name.endsWith('.html') ? [path.join(dir, e.name)] : []))
  const pages = walk(client)
  for (const file of pages) fs.writeFileSync(file, withPagePolicy(fs.readFileSync(file, 'utf8')))

  const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'))
  const sent = vercel.headers?.flatMap((h) => h.headers).find((h) => h.key === 'Content-Security-Policy')?.value
  if (sent !== headerPolicy()) {
    console.error('[postbuild] vercel.json Content-Security-Policy differs from scripts/csp.mjs. Set it to:\n' + headerPolicy())
    process.exit(1)
  }
  console.log(`[postbuild] wrote a Content-Security-Policy into ${pages.length} pages`)
}

// Retired-lesson redirects (scripts/notes/redirects.mjs) against this build's
// pages. Which lessons are public comes from the database, so a problem here
// is reported, not fatal: fix it with "npm run notes:redirects".
{
  const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'))
  const live = sitemapPaths(fs.readFileSync(path.join(client, 'sitemap.xml'), 'utf8'))
  const problems = redirectProblems(vercel.redirects ?? [], live)
  if (problems.length) {
    console.warn(`[postbuild] WARNING: ${problems.length} retired-lesson redirect problem(s); run "npm run notes:redirects":`)
    for (const p of problems) console.warn(`  ${p}`)
  } else {
    console.log('[postbuild] retired-lesson redirects all lead to live pages')
  }
}

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

  // Plan names, prices and lengths from src/lib/plans.ts, so this never quotes an old price.
  const plansSrc = fs.readFileSync(path.join(root, 'src/lib/plans.ts'), 'utf8')
  const plans = [...plansSrc.matchAll(/name: '([^']+)',\s*priceNle: (\d+),[\s\S]*?length: '([^']+)'/g)].map((m) => `${m[1]} ${m[2]} NLe for ${m[3]}`)
  if (plans.length < 2) {
    console.error('[postbuild] llms.txt: could not read the plans from src/lib/plans.ts')
    process.exit(1)
  }
  const planLine = plans.join(', ')

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

  const MAIN = ['/', '/wassce', '/wassce/subjects', '/tutors', '/universities', '/blog', '/become-a-tutor', '/affiliate', '/about', '/contact']
  const sections = [
    ['Start here', pick((p) => MAIN.includes(p)).sort((a, b) => MAIN.indexOf(a.path) - MAIN.indexOf(b.path))],
    ['WASSCE subjects', pick((p) => p.startsWith('/wassce/') && p !== '/wassce/subjects' && depth(p) === 2)],
    ['WASSCE questions and answers by subject', pick((p) => /^\/wassce\/[^/]+\/questions$/.test(p))],
    ['WASSCE topics', pick((p) => p.startsWith('/wassce/') && depth(p) === 3 && !p.endsWith('/questions'))],
    ['Free lessons', pick((p) => p.startsWith('/wassce/') && depth(p) === 4 && !p.endsWith('/questions'))],
    ['WASSCE questions and answers by topic', pick((p) => /^\/wassce\/[^/]+\/[^/]+\/questions$/.test(p))],
    ['Book a tutor by subject', pick((p) => p.startsWith('/tutors/'))],
    ['Sierra Leone university profiles', pick((p) => p.startsWith('/universities/'))],
    ['WASSCE Tutor editorial articles', pick((p) => p.startsWith('/blog/'))],
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
    '- AI tutor answers are labelled as AI. Book a tutor connects students with verified teachers for lessons in person, arranged on WhatsApp.',
    `- Every lesson in every subject and every practice set (with answers and full working) is free, with no account needed to read them. A free account saves progress. Paid plans add the AI study tutor and timed mock exams: ${planLine}, paid once through a Monime USSD code with Orange Money or AfriMoney. No automatic renewal: ${SITE}/#plans`,
    `- Contact: WhatsApp ${contact.phoneDisplay} (https://wa.me/${contact.whatsapp}), email ${contact.email}. Based in ${contact.locality}, ${contact.country}; serves students across the country online.`,
    `- WhatsApp group: ${contact.whatsappGroup}`,
    '',
    ...sections.flatMap(([heading, list]) => (list.length ? [`## ${heading}`, '', ...list.map(line), ''] : [])),
  ]
  fs.writeFileSync(path.join(client, 'llms.txt'), out.join('\n'))
  console.log(`[postbuild] wrote llms.txt (${pages.length} pages)`)
}

// Question diagrams in the sitemap (Google image sitemap extension), so the
// diagrams on /wassce/{subject}/{topic}/questions can be found in image search.
// The urlset already declares the image namespace (TanStack Start writes it).
{
  const SITE = 'https://wasscetutor.com'
  const sitemapPath = path.join(client, 'sitemap.xml')
  const xml = fs.readFileSync(sitemapPath, 'utf8')
  if (!xml.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"')) {
    console.error('[postbuild] sitemap.xml no longer declares the image namespace; add it before adding image entries')
    process.exit(1)
  }
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  let images = 0
  const out = xml.replace(/<url>\s*<loc>([^<]+)<\/loc>([\s\S]*?)<\/url>/g, (whole, loc, rest) => {
    const p = loc.replace(SITE, '')
    if (!/\/questions$/.test(p) || rest.includes('<image:image>')) return whole
    const file = path.join(client, `${p.slice(1)}.html`)
    if (!fs.existsSync(file)) return whole
    const html = fs.readFileSync(file, 'utf8')
    const srcs = [...new Set([...html.matchAll(/<img [^>]*src="(https:\/\/wasscetutor\.com\/questions\/[^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&')))]
    if (srcs.length === 0) return whole
    images += srcs.length
    const entries = srcs.map((s) => `\n    <image:image>\n      <image:loc>${esc(s)}</image:loc>\n    </image:image>`).join('')
    return `<url>\n    <loc>${loc}</loc>${rest.replace(/\s+$/, '')}${entries}\n  </url>`
  })
  fs.writeFileSync(sitemapPath, out)
  console.log(`[postbuild] sitemap.xml: ${images} question diagrams listed for image search`)
}
