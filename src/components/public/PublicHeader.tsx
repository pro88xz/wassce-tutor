import { Link, useRouterState } from '@tanstack/react-router'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { BrandMark } from '@/components/BrandMark'
import { useAuth } from '@/lib/auth'

const isPublicPath = (p: string) => ['/', '/about', '/privacy', '/terms'].includes(p) || p === '/wassce' || p.startsWith('/wassce/')

const NAV = [
  { label: 'Subjects', href: '/wassce/subjects' },
  { label: 'WASSCE guide', href: '/wassce' },
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
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-4 px-4 sm:px-6">
        <a href="/" aria-label="WASSCE Tutor home">
          <BrandMark compact wordmarkClassName="max-[359px]:sr-only" />
        </a>
        <nav aria-label="Main" className="ml-4 hidden items-center gap-6 text-[15px] font-medium text-muted-foreground md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="hover:text-foreground">{n.label}</a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link to="/auth" className="hidden h-10 items-center rounded-xl px-3 text-sm font-semibold hover:text-primary sm:inline-flex">
            Sign in
          </Link>
          <Link to="/auth" className="inline-flex h-10 items-center whitespace-nowrap rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-strong">
            Start free
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="public-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-xl text-foreground hover:bg-muted md:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="public-menu" aria-label="Main" className="border-t bg-card px-4 pb-4 md:hidden">
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
