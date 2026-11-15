const TopNavigation = () => (
  <header className="sticky top-0 z-10 bg-neutral-950/72 text-white backdrop-blur-2xl">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
      <div className="waycraftStyleText flex h-full w-64 shrink-0 items-center justify-center text-center">
        WAYCRAFT SMP
      </div>
      <div className="ml-auto hidden flex-1 items-center justify-between px-6 text-sm text-slate-300 sm:px-10 md:flex">
        <span>Need help? Let us know in Discord #tech-support.</span>
      </div>
    </div>
  </header>
);

export default TopNavigation;
