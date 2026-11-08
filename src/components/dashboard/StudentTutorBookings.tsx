import { useCallback, useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { CalendarClock, CheckCircle2, Star } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type StudentBooking = {
  id: string
  starts_at: string
  duration_minutes: number
  price_nle: number
  status: string
  student_message: string | null
  subject: { name: string } | null
  tutor: { full_name: string; location: string; user_id: string } | null
}

export function StudentTutorBookings({ userId }: { userId: string }) {
  const [bookings, setBookings] = useState<StudentBooking[]>([])
  const [reviewed, setReviewed] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [reviewId, setReviewId] = useState<string | null>(null)
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const load = useCallback(async () => {
    const [bookingResult, reviewResult] = await Promise.all([
      supabase.from('tutor_bookings').select('id,starts_at,duration_minutes,price_nle,status,student_message,subject:subjects(name),tutor:tutors(full_name,location,user_id)').eq('student_id', userId).order('starts_at', { ascending: false }).limit(50),
      supabase.from('tutor_booking_reviews').select('booking_id').eq('reviewer_id', userId),
    ])
    if (!bookingResult.error) setBookings((bookingResult.data ?? []) as unknown as StudentBooking[])
    if (!reviewResult.error) setReviewed(new Set((reviewResult.data ?? []).map((row) => row.booking_id)))
    setLoading(false)
  }, [userId])

  useEffect(() => { void load() }, [load])

  const update = async (id: string, status: 'confirmed' | 'cancelled') => {
    setBusyId(id); setError(null); setNotice(null)
    try {
      const { error: rpcError } = await supabase.rpc('update_tutor_booking', { p_booking_id: id, p_status: status, p_reason: null })
      if (rpcError) throw rpcError
      await supabase.functions.invoke('send-notification-email', { body: { entity_id: id, event_type: `booking_${status}` } })
      setNotice(status === 'confirmed' ? 'Session confirmed.' : 'Booking cancelled.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update this booking.')
    } finally { setBusyId(null) }
  }

  const submitReview = async (id: string) => {
    setBusyId(id); setError(null); setNotice(null)
    try {
      const { error: rpcError } = await supabase.rpc('create_tutor_review', { p_booking_id: id, p_rating: rating, p_review: review.trim() })
      if (rpcError) throw rpcError
      setNotice('Your verified review has been submitted.')
      setReviewId(null); setReview('')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit your review.')
    } finally { setBusyId(null) }
  }

  return (
    <section className="mx-auto w-full max-w-7xl space-y-4 pb-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-xs font-bold uppercase tracking-wider text-primary">One-to-one learning</p><h2 className="mt-1 text-2xl font-bold">My tutor bookings</h2><p className="mt-1 text-sm text-muted-foreground">Manage your session requests and review completed lessons.</p></div>
        <Link to="/tutors" className="inline-flex min-h-10 items-center rounded-xl border px-4 text-sm font-semibold hover:bg-muted">Find a tutor</Link>
      </div>
      {notice && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {loading ? <div className="h-28 animate-pulse rounded-2xl bg-muted"/> : bookings.length === 0 ? <div className="rounded-2xl border bg-card p-6"><CalendarClock className="h-6 w-6 text-primary"/><h3 className="mt-3 font-bold">No tutor bookings yet</h3><p className="mt-1 text-sm text-muted-foreground">Find an approved tutor and request a session when you need one-to-one support.</p><Link to="/tutors" className="mt-4 inline-flex min-h-10 items-center rounded-xl bg-primary px-4 text-sm font-bold text-white">Browse tutors</Link></div> :
        <div className="space-y-3">{bookings.map((booking) => {
          const canConfirm = booking.status === 'accepted'
          const canCancel = ['requested','accepted','confirmed'].includes(booking.status)
          const canReview = booking.status === 'completed' && !reviewed.has(booking.id)
          return <article key={booking.id} className="rounded-2xl border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><h3 className="font-bold">{booking.subject?.name ?? 'Tutoring session'}</h3><p className="mt-1 text-sm text-muted-foreground">{booking.tutor?.full_name ?? 'Tutor'} · {booking.tutor?.location ?? 'Location not set'}</p><p className="mt-2 text-sm">{new Date(booking.starts_at).toLocaleString('en-GB',{dateStyle:'medium',timeStyle:'short'})} · {booking.duration_minutes} minutes</p></div>
              <div className="text-right"><p className="font-bold tabular-nums">NLe {Number(booking.price_nle).toFixed(2)}</p><span className="mt-1 inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-semibold capitalize">{booking.status.replace('_',' ')}</span></div>
            </div>
            {booking.student_message && <p className="mt-3 rounded-xl bg-muted/50 p-3 text-sm text-muted-foreground">{booking.student_message}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              {canConfirm && <button disabled={busyId===booking.id} onClick={()=>void update(booking.id,'confirmed')} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-emerald-700 px-4 text-sm font-semibold text-white"><CheckCircle2 className="h-4 w-4"/> Confirm session</button>}
              {canCancel && <button disabled={busyId===booking.id} onClick={()=>void update(booking.id,'cancelled')} className="min-h-10 rounded-lg border border-red-200 px-4 text-sm font-semibold text-red-700">Cancel booking</button>}
              {canReview && <button onClick={()=>{setReviewId(reviewId===booking.id?null:booking.id);setRating(5)}} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border px-4 text-sm font-semibold"><Star className="h-4 w-4"/> Review tutor</button>}
              {booking.status==='completed' && reviewed.has(booking.id) && <span className="self-center text-xs font-semibold text-emerald-700">Review submitted</span>}
            </div>
            {reviewId===booking.id && <div className="mt-4 space-y-3 rounded-xl bg-muted/40 p-4"><label className="block text-sm font-semibold">Your rating<select value={rating} onChange={(e)=>setRating(Number(e.target.value))} className="mt-1 h-10 w-full rounded-lg border bg-background px-3"><option value={5}>5 — Excellent</option><option value={4}>4 — Very good</option><option value={3}>3 — Good</option><option value={2}>2 — Fair</option><option value={1}>1 — Poor</option></select></label><label className="block text-sm font-semibold">Your feedback<textarea value={review} onChange={(e)=>setReview(e.target.value)} minLength={10} maxLength={1000} rows={3} className="mt-1 w-full rounded-lg border bg-background p-3 text-sm font-normal" placeholder="Describe your learning experience."/></label><button disabled={busyId===booking.id||review.trim().length<10} onClick={()=>void submitReview(booking.id)} className="min-h-10 rounded-lg bg-primary px-4 text-sm font-bold text-white disabled:opacity-50">Submit verified review</button></div>}
          </article>
        })}</div>}
    </section>
  )
}
