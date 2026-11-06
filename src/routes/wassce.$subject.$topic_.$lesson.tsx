import { createFileRoute, notFound } from '@tanstack/react-router'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import { StartCta } from '@/components/public/StartCta'
import { LessonView } from '@/components/LessonView'
import { fetchPublicLessonPage, lessonPath, lessonSummary, subjectPath, topicPath } from '@/lib/public-content'
import type { PublicLessonPageData } from '@/lib/public-content'
import { SITE, absoluteUrl, breadcrumbJsonLd, indexablePageTags, privatePageTags } from '@/lib/seo'
import { SubjectIcon, subjectTheme } from '@/lib/subject-theme'

const trail = ({ subject, topic, lesson }: PublicLessonPageData): [string, string][] => [
  ['Home', '/'],
  ['WASSCE', '/wassce'],
  [subject.name, subjectPath(subject.slug)],
  [topic.name, topicPath(subject.slug, topic.slug)],
  [lesson.title, lessonPath(subject.slug, topic.slug, lesson.slug)],
]

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

/** WebPage (with the human reviewer) wrapping the lesson as an Article. */
function lessonJsonLd(data: PublicLessonPageData): Record<string, unknown> {
  const { subject, topic, lesson } = data
  const url = absoluteUrl(lessonPath(subject.slug, topic.slug, lesson.slug))
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url,
    url,
    name: lesson.title,
    inLanguage: 'en',
    lastReviewed: lesson.reviewed_at,
    ...(lesson.reviewer_name
      ? { reviewedBy: { '@type': 'Person', name: lesson.reviewer_name, ...(lesson.reviewer_bio ? { description: lesson.reviewer_bio } : {}) } }
      : {}),
    mainEntity: {
      '@type': 'Article',
      headline: lesson.title,
      description: lessonSummary(lesson.content),
      about: `${topic.name} (WASSCE ${subject.name})`,
      educationalLevel: 'Senior secondary (WASSCE)',
      isAccessibleForFree: true,
      datePublished: lesson.reviewed_at,
      dateModified: lesson.updated_at,
      author: { '@type': 'Organization', name: SITE.name, url: `${SITE.origin}/` },
      publisher: { '@id': `${SITE.origin}/#organization` },
    },
  }
}

export const Route = createFileRoute('/wassce/$subject/$topic_/$lesson')({
  ssr: true, // prerendered to static HTML at build time
  loader: async ({ params }) => {
    const data = await fetchPublicLessonPage(params.subject, params.topic, params.lesson)
    if (!data) throw notFound()
    return data
  },
  head: ({ loaderData: data }) =>
    data
      ? indexablePageTags({
          path: lessonPath(data.subject.slug, data.topic.slug, data.lesson.slug),
          title: `${data.lesson.title}: WASSCE ${data.subject.name} | WASSCE Tutor`,
          ogTitle: `${data.lesson.title} (WASSCE ${data.subject.name})`,
          description: lessonSummary(data.lesson.content),
          jsonLd: [lessonJsonLd(data), breadcrumbJsonLd(trail(data))],
        })
      : privatePageTags('Page not found'),
  component: PublicLessonPage,
})

function PublicLessonPage() {
  const data = Route.useLoaderData()
  const { subject, topic, lesson } = data
  const others = topic.lessons.filter((l) => l.id !== lesson.id)
  const { palette } = subjectTheme(subject.slug)

  return (
    <article className="mx-auto max-w-2xl space-y-8 pb-12">
      <header className="space-y-3 pt-2">
        <Breadcrumbs trail={trail(data)} />
        <p className={`flex items-center gap-2 text-sm font-semibold ${palette.text}`}>
          <SubjectIcon slug={subject.slug} size="sm" /> WASSCE {subject.name} · {topic.name}
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{lesson.title}</h1>
        <div className="rounded-xl border bg-muted/40 p-3 text-sm">
          <p>
            <span className="text-muted-foreground">Reviewed by </span>
            <span className="font-semibold">{lesson.reviewer_name ?? 'the WASSCE Tutor team'}</span>
            {lesson.reviewer_bio && <span className="text-muted-foreground">, {lesson.reviewer_bio}</span>}
          </p>
          <p className="text-xs text-muted-foreground">
            Checked {formatDate(lesson.reviewed_at)}
            {lesson.est_minutes ? ` · ${lesson.est_minutes} min read` : ''} · Drafted with AI assistance and checked by a
            person before publishing.
          </p>
        </div>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3 prose-p:leading-relaxed prose-li:my-1 prose-strong:text-foreground">
        <LessonView content={lesson.content} />
      </div>

      <StartCta
        heading={`Keep going with ${topic.name.toLowerCase()}`}
        body={`This is one of ${topic.lessons.length} lessons in ${topic.name}. Unlock them all, plus exam-style practice marked instantly and an AI tutor, free for 7 days.`}
        appHref={`/lesson/${lesson.id}`}
      />

      {others.length > 0 && (
        <section className="space-y-3" aria-labelledby="more-lessons">
          <h2 id="more-lessons" className="text-xl font-bold">More lessons in {topic.name}</h2>
          <ol className="divide-y rounded-xl border">
            {others.map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-3 p-3 text-sm">
                {l.is_public ? (
                  <a href={lessonPath(subject.slug, topic.slug, l.slug)} className="font-medium text-primary hover:underline">{l.title}</a>
                ) : (
                  <span className="font-medium">{l.title}</span>
                )}
                <span className="shrink-0 text-xs text-muted-foreground">{l.is_public ? 'Free' : '🔒'}</span>
              </li>
            ))}
          </ol>
          <p className="text-sm">
            <a href={topicPath(subject.slug, topic.slug)} className="text-primary hover:underline">All of {topic.name} →</a>
          </p>
        </section>
      )}
    </article>
  )
}
