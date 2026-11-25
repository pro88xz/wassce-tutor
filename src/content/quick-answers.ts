// Quick answers: the question people search for, answered in a few sentences at
// the top of the page that ranks for it (QuickAnswer, src/components/public).
//
// Chosen from Search Console (24 Aug to 24 Nov 2026): question searches that
// land on pages whose answer is hard to find at the top, because it sits in a
// video transcript ("what is the main purpose of biological classification?",
// position 40; "what is transpiration", 68), in a table ("what are the 7
// characteristics of soil?", 17), several sections down ("what is economics",
// 19; "types of executive"), or on a topic or subject page that has no
// definition at all ("what is gaseous exchange", "urinary system", "what is a
// surd", "learn about literature").
//
// Only where it helps the reader: a page whose lesson already opens with the
// answer gets no box, since saying it twice makes the page worse, not better.
// The box is part of the page, not of the lesson, so a reviewed lesson keeps its
// review. Every answer says what the lesson itself says (checked against its
// text); keep them in step if a lesson changes. 40 to 60 words each.

export type QuickAnswer = {
  /** The question, worded as people search for it. */
  question: string
  answer: string
  /** A short list under the answer: [term, what it means]. */
  points?: [string, string][]
  /** A small comparison table under the answer. */
  table?: { head: string[]; rows: string[][] }
}

export const QUICK_ANSWERS: Partial<Record<string, QuickAnswer>> = {
  // "what is the main purpose of biological classification?" (66, position 40); the answer was in the video transcript.
  '/wassce/biology/classification-of-living-things/why-we-classify-living-things': {
    question: 'What is the main purpose of biological classification?',
    answer:
      'The main purpose of biological classification is to sort the huge variety of living things into groups, so that they are easier to study. Classification also helps us to identify an organism, gives each organism one scientific name that scientists everywhere understand, and shows how organisms are related to one another.',
  },
  // "what are the 7 characteristics of soil?" (40, position 17); the seven were in a table.
  '/wassce/agricultural-science/soil-properties-and-types/soil-properties-and-types-sandy-clay-and-loam': {
    question: 'What are the 7 characteristics of soil?',
    answer:
      'The seven physical characteristics (properties) of soil are texture, structure, porosity, permeability, water-holding capacity, colour and temperature. Soil also has chemical properties, such as its pH (most crops grow best at pH 5.5 to 7.0), and biological properties.',
    points: [
      ['Texture', 'the proportions of sand, silt and clay; gritty, smooth or sticky'],
      ['Structure', 'how particles group into crumbs or clods; crumb structure is best for crops'],
      ['Porosity', 'the amount of pore space between particles'],
      ['Permeability', 'how easily water passes through'],
      ['Water-holding capacity', 'how much water the soil holds against gravity'],
      ['Colour', 'dark soils are rich in humus; red or yellow soils contain iron oxides'],
      ['Temperature', 'affects germination, root growth and soil organisms'],
    ],
  },
  // "what is economics" (38, position 19), "definition of economics", "define economics".
  '/wassce/economics/nature-and-scope-of-economics/what-economics-is-definitions-and-subject-matter': {
    question: 'What is economics?',
    answer:
      'Economics is the social science that studies how people, businesses and governments make choices about using scarce resources to satisfy unlimited wants. The definition most widely used is Lionel Robbins’s: economics studies human behaviour as a relationship between ends and scarce means which have alternative uses. Earlier definitions were Adam Smith’s (wealth) and Alfred Marshall’s (welfare).',
  },
  // "what is gaseous exchange" (19, position 20), "gas exchange" (81, position 12), "gaseous exchange".
  '/wassce/biology/respiratory-systems-and-gas-exchange': {
    question: 'What is gaseous exchange?',
    answer:
      'Gaseous exchange (gas exchange) is the diffusion of oxygen and carbon dioxide between an organism and its environment, across a respiratory surface. Oxygen goes in for aerobic respiration and carbon dioxide comes out. In humans it happens in the alveoli of the lungs, in fish across the gills, in insects through the tracheae and in plants mainly through the stomata.',
  },
  // "urinary system" (305, position 11), "how the urinary system works", "urinary system organs".
  '/wassce/biology/the-kidney-and-urinary-system': {
    question: 'How does the urinary system work?',
    answer:
      'The urinary system removes metabolic waste from the blood and keeps the body’s water and salt balance steady. The two kidneys filter the blood and remove urea, excess salts and excess water as urine. The ureters carry the urine to the bladder, which stores it until it leaves the body through the urethra. The kidney’s filtering unit is the nephron.',
  },
  // "endocrine system" (80, position 8), "endocrine", "what is endocrine".
  '/wassce/biology/the-endocrine-system': {
    question: 'What is the endocrine system?',
    answer:
      'The endocrine system is a group of ductless glands that release hormones, chemical messengers, straight into the blood, which carries each hormone to its target organs. The major glands include the pituitary, thyroid, adrenal glands, pancreas, ovaries and testes. Hormones control slower, longer-lasting processes such as growth, metabolism, reproduction and blood glucose.',
  },
  // "surds" (39, position 29), "what is a surd" (position 83).
  '/wassce/mathematics/surds': {
    question: 'What is a surd?',
    answer:
      'A surd is a root of a number that cannot be simplified to a whole number or a fraction, so its value is irrational: √2, √3 and √5 are surds, but √4 = 2 is not. WASSCE expects surds in simplest form, with no perfect-square factor left under the root: √50 = √(25 × 2) = 5√2.',
  },
  // "what is transpiration" (11, position 68), "definition of transpiration"; the answer was in the video transcript.
  '/wassce/biology/transport-in-plants/transport-in-plants-transpiration-water-movement-and-translocation': {
    question: 'What is transpiration?',
    answer:
      'Transpiration is the loss of water vapour from the parts of a plant above the ground, mainly through the stomata in the leaves. It pulls water up from the roots through the xylem, in the transpiration stream. Bright light, higher temperature and wind make it faster; high humidity makes it slower. Do not confuse it with translocation, the movement of food in the phloem.',
  },
  // "types of executive" (12, position 8).
  '/wassce/government/the-executive/the-executive-types-composition-and-functions': {
    question: 'What are the types of executive?',
    answer:
      'The executive is the arm of government that carries out laws and policies and runs the day-to-day administration of the state. It is classed as nominal (a ceremonial head) or real (holding actual power); single, dual or plural, by how many people share it; and political (ministers, who change with governments) or permanent (civil servants, who stay).',
  },
  '/wassce/literature-in-english': {
    question: 'What is literature?',
    answer:
      'Literature is imaginative writing, or imaginative spoken composition, in which language is used with skill and care to express human experience: what people feel, think, fear, hope and do. Its three main forms, or genres, are prose, drama and poetry, and WASSCE Literature in English tests all three, with set texts in each.',
  },
  // "state three basic human rights" (11, position 37).
  '/wassce/government/fundamental-human-rights-and-citizenship/fundamental-human-rights-types-protection-and-limits': {
    question: 'What are fundamental human rights? Name three',
    answer:
      'Fundamental human rights are the basic rights and freedoms that belong to every person because they are human, whatever their sex, ethnic group, religion or opinion. Three basic examples protected by Sierra Leone’s 1991 Constitution are the right to life, the right to personal liberty and freedom of expression; others include freedom of movement, of religion and of assembly.',
  },
  // "chemistry for beginners" (1,431, position 4), "chemistry explained", "learn about chemistry", "what are the basics of chemistry?".
  '/wassce/chemistry/introduction-to-chemistry': {
    question: 'What is chemistry?',
    answer:
      'Chemistry is the branch of science that studies the composition, structure and properties of matter, the changes that matter undergoes, and the energy involved in those changes. Chemists ask what a substance is made of, how its particles are arranged, how it changes and how that change can be used or controlled: in soap, medicines, fertilisers and clean water.',
  },
}
