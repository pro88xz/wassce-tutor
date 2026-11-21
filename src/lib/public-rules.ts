// Which public /wassce pages exist. Shared by the pages (src/lib/public-content.ts)
// and the build's prerender + sitemap list (scripts/public-page-list.ts), so the
// two can't disagree. No imports: vite.config.ts loads this in Node.

/** A subject gets a public hub once it has syllabus topics. */
export const hasSubjectPage = (topicCount: number) => topicCount > 0

/**
 * A topic gets its own public page only once it has lessons. Topics without
 * lessons are still listed on their subject hub, without a link, so no page
 * is just a heading (Google treats mass-produced empty pages as spam).
 */
export const hasTopicPageByCount = (lessonCount: number) => lessonCount > 0

/**
 * A URL slug from a title or a typed slug: lowercase letters, digits and single
 * hyphens. The same rule as import_lessons() and scripts/sync-notes.mjs, so
 * "Topic 9: Equilibrium of Forces" becomes topic-9-equilibrium-of-forces, not
 * topic-9:-equilibrium-of-forces (a URL Google indexed before this rule).
 */
export const toSlug = (text: string) =>
  text.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-').toLowerCase().replace(/-+/g, '-').replace(/^-|-$/g, '')

export const subjectPath = (subjectSlug: string) => `/wassce/${subjectSlug}`
export const topicPath = (subjectSlug: string, topicSlug: string) => `/wassce/${subjectSlug}/${topicSlug}`
export const lessonPath = (subjectSlug: string, topicSlug: string, lessonSlug: string) =>
  `/wassce/${subjectSlug}/${topicSlug}/${lessonSlug}`

/**
 * A topic gets a questions page (/wassce/{subject}/{topic}/questions) when it
 * has a topic page and at least this many practice questions: enough to be
 * worth a page of its own, never a near-empty one.
 */
export const MIN_TOPIC_QUESTIONS = 3
export const hasQuestionsPageByCount = (questionCount: number) => questionCount >= MIN_TOPIC_QUESTIONS

/** WASSCE questions and answers: a topic's (/wassce/{subject}/{topic}/questions) or the subject's index of them. */
export const questionsPath = (subjectSlug: string, topicSlug?: string) =>
  topicSlug ? `/wassce/${subjectSlug}/${topicSlug}/questions` : `/wassce/${subjectSlug}/questions`

/** A topic's key terms page (/wassce/{subject}/{topic}/key-terms): its lessons' definitions as cards (src/lib/key-terms.ts). */
export const keyTermsPath = (subjectSlug: string, topicSlug: string) => `/wassce/${subjectSlug}/${topicSlug}/key-terms`

/** Book a tutor pages: /tutors and /tutors/{subject} (one per subject with a syllabus page). */
export const tutorsPath = (subjectSlug?: string) => (subjectSlug ? `/tutors/${subjectSlug}` : '/tutors')
/** Where the booking steps and the general tutoring FAQ live (on /tutors), for subject pages to link to rather than repeat. */
export const TUTOR_HUB_HOW = '/tutors#tutor-how'
export const TUTOR_HUB_FAQ = '/tutors#tutor-faq'
