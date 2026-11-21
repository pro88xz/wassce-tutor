import { subjectTheme } from '@/lib/subject-theme'

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
