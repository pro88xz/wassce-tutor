// Quick answers: the question people search for, answered in a few sentences at
// the top of the page that ranks for it (QuickAnswer, src/components/public).
//
// Chosen from Search Console (24 Aug to 24 Nov 2026): question searches such as
// "what is the main purpose of biological classification?" (position 40), "what
// are the 7 characteristics of soil?" (17), "what is gaseous exchange" (20) and
// fifteen ways of asking the difference between reflection, refraction and
// diffraction landed on lessons that answer them, but not in a form Google can
// lift: the answer was in a video transcript, a table, or several paragraphs
// down. A question as a heading with a short, direct answer under it is what
// featured snippets and AI answers quote.
//
// The box is part of the page, not of the lesson, so a reviewed lesson keeps
// its review. Every answer says what the lesson itself says (checked against
// its text); keep them in step if a lesson changes. 40 to 60 words each.

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
  // ~200 impressions across 15 wordings: "class 10", "vs", "with examples", "and interference".
  '/wassce/physics/wave-phenomena/reflection-refraction-and-diffraction-of-waves': {
    question: 'What is the difference between reflection, refraction, diffraction and interference?',
    answer:
      'Reflection is a wave bouncing back from a surface. Refraction is a wave bending as it passes into a new medium, because its speed changes. Diffraction is a wave spreading out through a gap or round an obstacle. Interference is two waves overlapping, so they add up or cancel out. All four happen to water, sound and light waves.',
    table: {
      head: ['', 'What happens', 'Speed and wavelength', 'Example'],
      rows: [
        ['Reflection', 'Bounces back off a surface', 'Unchanged', 'An echo; a mirror'],
        ['Refraction', 'Bends on entering a new medium', 'Both change; frequency stays the same', 'A stick looks bent in water'],
        ['Diffraction', 'Spreads through a gap or round an obstacle', 'Unchanged', 'Hearing a friend round a corner'],
        ['Interference', 'Two waves overlap and add or cancel', 'Unchanged', 'Loud and quiet spots between two loudspeakers'],
      ],
    },
  },
  // "what a noun": 176 impressions at position 7.
  '/wassce/english-language/nouns/what-are-nouns': {
    question: 'What is a noun?',
    answer:
      'A noun is a word that names a person, place, thing, animal or idea: Aminata, Freetown, book, goat, honesty. Three tests show a word is a noun: you can put a, an or the in front of it, you can usually make it plural, and it can take a possessive (Aminata’s bag).',
  },
  // "what is agriculture" (71, position 7) and "what is an example of agriculture?".
  '/wassce/agricultural-science/introduction-to-agriculture/defining-agriculture-and-its-importance': {
    question: 'What is agriculture?',
    answer:
      'Agriculture is the art and science of cultivating crops and rearing animals for the use of people: for food, raw materials and income. It covers the whole chain, from preparing the land to harvesting, storing, processing and marketing the produce. Examples: growing rice and cassava, rearing cattle and poultry, keeping bees, fish ponds and planting trees.',
  },
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
  // "how does inflation work" (17, position 8).
  '/wassce/economics/inflation-and-deflation/inflation-meaning-measurement-and-causes': {
    question: 'What is inflation and how does it work?',
    answer:
      'Inflation is a persistent, general rise in the price level over time, which reduces the purchasing power of money. Prices rise when total demand runs ahead of what the economy can supply (demand-pull), when costs such as fuel and wages rise (cost-push), when imports become dearer, or when too much money is created. It is measured with a consumer price index.',
  },
  // "what is biology" (17, position 50), "what are the biology" (24, position 53).
  '/wassce/biology/introduction-to-biology/what-is-biology-and-why-study-it': {
    question: 'What is biology?',
    answer:
      'Biology is the scientific study of living things and life processes. The word comes from two Greek words: bios, meaning life, and logos, meaning study. It covers everything from the bacteria in your gut and the cells of your body to the plants in the field and the animals around you.',
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
  // "what are prepositions" (12, position 60), "what is a preposition" (position 74 to 78).
  '/wassce/english-language/prepositions/what-are-prepositions': {
    question: 'What is a preposition?',
    answer:
      'A preposition is a word that shows the relationship between a noun or pronoun and another word in the sentence: its position, direction, time, manner, agency or cause. In “The book is on the table”, on is a preposition; change it to under or near and the picture changes. Common prepositions: in, on, at, under, near, to, from, by, with.',
  },
  // "what are articles" (11, position 34), "what is article".
  '/wassce/english-language/articles/what-are-articles': {
    question: 'What are articles in English?',
    answer:
      'Articles are the words a, an and the. They come before a noun to show whether it is specific or general, known or unknown. The is the definite article, for a particular thing: the dog. A and an are indefinite articles, for any one: a book, an orange. Use a before a consonant sound and an before a vowel sound.',
  },
  // "what is transpiration" (11, position 68), "definition of transpiration"; the answer was in the video transcript.
  '/wassce/biology/transport-in-plants/transport-in-plants-transpiration-water-movement-and-translocation': {
    question: 'What is transpiration?',
    answer:
      'Transpiration is the loss of water vapour from the parts of a plant above the ground, mainly through the stomata in the leaves. It pulls water up from the roots through the xylem, in the transpiration stream. Bright light, higher temperature and wind make it faster; high humidity makes it slower. Do not confuse it with translocation, the movement of food in the phloem.',
  },
  // "types of settlement" (13, position 12), "what is settlement in geography".
  '/wassce/geography/settlement-patterns/types-of-settlement-and-settlement-patterns': {
    question: 'What is a settlement, and what are the types of settlement?',
    answer:
      'A settlement is any place where people live, from a single farmhouse to a great city. Settlements are rural (villages and hamlets, where most people farm, fish or mine) or urban (towns and cities, where most people work in industry, trade and services). By the arrangement of their buildings they form three patterns: nucleated (clustered), dispersed (scattered) and linear (in a line).',
  },
  // "types of executive" (12, position 8).
  '/wassce/government/the-executive/the-executive-types-composition-and-functions': {
    question: 'What are the types of executive?',
    answer:
      'The executive is the arm of government that carries out laws and policies and runs the day-to-day administration of the state. It is classed as nominal (a ceremonial head) or real (holding actual power); single, dual or plural, by how many people share it; and political (ministers, who change with governments) or permanent (civil servants, who stay).',
  },
  // "mrs gren" (25, position 26), "what is mrs gren", "mrs gren biology".
  '/wassce/biology/characteristics-of-living-things/what-makes-something-alive-introducing-mrs-gren': {
    question: 'What is MRS GREN?',
    answer:
      'MRS GREN is a mnemonic for the seven characteristics that all living things share: Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion and Nutrition. A living thing (organism) shows all seven. A non-living thing, such as a stone, shows none of them, and a dead thing once showed them but no longer does.',
  },
  // "what is government" (11, position 11).
  '/wassce/government/meaning-and-nature-of-government/what-government-is-meanings-purposes-and-functions': {
    question: 'What is government?',
    answer:
      'Government has three meanings. As an institution, it is the machinery of the state that makes, carries out and interprets laws: the legislature, the executive and the judiciary. As a process, it is the act of governing: making rules, taking decisions, keeping order and providing services. As an academic subject, it is the systematic study of the state and the use of power.',
  },
  // "what is literature" (8, position 66), "what is literature in english"; "learn about literature" (1,020) lands on the subject page.
  '/wassce/literature-in-english/what-is-literature/what-is-literature-meaning-features-and-oral-and-written-forms': {
    question: 'What is literature?',
    answer:
      'Literature is imaginative writing, or imaginative spoken composition, in which language is used with skill and care to express human experience: what people feel, think, fear, hope and do. Its three main forms are prose, drama and poetry. It can be written, like a novel, or oral, like a folktale or a song passed on by word of mouth.',
  },
  '/wassce/literature-in-english': {
    question: 'What is literature?',
    answer:
      'Literature is imaginative writing, or imaginative spoken composition, in which language is used with skill and care to express human experience: what people feel, think, fear, hope and do. Its three main forms, or genres, are prose, drama and poetry, and WASSCE Literature in English tests all three, with set texts in each.',
  },
  // "state three basic human rights" (11, position 37).
  '/wassce/government/fundamental-human-rights-and-citizenship/fundamental-human-rights-types-protection-and-limits': {
    question: 'What are fundamental human rights? Three examples',
    answer:
      'Fundamental human rights are the basic rights and freedoms that belong to every person because they are human, whatever their sex, ethnic group, religion or opinion. Three basic examples protected by Sierra Leone’s 1991 Constitution are the right to life, the right to personal liberty and freedom of expression; others include freedom of movement, of religion and of assembly.',
  },
  // "chemistry for beginners" (1,431, position 4), "chemistry explained", "learn about chemistry", "what are the basics of chemistry?".
  '/wassce/chemistry/introduction-to-chemistry': {
    question: 'What is chemistry?',
    answer:
      'Chemistry is the branch of science that studies the composition, structure and properties of matter, the changes that matter undergoes, and the energy involved in those changes. Chemists ask what a substance is made of, how its particles are arranged, how it changes and how that change can be used or controlled: in soap, medicines, fertilisers and clean water.',
  },
  '/wassce/chemistry/introduction-to-chemistry/what-chemistry-is-branches-importance-and-careers': {
    question: 'What is chemistry?',
    answer:
      'Chemistry is the branch of science that studies the composition, structure and properties of matter, the changes that matter undergoes, and the energy involved in those changes. Its main branches are physical, inorganic, organic and analytical chemistry and biochemistry, with industrial, environmental and agricultural chemistry applying them.',
  },
}
