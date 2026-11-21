// Centralized lazy-loaded markdown renderer.
// react-markdown + remark-math + rehype-katex + katex CSS are only fetched
// the first time MarkdownView mounts on any page.
import { lazy, Suspense, useEffect, useState } from 'react'
import type { Components } from 'react-markdown'
import { MdTable } from './MdTable'

const ReactMarkdown = lazy(() => import('react-markdown'))

type Plugins = {
  remark: typeof import('remark-math').default
  gfm: typeof import('remark-gfm').default
  rehype: typeof import('rehype-katex').default
}
let plugins: Plugins | null = null

const COMPONENTS: Components = { table: (props) => <MdTable className="not-prose my-3" {...props} /> }
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
          components={COMPONENTS}
        >
          {content}
        </ReactMarkdown>
      </div>
    </Suspense>
  )
}
