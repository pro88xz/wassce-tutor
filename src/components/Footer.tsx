import { Link, useRouterState } from '@tanstack/react-router'
import { ChevronDown, Mail, MapPin } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { ADDRESS_LINE, CONTACT, whatsappChatLink } from '@/lib/contact'
import { BrandMark } from '@/components/BrandMark'
import { GOOGLE_REVIEW_URL } from '@/lib/reviews'
import { WhatsAppGlyph } from '@/components/WhatsAppGlyph'

const SHOW_ON = ['/', '/about', '/contact', '/privacy', '/terms']
const isPublicPage = (pathname: string) =>
  SHOW_ON.includes(pathname) || pathname === '/affiliate' || pathname === '/become-a-tutor' || pathname === '/wassce' || pathname.startsWith('/wassce/') || pathname === '/tutors' || pathname.startsWith('/tutors/') || pathname === '/blog' || pathname.startsWith('/blog/') || pathname === '/universities' || pathname.startsWith('/universities/')

type FooterLink = { label: string; href: string }
type Group = { title: string; links: FooterLink[] }

// Subject slugs are stable public URLs (supabase/migrations/20261105_03_subject_slugs.sql).
const GROUPS: Group[] = [
  {
    title: 'Learn',
    links: [
      { label: 'WASSCE guide', href: '/wassce' },
      { label: 'University directory', href: '/universities' },
      { label: 'Editorial blog', href: '/blog' },
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
      { label: 'Book a tutor', href: '/tutors' },
      { label: 'Become a tutor', href: '/become-a-tutor' },
      { label: 'Affiliate programme', href: '/affiliate' },
      { label: 'Plans', href: '/#plans' },
      { label: 'Sign in', href: '/auth' },
      { label: 'About', href: '/about' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact us', href: '/contact' },
      { label: 'WhatsApp group', href: CONTACT.whatsappGroup },
      { label: 'Review us on Google', href: GOOGLE_REVIEW_URL },
      { label: 'Report a problem', href: `mailto:${CONTACT.email}?subject=${encodeURIComponent('Problem report: WASSCE Tutor')}` },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Photo credits', href: '/about#photo-credits' },
    ],
  },
]

/**
 * Public footer (Blueprint v2, section 02): brand and contact details first,
 * then Learn, Product, Support and Legal. The address, phone and email are
 * always visible as plain text (never inside an accordion), so visitors and
 * search engines can find them. Desktop shows columns; mobile shows the brand
 * and contact, then collapsible groups with 44 px rows, then a legal row.
 * Signed-in students never see it: they have the bottom navigation.
 */
export function Footer() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const { user } = useAuth()
  if (user) return null
  if (!isPublicPage(pathname)) return null

  return (
    <footer data-public-footer className="site-bleed -mb-12 mt-16 overflow-hidden bg-[var(--site-ink)] text-white">
      <div className="site-container py-12 sm:py-16">
        <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-[minmax(260px,1.7fr)_repeat(4,minmax(0,1fr))] lg:gap-x-12">
          {/* Brand and contact: a full-width row on tablets, the first column on desktop */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <BrandMark tone="light" />
            <p className="max-w-xs text-sm leading-relaxed text-white/70">
              WASSCE lessons and practice questions, organised around the syllabus. Built in Freetown for Sierra Leone students.
            </p>
            <address className="space-y-1 text-sm not-italic text-white/70">
              <p className="flex min-h-9 items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" aria-hidden /> {ADDRESS_LINE}
              </p>
              <a href={whatsappChatLink()} target="_blank" rel="noopener" className="flex min-h-9 items-center gap-2 transition-colors hover:text-white">
                <WhatsAppGlyph className="h-4 w-4 shrink-0 text-[#1a8d4a]" /> {`WhatsApp ${CONTACT.phoneDisplay}`}
              </a>
              <a href={`mailto:${CONTACT.email}`} className="flex min-h-9 items-center gap-2 break-all transition-colors hover:text-white">
                <Mail className="h-4 w-4 shrink-0" aria-hidden /> {CONTACT.email}
              </a>
            </address>
            <a
              href={CONTACT.whatsappGroup}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-11 py-2 items-center gap-2 whitespace-nowrap rounded-xl bg-[#1a8d4a] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#157a3f]"
            >
              <WhatsAppGlyph className="h-5 w-5" /> Join our WhatsApp group
            </a>
          </div>

          {/* Desktop columns */}
          {GROUPS.map((g) => (
            <nav key={g.title} aria-label={g.title} className="hidden space-y-4 sm:block">
              <p className="text-sm font-bold tracking-wide text-white">{g.title}</p>
              <ul className="space-y-3">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <FooterAnchor link={l} className="text-sm text-white/65 transition-colors hover:text-white" />
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Mobile accordions (legal sits in the bottom row instead) */}
          <div className="divide-y divide-white/10 border-y border-white/15 sm:hidden">
            {GROUPS.filter((g) => g.title !== 'Legal').map((g) => (
              <details key={g.title} className="group [&_summary::-webkit-details-marker]:hidden" open={g.title === 'Support'}>
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-[15px] font-semibold text-white">
                  {g.title}
                  <ChevronDown className="h-4 w-4 text-white/60 transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <ul className="pb-2">
                  {g.links.map((l) => (
                    <li key={l.label}>
                      <FooterAnchor link={l} className="flex min-h-11 items-center text-[15px] text-white/65 transition-colors hover:text-white" />
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-7 text-xs text-white/55 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> WASSCE Tutor. An independent study service, not affiliated with WAEC.
          </p>
          <div className="flex items-center justify-between gap-5 sm:justify-end">
            <a href="https://www.linkedin.com/in/mohamed-bangura-6b209944a/" target="_blank" rel="noopener noreferrer" aria-label="Connect with WASSCE Tutor founder on LinkedIn" className="inline-flex min-h-11 items-center gap-2 text-sm text-white/65 transition-colors hover:text-white">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM3.56 9h3.554v11.452H3.56zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/></svg> Connect on LinkedIn
            </a>
            <p className="flex gap-4 sm:hidden">
              <Link to="/privacy" className="inline-flex min-h-11 items-center text-sm text-white/65 hover:text-white">Privacy</Link>
              <Link to="/terms" className="inline-flex min-h-11 items-center text-sm hover:text-white">Terms</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterAnchor({ link, className }: { link: FooterLink; className: string }) {
  return (
    <a href={link.href} className={className} {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {})}>
      {link.label}
    </a>
  )
}
