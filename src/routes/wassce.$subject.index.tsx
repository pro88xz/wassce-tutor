import { createFileRoute, notFound } from '@tanstack/react-router'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import { StartCta } from '@/components/public/StartCta'
import { fetchSubjectHub, hasTopicPage, subjectPath, topicPath } from '@/lib/public-content'
import type { SubjectHub } from '@/lib/public-content'
import { breadcrumbJsonLd, indexablePageTags, privatePageTags } from '@/lib/seo'
import { tutorsPath } from '@/lib/public-rules'
import { ChevronRight } from 'lucide-react'
import { subjectTheme } from '@/lib/subject-theme'
import { SubjectBanner, SubjectCover } from '@/components/ds/SubjectCover'

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
  const { palette } = subjectTheme(subject.slug)
  return (
    <article className="mx-auto max-w-3xl space-y-10 pb-12">
      <Breadcrumbs trail={trail(hub)} />

      <header className="space-y-4">
        <SubjectBanner slug={subject.slug} eyebrow="WASSCE syllabus" title={subject.name} />
        <p className="text-[15px] text-muted-foreground sm:text-base">
          Every topic in the WASSCE {subject.name} syllabus, grouped the way you&rsquo;ll study it, with lessons
          written for Sierra Leone students.
        </p>
        <ul className="flex flex-wrap gap-2 text-sm font-medium">
          <li className={`rounded-full px-3 py-1 ${palette.soft} ${palette.text}`}>{topicCount} topics</li>
          <li className="rounded-full bg-muted px-3 py-1 text-muted-foreground">{groups.length} sections</li>
          {lessonCount > 0 && <li className="rounded-full bg-muted px-3 py-1 text-muted-foreground">{lessonCount} lessons</li>}
          {lessonCount > 0 && <li className="rounded-full bg-muted px-3 py-1 text-muted-foreground">about {hours(minutes)}</li>}
        </ul>
        {roleLabel(hub) && <p className="text-sm text-muted-foreground">{roleLabel(hub)}</p>}
      </header>

      <section className="space-y-8" aria-labelledby="syllabus">
        <h2 id="syllabus" className="text-2xl font-bold tracking-tight">{subject.name} syllabus topics</h2>
        {groups.map((group) => (
          <section key={group.name} className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-muted-foreground">{group.name}</h3>
              <span className="text-xs text-muted-foreground">{group.topics.length} topics</span>
            </div>
            <ul className="space-y-2">
              {group.topics.map((topic) => (
                <li key={topic.id} className="rounded-2xl bg-card p-4 ring-1 ring-border/60">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      {hasTopicPage(topic) ? (
                        <a href={topicPath(subject.slug, topic.slug)} className={`font-semibold hover:underline ${palette.text}`}>
                          {topic.name}
                        </a>
                      ) : (
                        <span className="font-semibold">{topic.name}</span>
                      )}
                      {topic.description && <p className="text-sm text-muted-foreground">{topic.description}</p>}
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        topic.lessons.length > 0 ? `${palette.soft} ${palette.text}` : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {topic.lessons.length > 0 ? `${topic.lessons.length} lesson${topic.lessons.length === 1 ? '' : 's'}` : 'Soon'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </section>

      <a
        href={tutorsPath(subject.slug)}
        className="flex items-center gap-4 rounded-2xl border bg-card p-4 transition-colors hover:border-primary/40 sm:p-5"
      >
        <img src="/img/tutors-session-640.webp" alt="" loading="lazy" width={640} height={427} className="h-16 w-24 shrink-0 rounded-lg object-cover" />
        <span className="min-w-0 flex-1">
          <span className="block font-bold">Need one-to-one help with {subject.name}?</span>
          <span className="mt-0.5 block text-[15px] text-muted-foreground">Book a real {subject.name} tutor, online or at home.</span>
        </span>
        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
      </a>

      <StartCta
        heading={`Study WASSCE ${subject.name} with WASSCE Tutor`}
        body={
          lessonCount > 0
            ? `Get all ${lessonCount} ${subject.name} lessons, exam-style practice marked instantly, and an AI tutor that answers your questions in plain English.`
            : `Practise exam-style practice marked instantly and ask the AI tutor any ${subject.name} question in plain English. Lessons for this subject are on the way.`
        }
        appHref={`/subject/${subject.id}`}
      />

      {related.length > 0 && (
        <section className="space-y-3" aria-labelledby="related">
          <h2 id="related" className="text-xl font-bold tracking-tight">Related subjects</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {related.map((s) => (
              <li key={s.id}>
                <a href={subjectPath(s.slug)} className="flex items-center gap-3 rounded-2xl border bg-card p-3 transition hover:border-primary/40">
                  <SubjectCover slug={s.slug} shape="thumb" className="h-12 w-16 shrink-0" rounded="rounded-lg" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold leading-snug">{s.name}</span>
                    <span className="mt-0.5 block text-[13px] text-muted-foreground">{s.topicCount} topics</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}
