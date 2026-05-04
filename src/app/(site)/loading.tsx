export default function SiteLoading() {
  return (
    <div className='min-h-screen bg-surface-primary'>
      {/* Navbar placeholder */}
      <div className='h-16 border-b border-border-subtle bg-surface-card'>
        <div className='container mx-auto flex items-center justify-between px-4 h-full'>
          <div className='h-8 w-32 rounded bg-surface-elevated animate-pulse' />
          <div className='flex gap-4'>
            <div className='h-8 w-20 rounded bg-surface-elevated animate-pulse' />
            <div className='h-8 w-20 rounded bg-surface-elevated animate-pulse' />
          </div>
        </div>
      </div>
      {/* Content placeholder */}
      <div className='container mx-auto px-4 py-8'>
        <div className='h-8 w-64 rounded bg-surface-elevated animate-pulse mb-6' />
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='h-48 rounded-lg bg-surface-elevated animate-pulse'
            />
          ))}
        </div>
      </div>
    </div>
  );
}
