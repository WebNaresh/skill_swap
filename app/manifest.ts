import { MetadataRoute } from 'next'

/**
 * PWA Manifest configuration for SkillCircle Platform
 * Enhanced for modern skill exchange experience
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SkillCircle - Where Skills Come Full Circle',
    short_name: 'SkillCircle',
    description: 'Trade your expertise for new knowledge. No money required. Connect with passionate learners and teachers in your community. Exchange skills, build relationships, and grow together on the revolutionary skill exchange platform.',
    start_url: 'https://circleskills.vercel.app/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#0ea5e9',
    orientation: 'portrait-primary',
    scope: 'https://circleskills.vercel.app/',
    lang: 'en-US',
    categories: ['education', 'social', 'productivity', 'lifestyle', 'business'],
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      }
    ],

    shortcuts: [
      {
        name: 'Search Skills',
        short_name: 'Search',
        description: 'Find skills to learn and teachers to connect with',
        url: '/search',
        icons: [
          {
            src: '/web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      },
      {
        name: 'My Requests',
        short_name: 'Requests',
        description: 'Manage your skill exchange requests',
        url: '/request',
        icons: [
          {
            src: '/web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      },
      {
        name: 'Profile Setup',
        short_name: 'Profile',
        description: 'Complete your profile and add skills',
        url: '/profile',
        icons: [
          {
            src: '/web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      },
      {
        name: 'Sign In',
        short_name: 'Sign In',
        description: 'Access your SkillCircle account',
        url: '/sign-in',
        icons: [
          {
            src: '/web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    ],

    // Additional PWA features
    id: 'skillcircle-app',
    dir: 'ltr',
    prefer_related_applications: false,

    // Enhanced metadata for app stores
    keywords: [
      'skill exchange',
      'learning platform',
      'teach skills',
      'learn skills',
      'barter system',
      'community learning',
      'skill sharing',
      'education',
      'mentorship',
      'knowledge exchange'
    ],

    // Protocol handlers for deep linking
    protocol_handlers: [
      {
        protocol: 'web+skillcircle',
        url: '/search?skill=%s'
      }
    ]
  }
}
