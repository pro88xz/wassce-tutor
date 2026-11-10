// Editorial photographs (university guides, blog posts) are self-hosted in
// public/img/universities. They used to be hot-linked from each institution's
// own server, which broke whenever that server was slow, rate-limited the
// request or blocked cross-site image loads.
//
// Each photograph ships as three files that share one base name:
//   <name>.webp      up to 1200 px wide, for page display
//   <name>-640.webp  640 px wide, for cards and phones
//   <name>.jpg       up to 1200 px wide, for link previews (og:image)
// Content files store the first path; the others are derived from it here.
import { SITE } from '@/lib/seo'

export type EditorialImage = {
  /** Up to 1200 px wide WebP */
  src: string
  /** 640 px wide WebP */
  small: string
  /** Absolute JPEG URL for og:image, twitter:image and JSON-LD */
  og: string
}

export function editorialImage(path: string): EditorialImage {
  const base = path.replace(/\.webp$/, '')
  return { src: path, small: `${base}-640.webp`, og: `${SITE.origin}${base}.jpg` }
}
