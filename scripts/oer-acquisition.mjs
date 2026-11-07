#!/usr/bin/env node
// Open-licence WASSCE content acquisition.
//
// Finds openly licensed teaching material for syllabus topics that have no
// lessons yet, and sends it to the ingest endpoint (api/notes-engine/ingest).
//
// Why not a search engine: Google, Bing, Brave, DuckDuckGo and Yahoo block
// automated searches from GitHub's servers (captcha or empty pages), and
// their terms do not allow scraping. Every earlier run found nothing for that
// reason. This version asks the sources themselves, through their public APIs:
//
//   OpenStax   books whose licence (from OpenStax's own book data) is CC BY or
//              CC BY-SA. Most OpenStax books are now NonCommercial, which a
//              paid site cannot reuse, so they are skipped automatically.
//   Wikibooks  MediaWiki search and parse APIs; the licence comes from the
//              wiki's own rights information (CC BY-SA 4.0).
//
// A topic is only filled when a section's title matches it closely, the
// licence is verified and there is enough text. Nothing is invented: a topic
// without a good open source stays a gap.
//
// Environment
//   CRON_SECRET          required (catalogue and ingest endpoints)
//   NOTES_CATALOG_URL    default https://wasscetutor.com/api/notes-engine/catalog
//   NOTES_INGEST_URL     default https://wasscetutor.com/api/notes-engine/ingest
//   TOPIC_LIMIT          lessons to create per run, 1-3 (default 3)
//   WIKIMEDIA_TOKEN      optional Wikimedia API token: higher Wikibooks rate limits
//   DRY_RUN=1            find and build lessons, but do not send them
//   DRY_RUN_DIR          with DRY_RUN, write each lesson's Markdown here
//   NOTES_GAPS_FILE      local testing: read gaps from a JSON file, not the catalogue
import fs from 'node:fs'
import path from 'node:path'
import TurndownService from 'turndown'
import { MathMLToLaTeX } from 'mathml-to-latex'

const MAX_TOPICS = Math.max(1, Math.min(3, Number(process.env.TOPIC_LIMIT || 3) || 3))
const MAX_ATTEMPTS = 60 // topics tried per run
const TIME_BUDGET_MS = 15 * 60 * 1000
const MAX_SOURCES = 2
const MIN_SOURCE_WORDS = 300
const MAX_SOURCE_WORDS = 2200
const MATCH_THRESHOLD = 0.67 // share of a topic's key words that must appear in the section title
const CATALOG_URL = process.env.NOTES_CATALOG_URL || 'https://wasscetutor.com/api/notes-engine/catalog'
const INGEST_URL = process.env.NOTES_INGEST_URL || 'https://wasscetutor.com/api/notes-engine/ingest'
const DRY_RUN = process.env.DRY_RUN === '1'
const USER_AGENT = 'WASSCETutorBot/2.0 (+https://wasscetutor.com/contact)'
const started = Date.now()

// ── Helpers ────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const normalize = (value) => String(value ?? '').replace(/\s+/g, ' ').trim()
const wordCount = (value) => (String(value).match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || []).length
const stripTags = (html) => normalize(String(html).replace(/<[^>]+>/g, ' '))

// One request at a time per host, with a pause, and backing off when asked.
const lastCall = new Map()
const HOST_GAP_MS = { 'en.wikibooks.org': 1100, 'openstax.org': 250 }
async function getJson(url, { headers = {}, attempts = 3 } = {}) {
  const host = new URL(url).hostname
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const wait = (lastCall.get(host) ?? 0) + (HOST_GAP_MS[host] ?? 300) - Date.now()
    if (wait > 0) await sleep(wait)
    lastCall.set(host, Date.now())
    let response
    try {
      response = await fetch(url, { headers: { 'User-Agent': USER_AGENT, Accept: 'application/json', ...headers }, signal: AbortSignal.timeout(30000) })
    } catch (error) {
      if (attempt === attempts) throw new Error(`${host}: ${error.message}`)
      await sleep(1000 * attempt)
      continue
    }
    if (response.status === 429 || response.status >= 500) {
      const retryAfter = Math.min(30, Number(response.headers.get('retry-after')) || 5 * attempt)
      if (attempt === attempts) throw Object.assign(new Error(`${host}: HTTP ${response.status}`), { status: response.status })
      await sleep(retryAfter * 1000)
      continue
    }
    if (!response.ok) throw Object.assign(new Error(`${host}: HTTP ${response.status}`), { status: response.status })
    const text = await response.text()
    try {
      return JSON.parse(text)
    } catch {
      // Wikimedia answers a rate limit with plain text and status 200 at times.
      if (/too many requests/i.test(text) && attempt < attempts) {
        await sleep(10000 * attempt)
        continue
      }
      throw new Error(`${host}: not JSON (${text.slice(0, 80)})`)
    }
  }
}

/** The licences a paid site may reuse. NonCommercial and NoDerivatives are rejected. */
function licenceFromUrl(url) {
  const u = String(url || '').toLowerCase().replace(/^http:/, 'https:')
  if (/creativecommons\.org\/licenses\/by-sa\/4\.0/.test(u)) return 'CC-BY-SA-4.0'
  if (/creativecommons\.org\/licenses\/by\/4\.0/.test(u)) return 'CC-BY-4.0'
  if (/creativecommons\.org\/publicdomain\/zero\/1\.0/.test(u)) return 'CC0-1.0'
  return null
}

// ── Matching a syllabus topic to a section title ───────────────────────────

const STOP = new Set(['and', 'the', 'of', 'in', 'to', 'a', 'an', 'for', 'its', 'their', 'with', 'on', 'by', 'as', 'or', 'from', 'into', 'at', 'is', 'are', 'its', 'how', 'what', 'why', 'introduction', 'basic', 'basics', 'simple', 'types', 'type', 'kinds', 'concept', 'concepts', 'principles', 'part', 'parts'])
const stem = (w) => (w.length > 4 ? w.replace(/ies$/, 'y').replace(/(sses|xes|ches|shes)$/, (m) => m.slice(0, -2)).replace(/([^s])s$/, '$1') : w)
const keyTerms = (s) => [...new Set(normalize(s).toLowerCase().replace(/[’']/g, '').split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !STOP.has(w)).map(stem))]

/** Share of the topic's key words found in the title (1 = all of them). */
function titleMatch(topicName, title) {
  const wanted = keyTerms(topicName)
  if (!wanted.length) return 0
  const have = new Set(keyTerms(title))
  return wanted.filter((w) => have.has(w)).length / wanted.length
}

// ── HTML to lesson Markdown ────────────────────────────────────────────────

const turndown = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', codeBlockStyle: 'fenced', emDelimiter: '*' })
// Source headings sit under the lesson's own "## <section>" heading.
turndown.addRule('demoteHeadings', {
  filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  replacement: (content, node) => {
    const level = Math.min(6, Math.max(3, Number(node.nodeName[1]) + 1))
    const text = normalize(content)
    return text ? `\n\n${'#'.repeat(level)} ${text}\n\n` : ''
  },
})
// Relative and in-page links would break on wasscetutor.com: keep their text only.
turndown.addRule('absoluteLinksOnly', {
  filter: (node) => node.nodeName === 'A',
  replacement: (content, node) => {
    const href = node.getAttribute('href') || ''
    return /^https:\/\//.test(href) && normalize(content) ? `[${normalize(content)}](${href})` : content
  },
})
// Tables as GFM pipe tables (the lesson reader renders them).
turndown.addRule('tables', {
  filter: 'table',
  replacement: (_content, node) => {
    const rows = [...node.querySelectorAll('tr')].map((tr) => [...tr.querySelectorAll('th,td')].map((cell) => normalize(cell.textContent).replace(/\|/g, '\\|')))
    const width = Math.max(0, ...rows.map((r) => r.length))
    if (!width || rows.length < 2) return ''
    const line = (cells) => `| ${Array.from({ length: width }, (_, i) => cells[i] ?? '').join(' | ')} |`
    return `\n\n${line(rows[0])}\n| ${Array(width).fill('---').join(' | ')} |\n${rows.slice(1).map(line).join('\n')}\n\n`
  },
})
turndown.remove(['script', 'style', 'noscript', 'iframe', 'img', 'figure', 'svg', 'button', 'form', 'nav', 'audio', 'video'])

/** MathML to $LaTeX$, kept out of turndown's escaping by placeholders. */
function protectMath(html) {
  const maths = []
  const out = html.replace(/<math\b([^>]*)>([\s\S]*?)<\/math>/gi, (whole, attrs) => {
    const clean = whole.replace(/<annotation-xml[\s\S]*?<\/annotation-xml>/gi, '').replace(/<annotation\b[\s\S]*?<\/annotation>/gi, '')
    let latex = ''
    try {
      latex = normalize(MathMLToLaTeX.convert(clean))
    } catch {
      latex = ''
    }
    if (!latex) return stripTags(clean)
    const display = /display\s*=\s*["']block["']/i.test(attrs)
    maths.push(display ? `\n\n$$${latex}$$\n\n` : `$${latex}$`)
    return `MATHPLACEHOLDER${maths.length - 1}X`
  })
  return { html: out, restore: (md) => md.replace(/MATHPLACEHOLDER(\d+)X/g, (_, i) => maths[Number(i)]) }
}

/** Source HTML to clean Markdown, cut at a paragraph boundary near MAX_SOURCE_WORDS. */
function htmlToMarkdown(html) {
  const { html: safe, restore } = protectMath(html)
  let md = restore(turndown.turndown(safe))
  md = md.replace(/\n{3,}/g, '\n\n').trim()
  const blocks = md.split(/\n{2,}/)
  const kept = []
  let words = 0
  for (const block of blocks) {
    const n = wordCount(block)
    if (words + n > MAX_SOURCE_WORDS && words >= MIN_SOURCE_WORDS) break
    kept.push(block)
    words += n
  }
  return { markdown: kept.join('\n\n'), words }
}

/** Removes parts of a page that are not lesson content. */
function cleanHtml(html, removeSelectors) {
  // A light pass with regexes for the containers both sources use; turndown
  // drops the remaining media and scripts.
  let out = String(html)
  for (const re of removeSelectors) out = out.replace(re, '')
  return out
}

// ── Source: OpenStax (only books under a reusable licence) ────────────────

const OPENSTAX = 'https://openstax.org'
// Which WASSCE subjects each kind of book can serve; the licence check decides whether it is used at all.
const BOOK_SUBJECTS = [
  [/physics/i, ['physics']],
  [/statistic/i, ['mathematics', 'further-mathematics']],
  [/algebra|calculus|precalculus|trigonometry|mathematics/i, ['mathematics', 'further-mathematics']],
  [/chemistry/i, ['chemistry']],
  [/biology|microbiology|anatomy/i, ['biology']],
  [/economics/i, ['economics']],
  [/accounting/i, ['financial-accounting']],
  [/business|management|marketing|entrepreneurship/i, ['business-management', 'commerce']],
  [/computer|information systems|python/i, ['ict-computer-studies']],
]

let openstaxCache = null
async function openstaxBooks() {
  if (openstaxCache) return openstaxCache
  const [cms, release] = await Promise.all([
    getJson(`${OPENSTAX}/apps/cms/api/v2/pages/?type=books.Book&fields=title,cnx_id,book_state,license_url,license_name,authors&limit=250`),
    getJson(`${OPENSTAX}/rex/release.json`),
  ])
  const books = []
  for (const b of cms.items || []) {
    if (!['live', 'new_edition_available'].includes(b.book_state)) continue
    if (!licenceFromUrl(b.license_url)) continue // NonCommercial / NoDerivatives / missing
    const subjects = BOOK_SUBJECTS.find(([re]) => re.test(b.title))?.[1]
    const version = release.books?.[b.cnx_id]?.defaultVersion
    if (!subjects || !version || release.books[b.cnx_id].retired) continue
    books.push({ title: b.title, uuid: b.cnx_id, version, subjects, slug: b.meta?.slug, authors: (b.authors || []).map((a) => a.value?.name || a.name).filter(Boolean) })
  }
  openstaxCache = { books, archive: `${OPENSTAX}${release.archiveUrl}` }
  console.log(`OpenStax: ${books.length} reusable book(s): ${books.map((b) => b.title).join(', ') || 'none'}`)
  return openstaxCache
}

const tocCache = new Map()
async function openstaxSections(book, archive) {
  if (tocCache.has(book.uuid)) return tocCache.get(book.uuid)
  const data = await getJson(`${archive}/contents/${book.uuid}@${book.version}.json`)
  const licence = licenceFromUrl(data.license?.url)
  const sections = []
  const walk = (node) => {
    for (const child of node.contents || []) {
      const title = stripTags(child.title)
      // Numbered sections only ("3.1 Acceleration"), not reviews, key terms or tests.
      if (!child.contents && /^\d+\.\d+\s/.test(title)) sections.push({ id: child.id.split('@')[0], title: title.replace(/^\d+\.\d+\s+/, ''), number: title.split(' ')[0], slug: child.slug })
      if (child.contents) walk(child)
    }
  }
  walk(data.tree || {})
  const result = { licence, licenceEvidence: `${data.license?.name || ''} ${data.license?.url || ''}`.trim(), sections }
  tocCache.set(book.uuid, result)
  return result
}

async function openstaxCandidates(subject, topic) {
  const { books, archive } = await openstaxBooks()
  const out = []
  for (const book of books.filter((b) => b.subjects.includes(subject.slug))) {
    const toc = await openstaxSections(book, archive)
    if (!toc.licence) continue // the archive must agree that the content is reusable
    for (const s of toc.sections) {
      const score = titleMatch(topic.name, s.title)
      if (score >= MATCH_THRESHOLD) out.push({ provider: 'openstax', score, book, toc, section: s, archive })
    }
  }
  return out.sort((a, b) => b.score - a.score).slice(0, 3)
}

const OPENSTAX_REMOVE = [
  /<div[^>]*class="[^"]*os-teacher[^"]*"[\s\S]*?<\/div>\s*<\/div>/gi, // Teacher Support notes
  /<div[^>]*data-type="note"[^>]*class="[^"]*(?:interactive|virtual)[^"]*"[\s\S]*?<\/div>\s*<\/div>/gi,
  /<div[^>]*data-type="media"[\s\S]*?<\/div>/gi,
  /<span[^>]*data-type="media"[\s\S]*?<\/span>/gi,
]

async function openstaxSource(c) {
  const page = await getJson(`${c.archive}/contents/${c.book.uuid}@${c.book.version}:${c.section.id}.json`)
  const html = cleanHtml(page.content || '', OPENSTAX_REMOVE).replace(/<span class="os-teacher">[\s\S]*?<\/span>/gi, '').replace(/\[(?:BL|OL|AL)\]/g, '')
  const { markdown, words } = htmlToMarkdown(html)
  const url = `${OPENSTAX}/books/${c.book.slug}/pages/${c.section.slug}`
  const authors = c.book.authors.length ? ` Authors: ${c.book.authors.slice(0, 4).join(', ')}${c.book.authors.length > 4 ? ' and others' : ''}.` : ''
  return {
    title: `${c.book.title}, ${c.section.number} ${c.section.title}`,
    url,
    licence: c.toc.licence,
    licence_evidence: c.toc.licenceEvidence,
    credit: `OpenStax, ${c.book.title}.${authors} Access for free at ${url}.`,
    markdown,
    word_count: words,
  }
}

// ── Source: Wikibooks ──────────────────────────────────────────────────────

const WIKIBOOKS = 'https://en.wikibooks.org/w/api.php'
const wikiHeaders = () => (process.env.WIKIMEDIA_TOKEN ? { Authorization: `Bearer ${process.env.WIKIMEDIA_TOKEN}` } : {})
let wikiRights = null
let wikiDisabled = false

async function wikibooksRights() {
  if (wikiRights) return wikiRights
  const data = await getJson(`${WIKIBOOKS}?action=query&meta=siteinfo&siprop=rightsinfo&format=json&formatversion=2`, { headers: wikiHeaders() })
  const info = data.query?.rightsinfo || {}
  wikiRights = { licence: licenceFromUrl(info.url), evidence: `${info.text || ''} ${info.url || ''}`.trim() }
  console.log(`Wikibooks licence: ${wikiRights.evidence} -> ${wikiRights.licence ?? 'not reusable'}`)
  return wikiRights
}

async function wikibooksCandidates(subject, topic) {
  if (wikiDisabled) return []
  try {
    const rights = await wikibooksRights()
    if (!rights.licence) return []
    const q = encodeURIComponent(`${topic.name} ${subject.name}`)
    const data = await getJson(`${WIKIBOOKS}?action=query&list=search&srsearch=${q}&srnamespace=0&srlimit=15&format=json&formatversion=2`, { headers: wikiHeaders() })
    const subjectWords = keyTerms(subject.name)
    return (data.query?.search || [])
      .map((r) => {
        const last = r.title.split('/').pop()
        // The page's own name must match the topic; the book path should be about the subject.
        const score = Math.max(titleMatch(topic.name, last), titleMatch(topic.name, r.title) * 0.9)
        const subjectHit = subjectWords.some((w) => keyTerms(r.title).includes(w)) || subject.slug === 'english-language'
        return { provider: 'wikibooks', score: subjectHit ? score : score * 0.8, title: r.title, words: r.wordcount, rights }
      })
      .filter((c) => c.score >= MATCH_THRESHOLD && c.words >= MIN_SOURCE_WORDS)
      .sort((a, b) => b.score - a.score || b.words - a.words)
      .slice(0, 3)
  } catch (error) {
    // Rate limited or unreachable: carry on with the other sources.
    console.warn(`Wikibooks unavailable (${error.message}); skipping it for the rest of this run.`)
    wikiDisabled = true
    return []
  }
}

const WIKI_REMOVE = [
  /<div[^>]*class="[^"]*(?:navbox|noprint|metadata|ambox|toc|thumb|mw-references-wrap|printfooter)[^"]*"[\s\S]*?<\/div>/gi,
  /<table[^>]*class="[^"]*(?:navbox|ambox|metadata|noprint|infobox)[^"]*"[\s\S]*?<\/table>/gi,
  /<sup[^>]*class="[^"]*reference[^"]*"[\s\S]*?<\/sup>/gi,
  /<span class="mw-editsection">[\s\S]*?<\/span>\s*<\/span>/gi,
]

async function wikibooksSource(c) {
  const data = await getJson(`${WIKIBOOKS}?action=parse&page=${encodeURIComponent(c.title)}&prop=text&disableeditsection=1&disabletoc=1&format=json&formatversion=2`, { headers: wikiHeaders() })
  const html = cleanHtml(data.parse?.text || '', WIKI_REMOVE)
  const { markdown, words } = htmlToMarkdown(html)
  const url = `https://en.wikibooks.org/wiki/${encodeURI(c.title.replace(/ /g, '_'))}`
  return {
    title: `Wikibooks: ${c.title.replace(/\//g, ' / ')}`,
    url,
    licence: c.rights.licence,
    licence_evidence: c.rights.evidence,
    credit: `Wikibooks contributors, “${c.title}”. ${url} (page history lists the authors).`,
    markdown,
    word_count: words,
  }
}

// ── Lesson assembly (format required by api/notes-engine/ingest) ───────────

const LICENCE_NAME = { 'CC-BY-4.0': 'CC BY 4.0', 'CC-BY-SA-4.0': 'CC BY-SA 4.0 (ShareAlike)', 'CC0-1.0': 'CC0 1.0' }

function buildLesson(topic, sources) {
  return [
    `# ${topic.name} — WASSCE study notes`,
    '',
    '## Learning objectives',
    '',
    `- Define the key terms used in ${topic.name}.`,
    '- Explain the main ideas, processes or rules, using the examples below.',
    '- Apply them to WASSCE-style questions.',
    '',
    '## Topic overview',
    '',
    `These notes cover ${topic.subject.name}: ${topic.name}, using openly licensed textbook material. Each part names its source and licence.`,
    '',
    ...sources.flatMap((s) => [
      `## ${s.title.replace(/^Wikibooks: /, '')}`,
      '',
      s.markdown,
      '',
      `*Source: ${s.credit} Licence: ${LICENCE_NAME[s.licence] ?? s.licence}. Converted to Markdown and shortened; figures and interactive parts are left out.*`,
      '',
    ]),
    '## WASSCE examination focus',
    '',
    'Practise writing precise definitions, explaining each step of a process in order, comparing related ideas, and supporting answers with examples. For calculations, work through the equations and worked examples above before trying past-question style problems.',
    '',
    '## Sources and reuse licences',
    '',
    ...sources.map((s) => `- [${s.title}](${s.url}): ${LICENCE_NAME[s.licence] ?? s.licence}. Licence evidence: ${s.licence_evidence}.`),
    '',
    'This material may be shared and adapted under the licences above, with the same credit. ShareAlike material must stay under its ShareAlike licence.',
  ].join('\n')
}

/** The same checks api/notes-engine/ingest makes, so one bad lesson never fails the whole batch. */
function passesIngestRules(lesson) {
  const c = lesson.content
  if (c.length > 90000 || wordCount(c) < 500) return 'length'
  if (/<\s*script\b|javascript:|\bon\w+\s*=/i.test(c)) return 'unsafe-pattern'
  for (const s of lesson.sources) {
    if (!c.includes(s.url)) return 'attribution'
    if (s.license === 'CC-BY-SA-4.0' && !/share.?alike|cc by-sa|creativecommons\.org\/licenses\/by-sa\/4\.0/i.test(s.license_evidence)) return 'evidence'
    if (s.license === 'CC-BY-4.0' && !/(?:attribution.*4\.0|cc by 4\.0|creativecommons\.org\/licenses\/by\/4\.0)/i.test(s.license_evidence)) return 'evidence'
  }
  return null
}

// ── Run ────────────────────────────────────────────────────────────────────

async function curriculumGaps() {
  if (process.env.NOTES_GAPS_FILE) return JSON.parse(fs.readFileSync(process.env.NOTES_GAPS_FILE, 'utf8'))
  const secret = process.env.CRON_SECRET
  if (!secret) throw new Error('CRON_SECRET is required.')
  const url = `${CATALOG_URL}${CATALOG_URL.includes('?') ? '&' : '?'}limit=200`
  const response = await fetch(url, { headers: { Authorization: 'Bearer ' + secret }, signal: AbortSignal.timeout(25000) })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || !data.ok) throw new Error('Curriculum catalogue failed (' + response.status + '): ' + JSON.stringify(data).slice(0, 400))
  console.log(`Live curriculum: ${data.subjects} subjects, ${data.topics} topics, ${data.lessons} lessons; ${data.topics_without_lessons} gaps (${(data.gaps || []).length} received).`)
  return data.gaps || []
}

/** Topics in subjects that have a reusable book first, then the rest; a different order each day. */
async function orderGaps(gaps) {
  let served = new Set()
  try {
    served = new Set((await openstaxBooks()).books.flatMap((b) => b.subjects))
  } catch (error) {
    console.warn(`OpenStax unavailable: ${error.message}`)
  }
  const day = Math.floor(Date.now() / 86400000)
  const hash = (s) => [...s].reduce((h, ch) => (h * 31 + ch.charCodeAt(0) + day) % 1000003, 7)
  return [...gaps].sort((a, b) => Number(served.has(b.subject.slug)) - Number(served.has(a.subject.slug)) || hash(a.id) - hash(b.id))
}

async function main() {
  const gaps = await orderGaps(await curriculumGaps())
  if (!gaps.length) {
    console.log(JSON.stringify({ ok: true, discovered: 0, acquired: 0, message: 'No topic gaps remain.' }))
    return
  }
  const acquired = []
  const totals = { tried: 0, matched: 0, rejectedShort: 0, rejectedRules: 0, errors: 0 }
  for (const topic of gaps) {
    if (acquired.length >= MAX_TOPICS || totals.tried >= MAX_ATTEMPTS || Date.now() - started > TIME_BUDGET_MS) break
    totals.tried++
    const candidates = [...(await openstaxCandidates(topic.subject, topic).catch((e) => (console.warn(`OpenStax: ${e.message}`), []))), ...(await wikibooksCandidates(topic.subject, topic))]
    if (!candidates.length) continue
    totals.matched++
    console.log(`Matched ${topic.subject.name} / ${topic.name}: ${candidates.map((c) => `${c.provider} "${c.section?.title ?? c.title}" (${c.score.toFixed(2)})`).join('; ')}`)
    const sources = []
    for (const c of candidates) {
      if (sources.length >= MAX_SOURCES) break
      try {
        const source = c.provider === 'openstax' ? await openstaxSource(c) : await wikibooksSource(c)
        if (source.word_count < MIN_SOURCE_WORDS) {
          totals.rejectedShort++
          continue
        }
        if (sources.some((s) => s.url === source.url)) continue
        sources.push(source)
      } catch (error) {
        totals.errors++
        console.warn(`  could not read ${c.provider} source: ${error.message}`)
      }
    }
    if (!sources.length) continue
    const content = buildLesson(topic, sources)
    const lesson = {
      topic_id: topic.id,
      subject: topic.subject.name,
      topic: topic.name,
      slug: topic.slug + '-open-study-notes',
      title: topic.name + ' — WASSCE study notes',
      content,
      est_minutes: Math.max(8, Math.min(45, Math.ceil(wordCount(content) / 180))),
      sources: sources.map(({ title, url, licence, licence_evidence, word_count }) => ({ title, url, license: licence, license_evidence: licence_evidence, word_count })),
    }
    const problem = passesIngestRules(lesson)
    if (problem) {
      totals.rejectedRules++
      console.log(`  skipped ${topic.name}: fails the ingest rule "${problem}"`)
      continue
    }
    acquired.push(lesson)
    console.log(`  ready: ${topic.name} (${sources.length} source(s), ${wordCount(content)} words)`)
  }

  console.log('Run diagnostics: ' + JSON.stringify({ ...totals, acquired: acquired.length, seconds: Math.round((Date.now() - started) / 1000) }))
  if (!acquired.length) {
    console.log(JSON.stringify({ ok: true, discovered: gaps.length, acquired: 0, message: 'No topic matched a reusable open source this run. No database writes made.' }))
    return
  }
  if (DRY_RUN) {
    if (process.env.DRY_RUN_DIR) {
      fs.mkdirSync(process.env.DRY_RUN_DIR, { recursive: true })
      for (const l of acquired) fs.writeFileSync(path.join(process.env.DRY_RUN_DIR, `${l.slug}.md`), l.content)
    }
    console.log(JSON.stringify({ ok: true, dryRun: true, lessons: acquired.map((l) => ({ topic: `${l.subject} / ${l.topic}`, words: wordCount(l.content), sources: l.sources.map((s) => `${s.title} (${s.license})`) })) }, null, 2))
    return
  }
  const secret = process.env.CRON_SECRET
  if (!secret) throw new Error('CRON_SECRET is required for ingestion.')
  const response = await fetch(INGEST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + secret },
    body: JSON.stringify({ lessons: acquired }),
    signal: AbortSignal.timeout(55000),
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok || !body.ok) throw new Error('Ingestion failed (' + response.status + '): ' + JSON.stringify(body).slice(0, 1400))
  console.log(JSON.stringify({ ok: true, discovered: gaps.length, submitted: acquired.length, ingestion: body }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
