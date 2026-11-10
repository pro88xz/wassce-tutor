import { useEffect, useRef, useState } from 'react'
import { editorialImage } from '@/lib/editorial-images'

/**
 * A self-hosted editorial photograph that can never leave a broken-image icon
 * or an empty grey box. The frame always paints a branded placeholder (the
 * institution's short name on the brand gradient); the photograph sits on top
 * and is removed if it fails to load, including a failure that happened before
 * React hydrated the prerendered page.
 */
export function EditorialPhoto({
  image,
  alt,
  label,
  sizes,
  priority = false,
  className = '',
  imgClassName = '',
}: {
  /** Site path to the 1200 px WebP, e.g. /img/universities/comahs.webp */
  image: string
  alt: string
  /** Short text for the placeholder, e.g. the institution's short name */
  label: string
  /** How wide the photograph is displayed, for the browser's srcset choice */
  sizes: string
  /** Above the fold: load immediately and at high priority */
  priority?: boolean
  /** Frame classes: set the aspect ratio or height and the corner radius here */
  className?: string
  imgClassName?: string
}) {
  const { src, small } = editorialImage(image)
  const ref = useRef<HTMLImageElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const img = ref.current
    if (img && img.complete && img.naturalWidth === 0) setFailed(true)
  }, [])

  return (
    <span className={`relative block overflow-hidden bg-gradient-to-br from-[#2b1767] via-[#3b2491] to-[#17112f] ${className}`}>
      <span aria-hidden className="absolute inset-0 flex items-center justify-center px-4 text-center text-lg font-extrabold tracking-tight text-white/85">
        {label}
      </span>
      {!failed && (
        <img
          ref={ref}
          src={src}
          srcSet={`${small} 640w, ${src} 1200w`}
          sizes={sizes}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          {...(priority ? { fetchPriority: 'high' as const } : {})}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        />
      )}
    </span>
  )
}
