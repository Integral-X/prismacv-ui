/**
 * Auth Logout Route Handler
 * Clears the httpOnly auth cookie
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/security/rateLimit';
import { AUTH_RATE_LIMITS } from '@/lib/security/rateLimit.config';
import { deleteAuthToken } from '@/lib/auth/cookies';

export async function POST(request: NextRequest) {
  // Check rate limit: 10 logout requests per minute per IP
  const rateLimitResponse = checkRateLimit(request, AUTH_RATE_LIMITS.LOGOUT);

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    await deleteAuthToken();

    return NextResponse.json({
      data: { message: 'Logged out successfully' },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Logout error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred during logout',
        },
      },
      { status: 500 }
    );
  }
}
