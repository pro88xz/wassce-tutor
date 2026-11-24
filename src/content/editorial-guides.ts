// Exam guides for the blog: results, and how to prepare for the core papers.
// Every factual claim about WAEC's process or papers comes from the sources
// listed on the post. Where a detail could not be confirmed from an official
// source (prices, payment channels), the post says so instead of guessing.
import type { BlogPost } from './editorial'

// Every guide has its own photograph of West African students, chosen for the article and not used
// anywhere else on the site. Credits are listed on the About page, not under the photo.
const PEXELS = { imageSourceLabel: 'Pexels' }

export const GUIDE_POSTS: BlogPost[] = [
  {
    slug: 'wassce-exam-day-guide-sierra-leone',
    seoTitle: 'WASSCE Exam Day Checklist: What to Bring, What Is Banned',
    title: 'WASSCE Exam Day in Sierra Leone: What to Bring, What Is Banned, and How to Use Your Time',
    description: 'A checklist for every WASSCE paper: what WAEC lets you bring, the items that can cost you your results, your answer sheets, and what to do if things go wrong.',
    category: 'WASSCE exams',
    publishedAt: '2026-11-16',
    updatedAt: '2026-11-16',
    readMinutes: 7,
    image: '/img/blog/wassce-exam-hall.webp',
    imageAlt: 'Students in school uniform writing an examination in a classroom',
    imageCredit: 'Gabriel Joe Amuzu via Pexels',
    imageSourceUrl: 'https://www.pexels.com/photo/students-in-classroom-during-exam-37456293/',
    ...PEXELS,
    intro: 'Months of revision can be undone in a few minutes on the day: a phone left in a pocket, a borrowed protractor, an index number written wrongly, or a compulsory question missed. This checklist covers what WAEC allows, what it does not, and the habits that protect your marks in every paper.',
    sections: [
      {
        heading: 'Before the examination starts',
        bullets: [
          'Get your timetable from your school (or WAEC, if you are a private candidate) and mark every paper, with its date and time, on one sheet you can see every day.',
          'Ask your school which curriculum each of your subjects is examined on. The Ministry of Basic and Senior Secondary Education has said the 2026 WASSCE examines some subjects on the new senior secondary curriculum and others on the old one.',
          'Learn your index number by heart, and keep a copy with your examination documents.',
          'If you are a private candidate, visit your centre before the first paper so you know how long the journey takes.',
          'In the last weeks, do at least one full paper in every subject under the real time limit.'
        ]
      },
      {
        heading: 'What to bring',
        bullets: [
          'Several pens that work, pencils, a sharpener and a clean eraser for the objective answer sheet.',
          'For Mathematics and the sciences: your own ruler, pair of compasses, protractor and set squares. The WAEC Mathematics syllabus says candidates will not be allowed to borrow instruments or any other material from other candidates in the hall.',
          'A calculator, if it is allowed: the syllabus permits only non-programmable, silent and cordless calculators that cannot print, send or receive information.',
          'WAEC-approved mathematical tables, which the syllabus allows in the examination room. Graph paper is provided when a paper needs it.',
          'Any identification or examination documents your school or WAEC gives you.'
        ],
        paragraphs: ['Pack the bag the night before, and check it against your timetable so you have the instruments the next day’s papers need.']
      },
      {
        heading: 'What can cost you your results',
        bullets: [
          'A mobile phone. The WAEC Mathematics syllabus states that phones are not allowed, with or without a calculator. In Sierra Leone, a candidate found with a phone in the examination hall has their results cancelled, even if the phone was never used. Leave yours at home or with someone outside.',
          'Other electronic devices, including smartwatches and calculators that are programmable or can communicate.',
          'Notes, “leaked” questions or any material you were not given in the hall. Sierra Leone’s Anti-Corruption Commission lists possessing foreign materials and using mobile phones during the WASSCE among the malpractice it will investigate, arrest and prosecute.',
          'Paying anyone for help. The Commission warns that school authorities, invigilators and examination officials must not demand or accept any advantage or bribe from candidates or parents, and that corruption in examinations is an offence under the Anti-Corruption (Amendment) Act 2019.'
        ],
        paragraphs: ['People who sell “leaked” papers are almost always selling fakes. Even when they are not, buying them puts your whole result at risk.']
      },
      {
        heading: 'Arrive early',
        paragraphs: [
          'Plan to be at the centre well before the paper starts, with time to find your seat and settle before the paper begins. Do not count on being let in after it has started, and remember that any time you lose cannot be given back.',
          'Eat before you leave and bring water if your centre allows it. A paper of two hours or more is a long time to work on an empty stomach.'
        ]
      },
      {
        heading: 'In the hall: the first five minutes',
        bullets: [
          'Listen to the supervisor’s instructions and do what they say, including when to start and stop writing.',
          'Write your name and index number exactly as instructed on every answer sheet and booklet, and check every digit. A wrong index number can separate you from your script.',
          'On the objective answer sheet, shade one box per question, firmly and neatly. If you change an answer, erase the old mark completely.',
          'Read the instructions on the question paper before you answer anything: how many questions to answer, which are compulsory, and how long you have. The commonest avoidable mistake is answering too many or too few questions.'
        ]
      },
      {
        heading: 'Use the time the paper gives you',
        bullets: [
          'Work out the minutes per question before you start, and write your target finishing time for each section at the top of the paper.',
          'In objective papers, answer every question. A blank cannot score, and you lose nothing by choosing your best answer.',
          'In essay papers, start with the questions you know best, so a hard question cannot eat the time for an easy one.',
          'In English Language, the listening comprehension test is played from a recording, so be ready before it starts and keep still and silent while it plays.',
          'Keep the last five minutes to check your index number, the question numbers on your answers, and your working.'
        ],
        paragraphs: ['Our subject guides give the exact time and marks for each paper in Mathematics, English Language, Biology, Chemistry and Physics.']
      },
      {
        heading: 'Practicals',
        paragraphs: [
          'Bring every instrument the paper might need, because you may not borrow. Follow the supervisor’s instructions on apparatus and safety, record what you actually observe rather than what you expected to see, and write units with every reading.'
        ]
      },
      {
        heading: 'If something goes wrong',
        bullets: [
          'If you receive the wrong paper, a page is missing or printed badly, or your name is not on the list, tell the supervisor at once, before you leave the hall.',
          'If you are ill on the day, tell the supervisor and your school as soon as you can.',
          'If anyone asks you or your parents for money to “help” in the examination, refuse and report it to the Anti-Corruption Commission on its hotlines, 077-985-985 or 077-986-986.'
        ]
      },
      {
        heading: 'Between papers',
        paragraphs: [
          'Do not spend the evening going over the paper you have just sat with friends; it cannot change your marks. Check the timetable for the next paper, pack your bag for it, revise the topics it covers, and sleep. A rested mind recalls more than a tired one that studied an extra hour.'
        ]
      }
    ],
    sources: [
      { label: 'Anti-Corruption Commission: warning against malpractice, mobile phone use and extortion in the WASSCE', url: 'https://www.anticorruption.gov.sl/blog/anti-corruption-commission-sl-news-room-1/post/acc-warns-against-malpractices-wanton-use-of-mobile-phones-and-extortion-in-the-on-going-west-african-senior-school-certificate-examination-wassce-1039' },
      { label: 'Premier Media: education stakeholders approve dual curricula for the 2026 WASSCE', url: 'https://www.premiermedia-sl.com/?p=26293' },
      { label: 'WAEC General Mathematics syllabus: calculators, tables and instruments (PDF, reproduced by waecsyllabus.com)', url: 'https://waecsyllabus.com/files/ssce/GENERAL%20MATHEMATICS%20OR%20MATHEMATICS%20(CORE).pdf' },
      { label: 'WAEC English Language syllabus: listening comprehension test (PDF, reproduced by waecsyllabus.com)', url: 'https://waecsyllabus.com/files/ssce/ENGLISH%20LANGUAGE.pdf' }
    ],
    related: ['how-to-pass-wassce-mathematics', 'how-to-check-wassce-result-sierra-leone'],
    action: { heading: 'Practise every subject under exam timing before the day.', label: 'Explore subjects', href: '/wassce/subjects' }
  },
  {
    slug: 'how-to-check-wassce-result-sierra-leone',
    seoTitle: 'How to Check Your WASSCE Result Online in Sierra Leone',
    title: 'How to Check Your WASSCE Result Online in Sierra Leone, Step by Step',
    description: 'What you need, the seven steps on WAEC’s official Sierra Leone result checker, how many times one e-PIN works, and how to avoid result scams.',
    category: 'WASSCE results',
    publishedAt: '2026-11-16',
    updatedAt: '2026-11-16',
    readMinutes: 6,
    image: '/img/blog/wassce-results-day.webp',
    imageAlt: 'Students in school uniform smiling together',
    imageCredit: 'Tosin Olowoleni via Pexels',
    imageSourceUrl: 'https://www.pexels.com/photo/smiling-schoolchildren-in-uniform-share-a-moment-34162710/',
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
          'Count your credits first: grades A1 to C6. Most university programmes ask for a set number of credits, usually including English Language and often Mathematics, and many ask for specific subjects as well. [Our guide to WASSCE credits](/blog/what-counts-as-a-wassce-credit-for-university-admission) explains how universities in Sierra Leone count them.',
          'If the result on the screen does not match what you expected, or it shows as withheld, speak to your school (for school candidates) or a WAEC office. They are the only ones who can explain or correct a result. [Our guide to withheld results](/blog/wassce-result-withheld-2026-sierra-leone) explains what withheld means and what happens next.'
        ]
      }
    ],
    sources: [
      { label: 'WAEC Sierra Leone online result checker', url: 'https://www.waecsierra-leone.org/' },
      { label: 'WAEC Sierra Leone result checker: frequently asked questions', url: 'https://www.waecsierra-leone.org/faq.aspx' },
      { label: 'WAEC Sierra Leone result checker: offices and outlets', url: 'https://www.waecsierra-leone.org/outlets.aspx' }
    ],
    related: ['2026-wassce-results-sierra-leone', 'wassce-result-withheld-2026-sierra-leone', 'what-counts-as-a-wassce-credit-for-university-admission', 'sierra-leone-university-admission-requirements-2026-2027'],
    action: { heading: 'Not the grade you wanted? Start on the topics that cost you marks.', label: 'Explore subjects', href: '/wassce/subjects' }
  },
  {
    slug: 'how-to-pass-wassce-mathematics',
    seoTitle: 'How to Pass WASSCE Mathematics: Papers, Marks, Study Plan',
    title: 'How to Pass WASSCE Mathematics: The Two Papers, Where the Marks Are, and a Six-Week Plan',
    description: 'How WASSCE Mathematics is examined, how to pace Paper 1 and Paper 2, the order to study topics in, and a six-week revision plan you can start today.',
    category: 'Study guides',
    publishedAt: '2026-11-16',
    updatedAt: '2026-11-16',
    readMinutes: 8,
    image: '/img/blog/wassce-maths-classwork.webp',
    imageAlt: 'A student in school uniform working at her desk',
    imageCredit: 'Mickael Ange Konan via Pexels',
    imageSourceUrl: 'https://www.pexels.com/photo/diverse-classroom-of-focused-students-learning-34526411/',
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
    seoTitle: 'How to Pass WASSCE English Language: All Three Papers',
    title: 'How to Pass WASSCE English Language: What Each of the Three Papers Wants',
    description: 'The three WASSCE English papers for Sierra Leone candidates, how the essay is marked, a minute-by-minute plan for Paper 2, and the listening test.',
    category: 'Study guides',
    publishedAt: '2026-11-16',
    updatedAt: '2026-11-16',
    readMinutes: 9,
    image: '/img/blog/wassce-english-reading.webp',
    imageAlt: 'Three students in school uniform reading a book together',
    imageCredit: 'Mickael Ange Konan via Pexels',
    imageSourceUrl: 'https://www.pexels.com/photo/three-students-reading-school-book-outdoors-34526425/',
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
  },
  {
    slug: 'how-to-pass-wassce-biology',
    seoTitle: 'How to Pass WASSCE Biology: Papers, Practical, Study Plan',
    title: 'How to Pass WASSCE Biology: The Three Papers, the Practical, and How to Revise',
    description: 'How WASSCE Biology is examined for Sierra Leone candidates, why the practical carries 40% of the marks, how to answer essay questions, and a revision plan.',
    category: 'Study guides',
    publishedAt: '2026-11-16',
    updatedAt: '2026-11-16',
    readMinutes: 8,
    image: '/img/blog/wassce-biology-classwork.webp',
    imageAlt: 'A teacher checking students’ notes during a lesson',
    imageCredit: 'Theo Lordson via Pexels',
    imageSourceUrl: 'https://www.pexels.com/photo/teacher-assisting-students-in-classroom-setting-40807445/',
    ...PEXELS,
    intro: 'Biology is the science most WASSCE candidates take, and it is required for medicine, nursing, pharmacy, agriculture and many other courses. It also has a trap: many candidates revise only the theory, while the practical paper carries a large share of the marks. This guide follows the WAEC Biology syllabus, including the extra section that Sierra Leone candidates are examined on.',
    sections: [
      {
        heading: 'How the examination is set',
        paragraphs: ['There are three papers and you must take all of them. Papers 1 and 2 are taken together at one sitting.'],
        bullets: [
          'Paper 1: 50 multiple-choice questions in 50 minutes, for 50 marks, from the core part of the syllabus.',
          'Paper 2: essays in 1 hour 40 minutes, for 70 marks. In Section A you answer two of four questions (20 marks each). In Section C, the section set for Sierra Leone candidates, you answer all the short structured questions (30 marks).',
          'Paper 3: the practical, 2 hours, for 80 marks. School candidates take a practical test; private candidates take a test of practical work. Section A has two compulsory questions (25 marks each) and Section C has one question set for Sierra Leone candidates (30 marks).'
        ]
      },
      {
        heading: 'The practical is 40% of your marks',
        paragraphs: [
          'Add the papers up: 50 + 70 + 80 = 200 marks, and the practical is 80 of them. No other part of the examination is worth as much. A candidate who has only read notes and never handled a specimen or drawn one is giving away marks before the theory papers even begin.',
          'Throughout the syllabus, candidates are expected to observe, draw and label: cells, tissues, organs, flowers, fruits, seeds, and the structures of plants and animals. That is what the practical tests.'
        ],
        bullets: [
          'Draw in pencil, with clean single lines and no shading.',
          'Make the drawing large enough to show the parts clearly, and give it a title.',
          'Label with straight lines that do not cross, and print the labels neatly.',
          'Learn the food tests and the simple experiments in the syllabus (for example on osmosis, transpiration and reflex actions) well enough to describe the method, the observation and the conclusion.'
        ]
      },
      {
        heading: 'What the syllabus covers',
        paragraphs: [
          'The core part of the syllabus, which Paper 1 and Section A of Paper 2 are drawn from, is grouped under: Concept of Living; Plant and Animal Nutrition; Basic Ecological Concepts; Conservation of Natural Resources; Variation in Population; Biology of Heredity (Genetics); and Adaptation for Survival and Evolution.',
          'The section set for Sierra Leone candidates goes deeper into some of these: cell theory, irritability, excretory systems and reproduction; the nitrogen cycle and the alimentary system; habitats; applications of variation such as crime detection and blood transfusion; and evolution. Section C of Paper 2 and Section C of Paper 3 come from this part, so it cannot be skipped.'
        ]
      },
      {
        heading: 'Pacing Paper 1 and Paper 2',
        bullets: [
          'Paper 1: 50 minutes for 50 questions is one minute each. Answer every question; a blank cannot score.',
          'Paper 2: about 30 minutes on each of your two Section A essays and about 40 minutes on the Section C questions, which carry the most marks.',
          'Read all four Section A questions before you choose. Pick the two where you can answer every part, not the two whose first part looks easiest.'
        ]
      },
      {
        heading: 'Writing answers that score',
        bullets: [
          'Answer with the exact term the question asks for. “Describe” wants a sequence of steps or features; “explain” wants the reason; “state” wants a short fact.',
          'Use the number of marks as a guide: a 4-mark question usually needs four separate points.',
          'Draw and label a diagram wherever it shows the answer faster than words, for example the structure of the kidney, the heart, a flower or a food web.',
          'Spell biological terms correctly. Many terms differ by a few letters (meiosis and mitosis, ureter and urethra) and a misspelt word can be marked as the wrong one.'
        ]
      },
      {
        heading: 'A revision plan',
        bullets: [
          'Start with cells and life processes: cell structure, movement of substances into and out of cells, nutrition, respiration, transport and excretion. Later topics build on them.',
          'Then ecology and conservation, which are full of definitions and examples. Learn local examples: crops, animals and habitats in Sierra Leone.',
          'Then genetics, variation and evolution. Practise genetic crosses on paper until you can set out a cross and its ratios without help.',
          'Every week: one practical-style task. Draw a real specimen (a leaf, a flower, an insect, a seed) with a title and labels.',
          'In the last month: full papers under examination timing.'
        ]
      }
    ],
    sources: [
      { label: 'WAEC Biology syllabus and examination scheme (PDF, reproduced by waecsyllabus.com)', url: 'https://waecsyllabus.com/files/ssce/BIOLOGY.pdf' },
      { label: 'WAEC Biology syllabus summary (waecsyllabus.com, an independent guide)', url: 'https://waecsyllabus.com/biology/' }
    ],
    related: ['how-to-pass-wassce-chemistry', 'how-to-choose-wassce-subjects-for-your-university-course'],
    action: { heading: 'Study WASSCE Biology topic by topic, with diagrams in every lesson.', label: 'Open Biology', href: '/wassce/biology' }
  },
  {
    slug: 'how-to-pass-wassce-chemistry',
    seoTitle: 'How to Pass WASSCE Chemistry: Papers, Practical, Study Plan',
    title: 'How to Pass WASSCE Chemistry: The Three Papers, Titrations, Salt Analysis and a Plan',
    description: 'How WASSCE Chemistry is examined, what the practical tests (titration and qualitative analysis), the rules on units and significant figures, and how to revise.',
    category: 'Study guides',
    publishedAt: '2026-11-16',
    updatedAt: '2026-11-16',
    readMinutes: 8,
    image: '/img/blog/wassce-chemistry-lesson.webp',
    imageAlt: 'A teacher writing chemical equations on a classroom whiteboard',
    imageCredit: 'Unique Digitals via Pexels',
    imageSourceUrl: 'https://www.pexels.com/photo/a-teacher-writing-on-a-whiteboard-10614243/',
    ...PEXELS,
    intro: 'Chemistry is required for medicine, pharmacy, engineering and most science degrees. It rewards steady practice more than memorising: the calculations, the equations and the practical skills all improve with repetition. This guide follows the WAEC Chemistry syllabus and its examination scheme.',
    sections: [
      {
        heading: 'How the examination is set',
        paragraphs: ['There are three papers and you must take all of them. Papers 1 and 2 are taken together at one sitting.'],
        bullets: [
          'Paper 1: 50 multiple-choice questions in 1 hour, for 50 marks, from the core part of the syllabus.',
          'Paper 2: essays in 2 hours, for 100 marks. Section A has ten short structured questions; answer all of them, for 25 marks. Section B has four questions, two on the core syllabus and two on the section set for Sierra Leone candidates; answer any three, at 25 marks each.',
          'Paper 3: the practical, for 50 marks. School candidates take a 2-hour practical test; private candidates take a 1 hour 30 minute alternative to practical. Both have three compulsory questions.'
        ]
      },
      {
        heading: 'What the practical tests',
        paragraphs: ['The syllabus says the three practical questions are always: one on quantitative analysis, one on qualitative analysis, and one on the practical activities in your teaching syllabus.'],
        bullets: [
          'Quantitative analysis means titration. You use standard solutions of acids and alkalis with methyl orange, methyl red or phenolphthalein to find concentrations, molar masses, percentage purity or the water of crystallisation. The syllabus also lists redox titrations, such as acidified permanganate with iron(II).',
          'Qualitative analysis means identifying ions and gases from your observations. The syllabus lists tests for the cations NH₄⁺, Ca²⁺, Pb²⁺, Cu²⁺, Fe²⁺, Fe³⁺, Al³⁺ and Zn²⁺ with sodium hydroxide and aqueous ammonia; the anions Cl⁻, SO₃²⁻, CO₃²⁻, NO₃⁻ and SO₄²⁻; and the gases H₂, NH₃, CO₂, HCl and SO₂.',
          'The syllabus says no formal scheme of analysis is required. What earns marks is recording what you actually see (colour, precipitate, whether it dissolves in excess, gas given off) and the inference that follows from it.'
        ]
      },
      {
        heading: 'Titration: where marks are won and lost',
        bullets: [
          'Record every burette reading to two decimal places, in a neat table with initial reading, final reading and volume used.',
          'Take an average only of titres that agree closely, and say which ones you used.',
          'In the calculation, write the balanced equation first and use its mole ratio. Most wrong answers come from skipping this step.',
          'Show every step: moles from concentration and volume, the mole ratio, then the quantity asked for, with units.'
        ]
      },
      {
        heading: 'Units, significant figures and names',
        paragraphs: [
          'The syllabus states that candidates must know significant figures, SI units and the conventional and IUPAC systems of naming compounds. Examiners expect answers given to a sensible number of significant figures, with correct units, and compounds named by their systematic names where the question asks for them.'
        ]
      },
      {
        heading: 'What the syllabus covers',
        paragraphs: [
          'The core part of the syllabus covers: the structure of the atom; separation techniques; periodic chemistry; chemical bonds; stoichiometry and chemical reactions; states of matter; energy changes; acids, bases and salts; solubility; rates of reaction and equilibrium; redox reactions; the chemistry of carbon (organic chemistry); chemistry, industry and the environment; and basic biochemistry.',
          'The section set for Sierra Leone candidates adds non-metals and their compounds, and metals and their compounds. Two of the four Section B questions in Paper 2 come from this section, so revise it.'
        ]
      },
      {
        heading: 'A revision plan',
        bullets: [
          'First: atomic structure, bonding and the periodic table. Everything else is explained in terms of them.',
          'Second: the mole and stoichiometry. Practise calculations every day until the steps are automatic; they appear in every paper.',
          'Third: acids, bases and salts, redox and electrolysis, then rates and equilibrium.',
          'Fourth: organic chemistry: the homologous series, their reactions, and the tests for functional groups.',
          'Every week: one titration calculation and one set of qualitative analysis observations to interpret, written out as in Paper 3.',
          'In the last month: full papers under examination timing.'
        ]
      }
    ],
    sources: [
      { label: 'WAEC Chemistry syllabus and examination scheme (PDF, reproduced by waecsyllabus.com)', url: 'https://waecsyllabus.com/files/ssce/CHEMISTRY.pdf' },
      { label: 'WAEC Chemistry syllabus summary (waecsyllabus.com, an independent guide)', url: 'https://waecsyllabus.com/chemistry/' }
    ],
    related: ['how-to-pass-wassce-physics', 'how-to-pass-wassce-biology'],
    action: { heading: 'Study WASSCE Chemistry topic by topic, with worked calculations.', label: 'Open Chemistry', href: '/wassce/chemistry' }
  },
  {
    slug: 'how-to-pass-wassce-physics',
    seoTitle: 'How to Pass WASSCE Physics: Papers, Practical, Study Plan',
    title: 'How to Pass WASSCE Physics: The Three Papers, Calculations and the Practical',
    description: 'How WASSCE Physics is examined, how to pace each paper, how to set out calculations and practical reports, and a revision plan for the whole syllabus.',
    category: 'Study guides',
    publishedAt: '2026-11-16',
    updatedAt: '2026-11-16',
    readMinutes: 8,
    image: '/img/blog/wassce-physics-classwork.webp',
    imageAlt: 'Students in school uniform working through problems at their desks',
    imageCredit: 'Mickael Ange Konan via Pexels',
    imageSourceUrl: 'https://www.pexels.com/photo/engaged-students-in-a-classroom-setting-34526416/',
    ...PEXELS,
    intro: 'Physics is required for engineering and many science courses, and it has a reputation for being hard. Much of that reputation comes from calculations set out badly and practicals done in a hurry. Both can be fixed with method and practice. This guide follows the WAEC Physics syllabus and its examination scheme.',
    sections: [
      {
        heading: 'How the examination is set',
        paragraphs: ['There are three papers and you must take all of them. Papers 1 and 2 are taken together at one sitting.'],
        bullets: [
          'Paper 1: 50 multiple-choice questions in 1¼ hours, for 50 marks.',
          'Paper 2: 1½ hours, 60 marks. Section A has seven short structured questions; answer any five, for 15 marks in total. Section B has five essay questions; answer any three, for 45 marks.',
          'Paper 3: the practical, 50 marks. School candidates take a practical test and private candidates an alternative to practical. Three questions are set; answer any two in 2¾ hours.'
        ]
      },
      {
        heading: 'Pace yourself',
        bullets: [
          'Paper 1: 75 minutes for 50 questions is a minute and a half each. Answer every question.',
          'Paper 2: about 20 minutes for your five Section A answers, then about 22 minutes for each of the three Section B questions. Section B carries three times the marks of Section A, so give it the time.',
          'Paper 3: you answer two questions in 2¾ hours, so roughly 80 minutes each. Use it to take careful readings, not to rush.',
          'Wherever you have a choice, read every question first and choose the ones you can finish.'
        ]
      },
      {
        heading: 'Set out every calculation the same way',
        paragraphs: ['The syllabus says questions are set in SI units. Most lost marks in calculations come from missing steps and units, not from wrong physics.'],
        bullets: [
          'Write down what you are given, with units, and what you need to find.',
          'Write the formula in symbols before putting numbers in.',
          'Convert everything to SI units first: metres, kilograms, seconds, amperes, kelvin.',
          'Substitute, then calculate, one step per line.',
          'Give the answer with its unit and a sensible number of significant figures.'
        ]
      },
      {
        heading: 'The practical: readings, graph and precautions',
        paragraphs: ['The syllabus lists what the practical assesses: following instructions, using apparatus, recording observations and measurements with attention to precision, accuracy and units, interpreting the results, and stating the precautions taken to get accurate results. In practice most questions follow the same shape.'],
        bullets: [
          'Record readings in a table with a unit in each column heading, and to the precision of the instrument.',
          'Take enough readings across the range you are given.',
          'Plot the graph with a sensible scale that uses most of the paper, labelled axes with units, and a line of best fit.',
          'Work out the slope with a large triangle, and show the values you read off.',
          'State precautions as specific actions, for example “I avoided parallax by reading the scale at eye level” or “I switched off the circuit between readings so the wire did not heat up”, not “I was careful”.'
        ]
      },
      {
        heading: 'What the syllabus covers',
        paragraphs: [
          'The syllabus is organised in five parts: interaction of matter, space and time (including motion and forces); energy, both mechanical and heat; waves (including light and sound); fields (gravitational, electric and magnetic, and electricity); and atomic and nuclear physics.',
          'It also lists harmonised topics for short structured questions, such as derived quantities and dimensions, projectile motion, satellites, elasticity, fibre optics, lasers and semiconductors. The syllabus lists them for short structured questions, which is the format of Section A of Paper 2, so give each one a quick revision.'
        ]
      },
      {
        heading: 'A revision plan',
        bullets: [
          'First: units, measurement and motion: speed, velocity, acceleration, the equations of motion and motion graphs. They underpin most of the course.',
          'Second: forces, energy, work, power, machines and heat.',
          'Third: waves, light and sound.',
          'Fourth: electricity and magnetism, which carry a large share of the calculations.',
          'Fifth: atomic and nuclear physics and the harmonised short-answer topics.',
          'Every week: one practical write-up with a table, a graph and precautions, and a timed set of calculations.',
          'In the last month: full papers under examination timing.'
        ]
      }
    ],
    sources: [
      { label: 'WAEC Physics syllabus and examination scheme (PDF, reproduced by waecsyllabus.com)', url: 'https://waecsyllabus.com/files/ssce/PHYSICS.pdf' },
      { label: 'WAEC Physics syllabus summary (waecsyllabus.com, an independent guide)', url: 'https://waecsyllabus.com/physics/' }
    ],
    related: ['how-to-pass-wassce-chemistry', 'how-to-pass-wassce-mathematics'],
    action: { heading: 'Study WASSCE Physics topic by topic, with worked examples and practice.', label: 'Open Physics', href: '/wassce/physics' }
  }
]
