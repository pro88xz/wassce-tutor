// The tutor marketplace on /tutors and /tutors/{subject}: tutors with their
// photo, subjects, lessons a week and the monthly fee they set. On /tutors the
// subjects that tutors teach are chips with counts; a search finds a name or
// an area (also filled from ?area=), and tutors can be sorted by newest,
// lowest fee or most experience.
//
// "Book this tutor" lets the student pick one or more subjects and, if the
// tutor takes small groups, how many are learning together. The price adds up
// as they choose, with the tutor's own discounts. If the student agrees, the
// database (request_tutor(), migration 19) works out the same price, records
// the request, tells the tutor, and returns the tutor's WhatsApp number; then
// WhatsApp opens with a message ready to send. Lessons are in person, arranged
// and paid directly with the tutor.
//
// Anyone can browse. A signed-out visitor who taps "Book this tutor" is sent
// to sign up or sign in, and comes straight back here with that booking open
// (src/lib/book-return.ts, src/lib/return-to.ts).
import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, BadgeCheck, GraduationCap, MapPin, Search, Star, Tag, Users, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/lib/queries'
import { monthlyFee } from '@/lib/tutors'
import { lessonsText, listText, nle, paymentText, quote, type TutorOffer } from '@/lib/tutor-pricing'
import { WhatsAppGlyph } from '@/components/WhatsAppGlyph'
import { useSendToSignIn } from '@/lib/use-send-to-sign-in'
import { bookingReturnPath, readBookIntent, type BookIntent } from '@/lib/book-return'

export type Rate = { subject_id: string; price_nle: number; lessons_per_week: number | null; subject: { id: string; name: string } | null }
export type Tutor = {
  id: string
  avatar_path: string | null
  full_name: string
  bio: string
  qualifications: string
  experience_years: number
  location: string
  verified_at: string
  multi_subject_discount_pct: number
  group_max: number | null
  group_discount_pct: number
  payment_methods: string[]
  tutor_subjects: Rate[]
  tutor_booking_reviews: { rating: number }[]
}
type Request = {
  whatsapp: string
  tutor_name: string
  location: string
  subjects: { id: string; name: string; price_nle: number; lessons_per_week: number | null }[]
  students: number
  subtotal: number
  subject_discount_pct: number
  group_discount_pct: number
  per_student: number
  total: number
}
type Sort = 'newest' | 'fee' | 'experience'

const photoUrl = (path: string) => supabase.storage.from('tutor-profile-images').getPublicUrl(path).data.publicUrl
const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name
const initials = (name: string) => name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('')
const experience = (years: number) => (years === 0 ? 'New tutor' : `${years} ${years === 1 ? 'year' : 'years'} teaching`)
const offerOf = (t: Tutor): TutorOffer => ({ multiSubjectDiscountPct: t.multi_subject_discount_pct ?? 0, groupMax: t.group_max, groupDiscountPct: t.group_discount_pct ?? 0 })
const byName = (a: Rate, b: Rate) => (a.subject?.name ?? '').localeCompare(b.subject?.name ?? '')
/** The lowest monthly fee: for one subject when it is given, otherwise across all the tutor's subjects. */
const lowestFee = (t: Tutor, subjectId?: string) => {
  const fees = t.tutor_subjects.filter((r) => !subjectId || r.subject_id === subjectId).map((r) => Number(r.price_nle)).filter((n) => n > 0)
  return fees.length ? Math.min(...fees) : null
}
const SORTS: [Sort, string][] = [
  ['newest', 'Newest'],
  ['fee', 'Lowest fee'],
  ['experience', 'Most experience'],
]

/** The blue tick shown beside every tutor's name in the marketplace. */
export function VerifiedBadge({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <span className="inline-flex shrink-0" title="Tutor on WASSCE Tutor">
      <BadgeCheck className={`${className} fill-[#1d9bf0] text-white`} aria-hidden />
      <span className="sr-only">Tutor on WASSCE Tutor</span>
    </span>
  )
}

export function TutorMarketplace({ subjectId, subjectName }: { subjectId?: string; subjectName?: string }) {
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [loading, setLoading] = useState(true)
  // ?area= lets a link open the marketplace already searching an area.
  const [query, setQuery] = useState(() => (typeof window === 'undefined' ? '' : (new URLSearchParams(window.location.search).get('area') ?? '').slice(0, 60)))
  const [subjectFilter, setSubjectFilter] = useState(subjectId ?? 'all')
  const [sort, setSort] = useState<Sort>('newest')
  const [booking, setBooking] = useState<Tutor | null>(null)
  const [reopened, setReopened] = useState<BookIntent | null>(null)
  const { user } = useAuth()
  const sendToSignIn = useSendToSignIn()
  const preferredSubject = subjectFilter === 'all' ? subjectId : subjectFilter

  /** Signed in: open the booking. Signed out: sign up or sign in first, then back here with it open. */
  const book = (tutor: Tutor, subjects?: string[], students = 1) => {
    if (user) {
      setReopened(null)
      setBooking(tutor)
      return
    }
    const chosen = subjects ?? (preferredSubject && tutor.tutor_subjects.some((s) => s.subject_id === preferredSubject) ? [preferredSubject] : [])
    sendToSignIn(bookingReturnPath(window.location.pathname, { tutor: tutor.id, subjects: chosen, students }), { forName: firstName(tutor.full_name) })
  }

  useEffect(() => {
    let active = true
    void supabase
      .from('tutors')
      .select('id,avatar_path,full_name,bio,qualifications,experience_years,location,verified_at,multi_subject_discount_pct,group_max,group_discount_pct,payment_methods,tutor_subjects(subject_id,price_nle,lessons_per_week,subject:subjects(id,name)),tutor_booking_reviews(rating)')
      .eq('status', 'active')
      .eq('listed', true)
      .order('verified_at', { ascending: false })
      .then((tutorResult) => {
        if (!active) return
        const list = tutorResult.error ? [] : ((tutorResult.data ?? []) as unknown as Tutor[])
        if (!tutorResult.error) setTutors(list)
        // Back from signing in to book a tutor: open that booking, once (a
        // refresh, or coming back to this page later, does not reopen it).
        const intent = readBookIntent(window.location.search)
        if (intent) {
          window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.hash}`)
          const tutor = list.find((t) => t.id === intent.tutor)
          if (tutor) {
            setReopened(intent)
            setBooking(tutor)
          }
        }
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [subjectId])

  // On a subject's page only that subject's tutors count.
  const pool = useMemo(() => (subjectId ? tutors.filter((t) => t.tutor_subjects.some((s) => s.subject_id === subjectId)) : tutors), [tutors, subjectId])

  /** The subjects tutors teach, most tutors first: the filter chips. */
  const taught = useMemo(() => {
    const counts = new Map<string, { id: string; name: string; count: number }>()
    for (const t of pool)
      for (const r of t.tutor_subjects) {
        if (!r.subject) continue
        const c = counts.get(r.subject_id) ?? { id: r.subject_id, name: r.subject.name, count: 0 }
        c.count += 1
        counts.set(r.subject_id, c)
      }
    return [...counts.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
  }, [pool])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = pool.filter((t) => {
      const text = `${t.full_name} ${t.location} ${t.qualifications} ${t.tutor_subjects.map((s) => s.subject?.name).join(' ')}`.toLowerCase()
      return (!q || text.includes(q)) && (subjectFilter === 'all' || t.tutor_subjects.some((s) => s.subject_id === subjectFilter))
    })
    const subject = subjectFilter === 'all' ? subjectId : subjectFilter
    if (sort === 'fee') return [...list].sort((a, b) => (lowestFee(a, subject) ?? Infinity) - (lowestFee(b, subject) ?? Infinity))
    if (sort === 'experience') return [...list].sort((a, b) => b.experience_years - a.experience_years)
    return list
  }, [pool, query, subjectFilter, sort, subjectId])

  if (loading) {
    return (
      <section id="tutors" className="scroll-mt-24" aria-busy="true" aria-label="Loading tutors">
        <div className="h-24 w-full max-w-xl animate-pulse rounded-2xl bg-muted" />
        <ul className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <li key={i} className="overflow-hidden rounded-[1.5rem] border border-border bg-[var(--card)]">
              <div className="aspect-[5/4] animate-pulse bg-muted" />
              <div className="space-y-3 p-5">
                <div className="h-3 w-2/3 animate-pulse rounded-full bg-muted" />
                <div className="h-3 w-full animate-pulse rounded-full bg-muted" />
                <div className="h-11 animate-pulse rounded-xl bg-muted" />
              </div>
            </li>
          ))}
        </ul>
      </section>
    )
  }

  if (pool.length === 0) return <NoTutorsYet subjectName={subjectName} />

  const count = visible.length
  return (
    <section id="tutors" className="scroll-mt-24" aria-labelledby="tutors-list">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="site-eyebrow">{subjectName ? `${subjectName} · in person` : 'The marketplace'}</p>
          <h2 id="tutors-list" className="site-h2 mt-3">
            {pool.length} private {subjectName ? `${subjectName} ${pool.length === 1 ? 'tutor' : 'tutors'}` : pool.length === 1 ? 'tutor' : 'tutors'}{' '}
            <span className="site-accent text-[var(--primary)]">ready to teach.</span>
          </h2>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Each tutor sets their own monthly fee. See the price for your subjects before you message them on WhatsApp.
          </p>
        </div>
        <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] gap-2 sm:w-auto sm:grid-cols-[17rem_auto]">
          <label className="relative">
            <span className="sr-only">Search by name or area</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name or area"
              className="h-12 w-full rounded-xl border border-border bg-[var(--card)] pl-10 pr-9 text-[15px] shadow-[inset_0_1px_2px_rgb(23_28_43/4%)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--primary)_14%,transparent)]"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted" aria-label="Clear the search">
                <X className="h-4 w-4" aria-hidden />
              </button>
            )}
          </label>
          <label>
            <span className="sr-only">Sort tutors</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="h-12 rounded-xl border border-border bg-[var(--card)] px-3 text-[15px] font-medium outline-none focus:border-[var(--primary)]"
            >
              {SORTS.map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {!subjectId && taught.length > 1 && (
        <div className="relative mt-7">
        <div className="overflow-x-auto pb-1 [mask-image:linear-gradient(90deg,#000_calc(100%-3rem),transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="flex w-max gap-2 pr-12" aria-label="Filter by subject">
            {[{ id: 'all', name: 'All subjects', count: pool.length }, ...taught].map((s) => {
              const on = subjectFilter === s.id
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setSubjectFilter(s.id)}
                    className={`inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-[14px] font-semibold transition ${
                      on
                        ? 'border-transparent bg-[var(--site-ink)] text-white dark:bg-white dark:text-[var(--site-ink)]'
                        : 'border-border bg-[var(--card)] text-foreground hover:border-[color-mix(in_srgb,var(--primary)_45%,var(--border))]'
                    }`}
                  >
                    {s.name}
                    <span className={`rounded-full px-1.5 text-[12px] tabular-nums ${on ? 'bg-white/15 dark:bg-[var(--site-ink)]/10' : 'bg-muted text-muted-foreground'}`}>{s.count}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {count} {count === 1 ? 'tutor' : 'tutors'} shown
      </p>

      {count === 0 ? (
        <div className="mt-8 rounded-[1.5rem] border border-dashed border-border bg-[var(--card)] px-6 py-14 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <GraduationCap className="h-6 w-6" aria-hidden />
          </span>
          <h3 className="mt-4 text-lg font-bold">No tutors match “{query.trim() || 'this search'}”</h3>
          <p className="mx-auto mt-1 max-w-md text-[15px] text-muted-foreground">Try another area or subject, or tell us what you need below and we will find you a tutor.</p>
          <button type="button" onClick={() => { setQuery(''); setSubjectFilter(subjectId ?? 'all') }} className="site-btn site-btn-secondary mt-5">
            Show every tutor
          </button>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((tutor) => (
            <li key={tutor.id}>
              <TutorCard tutor={tutor} subjectId={preferredSubject} onBook={() => book(tutor)} />
            </li>
          ))}
        </ul>
      )}

      {booking && (
        <BookDialog
          tutor={booking}
          preferredSubject={preferredSubject}
          initialSubjects={reopened?.tutor === booking.id ? reopened.subjects : undefined}
          initialStudents={reopened?.tutor === booking.id ? reopened.students : undefined}
          onSignIn={(subjects, students) => book(booking, subjects, students)}
          onClose={() => setBooking(null)}
        />
      )}
    </section>
  )
}

/** No tutors listed yet (or none for this subject): ask us to find one, or teach it. */
function NoTutorsYet({ subjectName }: { subjectName?: string }) {
  return (
    <section
      id="tutors"
      className="relative isolate scroll-mt-24 overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#f4f0ff,#ffffff_55%,#fff7e6)] ring-1 ring-[color-mix(in_srgb,var(--primary)_12%,transparent)] dark:bg-[linear-gradient(135deg,#221c3a,#1a1626_55%,#2a2216)]"
      aria-labelledby="tutors-list"
    >
      <div aria-hidden className="absolute inset-0 -z-10 opacity-70 [background-image:radial-gradient(rgba(91,52,214,.10)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(70%_70%_at_80%_40%,#000,transparent)]" />
      <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)] lg:gap-14 lg:px-14">
        <div>
          <p className="site-eyebrow inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            The marketplace
          </p>
          <h2 id="tutors-list" className="site-h2 mt-4">
            {subjectName ? `${subjectName} tutors are` : 'Tutors are'} <span className="site-accent text-[var(--primary)]">joining now.</span>
          </h2>
          <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-muted-foreground">
            New tutors appear here as soon as they join. Until there is one near you, tell us your subject and area and we will find you a tutor for in-person lessons.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a href="#book" className="site-btn site-btn-lg site-btn-primary">
              Find me a tutor <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a href="/become-a-tutor" className="site-link">
              Teach {subjectName ?? 'WASSCE'}? Join as a tutor
            </a>
          </div>
        </div>
        {/* Cards waiting to be filled: the shape of the marketplace, without pretending anyone is in it. */}
        <div className="relative mx-auto hidden h-72 w-full max-w-md sm:block" aria-hidden>
          {['left-0 top-7 -rotate-6', 'left-1/2 top-0 z-10 -translate-x-1/2', 'right-0 top-7 rotate-6'].map((pos, i) => (
            <div key={i} className={`absolute w-44 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-900/[.06] shadow-[0_24px_48px_-28px_rgba(40,20,95,.45)] dark:bg-white/10 ${pos}`}>
              <div className="flex aspect-[5/4] items-end bg-gradient-to-br from-[#ede7ff] to-[#d9ccff] p-3 dark:from-white/10 dark:to-white/5">
                <span className="h-2.5 w-2/3 rounded-full bg-white/80" />
              </div>
              <div className="space-y-2 p-3.5">
                <span className="block h-2 w-3/4 rounded-full bg-slate-200 dark:bg-white/20" />
                <span className="block h-2 w-1/2 rounded-full bg-slate-100 dark:bg-white/10" />
                <span className={`mt-3 block h-7 rounded-lg ${i === 1 ? 'bg-[var(--primary)]' : 'bg-[color-mix(in_srgb,var(--primary)_35%,white)]'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/** The tutor's own offers: a discount for several subjects, small groups. */
function OfferChips({ tutor }: { tutor: Tutor }) {
  const multi = tutor.multi_subject_discount_pct > 0 && tutor.tutor_subjects.length > 1
  if (!multi && !tutor.group_max) return null
  return (
    <ul className="mt-3.5 flex flex-wrap gap-1.5 text-[12px] font-semibold" aria-label="Offers">
      {multi && (
        <li className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200">
          <Tag className="h-3.5 w-3.5" aria-hidden /> {tutor.multi_subject_discount_pct}% off 2+ subjects
        </li>
      )}
      {tutor.group_max && (
        <li className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-sky-800 dark:bg-sky-500/15 dark:text-sky-200">
          <Users className="h-3.5 w-3.5" aria-hidden /> Groups up to {tutor.group_max}
          {tutor.group_discount_pct > 0 && ` · ${tutor.group_discount_pct}% off each`}
        </li>
      )}
    </ul>
  )
}

/** A tutor's card. With `preview`, it is the tutor's own preview (application, dashboard): same look, nothing to tap. */
export function TutorCard({ tutor, subjectId, onBook, preview = false, photoSrc }: { tutor: Tutor; subjectId?: string; onBook?: () => void; preview?: boolean; photoSrc?: string | null }) {
  const photo = photoSrc ?? (tutor.avatar_path ? photoUrl(tutor.avatar_path) : null)
  const reviews = tutor.tutor_booking_reviews
  const rating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null
  // The chosen subject first, then the rest.
  const rates = [...tutor.tutor_subjects].sort((a, b) => Number(b.subject_id === subjectId) - Number(a.subject_id === subjectId) || byName(a, b))
  const from = lowestFee(tutor, subjectId && rates.some((r) => r.subject_id === subjectId) ? subjectId : undefined)
  const shown = 3
  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[color-mix(in_srgb,var(--border)_70%,transparent)] bg-[var(--card)] shadow-[var(--site-shadow-card)] ${
        preview ? '' : 'transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[var(--site-shadow-raised)]'
      }`}
    >
      <div className="relative aspect-[5/4] overflow-hidden bg-gradient-to-br from-[#7c5cff] to-[#3b1f9e]">
        {photo ? (
          <img
            src={photo}
            alt={`${tutor.full_name}, WASSCE tutor`}
            className={`h-full w-full object-cover object-top ${preview ? '' : 'transition duration-700 ease-out group-hover:scale-[1.04]'}`}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center pb-10 text-6xl font-extrabold tracking-tight text-white/90" aria-hidden>
            {initials(tutor.full_name)}
          </span>
        )}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#130d2b]/90 via-[#130d2b]/10 via-55% to-transparent" />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          {rating !== null ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[12px] font-bold text-slate-900 shadow-sm">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden /> {rating.toFixed(1)}
              <span className="font-medium text-slate-500">({reviews.length})</span>
            </span>
          ) : (
            <span />
          )}
          {from !== null && (
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-[12px] font-semibold text-slate-600 shadow-sm">
              from <span className="font-bold text-slate-900">{nle(from)}</span>/mo
            </span>
          )}
        </div>
        <div className="absolute inset-x-4 bottom-3.5 text-white">
          <h3 className="flex items-center gap-1.5 text-[1.3rem] font-bold leading-tight tracking-[-0.02em] [text-shadow:0_1px_12px_rgba(0,0,0,.35)]">
            <span className="truncate">{tutor.full_name}</span>
            <VerifiedBadge className="h-5 w-5" />
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-[13px] font-medium text-white/85">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span className="truncate">{tutor.location}</span>
            <span className="text-white/45" aria-hidden>
              ·
            </span>
            <span className="shrink-0">{experience(tutor.experience_years)}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-start gap-2 text-[13.5px] font-semibold text-foreground/85">
          <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" aria-hidden />
          <span className="line-clamp-1">{tutor.qualifications}</span>
        </p>
        <p className="mt-2 line-clamp-2 text-[14.5px] leading-relaxed text-muted-foreground">{tutor.bio}</p>
        <OfferChips tutor={tutor} />
        <ul className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border" aria-label="Subjects and monthly fees">
          {rates.slice(0, shown).map((r) => (
            <li key={r.subject_id} className={`flex items-center justify-between gap-3 px-3.5 py-2.5 ${r.subject_id === subjectId ? 'bg-[var(--brand-soft)]' : ''}`}>
              <span className="min-w-0">
                <span className="block truncate text-[14px] font-semibold">{r.subject?.name}</span>
                {r.lessons_per_week && <span className="block text-[12px] text-muted-foreground">{lessonsText(r.lessons_per_week)}</span>}
              </span>
              <span className="shrink-0 text-[14px] font-bold tabular-nums">{monthlyFee(r.price_nle)}</span>
            </li>
          ))}
          {rates.length > shown && (
            <li className="px-3.5 py-2 text-[12.5px] font-medium text-muted-foreground">
              + {rates.length - shown} more {rates.length - shown === 1 ? 'subject' : 'subjects'}
            </li>
          )}
        </ul>
        <div className="mt-auto pt-5">
          {preview ? (
            <span className="site-btn site-btn-primary w-full" aria-hidden>
              Book this tutor
            </span>
          ) : (
            <button type="button" onClick={onBook} className="site-btn site-btn-primary w-full">
              Book this tutor <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

/** The message the student sends, from the price the database worked out. */
function whatsappMessage(tutorFirstName: string, r: Request, student: string | null): string {
  const names = listText(r.subjects.map((s) => s.name))
  const discounts = [
    r.subject_discount_pct > 0 ? `${r.subject_discount_pct}% discount for ${r.subjects.length} subjects` : null,
    r.group_discount_pct > 0 ? `${r.group_discount_pct}% group discount` : null,
  ].filter((d): d is string => !!d)
  const fee = r.students > 1 ? `${nle(Number(r.per_student))} a month each (${nle(Number(r.total))} in total)` : `${nle(Number(r.per_student))} a month`
  return [
    `Hello ${tutorFirstName}, I found you on WASSCE Tutor.`,
    r.students > 1
      ? `We are ${r.students} students and would like in-person lessons in ${names} together, at your fee of ${fee}${discounts.length ? `, with your ${listText(discounts)}` : ''}.`
      : `I would like in-person lessons in ${names} at your fee of ${fee}${discounts.length ? `, with your ${listText(discounts)}` : ''}.`,
    student ? `My name is ${student}. When could we start?` : 'When could we start?',
  ].join(' ')
}

function BookDialog({
  tutor,
  preferredSubject,
  initialSubjects,
  initialStudents,
  onSignIn,
  onClose,
}: {
  tutor: Tutor
  preferredSubject?: string
  /** What they had chosen before signing in, to carry on where they left off. */
  initialSubjects?: string[]
  initialStudents?: number
  onSignIn: (subjects: string[], students: number) => void
  onClose: () => void
}) {
  const { user } = useAuth()
  const { data: profile } = useProfile(user?.id ?? null)
  const offered = useMemo(() => [...tutor.tutor_subjects].sort((a, b) => Number(b.subject_id === preferredSubject) - Number(a.subject_id === preferredSubject) || byName(a, b)), [tutor, preferredSubject])
  const [chosen, setChosen] = useState<string[]>(() => {
    const before = (initialSubjects ?? []).filter((id) => offered.some((s) => s.subject_id === id))
    return before.length ? before : offered[0] ? [offered[0].subject_id] : []
  })
  const [students, setStudents] = useState(() => Math.max(1, Math.min(initialStudents ?? 1, tutor.group_max ?? 1)))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null)
  const name = firstName(tutor.full_name)
  const offer = offerOf(tutor)
  const picked = offered.filter((s) => chosen.includes(s.subject_id))
  const q = quote(picked.map((s) => ({ price: Number(s.price_nle), lessonsPerWeek: s.lessons_per_week })), offer, students)
  // The discount lines add up exactly to the price shown: any rounding goes
  // into the last discount.
  const subjectSaving = q.groupDiscountPct > 0 ? Math.round((q.subtotal * q.subjectDiscountPct) / 100) : Math.max(0, q.subtotal - q.perStudent)
  const groupSaving = Math.round((q.subtotal - subjectSaving - q.perStudent) * 100) / 100
  const pays = paymentText(tutor.payment_methods ?? [])
  const toggle = (id: string) => setChosen((now) => (now.includes(id) ? (now.length > 1 ? now.filter((x) => x !== id) : now) : [...now, id]))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const agree = async () => {
    if (!user) {
      onSignIn(chosen, students)
      return
    }
    if (picked.length === 0) return
    setBusy(true)
    setError(null)
    const { data, error: requestError } = await supabase.rpc('request_tutor', { p_tutor: tutor.id, p_subjects: chosen, p_students: students })
    const row = (Array.isArray(data) ? data[0] : data) as Request | undefined
    if (requestError || !row?.whatsapp) {
      setError(requestError?.message ?? 'Could not reach this tutor right now. Please try again.')
      setBusy(false)
      return
    }
    const url = `https://wa.me/${row.whatsapp}?text=${encodeURIComponent(whatsappMessage(name, row, firstName(profile?.full_name ?? '') || null))}`
    setWhatsappUrl(url)
    setBusy(false)
    window.location.assign(url)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section role="dialog" aria-modal="true" aria-labelledby="book-title" className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white text-slate-900 shadow-2xl sm:rounded-3xl">
        <div className="flex items-center gap-4 border-b p-5">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-violet-800">
            {tutor.avatar_path ? (
              <img src={photoUrl(tutor.avatar_path)} alt="" className="h-full w-full object-cover object-top" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xl font-bold text-white" aria-hidden>{initials(tutor.full_name)}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-violet-700">Book a tutor</p>
            <h2 id="book-title" className="flex items-center gap-1.5 text-lg font-bold">
              <span className="truncate">{tutor.full_name}</span>
              <VerifiedBadge />
            </h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100" aria-label="Close">
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {offered.length > 1 && (
            <fieldset>
              <legend className="text-sm font-semibold">Subjects</legend>
              <p className="mb-2 text-xs text-slate-500">
                Choose all you want with {name}.
                {offer.multiSubjectDiscountPct > 0 && <strong className="font-semibold text-emerald-700"> 2 or more: {offer.multiSubjectDiscountPct}% off.</strong>}
              </p>
              <div className="space-y-2">
                {offered.map((s) => {
                  const on = chosen.includes(s.subject_id)
                  return (
                    <label key={s.subject_id} className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-3.5 py-3 text-sm ${on ? 'border-violet-500 bg-violet-50' : ''}`}>
                      <span className="flex min-w-0 items-center gap-2.5">
                        <input type="checkbox" checked={on} onChange={() => toggle(s.subject_id)} className="h-4 w-4 shrink-0 accent-[#6438d8]" />
                        <span className="min-w-0">
                          <span className="block font-medium">{s.subject?.name}</span>
                          {s.lessons_per_week && <span className="block text-xs text-slate-500">{lessonsText(s.lessons_per_week)}</span>}
                        </span>
                      </span>
                      <span className="shrink-0 font-semibold">{nle(Number(s.price_nle))}</span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          )}

          {tutor.group_max && (
            <fieldset>
              <legend className="text-sm font-semibold">Who is learning?</legend>
              <p className="mb-2 text-xs text-slate-500">
                Learn with friends, classmates or brothers and sisters.
                {offer.groupDiscountPct > 0 && <strong className="font-semibold text-emerald-700"> In a group, each of you pays {offer.groupDiscountPct}% less.</strong>}
              </p>
              <div className="flex gap-2" role="group" aria-label="Number of students">
                {Array.from({ length: tutor.group_max }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={students === n}
                    aria-label={n === 1 ? 'Just me' : `${n} students`}
                    onClick={() => setStudents(n)}
                    className={`min-h-11 min-w-11 rounded-xl border text-sm font-semibold transition ${n === 1 ? 'px-4' : 'flex-1 px-2'} ${students === n ? 'border-violet-500 bg-violet-50 text-violet-800' : 'hover:border-violet-300'}`}
                  >
                    {n === 1 ? 'Just me' : n}
                  </button>
                ))}
              </div>
              {students > 1 && <p className="mt-1.5 text-xs text-slate-500">{students} students learning together</p>}
            </fieldset>
          )}

          <div className="rounded-2xl bg-violet-50 p-4">
            {picked.length === 1 && students === 1 ? (
              <p className="text-sm text-slate-700">{name}’s fee for {picked[0].subject?.name} is</p>
            ) : (
              <dl className="space-y-1 text-sm text-slate-700">
                {picked.map((s) => (
                  <div key={s.subject_id} className="flex justify-between gap-3"><dt>{s.subject?.name}</dt><dd>{nle(Number(s.price_nle))}</dd></div>
                ))}
                {subjectSaving > 0 && (
                  <div className="flex justify-between gap-3 font-semibold text-emerald-700"><dt>{q.subjectDiscountPct}% off for {q.subjects} subjects</dt><dd>−{nle(subjectSaving)}</dd></div>
                )}
                {groupSaving > 0 && (
                  <div className="flex justify-between gap-3 font-semibold text-emerald-700"><dt>{q.groupDiscountPct}% off each, group of {students}</dt><dd>−{nle(groupSaving)}</dd></div>
                )}
                <div className="!mt-2 border-t border-violet-200/80" aria-hidden />
              </dl>
            )}
            <p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
              {nle(q.perStudent)} <span className="text-base font-semibold text-slate-600">a month{students > 1 ? ' each' : ''}</span>
            </p>
            {students > 1 && <p className="text-sm font-semibold text-slate-700">{nle(q.total)} a month for all {students} of you</p>}
            {q.perLesson !== null && q.lessonsPerWeek !== null && (
              <p className="mt-0.5 text-xs text-slate-500">About {nle(q.perLesson)} a lesson{students > 1 ? ' each' : ''} · {lessonsText(q.lessonsPerWeek)}</p>
            )}
            {offer.multiSubjectDiscountPct > 0 && picked.length === 1 && offered.length > 1 && (
              <p className="mt-2 text-xs font-semibold text-emerald-700">Add another subject and {name} takes {offer.multiSubjectDiscountPct}% off.</p>
            )}
            <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
              <li>• Lessons are in person, in or near {tutor.location}.</li>
              <li>• You agree the days, times and place with {name}.</li>
              <li>• Pay {name} directly{pays ? ` (${pays})` : ''}. WASSCE Tutor does not take payment for tutoring.</li>
            </ul>
          </div>

          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        </div>

        <div className="border-t bg-white p-4 sm:px-5">
          {whatsappUrl ? (
            <div className="space-y-2 text-center">
              <p className="text-sm text-slate-600">Opening WhatsApp…</p>
              <a href={whatsappUrl} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 font-bold text-white">
                <WhatsAppGlyph /> Open WhatsApp
              </a>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-center text-sm font-semibold">Do you agree to {students > 1 ? `${nle(q.perStudent)} a month each` : `${nle(q.perStudent)} a month`}?</p>
              <button type="button" disabled={busy || picked.length === 0} onClick={() => void agree()} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 font-bold text-white transition hover:brightness-95 disabled:opacity-60">
                <WhatsAppGlyph /> {busy ? 'Opening WhatsApp…' : user ? `Yes, message ${name} on WhatsApp` : `Sign in to message ${name}`}
              </button>
              <button type="button" onClick={onClose} className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl px-4 text-sm font-semibold text-slate-600 hover:bg-slate-100">
                No, go back
              </button>
              {!user && <p className="text-center text-xs text-slate-500">A free account keeps tutors’ numbers private and shows them the message comes from a real student.</p>}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
