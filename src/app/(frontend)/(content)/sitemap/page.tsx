import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getAllNiches } from '@/data/niches'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Sitemap - WhiteHatLink',
  description: 'Navigate our complete site structure. Find all pages, blog articles, and resources for link building and SEO services.',
  alternates: {
    canonical: 'https://whitehatlink.org/sitemap',
  },
}

interface SitemapSection {
  title: string
  links: { href: string; label: string; description?: string }[]
}

export default async function SitemapPage() {
  const payload = await getPayload({ config: configPromise })

  const { docs: posts } = await payload.find({
    collection: 'posts',
    limit: 0,
    sort: '-publishedDate',
  })

  const niches = getAllNiches()

  const sections: SitemapSection[] = [
    {
      title: 'Main Pages',
      links: [
        { href: '/', label: 'Home', description: 'Welcome to WhiteHatLink' },
        { href: '/services', label: 'Services', description: 'Our link building services' },
        { href: '/pricing', label: 'Pricing', description: 'Transparent pricing plans' },
        { href: '/inventory', label: 'Inventory', description: 'Browse available sites' },
        { href: '/about', label: 'About', description: 'Learn about our team' },
        { href: '/contact', label: 'Contact', description: 'Get in touch with us' },
        { href: '/faq', label: 'FAQ', description: 'Frequently asked questions' },
      ],
    },
    {
      title: 'Niches',
      links: niches.map((niche) => ({
        href: `/niches/${niche.slug}`,
        label: niche.name,
        description: niche.description,
      })),
    },
    {
      title: 'Legal',
      links: [
        { href: '/privacy', label: 'Privacy Policy', description: 'How we handle your data' },
        { href: '/terms', label: 'Terms of Service', description: 'Terms and conditions' },
      ],
    },
  ]

  return (
    <div className="container py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide">Navigation</p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mt-2 mb-4">
            Sitemap
          </h1>
          <p className="text-lg text-muted-foreground">
            Complete overview of all pages and content on WhiteHatLink.
          </p>
        </div>

        <div className="space-y-12">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">
                {section.title}
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex flex-col p-4 rounded-lg border bg-white hover:border-primary/50 hover:shadow-sm transition-all"
                    >
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {link.label}
                      </span>
                      {link.description && (
                        <span className="text-sm text-muted-foreground mt-1">
                          {link.description}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">
              Blog Articles
              <span className="ml-2 text-base font-normal text-muted-foreground">
                ({posts.length} {posts.length === 1 ? 'article' : 'articles'})
              </span>
            </h2>
            {posts.length > 0 ? (
              <ul className="space-y-3">
                {posts.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group flex items-start justify-between p-4 rounded-lg border bg-white hover:border-primary/50 hover:shadow-sm transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors block">
                          {post.title}
                        </span>
                        {post.metaDescription && (
                          <span className="text-sm text-muted-foreground mt-1 line-clamp-1 block">
                            {post.metaDescription}
                          </span>
                        )}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground ml-4 shrink-0">
                        {post.publishedDate
                          ? new Date(post.publishedDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'Draft'}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 rounded-lg border bg-secondary/30 text-center">
                <p className="text-muted-foreground">
                  No blog articles yet. Check back soon!
                </p>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">
              XML Sitemap
            </h2>
            <div className="p-6 rounded-lg border bg-secondary/30">
              <p className="text-muted-foreground mb-4">
                For search engines and SEO tools, our XML sitemap is available at:
              </p>
              <Link
                href="/sitemap.xml"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                whitehatlink.org/sitemap.xml
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
