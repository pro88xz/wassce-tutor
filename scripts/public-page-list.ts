// Build-time list of data-driven public pages (/wassce/... and /tutors/...), with sitemap lastmod.
// Used by vite.config.ts to tell TanStack Start what to prerender. Reads the
// same public tables/views as src/lib/public-content.ts, over plain REST with
// the publishable key, and applies the same rules (src/lib/public-rules.ts).
import { hasSubjectPage, hasTopicPageByCount, lessonPath, subjectPath, topicPath, tutorsPath } from '../src/lib/public-rules'

export type PageEntry = { path: string; lastmod: string }

type Row = Record<string, string>

async function get(url: string, key: string, table: string, select: string): Promise<Row[]> {
  const res = await fetch(`${url}/rest/v1/${table}?select=${select}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}`, Range: '0-9999' },
  })
  if (!res.ok) throw new Error(`[public-page-list] ${table}: HTTP ${res.status} ${await res.text()}`)
  return res.json() as Promise<Row[]>
}

const day = (iso: string) => iso.slice(0, 10)
const latest = (dates: string[]) => dates.reduce((a, b) => (a > b ? a : b), '')

export async function publicPageList(supabaseUrl: string, publishableKey: string): Promise<PageEntry[]> {
  if (!supabaseUrl || !publishableKey) {
    throw new Error('[public-page-list] VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set to build the public pages')
  }
  const [subjects, topics, lessons, publicLessons] = await Promise.all([
    get(supabaseUrl, publishableKey, 'subjects', 'id,slug,updated_at'),
    get(supabaseUrl, publishableKey, 'topics', 'id,subject_id,slug,updated_at'),
    get(supabaseUrl, publishableKey, 'wassce_lesson_index', 'topic_id,updated_at'),
    get(supabaseUrl, publishableKey, 'wassce_public_lessons', 'topic_id,slug,updated_at'),
  ])

  const lessonDates = new Map<string, string[]>()
  for (const l of lessons) {
    if (!lessonDates.has(l.topic_id)) lessonDates.set(l.topic_id, [])
    lessonDates.get(l.topic_id)!.push(l.updated_at)
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
    for (const t of own) {
      const dates = lessonDates.get(t.id) ?? []
      if (!hasTopicPageByCount(dates.length)) continue
      pages.push({ path: topicPath(s.slug, t.slug), lastmod: day(latest([t.updated_at, ...dates])) })
      // Reviewed lessons marked public get their own free page.
      for (const l of publicLessons.filter((pl) => pl.topic_id === t.id)) {
        pages.push({ path: lessonPath(s.slug, t.slug, l.slug), lastmod: day(l.updated_at) })
      }
    }
  }
  // The pillar and the subject index list every subject, so they change when any does.
  const all = latest(subjectLastmods)
  pages.unshift({ path: '/wassce', lastmod: all }, { path: '/wassce/subjects', lastmod: all }, { path: tutorsPath(), lastmod: all })
  return pages
}
