import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SkillCircle - Skill Exchange Platform',
    short_name: 'SkillCircle',
    description: 'A modern platform that enables users to exchange skills through a barter system for learning. Connect with people who want to teach skills they know in exchange for learning skills they need.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#0ea5e9',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en',
    categories: ['education', 'social', 'productivity'],
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
      }
    ],

    shortcuts: [
      {
        name: 'Find Skills',
        short_name: 'Search',
        description: 'Search for skills to learn',
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
        name: 'My Profile',
        short_name: 'Profile',
        description: 'View and edit your profile',
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
        name: 'My Swaps',
        short_name: 'Swaps',
        description: 'Manage your skill exchanges',
        url: '/swaps',
        icons: [
          {
            src: '/web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    ]
  }
}
