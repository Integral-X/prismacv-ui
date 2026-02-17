/**
 * TanStack Query Provider
 * Wraps the app with QueryClient and DevTools
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { defaultQueryOptions } from './options';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Create QueryClient instance with default options
  // Using useState to ensure it's only created once per app lifecycle
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: defaultQueryOptions,
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Only show devtools in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
