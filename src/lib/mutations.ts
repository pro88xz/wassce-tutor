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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] })
      qc.invalidateQueries({ queryKey: ['student_subjects'] })
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
