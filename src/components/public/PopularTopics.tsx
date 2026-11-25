// "Popular WASSCE topics": links to the topics and lessons people search for
// most, by the words they search with (src/content/popular-topics.ts has the
// list and why). On the homepage and /wassce. Plain links in the prerendered
// HTML, grouped by subject.
import { POPULAR_TOPICS } from '@/content/popular-topics'
import { SubjectIcon } from '@/components/SubjectIcon'
import { subjectTheme } from '@/lib/subject-theme'

/** The groups and their links; the heading is the page's (it differs between the homepage and /wassce). */
export function PopularTopicLinks({ className = '' }: { className?: string }) {
  return (
    <ul className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {POPULAR_TOPICS.map((g) => {
        const { palette } = subjectTheme(g.slug)
        return (
          <li key={g.slug} className="site-card p-5">
            <p className={`flex items-center gap-2 text-sm font-bold ${palette.text}`}>
              <SubjectIcon slug={g.slug} size="sm" /> {g.subject}
            </p>
            <ul className="mt-3 space-y-2">
              {g.links.map((l) => (
                <li key={l.path}>
                  <a href={l.path} className="font-semibold leading-snug text-foreground hover:text-primary hover:underline">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        )
      })}
    </ul>
  )
}
