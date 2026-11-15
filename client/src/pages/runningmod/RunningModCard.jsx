import RunningModToolTip from './RunningModToolTip';

export default function RunningModCard({ mod }) {
  const environments = mod.supportedEnvironments;
  const environment =
    environments.includes('client') && environments.includes('server')
      ? 'Client & Server'
      : environments.includes('client')
        ? 'Client'
        : 'Server';

  return (
    <a
      href={mod.url}
      target="_blank"
      rel="noreferrer"
      aria-label={`Open ${mod.name} project page`}
      className="group relative aspect-square min-w-0 cursor-pointer"
    >
      <RunningModToolTip environment={environment} mod={mod} />

      <div className="absolute inset-0 overflow-hidden rounded-xl">
        {mod.iconUrl && (
          <img
            src={mod.iconUrl}
            alt=""
            className="absolute inset-0 h-full w-full rounded-xl object-cover brightness-75"
            loading="lazy"
            onError={event => {
              event.currentTarget.style.display = 'none';
            }}
          />
        )}
        <span className="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-black/10 pointer-events-none" />
      </div>

      <h3 className="absolute inset-x-0 bottom-0 line-clamp-2 wrap-break-word p-2.5 text-xs font-semibold leading-4 text-white sm:p-3 sm:text-sm sm:leading-5">
        <span className="decoration-white/50 underline-offset-4 group-hover:underline">
          {mod.name}
        </span>
      </h3>
    </a>
  );
}
