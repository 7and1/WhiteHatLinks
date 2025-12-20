/**
 * Centralized Site Configuration
 * All brand-related constants should be defined here
 */

export const siteConfig = {
  // Brand Identity
  name: 'White Hat Link',
  shortName: 'WhiteHatLink',
  legalName: 'White Hat Link',

  // Domain & URLs
  domain: 'whitehatlink.org',
  url: 'https://whitehatlink.org',

  // Contact Information
  email: 'hello@whitehatlink.org',
  supportEmail: 'support@whitehatlink.org',

  // Social Media (add as needed)
  social: {
    twitter: '@whitehatlink',
    // linkedin: '',
    // facebook: '',
  },

  // SEO & Meta
  tagline: 'Premium Backlinks Without Spam',
  description: 'Buy vetted, high-authority backlinks with transparent metrics. No PBNs, no spam. Manual outreach, real editorial placements. 500+ campaigns delivered safely with 90% acceptance rate.',
  shortDescription: 'Premium backlink acquisition service. Vetted, high-authority guest posts and link insertions with transparent metrics. No PBNs, no spam.',

  // Keywords for SEO
  keywords: [
    'backlinks',
    'guest posts',
    'link building',
    'SEO',
    'link insertions',
    'digital PR',
    'high DR backlinks',
    'white hat SEO',
    'editorial backlinks',
    'quality backlinks',
    'buy backlinks',
    'link building service',
  ],

  // Branding Colors
  themeColor: '#3b5bdb',

  // Company Info
  foundingDate: '2023',
  country: 'United States',

  // Expertise Areas
  expertise: [
    'Link Building',
    'Guest Posting',
    'SEO',
    'Digital PR',
    'Content Marketing',
    'Backlink Acquisition',
  ],
} as const

// Computed values for convenience
export const siteTitle = `${siteConfig.name} | ${siteConfig.tagline}`
export const siteTitleTemplate = `%s | ${siteConfig.name}`

export type SiteConfig = typeof siteConfig
