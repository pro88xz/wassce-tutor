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
  /** readable accent text on the page background */
  text: string
  /** gradient for hero headers: use with bg-gradient-to-br */
  gradient: string
  /** outline highlight (e.g. the "up next" lesson) */
  ring: string
}

const PALETTES = {
  indigo: { bar: 'bg-indigo-500', soft: 'bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', gradient: 'from-indigo-500 to-blue-600', ring: 'ring-indigo-500' },
  violet: { bar: 'bg-violet-500', soft: 'bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400', gradient: 'from-violet-500 to-purple-600', ring: 'ring-violet-500' },
  sky: { bar: 'bg-sky-500', soft: 'bg-sky-500/10', text: 'text-sky-600 dark:text-sky-400', gradient: 'from-sky-500 to-blue-600', ring: 'ring-sky-500' },
  fuchsia: { bar: 'bg-fuchsia-500', soft: 'bg-fuchsia-500/10', text: 'text-fuchsia-600 dark:text-fuchsia-400', gradient: 'from-fuchsia-500 to-pink-600', ring: 'ring-fuchsia-500' },
  emerald: { bar: 'bg-emerald-500', soft: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', gradient: 'from-emerald-500 to-teal-600', ring: 'ring-emerald-500' },
  cyan: { bar: 'bg-cyan-500', soft: 'bg-cyan-500/10', text: 'text-cyan-600 dark:text-cyan-400', gradient: 'from-cyan-500 to-sky-600', ring: 'ring-cyan-500' },
  orange: { bar: 'bg-orange-500', soft: 'bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', gradient: 'from-orange-500 to-red-500', ring: 'ring-orange-500' },
  lime: { bar: 'bg-lime-500', soft: 'bg-lime-500/10', text: 'text-lime-700 dark:text-lime-400', gradient: 'from-lime-500 to-green-600', ring: 'ring-lime-500' },
  teal: { bar: 'bg-teal-500', soft: 'bg-teal-500/10', text: 'text-teal-600 dark:text-teal-400', gradient: 'from-teal-500 to-emerald-600', ring: 'ring-teal-500' },
  rose: { bar: 'bg-rose-500', soft: 'bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', gradient: 'from-rose-500 to-red-600', ring: 'ring-rose-500' },
  amber: { bar: 'bg-amber-500', soft: 'bg-amber-500/10', text: 'text-amber-700 dark:text-amber-400', gradient: 'from-amber-500 to-orange-600', ring: 'ring-amber-500' },
  blue: { bar: 'bg-blue-500', soft: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', gradient: 'from-blue-500 to-indigo-600', ring: 'ring-blue-500' },
  yellow: { bar: 'bg-yellow-500', soft: 'bg-yellow-500/10', text: 'text-yellow-700 dark:text-yellow-400', gradient: 'from-yellow-500 to-amber-600', ring: 'ring-yellow-500' },
  green: { bar: 'bg-green-500', soft: 'bg-green-500/10', text: 'text-green-700 dark:text-green-400', gradient: 'from-green-500 to-emerald-600', ring: 'ring-green-500' },
  slate: { bar: 'bg-slate-500', soft: 'bg-slate-500/10', text: 'text-slate-600 dark:text-slate-300', gradient: 'from-slate-500 to-slate-700', ring: 'ring-slate-500' },
  purple: { bar: 'bg-purple-500', soft: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', gradient: 'from-purple-500 to-fuchsia-600', ring: 'ring-purple-500' },
} satisfies Record<string, Palette>

type SubjectTheme = { icon: LucideIcon; palette: Palette }

const THEMES: Record<string, SubjectTheme> = {
  'mathematics': { icon: Sigma, palette: PALETTES.indigo },
  'further-mathematics': { icon: Pi, palette: PALETTES.violet },
  'english-language': { icon: Languages, palette: PALETTES.sky },
  'literature-in-english': { icon: BookMarked, palette: PALETTES.fuchsia },
  'biology': { icon: Dna, palette: PALETTES.emerald },
  'chemistry': { icon: FlaskConical, palette: PALETTES.cyan },
  'physics': { icon: Atom, palette: PALETTES.orange },
  'agricultural-science': { icon: Sprout, palette: PALETTES.lime },
  'economics': { icon: TrendingUp, palette: PALETTES.teal },
  'government': { icon: Landmark, palette: PALETTES.rose },
  'history': { icon: ScrollText, palette: PALETTES.amber },
  'geography': { icon: Globe, palette: PALETTES.blue },
  'commerce': { icon: Store, palette: PALETTES.yellow },
  'financial-accounting': { icon: Calculator, palette: PALETTES.green },
  'business-management': { icon: Briefcase, palette: PALETTES.slate },
  'ict-computer-studies': { icon: Monitor, palette: PALETTES.indigo },
  'religious-studies': { icon: HandHeart, palette: PALETTES.purple },
  'technical-drawing': { icon: PencilRuler, palette: PALETTES.slate },
  'building-construction': { icon: HardHat, palette: PALETTES.orange },
}

const FALLBACK: SubjectTheme = { icon: BookOpen, palette: PALETTES.slate }

export function subjectTheme(slug: string | null | undefined): SubjectTheme {
  return (slug && THEMES[slug]) || FALLBACK
}

/** Rounded tile with the subject's icon on its tinted colour. */
export function SubjectIcon({ slug, size = 'md' }: { slug: string | null | undefined; size?: 'sm' | 'md' | 'lg' }) {
  const { icon: Icon, palette } = subjectTheme(slug)
  const box = size === 'lg' ? 'h-14 w-14 rounded-2xl' : size === 'sm' ? 'h-8 w-8 rounded-lg' : 'h-11 w-11 rounded-xl'
  const glyph = size === 'lg' ? 'h-7 w-7' : size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
  return (
    <span className={`inline-flex shrink-0 items-center justify-center ${box} ${palette.soft} ${palette.text}`}>
      <Icon className={glyph} strokeWidth={2.2} aria-hidden />
    </span>
  )
}
