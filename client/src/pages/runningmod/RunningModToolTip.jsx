const RunningModToolTip = ({ environment, mod }) => {
  return (
    <div
      className="
      pointer-events-none absolute bottom-full left-1/2 z-50
      mb-3 w-64 -translate-x-1/2 translate-y-1
      rounded-lg border border-white/10
      bg-[#10121c]/95 p-3
      opacity-0 invisible
      shadow-xl shadow-black/40
      backdrop-blur-xl
      transition-all duration-200
      group-hover:visible group-hover:translate-y-0
      group-hover:opacity-100
    "
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="min-w-0 truncate text-sm font-semibold text-white">{mod.name}</h3>

        <span
          className="
          shrink-0 rounded-md bg-white/10
          px-2 py-1 text-[10px] font-medium
          text-white/70
        "
        >
          {environment}
        </span>
      </div>

      {mod.description && (
        <p
          className="
          mt-2 text-[11px] leading-relaxed
          text-white/65
        "
        >
          {mod.description}
        </p>
      )}

      {mod.tags?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {mod.tags.map(tag => (
            <span
              key={tag}
              className="
                rounded-md border border-white/10
                bg-white/5 px-2 py-1
                text-[10px] text-white/70
              "
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div
        className="
        absolute left-1/2 top-full
        size-2 -translate-x-1/2 -translate-y-1/2
        rotate-45 border-b border-r
        border-white/10 bg-[#10121c]
      "
      />
    </div>
  );
};

export default RunningModToolTip;
