import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import { BreadcrumbSchema, ArticleSchema } from '@/components/seo'
import { ArrowLeft } from 'lucide-react'
import { getInventory } from '@/lib/inventory-source'
import { RichText } from '@/components/RichText'

// ISR: Revalidate every 1 hour (3600 seconds)
// Individual blog posts are mostly static once published
export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
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
      canonical: `https://whitehatlink.org/blog/${post.slug}`,
    },
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || `Read ${post.title} on the WhiteHatLinks blog.`,
      url: `https://whitehatlink.org/blog/${post.slug}`,
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
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const post = docs[0]

  if (!post) return notFound()

  // Get featured inventory (no niche filter since we removed related_niche field)
  const related = await getInventory({
    limit: 3,
    sort: 'dr',
  })

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://whitehatlink.org' },
          { name: 'Blog', url: 'https://whitehatlink.org/blog' },
          { name: post.title, url: `https://whitehatlink.org/blog/${post.slug}` },
        ]}
      />
      <ArticleSchema
        title={post.title}
        description={post.metaDescription || `Read ${post.title} on the WhiteHatLinks blog.`}
        url={`https://whitehatlink.org/blog/${post.slug}`}
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
            {post.metaDescription && (
              <p className="text-lg text-muted-foreground lead">{post.metaDescription}</p>
            )}
            {post.tags?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
            {/* Lexical rich text content */}
            {post.content && (
              <RichText content={post.content} className="mt-8" />
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
