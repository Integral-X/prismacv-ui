'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { refreshUnleashFeaturesAction } from '@/modules/features/data/actions';

export function AdminRefreshFlagsButton() {
  const [pending, startTransition] = React.useTransition();

  return (
    <Button
      type='button'
      variant='secondary'
      size='sm'
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const result = await refreshUnleashFeaturesAction();
          if (result.ok) {
            toast.success(result.message);
          } else {
            toast.error(result.message);
          }
        });
      }}
    >
      {pending && <Loader2 className='mr-2 size-4 animate-spin' />}
      Refresh from Unleash
    </Button>
  );
}
