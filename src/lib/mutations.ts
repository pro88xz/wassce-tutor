import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

type SaveOnboardingArgs = {
  profileId: string
  facultyId: string
  subjectIds: string[]
}

// Writes the student's faculty + chosen subjects, marks onboarded.
export function useSaveOnboarding() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ profileId, facultyId, subjectIds }: SaveOnboardingArgs) => {
      // 1. Clear any existing subject choices (idempotent re-onboarding)
      const { error: delErr } = await supabase
        .from('student_subjects')
        .delete()
        .eq('profile_id', profileId)
      if (delErr) throw delErr

      // 2. Insert the chosen subjects
      const rows = subjectIds.map((subject_id) => ({
        profile_id: profileId,
        subject_id,
      }))
      const { error: insErr } = await supabase
        .from('student_subjects')
        .insert(rows)
      if (insErr) throw insErr

      // 3. Update the profile: set faculty + mark onboarded
      const { error: profErr } = await supabase
        .from('profiles')
        .update({
          faculty_id: facultyId,
          onboarded: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profileId)
      if (profErr) throw profErr
    },
    onSuccess: async (_data, vars) => {
      // Refetch profile + student_subjects so the dashboard sees onboarded=true immediately.
      await Promise.all([
        qc.invalidateQueries({ queryKey: ['profile', vars.profileId] }),
        qc.invalidateQueries({ queryKey: ['profile'] }),
        qc.invalidateQueries({ queryKey: ['student_subjects'] }),
      ])
      await qc.refetchQueries({ queryKey: ['profile', vars.profileId] })
    },
  })
}

type SaveAttemptArgs = {
  profileId: string
  paperId: string
  score: number
  total: number
  answers: { questionId: string; optionId: string | null; isCorrect: boolean }[]
}

// Saves a completed quiz attempt + per-question answers.
export function useSaveAttempt() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ profileId, paperId, score, total, answers }: SaveAttemptArgs) => {
      // 1. create the attempt summary
      const { data: attempt, error: aErr } = await supabase
        .from('attempts')
        .insert({ profile_id: profileId, paper_id: paperId, score, total })
        .select('id')
        .single()
      if (aErr) throw aErr

      // 2. insert the per-question answers
      if (answers.length > 0) {
        const rows = answers.map((a) => ({
          attempt_id: attempt.id,
          question_id: a.questionId,
          option_id: a.optionId,
          is_correct: a.isCorrect,
        }))
        const { error: ansErr } = await supabase.from('attempt_answers').insert(rows)
        if (ansErr) throw ansErr
      }

      return attempt.id as string
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attempts'] })
    },
  })
}

type CreateTopicArgs = {
  subject_id: string
  slug: string
  name: string
  description?: string
  sort_order?: number
}

export function useCreateTopic() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (args: CreateTopicArgs) => {
      const { data, error } = await supabase
        .from('topics')
        .insert({
          subject_id: args.subject_id,
          slug: args.slug.trim().toLowerCase().replace(/\s+/g, '-'),
          name: args.name.trim(),
          description: args.description?.trim() || null,
          sort_order: args.sort_order ?? 0,
        })
        .select('id')
        .single()
      if (error) throw error
      return data.id as string
    },
    onSuccess: (_id, vars) => {
      qc.invalidateQueries({ queryKey: ['topics', vars.subject_id] })
    },
  })
}

type UpdateTopicArgs = {
  id: string
  subject_id: string
  slug?: string
  name?: string
  description?: string
  sort_order?: number
}

export function useUpdateTopic() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (args: UpdateTopicArgs) => {
      const patch: Record<string, unknown> = {}
      if (args.slug !== undefined) patch.slug = args.slug.trim().toLowerCase().replace(/\s+/g, '-')
      if (args.name !== undefined) patch.name = args.name.trim()
      if (args.description !== undefined) patch.description = args.description?.trim() || null
      if (args.sort_order !== undefined) patch.sort_order = args.sort_order
      const { error } = await supabase.from('topics').update(patch).eq('id', args.id)
      if (error) throw error
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['topics', vars.subject_id] })
    },
  })
}

export function useDeleteTopic() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (topicId: string) => {
      const { error } = await supabase.from('topics').delete().eq('id', topicId)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['topics'] })
    },
  })
}

type CreateLessonArgs = {
  topic_id: string
  slug: string
  title: string
  content: string
  est_minutes?: number | null
  sort_order?: number
}

export function useCreateLesson() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (args: CreateLessonArgs) => {
      const { data, error } = await supabase
        .from('lessons')
        .insert({
          topic_id: args.topic_id,
          slug: args.slug.trim().toLowerCase().replace(/\s+/g, '-'),
          title: args.title.trim(),
          content: args.content,
          est_minutes: args.est_minutes ?? null,
          sort_order: args.sort_order ?? 0,
        })
        .select('id')
        .single()
      if (error) throw error
      return data.id as string
    },
    onSuccess: (_id, vars) => {
      qc.invalidateQueries({ queryKey: ['topic', vars.topic_id] })
    },
  })
}

export function useDeleteLesson() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (lessonId: string) => {
      const { error } = await supabase.from('lessons').delete().eq('id', lessonId)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['topic'] })
    },
  })
}

type CreatePaperArgs = {
  subject_id: string
  title: string
  year?: number | null
  paper_type?: string
  description?: string
  sort_order?: number
}

export function useCreatePaper() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (args: CreatePaperArgs) => {
      const { data, error } = await supabase
        .from('papers')
        .insert({
          subject_id: args.subject_id,
          title: args.title.trim(),
          year: args.year ?? null,
          paper_type: args.paper_type?.trim() || null,
          description: args.description?.trim() || null,
          sort_order: args.sort_order ?? 0,
          question_count: 0,
        })
        .select('id')
        .single()
      if (error) throw error
      return data.id as string
    },
    onSuccess: (_id, vars) => {
      qc.invalidateQueries({ queryKey: ['papers', vars.subject_id] })
    },
  })
}

export function useDeletePaper() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (paperId: string) => {
      const { error } = await supabase.from('papers').delete().eq('id', paperId)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['papers'] })
    },
  })
}

type CreateQuestionArgs = {
  paper_id: string
  stem: string
  explanation?: string
  topic_id?: string | null
  options: { label: string; content: string; is_correct: boolean }[]
}

export function useCreateQuestion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (args: CreateQuestionArgs) => {
      // Find next position
      const { data: existing } = await supabase
        .from('questions')
        .select('position')
        .eq('paper_id', args.paper_id)
        .order('position', { ascending: false })
        .limit(1)
      const nextPos = (existing?.[0]?.position ?? 0) + 1

      // 1. Insert question
      const { data: q, error: qErr } = await supabase
        .from('questions')
        .insert({
          paper_id: args.paper_id,
          stem: args.stem.trim(),
          explanation: args.explanation?.trim() || null,
          topic_id: args.topic_id || null,
          position: nextPos,
        })
        .select('id')
        .single()
      if (qErr) throw qErr

      // 2. Insert options
      const optionRows = args.options.map((o, i) => ({
        question_id: q.id,
        label: o.label,
        content: o.content.trim(),
        is_correct: o.is_correct,
        position: i + 1,
      }))
      const { error: oErr } = await supabase.from('options').insert(optionRows)
      if (oErr) {
        // best-effort rollback
        await supabase.from('questions').delete().eq('id', q.id)
        throw oErr
      }

      // 3. Bump paper's question_count
      const { data: paper } = await supabase
        .from('papers')
        .select('question_count')
        .eq('id', args.paper_id)
        .single()
      const newCount = (paper?.question_count ?? 0) + 1
      await supabase
        .from('papers')
        .update({ question_count: newCount })
        .eq('id', args.paper_id)

      return q.id as string
    },
    onSuccess: (_id, vars) => {
      qc.invalidateQueries({ queryKey: ['paper', vars.paper_id] })
      qc.invalidateQueries({ queryKey: ['papers'] })
    },
  })
}

export function useDeleteQuestion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ questionId, paperId }: { questionId: string; paperId: string }) => {
      const { error } = await supabase.from('questions').delete().eq('id', questionId)
      if (error) throw error
      // bump paper count down
      const { data: paper } = await supabase
        .from('papers')
        .select('question_count')
        .eq('id', paperId)
        .single()
      const newCount = Math.max(0, (paper?.question_count ?? 1) - 1)
      await supabase.from('papers').update({ question_count: newCount }).eq('id', paperId)
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['paper', vars.paperId] })
      qc.invalidateQueries({ queryKey: ['papers'] })
    },
  })
}
