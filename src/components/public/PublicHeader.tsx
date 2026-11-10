import { Link, useRouterState } from '@tanstack/react-router'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { BrandMark } from '@/components/BrandMark'
import { useAuth } from '@/lib/auth'

const isPublicPath = (p: string) =>
  ['/', '/about', '/contact', '/privacy', '/terms'].includes(p) || p === '/wassce' || p.startsWith('/wassce/') || p === '/tutors' || p.startsWith('/tutors/') || p === '/affiliate' || p === '/become-a-tutor' || p === '/blog' || p.startsWith('/blog/') || p === '/universities' || p.startsWith('/universities/')

const NAV = [
  { label: 'Subjects', href: '/wassce/subjects' },
  { label: 'WASSCE guide', href: '/wassce' },
  { label: 'Book a tutor', href: '/tutors' },
  { label: 'Universities', href: '/universities' },
  { label: 'Blog', href: '/blog' },
  { label: 'Plans', href: '/#plans' },
  { label: 'About', href: '/about' },
]

/** A nav item is active on its own page; "Subjects" also covers every subject, topic and lesson page. */
const isActive = (pathname: string, href: string) =>
  pathname === href || (href === '/wassce/subjects' && pathname.startsWith('/wassce/') && pathname !== '/wassce')

/** Clean, full-width public navigation with a single high-contrast primary action. */
export function PublicHeader() {
  const { user } = useAuth()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [open, setOpen] = useState(false)
  if (user || !isPublicPath(pathname)) return null

  return (
    <header className="public-site-header site-bleed sticky top-0 z-30 -mt-4 mb-6 sm:-mt-6">
      <div className="site-container flex h-[4.25rem] items-center gap-4 sm:gap-6">
        <a href="/" aria-label="WASSCE Tutor home" className="shrink-0">
          <BrandMark compact wordmarkClassName="max-[359px]:sr-only" />
        </a>
        <nav aria-label="Main" className="ml-3 hidden min-w-0 items-center gap-0.5 text-sm font-semibold text-muted-foreground min-[1100px]:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} aria-current={isActive(pathname, n.href) ? 'page' : undefined} className={`whitespace-nowrap rounded-lg px-3 py-2.5 transition-colors duration-150 hover:bg-accent hover:text-accent-foreground ${isActive(pathname, n.href) ? 'text-primary' : ''}`}>{n.label}</a>
          ))}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <Link to="/auth" className="hidden min-h-11 items-center whitespace-nowrap rounded-xl px-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground sm:inline-flex">
            Sign in
          </Link>
          <Link to="/auth" className="site-btn site-btn-primary min-h-11 px-5 text-sm">
            Start free
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="public-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-accent min-[1100px]:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="public-menu" aria-label="Main" className="border-t bg-card pb-4 shadow-lg min-[1100px]:hidden">
          <ul className="site-container divide-y">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center text-[15px] font-semibold text-foreground">{n.label}</a>
              </li>
            ))}
            <li>
              <Link to="/auth" onClick={() => setOpen(false)} className="flex min-h-12 items-center text-[15px] font-bold text-primary">Sign in</Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
