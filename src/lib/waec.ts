// Official WAEC past papers. WAEC's e-Learning portal publishes past WASSCE
// papers for each subject, with the Chief Examiner's comments on how
// candidates answered. Each page below was checked to load and list papers.

const BASE = 'https://waeconline.org.ng/e-learning/'

const PAGES: Record<string, string> = {
  mathematics: 'Mathematics/mathsmain.html',
  'further-mathematics': 'Further/Furthmain.html',
  'english-language': 'English/Englmain.html',
  'literature-in-english': 'Literature/litEmain.html',
  physics: 'Physics/physmain.html',
  chemistry: 'Chemistry/chemmain.html',
  biology: 'Biology/Biomain.html',
  'agricultural-science': 'Agriculture/Agricmain.html',
  geography: 'Geography/Geomain.html',
  government: 'Government/Govtmain.html',
  history: 'History/histmain.html',
  economics: 'Economics/econsmain.html',
  commerce: 'Commerce/Commmain.html',
  'financial-accounting': 'Financial/FAmain.html',
  'building-construction': 'Building/Buildmain.html',
  'technical-drawing': 'Technical/TDmain.html',
  'ict-computer-studies': 'Computer/Compmain.html',
}

/** The WAEC e-Learning page for a subject, or null if WAEC has none. */
export function waecPastPapersUrl(subjectSlug: string | undefined | null): string | null {
  const page = subjectSlug ? PAGES[subjectSlug] : undefined
  return page ? BASE + page : null
}
