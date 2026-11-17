// Where a lesson's definition boxes link to: the topic's key terms (the cards
// made from those boxes, src/lib/key-terms.ts). Provided by the page showing
// the lesson; without it (admin previews, topics with too few terms) the boxes
// show no link.
import { createContext } from 'react'

export const KeyTermsLink = createContext<string | null>(null)
