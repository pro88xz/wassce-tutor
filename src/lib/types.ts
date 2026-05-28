export type SubjectRole = 'core' | 'faculty' | 'elective'

export type Faculty = {
  id: string
  slug: string
  name: string
  description: string | null
  sort_order: number
}

export type Subject = {
  id: string
  slug: string
  name: string
  description: string | null
}

// A subject as it relates to a faculty (joined view)
export type FacultySubject = {
  id: string
  faculty_id: string
  subject_id: string
  role: SubjectRole
  is_default: boolean
  sort_order: number
  subject: Subject
}

export type Profile = {
  id: string
  full_name: string | null
  faculty_id: string | null
  onboarded: boolean
  trial_started_at: string | null
  subscription_active: boolean
  subscription_expires_at: string | null
  is_admin: boolean
}
