import { InventoryTable } from '@/components/inventory/Table'
import { ProductSchema } from '@/components/seo/Schema'
import { BreadcrumbSchema } from '@/components/seo'
import { getInventory, getInventoryCount, getInventoryNiches, getInventoryRegions } from '@/lib/inventory-source'
import type { Metadata } from 'next'

// Force dynamic rendering - database may not be available during build
export const dynamic = 'force-dynamic'

// ISR: Revalidate every 10 minutes (600 seconds)
export const revalidate = 600

export const metadata: Metadata = {
  title: 'Premium Backlink Inventory - 16,000+ High DR Guest Post Sites | WhiteHatLinks',
  description:
    'Browse 16,000+ vetted high-authority backlink sites. Real traffic data, transparent DR metrics, filter by niche and price. Guest posts and link insertions. No spam, no PBNs.',
  alternates: {
    canonical: 'https://whitehatlink.org/inventory',
  },
  openGraph: {
    title: 'Premium Backlink Inventory - 16,000+ High DR Sites | WhiteHatLinks',
    description: 'Browse 16,000+ vetted guest post sites. Real traffic, transparent DR metrics, instant availability.',
    url: 'https://whitehatlink.org/inventory',
  },
}

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams

  // Parse all filter parameters
  const filters = {
    niche: typeof params.niche === 'string' ? params.niche : undefined,
    minDr: typeof params.min_dr === 'string' ? parseInt(params.min_dr) : undefined,
    maxPrice: typeof params.max_price === 'string' ? parseInt(params.max_price) : undefined,
    maxSpamScore: typeof params.max_spam === 'string' ? parseInt(params.max_spam) : undefined,
    minTraffic: typeof params.min_traffic === 'string' ? parseInt(params.min_traffic) : undefined,
    googleNewsOnly: params.google_news === 'true',
    linkType: params.link_type === 'Dofollow' || params.link_type === 'Nofollow' ? params.link_type as 'Dofollow' | 'Nofollow' : undefined,
    region: typeof params.region === 'string' ? params.region : undefined,
    sort: (params.sort as 'dr' | 'traffic' | 'price' | 'recent') || 'dr',
  }

  // Load data in parallel
  const [items, totalCount, niches, regions] = await Promise.all([
    getInventory({ ...filters, limit: 500 }),
    getInventoryCount(filters),
    getInventoryNiches(20),
    getInventoryRegions(),
  ])

  const lastUpdated = items.find((i) => i.createdAt)?.createdAt || new Date().toISOString()

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://whitehatlink.org' },
          { name: 'Inventory', url: 'https://whitehatlink.org/inventory' },
        ]}
      />
      <ProductSchema items={items} />

      <div className="container py-20 mx-auto px-4">
        {/* Hero Section */}
        <div className="mb-8 text-center max-w-4xl mx-auto">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide">Inventory</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mt-2 mb-4">
            Premium Backlink Inventory
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            We have {totalCount.toLocaleString()} vetted sites with real traffic and transparent metrics for you to browse.
            {filters.niche && (
              <span className="font-semibold text-primary"> Filtered by: {filters.niche}</span>
            )}
          </p>
          <div className="text-sm text-muted-foreground">
            Last updated:{' '}
            <time dateTime={lastUpdated}>
              {new Date(lastUpdated).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        </div>

        {/* Main Table - Core Content First */}
        <InventoryTable
          initialData={items}
          totalCount={totalCount}
          availableNiches={niches}
          availableRegions={regions}
        />

        {/* Educational Content Below the Table */}
        <div className="mt-20 max-w-4xl mx-auto">
          {/* Understanding Metrics */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Understanding the Numbers</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">What is DR? (Domain Rating)</h3>
                <p className="text-muted-foreground mb-3">
                  Think of DR as a report card for websites. It's a score from 0 to 100. Higher is
                  better. DR shows how strong a website's backlink profile is.
                </p>
                <p className="text-muted-foreground">
                  Here's what the numbers mean:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1 ml-4">
                  <li><strong>DR 30-40:</strong> Good starting point. Solid sites.</li>
                  <li><strong>DR 40-60:</strong> Strong authority. These sites have power.</li>
                  <li><strong>DR 60-80:</strong> Very strong. These links move the needle.</li>
                  <li><strong>DR 80+:</strong> Elite sites. Hard to get. Worth the price.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Monthly Traffic</h3>
                <p className="text-muted-foreground mb-3">
                  This is how many people visit the site each month. We pull this from Ahrefs and
                  Semrush. It's organic traffic - people finding the site through Google.
                </p>
                <p className="text-muted-foreground">
                  Why it matters: Real traffic means real people see your link. No traffic means
                  you're buying a link on a ghost town. We don't list sites with zero traffic.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Price</h3>
                <p className="text-muted-foreground">
                  Prices include our 2× markup. That's industry standard for link agencies. We're
                  transparent about it. Higher DR sites cost more because they're harder to get and
                  they work better. You get what you pay for.
                </p>
              </div>
            </div>
          </div>

          {/* Selection Guide */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">How to Choose the Right Sites</h2>

            <p className="text-muted-foreground mb-4">
              Don't just buy high DR sites. That's not how this works. Here's what smart buyers do:
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">1. Match Your Niche</h3>
                <p className="text-muted-foreground">
                  Buy links from sites in your industry. Selling software? Get links from tech sites.
                  Running a health blog? Get health and wellness links. Google is smart. Relevant
                  links work better.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">2. Check the Traffic</h3>
                <p className="text-muted-foreground">
                  A DR 50 site with 10K monthly visitors beats a DR 60 site with 100 visitors. Always.
                  Traffic means people will actually see your link. That's the point.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">3. Mix Your DR Levels</h3>
                <p className="text-muted-foreground">
                  Don't buy only DR 70+ sites. That looks weird to Google. Mix it up. Get some DR
                  40s, some DR 50s, and a few high-authority sites. That's a natural link profile.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">4. Start Small</h3>
                <p className="text-muted-foreground">
                  New to link building? Start with 3-5 links. See what works. Check your rankings
                  after 2-3 weeks. Then buy more. Don't blow your whole budget on day one.
                </p>
              </div>
            </div>
          </div>

          {/* Vetting Process */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Our Vetting Process</h2>

            <p className="text-muted-foreground mb-4">
              We check every site before it goes in our inventory. Here's what we look for:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">Quality Checks</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Real organic traffic from Google</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Clean backlink profile (no spam)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Regular content updates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>No Google penalties</span>
                  </li>
                </ul>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">What We Reject</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2">✗</span>
                    <span>PBN sites (private blog networks)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✗</span>
                    <span>Sites with zero traffic</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✗</span>
                    <span>Spam-heavy link profiles</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✗</span>
                    <span>Sites that haven't posted in months</span>
                  </li>
                </ul>
              </div>
            </div>

            <p className="text-muted-foreground mt-6">
              We use Ahrefs, Semrush, and Moz to verify all metrics. If a site's numbers look fishy,
              we don't list it. Simple as that.
            </p>
          </div>

          {/* Trust Signals */}
          <div className="mb-12 bg-muted/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Why Trust Us?</h2>

            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong>Full Transparency:</strong> We show you exact DR and traffic numbers. No
                ranges. No hiding data.
              </p>
              <p>
                <strong>Real Metrics:</strong> All data pulled from Ahrefs and Semrush. Updated
                monthly. Not made up numbers.
              </p>
              <p>
                <strong>Hand-Vetted:</strong> A human checks every site. We don't auto-approve
                anything. Quality over quantity.
              </p>
              <p>
                <strong>No Spam:</strong> We reject 80% of sites that publishers submit to us. If it
                doesn't meet our standards, it doesn't get listed.
              </p>
              <p>
                <strong>Fair Pricing:</strong> You see the markup. No hidden fees. No surprise
                charges. What you see is what you pay.
              </p>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-3">Need Help Choosing?</h2>
            <p className="text-muted-foreground mb-6">
              Not sure which sites to pick? We get it. Link building can be confusing. Contact us and
              we'll help you build a strategy that works for your budget and goals.
            </p>
            <p className="text-sm text-muted-foreground">
              We respond in under 4 hours during business days.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
