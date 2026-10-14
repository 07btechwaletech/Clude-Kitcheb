import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Dish } from '../lib/menu';
import { money } from '../lib/menu';
import { add } from '../lib/docket';
import Ticket from './Ticket';
import SendTicket from './SendTicket';

/**
 * The contact-page order builder: pick a dish, set a quantity, add it to the
 * ticket, send the ticket on WhatsApp. Same store as the header docket, so a
 * ticket started on the menu page is already here.
 */
export default function OrderBuilder({ dishes }: { dishes: Dish[] }) {
  const [slug, setSlug] = useState(dishes[0]?.slug ?? '');
  const [qty, setQty] = useState(1);

  const dish = dishes.find((d) => d.slug === slug);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-12">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!dish) return;
          add({ slug: dish.slug, name: dish.name, price: dish.price, veg: dish.veg }, qty);
          setQty(1);
        }}
        className="grid content-start gap-5"
      >
        <label className="grid gap-2">
          <span className="font-mono text-[0.62rem] tracking-[0.18em] text-turmeric uppercase">
            Dish
          </span>
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded border border-hair bg-ink px-4 py-3.5 text-[0.98rem] text-bone"
          >
            {dishes.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.veg ? '🟢' : '🔴'} {d.name} — {money(d.price)}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="font-mono text-[0.62rem] tracking-[0.18em] text-turmeric uppercase">
            Quantity
          </span>
          <input
            type="number"
            min={1}
            max={30}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Math.min(30, Number(e.target.value) || 1)))}
            className="w-28 rounded border border-hair bg-ink px-4 py-3.5 text-[0.98rem] text-bone tabular-nums"
          />
        </label>

        <button type="submit" className="btn justify-self-start">
          <Plus className="h-[1.05em] w-[1.05em]" aria-hidden="true" />
          Add to ticket
          {dish && <span className="sr-only"> — {dish.name}</span>}
        </button>

        <p className="max-w-[46ch] text-sm text-bone/72">
          Add as many dishes as you like, then send the whole ticket to the kitchen on WhatsApp. We
          reply with the total and a delivery time before anything is cooked.
        </p>
      </form>

      <div>
        <Ticket />
        <SendTicket />
      </div>
    </div>
  );
}
