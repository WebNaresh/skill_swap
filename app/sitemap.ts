import type { MetadataRoute } from 'next'

/**
 * Sitemap configuration for SkillCircle Platform
 * Optimized for SEO with proper priorities and change frequencies
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://circleskills.vercel.app'
  const currentDate = new Date()

  return [
    // Home page - Highest priority, recently enhanced
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },

    // Core platform features - High priority
    {
      url: `${baseUrl}/search`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/request`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },

    // User authentication and profile - High priority
    {
      url: `${baseUrl}/sign-in`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },

    // Legal and policy pages - Lower priority, infrequent changes
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refund`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
