import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b px-6 py-4 flex gap-4">
        <Link to="/" className="font-bold [&.active]:text-primary">
          Home
        </Link>
        <Link to="/about" className="[&.active]:text-primary">
          About
        </Link>
      </nav>
      <main className="p-6">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </div>
  )
}
