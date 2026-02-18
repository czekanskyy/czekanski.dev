import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Block bots from accessing admin panel and API endpoints
      disallow: ['/admin/', '/api/'],
    },
    // Point to sitemap
    sitemap: 'https://czekanski.dev/sitemap.xml',
  };
}
