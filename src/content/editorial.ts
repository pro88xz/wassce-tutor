export type EditorialSection = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export type EditorialSource = { label: string; url: string }

export type UniversityGuide = {
  slug: string
  name: string
  shortName: string
  location: string
  summary: string
  image: string
  imageAlt: string
  imageCredit: string
  officialUrl: string
  admissionsUrl: string
  applicationUrl?: string
  status: string
  statusNote: string
  requirements: string[]
  programmes: string[]
  application: string[]
  fees?: string
  deadline?: string
  sources: EditorialSource[]
  updatedAt: string
}

export const UNIVERSITY_GUIDES: UniversityGuide[] = [
  {
    slug: 'university-of-sierra-leone',
    name: 'University of Sierra Leone',
    shortName: 'USL',
    location: 'Freetown, Western Area',
    summary: 'A public university system comprising Fourah Bay College (FBC), the Institute of Public Administration and Management (IPAM), the College of Medicine and Allied Health Sciences (COMAHS), and postgraduate studies.',
    image: 'https://usl.edu.sl/assets/images/bg.jpeg',
    imageAlt: 'University of Sierra Leone campus imagery from its official website',
    imageCredit: 'University of Sierra Leone — official website',
    imageSourceUrl: 'https://usl.edu.sl/',
    officialUrl: 'https://usl.edu.sl/',
    admissionsUrl: 'https://admissions.usl.edu.sl/university-entry-requirements',
    applicationUrl: 'https://admissions.usl.edu.sl/',
    status: '2026/2027 admissions information published',
    statusNote: 'The current admission portal states Monday 30 November 2026 as the undergraduate submission deadline and says the portal shuts at 12:00pm on Thursday 10 December 2026. A separate USL admissions page still displays an earlier September deadline. Because the university pages conflict, confirm the deadline directly with Central Admissions before paying or submitting.',
    requirements: [
      'Degree programmes: five credits in no more than two sittings, with at least C6 in English Language. Faculty and department requirements also apply.',
      'Diploma programmes: four credits, including at least C6 in English Language.',
      'Certificate programmes: three credits, including at least C6 in English Language.',
      'The 2026/2027 prospectus lists programme-specific subject combinations. For example, science and engineering routes require relevant science and mathematics subjects; do not rely on the five-credit minimum alone.'
    ],
    programmes: [
      'Fourah Bay College: arts and humanities, communication and media, engineering and architecture, pure and applied sciences, economics and development studies, social sciences and law.',
      'IPAM: public administration, management, business and related professional study routes. Check the current programme catalogue for exact course availability.',
      'COMAHS: medicine and surgery, nursing and allied health programmes, and other health-science routes subject to faculty-specific entry criteria.',
      'Postgraduate study, including selected online master’s programmes listed in the current admissions notice.'
    ],
    application: [
      'Read the current university entry requirements and the faculty section of the 2026/2027 prospectus.',
      'Use the official admissions portal to create an account and follow its payment instructions.',
      'Complete the online application and upload the documents requested for your selected programme.',
      'Monitor the portal and email for application status and any provisional offer.'
    ],
    fees: 'The USL admissions page lists an undergraduate application fee of NLe 500 and a postgraduate application fee of NLe 600 for the 2026/2027 cycle. Confirm the amount and approved payment channels on the portal before paying.',
    deadline: 'Portal page: 30 November 2026 for undergraduate submissions; portal closure notice: 10 December 2026 at 12:00pm. Conflicting September dates remain on another official page.',
    sources: [
      { label: 'USL 2026/2027 entry requirements (official PDF)', url: 'https://admissions.usl.edu.sl/sites/default/files/2026-08/usl-entry-requirement-2026-2027.pdf' },
      { label: 'USL Admission Portal — University Entry Requirements', url: 'https://admissions.usl.edu.sl/university-entry-requirements' },
      { label: 'USL Admission Process and application fees', url: 'https://usl.edu.sl/admissions' },
      { label: 'USL programmes', url: 'https://usl.edu.sl/programs' }
    ],
    updatedAt: '2026-11-08'
  },
  {
    slug: 'njala-university',
    name: 'Njala University',
    shortName: 'Njala',
    location: 'Njala and Bo, with additional teaching locations',
    summary: 'A public university with undergraduate and postgraduate study across agriculture, basic sciences, environmental sciences, natural resources, technology, veterinary medicine, public health, nursing, medicine and education.',
    image: 'https://njala.edu.sl/sites/default/files/Njala_Congregation_2026_Slider.jpg',
    imageAlt: 'Njala University congregation, official university photograph',
    imageCredit: 'Njala University — official website',
    imageSourceUrl: 'https://njala.edu.sl/',
    officialUrl: 'https://njala.edu.sl/',
    admissionsUrl: 'https://njala.edu.sl/admissions/undergraduate-admissions',
    applicationUrl: 'https://misnjala.edu.sl/apply',
    status: '2026/2027 undergraduate admissions information published',
    statusNote: 'The official undergraduate admissions page states that applications are open for 2026/2027 and gives 13 November 2026 as the submission deadline. A separate 2026/2027 programme PDF contains an older 31 August deadline. Use the live admissions page and application portal for the current deadline, and verify before paying.',
    requirements: [
      'Undergraduate degree programmes: five WASSCE credits or equivalent, including English Language, in not more than two sittings.',
      'School and departmental requirements may add subject-specific conditions. Check the entry rules for the exact programme.',
      'Higher Diploma in Nursing (SRN) and Community Health and Clinical Sciences (CHO): five WASSCE credits including English Language, in not more than two sittings; the CHO page also describes an alternative route for qualified Community Health Assistants with five years’ experience.',
      'Diploma programmes: three WASSCE credits. Certificate programmes: two WASSCE credits.'
    ],
    programmes: [
      'Agriculture and food sciences: agriculture, agribusiness, animal science, crop science, nutrition and dietetics.',
      'Basic and environmental sciences: biological sciences, chemistry, physics, mathematics, statistics, geography and environmental management.',
      'Natural resources and technology: forestry, fisheries, wildlife, computer science, information technology and engineering-related programmes.',
      'Bo campus health and education routes include public health, nursing, medicine and surgery, medical laboratory sciences and education.'
    ],
    application: [
      'Create an account on the official Njala admissions portal with a valid email address and verify it.',
      'Log in to receive your registration number and application-fee invoice.',
      'Pay through a payment channel shown by the university, then return to the portal to complete and submit the form.',
      'Prepare electronic copies of your birth certificate or sworn declaration, WASSCE/GCE certificate, school-leaving testimonial, passport photograph and payment evidence.'
    ],
    fees: 'The official page lists NLe 500 for undergraduate application processing. Postgraduate fees and current payment instructions should be checked on the portal.',
    deadline: '13 November 2026, as stated on Njala University’s official undergraduate admissions page.',
    sources: [
      { label: 'Njala University — Undergraduate Admissions', url: 'https://njala.edu.sl/admissions/undergraduate-admissions' },
      { label: 'Njala University — Application Procedure', url: 'https://njala.edu.sl/admissions/application-procedure' },
      { label: 'Njala University — 2026/2027 programmes PDF', url: 'https://njala.edu.sl/sites/default/files/NU_Programmes_2026-2027.pdf' },
      { label: 'Njala University application portal', url: 'https://misnjala.edu.sl/apply' }
    ],
    updatedAt: '2026-11-08'
  },
  {
    slug: 'eastern-technical-university',
    name: 'Eastern Technical University of Sierra Leone',
    shortName: 'ETU-SL',
    location: 'Kenema, with campuses and teaching locations across the Eastern Province',
    summary: 'A multi-campus technical university offering engineering, computing, applied sciences, vocational and skills development, health, agriculture and natural-resource programmes.',
    image: 'https://i.ibb.co/5m2JBwZ/IMG-0243.jpg',
    imageAlt: 'Students engaged in research, as shown on the official ETU-SL website',
    imageCredit: 'Eastern Technical University of Sierra Leone — official website',
    imageSourceUrl: 'https://etusl.edu.sl/',
    officialUrl: 'https://etusl.edu.sl/',
    admissionsUrl: 'https://etusl.edu.sl/',
    applicationUrl: 'https://app.etusl.edu.sl/',
    status: '2026/2027 prospectus published; application window requires confirmation',
    statusNote: 'The official website advertises 2026/2027 admissions as open. However, the downloadable 2026/2027 advertisement states that online forms were available from 3 August to 20 September 2026. Those dates have passed. Contact the admissions office or check the portal to confirm whether late applications or a new window are available.',
    requirements: [
      'Degree programmes: five WASSCE credits including English Language, in not more than two sittings. Faculty and departmental subject requirements also apply.',
      'HND/HTC holders may qualify for specified routes with four WASSCE credits including English and/or Mathematics, depending on the department.',
      'Higher Diploma: generally four credits including English and/or Mathematics, or the specified NVQ route.',
      'Ordinary Diploma: generally three credits including English Language, or the specified NVQ route. Technical Certificate, vocational and teacher-training routes have separate criteria.'
    ],
    programmes: [
      'Engineering and innovation: civil and environmental, electrical and electronic, mining, mechanical and manufacturing engineering.',
      'Technology and computing: computer science, data science, information systems management, renewable energy and building construction.',
      'Applied sciences: biological science, chemistry, physics, geography and environmental science.',
      'Vocational and skills development, nursing, public health, allied health, agriculture and natural-resource management.'
    ],
    application: [
      'Read the 2026/2027 admission advertisement and the specific requirements for the course you want.',
      'Use the official online application portal and follow its current instructions.',
      'The published advertisement lists a NLe 500 undergraduate processing fee and requires a functional email address, identification, passport photograph, birth certificate or affidavit, school-leaving testimonial and academic records.',
      'Confirm the current application window and payment instructions directly with ETU-SL before sending money.'
    ],
    fees: 'The 2026/2027 advertisement lists a NLe 500 undergraduate application processing fee. Confirm that the same fee and payment channels remain active for late or current applications.',
    deadline: 'The PDF states 20 September 2026 for the published application window; the homepage later advertises admissions as open. Current status is unresolved.',
    sources: [
      { label: 'ETU-SL official website and admissions notice', url: 'https://etusl.edu.sl/' },
      { label: 'ETU-SL 2026/2027 admission advertisement (official PDF)', url: 'https://etusl.edu.sl/wp-content/uploads/2026/08/ETU-SL-2026-2027-ADMISSION-ADVERTISEMENT-FINAL.pdf' },
      { label: 'ETU-SL online application portal', url: 'https://app.etusl.edu.sl/' }
    ],
    updatedAt: '2026-11-08'
  },
  {
    slug: 'milton-margai-technical-university',
    name: 'Milton Margai Technical University',
    shortName: 'MMTU',
    location: 'Goderich, Congo Cross and Brookfields, Freetown',
    summary: 'A technical university with programmes across education, engineering, science, business, hospitality, tourism, nutrition and vocational training, delivered across three Freetown campuses.',
    image: 'https://www.mmtu.edu.sl/images/Goderichimage.jpeg',
    imageAlt: 'Goderich campus of Milton Margai Technical University, official university photograph',
    imageCredit: 'Milton Margai Technical University — official website',
    officialUrl: 'https://www.mmtu.edu.sl/',
    admissionsUrl: 'https://admission.mmtu.edu.sl/requirement',
    applicationUrl: 'https://admission.mmtu.edu.sl/',
    status: '2026/2027 admissions banner published',
    statusNote: 'The university homepage announces that 2026/2027 admissions are open, while other parts of the same page contain older 2025/2026 wording. Check the live student portal for the current application status, course availability, fee and deadline.',
    requirements: [
      'Bachelor of Education and Bachelor of Arts: the portal lists five credits including English; some business and management routes specify English and/or Mathematics.',
      'BSc, BSc Education and BTech: five credits including Mathematics and English Language.',
      'HTC/HND progression routes may allow entry with four credits including the required core subject(s), plus the specified qualification.',
      'Higher Teachers’ Certificate and Higher National Diploma routes generally require four credits; science and engineering routes include Mathematics and English.',
      'National Diploma, certificate and vocational routes have separate credit and matriculation-examination requirements. Read the programme-specific portal criteria.'
    ],
    programmes: [
      'Education and teacher preparation.',
      'Engineering, science and technology.',
      'Business and management.',
      'Hotel, tourism, hospitality, nutrition and health-related training.',
      'National Diploma, Higher National Diploma, Higher Teachers’ Certificate, vocational and technical certificates.'
    ],
    application: [
      'Use the official MMTU admission portal to find the current course list and entry criteria.',
      'Select the exact programme and level; entry requirements differ significantly by course.',
      'Follow the portal’s current application, document-upload and payment instructions.',
      'Contact the admissions office if your route depends on HTC, HND, a technician certificate or matriculation examination.'
    ],
    fees: 'A current 2026/2027 application fee was not confirmed in the official pages retrieved. Check the live portal before payment.',
    deadline: 'Not stated consistently on the official pages retrieved; confirm on the live portal.',
    sources: [
      { label: 'MMTU official website and 2026/2027 admissions notice', url: 'https://www.mmtu.edu.sl/' },
      { label: 'MMTU Admission Criteria & Requirements', url: 'https://admission.mmtu.edu.sl/requirement' },
      { label: 'MMTU student admission portal', url: 'https://admission.mmtu.edu.sl/' },
      { label: 'MMTU faculties', url: 'https://www.mmtu.edu.sl/faculties.php' }
    ],
    updatedAt: '2026-11-08'
  },
  {
    slug: 'ernest-bai-koroma-university',
    name: 'Ernest Bai Koroma University of Science and Technology',
    shortName: 'EBKUST',
    location: 'Makeni and other university locations',
    summary: 'A science- and technology-focused public university with programmes spanning agriculture and natural resources, basic and health sciences, and other applied disciplines.',
    image: 'https://ebkustsl.edu.sl/api/media/file/-ebkust-hosts-us-led-research-on-ai-2-768x576.jpg',
    imageAlt: 'EBKUST research activity featured on the university’s official website',
    imageCredit: 'Ernest Bai Koroma University of Science and Technology — official website',
    imageSourceUrl: 'https://ebkustsl.edu.sl/',
    officialUrl: 'https://ebkustsl.edu.sl/',
    admissionsUrl: 'https://ebkustsl.edu.sl/admissions/admission-requirement/undergraduate',
    applicationUrl: 'https://app.ebkustsl.edu.sl/',
    status: '2026/2027 admissions announced',
    statusNote: 'The official homepage invites applications for 2026/2027 and links to the online application portal. The admissions landing page still contains 2025/2026 wording, so check the current portal and contact the university for the active deadline and fee.',
    requirements: [
      'There is no single safe WASSCE subject combination for every EBKUST course. The official undergraduate requirements page is organised by faculty, department and programme.',
      'Agriculture routes commonly require five credits including English Language, Mathematics, Agricultural Science and relevant basic science subjects, in not more than two sittings.',
      'Examples in the official page include five credits including English and Mathematics for Nutrition and Dietetics, with other science or programme-specific subject requirements.',
      'Some programmes describe alternative entry routes for HND, HTC or relevant professional qualifications. Read the exact course entry rule.'
    ],
    programmes: [
      'Agriculture and food security, crop science, agricultural engineering and natural-resource management.',
      'Basic sciences including chemistry, mathematics and statistics.',
      'Health sciences including microbiology, immunology, public health and related disciplines.',
      'The university describes itself as science- and technology-focused; use its current course brochure for the full 2026/2027 list.'
    ],
    application: [
      'Choose the exact programme and open its faculty-specific entry requirements.',
      'Use the official EBKUST admissions portal linked from the university website.',
      'Download the current course brochure and verify the application deadline, fee and required documents.',
      'Contact the university if you are applying through an HND, HTC or access/preliminary route.'
    ],
    fees: 'The current official pages retrieved did not expose a reliable 2026/2027 application-fee figure. Verify on the admissions portal.',
    deadline: 'Not confirmed on the official admissions pages retrieved.',
    sources: [
      { label: 'EBKUST official homepage — 2026/2027 notice', url: 'https://ebkustsl.edu.sl/' },
      { label: 'EBKUST undergraduate admission requirements', url: 'https://ebkustsl.edu.sl/admissions/admission-requirement/undergraduate' },
      { label: 'EBKUST admissions', url: 'https://ebkustsl.edu.sl/admissions' },
      { label: 'EBKUST online application portal', url: 'https://app.ebkustsl.edu.sl/' }
    ],
    updatedAt: '2026-11-08'
  },
  {
    slug: 'university-of-makeni',
    name: 'University of Makeni',
    shortName: 'UNIMAK',
    location: 'Makeni, Northern Province',
    summary: 'A private university in Makeni with academic programmes across several disciplines. Applicants should confirm the current programme catalogue and admissions requirements directly with the Registry.',
    image: 'https://unimak.edu.sl/wp-content/uploads/2026/03/Convocation-3-1-2048x1365.jpeg',
    imageAlt: 'University of Makeni convocation ceremony, official university photograph',
    imageCredit: 'University of Makeni — official website',
    officialUrl: 'https://unimak.edu.sl/',
    admissionsUrl: 'https://unimak.edu.sl/application-and-entry-requirements/',
    applicationUrl: 'https://unimak.edu.sl/',
    status: 'Current 2026/2027 entry criteria not verified',
    statusNote: 'UNIMAK’s published Application and Entry Requirements page contains an application-fee example for the 2017/2018 academic year and was last modified in 2021. Its stated credit thresholds are included below only as the last published reference—not as confirmed 2026/2027 rules. Contact the Registry for current requirements, fees, programme availability and application instructions.',
    requirements: [
      'Last published official reference: certificate level — three credits including English; diploma — four credits including English; degree — five credits including English, or four credits plus a recognised Higher Teachers’ Certificate.',
      'The same page gives additional science-subject requirements for Agriculture.',
      'These thresholds must be reconfirmed with UNIMAK before an applicant relies on them; the source is not a current 2026/2027 admissions notice.'
    ],
    programmes: [
      'The university website publishes news and programme information across several academic areas.',
      'The retrieved current official sources were insufficient to verify a complete 2026/2027 programme list. Check the Registry and current prospectus before choosing a course.'
    ],
    application: [
      'Contact the University of Makeni Registry using the current contact details on the official website.',
      'Request the 2026/2027 prospectus, programme-specific entry criteria, application form, fee schedule and deadline.',
      'Do not use the 2017/2018 fee information still displayed on the older requirements page.'
    ],
    fees: 'Not published reliably for the current cycle in the official requirements page retrieved.',
    deadline: 'Not confirmed in the current official sources retrieved.',
    sources: [
      { label: 'University of Makeni official website', url: 'https://unimak.edu.sl/' },
      { label: 'UNIMAK Application and Entry Requirements (older page)', url: 'https://unimak.edu.sl/application-and-entry-requirements/' }
    ],
    updatedAt: '2026-11-08'
  },
  {
    slug: 'limkokwing-university-sierra-leone',
    name: 'Limkokwing University of Creative Technology — Sierra Leone',
    shortName: 'Limkokwing',
    location: 'Freetown',
    summary: 'The university’s official international website describes its Freetown campus and lists study areas including tourism management, entrepreneurship and international business.',
    image: 'https://www.limkokwing.com/photos/shares/img/sierra_leone2.jpg',
    imageAlt: 'Limkokwing University Sierra Leone campus imagery from the university’s official website',
    imageCredit: 'Limkokwing University — official international website',
    officialUrl: 'https://www.limkokwing.com/page/sierra_leone',
    admissionsUrl: 'https://www.limkokwing.com/page/sierra_leone',
    status: 'Current Sierra Leone entry requirements not verified',
    statusNote: 'The official international page describes the Freetown campus and some subject areas, but it does not provide a current Sierra Leone admissions prospectus or WASSCE entry criteria. Contact the campus admissions office and verify the specific programme and its current recognition/accreditation status before applying.',
    requirements: [
      'A current, official Sierra Leone-specific WASSCE entry-requirements schedule was not available in the official page retrieved.',
      'Requirements may differ by diploma or degree programme. Request the current written entry criteria directly from the campus.',
      'Confirm the programme’s current approval/accreditation status with the relevant Sierra Leone regulator before paying fees.'
    ],
    programmes: [
      'The university’s official Sierra Leone page mentions diplomas and degrees, including Tourism Management, Entrepreneurship and International Business.',
      'Treat this as a short list from the campus page, not a complete or current 2026/2027 prospectus.'
    ],
    application: [
      'Contact the Freetown campus through the official university website.',
      'Request the current prospectus, exact WASSCE subject requirements, tuition and application fee, deadline and application portal.',
      'Verify programme approval and the qualification awarded before paying.'
    ],
    fees: 'Not stated in the official Sierra Leone page retrieved.',
    deadline: 'Not stated in the official Sierra Leone page retrieved.',
    sources: [
      { label: 'Limkokwing University — Sierra Leone campus', url: 'https://www.limkokwing.com/page/sierra_leone' }
    ],
    updatedAt: '2026-11-08'
  }
]

export type BlogPost = {
  slug: string
  title: string
  description: string
  category: string
  publishedAt: string
  updatedAt: string
  readMinutes: number
  image: string
  imageAlt: string
  imageCredit: string
  imageSourceUrl: string
  intro: string
  sections: EditorialSection[]
  sources: EditorialSource[]
  related: string[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'sierra-leone-university-admission-requirements-2026-2027',
    title: 'Sierra Leone University Admission Requirements for 2026/2027: A WASSCE Guide',
    description: 'Compare published 2026/2027 WASSCE entry requirements at USL, Njala, ETU-SL, MMTU and EBKUST, with application dates and official links.',
    category: 'University admissions',
    publishedAt: '2026-11-08',
    updatedAt: '2026-11-08',
    readMinutes: 11,
    image: 'https://njala.edu.sl/sites/default/files/Njala_Congregation_2026_Slider.jpg',
    imageAlt: 'Njala University congregation, official university photograph',
    imageCredit: 'Njala University — official website',
    intro: 'A WASSCE result is not a universal university admission ticket. Most degree routes start with five credits, but the subjects, grade thresholds, sittings, professional qualifications and application windows differ by institution and programme. This guide compares what the universities currently publish—and clearly flags information that is contradictory or out of date.',
    sections: [
      {
        heading: 'Start with the programme, not just the university',
        paragraphs: [
          'Before comparing universities, decide which degree or diploma you want to pursue. A general five-credit threshold is only the starting point. Engineering, nursing, medicine, agriculture, computing and teacher education can require particular subjects or additional qualifications.',
          'For example, the 2026/2027 EBKUST requirements list English Language, Mathematics, Agricultural Science and relevant science subjects for some agriculture programmes. Its chemistry and mathematics routes specify science combinations. Meeting a general credit count does not automatically qualify an applicant for every department.'
        ],
        bullets: ['Check the exact programme title and award.', 'Read the department’s subject requirements, not only the university-wide minimum.', 'Confirm whether the university accepts one or two sittings for your chosen route.', 'Ask whether HTC, HND, technician or access qualifications change the entry level.']
      },
      {
        heading: 'Published 2026/2027 entry requirements at a glance',
        paragraphs: [
          'The table below summarises official pages and prospectuses retrieved on 8 November 2026. It is a research snapshot, not an admission decision. Where a university page is stale or conflicts with another official page, that is stated rather than guessed.'
        ],
        bullets: [
          'University of Sierra Leone: five credits in up to two sittings, with at least C6 in English for degree programmes; faculty and departmental requirements apply. Diploma: four credits including English; certificate: three credits including English.',
          'Njala University: five WASSCE credits including English for undergraduate degrees, in no more than two sittings; school and departmental rules apply. Diploma: three credits; certificate: two credits.',
          'Eastern Technical University: five WASSCE credits including English for degree programmes, in no more than two sittings; departmental subject rules apply. Higher Diploma generally requires four credits; Ordinary Diploma generally requires three.',
          'Milton Margai Technical University: requirements vary by award. B.Ed/BA routes list five credits including English; BSc/BSc Ed/BTech routes list five including Mathematics and English. HTC/HND and diploma routes have separate criteria.',
          'EBKUST: requirements are listed by faculty and programme. Agriculture and several science routes specify English, Mathematics and relevant subject credits; consult the exact programme page.',
          'University of Makeni: its public requirements page still contains 2017/2018 fee information and was last modified in 2021. The credit thresholds on that page are not confirmed for 2026/2027.',
          'Limkokwing Sierra Leone: the official international campus page describes some programmes but does not publish a current Sierra Leone WASSCE entry schedule. Request written requirements from the campus.'
        ]
      },
      {
        heading: 'Application dates and fees: check the live portal',
        paragraphs: [
          'Njala University’s official undergraduate admissions page gives 13 November 2026 as the 2026/2027 submission deadline and lists a NLe 500 undergraduate application-processing fee. Its separate programme PDF carries an earlier August deadline, so use the live admissions page and portal to confirm the active window.',
          'The USL admission portal states 30 November 2026 for undergraduate submissions and says the portal shuts at noon on 10 December 2026. Another USL admissions page still displays earlier September dates. Because the official pages conflict, contact Central Admissions before making a payment.',
          'ETU-SL’s website advertises 2026/2027 admissions as open, but its downloadable advertisement says the online application window ran from 3 August to 20 September 2026. Confirm whether late applications are being accepted. MMTU and EBKUST also advertise 2026/2027 admissions, but applicants should verify the current deadline and fee in their live portals.'
        ]
      },
      {
        heading: 'What to prepare before opening an application',
        paragraphs: [
          'Njala’s published procedure asks applicants to prepare electronic copies of a birth certificate or sworn declaration, WASSCE/GCE certificate, school-leaving testimonial, passport photograph and payment evidence. Other universities may request different documents or additional references. Follow the institution’s own current checklist.',
          'Create the admissions portal account before paying if the institution instructs you to do so. Keep the application number, receipts and copies of every uploaded document. Never pay into a personal account or use a payment channel that is not shown on the official university portal.'
        ],
        bullets: ['WASSCE certificate or official result evidence requested by the institution.', 'Birth certificate or sworn declaration, where required.', 'School-leaving testimonial and valid identification.', 'Passport-size photograph and any programme-specific supporting documents.', 'Payment receipt only after confirming the official fee and payment channel.']
      },
      {
        heading: 'How to use this guide safely',
        paragraphs: [
          'Admissions notices change. A university can update its deadline, application fee, programme availability or subject combination after a guide is published. The source links on each university profile take you to the institution’s own page or admissions portal.',
          'If a source is contradictory, stale or incomplete, the profile says so. Contact the Registry or admissions office and request the current requirement in writing. Do not rely on social-media reposts when the official portal says something different.'
        ]
      }
    ],
    sources: [
      { label: 'USL 2026/2027 entry requirements (PDF)', url: 'https://admissions.usl.edu.sl/sites/default/files/2026-08/usl-entry-requirement-2026-2027.pdf' },
      { label: 'USL Admission Portal', url: 'https://admissions.usl.edu.sl/university-entry-requirements' },
      { label: 'Njala University undergraduate admissions', url: 'https://njala.edu.sl/admissions/undergraduate-admissions' },
      { label: 'ETU-SL 2026/2027 admission advertisement (PDF)', url: 'https://etusl.edu.sl/wp-content/uploads/2026/08/ETU-SL-2026-2027-ADMISSION-ADVERTISEMENT-FINAL.pdf' },
      { label: 'MMTU admission requirements', url: 'https://admission.mmtu.edu.sl/requirement' },
      { label: 'EBKUST undergraduate requirements', url: 'https://ebkustsl.edu.sl/admissions/admission-requirement/undergraduate' }
    ],
    related: ['university-of-sierra-leone', 'njala-university', 'eastern-technical-university', 'milton-margai-technical-university', 'ernest-bai-koroma-university']
  },
  {
    slug: 'what-counts-as-a-wassce-credit-for-university-admission',
    title: 'What Counts as a WASSCE Credit in Sierra Leone? Grades, Sittings and Entry Rules',
    description: 'Understand A1–C6 credit grades, how universities count WASSCE sittings and why programme-specific subject requirements matter.',
    category: 'WASSCE results',
    publishedAt: '2026-11-08',
    updatedAt: '2026-11-08',
    readMinutes: 7,
    image: 'https://usl.edu.sl/assets/images/bg.jpeg',
    imageAlt: 'University of Sierra Leone official campus imagery',
    imageCredit: 'University of Sierra Leone — official website',
    intro: 'When a university asks for five WASSCE credits, the number alone is not enough. You must check which grades it accepts, which subjects count for your programme, whether results from two sittings can be combined and whether additional qualifications are recognised.',
    sections: [
      {
        heading: 'A1 to C6 is the credit range stated by the universities reviewed',
        paragraphs: [
          'The USL 2026/2027 entry-requirements document states that WASSCE grades A1 to C6 are recognised as credits. Its degree entry rule requires five credits in no more than two sittings, including at least C6 in English Language. ETU-SL’s 2026/2027 advertisement also describes A1–C6 as the accepted WASSCE grade range for its degree minimum.',
          'Always read the exact wording in the current prospectus. Some departments require a stronger grade in a key subject, such as C5 or better, or require a specific set of science or mathematics subjects.'
        ]
      },
      {
        heading: 'A credit count does not replace subject requirements',
        paragraphs: [
          'A candidate can have five credits and still miss a programme’s subject combination. A science programme may require Mathematics and Chemistry; an agriculture programme may require Agricultural Science plus a basic science; a business programme may specify Mathematics or English. The subject list depends on the institution and course.',
          'Use the programme page as a checklist. Write down every required subject and compare it with your certificate one by one. Do not assume that a general five-credit rule overrides departmental criteria.'
        ]
      },
      {
        heading: 'Understand the two-sitting rule',
        paragraphs: [
          'Several university prospectuses state that the required credits may be obtained in not more than two sittings. This means the institution may accept qualifying results across two examination sessions, but it does not mean every programme accepts every combination of sittings. Confirm the rule with the admissions office if you have multiple result slips or a resit.'
        ]
      },
      {
        heading: 'Diploma, certificate and degree routes are different',
        paragraphs: [
          'The published general thresholds are not identical. USL lists four credits including English for diploma and three for certificate programmes. Njala lists three credits for diploma and two for certificate programmes, while its undergraduate degree minimum is five credits including English. ETU-SL and MMTU also publish separate rules for Higher Diploma, Ordinary Diploma, technical certificate and teacher-training routes.',
          'A lower credit threshold does not mean automatic admission. Course-specific subjects, matriculation examinations, work experience or a previous technical qualification may still be required.'
        ]
      },
      {
        heading: 'A practical way to check your eligibility',
        bullets: [
          'Choose the exact course and award level.',
          'Open the current official prospectus for that academic year.',
          'Highlight the minimum number of credits, required grades and required subjects.',
          'Check the allowed number of sittings and any alternative entry route.',
          'Ask admissions to confirm any borderline grade or qualification before paying an application fee.'
        ],
        paragraphs: ['Use the WASSCE Tutor subject directory to revise the subjects and topics relevant to your intended programme.']
      }
    ],
    sources: [
      { label: 'USL 2026/2027 entry requirements (PDF)', url: 'https://admissions.usl.edu.sl/sites/default/files/2026-08/usl-entry-requirement-2026-2027.pdf' },
      { label: 'USL University Entry Requirements', url: 'https://admissions.usl.edu.sl/university-entry-requirements' },
      { label: 'Njala University undergraduate admissions', url: 'https://njala.edu.sl/admissions/undergraduate-admissions' },
      { label: 'ETU-SL 2026/2027 admission advertisement (PDF)', url: 'https://etusl.edu.sl/wp-content/uploads/2026/08/ETU-SL-2026-2027-ADMISSION-ADVERTISEMENT-FINAL.pdf' },
      { label: 'MMTU admission requirements', url: 'https://admission.mmtu.edu.sl/requirement' }
    ],
    related: ['sierra-leone-university-admission-requirements-2026-2027', 'how-to-choose-wassce-subjects-for-your-university-course']
  },
  {
    slug: 'how-to-choose-wassce-subjects-for-your-university-course',
    title: 'How to Choose WASSCE Subjects for Your University Course in Sierra Leone',
    description: 'Plan WASSCE subjects around real university entry requirements for engineering, health sciences, agriculture, computing, business and humanities.',
    category: 'Subject planning',
    publishedAt: '2026-11-08',
    updatedAt: '2026-11-08',
    readMinutes: 8,
    image: 'https://i.ibb.co/5m2JBwZ/IMG-0243.jpg',
    imageAlt: 'Students engaged in research at Eastern Technical University, official website image',
    imageCredit: 'Eastern Technical University of Sierra Leone — official website',
    intro: 'The safest time to check university subject requirements is before you finalise your WASSCE subject choices. A course title can sound familiar while its admission rules require a particular combination of Mathematics, English, Chemistry, Biology, Physics or another subject.',
    sections: [
      {
        heading: 'Engineering and technology',
        paragraphs: [
          'Engineering programmes commonly require Mathematics and science subjects. ETU-SL’s 2026/2027 prospectus lists civil and environmental, electrical and electronic, mining, mechanical and manufacturing engineering, alongside computer science, data science, information systems and renewable energy programmes.',
          'EBKUST’s agriculture-engineering entry route explicitly includes English Language, Mathematics, Physics and two basic science subjects. This is a useful example of why applicants should not choose subjects based only on the broad label “technology”. Check the exact course.'
        ]
      },
      {
        heading: 'Medicine, nursing and allied health',
        paragraphs: [
          'Health programmes often require a science-heavy WASSCE record. ETU-SL’s published Higher Diploma Nursing route lists English Language, Mathematics, Biology, Chemistry and Physics. USL’s COMAHS and Njala’s health programmes have faculty and departmental rules that must be checked individually.',
          'Do not assume the entry criteria for a nursing diploma are the same as medicine and surgery, medical laboratory science or public health. These are different awards with different admission routes.'
        ]
      },
      {
        heading: 'Agriculture, environment and natural resources',
        paragraphs: [
          'Agriculture-related programmes may require Agricultural Science alongside Mathematics, English and a basic science. EBKUST’s agriculture programme criteria list Agricultural Science and relevant basic science subjects. Njala’s programme catalogue includes crop science, animal science, agribusiness, forestry, fisheries, wildlife and environmental programmes.',
          'If you are considering agriculture, environmental science or veterinary study, check whether the department specifies Biology, Chemistry, Physics, Agricultural Science or another subject.'
        ]
      },
      {
        heading: 'Business, management, arts and social sciences',
        paragraphs: [
          'Business and management programmes may specify Mathematics and English; humanities and social-science routes may look for relevant arts or social-science subjects. The USL 2026/2027 prospectus lists a wide range of arts, communication, economics, development studies, social science and law programmes across its colleges.',
          'Do not drop Mathematics or English because a course appears non-scientific. They are part of many university-wide minimum requirements and may be explicitly required by the department.'
        ]
      },
      {
        heading: 'A subject-choice decision process',
        bullets: [
          'Shortlist two or three actual degree programmes, not only broad career interests.',
          'Download the current prospectus from each institution.',
          'Create a comparison of compulsory subjects and minimum grades.',
          'Choose a subject combination that keeps realistic alternatives open without weakening your performance.',
          'Ask the school counsellor and university admissions office to confirm any unusual combination.'
        ],
        paragraphs: ['WASSCE Tutor organises revision by subject and syllabus topic. Start with the subject directory, then work through the topics that support your intended course.']
      }
    ],
    sources: [
      { label: 'ETU-SL 2026/2027 admission advertisement (PDF)', url: 'https://etusl.edu.sl/wp-content/uploads/2026/08/ETU-SL-2026-2027-ADMISSION-ADVERTISEMENT-FINAL.pdf' },
      { label: 'EBKUST undergraduate admission requirements', url: 'https://ebkustsl.edu.sl/admissions/admission-requirement/undergraduate' },
      { label: 'USL 2026/2027 entry requirements (PDF)', url: 'https://admissions.usl.edu.sl/sites/default/files/2026-08/usl-entry-requirement-2026-2027.pdf' },
      { label: 'Njala University 2026/2027 programmes (PDF)', url: 'https://njala.edu.sl/sites/default/files/NU_Programmes_2026-2027.pdf' }
    ],
    related: ['sierra-leone-university-admission-requirements-2026-2027', 'what-counts-as-a-wassce-credit-for-university-admission']
  },
  {
    slug: 'sierra-leone-university-application-checklist',
    title: 'University Application Checklist for Sierra Leone Students: Documents, Fees and Safe Payments',
    description: 'Prepare your WASSCE certificate, identification, testimonial, photograph and payment evidence before applying to a Sierra Leone university.',
    category: 'Application advice',
    publishedAt: '2026-11-08',
    updatedAt: '2026-11-08',
    readMinutes: 6,
    image: 'https://ebkustsl.edu.sl/api/media/file/-ebkust-hosts-us-led-research-on-ai-2-768x576.jpg',
    imageAlt: 'University research and student activity featured on EBKUST official website',
    imageCredit: 'Ernest Bai Koroma University of Science and Technology — official website',
    intro: 'University applications are easier to manage when you prepare your documents before opening the portal. Requirements vary, but official admissions instructions from Sierra Leone universities show a recurring set of records students should have ready.',
    sections: [
      {
        heading: 'Documents to prepare',
        paragraphs: [
          'Njala University’s published undergraduate application procedure asks applicants to prepare a birth certificate or sworn declaration, WASSCE/GCE certificate, school-leaving testimonial, passport-size photograph and payment slip. Other institutions may ask for identification, references, transcripts, work experience or professional certificates.',
          'Scan clear copies and check that names and dates match across your records. If your certificate name differs from your application name, ask the university how to document the difference before submission.'
        ],
        bullets: ['WASSCE or GCE certificate/result documents requested by the institution.', 'Birth certificate or sworn declaration, if requested.', 'School-leaving testimonial.', 'National identification or other valid ID, where required.', 'Passport-size photograph.', 'Professional certificates, transcripts or references for special entry routes.', 'Application fee receipt or payment evidence, where required.']
      },
      {
        heading: 'Create the account before paying when instructed',
        paragraphs: [
          'Njala’s procedure tells applicants to create and verify an admissions portal account first. The system then issues a registration number and an invoice for the application processing fee. This is safer than paying an amount copied from an old advert or an unofficial social-media post.',
          'USL also directs applicants through its portal and designated bank payment channels. Other universities may use different payment arrangements. Follow only the current instructions on the official domain.'
        ]
      },
      {
        heading: 'Protect yourself from payment mistakes',
        bullets: [
          'Open the university website by typing its official domain or using a verified institutional link.',
          'Check the current academic year, programme, fee and deadline.',
          'Use only the payment methods and account details published by the university.',
          'Do not send money to an individual’s personal mobile-money number unless the official university portal explicitly identifies it as an authorised payment method.',
          'Keep the receipt and application reference, and verify that the portal records the payment.'
        ]
      },
      {
        heading: 'Check every section before final submission',
        paragraphs: [
          'Review your name, date of birth, contact details, programme selection, examination results and uploaded documents. Save the application reference and download any confirmation page or email. Return to the portal to monitor your application status.',
          'If a deadline or fee conflicts across two official university pages, contact the admissions office and request confirmation in writing before you pay.'
        ]
      }
    ],
    sources: [
      { label: 'Njala University application procedure', url: 'https://njala.edu.sl/admissions/application-procedure' },
      { label: 'USL admission process', url: 'https://usl.edu.sl/admissions' },
      { label: 'EBKUST admissions portal', url: 'https://ebkustsl.edu.sl/admissions' }
    ],
    related: ['sierra-leone-university-admission-requirements-2026-2027', 'what-counts-as-a-wassce-credit-for-university-admission']
  }
]

export const EDITORIAL_PUBLIC_PAGES = [
  { path: '/blog', lastmod: '2026-11-08' },
  { path: '/universities', lastmod: '2026-11-08' },
  ...BLOG_POSTS.map((post) => ({ path: `/blog/${post.slug}`, lastmod: post.updatedAt })),
  ...UNIVERSITY_GUIDES.map((university) => ({ path: `/universities/${university.slug}`, lastmod: university.updatedAt }))
]
