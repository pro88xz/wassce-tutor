import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, GraduationCap, MapPin, Search, ShieldCheck } from 'lucide-react'
import { publicHead } from '@/lib/seo'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'

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
  tutor_availability: {weekday:number;starts_at:string;ends_at:string}[]
  tutor_booking_reviews: {rating:number}[]
}

export const Route = createFileRoute('/tutors')({
  head: publicHead('/tutors'),
  component: TutorMarketplace,
})

function TutorMarketplace() {
  const { user } = useAuth()
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('all')
  const [selected, setSelected] = useState<Tutor | null>(null)
  const [subjectId, setSubjectId] = useState('')
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
      supabase.from('subjects').select('id,name').order('name'),
    ]).then(([tutorResult, subjectResult]) => {
      if (!active) return
      if (!tutorResult.error) setTutors((tutorResult.data ?? []) as unknown as Tutor[])
      if (!subjectResult.error) setSubjects(subjectResult.data ?? [])
      setLoading(false)
    })
    return () => { active = false }
  }, [])

  const visible = useMemo(() => tutors.filter((tutor) => {
    const text = `${tutor.full_name} ${tutor.bio} ${tutor.location} ${tutor.tutor_subjects.map((s) => s.subject?.name).join(' ')}`.toLowerCase()
    return text.includes(query.toLowerCase()) && (subjectFilter === 'all' || tutor.tutor_subjects.some((s) => s.subject_id === subjectFilter))
  }), [tutors, query, subjectFilter])

  const book = async () => {
    if (!user) { window.location.href = '/auth?next=%2Ftutors'; return }
    if (!selected || !subjectId || !startsAt) return
    setBusy(true); setError(null); setNotice(null)
    try {
      const { data, error: bookingError } = await supabase.rpc('create_tutor_booking', {
        p_tutor_id: selected.id,
        p_subject_id: subjectId,
        p_starts_at: new Date(startsAt).toISOString(),
        p_duration_minutes: Number(duration),
        p_message: message.trim() || null,
      })
      if (bookingError) throw bookingError
      await supabase.functions.invoke('send-notification-email', { body: { entity_id: data } })
      setNotice('Your request has been sent. The tutor will respond shortly.')
      setSelected(null); setStartsAt(''); setMessage('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create booking. Please try again.')
    } finally { setBusy(false) }
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-10 pb-16">
      <section className="relative overflow-hidden rounded-[2rem] bg-[#21134d] px-6 py-10 text-white sm:px-10 sm:py-14">
        <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative max-w-3xl space-y-4">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-violet-200">One-to-one WASSCE support</p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl">Learn with a tutor who knows your subject.</h1>
          <p className="max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">Find approved tutors, compare subject rates and request a session around your schedule.</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/become-a-tutor" className="inline-flex min-h-11 items-center rounded-xl bg-white px-5 text-sm font-bold text-[#2c195d]">Become a tutor</Link>
            <Link to="/tutor-dashboard" className="inline-flex min-h-11 items-center rounded-xl border border-white/25 px-5 text-sm font-semibold text-white">Tutor dashboard</Link>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div><p className="text-sm font-semibold text-primary">Verified teaching profiles</p><h2 className="mt-1 text-2xl font-bold tracking-tight">Find your tutor</h2></div>
          <div className="grid gap-2 sm:grid-cols-[minmax(220px,1fr)_220px]">
            <label className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tutors or subjects" className="h-11 w-full rounded-xl border bg-card pl-10 pr-3 text-sm"/></label>
            <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="h-11 rounded-xl border bg-card px-3 text-sm"><option value="all">All subjects</option>{subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
          </div>
        </div>
        {notice && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">{notice}</p>}
        {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {loading ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{[0,1,2].map((n) => <div key={n} className="h-64 animate-pulse rounded-2xl bg-muted"/>)}</div> :
          visible.length === 0 ? <div className="rounded-2xl border bg-card p-10 text-center"><GraduationCap className="mx-auto h-9 w-9 text-muted-foreground"/><h3 className="mt-3 font-bold">No tutors match this search yet</h3><p className="mt-1 text-sm text-muted-foreground">Try another subject or check back as new tutors are approved.</p></div> :
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{visible.map((tutor) => (
            <article key={tutor.id} className="flex flex-col rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between gap-3"><div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-violet-100 text-violet-800">{tutor.avatar_path?<img src={supabase.storage.from('tutor-profile-images').getPublicUrl(tutor.avatar_path).data.publicUrl} alt={tutor.full_name} className="h-full w-full object-cover"/>:<GraduationCap className="h-6 w-6"/>}</div><span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"><ShieldCheck className="h-3.5 w-3.5"/> Approved</span></div>
              <h3 className="mt-4 text-lg font-bold">{tutor.full_name}</h3>
              {tutor.tutor_booking_reviews.length>0&&<p className="mt-1 text-xs font-semibold text-amber-700">★ {(tutor.tutor_booking_reviews.reduce((sum,r)=>sum+r.rating,0)/tutor.tutor_booking_reviews.length).toFixed(1)} · {tutor.tutor_booking_reviews.length} verified {tutor.tutor_booking_reviews.length===1?'review':'reviews'}</p>}
              <p className="mt-1 text-sm text-muted-foreground">{tutor.qualifications} · {tutor.experience_years} years' experience</p>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{tutor.bio}</p>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5"/>{tutor.location} · {tutor.teaching_mode === 'both' ? 'Online & in person' : tutor.teaching_mode === 'online' ? 'Online' : 'In person'}</p>
              <div className="mt-4 flex flex-wrap gap-2">{tutor.tutor_subjects.map((s) => <span key={s.subject_id} className="rounded-lg bg-muted px-2.5 py-1.5 text-xs font-medium">{s.subject?.name} · NLe {s.price_nle}</span>)}</div>
              <div className="mt-3 border-t pt-3"><p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Weekly availability</p><div className="mt-2 flex flex-wrap gap-1.5">{tutor.tutor_availability.map((slot)=><span key={slot.weekday+'-'+slot.starts_at} className="rounded-md bg-violet-50 px-2 py-1 text-[11px] font-medium text-violet-800">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][slot.weekday]} {String(slot.starts_at).slice(0,5)}–{String(slot.ends_at).slice(0,5)}</span>)}</div></div>
              <button type="button" onClick={() => { setSelected(tutor); setSubjectId(tutor.tutor_subjects[0]?.subject_id ?? '') }} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground hover:bg-brand-strong"><CalendarDays className="h-4 w-4"/> Request a session</button>
            </article>
          ))}</div>}
      </section>

      {selected && <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelected(null) }}>
        <section role="dialog" aria-modal="true" aria-labelledby="booking-title" className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 text-slate-900 shadow-2xl sm:rounded-3xl">
          <div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-violet-700">Booking request</p><h2 id="booking-title" className="mt-1 text-xl font-bold">Book {selected.full_name}</h2></div><button type="button" onClick={() => setSelected(null)} className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">Close</button></div>
          <div className="mt-5 space-y-4">
            <label className="block space-y-1.5 text-sm font-semibold">Subject<select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="h-11 w-full rounded-xl border px-3 font-normal">{selected.tutor_subjects.map((s) => <option key={s.subject_id} value={s.subject_id}>{s.subject?.name} — NLe {s.price_nle}</option>)}</select></label>
            <label className="block space-y-1.5 text-sm font-semibold">Date and time<input type="datetime-local" min={new Date(Date.now()+3600000).toISOString().slice(0,16)} value={startsAt} onChange={(e) => setStartsAt(e.target.value)} className="h-11 w-full rounded-xl border px-3 font-normal"/></label>
            <label className="block space-y-1.5 text-sm font-semibold">Session length<select value={duration} onChange={(e) => setDuration(e.target.value)} className="h-11 w-full rounded-xl border px-3 font-normal"><option value="30">30 minutes</option><option value="45">45 minutes</option><option value="60">60 minutes</option><option value="90">90 minutes</option><option value="120">2 hours</option></select></label>
            <label className="block space-y-1.5 text-sm font-semibold">What would you like help with?<textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} rows={3} className="w-full rounded-xl border p-3 font-normal" placeholder="Tell the tutor what you are working on."/></label>
            <button type="button" disabled={busy || !startsAt || !subjectId} onClick={() => void book()} className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#6438d8] px-4 font-bold text-white disabled:opacity-50">{busy ? 'Sending request…' : 'Send booking request'}</button>
            <p className="text-xs text-slate-500">The tutor's listed subject rate is the session price. The tutor must accept before the session is confirmed.</p>
          </div>
        </section>
      </div>}
    </div>
  )
}
