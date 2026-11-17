// Layout primitives for public (marketing) pages. Every section is a Band
// with a SectionHeading, so spacing, widths and heading hierarchy are decided
// once, here and in the "Public site system" block of src/index.css, rather
// than section by section.
import type { ReactNode } from 'react'

type Tone = 'canvas' | 'white' | 'tint' | 'ink' | 'deep'

const TONE: Record<Tone, string> = {
  canvas: '',
  white: 'site-band-white',
  tint: 'site-band-tint',
  ink: 'site-band-ink',
  deep: 'site-band-deep',
}

/** A full-width section on the shared content grid, with the standard vertical rhythm. */
export function Band({
  tone = 'canvas',
  id,
  labelledBy,
  className = '',
  children,
}: {
  tone?: Tone
  id?: string
  /** id of the section's heading */
  labelledBy?: string
  className?: string
  children: ReactNode
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`site-band ${TONE[tone]} ${className}`}>
      <div className="site-container">{children}</div>
    </section>
  )
}

/**
 * The one section heading: eyebrow, H2, supporting line and an optional
 * action that sits on the heading's baseline from tablet width up.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  lede,
  action,
  className = '',
}: {
  id?: string
  eyebrow: string
  title: ReactNode
  lede?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div data-reveal className={`flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10 ${className}`}>
      <div className="max-w-3xl">
        <p className="site-eyebrow">{eyebrow}</p>
        <h2 id={id} className="site-h2 mt-3">{title}</h2>
        {lede && <p className="site-lede mt-4">{lede}</p>}
      </div>
      {action && <div className="shrink-0 md:pb-1">{action}</div>}
    </div>
  )
}

