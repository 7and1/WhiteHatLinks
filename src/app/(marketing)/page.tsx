import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { BreadcrumbSchema, FAQSchema } from '@/components/seo'
import { CheckCircle, Shield, TrendingUp, Users, Zap, Target } from 'lucide-react'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Premium Backlinks Without Spam | White Hat Link Building',
  description:
    'Buy vetted, high-authority backlinks with transparent metrics. No PBNs, no footprints. Guest posts and link insertions on real sites with real traffic.',
  alternates: {
    canonical: 'https://whitehatlinks.io',
  },
  openGraph: {
    title: 'WhiteHatLinks | Premium Backlinks Without Spam',
    description:
      'Buy vetted, high-authority backlinks with transparent metrics. No PBNs, no footprints.',
    url: 'https://whitehatlinks.io',
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
      'WhiteHatLinks is a premium backlink acquisition service. We provide vetted, high-authority guest posts and link insertions on real websites with genuine traffic.',
  },
  {
    question: 'How do you vet the sites?',
    answer:
      'Every site goes through our 12-point vetting process including traffic verification, spam score check, content quality review, and link profile analysis.',
  },
  {
    question: 'What metrics do you show before purchase?',
    answer:
      'You see Domain Rating (DR), estimated organic traffic, niche category, region, and price. The actual domain is revealed after qualifying to protect publisher relationships.',
  },
]

export default async function HomePage() {
  const payload = await getPayloadHMR({ config: configPromise })

  const { docs: recent } = await payload.find({
    collection: 'inventory',
    where: { status: { equals: 'Available' } },
    limit: 3,
    sort: '-createdAt',
  })

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', url: 'https://whitehatlinks.io' }]} />
      <FAQSchema faqs={homepageFaqs} />

      <div className="container py-20 flex flex-col gap-24">
        {/* Hero Section */}
        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold text-primary">
              Premium Links, No Spam
            </span>
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl text-foreground">
              Authority backlinks your brand is proud to show.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Curated guest posts and link insertions on real sites with traffic, vetted by humans.
              No PBNs, no footprints, no risk.
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

        {/* Features Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why SEO teams choose WhiteHatLinks
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We built the link building service we wished existed: transparent, safe, and effective.
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

        {/* CTA Section */}
        <section className="rounded-2xl border bg-gradient-to-r from-primary/10 via-white to-white p-10 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                See the inventory. Ask for the URL after you qualify.
              </h2>
              <p className="mt-4 max-w-xl text-muted-foreground">
                We keep domains private to protect publisher relationships. Qualify via the table
                filters and request a slot. We reply within 12 hours.
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
