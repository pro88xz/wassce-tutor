// Reviews: "What do other students think?"
//
// Real Google reviews only (src/lib/reviews.ts). With none yet, the band is a
// single invitation to review; once there are some, it shows them as cards
// with a link to every review on Google. Either way the ask is one calm line
// and one button, and it asks for an honest review, never a good one (Google
// forbids asking only happy customers).
import { ArrowRight, Star } from 'lucide-react'
import { Band, SectionHeading } from '@/components/public/Section'
import { GoogleGlyph } from '@/components/GoogleGlyph'
import { track } from '@/lib/analytics'
import { GOOGLE_REVIEW_URL, GOOGLE_REVIEWS, GOOGLE_REVIEWS_URL, type GoogleReview } from '@/lib/reviews'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
/** "2026-11" → "November 2026", the same on the server and in every browser. */
const monthYear = (ym: string) => {
  const [y, m] = ym.split('-').map(Number)
  return MONTHS[m - 1] ? `${MONTHS[m - 1]} ${y}` : ym
}

/** How many review cards the homepage shows; phones show the first three. */
const SHOWN = 6

const onReviewClick = () => track('review_click', { location: 'home' })

export function Reviews() {
  return GOOGLE_REVIEWS.length ? <ReviewList reviews={GOOGLE_REVIEWS.slice(0, SHOWN)} /> : <ReviewInvite />
}

/** A review's stars. `decorative` hides them from screen readers where they are not a rating. */
function Stars({ rating = 5, className = 'h-4 w-4', decorative = false }: { rating?: number; className?: string; decorative?: boolean }) {
  return (
    <span className="inline-flex items-center gap-0.5" {...(decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': `${rating} out of 5 stars` })}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`${className} ${n <= rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} aria-hidden />
      ))}
    </span>
  )
}

function WriteReviewButton({ variant }: { variant: 'primary' | 'secondary' }) {
  return (
    <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener" onClick={onReviewClick} className={`site-btn site-btn-${variant}`}>
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
        <GoogleGlyph className="h-4 w-4" />
      </span>
      Write a review
    </a>
  )
}

/** Before the first review: one quiet, well-made invitation. */
function ReviewInvite() {
  return (
    <Band labelledBy="reviews-heading">
      <div data-reveal className="site-card relative isolate overflow-hidden px-6 py-10 text-center sm:px-12 sm:py-14">
        {/* A soft brand glow and an oversized quotation mark behind the content. */}
        <div aria-hidden className="absolute inset-x-0 -top-24 -z-10 mx-auto h-56 max-w-xl rounded-full bg-[var(--brand-soft)] opacity-70 blur-3xl" />
        <span aria-hidden className="absolute left-5 top-0 -z-10 select-none font-serif text-[9rem] leading-none text-[var(--brand-soft)] sm:left-10 sm:text-[12rem]">&ldquo;</span>

        <div className="mx-auto flex max-w-2xl flex-col items-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-[var(--site-shadow-card)] ring-1 ring-slate-900/5">
            <GoogleGlyph className="h-7 w-7" />
          </span>
          <span className="mt-5"><Stars className="h-5 w-5" decorative /></span>
          <p className="site-eyebrow mt-5">Reviews</p>
          <h2 id="reviews-heading" className="site-h2 mt-3 text-balance">Studied with WASSCE Tutor?</h2>
          <p className="site-lede mx-auto mt-4 max-w-xl text-balance">
            Tell other students what you think. A few honest words on Google help classmates across Sierra Leone decide how to study.
          </p>
          <div className="mt-8">
            <WriteReviewButton variant="primary" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Takes about a minute with your Google account.</p>
        </div>
      </div>
    </Band>
  )
}

/** Once there are reviews: the newest few, word for word, and the way to the rest. */
function ReviewList({ reviews }: { reviews: GoogleReview[] }) {
  return (
    <Band labelledBy="reviews-heading">
      <SectionHeading
        id="reviews-heading"
        eyebrow="Reviews on Google"
        title="What students are saying."
        action={<WriteReviewButton variant="secondary" />}
      />
      <ul className="mt-9 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-12 lg:grid-cols-3">
        {reviews.map((r, i) => (
          <li key={`${r.name}-${r.date}`} data-reveal={i % 3} className={`site-card flex flex-col p-5 sm:p-6 ${i >= 3 ? 'hidden sm:flex' : ''}`}>
            <div className="flex items-center justify-between">
              <Stars rating={r.rating} />
              <GoogleGlyph className="h-5 w-5" />
            </div>
            <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-foreground">
              <p className="line-clamp-6">{r.text}</p>
            </blockquote>
            <div className="mt-5 flex items-center gap-3 border-t pt-4">
              <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft)] text-sm font-bold text-primary">
                {r.name.trim().charAt(0).toUpperCase()}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold">{r.name}</span>
                <span className="block text-xs text-muted-foreground">Google review · {monthYear(r.date)}</span>
              </span>
            </div>
          </li>
        ))}
      </ul>
      <div data-reveal className="mt-8 flex justify-center">
        <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline">
          Read every review on Google <ArrowRight className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </Band>
  )
}
