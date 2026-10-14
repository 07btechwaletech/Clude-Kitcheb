/**
 * The docket — the order ticket shared by every island on the page.
 * Nothing is sent anywhere: the ticket is built in the browser and handed to
 * WhatsApp as text. No account, no payment, no server.
 */
import { atom, computed } from 'nanostores';
import { SITE, waHref, fullAddress } from './site';
import { money } from './menu';

export interface Line {
  slug: string;
  name: string;
  price: number;
  veg: boolean;
  qty: number;
}

const KEY = 'tt-docket-v1';

export const $lines = atom<Line[]>([]);
export const $open = atom(false);
export const $note = atom('');

export const $count = computed($lines, (ls) => ls.reduce((n, l) => n + l.qty, 0));
export const $total = computed($lines, (ls) => ls.reduce((n, l) => n + l.qty * l.price, 0));

let restored = false;

/** Read the saved ticket. Safe to call from every island; it runs once. */
export function restore(): void {
  if (typeof window === 'undefined' || restored) return;
  restored = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (Array.isArray(saved)) $lines.set(saved.filter(isLine));
  } catch {
    /* private mode, blocked storage, or stale shape — start empty */
  }
}

function isLine(v: unknown): v is Line {
  const l = v as Line;
  return !!l && typeof l.slug === 'string' && typeof l.price === 'number' && l.qty > 0;
}

function save(lines: Line[]): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    /* storage unavailable — the ticket still works for this visit */
  }
}

export function add(item: Omit<Line, 'qty'>, qty = 1): void {
  const lines = $lines.get();
  const found = lines.find((l) => l.slug === item.slug);
  const next = found
    ? lines.map((l) => (l.slug === item.slug ? { ...l, qty: l.qty + qty } : l))
    : [...lines, { ...item, qty }];
  $lines.set(next);
  save(next);
}

export function setQty(slug: string, qty: number): void {
  const next = $lines.get().flatMap((l) => (l.slug !== slug ? [l] : qty > 0 ? [{ ...l, qty }] : []));
  $lines.set(next);
  save(next);
}

export function clear(): void {
  $lines.set([]);
  save([]);
}

/** Ticket number — readable, stable for the day, no server needed. */
export function ticketNo(d = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `TT-${pad(d.getDate())}${pad(d.getMonth() + 1)}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

/**
 * Formats the ticket as plain text, laid out the way the paper one reads,
 * and returns a WhatsApp deep link.
 */
export function orderLink(lines: Line[], note: string): string {
  const rows = lines.map((l) => `${l.qty} x ${l.name} — ${money(l.price * l.qty)}`).join('\n');
  const total = lines.reduce((n, l) => n + l.qty * l.price, 0);
  const msg = [
    `*${SITE.name} — order ticket ${ticketNo()}*`,
    '',
    rows,
    '',
    `*Total: ${money(total)}*`,
    note.trim() ? `\nNotes: ${note.trim()}` : '',
    '',
    'Please confirm the total and delivery time.',
    'My delivery address: ',
  ]
    .filter((v) => v !== '')
    .join('\n');
  return waHref(msg);
}

/** Used by the "just call us" path and the empty-ticket state. */
export const hello = waHref(
  `Hello ${SITE.name}, I would like to place an order. I am near ${fullAddress.split(',').slice(-2).join(',').trim()}.`,
);
