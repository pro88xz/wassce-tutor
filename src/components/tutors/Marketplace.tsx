// The tutor marketplace on /tutors and /tutors/{subject}: verified tutors, each
// with their photo, subjects, lessons a week and the monthly fee they set.
// "Book this tutor" lets the student pick one or more subjects and, if the
// tutor takes small groups, how many are learning together. The price adds up
// as they choose, with the tutor's own discounts. If the student agrees, the
// database (request_tutor(), migration 19) works out the same price, records
// the request, tells the tutor, and returns the tutor's WhatsApp number; then
// WhatsApp opens with a message ready to send. Lessons are in person, arranged
// and paid directly with the tutor.
import { useEffect, useMemo, useState } from 'react'
import { BadgeCheck, GraduationCap, MapPin, Search, Star, Tag, Users, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/lib/queries'
import { monthlyFee } from '@/lib/tutors'
import { lessonsText, listText, nle, paymentText, quote, type TutorOffer } from '@/lib/tutor-pricing'
import { WhatsAppGlyph } from '@/components/WhatsAppGlyph'

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

const photoUrl = (path: string) => supabase.storage.from('tutor-profile-images').getPublicUrl(path).data.publicUrl
const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name
const initials = (name: string) => name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('')
const experience = (years: number) => (years === 0 ? 'New tutor' : `${years} ${years === 1 ? "year's" : "years'"} experience`)
const offerOf = (t: Tutor): TutorOffer => ({ multiSubjectDiscountPct: t.multi_subject_discount_pct ?? 0, groupMax: t.group_max, groupDiscountPct: t.group_discount_pct ?? 0 })
const byName = (a: Rate, b: Rate) => (a.subject?.name ?? '').localeCompare(b.subject?.name ?? '')

/** The blue verified tick: the tutor was reviewed and approved by WASSCE Tutor. */
export function VerifiedBadge({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <span className="inline-flex shrink-0" title="Verified by WASSCE Tutor">
      <BadgeCheck className={`${className} fill-[#1d9bf0] text-white`} aria-hidden />
      <span className="sr-only">Verified by WASSCE Tutor</span>
    </span>
  )
}

export function TutorMarketplace({ subjectId, subjectName }: { subjectId?: string; subjectName?: string }) {
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [subjectFilter, setSubjectFilter] = useState(subjectId ?? 'all')
  const [booking, setBooking] = useState<Tutor | null>(null)

  useEffect(() => {
    let active = true
    void Promise.all([
      supabase
        .from('tutors')
        .select('id,avatar_path,full_name,bio,qualifications,experience_years,location,verified_at,multi_subject_discount_pct,group_max,group_discount_pct,payment_methods,tutor_subjects(subject_id,price_nle,lessons_per_week,subject:subjects(id,name)),tutor_booking_reviews(rating)')
        .eq('status', 'active')
        .eq('listed', true)
        .order('verified_at', { ascending: false }),
      subjectId ? Promise.resolve({ data: [], error: null }) : supabase.from('subjects').select('id,name').order('name'),
    ]).then(([tutorResult, subjectResult]) => {
      if (!active) return
      if (!tutorResult.error) setTutors((tutorResult.data ?? []) as unknown as Tutor[])
      if (!subjectResult.error) setSubjects((subjectResult.data ?? []) as { id: string; name: string }[])
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [subjectId])

  const visible = useMemo(
    () =>
      tutors.filter((t) => {
        const text = `${t.full_name} ${t.location} ${t.tutor_subjects.map((s) => s.subject?.name).join(' ')}`.toLowerCase()
        return text.includes(query.trim().toLowerCase()) && (subjectFilter === 'all' || t.tutor_subjects.some((s) => s.subject_id === subjectFilter))
      }),
    [tutors, query, subjectFilter],
  )

  if (loading) {
    return (
      <div id="tutors" className="grid scroll-mt-24 gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true">
        {[0, 1, 2].map((i) => <div key={i} className="h-[30rem] animate-pulse rounded-3xl bg-muted" aria-hidden />)}
      </div>
    )
  }

  if (tutors.length === 0 || (subjectId && visible.length === 0)) {
    return (
      <section id="tutors" className="scroll-mt-24 rounded-3xl border bg-card p-6 sm:p-8" aria-labelledby="tutors-list">
        <p className="text-sm font-semibold text-primary">Verified tutors</p>
        <h2 id="tutors-list" className="mt-1 text-2xl font-bold tracking-tight">
          {subjectName ? `No verified ${subjectName} tutors listed yet` : 'Verified tutors are joining soon'}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Tell us what you need below and we will find you a tutor for in-person lessons. Are you a teacher?{' '}
          <a href="/become-a-tutor" className="font-semibold text-primary hover:underline">Apply to tutor</a> and set your own monthly fee.
        </p>
      </section>
    )
  }

  return (
    <section id="tutors" className="scroll-mt-24 space-y-6" aria-labelledby="tutors-list">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            <VerifiedBadge className="h-4 w-4" /> Verified tutors · in-person lessons
          </p>
          <h2 id="tutors-list" className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{subjectName ? `${subjectName} tutors` : 'Choose your tutor'}</h2>
          <p className="mt-1 text-sm text-muted-foreground">Each tutor sets their own monthly fee. Take several subjects or learn with friends, and see the price before you message them.</p>
        </div>
        {!subjectId && (
          <div className="grid gap-2 sm:grid-cols-[minmax(220px,1fr)_200px]">
            <label className="relative">
              <span className="sr-only">Search tutors</span>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name, subject or area" className="h-11 w-full rounded-xl border bg-card pl-10 pr-3 text-sm" />
            </label>
            <label>
              <span className="sr-only">Subject</span>
              <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="h-11 w-full rounded-xl border bg-card px-3 text-sm">
                <option value="all">All subjects</option>
                {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </label>
          </div>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-3xl border bg-card p-8 text-center">
          <GraduationCap className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden />
          <h3 className="mt-3 font-bold">No tutors match this search</h3>
          <p className="mt-1 text-sm text-muted-foreground">Try another subject or area, or ask us below to find you a tutor.</p>
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((tutor) => (
            <li key={tutor.id}>
              <TutorCard tutor={tutor} subjectId={subjectFilter === 'all' ? subjectId : subjectFilter} onBook={() => setBooking(tutor)} />
            </li>
          ))}
        </ul>
      )}

      {booking && <BookDialog tutor={booking} preferredSubject={subjectFilter === 'all' ? subjectId : subjectFilter} onClose={() => setBooking(null)} />}
    </section>
  )
}

/** The tutor's own offers: a discount for several subjects, small groups. */
function OfferChips({ tutor }: { tutor: Tutor }) {
  const multi = tutor.multi_subject_discount_pct > 0 && tutor.tutor_subjects.length > 1
  if (!multi && !tutor.group_max) return null
  return (
    <ul className="mt-3 flex flex-wrap gap-1.5 text-xs font-semibold" aria-label="Offers">
      {multi && (
        <li className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-800">
          <Tag className="h-3.5 w-3.5" aria-hidden /> {tutor.multi_subject_discount_pct}% off 2+ subjects
        </li>
      )}
      {tutor.group_max && (
        <li className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-sky-800">
          <Users className="h-3.5 w-3.5" aria-hidden /> Groups up to {tutor.group_max}
          {tutor.group_discount_pct > 0 && ` · ${tutor.group_discount_pct}% off each`}
        </li>
      )}
    </ul>
  )
}

/** A tutor's card. With `preview`, it is the tutor's own preview on their dashboard: same look, nothing to tap. */
export function TutorCard({ tutor, subjectId, onBook, preview = false, photoSrc }: { tutor: Tutor; subjectId?: string; onBook?: () => void; preview?: boolean; photoSrc?: string | null }) {
  const photo = photoSrc ?? (tutor.avatar_path ? photoUrl(tutor.avatar_path) : null)
  const reviews = tutor.tutor_booking_reviews
  const rating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null
  // The chosen subject first, then the rest.
  const rates = [...tutor.tutor_subjects].sort((a, b) => Number(b.subject_id === subjectId) - Number(a.subject_id === subjectId) || byName(a, b))
  return (
    <article className={`group flex h-full flex-col overflow-hidden rounded-3xl border bg-card shadow-sm ${preview ? '' : 'transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/10'}`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-violet-500 to-violet-800">
        {photo ? (
          <img src={photo} alt={`${tutor.full_name}, WASSCE tutor`} className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.02]" loading="lazy" decoding="async" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-5xl font-extrabold tracking-tight text-white/90" aria-hidden>{initials(tutor.full_name)}</span>
        )}
        <span className="absolute left-3 top-3 inline-flex max-w-[85%] items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-sm">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
          <span className="truncate">In person · {tutor.location}</span>
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="flex items-center gap-1.5 text-lg font-bold leading-tight">
          <span className="truncate">{tutor.full_name}</span>
          <VerifiedBadge />
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="line-clamp-1">{tutor.qualifications}</span>
          <span>{experience(tutor.experience_years)}</span>
          {rating !== null && (
            <span className="ml-2 inline-flex items-center gap-1 font-semibold text-amber-600">
              <Star className="h-3.5 w-3.5 fill-current" aria-hidden /> {rating.toFixed(1)} ({reviews.length})
            </span>
          )}
        </p>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{tutor.bio}</p>
        <OfferChips tutor={tutor} />
        <ul className="mt-4 space-y-1.5" aria-label="Subjects and monthly fees">
          {rates.slice(0, 4).map((r) => (
            <li key={r.subject_id} className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm ${r.subject_id === subjectId ? 'bg-primary/10' : 'bg-muted/60'}`}>
              <span className="min-w-0">
                <span className="block truncate font-medium">{r.subject?.name}</span>
                {r.lessons_per_week && <span className="block text-xs text-muted-foreground">{lessonsText(r.lessons_per_week)}</span>}
              </span>
              <span className="shrink-0 font-semibold">{monthlyFee(r.price_nle)}</span>
            </li>
          ))}
          {rates.length > 4 && <li className="px-3 text-xs text-muted-foreground">+ {rates.length - 4} more {rates.length - 4 === 1 ? 'subject' : 'subjects'}</li>}
        </ul>
        <div className="mt-auto pt-5">
          {preview ? (
            <span className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-[15px] font-bold text-primary-foreground" aria-hidden>
              Book this tutor
            </span>
          ) : (
            <button type="button" onClick={onBook} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-[15px] font-bold text-primary-foreground transition hover:bg-brand-strong">
              Book this tutor
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

function BookDialog({ tutor, preferredSubject, onClose }: { tutor: Tutor; preferredSubject?: string; onClose: () => void }) {
  const { user } = useAuth()
  const { data: profile } = useProfile(user?.id ?? null)
  const offered = useMemo(() => [...tutor.tutor_subjects].sort((a, b) => Number(b.subject_id === preferredSubject) - Number(a.subject_id === preferredSubject) || byName(a, b)), [tutor, preferredSubject])
  const [chosen, setChosen] = useState<string[]>(() => (offered[0] ? [offered[0].subject_id] : []))
  const [students, setStudents] = useState(1)
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
      window.location.href = `/auth?next=${encodeURIComponent(window.location.pathname)}`
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
