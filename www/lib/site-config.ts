/**
 * @file site-config.ts
 * @description Centralized configuration for external URLs and site settings.
 * Uses environment variables with sensible defaults for development.
 */

export const siteConfig = {
  /**
   * Main product URLs - configurable via environment variables
   * These can point to external apps in production
   */
  urls: {
    community: process.env.NEXT_PUBLIC_COMMUNITY_URL || '/community',
    ai: process.env.NEXT_PUBLIC_AI_URL || '/ai',
    advertise: '/advertise',
    mobileApp: process.env.NEXT_PUBLIC_MOBILE_APP_URL || '#',
  },

  /**
   * Company information
   */
  company: {
    name: 'Tribe Network',
    tagline: 'The unified ecosystem for campus communities',
  },

  /**
   * Social media links
   */
  social: {
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || '#',
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#',
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || '#',
    github: process.env.NEXT_PUBLIC_GITHUB_URL || '#',
  },
} as const

export type SiteConfig = typeof siteConfig
