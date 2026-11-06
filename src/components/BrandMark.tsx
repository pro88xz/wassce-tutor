import { GraduationCap } from 'lucide-react'

/** The WASSCE Tutor signature: purple mark plus wordmark, the same in every header. */
export function BrandMark({ compact = false, wordmarkClassName = '' }: { compact?: boolean; wordmarkClassName?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <GraduationCap className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
      </span>
      <span className={`whitespace-nowrap font-bold tracking-tight ${compact ? 'text-[15px]' : 'text-base'} ${wordmarkClassName}`}>WASSCE Tutor</span>
    </span>
  )
}
