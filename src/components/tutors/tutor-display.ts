// Small helpers for showing a tutor, shared by the marketplace cards and the booking dialog.
import { supabase } from '@/lib/supabase'
import type { TutorOffer } from '@/lib/tutor-pricing'
import type { Rate, Tutor } from './Marketplace'

export const photoUrl = (path: string) => supabase.storage.from('tutor-profile-images').getPublicUrl(path).data.publicUrl
export const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name
export const initials = (name: string) => name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('')
export const offerOf = (t: Tutor): TutorOffer => ({ multiSubjectDiscountPct: t.multi_subject_discount_pct ?? 0, groupMax: t.group_max, groupDiscountPct: t.group_discount_pct ?? 0 })
export const byName = (a: Rate, b: Rate) => (a.subject?.name ?? '').localeCompare(b.subject?.name ?? '')
