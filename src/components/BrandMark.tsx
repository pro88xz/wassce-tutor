import { useId } from 'react'

/**
 * The WASSCE Tutor mark: a "W" whose second half is a tick, on the brand's
 * violet tile. It is the product's own drawing (not an icon from a library),
 * and it is the same drawing everywhere: the paths below match
 * scripts/brand/build-icons.mjs, which renders the browser-tab, home-screen
 * and Android icons from them. Change one, change the other.
 */
export function BrandGlyph({ className = 'h-9 w-9' }: { className?: string }) {
  // Several marks can be on one page (header, menu, footer): each needs its own gradient id.
  const gradient = useId()
  return (
    <svg viewBox="0 0 64 64" className={`shrink-0 ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7a4cea" />
          <stop offset="1" stopColor="#4420a6" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill={`url(#${gradient})`} />
      <g fill="none" strokeWidth="6.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.5 24.5 21.6 45 30.6 29.2" stroke="#fff" />
        <path d="M30.6 29.2 39.6 45 52 18.5" stroke="#6ee7b7" />
      </g>
    </svg>
  )
}

/** The mark with the wordmark, as used in the public header, the app shell and the footer. */
export function BrandMark({
  compact = false,
  tone = 'dark',
  wordmarkClassName = '',
}: {
  compact?: boolean
  /** 'light' is for dark surfaces such as the footer */
  tone?: 'dark' | 'light'
  wordmarkClassName?: string
}) {
  const light = tone === 'light'
  return (
    <span className="inline-flex items-center gap-2.5">
      <BrandGlyph className="h-9 w-9 drop-shadow-[0_4px_8px_rgba(68,32,166,.32)]" />
      <span className={`whitespace-nowrap font-extrabold tracking-[-.035em] ${light ? 'text-white' : 'text-foreground'} ${compact ? 'text-[15px]' : 'text-base'} ${wordmarkClassName}`}>
        WASSCE <span className={light ? 'text-[#c4b1ff]' : 'text-primary'}>Tutor</span>
      </span>
    </span>
  )
}
