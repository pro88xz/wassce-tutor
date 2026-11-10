import { BookOpenCheck } from 'lucide-react'

/** Distinctive WASSCE Tutor book mark and wordmark used across public navigation. */
export function BrandMark({
  compact = false,
  tone = 'dark',
  wordmarkClassName = '',
}: {
  compact?: boolean
  /** 'light' is for dark surfaces such as the footer */
  tone?: 'dark' | 'light'
  wordmarkClassName?: string
}) {
  const light = tone === 'light'
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-[.72rem] bg-gradient-to-br from-[#6d43d8] via-[#5930bd] to-[#3e218d] text-white shadow-[0_5px_14px_-5px_rgba(75,42,160,.65)] ring-1 ring-inset ring-white/25">
        <span className="absolute inset-[3px] rounded-[.52rem] border border-white/15" aria-hidden="true" />
        <BookOpenCheck className="relative h-[19px] w-[19px]" strokeWidth={2.15} aria-hidden />
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border border-white bg-[#a7f3d0]" aria-hidden="true" />
      </span>
      <span className={`whitespace-nowrap font-extrabold tracking-[-.035em] ${light ? 'text-white' : 'text-foreground'} ${compact ? 'text-[15px]' : 'text-base'} ${wordmarkClassName}`}>
        WASSCE <span className={light ? 'text-[#c4b1ff]' : 'text-primary'}>Tutor</span>
      </span>
    </span>
  )
}
