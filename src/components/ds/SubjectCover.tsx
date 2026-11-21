// Crisp, distinct cover art for every subject: a flat line illustration of
// the subject's core idea on the subject's own colour. Pure SVG, so it is
// sharp at any size and costs no image downloads.
//
// One drawing serves three shapes:
//   square  – list thumbnails (crops to the motif on the right)
//   wide    – card covers (16:9)
//   banner  – slim headers; the motif sits right, the pattern runs left
//             under the title.
import type { ReactNode } from 'react'
import { subjectPhoto, subjectPhotoSrcSet } from '@/lib/subject-photos'
import { subjectArt, subjectGlyphs, type Pattern } from './subject-art'

/** Background texture for the whole canvas, including the part left of the viewBox used by banners. */
function PatternLayer({ kind }: { kind: Pattern }) {
  const c = 'rgba(255,255,255,0.09)'
  const x0 = -1200
  switch (kind) {
    case 'grid':
      return (
        <g stroke={c} strokeWidth={1}>
          {Array.from({ length: 96 }, (_, i) => x0 + i * 16).map((x) => <path key={`v${x}`} d={`M${x} 0 V180`} />)}
          {Array.from({ length: 12 }, (_, i) => i * 16).map((y) => <path key={`h${y}`} d={`M${x0} ${y} H320`} />)}
        </g>
      )
    case 'ruled':
      return (
        <g stroke={c} strokeWidth={1.5}>
          {Array.from({ length: 9 }, (_, i) => 14 + i * 20).map((y) => <path key={y} d={`M${x0} ${y} H320`} />)}
        </g>
      )
    case 'dots':
      return (
        <g fill="rgba(255,255,255,0.16)">
          {Array.from({ length: 96 }, (_, i) => x0 + 8 + i * 16).flatMap((x) =>
            Array.from({ length: 11 }, (_, j) => 8 + j * 16).map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r={1.4} />),
          )}
        </g>
      )
    case 'waves':
      return (
        <g stroke={c} strokeWidth={1.5} fill="none">
          {Array.from({ length: 9 }, (_, i) => 10 + i * 20).map((y) => (
            <path key={y} d={`M${x0} ${y} ${Array.from({ length: 80 }, () => 'q 10 -7 20 0 t 20 0').join(' ')}`} />
          ))}
        </g>
      )
    case 'diag':
      return (
        <g stroke={c} strokeWidth={1.5}>
          {Array.from({ length: 100 }, (_, i) => x0 + i * 16).map((x) => <path key={x} d={`M${x} 180 L${x + 180} 0`} />)}
        </g>
      )
    case 'rings':
      return (
        <g stroke={c} strokeWidth={1.5} fill="none">
          {Array.from({ length: 14 }, (_, i) => 20 + i * 18).map((r) => <circle key={r} cx={232} cy={90} r={r} />)}
        </g>
      )
  }
}

/**
 * Alt text for a subject photo. The cover itself is aria-hidden (the card
 * around it names the subject), so this is for image search and for when the
 * image fails to load.
 */
const photoAlt = (p: { subject: string; caption: string }) => `WASSCE ${p.subject}: ${p.caption.charAt(0).toLowerCase()}${p.caption.slice(1)}`

/**
 * Subject cover. `shape` sets how the drawing fits its box; size the box
 * with className (e.g. "h-16 w-16" for a thumbnail, "aspect-[16/9] w-full"
 * for a card, "h-28 w-full" for a banner).
 */
export function SubjectCover({
  slug,
  shape = 'wide',
  className = '',
  rounded = 'rounded-xl',
  priority = false,
  sizes,
}: {
  slug: string | null | undefined
  /** square: illustration thumbnail; thumb: photo thumbnail for lists (illustration if no photo) */
  shape?: 'square' | 'thumb' | 'wide' | 'banner'
  className?: string
  rounded?: string
  /** Load immediately (above-the-fold banners). */
  priority?: boolean
  /** The width the cover is shown at (an <img sizes> value), so phones download the small copy. */
  sizes?: string
}) {
  const art = subjectArt(slug)
  // Large shapes use the subject's photograph when there is one; small
  // thumbnails keep the illustration, which stays crisp at 40-64 px.
  const photo = shape !== 'square' ? subjectPhoto(slug) : undefined
  if (photo && shape === 'thumb') {
    return (
      <span className={`relative block overflow-hidden ${art.tone} ${rounded} ${className}`} aria-hidden>
        <img src={photo.src.replace(/\.webp$/, '-400.webp')} alt={photoAlt(photo)} loading="lazy" decoding="async" className={`absolute inset-0 h-full w-full object-cover ${photo.position ?? ''}`} />
      </span>
    )
  }
  if (photo) {
    return (
      <span className={`relative block overflow-hidden ${art.tone} ${rounded} ${className}`} aria-hidden>
        <img
          src={photo.src}
          srcSet={subjectPhotoSrcSet(photo)}
          sizes={sizes ?? (shape === 'banner' ? '(min-width: 1280px) 1216px, 100vw' : '(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw')}
          alt={photoAlt(photo)}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          {...(priority ? { fetchPriority: 'high' as const } : {})}
          className={`absolute inset-0 h-full w-full object-cover ${photo.position ?? ''}`}
        />
        <span className={`absolute inset-x-0 bottom-0 h-1 ${art.tone}`} />
      </span>
    )
  }
  const glyphs = subjectGlyphs(slug)
  const fit = shape === 'square' || shape === 'thumb' ? 'xMaxYMid slice' : shape === 'banner' ? 'xMaxYMid meet' : 'xMidYMid slice'
  return (
    <span className={`relative block overflow-hidden ${art.tone} ${rounded} ${className}`} aria-hidden>
      <svg viewBox="0 0 320 180" preserveAspectRatio={fit} className="absolute inset-0 h-full w-full" focusable="false">
        <rect x={-1200} y={0} width={1520} height={180} fill={art.bg} />
        <PatternLayer kind={art.pattern} />
        <path d="M-1200 180 V128 C-300 128 40 150 150 180 Z" fill={art.shade} opacity={0.55} />
        <circle cx={232} cy={90} r={74} fill="rgba(255,255,255,0.1)" />
        <circle cx={232} cy={90} r={92} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={1.5} />
        {shape === 'wide' && glyphs && (
          <g fill="rgba(255,255,255,0.34)" fontFamily="Georgia, 'Times New Roman', serif" fontStyle="italic" fontWeight={700}>
            <text x={34} y={58} fontSize={26}>{glyphs[0]}</text>
            <text x={78} y={134} fontSize={20}>{glyphs[1]}</text>
            <text x={120} y={74} fontSize={17}>{glyphs[2]}</text>
          </g>
        )}
        <g transform="translate(232 90)">{art.motif(art.accent)}</g>
      </svg>
    </span>
  )
}

/** Page header for a subject: its cover as a slim banner with the title on it. */
export function SubjectBanner({ slug, eyebrow, title }: { slug: string | null | undefined; eyebrow?: ReactNode; title: ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <SubjectCover slug={slug} shape="banner" rounded="rounded-2xl" className="h-28 w-full sm:h-36" priority />
      {/* A scrim keeps white text legible: light over illustrations, stronger over photos. */}
      <div
        className={`absolute inset-0 flex flex-col justify-end p-4 sm:p-6 ${
          subjectPhoto(slug) ? 'bg-gradient-to-r from-black/70 via-black/35 to-black/5' : 'bg-gradient-to-r from-black/30 via-black/10 to-transparent'
        }`}
      >
        {eyebrow && <p className="text-sm font-medium text-white/85">{eyebrow}</p>}
        <h1 className="max-w-[70%] text-[1.6rem] font-bold leading-tight tracking-tight text-balance text-white sm:text-3xl">{title}</h1>
      </div>
    </div>
  )
}
