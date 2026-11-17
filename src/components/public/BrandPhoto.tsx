// The one way a photograph is framed on the public site: crisp, softly
// rounded, with a hairline edge and a deep shadow. No decorative shapes
// behind it, so the photo and the product cards on it carry the section.
// Used by the homepage hero and the tutor section so the photography reads
// as one family. Overlays (product cards, labels) go in `children`,
// positioned against the photo.
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
  children?: ReactNode
  className?: string
}) {
  return (
    <div className={`relative isolate ${className}`}>
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
        className={`w-full rounded-2xl object-cover ring-1 ring-slate-900/5 shadow-[0_2px_4px_rgba(23,28,43,.06),0_32px_64px_-32px_rgba(30,20,80,.5)] sm:rounded-3xl ${aspect}`}
      />
      {children}
    </div>
  )
}
