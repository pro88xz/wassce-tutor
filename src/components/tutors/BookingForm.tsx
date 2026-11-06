import { useState, type FormEvent } from 'react'
import { CircleCheck, MessageCircle } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { LEVELS, MODES, saveTutorRequest, whatsappLink, type Level, type Mode, type TutorRequest } from '@/lib/tutors'
import { Button } from '@/components/ui/button'

const field = 'h-12 w-full rounded-xl border border-input bg-card px-3.5 text-[15px] outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30'
const label = 'block text-sm font-semibold'

/** The tutor request form. Saves the request, then hands it to WhatsApp to confirm. */
export function BookingForm({ subjects, defaultSubject }: { subjects: string[]; defaultSubject?: string }) {
  const { user } = useAuth()
  const [r, setR] = useState<TutorRequest>({
    subject: defaultSubject ?? '',
    level: 'SSS3',
    mode: 'online',
    town: '',
    availability: '',
    message: '',
    name: '',
    phone: '',
  })
  const [trap, setTrap] = useState('') // honeypot: real people never fill this in
  const [errors, setErrors] = useState<Partial<Record<keyof TutorRequest, string>>>({})
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<{ saved: boolean } | null>(null)
  const set = <K extends keyof TutorRequest>(k: K, v: TutorRequest[K]) => setR((prev) => ({ ...prev, [k]: v }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (!r.subject) next.subject = 'Choose a subject.'
    if (r.mode !== 'online' && !r.town.trim()) next.town = 'Tell us your town or area for home lessons.'
    if (r.name.trim().length < 2) next.name = 'Enter your name.'
    if (r.phone.replace(/\D/g, '').length < 8) next.phone = 'Enter a WhatsApp number we can reach you on.'
    setErrors(next)
    if (Object.keys(next).length > 0 || trap) return
    setBusy(true)
    const saved = await saveTutorRequest(r, user?.id ?? null)
    setBusy(false)
    setDone({ saved })
  }

  if (done) {
    return (
      <div className="space-y-4 text-center" role="status">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
          <CircleCheck className="h-7 w-7" aria-hidden />
        </span>
        <div className="space-y-1.5">
          <p className="text-xl font-bold">{done.saved ? 'Request received' : 'Almost there'}</p>
          <p className="text-[15px] text-muted-foreground">
            Send your request on WhatsApp so we can reply to you there. We'll confirm the tutor, the times and the price with you before anything is paid.
          </p>
        </div>
        <Button asChild size="lg" className="w-full bg-[#1a8d4a] hover:bg-[#157a3f]">
          <a href={whatsappLink(r)} target="_blank" rel="noopener">
            <MessageCircle className="h-5 w-5" aria-hidden /> Send on WhatsApp
          </a>
        </Button>
        <button type="button" onClick={() => setDone(null)} className="min-h-11 text-sm font-medium text-muted-foreground hover:text-foreground">
          Change my details
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div className="space-y-1.5">
        <label htmlFor="bt-subject" className={label}>Subject</label>
        <select id="bt-subject" value={r.subject} onChange={(e) => set('subject', e.target.value)} className={field} aria-invalid={!!errors.subject} aria-describedby={errors.subject ? 'bt-subject-err' : undefined}>
          <option value="">Choose a subject</option>
          {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {errors.subject && <p id="bt-subject-err" className="text-sm text-danger">{errors.subject}</p>}
      </div>

      <fieldset className="space-y-1.5">
        <legend className={label}>Class</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {LEVELS.map((l) => (
            <button key={l} type="button" aria-pressed={r.level === l} onClick={() => set('level', l as Level)}
              className={`min-h-11 rounded-xl border px-2 text-sm font-semibold transition-colors ${r.level === l ? 'border-primary bg-brand-soft text-primary' : 'bg-card hover:border-primary/40'}`}>
              {l}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-1.5">
        <legend className={label}>Lessons</legend>
        <div className="grid grid-cols-3 gap-2">
          {MODES.map((m) => (
            <button key={m.id} type="button" aria-pressed={r.mode === m.id} onClick={() => set('mode', m.id as Mode)}
              className={`min-h-11 rounded-xl border px-2 text-sm font-semibold transition-colors ${r.mode === m.id ? 'border-primary bg-brand-soft text-primary' : 'bg-card hover:border-primary/40'}`}>
              {m.label}
            </button>
          ))}
        </div>
        <p className="text-[13px] text-muted-foreground">{MODES.find((m) => m.id === r.mode)?.hint}</p>
      </fieldset>

      {r.mode !== 'online' && (
        <div className="space-y-1.5">
          <label htmlFor="bt-town" className={label}>Town or area</label>
          <input id="bt-town" value={r.town} onChange={(e) => set('town', e.target.value)} placeholder="e.g. Kissy, Freetown" maxLength={60} className={field} aria-invalid={!!errors.town} />
          {errors.town && <p className="text-sm text-danger">{errors.town}</p>}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="bt-when" className={label}>When are you free? <span className="font-normal text-muted-foreground">(optional)</span></label>
        <input id="bt-when" value={r.availability} onChange={(e) => set('availability', e.target.value)} placeholder="e.g. weekday evenings, Saturday morning" maxLength={200} className={field} />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="bt-msg" className={label}>What do you need help with? <span className="font-normal text-muted-foreground">(optional)</span></label>
        <textarea id="bt-msg" value={r.message} onChange={(e) => set('message', e.target.value)} rows={3} maxLength={1000}
          placeholder="e.g. I keep losing marks on circle theorems and want to practise past questions."
          className="w-full rounded-xl border border-input bg-card px-3.5 py-3 text-[15px] outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="bt-name" className={label}>Your name</label>
          <input id="bt-name" value={r.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" maxLength={80} className={field} aria-invalid={!!errors.name} />
          {errors.name && <p className="text-sm text-danger">{errors.name}</p>}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="bt-phone" className={label}>WhatsApp number</label>
          <input id="bt-phone" type="tel" inputMode="tel" value={r.phone} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" placeholder="+232 ..." maxLength={20} className={field} aria-invalid={!!errors.phone} />
          {errors.phone && <p className="text-sm text-danger">{errors.phone}</p>}
        </div>
      </div>

      <div className="hidden" aria-hidden>
        <label htmlFor="bt-website">Website</label>
        <input id="bt-website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        {busy ? 'Sending…' : 'Request a tutor'}
      </Button>
      <p className="text-center text-[13px] text-muted-foreground">
        Free to ask. We use these details only to arrange your tutor. See our <a href="/privacy" className="underline underline-offset-2">Privacy Policy</a>.
      </p>
    </form>
  )
}
