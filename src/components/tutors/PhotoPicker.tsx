// A tutor's profile photo: pick one and see it straight away, before anything
// is uploaded, already made smaller for mobile data (src/lib/photo.ts). Used by
// the tutor application and the tutor dashboard.
import { useEffect, useMemo, useRef, useState } from 'react'
import { Camera, UserRound } from 'lucide-react'
import { PHOTO_MAX_ORIGINAL, PHOTO_TYPES, photoProblem, shrinkPhoto } from '@/lib/photo'

export function PhotoPicker({
  file,
  currentUrl,
  onPick,
  error,
  required = false,
}: {
  file: File | null
  /** The photo already saved, shown until a new one is picked. */
  currentUrl?: string | null
  onPick: (file: File | null, problem: string | null) => void
  error?: string | null
  required?: boolean
}) {
  const input = useRef<HTMLInputElement>(null)
  const [preparing, setPreparing] = useState(false)
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])
  const shown = preview ?? currentUrl ?? null

  const pick = async (picked: File) => {
    if (!PHOTO_TYPES.includes(picked.type)) return onPick(null, 'Choose a JPG, PNG or WebP photo.')
    if (picked.size > PHOTO_MAX_ORIGINAL) return onPick(null, 'That photo is too large. Choose one under 25 MB.')
    setPreparing(true)
    const small = await shrinkPhoto(picked)
    setPreparing(false)
    const problem = photoProblem(small)
    onPick(problem ? null : small, problem)
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-dashed p-4 sm:flex-row sm:items-center">
      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-violet-100">
        {shown ? (
          <img src={shown} alt="Your profile photo" className="h-full w-full object-cover object-top" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-violet-700"><UserRound className="h-10 w-10" aria-hidden /></span>
        )}
      </div>
      <div className="min-w-0 flex-1 text-sm">
        <p className="font-semibold">
          Profile photo{required && <span className="text-danger"> *</span>}
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          A clear, friendly photo of your face, in good light. Students choose tutors by their photo. JPG, PNG or WebP, straight from your phone camera is fine.
        </p>
        <button type="button" disabled={preparing} onClick={() => input.current?.click()} className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl border bg-card px-4 text-sm font-semibold hover:border-primary/50 disabled:opacity-60">
          <Camera className="h-4 w-4" aria-hidden /> {preparing ? 'Preparing photo…' : shown ? 'Change photo' : 'Choose photo'}
        </button>
        {file && !error && <p className="mt-2 truncate text-xs text-muted-foreground">Ready · {Math.max(1, Math.round(file.size / 1024))} KB</p>}
        {error && <p role="alert" className="mt-2 text-xs font-semibold text-danger">{error}</p>}
        <input
          ref={input}
          type="file"
          accept={PHOTO_TYPES.join(',')}
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={(e) => {
            const picked = e.target.files?.[0] ?? null
            e.target.value = '' // picking the same file again still triggers a change
            if (picked) void pick(picked)
          }}
        />
      </div>
    </div>
  )
}
