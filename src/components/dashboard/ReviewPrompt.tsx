// A one-line invitation to review WASSCE Tutor on Google, for students who
// have used it properly (the dashboard shows it from the third finished
// lesson). It asks every such student, for an honest review: Google forbids
// asking only the happy ones. "Not now" hides it for 30 days; opening the
// review form hides it for good. Both are remembered in this browser only.
import { useState } from 'react'
import { X } from 'lucide-react'
import { GoogleGlyph } from '@/components/GoogleGlyph'
import { track } from '@/lib/analytics'
import { GOOGLE_REVIEW_URL } from '@/lib/reviews'

const KEY = 'wassce_review_prompt_until'
const DAY = 24 * 60 * 60 * 1000

function hiddenNow() {
  try {
    return Number(localStorage.getItem(KEY)) > Date.now()
  } catch {
    return false
  }
}

function hideFor(ms: number) {
  try {
    localStorage.setItem(KEY, String(Date.now() + ms))
  } catch {
    /* blocked storage: hidden until the page reloads */
  }
}

export function ReviewPrompt({ lessonsDone }: { lessonsDone: number }) {
  const [hidden, setHidden] = useState(hiddenNow)
  if (hidden) return null

  const notNow = () => {
    hideFor(30 * DAY)
    setHidden(true)
    track('review_prompt_dismiss')
  }
  const review = () => {
    hideFor(10 * 365 * DAY)
    track('review_click', { location: 'dashboard', lessons_done: lessonsDone })
    setHidden(true)
  }

  return (
    <section aria-labelledby="review-prompt-title" className="relative overflow-hidden rounded-2xl border bg-card p-5">
      <button
        type="button"
        onClick={notNow}
        aria-label="Not now"
        className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
      <div className="flex items-start gap-3 pr-8">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-900/5">
          <GoogleGlyph className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <h2 id="review-prompt-title" className="font-semibold leading-snug">How is WASSCE Tutor working for you?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {lessonsDone} lessons in. A short, honest review on Google helps other students decide if it&rsquo;s right for them.
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">About a minute</span>
        <a
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noopener"
          onClick={review}
          className="inline-flex min-h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-strong"
        >
          Write a review
        </a>
      </div>
    </section>
  )
}
