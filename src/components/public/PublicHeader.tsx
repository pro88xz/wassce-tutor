import { Link, useRouterState } from '@tanstack/react-router'
import { useState } from 'react'
import { Menu, X, ArrowUpRight, Bluetooth, Keyboard, MousePointer2 } from 'lucide-react'
import { BrandMark } from '@/components/BrandMark'
import { useAuth } from '@/lib/auth'
import { SignInLink } from '@/components/auth/SignInLink'

const isPublicPath = (p: string) =>
  ['/', '/about', '/contact', '/privacy', '/terms'].includes(p) || p === '/wassce' || p.startsWith('/wassce/') || p === '/tutors' || p.startsWith('/tutors/') || p === '/affiliate' || p === '/become-a-tutor' || p === '/blog' || p.startsWith('/blog/') || p === '/universities' || p.startsWith('/universities/')

const NAV = [
  { label: 'Subjects', href: '/wassce/subjects' },
  { label: 'WASSCE guide', href: '/wassce' },
  { label: 'Private tutors', href: '/tutors' },
  { label: 'Universities', href: '/universities' },
  { label: 'Blog', href: '/blog' },
  { label: 'Plans', href: '/#plans' },
  { label: 'About', href: '/about' },
]

/** A nav item is active on its own page; "Subjects" also covers every subject, topic and lesson page. */
const isActive = (pathname: string, href: string) =>
  pathname === href || (href === '/wassce/subjects' && pathname.startsWith('/wassce/') && pathname !== '/wassce')

/** A first-party sponsored placement for the studio's BeamPad app. */
function BeamPadSponsoredBanner() {
  return (
    <aside aria-label="Sponsored app: BeamPad" className="site-container -mt-2 mb-7">
      <div className="relative isolate overflow-hidden rounded-[1.35rem] border border-[#8d79df]/25 bg-[#111027] text-white shadow-[0_16px_42px_-24px_rgba(28,18,74,.65)]">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(38rem_18rem_at_95%_0%,rgba(119,91,220,.38),transparent_65%),linear-gradient(112deg,rgba(45,33,94,.5),transparent_60%)]" />
        <div className="flex flex-col gap-5 p-4 sm:p-5 lg:flex-row lg:items-center lg:gap-7 lg:px-6 lg:py-5">
          <div className="flex min-w-0 flex-1 items-start gap-3.5 sm:gap-4">
            <img
              src="https://play-lh.googleusercontent.com/w36p10mMP_W_GM34tB25hfRHUB68SEymA_by1jShFo0xUC_d9Yf7YY75o5Fn27qXx_sv-EKH4WaGxJfKqsaMxQ=w240-h480-rw"
              alt="BeamPad app icon"
              width={64}
              height={64}
              loading="lazy"
              decoding="async"
              className="h-14 w-14 shrink-0 rounded-[1.05rem] bg-white object-cover ring-1 ring-white/15 sm:h-16 sm:w-16"
            />
            <div className="min-w-0">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-violet-300/30 bg-violet-300/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[.15em] text-violet-200">Sponsored</span>
                <span className="text-[11px] font-medium text-white/50">MEBS Software</span>
              </div>
              <h2 className="text-[1.1rem] font-bold leading-tight tracking-[-.025em] sm:text-xl">BeamPad — your phone, now a TV remote</h2>
              <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-white/70 sm:text-sm">
                Type, navigate and control compatible TVs with your phone over Bluetooth. No shared Wi-Fi or TV app installation required.
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-medium text-white/75 sm:text-xs">
                <li className="inline-flex items-center gap-1.5"><Bluetooth className="h-3.5 w-3.5 text-violet-300" aria-hidden /> Bluetooth connection</li>
                <li className="inline-flex items-center gap-1.5"><Keyboard className="h-3.5 w-3.5 text-violet-300" aria-hidden /> Phone keyboard</li>
                <li className="inline-flex items-center gap-1.5"><MousePointer2 className="h-3.5 w-3.5 text-violet-300" aria-hidden /> Touchpad & remote</li>
              </ul>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3 lg:ml-auto">
            <a
              href="https://play.google.com/store/apps/details?id=com.devbangs.beampad"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-[#21164c] shadow-sm transition hover:-translate-y-0.5 hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#111027] sm:flex-none"
            >
              Get BeamPad <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[.12em] text-white/40 sm:block">Google Play</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

/** Clean, full-width public navigation with a single high-contrast primary action. */
export function PublicHeader() {
  const { user } = useAuth()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [open, setOpen] = useState(false)
  if (user || !isPublicPath(pathname)) return null

  return (
    <>
      <header className="public-site-header site-bleed sticky top-0 z-30 -mt-4 mb-6 sm:-mt-6">
        <div className="site-container flex h-[4.25rem] items-center gap-4 sm:gap-6">
          <a href="/" aria-label="WASSCE Tutor home" className="shrink-0">
            <BrandMark compact />
          </a>
          <nav aria-label="Main" className="ml-3 hidden min-w-0 items-center gap-0.5 text-sm font-semibold text-muted-foreground min-[1100px]:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} aria-current={isActive(pathname, n.href) ? 'page' : undefined} className={`whitespace-nowrap rounded-lg px-3 py-2.5 transition-colors duration-150 hover:bg-accent hover:text-accent-foreground ${isActive(pathname, n.href) ? 'text-primary' : ''}`}>{n.label}</a>
            ))}
          </nav>
          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <SignInLink className="hidden min-h-11 items-center whitespace-nowrap rounded-xl px-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground sm:inline-flex">
              Sign in
            </SignInLink>
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
                <SignInLink onClick={() => setOpen(false)} className="flex min-h-12 items-center text-[15px] font-bold text-primary">Sign in</SignInLink>
              </li>
            </ul>
          </nav>
        )}
      </header>
      <BeamPadSponsoredBanner />
    </>
  )
}
