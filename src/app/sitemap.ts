import type { MetadataRoute } from 'next';

/**
 * Sitemap Generation
 * Next.js automatically handles XML escaping for URLs and other fields
 * This file generates /sitemap.xml at the root of your site
 */

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://prismacv.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/onboarding`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/onboarding/upload-cv`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/onboarding/import-linkedin`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/onboarding/select-template`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  return routes;
}
