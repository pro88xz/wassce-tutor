// The Markdown and maths renderer behind QuestionMarkdown: react-markdown,
// remark-math and rehype-katex. A module of its own so a page loaded from the
// build, which keeps the build's HTML, never downloads it (QuestionMarkdown).
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { MdTable } from './MdTable'
import { MarkdownLink } from './AudioChip'

const REMARK = [[remarkGfm, { singleTilde: false }], remarkMath] as const
// strict: 'ignore': a dash typed inside a formula renders fine; KaTeX only warns about it.
const REHYPE = [[rehypeKatex, { strict: 'ignore' }]] as const
// Links to a clip under /audio/ become play buttons (AudioChip).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COMPONENTS = { table: (props: any) => <MdTable className="not-prose my-3" {...props} />, a: MarkdownLink }
// Inline: paragraphs become block spans, so the markup is valid inside a button (an answer option).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const INLINE_COMPONENTS = { ...COMPONENTS, p: ({ children }: any) => <span className="block">{children}</span> }

export default function QuestionMarkdownBody({ content, inline = false }: { content: string; inline?: boolean }) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <ReactMarkdown remarkPlugins={REMARK as any} rehypePlugins={REHYPE as any} components={inline ? INLINE_COMPONENTS : COMPONENTS}>
      {content}
    </ReactMarkdown>
  )
}
