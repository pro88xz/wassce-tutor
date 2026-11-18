// "Bring me back where I was going." Whenever a signed-out visitor tries
// something that needs an account (a page in the app, booking a tutor, paying
// for a plan), the sign-in page is opened with ?next= set to where they were
// going. After signing in, or creating an account, they land exactly there.
//
// History is arranged so that "back" goes to the page before, which is
// normally the landing page: the page that asked for an account is replaced
// by the sign-in page, and the sign-in page is replaced by the destination.
//
//   before:   /   /practice            (signed out)
//   sign-in:  /   /auth?next=/practice
//   after:    /   /practice            (back -> landing page)

/** The same-site path to return to, or null if `next` is not one (so ?next= cannot send people elsewhere). */
export function safeReturn(next: string | null | undefined): string | null {
  if (!next || next.length > 600) return null
  if (!next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return null
  if (!/^\/[A-Za-z0-9/_\-.~?=&,%+]*$/.test(next)) return null
  if (/^\/(auth|reset-password)(\/|\?|$)/.test(next)) return null
  return next
}

/** Pages that are only useful with an account: a signed-out visitor is sent to sign in, and back. */
export function needsAccount(pathname: string): boolean {
  return /^\/(subjects|subject|topic|lesson|practice|paper|progress|profile|account|onboarding|tutor)(\/|$)/.test(pathname)
}

export type SignInOptions = {
  /** Who they are booking: shown on the sign-in page ("to book Kadiatu"). */
  forName?: string
  intent?: 'student' | 'tutor' | 'affiliate'
}

/** The sign-in page link that returns to `next` afterwards. */
export function signInHref(next: string | null, options: SignInOptions = {}): string {
  const params = new URLSearchParams()
  if (options.intent && options.intent !== 'student') params.set('intent', options.intent)
  const back = safeReturn(next)
  if (back && back !== '/') params.set('next', back)
  if (options.forName) params.set('for', options.forName.slice(0, 40))
  const query = params.toString()
  return query ? `/auth?${query}` : '/auth'
}

/** A few words for where they are going, for the sign-in page ("to continue to Practice"). */
export function returnLabel(next: string | null, forName?: string | null): string | null {
  const path = safeReturn(next)
  if (!path) return null
  if (/^\/tutors/.test(path) && /[?&]book=/.test(path)) return forName ? `to book ${forName}` : 'to book your tutor'
  const page = path.split('?')[0]
  const labels: [RegExp, string][] = [
    [/^\/practice|^\/paper/, 'to continue to Practice'],
    [/^\/progress/, 'to see your progress'],
    [/^\/(subjects|subject|topic)/, 'to continue to your subjects'],
    [/^\/lesson/, 'to continue to your lesson'],
    [/^\/subscribe/, 'to choose your plan'],
    [/^\/(account|profile)/, 'to see your account'],
    [/^\/tutor$/, 'to ask the study tutor'],
    [/^\/tutors/, 'to continue to the tutors'],
    [/^\/become-a-tutor/, 'to make your tutor card'],
  ]
  return labels.find(([re]) => re.test(page))?.[1] ?? null
}
