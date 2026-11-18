import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { LogOut, MessageCircleQuestion } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { ROLE_HOME, useAccountRole } from '@/lib/account-role'
import { useProfile } from '@/lib/queries'
import { checkAccess } from '@/lib/access'
import { planById } from '@/lib/plans'
import { AFFILIATE_NAV, STUDENT_NAV, TUTOR_NAV, initialsOf, showsRoleNav, showsStudentNav } from '@/lib/nav'
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
  const { role } = useAccountRole()
  if (!user || !role) return null
  if (role !== 'student') return showsRoleNav(pathname) ? <RoleSideNav role={role} /> : null
  if (!showsStudentNav(pathname)) return null

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

const ROLE_LABEL = { tutor: 'Tutor account', affiliate: 'Affiliate account' } as const

/** A tutor's or affiliate's sidebar: their own destinations, their account, and Sign out. No study links. */
function RoleSideNav({ role }: { role: 'tutor' | 'affiliate' }) {
  const { user, signOut } = useAuth()
  const { data: profile } = useProfile(user?.id ?? null)
  const navigate = useNavigate()
  const { pathname, hash } = useRouterState({ select: (s) => ({ pathname: s.location.pathname, hash: s.location.hash }) })
  const items = role === 'tutor' ? TUTOR_NAV : AFFILIATE_NAV
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-card pt-[env(safe-area-inset-top)] lg:flex">
      <div className="flex h-16 items-center px-5">
        <Link to={ROLE_HOME[role]} aria-label="Your dashboard">
          <BrandMark />
        </Link>
      </div>
      <p className="px-6 pb-2 pt-1 text-[11px] font-bold uppercase tracking-[.14em] text-muted-foreground">{role === 'tutor' ? 'Tutor workspace' : 'Affiliate workspace'}</p>
      <nav aria-label="Main" className="flex-1 px-3 py-1">
        <ul className="space-y-1">
          {items.map(({ to, hash: itemHash, label, icon: Icon, match }) => {
            const active = match(pathname, hash)
            return (
              <li key={`${to}#${itemHash ?? ''}`}>
                <Link
                  to={to}
                  hash={itemHash}
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
      <div className="flex items-center gap-3 border-t px-4 py-3.5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-primary" aria-hidden>
          {initialsOf(profile?.full_name)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">{profile?.full_name || user?.email || 'Your account'}</span>
          <span className="block truncate text-xs text-muted-foreground">{ROLE_LABEL[role]}</span>
        </span>
        <button
          type="button"
          onClick={async () => {
            await signOut()
            await navigate({ to: '/', replace: true })
          }}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </aside>
  )
}
