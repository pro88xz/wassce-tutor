// Centralized lazy-loaded markdown renderer.
// react-markdown + remark-math + rehype-katex + katex CSS are only fetched
// the first time MarkdownView mounts on any page.
import { lazy, Suspense, useEffect, useState } from 'react'

const ReactMarkdown = lazy(() => import('react-markdown'))

let plugins: { remark: any; gfm: any; rehype: any } | null = null
async function loadPlugins() {
  if (plugins) return plugins
  const [rm, rk, gfm] = await Promise.all([
    import('remark-math'),
    import('rehype-katex'),
    import('remark-gfm'),
    import('katex/dist/katex.min.css'),
  ])
  plugins = { remark: rm.default, gfm: gfm.default, rehype: rk.default }
  return plugins
}

export function MarkdownView({ content, className }: { content: string; className?: string }) {
  const [ready, setReady] = useState(plugins !== null)
  useEffect(() => {
    if (!ready) {
      loadPlugins().then(() => setReady(true))
    }
  }, [ready])

  if (!ready) {
    return <p className={className ?? 'whitespace-pre-wrap text-sm'}>{content}</p>
  }

  return (
    <Suspense fallback={<p className={className ?? 'whitespace-pre-wrap text-sm'}>{content}</p>}>
      <div className={className}>
        <ReactMarkdown
          remarkPlugins={[[plugins!.gfm, { singleTilde: false }], plugins!.remark]}
          rehypePlugins={[plugins!.rehype]}
          components={{ table: ({ node: _node, ...props }: any) => <div className="not-prose my-3 overflow-x-auto rounded-xl border"><table className="md-table" {...props} /></div> } as any}
        >
          {content}
        </ReactMarkdown>
      </div>
    </Suspense>
  )
}
