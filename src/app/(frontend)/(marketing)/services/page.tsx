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
  title: 'Link Building Services That Actually Work - Guest Posts & Digital PR',
  description:
    'Get real results with white hat link building. 78% of SEO pros see positive ROI from quality backlinks. Guest posts, link insertions, and digital PR that boost rankings and traffic.',
  alternates: {
    canonical: 'https://whitehatlink.org/services',
  },
  openGraph: {
    title: 'Link Building Services That Actually Work | WhiteHatLinks',
    description: 'White hat link building with proven ROI. Guest posts, link insertions, and digital PR.',
    url: 'https://whitehatlink.org/services',
  },
}

const services = [
  {
    id: 'guest-posts',
    icon: FileText,
    title: 'Guest Posts',
    tagline: 'Full-service content & placement',
    description:
      'Guest posts are the most popular link building method for a reason. You get full control. We write great content, find the right sites, and get your links published. Simple. The #1 result on Google has 3.8x more backlinks than positions 2-10. Guest posts help you compete.',
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
    benefit:
      'Best for: Building authority in your niche. Great for new sites or adding 5-20 links per month to your profile.',
  },
  {
    id: 'link-insertions',
    icon: Link2,
    title: 'Link Insertions',
    tagline: 'Links in existing content',
    description:
      'Link insertions are faster and often more powerful. Why? The content already exists. It already ranks. It already has traffic. We just add your link to it. Natural. Fast. Effective. 80% of SEOs say backlinks show impact within 2-6 weeks.',
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
    benefit:
      'Best for: Quick wins. When you need links fast or want to leverage already-ranking content.',
  },
  {
    id: 'digital-pr',
    icon: Megaphone,
    title: 'Digital PR Sprints',
    tagline: 'Press coverage & editorial links',
    description:
      'Digital PR gets you links from news sites and big publications. These are high-authority links. The kind Google really cares about. Plus you get brand exposure. 78% of marketers say digital PR delivers higher ROI than any other link building strategy. That speaks for itself.',
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
    benefit:
      'Best for: Established brands wanting high-authority links and media coverage. Ideal for product launches or building brand trust.',
  },
]

const servicesFaqs = [
  {
    question: 'Which service is best for my needs?',
    answer:
      'Start with guest posts if you are new to link building. You get full control. Build 5-10 quality links per month. Once you have momentum, add link insertions for faster results. Save digital PR for when you have budget and want media coverage. Most successful campaigns mix all three.',
  },
  {
    question: 'How much should I invest in link building?',
    answer:
      'Industry data shows 46% of marketers spend $10,000+ annually on link building. Quality links cost $500-$1,500 each. Start with $1,000-$2,500 monthly if you are serious about growth. Remember: 78% of SEO pros see positive ROI from quality backlinks. This is not an expense. It is an investment.',
  },
  {
    question: 'How long until I see results?',
    answer:
      'Most backlinks show impact within 2-6 weeks. Full campaign results typically take 3 months. Be patient. Link building is not a quick hack. It is a long-term strategy. But the results compound over time.',
  },
  {
    question: 'Can I combine multiple services?',
    answer:
      'Yes. Smart marketers do this. Use guest posts for your foundation. Add link insertions for quick wins. Layer in digital PR for authority. We can build a custom mix based on your goals and budget.',
  },
  {
    question: 'Do you offer retainer packages?',
    answer:
      'Yes. Monthly retainers work best for serious growth. You get priority access to new inventory, volume pricing, and consistent link velocity. Over 56% of link builders plan to invest more in 2025. Join them.',
  },
  {
    question: 'Why does quality matter more than quantity?',
    answer:
      '94% of link builders say quality beats quantity. One link from a DR 70+ site beats 100 links from low-quality sites. High-authority backlinks drive 42% faster keyword growth. Google cares about who links to you, not how many links you have. Focus on quality.',
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
  url: `https://whitehatlink.org/services#${s.id}`,
}))

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://whitehatlink.org' },
          { name: 'Services', url: 'https://whitehatlink.org/services' },
        ]}
      />
      <ServiceSchema services={servicesForSchema} />
      <FAQSchema faqs={servicesFaqs} />

      <div className="container py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide">Services</p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mt-2">
            Link Building Services
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Quality backlinks move the needle. The numbers prove it. 78% of SEO professionals see
            positive ROI from link building. The #1 result on Google has 3.8x more backlinks than
            positions 2-10. You need links to compete. We help you get them the right way.
          </p>
        </div>

        {/* Introduction Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="prose prose-lg mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Why Link Building Still Matters in 2025
            </h2>
            <p className="text-muted-foreground mb-4">
              Let me be direct. Backlinks are still critical. Google says they are less important
              than before. But the data tells a different story. Only 1 in 20 pages without
              backlinks gets any organic traffic. That is a 95% failure rate.
            </p>
            <p className="text-muted-foreground mb-4">
              Here is what changed: quality matters more than ever. One quality backlink beats 100
              low-quality links. Businesses earning backlinks from high-authority domains (DR 70+)
              see 42% faster keyword growth. Google cares about who links to you, not how many
              links you have.
            </p>
            <p className="text-muted-foreground mb-4">
              The investment makes sense too. 67% of agencies report link building ROI in their top
              3 SEO investments. Agencies allocate 32% of their SEO budget to link building. Why?
              Because it works. The average campaign takes 3 months to show results. But once it
              does, the growth compounds.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4 mt-10">
              Our Approach: White Hat Only
            </h2>
            <p className="text-muted-foreground mb-4">
              We do not buy links. We do not use PBNs. We do not spam. Every link comes from real
              outreach to real sites with real traffic. Manual vetting. Topical relevance.
              Traffic-first placement. This takes longer. Costs more. But it lasts.
            </p>
            <p className="text-muted-foreground mb-6">
              We focus on three services: guest posts, link insertions, and digital PR. Each serves
              a different purpose. Most successful campaigns use all three. Here is how they work.
            </p>
          </div>
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

                <p className="text-sm text-muted-foreground mb-4">
                  <span className="font-medium text-foreground">Typical turnaround:</span>{' '}
                  {service.turnaround}
                </p>

                <div className="bg-primary/5 border-l-4 border-primary p-4 rounded">
                  <p className="text-sm font-medium text-foreground">{service.benefit}</p>
                </div>
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

        {/* Service Comparison */}
        <div className="mb-20 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">
            Service Comparison: Choose What Works for You
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-secondary">
                  <th className="border p-4 text-left font-semibold text-foreground">Factor</th>
                  <th className="border p-4 text-left font-semibold text-foreground">
                    Guest Posts
                  </th>
                  <th className="border p-4 text-left font-semibold text-foreground">
                    Link Insertions
                  </th>
                  <th className="border p-4 text-left font-semibold text-foreground">
                    Digital PR
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr>
                  <td className="border p-4 font-medium">Speed</td>
                  <td className="border p-4 text-sm text-muted-foreground">2-4 weeks</td>
                  <td className="border p-4 text-sm text-muted-foreground">1-2 weeks</td>
                  <td className="border p-4 text-sm text-muted-foreground">4-6 weeks</td>
                </tr>
                <tr>
                  <td className="border p-4 font-medium">Cost</td>
                  <td className="border p-4 text-sm text-muted-foreground">$$</td>
                  <td className="border p-4 text-sm text-muted-foreground">$</td>
                  <td className="border p-4 text-sm text-muted-foreground">$$$</td>
                </tr>
                <tr>
                  <td className="border p-4 font-medium">Control</td>
                  <td className="border p-4 text-sm text-muted-foreground">Full control</td>
                  <td className="border p-4 text-sm text-muted-foreground">Limited</td>
                  <td className="border p-4 text-sm text-muted-foreground">Medium</td>
                </tr>
                <tr>
                  <td className="border p-4 font-medium">Authority</td>
                  <td className="border p-4 text-sm text-muted-foreground">Medium-High</td>
                  <td className="border p-4 text-sm text-muted-foreground">Medium-High</td>
                  <td className="border p-4 text-sm text-muted-foreground">Very High</td>
                </tr>
                <tr>
                  <td className="border p-4 font-medium">Best For</td>
                  <td className="border p-4 text-sm text-muted-foreground">
                    Building authority
                  </td>
                  <td className="border p-4 text-sm text-muted-foreground">Quick wins</td>
                  <td className="border p-4 text-sm text-muted-foreground">Brand growth</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Our Process Overview */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-foreground text-center mb-4">
            Our 5-Step Process
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            Simple. Transparent. Effective. We handle the hard work. You get the results.
          </p>
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

        {/* Expert Recommendations */}
        <div className="mb-20 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-4">
            Expert Recommendations
          </h2>
          <p className="text-center text-muted-foreground mb-10">
            Not sure where to start? Here is what works based on your situation.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="font-bold text-foreground mb-2">New Site (0-6 months)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start slow. Build foundation. Focus on quality.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>5-10 guest posts per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>DR 30-50 domains</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Budget: $1,000-$2,500/month</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="font-bold text-foreground mb-2">Growing Site (6-18 months)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Scale up. Mix strategies. Increase velocity.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>10-20 guest posts per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>5-10 link insertions per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Budget: $3,000-$7,500/month</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="font-bold text-foreground mb-2">Established Brand (18+ months)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Dominate. Build authority. Get press coverage.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>20+ guest posts per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>10-15 link insertions per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>1-2 digital PR campaigns per quarter</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Budget: $10,000+/month</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-2xl font-bold text-foreground text-center mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-muted-foreground mb-10">
            Real answers to questions everyone asks. No fluff.
          </p>
          <div className="space-y-4">
            {servicesFaqs.map((faq) => (
              <div key={faq.question} className="rounded-lg border bg-white p-6">
                <h3 className="font-semibold text-foreground">{faq.question}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Industry Stats */}
        <div className="mb-20 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">
            The Numbers Do Not Lie
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="text-center p-6 rounded-xl border bg-white shadow-sm">
              <div className="text-4xl font-bold text-primary mb-2">78%</div>
              <p className="text-sm text-muted-foreground">
                of SEO professionals report positive ROI from link building
              </p>
            </div>
            <div className="text-center p-6 rounded-xl border bg-white shadow-sm">
              <div className="text-4xl font-bold text-primary mb-2">3.8x</div>
              <p className="text-sm text-muted-foreground">
                more backlinks for #1 result vs positions 2-10
              </p>
            </div>
            <div className="text-center p-6 rounded-xl border bg-white shadow-sm">
              <div className="text-4xl font-bold text-primary mb-2">42%</div>
              <p className="text-sm text-muted-foreground">
                faster keyword growth from high-authority backlinks (DR 70+)
              </p>
            </div>
            <div className="text-center p-6 rounded-xl border bg-white shadow-sm">
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <p className="text-sm text-muted-foreground">
                of pages without backlinks get zero organic traffic
              </p>
            </div>
          </div>
        </div>

        {/* Final Thoughts */}
        <div className="mb-20 max-w-4xl mx-auto">
          <div className="prose prose-lg mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4">The Bottom Line</h2>
            <p className="text-muted-foreground mb-4">
              Link building works. The data proves it. But you need the right approach. Cheap links
              do not work. Spam does not work. Shortcuts do not work. What works is quality. Manual
              outreach. Real relationships. Traffic-verified sites. This takes time and effort.
            </p>
            <p className="text-muted-foreground mb-4">
              Most campaigns show results in 2-6 weeks. Full impact takes 3 months. But once you
              build momentum, it compounds. Your rankings improve. Traffic increases. Revenue grows.
              That is why 67% of agencies put link building in their top 3 ROI investments.
            </p>
            <p className="text-muted-foreground mb-4">
              We help you build quality backlinks the right way. No shortcuts. No spam. Just real
              outreach that gets results. Choose the service that fits your goals. Start small if
              you need to. Scale when you are ready. The important thing is to start.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-white to-white border p-10 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to Build Quality Backlinks?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Browse our live inventory of vetted sites or contact us for a custom proposal tailored
            to your goals.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
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
