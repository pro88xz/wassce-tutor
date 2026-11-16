// The one way a photograph is framed on the public site: rounded, sitting on
// a violet brand slab offset behind it, with a small yellow disc at the
// opposite corner. Used by the homepage hero and the tutor section so the
// photography reads as one family. Overlays (product cards, labels) go in
// `children`, positioned against the photo.
import type { ReactNode } from 'react'

export function BrandPhoto({
  src,
  srcSet,
  sizes,
  width,
  height,
  alt,
  priority = false,
  aspect = 'aspect-[4/3]',
  slab = 'right',
  children,
  className = '',
}: {
  src: string
  srcSet?: string
  sizes?: string
  width: number
  height: number
  alt: string
  priority?: boolean
  /** Tailwind aspect classes for the photo (may be responsive). */
  aspect?: string
  /** Which side the violet slab shows on. */
  slab?: 'left' | 'right'
  children?: ReactNode
  className?: string
}) {
  return (
    <div className={`relative isolate ${className}`}>
      <span
        aria-hidden
        className={`absolute -z-10 h-[88%] w-[88%] rounded-[2.25rem] bg-gradient-to-br from-[#7c4dff] to-[#4a25c4] ${slab === 'right' ? '-right-3 -top-3 sm:-right-5 sm:-top-5' : '-left-3 -top-3 sm:-left-5 sm:-top-5'}`}
      />
      <span
        aria-hidden
        className={`absolute -z-10 h-16 w-16 rounded-full bg-[#ffd166] sm:h-24 sm:w-24 ${slab === 'right' ? '-bottom-4 -left-4 sm:-bottom-6 sm:-left-6' : '-bottom-4 -right-4 sm:-bottom-6 sm:-right-6'}`}
      />
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        width={width}
        height={height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        {...(priority ? { fetchPriority: 'high' as const } : {})}
        className={`w-full rounded-[1.75rem] object-cover shadow-[0_30px_60px_-30px_rgba(30,20,80,.45)] sm:rounded-[2rem] ${aspect}`}
      />
      {children}
    </div>
  )
}
