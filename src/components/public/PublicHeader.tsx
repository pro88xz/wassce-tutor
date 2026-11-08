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

/** Clean, full-width public navigation with a single high-contrast primary action. */
export function PublicHeader() {
  const { user } = useAuth()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [open, setOpen] = useState(false)
  if (user || !isPublicPath(pathname)) return null

  return (
    <header className="public-site-header sticky top-0 z-30 -mx-4 -mt-4 mb-6 sm:-mx-6">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center gap-4 px-5 sm:gap-7 sm:px-7 lg:px-10">
        <a href="/" aria-label="WASSCE Tutor home" className="shrink-0">
          <BrandMark compact wordmarkClassName="max-[359px]:sr-only" />
        </a>
        <nav aria-label="Main" className="ml-2 hidden min-w-0 items-center gap-1.5 text-sm font-semibold text-slate-600 min-[1100px]:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className={`whitespace-nowrap rounded-lg px-3.5 py-2.5 transition-colors duration-150 hover:bg-violet-50 hover:text-violet-800 ${pathname === n.href || (n.href === '/wassce/subjects' && pathname.startsWith('/wassce/subjects')) ? 'text-violet-800' : ''}`}>{n.label}</a>
          ))}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <Link to="/auth" className="hidden min-h-11 items-center whitespace-nowrap rounded-xl px-3.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-violet-800 sm:inline-flex">
            Sign in
          </Link>
          <Link to="/auth" className="inline-flex min-h-11 items-center whitespace-nowrap rounded-xl bg-[#6438d8] px-5 text-sm font-bold text-white shadow-[0_4px_12px_rgba(100,56,216,.2)] transition duration-150 hover:-translate-y-px hover:bg-[#5128bd] hover:shadow-[0_7px_18px_rgba(100,56,216,.25)]">
            Start free
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="public-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-700 transition-colors hover:bg-slate-100 min-[1100px]:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="public-menu" aria-label="Main" className="border-t border-slate-100 bg-white px-5 pb-4 shadow-lg min-[1100px]:hidden">
          <ul className="divide-y divide-slate-100">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center text-[15px] font-medium text-slate-700">{n.label}</a>
              </li>
            ))}
            <li>
              <Link to="/auth" onClick={() => setOpen(false)} className="flex min-h-12 items-center text-[15px] font-semibold text-violet-800">Sign in</Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
