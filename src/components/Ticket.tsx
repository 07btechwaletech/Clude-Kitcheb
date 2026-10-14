import { useStore } from '@nanostores/react';
import { AnimatePresence, motion } from 'motion/react';
import { Minus, Plus, Receipt } from 'lucide-react';
import { $lines, $total, setQty, ticketNo } from '../lib/docket';
import { money } from '../lib/menu';
import { SITE } from '../lib/site';

/**
 * The paper order ticket. Everything the kitchen needs, laid out the way a
 * real docket reads — quantity, dish, leader dots, price.
 */
export default function Ticket() {
  const lines = useStore($lines);
  const total = useStore($total);

  if (lines.length === 0) {
    return (
      <div className="border border-dashed border-hair px-6 py-12 text-center">
        <Receipt className="mx-auto mb-4 h-7 w-7 text-steel-dim" aria-hidden="true" />
        <p className="font-mono text-xs tracking-[0.16em] text-steel uppercase">Ticket is empty</p>
        <p className="mx-auto mt-3 max-w-[32ch] text-sm text-steel">
          Add a dish from the menu and it lands here. Nothing is ordered until you send the ticket
          yourself.
        </p>
      </div>
    );
  }

  return (
    <div className="ticket">
      <div className="ticket-rule pb-3 text-center">
        <b className="block text-[0.92rem] tracking-[0.22em] uppercase">{SITE.name}</b>
        <span className="text-[0.64rem] tracking-[0.16em] uppercase opacity-60">
          Ticket {ticketNo()} · Kitchen 01
        </span>
      </div>

      <ul className="m-0 grid list-none gap-4 py-4 pl-0">
        <AnimatePresence initial={false}>
          {lines.map((l) => (
            <motion.li
              key={l.slug}
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: -16 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-1"
            >
              <div className="flex items-baseline gap-2">
                <span className="shrink-0 tabular-nums">{l.qty}×</span>
                <span className="min-w-0">{l.name}</span>
                <span className="leader" aria-hidden="true" />
                <span className="shrink-0 tabular-nums">{money(l.price * l.qty)}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-[1px]">
                  <button
                    type="button"
                    onClick={() => setQty(l.slug, l.qty - 1)}
                    aria-label={`Remove one ${l.name}`}
                    className="grid h-7 w-7 place-items-center rounded-[2px] border border-paper-ink/30 leading-none hover:bg-paper-ink hover:text-paper"
                  >
                    <Minus className="h-3 w-3" aria-hidden="true" />
                  </button>
                  <output className="min-w-[2ch] text-center tabular-nums" aria-live="polite">
                    {l.qty}
                  </output>
                  <button
                    type="button"
                    onClick={() => setQty(l.slug, l.qty + 1)}
                    aria-label={`Add one more ${l.name}`}
                    className="grid h-7 w-7 place-items-center rounded-[2px] border border-paper-ink/30 leading-none hover:bg-paper-ink hover:text-paper"
                  >
                    <Plus className="h-3 w-3" aria-hidden="true" />
                  </button>
                </div>
                <span
                  className={`mark ${l.veg ? 'text-veg' : 'text-nonveg'}`}
                  title={l.veg ? 'Vegetarian' : 'Non-vegetarian'}
                />
                <span className="text-[0.6rem] tracking-[0.1em] uppercase opacity-55">
                  {money(l.price)} each
                </span>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <div className="border-t border-dashed border-paper-ink/35 pt-3">
        <div className="flex items-baseline gap-2 text-base font-semibold">
          <span className="tracking-[0.12em] uppercase">Total</span>
          <span className="leader" aria-hidden="true" />
          <span className="tabular-nums">{money(total)}</span>
        </div>
      </div>

      <p className="mt-3 text-center text-[0.62rem] tracking-[0.1em] uppercase opacity-60">
        Pay the rider · Cash or UPI on delivery
      </p>
    </div>
  );
}
