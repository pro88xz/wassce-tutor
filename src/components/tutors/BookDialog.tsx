// "Book this tutor": the student picks one or more subjects and, if the tutor
// takes small groups, how many are learning together, sees the price with the
// tutor's discounts, and on agreeing is sent to WhatsApp with a message ready
// (see the notes at the top of Marketplace.tsx).
import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/lib/queries'
import { lessonsText, listText, nle, paymentText, quote } from '@/lib/tutor-pricing'
import { WhatsAppGlyph } from '@/components/WhatsAppGlyph'
import type { Tutor } from './Marketplace'
import { byName, firstName, initials, offerOf, photoUrl } from './tutor-display'
import { VerifiedBadge } from './VerifiedBadge'

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

export function BookDialog({
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
            <p className="text-xs font-bold uppercase tracking-wider text-violet-700">Book a private tutor</p>
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
