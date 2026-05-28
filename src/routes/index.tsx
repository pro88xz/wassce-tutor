import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">WASSCE TUTOR</h1>
      <p className="text-muted-foreground">Routing is live.</p>
      <Button>Get Started</Button>
    </div>
  )
}
