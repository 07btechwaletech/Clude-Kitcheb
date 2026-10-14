import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { Pic } from '../lib/images';

export interface Frame extends Pic {
  caption: string;
}

/** Gallery grid with a keyboard-navigable lightbox. */
export default function Gallery({ frames }: { frames: Frame[] }) {
  const [at, setAt] = useState<number | null>(null);
  const open = at !== null;

  const step = useCallback(
    (d: number) => setAt((i) => (i === null ? i : (i + d + frames.length) % frames.length)),
    [frames.length],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAt(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
    };
  }, [open, step]);

  const shot = at === null ? null : frames[at]!;

  return (
    <>
      <ul className="grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,210px),1fr))] gap-2 pl-0 lg:gap-4">
        {frames.map((f, i) => (
          <li key={f.src}>
            <button
              type="button"
              onClick={() => setAt(i)}
              className="group relative block w-full overflow-hidden rounded bg-ink-raised"
            >
              <img
                src={f.src}
                width={f.width}
                height={f.height}
                sizes="(min-width: 1100px) 24vw, (min-width: 700px) 32vw, 48vw"
                alt={f.caption}
                loading={i < 4 ? 'eager' : 'lazy'}
                decoding="async"
                className="aspect-square w-full object-cover transition-[scale] duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.07]"
              />
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/80 to-transparent px-3 pt-10 pb-3 text-left font-mono text-[0.63rem] tracking-[0.13em] uppercase opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                {f.caption}
              </figcaption>
              <span className="sr-only">Open larger photo</span>
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {open && shot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label={shot.caption}
            onClick={() => setAt(null)}
            className="fixed inset-0 z-[250] grid place-items-center bg-ink-sunk/95 p-4 backdrop-blur-sm sm:p-10"
          >
            <motion.figure
              key={shot.src}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="m-0"
            >
              <img
                src={shot.src}
                width={shot.width}
                height={shot.height}
                alt={shot.caption}
                className="max-h-[80vh] w-auto max-w-full rounded"
              />
              <figcaption className="mt-4 text-center font-mono text-[0.68rem] tracking-[0.14em] text-steel uppercase">
                {shot.caption}
                <span className="ml-3 text-steel-dim">
                  {at + 1} / {frames.length}
                </span>
              </figcaption>
            </motion.figure>

            <button
              type="button"
              onClick={() => setAt(null)}
              aria-label="Close photo"
              className="absolute top-4 right-4 grid h-12 w-12 place-items-center text-bone hover:text-turmeric"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              aria-label="Previous photo"
              className="absolute top-1/2 left-2 grid h-13 w-13 -translate-y-1/2 place-items-center rounded-full bg-ink/55 p-3 text-bone hover:text-turmeric sm:left-8"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              aria-label="Next photo"
              className="absolute top-1/2 right-2 grid h-13 w-13 -translate-y-1/2 place-items-center rounded-full bg-ink/55 p-3 text-bone hover:text-turmeric sm:right-8"
            >
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
