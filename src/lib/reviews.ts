// Google reviews of WASSCE Tutor: the links to the Business Profile, and the
// reviews shown on the homepage (src/components/landing/Reviews.tsx).
//
// GOOGLE_REVIEWS holds real reviews only, copied word for word from the
// Business Profile: never written, edited or improved here. Use the name as
// Google shows it, or first name and last initial if the reviewer prefers.
// Add the newest first. While the list is empty, the homepage shows an
// invitation to review instead of quotes.
//
// No Review or AggregateRating structured data: Google ignores star markup a
// business puts on its own site about itself, and may penalise it.

/** Opens Google's "write a review" box for WASSCE Tutor. */
export const GOOGLE_REVIEW_URL = 'https://g.page/r/CULCzMInXfK4EBM/review'
/** Every review on the profile. */
export const GOOGLE_REVIEWS_URL = 'https://search.google.com/local/reviews?placeid=ChIJzRCn0tfDBA8RQsLMwidd8rg'
/** The Business Profile on Google Maps (for the business schema's sameAs). */
export const GOOGLE_MAPS_URL = 'https://maps.google.com/?cid=13326816672696025666'

export type GoogleReview = {
  name: string
  rating: 1 | 2 | 3 | 4 | 5
  /** When it was posted, as YYYY-MM. */
  date: string
  text: string
}

export const GOOGLE_REVIEWS: GoogleReview[] = []
