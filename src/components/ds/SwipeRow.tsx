import { useRef, useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Phones: a swipeable row of cards with round previous/next buttons (no
 * scrollbar). From 640 px it becomes a plain grid (`grid` sets the columns).
 * Children should size themselves for phones, e.g. "w-[72%] shrink-0 snap-start sm:w-auto".
 */
export function SwipeRow({ label, count, grid = 'sm:grid-cols-3', children }: { label: string; count: number; grid?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [edge, setEdge] = useState({ start: true, end: count <= 1 })
  const update = () => {
    const el = ref.current
    if (!el) return
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 })
  }
  const step = (dir: 1 | -1) => {
    const el = ref.current
    if (!el) return
    const card = el.firstElementChild as HTMLElement | null
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: dir * (card ? card.offsetWidth + 12 : el.clientWidth * 0.8), behavior: reduce ? 'auto' : 'smooth' })
  }
  const btn = 'absolute top-[34%] z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border bg-card text-foreground shadow-md sm:hidden'
  return (
    <div className="relative">
      <div
        ref={ref}
        onScroll={update}
        aria-label={label}
        className={`-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden [&>*]:min-w-0 ${grid}`}
      >
        {children}
      </div>
      {!edge.start && (
        <button type="button" onClick={() => step(-1)} aria-label={`Previous ${label.toLowerCase()}`} className={`${btn} -left-2`}>
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
      )}
      {!edge.end && (
        <button type="button" onClick={() => step(1)} aria-label={`More ${label.toLowerCase()}`} className={`${btn} -right-2`}>
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      )}
    </div>
  )
}
