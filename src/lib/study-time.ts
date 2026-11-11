/** "1 h 31 min", "45 min": study time as people say it. */
export function studyTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h} h` : `${h} h ${m} min`
}

/**
 * Size for the buttons in a CourseHero (add to .site-btn): on phones they share
 * the row when both fit and otherwise stack at full width (a long label may
 * wrap); from tablet width they are the standard size.
 */
export const HERO_BTN = 'flex-1 px-4 max-sm:whitespace-normal sm:flex-none sm:px-[1.4rem]'
