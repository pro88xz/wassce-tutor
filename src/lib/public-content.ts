// Data for the public /wassce pages. Uses only what logged-out visitors may
// read (supabase/migrations/20261105_02_seo_foundations.sql): faculties,
// subjects, topics, and the wassce_lesson_index view (lesson titles, never
// lesson content). Runs at build time (prerendering) and in the browser.
import { supabase } from '@/lib/supabase'
import { hasSubjectPage, hasTopicPageByCount } from '@/lib/public-rules'

export { hasSubjectPage, subjectPath, topicPath } from '@/lib/public-rules'

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
  is_public: boolean
  updated_at: string
}

export type TopicWithLessons = PublicTopic & { lessons: LessonIndexItem[] }

export type TopicGroup = { name: string; order: number; topics: TopicWithLessons[] }

function fail(what: string, error: { message: string } | null): never {
  throw new Error(`Could not load ${what}: ${error?.message ?? 'unknown error'}`)
}

const byOrder = <T extends { sort_order: number }>(a: T, b: T) => a.sort_order - b.sort_order

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
  // lesson titles (a few hundred rows) and filter here.
  const lessonQuery = supabase
    .from('wassce_lesson_index')
    .select('id, topic_id, slug, title, est_minutes, sort_order, is_public, updated_at')
    .range(0, 9999)
  const lessons = topicIds.length === 0
    ? { data: [] as LessonIndexItem[], error: null }
    : topicIds.length <= 100
      ? await lessonQuery.in('topic_id', topicIds)
      : await lessonQuery
  if (lessons.error || !lessons.data) fail('lesson titles', lessons.error)
  const byTopic = new Map<string, LessonIndexItem[]>()
  for (const l of lessons.data as LessonIndexItem[]) {
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
