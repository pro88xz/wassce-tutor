import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const [status, setStatus] = useState('Checking connection...')

  useEffect(() => {
    supabase.auth.getSession().then(({ error }) => {
      if (error) setStatus(`Error: ${error.message}`)
      else setStatus('✅ Connected to Supabase')
    })
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">WASSCE TUTOR</h1>
      <p className="text-muted-foreground">{status}</p>
      <Button>Get Started</Button>
    </div>
  )
}
