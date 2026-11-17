// Five questions from the practice bank (src/content/question-sets), shaded on
// the answer sheet in the homepage hero. Each is copied from the bank by its
// key: the stem, the options and the answer are the bank's own. The working
// is the bank's explanation, restated in plain text where it uses maths
// notation, because the homepage does not load the maths typesetter.
//
// If a question changes in the bank, change it here too (or pick another).
// Keep stems short: each must fit one line of the sheet on a phone.

export type SheetQuestion = {
  /** The question's key in the bank */
  key: string
  subject: string
  stem: string
  options: [string, string, string, string]
  answer: 'A' | 'B' | 'C' | 'D'
  working: string
}

export const ANSWER_SHEET: SheetQuestion[] = [
  {
    key: 'chem-in-05',
    subject: 'Chemistry',
    stem: 'Which of the following is a physical change?',
    options: ['Rusting of an iron roof', 'Burning of charcoal', 'Souring of palm wine', 'Melting of candle wax'],
    answer: 'D',
    working: 'In a physical change no new substance is formed and the change is easily reversed: liquid wax solidifies again on cooling.',
  },
  {
    key: 'bio-cs-01',
    subject: 'Biology',
    stem: 'Which structure is found in a plant cell but NOT in an animal cell?',
    options: ['Cell membrane', 'Cell wall', 'Nucleus', 'Mitochondrion'],
    answer: 'B',
    working: 'Plant cells have a cellulose cell wall, chloroplasts and a large permanent vacuole; animal cells have none of these.',
  },
  {
    key: 'maths-bearings-03',
    subject: 'Mathematics',
    stem: 'Amadu walks 5 km due east and then 12 km due north. How far is he from his starting point?',
    options: ['7 km', '10.9 km', '13 km', '17 km'],
    answer: 'C',
    working: 'East and north are at right angles, so by Pythagoras the distance is √(5² + 12²) = √169 = 13 km.',
  },
  {
    key: 'gov-ss-01',
    subject: 'Government',
    stem: 'Which of the following is NOT an essential feature of a state?',
    options: ['A defined territory', 'A single ethnic group', 'A population', 'Sovereignty'],
    answer: 'B',
    working: 'A state needs population, territory, government and sovereignty; many states contain several ethnic groups.',
  },
  {
    key: 'phy-units-04',
    subject: 'Physics',
    stem: 'Express a speed of 90 km h⁻¹ in m s⁻¹.',
    options: ['2.5 m s⁻¹', '25 m s⁻¹', '324 m s⁻¹', '90000 m s⁻¹'],
    answer: 'B',
    // Written with slashes here: the margin's handwriting face has no superscript minus.
    working: '90 km/h = (90 × 1000 m) ÷ (3600 s) = 25 m/s: divide by 3.6.',
  },
]
