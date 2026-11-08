import { Link, useRouterState } from '@tanstack/react-router'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { BrandMark } from '@/components/BrandMark'
import { useAuth } from '@/lib/auth'

const isPublicPath = (p: string) =>
  ['/', '/about', '/contact', '/privacy', '/terms'].includes(p) || p === '/wassce' || p.startsWith('/wassce/') || p === '/tutors' || p.startsWith('/tutors/')

const NAV = [
  { label: 'Subjects', href: '/wassce/subjects' },
  { label: 'WASSCE guide', href: '/wassce' },
  { label: 'Book a tutor', href: '/tutors' },
  { label: 'Plans', href: '/#plans' },
  { label: 'About', href: '/about' },
]

/**
 * Top bar for logged-out visitors on public pages: brand, main sections,
 * Sign in and one primary Start free action. On phones the sections move
 * into a menu instead of shrinking. Real links, so search engines see the
 * site structure.
 */
export function PublicHeader() {
  const { user } = useAuth()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [open, setOpen] = useState(false)
  if (user || !isPublicPath(pathname)) return null

  return (
    <header className="sticky top-0 z-30 -mx-4 -mt-4 mb-6 border-b bg-background/95 backdrop-blur-md sm:-mx-6 sm:-mt-6">
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center gap-3 px-4 sm:gap-5 sm:px-6 lg:px-8">
        <a href="/" aria-label="WASSCE Tutor home">
          <BrandMark compact wordmarkClassName="max-[359px]:sr-only" />
        </a>
        <nav aria-label="Main" className="ml-2 hidden items-center gap-1 text-[13px] font-semibold text-muted-foreground min-[880px]:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className={`rounded-lg px-3 py-2 transition-colors hover:bg-muted hover:text-foreground ${pathname === n.href || (n.href === '/wassce/subjects' && pathname.startsWith('/wassce/subjects')) ? 'bg-primary/10 text-primary' : ''}`}>{n.label}</a>
          ))}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Link to="/auth" className="hidden min-h-10 items-center whitespace-nowrap rounded-xl px-3 text-sm font-semibold hover:text-primary sm:inline-flex">
            Sign in
          </Link>
          <Link to="/auth" className="inline-flex min-h-10 items-center whitespace-nowrap rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-sm shadow-primary/20 transition hover:-translate-y-px hover:bg-brand-strong">
            Start free
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="public-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-xl text-foreground hover:bg-muted min-[880px]:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="public-menu" aria-label="Main" className="border-t bg-card px-4 pb-4 min-[880px]:hidden">
          <ul className="divide-y">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center text-[15px] font-medium">{n.label}</a>
              </li>
            ))}
            <li>
              <Link to="/auth" onClick={() => setOpen(false)} className="flex min-h-12 items-center text-[15px] font-semibold text-primary">Sign in</Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
