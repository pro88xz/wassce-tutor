// Popular topics: a rail of topic cards. Each card shows a photograph of the
// topic itself (topic-photos.ts), not the subject photo, so topic discovery
// never repeats the subject cards above.
import { useRef, useState } from 'react'
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import type { LandingData } from '@/lib/public-content'
import { topicPath } from '@/lib/public-content'
import { topicPhoto, topicPhotoSrcSet } from '@/lib/topic-photos'
import { SubjectCover } from '@/components/ds/SubjectCover'
import { Band, Mark, SectionHeading } from '@/components/public/Section'

export function PopularTopics({ data }: { data: LandingData }) {
  const rail = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ index: 0, atEnd: false })
  const total = data.popular.length
  if (total === 0) return null

  const cardStep = () => {
    const el = rail.current
    const card = el?.firstElementChild as HTMLElement | null
    if (!el || !card) return 0
    return card.getBoundingClientRect().width + (Number.parseFloat(getComputedStyle(el).columnGap) || 16)
  }

  const onScroll = () => {
    const el = rail.current
    const step = cardStep()
    if (!el || !step) return
    setPosition({
      index: Math.min(total - 1, Math.max(0, Math.round(el.scrollLeft / step))),
      atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8,
    })
  }

  const move = (direction: -1 | 1) => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    rail.current?.scrollBy({ left: direction * cardStep(), behavior: reduce ? 'auto' : 'smooth' })
  }

  const arrow = 'flex h-11 w-11 items-center justify-center rounded-full border border-input bg-card text-foreground transition hover:border-primary/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-35'

  return (
    <Band labelledBy="popular-heading">
      <SectionHeading
        id="popular-heading"
        eyebrow="Start here"
        title={<>Popular <Mark>WASSCE topics</Mark></>}
        lede="Where most students begin."
        action={
          <div className="hidden items-center gap-2 md:flex">
            <button type="button" onClick={() => move(-1)} disabled={position.index === 0} aria-label="Previous topics" className={arrow}>
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button type="button" onClick={() => move(1)} disabled={position.atEnd} aria-label="Next topics" className={arrow}>
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
        }
      />

      <div
        ref={rail}
        onScroll={onScroll}
        role="region"
        aria-roledescription="carousel"
        aria-label="Popular WASSCE topics"
        className="site-rail mt-8 -mx-[var(--site-gutter)] scroll-px-[var(--site-gutter)] px-[var(--site-gutter)] pb-4 sm:gap-5"
      >
        {data.popular.map((t, i) => {
          const photo = topicPhoto(t.subjectSlug, t.topicSlug)
          return (
            <a
              key={`${t.subjectSlug}/${t.topicSlug}`}
              href={topicPath(t.subjectSlug, t.topicSlug)}
              aria-label={`${t.topicName}, ${t.subjectName}, ${t.lessons} lessons`}
              className="site-card site-card-link group flex w-[78%] flex-col overflow-hidden sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3.75rem)/4)]"
            >
              <span className="relative block aspect-[16/10] overflow-hidden bg-muted">
                {photo ? (
                  <img
                    src={photo.small}
                    srcSet={topicPhotoSrcSet(photo)}
                    sizes="(min-width: 1024px) 290px, (min-width: 640px) 46vw, 78vw"
                    alt={photo.caption}
                    loading="lazy"
                    decoding="async"
                    width={960}
                    height={600}
                    className={`h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${photo.position ?? ''}`}
                  />
                ) : (
                  <SubjectCover slug={t.subjectSlug} shape="wide" rounded="rounded-none" className="h-full w-full" />
                )}
                <span className="absolute left-3 top-3 rounded-md bg-slate-950/70 px-2 py-1 text-[11px] font-bold tabular-nums text-white backdrop-blur">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </span>
              <span className="flex flex-1 flex-col p-4">
                <span className="text-[11px] font-bold uppercase tracking-[.12em] text-primary">{t.subjectName}</span>
                <span className="site-h3 mt-1.5 line-clamp-2 text-[17px]">{t.topicName}</span>
                <span className="mt-auto flex items-center justify-between pt-4 text-[13px] font-medium text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" aria-hidden /> {t.lessons} {t.lessons === 1 ? 'lesson' : 'lessons'}
                  </span>
                  <ArrowRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                </span>
              </span>
            </a>
          )
        })}
      </div>

      <div className="mt-2 flex items-center gap-4">
        <div
          className="h-1 flex-1 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-label="Position in the topic list"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={position.index + 1}
        >
          <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${((position.atEnd ? total : position.index + 1) / total) * 100}%` }} />
        </div>
        <a href="/wassce/subjects" className="site-link shrink-0">
          All topics <ArrowRight className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </Band>
  )
}
