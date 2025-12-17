import type { MetadataRoute } from 'next'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

const base = 'https://whitehatlinks.io'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadHMR({ config: configPromise })
  const { docs: posts } = await payload.find({ collection: 'posts', limit: 200, sort: '-updatedAt' })
  const { docs: inventory } = await payload.find({ collection: 'inventory', limit: 500 })

  const niches = Array.from(new Set(inventory.map((i: any) => i.niche?.toString().toLowerCase().replace(/\s+/g, '-')))).filter(Boolean)

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
    { url: `${base}/services`, lastModified: new Date() },
    { url: `${base}/inventory`, lastModified: new Date() },
    { url: `${base}/blog`, lastModified: new Date() },
  ]

  const postRoutes: MetadataRoute.Sitemap = posts.map((post: any) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.updatedAt || post.createdAt,
  }))

  const industryRoutes: MetadataRoute.Sitemap = niches.map((niche) => ({
    url: `${base}/industries/${niche}`,
    lastModified: new Date(),
  }))

  return [...staticRoutes, ...postRoutes, ...industryRoutes]
}
