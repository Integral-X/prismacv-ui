export default function DashboardLoading() {
  return (
    <div className='container mx-auto px-4 py-8 animate-pulse'>
      {/* Title skeleton */}
      <div className='h-8 w-48 bg-surface-elevated rounded mb-6' />

      {/* Stats cards grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className='h-32 rounded-lg bg-surface-elevated' />
        ))}
      </div>

      {/* Main content area */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 h-64 rounded-lg bg-surface-elevated' />
        <div className='h-64 rounded-lg bg-surface-elevated' />
      </div>
    </div>
  );
}
