import { Link, useRouterState } from '@tanstack/react-router'
import { MessageCircleQuestion } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { STUDENT_NAV, showsStudentNav } from '@/lib/nav'
import { BrandMark } from '@/components/BrandMark'

/** Desktop and large-tablet navigation: the same five destinations as the mobile bar. */
export function SideNav() {
  const { user } = useAuth()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  if (!user || !showsStudentNav(pathname)) return null

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-card lg:flex" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
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
      <div className="p-3">
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
    </aside>
  )
}
