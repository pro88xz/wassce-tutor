// BeamPad's own frame and building blocks (src/routes/beampad.*): its header,
// footer, the Google Play badge and the phone screens. The root layout leaves
// these pages without WASSCE Tutor's navigation (src/lib/standalone-pages.ts).
import type { ReactNode } from 'react'
import { track } from '@/lib/analytics'
import { BEAMPAD, BEAMPAD_GUIDES, BEAMPAD_ICON, PLAY_BADGE, PLAY_BADGE_ES, SCREEN_ALT, SCREEN_SIZE, playUrl, screenSrc, type Screen } from '@/content/beampad'

/** The page's language: English, or Spanish on /beampad/es. */
export type Lang = 'en' | 'es'

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
export function PlayBadge({ placement, page, height = 56, lang = 'en' }: { placement: string; page?: string; height?: number; lang?: Lang }) {
  const badge = lang === 'es' ? PLAY_BADGE_ES : PLAY_BADGE
  return (
    <a
      href={playUrl(placement, page)}
      target="_blank"
      rel="nofollow noopener"
      onClick={() => track('beampad_play_click', { placement, page: page ?? 'beampad' })}
      className="inline-block rounded-[10px] transition-transform duration-150 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
    >
      <img src={badge.src} width={Math.round((badge.width / badge.height) * height)} height={height} alt={lang === 'es' ? 'Descarga BeamPad en Google Play' : 'Get BeamPad on Google Play'} />
    </a>
  )
}

/**
 * "BeamPad" (or other words) in running text, linked through the tracking
 * link like every button: every way to the Play listing is counted, under its
 * own placement and page (Admin -> App clicks).
 */
export function AppLink({ placement, page, children }: { placement: string; page?: string; children: ReactNode }) {
  return (
    <a
      href={playUrl(placement, page)}
      target="_blank"
      rel="nofollow noopener"
      onClick={() => track('beampad_play_click', { placement, page: page ?? 'beampad' })}
      className="font-semibold text-white underline decoration-[var(--bp-mint)] underline-offset-4"
    >
      {children}
    </a>
  )
}

/** One of the app's screens in its phone frame (transparent corners). */
export function PhoneShot({ name, sizes, eager = false, className = '', alt }: { name: Screen; sizes: string; eager?: boolean; className?: string; alt?: string }) {
  return (
    <img
      // The full-size file as src, so image search and the image sitemap see it; phones pick the small copy from srcSet.
      src={screenSrc(name, 840)}
      srcSet={`${screenSrc(name, 420)} 420w, ${screenSrc(name, 840)} 840w`}
      sizes={sizes}
      width={SCREEN_SIZE.width}
      height={SCREEN_SIZE.height}
      alt={alt ?? SCREEN_ALT[name]}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      {...(eager ? { fetchPriority: 'high' as const } : {})}
      className={`bp-phone h-auto w-full ${className}`}
    />
  )
}

const NAV: Record<Lang, [label: string, href: string][]> = {
  en: [
    ['Features', '/beampad#features'],
    ['How it works', '/beampad#how-it-works'],
    ['Compatibility', '/beampad#compatibility'],
    ['FAQ', '/beampad#faq'],
  ],
  es: [
    ['Funciones', '/beampad/es#funciones'],
    ['Cómo funciona', '/beampad/es#como-funciona'],
    ['Compatibilidad', '/beampad/es#compatibilidad'],
    ['Preguntas', '/beampad/es#preguntas'],
  ],
}

export function BeamPadHeader({ page, lang = 'en' }: { page?: string; lang?: Lang }) {
  const es = lang === 'es'
  return (
    <header className="bp-header">
      <div className="bp-container flex h-16 items-center gap-6">
        <a href={es ? '/beampad/es' : '/beampad'} aria-label={es ? 'Inicio de BeamPad' : 'BeamPad home'} className="shrink-0">
          <BeamPadMark size={34} />
        </a>
        <nav aria-label="BeamPad" className="hidden items-center gap-1 text-sm font-medium text-[var(--bp-muted)] md:flex">
          {NAV[lang].map(([label, href]) => (
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
          {es ? 'Descargar' : 'Get the app'}
        </a>
      </div>
    </header>
  )
}

export function BeamPadFooter({ page, lang = 'en' }: { page?: string; lang?: Lang }) {
  if (lang === 'es') return <BeamPadFooterEs page={page} />
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

/** The footer in Spanish: the guides are in English, and say so. */
function BeamPadFooterEs({ page }: { page?: string }) {
  return (
    <footer lang="es" className="relative z-[1] mt-24 border-t border-[var(--bp-line)]">
      <div className="bp-container grid gap-10 py-12 text-sm text-[var(--bp-muted)] md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <BeamPadMark size={32} />
          <p className="max-w-sm leading-relaxed">
            BeamPad es de {BEAMPAD.developer}, un estudio independiente de Freetown, Sierra Leona, que también hace{' '}
            <a href="/" className="text-white underline-offset-4 hover:underline">WASSCE Tutor</a>. El diseño, el código y la asistencia se hacen aquí.
          </p>
        </div>
        <FooterLinks
          title="BeamPad"
          links={[
            ['Descárgala en Google Play', playUrl('footer', page)],
            ['Compatibilidad', '/beampad/es#compatibilidad'],
            ['Preguntas frecuentes', '/beampad/es#preguntas'],
            ['BeamPad in English', '/beampad'],
            ...BEAMPAD_GUIDES.map((g): [string, string] => [`${g.title} (en inglés)`, g.path]),
          ]}
        />
        <FooterLinks
          title="Ayuda"
          links={[
            ['Escríbenos (correo)', `mailto:${BEAMPAD.email}?subject=${encodeURIComponent('BeamPad')}`],
            ['Política de privacidad de la app', BEAMPAD.privacyUrl],
            ['Privacidad del sitio web (en inglés)', '/privacy'],
            [BEAMPAD.developer, BEAMPAD.developerUrl],
          ]}
        />
      </div>
      <div className="border-t border-[var(--bp-line)]">
        <p className="bp-container py-6 text-xs leading-relaxed text-[var(--bp-faint)]">
          BeamPad es una app independiente y no está afiliada a las marcas que aparecen en esta página. Google Play, el logotipo de Google Play,
          Android, Google TV y Chromecast son marcas de Google LLC. Amazon, Fire TV y Fire TV Stick son marcas de Amazon.com, Inc. o sus filiales.
          © 2026 {BEAMPAD.developer}.
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
