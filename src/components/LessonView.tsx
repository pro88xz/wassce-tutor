// LessonView — Markdown renderer for lesson content with biology directives.
// Supports :::callout{type=...} and :::diagram{name=...} blocks
// alongside standard Markdown + KaTeX math.
//
// Used by lesson pages and the admin preview pane.
// MarkdownView (sibling) stays simpler for tutor/papers/question previews.
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import remarkDirective from 'remark-directive'
import { Callout } from './lesson/Callout'
import { Diagram } from './lesson/Diagram'
import { MdTable } from './MdTable'

// Custom remark plugin: rewrite directive nodes to use HTML element names
// that react-markdown can map via the `components` prop.
//
// :::callout{type=definition} ... :::  becomes  <callout type="definition">...</callout>
// :::diagram{name=animal-cell}         becomes  <diagram name="animal-cell" />
function directiveTransformer() {
  return (tree: any) => {
    walk(tree)
  }
  function walk(node: any) {
    if (
      node.type === 'containerDirective' ||
      node.type === 'leafDirective' ||
      node.type === 'textDirective'
    ) {
      const data = node.data || (node.data = {})
      data.hName = node.name
      data.hProperties = node.attributes
    }
    if (node.children) {
      for (const child of node.children) walk(child)
    }
  }
}

// Some lessons write display maths as \[ ... \] and inline maths as \( ... \)
// (LaTeX style). remark-math only reads $$ ... $$ and $ ... $, so convert first;
// otherwise the formula shows as raw text.
const DISPLAY_MATH = /\\\[([\s\S]+?)\\\]/g
const INLINE_MATH = /\\\(([\s\S]+?)\\\)/g
export function normalizeMath(md: string): string {
  return md
    .replace(DISPLAY_MATH, (_m, tex: string) => ['', '$$', tex.trim(), '$$', ''].join('\n'))
    .replace(INLINE_MATH, (_m, tex: string) => '$' + tex.trim() + '$')
}

export function LessonView({ content }: { content: string }) {
  return (
    <ReactMarkdown
      // GFM: tables (and task lists, autolinks). singleTilde off, so "~5 min" never strikes text through.
      remarkPlugins={[[remarkGfm, { singleTilde: false }], remarkMath, remarkDirective, directiveTransformer]}
      rehypePlugins={[rehypeKatex]}
      components={{
        // Map our custom directive elements to React components.
        // react-markdown passes attribute props as lowercase HTML-style props.
        callout: ({ type, title, children }: any) => (
          <Callout type={type} title={title}>
            {children}
          </Callout>
        ),
        diagram: ({ name }: any) => <Diagram name={name} />,
        // Wide tables scroll sideways on phones; short-cell tables fit the screen.
        table: MdTable,
        // Diagrams sit on a white card, so line drawings stay readable in dark mode.
        img: ({ node: _node, src, alt }: any) => (
          <img
            src={src}
            alt={alt ?? ''}
            loading="lazy"
            decoding="async"
            className="not-prose mx-auto my-5 block h-auto max-h-[32rem] w-full max-w-2xl rounded-xl border bg-white object-contain p-1.5"
          />
        ),
      } as any}
    >
      {normalizeMath(content)}
    </ReactMarkdown>
  )
}
