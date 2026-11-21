import { createFileRoute, Link } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import { Bell, MessageCircle, ShieldCheck } from 'lucide-react'
import { privateHead } from '@/lib/seo'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { useTutorAutoApprove } from '@/lib/tutor-settings'
import { useProfile } from '@/lib/queries'
import { monthlyFee } from '@/lib/tutors'
import { TutorCardEditor, type EditableTutor } from '@/components/tutors/TutorCardEditor'
import { TutorCardStrength } from '@/components/tutors/TutorCardStrength'
import { TutorOfferForm } from '@/components/tutors/TutorOfferForm'
import { nle } from '@/lib/tutor-pricing'

type Booking = { id:string; starts_at:string; duration_minutes:number; price_nle:number; status:string; student_id:string; tutor_id:string; student_message:string|null; subject:{name:string}|null; tutor:{user_id:string;full_name:string}|null }
type Notification = { id:string; title:string; body:string; created_at:string; read_at:string|null; event_type:string }
type Contact = { contacted_at:string; student_first_name:string|null; subjects:string|null; students:number; per_student_nle:number; total_nle:number }

export const Route = createFileRoute('/tutor-dashboard')({
  head: privateHead('Tutor dashboard'),
  component: TutorDashboard,
})

const dateLabel = (value:string) => new Date(value).toLocaleString('en-GB',{dateStyle:'medium',timeStyle:'short'})

/** Everything the dashboard shows, for one tutor account. */
async function fetchTutorDashboard(userId: string) {
  const tutorResult = await supabase.from('tutors').select('id,user_id,slug,reviewer,full_name,bio,qualifications,experience_years,location,avatar_path,status,listed,verified_at,multi_subject_discount_pct,group_max,group_discount_pct,payment_methods,tutor_subjects(subject_id,price_nle,lessons_per_week,subject:subjects(id,name)),tutor_booking_reviews(rating)').eq('user_id',userId).maybeSingle()
  const tutorRecord = tutorResult.error ? null : (tutorResult.data as unknown as EditableTutor|null)
  const [b,n,ct,app] = await Promise.all([
    supabase.from('tutor_bookings').select('id,starts_at,duration_minutes,price_nle,status,student_id,tutor_id,student_message,subject:subjects(name),tutor:tutors(user_id,full_name)').eq('tutor_id',tutorRecord?.id ?? '00000000-0000-0000-0000-000000000000').order('starts_at',{ascending:false}).limit(50),
    supabase.from('user_notifications').select('id,title,body,created_at,read_at,event_type').eq('recipient_id',userId).in('event_type',['tutor_contacted','booking_requested','booking_request_sent','booking_accepted','booking_declined','booking_confirmed','booking_completed','booking_cancelled','booking_no_show','tutor_approved','tutor_rejected','tutor_suspended','tutor_reactivated','tutor_reviewer_on']).order('created_at',{ascending:false}).limit(30),
    tutorRecord ? supabase.rpc('my_tutor_contacts') : Promise.resolve({data:[],error:null}),
    supabase.from('tutor_applications').select('status,review_note').eq('user_id',userId).order('created_at',{ascending:false}).limit(1).maybeSingle(),
  ])
  return { tutorRecord, b, n, ct, app }
}

function TutorDashboard() {
  const { user, loading } = useAuth()
  const { data: profile } = useProfile(user?.id ?? null)
  const autoApprove = useTutorAutoApprove()
  const [tutor,setTutor] = useState<EditableTutor|null>(null)
  const [bookings,setBookings] = useState<Booking[]>([])
  const [notifications,setNotifications] = useState<Notification[]>([])
  const [application,setApplication] = useState<{status:string;review_note:string|null}|null>(null)
  const [contacts,setContacts] = useState<Contact[]>([])
  const [recentContacts,setRecentContacts] = useState(0)
  const [busy,setBusy] = useState(false)
  const [message,setMessage] = useState<string|null>(null)
  const [error,setError] = useState<string|null>(null)

  const userId = user?.id ?? null
  const load = useCallback(() => {
    if (!userId) return Promise.resolve()
    return fetchTutorDashboard(userId).then(({ tutorRecord, b, n, ct, app }) => {
      setTutor(tutorRecord)
      if (!b.error) setBookings((b.data??[]) as unknown as Booking[])
      if (!n.error) setNotifications((n.data??[]) as Notification[])
      if (!app.error) setApplication(app.data)
      if (!ct.error) {
        const list=(ct.data??[]) as Contact[]
        const since=Date.now()-30*86400000
        setContacts(list)
        setRecentContacts(list.filter((c)=>new Date(c.contacted_at).getTime()>since).length)
      }
    })
  }, [userId])

  // Loaded again once admin status is known: an admin sees more.
  useEffect(()=>{ void load() },[load,profile?.is_admin])
  useEffect(()=>{
    if(!userId) return
    const channel=supabase.channel(`tutor-dashboard-${userId}`)
      .on('postgres_changes',{event:'*',schema:'public',table:'user_notifications',filter:`recipient_id=eq.${userId}`},()=>{void load()})
      .on('postgres_changes',{event:'*',schema:'public',table:'tutor_bookings'},()=>{void load()})
      .subscribe()
    return ()=>{void supabase.removeChannel(channel)}
  },[userId,load,profile?.is_admin])

  const updateBooking = async (id:string,status:string) => {
    setBusy(true);setError(null);setMessage(null)
    try {
      const {error:rpcError}=await supabase.rpc('update_tutor_booking',{p_booking_id:id,p_status:status,p_reason:null})
      if(rpcError) throw rpcError
      await supabase.functions.invoke('send-notification-email',{body:{entity_id:id,event_type:`booking_${status}`}}).catch(()=>undefined)
      setMessage(`Booking ${status.replace('_',' ')}.`)
      await load()
    } catch(err) {setError(err instanceof Error?err.message:'Could not update booking.')}
    finally {setBusy(false)}
  }

  const markRead = async (id:string) => {
    await supabase.from('user_notifications').update({read_at:new Date().toISOString()}).eq('id',id)
    setNotifications((current)=>current.map((n)=>n.id===id?{...n,read_at:new Date().toISOString()}:n))
  }

  if(loading) return <div className="mx-auto h-64 max-w-5xl animate-pulse rounded-3xl bg-muted"/>
  if(!user) return <div className="mx-auto max-w-md rounded-2xl border bg-card p-8 text-center"><h1 className="text-xl font-bold">Sign in to continue</h1><Link to="/auth" search={{ intent: "tutor" } as never} className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 font-semibold text-white">Sign in</Link></div>

  const incoming=bookings
  const unread=notifications.filter((n)=>!n.read_at).length

  return <div className="mx-auto w-full max-w-7xl space-y-8 pb-16">
    <header className="site-brand-panel rounded-[2rem] p-7 sm:p-9"><p className="text-xs font-bold uppercase tracking-[.16em] text-violet-200">WASSCE Tutor network</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">Tutor workspace</h1><p className="mt-2 text-sm text-white/65">Your tutor card, monthly fees, and the students who contact you on WhatsApp.</p><div className="mt-5 flex flex-wrap gap-3">{tutor?.slug ? <a href={`/tutors/${tutor.slug}`} className="inline-flex min-h-10 items-center rounded-xl bg-white px-4 text-sm font-bold text-[#21134d]">See my page</a> : <Link to="/tutors" className="inline-flex min-h-10 items-center rounded-xl bg-white px-4 text-sm font-bold text-[#21134d]">View marketplace</Link>}{tutor && <Link to="/tutor-dashboard/review" className="inline-flex min-h-10 items-center rounded-xl border border-white/25 px-4 text-sm font-semibold text-white">{tutor.reviewer ? "Review lessons" : "Become a lesson reviewer"}</Link>}{!tutor&&<Link to="/become-a-tutor" className="inline-flex min-h-10 items-center rounded-xl border border-white/25 px-4 text-sm font-semibold text-white">Make your tutor card</Link>}</div></header>
    {message&&<p role="status" className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">{message}</p>}
    {error&&<p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    <div className="grid gap-3 sm:grid-cols-3"><Metric label="Students in the last 30 days" value={recentContacts}/><Metric label="Students who contacted you" value={contacts.length}/><Metric label="Unread notifications" value={unread}/></div>

    {profile?.is_admin&&<section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-5 sm:p-6"><div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-primary"/><div><h2 className="font-bold">Reviewing tutor applications?</h2><p className="text-sm text-muted-foreground">Applications, approved tutors and all bookings are in the admin area.</p></div></div><Link to="/admin/tutors" className="inline-flex min-h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-white">Open Admin · Tutors</Link></section>}

    {tutor&&<><TutorCardStrength tutor={tutor}/><div id="card" className="scroll-mt-24"><TutorCardEditor key={tutor.id} tutor={tutor} onChanged={load} onMessage={(m)=>{setError(null);setMessage(m)}} onError={(m)=>{setMessage(null);setError(m)}}/></div><div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]"><section className="rounded-2xl border bg-card p-5 sm:p-7"><TutorOfferForm tutor={tutor} onSaved={(m)=>{setError(null);setMessage(m);void load()}} onError={(m)=>{setMessage(null);setError(m)}}/></section><section id="students" className="scroll-mt-24 space-y-6 rounded-2xl border bg-card p-5 sm:p-7"><div><h2 className="flex items-center gap-2 text-lg font-bold"><MessageCircle className="h-4 w-4 text-primary"/> Students who contacted you</h2><p className="mt-1 text-xs text-muted-foreground">Each student agreed to your fee, then opened WhatsApp to message you. Reply to them there.</p><ul className="mt-3 space-y-2">{contacts.length===0?<li className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">No students yet. A clear photo, a friendly biography and a fair fee help students choose you.</li>:contacts.map((c,i)=><li key={`${c.contacted_at}-${i}`} className="rounded-xl border p-3 text-sm"><div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1"><span><strong>{c.student_first_name??'A student'}</strong>{c.students>1&&<span className="ml-1.5 rounded-full bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-800">group of {c.students}</span>}</span><span className="text-xs text-muted-foreground">{dateLabel(c.contacted_at)}</span></div><p className="mt-1 text-muted-foreground">{c.subjects??'Subject'}</p><p className="mt-1 text-xs font-semibold">{nle(Number(c.per_student_nle))} a month{c.students>1?` each · ${nle(Number(c.total_nle))} in total`:''}</p></li>)}</ul></div>{incoming.length>0&&<div><h2 className="text-lg font-bold">Earlier booking requests</h2><div className="mt-3 space-y-3">{incoming.map((b)=><BookingCard key={b.id} booking={b} perspective="tutor" busy={busy} onUpdate={updateBooking}/>)}</div></div>}</section></div></>}

    {!tutor&&!profile?.is_admin&&<section className="rounded-2xl border bg-card p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-wider text-primary">Tutor onboarding</p><h2 className="mt-2 text-2xl font-bold">{application ? 'Your application' : 'Start teaching on WASSCE Tutor'}</h2>{application ? <><p className="mt-2 text-sm font-semibold capitalize">Status: {application.status.replace('_',' ')}</p><p className="mt-2 text-sm text-muted-foreground">{application.review_note ?? (application.status==='rejected'?'Your application was not approved. Review the feedback before submitting again.':'Our team is checking your tutor card. We will tell you here and by email as soon as it is in the marketplace.')}</p>{application.status==='rejected'&&<Link to="/become-a-tutor" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-sm font-bold text-white">Update application</Link>}</> : <><p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">Make your tutor card in three short steps: your photo, your subjects and your monthly fee. {autoApprove ? 'It goes live in the marketplace as soon as you finish.' : 'Our team checks it, then it goes live in the marketplace.'}</p><Link to="/become-a-tutor" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-sm font-bold text-white">Make my tutor card</Link></>}</section>}

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
 return <article className="rounded-xl border p-4"><div className="flex flex-wrap items-start justify-between gap-2"><div><p className="font-bold">{booking.subject?.name??'WASSCE tutoring'}</p>{perspective==='student'&&booking.tutor?.full_name&&<p className="mt-0.5 text-xs text-muted-foreground">Tutor: {booking.tutor.full_name}</p>}<p className="mt-1 text-sm text-muted-foreground">{dateLabel(booking.starts_at)} · {booking.duration_minutes} min</p></div><span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold capitalize">{booking.status.replace('_',' ')}</span></div><p className="mt-2 text-sm font-semibold">{monthlyFee(booking.price_nle)}</p>{booking.student_message&&<p className="mt-2 text-sm text-muted-foreground">{booking.student_message}</p>}<div className="mt-3 flex flex-wrap gap-2">{actions.map(([status,label])=><button key={status} disabled={busy} onClick={()=>onUpdate(booking.id,status)} className={`min-h-9 rounded-lg px-3 text-xs font-semibold ${status==='declined'||status==='cancelled'?'border border-red-200 text-red-700':'bg-primary text-white'}`}>{label}</button>)}</div>{perspective==='student'&&booking.status==='completed'&&!reviewed&&<form className="mt-4 space-y-2 border-t pt-4" onSubmit={(e)=>{e.preventDefault();onReview?.(booking.id,rating,review)}}><p className="text-sm font-bold">Review this completed session</p><label className="block text-xs font-semibold">Rating<select value={rating} onChange={(e)=>setRating(Number(e.target.value))} className="ml-2 h-9 rounded-lg border px-2"><option value="5">5 — Excellent</option><option value="4">4 — Very good</option><option value="3">3 — Good</option><option value="2">2 — Fair</option><option value="1">1 — Poor</option></select></label><textarea required minLength={10} maxLength={1200} rows={2} value={review} onChange={(e)=>setReview(e.target.value)} placeholder="Share useful feedback about the lesson." className="w-full rounded-lg border p-3 text-sm"/><button disabled={busy||review.trim().length<10} className="min-h-9 rounded-lg bg-primary px-3 text-xs font-bold text-white disabled:opacity-50">Publish review</button></form>}{perspective==='student'&&booking.status==='completed'&&reviewed&&<p className="mt-3 border-t pt-3 text-xs font-semibold text-emerald-700">Review submitted · Thank you</p>}</article>
}
