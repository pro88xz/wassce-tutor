import { Link, useRouterState } from '@tanstack/react-router'
import { MessageCircleQuestion } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { ROLE_HOME, useAccountRole } from '@/lib/account-role'
import { useProfile } from '@/lib/queries'
import { initialsOf, showsRoleNav, showsStudentNav } from '@/lib/nav'
import { BrandMark } from '@/components/BrandMark'

/**
 * Compact top bar for the signed-in workspace on phones and tablets: brand,
 * the tutor as a contextual shortcut (not a sixth navigation destination) and
 * account access. From 1024 px the sidebar carries all three, so the bar is
 * hidden rather than left as an empty strip above every page.
 */
export function TopBar() {
  const { user } = useAuth()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const { data: profile } = useProfile(user?.id ?? null)
  const { role } = useAccountRole()
  if (!user || !role) return null
  // Tutors and affiliates: their brand link goes to their own home; no study tutor shortcut.
  // Their workspace screens have the workspace bar instead.
  if (role !== 'student') {
    // Their workspace screens (the dashboard and its pages) have the workspace bar instead.
    if (!showsRoleNav(pathname) || pathname === ROLE_HOME[role] || pathname.startsWith(`${ROLE_HOME[role]}/`)) return null
    return (
      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex min-h-14 max-w-[79rem] items-center gap-3 px-4 py-2 sm:px-6">
          <Link to={ROLE_HOME[role]} aria-label="Your dashboard">
            <BrandMark compact />
          </Link>
          <Link
            to={ROLE_HOME[role]}
            className="ml-auto inline-flex min-h-10 items-center rounded-xl border bg-card px-3 text-sm font-semibold transition-colors hover:border-primary/40"
          >
            {role === 'tutor' ? 'Tutor dashboard' : 'Affiliate dashboard'}
          </Link>
        </div>
      </header>
    )
  }
  if (!showsStudentNav(pathname)) return null

  const onTutor = pathname === '/tutor' || pathname.startsWith('/tutor/')
  return (
    <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur-md lg:hidden">
      <div className="mx-auto flex min-h-14 max-w-[79rem] items-center gap-3 px-4 py-2 sm:px-6">
        <Link to="/" aria-label="WASSCE Tutor home">
          <BrandMark compact />
        </Link>
        <div className="ml-auto flex items-center gap-2">
          {!onTutor && (
            <Link
              to="/tutor"
              className="inline-flex min-h-10 py-2 min-w-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border bg-card px-3 text-sm font-semibold transition-colors hover:border-primary/40 hover:bg-brand-soft/40 lg:hidden text-center"
            >
              <MessageCircleQuestion className="h-4 w-4 text-primary" aria-hidden />
              <span className="sr-only min-[360px]:not-sr-only">Ask tutor</span>
            </Link>
          )}
          <Link
            to="/account"
            aria-label="Account"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            {initialsOf(profile?.full_name)}
          </Link>
        </div>
      </div>
    </header>
  )
}
