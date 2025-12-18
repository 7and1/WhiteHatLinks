import type { Metadata } from 'next'
import Link from 'next/link'
import { getInventory } from '@/lib/inventory-source'
import { BreadcrumbSchema, FAQSchema } from '@/components/seo'
import { CheckCircle, Shield, TrendingUp, Users, Zap, Target } from 'lucide-react'

// Force dynamic rendering - needs live D1 data
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Buy Quality Backlinks | Premium White Hat Link Building Service',
  description:
    'Buy quality backlinks from real websites with traffic. No spam, no PBNs. Vetted guest posts and link insertions. 10+ years SEO expertise. See metrics before you buy.',
  alternates: {
    canonical: 'https://whitehatlink.org',
  },
  openGraph: {
    title: 'Buy Quality Backlinks | WhiteHatLinks Premium Link Building',
    description:
      'Buy quality backlinks from real websites with traffic. No spam, no PBNs. Vetted guest posts and link insertions.',
    url: 'https://whitehatlink.org',
  },
}

const stats = [
  { value: '500+', label: 'Campaigns delivered safely' },
  { value: '90%', label: 'Acceptance rate on outreach' },
  { value: '0', label: 'PBNs or paid blog networks' },
]

const features = [
  {
    icon: Shield,
    title: 'Risk-free links',
    description:
      'Manual vetting, traffic checks, and relevance filters keep your backlink profile clean and penalty-free.',
  },
  {
    icon: TrendingUp,
    title: 'Transparent metrics',
    description:
      'See DR, traffic, and region before you buy. Domain revealed post-purchase to protect publisher relationships.',
  },
  {
    icon: Zap,
    title: 'Done-for-you outreach',
    description:
      'We handle pitching, content creation, and publication. You get live URLs with full tracking.',
  },
]

const benefits = [
  {
    icon: Target,
    title: 'Topical Relevance',
    description: 'Every placement is niche-matched to maximize link equity transfer.',
  },
  {
    icon: Users,
    title: 'Real Editorial Sites',
    description: 'No PBNs, no link farms. Only sites with genuine readership and editorial standards.',
  },
  {
    icon: CheckCircle,
    title: 'Quality Guarantee',
    description: 'Links stay live or we replace them. No questions asked.',
  },
]

const homepageFaqs = [
  {
    question: 'What is WhiteHatLinks?',
    answer:
      'WhiteHatLinks is a premium backlink acquisition service built by SEO experts with 10+ years of experience. We provide vetted, high-authority guest posts and link insertions on real websites with genuine traffic. No spam networks, no risky shortcuts.',
  },
  {
    question: 'How do you vet the sites?',
    answer:
      'Every site goes through our 12-point vetting process including traffic verification, spam score check, content quality review, and link profile analysis. We manually check each domain to ensure it meets our strict quality standards.',
  },
  {
    question: 'What metrics do you show before purchase?',
    answer:
      'You see Domain Rating (DR), estimated organic traffic, niche category, region, and price. The actual domain is revealed after qualifying to protect publisher relationships.',
  },
  {
    question: 'How long does it take to see results from backlinks?',
    answer:
      'Based on industry data, most link-building campaigns take about 3 months to show noticeable results. We focus on quality over quantity because 93.8% of successful SEO experts prioritize link quality.',
  },
  {
    question: 'Why should I buy backlinks instead of building them myself?',
    answer:
      'Cold outreach has only an 8.5% success rate. Our team has 10+ years of relationships and a 90% acceptance rate. We save you time and get better placements on higher-quality sites.',
  },
]

export default async function HomePage() {
  const recent = await getInventory({ limit: 3, sort: 'recent' })

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', url: 'https://whitehatlink.org' }]} />
      <FAQSchema faqs={homepageFaqs} />

      <div className="container py-20 flex flex-col gap-24">
        {/* Hero Section */}
        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold text-primary">
              Built by SEO Experts with 10+ Years Experience
            </span>
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl text-foreground">
              Buy Quality Backlinks That Actually Work
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Get backlinks from real websites with real traffic. No spam networks. No fake blogs.
              Just clean, white-hat links that help you rank. See all the metrics before you buy.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/inventory"
                className="rounded-md bg-primary px-6 py-3 text-white font-semibold shadow hover:bg-primary/90 transition-colors"
              >
                View Inventory
              </Link>
              <Link
                href="/about"
                className="rounded-md border border-border px-6 py-3 font-semibold text-foreground hover:bg-secondary transition-colors"
              >
                Why trust us?
              </Link>
            </div>
            <div className="flex gap-8 pt-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Fresh Inventory Card */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="font-semibold text-foreground">Fresh inventory</div>
              <Link className="text-sm text-primary hover:underline" href="/inventory">
                See all
              </Link>
            </div>
            <ul className="space-y-4">
              {recent.map((item) => (
                <li key={item.id} className="flex justify-between rounded-lg border px-4 py-3">
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      DR {item.dr} · {item.niche}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.traffic?.toLocaleString?.() ?? 'N/A'} est. traffic
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">${item.price}</div>
                    <div className="text-xs text-muted-foreground">
                      Region: {item.region ?? 'Global'}
                    </div>
                  </div>
                </li>
              ))}
              {recent.length === 0 && (
                <li className="text-sm text-muted-foreground py-4 text-center">
                  Inventory is being updated. Check back shortly.
                </li>
              )}
            </ul>
          </div>
        </section>

        {/* Educational Content Section */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Why Backlinks Matter for Your Website
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Here's the truth about SEO: backlinks are still the most important ranking factor.
              Google looks at who links to you. It's like votes of confidence. The more quality votes
              you have, the higher you rank.
            </p>
            <p>
              But here's the problem. 95% of all web pages have zero backlinks. Zero. Most content
              just sits there, invisible. Only 2.2% of pages get links from multiple websites. That's
              why you need a strategy.
            </p>
            <p>
              When you buy quality backlinks from WhiteHatLinks, you're working with experts who've
              done this for 10+ years. We know what works. We know what's safe. And we know how to get
              you results without risking penalties.
            </p>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-6">The Data Behind Link Building</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="text-3xl font-bold text-primary mb-2">3.8x</div>
              <p className="text-sm text-muted-foreground">
                Top-ranking pages have 3.8 times more backlinks than pages in positions 2-10.
                Quality links directly impact your rankings.
              </p>
            </div>
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="text-3xl font-bold text-primary mb-2">93.8%</div>
              <p className="text-sm text-muted-foreground">
                Of successful SEO experts prioritize link quality over quantity. We do too. Every
                link is manually vetted.
              </p>
            </div>
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="text-3xl font-bold text-primary mb-2">3 months</div>
              <p className="text-sm text-muted-foreground">
                Average time to see results from link building. SEO is a marathon, not a sprint. We
                help you build sustainable growth.
              </p>
            </div>
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="text-3xl font-bold text-primary mb-2">8.5%</div>
              <p className="text-sm text-muted-foreground">
                Success rate for cold outreach. Our team has a 90% acceptance rate because we have
                real relationships with publishers.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why SEO Teams Choose WhiteHatLinks
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We built the link building service we wished existed: transparent, safe, and effective.
              No games. No spam. Just results.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-xl border bg-white p-6 shadow-sm">
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
            How We Build Quality Backlinks
          </h2>
          <div className="space-y-6">
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-foreground mb-3">1. Manual Vetting</h3>
              <p className="text-muted-foreground">
                We check every website by hand. No automated junk. We verify traffic using real data,
                check spam scores, review content quality, and analyze link profiles. Sites with fake
                metrics don't make it into our inventory.
              </p>
            </div>
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-foreground mb-3">
                2. You See Metrics First
              </h3>
              <p className="text-muted-foreground">
                Browse our inventory. See Domain Rating, traffic estimates, niche, and price. All
                upfront. No surprises. The domain name stays hidden until you qualify to protect our
                publisher relationships.
              </p>
            </div>
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-foreground mb-3">
                3. We Do the Outreach
              </h3>
              <p className="text-muted-foreground">
                Our team handles everything. We pitch your content, write the article if needed, and
                get it published. You get a live URL with your backlink. That's it. Simple.
              </p>
            </div>
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-foreground mb-3">4. Quality Guarantee</h3>
              <p className="text-muted-foreground">
                If a link goes down, we replace it. No questions asked. We stand behind every
                placement because we only work with reliable publishers.
              </p>
            </div>
          </div>
        </section>

        {/* Expert Background Section */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Built by SEO Experts Who've Been There
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Our founder has been doing SEO for over 10 years. Started as an in-house marketer.
              Worked with agencies. Built and sold websites. Knows what works and what doesn't.
            </p>
            <p>
              The problem with most link building services? They cut corners. Use private blog
              networks. Spam your money site with low-quality links. Then you get hit with a penalty
              and your rankings tank.
            </p>
            <p>
              We built WhiteHatLinks because we were tired of that nonsense. Every link we sell is
              from a real website with real traffic. We show you the metrics. We do the work. You get
              clean backlinks that actually help you rank.
            </p>
            <p>
              Industry data shows that websites with 30-35 quality backlinks generate over 10,500
              visits per month. That's the power of good link building. And it's what we help you
              achieve.
            </p>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="grid gap-6 md:grid-cols-3">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="rounded-full bg-primary/10 p-3">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{benefit.description}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Industry Trends Section */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            What's Working in Link Building Right Now
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              The link building game is changing. In 2025, 73% of marketers believe backlinks
              influence AI search results like ChatGPT. Google is getting smarter. Spam doesn't work
              anymore.
            </p>
            <p>
              Here's what does work: Digital PR and guest posting on real editorial sites. That's our
              specialty. We get you placements on websites with genuine readership and editorial
              standards.
            </p>
            <p>
              Most businesses spend $1,000 to $5,000 per month on link building. But here's the
              thing: quality matters more than quantity. One link from a high-authority site beats
              100 links from spam blogs.
            </p>
            <p>
              Content over 3,000 words gets 3.5 times more backlinks than short articles. That's why
              we focus on creating valuable, in-depth content that people actually want to link to.
            </p>
          </div>
        </section>

        {/* Common Mistakes Section */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Mistakes People Make When Buying Backlinks
          </h2>
          <div className="space-y-6">
            <div className="rounded-xl border-l-4 border-l-red-500 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Buying from PBN Networks
              </h3>
              <p className="text-muted-foreground">
                Private Blog Networks are spam. Google can detect them. You'll get penalized. Not
                worth it. We only work with real editorial sites.
              </p>
            </div>
            <div className="rounded-xl border-l-4 border-l-red-500 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Focusing Only on Domain Rating
              </h3>
              <p className="text-muted-foreground">
                High DR doesn't mean anything if the site has zero traffic. We check both. DR plus
                real organic traffic equals quality.
              </p>
            </div>
            <div className="rounded-xl border-l-4 border-l-red-500 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Ignoring Niche Relevance
              </h3>
              <p className="text-muted-foreground">
                A link from a random website doesn't help much. Topical relevance matters. We match
                your site with publishers in your niche.
              </p>
            </div>
            <div className="rounded-xl border-l-4 border-l-red-500 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Building Links Too Fast
              </h3>
              <p className="text-muted-foreground">
                Getting 100 links in one week looks suspicious to Google. We help you build
                naturally over time. Sustainable growth is the goal.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="rounded-2xl border bg-gradient-to-r from-primary/10 via-white to-white p-10 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Ready to Buy Quality Backlinks?
              </h2>
              <p className="mt-4 max-w-xl text-muted-foreground">
                Browse our inventory. See all the metrics upfront. Choose the links that match your
                niche. We handle everything else. Domains are revealed after you qualify to protect
                our publisher relationships.
              </p>
              <div className="mt-6 flex gap-4">
                <Link
                  href="/inventory"
                  className="rounded-md bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 transition-colors"
                >
                  Browse Inventory
                </Link>
                <Link
                  href="/contact"
                  className="rounded-md border px-6 py-3 font-semibold text-foreground hover:bg-secondary transition-colors"
                >
                  Talk to us
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border bg-white px-4 py-3">
                <div className="text-sm font-semibold text-foreground">Case Study · SaaS</div>
                <p className="text-sm text-muted-foreground">
                  23 DR60+ links, +78% organic signups in 90 days.
                </p>
              </div>
              <div className="rounded-lg border bg-white px-4 py-3">
                <div className="text-sm font-semibold text-foreground">Case Study · Finance</div>
                <p className="text-sm text-muted-foreground">
                  12 placements on finance trades, +41% money-keyword lift.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Industries Section */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-4">Industries we serve</h2>
            <p className="text-muted-foreground">Niche-specific inventory across verticals</p>
          </div>
          <div className="grid gap-4 md:grid-cols-5">
            {['SaaS', 'Finance', 'Crypto', 'Health', 'Tech'].map((industry) => (
              <Link
                key={industry}
                href={`/industries/${industry.toLowerCase()}`}
                className="rounded-lg border bg-white p-4 text-center font-semibold text-foreground hover:border-primary hover:shadow-sm transition-all"
              >
                {industry}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
