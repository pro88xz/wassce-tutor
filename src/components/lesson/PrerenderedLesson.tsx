// A lesson on a public page (/wassce/{subject}/{topic}/{lesson}).
//
// The build already rendered the lesson to HTML (Markdown, KaTeX, diagrams).
// Rendering it again in the browser only to hydrate it took about 2 seconds
// of a mid-range phone's main thread on a maths lesson (10,000 elements),
// during which taps went unanswered (Lighthouse: total blocking time 3.5 s).
// So on a page loaded from the build, this keeps the build's HTML as it is
// and adds back the things in a lesson that need JavaScript: tapping a
// diagram to enlarge it (Zoomable marks each one with data-zoom-label), and
// tapping a word to hear it (AudioChip marks each play button with data-src).
// "Try it" answers are <details> and work without JavaScript.
//
// Reached any other way (no HTML for it on the page), it renders LessonView,
// which the browser then loads: a page loaded from the build never needs it,
// and it carries the Markdown and maths renderer (about 150 KB compressed).
import { lazy, Suspense, useEffect, useRef, useState, type ComponentType } from 'react'
// The kept HTML needs KaTeX's styles as much as LessonView does.
import 'katex/dist/katex.min.css'
import { ZoomDialog } from '@/components/lesson/Zoomable'
import { fitLongMath } from '@/lib/math-split'
import { onClipChange, playingClip, toggleClip } from '@/lib/audio-player'

// The server renders every lesson, so it has LessonView from the start; in the
// browser it is loaded the first time a lesson has no HTML to keep.
const LessonView: ComponentType<{ content: string }> = import.meta.env.SSR
  ? (await import('@/components/LessonView')).LessonView
  : lazy(() => import('@/components/LessonView').then((m) => ({ default: m.LessonView })))

export function PrerenderedLesson({ id, content, className }: { id: string; content: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  // The build's HTML for this lesson, read once, on the first render in the
  // browser (before hydration has changed anything). null on the server and
  // when the page was not loaded from the build.
  const [html] = useState<string | null>(() => (typeof document === 'undefined' ? null : (document.getElementById(id)?.innerHTML ?? null)))
  const [zoom, setZoom] = useState<{ label: string; html: string } | null>(null)

  useEffect(() => {
    const root = ref.current
    if (html === null || !root) return
    // What LessonView does after rendering: show the stacked form of long equations that would not fit.
    const fit = () => fitLongMath(root)
    fit()
    document.fonts?.ready.then(fit).catch(() => {})
    window.addEventListener('resize', fit)
    // Tap a diagram (or its Enlarge button) to open it full screen, as Zoomable does.
    const onClick = (e: MouseEvent) => {
      const chip = (e.target as Element | null)?.closest<HTMLElement>('.audio-chip[data-src]')
      if (chip?.dataset.src && root.contains(chip)) {
        toggleClip(chip.dataset.src)
        return
      }
      const wrap = (e.target as Element | null)?.closest<HTMLElement>('[data-zoom-label]')
      if (!wrap || !root.contains(wrap)) return
      const picture = wrap.querySelector<HTMLElement>('img, [role="img"]')
      if (!picture) return
      const large = picture.cloneNode(true) as HTMLElement
      if (large.tagName === 'IMG') {
        large.removeAttribute('loading')
        large.className = 'block h-auto w-full rounded-xl bg-white'
      } else {
        large.removeAttribute('class')
      }
      setZoom({ label: wrap.dataset.zoomLabel || 'Lesson diagram', html: large.outerHTML })
    }
    root.addEventListener('click', onClick)
    // Show which word is playing, as AudioChip does.
    const stopWatching = onClipChange(() => {
      const now = playingClip()
      root.querySelectorAll<HTMLElement>('.audio-chip[data-src]').forEach((b) => {
        const on = b.dataset.src === now
        b.classList.toggle('is-playing', on)
        b.setAttribute('aria-pressed', String(on))
      })
    })
    return () => {
      window.removeEventListener('resize', fit)
      root.removeEventListener('click', onClick)
      stopWatching()
    }
  }, [html])

  if (html === null) {
    return (
      <div id={id} ref={ref} className={className}>
        <Suspense fallback={<p className="text-muted-foreground">Loading the lesson…</p>}>
          <LessonView content={content} />
        </Suspense>
      </div>
    )
  }
  return (
    <>
      <div id={id} ref={ref} className={className} dangerouslySetInnerHTML={{ __html: html }} />
      {zoom && <ZoomDialog label={zoom.label} large={<div dangerouslySetInnerHTML={{ __html: zoom.html }} />} onClose={() => setZoom(null)} />}
    </>
  )
}
