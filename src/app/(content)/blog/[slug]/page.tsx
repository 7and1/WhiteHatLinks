import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import Link from 'next/link'
import { BreadcrumbSchema, ArticleSchema } from '@/components/seo'
import { ArrowLeft } from 'lucide-react'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayloadHMR({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const post = docs[0]

  if (!post) {
    return { title: 'Post Not Found' }
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || `Read ${post.title} on the WhiteHatLinks blog.`,
    alternates: {
      canonical: `https://whitehatlinks.io/blog/${post.slug}`,
    },
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || `Read ${post.title} on the WhiteHatLinks blog.`,
      url: `https://whitehatlinks.io/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedDate || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle || post.title,
      description: post.metaDescription || `Read ${post.title} on the WhiteHatLinks blog.`,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayloadHMR({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const post = docs[0]

  if (!post) return notFound()

  const niche = post.related_niche
  const { docs: related } = await payload.find({
    collection: 'inventory',
    where: niche
      ? { niche: { contains: niche }, status: { equals: 'Available' } }
      : { status: { equals: 'Available' } },
    limit: 3,
    sort: '-dr',
  })

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://whitehatlinks.io' },
          { name: 'Blog', url: 'https://whitehatlinks.io/blog' },
          { name: post.title, url: `https://whitehatlinks.io/blog/${post.slug}` },
        ]}
      />
      <ArticleSchema
        title={post.title}
        description={post.metaDescription || `Read ${post.title} on the WhiteHatLinks blog.`}
        url={`https://whitehatlinks.io/blog/${post.slug}`}
        publishedDate={post.publishedDate || new Date().toISOString()}
        modifiedDate={post.updatedAt || post.publishedDate || new Date().toISOString()}
      />

      <div className="container py-16">
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blog
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(280px,0.3fr)]">
          <article className="prose max-w-none">
            <div className="text-sm text-muted-foreground mb-4">
              {post.publishedDate
                ? new Date(post.publishedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Draft'}
            </div>
            <h1 className="text-foreground">{post.title}</h1>
            {post.metaDescription && (
              <p className="text-lg text-muted-foreground lead">{post.metaDescription}</p>
            )}
            {/* Lexical rich text content will be rendered by PayloadCMS */}
            {post.content && (
              <div className="mt-8">
                <p className="text-muted-foreground">
                  Content available in admin panel. Full rendering coming soon.
                </p>
              </div>
            )}
          </article>

          <aside className="space-y-6">
            {/* Related Inventory */}
            <div className="rounded-lg border bg-white p-6 shadow-sm sticky top-24">
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Featured {niche ?? ''} inventory
              </h3>
              <div className="space-y-4">
                {related.map((item) => (
                  <div key={item.id} className="rounded-lg border px-4 py-3">
                    <div className="text-sm font-semibold text-foreground">
                      DR {item.dr} · {item.niche}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ${item.price} · {item.traffic?.toLocaleString?.() ?? 'N/A'} traffic
                    </div>
                    <Link
                      href="/inventory"
                      className="text-xs text-primary hover:underline mt-1 inline-block"
                    >
                      Request access
                    </Link>
                  </div>
                ))}
                {related.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Browse our full inventory for available placements.
                  </p>
                )}
              </div>
              <Link
                href="/inventory"
                className="mt-4 block w-full text-center rounded-md border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
              >
                View all inventory
              </Link>
            </div>

            {/* CTA */}
            <div className="rounded-lg border bg-gradient-to-br from-primary/5 to-white p-6">
              <h3 className="font-semibold text-foreground mb-2">Need link building help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get a custom quote for your campaign.
              </p>
              <Link
                href="/contact"
                className="block w-full text-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
              >
                Get a quote
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
