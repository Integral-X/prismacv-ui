/**
 * Auth Logout Route Handler
 * Clears the httpOnly auth cookie
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');

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
