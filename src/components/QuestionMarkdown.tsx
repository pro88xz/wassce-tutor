// Markdown with maths for practice questions on public pages: the stem, each
// option and the worked solution. The build renders it (the prerendered HTML
// Google reads has real formulas, not raw $...$ text), with the same plugins
// as the app's question screen, without LessonView's lesson directives and
// per-instance listeners (a questions page renders dozens of these).
//
// On a page loaded from the build, each block keeps the build's HTML instead
// of rendering it again, as PrerenderedLesson does for lessons. Rendering every
// formula a second time only to hydrate a questions page took about 0.9 s of a
// mid-range phone's main thread (10 questions, 230 formulas), during which taps
// went unanswered, and the renderer (react-markdown, KaTeX) is about 140 KB of
// compressed JavaScript that such a page then never downloads. A block made
// again later on the same page ("Try them again") reuses the HTML its first
// copy kept. Anything else (a page reached inside the app, the app's own
// screens) loads the renderer (QuestionMarkdownBody) and renders the Markdown.
import { lazy, memo, Suspense, useEffect, useId, useRef, useState, type ComponentType } from 'react'
// The kept HTML needs KaTeX's styles as much as rendered Markdown does.
import 'katex/dist/katex.min.css'
import { onClipChange, playingClip, toggleClip } from '@/lib/audio-player'
import { plainText } from '@/lib/question-text'

type BodyProps = { content: string; inline?: boolean }

// The server renders every block, so it has the renderer from the start; in the
// browser it is loaded the first time a block has no HTML to keep.
const Body: ComponentType<BodyProps> = import.meta.env.SSR
  ? (await import('./QuestionMarkdownBody')).default
  : lazy(() => import('./QuestionMarkdownBody'))

/** HTML the build made, by block (inline or not, and its Markdown), as kept on this page. */
const keptHtml = new Map<string, string>()

// Memoised, like LessonView: re-parsing dozens of formulas on every re-render of the page costs real time on a phone.
export const QuestionMarkdown = memo(function QuestionMarkdown({ content, className, inline = false }: { content: string; className?: string; inline?: boolean }) {
  const Wrapper = inline ? 'span' : 'div'
  const wrapperClass = inline ? `block ${className ?? ''}` : className
  // The same on the server and while hydrating, so the build's element for this block can be found by it.
  const id = useId()
  const ref = useRef<HTMLElement>(null)
  const key = `${inline ? 'inline' : 'block'}:${content}`
  // The build's HTML for this block, read once, on the first render in the
  // browser (before hydration has changed anything), with the Markdown it was
  // made from. null on the server and when the page has none for it.
  const [built] = useState<{ html: string; key: string } | null>(() => {
    if (typeof document === 'undefined') return null
    const fromPage = document.getElementById(id)?.innerHTML
    if (fromPage) keptHtml.set(key, fromPage)
    const html = fromPage || keptHtml.get(key)
    return html ? { html, key } : null
  })
  const html = built && built.key === key ? built.html : null

  // Play buttons in the kept HTML (Oral English clips), wired up as PrerenderedLesson does.
  useEffect(() => {
    const root = ref.current
    if (html === null || !root?.querySelector('.audio-chip[data-src]')) return
    const onClick = (e: Event) => {
      const chip = (e.target as Element | null)?.closest<HTMLElement>('.audio-chip[data-src]')
      if (chip?.dataset.src && root.contains(chip)) toggleClip(chip.dataset.src)
    }
    root.addEventListener('click', onClick)
    const stopWatching = onClipChange(() => {
      const now = playingClip()
      root.querySelectorAll<HTMLElement>('.audio-chip[data-src]').forEach((b) => {
        const on = b.dataset.src === now
        b.classList.toggle('is-playing', on)
        b.setAttribute('aria-pressed', String(on))
      })
    })
    return () => {
      root.removeEventListener('click', onClick)
      stopWatching()
    }
  }, [html])

  if (html !== null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <Wrapper id={id} ref={ref as any} className={wrapperClass} dangerouslySetInnerHTML={{ __html: html }} />
  }
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Wrapper id={id} ref={ref as any} className={wrapperClass}>
      {/* While the renderer loads, the words and formulas as plain text. */}
      <Suspense fallback={plainText(content)}>
        <Body content={content} inline={inline} />
      </Suspense>
    </Wrapper>
  )
})
