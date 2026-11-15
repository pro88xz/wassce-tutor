// What a student pays a tutor each month. The database works out the same sum
// (request_tutor(), migration 19) and its answer is the one sent to the tutor;
// this copy shows the price before the student agrees.
//
//   per student = round(sum of the fees x (1 - subject discount) x (1 - group discount))
//   total       = per student x students
//
// The subject discount applies from two subjects, the group discount from two
// students; both are set by the tutor. Amounts are whole Leones.

export type PricedSubject = { price: number; lessonsPerWeek: number | null }
export type TutorOffer = { multiSubjectDiscountPct: number; groupMax: number | null; groupDiscountPct: number }

export type Quote = {
  subjects: number
  students: number
  /** The fees added up, for one student, before discounts. */
  subtotal: number
  subjectDiscountPct: number
  groupDiscountPct: number
  /** What each student pays a month. */
  perStudent: number
  /** What the group pays a month (perStudent x students). */
  total: number
  /** How much less each student pays than the fees added up. */
  saving: number
  /** Lessons a week across the subjects, when the tutor gave them for every subject. */
  lessonsPerWeek: number | null
  /** About what one lesson costs each student (4⅓ weeks a month). */
  perLesson: number | null
}

const WEEKS_PER_MONTH = 52 / 12

export function quote(subjects: PricedSubject[], offer: TutorOffer, students = 1): Quote {
  const count = subjects.length
  const subjectDiscountPct = count >= 2 ? offer.multiSubjectDiscountPct : 0
  const groupDiscountPct = students >= 2 ? offer.groupDiscountPct : 0
  // Whole cents, then the discounts as whole percentages: exact, like the
  // database's numeric sum, so both round the same way.
  const cents = subjects.reduce((sum, s) => sum + Math.round(s.price * 100), 0)
  const subtotal = cents / 100
  const perStudent = Math.round((cents * (100 - subjectDiscountPct) * (100 - groupDiscountPct)) / 1_000_000)
  const lessons = subjects.every((s) => s.lessonsPerWeek) ? subjects.reduce((sum, s) => sum + (s.lessonsPerWeek ?? 0), 0) : null
  return {
    subjects: count,
    students,
    subtotal,
    subjectDiscountPct,
    groupDiscountPct,
    perStudent,
    total: perStudent * students,
    saving: Math.max(0, Math.round(subtotal - perStudent)),
    lessonsPerWeek: lessons || null,
    perLesson: lessons ? Math.round(perStudent / (lessons * WEEKS_PER_MONTH)) : null,
  }
}

/** NLe 1,250 (whole Leones), NLe 12.50 otherwise. */
export function nle(amount: number): string {
  const whole = Number.isInteger(amount)
  return `NLe ${amount.toLocaleString('en-GB', { minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: whole ? 0 : 2 })}`
}

/** "Biology", "Biology and Chemistry", "Biology, Chemistry and Physics". */
export function listText(items: string[], last = 'and'): string {
  if (items.length <= 1) return items[0] ?? ''
  return `${items.slice(0, -1).join(', ')} ${last} ${items[items.length - 1]}`
}

export const lessonsText = (n: number) => `${n} ${n === 1 ? 'lesson' : 'lessons'} a week`

/** How students can pay a tutor in Sierra Leone. Keys match tutors.payment_methods. */
export const PAYMENT_METHODS = [
  { id: 'orange_money', label: 'Orange Money', inSentence: 'Orange Money' },
  { id: 'afrimoney', label: 'Afrimoney', inSentence: 'Afrimoney' },
  { id: 'cash', label: 'Cash', inSentence: 'cash' },
  { id: 'bank', label: 'Bank transfer', inSentence: 'bank transfer' },
] as const
export type PaymentMethod = (typeof PAYMENT_METHODS)[number]['id']

/** "Orange Money, Afrimoney or cash", or null when the tutor has not said. */
export function paymentText(methods: string[]): string | null {
  const words = PAYMENT_METHODS.filter((m) => methods.includes(m.id)).map((m) => m.inSentence)
  return words.length ? listText(words, 'or') : null
}

/** The choices tutors get. */
export const SUBJECT_DISCOUNTS = [0, 5, 10, 15, 20, 25]
export const GROUP_DISCOUNTS = [0, 10, 15, 20, 25, 30]
export const GROUP_SIZES = [2, 3, 4, 5, 6]
export const LESSONS_PER_WEEK = [1, 2, 3, 4, 5, 6, 7]
