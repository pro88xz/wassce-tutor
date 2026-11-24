// Build-time list of data-driven public pages (/wassce/... and /tutors/...), with sitemap lastmod.
// Used by vite.config.ts to tell TanStack Start what to prerender. Reads the
// same public tables/views as src/lib/public-content.ts, over plain REST with
// the publishable key, and applies the same rules (src/lib/public-rules.ts).
import { hasQuestionsPageByCount, hasSubjectPage, hasTopicPageByCount, keyTermsPath, lessonPath, questionsPath, subjectPath, topicPath, tutorsPath } from '../src/lib/public-rules'
import { hasKeyTermsByCount, topicKeyTerms } from '../src/lib/key-terms'

export type PageEntry = { path: string; lastmod: string }

type Row = Record<string, string>

// The API returns at most 1,000 rows per request (Supabase's default), so
// read every table a page at a time: more than 1,000 lessons or questions
// must never silently drop pages from the sitemap.
const PAGE = 1000
// Public reads run under a short statement timeout. A page of full lesson
// text is several megabytes (1,000 lessons took about 2 s and timed out a
// build), so content-heavy views are read in small pages.
const PAGE_SIZE: Record<string, number> = { wassce_public_lessons: 100, wassce_public_questions: 500 }
const ATTEMPTS = 4

async function fetchPage(url: string, key: string, table: string, select: string, from: number, size: number): Promise<Row[]> {
  for (let attempt = 1; ; attempt++) {
    let failure: string
    try {
      const res = await fetch(`${url}/rest/v1/${table}?select=${select}&order=id`, {
        headers: { apikey: key, Authorization: `Bearer ${key}`, Range: `${from}-${from + size - 1}` },
      })
      if (res.ok) return (await res.json()) as Row[]
      failure = `HTTP ${res.status} ${await res.text()}`
      // A 4xx other than a rate limit will not succeed on a retry.
      if (res.status < 500 && res.status !== 429) throw new Error(`[public-page-list] ${table}: ${failure}`)
    } catch (e) {
      if (e instanceof Error && e.message.startsWith('[public-page-list]')) throw e
      failure = String(e)
    }
    if (attempt >= ATTEMPTS) throw new Error(`[public-page-list] ${table}: ${failure} (after ${ATTEMPTS} attempts)`)
    await new Promise((r) => setTimeout(r, 1000 * 2 ** (attempt - 1)))
  }
}

async function get(url: string, key: string, table: string, select: string): Promise<Row[]> {
  const size = PAGE_SIZE[table] ?? PAGE
  const rows: Row[] = []
  for (let from = 0; ; from += size) {
    const page = await fetchPage(url, key, table, select, from, size)
    rows.push(...page)
    if (page.length < size) return rows
  }
}

const day = (iso: string) => iso.slice(0, 10)
const latest = (dates: string[]) => dates.reduce((a, b) => (a > b ? a : b), '')

export async function publicPageList(supabaseUrl: string, publishableKey: string): Promise<PageEntry[]> {
  if (!supabaseUrl || !publishableKey) {
    throw new Error('[public-page-list] VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set to build the public pages')
  }
  const [subjects, topics, lessons, publicLessons, questions] = await Promise.all([
    get(supabaseUrl, publishableKey, 'subjects', 'id,slug,updated_at'),
    get(supabaseUrl, publishableKey, 'topics', 'id,subject_id,slug,updated_at'),
    get(supabaseUrl, publishableKey, 'wassce_lesson_index', 'id,topic_id,updated_at'),
    get(supabaseUrl, publishableKey, 'wassce_public_lessons', 'id,topic_id,slug,title,content,sort_order,updated_at'),
    get(supabaseUrl, publishableKey, 'wassce_public_questions', 'id,topic_id,updated_at'),
  ])

  // Practice questions per topic (all public since migration 22).
  const questionDates = new Map<string, string[]>()
  for (const q of questions) {
    if (!questionDates.has(q.topic_id)) questionDates.set(q.topic_id, [])
    questionDates.get(q.topic_id)!.push(q.updated_at)
  }

  const lessonDates = new Map<string, string[]>()
  for (const l of lessons) {
    if (!lessonDates.has(l.topic_id)) lessonDates.set(l.topic_id, [])
    lessonDates.get(l.topic_id)!.push(l.updated_at)
  }

  // A lesson's video (migration 35) changes its page: the later date wins.
  // Before migration 35 there are no videos.
  const videoDates = new Map<string, string>()
  try {
    for (const v of await get(supabaseUrl, publishableKey, 'wassce_public_lesson_videos', 'lesson_id,updated_at')) videoDates.set(v.lesson_id, v.updated_at)
  } catch (e) {
    console.warn(`[public-page-list] lesson videos left out of lastmod: ${e instanceof Error ? e.message : e}`)
  }

  const pages: PageEntry[] = []
  const subjectLastmods: string[] = []
  for (const s of subjects) {
    const own = topics.filter((t) => t.subject_id === s.id)
    if (!hasSubjectPage(own.length)) continue
    const ownDates = [s.updated_at, ...own.flatMap((t) => [t.updated_at, ...(lessonDates.get(t.id) ?? [])])]
    const subjectLastmod = day(latest(ownDates))
    subjectLastmods.push(subjectLastmod)
    pages.push({ path: subjectPath(s.slug), lastmod: subjectLastmod })
    // Book a tutor page for the subject (its topic list comes from the syllabus).
    pages.push({ path: tutorsPath(s.slug), lastmod: subjectLastmod })
    const questionPages: PageEntry[] = []
    for (const t of own) {
      const dates = lessonDates.get(t.id) ?? []
      if (!hasTopicPageByCount(dates.length)) continue
      pages.push({ path: topicPath(s.slug, t.slug), lastmod: day(latest([t.updated_at, ...dates])) })
      // Every published lesson has its own free page (migration 22).
      for (const l of publicLessons.filter((pl) => pl.topic_id === t.id)) {
        if (l.slug === 'questions' || l.slug === 'key-terms') throw new Error(`[public-page-list] a lesson in ${s.slug}/${t.slug} has the slug "${l.slug}", which is one of the topic's own pages`)
        pages.push({ path: lessonPath(s.slug, t.slug, l.slug), lastmod: day(latest([l.updated_at, videoDates.get(l.id) ?? ''])) })
      }
      // The topic's key terms (its lessons' definitions as cards), when it has enough of them.
      const topicLessons = publicLessons
        .filter((pl) => pl.topic_id === t.id)
        .sort((a, b) => Number(a.sort_order) - Number(b.sort_order) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
      const terms = topicKeyTerms(topicLessons.map((l) => ({ id: l.id, slug: l.slug, title: l.title, content: l.content })))
      if (hasKeyTermsByCount(terms.length)) {
        const used = new Set(terms.map((k) => k.lessonId))
        pages.push({ path: keyTermsPath(s.slug, t.slug), lastmod: day(latest(topicLessons.filter((l) => used.has(l.id)).map((l) => l.updated_at))) })
      }
      // The topic's practice questions with answers, when it has enough of them.
      const qDates = questionDates.get(t.id) ?? []
      if (hasQuestionsPageByCount(qDates.length)) questionPages.push({ path: questionsPath(s.slug, t.slug), lastmod: day(latest(qDates)) })
    }
    if (own.some((t) => t.slug === 'questions')) throw new Error(`[public-page-list] ${s.slug} has a topic with the slug "questions", which is the subject's questions page`)
    if (questionPages.length > 0) {
      pages.push({ path: questionsPath(s.slug), lastmod: latest(questionPages.map((p) => p.lastmod)) }, ...questionPages)
    }
  }
  // The pillar and the subject index list every subject, so they change when any does.
  const all = latest(subjectLastmods)
  pages.unshift({ path: '/wassce', lastmod: all }, { path: '/wassce/subjects', lastmod: all }, { path: tutorsPath(), lastmod: all })

  // Every listed tutor's own page, /tutors/{slug} (migration 28). Visitors can
  // only read active, listed tutors. Before migration 28 there is no slug:
  // the pages are then left out (they still open in the app) rather than
  // failing the build.
  try {
    for (const t of await get(supabaseUrl, publishableKey, 'tutors', 'slug,verified_at')) {
      if (t.slug) pages.push({ path: tutorsPath(t.slug), lastmod: day(t.verified_at) })
    }
  } catch (e) {
    console.warn(`[public-page-list] tutor pages left out: ${e instanceof Error ? e.message : e}`)
  }
  return pages
}
