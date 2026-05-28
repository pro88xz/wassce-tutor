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
