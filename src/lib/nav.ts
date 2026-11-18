// One source of truth for the signed-in student's navigation (Blueprint v2,
// section 03). The mobile bottom bar and the desktop sidebar both render this
// list, so destination names, order and active states can never drift apart.
import { BadgePercent, BookOpen, CircleUser, ClipboardList, House, IdCard, LifeBuoy, MessageCircle, ShieldCheck, Store, TrendingUp, Wallet } from 'lucide-react'
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
 * Tutors and affiliates have their own navigation (never the student one):
 * their home, the parts of it they use most, and the public pages that belong
 * to their work. A link with a hash opens that section of their home.
 */
export type RoleNavItem = {
  to: string
  hash?: string
  label: string
  icon: LucideIcon
  match: (pathname: string, hash: string) => boolean
  /** The tutor's own page: `to` is filled in with /tutors/{their slug} (hidden until known). */
  ownPage?: true
}

export const TUTOR_NAV: RoleNavItem[] = [
  { to: '/tutor-dashboard', label: 'Home', icon: House, match: (p, h) => p === '/tutor-dashboard' && !h },
  { to: '/tutor-dashboard/review', label: 'Review', icon: ShieldCheck, match: (p) => under(p, '/tutor-dashboard/review') },
  { to: '/tutor-dashboard', hash: 'students', label: 'Students', icon: MessageCircle, match: (p, h) => p === '/tutor-dashboard' && h === 'students' },
  { to: '/tutors', label: 'My page', icon: IdCard, ownPage: true, match: () => false },
  { to: '/tutors', label: 'Marketplace', icon: Store, match: (p) => p === '/tutors' || under(p, '/become-a-tutor') },
]

/** A role's navigation with the tutor's own page filled in (or left out until it is known). */
export function roleNavItems(items: RoleNavItem[], ownPage: string | null, pathname: string): RoleNavItem[] {
  return items.flatMap((n) => (n.ownPage ? (ownPage ? [{ ...n, to: ownPage, match: (p: string) => p === ownPage }] : []) : [n])).map((n) =>
    // The marketplace tab is not lit on the tutor's own page.
    n.label === 'Marketplace' && ownPage && pathname === ownPage ? { ...n, match: () => false } : n,
  )
}

export const AFFILIATE_NAV: RoleNavItem[] = [
  { to: '/affiliate-dashboard', label: 'Home', icon: House, match: (p, h) => p === '/affiliate-dashboard' && !h },
  { to: '/affiliate-dashboard', hash: 'payouts', label: 'Payouts', icon: Wallet, match: (p, h) => p === '/affiliate-dashboard' && h === 'payouts' },
  { to: '/affiliate', label: 'Programme', icon: BadgePercent, match: (p) => under(p, '/affiliate') },
  { to: '/contact', label: 'Help', icon: LifeBuoy, match: (p) => under(p, '/contact') },
]

/** The pages that belong to a tutor's or affiliate's work: "back" within them is ordinary navigation. */
export function inRoleArea(role: 'tutor' | 'affiliate', pathname: string): boolean {
  return role === 'tutor'
    ? under(pathname, '/tutor-dashboard', '/tutors', '/become-a-tutor', '/contact')
    : under(pathname, '/affiliate-dashboard', '/affiliate', '/contact')
}

/** Screens with a tutor's or affiliate's navigation: everywhere but sign-in and the admin area. */
export function showsRoleNav(pathname: string): boolean {
  return !under(pathname, '/auth', '/reset-password', '/admin')
}

/**
 * Screens without the student navigation: sign-in and set-up flows, focused
 * checkout, the admin area (its own role-specific screens) and focused
 * assessment (a paper in progress has its own exit path).
 */
export function showsStudentNav(pathname: string): boolean {
  return !under(pathname, '/auth', '/onboarding', '/reset-password', '/subscribe', '/admin', '/paper', '/become-a-tutor', '/tutor-dashboard', '/affiliate', '/affiliate-dashboard')
}

/** Up to two initials for the account avatar ("Fatmata Sesay" -> "FS"). */
export function initialsOf(name: string | null | undefined): string {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  return (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : parts[0][0]).toUpperCase()
}
