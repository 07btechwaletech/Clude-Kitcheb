/**
 * The menu. This is the file to edit when prices or dishes change.
 * `slug` must match an image at src/assets/img/dish-<slug>.webp
 */
export type Course = 'tandoor' | 'mains' | 'wok' | 'sides';

export interface Dish {
  slug: string;
  name: string;
  /** Price in rupees, whole numbers. */
  price: number;
  veg: boolean;
  course: Course;
  /** One honest line about the dish — what is in it, how it is cooked. */
  note: string;
  /** 0 = mild, 1 = medium, 2 = hot. Shown as a chilli count. */
  heat?: 0 | 1 | 2;
  /** Highlighted on the home page. */
  signature?: boolean;
}

export const COURSES: { id: Course; title: string; blurb: string }[] = [
  {
    id: 'tandoor',
    title: 'Tandoor & Starters',
    blurb: 'Marinated overnight, cooked on skewers in a clay oven at 400°C.',
  },
  {
    id: 'mains',
    title: 'Biryani & Mains',
    blurb: 'Slow gravies and sealed-pot rice. The dishes that take the longest and travel the best.',
  },
  {
    id: 'wok',
    title: 'Street & Wok',
    blurb: 'The loud end of the kitchen — flat tawa, high flame, finished to order.',
  },
  {
    id: 'sides',
    title: 'Breads & Sweet',
    blurb: 'Pulled and baked once your mains are nearly up, so they land warm.',
  },
];

export const DISHES: Dish[] = [
  // --- Tandoor & Starters ---
  {
    slug: 'chicken-tikka',
    name: 'Angaar Chicken Tikka',
    price: 329,
    veg: false,
    course: 'tandoor',
    heat: 1,
    signature: true,
    note: 'Thigh meat in a hung-curd and kashmiri chilli marinade, skewered and charred over coal.',
  },
  {
    slug: 'paneer-tikka',
    name: 'Paneer Tikka Sizzler',
    price: 289,
    veg: true,
    course: 'tandoor',
    heat: 1,
    signature: true,
    note: 'Thick-cut paneer with peppers and pineapple, sent out still spitting on a cast-iron plate.',
  },
  {
    slug: 'samosa',
    name: 'Punjabi Samosa',
    price: 90,
    veg: true,
    course: 'tandoor',
    heat: 0,
    note: 'Two pieces. Coarse potato and pea filling, hand-folded, fried to order. Mint and tamarind on the side.',
  },

  // --- Biryani & Mains ---
  {
    slug: 'biryani',
    name: 'Hyderabadi Dum Biryani',
    price: 349,
    veg: false,
    course: 'mains',
    heat: 2,
    signature: true,
    note: 'Long-grain rice and marinated chicken sealed in the pot and finished on dum. Comes with raita and salan.',
  },
  {
    slug: 'butter-chicken',
    name: 'Butter Chicken',
    price: 379,
    veg: false,
    course: 'mains',
    heat: 0,
    signature: true,
    note: 'Tandoori chicken folded into a tomato gravy finished with cream and a little honey. Mild on purpose.',
  },
  {
    slug: 'paneer-masala',
    name: 'Paneer Butter Masala',
    price: 319,
    veg: true,
    course: 'mains',
    heat: 0,
    signature: true,
    note: 'Our butter gravy, made the same way, with soft paneer and a spoon of white butter on top.',
  },
  {
    slug: 'kadai-mushroom',
    name: 'Kadai Mushroom',
    price: 299,
    veg: true,
    course: 'mains',
    heat: 1,
    note: 'Button mushrooms and peppers tossed in a coarse, freshly pounded kadai masala. No cream.',
  },
  {
    slug: 'dal-makhani',
    name: 'Dal Makhani',
    price: 249,
    veg: true,
    course: 'mains',
    heat: 0,
    signature: true,
    note: 'Black urad simmered overnight on a low flame. It is the first thing we start and the last thing we rush.',
  },
  {
    slug: 'korma-thali',
    name: 'Shahi Korma Thali',
    price: 289,
    veg: true,
    course: 'mains',
    heat: 0,
    note: 'Cashew-and-melon-seed korma with jeera rice, two rotis, salad and a sweet. A full lunch in one box.',
  },

  // --- Street & Wok ---
  {
    slug: 'pav-bhaji',
    name: 'Tawa Pav Bhaji',
    price: 179,
    veg: true,
    course: 'wok',
    heat: 1,
    note: 'Mashed on the flat tawa to order, with four butter-griddled pav, raw onion and lime.',
  },
  {
    slug: 'hakka-noodles',
    name: 'Burnt Garlic Hakka Noodles',
    price: 209,
    veg: true,
    course: 'wok',
    heat: 1,
    note: 'Wok-tossed on a high flame with julienned vegetables and a lot of fried garlic.',
  },
  {
    slug: 'khow-suey',
    name: 'Coconut Khow Suey',
    price: 259,
    veg: true,
    course: 'wok',
    heat: 1,
    note: 'Burmese coconut curry over noodles, with crisp garlic, spring onion and lime to finish at the table.',
  },

  // --- Breads & Sweet ---
  {
    slug: 'naan',
    name: 'Garlic Butter Naan',
    price: 69,
    veg: true,
    course: 'sides',
    heat: 0,
    note: 'Slapped on the tandoor wall, brushed with garlic butter and coriander. Timed to your mains.',
  },
  {
    slug: 'parfait',
    name: 'Chocolate Mitti Parfait',
    price: 159,
    veg: true,
    course: 'sides',
    heat: 0,
    note: 'Layered chocolate cream and biscuit crumb, served in a chilled glass jar. Travels perfectly.',
  },
];

export const SIGNATURES = DISHES.filter((d) => d.signature);

export const money = (n: number) => `₹${n.toLocaleString('en-IN')}`;
