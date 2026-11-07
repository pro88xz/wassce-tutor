// The two paid plans and what the free account includes.
// KEEP IN SYNC with api/_lib/plans.js (what the server charges) and
// supabase/migrations/20261107_07_plans_and_monime.sql (plan_months,
// plan_price_nle and the payment_requests policy).

export type PlanId = 'term' | 'year'

export type Plan = {
  id: PlanId
  name: string
  priceNle: number
  months: number
  /** How long, in words */
  length: string
  /** One line under the name */
  blurb: string
  best?: boolean
}

export const PLANS: Plan[] = [
  {
    id: 'term',
    name: 'Term pass',
    priceNle: 10,
    months: 4,
    length: '4 months',
    blurb: 'One school term of full access',
  },
  {
    id: 'year',
    name: 'Academic year',
    priceNle: 25,
    months: 12,
    length: '12 months',
    blurb: 'A full school year, right up to WASSCE',
    best: true,
  },
]

/**
 * How students pay. false: on WhatsApp (they send the request, pay with
 * Orange Money or AfriMoney, and an admin switches the plan on in Admin ->
 * Payments). true: Monime's online checkout (api/pay/*), once its keys and
 * webhook are set up in Vercel and Monime.
 */
export const ONLINE_CHECKOUT = false

export const planById = (id: string | null | undefined) => PLANS.find((p) => p.id === id)

/** Cheapest way in, for "from 10 NLe" copy. */
export const FROM_PRICE = Math.min(...PLANS.map((p) => p.priceNle))

/** What every free account gets, forever. */
export const FREE_FEATURES = [
  'Every subject and its full syllabus',
  'The first lesson of every topic',
  'A starter practice set in every subject',
  'Your progress, saved',
]

/** What a plan adds. */
export const PAID_FEATURES = [
  'Every lesson in every subject',
  'Every practice set, with the full working',
  'The AI tutor, 20 questions a day',
  'Your progress, saved',
]
