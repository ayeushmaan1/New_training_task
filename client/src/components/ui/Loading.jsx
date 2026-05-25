export default function Loading({ label = 'Loading' }) {
  return (
    <div className="grid min-h-[45vh] place-items-center px-4">
      <div className="flex items-center gap-3 rounded-md border border-black/5 bg-white px-4 py-3 shadow-soft dark:border-white/10 dark:bg-white/5">
        <span className="h-3 w-3 animate-ping rounded-full bg-coral" />
        <span className="text-sm font-medium text-ink-700 dark:text-ink-100">{label}</span>
      </div>
    </div>
  );
}
