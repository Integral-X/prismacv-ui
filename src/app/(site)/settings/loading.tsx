export default function SettingsLoading() {
  return (
    <div className='container mx-auto px-4 py-8 animate-pulse max-w-2xl'>
      {/* Title skeleton */}
      <div className='h-8 w-36 bg-surface-elevated rounded mb-8' />

      {/* Form sections */}
      {[1, 2, 3].map((section) => (
        <div key={section} className='mb-8'>
          <div className='h-6 w-40 bg-surface-elevated rounded mb-4' />
          <div className='space-y-4'>
            <div className='h-10 w-full bg-surface-elevated rounded' />
            <div className='h-10 w-full bg-surface-elevated rounded' />
          </div>
        </div>
      ))}

      {/* Save button */}
      <div className='h-10 w-24 bg-surface-elevated rounded' />
    </div>
  );
}
