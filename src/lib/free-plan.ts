// What every free account gets. Kept apart from plans.ts because the practice
// line is written from the question bank (practice-counts.ts uses
// import.meta.glob), and plans.ts is also loaded by vite.config.ts in Node.
import { PRACTICE_SUBJECTS_PHRASE } from '@/lib/practice-counts'

/**
 * Where the free starter practice sets are: the subjects that have practice
 * questions today, by name. Written from the question bank, so it never
 * promises a set that does not exist.
 */
export const FREE_PRACTICE = `A starter practice set in ${PRACTICE_SUBJECTS_PHRASE}`

/** The same line for the middle of a sentence. */
export const FREE_PRACTICE_INLINE = FREE_PRACTICE.replace(/^A/, 'a')

/** What every free account gets, forever. */
export const FREE_FEATURES = [
  'Every subject and its full syllabus',
  'The first lesson of every topic',
  FREE_PRACTICE,
  'Your progress, saved',
]
