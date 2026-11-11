import { ExternalLink, FileText } from 'lucide-react'
import { waecPastPapersUrl } from '@/lib/waec'

/** A link to the subject's official past papers on WAEC's e-Learning site. */
export function WaecPastPapers({ subjectSlug, subjectName, className = '' }: { subjectSlug?: string | null; subjectName?: string; className?: string }) {
  const url = waecPastPapersUrl(subjectSlug)
  if (!url) return null
  return (
    <aside className={`flex items-start gap-3 rounded-2xl border bg-card p-4 ${className}`} aria-label="Official WAEC past papers">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300" aria-hidden>
        <FileText className="h-5 w-5" />
      </span>
      <div className="min-w-0 space-y-1">
        <p className="font-semibold">Real WAEC past papers</p>
        <p className="text-sm text-muted-foreground">
          Past WASSCE {subjectName ?? ''} papers with the Chief Examiner&rsquo;s comments on what candidates got right and wrong, on WAEC&rsquo;s official e-Learning site.
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          Open WAEC past papers <ExternalLink className="h-4 w-4" aria-hidden />
          <span className="sr-only">(opens WAEC&rsquo;s website in a new tab)</span>
        </a>
      </div>
    </aside>
  )
}
