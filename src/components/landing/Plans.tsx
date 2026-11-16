// Free account, then two paid plans. Structurally identical cards with the
// terms stated in full, followed by the four purchase assurances. Prices live
// in src/lib/plans.ts (and are enforced by the server and the database).
import { Link } from '@tanstack/react-router'
import { BookOpenCheck, CalendarClock, Check, ShieldCheck, Zap } from 'lucide-react'
import { FROM_PRICE, PAID_FEATURES, PLANS, type PlanId } from '@/lib/plans'
import { FREE_FEATURES } from '@/lib/free-plan'
import { Band, SectionHeading } from '@/components/public/Section'

const KICKER: Record<'free' | PlanId, string> = {
  free: 'Get started',
  term: 'Short-term access',
  year: 'Best long-term value',
}

const ASSURANCES = [
  { title: 'Secure Monime checkout', body: 'Pay once through your phone’s USSD dialler. The amount is fixed to the plan you choose.', Icon: ShieldCheck },
  { title: 'Verified activation', body: 'Monime confirms the payment first. Your access is switched on automatically after verification.', Icon: Zap },
  { title: 'No recurring charges', body: 'No subscription deductions or automatic renewal. You pay only when you choose to extend access.', Icon: CalendarClock },
  { title: 'Your progress stays saved', body: 'Saved study progress remains when a plan expires. Renewing adds the new time to your existing expiry.', Icon: BookOpenCheck },
]

export function Plans() {
  const cards = [
    {
      key: 'free' as const,
      name: 'Free account',
      price: 0,
      cadence: 'No time limit',
      blurb: 'Try every subject before you pay.',
      note: undefined as string | undefined,
      features: FREE_FEATURES,
      cta: 'Create a free account',
      best: false,
    },
    ...PLANS.map((p) => ({
      key: p.id,
      name: p.name,
      price: p.priceNle,
      cadence: `for ${p.length}`,
      blurb: p.blurb,
      note: p.savings,
      features: PAID_FEATURES,
      cta: `Get ${p.name.toLowerCase()} access`,
      best: !!p.best,
    })),
  ]

  return (
    <Band id="plans" labelledBy="plans-heading" className="scroll-mt-20">
      <SectionHeading
        id="plans-heading"
        eyebrow="Plans"
        title="Start free. Unlock everything for one small payment."
        lede={`A free account opens the first lesson of every topic. A plan opens every lesson and every practice set, from ${FROM_PRICE} NLe.`}
      />

      <div className="mt-10 grid gap-5 md:grid-cols-3 lg:mt-12">
        {cards.map((c, i) => (
          <div
            key={c.key}
            data-reveal={i}
            className={`site-card relative row-span-4 grid grid-rows-subgrid gap-y-0 p-6 sm:p-7 ${c.best ? 'border-primary shadow-[0_0_0_4px_rgba(100,56,216,.10),0_30px_60px_-34px_rgba(76,29,149,.6)]' : ''}`}
          >
            {c.best && (
              <span className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-[.1em] text-primary-foreground shadow-md">Best value</span>
            )}
            {/* Four rows, shared by all three cards: identity and price, terms, what is included, action. */}
            <div>
              <p className={`text-[11px] font-bold uppercase tracking-[.14em] ${c.best ? 'text-primary' : 'text-muted-foreground'}`}>{KICKER[c.key]}</p>
              <h3 className="mt-2 text-xl font-bold tracking-tight">{c.name}</h3>
              <p className="mt-6 flex items-baseline gap-1.5">
                <span className={`text-5xl font-extrabold leading-none tracking-tight tabular-nums ${c.best ? 'text-primary' : ''}`}>{c.price === 0 ? 'Free' : c.price}</span>
                {c.price > 0 && <span className="text-base font-bold text-muted-foreground">NLe</span>}
              </p>
              <p className="mt-2 text-sm font-semibold text-muted-foreground">{c.cadence}</p>
            </div>
            <div className="pb-6 pt-4">
              <p className="text-[15px] leading-snug text-muted-foreground">{c.blurb}</p>
              {c.note && <p className="mt-3 rounded-lg bg-success/10 px-3 py-2 text-[13px] font-semibold leading-snug text-success">{c.note}</p>}
            </div>
            <ul className="space-y-3 border-t pt-6 text-[15px]">
              {c.features.map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/12 text-success">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            {c.key === 'free' ? (
              <Link to="/auth" className="site-btn site-btn-secondary mt-7 w-full">{c.cta}</Link>
            ) : (
              <Link to="/subscribe" search={{ plan: c.key }} className={`site-btn mt-7 w-full ${c.best ? 'site-btn-primary' : 'site-btn-secondary'}`}>{c.cta}</Link>
            )}
          </div>
        ))}
      </div>

      {/* Phones: the four assurances as a two-by-two of titles; the detail (also in the FAQ) shows from tablet width. */}
      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5 border-t pt-7 sm:mt-10 sm:gap-x-8 sm:gap-y-7 sm:pt-9 lg:mt-12 lg:grid-cols-4">
        {ASSURANCES.map(({ title, body, Icon }) => (
          <li key={title} className="flex items-center gap-3 sm:items-start sm:gap-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card text-primary shadow-sm ring-1 ring-border">
              <Icon className="h-5 w-5" strokeWidth={1.9} aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold leading-snug tracking-tight sm:text-[15px]">{title}</span>
              <span className="mt-1 hidden text-[13px] leading-relaxed text-muted-foreground sm:block">{body}</span>
            </span>
          </li>
        ))}
      </ul>
    </Band>
  )
}
