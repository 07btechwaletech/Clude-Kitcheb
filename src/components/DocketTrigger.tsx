import { useStore } from '@nanostores/react';
import { Receipt } from 'lucide-react';
import { $open, $count } from '../lib/docket';

/** Header button. Shows how many items are on the ticket right now. */
export default function DocketTrigger() {
  const count = useStore($count);

  return (
    <button
      type="button"
      onClick={() => $open.set(true)}
      aria-haspopup="dialog"
      className="inline-flex items-center gap-2 rounded px-3 py-2.5 font-mono text-[0.68rem] tracking-[0.13em] text-bone uppercase shadow-[inset_0_0_0_1px_var(--color-hair)] transition hover:text-turmeric hover:shadow-[inset_0_0_0_1px_var(--color-turmeric)]"
    >
      <Receipt className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline">Ticket</span>
      <span
        aria-live="polite"
        className={`min-w-[1.45em] rounded-full px-[0.35em] text-center text-[0.68rem] font-semibold tracking-normal ${
          count > 0 ? 'bg-turmeric text-ink' : 'bg-hair text-steel'
        }`}
      >
        {count}
        <span className="sr-only"> items on your ticket</span>
      </span>
    </button>
  );
}
