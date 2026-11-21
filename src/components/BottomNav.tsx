import { Link, useRouterState } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { useAccountRole } from '@/lib/account-role'
import { AFFILIATE_NAV, STUDENT_NAV, TUTOR_NAV, roleNavItems, showsRoleNav, showsStudentNav } from '@/lib/nav'
import { tutorPagePath } from '@/lib/tutor-profile'

/**
 * Signed-in mobile navigation, fixed to the bottom safe area. Students get
 * their five study destinations; tutors and affiliates get their own (never
 * Practice or Progress). Active state = purple icon and label plus a
 * lavender indicator, so it never relies on colour alone. Hidden from 1024 px
 * up (the sidebar takes over) and on focused screens.
 */
export function BottomNav() {
  const { user } = useAuth()
  const { role, tutorSlug } = useAccountRole()
  const { pathname, hash } = useRouterState({ select: (s) => ({ pathname: s.location.pathname, hash: s.location.hash }) })
  if (!user || !role) return null

  const items: { key: string; to: string; hash?: string; label: string; icon: LucideIcon; active: boolean }[] =
    role === 'student'
      ? showsStudentNav(pathname)
        ? STUDENT_NAV.map((n) => ({ key: n.to, to: n.to, label: n.label, icon: n.icon, active: n.match(pathname) }))
        : []
      : showsRoleNav(pathname)
        ? roleNavItems(role === 'tutor' ? TUTOR_NAV : AFFILIATE_NAV, tutorSlug ? tutorPagePath(tutorSlug) : null, pathname).map((n) => ({
            key: `${n.to}#${n.hash ?? ''}`,
            to: n.to,
            hash: n.hash,
            label: n.label,
            icon: n.icon,
            active: n.match(pathname, hash),
          }))
        : []
  if (items.length === 0) return null

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <ul className="mx-auto grid max-w-xl" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map(({ key, to, hash: itemHash, label, icon: Icon, active }) => (
          <li key={key}>
            <Link
              to={to}
              hash={itemHash}
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
              <span className={`text-[11px] leading-none ${active ? 'font-semibold text-primary' : 'font-medium text-muted-foreground'}`}>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
