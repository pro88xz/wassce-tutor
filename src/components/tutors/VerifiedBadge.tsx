import { BadgeCheck } from 'lucide-react'

/** The blue tick shown beside every tutor's name in the marketplace. */
export function VerifiedBadge({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <span className="inline-flex shrink-0" title="Tutor on WASSCE Tutor">
      <BadgeCheck className={`${className} fill-[#1d9bf0] text-white`} aria-hidden />
      <span className="sr-only">Tutor on WASSCE Tutor</span>
    </span>
  )
}
