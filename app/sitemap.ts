import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://czekanski.dev',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    // Add more routes here if needed, e.g. blog posts or projects pages
  ];
}
