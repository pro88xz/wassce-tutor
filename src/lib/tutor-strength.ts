// How findable a tutor's page is: the checks behind the card-strength meter
// on the tutor dashboard and the last step of the application. Each check is
// something parents search with (the area, the classes, the subjects) or
// something that makes a page worth showing (enough words, a clear
// qualification, lessons the tutor reviewed). Plain rules, no guessing.
import type { Tutor } from '@/components/tutors/Marketplace'

export type StrengthCheck = { key: string; done: boolean; label: string; tip: string }
export type Strength = { score: number; level: 'weak' | 'good' | 'strong'; checks: StrengthCheck[]; words: number }

export const STRONG_WORDS = 100

const wordsIn = (text: string) => (text.trim() ? text.trim().split(/\s+/).length : 0)
const SHORT: Record<string, string> = { Mathematics: 'maths', 'Further Mathematics': 'further maths', 'English Language': 'english' }
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u

export function cardStrength(card: Pick<Tutor, 'bio' | 'location' | 'qualifications' | 'avatar_path' | 'tutor_subjects' | 'reviewer'> & { hasPhoto?: boolean }): Strength {
  const bio = card.bio ?? ''
  const words = wordsIn(bio)
  const lower = bio.toLowerCase()
  const subjects = card.tutor_subjects.map((r) => r.subject?.name).filter((n): n is string => !!n)
  const namesSubject = subjects.some((n) => lower.includes(n.toLowerCase()) || (SHORT[n] && lower.includes(SHORT[n])))
  const qualifications = (card.qualifications ?? '').trim()

  const checks: StrengthCheck[] = [
    {
      key: 'photo',
      done: card.hasPhoto ?? !!card.avatar_path,
      label: 'A clear photo of you',
      tip: 'Parents choose tutors by their photo. Use a clear, friendly photo of your face in good light.',
    },
    {
      key: 'words',
      done: words >= STRONG_WORDS,
      label: `At least ${STRONG_WORDS} words about how you teach`,
      tip: `You have ${words}. Say how your lessons work, who you teach and what your students achieve: every extra detail is something a parent can find you by.`,
    },
    {
      key: 'subjects',
      done: namesSubject,
      label: 'Your subjects named in your story',
      tip: `Write your subjects in your own words, e.g. “I teach WASSCE ${subjects[0] ?? 'Biology'} …”. Google matches the words on your page.`,
    },
    {
      key: 'classes',
      done: /\b(sss ?[1-3]|jss ?[1-3]|form ?[1-6]|private candidates?|resit|bece|senior secondary)\b/i.test(bio),
      label: 'The classes you teach',
      tip: 'Say which classes you teach: SSS1 to SSS3, private candidates, JSS for BECE.',
    },
    {
      key: 'area',
      done: /,/.test(card.location ?? '') || wordsIn(card.location ?? '') >= 2,
      label: 'Your area as well as your town',
      tip: 'Write your area and town, e.g. “Kissy, Freetown” or “Tikonko Road, Bo”. Parents search for a tutor near them.',
    },
    {
      key: 'qualifications',
      done: qualifications.length >= 10 && !/\n/.test(qualifications) && !EMOJI.test(qualifications),
      label: 'A clear qualification',
      tip: 'Keep it to your diploma or degree and where you studied, on one line, e.g. “BSc Chemistry, Fourah Bay College”.',
    },
    {
      key: 'reviewer',
      done: !!card.reviewer,
      label: 'Lessons you reviewed',
      tip: 'Become a lesson reviewer: every lesson you approve says “Reviewed by” you and links students to your page.',
    },
  ]
  const done = checks.filter((c) => c.done).length
  const score = Math.round((done / checks.length) * 100)
  return { score, level: score >= 85 ? 'strong' : score >= 55 ? 'good' : 'weak', checks, words }
}
