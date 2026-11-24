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
    seoTitle: '2026 WASSCE Results in Sierra Leone: Pass Rate, Top School',
    title: '2026 WASSCE Results in Sierra Leone: The Figures, the Withheld Results and What Happens Next',
    description: 'Sierra Leone’s 2026 WASSCE results: 64.3% got five credits, 47,454 were withheld and 9.77% got an English credit. The top candidate, top school and next steps.',
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
      { date: '2026-10-30', text: 'The Justice Reform Initiative-SL, a legal and human rights group, gave WAEC and the Ministry 21 days to release results where there is no direct evidence of cheating, or face legal action.' },
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
          'The gap between the two subjects matters because most degree programmes ask for credits in both ([what the English results mean](/blog/wassce-2026-english-results-sierra-leone)). In 2025, only 7,024 candidates had five credits including both English and Mathematics, out of 47,434 with five credits of any kind. The Ministry has not announced the 2026 figure. If the 9.77% is a share of the 141,810 candidates with results, about 13,900 candidates hold an English credit this year, which is the ceiling on how many can meet a rule that requires one.',
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
          'A withheld result is a suspicion, not a verdict. “Withholding does not mean guilty,” Minister Sackey said. WAEC investigates each case; it may release some or all of the results, and it may cancel the results of candidates it finds took part in malpractice. Candidates can check whether their own result is withheld on [WAEC Sierra Leone’s irregularities page](https://www.waec-sierra-leone.org/irregularities), and should stay in close touch with their principal. [Our guide to withheld results](/blog/wassce-result-withheld-2026-sierra-leone) explains the possible outcomes and what to do while you wait.',
          'The Ministry said the Chief Education Officer, the government’s chief nominee to WAEC, would work with the council’s committee to speed up decisions, and that it would ask three respected educationists to observe the committee’s deliberations. It warned that sanctions would not stop at candidates: centre managers, supervisors, invigilators, principals and proprietors found to have helped could also be punished, and principals and proprietors involved in repeated malpractice would be referred to the Anti-Corruption Commission.'
        ]
      },
      {
        heading: 'The best candidate and the best school',
        paragraphs: [
          'The best candidate among the results released to the Ministry was Alfred Farwell Thorpe of the Sierra Leone Grammar School, Murray Town. He sat eight subjects and obtained six A1s, one B3 and one C4, an average grade of 1.63, which the Ministry classed as very good. Second was Silawi Ali (spelled Silawi Alie or Syllawa Alie in some reports) of Kamboi Lebanese Senior Secondary School in Kenema, who also sat eight subjects and obtained four A1s, two B2s and two B3s, an average of 1.75.',
          'The best school was Awada Senior Secondary School in Bo. All 30 of its candidates sat the examination, and 29 of them, 96.7%, obtained at least five credits including English Language and Mathematics, enough for direct entry to a degree programme in Sierra Leone. The school’s average grade was 3.6. The Ministry’s initial ranking left out schools with very small entries and schools where more than 5% of candidates were absent.',
          'The Ministry also congratulated 119 schools where at least 90% of candidates with released results obtained five credits including English and/or Mathematics. It did not publish a full ranked list of schools. [Our list of the best schools and candidates since 2021](/blog/best-wassce-schools-sierra-leone) puts this year in context. For comparison, the best candidate in 2025 was Mariam Roselyne Jalloh of Modern Academy Senior School of Excellence (average 1.78), and the best school was Kamboi Senior Secondary School in Kenema, where all 10 candidates met the university entry requirement.'
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
      { label: 'Sierraloaded: JRI-SL gives WAEC and the Ministry 21 days to release withheld results (31 October 2026)', url: 'https://sierraloaded.sl/local/jri-sl-waec-ministry-21-days-wassce-results/' },
      { label: 'Sierra Leone Monitor: Parliament summons Education Minister (November 2026)', url: 'https://www.sierraleonemonitor.com/parliament-summons-minister-wassce-results/' },
      { label: 'Sierra Leone Monitor: Parliament orders release of results without clear evidence of malpractice (5 November 2026)', url: 'https://www.sierraleonemonitor.com/parliament-orders-release-wassce-results/' },
      { label: 'Sierra Leone Monitor: USL adjusts English Language entry requirements (2 November 2026)', url: 'https://www.sierraleonemonitor.com/usl-adjusts-english-language-requirements/' },
      { label: 'Sierra Leone Monitor: 2025 WASSCE English results hit record low (16 October 2025)', url: 'https://www.sierraleonemonitor.com/wassce-english-language-results/' },
      { label: 'Sierraloaded: Government announces 2025 WASSCE results (16 October 2025)', url: 'https://sierraloaded.sl/news/government-announces-2025-wassce-results/' },
      { label: 'The Sierra Leone Telegraph: What WASSCE exams 2026 is telling Sierra Leone (opinion, 31 October 2026)', url: 'https://www.thesierraleonetelegraph.com/what-wassce-exams-2026-is-telling-sierra-leone/' },
      { label: 'WAEC Sierra Leone online result checker', url: 'https://www.waecsierra-leone.org/' }
    ],
    related: ['wassce-result-withheld-2026-sierra-leone', 'how-to-check-wassce-result-sierra-leone', 'sierra-leone-university-admission-requirements-2026-2027', 'how-to-pass-wassce-english-language'],
    action: { heading: 'English is the credit that decides university entry. Start on it now.', label: 'Practise WASSCE English', href: '/wassce/english-language' }
  },
  {
    slug: 'wassce-result-withheld-2026-sierra-leone',
    seoTitle: 'WASSCE Result Withheld in 2026? What It Means and What to Do',
    title: 'WASSCE Result Withheld in 2026? What It Means, How to Check It and What Happens Next',
    description: 'WAEC withheld 47,454 Sierra Leone WASSCE results in 2026. What withheld means, how to check your status, the possible outcomes and what to do while you wait.',
    category: 'WASSCE results',
    publishedAt: '2026-11-19',
    updatedAt: '2026-11-19',
    readMinutes: 8,
    news: true,
    image: '/img/blog/wassce-2026-withheld-results.webp',
    imageAlt: 'Diagram: a withheld WASSCE result is investigated by WAEC, then cleared and released, cancelled for a subject, or cancelled in full',
    ...OURS,
    keyFacts: [
      { value: '47,454', label: 'candidates with every result withheld' },
      { value: '23.6%', label: 'of the 200,756 entries on WAEC’s list' },
      { value: '26,735', label: 'of them are girls; 20,719 are boys' },
      { value: '13', label: 'categories of suspected malpractice' }
    ],
    intro: 'If the WAEC checker shows your 2026 WASSCE result as withheld, you have not failed and you have not been found guilty of anything. WAEC withholds results while it investigates suspected malpractice, and this year it withheld the results of 47,454 candidates in Sierra Leone, more than three times as many as in 2025. This guide explains what withheld means, how it differs from a result that is missing for another reason, how to check your status, what can happen next and what to do while you wait.',
    updates: [
      { date: '2026-11-19', text: 'We have found no official report that any withheld result has been released, and no published timetable for WAEC’s decisions. The 21-day deadline the Justice Reform Initiative-SL set on 30 October runs out on 20 November.' },
      { date: '2026-11-05', text: 'Parliament ordered the immediate release of withheld results where there is no clear evidence of malpractice, and asked the Ministry for a timeline within four working days, Sierra Leone Monitor reported.' },
      { date: '2026-10-30', text: 'The Justice Reform Initiative-SL gave WAEC and the Ministry 21 days to release results where there is no direct evidence of cheating, and said it would go to court on behalf of families if they did not.' },
      { date: '2026-10-27', text: 'The Ministry announced that 47,454 results had been withheld, up from 13,237 in 2025.' }
    ],
    sections: [
      {
        heading: 'What “withheld” means',
        paragraphs: [
          'WAEC has the authority to withhold a candidate’s results when it suspects examination malpractice. For the 47,454 candidates this year, every subject is withheld, not only the paper under suspicion. The result has not been cancelled. WAEC investigates, then releases some or all of the results, or cancels the results of candidates it finds took part in malpractice.',
          '“Withholding does not mean guilty,” the Minister of Basic and Senior Secondary Education, Conrad Sackey, said. When a whole hall or centre is flagged, candidates who did nothing wrong can be caught alongside those who did. That is why the Justice Reform Initiative-SL, a legal and human rights group, and others have asked for each case to be decided on evidence about the individual candidate.'
        ]
      },
      {
        heading: 'Three reasons a result may not show',
        paragraphs: [
          'Not every missing result is a withheld one. The Ministry’s figures for 2026 describe three different situations, and each has a different next step.'
        ],
        bullets: [
          'Withheld for suspected malpractice: 47,454 candidates. The status page shows the result as withheld. You wait for WAEC’s investigation, and you cannot ask for a withheld result to be remarked.',
          'Your school owes WAEC its fees: 368 candidates at five private schools. The results exist, but WAEC will not release them until the school pays. “The candidates did nothing wrong. The debt belongs to the schools,” the Minister said. Ask your school when it will pay.',
          'You were recorded absent from every paper: 11,492 candidates. If you did sit your papers, tell your principal straight away and ask the school to raise it with WAEC. The Ministry says it is investigating absenteeism.'
        ],
        after: [
          'The five schools whose results were held back over fees are Great High School of Science and Business, Reverend Christian International High School, Royal International School, Globe International and Faith Walk Academy Senior Secondary School. Sierra Leone Monitor reported that together they owe WAEC NLe 114,093, and that the Ministry warned they could lose recognition as examination centres if they do not pay.'
        ]
      },
      {
        heading: 'How to check your status',
        paragraphs: [
          'Check on [WAEC Sierra Leone’s irregularities page](https://www.waec-sierra-leone.org/irregularities), which the Ministry pointed candidates to on results day, or on the official result checker ([our step-by-step guide](/blog/how-to-check-wassce-result-sierra-leone) explains it). Your school also receives the results of its candidates, so your principal will know your status.',
          'The Ministry said it would publish a breakdown of the 13 reasons for withholding on its website and learning platform. We have not found it published yet.',
          'Take a screenshot of the status page that shows the date. If a university or an employer asks why you cannot show a result, it is your evidence that the result is under investigation rather than failed.'
        ]
      },
      {
        heading: 'What WAEC is investigating',
        paragraphs: [
          'The Ministry said results were withheld under 13 categories of suspected malpractice, and named some of them: collusion, sharing answers inside the examination room, and using social media platforms or artificial intelligence to obtain answers and spread them across examination centres.',
          'Sierra Leone Monitor reported that a WAEC summary of 47,525 suspected cases put about half of them, 23,980, under social media offences, with 6,005 involving mobile phones and 3,319 the possession of written materials. Other categories it listed include the same handwriting in different scripts, two answer booklets, impersonation and assault on invigilators. The summary counts cases, so its total is not the same as the number of candidates.',
          'The Ministry has said sanctions will not stop at candidates. Centre managers, supervisors, invigilators, principals and proprietors found to have taken part could also be punished, and principals and proprietors involved in repeated malpractice will be referred to the Anti-Corruption Commission.'
        ]
      },
      {
        heading: 'What can happen to a withheld result',
        paragraphs: [
          'The Ministry has said WAEC may release some or all withheld results after investigation, and may cancel the results of candidates found to have taken part in malpractice. Describing WAEC’s rules, Sierra Leone Monitor reported three possible outcomes: if a candidate is cleared, the results are released in full; a single subject result can be cancelled; or the entire result can be cancelled, which can come with a ban from WAEC examinations for a period.',
          'The decision belongs to the relevant WAEC committee. The Ministry said the Chief Education Officer, who is the government’s chief nominee to WAEC, would work with that committee to speed up its decisions, and that it would ask three respected educationists to observe the committee’s deliberations, for transparency.'
        ]
      },
      {
        heading: 'What Parliament and others have demanded',
        bullets: [
          'Parliament, 5 November: after the Minister appeared before the House, the Speaker, Hon. Segepoh Solomon Thomas, ordered the immediate release of all withheld results without clear evidence of malpractice. He directed the Ministry to involve Parliament’s education committee and civil society in the investigation and to give a timeline for finishing it within four working days, and asked WAEC for a report on why the results were withheld, Sierra Leone Monitor reported.',
          'Justice Reform Initiative-SL, 30 October: a 21-day deadline for WAEC and the Ministry to set up an emergency, transparent review of the 13 categories, release results where there is no direct evidence of cheating, announce a deadline for the investigation and examine the conduct of examination officials. It said it would seek legal redress for families if they did not.',
          'The Leader of the Opposition, Hon. Abdul Kargbo: a clear explanation and timeline, decisions based on evidence and a fair hearing, and a special university admission window for candidates who are later cleared.'
        ],
        after: [
          'As of 19 November we have not found a published timeline, or any announcement that withheld results have been released. We will update this page when that changes.'
        ]
      },
      {
        heading: 'University admission while you wait',
        paragraphs: [
          'Without a result you cannot show that you meet a university’s entry requirement, and the University of Sierra Leone’s portal lists 30 November 2026 as its undergraduate submission deadline. The Opposition Leader has asked the Ministry to arrange a special admission window for candidates who are later cleared. We have not found a university that has announced one.',
          'If you planned to start university this year, contact the admissions office of each university you want before its deadline. Explain that your result is withheld, and ask in writing whether it will accept a late or provisional application. [Our admissions guide](/blog/sierra-leone-university-admission-requirements-2026-2027) links to every university’s official admissions pages.'
        ]
      },
      {
        heading: 'What to do now',
        bullets: [
          'Check your status on the irregularities page and keep a dated screenshot.',
          'Stay in close touch with your principal. The school deals with WAEC for its candidates and will hear about decisions.',
          'If you think you were wrongly caught up, write down what happened in your examination hall while you remember it, and give it to your principal.',
          'Do not pay anyone who says they can release or fix a result. The Minister has warned about fake accounts using his name to ask families for money. Only WAEC can release a result.',
          'Keep studying. If your result is released, you may still want to improve a grade; if it is cancelled, the next step is a later sitting of the WASSCE for private candidates. Ask your school or WAEC when registration opens.'
        ]
      }
    ],
    faq: [
      {
        question: 'Does a withheld WASSCE result mean I failed?',
        answer: 'No. A withheld result has not been failed or cancelled. It means WAEC suspects malpractice and is investigating. It may be released in full.'
      },
      {
        question: 'How long will the investigation take?',
        answer: 'No timeline has been published. On 5 November Parliament asked the Ministry to give one within four working days; as of 19 November we have not found it.'
      },
      {
        question: 'Can I ask for a withheld result to be remarked?',
        answer: 'No. Remarking is for candidates who have a result and think a grade is wrong. A candidate whose result is withheld has to wait for the outcome of WAEC’s investigation.'
      },
      {
        question: 'Can someone pay to have my result released?',
        answer: 'No. Only WAEC can release a withheld result, and it does so after its investigation. Anyone who asks you for money to release or upgrade a result is running a scam.'
      },
      {
        question: 'Will my result be released if I did nothing wrong?',
        answer: 'That is what the investigation decides: if WAEC clears a candidate, the results are released in full. Parliament has also ordered the release of results where there is no clear evidence of malpractice.'
      },
      {
        question: 'I was marked absent, but I sat my papers. What should I do?',
        answer: 'Tell your principal straight away and ask the school to raise it with WAEC. Being recorded absent is different from having a result withheld, and it needs to be corrected through your school.'
      }
    ],
    sources: [
      { label: 'Sierraloaded: How to check if your 2026 WASSCE result has been withheld (27 October 2026)', url: 'https://sierraloaded.sl/education/check-2026-wassce-result-withheld/' },
      { label: 'Sierraloaded: WAEC withholds 47,454 results over suspected malpractice (27 October 2026)', url: 'https://sierraloaded.sl/education/2026-wassce-waec-withholds-47454-results/' },
      { label: 'Sierraloaded: Government of Sierra Leone releases 2026 WASSCE results (27 October 2026)', url: 'https://sierraloaded.sl/news/sierra-leone-releases-2026-wassce-results/' },
      { label: 'Sierra Leone Monitor: 47,454 results withheld over malpractice (27 October 2026)', url: 'https://www.sierraleonemonitor.com/wassce-results-withheld-malpractice/' },
      { label: 'Sierra Leone Monitor: 368 candidates stranded as five private schools owe WAEC fees (27 October 2026)', url: 'https://www.sierraleonemonitor.com/wassce-candidates-private-schools-waec/' },
      { label: 'Sierra Leone Monitor: Minister Sackey explains how to seek redress (28 October 2026)', url: 'https://www.sierraleonemonitor.com/wassce-grades-minister-sackey-redress/' },
      { label: 'Sierra Leone Monitor: Opposition Leader raises alarm over withheld results (28 October 2026)', url: 'https://www.sierraleonemonitor.com/opposition-leader-withheld-wassce-results/' },
      { label: 'Sierraloaded: JRI-SL gives WAEC and the Ministry 21 days to release withheld results (31 October 2026)', url: 'https://sierraloaded.sl/local/jri-sl-waec-ministry-21-days-wassce-results/' },
      { label: 'Sierra Leone Monitor: 78-year-old candidate among 47,454 whose results were withheld, with WAEC’s summary of cases (2 November 2026)', url: 'https://www.sierraleonemonitor.com/wassce-candidate-results-withheld-waec/' },
      { label: 'Sierra Leone Monitor: Parliament orders release of results without clear evidence of malpractice (5 November 2026)', url: 'https://www.sierraleonemonitor.com/parliament-orders-release-wassce-results/' },
      { label: 'The Sierra Leone Telegraph: What WASSCE exams 2026 is telling Sierra Leone (opinion, 31 October 2026)', url: 'https://www.thesierraleonetelegraph.com/what-wassce-exams-2026-is-telling-sierra-leone/' },
      { label: 'WAEC Sierra Leone online result checker', url: 'https://www.waecsierra-leone.org/' }
    ],
    related: ['2026-wassce-results-sierra-leone', 'how-to-check-wassce-result-sierra-leone', 'sierra-leone-university-admission-requirements-2026-2027', 'what-counts-as-a-wassce-credit-for-university-admission'],
    action: { heading: 'Waiting on a result? Keep your subjects fresh for whatever comes next.', label: 'Explore subjects', href: '/wassce/subjects' }
  },
  {
    slug: 'best-wassce-schools-sierra-leone',
    seoTitle: 'Best WASSCE Schools in Sierra Leone: 2026 and Since 2021',
    title: 'The Best WASSCE Schools and Candidates in Sierra Leone, 2021 to 2026',
    description: 'The best WASSCE school and top candidate in Sierra Leone each year since 2021, from the Ministry’s announcements: Awada, Kamboi, Providence and more.',
    category: 'WASSCE results',
    publishedAt: '2026-11-19',
    updatedAt: '2026-11-19',
    readMinutes: 8,
    image: '/img/blog/best-wassce-schools-sierra-leone.webp',
    imageAlt: 'List of the best WASSCE school in Sierra Leone each year: Awada (2026), Kamboi (2025), Dele-Peddle (2024), Providence (2023) and Kamboi (Lebanese) in 2022 and 2021',
    ...OURS,
    keyFacts: [
      { value: 'Awada SSS', label: '2026’s best school, in Bo: 29 of its 30 candidates qualified for a degree' },
      { value: '1.11', label: 'best average grade of the six years: two Providence candidates, 2023' },
      { value: '185 of 185', label: 'Providence candidates who qualified for university in 2023' },
      { value: '119', label: 'schools in 2026 where at least 90% got five credits' }
    ],
    intro: 'Every year, when the Minister of Basic and Senior Secondary Education announces the WASSCE results, the Ministry names the best-performing candidate and school in Sierra Leone. This page collects those announcements from 2021 to 2026 in one place, using the Ministry’s own analyses where they are published and contemporary reports of the announcement where they are not. It also explains how the Ministry ranks schools, and why the school at the top is often a small one.',
    sections: [
      {
        heading: 'The best school and candidate each year',
        paragraphs: [
          'The best school in 2026 was Awada Senior Secondary School in Bo, and the best candidate was Alfred Farwell Thorpe of the Sierra Leone Grammar School, Murray Town. The table lists every year since 2021.'
        ],
        table: {
          caption: 'Best WASSCE school and candidate in Sierra Leone, as announced each year',
          columns: ['Year', 'Best school', 'Best candidate', 'Average'],
          rows: [
            ['2026', 'Awada SSS, Bo', 'Alfred Farwell Thorpe, Sierra Leone Grammar School', '1.63'],
            ['2025', 'Kamboi SSS, Kenema', 'Mariam Roselyne Jalloh, Modern Academy Senior School of Excellence', '1.78'],
            ['2024', 'Dele-Peddle International School, Allen Town', 'Areej Zayid, Naiahcom High School', '1.50*'],
            ['2023', 'Providence International SHS, Freetown', 'Raymonda E. Mammah and Sahr Edward Fillie (joint), Providence International SHS', '1.11'],
            ['2022', 'Kamboi (Lebanese) SSS, Kenema', 'Skaikay Nasma, Kamboi (Lebanese) SSS', '1.63'],
            ['2021', 'Kamboi (Lebanese) SSS, Kenema', 'Momoh Sankoh, Murialdo Secondary School, Port Loko', '1.56']
          ],
          note: 'Average is the candidate’s average grade, where A1 counts 1, B2 counts 2 and so on down to F9, so lower is better. *Not announced for 2024: we worked it out from Areej Zayid’s reported grades (six A1s and two B3s). The 2021 analysis gives Momoh Sankoh’s average as 1.58 in its highlights and 1.56 in its table. Names are as the Ministry or the reports give them; 2022’s top candidate is listed surname first, as in the Ministry’s list.'
        }
      },
      {
        heading: '2026: Awada in Bo, and Thorpe at the Grammar School',
        paragraphs: [
          'All 30 of Awada Senior Secondary School’s candidates sat the examination, and 29 of them, 96.7%, obtained at least five credits including English Language and Mathematics, the requirement for direct entry to a degree programme in Sierra Leone. The school’s average grade was 3.6. In its initial ranking the Ministry left out schools with very small entries and schools where more than 5% of candidates were absent.',
          'Alfred Farwell Thorpe sat eight subjects and obtained six A1s, one B3 and one C4. Second was a candidate from Kamboi Lebanese Senior Secondary School in Kenema, whose name is spelled Silawi Ali, Silawi Alie or Syllawa Alie in different reports, with four A1s, two B2s and two B3s (average 1.75).',
          'The Ministry also congratulated 119 schools where at least 90% of candidates with released results obtained five credits including English and/or Mathematics, but it did not publish their names or a full ranking. [Our report on the 2026 results](/blog/2026-wassce-results-sierra-leone) has the national figures.'
        ]
      },
      {
        heading: '2025: two girls at the top, and Kamboi again',
        paragraphs: [
          'The best candidate in 2025 was Mariam Roselyne Jalloh of Modern Academy Senior School of Excellence, with four A1s, three B2s and two B3s in nine subjects (average 1.78). Second was Russell Afwa Jemis, as the Ministry listed her, of the International Secondary School, Freetown, with six A1s, two B3s and a C5 (average 1.89).',
          'The best school was Kamboi Senior Secondary School in Kenema, where all ten candidates obtained five credits including English Language and Mathematics. Kabala Christian Secondary School also had every candidate meet the university entrance requirement.'
        ]
      },
      {
        heading: '2024: Dele-Peddle and Naiahcom',
        paragraphs: [
          'Sierraloaded reported, from the Ministry’s 2024 figures, that the best school was Dele-Peddle International School in Allen Town, where all 17 candidates met the university requirement, and that the best candidate was Areej Zayid, a science student at Naiahcom High School, with six A1s and two B3s. The best boy was Alpha Ibrahim Bah of St Edward’s Secondary School.',
          'WAEC runs its own awards, which rank candidates differently, so its winners do not always match the Ministry’s. At its April 2025 ceremony WAEC gave first place for the 2024 WASSCE to Jared Augustus Sankoh-Hughes of the Sierra Leone Grammar School.'
        ]
      },
      {
        heading: '2023: Providence, 185 out of 185',
        paragraphs: [
          'Providence International Senior High School in Freetown had results released for 185 candidates, and every one of them obtained five credits including English Language and Mathematics. Two of its candidates shared first place nationally: Raymonda E. Mammah and Sahr Edward Fillie each sat nine subjects and obtained eight A1s and a B2, an average of 1.11, the best of the six years on this page. The Ministry noted that 16 candidates in 2023 had a better average than the best in 2022.'
        ]
      },
      {
        heading: '2022 and 2021: Kamboi (Lebanese) in Kenema',
        paragraphs: [
          'The Ministry published fuller rankings in 2021 and 2022. In 2022 the top student was a girl who passed all eight of her subjects with an average of 1.63, and the top school had every candidate meet the university requirement with an average grade of 2.33. The Ministry’s list of top schools by average grade that year was led by Kamboi (Lebanese) Senior Secondary School in Kenema.'
        ],
        bullets: [
          'Top schools by average grade, 2022, in the Ministry’s order: Kamboi (Lebanese) SSS, Kenema; Science World SSS, Freetown; Providence International Senior High School, Freetown; Hammond International Academy Secondary School, Freetown; Mallory Jansen Memorial High School, Ngolala (Bonthe); Pentecostal SSS, Aberdeen Ferry Road; Furlange School of Excellence (EducAid) SSS, Port Loko; Dele-Peddle International High School, Freetown; Extra Mile Oba Funkia Community SSS, Goderich.',
          'Top four candidates, 2022: Skaikay Nasma, Kamboi (Lebanese) SSS (six A grades); Kallon Khadijah Hassan, Kenema Community Initiative Academy SSS; Nchezor Peter Onyeka, Providence International Senior High School; and Kpaka Julius Alie, Saline High School, Freetown (five A grades each).'
        ],
        table: {
          caption: 'Top 10 WASSCE schools in 2021, by share of candidates meeting university requirements',
          columns: ['School', 'Sat', 'University', 'Average'],
          rows: [
            ['Kamboi (Lebanese) SSS, Kenema', '6', '100%', '2.90'],
            ['Government SS for Boys, Magburaka', '95', '100%', '3.48'],
            ['Kabala Christian Secondary, Kabala', '52', '100%', '3.82'],
            ['Pathway Academy SS, Benguema', '38', '100%', '4.52'],
            ['St. Ambrose SSS, Allen Town', '37', '94.6%', '4.63'],
            ['International Islamic SSS, Freetown', '41', '92.7%', '4.85'],
            ['EducAid Sierra Leone SS, Freetown', '52', '92.3%', '4.51'],
            ['International College of Makeni', '37', '89.2%', '3.55'],
            ['Dele-Peddle Int. High School, Freetown', '24', '87.5%', '4.21'],
            ['Browndel High School, Freetown', '14', '78.6%', '4.21']
          ],
          note: 'From the Ministry’s 2021 WASSCE results analysis. Only schools where every candidate obtained five credits in any subjects were ranked. “University” is the share who met the requirement for direct entry to a degree. Three of the ten, all in the top five, are government-assisted.'
        },
        after: [
          'In 2021 the top student was Momoh Sankoh of Murialdo Secondary School in Port Loko, a government-assisted school, who sat nine subjects and obtained six A1s. The Ministry noted that 67% of the top students in each district that year attended government-assisted schools.'
        ]
      },
      {
        heading: 'Why the best school is often a small one',
        paragraphs: [
          'The Ministry ranks schools by the share of their candidates who meet the university entry requirement of five credits including English Language and Mathematics, and uses the average grade to separate schools on the same share. A share is easier to keep at 100% with six or ten candidates than with a hundred. The winners in 2021 (6 candidates), 2024 (17) and 2025 (10) were all small, which makes Providence’s 185 out of 185 in 2023 the most striking result on this page.',
          'The rules have tightened. In 2021 only schools where every candidate obtained the five-credit benchmark were ranked; in 2026 the Ministry also left out schools with very small entries and schools where more than 5% of candidates were absent, so that a school cannot improve its share by keeping weaker candidates away from the examination.'
        ]
      },
      {
        heading: 'The schools that keep coming back',
        bullets: [
          'Kamboi (Lebanese) Senior Secondary School, Kenema: top school in 2021 and 2022, and the school of 2026’s second-best candidate. A Kamboi Senior Secondary School in Kenema was also named best school in 2025.',
          'Providence International Senior High School, Freetown: third in 2022, best school in 2023 with both joint top candidates, and the school of one of 2022’s top four candidates.',
          'Dele-Peddle International High School, Freetown: in the top ten in 2021 and 2022, and best school in 2024.',
          'Sierra Leone Grammar School, Murray Town: WAEC’s top 2024 WASSCE award and the best candidate of 2026.',
          'Kabala Christian Secondary School, Kabala: third in 2021, and every candidate qualified for university in 2025.'
        ]
      },
      {
        heading: 'What this means if you are choosing a school or studying now',
        paragraphs: [
          'A school’s place in one year’s ranking says less than it seems, because so few candidates decide it. A better test is whether a school appears near the top year after year, and how many of its candidates it enters. Ask a school how many of its candidates met the university requirement last year, out of how many it entered.',
          'The candidates at the top of these lists have one thing in common: credits in both English Language and Mathematics. In 2026 only 9.77% of candidates earned an English credit, so English is where most candidates have the most to gain. [Our guide to the three English papers](/blog/how-to-pass-wassce-english-language) is a good place to start.'
        ]
      }
    ],
    faq: [
      {
        question: 'Which school was the best in the 2026 WASSCE in Sierra Leone?',
        answer: 'Awada Senior Secondary School in Bo. All 30 of its candidates sat the examination and 29 obtained five credits including English Language and Mathematics.'
      },
      {
        question: 'Who was the best WASSCE candidate in Sierra Leone in 2026?',
        answer: 'Alfred Farwell Thorpe of the Sierra Leone Grammar School, Murray Town, with six A1s, one B3 and one C4 in eight subjects, an average grade of 1.63.'
      },
      {
        question: 'Which school has been named best most often?',
        answer: 'Kamboi (Lebanese) Senior Secondary School in Kenema led the Ministry’s rankings in 2021 and 2022, and a Kamboi Senior Secondary School in Kenema was named best school in 2025.'
      },
      {
        question: 'How does the Ministry decide the best school?',
        answer: 'By the share of a school’s candidates who obtain five credits including English Language and Mathematics, with the average grade used to separate schools. In 2026 it left out schools with very small entries and those where more than 5% of candidates were absent.'
      },
      {
        question: 'Is there a full ranking of every school for 2026?',
        answer: 'Not yet. The Ministry congratulated 119 schools where at least 90% of candidates obtained five credits, but it has not published their names or a full ranking.'
      }
    ],
    sources: [
      { label: 'Ministry of Basic and Senior Secondary Education: 2021 WASSCE results analysis (PDF)', url: 'https://mbsse.gov.sl/wp-content/uploads/2022/04/2021-West-African-Senior-School-Certificate-Examination-Analysis_rev27March2022.pdf' },
      { label: 'Ministry of Basic and Senior Secondary Education: Number of candidates sitting WASSCE increased by 479%, 2018 to 2022', url: 'https://mbsse.gov.sl/number-of-candidates-sitting-wassce-increased-by-479-2018-2022/' },
      { label: 'Sierraloaded: Sierra Leone government releases 2023 WASSCE results (2 October 2023)', url: 'https://sierraloaded.sl/education/sierra-leone-government-releases-2023-wassce-results/' },
      { label: 'Sierraloaded: Providence International Senior High School tops WASSCE (2 October 2023)', url: 'https://sierraloaded.sl/education/providence-senior-high-school-tops-wassce-2023/' },
      { label: 'Sierraloaded: WASSCE 2024 statistics show girls performing better than boys (12 October 2024)', url: 'https://sierraloaded.sl/education/wassce-2024-statistics-girls-better-than-boys/' },
      { label: 'Sierraloaded: WAEC honours top performers of 2023 and 2024 public exams (30 April 2025)', url: 'https://sierraloaded.sl/news/waec-candidates-2023-2024-public-examinations/' },
      { label: 'AYV News: Female pupils, Kenema top 2025 WASSCE (17 October 2025)', url: 'https://ayvnews.com/female-pupils-kenema-top-2025-wassce/' },
      { label: 'Sierraloaded: Government announces 2025 WASSCE results (16 October 2025)', url: 'https://sierraloaded.sl/news/government-announces-2025-wassce-results/' },
      { label: 'Sierraloaded: Awada Senior Secondary School named best-performing school in 2026 (27 October 2026)', url: 'https://sierraloaded.sl/education/awada-school-bo-best-school-2026-wassce/' },
      { label: 'Sierraloaded: Alfred Farwell Thorpe emerges best candidate in 2026 (27 October 2026)', url: 'https://sierraloaded.sl/news/grammar-school-alfred-thorpe-best-2026-wassce/' },
      { label: 'The Calabash: Thorpe best pupil and Awada best school as 47,454 results withheld (28 October 2026)', url: 'https://thecalabashnewspaper.com/archives/65743' }
    ],
    related: ['2026-wassce-results-sierra-leone', 'what-counts-as-a-wassce-credit-for-university-admission', 'how-to-pass-wassce-english-language', 'sierra-leone-university-admission-requirements-2026-2027'],
    action: { heading: 'The top candidates all have credits in English and Maths. Start with yours.', label: 'Explore subjects', href: '/wassce/subjects' }
  },
  {
    slug: 'wassce-2026-english-results-sierra-leone',
    seoTitle: 'WASSCE English 2026: 9.77% Credit and New University Rules',
    title: '2026 WASSCE English Results: Why Fewer Than One in Ten Got a Credit, and What Universities Are Changing',
    description: 'Only 9.77% of 2026 WASSCE candidates in Sierra Leone got an English credit. The figures, USL’s new entry rule, why results keep falling and what to do next.',
    category: 'WASSCE results',
    publishedAt: '2026-11-19',
    updatedAt: '2026-11-19',
    readMinutes: 9,
    news: true,
    image: '/img/blog/wassce-2026-english-results.webp',
    imageAlt: 'Bar chart of the share of Sierra Leone WASSCE candidates with an English Language credit: 17% in 2023, 19.7% in 2024 (announced as a pass rate), 11.77% in 2025 and 9.77% in 2026',
    ...OURS,
    keyFacts: [
      { value: '9.77%', label: 'of candidates got a credit (A1 to C6) in English Language' },
      { value: '63.33%', label: 'failed English Language' },
      { value: '62.15%', label: 'got a credit in Mathematics, for comparison' },
      { value: 'D7', label: 'now accepted in English by USL for diplomas and certificates' }
    ],
    intro: 'English Language decided more futures than any other subject in the 2026 WASSCE. Only 9.77% of candidates in Sierra Leone earned a credit in it, down from 11.77% in 2025, and 63.33% failed it, while Mathematics improved to 62.15%. Because almost every degree course asks for an English credit, the University of Sierra Leone has changed its entry rule for this year’s results, Parliament has summoned the Minister, and the Ministry has promised emergency training for English teachers. This article sets out the figures, the changes, the explanations on offer and the options for candidates without an English credit.',
    updates: [
      { date: '2026-11-05', text: 'The Minister appeared before Parliament, whose education committee had summoned him over the English results and the withheld results. The Ministry has announced emergency in-service training for English teachers, Sierra Leone Monitor reported.' },
      { date: '2026-11-02', text: 'The University of Sierra Leone’s Senate changed its English Language requirement for 2026 results.' },
      { date: '2026-10-27', text: 'The Ministry announced the results: 9.77% of candidates obtained an English credit and 63.33% failed the subject.' }
    ],
    sections: [
      {
        heading: 'What the 2026 English results show',
        paragraphs: [
          'A credit in WASSCE is a grade from A1 to C6; D7 and E8 are passes, and F9 is a fail. In 2026, 9.77% of candidates obtained a credit in English Language and 63.33% failed it, which leaves about 27% with a D7 or E8 pass (our calculation from the two announced figures). In Mathematics, 62.15% obtained a credit.',
          'The Ministry did not say which group of candidates these percentages are shares of. If it is the 141,810 candidates who sat at least one subject and have results, about 13,900 candidates hold an English credit this year, which is the most who can meet a rule that requires one.'
        ],
        table: {
          caption: 'English Language results in the WASSCE in Sierra Leone, as announced',
          columns: ['Year', 'Credit (A1 to C6)', 'Failed (F9)'],
          rows: [
            ['2023', '17%', '–'],
            ['2024', '19.7%*', '–'],
            ['2025', '11.77%', '63.02%'],
            ['2026', '9.77%', '63.33%']
          ],
          note: '*The Minister announced 2024’s figure as a “pass rate” in English. He used the same term for Mathematics, whose 2024 figure (46%) matches the 46.3% credit rate reported a year later, so it is most likely a credit rate. At the March 2026 English conference the Ministry said the credit rate had fallen from 19.71% to 11.77% by 2025; the report of the conference gives the starting year as 2021. “–” means the figure was not announced.'
        }
      },
      {
        heading: 'Why one subject matters so much',
        paragraphs: [
          'Most degree programmes in Sierra Leone ask for five credits including English Language, and many also ask for Mathematics. A candidate with excellent results in every other subject can still be shut out by English. In 2025, only 7,024 candidates had five credits including both English and Mathematics, out of 47,434 with five credits of any kind.',
          'The Deputy Minister of Technical and Higher Education, Sarjoh Aziz-Kamara, made the same point at the Ministry’s national English conference in March: many students who pass their other subjects fail to meet the English requirement, and that limits access to tertiary education. [Our guide to WASSCE credits](/blog/what-counts-as-a-wassce-credit-for-university-admission) explains how universities count them.'
        ]
      },
      {
        heading: 'What universities are changing',
        paragraphs: [
          'On 2 November the Executive Committee of the University of Sierra Leone’s Senate revised its English Language requirement for candidates presenting 2026 results, after considering four options put forward by the University Registrar. The Vice-Chancellor, Professor Aiah Randolph Lebbie, said the university remained committed to quality and standards.'
        ],
        table: {
          caption: 'University of Sierra Leone: English Language grade accepted with 2026 WASSCE results',
          columns: ['Programmes', 'English grade accepted'],
          rows: [
            ['Degree programmes at Fourah Bay College and IPAM', 'C6 (a credit)'],
            ['Diploma and certificate programmes', 'D7 (a pass)'],
            ['All programmes at COMAHS', 'Unchanged'],
            ['Bachelor of Laws (LLB) at Fourah Bay College', 'Unchanged']
          ],
          note: 'As reported by Sierra Leone Monitor. The change applies to 2026 WASSCE results. Check the programme’s full requirements on USL’s admission portal, which lists 30 November 2026 as the undergraduate deadline.'
        },
        after: [
          'Sierra Leone Monitor also reported that the University of Makeni has offered provisional admission, as a one-off for this intake, to candidates with four or more credits in other subjects, except for Law and Nursing. We have found no change at Njala University, Ernest Bai Koroma University of Science and Technology or Milton Margai Technical University, whose published requirements still include an English credit for degrees. At the March conference the Ministry said it was working with the Ministry of Technical and Higher Education on pathways into tertiary education, with intensive English remediation, for students who passed other subjects but failed English. We have not found details of those pathways yet.'
        ]
      },
      {
        heading: 'Why English results keep falling',
        paragraphs: [
          'There is no single official explanation, but the people closest to the problem point to the same few causes. These are their views, attributed to each.'
        ],
        bullets: [
          'The Ministry: at its national English conference on 30 and 31 March 2026, the Minister, Conrad Sackey, called the situation a “foundational wound” and blamed gaps in early literacy. Participants cited a 2014 assessment in which 97.4% of Primary 2 pupils could not recognise a single letter sound, and WAEC data showing the Southern Region with some of the lowest pass rates and Pujehun District as a critical area.',
          'University lecturers: on AYV, Sahr Jimissa, acting head of the Language Department at Milton Margai Technical University, said too few English teachers are trained to teach the language, and that knowing English is not the same as knowing how to teach it. Ambrose T. Rogers, a senior lecturer in language studies at Fourah Bay College, said turning teacher-training colleges such as Bo Teachers College into universities had weakened the focus on preparing teachers.',
          'Parliament: the chair of the education committee, Hon. Rebecca Yei Kamara, told the March conference she was concerned about a declining reading culture, social media distractions and unqualified teachers in classrooms.',
          'An education commentator: in The Sierra Leone Telegraph, Dr Mohamed Ibrahim Justice Ganawah noted that pupils and teachers speak Krio far more than English in school, and cited a 2020 Education Commission study which found that in 2019 one junior secondary school in five had no English specialist. He also argued that the widening gap with Mathematics should be checked against centre-level data, since short answers travel by phone more easily than essays.'
        ]
      },
      {
        heading: 'What the government has promised',
        bullets: [
          'A roadmap from the March conference built on five pillars: data-driven diagnosis, immediate remedial help, reforms to higher-education admissions, long-term teacher development, and stronger monitoring and accountability. The Minister said the outcomes would be written up as a “living document” to guide policy.',
          'Emergency in-service training for English teachers, announced after the 2026 results, according to Sierra Leone Monitor.',
          'Private partners, including the Orange Foundation, United Bank for Africa and HCD Plus, supporting after-school learning, digital platforms and teacher training, according to The Calabash.',
          'Parliament’s scrutiny: the education committee summoned the Minister and WAEC to explain the English results, and the Minister appeared before the House on 5 November.'
        ]
      },
      {
        heading: 'If you did not get an English credit',
        bullets: [
          'Check whether a diploma or certificate route accepts your grade. USL now accepts a D7 in English for its diplomas and certificates with 2026 results.',
          'Plan a resit of English alone. Many degree programmes accept credits from up to two sittings (USL asks for five credits in no more than two), so an English credit from a later sitting can be combined with this year’s other credits. Confirm the rule for your programme before you register.',
          'If you think your English grade is wrong, ask your school about a remark. The Minister said applications go through the school within 60 days of the release of results, and a fee applies.',
          'Ask the universities you want about provisional or foundation routes before their deadlines, and get any offer in writing.'
        ]
      },
      {
        heading: 'How to prepare for English next time',
        paragraphs: [
          'WASSCE English Language has three papers. Paper 1 is 80 multiple-choice questions on vocabulary and grammar. Paper 2, the essay, comprehension and summary, carries 100 of the 170 marks. Paper 3 is oral English, which candidates in Sierra Leone take as a listening comprehension test. Give Paper 2 most of your time: write a timed essay of at least 450 words every week, practise summaries in your own words, and read something in English every day, because comprehension and summary reward readers.',
          '[Our guide to WASSCE English Language](/blog/how-to-pass-wassce-english-language) explains what each paper wants, and the [English Language lessons](/wassce/english-language) cover every topic in the syllabus with practice questions.'
        ]
      }
    ],
    faq: [
      {
        question: 'What was the WASSCE English pass rate in Sierra Leone in 2026?',
        answer: '9.77% of candidates obtained a credit (A1 to C6) and 63.33% failed. About 27% obtained a pass grade, D7 or E8.'
      },
      {
        question: 'Can I get into the University of Sierra Leone without an English credit?',
        answer: 'For diplomas and certificates, yes: with 2026 results USL accepts a D7 pass in English. Degree programmes at Fourah Bay College and IPAM still need at least C6, and the rules for COMAHS and the Law degree have not changed.'
      },
      {
        question: 'Can I resit only English and keep my other results?',
        answer: 'Usually. Many degree programmes accept credits from up to two sittings, so an English credit from a later sitting can be combined with this year’s credits. Check the rule for the exact programme first.'
      },
      {
        question: 'Which grades count as a credit in WASSCE English?',
        answer: 'A1, B2, B3, C4, C5 and C6. D7 and E8 are passes but not credits, and F9 is a fail.'
      },
      {
        question: 'Why are WASSCE English results getting worse?',
        answer: 'The Ministry points to weak early literacy; university lecturers point to a shortage of trained English teachers; MPs and commentators add a declining reading culture and how rarely pupils use English outside lessons. There is no official study of the 2026 results yet.'
      }
    ],
    sources: [
      { label: 'Sierraloaded: Government of Sierra Leone releases 2026 WASSCE results (27 October 2026)', url: 'https://sierraloaded.sl/news/sierra-leone-releases-2026-wassce-results/' },
      { label: 'AYV News: 2026 WASSCE results, 47,454 withheld, 63.33% fail English (27 October 2026)', url: 'https://ayvnews.com/2026-wassce-results-47454-results-withheld-63-33-fail-english/' },
      { label: 'Sierra Leone Monitor: USL adjusts English Language entry requirements (2 November 2026)', url: 'https://www.sierraleonemonitor.com/usl-adjusts-english-language-requirements/' },
      { label: 'Sierra Leone Monitor: Parliament summons Education Minister over English failure and withheld results (November 2026)', url: 'https://www.sierraleonemonitor.com/parliament-summons-minister-wassce-results/' },
      { label: 'AYV News: WAEC under fire, but is Sierra Leone’s education system the real problem? (7 November 2026)', url: 'https://ayvnews.com/waec-under-fire-but-is-sierra-leones-education-system-the-real-problem/' },
      { label: 'The Calabash: MBSSE concludes national English conference, unveils reform agenda (1 April 2026)', url: 'https://thecalabashnewspaper.com/?p=58990' },
      { label: 'The Calabash: Partners support national drive to tackle English Language crisis (22 April 2026)', url: 'https://thecalabashnewspaper.com/?p=59539' },
      { label: 'The Sierra Leone Telegraph: What WASSCE exams 2026 is telling Sierra Leone (opinion, 31 October 2026)', url: 'https://www.thesierraleonetelegraph.com/what-wassce-exams-2026-is-telling-sierra-leone/' },
      { label: 'Sierra Leone Monitor: 2025 WASSCE English results hit record low (16 October 2025)', url: 'https://www.sierraleonemonitor.com/wassce-english-language-results/' },
      { label: 'Sierraloaded: Sierra Leone government releases 2023 WASSCE results (2 October 2023)', url: 'https://sierraloaded.sl/education/sierra-leone-government-releases-2023-wassce-results/' },
      { label: 'AYV News: WASSCE 2024 results announcement (11 October 2024)', url: 'https://ayvnews.com/wassce-2024-220-pupils-met-university-requirements-27097-results-withheld/' },
      { label: 'Njala University: undergraduate admission requirements', url: 'https://app.njala.edu.sl/admissions/requirements' }
    ],
    related: ['how-to-pass-wassce-english-language', '2026-wassce-results-sierra-leone', 'what-counts-as-a-wassce-credit-for-university-admission', 'sierra-leone-university-admission-requirements-2026-2027'],
    action: { heading: 'Resitting English? Practise every paper, topic by topic.', label: 'Practise WASSCE English', href: '/wassce/english-language' }
  }
]
