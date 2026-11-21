import { useEffect, useState } from 'react'

/**
 * The current time (ms since the epoch), read when the component mounts and
 * then every `everyMs`, for anything shown relative to now ("in the last
 * hour"). Reading the clock during render instead gives a different answer on
 * every re-render.
 */
export function useNow(everyMs: number): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), everyMs)
    return () => window.clearInterval(id)
  }, [everyMs])
  return now
}
