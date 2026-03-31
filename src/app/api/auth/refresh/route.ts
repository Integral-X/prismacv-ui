/**
 * Refresh JWT Token Route Handler (BFF)
 * Reads JWT from httpOnly `auth-token` cookie, calls backend refresh,
 * updates the cookie, returns the new token in the JSON body (client uses `data.token`).
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { BACKEND_API_ENDPOINTS } from '@/lib/api/backend-endpoints';
import {
  AUTH_BACKEND_FETCH_TIMEOUT_MS,
  AUTH_COOKIE_MAX_AGE,
} from '@/lib/api/services/auth.constants';

function extractTokenFromRefreshBody(raw: unknown): string | undefined {
  if (typeof raw !== 'object' || raw === null) return undefined;
  const o = raw as { data?: { token?: string }; token?: string };
  return o.data?.token ?? o.token;
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

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      AUTH_BACKEND_FETCH_TIMEOUT_MS
    );

    let response: Response;
    try {
      response = await fetch(
        `${API_ENDPOINTS.MAIN}${BACKEND_API_ENDPOINTS.auth.refresh}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${currentToken}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        }
      );
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      if (response.status === 401) {
        cookieStore.delete('auth-token');
      }
      const error = await response.json().catch(() => ({
        error: { code: 'AUTH_ERROR', message: 'Token refresh failed' },
      }));
      return NextResponse.json(error, { status: response.status });
    }

    const raw = await response.json();
    const newToken = extractTokenFromRefreshBody(raw);

    if (!newToken) {
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

    cookieStore.set('auth-token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: AUTH_COOKIE_MAX_AGE,
      path: '/',
    });

    return NextResponse.json({
      data: { token: newToken },
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        {
          error: {
            code: 'UPSTREAM_TIMEOUT',
            message: 'Auth service did not respond in time',
          },
        },
        { status: 504 }
      );
    }
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
