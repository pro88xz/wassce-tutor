// The two paid plans and what the free account includes.
// KEEP IN SYNC with api/_lib/plans.js and the monthly/yearly pricing migration.
// Internal IDs 'term' and 'year' are intentionally retained for payment history.

export type PlanId = 'term' | 'year'

export type Plan = {
  id: PlanId
  name: string
  priceNle: number
  months: number
  /** How long, in words */
  length: string
  /** Card description and billing cadence */
  blurb: string
  billing: string
  savings?: string
  best?: boolean
}

export const PLANS: Plan[] = [
  {
    id: 'term',
    name: 'Monthly',
    priceNle: 25,
    months: 1,
    length: '1 month',
    billing: 'Billed monthly',
    blurb: 'Full access for one month. Pay once; no automatic renewal.',
  },
  {
    id: 'year',
    name: 'Yearly',
    priceNle: 75,
    months: 12,
    length: '12 months',
    billing: 'Billed once yearly',
    blurb: 'Just NLe 6.25 per month, paid once for 12 months.',
    savings: 'Save NLe 225 (75%) compared with 12 monthly payments.',
    best: true,
  },
]

/** Monime one-time, fixed-price USSD Payment Codes are the primary checkout. */
export const ONLINE_CHECKOUT = true

export const planById = (id: string | null | undefined) => PLANS.find((p) => p.id === id)

/** Cheapest way in, for "from 10 NLe" copy. */
export const FROM_PRICE = Math.min(...PLANS.map((p) => p.priceNle))

// What the free account includes is in src/lib/free-plan.ts: it is written from
// the question bank, which this file cannot import (vite.config.ts loads it in Node).

/** What a plan adds. */
export const PAID_FEATURES = [
  'Every lesson in every subject',
  'Every practice set, with the full working',
  'Study tutor support, 20 questions a day',
  'Your progress, saved',
]
