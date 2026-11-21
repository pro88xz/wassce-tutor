// A topic's cover, drawn rather than photographed: the subject's colour, a
// faint dot grid, and a white line drawing of the topic's own idea
// (TopicArt), or of the subject's when the topic has no drawing yet. Used by
// the homepage course cards and the header of every topic page, so a topic
// looks the same wherever it appears. Pure SVG: sharp at any size, nothing
// to download.
//
//   card  the topic's name set on the cover, the drawing to the right
//   hero  the same layout at page size (no pale circle behind the drawing)
import { subjectArt } from '@/components/ds/subject-art'
import { topicArt } from '@/components/landing/TopicArt'
import { coverColours } from '@/components/public/cover-colours'

export function TopicCover({
  subjectSlug,
  subjectName,
  topicSlug,
  topicName,
  index = 0,
  variant = 'card',
  label = true,
  className = '',
}: {
  subjectSlug: string
  subjectName: string
  topicSlug: string
  topicName: string
  /** Position in a row: shifts the colour so neighbours differ. */
  index?: number
  variant?: 'card' | 'hero'
  /** false: the drawing only, without the subject and topic names (small thumbnails) */
  label?: boolean
  className?: string
}) {
  const art = subjectArt(subjectSlug)
  // Subject motifs are drawn around (0, 0) within about ±60; TopicArt fills a 120 x 110 box.
  const drawing = topicArt(subjectSlug, topicSlug, art.accent) ?? <g transform="translate(60 55) scale(.8)">{art.motif(art.accent)}</g>
  const [from, to] = coverColours(subjectSlug, index)
  const hero = variant === 'hero'

  return (
    <span aria-hidden className={`relative block overflow-hidden ${className}`} style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}>
      <span
        className="absolute inset-0 opacity-50"
        style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.2) 1px, transparent 1px)', backgroundSize: hero ? '18px 18px' : '14px 14px' }}
      />
      <svg
        viewBox="0 0 120 110"
        className={
          !label
            ? 'absolute left-1/2 top-1/2 h-[80%] w-auto -translate-x-1/2 -translate-y-1/2'
            : hero
              ? 'absolute bottom-[12%] right-[5%] h-[72%] w-auto'
              : 'absolute bottom-[10%] right-[4%] h-[78%] w-auto transition-transform duration-500 group-hover:scale-[1.05]'
        }
      >
        {drawing}
      </svg>
      {label && (
        <>
          <span className={`absolute flex items-center gap-1.5 font-bold uppercase text-white/80 ${hero ? 'left-5 top-4 text-[11px] tracking-[.16em] sm:left-6 sm:top-6' : 'left-3.5 top-3.5 text-[10px] tracking-[.14em]'}`}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: art.accent }} />
            {subjectName}
          </span>
          <span
            className={`absolute line-clamp-3 max-w-[50%] font-extrabold leading-[1.1] tracking-tight text-white ${
              hero ? 'bottom-4 left-5 text-lg sm:bottom-6 sm:left-6 sm:text-2xl lg:text-[1.75rem]' : 'bottom-3.5 left-3.5 text-[17px] leading-[1.12]'
            }`}
          >
            {topicName}
          </span>
        </>
      )}
    </span>
  )
}
