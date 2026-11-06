// Credits for the homepage's audience and feature photos (public/img/home).
const pexels = (creator: string, page: string) => ({
  creator,
  source: 'Pexels',
  sourceUrl: `https://www.pexels.com/photo/${page}/`,
  license: 'Pexels License',
  licenseUrl: 'https://www.pexels.com/license/',
})

export const HOME_PHOTO_CREDITS: { label: string; caption: string; credit: ReturnType<typeof pexels> & { creatorUrl?: string } }[] = [
  { label: 'Who it’s for', caption: 'Secondary school students working in class', credit: pexels('Tosin Olowoleni', 'african-students-focused-on-classroom-studies-34162714') },
  { label: 'Who it’s for', caption: 'A young man studying at a desk', credit: pexels('Monstera Production', 'wistful-black-man-writing-in-notepad-during-lesson-6237991') },
  { label: 'Who it’s for', caption: 'A teacher leading a lesson', credit: pexels('Katerina Holmes', 'focused-black-female-teacher-explaining-class-plan-to-pupils-5905444') },
  { label: 'Built for Sierra Leone', caption: 'A student studying on her phone', credit: pexels('Charlotte May', 'black-student-listening-to-music-using-smartphone-in-park-5965930') },
  { label: 'Built for Sierra Leone', caption: 'Paying with a phone at a shop', credit: pexels('Kampus Production', 'a-man-paying-his-bill-in-the-grocery-store-8475146') },
  { label: 'Built for Sierra Leone', caption: 'Studying by lamplight at night', credit: pexels('MT photography', 'young-man-studying-at-night-with-lamp-light-33940741') },
  { label: 'Built for Sierra Leone', caption: 'Writing notes from a textbook', credit: pexels('Monstera Production', 'crop-black-person-writing-in-workbook-while-studying-6238011') },
]
