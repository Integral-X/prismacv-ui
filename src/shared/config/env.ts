function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL;
  if (!raw) {
    throw new Error(
      'Missing required environment variables: NEXT_PUBLIC_API_URL.\n' +
        'Check your .env.local file.'
    );
  }
  return `${raw.replace(/\/$/, '')}/v1/`;
}

export const env = {
  /**
   * Trailing slash is required: `new URL('auth/...', base)` replaces the last
   * path segment of a base without a trailing slash, which would drop `v1`.
   *
   * Lazily evaluated so `next build` can compile without the env var present.
   */
  get apiBaseUrl(): string {
    return getApiBaseUrl();
  },
} as const;
