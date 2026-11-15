import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ArrowLeft, CheckCircle2, FileUp, ShieldCheck } from 'lucide-react'
import { publicHead } from '@/lib/seo'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { PhotoPicker, photoProblem } from '@/components/tutors/PhotoPicker'
import { WhatsAppGlyph } from '@/components/WhatsAppGlyph'

type Subject = { id: string; name: string }
type SelectedSubject = { subject_id: string; price_nle: string }

export const Route = createFileRoute('/become-a-tutor')({
  ssr: true,
  head: publicHead('/become-a-tutor'),
  component: BecomeTutor,
})

const field = 'h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100'

function BecomeTutor() {
  const { user } = useAuth()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selected, setSelected] = useState<SelectedSubject[]>([])
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name ?? '')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [qualifications, setQualifications] = useState('')
  const [experience, setExperience] = useState('0')
  const [location, setLocation] = useState('Freetown')
  const [document, setDocument] = useState<File | null>(null)
  const [avatar, setAvatar] = useState<File | null>(null)
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const [whatsappConsent, setWhatsappConsent] = useState(false)
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

  const toggleSubject = (id: string) => setSelected((current) => current.some((s) => s.subject_id===id) ? current.filter((s) => s.subject_id!==id) : [...current,{subject_id:id,price_nle:''}])
  const priceOk = (v: string) => Number(v) > 0 && Number(v) <= 999999
  const pricesOk = selected.length > 0 && selected.every((s) => priceOk(s.price_nle))

  const submit = async () => {
    if (!user) return
    setError(null); setBusy(true)
    let documentPath: string | null = null
    let avatarPath: string | null = null
    try {
      if (document) {
        if (!['application/pdf','image/jpeg','image/png'].includes(document.type) || document.size > 10 * 1024 * 1024) throw new Error('Supporting document must be a PDF, JPG or PNG no larger than 10 MB.')
        const safeName = document.name.toLowerCase().replace(/[^a-z0-9._-]/g,'-')
        documentPath = `${user.id}/${crypto.randomUUID()}-${safeName}`
        const { error: uploadError } = await supabase.storage.from('tutor-verification-docs').upload(documentPath,document,{upsert:false,contentType:document.type})
        if (uploadError) throw uploadError
      }
      if (!avatar) throw new Error('Add a profile photo: students see it on your tutor card.')
      if (!whatsappConsent) throw new Error('Confirm that students can message you on WhatsApp.')
      {
        const problem = photoProblem(avatar)
        if (problem) throw new Error(problem)
        avatarPath = `${user.id}/${crypto.randomUUID()}-${avatar.name.toLowerCase().replace(/[^a-z0-9._-]/g,'-')}`
        const { error: avatarError } = await supabase.storage.from('tutor-profile-images').upload(avatarPath,avatar,{upsert:false,contentType:avatar.type})
        if (avatarError) throw avatarError
      }
      if (!pricesOk) throw new Error('Enter a monthly fee above NLe 0 for each subject you selected.')
      const { data: applicationId, error: submitError } = await supabase.rpc('submit_tutor_application',{
        p_full_name:fullName.trim(),p_phone:phone.trim(),p_bio:bio.trim(),p_qualifications:qualifications.trim(),
        p_experience_years:Number(experience),p_location:location.trim(),p_teaching_mode:'in_person',p_document_path:documentPath,p_avatar_path:avatarPath,
        p_subjects:selected.map((s)=>({subject_id:s.subject_id,price_nle:Number(s.price_nle)})),
      })
      if (submitError) throw submitError
      // Tell the admins by email too (best effort; the admin inbox row is already saved).
      await supabase.functions.invoke('send-notification-email',{body:{entity_id:applicationId,event_type:'tutor_application_submitted'}}).catch(()=>undefined)
      setSuccess(true)
      setExisting({status:'submitted',review_note:null})
    } catch (err) {
      if (documentPath) await supabase.storage.from('tutor-verification-docs').remove([documentPath])
      if (avatarPath) await supabase.storage.from('tutor-profile-images').remove([avatarPath])
      setError(err instanceof Error ? err.message : 'Your application could not be submitted.')
    } finally { setBusy(false) }
  }

  if (!user) return <main className="mx-auto w-full max-w-5xl space-y-8 pb-16"><section className="overflow-hidden rounded-[2rem] bg-[#21134d] p-7 text-white sm:p-10"><p className="text-xs font-bold uppercase tracking-[.18em] text-violet-200">Teach with WASSCE Tutor</p><h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">Become a WASSCE Tutor in Sierra Leone.</h1><p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75">Reach students preparing for their WASSCE. Create a verified teaching profile with your photo, choose your subjects and set your own monthly fee. Students who agree to it message you on WhatsApp to arrange in-person lessons.</p><div className="mt-7 flex flex-wrap gap-3"><Link to="/auth" search={{ intent: 'tutor' } as never} className="inline-flex min-h-12 items-center rounded-xl bg-white px-5 text-sm font-bold text-[#21134d]">Create tutor account</Link><Link to="/tutors" className="inline-flex min-h-12 items-center rounded-xl border border-white/25 px-5 text-sm font-semibold text-white">View tutor marketplace</Link></div></section><section className="grid gap-4 sm:grid-cols-3"><article className="rounded-2xl border bg-card p-5"><h2 className="font-bold">Your teaching profile</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Submit your photo, qualifications, teaching biography and subjects for review. Approved tutors get the blue verified tick.</p></article><article className="rounded-2xl border bg-card p-5"><h2 className="font-bold">Your own workspace</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">After account creation, continue in the tutor dashboard—not the student learning dashboard.</p></article><article className="rounded-2xl border bg-card p-5"><h2 className="font-bold">Students message you</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Students see your fee first and message you on WhatsApp. You arrange lessons and payment with them directly.</p></article></section><section className="rounded-2xl border bg-card p-6"><h2 className="text-xl font-bold">How tutor approval works</h2><ol className="mt-4 grid gap-4 sm:grid-cols-3">{[['01','Create your tutor account','Choose the tutor path from this page and create an account.'],['02','Submit your profile','Provide your academic background, subjects, teaching preferences and supporting details.'],['03','Wait for review','Profiles are reviewed before tutors appear in the public marketplace.']].map(([n,h,p])=><li key={n}><span className="text-xs font-bold text-primary">{n}</span><h3 className="mt-2 font-bold">{h}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p}</p></li>)}</ol></section><p className="text-center text-xs text-muted-foreground">WASSCE Tutor is an independent learning platform. Tutor applications are reviewed before public listing; submitting an application does not guarantee approval.</p></main>

  return <div className="mx-auto w-full max-w-5xl space-y-8 pb-16">
    <Link to="/tutors" className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4"/> Tutor marketplace</Link>
    <section className="overflow-hidden rounded-[2rem] bg-[#21134d] p-7 text-white sm:p-10">
      <p className="text-xs font-bold uppercase tracking-[.18em] text-violet-200">Tutor partner programme</p>
      <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">Teach with purpose. Help students move forward.</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">Create a verified teaching profile, set your own monthly fee for each subject, and get WhatsApp messages from WASSCE students who agree to it. Lessons are in person.</p>
      <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-white/80"><span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4"/> Profile reviewed before listing</span><span>You set your own monthly fee</span></div>
    </section>
    {existing && existing.status !== 'rejected' && !success ? <section className="rounded-2xl border bg-card p-6"><p className="text-sm font-semibold text-primary">Your application status</p><h2 className="mt-1 text-xl font-bold capitalize">{existing.status.replace('_',' ')}</h2><p className="mt-2 text-sm text-muted-foreground">{existing.review_note ?? 'We will review your details and notify you when a decision is made.'}</p>{existing.status==='rejected' && <p className="mt-3 text-sm">Contact support if you need clarification before submitting a new application.</p>}</section> : success ? <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-7 text-emerald-950"><CheckCircle2 className="h-8 w-8"/><h2 className="mt-3 text-xl font-bold">Application submitted</h2><p className="mt-1 text-sm">Your application is in the review queue. You will be notified when its status changes.</p><Link to="/tutor-dashboard" className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-emerald-700 px-4 font-semibold text-white">View tutor dashboard</Link></section> : <form className="space-y-7" onSubmit={(e)=>{e.preventDefault();void submit()}}>
      <section className="rounded-2xl border bg-card p-6 sm:p-8"><div className="mb-6"><p className="text-xs font-bold uppercase tracking-wider text-primary">01 / Personal profile</p><h2 className="mt-1 text-xl font-bold">Introduce yourself</h2><p className="mt-1 text-sm text-muted-foreground">These details appear on your public tutor profile after approval.</p></div><div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2"><PhotoPicker required file={avatar} error={avatarError} onPick={(file,problem)=>{setAvatarError(problem);if(file)setAvatar(file)}}/></div>
        <label className="space-y-1.5 text-sm font-semibold">Full name<input required minLength={2} maxLength={120} className={field} value={fullName} onChange={(e)=>setFullName(e.target.value)}/></label>
        <label className="space-y-1.5 text-sm font-semibold">WhatsApp number<input required type="tel" inputMode="tel" minLength={7} maxLength={30} className={field} value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="e.g. 077 123 456"/><span className="block text-xs font-normal text-muted-foreground">Students who agree to your fee message you here.</span></label>
        <label className="space-y-1.5 text-sm font-semibold">Town / area<input required maxLength={120} className={field} value={location} onChange={(e)=>setLocation(e.target.value)}/></label>
        <label className="space-y-1.5 text-sm font-semibold">Teaching experience<select className={field} value={experience} onChange={(e)=>setExperience(e.target.value)}>{Array.from({length:31},(_,i)=><option key={i} value={i}>{i===0?'New tutor':`${i} years`}</option>)}</select></label>
        <label className="space-y-1.5 text-sm font-semibold sm:col-span-2">Teaching biography<textarea required minLength={80} maxLength={2000} rows={4} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100" value={bio} onChange={(e)=>setBio(e.target.value)} placeholder="Describe your teaching approach and the students you support."/></label>
      </div></section>
      <section className="rounded-2xl border bg-card p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-wider text-primary">02 / Qualifications</p><h2 className="mt-1 text-xl font-bold">Your academic background</h2><textarea required minLength={10} maxLength={2000} rows={3} className="mt-4 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100" value={qualifications} onChange={(e)=>setQualifications(e.target.value)} placeholder="List qualifications, institutions and relevant teaching credentials."/><label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed p-4 text-sm"><FileUp className="h-5 w-5 text-primary"/><span className="min-w-0 flex-1"><strong className="block">Supporting document (optional)</strong><span className="text-xs text-muted-foreground">PDF, JPG or PNG · maximum 10 MB · private to reviewers</span>{document && <span className="mt-1 block truncate text-primary">{document.name}</span>}</span><input type="file" accept=".pdf,image/jpeg,image/png" className="sr-only" onChange={(e)=>setDocument(e.target.files?.[0]??null)}/></label></section>
      <section className="rounded-2xl border bg-card p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-wider text-primary">03 / How students reach you</p><h2 className="mt-1 text-xl font-bold">In-person lessons, arranged on WhatsApp</h2><ul className="mt-4 space-y-2 text-sm text-muted-foreground"><li>• Lessons are in person, in or near the area you gave above. WASSCE Tutor does not run online lessons.</li><li>• A student sees your monthly fee and taps Book. If they agree to it, WhatsApp opens with a message to you.</li><li>• You agree the days, times, place and payment directly with the student.</li></ul><label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm"><input type="checkbox" checked={whatsappConsent} onChange={(e)=>setWhatsappConsent(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-violet-700"/><span><span className="inline-flex items-center gap-1.5 font-semibold"><WhatsAppGlyph className="h-4 w-4 text-[#25D366]"/> Students can message me on WhatsApp</span><span className="mt-0.5 block text-muted-foreground">I agree that students who accept my fee can contact me at the WhatsApp number above. My number is never shown publicly.</span></span></label></section>
      <section className="rounded-2xl border bg-card p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-wider text-primary">04 / Subjects and rates</p><h2 className="mt-1 text-xl font-bold">Choose what you teach</h2><p className="mt-1 text-sm text-muted-foreground">Set your monthly fee for each subject, in NLe. You choose the amount.</p><div className="mt-5 grid gap-3 sm:grid-cols-2">{subjects.map((s)=><div key={s.id} className="flex items-center gap-3 rounded-xl border p-3"><input type="checkbox" checked={selected.some((x)=>x.subject_id===s.id)} onChange={()=>toggleSubject(s.id)} aria-label={`Teach ${s.name}`} className="h-4 w-4 accent-violet-700"/><span className="min-w-0 flex-1 text-sm font-medium">{s.name}</span>{selected.some((x)=>x.subject_id===s.id)&&<span className="flex items-center gap-1.5 text-xs text-muted-foreground">NLe<input aria-label={`${s.name} monthly fee in NLe`} type="number" inputMode="numeric" required min="1" max="999999" step="1" placeholder="Fee" value={selected.find((x)=>x.subject_id===s.id)?.price_nle??''} onChange={(e)=>setSelected((prev)=>prev.map((x)=>x.subject_id===s.id?{...x,price_nle:e.target.value}:x))} className="h-10 w-24 rounded-lg border px-2 text-sm text-foreground" />/ month</span>}</div>)}</div><p className="mt-3 text-xs text-muted-foreground">{selected.length} {selected.length===1?'subject':'subjects'} selected · fees are per month</p></section>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><p className="text-xs text-muted-foreground">{!avatar?'Add your profile photo to submit. ':''}{!whatsappConsent?'Confirm WhatsApp contact to submit. ':''}Submitting confirms that your information is accurate and may be reviewed by WASSCE Tutor.</p><button disabled={busy||!pricesOk||!avatar||!whatsappConsent} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#6438d8] px-7 font-bold text-white disabled:opacity-50">{busy?'Submitting application…':'Submit tutor application'}</button></div>
    </form>}
  </div>
}
