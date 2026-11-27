import { ArrowUpRight, Bluetooth, Keyboard, MousePointer2 } from 'lucide-react'

/** First-party sponsored placement, shown after the homepage hero rather than inside site navigation. */
export function BeamPadSponsoredBanner() {
  return (
    <aside aria-label="Sponsored app: BeamPad" className="site-container my-8 sm:my-10">
      <div className="relative isolate overflow-hidden rounded-[1.35rem] border border-[#8d79df]/25 bg-[#111027] text-white shadow-[0_16px_42px_-24px_rgba(28,18,74,.65)]">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(38rem_18rem_at_95%_0%,rgba(119,91,220,.38),transparent_65%),linear-gradient(112deg,rgba(45,33,94,.5),transparent_60%)]" />
        <div className="flex flex-col gap-5 p-4 sm:p-5 lg:flex-row lg:items-center lg:gap-7 lg:px-6 lg:py-5">
          <div className="flex min-w-0 flex-1 items-start gap-3.5 sm:gap-4">
            <img
              src="https://play-lh.googleusercontent.com/w36p10mMP_W_GM34tB25hfRHUB68SEymA_by1jShFo0xUC_d9Yf7YY75o5Fn27qXx_sv-EKH4WaGxJfKqsaMxQ=w240-h480-rw"
              alt="BeamPad app icon"
              width={64}
              height={64}
              loading="lazy"
              decoding="async"
              className="h-14 w-14 shrink-0 rounded-[1.05rem] bg-white object-cover ring-1 ring-white/15 sm:h-16 sm:w-16"
            />
            <div className="min-w-0">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-violet-300/30 bg-violet-300/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[.15em] text-violet-200">Sponsored</span>
                <span className="text-[11px] font-medium text-white/50">MEBS Software</span>
              </div>
              <h2 className="text-[1.1rem] font-bold leading-tight tracking-[-.025em] sm:text-xl">BeamPad — your phone, now a TV remote</h2>
              <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-white/70 sm:text-sm">
                Type, navigate and control compatible TVs with your phone over Bluetooth. No shared Wi-Fi or TV app installation required.
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-medium text-white/75 sm:text-xs">
                <li className="inline-flex items-center gap-1.5"><Bluetooth className="h-3.5 w-3.5 text-violet-300" aria-hidden /> Bluetooth connection</li>
                <li className="inline-flex items-center gap-1.5"><Keyboard className="h-3.5 w-3.5 text-violet-300" aria-hidden /> Phone keyboard</li>
                <li className="inline-flex items-center gap-1.5"><MousePointer2 className="h-3.5 w-3.5 text-violet-300" aria-hidden /> Touchpad & remote</li>
              </ul>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3 lg:ml-auto">
            <a
              href="https://play.google.com/store/apps/details?id=com.devbangs.beampad"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-[#21164c] shadow-sm transition hover:-translate-y-0.5 hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#111027] sm:flex-none"
            >
              Get BeamPad <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[.12em] text-white/40 sm:block">Google Play</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
