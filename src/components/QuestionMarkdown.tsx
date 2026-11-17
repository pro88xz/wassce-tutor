// Markdown with maths for practice questions on public pages: the stem, each
// option and the worked solution. Rendered synchronously (unlike the lazy
// MarkdownView), so the prerendered HTML Google reads has real formulas and
// not raw $...$ text. The same plugins as the app's question screen, without
// LessonView's lesson directives and per-instance listeners (a questions page
// renders dozens of these).
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { MdTable } from './MdTable'

const REMARK = [[remarkGfm, { singleTilde: false }], remarkMath] as const
// strict: 'ignore': a dash typed inside a formula renders fine; KaTeX only warns about it.
const REHYPE = [[rehypeKatex, { strict: 'ignore' }]] as const
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COMPONENTS = { table: (props: any) => <MdTable className="not-prose my-3" {...props} /> }

export function QuestionMarkdown({ content, className }: { content: string; className?: string }) {
  return (
    <div className={className}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <ReactMarkdown remarkPlugins={REMARK as any} rehypePlugins={REHYPE as any} components={COMPONENTS}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
