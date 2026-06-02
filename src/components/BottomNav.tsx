import { Link, useRouterState } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth'

type Tab = {
  to: '/' | '/subjects' | '/progress' | '/profile' | '/tutor'
  label: string
  icon: (active: boolean) => React.ReactNode
}

const leftTabs: Tab[] = [
  {
    to: '/',
    label: 'Home',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.4 : 1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12 12 3l9 9M5 10v10a1 1 0 0 0 1 1h4v-7h4v7h4a1 1 0 0 0 1-1V10" />
      </svg>
    ),
  },
  {
    to: '/subjects',
    label: 'Subjects',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.4 : 1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a2 2 0 0 1 2-2h10l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 11h8M8 15h5" />
      </svg>
    ),
  },
]

const rightTabs: Tab[] = [
  {
    to: '/progress',
    label: 'Progress',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.4 : 1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l5-5 4 4 8-8M14 8h6v6" />
      </svg>
    ),
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.4 : 1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0" />
      </svg>
    ),
  },
]

export function BottomNav() {
  const { user } = useAuth()
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  if (!user) return null

  const hideOn = ['/auth', '/onboarding', '/reset-password', '/subscribe']
  if (hideOn.some((p) => pathname.startsWith(p))) return null

  const isActive = (to: string) =>
    to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(to + '/')

  const renderTab = (tab: Tab) => {
    const active = isActive(tab.to)
    return (
      <Link
        key={tab.to}
        to={tab.to}
        className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-xs ${
          active ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        {tab.icon(active)}
        <span className={active ? 'font-semibold' : ''}>{tab.label}</span>
      </Link>
    )
  }

  const tutorActive = isActive('/tutor')

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex max-w-3xl items-stretch relative">
        {leftTabs.map(renderTab)}

        {/* Centered raised Tutor button */}
        <div className="flex-1 flex justify-center items-start pt-1.5">
          <Link
            to="/tutor"
            className={`relative -mt-6 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition ${
              tutorActive
                ? 'bg-primary text-primary-foreground shadow-primary/40'
                : 'bg-primary text-primary-foreground shadow-primary/30'
            }`}
            aria-label="Tutor"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="h-7 w-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.97-4.03 9-9 9-1.45 0-2.81-.34-4.02-.95L3 21l1.05-3.98C3.4 15.81 3 14.45 3 13c0-4.97 4.03-9 9-9s9 4.03 9 8z" />
              <circle cx="9" cy="12" r="0.8" fill="currentColor" />
              <circle cx="12" cy="12" r="0.8" fill="currentColor" />
              <circle cx="15" cy="12" r="0.8" fill="currentColor" />
            </svg>
            <span className="absolute -bottom-5 text-[10px] font-bold text-primary">Tutor</span>
          </Link>
        </div>

        {rightTabs.map(renderTab)}
      </div>
    </nav>
  )
}
