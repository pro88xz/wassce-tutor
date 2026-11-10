// The closing call to action: one panel, one promise, one primary action.
import { Link } from '@tanstack/react-router'
import { ArrowRight, Check, Smartphone } from 'lucide-react'

export function FinalCta() {
  return (
    <section className="site-band" aria-labelledby="final-cta-heading">
      <div className="site-container">
        <div data-reveal className="relative isolate overflow-hidden rounded-[1.75rem] bg-[var(--site-ink)] px-6 py-14 text-center text-white sm:px-12 sm:py-20">
          <div aria-hidden className="site-hero-backdrop" />
          <div className="relative mx-auto max-w-2xl">
            <h2 id="final-cta-heading" className="site-h2">Your WASSCE is closer than you think.</h2>
            <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-white/72">Start with one topic today. It takes about a minute to set up your subjects and open your first lesson.</p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link to="/auth" className="site-btn site-btn-lg site-btn-light">
                Start learning free <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <a href="/wassce/subjects" className="site-btn site-btn-lg site-btn-glass">Browse the subjects</a>
            </div>
            <ul className="mt-8 flex flex-col items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-white/70 sm:flex-row sm:flex-wrap">
              <li className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-emerald-300" aria-hidden /> Free account, no card needed</li>
              <li className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-emerald-300" aria-hidden /> No automatic renewal</li>
              <li className="inline-flex items-center gap-2"><Smartphone className="h-4 w-4 text-violet-200" aria-hidden /> Android app coming soon</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
