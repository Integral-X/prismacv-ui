/**
 * Get Current User Route Handler
 * Reads JWT from httpOnly cookie and fetches user data from backend
 */

import { NextRequest, NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { checkRateLimit } from '@/lib/security/rateLimit';
import { AUTH_RATE_LIMITS } from '@/lib/security/rateLimit.config';
import { getAuthToken } from '@/lib/auth/cookies';
import { createApiClient, HttpError } from '@/lib/http';
import type { User } from '@/lib/api/services/auth.interface';

// Create HTTP client instance for backend API calls
const apiClient = createApiClient(API_ENDPOINTS.MAIN);

export async function GET(request: NextRequest) {
  // Check rate limit: 30 requests per minute per IP
  const rateLimitResponse = checkRateLimit(request, AUTH_RATE_LIMITS.ME);

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        },
        { status: 401 }
      );
    }

    // Call backend service - auth token is automatically included
    const data = await apiClient.get<{ user: User } | User>('/auth/me');

    return NextResponse.json({
      data: 'user' in data ? data.user : data,
    });
  } catch (error) {
    // Handle HTTP client errors
    if (error instanceof HttpError) {
      return NextResponse.json(
        {
          error: {
            code: error.code,
            message: error.message,
          },
        },
        { status: error.status }
      );
    }

    // Handle unexpected errors
    // eslint-disable-next-line no-console
    console.error('Get user error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching user',
        },
      },
      { status: 500 }
    );
  }
}
