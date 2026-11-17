// The closing call to action: one panel, one promise, one primary action.
import { Link } from '@tanstack/react-router'
import { ArrowRight, Check, Smartphone } from 'lucide-react'

export function FinalCta() {
  return (
    <section className="site-band site-band-white" aria-labelledby="final-cta-heading">
      <div className="site-container">
        <div data-reveal className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#6d3fe6] via-[#5530cf] to-[#3a1d9e] px-6 py-14 text-center text-white shadow-[0_40px_80px_-40px_rgba(58,29,158,.7)] sm:px-12 sm:py-20">
          <span aria-hidden className="absolute -right-16 -top-16 -z-10 h-64 w-64 rounded-full border-[28px] border-white/10" />
          <span aria-hidden className="absolute -bottom-10 -left-10 -z-10 h-40 w-40 rounded-full bg-[#ffd166]/90" />
          <div className="relative mx-auto max-w-2xl">
            <h2 id="final-cta-heading" className="site-h2">Your WASSCE is closer than you think.</h2>
            <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-white/80">Start with one topic today. It takes about a minute to set up your subjects and open your first lesson.</p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link to="/auth" className="site-btn site-btn-lg site-btn-light">
                Start learning free <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <a href="/wassce/subjects" className="site-btn site-btn-lg site-btn-glass">Browse the subjects</a>
            </div>
            <ul className="mt-8 flex flex-col items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-white/80 sm:flex-row sm:flex-wrap">
              <li className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-emerald-300" aria-hidden /> Free account, no card needed</li>
              <li className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-emerald-300" aria-hidden /> No automatic renewal</li>
              <li className="inline-flex items-center gap-2"><Smartphone className="h-4 w-4 text-violet-200" aria-hidden /> Works in any phone browser</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
