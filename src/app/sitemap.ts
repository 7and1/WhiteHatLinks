import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getAllIndustries } from '@/data/industries'

// Force dynamic rendering - sitemap needs live data from D1
export const dynamic = 'force-dynamic'

const base = 'https://whitehatlink.org'

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

  // Static routes with priority and changeFrequency
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${base}/inventory`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${base}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${base}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${base}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${base}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${base}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${base}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${base}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Blog post routes
  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Industry routes
  const industryRoutes: MetadataRoute.Sitemap = industries.map((industry) => ({
    url: `${base}/industries/${industry.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...postRoutes, ...industryRoutes]
}
