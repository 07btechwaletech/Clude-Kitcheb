import { useMemo, useState } from 'react';
import { useStore } from '@nanostores/react';
import { motion } from 'motion/react';
import { Flame, Minus, Plus } from 'lucide-react';
import type { Course, Dish } from '../lib/menu';
import { money } from '../lib/menu';
import { $lines, add, setQty } from '../lib/docket';
import type { Pic } from '../lib/images';

export interface DishItem extends Dish {
  pic: Pic;
}

interface Props {
  items: DishItem[];
  /** Course filter chips. Only the full menu page needs them. */
  courses?: { id: Course; title: string; blurb: string }[];
  /** Card image sizes attribute, tuned per layout. */
  sizes?: string;
}

/**
 * The dish grid. Astro renders this to static HTML at build time — the dishes
 * and prices are in the markup for search engines — then hydrates it so the
 * filter chips and Add buttons work.
 */
export default function DishGrid({ items, courses, sizes = '(min-width: 1100px) 28vw, (min-width: 700px) 45vw, 92vw' }: Props) {
  const [active, setActive] = useState<Course | 'all'>('all');
  const lines = useStore($lines);
  const qtyOf = useMemo(
    () => Object.fromEntries(lines.map((l) => [l.slug, l.qty])) as Record<string, number>,
    [lines],
  );

  const groups = useMemo(() => {
    if (!courses) return [{ course: null, items }];
    return courses
      .filter((c) => active === 'all' || c.id === active)
      .map((c) => ({ course: c, items: items.filter((d) => d.course === c.id) }))
      .filter((g) => g.items.length > 0);
  }, [courses, items, active]);

  return (
    <div>
      {courses && (
        <div
          role="group"
          aria-label="Filter the menu by course"
          className="mb-10 flex flex-wrap gap-2 border-b border-hair pb-7"
        >
          {([{ id: 'all', title: 'Everything' }, ...courses] as { id: Course | 'all'; title: string }[]).map(
            (c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={active === c.id}
                onClick={() => setActive(c.id)}
                className={`rounded-full px-4 py-2.5 font-mono text-[0.68rem] tracking-[0.13em] uppercase transition ${
                  active === c.id
                    ? 'bg-turmeric text-ink'
                    : 'text-bone/75 shadow-[inset_0_0_0_1px_var(--color-hair)] hover:text-bone hover:shadow-[inset_0_0_0_1px_var(--color-steel-dim)]'
                }`}
              >
                {c.title}
              </button>
            ),
          )}
        </div>
      )}

      {groups.map(({ course, items: dishes }) => (
        <section key={course?.id ?? 'all'} className="mb-14 last:mb-0">
          {course && (
            <header className="mb-8">
              <div className="flex items-baseline gap-5">
                <h2 className="text-h3">{course.title}</h2>
                <span className="leader border-hair opacity-100" aria-hidden="true" />
                <span className="font-mono text-[0.68rem] tracking-[0.14em] whitespace-nowrap text-steel-dim uppercase">
                  {dishes.length} dishes
                </span>
              </div>
              <p className="mt-2 max-w-[56ch] text-sm text-bone/74">{course.blurb}</p>
            </header>
          )}

          <ul
            className={`grid list-none gap-5 pl-0 lg:gap-8 ${
              courses
                ? 'grid-cols-[repeat(auto-fill,minmax(min(100%,270px),1fr))]'
                : 'sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {dishes.map((d, i) => (
              <motion.li
                key={d.slug}
                layout
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: Math.min(i, 5) * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="group flex flex-col"
              >
                <div className="relative overflow-hidden rounded bg-ink-raised">
                  <img
                    src={d.pic.src}
                    width={d.pic.width}
                    height={d.pic.height}
                    sizes={sizes}
                    alt={`${d.name} — ${d.note}`}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full object-cover transition-[scale] duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.055]"
                  />
                  {courses && d.signature && (
                    <span className="absolute top-3 left-3 rounded-[2px] bg-ink/75 px-2 py-1 font-mono text-[0.6rem] tracking-[0.16em] text-turmeric uppercase backdrop-blur-[6px]">
                      Signature
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-2 pt-4">
                  <h3 className="flex items-center gap-2.5 text-[1.1rem] leading-tight">
                    <span
                      className={`mark ${d.veg ? 'text-veg' : 'text-nonveg'}`}
                      title={d.veg ? 'Vegetarian' : 'Non-vegetarian'}
                    />
                    {d.name}
                    {d.heat === 2 && (
                      <Flame className="h-3.5 w-3.5 text-chili" aria-label="Hot" />
                    )}
                  </h3>
                  <p className="text-[0.88rem] leading-relaxed text-bone/74">{d.note}</p>

                  <div className="mt-auto flex items-center justify-between gap-4 pt-4">
                    <span className="font-mono text-[1.02rem] text-bone tabular-nums">
                      {money(d.price)}
                    </span>

                    {(qtyOf[d.slug] ?? 0) === 0 ? (
                      <button
                        type="button"
                        onClick={() =>
                          add({ slug: d.slug, name: d.name, price: d.price, veg: d.veg })
                        }
                        className="inline-flex items-center gap-1.5 rounded px-3.5 py-2 font-mono text-[0.66rem] tracking-[0.14em] whitespace-nowrap text-bone uppercase shadow-[inset_0_0_0_1px_var(--color-hair)] transition hover:text-turmeric hover:shadow-[inset_0_0_0_1px_var(--color-turmeric)]"
                      >
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        Add
                        <span className="sr-only"> {d.name} to your ticket</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 rounded bg-turmeric p-1 text-ink">
                        <button
                          type="button"
                          onClick={() => setQty(d.slug, (qtyOf[d.slug] ?? 1) - 1)}
                          aria-label={`Remove one ${d.name} from your ticket`}
                          className="grid h-7 w-7 place-items-center rounded-[2px] transition hover:bg-ink/15"
                        >
                          <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <output
                          aria-live="polite"
                          className="min-w-[1.6ch] text-center font-mono text-[0.8rem] font-semibold tabular-nums"
                        >
                          {qtyOf[d.slug]}
                        </output>
                        <button
                          type="button"
                          onClick={() =>
                            add({ slug: d.slug, name: d.name, price: d.price, veg: d.veg })
                          }
                          aria-label={`Add another ${d.name} to your ticket`}
                          className="grid h-7 w-7 place-items-center rounded-[2px] transition hover:bg-ink/15"
                        >
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
