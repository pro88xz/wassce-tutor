// Lesson blocks for writing skills (English Language first): a model answer
// set out like an examination script, right-aligned lines inside it (the
// writer's address and date in a letter), numbered markers that label the
// parts of a model, and "try it" tasks whose answer stays hidden until the
// student has had a go. Written in lessons as:
//
//   ::::model{title="A formal letter to the council"}
//   :::right
//   Government Secondary School,\
//   Bo.
//   :::
//   :mark[Dear Sir,]{n=4}
//   ::::
//
//   :::reveal{title="Try it: rewrite the close"}
//   The answer, shown when the student opens it.
//   :::
import type { ReactNode } from 'react'

/** A model answer on a sheet of paper: what a good examination script looks like. */
export function ModelAnswer({ title, label, children }: { title?: string; label?: string; children: ReactNode }) {
  return (
    <figure className="not-prose my-7 overflow-hidden rounded-2xl border border-stone-300 bg-[#fffdf6] shadow-[0_1px_0_rgba(0,0,0,.04),0_12px_32px_-18px_rgba(60,40,10,.35)]">
      <figcaption className="flex flex-wrap items-center gap-x-2 gap-y-0.5 border-b border-stone-200 bg-stone-100/80 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-stone-600 sm:px-6">
        <span aria-hidden>📝</span>
        <span>{label ?? 'Model answer'}</span>
        {title && <span className="font-semibold normal-case tracking-normal text-stone-800">· {title}</span>}
      </figcaption>
      <div className="model-sheet px-5 py-5 font-serif text-[15.5px] leading-7 text-stone-900 sm:px-8 sm:py-7 [&_h3]:mb-2 [&_h3]:mt-0 [&_h3]:font-sans [&_h3]:text-base [&_h3]:font-bold [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-3 [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-6">
        {children}
      </div>
    </figure>
  )
}

/** Right-aligned lines in a model answer (a letter's address and date, a complimentary close). */
export function RightAligned({ children }: { children: ReactNode }) {
  return <div className="ml-auto w-fit max-w-full text-left [&_p]:my-0">{children}</div>
}

/** A numbered marker on part of a model answer; the lesson explains each number underneath. */
export function Marked({ n, children }: { n?: string; children: ReactNode }) {
  return (
    <mark className="rounded bg-amber-100 px-0.5 text-inherit [box-decoration-break:clone]">
      {children}
      {n && (
        <sup className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 font-sans text-[10px] font-bold not-italic leading-none text-white">
          {n}
        </sup>
      )}
    </mark>
  )
}

/** A task to try first, with the answer folded away until the student opens it. */
export function Reveal({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <details className="not-prose group my-5 overflow-hidden rounded-xl border border-teal-300 bg-teal-50/60 dark:border-teal-700 dark:bg-teal-950/30">
      <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-semibold text-teal-900 marker:hidden dark:text-teal-200 [&::-webkit-details-marker]:hidden">
        <span aria-hidden className="transition-transform group-open:rotate-90">▶</span>
        <span>{title ?? 'Show the answer'}</span>
        <span className="ml-auto text-xs font-normal text-teal-700 group-open:hidden dark:text-teal-300">Try first, then tap to check</span>
      </summary>
      <div className="max-w-none border-t border-teal-200 bg-white px-4 py-3 text-sm leading-relaxed text-foreground dark:border-teal-800 dark:bg-transparent [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_li]:my-0.5 [&_li]:pl-0.5 [&_p]:my-2 [&_strong]:font-semibold [&_strong]:text-foreground [&_code]:rounded [&_code]:bg-black/5 [&_code]:px-1">
        {children}
      </div>
    </details>
  )
}
