export default function StatCard({ icon: Icon, label, value, tone = 'mint' }) {
  const toneClasses = {
    mint: 'bg-mint/12 text-mint',
    coral: 'bg-coral/12 text-coral',
    gold: 'bg-gold/15 text-gold',
    ink: 'bg-ink-900/8 text-ink-700 dark:bg-white/10 dark:text-white'
  };

  return (
    <div className="rounded-md border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-ink-500 dark:text-ink-200">{label}</p>
          <p className="mt-1 text-2xl font-semibold">{value}</p>
        </div>
        {Icon && (
          <span className={`grid h-10 w-10 place-items-center rounded-md ${toneClasses[tone]}`}>
            <Icon size={20} />
          </span>
        )}
      </div>
    </div>
  );
}
