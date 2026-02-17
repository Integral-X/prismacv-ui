/**
 * Auth Login Route Handler (BFF Pattern)
 *
 * This Route Handler acts as a Backend-for-Frontend (BFF) proxy:
 * - Receives credentials from client
 * - Calls your backend auth service
 * - Sets httpOnly cookie with JWT token
 * - Returns user data to client
 */

import { NextRequest, NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { checkRateLimit } from '@/lib/security/rateLimit';
import { AUTH_RATE_LIMITS } from '@/lib/security/rateLimit.config';
import { setAuthToken } from '@/lib/auth/cookies';
import { createApiClient, HttpError } from '@/lib/http';

// Create HTTP client instance for backend API calls
const apiClient = createApiClient(API_ENDPOINTS.MAIN);

export async function POST(request: NextRequest) {
  // Check rate limit: 5 login attempts per 15 minutes per IP
  const rateLimitResponse = checkRateLimit(request, AUTH_RATE_LIMITS.LOGIN);

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Email and password are required',
          },
        },
        { status: 400 }
      );
    }

    // Call backend auth service - no auth token required for login
    const data = await apiClient.post<{ token: string; user: unknown }>(
      '/auth/login',
      { email, password },
      { requireAuth: false }
    );

    // Set httpOnly cookie with JWT token
    // This is secure - JavaScript cannot access httpOnly cookies
    await setAuthToken(data.token);

    // Return user data (without token)
    return NextResponse.json({
      data: {
        user: data.user,
      },
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
    console.error('Login error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred during login',
        },
      },
      { status: 500 }
    );
  }
}
