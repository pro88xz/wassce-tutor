import { useEffect, useState } from 'react'
import { Star, X } from 'lucide-react'
import { track } from '@/lib/analytics'
import { hidePromo, PROMO } from '@/lib/app-promo'

const GA_PROMO = { promotion_id: PROMO.id, promotion_name: PROMO.name, creative_slot: 'top_banner' }

/**
 * App banner above the header on every page (src/lib/app-promo.ts has the
 * rules). It is in the prerendered HTML; html.promo-hidden hides it for
 * visitors who closed it or can't install it.
 */
export function AppPromoBanner() {
  const [closed, setClosed] = useState(false)

  useEffect(() => {
    if (!document.documentElement.classList.contains('promo-hidden')) track('view_promotion', GA_PROMO)
  }, [])

  if (closed) return null

  const close = () => {
    hidePromo(15)
    setClosed(true)
    track('dismiss_promotion', GA_PROMO)
  }
  const install = () => {
    track('select_promotion', GA_PROMO)
    hidePromo(90)
    setClosed(true)
  }

  return (
    <aside data-app-promo aria-label="Advertisement" className="border-b bg-card">
      <div className="mx-auto flex max-w-[79rem] items-center gap-1.5 py-2 pl-1 pr-3 sm:gap-2 sm:pl-3 sm:pr-6">
        <button
          type="button"
          onClick={close}
          aria-label="Close ad"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
        <a href={PROMO.href} target="_blank" rel="noopener" onClick={install} className="group flex min-w-0 flex-1 items-center gap-3">
          <img
            src={PROMO.icon}
            srcSet={`${PROMO.icon} 2x, ${PROMO.icon3x} 3x`}
            width={40}
            height={40}
            alt=""
            decoding="async"
            className="h-10 w-10 shrink-0 rounded-[10px] shadow-sm ring-1 ring-black/5"
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold leading-5 text-foreground">{PROMO.name}</span>
            <span className="flex min-w-0 items-center gap-1.5 text-xs leading-5 text-muted-foreground">
              <span className="shrink-0 rounded border border-muted-foreground/40 px-1 text-[10px] font-bold leading-4">Ad</span>
              <span className="inline-flex shrink-0 items-center gap-0.5">
                {PROMO.rating}
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden />
                <span className="sr-only"> stars</span>
              </span>
              <span aria-hidden>·</span>
              <span className="truncate">
                Free on Google Play<span className="hidden md:inline"> · {PROMO.tagline}</span>
              </span>
            </span>
          </span>
          <span className="shrink-0 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground transition-colors group-hover:bg-brand-strong">
            Install
          </span>
        </a>
      </div>
    </aside>
  )
}
