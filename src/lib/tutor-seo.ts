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

/** Questions people ask about private tutors, shown on /tutors (and most of them on each subject's tutors page) and marked up as FAQPage. */
export const TUTOR_FAQ: [question: string, answer: string][] = [
  ['Is this a real person or the study tutor in the app?', 'A real person. Every tutor listed is a teacher with their own photo, qualifications and fees on WASSCE Tutor. It is separate from the study tutor inside the WASSCE Tutor app.'],
  ['How do I find a private tutor in Sierra Leone?', 'Choose a tutor in the marketplace on this page: filter by subject, search for your town or area, and compare their experience and monthly fees. Tap Book this tutor, agree to the fee, and WhatsApp opens with your message ready. If there is no tutor near you yet, tell us your subject and area and we will find one.'],
  ['How much does a private tutor cost?', 'Each tutor sets their own monthly fee for each subject, and how many lessons a week it includes. Take several subjects with one tutor and the fees add up, often with a discount from the tutor. You see the total, and confirm it, before WhatsApp opens.'],
  ['Can a tutor give lessons at my home?', 'Yes. Lessons are in person: at your home, at the tutor’s place or somewhere convenient for you both, as you agree with the tutor. WASSCE Tutor does not run online lessons.'],
  ['Are there tutors in Freetown, Bo, Kenema and Makeni?', 'Tutors teach in their own town or area, which is on their card. Search the marketplace for yours. If none is listed near you yet, tell us where you live and we will find a tutor for you.'],
  ['Can friends take extra classes together to pay less?', 'Yes, with tutors who take small groups (look for “Groups up to” on their card). Choose how many of you are learning: friends, classmates or brothers and sisters. Each of you pays the tutor’s group fee, usually lower than learning alone.'],
  ['How do I pay the tutor?', 'You pay the tutor directly, by Orange Money, Afrimoney, cash or bank transfer: when you book, you see which ones the tutor accepts. WASSCE Tutor does not take payment for tutoring.'],
  ['What does the blue tick mean?', 'The tutor has a tutor account with WASSCE Tutor, with their real photo, qualifications and fees. Our team is told about every new tutor and removes any card that is misleading, and a tutor can be paused if a problem is reported.'],
  ['Do I need a WASSCE Tutor account?', 'To message a tutor directly, yes: a free account keeps tutors’ numbers private and shows them the message comes from a real student. To ask us to find a tutor for you, no account is needed.'],
]
