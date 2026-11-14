import RunningModToolTip from './RunningModToolTip';

export default function RunningModCard({ mod }) {
  const environments = mod.supportedEnvironments ?? ['unknown'];
  const environment =
    environments.includes('client') && environments.includes('server')
      ? 'Client & Server'
      : environments.includes('client')
        ? 'Client'
        : environments.includes('server')
          ? 'Server'
          : 'Unknown';

  return (
    <article className="group relative aspect-square min-w-0 cursor-pointer   bg-[#17171b] rounded-xl shadow-lg shadow-black/15">
      <RunningModToolTip environment={environment} mod={mod} />

      {mod.iconUrl && (
        <img
          src={mod.iconUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover rounded-xl"
          loading="lazy"
          onError={event => {
            event.currentTarget.style.display = 'none';
          }}
        />
      )}

      <span className="absolute inset-0 bg-linear-to-t from-black/95 via-black/60 to-black/20 rounded-xl" />

      {mod.url && (
        <a
          href={mod.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${mod.name} project page`}
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/55 text-white/85 opacity-0 backdrop-blur-sm hover:bg-black/75 hover:text-white group-hover:opacity-100 focus:opacity-100"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M9 3h4v4M13 3 7.5 8.5M11 9v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h3"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      )}

      {!mod.iconUrl && (
        <div
          className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-white/10"
          aria-hidden="true"
        >
          {(mod.name ?? '?').charAt(0).toUpperCase()}
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-white">
          {mod.url ? (
            <a
              href={mod.url}
              target="_blank"
              rel="noreferrer"
              className="hover:underline hover:decoration-white/50 hover:underline-offset-4"
            >
              {mod.name}
            </a>
          ) : (
            mod.name
          )}
        </h3>
      </div>
    </article>
  );
}
