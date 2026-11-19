// Reporting on the 2026 WASSCE results in Sierra Leone. Every figure comes
// from the sources listed on the post: the Minister of Basic and Senior
// Secondary Education's announcement of 27 October 2026, as reported by
// several outlets, and the statements that followed it. Claims that only one
// outlet reported are attributed to it in the text. The charts and the cover
// are our own, drawn from the same figures by scripts/blog/results-charts.mjs.
//
// This is a developing story: when withheld results are released or a figure
// changes, add an entry to `updates` (newest first), move `updatedAt` to the
// same date, and re-run the chart script if a charted number changed.
import type { BlogPost } from './editorial'

const OURS = { imageCredit: 'WASSCE Tutor', imageSourceLabel: 'WASSCE Tutor' }

export const RESULTS_POSTS: BlogPost[] = [
  {
    slug: '2026-wassce-results-sierra-leone',
    seoTitle: '2026 WASSCE Results Sierra Leone: Pass Rate, Withheld, Top School',
    title: '2026 WASSCE Results in Sierra Leone: The Figures, the Withheld Results and What Happens Next',
    description: 'Sierra Leone’s 2026 WASSCE results: 64.3% got five credits, 47,454 were withheld and 9.77% got an English credit. The top candidate, top school and what comes next.',
    category: 'WASSCE results',
    publishedAt: '2026-11-19',
    updatedAt: '2026-11-19',
    readMinutes: 10,
    news: true,
    image: '/img/blog/wassce-2026-results-sierra-leone.webp',
    imageAlt: 'Unit chart of the 200,756 2026 WASSCE entries in Sierra Leone: 141,810 with results released, 47,454 withheld and 11,492 absent from every paper',
    ...OURS,
    keyFacts: [
      { value: '64.3%', label: 'of candidates with results got five or more credits in one sitting' },
      { value: '47,454', label: 'results withheld over suspected malpractice' },
      { value: '9.77%', label: 'of candidates got a credit in English Language' },
      { value: '81.4%', label: 'of the 1.1 million subject papers sat were passed' }
    ],
    intro: 'The Minister of Basic and Senior Secondary Education, Conrad Sackey, announced Sierra Leone’s 2026 WASSCE results on Tuesday 27 October 2026, live on SLBC. On the headline measures it was a better year than 2025: 91,122 candidates, 64.3% of those with results, obtained at least five credits in a single sitting. But 47,454 results were withheld over suspected malpractice, more than three times the 2025 figure, and fewer than one candidate in ten earned a credit in English Language. This article sets out what was announced, how it compares with last year, what the government and Parliament have done since, and what candidates can do now.',
    updates: [
      { date: '2026-11-19', text: 'We have found no official report that any of the 47,454 withheld results has been released. Candidates should keep checking WAEC’s irregularities page and their school.' },
      { date: '2026-11-05', text: 'After the Minister appeared before Parliament, the Speaker, Hon. Segepoh Solomon Thomas, ordered the immediate release of withheld results where there is no clear evidence of malpractice, Sierra Leone Monitor reported. The Ministry was to give a timeline for finishing the investigation within four working days.' },
      { date: '2026-11-02', text: 'The University of Sierra Leone changed its English Language entry rule for 2026 results: a D7 pass in English is accepted for diplomas and certificates, and a C6 credit for all degree programmes at Fourah Bay College and IPAM. COMAHS and the Law degree are unchanged.' },
      { date: '2026-10-27', text: 'The Minister announced the results on SLBC. WAEC had given them to the Ministry on Friday 23 October.' }
    ],
    sections: [
      {
        heading: 'The results in figures',
        paragraphs: [
          'WAEC registered 201,124 candidates from 1,043 schools for the May/June 2026 WASSCE. The list it gave the government covered 200,756 candidates from 1,038 schools. The missing 368 candidates are from five private schools whose results were held back because the schools had not paid their examination fees to WAEC, not because of anything the candidates did.',
          'Of the 200,756 on the list, 47,454 had their results withheld and 11,492 were absent from every paper. That leaves 141,810 candidates who sat at least one subject and have results. The pass rates the Ministry announced are shares of that group.'
        ],
        figure: {
          image: '/img/blog/charts/wassce-2026-entries.webp',
          alt: 'Segmented bar charts. Of 200,756 entries, 70.6% had results released, 23.6% were withheld and 5.7% were absent. Of the 141,810 with results, 64.3% got five credits or more.',
          caption: 'Where the 200,756 entries on WAEC’s list stand, and how many of the candidates with results reached five credits. Figures from the Ministry’s announcement of 27 October 2026.',
          width: 1200,
          height: 750
        },
        table: {
          caption: '2026 WASSCE, Sierra Leone: the announced figures',
          columns: ['Measure', 'Candidates', 'Share'],
          rows: [
            ['Registered by WAEC', '201,124', '–'],
            ['On WAEC’s list to the Ministry', '200,756', '100%'],
            ['Results withheld (suspected malpractice)', '47,454', '23.6%'],
            ['Absent from every paper', '11,492', '5.7%'],
            ['Sat at least one subject, results released', '141,810', '70.6%'],
            ['Five credits or more in one sitting', '91,122', '64.3%'],
            ['Excluded over unpaid school fees', '368', '–']
          ],
          note: 'Withheld, absent and results released add up to the 200,756 on the list. The five-credit share, 64.3%, is a share of the 141,810 with results, not of the whole list. The Ministry also reported a paper pass rate of 81.4%: 916,125 passes from 1,125,314 subject papers sat.'
        }
      },
      {
        heading: 'How 2026 compares with 2025',
        paragraphs: [
          'Almost every headline measure moved up. Many more candidates sat the examination, the number with five credits nearly doubled, and the paper pass rate rose from 74% to 81.4%. Mathematics improved sharply, from 46.71% of candidates with a credit to 62.15%.',
          'English Language went the other way. The share of candidates with a credit (A1 to C6) fell from 11.77% to 9.77%, and the Ministry reported that 63.33% failed the subject. English was already the weakest core subject: in 2025, 63.02% failed it.'
        ],
        figure: {
          image: '/img/blog/charts/wassce-2026-english-maths.webp',
          alt: 'Slope chart. Mathematics credits rose from 46.71% in 2025 to 62.15% in 2026; English Language credits fell from 11.77% to 9.77%.',
          caption: 'Share of candidates with a credit in the two core subjects, as announced by the Ministry in October 2025 and October 2026.',
          width: 1200,
          height: 750
        },
        table: {
          caption: '2025 and 2026 compared',
          columns: ['Measure', '2025', '2026'],
          rows: [
            ['Sat at least one subject, results released', '97,817', '141,810'],
            ['Five credits or more in one sitting', '47,434', '91,122'],
            ['Subject paper pass rate', '74%', '81.4%'],
            ['Credit in English Language', '11.77%', '9.77%'],
            ['Credit in Mathematics', '46.71%', '62.15%'],
            ['Results withheld', '13,237', '47,454'],
            ['Absent from every paper', '35,020', '11,492']
          ],
          note: 'The 2025 figures are from the Ministry’s announcement of October 2025 as reported at the time. The Ministry did not state which group of candidates the English and Mathematics percentages are shares of, in either year, so treat the comparison as indicative.'
        },
        after: [
          'The gap between the two subjects matters because most degree programmes ask for credits in both. In 2025, only 7,024 candidates had five credits including both English and Mathematics, out of 47,434 with five credits of any kind. The Ministry has not announced the 2026 figure. If the 9.77% is a share of the 141,810 candidates with results, about 13,900 candidates hold an English credit this year, which is the ceiling on how many can meet a rule that requires one.',
          'Writing in The Sierra Leone Telegraph, Dr Mohamed Ibrahim Justice Ganawah, a former St Edward’s teacher who now coordinates examinations in a university faculty, argued that a 52-point gap between Mathematics and English is unusual (in Ghana the two rates were within two points this year) and called on WAEC and the Ministry to examine centre-level data. He also noted that 2026 was the first sitting examined on two curricula at once, which may have moved results in ways not yet understood. These are his arguments, not findings of the Ministry.'
        ]
      },
      {
        heading: '47,454 results withheld',
        paragraphs: [
          'WAEC withheld the results of 47,454 candidates, 26,735 of them girls and 20,719 boys, for suspected examination malpractice. That is 23.6% of everyone on the list, up from 13,237 in 2025 and 27,097 in 2024. For these candidates every subject is withheld, not just one.',
          'The Ministry said the rise could mean that stricter monitoring caught more cheating, but that the scale of the increase needed further investigation. It said results were withheld under 13 categories, including collusion, sharing answers in the examination room and using social media or artificial intelligence to get and spread answers across centres. Sierra Leone Monitor reported that about half of the suspected cases in a WAEC summary were social media offences (23,980), with mobile phones (6,005) the next largest group.'
        ],
        figure: {
          image: '/img/blog/charts/wassce-2026-withheld-by-year.webp',
          alt: 'Bar chart of withheld WASSCE results in Sierra Leone: 27,097 in 2024, 13,237 in 2025 and 47,454 in 2026.',
          caption: 'Candidates whose results WAEC withheld for suspected malpractice, as announced by the Ministry in 2025 and 2026.',
          width: 1200,
          height: 750
        },
        after: [
          'A withheld result is a suspicion, not a verdict. “Withholding does not mean guilty,” Minister Sackey said. WAEC investigates each case; it may release some or all of the results, and it may cancel the results of candidates it finds took part in malpractice. Candidates can check whether their own result is withheld on [WAEC Sierra Leone’s irregularities page](https://www.waec-sierra-leone.org/irregularities), and should stay in close touch with their principal.',
          'The Ministry said the Chief Education Officer, the government’s chief nominee to WAEC, would work with the council’s committee to speed up decisions, and that it would ask three respected educationists to observe the committee’s deliberations. It warned that sanctions would not stop at candidates: centre managers, supervisors, invigilators, principals and proprietors found to have helped could also be punished, and principals and proprietors involved in repeated malpractice would be referred to the Anti-Corruption Commission.'
        ]
      },
      {
        heading: 'The best candidate and the best school',
        paragraphs: [
          'The best candidate among the results released to the Ministry was Alfred Farwell Thorpe of the Sierra Leone Grammar School, Murray Town. He sat eight subjects and obtained six A1s, one B3 and one C4, an average grade of 1.63, which the Ministry classed as very good. Second was Silawi Ali (spelled Silawi Alie in some reports) of Kamboi Lebanese Senior Secondary School in Kenema, who also sat eight subjects and obtained four A1s, two B2s and two B3s, an average of 1.75.',
          'The best school was Awada Senior Secondary School in Bo. All 30 of its candidates sat the examination, and 29 of them, 96.7%, obtained at least five credits including English Language and Mathematics, enough for direct entry to a degree programme in Sierra Leone. The school’s average grade was 3.6. The Ministry’s initial ranking left out schools with very small entries and schools where more than 5% of candidates were absent.',
          'The Ministry also congratulated 119 schools where at least 90% of candidates with released results obtained five credits including English and/or Mathematics. It did not publish a full ranked list of schools. For comparison, the best candidate in 2025 was Mariam Roselyne Jalloh of Modern Academy Senior School of Excellence (average 1.78), and the best school was Kamboi Senior Secondary School in Kenema, where all 10 candidates met the university entry requirement.'
        ]
      },
      {
        heading: 'What the government and Parliament have done since',
        paragraphs: [
          'Before the release, the Minister warned that fake social media accounts were impersonating him and asking families for money for results. He said major announcements would come first as video messages in his own voice, and urged parents not to pay anyone who claims to sell results. The genuine results are on WAEC’s result checker and through schools, which receive hard copies.',
          'On results day the Ministry set out its next steps on malpractice: closer monitoring of examinations, faster investigation of withheld results, a new WAEC bill in 2027 to give legal consequences for malpractice and sanctions for institutions, continued investigation of absenteeism, and a unique learner identification number to catch candidates registered at more than one school. The Minister credited the improvement in results to the Free Quality School Education programme and to teacher training and monitoring.'
        ],
        bullets: [
          'Opposition: the day after the results, the Leader of the Opposition, Hon. Abdul Kargbo, called for a clear explanation and timeline for the withheld results, decisions based on evidence and a fair hearing, and a special university admission window for candidates who are later cleared.',
          'Parliament’s education committee summoned the Minister and WAEC officials to explain the English results and the withheld results. Its chair, Hon. Rebecca Yei Kamara, asked MPs to let the Minister present his account first.',
          'On 5 November, after the Minister appeared before the House, the Speaker ordered the release of all withheld results without clear evidence of malpractice, directed the Ministry to involve the education committee and civil society in the investigation, and asked the committee to examine WAEC’s capacity to run public examinations, Sierra Leone Monitor reported. WAEC is to produce a report on why results were withheld and how to prevent a repeat.',
          'The Ministry has announced emergency in-service training for English teachers, according to Sierra Leone Monitor.',
          'The same week, Parliament banned “sign-out” celebrations (shirt-signing, parades and loud processions after final examinations) in schools, colleges and universities.'
        ]
      },
      {
        heading: 'What it means for university admission',
        paragraphs: [
          'Most university courses in Sierra Leone ask for [five credits including English Language](/blog/what-counts-as-a-wassce-credit-for-university-admission), so this year’s English results shut many candidates out. The University of Sierra Leone responded on 2 November: for 2026 results, a D7 pass in English is accepted for its diploma and certificate programmes, and a C6 credit in English is accepted for all degree programmes at Fourah Bay College and IPAM. Entry rules for COMAHS and for the Law degree at Fourah Bay College have not changed. USL’s admission portal lists 30 November 2026 as the undergraduate submission deadline.',
          'Sierra Leone Monitor also reported that the University of Makeni has offered provisional admission, as a one-off for this intake, to candidates with four or more credits in other subjects but no English credit, except for Law and Nursing. Confirm the exact terms with each university before you apply or pay a fee. [Our guide to 2026/2027 university entry requirements](/blog/sierra-leone-university-admission-requirements-2026-2027) lists every university’s rules and official links.'
        ]
      },
      {
        heading: 'What to do now',
        bullets: [
          'Check your result only on WAEC’s official result checker or through your school. [Our step-by-step guide](/blog/how-to-check-wassce-result-sierra-leone) explains the checker and how many times one e-PIN works.',
          'If your result is withheld, check its status on [WAEC Sierra Leone’s irregularities page](https://www.waec-sierra-leone.org/irregularities), stay in touch with your principal, and do not pay anyone who says they can release it. A withheld result cannot be remarked; you have to wait for the investigation.',
          'If you think a grade is wrong, the Minister said you can apply through your school to have the script remarked within 60 days of the release of results, and a fee applies. Counting from 27 October, that runs to about 26 December 2026; your school will confirm the exact date.',
          'If you are one of the 368 candidates whose school owes WAEC its fees, the Minister said: “The candidates did nothing wrong.” Your results will be released once your school pays; ask your school when.',
          'If you are planning to resit, ask your school or WAEC when registration opens for the next WASSCE for private candidates, and start with the subject that blocks the course you want. For most candidates this year, that is [English Language](/wassce/english-language).'
        ]
      }
    ],
    faq: [
      {
        question: 'When were the 2026 WASSCE results released in Sierra Leone?',
        answer: 'The Minister of Basic and Senior Secondary Education, Conrad Sackey, announced them on Tuesday 27 October 2026, live on SLBC. WAEC gave the results to the Ministry on Friday 23 October.'
      },
      {
        question: 'What was the 2026 WASSCE pass rate in Sierra Leone?',
        answer: '91,122 candidates, 64.3% of the 141,810 who sat at least one subject and have results, obtained five or more credits in a single sitting. The paper pass rate, the share of individual subject papers passed, was 81.4%.'
      },
      {
        question: 'How many 2026 WASSCE results were withheld?',
        answer: '47,454: 26,735 girls and 20,719 boys. That is 23.6% of the 200,756 candidates on WAEC’s list, up from 13,237 in 2025. Some may be released after WAEC’s investigation; others may be cancelled.'
      },
      {
        question: 'Who was the best candidate in the 2026 WASSCE?',
        answer: 'Alfred Farwell Thorpe of the Sierra Leone Grammar School, Murray Town, with six A1s, one B3 and one C4 in eight subjects, an average grade of 1.63.'
      },
      {
        question: 'Which school did best in the 2026 WASSCE?',
        answer: 'Awada Senior Secondary School in Bo, where 29 of its 30 candidates obtained five credits including English Language and Mathematics. The Ministry did not publish a full ranking of schools.'
      },
      {
        question: 'Can I ask for a withheld result to be remarked?',
        answer: 'No. Remarking is for candidates who have a result and think a grade is wrong; they apply through their school within 60 days of the release of results. A candidate whose result is withheld has to wait for the outcome of WAEC’s investigation.'
      }
    ],
    sources: [
      { label: 'Sierraloaded: Government of Sierra Leone releases 2026 WASSCE results (27 October 2026)', url: 'https://sierraloaded.sl/news/sierra-leone-releases-2026-wassce-results/' },
      { label: 'Sierra Leone Monitor: Education Minister announces 2026 WASSCE results (27 October 2026)', url: 'https://www.sierraleonemonitor.com/education-minister-announces-wassce-results/' },
      { label: 'AYV News: 2026 WASSCE results, 47,454 withheld, 63.33% fail English (27 October 2026)', url: 'https://ayvnews.com/2026-wassce-results-47454-results-withheld-63-33-fail-english/' },
      { label: 'Sierraloaded: WAEC withholds 47,454 results over suspected malpractice (27 October 2026)', url: 'https://sierraloaded.sl/education/2026-wassce-waec-withholds-47454-results/' },
      { label: 'Sierraloaded: Awada Senior Secondary School named best-performing school (27 October 2026)', url: 'https://sierraloaded.sl/education/awada-school-bo-best-school-2026-wassce/' },
      { label: 'Sierraloaded: Alfred Farwell Thorpe emerges best candidate (27 October 2026)', url: 'https://sierraloaded.sl/news/grammar-school-alfred-thorpe-best-2026-wassce/' },
      { label: 'Sierra Leone Monitor: 368 candidates stranded as five private schools owe WAEC fees (27 October 2026)', url: 'https://www.sierraleonemonitor.com/wassce-candidates-private-schools-waec/' },
      { label: 'Sierra Leone Monitor: Minister Sackey explains how to seek redress (28 October 2026)', url: 'https://www.sierraleonemonitor.com/wassce-grades-minister-sackey-redress/' },
      { label: 'Sierra Leone Monitor: Opposition Leader raises alarm over withheld results (28 October 2026)', url: 'https://www.sierraleonemonitor.com/opposition-leader-withheld-wassce-results/' },
      { label: 'Sierra Leone Monitor: Parliament summons Education Minister (November 2026)', url: 'https://www.sierraleonemonitor.com/parliament-summons-minister-wassce-results/' },
      { label: 'Sierra Leone Monitor: Parliament orders release of results without clear evidence of malpractice (5 November 2026)', url: 'https://www.sierraleonemonitor.com/parliament-orders-release-wassce-results/' },
      { label: 'Sierra Leone Monitor: USL adjusts English Language entry requirements (2 November 2026)', url: 'https://www.sierraleonemonitor.com/usl-adjusts-english-language-requirements/' },
      { label: 'Sierra Leone Monitor: 2025 WASSCE English results hit record low (16 October 2025)', url: 'https://www.sierraleonemonitor.com/wassce-english-language-results/' },
      { label: 'Sierraloaded: Government announces 2025 WASSCE results (16 October 2025)', url: 'https://sierraloaded.sl/news/government-announces-2025-wassce-results/' },
      { label: 'The Sierra Leone Telegraph: What WASSCE exams 2026 is telling Sierra Leone (opinion, 31 October 2026)', url: 'https://www.thesierraleonetelegraph.com/what-wassce-exams-2026-is-telling-sierra-leone/' },
      { label: 'WAEC Sierra Leone online result checker', url: 'https://www.waecsierra-leone.org/' }
    ],
    related: ['how-to-check-wassce-result-sierra-leone', 'sierra-leone-university-admission-requirements-2026-2027', 'what-counts-as-a-wassce-credit-for-university-admission', 'how-to-pass-wassce-english-language'],
    action: { heading: 'English is the credit that decides university entry. Start on it now.', label: 'Practise WASSCE English', href: '/wassce/english-language' }
  }
]
