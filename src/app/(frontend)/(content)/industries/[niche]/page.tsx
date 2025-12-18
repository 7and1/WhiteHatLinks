import type { Metadata } from 'next'
import Link from 'next/link'
import { InventoryTable } from '@/components/inventory/Table'
import { BreadcrumbSchema, FAQSchema } from '@/components/seo'
import { notFound } from 'next/navigation'
import { getIndustryData, getAllIndustries } from '@/data/industries'
import { CheckCircle, AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react'
import { getInventory, getInventoryCount, getInventoryNiches, getInventoryRegions } from '@/lib/inventory-source'

// Force dynamic rendering - needs live D1 data
export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ niche: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { niche } = await params
  const industry = getIndustryData(niche)

  if (!industry) {
    return {
      title: 'Industry Not Found',
    }
  }

  return {
    title: industry.title,
    description: industry.metaDescription,
    alternates: {
      canonical: `https://whitehatlink.org/industries/${industry.slug}`,
    },
    openGraph: {
      title: `${industry.title} | WhiteHatLinks`,
      description: industry.metaDescription,
      url: `https://whitehatlink.org/industries/${industry.slug}`,
    },
  }
}

export default async function IndustryPage({ params }: PageProps) {
  const { niche } = await params
  const industry = getIndustryData(niche)

  if (!industry) {
    return notFound()
  }

  const nicheFilter = { niche: industry.name }
  const [items, totalCount, niches, regions] = await Promise.all([
    getInventory({ ...nicheFilter, limit: 50, sort: 'dr' }),
    getInventoryCount(nicheFilter),
    getInventoryNiches(20),
    getInventoryRegions(),
  ])

  // Generate FAQ schema from challenges
  const industryFaqs = [
    {
      question: `Why is ${industry.name} link building challenging?`,
      answer: industry.challenges.join(' '),
    },
    {
      question: `What makes WhiteHatLinks different for ${industry.name}?`,
      answer: industry.benefits.join(' '),
    },
    {
      question: `How many ${industry.name} sites do you have?`,
      answer: `We currently have ${items.length} ${industry.name} sites in our active inventory, with new sites added regularly.`,
    },
  ]

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://whitehatlink.org' },
          { name: `${industry.name} Link Building`, url: `https://whitehatlink.org/industries/${industry.slug}` },
        ]}
      />
      <FAQSchema faqs={industryFaqs} />

      <div className="container py-16">
        {/* Hero */}
        <div className="max-w-3xl mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide">
            {industry.name} Link Building
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mt-2">
            {industry.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{industry.content.intro}</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-12">
          {industry.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border bg-white p-6 shadow-sm text-center"
            >
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Inventory */}
        {items.length > 0 ? (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Available {industry.name} Sites
              </h2>
              <Link
                href="/inventory"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                View all inventory <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <InventoryTable
              initialData={items}
              totalCount={totalCount}
              availableNiches={niches}
              availableRegions={regions}
            />
          </div>
        ) : (
          <div className="mb-16 rounded-xl border bg-secondary/50 p-8 text-center">
            <p className="text-muted-foreground">
              No {industry.name} sites currently available. New inventory is added regularly.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-white font-semibold hover:bg-primary/90 transition-colors"
            >
              Request {industry.name} sites
            </Link>
          </div>
        )}

        {/* Content Sections */}
        <div className="grid gap-12 lg:grid-cols-2 mb-16">
          {/* Challenges */}
          <div className="rounded-xl border bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-full bg-orange-100 p-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                Why {industry.name} link building is hard
              </h2>
            </div>
            <p className="text-muted-foreground mb-6">{industry.content.whyHard}</p>
            <ul className="space-y-3">
              {industry.challenges.map((challenge) => (
                <li key={challenge} className="flex items-start gap-2 text-sm">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                  <span className="text-muted-foreground">{challenge}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solution */}
          <div className="rounded-xl border bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-full bg-primary/10 p-2">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Our {industry.name} approach</h2>
            </div>
            <p className="text-muted-foreground mb-6">{industry.content.solution}</p>
            <ul className="space-y-3">
              {industry.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Other Industries */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-foreground mb-6">Other industries we serve</h2>
          <div className="grid gap-3 md:grid-cols-5">
            {getAllIndustries()
              .filter((i) => i.slug !== industry.slug)
              .map((ind) => (
                <Link
                  key={ind.slug}
                  href={`/industries/${ind.slug}`}
                  className="rounded-lg border bg-white p-4 text-center font-medium text-foreground hover:border-primary hover:shadow-sm transition-all"
                >
                  {ind.name}
                </Link>
              ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-white to-white border p-10 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to build {industry.name} backlinks?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Get a custom quote for your {industry.name} link building campaign.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-md bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 transition-colors"
            >
              Get a quote
            </Link>
            <Link
              href="/inventory"
              className="rounded-md border px-6 py-3 font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              Browse all inventory
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export async function generateStaticParams() {
  return getAllIndustries().map((industry) => ({
    niche: industry.slug,
  }))
}
