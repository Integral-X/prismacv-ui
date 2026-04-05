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

export const env = {
  apiBaseUrl: `${vars.NEXT_PUBLIC_API_URL}/api/v1`,
} as const;
