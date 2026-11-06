import { useEffect, useState } from 'react'
import { Maximize2, X } from 'lucide-react'

/** A diagram that opens full screen on tap, so labels stay readable on small phones. */
export function ZoomableImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="relative mx-auto mt-4 block w-full max-w-sm rounded-xl" aria-label={`Enlarge diagram: ${alt}`}>
        <img src={src} alt={alt} loading="lazy" className={`block h-auto w-full rounded-xl border bg-white ${className}`} />
        <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
          <Maximize2 className="h-3.5 w-3.5" aria-hidden /> Enlarge
        </span>
      </button>
      {open && (
        <div role="dialog" aria-modal="true" aria-label={alt} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4" onClick={() => setOpen(false)}>
          <img src={src} alt={alt} className="max-h-full w-full max-w-3xl rounded-xl bg-white object-contain" />
          <button
            type="button"
            autoFocus
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900"
            aria-label="Close diagram"
            style={{ marginTop: 'env(safe-area-inset-top)' }}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
      )}
    </>
  )
}
