// Single source of truth for page <head> metadata.
//
// Used in two places:
//  1. Route `head` options, rendered by <HeadContent /> in __root.tsx. Public
//     routes are prerendered at build time (TanStack Start), so these tags are
//     in the static HTML that crawlers and link previews (WhatsApp, Facebook)
//     read, and they update on every in-app navigation.
//  2. vite.config.ts, which prerenders every PUBLIC_PAGES entry and lists it
//     in /sitemap.xml with its lastmod.
//
// Keep this file free of browser-only and Node-only imports: it is loaded by
// both the app bundle and vite.config.ts.

import type { AnyRouteMatch } from '@tanstack/react-router'
import { CONTACT } from './contact'
import { FROM_PRICE, PLANS } from './plans'
import { GOOGLE_MAPS_URL } from './reviews'

/** Dearest plan, for structured-data price ranges. */
const TOP_PRICE = Math.max(...PLANS.map((p) => p.priceNle))

export const SITE = {
  origin: 'https://wasscetutor.com',
  name: 'WASSCE Tutor',
} as const

type PublicPage = {
  /** Full <title>, keyword first, brand last. Aim for <= 65 characters. */
  title: string
  /** Meta description. Aim for 120-160 characters, and keep it true. */
  description: string
  /** Title for link previews; defaults to `title`. */
  ogTitle?: string
  /** Date the page's content last changed meaningfully (YYYY-MM-DD), for the sitemap. */
  lastmod: string
}

// Indexable pages. Every key here gets a self-referencing canonical, a static
// HTML file at build time, and an entry in /sitemap.xml.
export const PUBLIC_PAGES = {
  // The brand's own page, so its title starts with the brand: someone who
  // searches "wassce tutor" should land here. Nov 2026: Google showed the
  // affiliate page for that search, whose title then started with
  // "WASSCE Tutor" while this one only ended with it.
  '/': {
    title: 'WASSCE Tutor: WASSCE Lessons & Practice Questions, Sierra Leone',
    ogTitle: 'WASSCE Tutor: Pass WASSCE with confidence',
    description:
      `WASSCE Tutor: WASSCE lessons and practice questions for Sierra Leone students, with full working and private tutors. Free to start; from NLe ${FROM_PRICE}.`,
    lastmod: '2026-11-18',
  },
  '/about': {
    title: 'About WASSCE Tutor: WASSCE Prep Built in Sierra Leone',
    description:
      'WASSCE Tutor is a WASSCE preparation app built in Freetown for Sierra Leone students, with syllabus lessons and exam-style practice questions.',
    lastmod: '2026-11-06',
  },
  '/contact': {
    title: 'Contact WASSCE Tutor: WhatsApp, Email & Location | WASSCE Tutor',
    description:
      'Contact WASSCE Tutor in Freetown, Sierra Leone: WhatsApp +232 77 884195, email, and our WhatsApp study group. Help with plans, payments and tutors.',
    lastmod: '2026-11-06',
  },
  '/tutors': {
    title: 'Private WASSCE Tutors in Freetown & Sierra Leone | Home Lessons',
    description: 'Book a private tutor for WASSCE in Freetown, Bo, Kenema or Makeni. Home lessons and extra classes in maths, English and sciences, with the monthly fee upfront.',
    lastmod: '2026-11-18',
  },
  '/blog': {
    title: 'WASSCE Tutor Blog: Study & University Guides',
    description: 'Research-backed WASSCE study advice, Sierra Leone university admissions guides, subject planning and practical resources for students and families.',
    lastmod: '2026-11-19',
  },
  '/universities': {
    title: 'Sierra Leone Universities: Courses & WASSCE Requirements',
    description: 'Compare universities in Sierra Leone, explore programmes and WASSCE entry requirements, and follow official admissions links for each institution.',
    lastmod: '2026-11-08',
  },
  '/become-a-tutor': {
    title: 'Become a WASSCE Tutor in Sierra Leone | Teach In Person',
    description: 'Become a WASSCE tutor in Sierra Leone in three steps: add your photo, subjects and monthly fee, go live in the tutor marketplace and get students on WhatsApp.',
    lastmod: '2026-11-18',
  },
  // Not led by the bare brand, so a search for "wassce tutor" goes to the
  // homepage rather than here.
  '/affiliate': {
    title: 'Affiliate Programme: Earn 50% on Student Referrals | WASSCE Tutor',
    description: 'Earn 50% of a referred student’s first verified subscription payment. Join our affiliate programme and share your own tracked referral link.',
    lastmod: '2026-11-18',
  },
  '/privacy': {
    title: 'Privacy Policy | WASSCE Tutor',
    description:
      'What information WASSCE Tutor collects when you use the website or Android app, how it is stored and used, and the choices you have.',
    lastmod: '2026-06-08',
  },
  '/terms': {
    title: 'Terms of Service | WASSCE Tutor',
    description:
      'The terms that apply when you create an account or use WASSCE Tutor, including subscriptions, payments and acceptable use.',
    lastmod: '2026-11-21',
  },
} as const satisfies Record<string, PublicPage>

export type PublicPath = keyof typeof PUBLIC_PAGES

// Titles and descriptions written for the words people actually search, for
// data-driven pages where Search Console showed many impressions at a good
// position but no clicks: the default template ("WASSCE Chemistry:
// Introduction to Chemistry Lessons") did not answer searches such as
// "chemistry for beginners" or "learn about literature". Keyed by path. Keep
// each one true to what the page has; it replaces the template's text only.
export const SEARCH_COPY: Partial<Record<string, { title: string; description: string }>> = {
  // Nov 2026 content audit: the lesson's snippet opened "Lesson 1 gave you the basic
  // transformation in outline. This lesson goes deeper..."; students search for
  // "active to passive voice".
  '/wassce/english-language/active-and-passive-voice/how-to-form-the-passive': {
    title: 'How to Change Active to Passive Voice | WASSCE English',
    description:
      'Change active sentences to the passive in three steps: object to subject, be + past participle in the same tense, and the by-phrase. With WASSCE examples.',
  },
  // Nov 2026 content audit: the topic's description was "Solving equations of the first
  // degree." Its lesson also teaches simultaneous equations, a common search.
  '/wassce/mathematics/linear-equations': {
    title: 'Linear and Simultaneous Equations | WASSCE Maths',
    description:
      'Solve linear equations for WASSCE Maths: the balance method, brackets, fractions, word problems, and simultaneous equations by elimination and substitution.',
  },
  // Nov 2026: about 1,500 impressions at position 5 for "chemistry for beginners",
  // "chemistry explained", "learn about chemistry", "understanding chemistry".
  '/wassce/chemistry/introduction-to-chemistry': {
    title: 'Introduction to Chemistry for Beginners | WASSCE Chemistry',
    description:
      'Chemistry explained for beginners: what chemistry is, its branches and uses, the scientific method, measurement and lab safety. Short lessons, all free.',
  },
  // Nov 2026: about 270 impressions at position 5 for "learn about literature".
  '/wassce/literature-in-english': {
    title: 'Learn About Literature: Prose, Drama & Poetry | WASSCE',
    description:
      'Learn what literature is, why we read it and its three genres, prose, drama and poetry, then every topic of the WASSCE Literature in English syllabus.',
  },
  // Nov 2026: 221 impressions, 0 clicks, mostly "difference between reflection,
  // refraction and diffraction" (often "with examples" or "and interference").
  '/wassce/physics/wave-phenomena/reflection-refraction-and-diffraction-of-waves': {
    title: 'Reflection, Refraction and Diffraction: Differences & Examples',
    description:
      'The difference between reflection, refraction and diffraction: waves bounce, bend or spread. Table of water, sound and light examples, plus interference.',
  },
  // Nov 2026: position 5 to 7 for "what is agriculture", 0 clicks.
  '/wassce/agricultural-science/introduction-to-agriculture/defining-agriculture-and-its-importance': {
    title: 'What Is Agriculture? Meaning, Importance and Branches',
    description:
      'Agriculture is growing crops and rearing animals for food, raw materials and income. Its meaning, branches, types and importance, with Sierra Leone examples.',
  },
  // Search Console to 16 Nov 2026: each page shows for the searches below but
  // its title did not use their words, so it got no clicks.
  // "what is calorimetry" (position 1.8), "calorimetry", "heat and temperature".
  '/wassce/physics/quantity-of-heat-and-calorimetry': {
    title: 'What Is Calorimetry? Heat Capacity & Specific Heat | WASSCE',
    description:
      'Calorimetry is measuring heat: heat lost by hot bodies equals heat gained by cold ones. Heat capacity, specific heat capacity and WASSCE calorimetry problems.',
  },
  // "endocrine" (position 5), "endocrine meaning" (4.3), "what is endocrine", "endocrine system".
  '/wassce/biology/the-endocrine-system': {
    title: 'Endocrine System: Meaning, Glands and Hormones | WASSCE Biology',
    description:
      'Endocrine meaning: ductless glands that release hormones into the blood. The major endocrine glands, their hormones, feedback and blood glucose control.',
  },
  // "urinary system" (51 impressions), "urinary system organs" (position 9), "kidney and urinary tract anatomy".
  '/wassce/biology/the-kidney-and-urinary-system': {
    title: 'Urinary System: Organs, Kidney Structure & Nephron | WASSCE',
    description:
      'The urinary system and its organs: kidneys, ureters, bladder and urethra. Kidney structure, the nephron, how urine forms and urinary disorders. All free.',
  },
  '/wassce/biology/the-kidney-and-urinary-system/the-kidney-and-urinary-system-structure-and-organisation': {
    title: 'Urinary System Organs and Kidney Structure, with the Nephron',
    description:
      'The organs of the urinary system and the route of urine, the external and internal structure of the kidney, and the nephron, its functional unit.',
  },
  // "gas exchange", "where does gas exchange occur", "gaseous exchange in lungs" (216 impressions, position 22).
  '/wassce/biology/respiratory-systems-and-gas-exchange': {
    title: 'Gas Exchange: Where It Occurs in Humans, Fish, Insects, Plants',
    description:
      'Where gas exchange occurs: alveoli in the lungs, gills in fish, tracheae in insects and stomata in plants. The human respiratory system and breathing. Free.',
  },
  // "mrs gren", "mrs gren biology", "what is mrs gren", "mrs gren meaning", "what does mrs gren stand for".
  '/wassce/biology/characteristics-of-living-things/what-makes-something-alive-introducing-mrs-gren': {
    title: 'MRS GREN Meaning: 7 Characteristics of Living Things',
    description:
      'What MRS GREN stands for: Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion and Nutrition, the seven characteristics of living things.',
  },
  // "what is the main purpose of biological classification?" (41 impressions), "why do we classify living things".
  '/wassce/biology/classification-of-living-things/why-we-classify-living-things': {
    title: 'Why We Classify Living Things: Purpose of Classification',
    description:
      'The main purpose of biological classification: to sort millions of organisms into groups so they can be named, identified and studied. Features and examples.',
  },
  // "what is economics" (23 impressions, position 14.5), "definition of economics".
  '/wassce/economics/nature-and-scope-of-economics/what-economics-is-definitions-and-subject-matter': {
    title: 'What Is Economics? Definitions by Smith, Marshall & Robbins',
    description:
      'Economics is the study of how people use scarce resources to satisfy unlimited wants. The wealth, welfare and scarcity definitions, and what economics studies.',
  },
  // "distance displacement speed velocity acceleration" and "... definition" (positions 4 to 8).
  '/wassce/physics/motion-in-a-straight-line/distance-displacement-speed-velocity-and-acceleration': {
    title: 'Distance, Displacement, Speed, Velocity & Acceleration Defined',
    description:
      'Definitions of distance, displacement, speed, velocity and acceleration, with their units, converting km/h to m/s, and WASSCE examples to practise.',
  },
  // Search Console to 21 Nov 2026: lessons shown for the searches below, mostly at
  // positions 3 to 10, with no clicks. Their template title ("WASSCE Government:
  // The executive: types, composition and functions") ran past 60 characters and
  // put the searched words last; their description was the lesson's opening scene.
  // "what are the 7 characteristics of soil?" (position 4): the lesson's table has exactly seven.
  '/wassce/agricultural-science/soil-properties-and-types/soil-properties-and-types-sandy-clay-and-loam': {
    title: 'Soil Properties: 7 Physical Characteristics of Soil | WASSCE',
    description:
      'The 7 physical properties of soil: texture, structure, porosity, permeability, water-holding capacity, colour and temperature. Sandy, clay and loam compared.',
  },
  // "types of executive" (position 8), "functions of executive", "8 functions of executive".
  '/wassce/government/the-executive/the-executive-types-composition-and-functions': {
    title: 'Types of Executive and Functions of the Executive | WASSCE',
    description:
      'The seven types of executive (nominal, real, single, dual, plural, political, permanent), who makes up the executive, and its 11 functions, with examples.',
  },
  // "triangle of forces method" (position 3), "triangle of forces equilibrium", "... method example".
  '/wassce/physics/equilibrium-of-forces/equilibrium-of-forces-triangle-of-forces-and-lamis-theorem': {
    title: "Triangle of Forces Method and Lami's Theorem, with Examples",
    description:
      "Three forces in equilibrium form a closed triangle, drawn nose to tail. The triangle of forces method, Lami's theorem, worked examples and inclined planes.",
  },
  // "testing a leaf for starch", "steps to test for starch in a leaf" (position 4), "how to test a leaf for starch".
  '/wassce/biology/photosynthesis-and-plant-nutrition/testing-a-leaf-for-starch': {
    title: 'How to Test a Leaf for Starch: 5 Steps and Why Each Matters',
    description:
      'Test a leaf for starch: boil it in water, decolourise it in ethanol in a water bath, rinse it, add iodine. Blue-black means starch. Why each step matters.',
  },
  // "balance bd and cd" (position 5), "balance cd and bd meaning", "balancing off ledger accounts".
  '/wassce/financial-accounting/the-ledger/how-to-balance-off-ledger-accounts-balance-cd-and-bd': {
    title: 'Balance c/d and b/d: How to Balance Off Ledger Accounts',
    description:
      'Balance c/d is carried down on the smaller side to make both sides equal; balance b/d is the same amount brought down to start the next period. Step by step.',
  },
  // "how does inflation work" (position 8).
  '/wassce/economics/inflation-and-deflation/inflation-meaning-measurement-and-causes': {
    title: 'How Inflation Works: Meaning, Measurement and Causes | WASSCE',
    description:
      'What inflation is, how the price index measures it, and its five causes: demand-pull, cost-push, imported, monetary and structural. With Sierra Leone examples.',
  },
  // "vowels and diphthongs in english" (position 5), "vowels and diphthongs examples" (4), "... list".
  // The three oral English lessons play their example words (scripts/audio), which few
  // pages for these searches do: the titles say so.
  '/wassce/english-language/vowels-and-diphthongs/vowels-and-diphthongs-the-20-vowel-sounds-of-english': {
    title: 'Vowels and Diphthongs in English, with Audio | WASSCE',
    description:
      'Hear all 20 vowel sounds of English: the 12 pure vowels and 8 diphthongs, with symbols and example words to play, and the vowel pairs WASSCE tests most.',
  },
  '/wassce/english-language/consonants-and-consonant-clusters/consonants-the-24-sounds-ed-and-s-endings-clusters-and-silent-letters': {
    title: 'English Consonant Sounds, with Audio | WASSCE Oral English',
    description:
      'Hear the 24 consonant sounds of English: voiced and voiceless pairs, the th sounds, -ed and -s endings, clusters and silent letters, with words to play.',
  },
  '/wassce/english-language/word-stress/word-stress-the-patterns-behind-the-right-syllable': {
    title: 'Word Stress Rules in English, with Audio | WASSCE',
    description:
      'Hear where the stress falls: nouns and verbs, PREsent and preSENT, endings like -tion and -ic, compounds, and words often mis-stressed in Sierra Leone.',
  },
  // Nov 2026: ICT / Computer Studies, batch 1 (computer fundamentals and hardware): the terms
  // students search for ("generations of computers", "types of computers", "difference between
  // data and information", "binary to decimal", "parts of the CPU", "input devices and their
  // functions", "types of printers", "difference between RAM and ROM").
  '/wassce/ict-computer-studies/history-and-evolution-of-computers': {
    title: 'Generations of Computers: Notes and Questions | WASSCE ICT',
    description:
      'WASSCE ICT notes and practice questions on the history of computers: the abacus, Babbage, Lovelace, Turing and the five generations of computers.',
  },
  '/wassce/ict-computer-studies/history-and-evolution-of-computers/history-and-generations-of-computers': {
    title: 'History and Generations of Computers | WASSCE ICT',
    description:
      'The history of computers from the abacus to AI: early devices, the pioneers, and the five generations of computers with their technology, examples and features.',
  },
  '/wassce/ict-computer-studies/classification-of-computers': {
    title: 'Types of Computers: Notes and Questions | WASSCE ICT',
    description:
      'WASSCE ICT notes and practice questions on the classification of computers: analogue, digital and hybrid; supercomputer to microcomputer; special purpose.',
  },
  '/wassce/ict-computer-studies/classification-of-computers/types-of-computers-by-type-size-and-purpose': {
    title: 'Classification of Computers by Type and Size | WASSCE ICT',
    description:
      'Types of computers explained: analogue, digital and hybrid; supercomputers, mainframes, minicomputers and microcomputers; general and special purpose.',
  },
  '/wassce/ict-computer-studies/data-and-information': {
    title: 'Data and Information: Notes and Questions | WASSCE ICT',
    description:
      'WASSCE ICT notes and practice questions on data and information: the data processing cycle, batch and real-time processing, validation and the data hierarchy.',
  },
  '/wassce/ict-computer-studies/data-and-information/data-vs-information-and-the-data-processing-cycle': {
    title: 'Difference Between Data and Information | WASSCE ICT',
    description:
      'Data vs information with examples, qualities of good information, the stages of the data processing cycle, batch and real-time processing, and validation.',
  },
  '/wassce/ict-computer-studies/number-systems-and-data-representation': {
    title: 'Number Systems: Notes and Questions | WASSCE ICT',
    description:
      'WASSCE ICT notes and practice questions on number systems: binary, octal and hexadecimal conversions, binary addition, bits and bytes, and ASCII codes.',
  },
  '/wassce/ict-computer-studies/number-systems-and-data-representation/binary-octal-and-hexadecimal-conversions': {
    title: 'Binary to Decimal Conversion, Octal and Hex | WASSCE ICT',
    description:
      'Convert decimal to binary, binary to decimal, octal and hexadecimal step by step, with worked examples, binary addition and subtraction, and ASCII explained.',
  },
  '/wassce/ict-computer-studies/the-cpu': {
    title: 'The CPU: Notes and Questions | WASSCE ICT',
    description:
      'WASSCE ICT notes and practice questions on the central processing unit: the control unit, ALU, registers, buses and the fetch-decode-execute cycle.',
  },
  '/wassce/ict-computer-studies/the-cpu/parts-of-the-cpu-and-the-fetch-decode-execute-cycle': {
    title: 'Parts of the CPU and Their Functions | WASSCE ICT',
    description:
      'The parts of the CPU and their functions: control unit, ALU and registers; data, address and control buses; the fetch-decode-execute cycle; and processor speed.',
  },
  '/wassce/ict-computer-studies/input-devices': {
    title: 'Input Devices: Notes and Questions | WASSCE ICT',
    description:
      'WASSCE ICT notes and practice questions on input devices: keyboard keys, the mouse and other pointing devices, scanners, OMR, OCR, MICR and barcode readers.',
  },
  '/wassce/ict-computer-studies/input-devices/input-devices-and-their-functions': {
    title: 'Input Devices and Their Functions | WASSCE ICT',
    description:
      'Input devices and their uses: keyboard keys, mouse, touch screen, scanner, OMR, OCR, MICR, barcode and QR readers, microphone, webcam and biometric devices.',
  },
  '/wassce/ict-computer-studies/output-devices': {
    title: 'Output Devices: Notes and Questions | WASSCE ICT',
    description:
      'WASSCE ICT notes and practice questions on output devices: monitors, resolution, soft and hard copy, impact and non-impact printers, plotters and speakers.',
  },
  '/wassce/ict-computer-studies/output-devices/output-devices-and-types-of-printers': {
    title: 'Output Devices and Types of Printers | WASSCE ICT',
    description:
      'Output devices and their uses: monitors and resolution, soft and hard copy, impact and non-impact printers (dot-matrix, inkjet, laser), plotters and speakers.',
  },
  '/wassce/ict-computer-studies/memory-and-storage-devices': {
    title: 'Memory and Storage Devices: Notes and Questions | WASSCE',
    description:
      'WASSCE ICT notes and practice questions on computer memory and storage: RAM and ROM, cache, hard disks, SSDs, flash drives, CDs, DVDs and cloud storage.',
  },
  '/wassce/ict-computer-studies/memory-and-storage-devices/ram-rom-and-storage-devices': {
    title: 'Difference Between RAM and ROM, and Storage Devices | WASSCE',
    description:
      'RAM vs ROM, volatile and non-volatile memory, types of ROM, cache, the memory hierarchy, and magnetic, optical and solid-state storage devices with capacities.',
  },
  // Nov 2026: ICT / Computer Studies, batch 2 (software and applications): "types of software",
  // "functions of operating system", "compiler vs interpreter", "cold and warm booting", "file
  // extensions", "mail merge", "absolute cell reference", "primary key", "bitmap vs vector".
  '/wassce/ict-computer-studies/types-of-software': {
    title: 'Types of Software: Notes and Questions | WASSCE ICT',
    description:
      'WASSCE ICT notes and practice questions on types of software: system and application software, utility programs, translators, drivers and licences.',
  },
  '/wassce/ict-computer-studies/types-of-software/system-software-and-application-software': {
    title: 'System Software and Application Software | WASSCE ICT',
    description:
      'Types of software explained: system vs application software, utility programs with examples, translators, drivers, packages, bespoke software and licences.',
  },
  '/wassce/ict-computer-studies/operating-systems': {
    title: 'Operating Systems: Notes and Questions | WASSCE ICT',
    description:
      'WASSCE ICT notes and practice questions on operating systems: functions, types such as multitasking and real-time, GUI and command line, and examples.',
  },
  '/wassce/ict-computer-studies/operating-systems/functions-and-types-of-operating-systems': {
    title: 'Functions and Types of Operating Systems | WASSCE ICT',
    description:
      'Functions of an operating system, types (multi-user, multitasking, real-time, mobile), GUI vs command-line interface, and examples such as Windows and Android.',
  },
  '/wassce/ict-computer-studies/programming-languages-and-translators': {
    title: 'Programming Languages: Notes and Questions | WASSCE ICT',
    description:
      'WASSCE ICT notes and practice questions on programming languages: machine, assembly and high-level languages, compilers, interpreters and assemblers.',
  },
  '/wassce/ict-computer-studies/programming-languages-and-translators/levels-of-programming-languages-compiler-and-interpreter': {
    title: 'Compiler vs Interpreter, Levels of Languages | WASSCE ICT',
    description:
      'Levels of programming languages, from machine code and assembly to high-level languages, and the difference between a compiler, an interpreter and an assembler.',
  },
  '/wassce/ict-computer-studies/basic-computer-operations': {
    title: 'Basic Computer Operations: Notes and Questions | WASSCE',
    description:
      'WASSCE ICT notes and practice questions on basic computer operations: booting, cold and warm boot, the desktop, mouse actions, shortcuts and shutting down.',
  },
  '/wassce/ict-computer-studies/basic-computer-operations/booting-the-desktop-mouse-and-keyboard-shortcuts': {
    title: 'Booting Process: Cold and Warm Booting | WASSCE ICT',
    description:
      'The booting process step by step, cold vs warm booting, parts of the desktop, mouse and window operations, keyboard shortcuts and how to shut down properly.',
  },
  '/wassce/ict-computer-studies/file-and-folder-management': {
    title: 'File Management: Notes and Questions | WASSCE ICT',
    description:
      'WASSCE ICT notes and practice questions on file and folder management: paths, file extensions, Save and Save As, copy and move, compression and backup.',
  },
  '/wassce/ict-computer-studies/file-and-folder-management/files-folders-paths-and-file-extensions': {
    title: 'Files, Folders, Paths and File Extensions | WASSCE ICT',
    description:
      'The difference between a file and a folder, folder trees and paths, common file extensions, creating, renaming, copying, moving and deleting files, and backups.',
  },
  '/wassce/ict-computer-studies/word-processing': {
    title: 'Word Processing: Notes and Questions | WASSCE ICT',
    description:
      'WASSCE ICT notes and practice questions on word processing: the Word window, editing, formatting, alignment, headers and footers, and mail merge.',
  },
  '/wassce/ict-computer-studies/word-processing/word-processing-features-formatting-and-mail-merge': {
    title: 'Word Processing: Features, Formatting, Mail Merge | WASSCE',
    description:
      'Features of a word processor: parts of the window, editing, character, paragraph and page formatting, tables, spelling check and mail merge, with shortcuts.',
  },
  '/wassce/ict-computer-studies/spreadsheets': {
    title: 'Spreadsheets: Notes and Questions | WASSCE ICT',
    description:
      'WASSCE ICT notes and practice questions on spreadsheets: cells and ranges, formulas, SUM, AVERAGE and IF functions, absolute references and charts.',
  },
  '/wassce/ict-computer-studies/spreadsheets/spreadsheet-formulas-functions-and-cell-references': {
    title: 'Excel Formulas, Functions and Cell References | WASSCE ICT',
    description:
      'Spreadsheet basics: cells, ranges, formulas, SUM, AVERAGE, MAX, MIN, COUNT and IF, relative and absolute cell references, sorting, charts and error messages.',
  },
  '/wassce/ict-computer-studies/databases': {
    title: 'Databases: Notes and Questions | WASSCE ICT',
    description:
      'WASSCE ICT notes and practice questions on databases: DBMS, tables, fields, records, primary and foreign keys, queries, forms, reports and database types.',
  },
  '/wassce/ict-computer-studies/databases/database-tables-fields-records-and-primary-key': {
    title: 'Database Fields, Records and Primary Key | WASSCE ICT',
    description:
      'Database basics: DBMS examples, tables, fields and records, data types, primary and foreign keys, queries, forms and reports, relationships and database types.',
  },
  '/wassce/ict-computer-studies/presentations-and-graphics': {
    title: 'Presentations and Graphics: Notes and Questions | WASSCE',
    description:
      'WASSCE ICT notes and practice questions on presentation software and graphics: slides, transitions, animations, views, and bitmap vs vector graphics.',
  },
  '/wassce/ict-computer-studies/presentations-and-graphics/presentation-software-and-graphics-packages': {
    title: 'Presentation Software and Bitmap vs Vector | WASSCE ICT',
    description:
      'Presentation software: slides, layouts, themes, transitions, animations and views, rules for good slides, graphics packages, and bitmap vs vector graphics.',
  },
  // Nov 2026: ICT / Computer Studies, batch 3a: "types of network", "network topology", "internet vs www",
  // "parts of a url", "mobile money", "sim card and imei", "computer ethics", "software piracy", "computer virus".
  '/wassce/ict-computer-studies/networks-and-networking': {
    title: 'Computer Networks: Notes and Questions | WASSCE ICT',
    description:
      'WASSCE ICT notes and practice questions on computer networks: LAN, MAN and WAN, bus, star and ring topologies, network devices and transmission media.',
  },
  '/wassce/ict-computer-studies/networks-and-networking/types-of-networks-topologies-and-network-devices': {
    title: 'Types of Networks, Topologies and Devices | WASSCE ICT',
    description:
      'Types of computer network (PAN, LAN, MAN, WAN), bus, star, ring and mesh topologies, the router, switch and modem, cables, and simplex vs duplex transmission.',
  },
  '/wassce/ict-computer-studies/the-internet-and-email': {
    title: 'The Internet and Email: Notes and Questions | WASSCE ICT',
    description:
      'WASSCE ICT notes and practice questions on the Internet and email: WWW, URLs, IP addresses and DNS, browsers, search engines, ISPs, CC, BCC and attachments.',
  },
  '/wassce/ict-computer-studies/the-internet-and-email/internet-www-url-and-email': {
    title: 'Internet vs WWW, Parts of a URL and Email | WASSCE ICT',
    description:
      'How the Internet works: IP addresses, DNS and ISPs, the Internet vs the World Wide Web, parts of a URL, browsers and search engines, and how to send an email.',
  },
  '/wassce/ict-computer-studies/mobile-technology-and-ict-gadgets': {
    title: 'Mobile Technology: Notes and Questions | WASSCE ICT',
    description:
      'WASSCE ICT notes and practice questions on mobile technology: 1G to 5G, smartphones, SIM and IMEI, Bluetooth, GPS, mobile money and ICT gadgets.',
  },
  '/wassce/ict-computer-studies/mobile-technology-and-ict-gadgets/mobile-technology-smartphones-and-mobile-money': {
    title: 'Mobile Technology, Smartphones and Mobile Money | WASSCE',
    description:
      'Mobile networks from 1G to 5G, parts of a smartphone, SIM card vs IMEI, Bluetooth, GPS, NFC and hotspots, mobile money and USSD, and everyday ICT gadgets.',
  },
  '/wassce/ict-computer-studies/computer-ethics': {
    title: 'Computer Ethics: Notes and Questions | WASSCE ICT',
    description:
      'WASSCE ICT notes and practice questions on computer ethics: privacy, intellectual property, copyright, software piracy, plagiarism and netiquette.',
  },
  '/wassce/ict-computer-studies/computer-ethics/computer-ethics-privacy-copyright-and-piracy': {
    title: 'Computer Ethics: Copyright, Piracy, Netiquette | WASSCE ICT',
    description:
      'What computer ethics means: privacy and data protection, copyright, patents and trademarks, software piracy, plagiarism, cyberbullying and netiquette.',
  },
  '/wassce/ict-computer-studies/computer-viruses-and-cybersecurity': {
    title: 'Computer Viruses: Notes and Questions | WASSCE ICT',
    description:
      'WASSCE ICT notes and practice questions on computer viruses and cybersecurity: malware, symptoms, hacking, phishing, firewalls, encryption and passwords.',
  },
  '/wassce/ict-computer-studies/computer-viruses-and-cybersecurity/computer-viruses-malware-and-how-to-stay-safe': {
    title: 'Computer Viruses, Malware and Cybersecurity | WASSCE ICT',
    description:
      'Types of malware, how computer viruses spread and their symptoms, hacking, phishing and SIM swap fraud, and protection: antivirus, firewall, encryption and 2FA.',
  },
  // Nov 2026: ICT / Computer Studies, batch 3b: "flowchart symbols", "algorithm and pseudocode",
  // "data types in programming", "program development life cycle", "uses of ICT", "computer lab rules".
  '/wassce/ict-computer-studies/algorithms-flowcharts-and-pseudocode': {
    title: 'Algorithms and Flowcharts: Notes and Questions | WASSCE',
    description:
      'WASSCE ICT notes and practice questions on algorithms, flowcharts and pseudocode: flowchart symbols, sequence, selection, loops and trace tables.',
  },
  '/wassce/ict-computer-studies/algorithms-flowcharts-and-pseudocode/algorithms-flowchart-symbols-and-pseudocode': {
    title: 'Flowchart Symbols, Algorithms and Pseudocode | WASSCE ICT',
    description:
      'What an algorithm is, flowchart symbols and their meaning, writing pseudocode, sequence, selection and iteration with worked flowcharts, and trace tables.',
  },
  '/wassce/ict-computer-studies/programming-concepts': {
    title: 'Programming Concepts: Notes and Questions | WASSCE ICT',
    description:
      'WASSCE ICT notes and practice questions on programming concepts: variables, data types, operators, truth tables, arrays, subprograms and errors.',
  },
  '/wassce/ict-computer-studies/programming-concepts/variables-data-types-operators-and-errors': {
    title: 'Variables, Data Types and Operators | WASSCE ICT',
    description:
      'Programming concepts explained: variables and constants, data types, arithmetic, relational and logical operators, arrays, functions, and types of errors.',
  },
  '/wassce/ict-computer-studies/introduction-to-programming': {
    title: 'Introduction to Programming: Notes and Questions | WASSCE',
    description:
      'WASSCE ICT notes and practice questions on programming: the program development life cycle, IPO charts, QBASIC and Python, and good program qualities.',
  },
  '/wassce/ict-computer-studies/introduction-to-programming/program-development-life-cycle-and-first-programs': {
    title: 'Program Development Life Cycle, First Programs | WASSCE ICT',
    description:
      'The stages of the program development life cycle, IPO charts, keywords and comments, and simple QBASIC and Python programs for area, temperature and interest.',
  },
  '/wassce/ict-computer-studies/ict-and-society': {
    title: 'ICT and Society: Notes and Questions | WASSCE ICT',
    description:
      'WASSCE ICT notes and practice questions on ICT and society: uses of ICT in each sector, e-commerce, telemedicine, the digital divide and ICT careers.',
  },
  '/wassce/ict-computer-studies/ict-and-society/uses-and-effects-of-ict-in-society': {
    title: 'Uses and Effects of ICT in Society | WASSCE ICT',
    description:
      'Uses of ICT in education, health, banking, agriculture and government, e-learning and e-commerce, positive and negative effects, the digital divide, careers.',
  },
  '/wassce/ict-computer-studies/practical-computer-skills': {
    title: 'Practical Computer Skills: Notes and Questions | WASSCE',
    description:
      'WASSCE ICT notes and practice questions on practical skills: lab rules, ergonomics, RSI and eye strain, touch typing, computer ports and troubleshooting.',
  },
  '/wassce/ict-computer-studies/practical-computer-skills/computer-lab-safety-ergonomics-ports-and-troubleshooting': {
    title: 'Computer Lab Rules, Ergonomics and Ports | WASSCE ICT',
    description:
      'Computer laboratory safety rules, ergonomics and health problems, touch typing and home row keys, ports such as USB and HDMI, and basic troubleshooting.',
  },
  // Nov 2026: Further Mathematics, batch 1 (algebra), in the words students search for:
  // "remainder theorem and factor theorem", "partial fractions", "binomial expansion",
  // "laws of logarithms", "De Morgan's law", "binary operation", "composite and inverse function".
  '/wassce/further-mathematics': {
    title: 'WASSCE Further Mathematics: Notes and Practice Questions',
    description:
      'Free WASSCE Further Maths notes with worked examples, diagrams, key terms and practice questions: polynomials, partial fractions, binomial theorem and more.',
  },
  '/wassce/further-mathematics/polynomials-theory-of-equations-and-roots': {
    title: 'Remainder and Factor Theorem Questions | WASSCE Further Maths',
    description:
      'WASSCE Further Maths notes and questions on polynomials: the remainder theorem, the factor theorem, solving cubics, and the sum and product of roots.',
  },
  '/wassce/further-mathematics/polynomials-theory-of-equations-and-roots/remainder-and-factor-theorems-and-roots': {
    title: 'Remainder and Factor Theorems Explained | WASSCE Further Maths',
    description:
      'How to find a remainder without dividing, factorise and solve a cubic with the factor theorem, find unknown coefficients, and use the sum and product of roots.',
  },
  '/wassce/further-mathematics/rational-functions-and-partial-fractions': {
    title: 'Partial Fractions: Notes and Questions | WASSCE Further Maths',
    description:
      'WASSCE Further Maths notes and questions on partial fractions: distinct linear factors, repeated factors, quadratic factors and improper fractions.',
  },
  '/wassce/further-mathematics/rational-functions-and-partial-fractions/partial-fractions': {
    title: 'Partial Fractions with Repeated Factors | WASSCE Further Maths',
    description:
      'Resolve a fraction into partial fractions: the forms for linear, repeated and quadratic factors, the cover-up method, and improper fractions.',
  },
  '/wassce/further-mathematics/binomial-theorem': {
    title: 'Binomial Theorem: Notes and Questions | WASSCE Further Maths',
    description:
      'WASSCE Further Maths notes and questions on the binomial theorem: Pascal’s triangle, the general term, the term independent of x and approximations.',
  },
  '/wassce/further-mathematics/binomial-theorem/binomial-expansion-and-general-term': {
    title: 'Binomial Expansion and General Term | WASSCE Further Maths',
    description:
      'Expand (a + b)ⁿ with Pascal’s triangle and nCr, find any term and the term independent of x, approximate, and expand negative or fractional powers.',
  },
  '/wassce/further-mathematics/surds-indices-and-logarithms': {
    title: 'Surds, Indices and Logarithms Questions | WASSCE Further Maths',
    description:
      'WASSCE Further Maths notes and questions on surds, indices and logarithms: rationalising, exponential equations, the laws of logarithms and change of base.',
  },
  '/wassce/further-mathematics/surds-indices-and-logarithms/surds-indices-and-logarithms': {
    title: 'Laws of Logarithms and Surds Explained | WASSCE Further Maths',
    description:
      'Rationalise compound surds, find the square root of a surd, solve exponential equations as quadratics, and use the laws of logarithms and change of base.',
  },
  '/wassce/further-mathematics/sets': {
    title: 'Sets and Binary Operations Questions | WASSCE Further Maths',
    description:
      'WASSCE Further Maths notes and questions on sets and binary operations: De Morgan’s laws, three-set Venn diagrams, identity and inverse elements.',
  },
  '/wassce/further-mathematics/sets/algebra-of-sets-and-venn-diagrams': {
    title: 'De Morgan’s Laws and Venn Diagrams | WASSCE Further Maths',
    description:
      'The laws of the algebra of sets, De Morgan’s laws, the number of subsets and the power set, and three-set Venn diagram problems by inclusion–exclusion.',
  },
  '/wassce/further-mathematics/sets/binary-operations': {
    title: 'Binary Operations: Identity and Inverse | WASSCE Further Maths',
    description:
      'Binary operations explained: evaluate a ∗ b, test closure, commutativity and associativity, find the identity element and inverses, and read operation tables.',
  },
  '/wassce/further-mathematics/functions': {
    title: 'Functions: Notes and Questions | WASSCE Further Maths',
    description:
      'WASSCE Further Maths notes and questions on functions: domain and range, one-to-one and onto functions, composite functions and inverse functions.',
  },
  '/wassce/further-mathematics/functions/domain-range-composite-and-inverse-functions': {
    title: 'Domain, Composite and Inverse Functions | WASSCE Further Maths',
    description:
      'How to find the domain and range of a function, tell one-to-one from many-to-one, work out composite functions fg(x) and gf(x), and find an inverse function.',
  },
}

/**
 * The subject's name as it reads in a page title. "ICT / Computer Studies" is
 * too long to leave room for the topic ("WASSCE ICT / Computer Studies: Number
 * Systems and Data Representation Key Terms..."), so titles say "ICT"; every
 * other subject keeps its full name.
 */
const TITLE_SUBJECT: Partial<Record<string, string>> = { 'ICT / Computer Studies': 'ICT' }
export const titleSubject = (name: string): string => TITLE_SUBJECT[name] ?? name

/** Google shows about 60 characters of a title: add the brand only when it still fits. */
export function brandedTitle(title: string, max = 65): string {
  // A title that already ends "| WASSCE" or "| WASSCE Maths" would read "| WASSCE | WASSCE Tutor".
  if (/\|\s*WASSCE\b[^|]*$/.test(title)) return title
  const full = `${title} | ${SITE.name}`
  return full.length <= max ? full : title
}

/**
 * A meta description from parts in order of importance: as many whole parts
 * as fit in `max` characters (Google shows about 155-160); a part that does
 * not fit is skipped. The first part is always kept, cut at a word if it alone
 * is too long.
 */
export function fitDescription(parts: string[], max = 160): string {
  const [first = '', ...rest] = parts.map((p) => p.trim()).filter(Boolean)
  let out = first.length <= max ? first : `${first.slice(0, first.lastIndexOf(' ', max - 1)).replace(/[,;:.\s]+$/, '')}…`
  for (const part of rest) if (out.length + 1 + part.length <= max) out += ` ${part}`
  return out
}

// Same shapes the router's `head` option returns.
export type HeadTags = {
  meta: NonNullable<AnyRouteMatch['meta']>
  links: NonNullable<AnyRouteMatch['links']>
  scripts?: NonNullable<AnyRouteMatch['headScripts']>
}

/** A <script type="application/ld+json"> head tag; "<" is escaped so the JSON can't close the script. */
function jsonLd(data: Record<string, unknown>): NonNullable<AnyRouteMatch['headScripts']>[number] {
  return { type: 'application/ld+json', children: JSON.stringify(data).replace(/</g, String.fromCharCode(92) + 'u003c') }
}

export function absoluteUrl(path: string): string {
  return path === '/' ? `${SITE.origin}/` : `${SITE.origin}${path}`
}

const ORG_ID = `${SITE.origin}/#organization`

/**
 * WASSCE Tutor as publisher, author, creator or provider on any page: the same
 * @id and main type as ORGANIZATION below, so search engines read one entity
 * everywhere instead of a new "Organization" on each page.
 */
export function orgRef({ logo = false }: { logo?: boolean } = {}): Record<string, unknown> {
  return {
    '@type': 'EducationalOrganization',
    '@id': ORG_ID,
    name: SITE.name,
    url: `${SITE.origin}/`,
    ...(logo ? { logo: { '@type': 'ImageObject', url: `${SITE.origin}/logo.png` } } : {}),
  }
}

/** The blog as one entity, shared by /blog and every post's isPartOf. */
export const BLOG_ID = `${SITE.origin}/blog#blog`

// The business itself: an education service based in Freetown that serves
// the whole country online. Typed as both EducationalOrganization and
// LocalBusiness so search engines can show it for local searches. sameAs is
// the Google Business Profile (src/lib/reviews.ts). Add streetAddress,
// postalCode and other profiles (socials) here when they exist; never guess them.
const ORGANIZATION = {
  '@type': ['EducationalOrganization', 'LocalBusiness'],
  '@id': ORG_ID,
  name: SITE.name,
  url: `${SITE.origin}/`,
  logo: `${SITE.origin}/logo.png`,
  image: `${SITE.origin}/og-image.jpg`,
  description:
    'WASSCE preparation for Sierra Leone students, built in Freetown: syllabus lessons, original exam-style practice questions and one-to-one tutors.',
  email: CONTACT.email,
  telephone: CONTACT.phoneE164,
  address: {
    '@type': 'PostalAddress',
    addressLocality: CONTACT.locality,
    addressRegion: CONTACT.region,
    addressCountry: CONTACT.countryCode,
  },
  areaServed: { '@type': 'Country', name: CONTACT.country },
  priceRange: `NLe ${FROM_PRICE}–${TOP_PRICE}`,
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      telephone: CONTACT.phoneE164,
      email: CONTACT.email,
      areaServed: CONTACT.countryCode,
      availableLanguage: ['English'],
    },
  ],
  knowsAbout: ['WASSCE', 'West African Senior School Certificate Examination', 'Secondary education in Sierra Leone'],
  sameAs: [GOOGLE_MAPS_URL, CONTACT.tiktok],
}

// Organization + WebSite + app entity graph, on the homepage.
const HOME_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    ORGANIZATION,
    {
      '@type': 'WebSite',
      '@id': `${SITE.origin}/#website`,
      name: SITE.name,
      // Helps Google show "WASSCE Tutor" above results instead of the bare domain.
      alternateName: ['WASSCETutor', 'wasscetutor.com'],
      url: `${SITE.origin}/`,
      inLanguage: 'en',
      publisher: orgRef(),
    },
    {
      '@type': 'SoftwareApplication',
      name: SITE.name,
      description: 'WASSCE preparation app built in Sierra Leone with syllabus lessons and exam-style practice questions.',
      url: `${SITE.origin}/`,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Android, Web',
      inLanguage: 'en',
      audience: {
        '@type': 'Audience',
        audienceType: 'WASSCE candidates',
        geographicArea: { '@type': 'Country', name: 'Sierra Leone' },
      },
      offers: { '@type': 'AggregateOffer', priceCurrency: 'SLE', lowPrice: '0', highPrice: String(TOP_PRICE), offerCount: String(PLANS.length + 1) },
      provider: { '@id': ORG_ID },
    },
  ],
}

// Contact page: the business entity in full, with the page about it.
const CONTACT_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    ORGANIZATION,
    {
      '@type': 'ContactPage',
      '@id': `${SITE.origin}/contact#page`,
      url: `${SITE.origin}/contact`,
      name: 'Contact WASSCE Tutor',
      inLanguage: 'en',
      about: { '@id': ORG_ID },
      mainEntity: { '@id': ORG_ID },
    },
  ],
}

const ABOUT_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    ORGANIZATION,
    {
      '@type': 'AboutPage',
      url: `${SITE.origin}/about`,
      name: 'About WASSCE Tutor',
      inLanguage: 'en',
      about: { '@id': ORG_ID },
    },
  ],
}

const PAGE_JSON_LD: Partial<Record<PublicPath, Record<string, unknown>[]>> = {
  '/': [HOME_JSON_LD],
  // breadcrumbJsonLd is a function declaration, so it is hoisted and usable here.
  '/about': [ABOUT_JSON_LD, breadcrumbJsonLd([['Home', '/'], ['About', '/about']])],
  '/contact': [CONTACT_JSON_LD, breadcrumbJsonLd([['Home', '/'], ['Contact', '/contact']])],
  '/tutors': [breadcrumbJsonLd([['Home', '/'], ['Private tutors', '/tutors']])],
  '/affiliate': [breadcrumbJsonLd([['Home', '/'], ['Affiliate programme', '/affiliate']])],
  '/become-a-tutor': [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Become a WASSCE Tutor in Sierra Leone',
      url: `${SITE.origin}/become-a-tutor`,
      description: 'Become a WASSCE tutor in Sierra Leone in three steps: make a tutor card with your photo, subjects and monthly fee, and get messages from students on WhatsApp.',
      mainEntity: {
        '@type': 'Service',
        name: 'WASSCE Tutor teaching partner onboarding',
        serviceType: 'Tutoring marketplace onboarding',
        provider: { '@id': ORG_ID },
        areaServed: { '@type': 'Country', name: 'Sierra Leone' },
      },
    },
    breadcrumbJsonLd([['Home', '/'], ['Become a tutor', '/become-a-tutor']]),
  ],
  '/blog': [breadcrumbJsonLd([['Home', '/'], ['Blog', '/blog']])],
  '/universities': [breadcrumbJsonLd([['Home', '/'], ['Universities', '/universities']])],
}

type IndexablePage = {
  path: string
  title: string
  description: string
  ogTitle?: string
  /** JSON-LD objects, each emitted as its own <script type="application/ld+json">. */
  jsonLd?: Record<string, unknown>[]
  image?: string
  type?: 'website' | 'article' | 'profile'
  publishedAt?: string
  modifiedAt?: string
}

/** Tags for an indexable page: unique title + description, self canonical, OG/Twitter text, optional JSON-LD. */
export function indexablePageTags({ path, title, description, ogTitle = title, jsonLd: data = [], image = `${SITE.origin}/og-image.jpg`, type = 'website', publishedAt, modifiedAt }: IndexablePage): HeadTags {
  const url = absoluteUrl(path)
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large' },
      { property: 'og:type', content: type },
      { property: 'og:image', content: image },
      { property: 'og:image:alt', content: title },
      { property: 'og:title', content: ogTitle },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: image },
      { name: 'twitter:title', content: ogTitle },
      { name: 'twitter:description', content: description },
      ...(type === 'article' && publishedAt ? [{ property: 'article:published_time', content: publishedAt }, { property: 'article:modified_time', content: modifiedAt ?? publishedAt }] : []),
    ],
    links: [{ rel: 'canonical', href: url }],
    scripts: data.map(jsonLd),
  }
}

/** Tags for a fixed page listed in PUBLIC_PAGES. */
export function publicPageTags(path: PublicPath): HeadTags {
  const page: PublicPage = PUBLIC_PAGES[path]
  return indexablePageTags({
    path,
    title: page.title,
    description: page.description,
    ogTitle: page.ogTitle,
    jsonLd: PAGE_JSON_LD[path] ?? [],
  })
}

/** schema.org BreadcrumbList for a trail of [name, path] pairs, ending with the current page. */
export function breadcrumbJsonLd(trail: [name: string, path: string][]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: absoluteUrl(path),
    })),
  }
}

/** Tags for app screens and private pages: a readable tab title, never indexed. */
export function privatePageTags(title: string): HeadTags {
  return {
    meta: [
      { title: `${title} | ${SITE.name}` },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
    links: [],
  }
}

/** Route `head` option for an indexable page. */
export const publicHead = (path: PublicPath) => () => publicPageTags(path)

/** Route `head` option for a non-indexable screen. */
export const privateHead = (title: string) => () => privatePageTags(title)

/** schema.org Service for a tutoring page. */
export function tutoringServiceJsonLd({ name, description, path, subject }: { name: string; description: string; path: string; subject?: string }): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: absoluteUrl(path),
    serviceType: subject ? `Private ${subject} tutoring` : 'Private tutoring',
    category: 'Education',
    provider: { ...orgRef(), telephone: CONTACT.phoneE164 },
    areaServed: [
      { '@type': 'Country', name: 'Sierra Leone' },
      ...['Freetown', 'Bo', 'Kenema', 'Makeni'].map((city) => ({ '@type': 'City', name: city, containedInPlace: { '@type': 'Country', name: 'Sierra Leone' } })),
    ],
    audience: { '@type': 'EducationalAudience', educationalRole: 'student', audienceType: 'WASSCE candidates' },
    availableChannel: { '@type': 'ServiceChannel', serviceUrl: absoluteUrl(path), availableLanguage: 'en' },
  }
}

/** schema.org FAQPage from visible question/answer pairs (must match what the page shows). */
export function faqJsonLd(items: [question: string, answer: string][]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  }
}

/**
 * One question for quizJsonLd. Every text is Markdown with its maths as LaTeX
 * between $$ … $$ (markdownWithMath in lib/question-text.ts), as Google's
 * practice problems read it, and all of it is on the page.
 */
export type QuizQuestion = {
  /** The question as written. */
  text: string
  /** The options in the order shown, each wrong one with the page's reason it is wrong. */
  options: { text: string; correct: boolean; reason?: string }[]
  /** The worked solution for the correct option. */
  explanation?: string
  image?: string | null
}

/** Senior secondary school (SSS 1 to 3) and older private candidates. */
const WASSCE_AGE_RANGE = '15-'

/**
 * schema.org Quiz for a page of multiple-choice questions with their answers
 * and working (all visible on the page), with the fields Google's practice
 * problems ask for: each option's position and format, why each wrong option
 * is wrong, and the working for the right one. Not marked as flashcards:
 * Google's Education Q&A carousel is for flashcard pages only, and these are
 * not. There is no question-level hint (`comment`): the pages show none, and
 * markup must not say more than the page.
 */
export function quizJsonLd({ name, path, about, subject, questions }: { name: string; path: string; about: string; subject: string; questions: QuizQuestion[] }): Record<string, unknown> {
  const url = absoluteUrl(path)
  const comment = (text?: string) => (text ? { comment: { '@type': 'Comment', encodingFormat: 'text/markdown', text } } : {})
  const answer = (o: QuizQuestion['options'][number], position: number, explanation?: string) => ({
    '@type': 'Answer',
    position,
    encodingFormat: 'text/markdown',
    text: o.text,
    ...(o.correct
      ? {
          // The first paragraph of the working says why it is right; all of it is the explanation.
          ...comment(explanation?.split(/\n\s*\n/)[0]),
          ...(explanation ? { answerExplanation: { '@type': 'Comment', encodingFormat: 'text/markdown', text: explanation } } : {}),
        }
      : comment(o.reason)),
  })
  return {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    '@id': `${url}#quiz`,
    url,
    name,
    about: { '@type': 'Thing', name: about },
    educationalLevel: 'Senior secondary (WASSCE)',
    educationalAlignment: { '@type': 'AlignmentObject', alignmentType: 'educationalSubject', targetName: subject },
    learningResourceType: 'Practice problems',
    assesses: about,
    isAccessibleForFree: true,
    inLanguage: 'en',
    audience: { '@type': 'EducationalAudience', educationalRole: 'student', audienceType: 'WASSCE candidates' },
    provider: { '@id': ORG_ID },
    hasPart: questions.map((q, i) => {
      const answers = q.options.map((o, position) => answer(o, position, q.explanation))
      const correct = q.options.findIndex((o) => o.correct)
      return {
        '@type': 'Question',
        '@id': `${url}#q${i + 1}`,
        name: `Question ${i + 1}`,
        learningResourceType: 'Practice problem',
        eduQuestionType: 'Multiple choice',
        typicalAgeRange: WASSCE_AGE_RANGE,
        encodingFormat: 'text/markdown',
        text: q.text,
        ...(q.image ? { image: q.image } : {}),
        ...(correct >= 0 ? { acceptedAnswer: answers[correct] } : {}),
        suggestedAnswer: answers.filter((_, j) => j !== correct),
      }
    }),
  }
}

/**
 * schema.org Quiz of flashcards (Google's Education Q&A): one card per key
 * term, the term on the front (as the page shows it) and the lesson's
 * definition as the answer. Only for a page where every card is a flashcard.
 */
export function flashcardsJsonLd({ name, path, about, subject, cards }: { name: string; path: string; about: string; subject: string; cards: { front: string; back: string }[] }): Record<string, unknown> {
  const url = absoluteUrl(path)
  return {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    '@id': `${url}#flashcards`,
    url,
    name,
    about: { '@type': 'Thing', name: about },
    educationalLevel: 'Senior secondary (WASSCE)',
    educationalAlignment: { '@type': 'AlignmentObject', alignmentType: 'educationalSubject', targetName: subject },
    learningResourceType: 'Flashcard',
    isAccessibleForFree: true,
    inLanguage: 'en',
    provider: { '@id': ORG_ID },
    hasPart: cards.map((c) => ({
      '@type': 'Question',
      eduQuestionType: 'Flashcard',
      text: c.front,
      acceptedAnswer: { '@type': 'Answer', text: c.back },
    })),
  }
}
