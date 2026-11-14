import { useState } from 'react';

const LABELS = { 'game-mechanics': 'Game Mechanics', worldgen: 'World Generation' };
const labelFor = tag =>
  LABELS[tag] ??
  tag
    .split('-')
    .map(part => part[0].toUpperCase() + part.slice(1))
    .join(' ');

function Chevron({ expanded }) {
  return (
    <svg
      className={
        'shrink-0 text-slate-400 transition-transform duration-200 motion-reduce:transition-none ' +
        (expanded ? 'rotate-180' : '')
      }
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m3.5 6 4.5 4.5L12.5 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CategoryChip({ active, label, onClick }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={
        'cursor-pointer rounded-full border px-3 py-1.5 text-xs transition ' +
        (active
          ? 'border-white/40 bg-white/15 text-white'
          : 'border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/10 hover:text-white')
      }
    >
      {label}
    </button>
  );
}

function CategoryPanel({ categories, expanded, onToggle, selectedCategory, onSelectCategory }) {
  return (
    <section className="w-full rounded-xl bg-neutral-900/35 p-2" aria-labelledby="category-heading">
      <button
        type="button"
        id="category-heading"
        aria-expanded={expanded}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between rounded-md px-1 py-0.5 text-left text-sm font-semibold text-slate-200 hover:text-white"
      >
        <span>Categories</span>
        <Chevron expanded={expanded} />
      </button>
      <div
        className={
          'grid transition-[grid-template-rows] duration-200 ease-in-out motion-reduce:transition-none ' +
          (expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')
        }
      >
        <div className="overflow-hidden">
          <div className="flex flex-wrap gap-2 pt-2">
            {categories.map(category => (
              <CategoryChip
                key={category.id}
                {...category}
                active={selectedCategory === category.id}
                onClick={() => onSelectCategory(category.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function SideNavigation({ mods, selectedCategory, onSelectCategory }) {
  const [expanded, setExpanded] = useState(true);
  const tags = [...new Set(mods.flatMap(mod => mod.tags ?? []))].sort((a, b) => {
    const priority = tag => (tag === 'library' ? 1 : tag === 'waycraft' ? 2 : 0);
    return priority(a) - priority(b) || a.localeCompare(b);
  });
  const noTags = mods.some(mod => !mod.tags?.length);
  const categories = [
    { id: 'all', label: 'All' },
    ...(noTags ? [{ id: 'no-tags', label: 'No Tags' }] : []),
    ...tags.map(tag => ({ id: tag, label: labelFor(tag) })),
  ];
  const panelProps = {
    categories,
    expanded,
    onToggle: () => setExpanded(current => !current),
    selectedCategory,
    onSelectCategory,
  };

  return (
    <>
      <div className="px-5 pt-5 md:hidden">
        <CategoryPanel {...panelProps} />
      </div>
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto bg-neutral-950/35 px-4 py-7 backdrop-blur-xl md:block">
        <CategoryPanel {...panelProps} />
      </aside>
    </>
  );
}
