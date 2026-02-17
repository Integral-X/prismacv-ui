/**
 * Query Key Factory
 * Prevents key collisions and provides type-safe query key management
 *
 * Usage:
 *   queryKeys.auth.me() => ['auth', 'me']
 */

export const queryKeys = {
  // Auth queries
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },
} as const;
