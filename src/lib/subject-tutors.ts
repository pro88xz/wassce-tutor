// What /tutors/{subject} says about a subject, all from real data: the tutors
// who teach it (with their towns and fees), the syllabus they cover, and what a
// student can practise between lessons.
//
// Each page is written from its own subject's facts rather than from shared
// copy, so no two subject pages read alike (a crawl found the old template
// pages 75-80% identical). Booking steps and the general tutoring FAQ live once
// on /tutors, which these pages link to.
import { supabase } from '@/lib/supabase'
import type { Tutor } from '@/components/tutors/Marketplace'
import {
  lessonPath,
  fetchSubjectHub,
  fetchSubjectQuestionsHub,
  fetchSubjectSummaries,
  hasSubjectPage,
  hasTopicPage,
  lessonMinutes,
  questionsPath,
  subjectPath,
  topicPath,
  type SubjectHub,
} from '@/lib/public-content'
import { TUTOR_COLUMNS, displayName, tutorPagePath } from '@/lib/tutor-profile'
import { lessonsText, listText, nle } from '@/lib/tutor-pricing'
import { shortSubject } from '@/lib/tutor-seo'
import { waecPastPapersUrl } from '@/lib/waec'

/** One part of the syllabus as a tutor would plan it: its topics, lessons, reading time and practice questions. */
export type SyllabusPart = {
  name: string
  topics: { id: string; name: string; href: string | null; lessons: number; questions: number }[]
  lessons: number
  minutes: number
  questions: number
}

export type SubjectTutorsPage = {
  hub: SubjectHub
  /** Listed tutors who teach the subject, most recently approved first. */
  tutors: Tutor[]
  parts: SyllabusPart[]
  questionCount: number
  questionsHref: string | null
  guide: { title: string; href: string } | null
  pastPapersUrl: string | null
  /** The subject's lessons that a tutor read and approved (each carries the tutor's name), newest first. */
  reviews: {
    total: number
    reviewers: { name: string; href: string; count: number }[]
    recent: { title: string; href: string; topic: string; reviewer: string }[]
  }
  /** Subjects in the same faculties, with how many tutors teach each, and how many of those also teach this subject. */
  related: { slug: string; name: string; topicCount: number; tutors: number; shared: number }[]
}

/** Every active, listed tutor, newest first (what the marketplace shows; /tutors is built with it). */
export async function fetchListedTutors(): Promise<Tutor[]> {
  const { data, error } = await supabase
    .from('tutors')
    .select(TUTOR_COLUMNS)
    .eq('status', 'active')
    .eq('listed', true)
    .order('verified_at', { ascending: false })
  if (error) throw new Error(`Could not load tutors: ${error.message}`)
  return (data ?? []) as unknown as Tutor[]
}

const teaches = (t: Tutor, subjectId: string) => t.tutor_subjects.some((r) => r.subject_id === subjectId)

/** Lessons in these topics that a tutor reviewed and approved, newest first. */
async function fetchReviewedLessons(topicIds: string[]): Promise<{ slug: string; title: string; topic_id: string; reviewer_tutor_slug: string }[]> {
  if (!topicIds.length) return []
  const { data, error } = await supabase
    .from('wassce_public_lessons')
    .select('slug,title,topic_id,reviewer_tutor_slug,reviewed_at')
    .in('topic_id', topicIds)
    .not('reviewer_tutor_slug', 'is', null)
    .order('reviewed_at', { ascending: false })
  if (error) throw new Error(`Could not load lesson reviews: ${error.message}`)
  return (data ?? []) as { slug: string; title: string; topic_id: string; reviewer_tutor_slug: string }[]
}

/** Everything for a subject's tutor page; null when the slug is not a subject with a page. */
export async function fetchSubjectTutorsPage(slug: string): Promise<SubjectTutorsPage | null> {
  const hub = await fetchSubjectHub(slug)
  if (!hub) return null
  const topicsById = new Map(hub.groups.flatMap((g) => g.topics.map((t) => [t.id, t] as const)))
  const [all, tutors, questions, reviewed] = await Promise.all([
    fetchSubjectSummaries(),
    fetchListedTutors(),
    fetchSubjectQuestionsHub(slug),
    fetchReviewedLessons([...topicsById.keys()]),
  ])
  const tutorBySlug = new Map(tutors.filter((t) => t.slug).map((t) => [t.slug!, t]))
  const reviewerName = (s: string) => (tutorBySlug.get(s) ? displayName(tutorBySlug.get(s)!.full_name) : null)
  const counts = new Map<string, number>()
  for (const l of reviewed) if (reviewerName(l.reviewer_tutor_slug)) counts.set(l.reviewer_tutor_slug, (counts.get(l.reviewer_tutor_slug) ?? 0) + 1)
  const shown = reviewed.filter((l) => reviewerName(l.reviewer_tutor_slug) && topicsById.has(l.topic_id))
  const questionsByTopic = new Map((questions?.groups ?? []).flatMap((g) => g.topics.map((t) => [t.topic.id, t.questions] as const)))
  const parts = hub.groups.map((g) => {
    const topics = g.topics.map((t) => ({
      id: t.id,
      name: t.name,
      href: hasTopicPage(t) ? topicPath(slug, t.slug) : null,
      lessons: t.lessons.length,
      questions: questionsByTopic.get(t.id) ?? 0,
    }))
    return {
      name: g.name,
      topics,
      lessons: topics.reduce((n, t) => n + t.lessons, 0),
      minutes: lessonMinutes(g.topics.flatMap((t) => t.lessons)),
      questions: topics.reduce((n, t) => n + t.questions, 0),
    }
  })
  // Loaded on demand: the blog's full text is large and the page only needs one title from it.
  const { BLOG_POSTS } = await import('@/content/editorial')
  const guide = BLOG_POSTS.find((p) => p.slug === `how-to-pass-wassce-${slug}`)
  return {
    hub,
    tutors: tutors.filter((t) => teaches(t, hub.subject.id)),
    parts,
    questionCount: questions?.questionCount ?? 0,
    questionsHref: questions ? questionsPath(slug) : null,
    guide: guide ? { title: guide.title, href: `/blog/${guide.slug}` } : null,
    pastPapersUrl: waecPastPapersUrl(slug),
    reviews: {
      total: shown.length,
      reviewers: [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([s, count]) => ({ name: reviewerName(s)!, href: tutorPagePath(s), count })),
      recent: shown.slice(0, 6).map((l) => {
        const topic = topicsById.get(l.topic_id)!
        return { title: l.title, href: lessonPath(slug, topic.slug, l.slug), topic: topic.name, reviewer: reviewerName(l.reviewer_tutor_slug)! }
      }),
    },
    related: hub.related
      .filter((s) => hasSubjectPage(s.topicCount) && all.some((a) => a.id === s.id))
      .map((s) => {
        const theirs = tutors.filter((t) => teaches(t, s.id))
        return { slug: s.slug, name: s.name, topicCount: s.topicCount, tutors: theirs.length, shared: theirs.filter((t) => teaches(t, hub.subject.id)).length }
      }),
  }
}

// ── Words built from the facts ──────────────────────────────────────────────

/** The subject's rate on a tutor's card. */
const rateOf = (t: Tutor, subjectId: string) => t.tutor_subjects.find((r) => r.subject_id === subjectId)

/** A tutor's location ("Lumley, Freetown" or "Freetown") as its town and, when given, the area within it. */
function place(location: string): { town: string; area: string | null } {
  const parts = location.split(',').map((p) => p.trim()).filter(Boolean)
  return parts.length > 1 ? { town: parts.at(-1)!, area: parts.slice(0, -1).join(', ') } : { town: parts[0] ?? '', area: null }
}

/** The towns the tutors teach in, without repeats ("Freetown", "Bo"). */
export const tutorTowns = (tutors: Tutor[]) => [...new Set(tutors.map((t) => place(t.location).town).filter(Boolean))]

/** Where the tutors teach, town by town with any areas they named: "Freetown (including Lumley) and Bo". */
export function tutorPlaces(tutors: Tutor[]): string {
  return listText(
    tutorTowns(tutors).map((town) => {
      const here = tutors.map((t) => place(t.location)).filter((p) => p.town === town)
      const areas = [...new Set(here.map((p) => p.area).filter((a): a is string => !!a))]
      if (!areas.length) return town
      return here.some((p) => !p.area) ? `${town} (including ${listText(areas)})` : `${listText(areas)}, ${town}`
    }),
  )
}

/** The lowest and highest monthly fee for the subject across its tutors. */
export function feeRange(tutors: Tutor[], subjectId: string): { min: number; max: number } | null {
  const fees = tutors.map((t) => Number(rateOf(t, subjectId)?.price_nle)).filter((n) => n > 0)
  return fees.length ? { min: Math.min(...fees), max: Math.max(...fees) } : null
}

/** "about 7 hours" / "about 45 minutes" of reading. */
export function readingTime(minutes: number): string {
  if (minutes < 90) return `about ${Math.max(5, Math.round(minutes / 5) * 5)} minutes`
  return `about ${Math.round(minutes / 60)} hours`
}

/** The syllabus part with the most topics, when one stands out. */
function largest(page: SubjectTutorsPage): SyllabusPart | null {
  const sorted = [...page.parts].sort((a, b) => b.topics.length - a.topics.length)
  return sorted.length > 1 && sorted[0].topics.length > sorted[1].topics.length ? sorted[0] : null
}

/**
 * How the subject's practice questions spread over its topics, in words that
 * are true of the data: the same number on every topic, or the one topic
 * with clearly the most, or just how many topics have them.
 */
export function questionSpread(page: SubjectTutorsPage): string | null {
  const counts = page.parts.flatMap((p) => p.topics).filter((t) => t.questions > 0)
  if (!counts.length) return null
  const sorted = [...counts].sort((a, b) => b.questions - a.questions)
  if (sorted[0].questions === sorted.at(-1)!.questions) return `${sorted[0].questions} on each of its ${counts.length} topics`
  if (sorted[0].questions > sorted[1].questions) return `${sorted[0].questions} on ${sorted[0].name}, the most of any topic`
  return `across ${counts.length} topics`
}

/** The opening paragraph: who teaches the subject and where, or plainly that no one does yet. */
export function subjectTutorIntro(page: SubjectTutorsPage): string {
  const { subject, topicCount } = page.hub
  const first = page.parts[0]?.name
  const last = page.parts.at(-1)?.name
  const span = first && last && first !== last ? `, from ${first} to ${last}` : ''
  const n = page.tutors.length
  if (n === 0) {
    return `No tutor on WASSCE Tutor teaches ${subject.name} yet. Ask below, and we will look near you for one who knows its ${topicCount} topics${span}.`
  }
  const who = n === 1 ? `${displayName(page.tutors[0].full_name)} teaches` : `${n} tutors teach`
  const fees = feeRange(page.tutors, subject.id)
  const fee = fees ? (fees.min === fees.max ? ` for ${nle(fees.min)} a month` : `, from ${nle(fees.min)} to ${nle(fees.max)} a month`) : ''
  return `${who} WASSCE ${subject.name} here, in ${tutorPlaces(page.tutors)}${fee}. Lessons follow the ${topicCount}-topic syllabus${span}, in person at your home or near you.`
}

/**
 * Questions parents and students ask about this subject's tutors, answered
 * from the facts (the same list feeds the page and its FAQPage markup). A
 * question is only asked when there is a real answer to give.
 */
export function subjectTutorFaq(page: SubjectTutorsPage): [string, string][] {
  const { subject, topicCount } = page.hub
  const short = shortSubject(subject.name)
  const tutors = page.tutors
  const faq: [string, string][] = []

  faq.push([
    `What can a private ${short} tutor help with?`,
    `Any part of the WASSCE ${subject.name} syllabus, which has ${topicCount} topics in ${page.parts.length} ${page.parts.length === 1 ? 'part' : 'parts'}: ${listText(page.parts.map((p) => p.name))}.${largest(page) ? ` The longest is ${largest(page)!.name}, with ${largest(page)!.topics.length} topics.` : ''}`,
  ])

  if (tutors.length) {
    const fees = tutors
      .map((t) => {
        const r = rateOf(t, subject.id)
        return r ? `${displayName(t.full_name)} charges ${nle(Number(r.price_nle))} a month${r.lessons_per_week ? ` for ${lessonsText(r.lessons_per_week)}` : ''}` : null
      })
      .filter((s): s is string => !!s)
    faq.push([`How much does a ${short} tutor cost?`, `Each tutor sets their own ${short} fee: ${listText(fees)}.`])
    const towns = tutorTowns(tutors)
    faq.push([`Is there a ${short} tutor near me?`, `${subject.name} tutors here teach in ${tutorPlaces(tutors)}. Outside ${towns.length === 1 ? towns[0] : 'those towns'}, send the ${short} request form with your town.`])
    const groups = tutors.filter((t) => t.group_max && t.group_max > 1)
    if (groups.length) {
      const offers = groups.map(
        (t) => `${displayName(t.full_name)} takes groups of up to ${t.group_max}${t.group_discount_pct > 0 ? ` at ${t.group_discount_pct}% off each` : ''}`,
      )
      faq.push([`Can friends share ${short} lessons?`, `Yes: ${listText(offers)}.`])
    }
  } else {
    faq.push([
      `How much does a ${short} tutor cost?`,
      `The tutor we find for you names their ${short} fee before you agree to anything.`,
    ])
  }

  const practice = [
    `${page.hub.lessonCount} free ${subject.name} lessons (${readingTime(page.hub.minutes)} of reading)`,
    page.questionCount ? `${page.questionCount} practice questions with worked answers` : null,
    page.pastPapersUrl ? 'WAEC’s own past papers' : null,
    page.guide ? `our guide, ${page.guide.title}` : null,
  ].filter((s): s is string => !!s)
  faq.push([`How can a student practise ${short} between lessons?`, `With ${listText(practice)}.`])
  return faq
}

/** The subject's lessons page (/wassce/{subject}). */
export const subjectLessonsHref = (page: SubjectTutorsPage) => subjectPath(page.hub.subject.slug)
