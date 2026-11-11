// Three questions from the practice bank (src/content/question-sets), for the
// "try a question" section on the homepage. Each is copied from the bank by
// its key: the stem, the options, the answer and the reason every wrong
// option is wrong are the bank's own. Only the working is restated in plain
// text, because the homepage does not load the maths typesetter.
//
// If a question changes in the bank, change it here too (or pick another).

export type SampleOption = {
  label: 'A' | 'B' | 'C' | 'D'
  text: string
  /** Why this option is wrong. Absent on the correct option. */
  why?: string
}

export type SampleQuestion = {
  /** The question's key in the bank */
  key: string
  subject: string
  topic: string
  /** An instruction shown above the question, where the bank has one */
  instruction?: string
  stem: string
  options: SampleOption[]
  answer: SampleOption['label']
  working: string
}

export const SAMPLE_QUESTIONS: SampleQuestion[] = [
  {
    key: 'maths-percentages-01',
    subject: 'Mathematics',
    topic: 'Percentages',
    stem: 'Mrs Kamara bought a bag of rice for Le 640 and sold it for Le 720. Find her percentage profit.',
    options: [
      { label: 'A', text: '11.1%', why: 'You divided the profit by the selling price. Percentage profit is worked out on the cost price.' },
      { label: 'B', text: '12.5%' },
      { label: 'C', text: '80%', why: 'Le 80 is the profit in Leones. Write it as a percentage of the cost price.' },
      { label: 'D', text: '112.5%', why: 'That is the selling price as a percentage of the cost price. Take away 100% to get the profit.' },
    ],
    answer: 'B',
    working: 'Profit = 720 − 640 = Le 80. Percentage profit = profit ÷ cost price × 100% = 80 ÷ 640 × 100% = 12.5%.',
  },
  {
    key: 'eng-prep-03',
    subject: 'English Language',
    topic: 'Prepositions',
    instruction: 'Choose the option that best completes the sentence.',
    stem: 'Aminata is very good ____ Mathematics.',
    options: [
      { label: 'A', text: 'in', why: 'In standard English, “good” takes “at” for a skill or subject: good at Mathematics.' },
      { label: 'B', text: 'at' },
      { label: 'C', text: 'on', why: '“Good on” is not used for skill in a subject.' },
      { label: 'D', text: 'with', why: '“Good with” is used for handling people or things (good with children), not for a subject.' },
    ],
    answer: 'B',
    working: '“Good at”, “bad at” and “clever at” describe skill in something: good at Mathematics.',
  },
  {
    key: 'maths-ratio-05',
    subject: 'Mathematics',
    topic: 'Ratio, Proportion and Rates',
    stem: 'If 6 exercise books cost Le 45, how much do 10 of the same books cost?',
    options: [
      { label: 'A', text: 'Le 27', why: 'You used inverse proportion. More books cost more: this is direct proportion.' },
      { label: 'B', text: 'Le 49', why: 'You added 4 Leones for the 4 extra books. Find the cost of one book first.' },
      { label: 'C', text: 'Le 75' },
      { label: 'D', text: 'Le 450', why: 'You multiplied Le 45 by 10. Le 45 is the price of 6 books, not one.' },
    ],
    answer: 'C',
    working: 'One book costs 45 ÷ 6 = Le 7.50. So 10 books cost 10 × 7.50 = Le 75.',
  },
]
