import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { useLesson } from '@/lib/queries'

export const Route = createFileRoute('/lesson/$lessonId')({
  component: LessonPage,
})

function LessonPage() {
  const { lessonId } = useParams({ from: '/lesson/$lessonId' })
  const { data: lesson, isLoading } = useLesson(lessonId)

  if (isLoading) return <p className="text-muted-foreground">Loading lesson…</p>
  if (!lesson) return <p className="text-muted-foreground">Lesson not found.</p>

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-12">
      <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back
      </Link>

      <header className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Lesson</p>
        <h1 className="text-3xl font-black tracking-tight">{lesson.title}</h1>
        {lesson.est_minutes && (
          <p className="text-xs text-muted-foreground">{lesson.est_minutes} min read</p>
        )}
      </header>

      <article className="prose prose-slate dark:prose-invert max-w-none
        prose-headings:font-bold prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3
        prose-p:leading-relaxed prose-li:my-1
        prose-strong:text-foreground prose-code:text-foreground">
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{lesson.content}</ReactMarkdown>
      </article>
    </div>
  )
}
