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

export const subjectPath = (subjectSlug: string) => `/wassce/${subjectSlug}`
export const topicPath = (subjectSlug: string, topicSlug: string) => `/wassce/${subjectSlug}/${topicSlug}`
