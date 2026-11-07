#!/usr/bin/env node
import { chromium } from 'playwright'

const PAGE_SIZE = 500
const MAX_TOPICS_PER_RUN = Number(process.env.TOPIC_LIMIT || 3)
const MAX_SOURCES_PER_TOPIC = 2
const MAX_CONTENT_WORDS = 7000
const INGEST_URL = process.env.NOTES_INGEST_URL || 'https://wasscetutor.com/api/notes-engine/ingest'
const ALLOWED_HOSTS = new Set([
  'openstax.org', 'www.openstax.org',
  'en.wikibooks.org', 'www.wikibooks.org',
  'siyavula.com', 'www.siyavula.com',
])
const LICENSES = [
  { re: /Creative Commons Attribution-ShareAlike 4\.0|CC BY-SA 4\.0/i, id: 'CC-BY-SA-4.0' },
  { re: /Creative Commons Attribution 4\.0|CC BY 4\.0/i, id: 'CC-BY-4.0' },
  { re: /CC0 1\.0|CC0 Public Domain Dedication/i, id: 'CC0-1.0' },
  { re: /public domain/i, id: 'PUBLIC-DOMAIN' },
]
const normalize = (s) => String(s ?? '').replace(/\s+/g, ' ').trim()
const countWords = (s) => (s.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || []).length
const safeUrl = (value) => {
  try {
    const u = new URL(value)
    return u.protocol === 'https:' && ALLOWED_HOSTS.has(u.hostname) ? u.href : null
  } catch { return null }
}

async function restRows(base, key, table, select) {
  const rows = []
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const url = new URL('/rest/v1/' + table, base)
    url.searchParams.set('select', select)
    url.searchParams.set('order', 'id')
    const res = await fetch(url, {
      headers: { apikey: key, Authorization: 'Bearer ' + key, Range: offset + '-' + (offset + PAGE_SIZE - 1), 'Range-Unit': 'items' },
      signal: AbortSignal.timeout(20000),
    })
    if (!res.ok) throw new Error('Supabase ' + table + ' read failed (' + res.status + '): ' + (await res.text()).slice(0, 300))
    const batch = await res.json()
    rows.push(...batch)
    if (batch.length < PAGE_SIZE) return rows
  }
}

async function curriculum() {
  const base = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY
  if (!base || !key) throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY are required for read-only curriculum discovery.')
  const [subjects, topics, lessons] = await Promise.all([
    restRows(base, key, 'subjects', 'id,name,slug'),
    restRows(base, key, 'topics', 'id,subject_id,slug,name,description,sort_order'),
    restRows(base, key, 'lessons', 'id,topic_id'),
  ])
  const byId = new Map(subjects.map(s => [s.id, s]))
  const counts = new Map()
  for (const l of lessons) counts.set(l.topic_id, (counts.get(l.topic_id) || 0) + 1)
  return topics.filter(t => !counts.has(t.id) || counts.get(t.id) === 0)
    .map(t => ({ ...t, subject: byId.get(t.subject_id) }))
    .filter(t => t.subject)
    .sort((a,b) => a.subject.name.localeCompare(b.subject.name) || (a.sort_order ?? 0) - (b.sort_order ?? 0))
}

async function searchResults(page, subject, topic) {
  const query = encodeURIComponent('"' + topic.name + '" ' + subject.name + ' textbook open textbook')
  const searchUrl = 'https://www.google.com/search?q=' + query
  await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 25000 })
  await page.waitForTimeout(1200)
  const links = await page.locator('a[href]').evaluateAll(els => els.map(a => a.href))
  const seen = new Set()
  return links.map(safeUrl).filter(url => {
    if (!url || seen.has(url)) return false
    seen.add(url)
    return true
  }).slice(0, 18)
}

async function extractSource(browser, url) {
  const page = await browser.newPage({ userAgent: 'WASSCETutorResearchBot/1.0 (+https://wasscetutor.com/contact)' })
  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
    if (!response || !response.ok()) return null
    await page.waitForTimeout(500)
    const extracted = await page.evaluate(() => {
      const selectors = ['main', 'article', '[role="main"]', '.mw-parser-output', '#main-content', '.chapter-content']
      let root = null
      for (const selector of selectors) {
        const candidate = document.querySelector(selector)
        if (candidate && (candidate.innerText || '').length > 800) { root = candidate; break }
      }
      root ||= document.body
      const clone = root.cloneNode(true)
      clone.querySelectorAll('nav,header,footer,aside,script,style,form,button,svg,figure,iframe,[role="navigation"],.toc,.mw-editsection').forEach(n => n.remove())
      const title = document.querySelector('h1')?.innerText || document.title
      const text = clone.innerText || ''
      const headings = [...clone.querySelectorAll('h2,h3')].map(h => h.innerText.trim()).filter(Boolean).slice(0, 40)
      return { title, text, headings, visible: document.body.innerText || '' }
    })
    const license = LICENSES.find(x => x.re.test(extracted.visible))
    if (!license) return null
    const content = extracted.text.replace(/\n{3,}/g, '\n\n').split('\n').map(x => x.trim()).filter(Boolean).join('\n\n')
    const words = countWords(content)
    if (words < 450) return null
    return {
      title: normalize(extracted.title).slice(0, 180),
      url,
      license: license.id,
      license_evidence: license.re.source,
      text: content.split(/\s+/).slice(0, MAX_CONTENT_WORDS).join(' '),
      headings: extracted.headings,
      word_count: Math.min(words, MAX_CONTENT_WORDS),
    }
  } finally { await page.close() }
}

function buildLesson(topic, sources) {
  const title = topic.name + ' — WASSCE study notes'
  const sections = sources.map((s, i) => {
    const headings = s.headings.length ? s.headings.map(h => '- ' + h).join('\n') : 'The source is organised into explanatory paragraphs.'
    return [
      '## ' + s.title,
      '',
      '**Source structure**',
      headings,
      '',
      '**Extracted educational material**',
      '',
      s.text,
      '',
      '**Attribution:** ' + s.title + '. ' + s.url + '. Licence: ' + s.license + '.',
    ].join('\n')
  })
  const objectives = [
    'Identify and explain the principal concepts covered by the source material for ' + topic.name + '.',
    'Use the definitions, explanations and examples in the lesson to answer topic-specific examination questions.',
    'Distinguish the key terms and processes presented in the source material.',
  ]
  return [
    '# ' + title,
    '',
    '## Learning objectives',
    '',
    ...objectives.map(x => '- ' + x),
    '',
    '## Topic overview',
    '',
    'This lesson is mapped to the ' + topic.subject.name + ' curriculum topic **' + topic.name + '**. The sections below are extracted from openly licensed educational references and arranged for topic-based study. The source wording is retained where required by the applicable open licence; attribution and licence details are provided with each source.',
    '',
    ...sections,
    '',
    '## WASSCE examination focus',
    '',
    'Use the definitions, labelled processes, classifications, formulae and worked explanations in the source sections to prepare written responses. Practise defining technical terms accurately, showing each stage of calculations where applicable, and explaining cause-and-effect relationships rather than listing keywords.',
    '',
    '## Sources and reuse licences',
    '',
    ...sources.map(s => '- [' + s.title + '](' + s.url + ') — ' + s.license + ' (retrieved ' + new Date().toISOString().slice(0,10) + ').'),
    '',
    'This material is provided with the source attribution and licence notices shown above. Adaptations of ShareAlike-licensed material must retain the applicable ShareAlike terms.',
  ].join('\n')
}

async function main() {
  const gaps = await curriculum()
  if (!gaps.length) {
    console.log(JSON.stringify({ ok: true, message: 'No topics currently have zero lesson records.', created: 0 }))
    return
  }
  const browser = await chromium.launch({ headless: true })
  const searchPage = await browser.newPage()
  const acquired = []
  try {
    for (const topic of gaps) {
      if (acquired.length >= MAX_TOPICS_PER_RUN) break
      console.log('Searching: ' + topic.subject.name + ' / ' + topic.name)
      let urls = []
      try { urls = await searchResults(searchPage, topic.subject, topic) }
      catch (e) { console.error('Search failed for ' + topic.name + ': ' + e.message); continue }
      const sources = []
      for (const url of urls) {
        if (sources.length >= MAX_SOURCES_PER_TOPIC) break
        try {
          const source = await extractSource(browser, url)
          if (source) sources.push(source)
        } catch (e) { console.error('Source fetch failed: ' + url + ' — ' + e.message) }
      }
      if (!sources.length) {
        console.log('No eligible openly licensed source found; leaving gap untouched: ' + topic.name)
        continue
      }
      const content = buildLesson(topic, sources)
      const words = countWords(content)
      if (words < 500) {
        console.log('Insufficient extracted material; leaving gap untouched: ' + topic.name)
        continue
      }
      acquired.push({
        topic_id: topic.id,
        subject: topic.subject.name,
        topic: topic.name,
        slug: topic.slug + '-open-study-notes',
        title: topic.name + ' — WASSCE study notes',
        content,
        est_minutes: Math.max(8, Math.min(45, Math.ceil(words / 180))),
        sources: sources.map(({ title, url, license, license_evidence, word_count }) => ({ title, url, license, license_evidence, word_count })),
      })
      console.log('Acquired ' + words + ' words from ' + sources.length + ' licensed source(s) for ' + topic.name)
    }
  } finally {
    await searchPage.close()
    await browser.close()
  }

  if (!acquired.length) {
    console.log(JSON.stringify({ ok: true, discovered: gaps.length, acquired: 0, message: 'No source passed the licence and content thresholds; no database writes made.' }))
    return
  }
  const secret = process.env.CRON_SECRET
  if (!secret) throw new Error('CRON_SECRET is required to submit the acquired lessons to the server-side Supabase writer.')
  const response = await fetch(INGEST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + secret },
    body: JSON.stringify({ lessons: acquired }),
    signal: AbortSignal.timeout(55000),
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error('Supabase ingestion endpoint failed (' + response.status + '): ' + JSON.stringify(body).slice(0, 1200))
  console.log(JSON.stringify({ ok: true, discovered: gaps.length, submitted: acquired.length, ingestion: body }, null, 2))
}

main().catch(error => { console.error(error); process.exitCode = 1 })
