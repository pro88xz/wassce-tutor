import { Link, useRouterState } from '@tanstack/react-router'
import { MessageCircleQuestion } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/lib/queries'
import { checkAccess } from '@/lib/access'
import { planById } from '@/lib/plans'
import { STUDENT_NAV, initialsOf, showsStudentNav } from '@/lib/nav'
import { BrandMark } from '@/components/BrandMark'

/**
 * Desktop navigation: the same five destinations as the mobile bar, the tutor
 * shortcut, and the signed-in student with their plan. From 1024 px this
 * replaces the top bar, so the page itself starts at the top of the screen.
 */
export function SideNav() {
  const { user } = useAuth()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const { data: profile } = useProfile(user?.id ?? null)
  if (!user || !showsStudentNav(pathname)) return null

  const access = checkAccess(profile)
  const plan =
    access.reason === 'admin'
      ? 'Admin'
      : access.reason === 'subscribed'
        ? `${planById(profile?.subscription_plan)?.name ?? 'Full'} plan`
        : access.reason === 'trial'
          ? 'Free trial'
          : 'Free account'

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-card pt-[env(safe-area-inset-top)] lg:flex">
      <div className="flex h-16 items-center px-5">
        <Link to="/" aria-label="WASSCE Tutor home">
          <BrandMark />
        </Link>
      </div>
      <nav aria-label="Main" className="flex-1 px-3 py-2">
        <ul className="space-y-1">
          {STUDENT_NAV.map(({ to, label, icon: Icon, match }) => {
            const active = match(pathname)
            return (
              <li key={to}>
                <Link
                  to={to}
                  aria-current={active ? 'page' : undefined}
                  className={`flex h-11 items-center gap-3 rounded-xl px-3 text-sm transition-colors duration-150 ${
                    active ? 'bg-brand-soft font-semibold text-primary' : 'font-medium text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.8} aria-hidden />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className={`p-3 ${pathname === '/tutor' ? 'hidden' : ''}`}>
        <Link
          to="/tutor"
          className="flex items-start gap-3 rounded-xl border p-3 transition-colors hover:border-primary/40 hover:bg-brand-soft/40"
        >
          <MessageCircleQuestion className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
          <span>
            <span className="block text-sm font-semibold">Ask the AI tutor</span>
            <span className="block text-xs text-muted-foreground">Stuck on a topic? Get it explained step by step.</span>
          </span>
        </Link>
      </div>
      <Link
        to="/account"
        aria-label={`Account: ${profile?.full_name ?? 'your profile'}, ${plan}`}
        className="flex items-center gap-3 border-t px-4 py-3.5 transition-colors hover:bg-muted"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-primary">
          {initialsOf(profile?.full_name)}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">{profile?.full_name || 'Your account'}</span>
          <span className="block truncate text-xs text-muted-foreground">{plan}</span>
        </span>
      </Link>
    </aside>
  )
}
