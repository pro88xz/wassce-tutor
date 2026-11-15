// Visual callout boxes for lessons.
// Each variant has its own colour, icon, and label to make different
// types of pedagogical content visually distinct from body prose.

import type { ReactNode } from 'react'

type CalloutType =
  | 'definition'
  | 'worked-example'
  | 'waec-tests'
  | 'common-mistake'
  | 'local-example'
  | 'tip'

const VARIANTS: Record<
  CalloutType,
  {
    label: string
    icon: string
    border: string
    bg: string
    accent: string
  }
> = {
  definition: {
    label: 'Definition',
    icon: '📘',
    border: 'border-blue-400 dark:border-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    accent: 'text-blue-700 dark:text-blue-300',
  },
  'worked-example': {
    label: 'Worked example',
    icon: '✏️',
    border: 'border-amber-400 dark:border-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    accent: 'text-amber-700 dark:text-amber-300',
  },
  'waec-tests': {
    label: 'WAEC tests this',
    icon: '🎯',
    border: 'border-purple-400 dark:border-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    accent: 'text-purple-700 dark:text-purple-300',
  },
  'common-mistake': {
    label: 'Common mistake',
    icon: '⚠️',
    border: 'border-red-400 dark:border-red-500',
    bg: 'bg-red-50 dark:bg-red-950/40',
    accent: 'text-red-700 dark:text-red-300',
  },
  'local-example': {
    label: 'In Sierra Leone',
    icon: '🌍',
    border: 'border-emerald-400 dark:border-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    accent: 'text-emerald-700 dark:text-emerald-300',
  },
  tip: {
    label: 'Exam tip',
    icon: '💡',
    border: 'border-sky-400 dark:border-sky-500',
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    accent: 'text-sky-700 dark:text-sky-300',
  },
}

export function Callout({
  type = 'definition',
  title,
  children,
}: {
  type?: CalloutType
  title?: string
  children: ReactNode
}) {
  const v = VARIANTS[type] ?? VARIANTS.definition
  return (
    <div
      className={`my-5 rounded-xl border-l-4 ${v.border} ${v.bg} p-4 pl-5 not-prose`}
    >
      <div
        className={`mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide ${v.accent}`}
      >
        <span aria-hidden>{v.icon}</span>
        <span>{title ?? v.label}</span>
      </div>
      <div className="max-w-none text-sm leading-relaxed text-foreground [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_li]:my-0.5 [&_li]:pl-0.5 [&_p]:my-2 [&_strong]:font-semibold [&_strong]:text-foreground [&_code]:rounded [&_code]:bg-black/5 [&_code]:px-1">
        {children}
      </div>
    </div>
  )
}
