import { WORDMARK_LINE as LINE } from './brand-geometry'

/**
 * The WASSCE Tutor logo. The name is the logo: the letters are Inter Display, and the "o" of
 * Tutor is a shaded answer bubble, as on the WASSCE objective paper.
 *
 * The outlines come from src/components/brand-geometry.ts (written by
 * scripts/brand/build-wordmark.mjs). scripts/brand/build-icons.mjs draws the browser-tab,
 * home-screen and Android icons from the same file, so the header, the icons and the logo
 * uploaded to Google always match.
 */
export function BrandMark({
  compact = false,
  tone = 'dark',
  className = '',
}: {
  /** Headers on phones: about as wide as the old mark, so the header still fits at 320 px. */
  compact?: boolean
  /** 'light' is for dark surfaces such as the footer */
  tone?: 'dark' | 'light'
  className?: string
}) {
  const light = tone === 'light'
  const name = light ? '#ffffff' : 'var(--foreground)'
  const tutor = light ? '#c4b1ff' : 'var(--primary)'
  const size = compact ? 'h-[14px] min-[360px]:h-4 sm:h-5' : 'h-5 sm:h-[22px]'
  return (
    <svg viewBox={LINE.viewBox} role="img" aria-label="WASSCE Tutor" className={`block w-auto shrink-0 ${size} ${className}`}>
      <path d={LINE.wassce} fill={name} />
      <path d={LINE.tutor} fill={tutor} />
      <path d={LINE.ring} fill={tutor} fillRule="evenodd" />
      <path d={LINE.shade} fill="#6ee7b7" />
    </svg>
  )
}
