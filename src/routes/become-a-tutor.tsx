import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ArrowLeft, CheckCircle2, FileUp, GraduationCap, ShieldCheck } from 'lucide-react'
import { privateHead } from '@/lib/seo'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'

type Subject = { id: string; name: string }
type SelectedSubject = { subject_id: string; price_nle: string }

export const Route = createFileRoute('/become-a-tutor')({
  head: privateHead('Become a tutor'),
  component: BecomeTutor,
})

const field = 'h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100'

function BecomeTutor() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selected, setSelected] = useState<SelectedSubject[]>([])
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name ?? '')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [qualifications, setQualifications] = useState('')
  const [experience, setExperience] = useState('0')
  const [location, setLocation] = useState('Freetown')
  const [mode, setMode] = useState<'online'|'in_person'|'both'>('both')
  const [document, setDocument] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [existing, setExisting] = useState<{status:string;review_note:string|null}|null>(null)

  useEffect(() => {
    if (!user) return
    let active = true
    void Promise.all([
      supabase.from('subjects').select('id,name').order('name'),
      supabase.from('tutor_applications').select('status,review_note').eq('user_id',user.id).maybeSingle(),
    ]).then(([s,a]) => {
      if (!active) return
      if (!s.error) setSubjects(s.data ?? [])
      if (!a.error && a.data) setExisting(a.data)
    })
    return () => { active = false }
  }, [user])

  const toggleSubject = (id: string) => setSelected((current) => current.some((s) => s.subject_id===id) ? current.filter((s) => s.subject_id!==id) : [...current,{subject_id:id,price_nle:'50'}])

  const submit = async () => {
    if (!user) return
    setError(null); setBusy(true)
    let documentPath: string | null = null
    try {
      if (document) {
        const safeName = document.name.toLowerCase().replace(/[^a-z0-9._-]/g,'-')
        documentPath = `${user.id}/${crypto.randomUUID()}-${safeName}`
        const { error: uploadError } = await supabase.storage.from('tutor-verification-docs').upload(documentPath,document,{upsert:false,contentType:document.type})
        if (uploadError) throw uploadError
      }
      const { error: submitError } = await supabase.rpc('submit_tutor_application',{
        p_full_name:fullName.trim(),p_phone:phone.trim(),p_bio:bio.trim(),p_qualifications:qualifications.trim(),
        p_experience_years:Number(experience),p_location:location.trim(),p_teaching_mode:mode,p_document_path:documentPath,
        p_subjects:selected.map((s)=>({subject_id:s.subject_id,price_nle:Number(s.price_nle)})),
      })
      if (submitError) throw submitError
      setSuccess(true)
      setExisting({status:'submitted',review_note:null})
    } catch (err) {
      if (documentPath) await supabase.storage.from('tutor-verification-docs').remove([documentPath])
      setError(err instanceof Error ? err.message : 'Your application could not be submitted.')
    } finally { setBusy(false) }
  }

  if (authLoading) return <div className="mx-auto h-64 max-w-3xl animate-pulse rounded-3xl bg-muted"/>
  if (!user) return <div className="mx-auto max-w-lg rounded-3xl border bg-card p-8 text-center"><GraduationCap className="mx-auto h-10 w-10 text-primary"/><h1 className="mt-3 text-2xl font-bold">Become a WASSCE Tutor</h1><p className="mt-2 text-sm text-muted-foreground">Sign in or create an account to start your tutor application.</p><Link to="/auth" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 font-semibold text-primary-foreground">Continue to sign in</Link></div>

  return <div className="mx-auto w-full max-w-5xl space-y-8 pb-16">
    <Link to="/tutors" className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4"/> Tutor marketplace</Link>
    <section className="overflow-hidden rounded-[2rem] bg-[#21134d] p-7 text-white sm:p-10">
      <p className="text-xs font-bold uppercase tracking-[.18em] text-violet-200">Tutor partner programme</p>
      <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">Teach with purpose. Help students move forward.</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">Create a verified teaching profile, set your own rates by subject and receive booking requests from WASSCE students.</p>
      <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-white/80"><span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4"/> Profile reviewed before listing</span><span>Rates up to NLe 100 per session</span></div>
    </section>
    {existing && existing.status !== 'rejected' && !success ? <section className="rounded-2xl border bg-card p-6"><p className="text-sm font-semibold text-primary">Your application status</p><h2 className="mt-1 text-xl font-bold capitalize">{existing.status.replace('_',' ')}</h2><p className="mt-2 text-sm text-muted-foreground">{existing.review_note ?? 'We will review your details and notify you when a decision is made.'}</p>{existing.status==='rejected' && <p className="mt-3 text-sm">Contact support if you need clarification before submitting a new application.</p>}</section> : success ? <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-7 text-emerald-950"><CheckCircle2 className="h-8 w-8"/><h2 className="mt-3 text-xl font-bold">Application submitted</h2><p className="mt-1 text-sm">Your application is in the review queue. You will be notified when its status changes.</p><Link to="/tutor-dashboard" className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-emerald-700 px-4 font-semibold text-white">View tutor dashboard</Link></section> : <form className="space-y-7" onSubmit={(e)=>{e.preventDefault();void submit()}}>
      <section className="rounded-2xl border bg-card p-6 sm:p-8"><div className="mb-6"><p className="text-xs font-bold uppercase tracking-wider text-primary">01 / Personal profile</p><h2 className="mt-1 text-xl font-bold">Introduce yourself</h2><p className="mt-1 text-sm text-muted-foreground">These details appear on your public tutor profile after approval.</p></div><div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm font-semibold">Full name<input required minLength={2} maxLength={120} className={field} value={fullName} onChange={(e)=>setFullName(e.target.value)}/></label>
        <label className="space-y-1.5 text-sm font-semibold">WhatsApp / phone<input required minLength={7} maxLength={30} className={field} value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="+232…"/></label>
        <label className="space-y-1.5 text-sm font-semibold">Town / area<input required maxLength={120} className={field} value={location} onChange={(e)=>setLocation(e.target.value)}/></label>
        <label className="space-y-1.5 text-sm font-semibold">Teaching experience<select className={field} value={experience} onChange={(e)=>setExperience(e.target.value)}>{Array.from({length:31},(_,i)=><option key={i} value={i}>{i===0?'New tutor':`${i} years`}</option>)}</select></label>
        <label className="space-y-1.5 text-sm font-semibold sm:col-span-2">Teaching biography<textarea required minLength={80} maxLength={2000} rows={4} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100" value={bio} onChange={(e)=>setBio(e.target.value)} placeholder="Describe your teaching approach and the students you support."/></label>
      </div></section>
      <section className="rounded-2xl border bg-card p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-wider text-primary">02 / Qualifications</p><h2 className="mt-1 text-xl font-bold">Your academic background</h2><textarea required minLength={10} maxLength={2000} rows={3} className="mt-4 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100" value={qualifications} onChange={(e)=>setQualifications(e.target.value)} placeholder="List qualifications, institutions and relevant teaching credentials."/><label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed p-4 text-sm"><FileUp className="h-5 w-5 text-primary"/><span className="min-w-0 flex-1"><strong className="block">Supporting document (optional)</strong><span className="text-xs text-muted-foreground">PDF, JPG or PNG · maximum 10 MB · private to reviewers</span>{document && <span className="mt-1 block truncate text-primary">{document.name}</span>}</span><input type="file" accept=".pdf,image/jpeg,image/png" className="sr-only" onChange={(e)=>setDocument(e.target.files?.[0]??null)}/></label></section>
      <section className="rounded-2xl border bg-card p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-wider text-primary">03 / Teaching preferences</p><h2 className="mt-1 text-xl font-bold">Where and how you teach</h2><div className="mt-4 grid gap-2 sm:grid-cols-3">{([{v:'online',l:'Online'},{v:'in_person',l:'In person'},{v:'both',l:'Both'}] as const).map((x)=><button key={x.v} type="button" onClick={()=>setMode(x.v)} className={`min-h-12 rounded-xl border px-4 text-sm font-semibold ${mode===x.v?'border-violet-500 bg-violet-50 text-violet-800':'bg-white text-slate-600'}`}>{x.l}</button>)}</div></section>
      <section className="rounded-2xl border bg-card p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-wider text-primary">04 / Subjects and rates</p><h2 className="mt-1 text-xl font-bold">Choose what you teach</h2><p className="mt-1 text-sm text-muted-foreground">Set a price per session for each subject. Maximum NLe 100.</p><div className="mt-5 grid gap-3 sm:grid-cols-2">{subjects.map((s)=><div key={s.id} className="flex items-center gap-3 rounded-xl border p-3"><input type="checkbox" checked={selected.some((x)=>x.subject_id===s.id)} onChange={()=>toggleSubject(s.id)} aria-label={`Teach ${s.name}`} className="h-4 w-4 accent-violet-700"/><span className="min-w-0 flex-1 text-sm font-medium">{s.name}</span>{selected.some((x)=>x.subject_id===s.id)&&<input aria-label={`${s.name} price in NLe`} type="number" min="1" max="100" step="1" value={selected.find((x)=>x.subject_id===s.id)?.price_nle??'50'} onChange={(e)=>setSelected((prev)=>prev.map((x)=>x.subject_id===s.id?{...x,price_nle:e.target.value}:x))} className="h-10 w-24 rounded-lg border px-2 text-sm" />}</div>)}</div><p className="mt-3 text-xs text-muted-foreground">{selected.length} subjects selected · prices are validated again by the database.</p></section>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><p className="text-xs text-muted-foreground">Submitting confirms that your information is accurate and may be reviewed by WASSCE Tutor.</p><button disabled={busy||selected.length===0} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#6438d8] px-7 font-bold text-white disabled:opacity-50">{busy?'Submitting application…':'Submit tutor application'}</button></div>
    </form>}
  </div>
}
