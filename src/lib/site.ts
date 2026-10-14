/**
 * Single source of truth for everything the client will want to change.
 * Edit this file to rebrand the whole site — nothing else hard-codes these values.
 */
export const SITE = {
  /** Live domain. Used for canonical URLs, sitemap and social cards. */
  url: 'https://tiffinandtandoor.in',

  name: 'Tiffin & Tandoor',
  legalName: 'Tiffin & Tandoor Foods',
  tagline: 'All kitchen, no dining room.',
  description:
    'A North Indian cloud kitchen in Gurgaon. Cooked to order, sealed hot and sent across DLF, Golf Course Road, Sohna Road and Cyber City. Order on WhatsApp or by phone — no app, no account.',

  /** Dial string. Keep the country code. */
  phone: '+91 62069 86683',
  /** Same number, digits only, country code first — this is what WhatsApp needs. */
  whatsapp: '916206986683',
  email: 'orders@tiffinandtandoor.in',

  address: {
    line1: 'Kitchen No. 01, Leisure Valley Road',
    line2: 'Sector 29',
    city: 'Gurgaon',
    state: 'Haryana',
    zip: '122002',
    country: 'IN',
  },
  /** Used by the map embed and LocalBusiness schema. */
  geo: { lat: 28.4663, lng: 77.0729 },

  hours: { open: '11:00', close: '23:00', days: 'Every day' },
  /** Shown on the site because food businesses in India must display it. */
  fssai: '12345678901234',

  deliveryMinutes: 30,
  deliveryRadiusKm: 8,
  minOrder: 199,

  /** Neighbourhoods we actually reach — used in copy and on the contact page. */
  areas: [
    'DLF Phase 1–5',
    'Sector 29',
    'Golf Course Road',
    'Sohna Road',
    'Cyber City',
    'Sushant Lok',
    'South City',
    'MG Road',
  ],

  social: {
    instagram: 'https://instagram.com/',
    zomato: 'https://zomato.com/',
    swiggy: 'https://swiggy.com/',
  },

  /** Studio credit in the footer. */
  designer: { name: 'BtechWaleTech', url: 'https://btechwaletech.com' },
} as const;

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'About' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
] as const;

export const telHref = `tel:${SITE.phone.replace(/[^+\d]/g, '')}`;

/** Opens WhatsApp with a prefilled message, on both mobile and desktop. */
export function waHref(message: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const fullAddress = `${SITE.address.line1}, ${SITE.address.line2}, ${SITE.address.city} ${SITE.address.zip}`;
