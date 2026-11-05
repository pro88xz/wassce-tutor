import { createFileRoute, notFound } from '@tanstack/react-router'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import { StartCta } from '@/components/public/StartCta'
import { fetchSubjectHub, hasTopicPage, subjectPath, topicPath } from '@/lib/public-content'
import type { SubjectHub } from '@/lib/public-content'
import { breadcrumbJsonLd, indexablePageTags, privatePageTags } from '@/lib/seo'

const trail = (hub: SubjectHub): [string, string][] => [
  ['Home', '/'],
  ['WASSCE', '/wassce'],
  ['Subjects', '/wassce/subjects'],
  [hub.subject.name, subjectPath(hub.subject.slug)],
]

const hours = (minutes: number) => (minutes >= 90 ? `${Math.round(minutes / 60)} hours` : `${minutes} minutes`)

function describe(hub: SubjectHub): string {
  const sections = hub.groups.map((g) => g.name).slice(0, 3).join(', ')
  const lessons = hub.lessonCount ? ` ${hub.lessonCount} lessons (about ${hours(hub.minutes)}).` : ''
  return `All ${hub.topicCount} WASSCE ${hub.subject.name} syllabus topics in ${hub.groups.length} sections, including ${sections}.${lessons} For Sierra Leone students.`
}

export const Route = createFileRoute('/wassce/$subject/')({
  ssr: true, // prerendered to static HTML at build time
  loader: async ({ params }) => {
    const hub = await fetchSubjectHub(params.subject)
    if (!hub) throw notFound()
    return hub
  },
  head: ({ loaderData: hub }) =>
    hub
      ? indexablePageTags({
          path: subjectPath(hub.subject.slug),
          title: `WASSCE ${hub.subject.name} Syllabus: All ${hub.topicCount} Topics & Lessons | WASSCE Tutor`,
          ogTitle: `WASSCE ${hub.subject.name}: syllabus topics and lessons`,
          description: describe(hub),
          jsonLd: [breadcrumbJsonLd(trail(hub))],
        })
      : privatePageTags('Page not found'),
  component: SubjectHubPage,
})

function roleLabel(hub: SubjectHub): string {
  const f = hub.subject.faculties
  if (f.length > 0 && f.every((x) => x.role === 'core')) return 'Core subject: every candidate takes it'
  const parts = f.map((x) => `${x.role === 'elective' ? 'elective' : 'main subject'} in ${x.faculty.name}`)
  return parts.length ? parts.join(' · ').replace(/^./, (c) => c.toUpperCase()) : ''
}

function SubjectHubPage() {
  const hub = Route.useLoaderData()
  const { subject, groups, topicCount, lessonCount, minutes, related } = hub
  return (
    <article className="mx-auto max-w-3xl space-y-10 pb-12">
      <header className="space-y-3 pt-2">
        <Breadcrumbs trail={trail(hub)} />
        <h1 className="text-4xl font-black tracking-tight">WASSCE {subject.name}</h1>
        <p className="text-lg text-muted-foreground">
          Every topic in the WASSCE {subject.name} syllabus, grouped the way you&rsquo;ll study it, with lessons
          written for Sierra Leone students.
        </p>
        <p className="text-sm text-muted-foreground">
          {topicCount} topics · {groups.length} sections
          {lessonCount > 0 && <> · {lessonCount} lessons · about {hours(minutes)} of study</>}
        </p>
        {roleLabel(hub) && <p className="text-sm">{roleLabel(hub)}</p>}
      </header>

      <section className="space-y-8" aria-labelledby="syllabus">
        <h2 id="syllabus" className="text-2xl font-bold">{subject.name} syllabus topics</h2>
        {groups.map((group) => (
          <section key={group.name} className="space-y-3">
            <h3 className="text-lg font-semibold">{group.name}</h3>
            <ul className="divide-y rounded-xl border">
              {group.topics.map((topic) => (
                <li key={topic.id} className="p-4 space-y-1">
                  <div className="flex items-baseline justify-between gap-3">
                    {hasTopicPage(topic) ? (
                      <a href={topicPath(subject.slug, topic.slug)} className="font-medium text-primary hover:underline">
                        {topic.name}
                      </a>
                    ) : (
                      <span className="font-medium">{topic.name}</span>
                    )}
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {topic.lessons.length > 0
                        ? `${topic.lessons.length} lesson${topic.lessons.length === 1 ? '' : 's'}`
                        : 'Lessons coming soon'}
                    </span>
                  </div>
                  {topic.description && <p className="text-sm text-muted-foreground">{topic.description}</p>}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </section>

      <StartCta
        heading={`Study WASSCE ${subject.name} with WASSCE Tutor`}
        body={
          lessonCount > 0
            ? `Get all ${lessonCount} ${subject.name} lessons, past papers with instant scoring, and an AI tutor that answers your questions in plain English.`
            : `Practise past papers with instant scoring and ask the AI tutor any ${subject.name} question in plain English. Lessons for this subject are on the way.`
        }
        appHref={`/subject/${subject.id}`}
      />

      {related.length > 0 && (
        <section className="space-y-3" aria-labelledby="related">
          <h2 id="related" className="text-xl font-bold">Related subjects</h2>
          <ul className="flex flex-wrap gap-2">
            {related.map((s) => (
              <li key={s.id}>
                <a href={subjectPath(s.slug)} className="inline-block rounded-full border px-3 py-1 text-sm hover:bg-muted">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}
