// Exam guides for the blog: results, and how to prepare for the core papers.
// Every factual claim about WAEC's process or papers comes from the sources
// listed on the post. Where a detail could not be confirmed from an official
// source (prices, payment channels), the post says so instead of guessing.
import type { BlogPost } from './editorial'

const PEXELS = { imageSourceLabel: 'Pexels', imageRights: 'Used under the Pexels License.' }

export const GUIDE_POSTS: BlogPost[] = [
  {
    slug: 'how-to-check-wassce-result-sierra-leone',
    seoTitle: 'How to Check Your WASSCE Result Online in Sierra Leone | WASSCE Tutor',
    title: 'How to Check Your WASSCE Result Online in Sierra Leone, Step by Step',
    description: 'What you need, the seven steps on WAEC’s official Sierra Leone result checker, how many times one e-PIN works, and how to avoid result scams.',
    category: 'WASSCE results',
    publishedAt: '2026-11-16',
    updatedAt: '2026-11-16',
    readMinutes: 6,
    image: '/img/blog/check-wassce-result.webp',
    imageAlt: 'Secondary school students working in class',
    imageCredit: 'Tosin Olowoleni via Pexels',
    imageSourceUrl: 'https://www.pexels.com/photo/african-students-focused-on-classroom-studies-34162714/',
    ...PEXELS,
    intro: 'WAEC publishes Sierra Leone results on its own online checker. You need three things: your index number, the year you sat the exam and an e-PIN. This guide follows the instructions on the official checker and its help page, and is clear about the details WAEC does not publish there.',
    sections: [
      {
        heading: 'What you need before you start',
        bullets: [
          'Your 10-digit index number, exactly as it appears on your examination documents.',
          'The year you sat the examination and the examination type (WASSCE).',
          'A WAEC e-PIN: a serial number and a 12-digit PIN. The PIN is your key to the result, so keep it private.',
          'A phone or computer with internet, and a browser that allows pop-up windows for the checker.'
        ]
      },
      {
        heading: 'The seven steps on the official checker',
        paragraphs: [
          'Open the WAEC Sierra Leone result checker at waecsierra-leone.org. Type the address yourself or use the link in the sources below; do not follow links sent by strangers.'
        ],
        bullets: [
          'Step 1: choose the examination type. For Senior Secondary results this is WASSCE.',
          'Step 2: enter your 10-digit index number.',
          'Step 3: choose your examination year.',
          'Step 4: check that the index number and year are correct.',
          'Step 5: enter the serial number from your e-PIN.',
          'Step 6: enter the 12-digit PIN from your e-PIN.',
          'Step 7: press Submit and wait. The checker says the result can take several minutes to appear, and it opens in a pop-up window.'
        ]
      },
      {
        heading: 'If nothing appears after you press Submit',
        paragraphs: [
          'The most common cause is a blocked pop-up. The checker itself warns that the browser’s pop-up blocker must be switched off, otherwise the result window cannot open. Allow pop-ups for the site, then submit again.',
          'If the checker rejects your details, compare every digit of the index number with your examination documents and confirm that you chose the right year and examination type before you try again. An e-PIN allows only three checks (see below), so check everything before you submit.'
        ]
      },
      {
        heading: 'How many times one e-PIN works',
        paragraphs: [
          'WAEC’s help page for the Sierra Leone checker says one e-PIN lets you check a result up to three times. Each check uses one of its three units. After the third check you need a new e-PIN.',
          'One e-PIN works for one result only. If you use it on a second candidate’s result, the help page says this counts as misuse: the checker shows an error and the card is treated as used. Do not share an e-PIN between friends or siblings.',
          'Save the result the first time. Take a screenshot or print the page, and keep the e-PIN details somewhere safe, so you do not spend the other two checks on reading the same result again.'
        ]
      },
      {
        heading: 'Where to get an e-PIN',
        paragraphs: [
          'The checker’s help page names Africell Mobile Money as the place to buy an e-PIN, and lists WAEC’s offices: the national office in Freetown and branch offices in Kenema, Kambia, Kabala, Magburaka, Koidu and Sherbro Island.',
          'The checker does not publish the price of an e-PIN, and we could not confirm from an official source whether other mobile money services sell it. Ask your school or the nearest WAEC office for the current price and where to buy before you pay anyone.'
        ]
      },
      {
        heading: 'Stay safe: result scams to ignore',
        bullets: [
          'Nobody can change or “upgrade” a WAEC result for a fee. Messages offering this are scams.',
          'Never send your PIN, serial number or index number to someone who offers to check the result for you online.',
          'Do not buy an e-PIN from a stranger on social media. A PIN that has already been used is worthless.',
          'Only enter your details on the official checker.'
        ]
      },
      {
        heading: 'After you see your grades',
        paragraphs: [
          'Count your credits first: grades A1 to C6. Most university programmes ask for a set number of credits, usually including English Language and often Mathematics, and many ask for specific subjects as well. Our guide to WASSCE credits explains how universities in Sierra Leone count them.',
          'If the result on the screen does not match what you expected, or it shows as withheld, speak to your school (for school candidates) or a WAEC office. They are the only ones who can explain or correct a result.'
        ]
      }
    ],
    sources: [
      { label: 'WAEC Sierra Leone online result checker', url: 'https://www.waecsierra-leone.org/' },
      { label: 'WAEC Sierra Leone result checker: frequently asked questions', url: 'https://www.waecsierra-leone.org/faq.aspx' },
      { label: 'WAEC Sierra Leone result checker: offices and outlets', url: 'https://www.waecsierra-leone.org/outlets.aspx' }
    ],
    related: ['what-counts-as-a-wassce-credit-for-university-admission', 'sierra-leone-university-admission-requirements-2026-2027'],
    action: { heading: 'Not the grade you wanted? Start on the topics that cost you marks.', label: 'Explore subjects', href: '/wassce/subjects' }
  },
  {
    slug: 'how-to-pass-wassce-mathematics',
    seoTitle: 'How to Pass WASSCE Mathematics: Papers, Marks and a Study Plan | WASSCE Tutor',
    title: 'How to Pass WASSCE Mathematics: The Two Papers, Where the Marks Are, and a Six-Week Plan',
    description: 'How WASSCE Mathematics is examined, how to pace Paper 1 and Paper 2, the order to study topics in, and a six-week revision plan you can start today.',
    category: 'Study guides',
    publishedAt: '2026-11-16',
    updatedAt: '2026-11-16',
    readMinutes: 8,
    image: '/img/blog/pass-wassce-mathematics.webp',
    imageAlt: 'A student working through equations on a chalkboard',
    imageCredit: 'Yan Krukau via Pexels',
    imageSourceUrl: 'https://www.pexels.com/photo/back-view-of-a-student-answering-a-problem-on-the-chalkboard-8197497/',
    ...PEXELS,
    intro: 'Mathematics is a core subject, and most university courses in Sierra Leone want a credit in it. Passing is less about talent than about knowing how the two papers work and practising the right things in the right order. This guide starts from the examination scheme in the WAEC syllabus and turns it into a plan.',
    sections: [
      {
        heading: 'How the examination is set',
        paragraphs: [
          'The WAEC syllabus for General Mathematics sets two papers, and you must take both. Your examination timetable shows the papers for your own sitting.'
        ],
        bullets: [
          'Paper 1: 50 multiple-choice questions in 1½ hours, for 50 marks.',
          'Paper 2: essay questions in 2½ hours, for 100 marks. Thirteen questions are set and you answer ten.',
          'Paper 2, Section A: five compulsory questions worth 40 marks in total. The syllabus describes them as elementary.',
          'Paper 2, Section B: eight longer questions, of which you answer five, for 60 marks.'
        ]
      },
      {
        heading: 'What you may bring into the hall',
        bullets: [
          'A calculator, if it is non-programmable, silent and cordless, and cannot print, send or receive information. Phones are not allowed, even for their calculator.',
          'WAEC-approved mathematical and statistical tables.',
          'Your own ruler, pair of compasses, protractor and set squares. You may not borrow instruments from other candidates in the hall.',
          'Graph paper is provided when a paper needs it.'
        ],
        paragraphs: ['Some questions say that tables or calculators must not be used, so practise doing arithmetic by hand too. Where a question does not state the accuracy it wants, the syllabus expects the accuracy you would get from the mathematical tables.']
      },
      {
        heading: 'Where the marks are',
        paragraphs: [
          'Out of 150 marks, 90 come from Paper 1 and Section A of Paper 2: the multiple-choice questions and the five compulsory, more basic questions. That is 60% of the examination, and it is drawn from across the whole syllabus. A candidate who is secure on the basics of every topic is in a far stronger position than one who has mastered three topics and skipped the rest.',
          'Section B rewards depth. You choose five questions out of eight, so you do not need every advanced topic, but you do need five you can finish. Decide early which areas will be your Section B choices and practise full questions in them.'
        ]
      },
      {
        heading: 'Pace yourself: the time each question deserves',
        bullets: [
          'Paper 1: 90 minutes for 50 questions is under two minutes each. If a question has taken two minutes, mark your best answer, circle the number and move on.',
          'Paper 2: 150 minutes for ten questions is about 15 minutes each. Section A questions should take less, which leaves more time for Section B.',
          'Answer every multiple-choice question. A blank can never score.',
          'In Paper 2, begin with the questions you are sure of, so a hard question cannot eat the time for an easy one.'
        ]
      },
      {
        heading: 'Study the topics in an order that builds',
        paragraphs: [
          'The syllabus groups the content under Number and Numeration, Algebraic Processes, Mensuration, Plane Geometry, Coordinate Geometry of Straight Lines, Trigonometry, Introductory Calculus, Statistics and Probability, Vectors and Transformation, and Units. Later sections depend on earlier ones, so the order you revise in matters.'
        ],
        bullets: [
          'First, number work: fractions, decimals and approximations, percentages, ratio and rates, indices, logarithms, surds and number bases. Almost every other topic uses these.',
          'Second, algebra: algebraic expressions, change of subject, linear equations and inequalities, quadratic equations, variation, sequences and series, and graphs.',
          'Third, shape and space: angles, polygons, circles, lengths and perimeters, areas, volumes, similar and congruent figures, construction and loci.',
          'Then trigonometry, coordinate geometry, statistics and probability, which bring the earlier skills together.'
        ]
      },
      {
        heading: 'Write your working so it earns marks',
        paragraphs: [
          'Paper 2 is an essay paper: the examiner reads your method, not only your final line. Set each solution out so that someone else could follow it.'
        ],
        bullets: [
          'Write the formula or rule before you substitute numbers into it.',
          'Do one step per line and keep the equals signs lined up.',
          'Carry full values through the calculation and round only at the end, to the accuracy the question asks for.',
          'Give units with every length, area, volume, amount of money and angle.',
          'Label diagrams and graphs: axes, scale, points and the title of the graph.',
          'If you cannot finish, leave the correct working you have done. Do not cross it out.'
        ]
      },
      {
        heading: 'Practise the way you will be examined',
        paragraphs: [
          'Reading worked examples feels like progress, but the examination tests whether you can produce the solution yourself. For every topic: read the lesson, close it, and attempt questions with nothing in front of you. Mark them, then redo every question you got wrong two days later without looking at the solution.',
          'Keep an error list: one line for each mistake, saying what went wrong (misread the question, sign error, wrong formula, ran out of time). After two weeks the list shows you exactly what to fix, and it is usually three or four habits, not the whole subject.'
        ]
      },
      {
        heading: 'A six-week revision plan',
        bullets: [
          'Week 1: number and numeration. A short timed set of multiple-choice questions every day.',
          'Week 2: algebra, from expressions to quadratic equations and graphs.',
          'Week 3: mensuration and plane geometry. Draw every diagram yourself.',
          'Week 4: trigonometry, coordinate geometry, statistics and probability.',
          'Week 5: your five chosen Section B areas. One full question a day, written out as in the examination.',
          'Week 6: full timed papers. Paper 1 in 1½ hours and Paper 2 in 2½ hours, then a day spent on corrections for each.'
        ],
        paragraphs: ['If you have more than six weeks, stretch each stage; do not add new stages. If you have less, keep weeks 1, 2 and 6.']
      }
    ],
    sources: [
      { label: 'WAEC General Mathematics syllabus and examination scheme (PDF, reproduced by waecsyllabus.com)', url: 'https://waecsyllabus.com/files/ssce/GENERAL%20MATHEMATICS%20OR%20MATHEMATICS%20(CORE).pdf' },
      { label: 'WAEC Mathematics syllabus summary (waecsyllabus.com, an independent guide)', url: 'https://waecsyllabus.com/mathematics/' }
    ],
    related: ['how-to-pass-wassce-english-language', 'what-counts-as-a-wassce-credit-for-university-admission'],
    action: { heading: 'Work through WASSCE Mathematics topic by topic, with practice marked instantly.', label: 'Open Mathematics', href: '/wassce/mathematics' }
  },
  {
    slug: 'how-to-pass-wassce-english-language',
    seoTitle: 'How to Pass WASSCE English Language: All Three Papers | WASSCE Tutor',
    title: 'How to Pass WASSCE English Language: What Each of the Three Papers Wants',
    description: 'The three WASSCE English papers for Sierra Leone candidates, how the essay is marked, a minute-by-minute plan for Paper 2, and how to prepare for listening comprehension.',
    category: 'Study guides',
    publishedAt: '2026-11-16',
    updatedAt: '2026-11-16',
    readMinutes: 9,
    image: '/img/blog/pass-wassce-english.webp',
    imageAlt: 'A student reading in a university library',
    imageCredit: 'Yan Krukau via Pexels',
    imageSourceUrl: 'https://www.pexels.com/photo/people-studying-in-library-8199762/',
    ...PEXELS,
    intro: 'Almost every university programme in Sierra Leone requires a credit in English Language, so this is the one subject no candidate can afford to leave to chance. The WAEC syllabus says exactly what each paper tests and how the essay is marked. Prepare for those things and the paper stops being a mystery.',
    sections: [
      {
        heading: 'The three papers at a glance',
        bullets: [
          'Paper 1: 80 multiple-choice questions on lexis and structure (forty on vocabulary, forty on grammar) in 1 hour, for 40 marks.',
          'Paper 2: essay writing, comprehension and summary in 2 hours, for 100 marks.',
          'Paper 3: oral English, 60 multiple-choice questions in 45 minutes, for 30 marks. Candidates in Sierra Leone take this as a Listening Comprehension Test.'
        ],
        paragraphs: ['Paper 2 carries 100 of the 170 marks. It deserves most of your preparation time.']
      },
      {
        heading: 'Paper 2: spend the time the syllabus gives each section',
        paragraphs: ['The syllabus tells you how long to spend on each section. Follow it. Candidates who write a long essay and then rush the summary lose marks they could have kept.'],
        bullets: [
          'Section A, essay: 50 minutes, 50 marks. Five questions are set; answer one. Minimum length 450 words.',
          'Section B, comprehension: 30 minutes, 20 marks. One passage of at least 350 words; answer every question.',
          'Section C, summary: 40 minutes, 30 marks. One passage of about 500 words.'
        ]
      },
      {
        heading: 'How the essay is marked',
        paragraphs: ['The syllabus lists four things marks are awarded for. Use them as a checklist for every essay you practise.'],
        bullets: [
          'Content: your ideas must be relevant to the topic. Answer the question that was set, including every part of it.',
          'Organization: the right format where one applies (for example in a letter or a speech), clear paragraphs, and ideas arranged in a sensible order.',
          'Expression: control of vocabulary and sentence structure. Clear, correct sentences score better than long, tangled ones.',
          'Mechanical accuracy: correct grammar, punctuation and spelling.'
        ]
      },
      {
        heading: 'Choosing and writing your essay',
        paragraphs: [
          'The syllabus says essay topics will ask for these kinds of writing: letter, speech, narration, description, argument or debate, report, article, exposition and creative writing. You cannot predict which five will appear, so learn the format of each one, and prepare two kinds thoroughly enough to write under pressure.',
          'In the examination, spend the first five minutes on a plan: your main points in order, one per paragraph. Write for about forty minutes. Keep the last five to read the essay through and correct tense, agreement, spelling and punctuation. Those corrections are marks.'
        ],
        bullets: [
          'Reach the 450-word minimum. Count the words in a few practice essays so you know what that looks like in your handwriting.',
          'Formal letters, informal letters, speeches, articles and reports each have fixed features. Missing them costs Organization marks before the examiner reads a single idea.',
          'Write about what you know. A familiar topic handled clearly beats an impressive topic handled vaguely.'
        ]
      },
      {
        heading: 'Comprehension: answer what is asked',
        paragraphs: [
          'The syllabus lists what comprehension questions test: finding a word or phrase that can replace one in the passage, understanding the facts, making inferences, recognising attitude and feeling, naming a grammatical structure and its function, explaining literary expressions, and rewriting a sentence another way. At least four questions are on the facts of the passage.'
        ],
        bullets: [
          'Read the questions before the second reading of the passage, so you know what to look for.',
          'For a replacement word, your answer must fit the sentence exactly: same tense, same number, same part of speech.',
          'For grammar questions, give the name and the function, for example “adverbial clause of reason, modifying the verb ‘left’”.',
          'Keep answers short and exact. Copying a long stretch of the passage rarely answers the question.'
        ]
      },
      {
        heading: 'Summary: thirty marks for being brief and exact',
        paragraphs: [
          'The syllabus says the summary tests whether you can extract the relevant information, summarise the points asked for in clear, concise English without repetition, and present a summary of specific parts of the passage. The question tells you which aspect to summarise and usually how many sentences to write.'
        ],
        bullets: [
          'Write exactly the number of sentences asked for, one point in each.',
          'Give only the points the question asks about. Extra material is not a bonus.',
          'Write complete sentences in your own words as far as you can; leave out examples, illustrations and repetition.',
          'Do not add an introduction or a conclusion.'
        ]
      },
      {
        heading: 'Paper 1: lexis and structure',
        paragraphs: [
          'Eighty questions in sixty minutes is 45 seconds each, so this paper rewards knowledge you already have, not working things out. Build it a little every day: synonyms and antonyms, idioms, words that are easily confused, and the grammar points that come up again and again, such as subject and verb agreement, tenses, prepositions, question tags and reported speech.',
          'Reading is the best long-term preparation. A newspaper article or a few pages of a good book each day teaches vocabulary in context, which is exactly how this paper tests it.'
        ]
      },
      {
        heading: 'Paper 3 in Sierra Leone: listening comprehension',
        paragraphs: [
          'Sierra Leone candidates are tested by listening. The syllabus says the test has sixty multiple-choice questions on consonants and consonant clusters, vowels and diphthongs, stress and intonation, and dialogues and narratives, and that it is played from a recording.',
          'Its sections cover consonants at the ends of words, vowel quality, vowel and consonant contrasts, rhymes, emphatic stress, and understanding longer dialogues and narratives. You prepare by training your ear: learn the pairs of sounds that are easily confused (such as ship and sheep, or bed and bad), say them aloud, and listen to clear spoken English, for example radio news, as often as you can.'
        ]
      },
      {
        heading: 'A weekly routine that covers all three papers',
        bullets: [
          'Twice a week: one full essay in 50 minutes, checked against the four marking points.',
          'Twice a week: one comprehension passage and one summary passage, timed at 30 and 40 minutes.',
          'Every day: fifteen minutes of lexis and structure questions, and fifteen minutes of reading.',
          'Twice a week: sounds, stress and listening practice.',
          'In the last month: full papers under examination timing.'
        ]
      }
    ],
    sources: [
      { label: 'WAEC English Language syllabus and examination scheme (PDF, reproduced by waecsyllabus.com)', url: 'https://waecsyllabus.com/files/ssce/ENGLISH%20LANGUAGE.pdf' },
      { label: 'WAEC English Language syllabus summary (waecsyllabus.com, an independent guide)', url: 'https://waecsyllabus.com/english-language/' }
    ],
    related: ['how-to-pass-wassce-mathematics', 'what-counts-as-a-wassce-credit-for-university-admission'],
    action: { heading: 'Lessons for every essay type, grammar topic and listening skill in the syllabus.', label: 'Open English Language', href: '/wassce/english-language' }
  }
]
