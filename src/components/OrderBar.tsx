import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { AnimatePresence, motion } from 'motion/react';
import { Receipt } from 'lucide-react';
import { $count, $open, $total, restore } from '../lib/docket';
import { money } from '../lib/menu';

/**
 * A quiet bar that appears once there is something on the ticket. Adding a dish
 * never interrupts browsing — this is how you get to the ticket when ready.
 */
export default function OrderBar() {
  const count = useStore($count);
  const total = useStore($total);
  const open = useStore($open);

  useEffect(restore, []);

  // Reserve space at the foot of the page so the bar never covers content.
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--orderbar',
      count > 0 && !open ? '5rem' : '0px',
    );
  }, [count, open]);

  return (
    <AnimatePresence>
      {count > 0 && !open && (
        <motion.div
          initial={{ y: '130%' }}
          animate={{ y: 0 }}
          exit={{ y: '130%' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-[150] border-t border-hair bg-ink-raised/95 backdrop-blur-lg"
        >
          <div className="wrap flex items-center justify-between gap-4 py-3">
            <p className="flex min-w-0 items-center gap-3">
              <Receipt className="h-5 w-5 flex-none text-turmeric" aria-hidden="true" />
              <span className="min-w-0 font-mono text-[0.7rem] tracking-[0.13em] text-bone uppercase">
                {count} {count === 1 ? 'item' : 'items'}
                <span className="mx-2 text-steel-dim" aria-hidden="true">
                  ·
                </span>
                <span className="tabular-nums">{money(total)}</span>
              </span>
            </p>

            <button type="button" className="btn flex-none py-3" onClick={() => $open.set(true)}>
              View ticket
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
