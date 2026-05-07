export default function Loading() {
  return (
    <div
      className='min-h-screen flex items-center justify-center bg-surface-primary'
      role='status'
      aria-label='Loading'
    >
      <div className='flex flex-col items-center gap-4'>
        <div className='h-10 w-10 animate-spin rounded-full border-4 border-border-subtle border-t-brand-primary' />
        <p className='text-sm text-content-secondary animate-pulse'>
          Loading...
        </p>
      </div>
    </div>
  );
}
