// What every free account gets. Kept apart from plans.ts because the practice
// line is written from the question bank (practice-counts.ts uses
// import.meta.glob), and plans.ts is also loaded by vite.config.ts in Node.
import { PRACTICE_SUBJECTS_PHRASE } from '@/lib/practice-counts'

/**
 * Where the practice sets are: the subjects that have practice questions
 * today, by name. Written from the question bank, so it never promises a set
 * that does not exist. Every set is free (migration 22).
 */
export const FREE_PRACTICE = `Every practice set in ${PRACTICE_SUBJECTS_PHRASE}, with the full working`

/** The same line for the middle of a sentence. */
export const FREE_PRACTICE_INLINE = FREE_PRACTICE.replace(/^Every/, 'every')

/** What everyone gets for free, forever. Keep in step with FREE_SUMMARY in api/_lib/plans.js. */
export const FREE_FEATURES = [
  'Every lesson in every subject',
  FREE_PRACTICE,
  'Your progress, saved',
]
