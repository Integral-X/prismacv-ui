/**
 * Default Query and Mutation Options
 * Centralized configuration for TanStack Query behavior
 */

import type { DefaultOptions } from '@tanstack/react-query';
import {
  QUERY_STALE_TIME,
  QUERY_CACHE_TIME,
  MUTATION_RETRY_DELAY,
  MAX_RETRY_DELAY,
} from './query-time';

export const defaultQueryOptions: DefaultOptions = {
  queries: {
    // Stale time: how long data is considered fresh (no refetch)
    staleTime: QUERY_STALE_TIME,

    // Cache time: how long unused data stays in cache
    gcTime: QUERY_CACHE_TIME,

    // Retry configuration
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (client errors)
      if (error && typeof error === 'object' && 'status' in error) {
        const status = error.status as number;
        if (status >= 400 && status < 500) {
          return false;
        }
      }
      // Retry up to 3 times for network/server errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) =>
      Math.min(1000 * 2 ** attemptIndex, MAX_RETRY_DELAY), // Exponential backoff

    // Refetch configuration
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnReconnect: true, // Refetch when network reconnects
    refetchOnMount: true, // Refetch when component mounts (if data is stale)
  },
  mutations: {
    // Retry mutations once on failure
    retry: 1,
    retryDelay: MUTATION_RETRY_DELAY,
  },
};
