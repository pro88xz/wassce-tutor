import { Link, useRouterState } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth'

const SHOW_ON = ['/', '/about', '/privacy', '/terms']

export function Footer() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const { user } = useAuth()
  if (user) return null
  if (!SHOW_ON.includes(pathname)) return null

  return (
    <footer className="border-t mt-16 py-10 text-sm text-muted-foreground">
      <div className="mx-auto max-w-3xl space-y-6 px-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="space-y-3 col-span-2 sm:col-span-1">
            <p className="font-bold text-foreground">WASSCE Tutor</p>
            <p className="text-xs">
              WASSCE practice built in Sierra Leone, for Sierra Leonean students.
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-foreground text-xs uppercase tracking-wide">Product</p>
            <Link to="/" className="block hover:text-foreground transition">Home</Link>
            <Link to="/auth" className="block hover:text-foreground transition">Sign in</Link>
            <Link to="/about" className="block hover:text-foreground transition">About</Link>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-foreground text-xs uppercase tracking-wide">Legal</p>
            <Link to="/privacy" className="block hover:text-foreground transition">Privacy</Link>
            <Link to="/terms" className="block hover:text-foreground transition">Terms</Link>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-foreground text-xs uppercase tracking-wide">Contact</p>
            <a href="mailto:secretsafe.cc@gmail.com" className="block hover:text-foreground transition">Contact us</a>
          </div>
        </div>

        <div className="border-t pt-6 flex flex-col sm:flex-row justify-between gap-2 text-xs">
          <p>&copy; {new Date().getFullYear()} WASSCE Tutor. Made in Freetown, Sierra Leone.</p>
          <p>Pass WASSCE with confidence.</p>
        </div>
      </div>
    </footer>
  )
}
