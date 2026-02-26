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
import { cookies } from 'next/headers';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { BACKEND_API_ENDPOINTS } from '@/lib/api/backend-endpoints';
import { AUTH_COOKIE_MAX_AGE } from '@/lib/api/services/auth.constants';

export async function POST(request: NextRequest) {
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

    // Call your backend auth service
    const response = await fetch(
      `${API_ENDPOINTS.MAIN}${BACKEND_API_ENDPOINTS.auth.login}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: { code: 'AUTH_ERROR', message: 'Authentication failed' },
      }));
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();

    if (!data.token) {
      return NextResponse.json(
        {
          error: {
            code: 'AUTH_ERROR',
            message: 'Authentication failed: no token returned by server',
          },
        },
        { status: 502 }
      );
    }

    // Set httpOnly cookie with JWT token
    // This is secure - JavaScript cannot access httpOnly cookies
    const cookieStore = await cookies();
    cookieStore.set('auth-token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: AUTH_COOKIE_MAX_AGE,
      path: '/',
    });

    // Return user data (without token)
    return NextResponse.json({
      data: {
        user: data.user,
      },
    });
  } catch (error) {
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
