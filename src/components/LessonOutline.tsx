import type { ReactNode } from 'react'
import { describeTotals } from '@/lib/lesson-outlines'
import type { LessonOutline } from '@/lib/lesson-outlines'

/**
 * What a lesson covers, under its row on a topic page: the sections in order,
 * then how many worked examples and diagrams it has. `link` wraps a section in
 * a link to that heading; without it (a locked lesson) the list is plain text.
 */
export function LessonOutlineList({
  outline,
  link,
  className = '',
}: {
  outline: LessonOutline
  link?: (n: number, children: ReactNode) => ReactNode
  className?: string
}) {
  const extras = describeTotals({ sections: 0, worked: outline.w, figures: outline.f }, false)
  if (outline.s.length === 0 && extras.length === 0) return null
  return (
    <div className={`space-y-1.5 ${className}`}>
      {outline.s.length > 0 && (
        <ul className="space-y-0.5 border-l-2 border-border pl-3" aria-label="In this lesson">
          {outline.s.map(([n, title]) => {
            const body = <span className="line-clamp-2">{title}</span>
            return (
              <li key={n} className="text-[15px] leading-snug text-foreground/80">
                {link ? link(n, body) : <span className="block py-1">{body}</span>}
              </li>
            )
          })}
        </ul>
      )}
      {extras.length > 0 && <p className="pl-3.5 text-xs font-medium text-muted-foreground">{extras.join(' · ')}</p>}
    </div>
  )
}

/** Class for a section link inside LessonOutlineList (tap target at least 32px tall). */
export const outlineLinkClass = 'block rounded-md py-1.5 transition-colors hover:text-primary focus-visible:text-primary'
