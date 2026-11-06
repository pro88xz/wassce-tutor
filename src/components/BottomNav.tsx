import { Link, useRouterState } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth'
import { STUDENT_NAV, showsStudentNav } from '@/lib/nav'

/**
 * Signed-in mobile navigation: five primary destinations, fixed to the bottom
 * safe area. Active state = purple icon and label plus a lavender indicator,
 * so it never relies on colour alone. Hidden from 1024 px up (the sidebar
 * takes over) and on focused screens (see showsStudentNav).
 */
export function BottomNav() {
  const { user } = useAuth()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  if (!user || !showsStudentNav(pathname)) return null

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <ul className="mx-auto grid max-w-xl grid-cols-5">
        {STUDENT_NAV.map(({ to, label, icon: Icon, match }) => {
          const active = match(pathname)
          return (
            <li key={to}>
              <Link
                to={to}
                aria-current={active ? 'page' : undefined}
                className="flex min-h-[60px] flex-col items-center justify-center gap-1 px-1 py-2"
              >
                <span
                  className={`flex h-7 w-14 items-center justify-center rounded-full transition-colors duration-150 ${
                    active ? 'bg-brand-soft text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.8} aria-hidden />
                </span>
                <span className={`text-[11px] leading-none ${active ? 'font-semibold text-primary' : 'font-medium text-muted-foreground'}`}>
                  {label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
