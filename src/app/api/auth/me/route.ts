/**
 * Get Current User Route Handler
 * Reads JWT from httpOnly cookie and fetches user data from backend
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { BACKEND_API_ENDPOINTS } from '@/lib/api/backend-endpoints';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

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

    // Call your backend service with JWT token
    const response = await fetch(
      `${API_ENDPOINTS.MAIN}${BACKEND_API_ENDPOINTS.auth.me}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid - clear cookie
        cookieStore.delete('auth-token');
      }
      const error = await response.json().catch(() => ({
        error: { code: 'AUTH_ERROR', message: 'Failed to fetch user' },
      }));
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json({
      data: data.user || data,
    });
  } catch (error) {
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
