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
import { ArrowRight, GraduationCap, MapPin, Search, Star, Tag, Users, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { monthlyFee } from '@/lib/tutors'
import { lessonsText, nle } from '@/lib/tutor-pricing'
import { TUTOR_COLUMNS, displayName, tutorPagePath } from '@/lib/tutor-profile'
import { shortSubject } from '@/lib/tutor-seo'
import { TUTOR_HUB_HOW } from '@/lib/public-rules'
import { byName, initials, photoUrl } from './tutor-display'
import { VerifiedBadge } from './VerifiedBadge'
import { useTutorBooking } from './use-tutor-booking'

export type Rate = { subject_id: string; price_nle: number; lessons_per_week: number | null; subject: { id: string; name: string; slug?: string } | null }
export type Tutor = {
  id: string
  /** The tutor's page, /tutors/{slug} (migration 28). */
  slug?: string
  /** A verified lesson reviewer (migration 28). */
  reviewer?: boolean
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
type Sort = 'newest' | 'fee' | 'experience'

const experience = (years: number) => (years === 0 ? 'New tutor' : `${years} ${years === 1 ? 'year' : 'years'} teaching`)
/** The lowest monthly fee: for one subject when it is given, otherwise across all the tutor's subjects. */
const lowestFee = (t: Tutor, subjectId?: string) => {
  const fees = t.tutor_subjects.filter((r) => !subjectId || r.subject_id === subjectId).map((r) => Number(r.price_nle)).filter((n) => n > 0)
  return fees.length ? Math.min(...fees) : null
}
/** A bio cut at a word near `max` characters, with an ellipsis when cut. */
function bioPreview(bio: string, max = 150): string {
  const text = bio.trim().replace(/\s+/g, ' ')
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  return `${cut.slice(0, cut.lastIndexOf(' ') > 80 ? cut.lastIndexOf(' ') : max).replace(/[,;:.\s]+$/, '')}…`
}

/** How many tutors a list needs before search and sort are shown. */
const SEARCH_FROM = 4
const SORTS: [Sort, string][] = [
  ['newest', 'Newest'],
  ['fee', 'Lowest fee'],
  ['experience', 'Most experience'],
]



export function TutorMarketplace({
  subjectId,
  subjectName,
  initialTutors,
  emptyState = true,
}: {
  subjectId?: string
  subjectName?: string
  /** Show the "no tutors yet" panel when the list is empty (a subject's page says so itself, with the request form beside it). */
  emptyState?: boolean
  /** Tutors the page was built with (a subject's page), so its cards are in the HTML from the start; the list is still refreshed here. */
  initialTutors?: Tutor[]
}) {
  const [tutors, setTutors] = useState<Tutor[]>(initialTutors ?? [])
  const [loading, setLoading] = useState(!initialTutors)
  // ?area= lets a link open the marketplace already searching an area.
  const [query, setQuery] = useState(() => (typeof window === 'undefined' ? '' : (new URLSearchParams(window.location.search).get('area') ?? '').slice(0, 60)))
  const [subjectFilter, setSubjectFilter] = useState(subjectId ?? 'all')
  const [sort, setSort] = useState<Sort>('newest')
  const preferredSubject = subjectFilter === 'all' ? subjectId : subjectFilter
  const { book, reopen, dialog } = useTutorBooking(preferredSubject)

  useEffect(() => {
    let active = true
    void supabase
      .from('tutors')
      .select(TUTOR_COLUMNS)
      .eq('status', 'active')
      .eq('listed', true)
      .order('verified_at', { ascending: false })
      .then((tutorResult) => {
        if (!active) return
        const list = tutorResult.error ? [] : ((tutorResult.data ?? []) as unknown as Tutor[])
        if (!tutorResult.error) setTutors(list)
        reopen(list)
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [subjectId, reopen])

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

  if (pool.length === 0) return emptyState ? <NoTutorsYet subjectName={subjectName} /> : null

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
            {subjectName ? (
              <a href={TUTOR_HUB_HOW} className="site-link">
                How booking a {shortSubject(subjectName)} tutor works
              </a>
            ) : (
              'Each tutor sets their own monthly fee. See the price for your subjects before you message them on WhatsApp.'
            )}
          </p>
        </div>
        {/* Searching and sorting help once there are a few tutors to choose between. */}
        {pool.length >= SEARCH_FROM && (
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
        )}
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
          {visible.map((tutor, i) => (
            <li key={tutor.id}>
              <TutorCard tutor={tutor} subjectId={preferredSubject} onBook={() => book(tutor)} priority={i === 0} />
            </li>
          ))}
        </ul>
      )}

      {dialog}
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
          {subjectName ? (
            <>
              <h2 id="tutors-list" className="site-h2 mt-4">
                No {subjectName} tutor <span className="site-accent text-[var(--primary)]">listed yet.</span>
              </h2>
              <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-muted-foreground">
                The first {shortSubject(subjectName)} tutor to join appears here, with their town and {shortSubject(subjectName)} fee. Meanwhile, ask us below.
              </p>
            </>
          ) : (
            <>
              <h2 id="tutors-list" className="site-h2 mt-4">
                Tutors are <span className="site-accent text-[var(--primary)]">joining now.</span>
              </h2>
              <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-muted-foreground">
                New tutors appear here as soon as they join. Until there is one near you, tell us your subject and area and we will find you a tutor for in-person lessons.
              </p>
            </>
          )}
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
export function TutorCard({ tutor, subjectId, onBook, preview = false, photoSrc, priority = false }: { tutor: Tutor; subjectId?: string; onBook?: () => void; preview?: boolean; photoSrc?: string | null; /** The first card: on screen at once, so its photo loads immediately. */ priority?: boolean }) {
  const photo = photoSrc ?? (tutor.avatar_path ? photoUrl(tutor.avatar_path) : null)
  const reviews = tutor.tutor_booking_reviews
  const rating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null
  // The chosen subject first, then the rest.
  const rates = [...tutor.tutor_subjects].sort((a, b) => Number(b.subject_id === subjectId) - Number(a.subject_id === subjectId) || byName(a, b))
  const from = lowestFee(tutor, subjectId && rates.some((r) => r.subject_id === subjectId) ? subjectId : undefined)
  const page = !preview && tutor.slug ? tutorPagePath(tutor.slug) : null
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
            alt={`${displayName(tutor.full_name)}, WASSCE tutor`}
            className={`h-full w-full object-cover object-top ${preview ? '' : 'transition duration-700 ease-out group-hover:scale-[1.04]'}`}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center pb-10 text-6xl font-extrabold tracking-tight text-white/90" aria-hidden>
            {initials(tutor.full_name)}
          </span>
        )}
        {/* The whole photo opens the tutor's page (the name below is the same link, for screen readers). */}
        {page && <a href={page} tabIndex={-1} aria-hidden className="absolute inset-0 z-[1]" />}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#130d2b]/90 via-[#130d2b]/10 via-55% to-transparent" />
        <div className="pointer-events-none absolute inset-x-3 top-3 z-[2] flex items-start justify-between gap-2">
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
        <div className="pointer-events-none absolute inset-x-4 bottom-3.5 z-[2] text-white">
          <h3 className="flex items-center gap-1.5 text-[1.3rem] font-bold leading-tight tracking-[-0.02em] [text-shadow:0_1px_12px_rgba(0,0,0,.35)]">
            {page ? (
              <a href={page} className="pointer-events-auto truncate hover:underline">
                {displayName(tutor.full_name)}
              </a>
            ) : (
              <span className="truncate">{displayName(tutor.full_name)}</span>
            )}
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
        {/* About as much of the bio as the two lines show; the whole of it is on the tutor's page. */}
        <p className="mt-2 line-clamp-2 text-[14.5px] leading-relaxed text-muted-foreground">{bioPreview(tutor.bio)}</p>
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
            <div className="flex items-center gap-2">
              <button type="button" onClick={onBook} className="site-btn site-btn-primary flex-1">
                Book this tutor <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
              {page && (
                <a href={page} className="site-btn site-btn-secondary px-4" aria-label={`Profile of ${displayName(tutor.full_name)}`}>
                  Profile
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
