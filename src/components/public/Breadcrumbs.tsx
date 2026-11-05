// Visible breadcrumb trail for public pages. Pass the same [name, path] trail
// to breadcrumbJsonLd() in the route's head so the markup matches what's shown.
export function Breadcrumbs({ trail }: { trail: [name: string, path: string][] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1">
        {trail.map(([name, path], i) => {
          const last = i === trail.length - 1
          return (
            <li key={path} className="flex items-center gap-1">
              {last ? (
                <span aria-current="page" className="text-foreground">{name}</span>
              ) : (
                <>
                  <a href={path} className="hover:text-foreground hover:underline">{name}</a>
                  <span aria-hidden>›</span>
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
