// What the server charges. KEEP IN SYNC with src/lib/plans.ts and
// supabase/migrations/20261107_07_plans_and_monime.sql.
export const PLANS = {
  term: { name: 'Term pass', priceNle: 10, length: '4 months' },
  year: { name: 'Academic year', priceNle: 25, length: '12 months' },
}
