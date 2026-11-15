import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Check, FileText, MessageCircle, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { monthlyFee, WEEKDAYS_SHORT } from '@/lib/tutors'
import { Button } from '@/components/ui/button'
import { EmptyState, Pill } from '@/components/ds/Primitives'

// Admin · Tutors: review applications, pause or restore approved tutors, and
// see every booking. The admin layout (admin.tsx) has already checked that the
// user is an admin with an unlocked session.
export const Route = createFileRoute('/admin/tutors')({
  component: AdminTutors,
})

type Tab = 'applications' | 'tutors' | 'bookings'

type Application = {
  id: string; user_id: string; full_name: string; phone: string; bio: string; qualifications: string
  experience_years: number; location: string; teaching_mode: string; document_path: string | null
  avatar_path: string | null; status: string; review_note: string | null; created_at: string; reviewed_at: string | null
  tutor_application_subjects: { price_nle: number; lessons_per_week: number | null; subject: { name: string } | null }[]
}
type TutorRow = {
  id: string; user_id: string; full_name: string; location: string; teaching_mode: string; status: string; verified_at: string
  tutor_subjects: { price_nle: number; lessons_per_week: number | null; subject: { name: string } | null }[]
  tutor_availability: { weekday: number; starts_at: string; ends_at: string }[]
}
type BookingRow = {
  id: string; starts_at: string; duration_minutes: number; price_nle: number; status: string; student_id: string
  student_message: string | null; created_at: string
  subject: { name: string } | null; tutor: { full_name: string } | null
}

const MODE = { online: 'Online', in_person: 'In person', both: 'Online and in person' } as Record<string, string>
const when = (v: string) => new Date(v).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

/** wa.me needs digits only, with Sierra Leone's 232 country code. */
function waNumber(phone: string): string {
  const d = phone.replace(/\D/g, '')
  if (d.startsWith('232')) return d
  if (d.startsWith('0')) return `232${d.slice(1)}`
  return d.length <= 8 ? `232${d}` : d
}

function friendly(err: unknown): string {
  const msg = err instanceof Error ? err.message : String((err as { message?: string })?.message ?? err)
  if (/set_tutor_status|schema cache/i.test(msg)) return 'This needs the latest database update: run supabase/migrations/20261112_14_tutor_monthly_pricing_and_admin.sql in the Supabase SQL editor.'
  return msg
}

function AdminTutors() {
  const qc = useQueryClient()
  const [tab, setTab] = useState<Tab>('applications')
  const [showReviewed, setShowReviewed] = useState(false)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const applications = useQuery({
    queryKey: ['admin-tutor-applications'],
    queryFn: async (): Promise<Application[]> => {
      const { data, error } = await supabase.from('tutor_applications')
        .select('id,user_id,full_name,phone,bio,qualifications,experience_years,location,teaching_mode,document_path,avatar_path,status,review_note,created_at,reviewed_at,tutor_application_subjects(price_nle,lessons_per_week,subject:subjects(name))')
        .order('created_at', { ascending: false }).limit(300)
      if (error) throw error
      return (data ?? []) as unknown as Application[]
    },
  })
  const tutors = useQuery({
    queryKey: ['admin-tutors'],
    queryFn: async (): Promise<TutorRow[]> => {
      const { data, error } = await supabase.from('tutors')
        .select('id,user_id,full_name,location,teaching_mode,status,verified_at,tutor_subjects(price_nle,lessons_per_week,subject:subjects(name)),tutor_availability(weekday,starts_at,ends_at)')
        .order('verified_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as unknown as TutorRow[]
    },
  })
  const bookings = useQuery({
    queryKey: ['admin-tutor-bookings'],
    queryFn: async (): Promise<{ rows: BookingRow[]; names: Record<string, string> }> => {
      const { data, error } = await supabase.from('tutor_bookings')
        .select('id,starts_at,duration_minutes,price_nle,status,student_id,student_message,created_at,subject:subjects(name),tutor:tutors(full_name)')
        .order('created_at', { ascending: false }).limit(300)
      if (error) throw error
      const rows = (data ?? []) as unknown as BookingRow[]
      const ids = [...new Set(rows.map((r) => r.student_id))]
      const names: Record<string, string> = {}
      if (ids.length) {
        const { data: people } = await supabase.from('profiles').select('id,full_name').in('id', ids)
        for (const p of people ?? []) names[p.id] = p.full_name ?? ''
      }
      return { rows, names }
    },
  })

  const refresh = () => Promise.all(['admin-tutor-applications', 'admin-tutors', 'admin-tutor-bookings', 'admin-pending-counts'].map((k) => qc.invalidateQueries({ queryKey: [k] })))

  const act = async (label: string, fn: () => Promise<void>) => {
    setBusy(true); setError(null); setMessage(null)
    try { await fn(); setMessage(label); await refresh() } catch (err) { setError(friendly(err)) } finally { setBusy(false) }
  }

  const review = (a: Application, decision: 'approved' | 'rejected' | 'under_review') => act(
    decision === 'approved' ? `${a.full_name} approved. Their profile is now in the marketplace.` : decision === 'rejected' ? `${a.full_name}'s application was declined.` : `${a.full_name} marked as under review.`,
    async () => {
      const { error } = await supabase.rpc('review_tutor_application', { p_application_id: a.id, p_decision: decision, p_note: notes[a.id]?.trim() || null })
      if (error) throw error
      if (decision !== 'under_review') {
        await supabase.functions.invoke('send-notification-email', { body: { entity_id: a.id, event_type: decision === 'approved' ? 'tutor_approved' : 'tutor_rejected' } }).catch(() => undefined)
      }
    },
  )

  const setStatus = (t: TutorRow, status: 'active' | 'suspended') => act(
    status === 'active' ? `${t.full_name} is visible again.` : `${t.full_name} is paused and hidden from the marketplace.`,
    async () => {
      const { error } = await supabase.rpc('set_tutor_status', { p_tutor_id: t.id, p_status: status })
      if (error) throw error
    },
  )

  const updateBooking = (b: BookingRow, status: 'cancelled' | 'no_show' | 'completed') => act(
    `Booking marked ${status.replace('_', ' ')}.`,
    async () => {
      const { error } = await supabase.rpc('update_tutor_booking', { p_booking_id: b.id, p_status: status, p_reason: status === 'cancelled' ? 'Cancelled by WASSCE Tutor' : null })
      if (error) throw error
    },
  )

  const openDocument = async (path: string) => {
    const { data, error } = await supabase.storage.from('tutor-verification-docs').createSignedUrl(path, 120)
    if (error || !data?.signedUrl) return setError(error?.message ?? 'Could not open the document.')
    window.open(data.signedUrl, '_blank', 'noopener')
  }

  const apps = applications.data ?? []
  const pending = apps.filter((a) => a.status === 'submitted' || a.status === 'under_review')
  const reviewed = apps.filter((a) => a.status === 'approved' || a.status === 'rejected')
  const tutorRows = tutors.data ?? []
  const bookingRows = bookings.data?.rows ?? []
  const openBookings = bookingRows.filter((b) => ['requested', 'accepted', 'confirmed'].includes(b.status)).length
  const phoneFor = (userId: string) => apps.find((a) => a.user_id === userId && a.status === 'approved')?.phone

  const tabs: [Tab, string][] = [
    ['applications', `Applications (${pending.length})`],
    ['tutors', `Tutors (${tutorRows.length})`],
    ['bookings', `Bookings (${openBookings} open)`],
  ]

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Admin</p>
          <h1 className="text-2xl font-bold">Tutors</h1>
        </div>
        <Link to="/admin"><Button variant="outline" size="sm">Back</Button></Link>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist">
        {tabs.map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
            className={`min-h-10 rounded-full border px-4 text-sm font-semibold ${tab === id ? 'border-primary bg-brand-soft text-primary' : 'bg-card'}`}>{label}</button>
        ))}
      </div>

      {message && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">{message}</p>}
      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      {tab === 'applications' && (
        applications.isLoading ? <p className="text-muted-foreground">Loading…</p>
          : applications.error ? <EmptyState title="Could not load applications" body={friendly(applications.error)} />
          : (
            <div className="space-y-4">
              {pending.length === 0 ? <EmptyState title="No applications waiting" body="New tutor applications appear here, and you get an email and an inbox alert when one arrives." /> : pending.map((a) => (
                <article key={a.id} className="space-y-3 rounded-2xl border bg-card p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {a.avatar_path ? <img src={supabase.storage.from('tutor-profile-images').getPublicUrl(a.avatar_path).data.publicUrl} alt="" className="h-14 w-14 rounded-xl object-cover" /> : <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-lg font-bold">{a.full_name.slice(0, 1)}</span>}
                      <div>
                        <h2 className="font-bold">{a.full_name}</h2>
                        <p className="text-xs text-muted-foreground">{a.location} · {MODE[a.teaching_mode] ?? a.teaching_mode} · {a.experience_years === 0 ? 'New tutor' : `${a.experience_years} years' experience`} · applied {when(a.created_at)}</p>
                      </div>
                    </div>
                    <Pill className="bg-amber-50 text-amber-800">{a.status === 'under_review' ? 'Under review' : 'New'}</Pill>
                  </div>
                  <p className="whitespace-pre-wrap text-sm">{a.bio}</p>
                  <p className="whitespace-pre-wrap text-sm text-muted-foreground"><span className="font-semibold text-foreground">Qualifications:</span> {a.qualifications}</p>
                  <div className="flex flex-wrap gap-2">{a.tutor_application_subjects.map((s, i) => <span key={i} className="rounded-lg bg-muted px-2.5 py-1 text-xs">{s.subject?.name} · {monthlyFee(s.price_nle)}{s.lessons_per_week ? ` · ${s.lessons_per_week} a week` : ''}</span>)}</div>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline"><a href={`https://wa.me/${waNumber(a.phone)}`} target="_blank" rel="noopener"><MessageCircle className="h-4 w-4" aria-hidden /> {a.phone}</a></Button>
                    {a.document_path && <Button size="sm" variant="outline" onClick={() => void openDocument(a.document_path!)}><FileText className="h-4 w-4" aria-hidden /> Supporting document</Button>}
                  </div>
                  <textarea value={notes[a.id] ?? ''} onChange={(e) => setNotes((n) => ({ ...n, [a.id]: e.target.value }))} rows={2} maxLength={1000}
                    placeholder="Note to the applicant (optional; sent with a decline)" className="w-full rounded-xl border border-input bg-card px-3 py-2 text-sm" />
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" disabled={busy} onClick={() => void review(a, 'approved')} className="bg-emerald-700 hover:bg-emerald-800"><Check className="h-4 w-4" aria-hidden /> Approve</Button>
                    {a.status === 'submitted' && <Button size="sm" variant="outline" disabled={busy} onClick={() => void review(a, 'under_review')}>Mark under review</Button>}
                    <Button size="sm" variant="outline" disabled={busy} onClick={() => void review(a, 'rejected')} className="border-red-200 text-red-700"><X className="h-4 w-4" aria-hidden /> Decline</Button>
                  </div>
                </article>
              ))}
              {reviewed.length > 0 && (
                <div className="space-y-2">
                  <button type="button" onClick={() => setShowReviewed((v) => !v)} className="text-sm font-semibold text-primary">{showReviewed ? 'Hide' : 'Show'} reviewed applications ({reviewed.length})</button>
                  {showReviewed && <ul className="divide-y rounded-2xl border bg-card">{reviewed.map((a) => (
                    <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm">
                      <span><span className="font-semibold">{a.full_name}</span> · {a.location}{a.review_note ? ` · “${a.review_note}”` : ''}</span>
                      <Pill className={a.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-muted text-muted-foreground'}>{a.status === 'approved' ? 'Approved' : 'Declined'}{a.reviewed_at ? ` ${new Date(a.reviewed_at).toLocaleDateString('en-GB')}` : ''}</Pill>
                    </li>
                  ))}</ul>}
                </div>
              )}
            </div>
          )
      )}

      {tab === 'tutors' && (
        tutors.isLoading ? <p className="text-muted-foreground">Loading…</p>
          : tutors.error ? <EmptyState title="Could not load tutors" body={friendly(tutors.error)} />
          : tutorRows.length === 0 ? <EmptyState title="No approved tutors yet" body="Approve an application and the tutor appears here and in the marketplace." />
          : (
            <ul className="space-y-3">{tutorRows.map((t) => {
              const phone = phoneFor(t.user_id)
              return (
                <li key={t.id} className="space-y-2 rounded-2xl border bg-card p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-bold">{t.full_name}</p>
                      <p className="text-xs text-muted-foreground">{t.location} · {MODE[t.teaching_mode] ?? t.teaching_mode} · approved {new Date(t.verified_at).toLocaleDateString('en-GB')}</p>
                    </div>
                    <Pill className={t.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}>{t.status === 'active' ? 'Listed' : 'Paused'}</Pill>
                  </div>
                  <div className="flex flex-wrap gap-2">{t.tutor_subjects.map((s, i) => <span key={i} className="rounded-lg bg-muted px-2.5 py-1 text-xs">{s.subject?.name} · {monthlyFee(s.price_nle)}{s.lessons_per_week ? ` · ${s.lessons_per_week} a week` : ''}</span>)}</div>
                  <p className="text-xs text-muted-foreground">{t.tutor_availability.length === 0 ? 'No weekly availability published yet, so students cannot send requests.' : `Available: ${[...t.tutor_availability].sort((a, b) => a.weekday - b.weekday).map((s) => `${WEEKDAYS_SHORT[s.weekday]} ${String(s.starts_at).slice(0, 5)}–${String(s.ends_at).slice(0, 5)}`).join(', ')}`}</p>
                  <div className="flex flex-wrap gap-2">
                    {phone && <Button asChild size="sm" variant="outline"><a href={`https://wa.me/${waNumber(phone)}`} target="_blank" rel="noopener"><MessageCircle className="h-4 w-4" aria-hidden /> {phone}</a></Button>}
                    {t.status === 'active'
                      ? <Button size="sm" variant="outline" disabled={busy} onClick={() => void setStatus(t, 'suspended')} className="border-red-200 text-red-700">Pause listing</Button>
                      : <Button size="sm" disabled={busy} onClick={() => void setStatus(t, 'active')}>Restore listing</Button>}
                  </div>
                </li>
              )
            })}</ul>
          )
      )}

      {tab === 'bookings' && (
        bookings.isLoading ? <p className="text-muted-foreground">Loading…</p>
          : bookings.error ? <EmptyState title="Could not load bookings" body={friendly(bookings.error)} />
          : bookingRows.length === 0 ? <EmptyState title="No bookings yet" body="Requests that students send to approved tutors appear here." />
          : (
            <ul className="space-y-3">{bookingRows.map((b) => (
              <li key={b.id} className="space-y-2 rounded-2xl border bg-card p-4 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-bold">{b.subject?.name ?? 'Tutoring'} · {b.tutor?.full_name ?? 'Tutor'}</p>
                    <p className="text-xs text-muted-foreground">Student: {bookings.data?.names[b.student_id] || 'Student'} · first lesson {when(b.starts_at)} · {b.duration_minutes} min · {monthlyFee(b.price_nle)}</p>
                  </div>
                  <Pill>{b.status.replace('_', ' ')}</Pill>
                </div>
                {b.student_message && <p className="whitespace-pre-wrap text-muted-foreground">{b.student_message}</p>}
                {['requested', 'accepted', 'confirmed'].includes(b.status) && (
                  <div className="flex flex-wrap gap-2">
                    {['accepted', 'confirmed'].includes(b.status) && <Button size="sm" variant="outline" disabled={busy} onClick={() => void updateBooking(b, 'completed')}>Mark completed</Button>}
                    {['accepted', 'confirmed'].includes(b.status) && <Button size="sm" variant="outline" disabled={busy} onClick={() => void updateBooking(b, 'no_show')}>Mark no-show</Button>}
                    <Button size="sm" variant="outline" disabled={busy} onClick={() => void updateBooking(b, 'cancelled')} className="border-red-200 text-red-700">Cancel</Button>
                  </div>
                )}
              </li>
            ))}</ul>
          )
      )}
    </div>
  )
}
