// Data for the public /wassce pages. Uses only what logged-out visitors may
// read (supabase/migrations/20261105_02_seo_foundations.sql): faculties,
// subjects, topics, and the wassce_lesson_index view (lesson titles, never
// lesson content). Runs at build time (prerendering) and in the browser.
import { supabase } from '@/lib/supabase'
import { hasQuestionsPageByCount, hasSubjectPage, hasTopicPageByCount, subjectPath, topicPath } from '@/lib/public-rules'
import { topicPhoto } from '@/lib/topic-photos'
import { mathToText } from '@/lib/math-text'

export { hasSubjectPage, lessonPath, questionsPath, subjectPath, topicPath } from '@/lib/public-rules'

export type FacultyRole = 'core' | 'faculty' | 'elective'

export type PublicFaculty = { id: string; slug: string; name: string; sort_order: number }

export type PublicSubject = {
  id: string
  slug: string
  name: string
  updated_at: string
  faculties: { faculty: PublicFaculty; role: FacultyRole }[]
}

export type PublicTopic = {
  id: string
  subject_id: string
  slug: string
  name: string
  description: string | null
  group_name: string | null
  group_order: number | null
  sort_order: number
  updated_at: string
}

export type LessonIndexItem = {
  id: string
  topic_id: string
  slug: string
  title: string
  est_minutes: number | null
  sort_order: number
  /** Has a public page: every published lesson since migration 22. */
  is_public: boolean
  updated_at: string
}

export type TopicWithLessons = PublicTopic & { lessons: LessonIndexItem[] }

export type TopicGroup = { name: string; order: number; topics: TopicWithLessons[] }

function fail(what: string, error: { message: string } | null): never {
  throw new Error(`Could not load ${what}: ${error?.message ?? 'unknown error'}`)
}

// Ties are broken by id, the same rule the database uses to order a topic's
// lessons (wassce_lesson_index), so pages and the app list them the same way.
const byOrder = <T extends { sort_order: number; id: string }>(a: T, b: T) =>
  a.sort_order - b.sort_order || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)

// During the build every prerendered page needs the same few tables; fetch
// them once per build process. In the browser, always fetch fresh.
const isServer = typeof window === 'undefined'
const memo = new Map<string, Promise<unknown>>()
function once<T>(key: string, load: () => Promise<T>): Promise<T> {
  if (!isServer) return load()
  if (!memo.has(key)) memo.set(key, load())
  return memo.get(key) as Promise<T>
}

function loadSubjects(): Promise<PublicSubject[]> {
  return once('subjects', loadSubjectsUncached)
}

async function loadSubjectsUncached(): Promise<PublicSubject[]> {
  const [subjects, faculties, links] = await Promise.all([
    supabase.from('subjects').select('id, slug, name, updated_at').order('name'),
    supabase.from('faculties').select('id, slug, name, sort_order').order('sort_order'),
    supabase.from('faculty_subjects').select('faculty_id, subject_id, role, sort_order'),
  ])
  if (subjects.error || !subjects.data) fail('subjects', subjects.error)
  if (faculties.error || !faculties.data) fail('faculties', faculties.error)
  if (links.error || !links.data) fail('faculty subjects', links.error)
  const facultyById = new Map(faculties.data.map((f) => [f.id, f as PublicFaculty]))
  return subjects.data.map((s) => ({
    ...s,
    faculties: links.data
      .filter((l) => l.subject_id === s.id && facultyById.has(l.faculty_id))
      .map((l) => ({ faculty: facultyById.get(l.faculty_id)!, role: l.role as FacultyRole }))
      .sort((a, b) => a.faculty.sort_order - b.faculty.sort_order),
  }))
}

function loadTopics(subjectIds: string[]): Promise<TopicWithLessons[]> {
  return once(`topics:${[...subjectIds].sort().join(',')}`, () => loadTopicsUncached(subjectIds))
}

async function loadTopicsUncached(subjectIds: string[]): Promise<TopicWithLessons[]> {
  if (subjectIds.length === 0) return []
  const topics = await supabase
    .from('topics')
    .select('id, subject_id, slug, name, description, group_name, group_order, sort_order, updated_at')
    .in('subject_id', subjectIds)
    .range(0, 4999)
  if (topics.error || !topics.data) fail('topics', topics.error)
  const topicIds = topics.data.map((t) => t.id)
  // Filter by topic in the query for one subject; for many subjects an
  // `in (...)` list of hundreds of ids makes the URL too long, so fetch all
  // lesson titles and filter here. The API returns at most 1,000 rows per
  // request, so read a page at a time.
  const lessonRows: LessonIndexItem[] = []
  if (topicIds.length > 0) {
    for (let from = 0; ; from += 1000) {
      const base = supabase.from('wassce_lesson_index').select('id, topic_id, slug, title, est_minutes, sort_order, is_public, updated_at')
      const page = await (topicIds.length <= 100 ? base.in('topic_id', topicIds) : base).order('id').range(from, from + 999)
      if (page.error || !page.data) fail('lesson titles', page.error)
      lessonRows.push(...(page.data as LessonIndexItem[]))
      if (page.data.length < 1000) break
    }
  }
  const byTopic = new Map<string, LessonIndexItem[]>()
  for (const l of lessonRows) {
    if (!byTopic.has(l.topic_id)) byTopic.set(l.topic_id, [])
    byTopic.get(l.topic_id)!.push(l)
  }
  return (topics.data as PublicTopic[]).map((t) => ({ ...t, lessons: (byTopic.get(t.id) ?? []).sort(byOrder) }))
}

/** Topics grouped into syllabus sections, in syllabus order. */
export function groupTopics(topics: TopicWithLessons[]): TopicGroup[] {
  const groups = new Map<string, TopicGroup>()
  for (const t of topics) {
    const name = t.group_name ?? 'Topics'
    if (!groups.has(name)) groups.set(name, { name, order: t.group_order ?? 999, topics: [] })
    groups.get(name)!.topics.push(t)
  }
  return [...groups.values()]
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
    .map((g) => ({ ...g, topics: g.topics.sort(byOrder) }))
}

/** A topic gets its own public page only once it has lessons (see public-rules.ts). */
export const hasTopicPage = (t: TopicWithLessons) => hasTopicPageByCount(t.lessons.length)

export const lessonMinutes = (lessons: LessonIndexItem[]) =>
  lessons.reduce((sum, l) => sum + (l.est_minutes ?? 0), 0)

const latest = (dates: string[]) => dates.reduce((a, b) => (a > b ? a : b), '')

export type SubjectSummary = PublicSubject & { topicCount: number; topicPageCount: number; lessonCount: number; lastmod: string }

/** All subjects with counts, for /wassce and /wassce/subjects. */
export async function fetchSubjectSummaries(): Promise<SubjectSummary[]> {
  const subjects = await loadSubjects()
  const topics = await loadTopics(subjects.map((s) => s.id))
  return subjects.map((s) => {
    const own = topics.filter((t) => t.subject_id === s.id)
    return {
      ...s,
      topicCount: own.length,
      topicPageCount: own.filter(hasTopicPage).length,
      lessonCount: own.reduce((n, t) => n + t.lessons.length, 0),
      lastmod: latest([s.updated_at, ...own.map((t) => t.updated_at), ...own.flatMap((t) => t.lessons.map((l) => l.updated_at))]),
    }
  })
}

export type SubjectHub = {
  subject: PublicSubject
  groups: TopicGroup[]
  topicCount: number
  lessonCount: number
  minutes: number
  related: SubjectSummary[]
}

/** Everything for /wassce/{subject}; null if the subject doesn't exist or has no topics. */
export async function fetchSubjectHub(slug: string): Promise<SubjectHub | null> {
  const all = await fetchSubjectSummaries()
  const summary = all.find((s) => s.slug === slug)
  if (!summary || !hasSubjectPage(summary.topicCount)) return null
  const topics = await loadTopics([summary.id])
  const lessons = topics.flatMap((t) => t.lessons)
  const myFaculties = new Set(summary.faculties.map((f) => f.faculty.id))
  return {
    subject: summary,
    groups: groupTopics(topics),
    topicCount: topics.length,
    lessonCount: lessons.length,
    minutes: lessonMinutes(lessons),
    related: all.filter(
      (s) => s.id !== summary.id && hasSubjectPage(s.topicCount) && s.faculties.some((f) => myFaculties.has(f.faculty.id)),
    ),
  }
}

export type TopicPageData = {
  subject: PublicSubject
  topic: TopicWithLessons
  group: TopicGroup
  previous: TopicWithLessons | null
  next: TopicWithLessons | null
}

/** Everything for /wassce/{subject}/{topic}; null unless the topic exists and has lessons. */
export async function fetchTopicPage(subjectSlug: string, topicSlug: string): Promise<TopicPageData | null> {
  const subjects = await loadSubjects()
  const subject = subjects.find((s) => s.slug === subjectSlug)
  if (!subject) return null
  const groups = groupTopics(await loadTopics([subject.id]))
  const ordered = groups.flatMap((g) => g.topics)
  const index = ordered.findIndex((t) => t.slug === topicSlug)
  if (index < 0 || !hasTopicPage(ordered[index])) return null
  const topic = ordered[index]
  const withPages = ordered.filter(hasTopicPage)
  const pos = withPages.indexOf(topic)
  return {
    subject,
    topic,
    group: groups.find((g) => g.topics.includes(topic))!,
    previous: withPages[pos - 1] ?? null,
    next: withPages[pos + 1] ?? null,
  }
}

export type PublicLesson = {
  id: string
  topic_id: string
  slug: string
  title: string
  content: string
  est_minutes: number | null
  sort_order: number
  /** Null when nobody has reviewed the lesson yet (review is optional). */
  reviewed_at: string | null
  updated_at: string
  reviewer_name: string | null
  reviewer_bio: string | null
}

export type PublicLessonPageData = TopicPageData & { lesson: PublicLesson }

/** Everything for /wassce/{subject}/{topic}/{lesson}; null unless the lesson is public (each topic's free lesson, or one marked public). */
export async function fetchPublicLessonPage(
  subjectSlug: string,
  topicSlug: string,
  lessonSlug: string,
): Promise<PublicLessonPageData | null> {
  const page = await fetchTopicPage(subjectSlug, topicSlug)
  if (!page) return null
  const { data, error } = await supabase
    .from('wassce_public_lessons')
    .select('id, topic_id, slug, title, content, est_minutes, sort_order, reviewed_at, updated_at, reviewer_name, reviewer_bio')
    .eq('topic_id', page.topic.id)
    .eq('slug', lessonSlug)
    .maybeSingle()
  if (error) fail('lesson', error)
  if (!data) return null
  return { ...page, lesson: data as PublicLesson }
}

/** Markdown to plain text for a summary. */
function plainText(markdown: string): string {
  const prose = markdown
    .replace(/^:::.*$/gm, ' ') // directive fences (:::callout, :::diagram)
    .replace(/\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]/g, ' ') // display math: a whole equation is too long for a snippet
  // Inline maths is written out ("When you write 2³, ..."), not deleted: a
  // deleted formula leaves a hole in the sentence Google shows.
  return mathToText(prose)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links -> text
    .replace(/^#{1,6}\s+/gm, '') // heading marks
    .replace(/^\s*[-*+>]\s+/gm, '') // list / quote markers
    .replace(/[*_`|]/g, '') // emphasis, code, table pipes
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,;:!?])(?!\s?\d)/g, '$1') // space left where math was removed (but not in a ratio, 3 : 5)
    .replace(/[:;,]\./g, '.')
    .trim()
}

/**
 * Is this Markdown block running prose? Headings, lists, tables, quotes,
 * directives, images, display math and the "By the end of this lesson..."
 * line that opens the learning objectives are not: as a search snippet they
 * read as "Learning objectives By the end of this lesson, you should be able to:".
 */
const isProse = (block: string) =>
  !/^(#|[-*+>|]|\d+[.)]\s|:::|!\[|\$\$)/.test(block) && !/^by the end of this (lesson|topic)/i.test(block)

/** Meta description for a lesson: its opening prose, without headings or the objectives list. */
export function lessonSummary(markdown: string, max = 155): string {
  // Outside directives (:::callout ... :::), blocks of prose in order, until there is enough text.
  const blocks = markdown.replace(/\r\n?/g, '\n').replace(/^:::[^\n]*\n[\s\S]*?^:::\s*$/gm, '').split(/\n\s*\n/)
  let prose = ''
  for (const block of blocks.map((b) => b.trim()).filter(isProse)) {
    prose += ` ${plainText(block)}`
    if (prose.length > max) break
  }
  // Lessons with no prose outside lists and callouts keep the old summary of everything.
  const text = prose.trim().length >= 60 ? prose.trim() : plainText(markdown)
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\s]+$/, '') + '…'
}

export type PopularTopic = {
  subjectSlug: string
  subjectName: string
  topicSlug: string
  topicName: string
  lessons: number
  /** The topic's first lessons, in syllabus order: real titles for the homepage lesson preview. */
  firstLessons: { title: string; minutes: number | null; free: boolean }[]
}

/** One topic shown as a course card in the homepage course rows. */
export type CourseCard = {
  topicSlug: string
  topicName: string
  /** The topic's syllabus description, shortened for the card's preview. */
  summary: string | null
  lessons: number
  /** Sum of the lessons' estimated reading times. */
  minutes: number
  freeLessons: number
  firstLessons: string[]
}

/** A subject's row of course cards on the homepage. */
export type CourseRow = { subjectSlug: string; subjectName: string; topicCount: number; lessonCount: number; courses: CourseCard[] }

export type LandingData = {
  subjects: SubjectSummary[]
  totals: { subjects: number; topics: number; lessons: number }
  popular: PopularTopic[]
  courseRows: CourseRow[]
}

const shorten = (text: string | null, max = 150) => {
  if (!text) return null
  const t = text.replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  const cut = t.slice(0, max)
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\s]+$/, '') + '…'
}

/**
 * Course rows: the subjects with the most lessons, each with up to eight of
 * its topics that have lessons, in syllabus order (where a student starts).
 */
function courseRowsFrom(subjects: SubjectSummary[], topics: TopicWithLessons[]): CourseRow[] {
  return subjects
    .filter((s) => s.lessonCount > 0)
    .sort((a, b) => b.lessonCount - a.lessonCount)
    .slice(0, 6)
    .map((s) => ({
      subjectSlug: s.slug,
      subjectName: s.name,
      topicCount: s.topicCount,
      lessonCount: s.lessonCount,
      courses: topics
        .filter((t) => t.subject_id === s.id && hasTopicPage(t) && t.lessons.length > 0)
        .sort((a, b) => (a.group_order ?? 0) - (b.group_order ?? 0) || a.sort_order - b.sort_order)
        .slice(0, 8)
        .map((t) => ({
          topicSlug: t.slug,
          topicName: t.name,
          summary: shorten(t.description),
          lessons: t.lessons.length,
          minutes: t.lessons.reduce((n, l) => n + (l.est_minutes ?? 0), 0),
          freeLessons: t.lessons.filter((l) => l.is_public).length,
          firstLessons: [...t.lessons].sort((a, b) => a.sort_order - b.sort_order).slice(0, 3).map((l) => l.title),
        })),
    }))
    .filter((r) => r.courses.length > 0)
}

/** Homepage data: subjects with counts, totals for the proof strip, and the topics with the most lessons. */
export async function fetchLandingData(): Promise<LandingData> {
  const subjects = await fetchSubjectSummaries()
  const topics = await loadTopics(subjects.map((s) => s.id))
  const bySubject = new Map(subjects.map((s) => [s.id, s]))
  // Popular topics: each subject's most-studied topic first, then each
  // subject's second, so the list spans the syllabus rather than one subject.
  // Within a subject: most lessons first; ties go to topics with a photo.
  const rank = (t: TopicWithLessons) => [-t.lessons.length, topicPhoto(bySubject.get(t.subject_id)!.slug, t.slug) ? 0 : 1, t.name] as const
  const cmp = (x: TopicWithLessons, y: TopicWithLessons) => {
    const [a1, a2, a3] = rank(x)
    const [b1, b2, b3] = rank(y)
    return a1 - b1 || a2 - b2 || a3.localeCompare(b3)
  }
  const lists = [...topics.filter(hasTopicPage).reduce((m, t) => m.set(t.subject_id, [...(m.get(t.subject_id) ?? []), t]), new Map<string, TopicWithLessons[]>()).values()]
    .map((l) => l.sort(cmp))
    .sort((x, y) => cmp(x[0], y[0]))
  const picked: TopicWithLessons[] = []
  for (let round = 0; round < 2 && picked.length < 8; round++) for (const l of lists) if (l[round] && picked.length < 8) picked.push(l[round])
  const popular = picked.map((t) => {
    const s = bySubject.get(t.subject_id)!
    return {
      subjectSlug: s.slug,
      subjectName: s.name,
      topicSlug: t.slug,
      topicName: t.name,
      lessons: t.lessons.length,
      firstLessons: t.lessons.slice(0, 3).map((l) => ({ title: l.title, minutes: l.est_minutes, free: l.is_public })),
    }
  })
  return {
    subjects,
    totals: {
      // Subjects a visitor can open: those with a syllabus page.
      subjects: subjects.filter((s) => hasSubjectPage(s.topicCount)).length,
      topics: subjects.reduce((n, s) => n + s.topicCount, 0),
      lessons: subjects.reduce((n, s) => n + s.lessonCount, 0),
    },
    popular,
    courseRows: courseRowsFrom(subjects, topics),
  }
}

export type SearchEntry = { kind: 'subject' | 'topic'; name: string; subjectName: string; href: string; lessons: number }

/**
 * Everything searchable from the homepage: subjects and all syllabus topics.
 * Topics with lessons link to their own page; the rest link to their subject hub.
 */
export async function fetchSearchIndex(): Promise<SearchEntry[]> {
  const subjects = await loadSubjects()
  const topics = await loadTopics(subjects.map((s) => s.id))
  const bySubject = new Map(subjects.map((s) => [s.id, s]))
  const entries: SearchEntry[] = subjects.flatMap((s) => {
    const own = topics.filter((t) => t.subject_id === s.id)
    if (!hasSubjectPage(own.length)) return []
    const lessons = own.reduce((n, t) => n + t.lessons.length, 0)
    return [{ kind: 'subject' as const, name: s.name, subjectName: s.name, href: subjectPath(s.slug), lessons }]
  })
  for (const t of topics) {
    const s = bySubject.get(t.subject_id)
    if (!s) continue
    entries.push({
      kind: 'topic',
      name: t.name,
      subjectName: s.name,
      href: hasTopicPage(t) ? topicPath(s.slug, t.slug) : subjectPath(s.slug),
      lessons: t.lessons.length,
    })
  }
  return entries
}

// ── Practice questions ──────────────────────────────────────────────────────
// Every question in a published practice set is public (migration 22,
// wassce_public_questions), with its options, the answer and the working.

export type PublicOption = { label: string; content: string; is_correct: boolean }

export type PublicQuestion = {
  id: string
  paper_id: string
  topic_id: string
  stem: string
  image_url: string | null
  explanation: string | null
  position: number
  updated_at: string
  options: PublicOption[]
}

const QUESTION_COLUMNS = 'id, paper_id, topic_id, stem, image_url, explanation, position, updated_at, options'
const PAGE = 1000 // the most rows the API returns at once

/** Every public question, a page at a time, in practice-set order. Build time only. */
function loadAllQuestions(): Promise<PublicQuestion[]> {
  return once('questions', async () => {
    const rows: PublicQuestion[] = []
    for (let from = 0; ; from += PAGE) {
      const { data, error } = await supabase.from('wassce_public_questions').select(QUESTION_COLUMNS).order('id').range(from, from + PAGE - 1)
      if (error || !data) fail('questions', error)
      rows.push(...(data as PublicQuestion[]))
      if (data.length < PAGE) break
    }
    return sortQuestions(rows)
  })
}

/** Practice sets in their syllabus order (papers.sort_order), questions in their place in the set. */
async function sortQuestions(rows: PublicQuestion[]): Promise<PublicQuestion[]> {
  const ids = [...new Set(rows.map((q) => q.paper_id))]
  const order = new Map<string, number>()
  for (let i = 0; i < ids.length; i += 100) {
    const { data, error } = await supabase.from('papers').select('id, sort_order').in('id', ids.slice(i, i + 100))
    if (error || !data) fail('practice sets', error)
    for (const p of data) order.set(p.id, p.sort_order ?? 0)
  }
  return [...rows].sort(
    (a, b) => (order.get(a.paper_id) ?? 0) - (order.get(b.paper_id) ?? 0) || (a.paper_id < b.paper_id ? -1 : a.paper_id > b.paper_id ? 1 : 0) || a.position - b.position,
  )
}

/** One topic's questions: from the build's single fetch, or (in the browser) just that topic's. */
async function loadTopicQuestions(topicId: string): Promise<PublicQuestion[]> {
  if (isServer) return (await loadAllQuestions()).filter((q) => q.topic_id === topicId)
  const { data, error } = await supabase.from('wassce_public_questions').select(QUESTION_COLUMNS).eq('topic_id', topicId).range(0, PAGE - 1)
  if (error || !data) fail('questions', error)
  return sortQuestions(data as PublicQuestion[])
}

/** How many public questions each topic has. */
async function loadQuestionCounts(): Promise<Map<string, number>> {
  const counts = new Map<string, number>()
  const add = (topicId: string) => counts.set(topicId, (counts.get(topicId) ?? 0) + 1)
  if (isServer) {
    for (const q of await loadAllQuestions()) add(q.topic_id)
    return counts
  }
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase.from('wassce_public_questions').select('topic_id').order('id').range(from, from + PAGE - 1)
    if (error || !data) fail('question counts', error)
    for (const q of data) add(q.topic_id as string)
    if (data.length < PAGE) break
  }
  return counts
}

/** How many public questions a topic has (0 when it has no questions page). */
export async function topicQuestionCount(topicId: string): Promise<number> {
  const n = (await loadQuestionCounts()).get(topicId) ?? 0
  return hasQuestionsPageByCount(n) ? n : 0
}

export type TopicQuestionsPageData = TopicPageData & {
  questions: PublicQuestion[]
  /** Neighbouring topics in syllabus order that have a questions page of their own. */
  previousQuestions: TopicWithLessons | null
  nextQuestions: TopicWithLessons | null
}

/** Everything for /wassce/{subject}/{topic}/questions; null unless the topic has a page and enough questions. */
export async function fetchTopicQuestionsPage(subjectSlug: string, topicSlug: string): Promise<TopicQuestionsPageData | null> {
  const page = await fetchTopicPage(subjectSlug, topicSlug)
  if (!page) return null
  const [questions, counts] = await Promise.all([loadTopicQuestions(page.topic.id), loadQuestionCounts()])
  if (!hasQuestionsPageByCount(questions.length)) return null
  const groups = groupTopics(await loadTopics([page.subject.id]))
  const withQuestions = groups.flatMap((g) => g.topics).filter((t) => hasTopicPage(t) && hasQuestionsPageByCount(counts.get(t.id) ?? 0))
  const at = withQuestions.findIndex((t) => t.id === page.topic.id)
  return { ...page, questions, previousQuestions: withQuestions[at - 1] ?? null, nextQuestions: withQuestions[at + 1] ?? null }
}

export type SubjectQuestionsHub = {
  subject: PublicSubject
  /** Syllabus sections with the topics that have a questions page, and how many questions each has. */
  groups: { name: string; topics: { topic: TopicWithLessons; questions: number; withDiagrams: number }[] }[]
  questionCount: number
}

/** Everything for /wassce/{subject}/questions; null when no topic in the subject has a questions page. */
export async function fetchSubjectQuestionsHub(subjectSlug: string): Promise<SubjectQuestionsHub | null> {
  const subject = (await loadSubjects()).find((s) => s.slug === subjectSlug)
  if (!subject) return null
  const [topics, counts] = await Promise.all([loadTopics([subject.id]), loadQuestionCounts()])
  const diagrams = new Map<string, number>()
  if (isServer) for (const q of await loadAllQuestions()) if (q.image_url) diagrams.set(q.topic_id, (diagrams.get(q.topic_id) ?? 0) + 1)
  const groups = groupTopics(topics)
    .map((g) => ({
      name: g.name,
      topics: g.topics
        .filter((t) => hasTopicPage(t) && hasQuestionsPageByCount(counts.get(t.id) ?? 0))
        .map((t) => ({ topic: t, questions: counts.get(t.id)!, withDiagrams: diagrams.get(t.id) ?? 0 })),
    }))
    .filter((g) => g.topics.length > 0)
  const questionCount = groups.reduce((n, g) => n + g.topics.reduce((m, t) => m + t.questions, 0), 0)
  return groups.length ? { subject, groups, questionCount } : null
}

/** Subjects (by slug) with a questions index page, and how many questions it lists. */
export async function fetchQuestionSubjects(): Promise<Map<string, number>> {
  const [subjects, counts] = await Promise.all([loadSubjects(), loadQuestionCounts()])
  const topics = await loadTopics(subjects.map((s) => s.id))
  const out = new Map<string, number>()
  for (const t of topics) {
    const n = counts.get(t.id) ?? 0
    if (!hasTopicPage(t) || !hasQuestionsPageByCount(n)) continue
    const slug = subjects.find((s) => s.id === t.subject_id)?.slug
    if (slug) out.set(slug, (out.get(slug) ?? 0) + n)
  }
  return out
}
