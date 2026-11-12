// Approved tutors from the marketplace (migration 11), shown on /tutors and on
// each /tutors/{subject} page. Each tutor sets a monthly fee per subject; a
// student sends a request for monthly tutoring that the tutor accepts or
// declines. When no approved tutor matches, the page's WhatsApp request form
// (further down the page) is the way to be matched.
import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, GraduationCap, MapPin, Search, ShieldCheck } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { fitsAvailability, monthlyFee, WEEKDAYS_SHORT } from '@/lib/tutors'
import type { AvailabilitySlot } from '@/lib/tutors'

type Tutor = {
  id: string
  avatar_path: string | null
  full_name: string
  bio: string
  qualifications: string
  experience_years: number
  location: string
  teaching_mode: 'online' | 'in_person' | 'both'
  tutor_subjects: { subject_id: string; price_nle: number; subject: { id: string; name: string } | null }[]
  tutor_availability: AvailabilitySlot[]
  tutor_booking_reviews: { rating: number }[]
}

const MODE_LABEL = { both: 'Online & in person', online: 'Online', in_person: 'In person' } as const

export function TutorMarketplace({ subjectId, subjectName }: { subjectId?: string; subjectName?: string }) {
  const { user } = useAuth()
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [subjectFilter, setSubjectFilter] = useState(subjectId ?? 'all')
  const [selected, setSelected] = useState<Tutor | null>(null)
  const [bookSubject, setBookSubject] = useState('')
  const [startsAt, setStartsAt] = useState('')
  const [duration, setDuration] = useState('60')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    void Promise.all([
      supabase.from('tutors').select('id,avatar_path,full_name,bio,qualifications,experience_years,location,teaching_mode,tutor_subjects(subject_id,price_nle,subject:subjects(id,name)),tutor_availability(weekday,starts_at,ends_at),tutor_booking_reviews(rating)').eq('status', 'active').order('verified_at', { ascending: false }),
      subjectId ? Promise.resolve({ data: [], error: null }) : supabase.from('subjects').select('id,name').order('name'),
    ]).then(([tutorResult, subjectResult]) => {
      if (!active) return
      if (!tutorResult.error) setTutors((tutorResult.data ?? []) as unknown as Tutor[])
      if (!subjectResult.error) setSubjects((subjectResult.data ?? []) as { id: string; name: string }[])
      setLoading(false)
    })
    return () => { active = false }
  }, [subjectId])

  const visible = useMemo(() => tutors.filter((tutor) => {
    const text = `${tutor.full_name} ${tutor.bio} ${tutor.location} ${tutor.tutor_subjects.map((s) => s.subject?.name).join(' ')}`.toLowerCase()
    return text.includes(query.trim().toLowerCase()) && (subjectFilter === 'all' || tutor.tutor_subjects.some((s) => s.subject_id === subjectFilter))
  }), [tutors, query, subjectFilter])

  const open = (tutor: Tutor) => {
    setSelected(tutor)
    setBookSubject(tutor.tutor_subjects.find((s) => s.subject_id === subjectId)?.subject_id ?? tutor.tutor_subjects[0]?.subject_id ?? '')
    setStartsAt(''); setError(null)
  }

  const minutes = Number(duration)
  const startIso = startsAt ? new Date(startsAt).toISOString() : ''
  const hasSlots = (selected?.tutor_availability.length ?? 0) > 0
  const fits = !!selected && !!startIso && fitsAvailability(selected.tutor_availability, startIso, minutes)
  const tooSoon = !!startIso && new Date(startIso).getTime() <= Date.now()

  const book = async () => {
    if (!user) { window.location.href = `/auth?next=${encodeURIComponent(window.location.pathname)}`; return }
    if (!selected || !bookSubject || !startIso || !fits || tooSoon) return
    setBusy(true); setError(null); setNotice(null)
    try {
      const { data, error: bookingError } = await supabase.rpc('create_tutor_booking', {
        p_tutor_id: selected.id,
        p_subject_id: bookSubject,
        p_starts_at: startIso,
        p_duration_minutes: minutes,
        p_message: message.trim() || null,
      })
      if (bookingError) throw bookingError
      // Email is best effort: the request and its inbox notification are already saved.
      await supabase.functions.invoke('send-notification-email', { body: { entity_id: data, event_type: 'booking_requested' } }).catch(() => undefined)
      setNotice(`Your request was sent to ${selected.full_name}. You will see their reply on your dashboard.`)
      setSelected(null); setStartsAt(''); setMessage('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the request. Please try again.')
    } finally { setBusy(false) }
  }

  if (loading) return <div className="h-40 animate-pulse rounded-2xl bg-muted" aria-hidden />

  if (visible.length === 0 && !query && (subjectFilter === 'all' || subjectId)) {
    return (
      <section className="rounded-2xl border bg-card p-5 sm:p-6" aria-labelledby="tutors-list">
        <p className="text-sm font-semibold text-primary">Approved tutors</p>
        <h2 id="tutors-list" className="mt-1 text-xl font-bold tracking-tight">
          {subjectName ? `No approved ${subjectName} tutors listed yet` : 'Approved tutors are joining soon'}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Send a request below and we will match you with a tutor on WhatsApp. Are you a teacher? <a href="/become-a-tutor" className="font-semibold text-primary hover:underline">Apply to tutor</a> and set your own monthly fee.
        </p>
      </section>
    )
  }

  return (
    <section className="space-y-5" aria-labelledby="tutors-list">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Approved tutors · monthly fees set by each tutor</p>
          <h2 id="tutors-list" className="mt-1 text-2xl font-bold tracking-tight">{subjectName ? `${subjectName} tutors` : 'Choose your tutor'}</h2>
        </div>
        {!subjectId && (
          <div className="grid gap-2 sm:grid-cols-[minmax(200px,1fr)_200px]">
            <label className="relative"><span className="sr-only">Search tutors</span><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tutors or subjects" className="h-11 w-full rounded-xl border bg-card pl-10 pr-3 text-sm" /></label>
            <label><span className="sr-only">Subject</span><select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="h-11 w-full rounded-xl border bg-card px-3 text-sm"><option value="all">All subjects</option>{subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
          </div>
        )}
      </div>
      {notice && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">{notice}</p>}
      {visible.length === 0 ? (
        <div className="rounded-2xl border bg-card p-8 text-center"><GraduationCap className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden /><h3 className="mt-3 font-bold">No tutors match this search</h3><p className="mt-1 text-sm text-muted-foreground">Try another subject, or send a request below and we will match you.</p></div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{visible.map((tutor) => {
          const reviews = tutor.tutor_booking_reviews
          const rates = subjectId ? tutor.tutor_subjects.filter((s) => s.subject_id === subjectId) : tutor.tutor_subjects
          return (
            <article key={tutor.id} className="flex flex-col rounded-2xl border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-violet-100 text-violet-800">{tutor.avatar_path ? <img src={supabase.storage.from('tutor-profile-images').getPublicUrl(tutor.avatar_path).data.publicUrl} alt={tutor.full_name} className="h-full w-full object-cover" loading="lazy" /> : <GraduationCap className="h-6 w-6" aria-hidden />}</div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"><ShieldCheck className="h-3.5 w-3.5" aria-hidden /> Approved</span>
              </div>
              <h3 className="mt-4 text-lg font-bold">{tutor.full_name}</h3>
              {reviews.length > 0 && <p className="mt-1 text-xs font-semibold text-amber-700">★ {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)} · {reviews.length} verified {reviews.length === 1 ? 'review' : 'reviews'}</p>}
              <p className="mt-1 text-sm text-muted-foreground">{tutor.qualifications} · {tutor.experience_years === 0 ? 'New tutor' : `${tutor.experience_years} years' experience`}</p>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{tutor.bio}</p>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" aria-hidden />{tutor.location} · {MODE_LABEL[tutor.teaching_mode]}</p>
              <div className="mt-4 flex flex-wrap gap-2">{rates.map((s) => <span key={s.subject_id} className="rounded-lg bg-muted px-2.5 py-1.5 text-xs font-medium">{s.subject?.name} · {monthlyFee(s.price_nle)}</span>)}</div>
              <div className="mt-3 border-t pt-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Weekly availability (GMT)</p>
                {tutor.tutor_availability.length === 0 ? <p className="mt-2 text-xs text-muted-foreground">Not published yet.</p> : (
                  <div className="mt-2 flex flex-wrap gap-1.5">{[...tutor.tutor_availability].sort((a, b) => a.weekday - b.weekday).map((slot) => <span key={`${slot.weekday}-${slot.starts_at}`} className="rounded-md bg-violet-50 px-2 py-1 text-[11px] font-medium text-violet-800">{WEEKDAYS_SHORT[slot.weekday]} {String(slot.starts_at).slice(0, 5)}–{String(slot.ends_at).slice(0, 5)}</span>)}</div>
                )}
              </div>
              <button type="button" disabled={tutor.tutor_availability.length === 0} onClick={() => open(tutor)} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground hover:bg-brand-strong disabled:opacity-50"><CalendarDays className="h-4 w-4" aria-hidden /> {tutor.tutor_availability.length === 0 ? 'Availability coming soon' : 'Request monthly tutoring'}</button>
            </article>
          )
        })}</div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelected(null) }}>
          <section role="dialog" aria-modal="true" aria-labelledby="booking-title" className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 text-slate-900 shadow-2xl sm:rounded-3xl">
            <div className="flex items-start justify-between gap-3">
              <div><p className="text-xs font-bold uppercase tracking-wider text-violet-700">Monthly tutoring request</p><h2 id="booking-title" className="mt-1 text-xl font-bold">{selected.full_name}</h2></div>
              <button type="button" onClick={() => setSelected(null)} className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">Close</button>
            </div>
            <div className="mt-5 space-y-4">
              <label className="block space-y-1.5 text-sm font-semibold">Subject<select value={bookSubject} onChange={(e) => setBookSubject(e.target.value)} className="h-11 w-full rounded-xl border px-3 font-normal">{selected.tutor_subjects.map((s) => <option key={s.subject_id} value={s.subject_id}>{s.subject?.name} · {monthlyFee(s.price_nle)}</option>)}</select></label>
              <div>
                <p className="text-sm font-semibold">When {selected.full_name.split(' ')[0]} teaches (GMT)</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">{[...selected.tutor_availability].sort((a, b) => a.weekday - b.weekday).map((slot) => <span key={`${slot.weekday}-${slot.starts_at}`} className="rounded-md bg-violet-50 px-2 py-1 text-xs font-medium text-violet-800">{WEEKDAYS_SHORT[slot.weekday]} {String(slot.starts_at).slice(0, 5)}–{String(slot.ends_at).slice(0, 5)}</span>)}</div>
              </div>
              <label className="block space-y-1.5 text-sm font-semibold">First lesson<input type="datetime-local" min={new Date(Date.now() + 3600000).toISOString().slice(0, 16)} value={startsAt} onChange={(e) => setStartsAt(e.target.value)} className="h-11 w-full rounded-xl border px-3 font-normal" /></label>
              <label className="block space-y-1.5 text-sm font-semibold">Lesson length<select value={duration} onChange={(e) => setDuration(e.target.value)} className="h-11 w-full rounded-xl border px-3 font-normal"><option value="30">30 minutes</option><option value="45">45 minutes</option><option value="60">1 hour</option><option value="90">1 hour 30 minutes</option><option value="120">2 hours</option></select></label>
              {startIso && !fits && hasSlots && <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900">Choose a day and time inside one of the windows above, so the whole lesson fits.</p>}
              {tooSoon && <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900">Choose a time in the future.</p>}
              <label className="block space-y-1.5 text-sm font-semibold">What would you like help with?<textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} rows={3} className="w-full rounded-xl border p-3 font-normal" placeholder="Your class, the topics you find hard, and which days suit you each week." /></label>
              {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
              <button type="button" disabled={busy || !bookSubject || !fits || tooSoon} onClick={() => void book()} className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#6438d8] px-4 font-bold text-white disabled:opacity-50">{busy ? 'Sending request…' : user ? 'Send request' : 'Sign in to send request'}</button>
              <p className="text-xs text-slate-500">The fee shown is per month and is settled with the tutor. After the tutor accepts, you confirm, then agree your weekly lesson times together.</p>
            </div>
          </section>
        </div>
      )}
    </section>
  )
}
