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

const FEATURE_SECTIONS = [
  {
    icon: '🧭',
    title: 'Exploration & Gameplay',
    items: [
      'Waycraft Spells – Custom content & fixes',
      'Moog’s Structures & YUNG’s Mods – Villages, temples, mineshafts, dungeons & End overhaul',
      'Artifacts – Discoverable relics with unique abilities',
      'Friends & Foes + More Villagers – New vote mobs & villager jobs',
      'Better Archeology, Fishing Frontier & Field Guide – Deeper archaeology, fishing progression & spyglass journal',
      'Lootr & Universal Graves – Per-player loot & safe death graves',
    ],
  },
  {
    icon: '✈️',
    title: 'Travel & Gear',
    items: [
      'Waystones – Fast travel across the world',
      'Immersive Aircraft – Craftable airships, biplanes & gyrodynes',
      'High-Speed Rail, Minecart Chains & Zipline – Faster trains & ziplines',
      'Backpacked & Comforts – Backpacks, sleeping bags & hammocks',
    ],
  },
  {
    icon: '🍲',
    title: 'Cooking & Brewing',
    items: [
      'Farmer’s Delight (+ Rustic, Storage & Display) – Expanded farming & cooking',
      'Kaleidoscope (Cookery, Tavern, Nether, End) & AlcoCraft+ – Gourmet food, wine & brewing',
    ],
  },
  {
    icon: '🏡',
    title: 'Building, Decor & Extras',
    items: [
      'Furniture & Decor – Refurbished Furniture, Adorn, Macaw’s, Cluttered, Beautify, Farmhouse, Voxelized Furniture, Psithurism & Better Fish Tanks',
      'Interactive & RP – Camerapture photos, CCTV, synced TVs & instruments',
      'Better Pets – Improved dogs, cats, horses, axolotls & Shared Pets',
    ],
  },
  {
    icon: '🎙️',
    title: 'Multiplayer & QoL',
    items: [
      'Voice, Audio & Emotes – Simple Voice Chat, Sound Physics, AudioPlayer & Emotecraft',
      'Claims & PvP – Open Parties and Claims & opt-in PvP',
      'Maps – BlueMap 3D & Xaero’s World Map/Minimap',
      'Utility – Iron Chests, Metal Barrels, JEI, Jade, XP Tome, Discord Integration & AutoModpack',
    ],
  },
];

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
      <header className="mb-7 border-b border-white/10 pb-7">
        <h1
          id="running-mods-heading"
          className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
        >
          Mods Included & Their Impact on Gameplay
        </h1>

        <ul className="mt-5 space-y-1.5 text-sm">
          {FEATURE_SECTIONS.map(section => (
            <li
              key={section.title}
              className="flex gap-2.5"
            >
              <span
                aria-hidden="true"
                className="flex h-6 w-6 shrink-0 items-center justify-center text-base leading-none"
              >
                {section.icon}
              </span>
              <p className="text-slate-400">
                <span className="mr-2 font-semibold text-slate-100">{section.title}</span>
                {section.items.join(' · ')}
              </p>
            </li>
          ))}
        </ul>
      </header>

      {loading ? (
        <>
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-semibold text-white">{activeLabel}</h2>
            <p className="text-sm text-slate-400">
              <span
                aria-hidden="true"
                className="inline-block h-4 w-20 animate-pulse rounded bg-white/10 align-middle"
              />
            </p>
          </div>

          <div
            role="status"
            aria-label="Loading mods"
            aria-busy="true"
            className="grid grid-cols-2 gap-6.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
          >
            {Array.from({ length: 12 }, (_, index) => (
              <div
                key={index}
                aria-hidden="true"
                className="relative aspect-square min-w-0 animate-pulse overflow-hidden rounded-xl bg-white/5"
              >
                <div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-black/30" />
                <div className="absolute inset-x-0 bottom-0 space-y-2 p-3">
                  <div className="h-3 w-3/4 rounded bg-white/15" />
                  <div className="h-3 w-1/2 rounded bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </>
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
            <div className="grid grid-cols-2 gap-6.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
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
