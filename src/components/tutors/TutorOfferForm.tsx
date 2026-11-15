// On the tutor dashboard: a tutor's fees, lessons a week, discounts, small
// groups and how students can pay them. Saved with update_tutor_offer()
// (migration 19); students see all of it on the tutor card and when booking.
import { useEffect, useState } from 'react'
import { Tag, Users, Wallet } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import {
  GROUP_DISCOUNTS, GROUP_SIZES, LESSONS_PER_WEEK, PAYMENT_METHODS, SUBJECT_DISCOUNTS,
  listText, nle, quote,
} from '@/lib/tutor-pricing'

export type OfferTutor = {
  id: string
  multi_subject_discount_pct: number | null
  group_max: number | null
  group_discount_pct: number | null
  payment_methods: string[] | null
}
type Row = { subject_id: string; name: string; price: string; lessons: number | null }

const select = 'h-10 rounded-lg border bg-card px-2 text-sm text-foreground'

export function TutorOfferForm({ tutor, onSaved, onError }: { tutor: OfferTutor; onSaved: (message: string) => void; onError: (message: string) => void }) {
  const [rows, setRows] = useState<Row[] | null>(null)
  const [multi, setMulti] = useState(tutor.multi_subject_discount_pct ?? 0)
  const [groupMax, setGroupMax] = useState<number | null>(tutor.group_max)
  const [groupPct, setGroupPct] = useState(tutor.group_discount_pct ?? 0)
  const [methods, setMethods] = useState<string[]>(tutor.payment_methods ?? [])
  const [busy, setBusy] = useState(false)
  const [loadError, setLoadError] = useState(false)

  // Loaded once per tutor: re-loading would throw away unsaved edits.
  useEffect(() => {
    let active = true
    void supabase
      .from('tutor_subjects')
      .select('subject_id,price_nle,lessons_per_week,subject:subjects(name)')
      .eq('tutor_id', tutor.id)
      .then(({ data, error }) => {
        if (!active) return
        if (error) {
          setLoadError(true)
          setRows([])
          return
        }
        const list = (data ?? []) as unknown as { subject_id: string; price_nle: number; lessons_per_week: number | null; subject: { name: string } | null }[]
        setRows(list.map((s) => ({ subject_id: s.subject_id, name: s.subject?.name ?? 'Subject', price: String(Number(s.price_nle)), lessons: s.lessons_per_week })).sort((a, b) => a.name.localeCompare(b.name)))
      })
    return () => {
      active = false
    }
  }, [tutor.id])

  if (rows === null) return <div className="h-40 animate-pulse rounded-xl bg-muted" aria-hidden />
  if (loadError) return <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">Could not load your fees. Refresh the page to try again.</p>

  const priceOk = (v: string) => Number(v) > 0 && Number(v) <= 999999
  const missingLessons = rows.some((r) => !r.lessons)
  const valid = rows.length > 0 && rows.every((r) => priceOk(r.price) && r.lessons)
  const set = (id: string, change: Partial<Row>) => setRows((now) => (now ?? []).map((r) => (r.subject_id === id ? { ...r, ...change } : r)))

  // A worked example, so the tutor sees what their choices mean for a student.
  const offer = { multiSubjectDiscountPct: multi, groupMax, groupDiscountPct: groupMax ? groupPct : 0 }
  const all = rows.filter((r) => priceOk(r.price)).map((r) => ({ price: Number(r.price), lessonsPerWeek: r.lessons }))
  const alone = all.length ? quote(all, offer, 1) : null
  const group = all.length && groupMax ? quote(all, offer, groupMax) : null

  const save = async () => {
    setBusy(true)
    try {
      const { error } = await supabase.rpc('update_tutor_offer', {
        p_subjects: rows.map((r) => ({ subject_id: r.subject_id, price_nle: Number(r.price), lessons_per_week: r.lessons })),
        p_multi_subject_discount_pct: multi,
        p_group_max: groupMax,
        p_group_discount_pct: groupMax ? groupPct : 0,
        p_payment_methods: methods,
      })
      if (error) throw error
      onSaved('Your fees and offers are saved. Students see them on your tutor card.')
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Could not save your fees and offers.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-bold">Fees and lessons a week</h3>
        <p className="mt-1 text-xs text-muted-foreground">Your monthly fee for each subject, and how many lessons a week it includes. Students see both before they message you.</p>
        {missingLessons && <p className="mt-2 rounded-lg bg-amber-50 p-2.5 text-xs font-semibold text-amber-900">Add lessons a week for each subject, so students can see what your fee buys.</p>}
        <ul className="mt-3 space-y-2">
          {rows.map((r) => (
            <li key={r.subject_id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 text-sm">
              <span className="min-w-0 flex-1 font-medium">{r.name}</span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                NLe
                <input aria-label={`${r.name} monthly fee in NLe`} type="number" inputMode="numeric" min="1" max="999999" step="1" value={r.price} onChange={(e) => set(r.subject_id, { price: e.target.value })} className="h-10 w-24 rounded-lg border px-2 text-sm text-foreground" />
                / month
              </span>
              <select aria-label={`${r.name}: lessons a week`} value={r.lessons ?? ''} onChange={(e) => set(r.subject_id, { lessons: e.target.value ? Number(e.target.value) : null })} className={select}>
                <option value="">Lessons a week</option>
                {LESSONS_PER_WEEK.map((n) => <option key={n} value={n}>{n} a week</option>)}
              </select>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5 text-sm">
          <span className="flex items-center gap-1.5 font-semibold"><Tag className="h-4 w-4 text-primary" aria-hidden /> Discount for 2 or more subjects</span>
          <select value={multi} onChange={(e) => setMulti(Number(e.target.value))} className={`${select} w-full`}>
            {SUBJECT_DISCOUNTS.map((p) => <option key={p} value={p}>{p === 0 ? 'No discount' : `${p}% off`}</option>)}
          </select>
          <span className="block text-xs text-muted-foreground">Families save, and you keep one student for several subjects.</span>
        </label>
        <div className="space-y-1.5 text-sm">
          <label className="block space-y-1.5">
            <span className="flex items-center gap-1.5 font-semibold"><Users className="h-4 w-4 text-primary" aria-hidden /> Small groups</span>
            <select value={groupMax ?? ''} onChange={(e) => setGroupMax(e.target.value ? Number(e.target.value) : null)} className={`${select} w-full`}>
              <option value="">One student at a time</option>
              {GROUP_SIZES.map((n) => <option key={n} value={n}>Up to {n} students together</option>)}
            </select>
          </label>
          {groupMax && (
            <label className="block">
              <span className="sr-only">Group discount</span>
              <select value={groupPct} onChange={(e) => setGroupPct(Number(e.target.value))} className={`${select} w-full`}>
                {GROUP_DISCOUNTS.map((p) => <option key={p} value={p}>{p === 0 ? 'Each student pays the full fee' : `Each student pays ${p}% less`}</option>)}
              </select>
            </label>
          )}
          <span className="block text-xs text-muted-foreground">Friends, classmates or brothers and sisters learn together: each pays less, and you earn more for the lesson.</span>
        </div>
      </div>

      <fieldset className="text-sm">
        <legend className="flex items-center gap-1.5 font-semibold"><Wallet className="h-4 w-4 text-primary" aria-hidden /> How students can pay you</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {PAYMENT_METHODS.map((m) => {
            const on = methods.includes(m.id)
            return (
              <label key={m.id} className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border px-3 ${on ? 'border-primary bg-primary/5 font-semibold' : ''}`}>
                <input type="checkbox" checked={on} onChange={() => setMethods((now) => (on ? now.filter((x) => x !== m.id) : [...now, m.id]))} className="h-4 w-4 accent-violet-700" />
                {m.label}
              </label>
            )
          })}
        </div>
        <span className="mt-1.5 block text-xs text-muted-foreground">Students pay you directly. WASSCE Tutor never takes payment for lessons.</span>
      </fieldset>

      {alone && (
        <div className="rounded-xl bg-muted/60 p-3.5 text-sm">
          <p className="font-semibold">What students see</p>
          <p className="mt-1 text-muted-foreground">
            One student taking {all.length === 1 ? listText(rows.map((r) => r.name)) : all.length === 2 ? 'both your subjects' : `all ${all.length} of your subjects`} pays <strong className="text-foreground">{nle(alone.perStudent)} a month</strong>
            {alone.saving > 0 && ` (saves ${nle(alone.saving)})`}.
            {group && <> A group of {groupMax} pays <strong className="text-foreground">{nle(group.perStudent)} each</strong>, {nle(group.total)} a month in total.</>}
          </p>
        </div>
      )}

      <button type="button" disabled={busy || !valid} onClick={() => void save()} className="min-h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-white disabled:opacity-50">
        {busy ? 'Saving…' : 'Save fees and offers'}
      </button>
    </div>
  )
}
