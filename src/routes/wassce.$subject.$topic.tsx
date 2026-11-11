import { createFileRoute, notFound } from '@tanstack/react-router'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import { StartCta } from '@/components/public/StartCta'
import { useAuth } from '@/lib/auth'
import { fetchTopicPage, hasTopicPage, lessonMinutes, lessonPath, subjectPath, topicPath } from '@/lib/public-content'
import type { TopicPageData } from '@/lib/public-content'
import { breadcrumbJsonLd, indexablePageTags, privatePageTags } from '@/lib/seo'
import { subjectTheme } from '@/lib/subject-theme'
import { Lock } from 'lucide-react'
import { SubjectCover } from '@/components/ds/SubjectCover'
import { LessonOutlineList, outlineLinkClass } from '@/components/LessonOutline'
import { WaecPastPapers } from '@/components/WaecPastPapers'
import { describeTotals, loadOutlines, outlineKey, sectionId, totals } from '@/lib/lesson-outlines'
import type { LessonOutline } from '@/lib/lesson-outlines'

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
    // What each lesson covers (sections, worked examples, diagrams), keyed by lesson slug.
    const all = await loadOutlines(data.subject.slug)
    const outlines: Record<string, LessonOutline> = {}
    for (const l of data.topic.lessons) {
      const o = all[outlineKey(data.topic.slug, l.slug)]
      if (o) outlines[l.slug] = o
    }
    return { ...data, outlines }
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
  const { subject, topic, group, previous, next, outlines } = data
  const { user } = useAuth()
  const { palette } = subjectTheme(subject.slug)
  const minutes = lessonMinutes(topic.lessons)
  const siblings = group.topics.filter((t) => t.id !== topic.id)
  const freeCount = topic.lessons.filter((l) => l.is_public).length
  const covered = describeTotals(totals(topic.lessons.map((l) => outlines[l.slug])))

  return (
    <article className="app-page site-page space-y-10 pb-12">
      <Breadcrumbs trail={trail(data)} />

      <header className="space-y-4 rounded-2xl border bg-card p-6">
        <div className="flex items-center gap-3">
          <SubjectCover slug={subject.slug} shape="thumb" className="h-12 w-16 shrink-0" rounded="rounded-lg" />
          <p className={`text-sm font-semibold ${palette.text}`}>
            WASSCE {subject.name} · {group.name}
          </p>
        </div>
        <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-balance sm:text-4xl">{topic.name}</h1>
        {topic.description && <p className="text-lg text-muted-foreground">{topic.description}</p>}
        <ul className="flex flex-wrap gap-2 text-sm font-semibold">
          <li className={`rounded-full px-3 py-1 ${palette.soft} ${palette.text}`}>
            {topic.lessons.length} lesson{topic.lessons.length === 1 ? '' : 's'}
          </li>
          <li className="rounded-full bg-muted px-3 py-1 text-muted-foreground">about {minutes} minutes</li>
          {covered.map((c) => (
            <li key={c} className="rounded-full bg-muted px-3 py-1 text-muted-foreground">{c}</li>
          ))}
          {freeCount > 0 && <li className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:text-emerald-300">{freeCount} free to read</li>}
        </ul>
      </header>

      <section className="space-y-3" aria-labelledby="lessons">
        <h2 id="lessons" className="text-2xl font-bold tracking-tight">Lessons in this topic</h2>
        <ol className="space-y-2">
          {topic.lessons.map((lesson, i) => {
            const href = lesson.is_public ? lessonPath(subject.slug, topic.slug, lesson.slug) : user ? `/lesson/${lesson.id}` : null
            const body = (
              <>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${palette.soft} ${palette.text}`}>
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 font-semibold">{lesson.title}</span>
                <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                  {lesson.est_minutes ? `${lesson.est_minutes} min` : ''}
                  {lesson.is_public ? (
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-semibold text-emerald-700">Free</span>
                  ) : (
                    !user && <Lock className="h-3.5 w-3.5" aria-label="Free account needed" />
                  )}
                </span>
              </>
            )
            const outline = outlines[lesson.slug]
            return (
              <li key={lesson.id} className="rounded-2xl bg-card ring-1 ring-border/60">
                {href ? (
                  <a href={href} className="flex items-center gap-3 rounded-2xl px-4 py-3.5 transition hover:bg-muted/40">{body}</a>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3.5">{body}</div>
                )}
                {outline && (
                  <LessonOutlineList
                    outline={outline}
                    className="-mt-1 pb-4 pl-[3.75rem] pr-4"
                    link={href ? (n, b) => <a href={`${href}#${sectionId(n)}`} className={outlineLinkClass}>{b}</a> : undefined}
                  />
                )}
              </li>
            )
          })}
        </ol>
      </section>

      <WaecPastPapers subjectSlug={subject.slug} subjectName={subject.name} />

      <StartCta
        heading={`Learn ${topic.name.toLowerCase()} step by step`}
        body={`Unlock ${topic.lessons.length === 2 ? 'both lessons' : `all ${topic.lessons.length} lessons`} on ${topic.name.toLowerCase()}, plus every other WASSCE ${subject.name} topic, exam-style practice marked instantly and guided learning tools.`}
        appHref={`/topic/${topic.id}`}
      />

      {siblings.length > 0 && (
        <section className="space-y-3" aria-labelledby="more">
          <h2 id="more" className="text-xl font-bold tracking-tight">More in {group.name}</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {siblings.map((t) => (
              <li key={t.id}>
                {hasTopicPage(t) ? (
                  <a href={topicPath(subject.slug, t.slug)} className="block h-full rounded-2xl border bg-card p-3 transition hover:border-primary/40">
                    <span className={`block font-semibold ${palette.text}`}>{t.name}</span>
                    <span className="text-xs text-muted-foreground">{t.lessons.length} lesson{t.lessons.length === 1 ? '' : 's'}</span>
                  </a>
                ) : (
                  <div className="h-full rounded-2xl border border-dashed p-3">
                    <span className="block font-semibold">{t.name}</span>
                    <span className="text-xs text-muted-foreground">Lessons coming soon</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav className="grid grid-cols-2 gap-2 text-sm" aria-label="Topic navigation">
        {previous ? (
          <a href={topicPath(subject.slug, previous.slug)} className="rounded-2xl border bg-card p-3 hover:border-primary/40">
            <span className="block text-xs text-muted-foreground">← Previous topic</span>
            <span className="block truncate font-semibold">{previous.name}</span>
          </a>
        ) : <span />}
        {next ? (
          <a href={topicPath(subject.slug, next.slug)} className="rounded-2xl border bg-card p-3 text-right hover:border-primary/40">
            <span className="block text-xs text-muted-foreground">Next topic →</span>
            <span className="block truncate font-semibold">{next.name}</span>
          </a>
        ) : <span />}
      </nav>
      <p className="text-center text-sm">
        <a href={subjectPath(subject.slug)} className="font-semibold text-primary hover:underline">All {subject.name} topics</a>
      </p>
    </article>
  )
}
