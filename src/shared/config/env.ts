const vars = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
} as const;

function assertEnv(
  vars: Record<string, string | undefined>
): asserts vars is Record<string, string> {
  const missing = Object.entries(vars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}.\n` +
        'Check your .env.local file.'
    );
  }
}

assertEnv(vars);

const apiOrigin = vars.NEXT_PUBLIC_API_URL.replace(/\/$/, '');

export const env = {
  /**
   * Trailing slash is required: `new URL('auth/...', base)` replaces the last
   * path segment of a base without a trailing slash, which would drop `v1`.
   */
  apiBaseUrl: `${apiOrigin}/api/v1/`,
} as const;
