// One source of truth for the signed-in student's navigation (Blueprint v2,
// section 03). The mobile bottom bar and the desktop sidebar both render this
// list, so destination names, order and active states can never drift apart.
import { BookOpen, CircleUser, ClipboardList, House, TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type NavItem = {
  to: '/' | '/subjects' | '/practice' | '/progress' | '/account'
  label: string
  icon: LucideIcon
  /** routes that belong to this destination (for the active state) */
  match: (pathname: string) => boolean
}

const under = (pathname: string, ...prefixes: string[]) => prefixes.some((p) => pathname === p || pathname.startsWith(p + '/'))

export const STUDENT_NAV: NavItem[] = [
  { to: '/', label: 'Home', icon: House, match: (p) => p === '/' },
  { to: '/subjects', label: 'Subjects', icon: BookOpen, match: (p) => under(p, '/subjects', '/subject', '/topic', '/lesson') },
  { to: '/practice', label: 'Practice', icon: ClipboardList, match: (p) => under(p, '/practice', '/paper') },
  { to: '/progress', label: 'Progress', icon: TrendingUp, match: (p) => under(p, '/progress') },
  { to: '/account', label: 'Account', icon: CircleUser, match: (p) => under(p, '/account', '/profile') },
]

/**
 * Screens without the student navigation: sign-in and set-up flows, focused
 * checkout, the admin area (its own role-specific screens) and focused
 * assessment (a paper in progress has its own exit path).
 */
export function showsStudentNav(pathname: string): boolean {
  return !under(pathname, '/auth', '/onboarding', '/reset-password', '/subscribe', '/admin', '/paper')
}

/** Up to two initials for the account avatar ("Fatmata Sesay" -> "FS"). */
export function initialsOf(name: string | null | undefined): string {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  return (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : parts[0][0]).toUpperCase()
}
