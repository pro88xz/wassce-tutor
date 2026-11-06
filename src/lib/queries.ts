import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Faculty, FacultySubject, Profile, Subject } from '@/lib/types'

// Fetch all faculties, ordered
export function useFaculties() {
  return useQuery({
    queryKey: ['faculties'],
    queryFn: async (): Promise<Faculty[]> => {
      const { data, error } = await supabase
        .from('faculties')
        .select('*')
        .order('sort_order')
      if (error) throw error
      return data
    },
  })
}

// Fetch a faculty's subjects (joined with subject details), ordered by role + sort
export function useFacultySubjects(facultyId: string | null) {
  return useQuery({
    queryKey: ['faculty_subjects', facultyId],
    enabled: !!facultyId,
    queryFn: async (): Promise<FacultySubject[]> => {
      const { data, error } = await supabase
        .from('faculty_subjects')
        .select('*, subject:subjects(*)')
        .eq('faculty_id', facultyId!)
        .order('sort_order')
      if (error) throw error
      return data as unknown as FacultySubject[]
    },
  })
}


// Fetch the current user's profile (onboarding + subscription state)
export function useProfile(userId: string | null) {
  return useQuery({
    queryKey: ['profile', userId],
    enabled: !!userId,
    queryFn: async (): Promise<Profile | null> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId!)
        .single()
      if (error) throw error
      return data
    },
  })
}

// Fetch the student's chosen subjects (joined with subject details)
export function useStudentSubjects(profileId: string | null) {
  return useQuery({
    queryKey: ['student_subjects', profileId],
    enabled: !!profileId,
    queryFn: async (): Promise<Subject[]> => {
      const { data, error } = await supabase
        .from('student_subjects')
        .select('subject:subjects(*)')
        .eq('profile_id', profileId!)
      if (error) throw error
      // unwrap the joined subject from each row
      return (data ?? []).map((row: any) => row.subject) as Subject[]
    },
  })
}

// --- Phase 2: content hooks ---

export type PaperRow = {
  id: string
  subject_id: string
  title: string
  year: number | null
  paper_type: string | null
  description: string | null
  question_count: number
  /** The subject's free starter set (migration 07; missing before it) */
  is_free?: boolean
}

export type OptionRow = {
  id: string
  question_id: string
  label: string
  content: string
  is_correct: boolean
  position: number
}

export type QuestionRow = {
  id: string
  paper_id: string
  stem: string
  image_url: string | null
  explanation: string | null
  position: number
  options: OptionRow[]
}

// Papers for a given subject
export function usePapers(subjectId: string | null) {
  return useQuery({
    queryKey: ['papers', subjectId],
    enabled: !!subjectId,
    queryFn: async (): Promise<PaperRow[]> => {
      const { data, error } = await supabase
        .from('papers')
        .select('*')
        .eq('subject_id', subjectId!)
        .eq('is_published', true)
        .order('sort_order')
      if (error) throw error
      return data as PaperRow[]
    },
  })
}

// Published papers and practice sets for several subjects at once (Practice hub, Home)
export function usePapersForSubjects(subjectIds: string[]) {
  const ids = [...subjectIds].sort()
  return useQuery({
    queryKey: ['papers-for', ids.join(',')],
    enabled: ids.length > 0,
    queryFn: async (): Promise<PaperRow[]> => {
      const { data, error } = await supabase
        .from('papers')
        // '*' rather than a column list, so is_free is included once migration 07 adds it
        .select('*')
        .in('subject_id', ids)
        .eq('is_published', true)
        .order('sort_order')
      if (error) throw error
      return data as PaperRow[]
    },
  })
}

// A full paper: its questions, each with its options
export function usePaper(paperId: string | null) {
  return useQuery({
    queryKey: ['paper', paperId],
    enabled: !!paperId,
    queryFn: async (): Promise<QuestionRow[]> => {
      const { data, error } = await supabase
        .from('questions')
        .select('*, options(*)')
        .eq('paper_id', paperId!)
        .order('position')
      if (error) throw error
      // sort options within each question
      const rows = (data as unknown as QuestionRow[]).map((q) => ({
        ...q,
        options: [...q.options].sort((a, b) => a.position - b.position),
      }))
      return rows
    },
  })
}

// A single subject by id (for the subject page header)
export function useSubject(subjectId: string | null) {
  return useQuery({
    queryKey: ['subject', subjectId],
    enabled: !!subjectId,
    queryFn: async (): Promise<Subject | null> => {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('id', subjectId!)
        .single()
      if (error) throw error
      return data
    },
  })
}

// --- Phase 2.6: progress hooks ---

export type AttemptRow = {
  id: string
  score: number
  total: number
  created_at: string
  paper: {
    title: string
    subject: { name: string } | null
  } | null
}

// Recent attempts for a student, with paper + subject names
export function useAttempts(profileId: string | null) {
  return useQuery({
    queryKey: ['attempts', profileId],
    enabled: !!profileId,
    queryFn: async (): Promise<AttemptRow[]> => {
      const { data, error } = await supabase
        .from('attempts')
        .select('id, score, total, created_at, paper:papers(title, subject:subjects(name))')
        .eq('profile_id', profileId!)
        .order('created_at', { ascending: false })
        .limit(10)
      if (error) throw error
      return data as unknown as AttemptRow[]
    },
  })
}

// --- Phase 5: topics & lessons ---

export type Topic = {
  id: string
  subject_id: string
  slug: string
  name: string
  description: string | null
  group_name: string | null
  group_order: number | null
  sort_order: number
}

export type Lesson = {
  id: string
  topic_id: string
  slug: string
  title: string
  content: string
  est_minutes: number | null
  sort_order: number
  /** set once a named reviewer has checked the lesson (migration 04) */
  reviewed_at?: string | null
}

// Topics for a subject
export function useTopics(subjectId: string | null) {
  return useQuery({
    queryKey: ['topics', subjectId],
    enabled: !!subjectId,
    queryFn: async (): Promise<Topic[]> => {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('subject_id', subjectId!)
        .order('group_order', { ascending: true, nullsFirst: false })
        .order('sort_order')
      if (error) throw error
      return data as Topic[]
    },
  })
}

/** A lesson in a list: title and length, never the content (wassce_lesson_index). */
export type LessonSummary = {
  id: string
  topic_id: string
  slug: string
  title: string
  est_minutes: number | null
  sort_order: number
  /** The first lesson of its topic, open on a free account (migration 07; missing before it) */
  is_free?: boolean
}

// Lessons in a topic + the topic itself. The list comes from the lesson
// index, so a free account sees every lesson (the locked ones too).
export function useTopic(topicId: string | null) {
  return useQuery({
    queryKey: ['topic', topicId],
    enabled: !!topicId,
    queryFn: async (): Promise<{ topic: Topic; lessons: LessonSummary[] } | null> => {
      const { data: topic, error: tErr } = await supabase
        .from('topics')
        .select('*')
        .eq('id', topicId!)
        .single()
      if (tErr) throw tErr

      const { data: lessons, error: lErr } = await supabase
        .from('wassce_lesson_index')
        .select('*')
        .eq('topic_id', topicId!)
        .order('sort_order')
        .order('id')
      if (lErr) throw lErr

      return { topic: topic as Topic, lessons: (lessons ?? []) as LessonSummary[] }
    },
  })
}

// A single lesson by id, with its content. Null when the lesson is behind a
// plan the student does not have (the database does not return it).
export function useLesson(lessonId: string | null) {
  return useQuery({
    queryKey: ['lesson', lessonId],
    enabled: !!lessonId,
    queryFn: async (): Promise<Lesson | null> => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId!)
        .maybeSingle()
      if (error) throw error
      return (data as Lesson | null) ?? null
    },
  })
}

// A lesson's title and place, readable on any account (for the locked screen).
export function useLessonSummary(lessonId: string | null) {
  return useQuery({
    queryKey: ['lesson-summary', lessonId],
    enabled: !!lessonId,
    queryFn: async (): Promise<LessonSummary | null> => {
      const { data, error } = await supabase.from('wassce_lesson_index').select('*').eq('id', lessonId!).maybeSingle()
      if (error) throw error
      return (data as LessonSummary | null) ?? null
    },
  })
}

// Paper header details: title, year, type and its subject (for colours and links)
export type PaperMeta = {
  id: string
  title: string
  year: number | null
  paper_type: string | null
  description: string | null
  is_free?: boolean
  subject: { id: string; slug: string; name: string } | null
}

export function usePaperMeta(paperId: string | null) {
  return useQuery({
    queryKey: ['paper-meta', paperId],
    enabled: !!paperId,
    queryFn: async (): Promise<PaperMeta | null> => {
      const { data, error } = await supabase
        .from('papers')
        .select('*, subject:subjects(id, slug, name)')
        .eq('id', paperId!)
        .maybeSingle()
      if (error) throw error
      return data as unknown as PaperMeta | null
    },
  })
}
