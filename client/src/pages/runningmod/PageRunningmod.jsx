import { useEffect, useState } from 'react';
import RunningModCard from './RunningModCard.jsx';

const MODS_URL =
  'https://raw.githubusercontent.com/waycraft-smp/waycraft-mod-catalog/main/automod/output/mods.json';

const LABELS = {
  'game-mechanics': 'Game Mechanics',
  worldgen: 'World Generation',
};

const labelFor = tag =>
  LABELS[tag] ??
  tag
    .split('-')
    .map(part => part[0].toUpperCase() + part.slice(1))
    .join(' ');

export default function PageRunningmod({ selectedCategory }) {
  const [mods, setMods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMods() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(MODS_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to load mods (${response.status})`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Invalid mod data format.');
        }

        setMods(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error loading mods:', err);
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchMods();

    return () => controller.abort();
  }, []);

  const visibleMods = mods.filter(mod =>
    selectedCategory === 'all'
      ? true
      : selectedCategory === 'no-tags'
        ? !mod.tags?.length
        : mod.tags?.includes(selectedCategory)
  );

  const activeLabel =
    selectedCategory === 'all'
      ? 'All Mods'
      : selectedCategory === 'no-tags'
        ? 'No Tags'
        : labelFor(selectedCategory);

  return (
    <section aria-labelledby="running-mods-heading">
      <header className="mb-7 border-b border-white/10 pb-6">
        <p className="text-sm text-slate-400">Waycraft SMP {mods.length} mods</p>

        <h1
          id="running-mods-heading"
          className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl"
        >
          Running Mods
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Browse the mods included in the current server setup.
        </p>
      </header>

      {loading ? (
        <div className="py-10 text-center text-sm text-slate-400">Loading mods...</div>
      ) : error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-10 text-center text-sm text-red-400">
          Unable to load the mod list. Please try again later.
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-semibold text-white">{activeLabel}</h2>

            <p className="text-sm text-slate-400">
              Showing{' '}
              <span className="font-medium tabular-nums text-slate-200">{visibleMods.length}</span>{' '}
              of {mods.length}
            </p>
          </div>

          {visibleMods.length ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {visibleMods.map(mod => (
                <RunningModCard key={mod.id ?? mod.name} mod={mod} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-neutral-950/35 px-5 py-10 text-center text-sm text-slate-400">
              No mods in this category.
            </div>
          )}
        </>
      )}
    </section>
  );
}
