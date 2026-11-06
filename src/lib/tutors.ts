// Book a tutor: one-to-one lessons with a real teacher, arranged on WhatsApp.
// Requests are saved to tutor_requests (migration 06) when that table exists,
// and always handed to WhatsApp, where the team confirms tutor, times and price.
import { supabase } from '@/lib/supabase'
import type { SubjectPhoto } from '@/lib/subject-photos'

/** The same business WhatsApp number used for plan payments. */
export const TUTOR_WHATSAPP = '23277884195'

export const LEVELS = ['SSS1', 'SSS2', 'SSS3', 'Private candidate'] as const
export type Level = (typeof LEVELS)[number]

export const MODES = [
  { id: 'online', label: 'Online', hint: 'Video or voice call on your phone' },
  { id: 'home', label: 'At home', hint: 'The tutor comes to you, where available' },
  { id: 'either', label: 'Either', hint: 'Whichever works best' },
] as const
export type Mode = (typeof MODES)[number]['id']

export type TutorRequest = {
  subject: string
  level: Level
  mode: Mode
  town: string
  availability: string
  message: string
  name: string
  phone: string
}

/** Photo for the tutor pages (credited on the About page with the subject photos). */
export const TUTOR_PHOTO: { src: string; small: string; caption: string; credit: SubjectPhoto['credit'] } = {
  src: '/img/tutors.webp',
  small: '/img/tutors-640.webp',
  caption: 'A teacher helping pupils with their work',
  credit: {
    creator: 'Katerina Holmes',
    source: 'Pexels',
    sourceUrl: 'https://www.pexels.com/photo/black-teacher-standing-near-desk-and-pointing-at-pupils-copybook-5905478/',
    license: 'Pexels License',
    licenseUrl: 'https://www.pexels.com/license/',
  },
}

export function whatsappMessage(r: TutorRequest): string {
  const modeLabel = MODES.find((m) => m.id === r.mode)?.label ?? r.mode
  return [
    'Hello WASSCE Tutor, I would like to book a tutor.',
    '',
    `Subject: ${r.subject}`,
    `Class: ${r.level}`,
    `Lessons: ${modeLabel}${r.town ? ` (${r.town})` : ''}`,
    r.availability ? `When I'm free: ${r.availability}` : '',
    r.message ? `What I need help with: ${r.message}` : '',
    '',
    `Name: ${r.name}`,
    `WhatsApp: ${r.phone}`,
  ]
    .filter((l, i, a) => l !== '' || (a[i - 1] ?? '') !== '')
    .join('\n')
}

export const whatsappLink = (r: TutorRequest) => `https://wa.me/${TUTOR_WHATSAPP}?text=${encodeURIComponent(whatsappMessage(r))}`

/**
 * Saves the request. Returns true when it was stored; false if the table is
 * not set up yet or the network failed, in which case WhatsApp still carries it.
 */
export async function saveTutorRequest(r: TutorRequest, userId: string | null): Promise<boolean> {
  const { error } = await supabase.from('tutor_requests').insert({
    user_id: userId,
    name: r.name.trim(),
    phone: r.phone.trim(),
    subject: r.subject,
    level: r.level,
    mode: r.mode,
    town: r.town.trim() || null,
    availability: r.availability.trim() || null,
    message: r.message.trim() || null,
  })
  if (error) console.warn('Tutor request not saved:', error.message)
  return !error
}
