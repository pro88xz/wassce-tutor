// Server-enforced prices. Keep in sync with src/lib/plans.ts and migration 09.
// Internal IDs remain stable so historical payment rows and pending orders keep working.
export const PLANS = {
  term: { name: 'Monthly', priceNle: 25, length: '1 month' },
  year: { name: 'Yearly', priceNle: 75, length: '12 months' },
}
