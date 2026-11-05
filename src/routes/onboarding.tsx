import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { privateHead } from '@/lib/seo'
import { useEffect, useState } from 'react'
import { useFaculties, useFacultySubjects } from '@/lib/queries'
import { useSaveOnboarding } from '@/lib/mutations'
import { useAuth } from '@/lib/auth'
import { Briefcase, Check, FlaskConical, GraduationCap, Lock, Palette, Wrench } from 'lucide-react'
import { SubjectIcon } from '@/lib/subject-theme'
import { ProgressBar } from '@/components/ds/Progress'
import { PageHeader, Skeleton } from '@/components/ds/Primitives'

export const Route = createFileRoute('/onboarding')({
  head: privateHead('Get started'),
  component: Onboarding,
})

const MIN_SUBJECTS = 7
const MAX_SUBJECTS = 9

function Onboarding() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: faculties, isLoading } = useFaculties()
  const [facultyId, setFacultyId] = useState<string | null>(null)
  const { data: subjects, isLoading: subjectsLoading } = useFacultySubjects(facultyId)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const save = useSaveOnboarding()

  // When a faculty's subjects load, pre-select core + default-faculty subjects
  useEffect(() => {
    if (!subjects) return
    const initial = new Set<string>()
    for (const fs of subjects) {
      if (fs.role === 'core' || fs.is_default) initial.add(fs.subject_id)
    }
    setSelected(initial)
  }, [subjects])

  const toggle = (subjectId: string, role: string) => {
    if (role === 'core') return // locked
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(subjectId)) next.delete(subjectId)
      else {
        if (next.size >= MAX_SUBJECTS) return prev // cap
        next.add(subjectId)
      }
      return next
    })
  }

  const handleSave = async () => {
    if (!user || !facultyId) return
    await save.mutateAsync({
      profileId: user.id,
      facultyId,
      subjectIds: Array.from(selected),
    })
    navigate({ to: '/' })
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-20" />
        <div className="grid grid-cols-2 gap-3">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-28" />)}</div>
      </div>
    )
  }

  const count = selected.size
  const meetsRecommended = count >= MIN_SUBJECTS && count <= MAX_SUBJECTS
  const canContinue = count >= 2 && count <= MAX_SUBJECTS
  const FACULTY_ICONS: Record<string, typeof FlaskConical> = { science: FlaskConical, arts: Palette, commercial: Briefcase, technical: Wrench }

  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-32">
      <PageHeader eyebrow="Set up your studies" title="What are you sitting?" subtitle="Pick your faculty, then confirm your WASSCE subjects. You can change them any time." />

      {/* STEP 1: FACULTY */}
      <section className="space-y-3">
        <StepLabel n={1} label="Your faculty" />
        <div className="grid grid-cols-2 gap-3">
          {faculties?.map((f) => {
            const Icon = FACULTY_ICONS[f.slug] ?? GraduationCap
            const active = facultyId === f.id
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFacultyId(f.id)}
                className={`flex flex-col items-start gap-2 rounded-3xl bg-card p-4 text-left ring-1 transition ${active ? 'ring-2 ring-primary shadow-md shadow-primary/10' : 'ring-border hover:ring-primary/40'}`}
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${active ? 'bg-gradient-to-br from-blue-600 to-violet-600 text-white' : 'bg-primary/10 text-primary'}`}>
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="font-bold">{f.name}</span>
                {f.description && <span className="text-xs text-muted-foreground">{f.description}</span>}
              </button>
            )
          })}
        </div>
      </section>

      {/* STEP 2: SUBJECTS */}
      {facultyId && (
        <section className="space-y-3">
          <StepLabel n={2} label="Your subjects" />
          <div className="space-y-1.5 rounded-2xl bg-muted/50 p-3">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>{count} of {MAX_SUBJECTS} selected</span>
              <span className={meetsRecommended ? 'text-emerald-600' : 'text-amber-600'}>
                {meetsRecommended ? 'Looks good' : `WASSCE needs at least ${MIN_SUBJECTS}`}
              </span>
            </div>
            <ProgressBar value={count} max={MAX_SUBJECTS} fill={meetsRecommended ? 'bg-emerald-500' : 'bg-amber-500'} label="Subjects selected" />
          </div>

          {subjectsLoading ? (
            <div className="space-y-2">{[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14" />)}</div>
          ) : (
            <div className="space-y-2">
              {subjects?.map((fs) => {
                const isSelected = selected.has(fs.subject_id)
                const isCore = fs.role === 'core'
                return (
                  <button
                    key={fs.id}
                    type="button"
                    role="checkbox"
                    aria-checked={isSelected}
                    onClick={() => toggle(fs.subject_id, fs.role)}
                    disabled={isCore}
                    className={`flex w-full items-center gap-3 rounded-2xl bg-card px-3 py-3 text-left ring-1 transition ${isSelected ? 'ring-2 ring-primary' : 'ring-border hover:ring-primary/40'} ${isCore ? 'cursor-default' : ''}`}
                  >
                    <SubjectIcon slug={fs.subject.slug} size="sm" />
                    <span className="min-w-0 flex-1 font-semibold">{fs.subject.name}</span>
                    {isCore ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                        <Lock className="h-3 w-3" aria-hidden /> Required
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{fs.role === 'elective' ? 'Elective' : 'Main'}</span>
                    )}
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition ${isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30'}`}>
                      {isSelected && <Check className="h-4 w-4" aria-hidden />}
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {save.error && <p className="text-sm text-red-500">{String(save.error)}</p>}
        </section>
      )}

      {/* STICKY CONTINUE */}
      {facultyId && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 p-4 backdrop-blur" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}>
          <div className="mx-auto max-w-2xl">
            <button
              type="button"
              disabled={!canContinue || save.isPending}
              onClick={handleSave}
              className="h-12 w-full rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-base font-bold text-white shadow-md transition hover:shadow-lg disabled:opacity-50"
            >
              {save.isPending ? 'Saving…' : `Continue with ${count} subject${count === 1 ? '' : 's'}`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function StepLabel({ n, label }: { n: number; label: string }) {
  return (
    <p className="flex items-center gap-2 text-sm font-bold">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">{n}</span>
      {label}
    </p>
  )
}
