import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const isProduction = process.env.NODE_ENV === 'production';

    // Minimal health check - don't leak sensitive info in production
    const healthCheck = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      // Only include uptime and version in non-production environments
      ...(isProduction
        ? {}
        : {
            uptime: process.uptime(),
            version: process.env.npm_package_version || '0.1.0',
          }),
    };

    return NextResponse.json(healthCheck, { status: 200 });
  } catch (error) {
    const errorResponse = {
      status: 'error',
      timestamp: new Date().toISOString(),
      // Don't leak error details in production
      ...(process.env.NODE_ENV === 'production'
        ? {}
        : {
            error: error instanceof Error ? error.message : 'Unknown error',
          }),
    };

    return NextResponse.json(errorResponse, { status: 503 });
  }
}
