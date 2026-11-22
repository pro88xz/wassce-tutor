// /wassce/{subject}/{topic}/questions: every practice question on a topic,
// free and public (migration 22), for people searching "WASSCE questions on
// <topic>". Each question shows its options, then the answer, the full
// working and why every other option is wrong, folded under "Show the answer"
// (still in the HTML, so search engines read it). Diagrams are real <img>
// elements with sizes and descriptive alt text, so they can appear in image
// search. Prerendered at build time.
import { createFileRoute, notFound } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft, ArrowRight, BookOpen, Layers } from 'lucide-react'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import { StartCta } from '@/components/public/StartCta'
import { QuestionCard } from '@/components/public/QuestionCard'
import { QuestionScore } from '@/components/public/QuestionScore'
import { markdownWithMath, plainText as plain, splitExplanation } from '@/lib/question-text'
import { WaecPastPapers } from '@/components/WaecPastPapers'
import { fetchTopicQuestionsPage, keyTermsPath, lessonPath, questionsPath, subjectPath, topicPath } from '@/lib/public-content'
import type { PublicQuestion, TopicQuestionsPageData } from '@/lib/public-content'
import { brandedTitle, breadcrumbJsonLd, fitDescription, indexablePageTags, privatePageTags, quizJsonLd, titleSubject } from '@/lib/seo'
import type { QuizQuestion } from '@/lib/seo'
import { SubjectIcon } from '@/components/SubjectIcon'
import { subjectTheme } from '@/lib/subject-theme'

const trail = ({ subject, topic }: TopicQuestionsPageData): [string, string][] => [
  ['Home', '/'],
  ['WASSCE', '/wassce'],
  [subject.name, subjectPath(subject.slug)],
  [topic.name, topicPath(subject.slug, topic.slug)],
  ['Questions', questionsPath(subject.slug, topic.slug)],
]

/** A question for the page's Quiz markup: the working and each wrong option's reason, as the answer fold shows them. */
function quizQuestion(q: PublicQuestion): QuizQuestion {
  const wrong = q.options.filter((o) => !o.is_correct)
  const { working, reasons } = splitExplanation(q.explanation ?? '', wrong.map((o) => o.content))
  return {
    text: markdownWithMath(q.stem),
    image: q.image_url,
    explanation: working ? markdownWithMath(working) : undefined,
    options: q.options.map((o) => {
      const reason = o.is_correct ? undefined : reasons[wrong.indexOf(o)]
      return { text: markdownWithMath(o.content), correct: o.is_correct, reason: reason ? markdownWithMath(reason) : undefined }
    }),
  }
}

// Oral English questions link to audio clips (their words, or a passage read
// aloud), which the page plays: a reason to choose this page over a plain list.
const AUDIO_CLIP = /\/audio\/[\w/-]+\.mp3/
const hasAudio = ({ questions }: TopicQuestionsPageData) => questions.some((q) => AUDIO_CLIP.test(`${q.stem}\n${q.explanation ?? ''}`))

function describe(data: TopicQuestionsPageData): string {
  const { subject, topic, questions } = data
  const n = questions.length
  const diagrams = questions.filter((q) => q.image_url).length
  const first = plain(questions[0].stem)
  return fitDescription([
    `${n} WASSCE ${subject.name} questions on ${topic.name.toLowerCase()} with answers and full working${diagrams ? `, ${diagrams === 1 ? 'one with a diagram' : `${diagrams} with diagrams`}` : ''}.`,
    hasAudio(data) ? 'Hear every word in standard British English.' : '',
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
      title: brandedTitle(
        hasAudio(data)
          ? `WASSCE Oral English: ${data.topic.name} Questions with Audio`
          : `WASSCE ${titleSubject(data.subject.name)}: ${data.topic.name} Questions and Answers`,
      ),
      ogTitle: name,
      description: describe(data),
      jsonLd: [
        quizJsonLd({
          name,
          path,
          about: data.topic.name,
          subject: `WASSCE ${data.subject.name}`,
          questions: data.questions.map(quizQuestion),
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
  // Each question's result, for the running score under the list (QuestionScore).
  // "Try them again" starts a new round: the cards are made afresh.
  const [results, setResults] = useState<(boolean | null)[]>(() => questions.map(() => null))
  const [round, setRound] = useState(0)
  const answer = (i: number) => (right: boolean | null) => setResults((r) => r.map((v, j) => (j === i ? right : v)))
  const retry = () => {
    setResults(questions.map(() => null))
    setRound((n) => n + 1)
    document.getElementById('q1')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

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
          {data.keyTermCount > 0 && (
            <a href={keyTermsPath(subject.slug, topic.slug)} className="site-btn site-btn-secondary">
              <Layers className="h-4 w-4" aria-hidden /> {data.keyTermCount} key terms
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
          <QuestionCard key={`${q.id}-${round}`} q={q} n={i + 1} topic={topic.name} onAnswer={answer(i)} />
        ))}
      </ol>

      <QuestionScore
        results={results}
        onRetry={retry}
        revise={firstLesson ? { href: lessonPath(subject.slug, topic.slug, firstLesson.slug), label: `Revise ${topic.name}` } : undefined}
        next={nextQuestions ? { href: questionsPath(subject.slug, nextQuestions.slug), label: `Next: ${nextQuestions.name} questions` } : undefined}
      />

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
