// On the tutor dashboard: the tutor edits their card, sees exactly what
// students will see as they type, and publishes it (update_tutor_card() and
// update_tutor_avatar(), migrations 18 and 20). They can also hide the card
// when they are full or away, and show it again (set_tutor_listed()).
import { useEffect, useMemo, useState } from 'react'
import { Eye, EyeOff, ShieldAlert } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { TutorCard, type Tutor } from '@/components/tutors/Marketplace'
import { PhotoPicker } from '@/components/tutors/PhotoPicker'

export type EditableTutor = Tutor & { user_id: string; status: string; listed: boolean }

const photoUrl = (path: string) => supabase.storage.from('tutor-profile-images').getPublicUrl(path).data.publicUrl
const field = 'w-full rounded-xl border bg-card px-3 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'

export function TutorCardEditor({
  tutor,
  onChanged,
  onMessage,
  onError,
}: {
  tutor: EditableTutor
  /** Reload the tutor after a change, so the dashboard shows what was saved. */
  onChanged: () => Promise<void>
  onMessage: (message: string) => void
  onError: (message: string) => void
}) {
  const [bio, setBio] = useState(tutor.bio)
  const [location, setLocation] = useState(tutor.location)
  const [qualifications, setQualifications] = useState(tutor.qualifications)
  const [experience, setExperience] = useState(String(tutor.experience_years))
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const photoPreview = useMemo(() => (photo ? URL.createObjectURL(photo) : null), [photo])
  useEffect(() => () => { if (photoPreview) URL.revokeObjectURL(photoPreview) }, [photoPreview])

  const years = Number(experience)
  const problems = [
    bio.trim().length < 80 && 'Write at least 80 characters about how you teach.',
    bio.trim().length > 2000 && 'Keep “About you” under 2,000 characters.',
    location.trim().length < 2 && 'Enter the town or area where you teach.',
    qualifications.trim().length < 10 && 'Enter your qualifications.',
    (!Number.isInteger(years) || years < 0 || years > 60 || experience.trim() === '') && 'Years of experience must be a whole number from 0 to 60.',
  ].filter((p): p is string => !!p)
  const textChanged = bio.trim() !== tutor.bio || location.trim() !== tutor.location || qualifications.trim() !== tutor.qualifications || years !== tutor.experience_years
  const changed = textChanged || !!photo
  const removed = tutor.status !== 'active'

  const draft: Tutor = { ...tutor, bio: bio.trim() || tutor.bio, location: location.trim() || tutor.location, qualifications: qualifications.trim() || tutor.qualifications, experience_years: Number.isInteger(years) && years >= 0 ? years : tutor.experience_years }

  const discard = () => {
    setBio(tutor.bio); setLocation(tutor.location); setQualifications(tutor.qualifications); setExperience(String(tutor.experience_years))
    setPhoto(null); setPhotoError(null)
  }

  const publish = async () => {
    setBusy(true)
    try {
      if (textChanged) {
        const { error } = await supabase.rpc('update_tutor_card', { p_bio: bio.trim(), p_location: location.trim(), p_qualifications: qualifications.trim(), p_experience_years: years })
        if (error) throw error
      }
      if (photo) {
        const path = `${tutor.user_id}/${crypto.randomUUID()}-${photo.name.toLowerCase().replace(/[^a-z0-9._-]/g, '-')}`
        const { error: uploadError } = await supabase.storage.from('tutor-profile-images').upload(path, photo, { upsert: false, contentType: photo.type })
        if (uploadError) throw uploadError
        const { error } = await supabase.rpc('update_tutor_avatar', { p_avatar_path: path })
        if (error) {
          await supabase.storage.from('tutor-profile-images').remove([path])
          throw error
        }
      }
      setPhoto(null)
      await onChanged()
      onMessage(tutor.listed && !removed ? 'Published. Students see your new card now.' : 'Saved. Your card is hidden: show it when you are ready to take students.')
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Could not publish your card.')
    } finally {
      setBusy(false)
    }
  }

  const setListed = async (listed: boolean) => {
    setBusy(true)
    try {
      const { error } = await supabase.rpc('set_tutor_listed', { p_listed: listed })
      if (error) throw error
      await onChanged()
      onMessage(listed ? 'Your card is back in the marketplace. Students can contact you again.' : 'Your card is hidden. Students cannot find or contact you until you show it again.')
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Could not change your card.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="rounded-2xl border bg-card p-5 sm:p-7" aria-labelledby="card-editor">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="card-editor" className="text-xl font-bold">Your tutor card</h2>
          <p className="mt-1 text-sm text-muted-foreground">Edit it, check the preview, then publish. Students see the published card on the marketplace.</p>
        </div>
      </div>

      {removed ? (
        <div role="status" className="mt-4 flex gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-800">
          <ShieldAlert className="h-5 w-5 shrink-0" aria-hidden />
          <p><strong>Removed by WASSCE Tutor.</strong> Your card is not in the marketplace and students cannot contact you. Contact support if you have questions.</p>
        </div>
      ) : tutor.listed ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">
          <p className="flex items-center gap-2"><Eye className="h-5 w-5 shrink-0" aria-hidden /><span><strong>Live.</strong> Students can find you and message you. Full or away? Hide your card until you can take new students.</span></p>
          <button type="button" disabled={busy} onClick={() => void setListed(false)} className="min-h-10 rounded-xl border border-emerald-300 bg-white px-4 font-semibold disabled:opacity-50">Hide my card</button>
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          <p className="flex items-center gap-2"><EyeOff className="h-5 w-5 shrink-0" aria-hidden /><span><strong>Hidden.</strong> Students cannot find or contact you.</span></p>
          <button type="button" disabled={busy} onClick={() => void setListed(true)} className="min-h-10 rounded-xl bg-primary px-4 font-semibold text-white disabled:opacity-50">Show my card</button>
        </div>
      )}

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_.85fr]">
        <div className="space-y-4">
          <PhotoPicker file={photo} currentUrl={tutor.avatar_path ? photoUrl(tutor.avatar_path) : null} error={photoError} onPick={(file, problem) => { setPhotoError(problem); if (file) setPhoto(file) }} />
          <p className="text-sm"><span className="font-semibold">Name:</span> {tutor.full_name} <span className="text-xs text-muted-foreground">(verified; contact support to change it)</span></p>
          <label className="block space-y-1.5 text-sm font-semibold">
            Qualifications
            <textarea value={qualifications} onChange={(e) => setQualifications(e.target.value)} rows={2} maxLength={2000} className={`${field} py-2.5`} />
            <span className="block text-xs font-normal text-muted-foreground">For example: BSc Biology (FBC), PGDE. Our team is told when this changes.</span>
          </label>
          <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
            <label className="block space-y-1.5 text-sm font-semibold">
              Years teaching
              <input type="number" inputMode="numeric" min={0} max={60} step={1} value={experience} onChange={(e) => setExperience(e.target.value)} className={`${field} h-11`} />
            </label>
            <label className="block space-y-1.5 text-sm font-semibold">
              Town or area
              <input value={location} onChange={(e) => setLocation(e.target.value)} maxLength={120} placeholder="e.g. Kissy, Freetown" className={`${field} h-11`} />
            </label>
          </div>
          <label className="block space-y-1.5 text-sm font-semibold">
            About you
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={5} maxLength={2000} className={`${field} py-2.5`} placeholder="How you teach, what students improve, where you have taught." />
            <span className="block text-xs font-normal text-muted-foreground">{bio.trim().length} characters · at least 80. Students see the first three lines on your card.</span>
          </label>
          {changed && problems.length > 0 && <ul className="space-y-1 rounded-xl bg-amber-50 p-3 text-xs font-semibold text-amber-900">{problems.map((p) => <li key={p}>{p}</li>)}</ul>}
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" disabled={busy || !changed || problems.length > 0} onClick={() => void publish()} className="min-h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-white disabled:opacity-50">
              {busy ? 'Publishing…' : 'Publish changes'}
            </button>
            {changed && <button type="button" disabled={busy} onClick={discard} className="min-h-11 rounded-xl px-4 text-sm font-semibold text-muted-foreground hover:bg-muted">Discard changes</button>}
            <span className="text-xs text-muted-foreground">{changed ? 'You have changes that are not published yet.' : 'Everything is published.'}</span>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Preview: what students see</p>
          <div className={`mx-auto max-w-sm ${removed || !tutor.listed ? 'opacity-60' : ''}`}>
            <TutorCard tutor={draft} preview photoSrc={photoPreview} />
          </div>
          {(removed || !tutor.listed) && <p className="mt-2 text-center text-xs text-muted-foreground">Not visible to students right now.</p>}
        </div>
      </div>
    </section>
  )
}
