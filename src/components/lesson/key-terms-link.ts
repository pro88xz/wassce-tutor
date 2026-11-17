// Where a lesson's definition boxes link to: the topic's key terms (the cards
// made from those boxes, src/lib/key-terms.ts). Provided by the page showing
// the lesson; without it (admin previews, topics with too few terms) the boxes
// show no link. In the app, `go` navigates without reloading the page.
import { createContext } from 'react'

export type KeyTermsTarget = { href: string; go?: () => void }

export const KeyTermsLink = createContext<KeyTermsTarget | null>(null)
