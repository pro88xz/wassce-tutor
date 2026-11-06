import { Link, useRouterState } from '@tanstack/react-router'
import { MessageCircleQuestion } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/lib/queries'
import { initialsOf, showsStudentNav } from '@/lib/nav'
import { BrandMark } from '@/components/BrandMark'

/**
 * Compact top bar for the signed-in workspace: brand (mobile), the AI tutor as
 * a contextual shortcut (not a sixth navigation destination) and account access.
 */
export function TopBar() {
  const { user } = useAuth()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const { data: profile } = useProfile(user?.id ?? null)
  if (!user || !showsStudentNav(pathname)) return null

  const onTutor = pathname === '/tutor' || pathname.startsWith('/tutor/')
  return (
    <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4 sm:px-6">
        <Link to="/" aria-label="WASSCE Tutor home" className="lg:hidden">
          <BrandMark compact />
        </Link>
        <div className="ml-auto flex items-center gap-2">
          {!onTutor && (
            <Link
              to="/tutor"
              className="inline-flex h-10 min-w-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border bg-card px-3 text-sm font-semibold transition-colors hover:border-primary/40 hover:bg-brand-soft/40 lg:hidden"
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
