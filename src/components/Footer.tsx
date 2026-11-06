import { Link, useRouterState } from '@tanstack/react-router'
import { ChevronDown, Mail } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { BrandMark } from '@/components/BrandMark'

const SHOW_ON = ['/', '/about', '/privacy', '/terms']
const isPublicPage = (pathname: string) => SHOW_ON.includes(pathname) || pathname === '/wassce' || pathname.startsWith('/wassce/')

const CONTACT = 'secretsafe.cc@gmail.com'

type FooterLink = { label: string; href: string }
type Group = { title: string; links: FooterLink[] }

// Subject slugs are stable public URLs (supabase/migrations/20261105_03_subject_slugs.sql).
const GROUPS: Group[] = [
  {
    title: 'Learn',
    links: [
      { label: 'WASSCE guide', href: '/wassce' },
      { label: 'All subjects', href: '/wassce/subjects' },
      { label: 'English Language', href: '/wassce/english-language' },
      { label: 'Mathematics', href: '/wassce/mathematics' },
      { label: 'Biology', href: '/wassce/biology' },
      { label: 'Chemistry', href: '/wassce/chemistry' },
      { label: 'Physics', href: '/wassce/physics' },
    ],
  },
  {
    title: 'Product',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Plans', href: '/#plans' },
      { label: 'Sign in', href: '/auth' },
      { label: 'About', href: '/about' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact us', href: `mailto:${CONTACT}` },
      { label: 'Report a problem', href: `mailto:${CONTACT}?subject=${encodeURIComponent('Problem report: WASSCE Tutor')}` },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
]

/**
 * Public footer (Blueprint v2, section 02): brand first, then Learn,
 * Product, Support and Legal. Desktop shows columns; mobile shows the brand
 * and contact, then collapsible groups with 44 px rows, then a legal row.
 * Signed-in students never see it: they have the bottom navigation.
 */
export function Footer() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const { user } = useAuth()
  if (user) return null
  if (!isPublicPage(pathname)) return null

  return (
    <footer className="-mx-4 -mb-12 mt-16 border-t bg-card sm:-mx-6">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-8 sm:grid-cols-[1.4fr_repeat(4,1fr)]">
          {/* Brand */}
          <div className="space-y-3">
            <BrandMark />
            <p className="max-w-xs text-sm text-muted-foreground">
              WASSCE lessons, practice questions and an AI tutor, organised around the syllabus. Built in Freetown for Sierra Leone students.
            </p>
            <a href={`mailto:${CONTACT}`} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline sm:hidden">
              <Mail className="h-4 w-4" aria-hidden /> Contact us
            </a>
          </div>

          {/* Desktop columns */}
          {GROUPS.map((g) => (
            <nav key={g.title} aria-label={g.title} className="hidden space-y-3 sm:block">
              <p className="text-sm font-semibold">{g.title}</p>
              <ul className="space-y-2">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <FooterAnchor link={l} className="text-sm text-muted-foreground hover:text-foreground" />
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Mobile accordions (legal sits in the bottom row instead) */}
          <div className="divide-y border-y sm:hidden">
            {GROUPS.filter((g) => g.title !== 'Legal').map((g) => (
              <details key={g.title} className="group [&_summary::-webkit-details-marker]:hidden" open={g.title === 'Support'}>
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-[15px] font-semibold">
                  {g.title}
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <ul className="pb-2">
                  {g.links.map((l) => (
                    <li key={l.label}>
                      <FooterAnchor link={l} className="flex min-h-11 items-center text-[15px] text-muted-foreground hover:text-foreground" />
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t pt-6 text-xs text-muted-foreground sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> WASSCE Tutor. An independent study service, not affiliated with WAEC.
          </p>
          <p className="flex gap-4 sm:hidden">
            <Link to="/privacy" className="inline-flex min-h-11 items-center text-sm hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="inline-flex min-h-11 items-center text-sm hover:text-foreground">Terms</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterAnchor({ link, className }: { link: FooterLink; className: string }) {
  return (
    <a href={link.href} className={className}>
      {link.label}
    </a>
  )
}
