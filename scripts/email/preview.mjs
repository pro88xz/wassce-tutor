// Writes every engine email, with sample data, as HTML and text files for review.
//   npm run email:preview -- <output folder>
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { CONTACT } from '../../api/_lib/email/config.js'
import { renderEmail } from '../../api/_lib/email/layout.js'
import { SAMPLES, TEMPLATES } from '../../api/_lib/email/templates.js'

const out = resolve(process.argv[2] ?? 'email-preview')
mkdirSync(out, { recursive: true })
const site = process.env.PREVIEW_SITE ?? 'https://wasscetutor.com'
const stats = { subjects: 18, lessons: 673, questions: 1568 } // example figures; real sends read the database

const index = []
for (const [key, template] of Object.entries(TEMPLATES)) {
  const content = template(SAMPLES[key], { stats })
  const { html, text } = renderEmail(content, {
    site,
    contact: CONTACT,
    url: () => `${site}/subjects`,
    displayUrl: () => 'wasscetutor.com/subjects',
    unsubscribeUrl: `${site}/api/email/unsubscribe?t=preview`,
    preferencesUrl: `${site}/account`,
  })
  writeFileSync(join(out, `${key}.html`), html)
  writeFileSync(join(out, `${key}.txt`), `Subject: ${content.subject}\nPreheader: ${content.preheader}\n\n${text}\n`)
  index.push(`<li><a href="${key}.html">${key}</a>: ${content.subject}</li>`)
}
writeFileSync(join(out, 'index.html'), `<!doctype html><meta charset="utf-8"><h1>WASSCE Tutor emails</h1><ul>${index.join('')}</ul>`)
console.log(`Wrote ${index.length} emails to ${out}`)
