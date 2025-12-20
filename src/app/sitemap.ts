import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getAllIndustries } from '@/data/industries'

// Cache for 1 hour to reduce D1 load
export const revalidate = 3600
export const dynamic = 'force-dynamic'

const base = 'https://whitehatlink.org'

// Deployment/build timestamp for static pages
const buildTime = new Date('2025-01-15')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: configPromise })

  // Fetch all posts without limit for complete sitemap
  const { docs: posts } = await payload.find({
    collection: 'posts',
    limit: 0, // No limit - get all posts
    sort: '-updatedAt',
  })

  // Get all industries from static data
  const industries = getAllIndustries()

  // Get current date for inventory (updates daily)
  const now = new Date()

  // Static routes with priority and changeFrequency
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: now, // Home page changes daily with inventory
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${base}/inventory`,
      lastModified: now, // Inventory updates daily
      changeFrequency: 'hourly',
      priority: 0.95,
    },
    {
      url: `${base}/services`,
      lastModified: buildTime,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${base}/pricing`,
      lastModified: buildTime,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${base}/blog`,
      lastModified: posts.length > 0 && posts[0].updatedAt
        ? new Date(posts[0].updatedAt)
        : now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${base}/about`,
      lastModified: buildTime,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${base}/contact`,
      lastModified: buildTime,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/faq`,
      lastModified: buildTime,
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    {
      url: `${base}/sitemap`,
      lastModified: posts.length > 0 && posts[0].updatedAt
        ? new Date(posts[0].updatedAt)
        : now,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${base}/privacy`,
      lastModified: buildTime,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${base}/terms`,
      lastModified: buildTime,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Blog post routes with dynamic priority based on recency
  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => {
    const postDate = post.publishedDate ? new Date(post.publishedDate) : new Date()
    const daysSincePublish = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24))

    // Fresh posts (< 30 days) get higher priority
    let priority = 0.75
    if (daysSincePublish < 7) priority = 0.85
    else if (daysSincePublish < 30) priority = 0.8
    else if (daysSincePublish < 90) priority = 0.75
    else priority = 0.65

    return {
      url: `${base}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : postDate,
      changeFrequency: daysSincePublish < 30 ? 'weekly' as const : 'monthly' as const,
      priority,
    }
  })

  // Industry routes - high priority as they're conversion-focused
  const industryRoutes: MetadataRoute.Sitemap = industries.map((industry) => ({
    url: `${base}/industries/${industry.slug}`,
    lastModified: buildTime,
    changeFrequency: 'weekly' as const,
    priority: 0.82, // Between pricing and blog
  }))

  return [...staticRoutes, ...postRoutes, ...industryRoutes]
}
