import { Link, useRouterState } from '@tanstack/react-router'
import { GraduationCap } from 'lucide-react'
import { useAuth } from '@/lib/auth'

const isPublicPath = (p: string) => ['/', '/about', '/privacy', '/terms'].includes(p) || p === '/wassce' || p.startsWith('/wassce/')

/**
 * Top bar for logged-out visitors on public pages: brand, main sections, and
 * sign-in / sign-up. Real links, so search engines see the site structure.
 */
export function PublicHeader() {
  const { user } = useAuth()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  if (user || !isPublicPath(pathname)) return null
  return (
    <header className="sticky top-0 z-30 -mx-6 -mt-6 mb-6 border-b bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4 sm:px-6">
        <a href="/" className="flex items-center gap-2 font-black tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-white">
            <GraduationCap className="h-5 w-5" aria-hidden />
          </span>
          <span className="whitespace-nowrap">WASSCE Tutor</span>
        </a>
        <nav aria-label="Main" className="ml-2 hidden items-center gap-5 text-sm font-medium text-muted-foreground sm:flex">
          <a href="/wassce/subjects" className="hover:text-foreground">Subjects</a>
          <a href="/wassce" className="hover:text-foreground">WASSCE guide</a>
          <a href="/#plans" className="hover:text-foreground">Plans</a>
          <a href="/about" className="hover:text-foreground">About</a>
        </nav>
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link to="/auth" className="whitespace-nowrap rounded-lg px-2 py-1.5 text-sm font-semibold hover:text-primary">
            Sign in
          </Link>
          <Link to="/auth" className="whitespace-nowrap rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90">
            Start free
          </Link>
        </div>
      </div>
    </header>
  )
}
