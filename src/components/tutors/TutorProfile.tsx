// A tutor's own page, /tutors/{slug}: who they are, what they teach and for
// how much, the lessons they reviewed for WASSCE Tutor (when they are a
// verified reviewer), and booking. Prerendered for search engines from the
// same data (src/lib/tutor-profile.ts).
import { useEffect } from 'react'
import { ArrowRight, BookOpenCheck, Check, GraduationCap, MapPin, ShieldCheck, Star, Users, Wallet } from 'lucide-react'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import { TutorCard, VerifiedBadge, useTutorBooking, type Tutor } from '@/components/tutors/Marketplace'
import { displayName, firstNameOf, tutorPhoto, type ReviewedLesson } from '@/lib/tutor-profile'
import { lessonsText, nle, paymentText } from '@/lib/tutor-pricing'
import { subjectPath, tutorsPath } from '@/lib/public-rules'

export function TutorProfile({ tutor, reviewed, others, trail }: { tutor: Tutor; reviewed: ReviewedLesson[]; others: Tutor[]; trail: [string, string][] }) {
  const { book, reopen, dialog } = useTutorBooking()
  // Back from signing in to book this tutor: open the booking.
  useEffect(() => {
    reopen([tutor])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutor.id])

  const name = displayName(tutor.full_name)
  const first = firstNameOf(tutor.full_name)
  const photo = tutorPhoto(tutor)
  const rates = [...tutor.tutor_subjects].sort((a, b) => (a.subject?.name ?? '').localeCompare(b.subject?.name ?? ''))
  const fees = rates.map((r) => Number(r.price_nle)).filter((n) => n > 0)
  const from = fees.length ? Math.min(...fees) : null
  const reviews = tutor.tutor_booking_reviews ?? []
  const rating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null
  const subjects = rates.map((r) => r.subject?.name).filter((n): n is string => !!n)
  const payments = paymentText(tutor.payment_methods ?? [])
  const bio = tutor.bio.split(/\n{2,}|\r\n\r\n/).map((p) => p.trim()).filter(Boolean)

  const facts: { Icon: typeof MapPin; label: string; value: string }[] = [
    { Icon: MapPin, label: 'Teaches in', value: tutor.location },
    { Icon: GraduationCap, label: 'Experience', value: tutor.experience_years === 0 ? 'New tutor' : `${tutor.experience_years} ${tutor.experience_years === 1 ? 'year' : 'years'}` },
    rating !== null
      ? { Icon: Star, label: 'Rating', value: `${rating.toFixed(1)} from ${reviews.length} ${reviews.length === 1 ? 'student' : 'students'}` }
      : { Icon: Users, label: 'Lessons', value: 'In person, at home or nearby' },
  ]

  return (
    <div className="site-bleed -mb-12 -mt-6">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[var(--site-ink)] text-white" aria-labelledby="tutor-name">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(56rem_30rem_at_100%_0%,rgba(124,92,255,.42),transparent_68%),radial-gradient(36rem_24rem_at_0%_110%,rgba(255,209,102,.14),transparent_70%)]" />
        <div className="site-container pb-14 pt-6 sm:pb-16 lg:pb-20">
          <Breadcrumbs trail={trail} tone="dark" />
          <div className="mt-8 grid grid-cols-[minmax(0,1fr)] items-center gap-9 sm:mt-10 md:grid-cols-[17rem_minmax(0,1fr)] lg:grid-cols-[21rem_minmax(0,1fr)] lg:gap-14">
            <div className="relative mx-auto w-full max-w-[19rem] md:mx-0">
              {photo ? (
                <img
                  src={photo}
                  alt={`${name}, private WASSCE tutor in ${tutor.location}`}
                  width={640}
                  height={800}
                  fetchPriority="high"
                  className="aspect-[4/5] w-full rounded-[1.75rem] object-cover object-top shadow-[0_40px_80px_-40px_rgba(0,0,0,.85)] ring-1 ring-white/15"
                />
              ) : (
                <span className="flex aspect-[4/5] w-full items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-[#7c5cff] to-[#3b1f9e] text-7xl font-extrabold ring-1 ring-white/15" aria-hidden>
                  {name.split(' ').slice(0, 2).map((p) => p[0]).join('')}
                </span>
              )}
              {tutor.reviewer && (
                <span className="absolute -bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-3.5 py-2 text-[12.5px] font-bold text-slate-900 shadow-[0_18px_36px_-16px_rgba(0,0,0,.6)]">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden /> Verified lesson reviewer
                </span>
              )}
            </div>

            <div className="min-w-0">
              <p className="inline-flex items-center gap-2.5 rounded-full bg-white/10 py-1.5 pl-2.5 pr-3.5 text-[13px] font-semibold text-white/85 ring-1 ring-white/15">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,.2)]" aria-hidden />
                Private tutor · in person
              </p>
              <h1 id="tutor-name" className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[2.4rem] font-extrabold leading-[1.04] tracking-[-0.04em] sm:text-[3.4rem]">
                {name}
                <VerifiedBadge className="h-8 w-8 sm:h-9 sm:w-9" />
              </h1>
              <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-white/75 sm:text-lg">
                Private WASSCE <span className="site-accent text-[1.15em] text-[#cdbcff]">{subjects.slice(0, 3).join(', ')}{subjects.length > 3 ? ' and more' : ''}</span> tutor in {tutor.location}.
              </p>
              <dl className="mt-7 grid max-w-2xl grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-3">
                {facts.map(({ Icon, label, value }) => (
                  <div key={label} className="rounded-2xl bg-white/[.07] px-4 py-3 ring-1 ring-white/10">
                    <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[.14em] text-white/55">
                      <Icon className="h-3.5 w-3.5" aria-hidden /> {label}
                    </dt>
                    <dd className="mt-1 text-[15px] font-semibold leading-snug">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <button type="button" onClick={() => book(tutor)} className="site-btn site-btn-premium">
                  Book {first}
                  <span className="site-btn-premium-badge" aria-hidden>
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </button>
                {from !== null && (
                  <p className="text-[15px] text-white/75">
                    from <span className="text-xl font-extrabold text-white">{nle(from)}</span> a month
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="site-container grid grid-cols-[minmax(0,1fr)] gap-12 py-14 sm:py-16 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-14">
        <div className="min-w-0 space-y-14">
          <section aria-labelledby="about-heading">
            <p className="site-eyebrow">About</p>
            <h2 id="about-heading" className="site-h2 mt-3">
              Learn with <span className="site-accent text-[var(--primary)]">{first}.</span>
            </h2>
            <div className="mt-6 max-w-2xl space-y-4 text-[17px] leading-relaxed text-foreground/85">
              {bio.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-7 flex max-w-2xl items-start gap-3 rounded-2xl border border-border bg-[var(--card)] p-5">
              <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]" aria-hidden />
              <div>
                <p className="text-[13px] font-bold uppercase tracking-[.12em] text-muted-foreground">Qualifications</p>
                <p className="mt-1 text-[16px] font-semibold leading-snug">{tutor.qualifications}</p>
              </div>
            </div>
          </section>

          <section id="fees" className="scroll-mt-24" aria-labelledby="fees-heading">
            <p className="site-eyebrow">Subjects and fees</p>
            <h2 id="fees-heading" className="site-h2 mt-3">
              What {first} <span className="site-accent text-[var(--primary)]">teaches.</span>
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              Each fee is for a month of in-person lessons. Take several subjects and the fees add up{tutor.multi_subject_discount_pct > 0 ? `, with ${tutor.multi_subject_discount_pct}% off for two or more` : ''}. You see the total before WhatsApp opens.
            </p>
            <ul className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-[var(--card)]">
              {rates.map((r) => (
                <li key={r.subject_id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-4">
                  <span className="min-w-0">
                    <span className="block text-[16px] font-bold">{r.subject?.name}</span>
                    <span className="block text-[13px] text-muted-foreground">
                      {r.lessons_per_week ? lessonsText(r.lessons_per_week) : 'Lessons a week agreed with you'}
                      {r.subject?.slug && (
                        <>
                          {' · '}
                          <a href={subjectPath(r.subject.slug)} className="font-medium text-[var(--primary)] hover:underline">
                            the syllabus
                          </a>
                        </>
                      )}
                    </span>
                  </span>
                  <span className="text-[17px] font-extrabold tabular-nums">
                    {nle(Number(r.price_nle))}
                    <span className="text-[13px] font-medium text-muted-foreground"> / month</span>
                  </span>
                </li>
              ))}
            </ul>
            {(tutor.group_max || payments) && (
              <ul className="mt-4 flex flex-wrap gap-2 text-[13px] font-semibold">
                {tutor.group_max && (
                  <li className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1.5 text-sky-800 dark:bg-sky-500/15 dark:text-sky-200">
                    <Users className="h-4 w-4" aria-hidden /> Small groups up to {tutor.group_max}
                    {tutor.group_discount_pct > 0 && `, ${tutor.group_discount_pct}% off each`}
                  </li>
                )}
                {payments && (
                  <li className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-foreground">
                    <Wallet className="h-4 w-4" aria-hidden /> Pay by {payments}
                  </li>
                )}
              </ul>
            )}
          </section>

          {tutor.reviewer && (
            <section aria-labelledby="reviewed-heading">
              <p className="site-eyebrow inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" aria-hidden /> Verified lesson reviewer
              </p>
              <h2 id="reviewed-heading" className="site-h2 mt-3">
                Lessons {first} <span className="site-accent text-[var(--primary)]">checked.</span>
              </h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                {first} reviews WASSCE Tutor lessons in the subjects they teach. Every lesson below was read and approved by {first}; it carries their name.
              </p>
              {reviewed.length > 0 ? (
                <ul className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
                  {reviewed.slice(0, 12).map((l) => (
                    <li key={l.href}>
                      <a href={l.href} className="group flex h-full items-start gap-3 rounded-2xl border border-border bg-[var(--card)] p-4 transition hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--primary)_40%,var(--border))]">
                        <BookOpenCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
                        <span className="min-w-0">
                          <span className="block text-[15px] font-bold leading-snug group-hover:text-[var(--primary)]">{l.title}</span>
                          <span className="mt-0.5 block text-[13px] text-muted-foreground">
                            {l.subject} · {l.topic}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 rounded-2xl border border-dashed border-border p-5 text-[15px] text-muted-foreground">
                  {first}’s first reviewed lessons will appear here.
                </p>
              )}
            </section>
          )}

          <section aria-labelledby="booking-heading">
            <p className="site-eyebrow">Booking</p>
            <h2 id="booking-heading" className="site-h2 mt-3">
              Three steps to your <span className="site-accent text-[var(--primary)]">first lesson.</span>
            </h2>
            <ol className="mt-7 grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-3">
              {[
                ['Choose your subjects', `Tap Book ${first}, pick your subjects and who is learning.`],
                ['Agree to the fee', 'See the monthly price with any discount. Continue only if it works for you.'],
                ['Message on WhatsApp', `WhatsApp opens with your message to ${first}. Agree the days, times and place.`],
              ].map(([title, body], i) => (
                <li key={title} className="rounded-2xl border border-border bg-[var(--card)] p-5">
                  <span className="font-serif-display text-3xl leading-none text-[var(--primary)]">{i + 1}</span>
                  <h3 className="mt-3 text-[17px] font-bold">{title}</h3>
                  <p className="mt-1 text-[14.5px] leading-relaxed text-muted-foreground">{body}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* The booking card stays in view on computers. */}
        <aside className="h-fit lg:sticky lg:top-24" aria-label={`Book ${name}`}>
          <div className="site-card overflow-hidden">
            <div className="flex items-center gap-3 border-b border-border p-5">
              {photo ? (
                <img src={photo} alt="" className="h-14 w-14 rounded-2xl object-cover object-top" loading="lazy" />
              ) : (
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand-soft)] text-lg font-bold text-[var(--primary)]" aria-hidden>
                  {name[0]}
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate font-bold">{name}</p>
                <p className="truncate text-[13px] text-muted-foreground">{tutor.location}</p>
              </div>
            </div>
            <div className="p-5">
              {from !== null && (
                <p className="text-[14px] text-muted-foreground">
                  from <span className="text-2xl font-extrabold tabular-nums text-foreground">{nle(from)}</span> a month
                </p>
              )}
              <button type="button" onClick={() => book(tutor)} className="site-btn site-btn-lg site-btn-primary mt-4 w-full">
                Book {first} <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
              <ul className="mt-5 space-y-2.5 text-[14px]">
                {['Fee shown before you message', `Lessons in person in ${tutor.location}`, `You pay ${first} directly`, 'Free to contact'].map((t) => (
                  <li key={t} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <a href={tutorsPath()} className="mt-4 block text-center text-[14px] font-semibold text-[var(--primary)] hover:underline">
            See every private tutor
          </a>
        </aside>
      </div>

      {others.length > 0 && (
        <section className="site-container pb-20" aria-labelledby="others-heading">
          <h2 id="others-heading" className="site-h2">
            More private <span className="site-accent text-[var(--primary)]">tutors.</span>
          </h2>
          <ul className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {others.map((t) => (
              <li key={t.id}>
                <TutorCard tutor={t} onBook={() => book(t)} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {dialog}
    </div>
  )
}
