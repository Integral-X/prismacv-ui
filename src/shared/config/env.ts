type PublicEnvInput = {
  NEXT_PUBLIC_API_URL: string | undefined;
};

type PublicEnv = {
  NEXT_PUBLIC_API_URL: string;
};

function assertPublicEnv(input: PublicEnvInput): asserts input is PublicEnv {
  if (!input.NEXT_PUBLIC_API_URL) {
    throw new Error(
      'Missing required environment variables: NEXT_PUBLIC_API_URL.\n' +
        'Check your .env.local file.'
    );
  }
}

const publicEnv: PublicEnvInput = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
};

assertPublicEnv(publicEnv);

const apiOrigin = publicEnv.NEXT_PUBLIC_API_URL.replace(/\/$/, '');

export const env = {
  /**
   * Trailing slash is required: `new URL('auth/...', base)` replaces the last
   * path segment of a base without a trailing slash, which would drop `v1`.
   */
  apiBaseUrl: `${apiOrigin}/api/v1/`,
} as const;
