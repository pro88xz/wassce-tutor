// The tutor marketplace on /tutors and /tutors/{subject}: verified tutors, each
// with their photo, subjects and the monthly fee they set. "Book this tutor"
// shows the fee for the chosen subject; if the student agrees, the database
// (contact_tutor(), migration 18) records the contact and returns the tutor's
// WhatsApp number, and WhatsApp opens with a message ready to send. Lessons are
// in person, arranged and paid directly with the tutor.
import { useEffect, useMemo, useState } from 'react'
import { BadgeCheck, GraduationCap, MapPin, Search, Star, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/lib/queries'
import { monthlyFee } from '@/lib/tutors'
import { WhatsAppGlyph } from '@/components/WhatsAppGlyph'

type Rate = { subject_id: string; price_nle: number; subject: { id: string; name: string } | null }
type Tutor = {
  id: string
  avatar_path: string | null
  full_name: string
  bio: string
  qualifications: string
  experience_years: number
  location: string
  verified_at: string
  tutor_subjects: Rate[]
  tutor_booking_reviews: { rating: number }[]
}

const photoUrl = (path: string) => supabase.storage.from('tutor-profile-images').getPublicUrl(path).data.publicUrl
const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name
const initials = (name: string) => name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('')
const experience = (years: number) => (years === 0 ? 'New tutor' : `${years} ${years === 1 ? "year's" : "years'"} experience`)

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
        .select('id,avatar_path,full_name,bio,qualifications,experience_years,location,verified_at,tutor_subjects(subject_id,price_nle,subject:subjects(id,name)),tutor_booking_reviews(rating)')
        .eq('status', 'active')
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
          <p className="mt-1 text-sm text-muted-foreground">Each tutor sets their own monthly fee. You see it before you message them.</p>
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

function TutorCard({ tutor, subjectId, onBook }: { tutor: Tutor; subjectId?: string; onBook: () => void }) {
  const reviews = tutor.tutor_booking_reviews
  const rating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null
  // The chosen subject first, then the rest.
  const rates = [...tutor.tutor_subjects].sort((a, b) => Number(b.subject_id === subjectId) - Number(a.subject_id === subjectId) || (a.subject?.name ?? '').localeCompare(b.subject?.name ?? ''))
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border bg-card shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/10">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-violet-500 to-violet-800">
        {tutor.avatar_path ? (
          <img src={photoUrl(tutor.avatar_path)} alt={`${tutor.full_name}, WASSCE tutor`} className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.02]" loading="lazy" />
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
        <ul className="mt-4 space-y-1.5" aria-label="Subjects and monthly fees">
          {rates.slice(0, 4).map((r) => (
            <li key={r.subject_id} className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm ${r.subject_id === subjectId ? 'bg-primary/10' : 'bg-muted/60'}`}>
              <span className="truncate font-medium">{r.subject?.name}</span>
              <span className="shrink-0 font-semibold">{monthlyFee(r.price_nle)}</span>
            </li>
          ))}
          {rates.length > 4 && <li className="px-3 text-xs text-muted-foreground">+ {rates.length - 4} more {rates.length - 4 === 1 ? 'subject' : 'subjects'}</li>}
        </ul>
        <div className="mt-auto pt-5">
          <button type="button" onClick={onBook} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-[15px] font-bold text-primary-foreground transition hover:bg-brand-strong">
            Book this tutor
          </button>
        </div>
      </div>
    </article>
  )
}

function BookDialog({ tutor, preferredSubject, onClose }: { tutor: Tutor; preferredSubject?: string; onClose: () => void }) {
  const { user } = useAuth()
  const { data: profile } = useProfile(user?.id ?? null)
  const offered = tutor.tutor_subjects
  const [subjectId, setSubjectId] = useState(offered.find((s) => s.subject_id === preferredSubject)?.subject_id ?? offered[0]?.subject_id ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null)
  const rate = offered.find((s) => s.subject_id === subjectId)
  const name = firstName(tutor.full_name)

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
    if (!rate) return
    setBusy(true)
    setError(null)
    const { data, error: contactError } = await supabase.rpc('contact_tutor', { p_tutor: tutor.id, p_subject: subjectId })
    const row = Array.isArray(data) ? data[0] : data
    if (contactError || !row?.whatsapp) {
      setError(contactError?.message ?? 'Could not reach this tutor right now. Please try again.')
      setBusy(false)
      return
    }
    const student = firstName(profile?.full_name ?? '') || null
    const text = [
      `Hello ${name}, I found you on WASSCE Tutor.`,
      `I would like in-person ${row.subject_name} lessons at your fee of NLe ${Number(row.price_nle).toLocaleString('en-GB')} per month.`,
      student ? `My name is ${student}. When could we start?` : 'When could we start?',
    ].join(' ')
    const url = `https://wa.me/${row.whatsapp}?text=${encodeURIComponent(text)}`
    setWhatsappUrl(url)
    setBusy(false)
    window.location.assign(url)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section role="dialog" aria-modal="true" aria-labelledby="book-title" className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white text-slate-900 shadow-2xl sm:rounded-3xl">
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

        <div className="space-y-5 p-5">
          {offered.length > 1 && (
            <fieldset>
              <legend className="mb-2 text-sm font-semibold">Subject</legend>
              <div className="space-y-2">
                {offered.map((s) => (
                  <label key={s.subject_id} className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-3.5 py-3 text-sm ${s.subject_id === subjectId ? 'border-violet-500 bg-violet-50' : ''}`}>
                    <span className="flex items-center gap-2.5">
                      <input type="radio" name="subject" checked={s.subject_id === subjectId} onChange={() => setSubjectId(s.subject_id)} className="accent-[#6438d8]" />
                      <span className="font-medium">{s.subject?.name}</span>
                    </span>
                    <span className="font-semibold">{monthlyFee(s.price_nle)}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {rate && (
            <div className="rounded-2xl bg-violet-50 p-4">
              <p className="text-sm text-slate-700">
                {name}’s fee for {rate.subject?.name} is
              </p>
              <p className="mt-0.5 text-2xl font-extrabold tracking-tight text-slate-900">
                NLe {Number(rate.price_nle).toLocaleString('en-GB')} <span className="text-base font-semibold text-slate-600">per month</span>
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
                <li>• Lessons are in person, in or near {tutor.location}.</li>
                <li>• You agree the days, times, place and payment directly with {name}.</li>
                <li>• WASSCE Tutor does not take payment for tutoring.</li>
              </ul>
            </div>
          )}

          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          {whatsappUrl ? (
            <div className="space-y-2 text-center">
              <p className="text-sm text-slate-600">Opening WhatsApp…</p>
              <a href={whatsappUrl} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 font-bold text-white">
                <WhatsAppGlyph /> Open WhatsApp
              </a>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-center text-sm font-semibold">Do you agree to this fee?</p>
              <button type="button" disabled={busy || !rate} onClick={() => void agree()} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 font-bold text-white transition hover:brightness-95 disabled:opacity-60">
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
