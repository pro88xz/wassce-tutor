// LessonView — Markdown renderer for lesson content with biology directives.
// Supports :::callout{type=...} and :::diagram{name=...} blocks
// alongside standard Markdown + KaTeX math.
//
// Used by lesson pages and the admin preview pane.
// MarkdownView (sibling) stays simpler for tutor/papers/question previews.
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkDirective from 'remark-directive'
import { Callout } from './lesson/Callout'
import { Diagram } from './lesson/Diagram'

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
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath, remarkDirective, directiveTransformer]}
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
      } as any}
    >
      {content}
    </ReactMarkdown>
  )
}
