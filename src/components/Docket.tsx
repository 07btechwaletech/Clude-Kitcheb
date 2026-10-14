import { useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { $open, $count, restore } from '../lib/docket';
import Ticket from './Ticket';
import SendTicket from './SendTicket';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The slide-in order docket. Mounted once per page; every "Add" button on the
 * site writes into the same store, so the ticket follows you across pages.
 */
export default function Docket() {
  const open = useStore($open);
  const count = useStore($count);
  const panel = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  // Load the saved ticket after hydration, never during SSR.
  useEffect(restore, []);

  useEffect(() => {
    if (!open) return;

    lastFocused.current = document.activeElement as HTMLElement;
    panel.current?.focus();
    document.documentElement.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') $open.set(false);
      if (e.key !== 'Tab' || !panel.current) return;
      // Keep tabbing inside the drawer while it is open.
      const focusable = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
      lastFocused.current?.focus();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            onClick={() => $open.set(false)}
            className="fixed inset-0 z-[190] bg-ink-sunk/75 backdrop-blur-[2px]"
            aria-hidden="true"
          />

          <motion.div
            key="panel"
            ref={panel}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Your order ticket"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: EASE }}
            className="fixed inset-y-0 right-0 z-[200] grid w-full max-w-[420px] grid-rows-[auto_1fr] border-l border-hair bg-ink-raised outline-none"
          >
            <div className="flex items-center justify-between gap-4 border-b border-hair px-5 py-4">
              <h2 className="text-[1.15rem]">
                Your ticket
                <span className="ml-2 font-mono text-[0.68rem] tracking-[0.14em] text-steel-dim uppercase">
                  {count} {count === 1 ? 'item' : 'items'}
                </span>
              </h2>
              <button
                type="button"
                onClick={() => $open.set(false)}
                aria-label="Close ticket"
                className="grid h-10 w-10 place-items-center rounded text-steel hover:text-turmeric"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-5">
              <Ticket />
              <SendTicket />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
