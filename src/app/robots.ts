import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const host = 'https://whitehatlink.org'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api'],
    },
    sitemap: `${host}/sitemap.xml`,
    host,
  }
}
