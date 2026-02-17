import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Optimize for production
  poweredByHeader: false,

  // Security headers are now handled in proxy.ts (Next.js 16 pattern)
  // This allows for dynamic CSP nonces and per-request header generation

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
