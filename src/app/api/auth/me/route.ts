/**
 * Get Current User Route Handler
 * Reads JWT from httpOnly cookie and fetches user data from backend
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { BACKEND_API_ENDPOINTS } from '@/lib/api/backend-endpoints';
import { api } from '@/lib/api/client';
import { ApiError } from '@/lib/api/types';
import type { User } from '@/lib/api/services/auth.interface';

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

    try {
      const user = await api.get<User>(
        `${API_ENDPOINTS.MAIN}${BACKEND_API_ENDPOINTS.auth.me}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return NextResponse.json({
        data: user,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          // Token expired or invalid - clear cookie
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
