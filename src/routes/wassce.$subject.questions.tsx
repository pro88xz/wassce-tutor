// /wassce/{subject}/questions: the subject's WASSCE questions and answers,
// topic by topic, for searches like "WASSCE mathematics questions and
// answers". Each topic links to its own questions page. Prerendered.
import { createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowRight, ImageIcon } from 'lucide-react'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import { StartCta } from '@/components/public/StartCta'
import { WaecPastPapers } from '@/components/WaecPastPapers'
import { fetchSubjectQuestionsHub, questionsPath, subjectPath } from '@/lib/public-content'
import type { SubjectQuestionsHub } from '@/lib/public-content'
import { absoluteUrl, brandedTitle, breadcrumbJsonLd, fitDescription, indexablePageTags, privatePageTags } from '@/lib/seo'
import { SubjectIcon } from '@/components/SubjectIcon'
import { subjectTheme } from '@/lib/subject-theme'

const trail = ({ subject }: SubjectQuestionsHub): [string, string][] => [
  ['Home', '/'],
  ['WASSCE', '/wassce'],
  [subject.name, subjectPath(subject.slug)],
  ['Questions', questionsPath(subject.slug)],
]

const topicCount = (hub: SubjectQuestionsHub) => hub.groups.reduce((n, g) => n + g.topics.length, 0)

/** The topic pages as an ordered list, for search engines (matches the visible list). */
function itemListJsonLd(hub: SubjectQuestionsHub): Record<string, unknown> {
  const topics = hub.groups.flatMap((g) => g.topics)
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `WASSCE ${hub.subject.name} questions and answers by topic`,
    numberOfItems: topics.length,
    itemListElement: topics.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${t.topic.name} questions`,
      url: absoluteUrl(questionsPath(hub.subject.slug, t.topic.slug)),
    })),
  }
}

export const Route = createFileRoute('/wassce/$subject/questions')({
  ssr: true, // prerendered to static HTML at build time
  loader: async ({ params }) => {
    const data = await fetchSubjectQuestionsHub(params.subject)
    if (!data) throw notFound()
    return data
  },
  head: ({ loaderData: data }) => {
    if (!data) return privatePageTags('Page not found')
    const topics = topicCount(data)
    return indexablePageTags({
      path: questionsPath(data.subject.slug),
      title: brandedTitle(`WASSCE ${data.subject.name} Questions and Answers by Topic`),
      ogTitle: `WASSCE ${data.subject.name} questions and answers`,
      description: fitDescription([
        `${data.questionCount} free WASSCE ${data.subject.name} objective questions in ${topics} topics, each with the answer and full working.`,
        'Original WASSCE-style questions for Sierra Leone students.',
      ]),
      jsonLd: [itemListJsonLd(data), breadcrumbJsonLd(trail(data))],
    })
  },
  component: SubjectQuestionsPage,
})

function SubjectQuestionsPage() {
  const data = Route.useLoaderData()
  const { subject, groups, questionCount } = data
  const { palette } = subjectTheme(subject.slug)

  return (
    <article className="app-page site-page mx-auto w-full max-w-4xl space-y-8 pb-12">
      <header className="space-y-4 pt-2">
        <Breadcrumbs trail={trail(data)} />
        <p className={`flex items-center gap-2 text-sm font-semibold ${palette.text}`}>
          <SubjectIcon slug={subject.slug} size="sm" /> WASSCE {subject.name}
        </p>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl">WASSCE {subject.name} questions and answers</h1>
        <p className="max-w-3xl text-[17px] leading-relaxed text-muted-foreground">
          {questionCount} objective questions in {topicCount(data)} topics, in syllabus order. Each one has the answer, the full working and the
          reason every other option is wrong. Free, with no account needed.
        </p>
        <p className="rounded-xl border bg-muted/40 p-3 text-sm text-muted-foreground">
          Original questions written by WASSCE Tutor to match the WASSCE syllabus and the exam&rsquo;s objective format. They are not WAEC past
          papers.
        </p>
      </header>

      {groups.map((g) => (
        <section key={g.name} className="space-y-3" aria-labelledby={`g-${g.name}`}>
          <h2 id={`g-${g.name}`} className="text-lg font-bold tracking-tight">{g.name}</h2>
          <ul className="divide-y rounded-2xl border bg-card">
            {g.topics.map(({ topic, questions, withDiagrams }) => (
              <li key={topic.id}>
                <a href={questionsPath(subject.slug, topic.slug)} className="group flex min-h-14 items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40">
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold leading-snug group-hover:text-primary">{topic.name} questions</span>
                    <span className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
                      <span>{questions} questions with answers</span>
                      {withDiagrams > 0 && (
                        <span className="inline-flex items-center gap-1"><ImageIcon className="h-3.5 w-3.5" aria-hidden /> {withDiagrams} with diagrams</span>
                      )}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <WaecPastPapers subjectSlug={subject.slug} subjectName={subject.name} />

      <StartCta
        heading={`Practise WASSCE ${subject.name} with marking`}
        body="In the app every practice set is marked as you go and your scores are saved, so you know which topics to revise. Every lesson and practice set is free; a plan adds the AI study tutor and timed mock exams."
        appHref="/practice"
      />
    </article>
  )
}
