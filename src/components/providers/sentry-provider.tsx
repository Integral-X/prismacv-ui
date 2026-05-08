'use client';

import { useEffect } from 'react';
import { initializeSentry } from '@/shared/monitoring/sentry';

export function SentryProvider() {
  useEffect(() => {
    initializeSentry();
  }, []);

  return null;
}
