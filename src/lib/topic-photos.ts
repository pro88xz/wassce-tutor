// Topic photographs for topic discovery (Popular Topics on the homepage).
// Subject photos (subject-photos.ts) give each subject one consistent image;
// topic photos show the topic itself, so a Biology card and a Cell Structure
// card never share a picture. Keyed "subject-slug/topic-slug". Self-hosted
// WebP in public/img/topics (960 and 480 px, 16:10), credited on the About page.
type Credit = { creator: string; creatorUrl?: string; source: string; sourceUrl: string; license: string; licenseUrl: string }
/** position: Tailwind object-position class, written as a literal so Tailwind generates it. */
export type TopicPhoto = { src: string; small: string; position?: string; topic: string; caption: string; credit: Credit }

const pexels = (creator: string, page: string): Credit => ({
  creator,
  source: 'Pexels',
  sourceUrl: `https://www.pexels.com/photo/${page}/`,
  license: 'Pexels License',
  licenseUrl: 'https://www.pexels.com/license/',
})

const photo = (key: string, topic: string, caption: string, credit: Credit, position?: string): [string, TopicPhoto] => {
  const file = key.replace('/', '--')
  return [key, { src: `/img/topics/${file}.webp`, small: `/img/topics/${file}-480.webp`, position, topic, caption, credit }]
}

export const TOPIC_PHOTOS: Record<string, TopicPhoto> = Object.fromEntries([
  photo('biology/cell-structure', 'Cell Structure', 'Plant cells under a microscope', pexels('Fayette Reynolds M.S.', 'cell-seen-under-microscope-11198495')),
  photo('biology/classification-of-living-things', 'Classification of Living Things', 'A collection of butterfly specimens', pexels('Cátia Matos', 'photo-of-assorted-butterflies-1028904')),
  photo('biology/photosynthesis-and-plant-nutrition', 'Photosynthesis and Plant Nutrition', 'The veins of a green leaf', pexels('Egor Kamelev', 'close-up-of-leaf-surface-14192103')),
  photo('english-language/nouns', 'Nouns', 'Letter tiles spelling "words"', pexels('ClickerHappy', 'words-text-scrabble-blocks-695571')),
  photo('english-language/parts-of-speech', 'Parts of Speech', 'A dictionary entry', pexels('Nothing Ahead', 'close-up-of-a-dictionary-4567479')),
  photo('mathematics/number-bases', 'Number Bases', 'Rows of numbers on a screen', pexels('Tibe De Kort', 'codes-on-screen-9951077')),
  photo('mathematics/sequences-and-series', 'Sequences and Series', 'Dominoes standing in a row', pexels('Emily Ranquist', 'domino-game-1205650'), 'object-[30%_50%]'),
  photo('chemistry/atomic-structure', 'Atomic Structure', 'Models of atoms and molecules', pexels('Google DeepMind', 'graphic-design-of-molecular-models-25626509')),
  photo('agricultural-science/land-tenure-systems', 'Land Tenure Systems', 'Farm plots seen from the air', pexels('K', 'aerial-view-of-plots-of-farm-land-3030296')),
  photo('agricultural-science/introduction-to-agriculture', 'Introduction to Agriculture', 'Hands planting a seedling', pexels('desanges bahindwa', 'close-up-of-hands-planting-a-seedling-36151356')),
  photo('business-management/nature-and-scope-of-business-management', 'Nature and Scope of Business Management', 'A shopkeeper in his store in Abuja', pexels('Muhammad-Taha Ibrahim', 'local-shopkeeper-posing-in-abuja-market-30019730'), 'object-[50%_40%]'),
  photo('financial-accounting/accounting-concepts-and-principles', 'Accounting Concepts and Principles', 'Checking receipts with a calculator', pexels('Kaboompics', 'person-holding-receipts-and-using-a-calculator-7680736')),
  photo('physics/physical-quantities-and-units', 'Physical Quantities and Units', 'Measuring with a caliper', pexels('Thirdman', 'a-person-holding-a-tool-7180748')),
  photo('physics/equations-of-motion', 'Equations of Motion', "A Newton's cradle", pexels('Jose Manuel Gonzalez Lupiañez Photography', 'a-close-up-shot-of-a-newton-s-cradle-10424708')),
])

export function topicPhoto(subjectSlug: string, topicSlug: string): TopicPhoto | undefined {
  return TOPIC_PHOTOS[`${subjectSlug}/${topicSlug}`]
}
