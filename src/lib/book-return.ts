// Booking a tutor while signed out. Anyone can browse tutors; "Book this
// tutor" asks a signed-out visitor to sign up (or sign in) first, with a way
// back (src/lib/return-to.ts): the marketplace page they were on, the tutor,
// and what they had chosen. After signing in they land there with the
// booking open, whether the account is new or not.

export type BookIntent = { tutor: string; subjects: string[]; students: number }

const UUID = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'

/** The marketplace link that reopens this booking. */
export function bookingReturnPath(pathname: string, intent: BookIntent): string {
  const page = /^\/tutors(\/[a-z0-9-]+)?$/i.test(pathname) ? pathname : '/tutors'
  const parts = [`book=${intent.tutor}`]
  if (intent.subjects.length) parts.push(`s=${intent.subjects.slice(0, 12).join(',')}`)
  if (intent.students > 1) parts.push(`n=${Math.min(6, Math.max(1, Math.round(intent.students)))}`)
  return `${page}?${parts.join('&')}`
}

/** The booking to reopen, from the marketplace page's own query string. */
export function readBookIntent(search: string): BookIntent | null {
  const params = new URLSearchParams(search)
  const tutor = params.get('book') ?? ''
  if (!new RegExp(`^${UUID}$`, 'i').test(tutor)) return null
  const subjects = (params.get('s') ?? '').split(',').filter((s) => new RegExp(`^${UUID}$`, 'i').test(s)).slice(0, 12)
  const n = Number(params.get('n') ?? 1)
  return { tutor, subjects, students: Number.isInteger(n) && n >= 1 && n <= 6 ? n : 1 }
}
