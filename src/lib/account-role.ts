// What kind of account is signed in: a student, a tutor or an affiliate. Each
// has its own home, navigation and screens, and tutors and affiliates never
// land in the student app (its dashboard, set-up, practice or study tutor).
//
// The account decides, not the link someone signed in from: the database
// keeps each account's type in profiles.account_role (migration 26) and sets
// it on sign-up, when someone applies to teach, and when someone opens an
// affiliate account without studying (a student who also refers friends
// stays a student, with the affiliate dashboard one tap away).
// Admins keep their role for navigation but are never redirected away from a
// page (they check every part of the site).
import { useQuery } from '@tanstack/react-query'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'

export type AccountRole = 'student' | 'tutor' | 'affiliate'

export const ROLE_HOME = {
  student: '/',
  tutor: '/tutor-dashboard',
  affiliate: '/affiliate-dashboard',
} as const satisfies Record<AccountRole, string>

export type AccountInfo = {
  role: AccountRole
  isAdmin: boolean
  /** A tutor's own page, /tutors/{slug} (migration 28), once they have one. */
  tutorSlug?: string | null
}

export async function fetchAccountInfo(user: Pick<User, 'id' | 'user_metadata'>): Promise<AccountInfo> {
  // The database keeps each account's type (profiles.account_role, migration 26).
  const stored = await supabase.from('profiles').select('account_role,is_admin').eq('id', user.id).maybeSingle()
  if (!stored.error && stored.data) {
    const stored_role = stored.data.account_role as AccountRole | null
    const role: AccountRole = stored_role === 'tutor' || stored_role === 'affiliate' ? stored_role : 'student'
    return { role, isAdmin: Boolean(stored.data.is_admin), tutorSlug: role === 'tutor' ? await ownTutorSlug(user.id) : null }
  }
  return inferAccountInfo(user)
}

/** Before migration 26 is applied: work the type out from the account's tutor and affiliate records. */
async function inferAccountInfo(user: Pick<User, 'id' | 'user_metadata'>): Promise<AccountInfo> {
  const intent = (user.user_metadata as { account_intent?: string } | null)?.account_intent
  const [tutor, application, affiliate, profile] = await Promise.all([
    supabase.from('tutors').select('id').eq('user_id', user.id).maybeSingle(),
    supabase.from('tutor_applications').select('id').eq('user_id', user.id).limit(1),
    supabase.from('affiliates').select('id').eq('user_id', user.id).maybeSingle(),
    supabase.from('profiles').select('onboarded,is_admin').eq('id', user.id).maybeSingle(),
  ])
  const isAdmin = Boolean(profile.data?.is_admin)
  const onboarded = Boolean(profile.data?.onboarded)
  let role: AccountRole = 'student'
  if (tutor.data || (application.data?.length ?? 0) > 0 || intent === 'tutor') role = 'tutor'
  else if ((intent === 'affiliate' || affiliate.data) && !(onboarded && intent !== 'affiliate')) role = 'affiliate'
  return { role, isAdmin }
}

async function ownTutorSlug(userId: string): Promise<string | null> {
  const { data, error } = await supabase.from('tutors').select('slug').eq('user_id', userId).maybeSingle()
  return error ? null : ((data?.slug as string | undefined) ?? null)
}

/** Where to send someone after signing in when they were not on their way somewhere. */
export async function homeAfterSignIn(): Promise<string> {
  const { data } = await supabase.auth.getUser()
  if (!data.user) return '/'
  try {
    return ROLE_HOME[(await fetchAccountInfo(data.user)).role]
  } catch {
    return '/'
  }
}

/** The signed-in account's role (null while signed out or still loading). */
export function useAccountRole(): { role: AccountRole | null; isAdmin: boolean; loading: boolean; tutorSlug: string | null } {
  const { user, loading: authLoading } = useAuth()
  const query = useQuery({
    queryKey: ['account-role', user?.id ?? null],
    enabled: !!user,
    staleTime: 5 * 60_000,
    queryFn: () => fetchAccountInfo(user!),
  })
  if (!user) return { role: null, isAdmin: false, loading: authLoading, tutorSlug: null }
  return { role: query.data?.role ?? null, isAdmin: query.data?.isAdmin ?? false, loading: query.isLoading, tutorSlug: query.data?.tutorSlug ?? null }
}

const under = (pathname: string, ...prefixes: string[]) => prefixes.some((p) => pathname === p || pathname.startsWith(p + '/'))

/** Student-only screens: a tutor or affiliate who reaches one is taken to their own home instead. */
export function isStudentOnlyPath(pathname: string): boolean {
  return pathname === '/' || under(pathname, '/onboarding', '/subjects', '/subject', '/topic', '/lesson', '/practice', '/paper', '/progress', '/tutor', '/subscribe')
}
