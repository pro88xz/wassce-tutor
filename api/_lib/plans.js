// Server-enforced prices. Keep in sync with src/lib/plans.ts and migration 09.
// Internal IDs remain stable so historical payment rows and pending orders keep working.
export const PLANS = {
  term: { name: 'Monthly', priceNle: 25, length: '1 month' },
  year: { name: 'Yearly', priceNle: 75, length: '12 months' },
}

// What a plan adds and what is free: the email engine quotes these, so they
// must match src/lib/plans.ts (PAID_FEATURES) and src/lib/free-plan.ts.
// Lessons and practice sets are free for everyone (migration 22); a plan adds
// the AI study tutor and the timed mock exams.
export const PAID_FEATURES = [
  'The AI study tutor: ask any WASSCE question, up to 20 a day',
  'Timed WASSCE mock exams, with your score and the topics to revise',
]
export const FREE_SUMMARY = ['Every lesson in every subject', 'Every practice set, with the full working', 'Your progress, saved']
