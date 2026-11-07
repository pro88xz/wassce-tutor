import { createClient } from '@supabase/supabase-js'
import crypto from 'node:crypto'

export const config = { maxDuration: 60 }

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'
const WIKIPEDIA_API = 'https://en.wikipedia.org/w/api.php'
const PAGE_SIZE = 500
const MAX_SOURCE_CHARS = 3600
const DEFAULT_BATCH_SIZE = 2
const MAX_BATCH_SIZE = 4

const json = (res, body, status = 200) => res.status(status).setHeader('Cache-Control', 'no-store').json(body)
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex')

function secureEqual(a, b) {
  if (!a || !b) return false
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && crypto.timingSafeEqual(left, right)
}

function getConfig() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  const groq = process.env.GROQ_API_KEY
  const cron = process.env.CRON_SECRET
  if (!url || !key || !groq || !cron) {
    const missing = [
      !url && 'SUPABASE_URL or VITE_SUPABASE_URL',
      !key && 'SUPABASE_SECRET_KEY',
      !groq && 'GROQ_API_KEY',
      !cron && 'CRON_SECRET',
    ].filter(Boolean)
    throw new Error('Missing server environment variables: ' + missing.join(', '))
  }
  const keyIsSecret = key.startsWith('sb_secret_') || (() => {
    try { return JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString()).role === 'service_role' } catch { return false }
  })()
  if (!keyIsSecret) throw new Error('SUPABASE_SECRET_KEY is not a Supabase secret/service_role key.')
  return { url, key, groq, cron }
}

async function fetchAll(queryFactory, label) {
  const rows = []
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const { data, error } = await queryFactory().range(offset, offset + PAGE_SIZE - 1)
    if (error) throw new Error(label + ' query failed: ' + error.message)
    rows.push(...(data || []))
    if (!data || data.length < PAGE_SIZE) return rows
  }
}

async function getCurriculum(db) {
  const [subjects, topics, lessons] = await Promise.all([
    fetchAll(() => db.from('subjects').select('id,name,slug').order('name'), 'subjects'),
    fetchAll(() => db.from('topics').select('id,subject_id,slug,name,description,sort_order').order('id'), 'topics'),
    fetchAll(() => db.from('lessons').select('topic_id,id,title').order('id'), 'lessons'),
  ])
  const subjectById = new Map(subjects.map((subject) => [subject.id, subject]))
  const lessonCounts = new Map()
  for (const lesson of lessons) lessonCounts.set(lesson.topic_id, (lessonCounts.get(lesson.topic_id) || 0) + 1)
  const gaps = topics
    .filter((topic) => (lessonCounts.get(topic.id) || 0) === 0)
    .map((topic) => ({ ...topic, subject: subjectById.get(topic.subject_id) }))
    .filter((topic) => topic.subject)
    .sort((a, b) => a.subject.name.localeCompare(b.subject.name) || a.sort_order - b.sort_order || a.name.localeCompare(b.name))
  return { subjects, topics, lessons, gaps }
}

async function discoverSources(subject, topic) {
  const query = [subject.name, topic.name, 'education'].filter(Boolean).join(' ')
  const searchUrl = new URL(WIKIPEDIA_API)
  searchUrl.search = new URLSearchParams({
    action: 'query', list: 'search', srsearch: query, srlimit: '5',
    srnamespace: '0', format: 'json', origin: '*',
  }).toString()
  const searchResponse = await fetch(searchUrl, {
    headers: { 'User-Agent': 'WASSCETutorContentEngine/1.0 (https://wasscetutor.com; educational research)' },
    signal: AbortSignal.timeout(12000),
  })
  if (!searchResponse.ok) throw new Error('Wikipedia source discovery returned HTTP ' + searchResponse.status)
  const searchData = await searchResponse.json()
  const hits = (searchData.query?.search || []).slice(0, 4)
  if (!hits.length) return []

  const pageIds = hits.map((hit) => hit.pageid).join('|')
  const extractUrl = new URL(WIKIPEDIA_API)
  extractUrl.search = new URLSearchParams({
    action: 'query', pageids: pageIds, prop: 'extracts',
    exintro: '1', explaintext: '1', exchars: String(MAX_SOURCE_CHARS),
    format: 'json', origin: '*',
  }).toString()
  const extractResponse = await fetch(extractUrl, {
    headers: { 'User-Agent': 'WASSCETutorContentEngine/1.0 (https://wasscetutor.com; educational research)' },
    signal: AbortSignal.timeout(12000),
  })
  if (!extractResponse.ok) throw new Error('Wikipedia article retrieval returned HTTP ' + extractResponse.status)
  const extractData = await extractResponse.json()
  return hits.map((hit) => {
    const page = extractData.query?.pages?.[hit.pageid]
    return {
      title: hit.title,
      url: 'https://en.wikipedia.org/?curid=' + hit.pageid,
      extract: String(page?.extract || '').slice(0, MAX_SOURCE_CHARS),
      license: 'CC BY-SA 4.0',
    }
  }).filter((source) => source.extract.length >= 250)
}

function validateLesson(markdown, title) {
  const text = String(markdown || '').trim()
  const wordCount = (text.match(/\b[\p{L}\p{N}][\p{L}\p{N}'’-]*\b/gu) || []).length
  const required = [
    /^#\s+.+/m,
    /^##\s+Learning objectives\s*$/im,
    /^##\s+Explanation\s*$/im,
    /^##\s+WASSCE examination focus\s*$/im,
    /^##\s+Worked example\s*$/im,
    /^##\s+Try it yourself\s*$/im,
    /^##\s+Answers\s*$/im,
    /^##\s+Sources\s*$/im,
  ]
  if (wordCount < 350 || wordCount > 1200) throw new Error('Generated lesson word count outside 350–1,200 (' + wordCount + ')')
  if (!text.startsWith('# ' + title)) throw new Error('Generated lesson title does not match the requested topic')
  if (required.some((pattern) => !pattern.test(text))) throw new Error('Generated lesson is missing one or more required teaching sections')
  if (!/\*\*Question\s*1\*\*/i.test(text) || !/\*\*Question\s*2\*\*/i.test(text)) throw new Error('Generated lesson must include two practice questions')
  if (/<\s*script\b|javascript:|\bon\w+\s*=/i.test(text)) throw new Error('Generated lesson contains disallowed active content')
  return { content: text, wordCount }
}

async function generateLesson(groqKey, subject, topic, sources) {
  if (!sources.length) throw new Error('No usable online reference material was found; topic left untouched.')
  const title = topic.name + ': WASSCE study notes'
  const sourceContext = sources.map((source, index) =>
    '[' + (index + 1) + '] ' + source.title + '\nURL: ' + source.url + '\nLicence: ' + source.license + '\n' + source.extract
  ).join('\n\n')
  const prompt = `Create a complete, independently written WASSCE lesson for a Form 5 student in Sierra Leone.

SUBJECT: ${subject.name}
CURRICULUM TOPIC: ${topic.name}
TOPIC DESCRIPTION: ${topic.description || 'Use the recognised WASSCE scope for this topic.'}
LESSON TITLE: ${title}

RESEARCH MATERIAL (use to verify facts, not to copy wording):
${sourceContext}

CONTENT REQUIREMENTS:
- Write 500–850 words in clear, precise English suitable for Sierra Leonean secondary students.
- Teach the actual curriculum topic, not generic study advice.
- Start with an H1 exactly matching the lesson title.
- Use these H2 sections in this order: Learning objectives; Explanation; Worked example; WASSCE examination focus; Try it yourself; Answers; Sources.
- Explain key terms, principles, classifications, causes/effects or processes relevant to this topic.
- Include concrete examples. For Mathematics, Physics and Chemistry, show complete correct working with KaTeX. For other subjects, include an applicable worked/analysed example.
- Include exactly two meaningful WASSCE-style practice questions and fully worked/explained answers.
- Do not invent syllabus claims, statistics, quotations, experiments or source details. If a detail cannot be verified, omit it.
- Use original wording. Do not copy sentences or paragraphs from the research extracts.
- Sources must list the exact supplied article titles and URLs and state that Wikipedia material is licensed CC BY-SA 4.0.
- Return only Markdown. No preamble or JSON.`

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + groqKey },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: 'You are a rigorous WASSCE curriculum author and subject teacher. Factual accuracy and worked reasoning take priority over style.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.25,
      max_tokens: 3000,
    }),
    signal: AbortSignal.timeout(35000),
  })
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 500)
    throw new Error('Groq generation failed (' + response.status + '): ' + detail)
  }
  const data = await response.json()
  const markdown = data.choices?.[0]?.message?.content?.trim()
  if (!markdown) throw new Error('Groq returned an empty lesson.')
  return validateLesson(markdown, title)
}

async function processTopic(db, groqKey, topic) {
  const sources = await discoverSources(topic.subject, topic)
  const lesson = await generateLesson(groqKey, topic.subject, topic, sources)
  const slug = topic.slug + '-complete-notes'
  const record = {
    topic_id: topic.id,
    slug,
    title: topic.name + ': WASSCE study notes',
    content: lesson.content,
    est_minutes: Math.max(8, Math.min(30, Math.ceil(lesson.wordCount / 180))),
    sort_order: 0,
    is_published: true,
    is_public: false,
    reviewed_at: null,
    reviewed_by: null,
  }
  const { data, error } = await db.from('lessons').insert(record).select('id').single()
  if (error) {
    if (error.code === '23505') return { status: 'skipped', topic: topic.name, reason: 'A lesson was created concurrently; no duplicate inserted.' }
    throw new Error('Supabase insert failed for ' + topic.subject.name + ' / ' + topic.name + ': ' + error.message)
  }
  return {
    status: 'created',
    topic: topic.name,
    subject: topic.subject.name,
    lesson_id: data.id,
    words: lesson.wordCount,
    sources: sources.map(({ title, url, license }) => ({ title, url, license })),
    content_sha256: sha256(lesson.content),
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') return json(res, { error: 'Method not allowed' }, 405)
  let settings
  try { settings = getConfig() } catch (error) { return json(res, { error: error.message }, 503) }
  const authorization = req.headers.authorization || ''
  const supplied = authorization.startsWith('Bearer ') ? authorization.slice(7) : req.headers['x-cron-secret']
  if (!secureEqual(String(supplied || ''), settings.cron)) return json(res, { error: 'Unauthorised' }, 401)

  const requested = Number(req.query?.limit || DEFAULT_BATCH_SIZE)
  const limit = Number.isFinite(requested) ? Math.max(1, Math.min(MAX_BATCH_SIZE, Math.floor(requested))) : DEFAULT_BATCH_SIZE
  const db = createClient(settings.url, settings.key, { auth: { persistSession: false, autoRefreshToken: false } })

  try {
    const curriculum = await getCurriculum(db)
    if (!curriculum.gaps.length) {
      return json(res, { ok: true, message: 'All curriculum topics currently have at least one lesson.', subjects: curriculum.subjects.length, topics: curriculum.topics.length, topics_without_lessons: 0, created: 0, remaining: 0, results: [] })
    }
    const selected = curriculum.gaps.slice(0, limit)
    const results = []
    for (const topic of selected) {
      try { results.push(await processTopic(db, settings.groq, topic)) }
      catch (error) {
        results.push({ status: 'failed', subject: topic.subject.name, topic: topic.name, error: error instanceof Error ? error.message : String(error) })
      }
    }
    const created = results.filter((item) => item.status === 'created').length
    return json(res, {
      ok: results.every((item) => item.status !== 'failed'),
      model: GROQ_MODEL,
      subjects: curriculum.subjects.length,
      topics: curriculum.topics.length,
      topics_without_lessons_before_run: curriculum.gaps.length,
      attempted: selected.length,
      created,
      failed: results.filter((item) => item.status === 'failed').length,
      remaining_estimate: Math.max(0, curriculum.gaps.length - created),
      results,
    }, results.some((item) => item.status === 'failed') ? 207 : 200)
  } catch (error) {
    console.error('[notes-engine] run failed:', error)
    return json(res, { error: error instanceof Error ? error.message : 'Engine failed' }, 500)
  }
}
