// What the teacher says in the video, in the page itself: read by search
// engines and by students who cannot play sound. Grouped by the video's
// chapters, each with its time.
import { FileText } from 'lucide-react'
import { clock } from '@/lib/lesson-video'
import type { LessonVideo } from '@/lib/lesson-video'

export function VideoTranscript({ video }: { video: LessonVideo }) {
  if (!video.transcript.length) return null
  const starts = video.chapters.length ? video.chapters : [{ name: video.title, start: 0 }]
  const parts = starts.map((c, i) => {
    const end = starts[i + 1]?.start ?? Infinity
    return { ...c, text: video.transcript.filter((cue) => cue.start >= c.start - 0.05 && cue.start < end - 0.05).map((cue) => cue.text).join(' ') }
  }).filter((p) => p.text)
  return (
    <details className="group rounded-xl border bg-muted/30 px-4 py-3 text-sm">
      <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold">
        <FileText className="h-4 w-4 text-muted-foreground" aria-hidden /> Read the video transcript
        <span className="ml-auto text-xs font-normal text-muted-foreground group-open:hidden">Show</span>
      </summary>
      <div className="mt-3 space-y-3 leading-relaxed">
        {parts.map((p) => (
          <p key={p.start}>
            <span className="mr-1.5 font-semibold">{p.name}</span>
            <span className="mr-1.5 text-xs tabular-nums text-muted-foreground">{clock(p.start)}</span>
            {p.text}
          </p>
        ))}
      </div>
    </details>
  )
}
