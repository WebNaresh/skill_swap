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
        src: '/favicon.svg',
        sizes: '16x16',
        type: 'image/svg+xml',
        purpose: 'any'
      },
      {
        src: '/logo.svg',
        sizes: '64x64',
        type: 'image/svg+xml',
        purpose: 'any'
      },
      {
        src: '/logo-large.svg',
        sizes: '128x128',
        type: 'image/svg+xml',
        purpose: 'any'
      },
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
    screenshots: [
      {
        src: '/screenshot-wide.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'SkillCircle Platform Overview'
      },
      {
        src: '/screenshot-narrow.png',
        sizes: '750x1334',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'SkillCircle Mobile Experience'
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
            src: '/logo.svg',
            sizes: '64x64',
            type: 'image/svg+xml'
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
            src: '/logo.svg',
            sizes: '64x64',
            type: 'image/svg+xml'
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
            src: '/logo.svg',
            sizes: '64x64',
            type: 'image/svg+xml'
          }
        ]
      }
    ]
  }
}
