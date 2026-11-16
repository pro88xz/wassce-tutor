// A lesson diagram that opens full screen. On a phone a labelled diagram is
// shrunk to the screen's width and its labels get very small; tapping it opens
// it at a readable size (at least 44rem wide, about 1.7 times a phone), which
// the student drags around and can pinch to zoom further. Closes with the X, Escape, the back of the
// dialog, or the browser's back gesture on Android (via the dialog's cancel).
// The dialog is portalled to <body>, outside the lesson's prose.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Maximize2, X } from 'lucide-react'

export function Zoomable({
  label,
  children,
  large,
}: {
  /** What the picture shows, for the dialog's title and the button's name */
  label: string
  /** The picture as it sits in the lesson */
  children: ReactNode
  /** The picture to show enlarged (rendered only while the dialog is open) */
  large: ReactNode
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const pan = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const d = dialog.current
    if (!open || !d) return
    if (!d.open) d.showModal()
    // Start in the middle of the picture, where most diagrams put their subject.
    requestAnimationFrame(() => {
      const p = pan.current
      if (p) p.scrollLeft = (p.scrollWidth - p.clientWidth) / 2
    })
  }, [open])

  const close = () => dialog.current?.close()

  return (
    <>
      {/* A span, so it can sit inside the paragraph Markdown wraps an image in. */}
      <span className="group relative block cursor-zoom-in" onClick={() => setOpen(true)}>
        {children}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setOpen(true)
          }}
          aria-label={`Enlarge: ${label}`}
          className="absolute bottom-2.5 right-2.5 inline-flex min-h-8 items-center gap-1.5 rounded-full bg-slate-900/75 px-2.5 text-xs font-semibold text-white shadow-md backdrop-blur transition group-hover:bg-slate-900"
        >
          <Maximize2 className="h-3.5 w-3.5" aria-hidden /> Enlarge
        </button>
      </span>

      {open &&
        createPortal(
          <dialog
            ref={dialog}
            aria-label={label}
            onClose={() => setOpen(false)}
            onClick={(e) => {
              if (e.target === dialog.current) close()
            }}
            className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-white p-0 text-slate-900 backdrop:bg-slate-950/70 sm:m-auto sm:h-[90dvh] sm:w-[min(72rem,94vw)] sm:rounded-2xl"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between gap-3 border-b px-4 py-1.5">
                <p className="min-w-0 truncate text-sm font-semibold">{label}</p>
                <button type="button" onClick={close} aria-label="Close" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-slate-100">
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>
              <div ref={pan} className="flex-1 overflow-auto overscroll-contain">
                <div className="mx-auto w-[max(100%,44rem)] p-4 [&_img]:max-h-none [&_img]:max-w-none [&_svg]:max-w-none">{large}</div>
              </div>
              <p className="border-t px-4 py-2 text-center text-xs text-slate-500 sm:hidden">Drag to move around. Pinch to zoom in further.</p>
            </div>
          </dialog>,
          document.body,
        )}
    </>
  )
}
