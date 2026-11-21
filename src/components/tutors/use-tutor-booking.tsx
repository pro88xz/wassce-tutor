import { useCallback, useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useSendToSignIn } from '@/lib/use-send-to-sign-in'
import { bookingReturnPath, readBookIntent, type BookIntent } from '@/lib/book-return'
import { displayName } from '@/lib/tutor-profile'
import { BookDialog } from './BookDialog'
import type { Tutor } from './Marketplace'
import { firstName } from './tutor-display'

/**
 * Booking a tutor, from the marketplace or a tutor's own page. Signed in: the
 * booking opens. Signed out: sign up or sign in first, then back on the same
 * page with the booking open (reopen() after the tutors have loaded).
 */
export function useTutorBooking(preferredSubject?: string) {
  const [booking, setBooking] = useState<Tutor | null>(null)
  const [reopened, setReopened] = useState<BookIntent | null>(null)
  const { user } = useAuth()
  const sendToSignIn = useSendToSignIn()

  const book = (tutor: Tutor, subjects?: string[], students = 1) => {
    if (user) {
      setReopened(null)
      setBooking(tutor)
      return
    }
    const chosen = subjects ?? (preferredSubject && tutor.tutor_subjects.some((s) => s.subject_id === preferredSubject) ? [preferredSubject] : [])
    sendToSignIn(bookingReturnPath(window.location.pathname, { tutor: tutor.id, subjects: chosen, students }), { forName: firstName(displayName(tutor.full_name)) })
  }

  /** Back from signing in to book a tutor: open that booking, once (a refresh, or coming back later, does not reopen it). */
  const reopen = useCallback((list: Tutor[]) => {
    const intent = readBookIntent(window.location.search)
    if (!intent) return
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.hash}`)
    const tutor = list.find((t) => t.id === intent.tutor)
    if (tutor) {
      setReopened(intent)
      setBooking(tutor)
    }
  }, [])

  const dialog = booking ? (
    <BookDialog
      tutor={booking}
      preferredSubject={preferredSubject}
      initialSubjects={reopened?.tutor === booking.id ? reopened.subjects : undefined}
      initialStudents={reopened?.tutor === booking.id ? reopened.students : undefined}
      onSignIn={(subjects, students) => book(booking, subjects, students)}
      onClose={() => setBooking(null)}
    />
  ) : null

  return { book, reopen, dialog }
}
