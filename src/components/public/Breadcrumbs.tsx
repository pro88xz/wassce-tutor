// Visible breadcrumb trail for public pages. Pass the same [name, path] trail
// to breadcrumbJsonLd() in the route's head so the markup matches what's shown.
// tone="dark" is for a trail on a dark band (the topic page header).
export function Breadcrumbs({ trail, tone = 'light' }: { trail: [name: string, path: string][]; tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark'
  return (
    <nav aria-label="Breadcrumb" className={`text-xs ${dark ? 'text-white/60' : 'text-muted-foreground'}`}>
      <ol className="flex flex-wrap items-center gap-1">
        {trail.map(([name, path], i) => {
          const last = i === trail.length - 1
          return (
            <li key={path} className="flex items-center gap-1">
              {last ? (
                <span aria-current="page" className={dark ? 'text-white/90' : 'text-foreground'}>{name}</span>
              ) : (
                <>
                  <a href={path} className={`hover:underline ${dark ? 'hover:text-white' : 'hover:text-foreground'}`}>{name}</a>
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
