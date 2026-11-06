import { useAuth } from '@/lib/auth'
import { useProfile } from '@/lib/queries'
import { checkAccess } from '@/lib/access'

/** The signed-in student's profile and what their account opens. */
export function useAccess() {
  const { user } = useAuth()
  const { data: profile, isLoading } = useProfile(user?.id ?? null)
  return { profile, loading: !!user && isLoading, access: checkAccess(profile) }
}
