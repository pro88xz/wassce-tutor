// Server-enforced prices. Keep in sync with src/lib/plans.ts and migration 09.
// Internal IDs remain stable so historical payment rows and pending orders keep working.
export const PLANS = {
  term: { name: 'Monthly', priceNle: 25, length: '1 month' },
  year: { name: 'Yearly', priceNle: 75, length: '12 months' },
}

// What a plan adds and what stays free: the email engine quotes these, so they
// must match src/lib/plans.ts (PAID_FEATURES) and src/lib/free-plan.ts.
export const PAID_FEATURES = [
  'Every lesson in every subject',
  'Every practice set, with the full working',
  'Study tutor support, 20 questions a day',
  'Your progress, saved',
]
export const FREE_SUMMARY = ['Every subject and its full syllabus', 'The first lesson of every topic', 'Free starter practice sets']
