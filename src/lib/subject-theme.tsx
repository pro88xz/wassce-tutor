// Visual identity per subject: one colour and one icon, used everywhere the
// subject appears (cards, progress bars, headers). Keyed by subject slug
// (stable public URLs, see supabase/migrations/20261105_03_subject_slugs.sql).
//
// Class names are written out in full on purpose: Tailwind only generates
// classes it can find as complete strings in the source.
import {
  Atom, BookMarked, BookOpen, Briefcase, Calculator, Dna, FlaskConical, Globe, HandHeart, HardHat,
  Landmark, Languages, Monitor, PencilRuler, Pi, ScrollText, Sigma, Sprout, Store, TrendingUp,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type Palette = {
  /** solid fill: progress bars, dots */
  bar: string
  /** tinted background: icon tiles, chips */
  soft: string
  /** readable accent text on the page background (AA contrast) */
  text: string
  /** kept for older call sites: a flat fill in the subject colour (no decorative gradients) */
  gradient: string
  /** outline highlight (e.g. the "up next" lesson) */
  ring: string
}

// Five restrained accents (Design System Blueprint section 14, "Subject colour
// coding"). They help students scan; they are not separate brands, so every
// subject card, header and control keeps the same structure.
const PALETTES = {
  purple: { bar: 'bg-[#6438d8]', soft: 'bg-[#6438d8]/10', text: 'text-[#5a2fd0] dark:text-[#c4b2ff]', gradient: 'from-[#6438d8] to-[#6438d8]', ring: 'ring-[#6438d8]' },
  teal: { bar: 'bg-[#0f8b8d]', soft: 'bg-[#0f8b8d]/10', text: 'text-[#0b6f71] dark:text-[#7fd6d4]', gradient: 'from-[#0f8b8d] to-[#0f8b8d]', ring: 'ring-[#0f8b8d]' },
  blue: { bar: 'bg-[#2864c5]', soft: 'bg-[#2864c5]/10', text: 'text-[#2559b0] dark:text-[#9dbdf2]', gradient: 'from-[#2864c5] to-[#2864c5]', ring: 'ring-[#2864c5]' },
  green: { bar: 'bg-[#17865b]', soft: 'bg-[#17865b]/10', text: 'text-[#136f4b] dark:text-[#86d6b1]', gradient: 'from-[#17865b] to-[#17865b]', ring: 'ring-[#17865b]' },
  amber: { bar: 'bg-[#b66a12]', soft: 'bg-[#b66a12]/10', text: 'text-[#93550e] dark:text-[#f0c27c]', gradient: 'from-[#b66a12] to-[#b66a12]', ring: 'ring-[#b66a12]' },
} satisfies Record<string, Palette>

type SubjectTheme = { icon: LucideIcon; palette: Palette }

const THEMES: Record<string, SubjectTheme> = {
  'mathematics': { icon: Sigma, palette: PALETTES.purple },
  'further-mathematics': { icon: Pi, palette: PALETTES.purple },
  'english-language': { icon: Languages, palette: PALETTES.blue },
  'literature-in-english': { icon: BookMarked, palette: PALETTES.amber },
  'biology': { icon: Dna, palette: PALETTES.green },
  'chemistry': { icon: FlaskConical, palette: PALETTES.teal },
  'physics': { icon: Atom, palette: PALETTES.blue },
  'agricultural-science': { icon: Sprout, palette: PALETTES.green },
  'economics': { icon: TrendingUp, palette: PALETTES.teal },
  'government': { icon: Landmark, palette: PALETTES.amber },
  'history': { icon: ScrollText, palette: PALETTES.amber },
  'geography': { icon: Globe, palette: PALETTES.teal },
  'commerce': { icon: Store, palette: PALETTES.amber },
  'financial-accounting': { icon: Calculator, palette: PALETTES.green },
  'business-management': { icon: Briefcase, palette: PALETTES.blue },
  'ict-computer-studies': { icon: Monitor, palette: PALETTES.blue },
  'religious-studies': { icon: HandHeart, palette: PALETTES.purple },
  'technical-drawing': { icon: PencilRuler, palette: PALETTES.teal },
  'building-construction': { icon: HardHat, palette: PALETTES.amber },
}

const FALLBACK: SubjectTheme = { icon: BookOpen, palette: PALETTES.purple }

export function subjectTheme(slug: string | null | undefined): SubjectTheme {
  return (slug && THEMES[slug]) || FALLBACK
}

/** Rounded tile with the subject's icon on its tinted colour. */
export function SubjectIcon({ slug, size = 'md' }: { slug: string | null | undefined; size?: 'sm' | 'md' | 'lg' }) {
  const { icon: Icon, palette } = subjectTheme(slug)
  const box = size === 'lg' ? 'h-12 w-12 rounded-xl' : size === 'sm' ? 'h-8 w-8 rounded-lg' : 'h-10 w-10 rounded-xl'
  const glyph = size === 'lg' ? 'h-6 w-6' : size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
  return (
    <span className={`inline-flex shrink-0 items-center justify-center ${box} ${palette.soft} ${palette.text}`}>
      <Icon className={glyph} strokeWidth={2} aria-hidden />
    </span>
  )
}
