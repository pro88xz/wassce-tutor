// Student progress: which lessons are done (lesson_progress, migration 04),
// paper scores (attempts), and everything derived from them for the Progress
// screen, dashboard, subject, topic and lesson screens.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

// ── Curriculum (topics + lesson titles) for a set of subjects ───────────────

export type CurriculumLesson = { id: string; topic_id: string; title: string; est_minutes: number | null; sort_order: number; is_free?: boolean }
export type CurriculumTopic = {
  id: string
  subject_id: string
  slug: string
  name: string
  description: string | null
  group_name: string | null
  group_order: number | null
  sort_order: number
  lessons: CurriculumLesson[]
}

export function useCurriculum(subjectIds: string[] | null) {
  const ids = [...(subjectIds ?? [])].sort()
  return useQuery({
    queryKey: ['curriculum', ids.join(',')],
    enabled: ids.length > 0,
    staleTime: 30 * 60 * 1000, // the syllabus rarely changes
    queryFn: async (): Promise<CurriculumTopic[]> => {
      const topics = await supabase
        .from('topics')
        .select('id, subject_id, slug, name, description, group_name, group_order, sort_order')
        .in('subject_id', ids)
        .range(0, 4999)
      if (topics.error) throw topics.error
      const topicIds = (topics.data ?? []).map((t) => t.id)
      // An in() list of hundreds of ids makes the URL too long; above 100
      // topics fetch every lesson title (a few hundred rows) and filter here.
      // '*' so is_free (migration 07) comes along once it exists
      const q = supabase.from('wassce_lesson_index').select('*').range(0, 9999)
      const lessons = topicIds.length === 0 ? { data: [], error: null } : topicIds.length <= 100 ? await q.in('topic_id', topicIds) : await q
      if (lessons.error) throw lessons.error
      const byTopic = new Map<string, CurriculumLesson[]>()
      for (const l of (lessons.data ?? []) as CurriculumLesson[]) {
        if (!byTopic.has(l.topic_id)) byTopic.set(l.topic_id, [])
        byTopic.get(l.topic_id)!.push(l)
      }
      return (topics.data ?? [])
        .map((t) => ({ ...t, lessons: (byTopic.get(t.id) ?? []).sort((a, b) => a.sort_order - b.sort_order) }))
        .sort((a, b) => (a.group_order ?? 999) - (b.group_order ?? 999) || a.sort_order - b.sort_order)
    },
  })
}

// ── Completed lessons ───────────────────────────────────────────────────────

export type Completed = Map<string, string> // lesson_id -> completed_at

/** True once migration 04 has created lesson_progress; until then progress just reads as empty. */
const missingTable = (e: { code?: string } | null) => e?.code === 'PGRST205' || e?.code === '42P01'

export function useCompletedLessons(userId: string | null) {
  return useQuery({
    queryKey: ['lesson-progress', userId],
    enabled: !!userId,
    queryFn: async (): Promise<Completed> => {
      const { data, error } = await supabase
        .from('lesson_progress')
        .select('lesson_id, completed_at')
        .eq('profile_id', userId!)
        .range(0, 9999)
      if (error) {
        if (missingTable(error)) return new Map()
        throw error
      }
      return new Map((data ?? []).map((r) => [r.lesson_id as string, r.completed_at as string]))
    },
  })
}

/** Mark a lesson done (or not done). Updates the cache immediately. */
export function useSetLessonComplete(userId: string | null) {
  const qc = useQueryClient()
  const key = ['lesson-progress', userId]
  return useMutation({
    mutationFn: async ({ lessonId, done }: { lessonId: string; done: boolean }) => {
      if (!userId) throw new Error('Sign in to save progress')
      const res = done
        ? await supabase.from('lesson_progress').upsert({ profile_id: userId, lesson_id: lessonId }, { ignoreDuplicates: true })
        : await supabase.from('lesson_progress').delete().eq('profile_id', userId).eq('lesson_id', lessonId)
      if (res.error) {
        if (missingTable(res.error)) throw new Error('Progress saving is being set up. Try again soon.')
        throw res.error
      }
    },
    onMutate: async ({ lessonId, done }) => {
      await qc.cancelQueries({ queryKey: key })
      const before = qc.getQueryData<Completed>(key)
      const next = new Map(before ?? [])
      if (done) next.set(lessonId, new Date().toISOString())
      else next.delete(lessonId)
      qc.setQueryData(key, next)
      return { before }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.before) qc.setQueryData(key, ctx.before)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: key }),
  })
}

// ── Paper attempts (all of them, with subject) ──────────────────────────────

export type ScoredAttempt = {
  id: string
  score: number
  total: number
  created_at: string
  paper: { id: string; title: string; subject_id: string } | null
}

export function useScoredAttempts(userId: string | null) {
  return useQuery({
    queryKey: ['attempts-all', userId],
    enabled: !!userId,
    queryFn: async (): Promise<ScoredAttempt[]> => {
      const { data, error } = await supabase
        .from('attempts')
        .select('id, score, total, created_at, paper:papers(id, title, subject_id)')
        .eq('profile_id', userId!)
        .order('created_at', { ascending: false })
        .range(0, 999)
      if (error) throw error
      return data as unknown as ScoredAttempt[]
    },
  })
}

// ── Derived progress ────────────────────────────────────────────────────────

export type TopicStatus = 'done' | 'started' | 'new' | 'empty'

export type TopicProgress = {
  topic: CurriculumTopic
  done: number
  total: number
  status: TopicStatus
  /** first lesson not yet completed */
  next: CurriculumLesson | null
  lastActivity: string | null
}

export type GroupProgress = { name: string; topics: TopicProgress[]; done: number; total: number }

export type SubjectRef = { id: string; slug: string; name: string }

export type SubjectProgress = {
  subject: SubjectRef
  groups: GroupProgress[]
  topics: TopicProgress[]
  done: number
  total: number
  topicsWithLessons: number
  topicsDone: number
  minutesLeft: number
  attempts: ScoredAttempt[]
  /** average paper score as a percentage, or null with no attempts */
  avgScore: number | null
  next: { topic: CurriculumTopic; lesson: CurriculumLesson } | null
  lastActivity: string | null
}

export type ProgressSummary = {
  subjects: SubjectProgress[]
  done: number
  total: number
  topicsDone: number
  topicsWithLessons: number
  papersTaken: number
  avgScore: number | null
  streak: number
  activeDays: Set<string>
  /** where to pick up: in the most recently studied topic, else the first lesson */
  next: { subject: SubjectRef; topic: CurriculumTopic; lesson: CurriculumLesson } | null
}

const latest = (a: string | null, b: string | null) => (!a ? b : !b ? a : a > b ? a : b)
export const localDay = (iso: string) => {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function topicProgress(topic: CurriculumTopic, completed: Completed): TopicProgress {
  const total = topic.lessons.length
  let done = 0
  let last: string | null = null
  for (const l of topic.lessons) {
    const at = completed.get(l.id)
    if (at) {
      done++
      last = latest(last, at)
    }
  }
  const status: TopicStatus = total === 0 ? 'empty' : done === total ? 'done' : done > 0 ? 'started' : 'new'
  return { topic, done, total, status, next: topic.lessons.find((l) => !completed.has(l.id)) ?? null, lastActivity: last }
}

function avg(attempts: ScoredAttempt[]): number | null {
  const total = attempts.reduce((n, a) => n + a.total, 0)
  return total > 0 ? Math.round((attempts.reduce((n, a) => n + a.score, 0) / total) * 100) : null
}

/** Consecutive days with any activity, ending today (or yesterday, so a streak survives until tonight). */
function streakFrom(days: Set<string>): number {
  const d = new Date()
  const key = () => localDay(d.toISOString())
  if (!days.has(key())) d.setDate(d.getDate() - 1)
  let n = 0
  while (days.has(key())) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}

export function summarize(
  subjects: SubjectRef[],
  curriculum: CurriculumTopic[],
  completed: Completed,
  attempts: ScoredAttempt[],
): ProgressSummary {
  const perSubject: SubjectProgress[] = subjects.map((subject) => {
    const topics = curriculum.filter((t) => t.subject_id === subject.id).map((t) => topicProgress(t, completed))
    const groupsMap = new Map<string, GroupProgress>()
    for (const tp of topics) {
      const name = tp.topic.group_name ?? 'Topics'
      if (!groupsMap.has(name)) groupsMap.set(name, { name, topics: [], done: 0, total: 0 })
      const g = groupsMap.get(name)!
      g.topics.push(tp)
      g.done += tp.done
      g.total += tp.total
    }
    const withLessons = topics.filter((t) => t.total > 0)
    const own = attempts.filter((a) => a.paper?.subject_id === subject.id)
    const lastActivity = topics.reduce<string | null>((acc, t) => latest(acc, t.lastActivity), own[0]?.created_at ?? null)
    // Continue in the most recently active unfinished topic, else the first unfinished one.
    const unfinished = withLessons.filter((t) => t.next)
    const resume = [...unfinished].sort((a, b) => (b.lastActivity ?? '').localeCompare(a.lastActivity ?? ''))[0]
    const pick = resume?.lastActivity ? resume : unfinished[0]
    return {
      subject,
      groups: [...groupsMap.values()],
      topics,
      done: topics.reduce((n, t) => n + t.done, 0),
      total: topics.reduce((n, t) => n + t.total, 0),
      topicsWithLessons: withLessons.length,
      topicsDone: withLessons.filter((t) => t.status === 'done').length,
      minutesLeft: topics.flatMap((t) => t.topic.lessons.filter((l) => !completed.has(l.id))).reduce((n, l) => n + (l.est_minutes ?? 0), 0),
      attempts: own,
      avgScore: avg(own),
      next: pick?.next ? { topic: pick.topic, lesson: pick.next } : null,
      lastActivity,
    }
  })

  const activeDays = new Set<string>([...completed.values(), ...attempts.map((a) => a.created_at)].map(localDay))
  const recent = [...perSubject].filter((s) => s.next).sort((a, b) => (b.lastActivity ?? '').localeCompare(a.lastActivity ?? ''))[0]
  const firstWithLessons = perSubject.find((s) => s.next)
  const resume = recent?.lastActivity ? recent : firstWithLessons

  return {
    subjects: perSubject,
    done: perSubject.reduce((n, s) => n + s.done, 0),
    total: perSubject.reduce((n, s) => n + s.total, 0),
    topicsDone: perSubject.reduce((n, s) => n + s.topicsDone, 0),
    topicsWithLessons: perSubject.reduce((n, s) => n + s.topicsWithLessons, 0),
    papersTaken: attempts.length,
    avgScore: avg(attempts),
    streak: streakFrom(activeDays),
    activeDays,
    next: resume?.next ? { subject: resume.subject, ...resume.next } : null,
  }
}

/** Everything the progress-aware screens need for the signed-in student's subjects. */
export function useProgress(userId: string | null, subjects: SubjectRef[] | undefined) {
  const curriculum = useCurriculum(subjects ? subjects.map((s) => s.id) : null)
  const completed = useCompletedLessons(userId)
  const attempts = useScoredAttempts(userId)
  // With no subjects the curriculum query never runs; that's still "ready".
  const curriculumReady = !!subjects && (subjects.length === 0 || curriculum.isSuccess)
  const ready = curriculumReady && completed.isSuccess && attempts.isSuccess
  return {
    isLoading: !ready && !(curriculum.error ?? completed.error ?? attempts.error),
    error: curriculum.error ?? completed.error ?? attempts.error,
    summary: ready ? summarize(subjects!, curriculum.data ?? [], completed.data!, attempts.data!) : null,
    completed: completed.data,
  }
}
