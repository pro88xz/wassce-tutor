// LessonView — Markdown renderer for lesson content with biology directives.
// Supports :::callout{type=...} and :::diagram{name=...} blocks
// alongside standard Markdown + KaTeX math.
//
// Used by lesson pages and the admin preview pane.
// MarkdownView (sibling) stays simpler for tutor/papers/question previews.

import { lazy, Suspense, useEffect, useState } from 'react'
import { Callout } from './lesson/Callout'
import { Diagram } from './lesson/Diagram'

const ReactMarkdown = lazy(() => import('react-markdown'))

let plugins: {
  remarkMath: any
  rehypeKatex: any
  remarkDirective: any
} | null = null

async function loadPlugins() {
  if (plugins) return plugins
  const [rm, rk, rd] = await Promise.all([
    import('remark-math'),
    import('rehype-katex'),
    import('remark-directive'),
  ])
  plugins = {
    remarkMath: rm.default,
    rehypeKatex: rk.default,
    remarkDirective: rd.default,
  }
  return plugins
}

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

export function LessonView({ content }: { content: string }) {
  const [ready, setReady] = useState(plugins !== null)
  useEffect(() => {
    if (!ready) {
      loadPlugins().then(() => setReady(true))
    }
  }, [ready])

  if (!ready) {
    return <p className="whitespace-pre-wrap text-sm">{content}</p>
  }

  return (
    <Suspense fallback={<p className="whitespace-pre-wrap text-sm">{content}</p>}>
      <ReactMarkdown
        remarkPlugins={[plugins!.remarkMath, plugins!.remarkDirective, directiveTransformer]}
        rehypePlugins={[plugins!.rehypeKatex]}
        components={{
          // Map our custom directive elements to React components.
          // react-markdown passes attribute props as lowercase HTML-style props.
          callout: ({ type, title, children }: any) => (
            <Callout type={type} title={title}>
              {children}
            </Callout>
          ),
          diagram: ({ name }: any) => <Diagram name={name} />,
        } as any}
      >
        {content}
      </ReactMarkdown>
    </Suspense>
  )
}
