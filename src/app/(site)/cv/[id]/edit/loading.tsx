export default function CvEditLoading() {
  return (
    <div className='min-h-screen bg-surface-primary animate-pulse'>
      {/* Editor header */}
      <div className='sticky top-0 z-10 border-b border-subtle bg-surface-primary px-4 py-3'>
        <div className='mx-auto flex max-w-7xl items-center justify-between'>
          <div className='h-6 w-48 rounded bg-surface-elevated' />
          <div className='flex gap-2'>
            <div className='h-9 w-20 rounded bg-surface-elevated' />
            <div className='h-9 w-24 rounded bg-surface-elevated' />
          </div>
        </div>
      </div>

      {/* Main content: grid matching editor layout */}
      <div className='mx-auto max-w-7xl px-4 py-6'>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Left panel — form sections */}
          <div className='space-y-4 lg:col-span-2'>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className='rounded-lg border border-subtle bg-surface-card p-4 space-y-3'
              >
                <div className='h-5 w-32 rounded bg-surface-elevated' />
                <div className='h-10 w-full rounded bg-surface-elevated' />
                <div className='h-10 w-full rounded bg-surface-elevated' />
              </div>
            ))}
          </div>

          {/* Right panel — preview */}
          <div className='lg:col-span-1'>
            <div className='sticky top-20 h-[600px] rounded-lg border border-subtle bg-surface-elevated' />
          </div>
        </div>
      </div>
    </div>
  );
}
