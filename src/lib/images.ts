/**
 * Every photo in src/assets/img is emitted by Astro with a content hash and
 * immutable cache headers. This resolves a filename to that final URL plus its
 * intrinsic size, so React islands can render <img> without layout shift.
 */
const files = import.meta.glob<{ default: ImageMetadata }>('../assets/img/*.{webp,jpg}', {
  eager: true,
});

export interface Pic {
  src: string;
  width: number;
  height: number;
}

export function pic(name: string): Pic {
  const key = Object.keys(files).find((k) => k.endsWith(`/${name}`));
  if (!key) throw new Error(`Missing image: src/assets/img/${name}`);
  const { src, width, height } = files[key]!.default;
  return { src, width, height };
}

/** Photo for a dish card, by menu slug. */
export const dishPic = (slug: string) => pic(`dish-${slug}.webp`);

/** The twelve gallery frames, in hanging order. */
export const GALLERY: { file: string; caption: string }[] = [
  { file: 'gallery-01.webp', caption: 'Dum biryani, lid cracked at the pass' },
  { file: 'gallery-02.webp', caption: 'Chicken tikka coming off the skewer' },
  { file: 'gallery-03.webp', caption: 'Butter chicken, last ladle before sealing' },
  { file: 'gallery-04.webp', caption: 'Pav bhaji on the tawa' },
  { file: 'gallery-05.webp', caption: 'Paneer tikka, straight off the sizzler' },
  { file: 'gallery-06.webp', caption: 'Dal makhani after eight hours' },
  { file: 'gallery-07.webp', caption: 'Samosas folded by hand, fried to order' },
  { file: 'gallery-08.webp', caption: 'The korma thali, boxed for travel' },
  { file: 'gallery-09.webp', caption: 'Khow suey, garlic and lime on top' },
  { file: 'gallery-10.webp', caption: 'Naan off the tandoor wall' },
  { file: 'gallery-11.webp', caption: 'Kadai masala, pounded fresh each morning' },
  { file: 'gallery-12.webp', caption: 'Chocolate mitti parfait, chilled' },
];
