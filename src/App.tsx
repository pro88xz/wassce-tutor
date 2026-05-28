import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">WASSCE TUTOR</h1>
        <p className="text-muted-foreground">Foundation stack online.</p>
        <div className="flex gap-3 justify-center">
          <Button>Get Started</Button>
          <Button variant="outline">Learn More</Button>
        </div>
      </div>
    </div>
  )
}

export default App
