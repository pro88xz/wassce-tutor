// A tutor's own page, /tutors/{slug} (migration 28 gives every tutor a slug
// made from their name). It shares the /tutors/{x} address space with the
// subject tutor pages: a subject's slug always wins, and a tutor's slug is
// never the same as a subject's (the database adds "-tutor" when it would be).
import { supabase } from '@/lib/supabase'
import { lessonPath } from '@/lib/public-rules'
import type { Tutor } from '@/components/tutors/Marketplace'

/** The columns a tutor card and a tutor page need (all readable by visitors; never the phone number). */
export const TUTOR_COLUMNS =
  'id,slug,reviewer,avatar_path,full_name,bio,qualifications,experience_years,location,verified_at,multi_subject_discount_pct,group_max,group_discount_pct,payment_methods,tutor_subjects(subject_id,price_nle,lessons_per_week,subject:subjects(id,name,slug)),tutor_booking_reviews(rating)'

export const tutorPagePath = (slug: string) => `/tutors/${slug}`

/** Names typed all in capitals (or all small) are shown with capitals in the usual places: "NICHOLAS NORMAN" -> "Nicholas Norman". */
export function displayName(name: string): string {
  const t = name.trim().replace(/\s+/g, ' ')
  if (t !== t.toUpperCase() && t !== t.toLowerCase()) return t
  return t.toLowerCase().replace(/(^|[\s'’-])(\p{L})/gu, (_m, before: string, letter: string) => before + letter.toUpperCase())
}

export const firstNameOf = (name: string) => displayName(name).split(' ')[0] ?? name

export type ReviewedLesson = { title: string; href: string; subject: string; topic: string }
export type TutorPageData = { tutor: Tutor; reviewed: ReviewedLesson[]; others: Tutor[] }

/** Everything for a tutor's page; null when there is no listed tutor with this slug. */
export async function fetchTutorPage(slug: string): Promise<TutorPageData | null> {
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) return null
  const { data, error } = await supabase
    .from('tutors')
    .select(TUTOR_COLUMNS)
    .eq('slug', slug)
    .eq('status', 'active')
    .eq('listed', true)
    .maybeSingle()
  if (error || !data) return null
  const tutor = data as unknown as Tutor

  const [reviewed, others] = await Promise.all([fetchReviewedLessons(slug), fetchOtherTutors(tutor)])
  return { tutor, reviewed, others }
}

/** The lessons this tutor reviewed and approved, linked to their pages (newest first). */
async function fetchReviewedLessons(slug: string): Promise<ReviewedLesson[]> {
  const { data: lessons, error } = await supabase
    .from('wassce_public_lessons')
    .select('slug,title,topic_id,reviewed_at')
    .eq('reviewer_tutor_slug', slug)
    .order('reviewed_at', { ascending: false })
    .limit(60)
  if (error || !lessons?.length) return []
  const topicIds = [...new Set(lessons.map((l) => l.topic_id as string))]
  const { data: topics } = await supabase.from('topics').select('id,slug,name,subject:subjects(slug,name)').in('id', topicIds)
  const byId = new Map((topics ?? []).map((t) => [t.id as string, t as unknown as { slug: string; name: string; subject: { slug: string; name: string } | null }]))
  return lessons.flatMap((l) => {
    const t = byId.get(l.topic_id as string)
    if (!t?.subject) return []
    return [{ title: l.title as string, href: lessonPath(t.subject.slug, t.slug, l.slug as string), subject: t.subject.name, topic: t.name }]
  })
}

/** Up to three other tutors who teach one of the same subjects (or any, if none do). */
async function fetchOtherTutors(tutor: Tutor): Promise<Tutor[]> {
  const { data } = await supabase
    .from('tutors')
    .select(TUTOR_COLUMNS)
    .eq('status', 'active')
    .eq('listed', true)
    .neq('id', tutor.id)
    .order('verified_at', { ascending: false })
    .limit(24)
  const list = (data ?? []) as unknown as Tutor[]
  const mine = new Set(tutor.tutor_subjects.map((s) => s.subject_id))
  const shared = list.filter((t) => t.tutor_subjects.some((s) => mine.has(s.subject_id)))
  return (shared.length ? shared : list).slice(0, 3)
}

// ─── Search text and structured data for a tutor's page ────────────────────

const photoUrl = (path: string) => supabase.storage.from('tutor-profile-images').getPublicUrl(path).data.publicUrl
export const tutorPhoto = (tutor: Pick<Tutor, 'avatar_path'>) => (tutor.avatar_path ? photoUrl(tutor.avatar_path) : null)

const SHORT: Record<string, string> = { Mathematics: 'Maths', 'Further Mathematics': 'Further Maths', 'English Language': 'English' }
const subjectNames = (tutor: Tutor) =>
  [...tutor.tutor_subjects]
    .sort((a, b) => (a.subject?.name ?? '').localeCompare(b.subject?.name ?? ''))
    .map((r) => r.subject?.name)
    .filter((n): n is string => !!n)
const list = (items: string[]) => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`)
const lowest = (tutor: Tutor) => {
  const fees = tutor.tutor_subjects.map((r) => Number(r.price_nle)).filter((n) => n > 0)
  return fees.length ? Math.min(...fees) : null
}

/** "John Kaitibie: Private Maths & Chemistry Tutor in Lumley, Freetown", shortened to fit what Google shows. */
export function tutorPageTitle(tutor: Tutor): string {
  const name = displayName(tutor.full_name)
  const short = subjectNames(tutor).map((n) => SHORT[n] ?? n)
  const place = tutor.location.trim()
  const options = [
    short.length >= 2 ? `${name}: Private ${short[0]} & ${short[1]} Tutor in ${place}` : null,
    short.length >= 1 ? `${name}: Private ${short[0]} Tutor in ${place}` : null,
    `${name}: Private WASSCE Tutor in ${place}`,
    short.length >= 1 ? `${name}: Private ${short[0]} Tutor` : null,
    `${name}: Private WASSCE Tutor`,
  ].filter((t): t is string => !!t)
  const title = options.find((t) => t.length <= 62) ?? options[options.length - 1]
  return `${title}${`${title} | WASSCE Tutor`.length <= 65 ? ' | WASSCE Tutor' : ''}`
}

export function tutorPageDescription(tutor: Tutor): string {
  const name = displayName(tutor.full_name)
  const subjects = subjectNames(tutor)
  const from = lowest(tutor)
  const parts = [
    `${name} is a private WASSCE tutor in ${tutor.location.trim()} for ${list(subjects.slice(0, 4))}${subjects.length > 4 ? ' and more' : ''}.`,
    tutor.experience_years > 0 ? `${tutor.experience_years} years teaching.` : '',
    from !== null ? `From NLe ${from.toLocaleString('en-GB')} a month.` : '',
    'See the fee, then message on WhatsApp.',
  ]
  let out = parts[0]
  for (const p of parts.slice(1)) if (p && out.length + 1 + p.length <= 160) out += ` ${p}`
  return out.length <= 160 ? out : `${out.slice(0, out.lastIndexOf(' ', 157))}…`
}

/** schema.org Person: who the tutor is, where they teach, what they teach and for how much. */
export function tutorJsonLd(tutor: Tutor, url: string): Record<string, unknown> {
  const name = displayName(tutor.full_name)
  const photo = tutorPhoto(tutor)
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url,
    ...(photo ? { image: photo } : {}),
    jobTitle: 'Private WASSCE tutor',
    description: tutor.bio.slice(0, 500),
    address: { '@type': 'PostalAddress', addressLocality: tutor.location.trim(), addressCountry: 'SL' },
    knowsAbout: subjectNames(tutor),
    ...(tutor.qualifications ? { hasCredential: { '@type': 'EducationalOccupationalCredential', name: tutor.qualifications.slice(0, 200) } } : {}),
    makesOffer: tutor.tutor_subjects
      .filter((r) => r.subject?.name && Number(r.price_nle) > 0)
      .map((r) => ({
        '@type': 'Offer',
        name: `Private WASSCE ${r.subject!.name} lessons`,
        price: Number(r.price_nle),
        priceCurrency: 'SLE',
        description: `Monthly fee${r.lessons_per_week ? `, ${r.lessons_per_week} ${r.lessons_per_week === 1 ? 'lesson' : 'lessons'} a week` : ''}, in person`,
        itemOffered: { '@type': 'Service', name: `Private WASSCE ${r.subject!.name} tutoring`, areaServed: tutor.location.trim() },
      })),
  }
}
