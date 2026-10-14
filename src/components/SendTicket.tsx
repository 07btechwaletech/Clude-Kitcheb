import { useStore } from '@nanostores/react';
import { ArrowLeft, Phone, Trash2 } from 'lucide-react';
import { $lines, $note, $open, clear, orderLink } from '../lib/docket';
import { SITE, telHref } from '../lib/site';
import WhatsAppIcon from './WhatsAppIcon';

/**
 * Everything below the paper: a note for the kitchen, then the two ways to
 * actually place the order. No form posts anywhere.
 */
export default function SendTicket() {
  const lines = useStore($lines);
  const note = useStore($note);
  const empty = lines.length === 0;

  return (
    <div className="grid gap-3">
      {!empty && (
        <label className="mt-5 block">
          <span className="font-mono text-[0.62rem] tracking-[0.18em] text-steel-dim uppercase">
            Anything the kitchen should know?
          </span>
          <textarea
            value={note}
            onChange={(e) => $note.set(e.target.value)}
            rows={3}
            placeholder="Less chilli, no onion, ring the bell twice…"
            className="mt-2 min-h-[5.5rem] w-full resize-y rounded border border-hair bg-ink px-4 py-3 text-[0.95rem] text-bone placeholder:text-steel-dim focus-visible:border-turmeric"
          />
        </label>
      )}

      <a
        className="btn btn-wa"
        href={empty ? undefined : orderLink(lines, note)}
        aria-disabled={empty}
        onClick={(e) => empty && e.preventDefault()}
        target="_blank"
        rel="noopener noreferrer"
        style={empty ? { opacity: 0.45, pointerEvents: 'none' } : undefined}
      >
        <WhatsAppIcon className="h-[1.1em] w-[1.1em]" />
        Send ticket on WhatsApp
      </a>

      <a className="btn btn-ghost" href={telHref}>
        <Phone className="h-[1.05em] w-[1.05em]" aria-hidden="true" />
        Call {SITE.phone}
      </a>

      {!empty && (
        <button
          type="button"
          onClick={() => $open.set(false)}
          className="inline-flex items-center justify-center gap-2 py-2 font-mono text-[0.66rem] tracking-[0.16em] text-bone/80 uppercase hover:text-turmeric"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Add more dishes
        </button>
      )}

      {!empty && (
        <button
          type="button"
          onClick={clear}
          className="mt-1 inline-flex items-center justify-center gap-2 py-2 font-mono text-[0.64rem] tracking-[0.16em] text-steel-dim uppercase hover:text-chili"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          Clear ticket
        </button>
      )}
    </div>
  );
}
