import { SearchX } from 'lucide-react';

export default function EmptyState({ title = 'Nothing here yet', body = 'Try adjusting your filters.' }) {
  return (
    <div className="rounded-md border border-dashed border-ink-200 bg-white p-8 text-center dark:border-white/10 dark:bg-white/5">
      <SearchX className="mx-auto mb-3 text-ink-500" size={28} />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-200">{body}</p>
    </div>
  );
}
