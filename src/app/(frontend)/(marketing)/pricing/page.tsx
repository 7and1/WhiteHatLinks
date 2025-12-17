import type { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbSchema, FAQSchema } from '@/components/seo'
import { Check, Zap, Shield, TrendingUp, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pricing - Custom Link Building Quotes',
  description:
    'Get custom pricing for your link building campaign. Transparent metrics, flexible packages, and quality-guaranteed backlinks.',
  alternates: {
    canonical: 'https://whitehatlinks.io/pricing',
  },
  openGraph: {
    title: 'Pricing | WhiteHatLinks',
    description: 'Custom link building quotes tailored to your goals and budget.',
    url: 'https://whitehatlinks.io/pricing',
  },
}

const services = [
  {
    name: 'Guest Posts',
    description: 'Full-service guest posting with content creation and outreach',
    features: [
      'Custom content written by native speakers',
      'Niche-relevant placements',
      'Permanent do-follow links',
      'DR 30-80+ options available',
      'Traffic verification included',
    ],
    priceRange: 'Varies by DR & niche',
    popular: true,
  },
  {
    name: 'Link Insertions',
    description: 'Contextual links added to existing, indexed content',
    features: [
      'Faster turnaround than guest posts',
      'Links from aged, trusted content',
      'Natural anchor text integration',
      'Real editorial placements',
      'Traffic-verified sites only',
    ],
    priceRange: 'Varies by DR & niche',
    popular: false,
  },
  {
    name: 'Digital PR Sprints',
    description: 'Story-driven campaigns for high-authority press links',
    features: [
      'Custom story angle development',
      'Journalist outreach campaigns',
      'Press coverage tracking',
      'Brand mention monitoring',
      'Monthly reporting included',
    ],
    priceRange: 'Custom project pricing',
    popular: false,
  },
]

const pricingFaqs = [
  {
    question: 'Why don\'t you list specific prices?',
    answer:
      'Link pricing varies significantly based on Domain Rating, niche, traffic levels, and placement type. Rather than offering one-size-fits-all pricing, we provide custom quotes based on your specific goals and requirements.',
  },
  {
    question: 'What factors affect pricing?',
    answer:
      'The main factors are Domain Rating (DR), monthly organic traffic, niche competitiveness, and whether you need guest post content or link insertion. Higher DR sites with more traffic naturally command premium pricing.',
  },
  {
    question: 'Do you offer bulk discounts?',
    answer:
      'Yes, we offer volume pricing for clients who commit to monthly link building packages. Contact us to discuss your volume needs and we\'ll provide a custom proposal.',
  },
  {
    question: 'What\'s your payment process?',
    answer:
      'We invoice 50% upfront and 50% upon live link delivery. For ongoing partnerships, we can arrange monthly billing. We accept wire transfer and major credit cards.',
  },
]

const whyChooseUs = [
  {
    icon: Shield,
    title: 'Quality Guaranteed',
    description: 'Links stay live or we replace them free of charge.',
  },
  {
    icon: Zap,
    title: 'Fast Turnaround',
    description: 'Most links delivered within 2-4 weeks.',
  },
  {
    icon: TrendingUp,
    title: 'Transparent Metrics',
    description: 'Full DR, traffic, and niche data before purchase.',
  },
  {
    icon: Users,
    title: 'Dedicated Support',
    description: 'Direct communication with your account manager.',
  },
]

export default function PricingPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://whitehatlinks.io' },
          { name: 'Pricing', url: 'https://whitehatlinks.io/pricing' },
        ]}
      />
      <FAQSchema faqs={pricingFaqs} />

      <div className="container py-16">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide">Pricing</p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mt-2">
            Custom quotes for your link building goals
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Every campaign is different. We provide tailored pricing based on your target metrics,
            niche requirements, and volume needs.
          </p>
        </div>

        {/* Services */}
        <div className="grid gap-8 md:grid-cols-3 mb-20">
          {services.map((service) => (
            <div
              key={service.name}
              className={`relative rounded-xl border bg-white p-8 shadow-sm ${
                service.popular ? 'border-primary ring-2 ring-primary/20' : ''
              }`}
            >
              {service.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="text-xl font-bold text-foreground">{service.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
              <div className="mt-4 mb-6">
                <span className="text-sm font-medium text-primary">{service.priceRange}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className={`block w-full text-center rounded-md px-4 py-3 font-semibold transition-colors ${
                  service.popular
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'border text-foreground hover:bg-secondary'
                }`}
              >
                Get a quote
              </Link>
            </div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">
            What&apos;s included with every link
          </h2>
          <div className="grid gap-6 md:grid-cols-4">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="text-center">
                <div className="rounded-full bg-primary/10 p-4 w-fit mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">
            Pricing FAQ
          </h2>
          <div className="space-y-4">
            {pricingFaqs.map((faq) => (
              <div key={faq.question} className="rounded-lg border bg-white p-6">
                <h3 className="font-semibold text-foreground">{faq.question}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-white to-white border p-10 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            Tell us about your goals and we&apos;ll put together a custom proposal within 24 hours.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-md bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 transition-colors"
            >
              Get a custom quote
            </Link>
            <Link
              href="/inventory"
              className="rounded-md border px-6 py-3 font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              Browse inventory first
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
