#!/usr/bin/env node
// Automated live acquisition is triggered on crawler changes to main.
import { chromium } from 'playwright'

const MAX_TOPICS = Math.max(1, Math.min(3, Number(process.env.TOPIC_LIMIT || 3) || 3))
const MAX_SOURCES = 2
const MIN_SOURCE_WORDS = 450
const MAX_SOURCE_WORDS = 2600
const CATALOG_URL = process.env.NOTES_CATALOG_URL || 'https://wasscetutor.com/api/notes-engine/catalog'
const INGEST_URL = process.env.NOTES_INGEST_URL || 'https://wasscetutor.com/api/notes-engine/ingest'
const HOSTS = new Set([
  'openstax.org', 'wikibooks.org', 'siyavula.com', 'libretexts.org',
  'pressbooks.pub', 'opentextbc.ca', 'open.umn.edu', 'oercommons.org',
  'open.oregonstate.education', 'ecampusontario.pressbooks.pub', 'open.umn.edu/opentextbooks',
  'open.lib.umn.edu', 'open textbooklibrary.org', 'oer.galileo.usg.edu',
])
const LICENSES = [
  { id: 'CC-BY-SA-4.0', re: /(?:Creative Commons Attribution-ShareAlike 4\.0|CC BY-SA 4\.0)/i },
  { id: 'CC-BY-4.0', re: /(?:Creative Commons Attribution 4\.0|CC BY 4\.0)/i },
  { id: 'CC0-1.0', re: /(?:CC0 1\.0|CC0 Public Domain Dedication)/i },
  { id: 'PUBLIC-DOMAIN', re: /(?:public domain dedication|dedicated to the public domain|public domain work)/i },
]
const normalize = value => String(value ?? '').replace(/\s+/g, ' ').trim()
const wordCount = value => (String(value).match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || []).length
const allowedUrl = value => {
  try {
    const url = new URL(value)
    const host = url.hostname.toLowerCase()
    const approved = [...HOSTS].some(root => host === root || host.endsWith('.' + root))
    return url.protocol === 'https:' && approved ? url.href : null
  } catch { return null }
}
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function curriculumGaps() {
  const secret = process.env.CRON_SECRET
  if (!secret) throw new Error('CRON_SECRET is required.')
  const response = await fetch(CATALOG_URL, { headers: { Authorization: 'Bearer ' + secret }, signal: AbortSignal.timeout(25000) })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || !data.ok) throw new Error('Curriculum catalogue failed (' + response.status + '): ' + JSON.stringify(data).slice(0, 800))
  console.log('Live curriculum: ' + data.subjects + ' subjects, ' + data.topics + ' topics, ' + data.lessons + ' lessons; ' + data.topics_without_lessons + ' gaps.')
  return data.gaps || []
}

function queriesFor(subject, topic) {
  const phrase = '"' + topic.name + '"'
  return [
    phrase + ' ' + subject.name + ' open textbook',
    topic.name + ' ' + subject.name + ' OER CC BY educational resource',
    topic.name + ' site:openstax.org OR site:libretexts.org OR site:wikibooks.org OR site:open.umn.edu',
    topic.name + ' site:pressbooks.pub OR site:opentextbc.ca OR site:oercommons.org OR site:siyavula.com',
  ]
}

function unwrapSearchHref(href) {
  try {
    let url = new URL(href)
    if (url.hostname === 'www.google.com' && url.pathname === '/url') {
      const target = url.searchParams.get('q') || url.searchParams.get('url')
      if (target) url = new URL(target)
    } else if (url.hostname.endsWith('duckduckgo.com')) {
      const target = url.searchParams.get('uddg')
      if (target) url = new URL(target)
    } else if (url.hostname.endsWith('bing.com') && url.pathname === '/ck/a') {
      const encoded = url.searchParams.get('u')
      if (encoded) {
        const decoded = Buffer.from(encoded.replace(/^a1/, ''), 'base64').toString('utf8')
        if (decoded.startsWith('http://') || decoded.startsWith('https://')) url = new URL(decoded)
      }
    }
    return url.href
  } catch { return null }
}

async function searchResults(browser, subject, topic) {
  const found = new Set()
  const diagnostics = {}
  const queries = queriesFor(subject, topic)
  const providers = [
    { name: 'Google', url: q => 'https://www.google.com/search?udm=14&q=' + encodeURIComponent(q), selector: 'a[href]' },
    { name: 'Bing', url: q => 'https://www.bing.com/search?q=' + encodeURIComponent(q), selector: 'li.b_algo a[href], #b_results a[href]' },
    { name: 'DuckDuckGo', url: q => 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(q), selector: 'a.result__a, .result__body a[href]' },
    { name: 'Brave', url: q => 'https://search.brave.com/search?q=' + encodeURIComponent(q), selector: 'a[href]' },
    { name: 'Yahoo', url: q => 'https://search.yahoo.com/search?p=' + encodeURIComponent(q), selector: 'a[href]' },
  ]
  for (let qi = 0; qi < queries.length; qi++) {
    for (const provider of providers) {
      if (found.size >= 24) break
      let page
      try {
        page = await browser.newPage()
        await page.goto(provider.url(queries[qi]), { waitUntil: 'domcontentloaded', timeout: 12000 })
        await page.waitForTimeout(450)
        const result = await page.locator('a[href]').evaluateAll((nodes, selector) => {
          const selected = [...document.querySelectorAll(selector)]
          return {
            title: document.title || '',
            url: location.href,
            body: (document.body?.innerText || '').slice(0, 500),
            anchors: nodes.length,
            selected: selected.map(node => ({ href: node.href, text: (node.innerText || node.getAttribute('aria-label') || '').trim().slice(0, 180) })).filter(item => item.href),
          }
        }, provider.selector)
        const raw = result.selected.length
        let accepted = 0
        for (const item of result.selected) {
          const target = unwrapSearchHref(item.href)
          const approved = target && allowedUrl(target)
          if (approved) { found.add(approved); accepted++ }
        }
        const key = provider.name
        diagnostics[key] ||= { attempts: 0, rawLinks: 0, approvedLinks: 0, errors: 0, lastTitle: '', samples: [] }
        diagnostics[key].attempts++
        diagnostics[key].rawLinks += raw
        diagnostics[key].approvedLinks += accepted
        diagnostics[key].lastTitle = result.title
        diagnostics[key].samples = result.selected.slice(0, 6).map(item => ({ href: item.href.slice(0, 260), text: item.text.slice(0, 100) }))
      } catch (error) {
        diagnostics[provider.name] ||= { attempts: 0, rawLinks: 0, approvedLinks: 0, errors: 0, lastTitle: '' }
        diagnostics[provider.name].attempts++
        diagnostics[provider.name].errors++
        console.warn(provider.name + ' search error: ' + String(error.message).slice(0, 180))
      } finally {
        if (page) await page.close().catch(() => {})
      }
    }
  }
  console.log('Search diagnostics [' + subject.name + ' / ' + topic.name + ']: ' + JSON.stringify({
    queries: queries.length, approvedCandidates: found.size, providers: diagnostics,
  }))
  return [...found].slice(0, 24)
}

async function extractPage(browser, url) {
  const page = await browser.newPage({ userAgent: 'WASSCETutorResearchBot/1.1 (+https://wasscetutor.com/contact)' })
  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
    if (!response) return { rejected: 'no-response' }
    if (!response.ok()) return { rejected: 'http-' + response.status() }
    await sleep(350)
    const pageData = await page.evaluate(() => {
      const selectors = ['main', 'article', '[role="main"]', '.mw-parser-output', '#main-content', '.chapter-content', '.book-content']
      let root = null
      for (const selector of selectors) {
        const candidate = document.querySelector(selector)
        if (candidate && (candidate.innerText || '').length > 700) { root = candidate; break }
      }
      root ||= document.body
      const clone = root.cloneNode(true)
      clone.querySelectorAll('nav,header,footer,aside,script,style,form,button,svg,figure,iframe,[role="navigation"],.toc,.mw-editsection,.advertisement').forEach(node => node.remove())
      const metas = [...document.querySelectorAll('meta')].map(meta => ({
        name: meta.getAttribute('name') || meta.getAttribute('property') || '',
        content: meta.getAttribute('content') || '',
      })).filter(item => /license|licence|rights|dc\.rights|dcterms\.license/i.test(item.name))
      const licenseLinks = [...document.querySelectorAll('a[rel~="license"], link[rel~="license"], a[href*="creativecommons.org/licenses"], a[href*="creativecommons.org/publicdomain"]')].map(node => ({
        href: node.href, text: node.innerText || node.getAttribute('aria-label') || '',
      }))
      const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')].map(node => node.textContent || '').join('\n')
      const title = document.querySelector('h1')?.innerText || document.title
      return {
        title, text: clone.innerText || '',
        headings: [...clone.querySelectorAll('h2,h3')].map(node => node.innerText.trim()).filter(Boolean).slice(0, 35),
        visible: document.body.innerText || '', metas, licenseLinks, jsonLd,
      }
    })
    const licenceText = [
      pageData.visible,
      ...pageData.metas.map(x => x.name + ' ' + x.content),
      ...pageData.licenseLinks.map(x => x.href + ' ' + x.text),
      pageData.jsonLd,
    ].join('\n')
    let licence = null
    let evidence = ''
    for (const candidate of LICENSES) {
      const match = licenceText.match(candidate.re)
      if (match) { licence = candidate.id; evidence = match[0]; break }
    }
    if (!licence) {
      const link = pageData.licenseLinks.find(item => /creativecommons\.org\/(licenses\/by(?:-sa)?\/4\.0|publicdomain\/zero\/1\.0)/i.test(item.href))
      if (link) {
        const href = link.href.toLowerCase()
        if (/licenses\/by-sa\/4\.0/.test(href)) licence = 'CC-BY-SA-4.0'
        else if (/licenses\/by\/4\.0/.test(href)) licence = 'CC-BY-4.0'
        else if (/publicdomain\/zero\/1\.0/.test(href)) licence = 'CC0-1.0'
        evidence = link.href
      }
    }
    if (!licence) return { rejected: 'licence-not-verifiable' }
    const clean = pageData.text.replace(/\n{3,}/g, '\n\n').split('\n').map(line => line.trim()).filter(Boolean).join('\n\n')
    const words = wordCount(clean)
    if (words < MIN_SOURCE_WORDS) return { rejected: 'insufficient-text-' + words }
    const clipped = clean.split(/\s+/).slice(0, MAX_SOURCE_WORDS).join(' ')
    return {
      source: {
        title: normalize(pageData.title).slice(0, 180), url, licence, licence_evidence: evidence,
        text: clipped, headings: pageData.headings, word_count: Math.min(words, MAX_SOURCE_WORDS),
      },
    }
  } catch (error) {
    return { rejected: 'fetch-error-' + error.message.slice(0, 100) }
  } finally { await page.close() }
}

function relevanceScore(source, topic, subject) {
  const terms = (topic.name + ' ' + subject.name).toLowerCase().split(/[^a-z0-9]+/).filter(term => term.length > 3)
  const haystack = (source.title + ' ' + source.headings.join(' ') + ' ' + source.text.slice(0, 12000)).toLowerCase()
  return terms.reduce((score, term) => score + (haystack.includes(term) ? 1 : 0), 0)
}

function buildLesson(topic, sources) {
  const objectives = [
    'Define the principal terms and concepts associated with ' + topic.name + '.',
    'Explain the processes, principles or classifications relevant to this topic using evidence from the cited learning material.',
    'Apply the explanations and examples to structured WASSCE-style questions.',
  ]
  const sections = sources.map(source => [
    '## ' + source.title, '',
    '**Key source headings**', '',
    ...(source.headings.length ? source.headings.map(heading => '- ' + heading) : ['The source presents the material in explanatory sections.']),
    '', '**Openly licensed source material**', '', source.text, '',
    '**Attribution:** ' + source.title + '. ' + source.url + '. Licence: ' + source.licence + '.',
  ].join('\n'))
  return [
    '# ' + topic.name + ' — WASSCE study notes', '',
    '## Learning objectives', '', ...objectives.map(item => '- ' + item), '',
    '## Topic overview', '',
    'This study resource is mapped to ' + topic.subject.name + ' — ' + topic.name + '. Read the cited explanations carefully and use the source headings to organise revision. Source material is reproduced under the stated open licence; attribution and licence evidence are retained below.', '',
    ...sections, '',
    '## WASSCE examination focus', '',
    'After studying the source material, practise writing precise definitions, explaining each stage of a process in sequence, comparing related concepts, and supporting answers with relevant examples. For numerical or diagram-based content, work directly from the equations, worked examples and labelled figures in the cited source. Do not assume a source covers a syllabus subtopic unless it is present in the material above.', '',
    '## Sources and reuse licences', '',
    ...sources.map(source => '- [' + source.title + '](' + source.url + ') — ' + source.licence + '; licence evidence: ' + source.licence_evidence + '.'),
    '', 'Check the source licence before adapting this resource further. ShareAlike material must retain its applicable ShareAlike terms.',
  ].join('\n')
}

async function main() {
  const gaps = await curriculumGaps()
  if (!gaps.length) {
    console.log(JSON.stringify({ ok: true, discovered: 0, acquired: 0, message: 'No topic gaps remain.' }))
    return
  }
  const browser = await chromium.launch({ headless: true })
  const acquired = []
  const totals = { candidates: 0, rejectedLicence: 0, rejectedShort: 0, rejectedOther: 0, rejectedIrrelevant: 0 }
  try {
    for (const topic of gaps) {
      if (acquired.length >= MAX_TOPICS) break
      console.log('Searching: ' + topic.subject.name + ' / ' + topic.name)
      const urls = await searchResults(browser, topic.subject, topic)
      totals.candidates += urls.length
      const accepted = []
      const rejections = {}
      for (const url of urls) {
        if (accepted.length >= MAX_SOURCES) break
        const result = await extractPage(browser, url)
        if (!result.source) {
          const reason = result.rejected || 'unknown'
          rejections[reason] = (rejections[reason] || 0) + 1
          if (reason === 'licence-not-verifiable') totals.rejectedLicence++
          else if (reason.startsWith('insufficient-text')) totals.rejectedShort++
          else totals.rejectedOther++
          continue
        }
        const score = relevanceScore(result.source, topic, topic.subject)
        if (score < 1) {
          totals.rejectedIrrelevant++
          rejections['topic-relevance-too-low'] = (rejections['topic-relevance-too-low'] || 0) + 1
          continue
        }
        accepted.push(result.source)
      }
      console.log('Candidate outcomes for ' + topic.name + ': ' + JSON.stringify(rejections) + '; eligible=' + accepted.length)
      if (!accepted.length) {
        console.log('No source met licence, length and relevance checks; gap remains untouched: ' + topic.name)
        continue
      }
      const content = buildLesson(topic, accepted)
      if (wordCount(content) < 500) {
        console.log('Quality gate rejected assembled lesson (<500 words): ' + topic.name)
        continue
      }
      acquired.push({
        topic_id: topic.id, subject: topic.subject.name, topic: topic.name,
        slug: topic.slug + '-open-study-notes',
        title: topic.name + ' — WASSCE study notes',
        content,
        est_minutes: Math.max(8, Math.min(45, Math.ceil(wordCount(content) / 180))),
        sources: accepted.map(({ title, url, licence, licence_evidence, word_count }) => ({
          title, url, license: licence, license_evidence: licence_evidence, word_count,
        })),
      })
      console.log('Qualified ' + topic.name + ': ' + accepted.length + ' source(s), ' + accepted.reduce((sum, source) => sum + source.word_count, 0) + ' source words.')
    }
  } finally {
    await browser.close()
  }
  console.log('Run diagnostics: ' + JSON.stringify(totals))
  if (!acquired.length) {
    console.log(JSON.stringify({ ok: true, discovered: gaps.length, candidates: totals.candidates, acquired: 0, diagnostics: totals, message: 'No lesson passed all safeguards. No database writes made.' }))
    return
  }
  const secret = process.env.CRON_SECRET
  if (!secret) throw new Error('CRON_SECRET is required for Supabase ingestion.')
  const response = await fetch(INGEST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + secret },
    body: JSON.stringify({ lessons: acquired }),
    signal: AbortSignal.timeout(55000),
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok || !body.ok) throw new Error('Supabase ingestion failed (' + response.status + '): ' + JSON.stringify(body).slice(0, 1400))
  console.log(JSON.stringify({ ok: true, discovered: gaps.length, submitted: acquired.length, ingestion: body }, null, 2))
}

main().catch(error => { console.error(error); process.exitCode = 1 })
