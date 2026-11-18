// The tutor application, in three short steps: who you are (photo, name,
// WhatsApp, town), what you teach (subjects, monthly fee, lessons a week) and
// how you teach (experience, qualifications, a few lines for students). The
// card students will see is built live beside the form, so the tutor knows
// exactly what they are publishing. Text answers are kept for this browser
// tab (sessionStorage), so a phone that reloads the page after taking a photo
// does not lose them.
//
// Submitting calls submit_tutor_application() (migration 25). While automatic
// approval is on the card is in the marketplace at once; the parent shows the
// result from what the database says, not from what this form expected.
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, Check, FileUp, Lock, Pencil, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { photoProblem } from '@/lib/photo'
import { LESSONS_PER_WEEK } from '@/lib/tutor-pricing'
import { PhotoPicker } from '@/components/tutors/PhotoPicker'
import { TutorCard, type Tutor } from '@/components/tutors/Marketplace'
import { WhatsAppGlyph } from '@/components/WhatsAppGlyph'

type Subject = { id: string; name: string }
type Chosen = { id: string; fee: string; lessons: number }
type Draft = {
  fullName: string
  phone: string
  location: string
  experience: number
  qualifications: string
  bio: string
  chosen: Chosen[]
}

export type ApplyResult = { live: boolean; card: Tutor; photo: string | null; phone: string }

const STEPS = [
  { title: 'Introduce yourself', short: 'You', lede: 'Your photo and name go on your card. Your WhatsApp number stays private: students get it only after they agree to your fee.' },
  { title: 'What you teach', short: 'Subjects', lede: 'Choose your subjects, then set a monthly fee and how many lessons a week it includes. You can change these later.' },
  { title: 'How you teach', short: 'About you', lede: 'A few honest lines help students choose you. Say what you studied, where you teach and how your lessons work.' },
] as const

const TOWNS = ['Freetown', 'Bo', 'Kenema', 'Makeni', 'Koidu', 'Port Loko', 'Waterloo', 'Lunsar', 'Kabala', 'Magburaka', 'Kailahun', 'Bonthe', 'Moyamba', 'Pujehun', 'Kambia']
const BIO_MIN = 80
const DOC_TYPES = ['application/pdf', 'image/jpeg', 'image/png']

const field =
  'h-12 w-full rounded-xl border border-[color-mix(in_srgb,var(--border)_90%,transparent)] bg-[var(--card)] px-3.5 text-[15px] text-foreground shadow-[inset_0_1px_2px_rgb(23_28_43/4%)] outline-none transition placeholder:text-muted-foreground/70 focus:border-[var(--primary)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--primary)_14%,transparent)]'

const digits = (s: string) => s.replace(/\D/g, '')
const safeName = (name: string) => name.toLowerCase().replace(/[^a-z0-9._-]/g, '-').slice(-80)

function readDraft(key: string): Partial<Draft> {
  try {
    const raw = window.sessionStorage.getItem(key)
    return raw ? (JSON.parse(raw) as Partial<Draft>) : {}
  } catch {
    return {}
  }
}

function exampleBio(d: Draft, names: string[]): string {
  const what = names.length ? names.slice(0, 3).join(', ').replace(/, ([^,]*)$/, ' and $1') : 'my subjects'
  const where = d.location.trim() || 'my area'
  return `I teach WASSCE ${what} in ${where}. In each lesson we work through the syllabus topic by topic, practise exam-style questions and go over every mistake until it makes sense. I give short homework and check it at the next lesson.`
}

export function TutorApplyForm({
  userId,
  defaultName,
  auto,
  previousNote,
  onDone,
  onAlreadyApplied,
}: {
  userId: string
  defaultName: string
  /** Automatic approval is on: say "publish", not "send for review". */
  auto: boolean
  /** Why the last application was declined, shown above the form. */
  previousNote?: string | null
  onDone: (result: ApplyResult) => void
  onAlreadyApplied: () => void
}) {
  const draftKey = `tutor-apply:${userId}`
  const [initial] = useState(() => (typeof window === 'undefined' ? {} : readDraft(draftKey)))
  const [step, setStep] = useState(0)
  const [reached, setReached] = useState(0)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [avatar, setAvatar] = useState<File | null>(null)
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [d, setD] = useState<Draft>({
    fullName: initial.fullName ?? defaultName,
    phone: initial.phone ?? '',
    location: initial.location ?? '',
    experience: initial.experience ?? 0,
    qualifications: initial.qualifications ?? '',
    bio: initial.bio ?? '',
    chosen: initial.chosen ?? [],
  })
  const [problem, setProblem] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => {
    setProblem(null)
    setD((prev) => ({ ...prev, [k]: v }))
  }

  useEffect(() => {
    let active = true
    void supabase
      .from('subjects')
      .select('id,name')
      .order('name')
      .then(({ data, error }) => {
        if (active && !error) setSubjects((data ?? []) as Subject[])
      })
    return () => {
      active = false
    }
  }, [])

  // Keep the typed answers for this tab (never the photo or the document).
  useEffect(() => {
    try {
      window.sessionStorage.setItem(draftKey, JSON.stringify(d))
    } catch {
      /* private mode or storage full: the form still works */
    }
  }, [d, draftKey])

  const photo = useMemo(() => (avatar ? URL.createObjectURL(avatar) : null), [avatar])
  useEffect(
    () => () => {
      if (photo) URL.revokeObjectURL(photo)
    },
    [photo],
  )

  const nameOf = (id: string) => subjects.find((s) => s.id === id)?.name ?? ''
  const card: Tutor = {
    id: 'preview',
    avatar_path: null,
    full_name: d.fullName.trim() || 'Your name',
    bio: d.bio.trim() || 'A few lines about how you teach appear here, so students know what your lessons are like.',
    qualifications: d.qualifications.trim() || 'Your qualifications',
    experience_years: d.experience,
    location: d.location.trim() || 'Your town',
    verified_at: new Date(0).toISOString(),
    multi_subject_discount_pct: 0,
    group_max: null,
    group_discount_pct: 0,
    payment_methods: [],
    tutor_subjects: d.chosen.map((c) => ({
      subject_id: c.id,
      price_nle: Number(c.fee) || 0,
      lessons_per_week: c.lessons,
      subject: { id: c.id, name: nameOf(c.id) },
    })),
    tutor_booking_reviews: [],
  }

  /** What still needs doing on a step, in the words shown to the tutor. */
  const problemOn = (s: number): string | null => {
    if (s === 0) {
      if (!avatar) return 'Add your profile photo. Students choose tutors by their photo.'
      if (d.fullName.trim().length < 2) return 'Enter your full name.'
      const n = digits(d.phone).length
      if (n < 8 || n > 15) return 'Enter your WhatsApp number, for example 077 123 456.'
      if (d.location.trim().length < 2) return 'Enter the town or area where you teach.'
    }
    if (s === 1) {
      if (d.chosen.length === 0) return 'Choose at least one subject you teach.'
      if (d.chosen.length > 12) return 'Choose up to 12 subjects.'
      const missing = d.chosen.find((c) => !(Number(c.fee) > 0 && Number(c.fee) <= 999999))
      if (missing) return `Enter your monthly fee for ${nameOf(missing.id) || 'each subject'}.`
    }
    if (s === 2) {
      if (d.qualifications.trim().length < 10) return 'Enter your qualifications, for example "BSc Mathematics, Fourah Bay College".'
      const n = d.bio.trim().length
      if (n < BIO_MIN) return `Write at least ${BIO_MIN} characters about how you teach (${n} so far).`
      if (documentFile && (!DOC_TYPES.includes(documentFile.type) || documentFile.size > 10 * 1024 * 1024))
        return 'The certificate must be a PDF, JPG or PNG no larger than 10 MB.'
    }
    return null
  }

  const goTo = (s: number) => {
    setProblem(null)
    setStep(s)
    setReached((r) => Math.max(r, s))
    if (typeof window !== 'undefined') document.getElementById('apply-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const next = () => {
    const p = problemOn(step)
    if (p) return setProblem(p)
    goTo(step + 1)
  }

  const toggle = (id: string) => {
    setProblem(null)
    setD((prev) =>
      prev.chosen.some((c) => c.id === id)
        ? { ...prev, chosen: prev.chosen.filter((c) => c.id !== id) }
        : { ...prev, chosen: [...prev.chosen, { id, fee: '', lessons: 2 }] },
    )
  }
  const setChosen = (id: string, patch: Partial<Chosen>) => {
    setProblem(null)
    setD((prev) => ({ ...prev, chosen: prev.chosen.map((c) => (c.id === id ? { ...c, ...patch } : c)) }))
  }

  const publish = async () => {
    for (const s of [0, 1, 2]) {
      const p = problemOn(s)
      if (p) {
        goTo(s)
        setProblem(p)
        return
      }
    }
    if (!avatar) return
    setBusy(true)
    setProblem(null)
    let avatarPath: string | null = null
    let documentPath: string | null = null
    try {
      const bad = photoProblem(avatar)
      if (bad) throw new Error(bad)
      avatarPath = `${userId}/${crypto.randomUUID()}-${safeName(avatar.name || 'photo.jpg')}`
      const up = await supabase.storage.from('tutor-profile-images').upload(avatarPath, avatar, { upsert: false, contentType: avatar.type })
      if (up.error) throw new Error('Your photo could not be uploaded. Check your connection and try again.')
      if (documentFile) {
        documentPath = `${userId}/${crypto.randomUUID()}-${safeName(documentFile.name)}`
        const doc = await supabase.storage.from('tutor-verification-docs').upload(documentPath, documentFile, { upsert: false, contentType: documentFile.type })
        if (doc.error) throw new Error('Your certificate could not be uploaded. Try again, or remove it: it is optional.')
      }
      const { data: applicationId, error } = await supabase.rpc('submit_tutor_application', {
        p_full_name: d.fullName.trim(),
        p_phone: d.phone.trim(),
        p_bio: d.bio.trim(),
        p_qualifications: d.qualifications.trim(),
        p_experience_years: d.experience,
        p_location: d.location.trim(),
        p_teaching_mode: 'in_person',
        p_document_path: documentPath,
        p_avatar_path: avatarPath,
        p_subjects: d.chosen.map((c) => ({ subject_id: c.id, price_nle: Number(c.fee), lessons_per_week: c.lessons })),
      })
      if (error) {
        if (/already active/i.test(error.message)) {
          onAlreadyApplied()
          return
        }
        throw new Error(error.message)
      }
      // What the database decided: live now, or waiting for review.
      const { data: saved } = await supabase.from('tutor_applications').select('status').eq('id', applicationId).maybeSingle()
      const live = saved?.status === 'approved'
      // Emails, best effort: the inbox notifications are already saved.
      const email = (event_type: string) =>
        supabase.functions.invoke('send-notification-email', { body: { entity_id: applicationId, event_type } }).catch(() => undefined)
      void Promise.allSettled(live ? [email('tutor_joined'), email('tutor_approved')] : [email('tutor_application_submitted')])
      try {
        window.sessionStorage.removeItem(draftKey)
      } catch {
        /* nothing to clear */
      }
      onDone({ live, card, photo, phone: d.phone.trim() })
    } catch (err) {
      if (avatarPath) await supabase.storage.from('tutor-profile-images').remove([avatarPath])
      if (documentPath) await supabase.storage.from('tutor-verification-docs').remove([documentPath])
      setProblem(err instanceof Error ? err.message : 'Your tutor card could not be saved. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const bioCount = d.bio.trim().length
  const last = step === STEPS.length - 1

  return (
    <div id="apply-top" className="scroll-mt-24">
      <Stepper step={step} reached={reached} onGo={goTo} auto={auto} />

      {previousNote !== undefined && (
        <div className="mt-6 rounded-2xl border border-amber-300/70 bg-amber-50 p-4 text-sm text-amber-950 sm:p-5 dark:border-amber-500/40 dark:bg-amber-950/30 dark:text-amber-100">
          <p className="font-bold">Your last application was not approved.</p>
          {previousNote && <p className="mt-1">Our note: {previousNote}</p>}
          <p className="mt-1">Update your details below and send it again.</p>
        </div>
      )}

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start lg:gap-8">
        <form
          noValidate
          className="site-card p-5 sm:p-8"
          onSubmit={(e) => {
            e.preventDefault()
            if (last) void publish()
            else next()
          }}
        >
          <p className="text-[12px] font-bold uppercase tracking-[.16em] text-[var(--primary)]">
            Step {step + 1} of {STEPS.length}
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] sm:text-[1.75rem]">{STEPS[step].title}</h2>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted-foreground">{STEPS[step].lede}</p>

          <div className="mt-7 space-y-5">
            {step === 0 && (
              <>
                <PhotoPicker
                  required
                  file={avatar}
                  error={avatarError}
                  onPick={(file, why) => {
                    setProblem(null)
                    setAvatarError(why)
                    if (file) setAvatar(file)
                  }}
                />
                <Field label="Full name" hint="As students should see it, for example “Aminata Kamara”.">
                  <input
                    className={field}
                    autoComplete="name"
                    maxLength={120}
                    value={d.fullName}
                    onChange={(e) => set('fullName', e.target.value)}
                  />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="WhatsApp number" hint="Private. Students get it only after they agree to your fee.">
                    <span className="relative block">
                      <WhatsAppGlyph className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#25D366]" />
                      <input
                        className={`${field} pl-10`}
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        maxLength={30}
                        placeholder="077 123 456"
                        value={d.phone}
                        onChange={(e) => set('phone', e.target.value)}
                      />
                    </span>
                  </Field>
                  <Field label="Town or area" hint="Where you give lessons in person.">
                    <input
                      className={`${field} [&::-webkit-calendar-picker-indicator]:!hidden`}
                      list="tutor-towns"
                      maxLength={120}
                      placeholder="e.g. Freetown, Kissy"
                      value={d.location}
                      onChange={(e) => set('location', e.target.value)}
                    />
                    <datalist id="tutor-towns">
                      {TOWNS.map((t) => (
                        <option key={t} value={t} />
                      ))}
                    </datalist>
                  </Field>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <fieldset>
                  <legend className="text-sm font-semibold">Subjects you teach</legend>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {subjects.length === 0
                      ? Array.from({ length: 10 }, (_, i) => <li key={i} className="h-10 w-32 animate-pulse rounded-full bg-muted" aria-hidden />)
                      : subjects.map((s) => {
                          const on = d.chosen.some((c) => c.id === s.id)
                          return (
                            <li key={s.id}>
                              <button
                                type="button"
                                aria-pressed={on}
                                onClick={() => toggle(s.id)}
                                className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-4 text-[14px] font-semibold transition ${
                                  on
                                    ? 'border-transparent bg-[var(--site-ink)] text-white shadow-[0_8px_18px_-10px_rgba(19,13,43,.7)] dark:bg-white dark:text-[var(--site-ink)]'
                                    : 'border-border bg-[var(--card)] text-foreground hover:border-[color-mix(in_srgb,var(--primary)_45%,var(--border))]'
                                }`}
                              >
                                {on && <Check className="h-4 w-4" aria-hidden />}
                                {s.name}
                              </button>
                            </li>
                          )
                        })}
                  </ul>
                </fieldset>

                {d.chosen.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold">Your monthly fees</p>
                    <ul className="mt-3 divide-y divide-border overflow-hidden rounded-2xl border border-border">
                      {d.chosen.map((c) => (
                        <li key={c.id} className="bg-[var(--card)] p-4 sm:px-5">
                          <div className="flex items-center justify-between gap-3">
                            <span className="min-w-0 truncate text-[15px] font-bold">{nameOf(c.id)}</span>
                            <button
                              type="button"
                              onClick={() => toggle(c.id)}
                              className="-mr-1.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
                              aria-label={`Remove ${nameOf(c.id)}`}
                            >
                              <X className="h-4 w-4" aria-hidden />
                            </button>
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3">
                            <label className="relative">
                              <span className="sr-only">{nameOf(c.id)} monthly fee in NLe</span>
                              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] font-bold text-muted-foreground">NLe</span>
                              <input
                                className={`${field.replace('w-full ', '')} h-11 w-48 pl-12 pr-[4.25rem] text-right font-semibold tabular-nums`}
                                inputMode="numeric"
                                placeholder="0"
                                value={c.fee}
                                onChange={(e) => setChosen(c.id, { fee: digits(e.target.value).slice(0, 6) })}
                              />
                              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-muted-foreground">/ month</span>
                            </label>
                            <span className="flex items-center gap-2">
                              <span className="text-[13px] text-muted-foreground" id={`lw-${c.id}`}>
                                Lessons a week
                              </span>
                              <span role="radiogroup" aria-labelledby={`lw-${c.id}`} className="inline-flex rounded-xl bg-muted p-1">
                                {LESSONS_PER_WEEK.map((n) => (
                                  <button
                                    key={n}
                                    type="button"
                                    role="radio"
                                    aria-checked={c.lessons === n}
                                    onClick={() => setChosen(c.id, { lessons: n })}
                                    className={`h-8 w-8 rounded-lg text-[13px] font-bold tabular-nums transition ${
                                      c.lessons === n ? 'bg-[var(--card)] text-[var(--primary)] shadow-sm ring-1 ring-border' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                  >
                                    {n}
                                  </button>
                                ))}
                              </span>
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2.5 text-[13px] text-muted-foreground">
                      Later, on your dashboard, you can add a discount for several subjects, take small groups and show how students can pay you.
                    </p>
                  </div>
                )}
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid gap-5 sm:grid-cols-[12rem_minmax(0,1fr)]">
                  <Field label="Teaching experience">
                    <select className={field} value={d.experience} onChange={(e) => set('experience', Number(e.target.value))}>
                      {Array.from({ length: 41 }, (_, i) => (
                        <option key={i} value={i}>
                          {i === 0 ? 'New tutor' : `${i} ${i === 1 ? 'year' : 'years'}`}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Qualifications" hint="Your highest qualification and where you studied or teach.">
                    <input
                      className={field}
                      maxLength={300}
                      placeholder="e.g. BSc Mathematics, Fourah Bay College"
                      value={d.qualifications}
                      onChange={(e) => set('qualifications', e.target.value)}
                    />
                  </Field>
                </div>

                <div>
                  <div className="flex items-end justify-between gap-3">
                    <label htmlFor="tutor-bio" className="text-sm font-semibold">
                      About your lessons
                    </label>
                    {d.bio.trim().length === 0 && (
                      <button
                        type="button"
                        onClick={() => set('bio', exampleBio(d, d.chosen.map((c) => nameOf(c.id)).filter(Boolean)))}
                        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--primary)] hover:underline"
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden /> Start from an example
                      </button>
                    )}
                  </div>
                  <textarea
                    id="tutor-bio"
                    rows={5}
                    maxLength={2000}
                    className={`${field} mt-2 h-auto py-3 leading-relaxed`}
                    placeholder="How do your lessons work? Who do you teach best? What results have your students had?"
                    value={d.bio}
                    onChange={(e) => set('bio', e.target.value)}
                  />
                  <div className="mt-2 flex items-center gap-3">
                    <span className="h-1 flex-1 overflow-hidden rounded-full bg-muted" aria-hidden>
                      <span
                        className={`block h-full rounded-full transition-all ${bioCount >= BIO_MIN ? 'bg-emerald-500' : 'bg-[var(--primary)]'}`}
                        style={{ width: `${Math.min(100, (bioCount / BIO_MIN) * 100)}%` }}
                      />
                    </span>
                    <span className={`text-[12px] font-semibold tabular-nums ${bioCount >= BIO_MIN ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                      {bioCount >= BIO_MIN ? 'Good length' : `${bioCount} / ${BIO_MIN} characters`}
                    </span>
                  </div>
                </div>

                <label className="flex cursor-pointer items-center gap-3.5 rounded-2xl border border-dashed border-border bg-muted/30 p-4 transition hover:border-[color-mix(in_srgb,var(--primary)_45%,var(--border))]">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--card)] text-[var(--primary)] ring-1 ring-border">
                    <FileUp className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1 text-sm">
                    <span className="block font-semibold">
                      {documentFile ? documentFile.name : 'Add a certificate'} <span className="font-normal text-muted-foreground">(optional)</span>
                    </span>
                    <span className="block text-[13px] text-muted-foreground">PDF, JPG or PNG up to 10 MB. Only our team sees it.</span>
                  </span>
                  {documentFile && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        setDocumentFile(null)
                      }}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
                      aria-label="Remove the certificate"
                    >
                      <X className="h-4 w-4" aria-hidden />
                    </button>
                  )}
                  <input type="file" accept=".pdf,image/jpeg,image/png" className="sr-only" onChange={(e) => setDocumentFile(e.target.files?.[0] ?? null)} />
                </label>

                {/* On phones the preview is not beside the form: show it before publishing. */}
                <details className="group rounded-2xl border border-border lg:hidden">
                  <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 text-sm font-semibold">
                    Preview your card <span className="text-[var(--primary)] group-open:hidden">Show</span>
                    <span className="hidden text-[var(--primary)] group-open:inline">Hide</span>
                  </summary>
                  <div className="mx-auto max-w-sm px-4 pb-4">
                    <TutorCard tutor={card} preview photoSrc={photo} />
                  </div>
                </details>
              </>
            )}
          </div>

          {problem && (
            <p role="alert" className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800 dark:border-rose-500/40 dark:bg-rose-950/40 dark:text-rose-100">
              {problem}
            </p>
          )}

          {last && (
            <p className="mt-6 flex gap-2.5 text-[13px] leading-relaxed text-muted-foreground">
              <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>
                By {auto ? 'publishing' : 'sending'}, you confirm these details are true and agree that students who accept your fee can message you on
                WhatsApp{digits(d.phone).length >= 8 ? ` at ${d.phone.trim()}` : ''}. Your number is never shown on your card.
              </span>
            </p>
          )}

          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            {step > 0 ? (
              <button type="button" onClick={() => goTo(step - 1)} className="site-btn site-btn-secondary" disabled={busy}>
                <ArrowLeft className="h-4 w-4" aria-hidden /> Back
              </button>
            ) : (
              <span className="hidden sm:block" />
            )}
            <button type="submit" className="site-btn site-btn-lg site-btn-primary" disabled={busy}>
              {busy ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden /> {auto ? 'Publishing your card…' : 'Sending…'}
                </>
              ) : last ? (
                <>
                  {auto ? 'Publish my tutor card' : 'Send my application'} <Check className="h-4 w-4" aria-hidden />
                </>
              ) : (
                <>
                  Continue <ArrowRight className="h-4 w-4" aria-hidden />
                </>
              )}
            </button>
          </div>
        </form>

        <aside className="hidden lg:sticky lg:top-24 lg:block" aria-label="Preview of your tutor card">
          <p className="mb-3 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[.16em] text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,.18)]" aria-hidden /> Live preview
          </p>
          <TutorCard tutor={card} preview photoSrc={photo} />
          <p className="mt-3 text-center text-[13px] text-muted-foreground">This is your card in the marketplace. You can edit it any time.</p>
        </aside>
      </div>
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <span className="mt-2 block">{children}</span>
      {hint && <span className="mt-1.5 block text-[13px] leading-snug text-muted-foreground">{hint}</span>}
    </label>
  )
}

/** The three steps, on the dark header: done ones ticked, the current one lit. */
function Stepper({ step, reached, onGo, auto }: { step: number; reached: number; onGo: (s: number) => void; auto: boolean }) {
  return (
    <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-[var(--site-ink)] px-5 py-7 text-white sm:px-9 sm:py-9">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(40rem_20rem_at_100%_0%,rgba(124,92,255,.38),transparent_70%),radial-gradient(30rem_16rem_at_0%_120%,rgba(255,209,102,.16),transparent_70%)]" />
      <p className="text-[12px] font-bold uppercase tracking-[.16em] text-[#cdbcff]">Become a tutor</p>
      <h1 className="mt-2.5 text-[1.9rem] font-extrabold leading-[1.06] tracking-[-0.04em] sm:text-[2.6rem]">
        Your tutor card, <span className="site-accent text-[#cdbcff]">in three steps.</span>
      </h1>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/70">
        About five minutes. {auto ? 'It goes live in the marketplace the moment you finish.' : 'Our team checks it, then it goes live in the marketplace.'}
      </p>
      <ol className="mt-7 grid grid-cols-3 gap-2.5 sm:gap-4">
        {STEPS.map((s, i) => {
          const done = i < step
          const current = i === step
          return (
            <li key={s.short} className="min-w-0">
              <button
                type="button"
                disabled={i > reached}
                onClick={() => onGo(i)}
                aria-current={current ? 'step' : undefined}
                className="group block w-full text-left disabled:cursor-default"
              >
                <span className="block h-1 overflow-hidden rounded-full bg-white/15">
                  <span className="block h-full rounded-full bg-[#ffd166] transition-all duration-500" style={{ width: done ? '100%' : current ? '45%' : '0%' }} />
                </span>
                <span className="mt-3 flex items-center gap-2">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
                      done ? 'bg-[#ffd166] text-[var(--site-ink)]' : current ? 'bg-white text-[var(--site-ink)]' : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden /> : i + 1}
                  </span>
                  <span className={`truncate text-[13px] font-semibold sm:text-sm ${current || done ? 'text-white' : 'text-white/55'}`}>{s.short}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
