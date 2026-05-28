import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useFaculties, useFacultySubjects } from '@/lib/queries'
import { useSaveOnboarding } from '@/lib/mutations'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/onboarding')({
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

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>

  const count = selected.size
  const meetsRecommended = count >= MIN_SUBJECTS && count <= MAX_SUBJECTS
  const canContinue = count >= 2 && count <= MAX_SUBJECTS

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Set up your studies</h1>
        <p className="text-sm text-muted-foreground">
          Pick your faculty, then confirm your subjects.
        </p>
      </div>

      {/* FACULTY PICKER */}
      <div className="grid grid-cols-2 gap-3">
        {faculties?.map((f) => (
          <button
            key={f.id}
            onClick={() => setFacultyId(f.id)}
            className={`text-left rounded-lg border p-4 transition ${
              facultyId === f.id
                ? 'border-primary bg-primary/5'
                : 'hover:border-muted-foreground/40'
            }`}
          >
            <div className="font-semibold">{f.name}</div>
            <div className="text-xs text-muted-foreground mt-1">{f.description}</div>
          </button>
        ))}
      </div>

      {/* SUBJECT SELECTION */}
      {facultyId && (
        <div className="space-y-3 border-t pt-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Your subjects</h2>
            <span
              className={`text-sm ${meetsRecommended ? 'text-emerald-500' : 'text-amber-500'}`}
            >
              {count} of {MAX_SUBJECTS} selected
            </span>
          </div>

          {subjectsLoading ? (
            <p className="text-sm text-muted-foreground">Loading subjects...</p>
          ) : (
            <div className="space-y-2">
              {subjects?.map((fs) => {
                const isSelected = selected.has(fs.subject_id)
                const isCore = fs.role === 'core'
                return (
                  <button
                    key={fs.id}
                    onClick={() => toggle(fs.subject_id, fs.role)}
                    disabled={isCore}
                    className={`w-full flex items-center justify-between rounded-md border px-3 py-2.5 text-left text-sm transition ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-muted-foreground/40'
                    } ${isCore ? 'opacity-90 cursor-default' : ''}`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`inline-flex h-4 w-4 items-center justify-center rounded border text-[10px] ${
                          isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/40'
                        }`}
                      >
                        {isSelected ? '✓' : ''}
                      </span>
                      {fs.subject.name}
                    </span>
                    <span className="text-[10px] uppercase text-muted-foreground">
                      {isCore ? 'required' : fs.role}
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {count > 0 && count < MIN_SUBJECTS && (
            <p className="text-xs text-amber-500">
              WASSCE requires at least {MIN_SUBJECTS} subjects — you've selected {count}. You can add more anytime.
            </p>
          )}
          {save.error && (
            <p className="text-sm text-red-500">{String(save.error)}</p>
          )}
        </div>
      )}

      {/* STICKY CONTINUE */}
      {facultyId && (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4">
          <div className="max-w-2xl mx-auto">
            <Button
              className="w-full"
              disabled={!canContinue || save.isPending}
              onClick={handleSave}
            >
              {save.isPending ? 'Saving...' : `Continue with ${count} subjects`}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
