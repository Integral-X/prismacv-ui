export default function JobsLoading() {
  return (
    <>
      <div className="h-[88px] shrink-0 animate-pulse" />
      <div className="flex-1 animate-pulse overflow-y-auto px-6 py-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-[1600px] rounded-xl border border-subtle bg-surface-card p-6">
          <div className="mb-6 h-10 rounded-lg bg-surface-elevated" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map((col) => (
              <div key={col} className="min-w-[260px] flex-1 space-y-3">
                <div className="h-10 rounded-lg bg-surface-elevated" />
                <div className="h-48 rounded-xl bg-surface-elevated" />
                <div className="h-32 rounded-xl bg-surface-elevated" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
