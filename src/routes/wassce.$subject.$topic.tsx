import { createFileRoute, notFound } from '@tanstack/react-router'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import { StartCta } from '@/components/public/StartCta'
import { useAuth } from '@/lib/auth'
import { fetchTopicPage, hasTopicPage, lessonMinutes, lessonPath, subjectPath, topicPath } from '@/lib/public-content'
import type { TopicPageData } from '@/lib/public-content'
import { breadcrumbJsonLd, indexablePageTags, privatePageTags } from '@/lib/seo'

const trail = ({ subject, topic }: TopicPageData): [string, string][] => [
  ['Home', '/'],
  ['WASSCE', '/wassce'],
  [subject.name, subjectPath(subject.slug)],
  [topic.name, topicPath(subject.slug, topic.slug)],
]

function describe({ subject, topic, group }: TopicPageData): string {
  const n = topic.lessons.length
  const intro = topic.description ? `${topic.description.replace(/\.?$/, '.')} ` : ''
  return `${intro}${n} WASSCE ${subject.name} lesson${n === 1 ? '' : 's'} on ${topic.name.toLowerCase()} (about ${lessonMinutes(topic.lessons)} minutes), part of ${group.name}. For Sierra Leone students.`
}

export const Route = createFileRoute('/wassce/$subject/$topic')({
  ssr: true, // prerendered to static HTML at build time
  loader: async ({ params }) => {
    const data = await fetchTopicPage(params.subject, params.topic)
    if (!data) throw notFound()
    return data
  },
  head: ({ loaderData: data }) =>
    data
      ? indexablePageTags({
          path: topicPath(data.subject.slug, data.topic.slug),
          title: `${data.topic.name}: WASSCE ${data.subject.name} Lessons | WASSCE Tutor`,
          ogTitle: `${data.topic.name} (WASSCE ${data.subject.name})`,
          description: describe(data),
          jsonLd: [breadcrumbJsonLd(trail(data))],
        })
      : privatePageTags('Page not found'),
  component: TopicPage,
})

function TopicPage() {
  const data = Route.useLoaderData()
  const { subject, topic, group, previous, next } = data
  const { user } = useAuth()
  const minutes = lessonMinutes(topic.lessons)
  const siblings = group.topics.filter((t) => t.id !== topic.id)

  return (
    <article className="mx-auto max-w-3xl space-y-10 pb-12">
      <header className="space-y-3 pt-2">
        <Breadcrumbs trail={trail(data)} />
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          WASSCE {subject.name} · {group.name}
        </p>
        <h1 className="text-4xl font-black tracking-tight">{topic.name}</h1>
        {topic.description && <p className="text-lg text-muted-foreground">{topic.description}</p>}
        <p className="text-sm text-muted-foreground">
          {topic.lessons.length} lesson{topic.lessons.length === 1 ? '' : 's'} · about {minutes} minutes
        </p>
      </header>

      <section className="space-y-3" aria-labelledby="lessons">
        <h2 id="lessons" className="text-2xl font-bold">Lessons in this topic</h2>
        <ol className="divide-y rounded-xl border">
          {topic.lessons.map((lesson, i) => (
            <li key={lesson.id} className="flex items-center justify-between gap-3 p-4">
              <span className="flex items-baseline gap-3">
                <span className="text-xs tabular-nums text-muted-foreground">{i + 1}</span>
                {lesson.is_public ? (
                  <a href={lessonPath(subject.slug, topic.slug, lesson.slug)} className="font-medium text-primary hover:underline">{lesson.title}</a>
                ) : user ? (
                  <a href={`/lesson/${lesson.id}`} className="font-medium text-primary hover:underline">{lesson.title}</a>
                ) : (
                  <span className="font-medium">{lesson.title}</span>
                )}
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {lesson.est_minutes ? `${lesson.est_minutes} min` : ''}
                {lesson.is_public ? ' · Free' : !user && <span aria-label="Requires a free account"> · 🔒</span>}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <StartCta
        heading={`Learn ${topic.name.toLowerCase()} step by step`}
        body={`Unlock all ${topic.lessons.length} lessons on ${topic.name.toLowerCase()}, plus every other WASSCE ${subject.name} topic, past papers with instant scoring and an AI tutor.`}
        appHref={`/topic/${topic.id}`}
      />

      {siblings.length > 0 && (
        <section className="space-y-3" aria-labelledby="more">
          <h2 id="more" className="text-xl font-bold">More in {group.name}</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {siblings.map((t) => (
              <li key={t.id} className="rounded-lg border p-3">
                {hasTopicPage(t) ? (
                  <a href={topicPath(subject.slug, t.slug)} className="font-medium text-primary hover:underline">{t.name}</a>
                ) : (
                  <span className="font-medium">{t.name}</span>
                )}
                <p className="text-xs text-muted-foreground">
                  {t.lessons.length > 0 ? `${t.lessons.length} lesson${t.lessons.length === 1 ? '' : 's'}` : 'Lessons coming soon'}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav className="flex justify-between gap-3 text-sm" aria-label="Topic navigation">
        {previous ? (
          <a href={topicPath(subject.slug, previous.slug)} className="hover:underline">← {previous.name}</a>
        ) : <span />}
        <a href={subjectPath(subject.slug)} className="hover:underline">All {subject.name} topics</a>
        {next ? (
          <a href={topicPath(subject.slug, next.slug)} className="text-right hover:underline">{next.name} →</a>
        ) : <span />}
      </nav>
    </article>
  )
}
