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
