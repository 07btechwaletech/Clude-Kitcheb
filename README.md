# Tiffin & Tandoor — cloud kitchen website

A fully static marketing and ordering site for a delivery-only kitchen in Gurgaon.
Orders are placed on WhatsApp or by phone — there is no login, no payment gateway
and no server to run.

Built by [BtechWaleTech](https://btechwaletech.com).

---

## Stack

| Piece | Why it is here |
|---|---|
| **Astro 5** + TypeScript | Ships HTML, not a framework. Every page is prerendered, so the content is in the markup for Google. |
| **Tailwind CSS 4** | Design tokens live in `@theme` inside `src/styles/global.css`. |
| **React 19** | Only for the four interactive islands (ticket, menu grid, gallery, order builder). The rest of the site ships zero JavaScript. |
| **GSAP + ScrollTrigger** | Scroll reveals and the parallax drift on story images. |
| **Lenis** | Smooth scrolling, disabled automatically under `prefers-reduced-motion`. |
| **Motion** | Micro-interactions inside the React islands. |
| **nanostores** | Shares the order ticket between islands and across page loads. |
| **Lucide** | Icons. |

---

## Running it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site → ./dist
npm run preview    # serve ./dist exactly as it will be hosted
```

`npm run build` is the only command a host needs.

---

## Deploying

The build output is plain files. Nothing server-side is required.

### Cloudflare Pages (recommended)

1. Push this folder to a Git repository.
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → connect the repo.
3. Build command: `npm run build` · Output directory: `dist`
4. Add the custom domain under **Custom domains**. HTTPS is automatic.

`public/_headers` already sets security headers and a one-year immutable cache on
hashed assets; Cloudflare picks it up with no extra configuration.

### Vercel

Framework preset **Astro**, build `npm run build`, output `dist`. Nothing else to set.

### Any other host

Upload `dist/` to Netlify, S3 + CloudFront, Hostinger, cPanel — anywhere that serves files.

---

## Editing the site

Almost everything the business changes lives in two files.

### `src/lib/site.ts` — the business

Phone number, WhatsApp number, address, hours, delivery radius, FSSAI licence,
minimum order, delivery areas, social links, studio credit. Change a value here
and it updates every page, the footer, the schema markup and the WhatsApp links
at once.

> The WhatsApp number must be digits only with the country code first:
> `916206986683`. The `phone` field is the one shown on screen and may be formatted.

### `src/lib/menu.ts` — the menu

One entry per dish:

```ts
{
  slug: 'butter-chicken',      // must match src/assets/img/dish-butter-chicken.webp
  name: 'Butter Chicken',
  price: 379,                   // rupees, whole numbers
  veg: false,                   // drives the green/red marker
  course: 'mains',              // tandoor | mains | wok | sides
  heat: 0,                      // 0 mild, 1 medium, 2 hot
  signature: true,              // shows on the home page
  note: 'One honest line about the dish.',
}
```

To add a dish: drop a 4:3 photo at `src/assets/img/dish-<slug>.webp`, add the
entry, rebuild. Prices, the menu schema for Google and the WhatsApp ticket all
update themselves.

### Photographs

Put originals in `src/assets/img/`. Astro compresses, resizes and fingerprints
them at build time.

| File | Used for | Shape |
|---|---|---|
| `hero-1…4.webp` | Home hero slideshow | 4:5 portrait |
| `dish-<slug>.webp` | Menu cards | 4:3 |
| `gallery-01…12.webp` | Gallery page | square |
| `story-ladle.webp`, `story-pass.webp` | About / home story blocks | 4:3 |
| `og-cover.jpg` | Link previews | 1200×630 |

Gallery captions are in `src/lib/images.ts`.

---

## How ordering works

1. **Add** on any dish writes it to a ticket held in the browser (`localStorage`).
2. The ticket survives page changes, so a customer can browse and keep adding.
3. A bar appears at the foot of the page with the running total.
4. **Send ticket on WhatsApp** opens WhatsApp with the whole order typed out —
   dishes, quantities, total, and any note for the kitchen.
5. The kitchen replies with a confirmed total and delivery time. Payment is cash
   or UPI to the rider.

Nothing is transmitted anywhere until the customer presses send.

---

## SEO

Already in place: per-page titles and descriptions, canonical URLs, Open Graph
and Twitter cards, `sitemap-index.xml`, `robots.txt`, and JSON-LD for
`Restaurant`, `Menu`, `FAQPage`, `ImageGallery` and `BreadcrumbList`.

**Before going live**, set the real domain in `src/lib/site.ts` → `url`, and
update the same domain in `public/robots.txt`. Everything else follows.

---

## Content to replace before launch

These are placeholders written to show the design. Swap them for real material:

- **Testimonials** on the home page (`voices` in `src/pages/index.astro`) — three
  invented quotes. Replace with real ones or delete the section.
- **FSSAI licence number** in `src/lib/site.ts`.
- **Address, map pin and geo coordinates** — the map reads `SITE.geo`.
- **Photographs** — currently licensed stock. Shoot the real dishes; the site
  claims "no stock photos" on the home page, so this one matters.
- **Email address and social links**.

---

## Accessibility and performance

Keyboard-navigable throughout, visible focus rings, a skip link, labelled
controls, and `prefers-reduced-motion` honoured (smooth scroll, parallax and the
hero slideshow all stop). Images carry intrinsic dimensions so nothing shifts
while loading. Fonts load with `display=swap`.

---

## Project layout

```
src/
  assets/img/        photographs (optimised at build time)
  components/        .astro = static, .tsx = interactive island
  layouts/Base.astro <head>, SEO, schema, header/footer, scroll setup
  lib/               site.ts · menu.ts · docket.ts · images.ts
  pages/             one file per route
  styles/global.css  design tokens and component classes
public/              robots.txt, favicon, _headers — copied verbatim
Doc/                 client quotation
```
