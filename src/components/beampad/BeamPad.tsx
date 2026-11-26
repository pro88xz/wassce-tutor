// BeamPad's own frame and building blocks (src/routes/beampad.*): its header,
// footer, the Google Play badge and the phone screens. The root layout leaves
// these pages without WASSCE Tutor's navigation (src/lib/standalone-pages.ts).
import type { ReactNode } from 'react'
import { track } from '@/lib/analytics'
import { BEAMPAD, BEAMPAD_GUIDES, BEAMPAD_ICON, PLAY_BADGE, SCREEN_ALT, SCREEN_SIZE, playUrl, screenSrc, type Screen } from '@/content/beampad'

/** BeamPad's app icon and name. */
export function BeamPadMark({ size = 36 }: { size?: number }) {
  return (
    <span className="flex items-center gap-2.5">
      <img src={BEAMPAD_ICON.src} width={size} height={size} alt="" className="rounded-[22%] shadow-[0_6px_20px_-6px_rgba(108,92,245,.8)]" />
      <span className="text-lg font-bold tracking-tight text-white">BeamPad</span>
    </span>
  )
}

/**
 * The official Google Play badge, linking to the listing with the button's
 * place on the page in the install referrer (and in Google Analytics).
 */
export function PlayBadge({ placement, page, height = 56 }: { placement: string; page?: string; height?: number }) {
  return (
    <a
      href={playUrl(placement, page)}
      target="_blank"
      rel="nofollow noopener"
      onClick={() => track('beampad_play_click', { placement, page: page ?? 'beampad' })}
      className="inline-block rounded-[10px] transition-transform duration-150 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
    >
      <img src={PLAY_BADGE.src} width={Math.round((PLAY_BADGE.width / PLAY_BADGE.height) * height)} height={height} alt="Get BeamPad on Google Play" />
    </a>
  )
}

/** One of the app's screens in its phone frame (transparent corners). */
export function PhoneShot({ name, sizes, eager = false, className = '' }: { name: Screen; sizes: string; eager?: boolean; className?: string }) {
  return (
    <img
      src={screenSrc(name, 420)}
      srcSet={`${screenSrc(name, 420)} 420w, ${screenSrc(name, 840)} 840w`}
      sizes={sizes}
      width={SCREEN_SIZE.width}
      height={SCREEN_SIZE.height}
      alt={SCREEN_ALT[name]}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      {...(eager ? { fetchPriority: 'high' as const } : {})}
      className={`bp-phone h-auto w-full ${className}`}
    />
  )
}

const NAV: [label: string, href: string][] = [
  ['Features', '/beampad#features'],
  ['How it works', '/beampad#how-it-works'],
  ['Compatibility', '/beampad#compatibility'],
  ['FAQ', '/beampad#faq'],
]

export function BeamPadHeader({ page }: { page?: string }) {
  return (
    <header className="bp-header">
      <div className="bp-container flex h-16 items-center gap-6">
        <a href="/beampad" aria-label="BeamPad home" className="shrink-0">
          <BeamPadMark size={34} />
        </a>
        <nav aria-label="BeamPad" className="hidden items-center gap-1 text-sm font-medium text-[var(--bp-muted)] md:flex">
          {NAV.map(([label, href]) => (
            <a key={href} href={href} className="rounded-lg px-3 py-2 transition-colors hover:bg-white/5 hover:text-white">
              {label}
            </a>
          ))}
        </nav>
        <a
          href={playUrl('header', page)}
          target="_blank"
          rel="nofollow noopener"
          onClick={() => track('beampad_play_click', { placement: 'header', page: page ?? 'beampad' })}
          className="bp-btn ml-auto h-10 px-4 text-sm"
        >
          Get the app
        </a>
      </div>
    </header>
  )
}

export function BeamPadFooter({ page }: { page?: string }) {
  return (
    <footer className="relative z-[1] mt-24 border-t border-[var(--bp-line)]">
      <div className="bp-container grid gap-10 py-12 text-sm text-[var(--bp-muted)] md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <BeamPadMark size={32} />
          <p className="max-w-sm leading-relaxed">
            BeamPad is made by {BEAMPAD.developer}, an independent studio in Freetown, Sierra Leone, which also makes{' '}
            <a href="/" className="text-white underline-offset-4 hover:underline">WASSCE Tutor</a>. Design, code and support all happen here.
          </p>
        </div>
        <FooterLinks
          title="BeamPad"
          links={[
            ['Get it on Google Play', playUrl('footer', page)],
            ...BEAMPAD_GUIDES.map((g): [string, string] => [g.title, g.path]),
            ['Compatibility', '/beampad#compatibility'],
            ['Questions', '/beampad#faq'],
          ]}
        />
        <FooterLinks
          title="Support"
          links={[
            ['Email support', `mailto:${BEAMPAD.email}?subject=${encodeURIComponent('BeamPad')}`],
            ['App privacy policy', BEAMPAD.privacyUrl],
            ['Website privacy', '/privacy'],
            [BEAMPAD.developer, BEAMPAD.developerUrl],
          ]}
        />
      </div>
      <div className="border-t border-[var(--bp-line)]">
        <p className="bp-container py-6 text-xs leading-relaxed text-[var(--bp-faint)]">
          BeamPad is an independent app and is not affiliated with the brands named on this page. Google Play, the Google Play logo, Android,
          Google TV and Chromecast are trademarks of Google LLC. Amazon, Fire TV and Fire TV Stick are trademarks of Amazon.com, Inc. or its
          affiliates. © 2026 {BEAMPAD.developer}.
        </p>
      </div>
    </footer>
  )
}

function FooterLinks({ title, links }: { title: string; links: [label: string, href: string][] }) {
  return (
    <div>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/80">{title}</h2>
      <ul className="space-y-1">
        {links.map(([label, href]) => (
          <li key={href}>
            <a
              href={href}
              {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener' } : href.startsWith('/go/') ? { target: '_blank', rel: 'nofollow noopener' } : {})}
              className="inline-flex min-h-9 items-center transition-colors hover:text-white"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** A section heading: a small mint label, then the heading. */
export function SectionHead({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div data-reveal className="mx-auto max-w-2xl space-y-4 text-center">
      <p className="bp-eyebrow">{eyebrow}</p>
      <h2 id={id} className="text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl">
        {title}
      </h2>
      {children && <p className="text-lg leading-relaxed text-pretty text-[var(--bp-muted)]">{children}</p>}
    </div>
  )
}
