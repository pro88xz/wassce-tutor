import { useAuth } from '@/lib/auth'
import { useAccountRole } from '@/lib/account-role'
import { showsRoleNav, showsStudentNav } from '@/lib/nav'

/** Whether the signed-in person has the bottom bar on this screen (the page leaves room for it). */
export function useHasBottomNav(pathname: string): boolean {
  const { user } = useAuth()
  const { role } = useAccountRole()
  if (!user || !role) return false
  return role === 'student' ? showsStudentNav(pathname) : showsRoleNav(pathname)
}
