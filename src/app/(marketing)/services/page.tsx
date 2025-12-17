import type { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbSchema, ServiceSchema, FAQSchema } from '@/components/seo'
import {
  FileText,
  Link2,
  Megaphone,
  CheckCircle,
  ArrowRight,
  Shield,
  Clock,
  Target,
} from 'lucide-react'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Link Building Services - Guest Posts, Link Insertions & Digital PR',
  description:
    'Professional link building services including guest posts, link insertions, and digital PR. Manual outreach, quality-guaranteed placements.',
  alternates: {
    canonical: 'https://whitehatlinks.io/services',
  },
  openGraph: {
    title: 'Link Building Services | WhiteHatLinks',
    description: 'Guest posts, link insertions, and digital PR with quality guarantees.',
    url: 'https://whitehatlinks.io/services',
  },
}

const services = [
  {
    id: 'guest-posts',
    icon: FileText,
    title: 'Guest Posts',
    tagline: 'Full-service content & placement',
    description:
      'Done-for-you guest posting with custom content creation, outreach, and publication on vetted domains. You provide the target URL and anchor text preferences; we handle everything else.',
    features: [
      'Custom content written by native English speakers',
      'Niche-relevant placements on traffic-verified sites',
      'Permanent do-follow links',
      'DR 30-80+ options available',
      'Full tracking and reporting',
    ],
    process: [
      'You select sites from our inventory',
      'We pitch and secure the placement',
      'Our writers create the content',
      'Publisher reviews and publishes',
      'You receive live URL confirmation',
    ],
    turnaround: '2-4 weeks typical',
  },
  {
    id: 'link-insertions',
    icon: Link2,
    title: 'Link Insertions',
    tagline: 'Links in existing content',
    description:
      'Contextual links added to already-indexed, aged content. Faster than guest posts and often more natural-looking since the content already exists and ranks.',
    features: [
      'Links from indexed, aged content',
      'Natural contextual integration',
      'Faster turnaround than guest posts',
      'Real editorial placements',
      'Traffic-verified sites only',
    ],
    process: [
      'You provide target URL and anchor',
      'We identify suitable existing content',
      'We negotiate the insertion',
      'Publisher adds your link contextually',
      'You receive confirmation and screenshot',
    ],
    turnaround: '1-2 weeks typical',
  },
  {
    id: 'digital-pr',
    icon: Megaphone,
    title: 'Digital PR Sprints',
    tagline: 'Press coverage & editorial links',
    description:
      'Story-driven campaigns that earn coverage on news sites and industry publications. Higher-authority links with brand exposure benefits beyond SEO.',
    features: [
      'Custom story angle development',
      'Journalist outreach campaigns',
      'Press coverage on news sites',
      'Brand mention monitoring',
      'Monthly campaign reporting',
    ],
    process: [
      'Discovery call to understand your brand',
      'Story angle and data asset creation',
      'Targeted journalist outreach',
      'Coverage tracking and follow-ups',
      'Monthly performance reports',
    ],
    turnaround: '4-6 weeks for first placements',
  },
]

const servicesFaqs = [
  {
    question: 'Which service is best for my needs?',
    answer:
      'Guest posts are ideal for most link building campaigns—you get full control over the content and placement. Link insertions work well for quick wins and adding links to already-ranking content. Digital PR is best for brands seeking high-authority press coverage and brand visibility beyond just links.',
  },
  {
    question: 'Can I combine multiple services?',
    answer:
      'Absolutely. Many clients use a mix of guest posts for their main link building and link insertions for opportunistic placements. We can create a custom package based on your goals and budget.',
  },
  {
    question: 'Do you offer retainer packages?',
    answer:
      'Yes, we offer monthly retainer packages for clients who need ongoing link building. Retainer clients get priority access to new inventory and volume pricing.',
  },
]

const processSteps = [
  {
    step: 1,
    title: 'Discovery',
    description: 'We learn about your niche, goals, and target metrics.',
  },
  {
    step: 2,
    title: 'Selection',
    description: 'You browse and select sites from our vetted inventory.',
  },
  {
    step: 3,
    title: 'Outreach',
    description: 'We secure the placement with the publisher.',
  },
  {
    step: 4,
    title: 'Creation',
    description: 'Content is written and approved by the publisher.',
  },
  {
    step: 5,
    title: 'Delivery',
    description: 'You receive the live URL with full tracking details.',
  },
]

const guarantees = [
  {
    icon: Shield,
    title: 'Quality Guarantee',
    description: 'Links stay live or we replace them free of charge.',
  },
  {
    icon: Clock,
    title: 'Response Time',
    description: 'We respond to all inquiries within 12 hours.',
  },
  {
    icon: Target,
    title: 'Relevance Match',
    description: 'Every placement is niche-matched for maximum value.',
  },
]

const servicesForSchema = services.map((s) => ({
  name: s.title,
  description: s.description,
  url: `https://whitehatlinks.io/services#${s.id}`,
}))

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://whitehatlinks.io' },
          { name: 'Services', url: 'https://whitehatlinks.io/services' },
        ]}
      />
      <ServiceSchema services={servicesForSchema} />
      <FAQSchema faqs={servicesFaqs} />

      <div className="container py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide">Services</p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mt-2">
            Link building that moves the needle
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            All services run on the same safety standard: manual vetting, topical relevance, and
            traffic-first placement. Choose the approach that fits your goals.
          </p>
        </div>

        {/* Services Detail */}
        <div className="space-y-16 mb-20">
          {services.map((service, index) => (
            <div
              key={service.id}
              id={service.id}
              className={`grid gap-8 lg:grid-cols-2 items-start ${
                index % 2 !== 0 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className={index % 2 !== 0 ? 'lg:order-2' : ''}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{service.title}</h2>
                    <p className="text-sm text-primary">{service.tagline}</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6">{service.description}</p>

                <h3 className="font-semibold text-foreground mb-3">What&apos;s included:</h3>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Typical turnaround:</span>{' '}
                  {service.turnaround}
                </p>
              </div>

              <div
                className={`rounded-xl border bg-white p-6 shadow-sm ${
                  index % 2 !== 0 ? 'lg:order-1' : ''
                }`}
              >
                <h3 className="font-semibold text-foreground mb-4">How it works:</h3>
                <ol className="space-y-4">
                  {service.process.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                        {stepIndex + 1}
                      </div>
                      <span className="text-sm text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
                <Link
                  href="/contact"
                  className="mt-6 w-full flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-white font-semibold hover:bg-primary/90 transition-colors"
                >
                  Get a quote for {service.title}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Our Process Overview */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">
            Our 5-Step Process
          </h2>
          <div className="grid gap-4 md:grid-cols-5">
            {processSteps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-white text-xl font-bold flex items-center justify-center mx-auto mb-3">
                  {step.step}
                </div>
                <h3 className="font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Guarantees */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">Our Guarantees</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {guarantees.map((guarantee) => (
              <div
                key={guarantee.title}
                className="text-center p-6 rounded-xl border bg-white shadow-sm"
              >
                <div className="rounded-full bg-primary/10 p-4 w-fit mx-auto mb-4">
                  <guarantee.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{guarantee.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{guarantee.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">
            Services FAQ
          </h2>
          <div className="space-y-4">
            {servicesFaqs.map((faq) => (
              <div key={faq.question} className="rounded-lg border bg-white p-6">
                <h3 className="font-semibold text-foreground">{faq.question}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-white to-white border p-10 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to build quality backlinks?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Browse our live inventory or contact us for a custom proposal.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/inventory"
              className="rounded-md bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 transition-colors"
            >
              View inventory
            </Link>
            <Link
              href="/contact"
              className="rounded-md border px-6 py-3 font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              Get a custom quote
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
