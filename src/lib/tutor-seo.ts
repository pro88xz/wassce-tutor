// The words people use to look for a tutor in Sierra Leone, for the private
// tutor pages (/tutors and /tutors/{subject}): "private tutor", "home lessons"
// or "home tuition", "extra classes", a town ("tutor in Freetown"), and the
// short subject name ("maths tutor", not "mathematics tutor"). Search Console
// has almost no data for these pages yet, so the words come from how tutoring
// is advertised and talked about locally.
import { brandedTitle, fitDescription } from '@/lib/seo'

/** The biggest towns, named in titles and descriptions; tutors list their own area on their card. */
export const TUTOR_TOWNS = ['Freetown', 'Bo', 'Kenema', 'Makeni'] as const

/** Areas named in the page text, so a search for a town or a Freetown neighbourhood finds the page. */
export const TUTOR_AREAS = 'Freetown (Kissy, Wellington, Calaba Town, Lumley, Wilberforce, Aberdeen, Goderich, Waterloo), Bo, Kenema, Makeni, Koidu, Port Loko, Lunsar and Kabala'

const SHORT: Record<string, string> = {
  Mathematics: 'Maths',
  'Further Mathematics': 'Further Maths',
  'English Language': 'English',
}

/** The name people search with: "Maths" for Mathematics, "English" for English Language. */
export const shortSubject = (name: string) => SHORT[name] ?? name

/** "Private Maths Tutor in Sierra Leone for WASSCE | Home Lessons", shortened to fit. */
export function subjectTutorTitle(name: string): string {
  const base = `Private ${shortSubject(name)} Tutor in Sierra Leone for WASSCE`
  const withLessons = `${base} | Home Lessons`
  return withLessons.length <= 65 ? withLessons : brandedTitle(base)
}

export function subjectTutorDescription(name: string, topicCount: number): string {
  const short = shortSubject(name)
  return fitDescription([
    `Book a private WASSCE ${short} tutor for home lessons in ${TUTOR_TOWNS.join(', ')} and across Sierra Leone.`,
    `All ${topicCount} syllabus topics.`,
    'See the monthly fee, then message them on WhatsApp.',
  ])
}
