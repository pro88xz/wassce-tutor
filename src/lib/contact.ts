// Business contact details: one source for the footer, the contact page, the
// tutor and payment WhatsApp links, the business schema (seo.ts) and
// /llms.txt. Plain constants, so seo.ts and the build scripts can import it.

export const CONTACT = {
  name: 'WASSCE Tutor',
  email: 'secretsafe.cc@gmail.com',
  /** The business WhatsApp number, digits only for wa.me links. */
  whatsapp: '23277884195',
  /** The same number, as people read and dial it. */
  phoneDisplay: '+232 77 884195',
  phoneE164: '+23277884195',
  /** Community WhatsApp group for students. */
  whatsappGroup: 'https://chat.whatsapp.com/JdRTn55TaGZ1juBDdnwAx5',
  locality: 'Freetown',
  region: 'Western Area',
  country: 'Sierra Leone',
  countryCode: 'SL',
} as const

/** One string, so the prerendered HTML has the address as plain text (no React text separators). */
export const ADDRESS_LINE = `${CONTACT.locality}, ${CONTACT.region}, ${CONTACT.country}`

export const whatsappChatLink = (text?: string) =>
  `https://wa.me/${CONTACT.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`
