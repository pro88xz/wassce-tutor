// /wassce/{subject}/{topic}/questions: every practice question on a topic,
// free and public (migration 22), for people searching "WASSCE questions on
// <topic>". Each question shows its options, then the answer, the full
// working and why every other option is wrong, folded under "Show the answer"
// (still in the HTML, so search engines read it). Diagrams are real <img>
// elements with sizes and descriptive alt text, so they can appear in image
// search. Prerendered at build time.
import { createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, BookOpen, CircleCheck, Lightbulb } from 'lucide-react'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import { StartCta } from '@/components/public/StartCta'
import { QuestionMarkdown } from '@/components/QuestionMarkdown'
import { ZoomableImage } from '@/components/ds/ZoomableImage'
import { WaecPastPapers } from '@/components/WaecPastPapers'
import { fetchTopicQuestionsPage, lessonPath, questionsPath, subjectPath, topicPath } from '@/lib/public-content'
import type { PublicQuestion, TopicQuestionsPageData } from '@/lib/public-content'
import { brandedTitle, breadcrumbJsonLd, fitDescription, indexablePageTags, privatePageTags, quizJsonLd } from '@/lib/seo'
import { mathToText } from '@/lib/math-text'
import { SubjectIcon, subjectTheme } from '@/lib/subject-theme'

const sizeFiles = import.meta.glob<Record<string, [number, number]>>('../content/question-diagram-sizes.json', { eager: true, import: 'default' })
const DIAGRAM_SIZES = Object.values(sizeFiles)[0] ?? {}

/** Width and height of a question diagram, from its path (scripts/questions/diagram-sizes.mjs). */
function diagramSize(url: string): { width?: number; height?: number } {
  const path = url.replace(/^https?:\/\/[^/]+/, '').split('?')[0]
  const size = DIAGRAM_SIZES[path]
  return size ? { width: size[0], height: size[1] } : {}
}

const trail = ({ subject, topic }: TopicQuestionsPageData): [string, string][] => [
  ['Home', '/'],
  ['WASSCE', '/wassce'],
  [subject.name, subjectPath(subject.slug)],
  [topic.name, topicPath(subject.slug, topic.slug)],
  ['Questions', questionsPath(subject.slug, topic.slug)],
]

/** Markdown (with maths) as one line of plain text: for alt text, descriptions and structured data. */
const plain = (markdown: string) =>
  mathToText(markdown)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+>]\s+/gm, '')
    .replace(/[*_`|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const diagramAlt = (q: PublicQuestion, n: number, topic: string) => {
  const stem = plain(q.stem)
  return `Diagram for ${topic} question ${n}: ${stem.length > 180 ? `${stem.slice(0, stem.lastIndexOf(' ', 180))}…` : stem}`
}

function describe({ subject, topic, questions }: TopicQuestionsPageData): string {
  const n = questions.length
  const diagrams = questions.filter((q) => q.image_url).length
  const first = plain(questions[0].stem)
  return fitDescription([
    `${n} WASSCE ${subject.name} questions on ${topic.name.toLowerCase()} with answers and full working${diagrams ? `, ${diagrams === 1 ? 'one with a diagram' : `${diagrams} with diagrams`}` : ''}.`,
    'Free, with why each wrong option is wrong.',
    `Question 1: ${first.length > 70 ? `${first.slice(0, first.lastIndexOf(' ', 70))}…` : first}`,
  ])
}

export const Route = createFileRoute('/wassce/$subject/$topic_/questions')({
  ssr: true, // prerendered to static HTML at build time
  loader: async ({ params }) => {
    const data = await fetchTopicQuestionsPage(params.subject, params.topic)
    if (!data) throw notFound()
    return data
  },
  head: ({ loaderData: data }) => {
    if (!data) return privatePageTags('Page not found')
    const path = questionsPath(data.subject.slug, data.topic.slug)
    const name = `${data.topic.name}: WASSCE ${data.subject.name} questions and answers`
    return indexablePageTags({
      path,
      title: brandedTitle(`WASSCE ${data.subject.name}: ${data.topic.name} Questions and Answers`),
      ogTitle: name,
      description: describe(data),
      image: data.questions.find((q) => q.image_url)?.image_url ?? undefined,
      jsonLd: [
        quizJsonLd({
          name,
          path,
          about: data.topic.name,
          subject: `WASSCE ${data.subject.name}`,
          questions: data.questions.map((q) => ({
            text: plain(q.stem),
            image: q.image_url,
            explanation: q.explanation ? plain(q.explanation) : undefined,
            options: q.options.map((o) => ({ label: o.label, text: plain(o.content), correct: o.is_correct })),
          })),
        }),
        breadcrumbJsonLd(trail(data)),
      ],
    })
  },
  component: TopicQuestionsPage,
})

function TopicQuestionsPage() {
  const data = Route.useLoaderData()
  const { subject, topic, questions, previousQuestions, nextQuestions } = data
  const { palette } = subjectTheme(subject.slug)
  const diagrams = questions.filter((q) => q.image_url).length
  const firstLesson = topic.lessons[0]

  return (
    <article className="app-page site-page mx-auto w-full max-w-4xl space-y-8 pb-12">
      <header className="space-y-4 pt-2">
        <Breadcrumbs trail={trail(data)} />
        <p className={`flex items-center gap-2 text-sm font-semibold ${palette.text}`}>
          <SubjectIcon slug={subject.slug} size="sm" /> WASSCE {subject.name} · {topic.name}
        </p>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl">{topic.name}: WASSCE questions and answers</h1>
        <p className="max-w-3xl text-[17px] leading-relaxed text-muted-foreground">
          {questions.length} WASSCE-style objective questions on {topic.name.toLowerCase()}
          {diagrams > 0 ? `, ${diagrams === 1 ? 'one with a diagram' : `${diagrams} with diagrams`}` : ''}. Try each one, then open the answer: you get the
          full working and the reason every other option is wrong. Free, with no account needed.
        </p>
        <div className="flex flex-wrap gap-3">
          {firstLesson && (
            <a href={lessonPath(subject.slug, topic.slug, firstLesson.slug)} className="site-btn site-btn-secondary">
              <BookOpen className="h-4 w-4" aria-hidden /> Revise the lessons first
            </a>
          )}
          <a href={questionsPath(subject.slug)} className="site-btn site-btn-secondary">All {subject.name} questions</a>
        </div>
        <p className="rounded-xl border bg-muted/40 p-3 text-sm text-muted-foreground">
          Original questions written by WASSCE Tutor to match the WASSCE syllabus and the exam&rsquo;s objective format. They are not WAEC past
          papers.
        </p>
      </header>

      {questions.length > 6 && (
        <nav aria-label="Jump to a question" className="flex flex-wrap gap-2">
          {questions.map((q, i) => (
            <a key={q.id} href={`#q${i + 1}`} className="flex h-10 min-w-10 items-center justify-center rounded-lg border bg-card px-2 text-sm font-semibold tabular-nums hover:border-primary hover:text-primary">
              {i + 1}
            </a>
          ))}
        </nav>
      )}

      <ol className="space-y-5">
        {questions.map((q, i) => (
          <QuestionCard key={q.id} q={q} n={i + 1} topic={topic.name} />
        ))}
      </ol>

      {(previousQuestions || nextQuestions) && (
        <nav aria-label={`More ${subject.name} questions`} className="grid gap-3 sm:grid-cols-2">
          {previousQuestions ? (
            <a href={questionsPath(subject.slug, previousQuestions.slug)} className="group rounded-xl border p-4 transition-colors hover:border-primary/50 hover:bg-muted/40">
              <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground"><ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Previous topic</span>
              <span className="mt-1 block font-semibold leading-snug group-hover:text-primary">{previousQuestions.name} questions</span>
            </a>
          ) : (
            <span className="hidden sm:block" />
          )}
          {nextQuestions && (
            <a href={questionsPath(subject.slug, nextQuestions.slug)} className="group rounded-xl border p-4 text-right transition-colors hover:border-primary/50 hover:bg-muted/40">
              <span className="flex items-center justify-end gap-1 text-xs font-semibold text-muted-foreground">Next topic <ArrowRight className="h-3.5 w-3.5" aria-hidden /></span>
              <span className="mt-1 block font-semibold leading-snug group-hover:text-primary">{nextQuestions.name} questions</span>
            </a>
          )}
        </nav>
      )}

      {topic.lessons.length > 0 && (
        <section className="space-y-3" aria-labelledby="revise">
          <h2 id="revise" className="text-xl font-bold">Revise {topic.name.toLowerCase()}</h2>
          <ol className="divide-y rounded-xl border">
            {topic.lessons.map((l, i) => (
              <li key={l.id}>
                <a href={lessonPath(subject.slug, topic.slug, l.slug)} className="flex items-center gap-3 p-3 text-sm hover:bg-muted/40">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${palette.soft} ${palette.text}`}>{i + 1}</span>
                  <span className="min-w-0 flex-1 font-medium text-primary hover:underline">{l.title}</span>
                  {l.est_minutes ? <span className="shrink-0 text-xs text-muted-foreground">{l.est_minutes} min</span> : null}
                </a>
              </li>
            ))}
          </ol>
        </section>
      )}

      <WaecPastPapers subjectSlug={subject.slug} subjectName={subject.name} />

      <StartCta
        heading={`Practise ${topic.name.toLowerCase()} with marking`}
        body={`In the app these questions are marked as you go and your scores are saved, so you can see which topics need another look. Every lesson and practice set is free; a plan adds the AI study tutor and timed mock exams.`}
        appHref={`/topic/${topic.id}`}
      />
    </article>
  )
}

function QuestionCard({ q, n, topic }: { q: PublicQuestion; n: number; topic: string }) {
  const correct = q.options.find((o) => o.is_correct)
  return (
    <li id={`q${n}`} className="site-card scroll-mt-24 p-5 sm:p-6">
      <h2 className="text-xs font-bold uppercase tracking-[.14em] text-muted-foreground">Question {n}</h2>
      <QuestionMarkdown content={q.stem} className="question-md mt-2 text-[17px] leading-relaxed" />
      {q.image_url && <ZoomableImage src={q.image_url} alt={diagramAlt(q, n, topic)} {...diagramSize(q.image_url)} />}
      <ol className="mt-4 grid gap-2" aria-label={`Options for question ${n}`}>
        {q.options.map((o) => (
          <li key={o.label} className="flex items-start gap-3 rounded-xl border bg-card px-3 py-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold">{o.label}</span>
            <QuestionMarkdown content={o.content} className="question-md min-w-0 flex-1 pt-0.5" />
          </li>
        ))}
      </ol>
      <details className="group mt-4 rounded-xl border border-primary/20 bg-brand-soft/40">
        <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 px-4 py-3 font-semibold text-primary [&::-webkit-details-marker]:hidden">
          <Lightbulb className="h-4 w-4" aria-hidden /> <span className="group-open:hidden">Show the answer and working</span>
          <span className="hidden group-open:inline">Hide the answer</span>
        </summary>
        <div className="space-y-3 border-t border-primary/15 px-4 pb-4 pt-3">
          {correct && (
            <div className="flex items-start gap-2 font-semibold text-success">
              <CircleCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
              <span>
                Answer: {correct.label}
                <span className="sr-only">.</span>
              </span>
              <QuestionMarkdown content={correct.content} className="question-md min-w-0 font-semibold" />
            </div>
          )}
          {q.explanation && <QuestionMarkdown content={q.explanation} className="question-md leading-relaxed" />}
        </div>
      </details>
    </li>
  )
}
