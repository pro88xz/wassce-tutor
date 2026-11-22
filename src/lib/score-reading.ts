// The one-line reading of a practice score, shown under the score ring.

/** How a score reads, for the line under it. */
export function scoreReading(score: number, total: number): { title: string; body: string } {
  const p = total ? Math.round((score / total) * 100) : 0
  if (score === total) return { title: 'Every answer correct', body: 'You have a firm grip on this topic. Move on, and come back to it before the exam.' }
  if (p >= 70) return { title: 'A strong result', body: 'Read the working for the questions you missed, so the same mistake does not cost marks in the exam.' }
  if (p >= 50) return { title: 'A solid base to build on', body: 'Go through the working for each miss, then try the questions again.' }
  return { title: 'This topic needs more work', body: 'That is what practice is for. Revise the lessons, read the working, then try again.' }
}
