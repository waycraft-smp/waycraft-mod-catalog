import { useState } from 'react';
import mods from './data/mods.json';
import SideNavigation from './layout/SideNavigation.jsx';
import TopNavigation from './layout/TopNavigation.jsx';
import PageRunningmod from './pages/runningmod/PageRunningmod.jsx';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <TopNavigation />
      <div className="mx-auto flex w-full max-w-7xl flex-col md:flex-row">
        <SideNavigation
          mods={mods}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <main className="min-w-0 flex-1 bg-neutral-900/50 px-5 pb-12 pt-7 text-slate-100 backdrop-blur-2xl sm:px-8 sm:pt-6 lg:px-10">
          <PageRunningmod mods={mods} selectedCategory={selectedCategory} />
        </main>
      </div>
    </div>
  );
}
