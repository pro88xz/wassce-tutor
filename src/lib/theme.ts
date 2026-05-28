// Light / sepia (reading) theme toggle, persisted to localStorage.
const KEY = 'wassce_theme'

export type Theme = 'light' | 'sepia'

export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  return (localStorage.getItem(KEY) as Theme) || 'light'
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'sepia') root.classList.add('dark')
  else root.classList.remove('dark')
  localStorage.setItem(KEY, theme)
}

export function toggleTheme(): Theme {
  const next: Theme = getTheme() === 'light' ? 'sepia' : 'light'
  applyTheme(next)
  return next
}
