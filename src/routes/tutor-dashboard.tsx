import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Bell, Check, GraduationCap, ShieldCheck, X } from 'lucide-react'
import { privateHead } from '@/lib/seo'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/lib/queries'

type Booking = { id:string; starts_at:string; duration_minutes:number; price_nle:number; status:string; student_id:string; tutor_id:string; student_message:string|null; subject:{name:string}|null; tutor:{user_id:string;full_name:string}|null }
type Notification = { id:string; title:string; body:string; created_at:string; read_at:string|null; event_type:string }

export const Route = createFileRoute('/tutor-dashboard')({
  head: privateHead('Tutor dashboard'),
  component: TutorDashboard,
})

const dateLabel = (value:string) => new Date(value).toLocaleString('en-GB',{dateStyle:'medium',timeStyle:'short'})
const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

function TutorDashboard() {
  const { user, loading } = useAuth()
  const { data: profile } = useProfile(user?.id ?? null)
  const [tutor,setTutor] = useState<any>(null)
  const [bookings,setBookings] = useState<Booking[]>([])
  const [applications,setApplications] = useState<any[]>([])
  const [notifications,setNotifications] = useState<Notification[]>([])
  const [application,setApplication] = useState<{status:string;review_note:string|null}|null>(null)
  const [slots,setSlots] = useState<{weekday:number;starts_at:string;ends_at:string}[]>([])
  const [tutorBio,setTutorBio] = useState('')
  const [tutorLocation,setTutorLocation] = useState('')
  const [teachingMode,setTeachingMode] = useState<'online'|'in_person'|'both'>('both')
  const [subjectRates,setSubjectRates] = useState<{subject_id:string;name:string;price_nle:number}[]>([])
  const [busy,setBusy] = useState(false)
  const [message,setMessage] = useState<string|null>(null)
  const [error,setError] = useState<string|null>(null)

  const load = async () => {
    if (!user) return
    const tutorResult = await supabase.from('tutors').select('*').eq('user_id',user.id).maybeSingle()
    const tutorRecord = tutorResult.error ? null : tutorResult.data
    const [b,n,a,av,ts,app] = await Promise.all([
      supabase.from('tutor_bookings').select('id,starts_at,duration_minutes,price_nle,status,student_id,tutor_id,student_message,subject:subjects(name),tutor:tutors(user_id,full_name)').eq('tutor_id',tutorRecord?.id ?? '00000000-0000-0000-0000-000000000000').order('starts_at',{ascending:false}).limit(50),
      supabase.from('user_notifications').select('id,title,body,created_at,read_at,event_type') .eq('recipient_id',user.id).or('event_type.like.booking_%,event_type.like.tutor_%').order('created_at',{ascending:false}).limit(30),
      profile?.is_admin ? supabase.from('tutor_applications').select('id,user_id,full_name,phone,bio,qualifications,experience_years,location,teaching_mode,document_path,status,created_at,tutor_application_subjects(price_nle,subject:subjects(name))').in('status',['submitted','under_review']).order('created_at',{ascending:true}) : Promise.resolve({data:[],error:null}),
      tutorRecord ? supabase.from('tutor_availability').select('weekday,starts_at,ends_at').eq('tutor_id',tutorRecord.id).eq('active',true) : Promise.resolve({data:[],error:null}),
      tutorRecord ? supabase.from('tutor_subjects').select('subject_id,price_nle,subject:subjects(name)').eq('tutor_id',tutorRecord.id) : Promise.resolve({data:[],error:null}),
      supabase.from('tutor_applications').select('status,review_note').eq('user_id',user.id).order('created_at',{ascending:false}).limit(1).maybeSingle(),
    ])
    setTutor(tutorRecord)
    if(tutorRecord){setTutorBio(tutorRecord.bio);setTutorLocation(tutorRecord.location);setTeachingMode(tutorRecord.teaching_mode)}
    if (!b.error) setBookings((b.data??[]) as unknown as Booking[])
    if (!n.error) setNotifications((n.data??[]) as Notification[])
    if (!app.error) setApplication(app.data)
    if (!a.error) setApplications(a.data??[])
    if (!av.error) setSlots((av.data??[]).map((s:any)=>({weekday:s.weekday,starts_at:String(s.starts_at).slice(0,5),ends_at:String(s.ends_at).slice(0,5)})))
    if (!ts.error) setSubjectRates((ts.data??[]).map((s:any)=>({subject_id:s.subject_id,name:s.subject?.name??'Subject',price_nle:Number(s.price_nle)})))
  }

  useEffect(()=>{ if(user) void load() },[user,profile?.is_admin])
  useEffect(()=>{
    if(!user) return
    const channel=supabase.channel(`tutor-dashboard-${user.id}`)
      .on('postgres_changes',{event:'*',schema:'public',table:'user_notifications',filter:`recipient_id=eq.${user.id}`},()=>{void load()})
      .on('postgres_changes',{event:'*',schema:'public',table:'tutor_bookings'},()=>{void load()})
      .on('postgres_changes',{event:'*',schema:'public',table:'tutor_applications'},()=>{if(profile?.is_admin)void load()})
      .subscribe()
    return ()=>{void supabase.removeChannel(channel)}
  },[user?.id,profile?.is_admin])

  const updateBooking = async (id:string,status:string) => {
    setBusy(true);setError(null);setMessage(null)
    try {
      const {error:rpcError}=await supabase.rpc('update_tutor_booking',{p_booking_id:id,p_status:status,p_reason:null})
      if(rpcError) throw rpcError
      await supabase.functions.invoke('send-notification-email',{body:{entity_id:id,event_type:`booking_${status}`}})
      setMessage(`Booking ${status.replace('_',' ')}.`)
      await load()
    } catch(err) {setError(err instanceof Error?err.message:'Could not update booking.')}
    finally {setBusy(false)}
  }

  const saveAvailability = async () => {
    setBusy(true);setError(null);setMessage(null)
    try {
      const {error:rpcError}=await supabase.rpc('set_tutor_availability',{p_slots:slots})
      if(rpcError) throw rpcError
      setMessage('Your weekly availability has been saved.')
    } catch(err) {setError(err instanceof Error?err.message:'Could not save availability.')}
    finally {setBusy(false)}
  }

  const reviewApplication = async (id:string,decision:'approved'|'rejected'|'under_review') => {
    setBusy(true);setError(null)
    try {
      const {error:rpcError}=await supabase.rpc('review_tutor_application',{p_application_id:id,p_decision:decision,p_note:null})
      if(rpcError) throw rpcError
      if(decision!=='under_review') await supabase.functions.invoke('send-notification-email',{body:{entity_id:id,event_type:decision==='approved'?'tutor_approved':'tutor_rejected'}})
      setMessage(`Application ${decision}.`)
      await load()
    } catch(err) {setError(err instanceof Error?err.message:'Could not review application.')}
    finally {setBusy(false)}
  }

  const markRead = async (id:string) => {
    await supabase.from('user_notifications').update({read_at:new Date().toISOString()}).eq('id',id)
    setNotifications((current)=>current.map((n)=>n.id===id?{...n,read_at:new Date().toISOString()}:n))
  }

  if(loading) return <div className="mx-auto h-64 max-w-5xl animate-pulse rounded-3xl bg-muted"/>
  if(!user) return <div className="mx-auto max-w-md rounded-2xl border bg-card p-8 text-center"><h1 className="text-xl font-bold">Sign in to continue</h1><Link to="/auth" className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 font-semibold text-white">Sign in</Link></div>

  const incoming=bookings
  const unread=notifications.filter((n)=>!n.read_at).length

  return <div className="mx-auto w-full max-w-7xl space-y-8 pb-16">
    <header className="rounded-[2rem] bg-[#21134d] p-7 text-white sm:p-9"><p className="text-xs font-bold uppercase tracking-[.16em] text-violet-200">WASSCE Tutor network</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">Tutor workspace</h1><p className="mt-2 text-sm text-white/65">Manage your tutor application, teaching profile, incoming bookings and notifications.</p><div className="mt-5 flex flex-wrap gap-3"><Link to="/tutors" className="inline-flex min-h-10 items-center rounded-xl bg-white px-4 text-sm font-bold text-[#21134d]">View marketplace</Link><Link to="/become-a-tutor" className="inline-flex min-h-10 items-center rounded-xl border border-white/25 px-4 text-sm font-semibold text-white">Tutor application</Link></div></header>
    {message&&<p role="status" className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">{message}</p>}
    {error&&<p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Metric label="Incoming requests" value={incoming.filter((b)=>b.status==='requested').length}/><Metric label="Upcoming sessions" value={incoming.filter((b)=>['accepted','confirmed'].includes(b.status)&&new Date(b.starts_at)>new Date()).length}/><Metric label="Completed sessions" value={incoming.filter((b)=>b.status==='completed').length}/><Metric label="Unread notifications" value={unread}/></div>

    {profile?.is_admin&&<section className="space-y-4 rounded-2xl border bg-card p-5 sm:p-7"><div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary"/><div><h2 className="text-xl font-bold">Tutor application review</h2><p className="text-sm text-muted-foreground">Only approved profiles become visible in the marketplace.</p></div></div>{applications.length===0?<p className="rounded-xl bg-muted/50 p-5 text-sm text-muted-foreground">No tutor applications awaiting review.</p>:applications.map((a)=><article key={a.id} className="rounded-xl border p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-bold">{a.full_name}</h3><p className="text-xs text-muted-foreground">{a.phone} · {a.location} · {a.experience_years} years' experience</p></div><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold capitalize text-amber-800">{a.status.replace('_',' ')}</span></div><p className="mt-3 text-sm">{a.bio}</p><p className="mt-2 text-sm text-muted-foreground">{a.qualifications}</p><div className="mt-3 flex flex-wrap gap-2">{a.tutor_application_subjects?.map((s:any,i:number)=><span key={i} className="rounded-lg bg-muted px-2.5 py-1 text-xs">{s.subject?.name} · NLe {s.price_nle}</span>)}</div>{a.document_path&&<button type="button" onClick={async()=>{const {data}=await supabase.storage.from('tutor-verification-docs').createSignedUrl(a.document_path,120);if(data?.signedUrl)window.open(data.signedUrl,'_blank','noopener')}} className="mt-3 text-sm font-semibold text-primary underline">Review supporting document</button>}<div className="mt-4 flex flex-wrap gap-2"><button disabled={busy} onClick={()=>void reviewApplication(a.id,'approved')} className="inline-flex min-h-10 items-center gap-1 rounded-lg bg-emerald-700 px-4 text-sm font-semibold text-white"><Check className="h-4 w-4"/> Approve</button><button disabled={busy} onClick={()=>void reviewApplication(a.id,'under_review')} className="min-h-10 rounded-lg border px-4 text-sm font-semibold">Mark reviewing</button><button disabled={busy} onClick={()=>void reviewApplication(a.id,'rejected')} className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-red-200 px-4 text-sm font-semibold text-red-700"><X className="h-4 w-4"/> Reject</button></div></article>)}</section>}

    {tutor&&<section className="space-y-5 rounded-2xl border bg-card p-5 sm:p-7"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-800"><GraduationCap/></div><div><h2 className="text-xl font-bold">{tutor.full_name}</h2><p className="text-sm text-muted-foreground">Approved tutor · {tutor.location}</p></div></div><div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]"><div className="space-y-4"><h3 className="font-bold">Public profile</h3><label className="block space-y-1 text-sm font-semibold">Teaching biography<textarea value={tutorBio} onChange={(e)=>setTutorBio(e.target.value)} minLength={80} maxLength={2000} rows={4} className="w-full rounded-xl border p-3 text-sm font-normal"/></label><label className="block space-y-1 text-sm font-semibold">Location<input value={tutorLocation} onChange={(e)=>setTutorLocation(e.target.value)} className="h-10 w-full rounded-lg border px-3 text-sm font-normal"/></label><label className="block space-y-1 text-sm font-semibold">Teaching format<select value={teachingMode} onChange={(e)=>setTeachingMode(e.target.value as 'online'|'in_person'|'both')} className="h-10 w-full rounded-lg border px-3 text-sm font-normal"><option value="online">Online</option><option value="in_person">In person</option><option value="both">Both</option></select></label><button disabled={busy} onClick={async()=>{setBusy(true);setError(null);try{const {error:e}=await supabase.rpc('update_tutor_profile',{p_bio:tutorBio,p_location:tutorLocation,p_teaching_mode:teachingMode});if(e)throw e;setMessage('Tutor profile updated.')}catch(e){setError(e instanceof Error?e.message:'Could not update profile.')}finally{setBusy(false)}}} className="min-h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-white">Save profile</button><div className="border-t pt-4"><h3 className="font-bold">Subject rates</h3><div className="mt-2 space-y-2">{subjectRates.map((s)=><label key={s.subject_id} className="flex items-center justify-between gap-3 text-sm"><span>{s.name}</span><input type="number" min="1" max="100" value={s.price_nle} onChange={(e)=>setSubjectRates((v)=>v.map((x)=>x.subject_id===s.subject_id?{...x,price_nle:Number(e.target.value)}:x))} className="h-10 w-24 rounded-lg border px-2"/></label>)}</div><button disabled={busy||subjectRates.length===0||subjectRates.some(s=>s.price_nle<1||s.price_nle>100)} onClick={async()=>{setBusy(true);setError(null);try{const {error:e}=await supabase.rpc('update_tutor_subject_prices',{p_subjects:subjectRates.map(s=>({subject_id:s.subject_id,price_nle:s.price_nle}))});if(e)throw e;setMessage('Subject rates updated.')}catch(e){setError(e instanceof Error?e.message:'Could not update rates.')}finally{setBusy(false)}}} className="mt-3 min-h-10 rounded-lg border px-4 text-sm font-semibold">Save subject rates</button></div></div><div><h3 className="font-bold">Weekly availability</h3><p className="mt-1 text-xs text-muted-foreground">Add recurring windows when students can request a session. Times use your local timezone.</p><div className="mt-3 space-y-2">{weekdays.map((day,index)=>{const slot=slots.find((s)=>s.weekday===index);return <div key={day} className="grid grid-cols-[1fr_1fr_1fr] items-center gap-2"><span className="text-sm font-medium">{day}</span><input aria-label={`${day} start time`} type="time" value={slot?.starts_at??''} className="h-10 min-w-0 rounded-lg border px-2 text-sm" onChange={(e)=>setSlots((v)=>{const rest=v.filter((s)=>s.weekday!==index);return e.target.value?[...rest,{weekday:index,starts_at:e.target.value,ends_at:slot?.ends_at??'17:00'}]:rest})}/><input aria-label={`${day} end time`} type="time" value={slot?.ends_at??''} className="h-10 min-w-0 rounded-lg border px-2 text-sm" onChange={(e)=>setSlots((v)=>{const current=v.find((s)=>s.weekday===index);if(!current)return e.target.value?[...v,{weekday:index,starts_at:'09:00',ends_at:e.target.value}]:v;return v.map((s)=>s.weekday===index?{...s,ends_at:e.target.value}:s)})}/></div>})}</div><button disabled={busy||slots.length===0} onClick={()=>void saveAvailability()} className="mt-4 min-h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-white disabled:opacity-50">Save availability</button></div><div><h3 className="font-bold">Booking requests and sessions</h3><div className="mt-3 space-y-3">{incoming.length===0?<p className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">No booking requests yet.</p>:incoming.map((b)=><BookingCard key={b.id} booking={b} perspective="tutor" busy={busy} onUpdate={updateBooking}/>)}</div></div></div></section>}

    {!tutor&&!profile?.is_admin&&<section className="rounded-2xl border bg-card p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-wider text-primary">Tutor onboarding</p><h2 className="mt-2 text-2xl font-bold">{application ? 'Your application' : 'Start teaching on WASSCE Tutor'}</h2>{application ? <><p className="mt-2 text-sm font-semibold capitalize">Status: {application.status.replace('_',' ')}</p><p className="mt-2 text-sm text-muted-foreground">{application.review_note ?? (application.status==='rejected'?'Your application was not approved. Review the feedback before submitting again.':'Your tutor application is being reviewed. We will notify you when its status changes.')}</p>{application.status==='rejected'&&<Link to="/become-a-tutor" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-sm font-bold text-white">Update application</Link>}</> : <><p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">Create your teaching profile, choose subjects and set your session rates. Your profile becomes visible after verification.</p><Link to="/become-a-tutor" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-sm font-bold text-white">Complete tutor application</Link></>}</section>}

    <section className="rounded-2xl border bg-card p-5 sm:p-7"><div className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary"/><h2 className="text-xl font-bold">Notifications</h2><span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">{unread} new</span></div><div className="mt-4 divide-y">{notifications.length===0?<p className="py-5 text-sm text-muted-foreground">Your booking and account notifications will appear here.</p>:notifications.map((n)=><div key={n.id} className="flex gap-3 py-4"><div className="min-w-0 flex-1"><p className="font-semibold">{n.title}</p><p className="mt-1 text-sm text-muted-foreground">{n.body}</p><p className="mt-1 text-xs text-muted-foreground">{dateLabel(n.created_at)}</p></div>{!n.read_at&&<button onClick={()=>void markRead(n.id)} className="self-start rounded-lg px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/5">Mark read</button>}</div>)}</div></section>
  </div>
}

function Metric({label,value}:{label:string;value:number}){return <div className="rounded-2xl border bg-card p-5"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 text-3xl font-bold tabular-nums">{value}</p></div>}
function BookingCard({booking, perspective, busy, onUpdate, reviewed, onReview}:{booking:Booking;perspective:'tutor'|'student';busy:boolean;onUpdate:(id:string,status:string)=>void;reviewed?:boolean;onReview?:(id:string,rating:number,review:string)=>void}){
 const [rating,setRating]=useState(5)
 const [review,setReview]=useState('')
 const actions: [string,string][]=[]
 if(perspective==='tutor'&&booking.status==='requested') actions.push(['accepted','Accept'],['declined','Decline'])
 if(perspective==='student'&&booking.status==='accepted') actions.push(['confirmed','Confirm session'],['cancelled','Cancel request'])
 else if(perspective==='student'&&['requested','confirmed'].includes(booking.status)) actions.push(['cancelled','Cancel request'])
 if(perspective==='tutor'&&['accepted','confirmed'].includes(booking.status)) actions.push(['completed','Mark completed'])
 return <article className="rounded-xl border p-4"><div className="flex flex-wrap items-start justify-between gap-2"><div><p className="font-bold">{booking.subject?.name??'WASSCE tutoring'}</p>{perspective==='student'&&booking.tutor?.full_name&&<p className="mt-0.5 text-xs text-muted-foreground">Tutor: {booking.tutor.full_name}</p>}<p className="mt-1 text-sm text-muted-foreground">{dateLabel(booking.starts_at)} · {booking.duration_minutes} min</p></div><span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold capitalize">{booking.status.replace('_',' ')}</span></div><p className="mt-2 text-sm font-semibold">NLe {booking.price_nle}</p>{booking.student_message&&<p className="mt-2 text-sm text-muted-foreground">{booking.student_message}</p>}<div className="mt-3 flex flex-wrap gap-2">{actions.map(([status,label])=><button key={status} disabled={busy} onClick={()=>onUpdate(booking.id,status)} className={`min-h-9 rounded-lg px-3 text-xs font-semibold ${status==='declined'||status==='cancelled'?'border border-red-200 text-red-700':'bg-primary text-white'}`}>{label}</button>)}</div>{perspective==='student'&&booking.status==='completed'&&!reviewed&&<form className="mt-4 space-y-2 border-t pt-4" onSubmit={(e)=>{e.preventDefault();onReview?.(booking.id,rating,review)}}><p className="text-sm font-bold">Review this completed session</p><label className="block text-xs font-semibold">Rating<select value={rating} onChange={(e)=>setRating(Number(e.target.value))} className="ml-2 h-9 rounded-lg border px-2"><option value="5">5 — Excellent</option><option value="4">4 — Very good</option><option value="3">3 — Good</option><option value="2">2 — Fair</option><option value="1">1 — Poor</option></select></label><textarea required minLength={10} maxLength={1200} rows={2} value={review} onChange={(e)=>setReview(e.target.value)} placeholder="Share useful feedback about the lesson." className="w-full rounded-lg border p-3 text-sm"/><button disabled={busy||review.trim().length<10} className="min-h-9 rounded-lg bg-primary px-3 text-xs font-bold text-white disabled:opacity-50">Publish review</button></form>}{perspective==='student'&&booking.status==='completed'&&reviewed&&<p className="mt-3 border-t pt-3 text-xs font-semibold text-emerald-700">Review submitted · Thank you</p>}</article>
}
