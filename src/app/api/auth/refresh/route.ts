/**
 * Refresh JWT Token Route Handler
 * Uses existing auth-token cookie, calls backend refresh endpoint,
 * and updates the httpOnly auth-token cookie.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { BACKEND_API_ENDPOINTS } from '@/lib/api/backend-endpoints';
import { AUTH_COOKIE_MAX_AGE } from '@/lib/api/services/auth.constants';
import { api } from '@/lib/api/client';
import { ApiError } from '@/lib/api/types';

interface RefreshResponse {
  token: string;
}

export async function POST() {
  try {
    const cookieStore = await cookies();
    const currentToken = cookieStore.get('auth-token')?.value;

    if (!currentToken) {
      return NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required to refresh token',
          },
        },
        { status: 401 }
      );
    }

    try {
      const data = await api.post<RefreshResponse>(
        `${API_ENDPOINTS.MAIN}${BACKEND_API_ENDPOINTS.auth.refresh}`,
        undefined,
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!data.token) {
        return NextResponse.json(
          {
            error: {
              code: 'AUTH_ERROR',
              message: 'Token refresh failed: no token returned by server',
            },
          },
          { status: 502 }
        );
      }

      // Update httpOnly cookie with new JWT token
      const secure = process.env.NODE_ENV === 'production';
      cookieStore.set('auth-token', data.token, {
        httpOnly: true,
        secure,
        sameSite: 'lax',
        maxAge: AUTH_COOKIE_MAX_AGE,
        path: '/',
      });

      return NextResponse.json({
        data: { token: data.token },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          // Backend indicates token/refresh is invalid - clear cookie
          cookieStore.delete('auth-token');
        }

        return NextResponse.json(
          {
            error: {
              code: error.code || 'AUTH_ERROR',
              message: error.message,
              details: error.details,
            },
          },
          { status: error.status }
        );
      }

      throw error;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Refresh token error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while refreshing token',
        },
      },
      { status: 500 }
    );
  }
}
