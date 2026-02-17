/**
 * Query Time Constants
 * Centralized time constants for TanStack Query configuration
 */

// Time conversion helpers
const SECOND = 1000;
const MINUTE = SECOND * 60;

/**
 * Query stale time: how long data is considered fresh (no refetch)
 */
export const QUERY_STALE_TIME = 5 * MINUTE; // 5 minutes

/**
 * Query cache time (gcTime): how long unused data stays in cache
 */
export const QUERY_CACHE_TIME = 30 * MINUTE; // 30 minutes

/**
 * Mutation retry delay
 */
export const MUTATION_RETRY_DELAY = SECOND; // 1 second

/**
 * Maximum retry delay for exponential backoff
 */
export const MAX_RETRY_DELAY = 30 * SECOND; // 30 seconds
