// Returns whether a user has a plan: what the AI study tutor and the timed
// mock exams need. Access = a plan that has not ended OR admin OR a 7-day
// trial that started before trials were retired (migration 07).
//
// Lessons and practice sets are free for everyone, with or without an
// account (migration 22). Only mock exams (paperLocked) and the AI tutor
// (AccessGate) look at access.

import type { Profile } from '@/lib/types'

const TRIAL_DAYS = 7

export type AccessState = {
  hasAccess: boolean
  reason: 'admin' | 'subscribed' | 'trial' | 'expired' | 'no-profile'
  trialDaysLeft: number
  subscriptionDaysLeft: number
}

export function checkAccess(profile: Profile | null | undefined): AccessState {
  if (!profile) {
    return { hasAccess: false, reason: 'no-profile', trialDaysLeft: 0, subscriptionDaysLeft: 0 }
  }
  if (profile.is_admin) {
    return { hasAccess: true, reason: 'admin', trialDaysLeft: 0, subscriptionDaysLeft: 0 }
  }

  // Subscription check
  let subDays = 0
  if (profile.subscription_active && profile.subscription_expires_at) {
    const ms = new Date(profile.subscription_expires_at).getTime() - Date.now()
    subDays = Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)))
  }
  if (profile.subscription_active && subDays > 0) {
    return { hasAccess: true, reason: 'subscribed', trialDaysLeft: 0, subscriptionDaysLeft: subDays }
  }

  // Trial check
  let trialDays = 0
  if (profile.trial_started_at) {
    const start = new Date(profile.trial_started_at).getTime()
    const end = start + TRIAL_DAYS * 24 * 60 * 60 * 1000
    trialDays = Math.max(0, Math.ceil((end - Date.now()) / (24 * 60 * 60 * 1000)))
  }
  if (trialDays > 0) {
    return { hasAccess: true, reason: 'trial', trialDaysLeft: trialDays, subscriptionDaysLeft: 0 }
  }

  return { hasAccess: false, reason: 'expired', trialDaysLeft: 0, subscriptionDaysLeft: 0 }
}

/** A timed mock exam (papers.paper_type 'Mock'), as opposed to a practice set. */
export const isMockPaper = (paper: { paper_type?: string | null }) => paper.paper_type?.toLowerCase() === 'mock'

/**
 * Whether a paper is closed to this student. Practice sets are always open
 * (migration 22); a mock exam needs a plan unless an admin made it free.
 * The database applies the same rule to the questions.
 */
export const paperLocked = (access: AccessState, paper: { is_free?: boolean | null; paper_type?: string | null }) =>
  !access.hasAccess && isMockPaper(paper) && paper.is_free !== true
