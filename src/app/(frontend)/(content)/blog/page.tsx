import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { BreadcrumbSchema } from '@/components/seo'

// Force dynamic rendering - database may not be available during build
export const dynamic = 'force-dynamic'

// ISR: Revalidate every 1 hour (3600 seconds) when deployed
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Link Building Blog - Real Strategies, Case Studies & Expert Insights',
  description:
    'Learn proven link building strategies from real campaigns. Get actionable playbooks, case studies, and expert insights on white-hat SEO link acquisition. No fluff, just results.',
  alternates: {
    canonical: 'https://whitehatlink.org/blog',
  },
  openGraph: {
    title: 'Link Building Blog - Expert SEO Strategies & Real Case Studies',
    description: 'Actionable link building insights from campaigns that actually worked. Case studies, playbooks, and proven strategies.',
    url: 'https://whitehatlink.org/blog',
  },
}

export default async function BlogListPage() {
  let docs = []
  let error = null

  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'posts',
      limit: 20,
      sort: '-publishedDate',
    })
    docs = result.docs
  } catch (err) {
    console.error('Failed to load blog posts:', err)
    error = err
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://whitehatlink.org' },
          { name: 'Blog', url: 'https://whitehatlink.org/blog' },
        ]}
      />

      <div className="container py-16">
        <div className="mb-16 max-w-4xl">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide">Blog</p>
          <h1 className="text-5xl font-bold tracking-tight text-foreground mt-2 mb-8">
            Link Building Blog
          </h1>

          {/* Introduction Section */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-xl text-foreground leading-relaxed">
              Link building is hard. Really hard. Most guides make it sound easy. They lie.
            </p>
            <p className="text-lg text-muted-foreground mt-4 leading-relaxed">
              This blog is different. We share what actually works. No theory. No fluff. Just real campaigns. Real results. Real problems we solved.
            </p>
            <p className="text-lg text-muted-foreground mt-4 leading-relaxed">
              Think of this as your shortcut. We spent years testing everything. We made every mistake so you don't have to. Now we're showing you the path that works.
            </p>
          </div>

          {/* What You'll Learn Section */}
          <div className="mb-12 bg-secondary/30 rounded-xl p-8 border">
            <h2 className="text-2xl font-bold text-foreground mb-6">What You'll Learn Here</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>How to Build Links That Last</span>
                </h3>
                <p className="text-muted-foreground ml-6">
                  Safe, white-hat strategies that won't get you penalized. We focus on quality, not shortcuts. Your rankings matter too much to gamble.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Real Campaign Breakdowns</span>
                </h3>
                <p className="text-muted-foreground ml-6">
                  See exactly what we did. Step by step. No secrets. We show you the actual emails, the outreach templates, the results. Everything.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Avoid Expensive Mistakes</span>
                </h3>
                <p className="text-muted-foreground ml-6">
                  We wasted money on bad links. We got penalized. We learned the hard way. Learn from our mistakes instead of making your own.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Industry-Specific Tactics</span>
                </h3>
                <p className="text-muted-foreground ml-6">
                  What works for SaaS won't work for local business. We break it down by niche. Find the playbook that fits your market.
                </p>
              </div>
            </div>
          </div>

          {/* Topics Covered */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Topics We Cover</h2>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">Guest Posting</span>
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">Niche Edits</span>
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">Content Strategy</span>
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">Outreach Templates</span>
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">Link Quality Analysis</span>
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">SEO Case Studies</span>
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">Domain Metrics</span>
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">Penalty Recovery</span>
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">Local SEO Links</span>
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">E-commerce Link Building</span>
            </div>
          </div>

          {/* Latest Articles Header */}
          <div className="pt-2">
            <div className="text-2xl font-bold text-foreground mb-2">Latest Articles</div>
            <p className="text-muted-foreground">
              Fresh insights from our latest campaigns. Updated regularly with new strategies and case studies.
            </p>
          </div>
        </div>

        {error ? (
          <div className="mt-8 rounded-xl border bg-red-50 p-12 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-4">Unable to Load Articles</h2>
            <p className="text-red-600 mb-6">
              We&apos;re having trouble loading our blog posts. Please try again later or contact our support team.
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
        ) : docs.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {docs.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group h-full rounded-xl border bg-white p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all"
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
                <div className="mt-4 text-sm font-medium text-primary">
                  Read article →
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-xl border bg-secondary/50 p-12 text-center">
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

        {/* Expertise Section */}
        <div className="mt-16 mb-12 max-w-4xl border-l-4 border-primary pl-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Who Writes This</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            We're a team of SEO specialists who've been in the trenches for over a decade. We've built links for Fortune 500 companies, scrappy startups, and everything in between.
          </p>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Our writers have managed million-dollar link building budgets. They've recovered sites from Google penalties. They've scaled campaigns from zero to thousands of quality backlinks.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Every article here comes from real experience. Not from reading other blogs. From actually doing the work. Making the pitches. Building the relationships. Getting the results.
          </p>
        </div>

        {/* Why Trust Us */}
        <div className="mb-12 max-w-4xl bg-primary/5 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Why Trust Us</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="text-primary font-bold mr-3 text-xl">•</span>
              <div>
                <strong className="text-foreground">We Practice What We Preach:</strong>
                <span className="text-muted-foreground"> Every strategy here is tested on our own sites first. If it doesn't work for us, we won't recommend it to you.</span>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-3 text-xl">•</span>
              <div>
                <strong className="text-foreground">Data-Driven Approach:</strong>
                <span className="text-muted-foreground"> We track everything. Rankings, traffic, conversions. Every recommendation is backed by real numbers, not gut feelings.</span>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-3 text-xl">•</span>
              <div>
                <strong className="text-foreground">No BS Policy:</strong>
                <span className="text-muted-foreground"> If something doesn't work, we'll tell you. If we screwed up, we'll share it. Honesty matters more than looking perfect.</span>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-3 text-xl">•</span>
              <div>
                <strong className="text-foreground">Google Guidelines First:</strong>
                <span className="text-muted-foreground"> We only teach white-hat methods. Your site's reputation is too valuable to risk with sketchy tactics.</span>
              </div>
            </li>
          </ul>
        </div>

        {/* How to Use This Blog */}
        <div className="max-w-4xl mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">How to Use This Blog</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Don't just read. Apply. Pick one article. Follow the steps. Track your results. Then come back for the next one.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border rounded-lg p-6">
              <div className="text-3xl font-bold text-primary mb-3">1</div>
              <h3 className="font-semibold text-foreground mb-2">Start Simple</h3>
              <p className="text-sm text-muted-foreground">
                New to link building? Read our beginner guides first. Build your foundation before trying advanced tactics.
              </p>
            </div>
            <div className="bg-white border rounded-lg p-6">
              <div className="text-3xl font-bold text-primary mb-3">2</div>
              <h3 className="font-semibold text-foreground mb-2">Pick Your Niche</h3>
              <p className="text-sm text-muted-foreground">
                Find articles tagged for your industry. What works for SaaS won't work for local plumbers. Context matters.
              </p>
            </div>
            <div className="bg-white border rounded-lg p-6">
              <div className="text-3xl font-bold text-primary mb-3">3</div>
              <h3 className="font-semibold text-foreground mb-2">Take Action</h3>
              <p className="text-sm text-muted-foreground">
                Reading won't build links. Implementation will. Use our templates, follow our process, get results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
