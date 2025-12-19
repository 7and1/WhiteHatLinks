import type { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbSchema, FAQSchema } from '@/components/seo'
import { Check, Zap, Shield, TrendingUp, Users } from 'lucide-react'

// Revalidate every 24 hours
export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Link Building Pricing - Transparent Costs & ROI Calculator | WhiteHatLinks',
  description:
    'Transparent link building pricing explained. Quality links cost $300-$1,500. See what affects prices, ROI benchmarks, and budget recommendations by industry. No hidden fees.',
  alternates: {
    canonical: 'https://whitehatlink.org/pricing',
  },
  openGraph: {
    title: 'Link Building Pricing - Transparent Costs & ROI | WhiteHatLinks',
    description: 'Honest pricing for quality backlinks. See real costs, ROI data, and industry benchmarks.',
    url: 'https://whitehatlink.org/pricing',
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
  {
    question: 'How much should I budget per month?',
    answer:
      'We recommend budgeting $3,000-$15,000 per month for competitive campaigns. That gets you 5-30 quality links depending on your niche. Industries like legal or finance need more because good sites are pickier.',
  },
  {
    question: 'Are cheap links worth it?',
    answer:
      'No. Google ignores most cheap links. Only 7.6% of guest post opportunities meet quality standards. One good link beats 100 bad ones. We focus on the 7.6% that actually works.',
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
          { name: 'Home', url: 'https://whitehatlink.org' },
          { name: 'Pricing', url: 'https://whitehatlink.org/pricing' },
        ]}
      />
      <FAQSchema faqs={pricingFaqs} />

      <div className="container py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide">Pricing</p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mt-2">
            Link Building Pricing
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Real talk. No BS. Here&apos;s what links actually cost and why.
          </p>
        </div>

        {/* Services - Core Content First */}
        <div className="grid gap-8 md:grid-cols-3 mb-12">
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
        <div className="mb-12">
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
        <div className="max-w-3xl mx-auto mb-12">
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
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-white to-white border p-10 text-center mb-20">
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

        {/* Educational Content - Below the Core Content */}
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h2 className="text-3xl font-bold text-foreground mb-6">Why Link Building Costs What It Does</h2>

          <p className="text-muted-foreground leading-relaxed mb-4">
            Look. Most companies hide their pricing. They make you fill out forms and sit through sales calls. We think that&apos;s dumb.
          </p>

          <p className="text-muted-foreground leading-relaxed mb-4">
            Here&apos;s the truth about link building costs in 2026. The average quality backlink costs between $300 and $1,500. Yes, really. Some go as low as $50. Others hit $5,000. Why such a huge range? Because not all links are equal.
          </p>

          <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">The Industry Reality</h3>

          <p className="text-muted-foreground leading-relaxed mb-4">
            Industry data shows the average SEO pays $509 per link. Guest posts average $365. Digital PR links cost $1,250-$1,500 each. If someone offers you links for $20, run away. Google will ignore them or worse, penalize you.
          </p>

          <p className="text-muted-foreground leading-relaxed mb-4">
            Here&apos;s what most people don&apos;t get. Only 7.6% of guest post opportunities meet quality standards. That means 92.4% of what&apos;s out there is garbage. We spend our time finding and working with the 7.6% that actually moves the needle.
          </p>

          <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">What Affects Link Prices</h3>

          <div className="bg-secondary/30 rounded-lg p-6 my-6">
            <ul className="space-y-3 list-none pl-0">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-foreground">Domain Rating (DR):</strong>
                  <span className="text-muted-foreground"> A DR 30 site might cost $150. DR 70+ can be $1,000 or more. Higher authority passes more ranking power.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-foreground">Real Traffic:</strong>
                  <span className="text-muted-foreground"> Sites with 10,000+ monthly visitors cost more. Why? Because they&apos;re proven. Google trusts them. People actually read them.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-foreground">Niche Relevance:</strong>
                  <span className="text-muted-foreground"> Legal, finance, and healthcare sites charge 50-100% more. Their editorial standards are stricter. Link opportunities are rarer.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-foreground">Content Type:</strong>
                  <span className="text-muted-foreground"> Guest posts need original content. That costs more than link insertions. But they&apos;re also stronger signals to Google.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-foreground">Editorial Standards:</strong>
                  <span className="text-muted-foreground"> Good sites say no a lot. They review content. They care about their readers. That selectivity is exactly what makes them valuable.</span>
                </div>
              </li>
            </ul>
          </div>

          <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">Quality vs Quantity (This Matters)</h3>

          <p className="text-muted-foreground leading-relaxed mb-4">
            One link from The New York Times beats 1,000 links from random blogs. This isn&apos;t opinion. It&apos;s how Google works.
          </p>

          <p className="text-muted-foreground leading-relaxed mb-4">
            Google got smart. They ignore low-quality links. In some cases, they penalize sites with too many spammy backlinks. The Penguin algorithm update changed everything. Now it&apos;s about quality, not quantity.
          </p>

          <p className="text-muted-foreground leading-relaxed mb-4">
            Think about it. Would you rather have 100 links from sites nobody visits? Or 10 links from sites people actually read and Google actually trusts? The answer should be obvious.
          </p>

          <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">What You Should Budget</h3>

          <p className="text-muted-foreground leading-relaxed mb-4">
            Most competitive campaigns need $3,000 to $15,000 per month. That gets you 5-30 quality links depending on your targets. If you&apos;re in legal, finance, or another competitive niche, expect to be at the higher end.
          </p>

          <p className="text-muted-foreground leading-relaxed mb-4">
            The average minimum monthly budget to stay competitive in high-difficulty niches is $8,406. Sounds like a lot? Consider this: one good client from organic search can be worth $10,000 to $100,000 or more in lifetime value.
          </p>

          <div className="bg-secondary/30 rounded-lg p-6 my-6">
            <h4 className="font-bold text-foreground mb-3">Real Budget Examples by Industry</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li><strong className="text-foreground">E-commerce:</strong> $4,000-$8,000/month for 10-20 links from product review and shopping sites</li>
              <li><strong className="text-foreground">SaaS:</strong> $6,000-$12,000/month for 8-15 links from tech blogs and industry sites</li>
              <li><strong className="text-foreground">Legal:</strong> $8,000-$15,000/month for 5-10 links from high-authority legal and news sites</li>
              <li><strong className="text-foreground">Finance:</strong> $10,000-$20,000/month for 5-12 links from financial publications and trusted sources</li>
              <li><strong className="text-foreground">Healthcare:</strong> $7,000-$14,000/month for 6-12 links from medical and health authority sites</li>
            </ul>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-4">
            These are real numbers from real campaigns. Not made up. The gambling industry needs even bigger budgets. About 61% of SEOs say gambling requires the largest link building investment. Why? Competition is insane and good sites won&apos;t touch most gambling links.
          </p>

          <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">How Much of Your SEO Budget Goes to Links?</h3>

          <p className="text-muted-foreground leading-relaxed mb-4">
            Here&apos;s what the data shows. SEO agencies allocate about 32% of their total SEO budget to link building. In-house teams invest even more at 36% on average. That&apos;s roughly one third of everything you spend on SEO.
          </p>

          <p className="text-muted-foreground leading-relaxed mb-4">
            Why so much? Because links are still the number one ranking factor. You can have perfect on-page SEO. You can have the best content. But without quality backlinks, you won&apos;t rank for competitive keywords. It&apos;s that simple.
          </p>

          <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">The ROI Reality</h3>

          <p className="text-muted-foreground leading-relaxed mb-4">
            Let&apos;s do simple math. Say you invest $10,000 per month in link building for 6 months. That&apos;s $60,000 total. If that gets you ranking for keywords that bring 10 new clients per month, and each client is worth $5,000, you&apos;re making $50,000 per month.
          </p>

          <p className="text-muted-foreground leading-relaxed mb-4">
            Your investment pays for itself in less than 2 months. After that, it&apos;s pure profit. And those rankings keep working for you month after month, year after year. That&apos;s the power of SEO done right.
          </p>

          <p className="text-muted-foreground leading-relaxed mb-4">
            Compare that to paid ads. Stop paying, stop getting traffic. With SEO, you build an asset that compounds over time. The links you get today keep passing authority for years. The rankings you earn keep bringing customers long after the campaign ends.
          </p>

          <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">Our Pricing Philosophy</h3>

          <p className="text-muted-foreground leading-relaxed mb-4">
            We don&apos;t do package pricing. Every business is different. Your competitor might need links from tech blogs. You might need links from industry publications. Same price for both would be stupid.
          </p>

          <p className="text-muted-foreground leading-relaxed mb-4">
            Here&apos;s how we work. You tell us your goals and niche. We show you actual sites from our inventory with real metrics. You see the DR, traffic, niche relevance, everything. Then we give you a quote based on what you actually need.
          </p>

          <p className="text-muted-foreground leading-relaxed mb-4">
            No surprises. No hidden fees. Just transparent pricing based on the value you&apos;re getting. If a link costs $800, we show you why it&apos;s worth $800. If it&apos;s $200, same thing.
          </p>

          <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">Why Prices Keep Rising</h3>

          <p className="text-muted-foreground leading-relaxed mb-4">
            Backlinks are 241% more expensive than in 2021. Why? Demand increased. More companies understand SEO now. Good sites get more outreach requests. When everyone wants the same thing, prices go up. That&apos;s economics.
          </p>

          <p className="text-muted-foreground leading-relaxed mb-4">
            Plus, 80.9% of SEOs believe link building will get even more expensive over the next 2-3 years. Google keeps raising the bar for quality. Sites that used to link easily now have strict editorial policies. The supply of good links is shrinking while demand grows.
          </p>

          <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">What Makes Our Pricing Fair</h3>

          <p className="text-muted-foreground leading-relaxed mb-4">
            Every link we sell includes traffic verification. We only work with sites that have real visitors. We check this ourselves. No fake metrics. No inflated numbers.
          </p>

          <p className="text-muted-foreground leading-relaxed mb-4">
            We also guarantee links stay live. If a link comes down within the first year, we replace it free. Most companies don&apos;t do this. They take your money and disappear.
          </p>

          <p className="text-muted-foreground leading-relaxed mb-4">
            You get full transparency before buying. We show you the exact site, the DR, the traffic, the niche. No surprises. You know exactly what you&apos;re paying for and why it costs what it does.
          </p>
        </div>
      </div>
    </>
  )
}
