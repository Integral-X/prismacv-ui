export default function CvEditLoading() {
  return (
    <div className='flex h-dvh animate-pulse flex-col overflow-hidden bg-surface-primary'>
      {/* Top toolbar */}
      <div className='border-b border-subtle bg-surface-primary'>
        <div className='grid min-h-14 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 px-3 py-2 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:px-4'>
          <div className='flex min-w-0 items-center gap-2'>
            <div className='size-8 shrink-0 rounded bg-surface-elevated' />
            <div className='h-5 w-40 rounded bg-surface-elevated' />
          </div>
          <div className='h-8 w-20 rounded bg-surface-elevated lg:order-3 lg:justify-self-end' />
          <div className='col-span-2 flex gap-2 overflow-hidden lg:col-span-1 lg:justify-center'>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className='h-8 w-10 shrink-0 rounded-md bg-surface-elevated sm:w-24'
              />
            ))}
          </div>
        </div>
      </div>

      <div className='flex min-h-0 flex-1'>
        {/* Micro-rail */}
        <div className='flex w-12 flex-col items-center gap-2 border-r border-subtle py-3'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='size-9 rounded-md bg-surface-elevated' />
          ))}
        </div>

        {/* Content panel */}
        <div className='w-96 shrink-0 space-y-4 border-r border-subtle p-4'>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className='h-20 rounded-lg border border-subtle bg-surface-card'
            />
          ))}
        </div>

        {/* Document canvas */}
        <div className='flex flex-1 items-start justify-center bg-surface-elevated p-8'>
          <div className='h-[700px] w-[595px] rounded bg-surface-card shadow-card' />
        </div>
      </div>
    </div>
  );
}
