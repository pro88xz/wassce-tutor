// Whether a new tutor's card goes live the moment they apply (migration 25,
// public.tutor_settings.auto_approve), or waits for an admin's review. Admins
// switch it in Admin, Tutors. Pages that explain the steps read it, so they
// never promise "live at once" while applications are being reviewed.
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export async function fetchTutorAutoApprove(): Promise<boolean | null> {
  const { data, error } = await supabase.from('tutor_settings').select('auto_approve').maybeSingle()
  if (error || !data) return null
  return Boolean(data.auto_approve)
}

/** True while new tutors go live at once. Starts true (the current setting) until the database answers. */
export function useTutorAutoApprove(): boolean {
  const [auto, setAuto] = useState(true)
  useEffect(() => {
    let active = true
    void fetchTutorAutoApprove().then((value) => {
      if (active && value !== null) setAuto(value)
    })
    return () => {
      active = false
    }
  }, [])
  return auto
}
