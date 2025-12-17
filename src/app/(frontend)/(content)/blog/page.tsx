import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { BreadcrumbSchema } from '@/components/seo'

// Force dynamic rendering - needs live D1 data
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog - Link Building Insights & Strategies',
  description:
    'Playbooks, case studies, and insights on safe link acquisition from real campaigns. Learn what works in link building.',
  alternates: {
    canonical: 'https://whitehatlinks.io/blog',
  },
  openGraph: {
    title: 'Blog | WhiteHatLinks',
    description: 'Link building insights and strategies from real campaigns.',
    url: 'https://whitehatlinks.io/blog',
  },
}

export default async function BlogListPage() {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'posts',
    limit: 20,
    sort: '-publishedDate',
  })

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://whitehatlinks.io' },
          { name: 'Blog', url: 'https://whitehatlinks.io/blog' },
        ]}
      />

      <div className="container py-16">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide">Blog</p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mt-2">
            Thoughts on safe link acquisition
          </h1>
          <p className="mt-4 text-muted-foreground">
            Playbooks, teardowns, and lessons learned from real link building campaigns. No fluff,
            just actionable insights.
          </p>
        </div>

        {docs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {docs.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group rounded-xl border bg-white p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all"
              >
                <div className="text-sm text-muted-foreground">
                  {post.publishedDate
                    ? new Date(post.publishedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Draft'}
                </div>
                <h2 className="mt-2 text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                {post.metaDescription && (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                    {post.metaDescription}
                  </p>
                )}
                <div className="mt-4 text-sm font-medium text-primary">
                  Read article →
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border bg-secondary/50 p-12 text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">Coming soon</h2>
            <p className="text-muted-foreground mb-6">
              We&apos;re working on our first articles. In the meantime, browse our inventory or get
              in touch.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/inventory"
                className="rounded-md bg-primary px-4 py-2 text-white font-semibold hover:bg-primary/90 transition-colors"
              >
                View inventory
              </Link>
              <Link
                href="/contact"
                className="rounded-md border px-4 py-2 font-semibold text-foreground hover:bg-secondary transition-colors"
              >
                Contact us
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
