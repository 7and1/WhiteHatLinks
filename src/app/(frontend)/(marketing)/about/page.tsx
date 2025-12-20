import type { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbSchema } from '@/components/seo'
import { Shield, Target, Users, CheckCircle, Award, Clock } from 'lucide-react'
import { siteConfig } from '@/config/site'

export const revalidate = 86400

export const metadata: Metadata = {
  title: `About ${siteConfig.name} - Expert SEO Link Building Team Since 2021`,
  description:
    `Meet the team behind ${siteConfig.name}. 15+ years combined SEO experience. 1000+ vetted publishers. Real sites, real traffic, zero PBNs. Trusted by agencies and brands worldwide.`,
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
  openGraph: {
    title: `About ${siteConfig.name} - Expert SEO Link Building Team`,
    description: '15+ years SEO experience. 1000+ vetted publishers. Real sites, real traffic, zero PBNs.',
    url: `${siteConfig.url}/about`,
  },
}

const principles = [
  {
    icon: Shield,
    title: 'No PBNs, Ever',
    description:
      'We never use private blog networks. Period. Every site in our inventory is a real website with real traffic and genuine editorial control. We check every single one.',
  },
  {
    icon: Target,
    title: 'Relevance First',
    description:
      'We match placements to your niche. A SaaS link belongs on a tech site, not a random lifestyle blog. Simple logic. Topical relevance maximizes link value and keeps you safe.',
  },
  {
    icon: Users,
    title: 'Publisher Relationships',
    description:
      'We build long-term partnerships with quality publishers. Real humans, real conversations. This means better placements, faster turnaround, and consistent quality you can rely on.',
  },
  {
    icon: CheckCircle,
    title: 'Transparent Metrics',
    description:
      'You see DR, traffic, and niche before you buy. No guesswork, no surprises, no hidden fees. Domain details revealed after qualification. Everything is clear and upfront.',
  },
]

const timeline = [
  {
    year: '2021',
    title: 'The Problem',
    description:
      'After rejecting thousands of spammy placements for our own SaaS and e-commerce projects, we realized the link building industry was broken. Too many PBNs. Too many fake metrics. Too much risk.',
  },
  {
    year: '2022',
    title: 'Building the Solution',
    description:
      'We started vetting publishers ourselves. Built direct relationships with real site owners. Developed our 12-point quality check process. Tested everything on our own projects first.',
  },
  {
    year: '2023',
    title: 'Launch',
    description:
      'We launched with a curated inventory of 200+ vetted sites. No marketing budget. Word spread through referrals from happy customers who saw real results.',
  },
  {
    year: '2024',
    title: 'Growing Trust',
    description:
      '500+ campaigns delivered. Zero penalties. Agency partnerships formed. Inventory expanded to 1000+ sites across 20+ niches. Team grew from 2 to 8 people.',
  },
  {
    year: '2026',
    title: 'The Future',
    description:
      'Expanding into new markets. Building AI-powered quality checks. Same mission: make safe link acquisition predictable. No shortcuts. No compromises.',
  },
]

const stats = [
  { value: '500+', label: 'Campaigns Delivered' },
  { value: '1000+', label: 'Vetted Publishers' },
  { value: '15+ Years', label: 'Combined SEO Experience' },
  { value: 'Zero', label: 'Google Penalties' },
]

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'About', url: `${siteConfig.url}/about` },
        ]}
      />

      <div className="container py-16">
        {/* Hero */}
        <div className="max-w-3xl mb-20">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide">About Us</p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mt-2">
            Expert Link Building Team with 15+ Years Experience
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            The link building industry is broken. We built {siteConfig.name} to fix it.
          </p>
          <p className="mt-4 text-lg text-muted-foreground">
            Most link building services are a scam. They sell you links from PBNs. Private blog networks that look real but are not. Google knows. Your rankings tank. You waste money.
          </p>
          <p className="mt-4 text-lg text-muted-foreground">
            We saw this problem firsthand. We ran our own SaaS companies and e-commerce stores. We needed backlinks to rank. We tried every service out there. Rejected thousands of spammy placements. Lost money on penalties.
          </p>
          <p className="mt-4 text-lg text-muted-foreground">
            So we built our own solution. We only work with real websites. Real traffic. Real editorial control. No PBNs. No fake metrics. No BS.
          </p>
          <p className="mt-4 text-lg font-semibold text-foreground">
            Our mission is simple: make safe link acquisition predictable.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4 mb-20">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-6 rounded-xl border bg-white shadow-sm">
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Principles */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-foreground mb-4">How We Work</h2>
          <p className="text-muted-foreground max-w-3xl mb-8">
            We have four simple rules. No exceptions. These rules keep our customers safe and our reputation intact.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {principles.map((principle) => (
              <div
                key={principle.title}
                className="flex gap-4 p-6 rounded-xl border bg-white shadow-sm"
              >
                <div className="flex-shrink-0">
                  <div className="rounded-full bg-primary/10 p-3">
                    <principle.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{principle.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{principle.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Process */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-foreground mb-4">Our 12-Point Quality Check</h2>
          <p className="text-muted-foreground max-w-3xl mb-8">
            Every publisher goes through our vetting process. We check everything. Most sites fail. Only the top 20% make it into our inventory.
          </p>
          <div className="prose prose-lg max-w-3xl">
            <div className="bg-white border rounded-xl p-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">What We Check:</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><strong>Real Traffic:</strong> We verify traffic with multiple tools. No bots. No fake visitors.</li>
                <li><strong>Clean Backlinks:</strong> We analyze the link profile. No spam. No PBN links pointing to the site.</li>
                <li><strong>Domain Authority:</strong> We check DR/DA from Ahrefs and Moz. Minimum thresholds apply.</li>
                <li><strong>Content Quality:</strong> Human review. Good writing. Proper grammar. No spun content.</li>
                <li><strong>Editorial Control:</strong> We verify the site owner has full control. No hacked sites.</li>
                <li><strong>Niche Relevance:</strong> We categorize every site. You only get links from relevant niches.</li>
                <li><strong>Google Index Status:</strong> Site must be indexed and ranking for keywords.</li>
                <li><strong>Spam Score:</strong> Low spam score required. We use multiple spam detection tools.</li>
                <li><strong>Site Age:</strong> Preference for older domains. New sites need extra vetting.</li>
                <li><strong>SSL & Security:</strong> All sites must have valid SSL. No security warnings.</li>
                <li><strong>Mobile Friendly:</strong> Responsive design required. Google mobile-first indexing matters.</li>
                <li><strong>Publication History:</strong> We check if they publish regularly. Dead blogs do not make the cut.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-foreground mb-4">Our Values</h2>
          <div className="prose prose-lg max-w-3xl">
            <p className="text-muted-foreground">
              <strong>Honesty:</strong> We tell you the truth. If a link will not help, we say so. We are not here to sell you stuff you do not need.
            </p>
            <p className="text-muted-foreground mt-4">
              <strong>Safety First:</strong> Your website is your business. We will never risk it for a quick buck. Every placement must pass our safety standards.
            </p>
            <p className="text-muted-foreground mt-4">
              <strong>Quality Over Quantity:</strong> We would rather lose a sale than place a bad link. Our reputation depends on your success.
            </p>
            <p className="text-muted-foreground mt-4">
              <strong>Transparency:</strong> You see the metrics before you buy. You know what you are getting. No hidden fees. No surprises.
            </p>
            <p className="text-muted-foreground mt-4">
              <strong>Long-Term Thinking:</strong> We build relationships, not transactions. Most of our customers have been with us for years.
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-foreground mb-8">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border md:left-1/2 md:-translate-x-px" />
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={`relative flex items-start gap-6 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className="flex-1 md:text-right">
                    {index % 2 === 0 && (
                      <div className="p-6 rounded-xl border bg-white shadow-sm">
                        <div className="text-sm font-semibold text-primary">{item.year}</div>
                        <h3 className="font-semibold text-foreground mt-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                      </div>
                    )}
                  </div>
                  <div className="relative flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center z-10">
                    <div className="w-3 h-3 rounded-full bg-white" />
                  </div>
                  <div className="flex-1">
                    {index % 2 !== 0 && (
                      <div className="p-6 rounded-xl border bg-white shadow-sm">
                        <div className="text-sm font-semibold text-primary">{item.year}</div>
                        <h3 className="font-semibold text-foreground mt-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-foreground mb-4">Who We Are</h2>
          <div className="prose prose-lg max-w-3xl mb-8">
            <p className="text-muted-foreground">
              We are a team of 8 people who actually understand SEO. Not theory. Real experience.
            </p>
            <p className="text-muted-foreground mt-4">
              Our founders have 15+ years combined experience in SEO and digital marketing. They built and sold two SaaS companies. Grew organic traffic from zero to millions of visitors. Learned what works and what does not.
            </p>
            <p className="text-muted-foreground mt-4">
              Before WhiteHatLinks, they were the customers. They bought links. They got burned by PBNs. They watched competitors get penalized. They learned the hard way that most link building services are garbage.
            </p>
            <p className="text-muted-foreground mt-4">
              Our team includes former in-house SEOs from venture-backed startups. People who had to show ROI every quarter. People who built real businesses, not just rankings that disappeared.
            </p>
            <p className="text-muted-foreground mt-4">
              We have worked across industries: fintech, SaaS, e-commerce, B2B services, healthcare, legal, and more. We know what a good link looks like because we have been on both sides. Buying and selling.
            </p>
          </div>

          <h3 className="text-xl font-bold text-foreground mb-6 mt-12">Our Expertise</h3>
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <div className="p-6 rounded-xl border bg-white shadow-sm">
              <Award className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-semibold text-foreground mb-2">15+ Years SEO Experience</h4>
              <p className="text-sm text-muted-foreground">
                Our team has worked on SEO since 2010. We have seen algorithm updates come and go. We survived Penguin, Panda, and every major Google change. We know what lasts.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-white shadow-sm">
              <Users className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-semibold text-foreground mb-2">500+ Successful Campaigns</h4>
              <p className="text-sm text-muted-foreground">
                We have delivered over 500 link building campaigns. Zero penalties. Real rankings growth. Our customers stick with us because it works.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-white shadow-sm">
              <Shield className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-semibold text-foreground mb-2">Trusted by Top Agencies</h4>
              <p className="text-sm text-muted-foreground">
                Leading SEO agencies white-label our services. They trust us to deliver for their biggest clients. We work under NDA with agencies managing Fortune 500 brands.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-white shadow-sm">
              <Clock className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-semibold text-foreground mb-2">12-Hour Response Time</h4>
              <p className="text-sm text-muted-foreground">
                We respond fast. Usually within 12 hours. Clear communication. No runaround. You get answers from people who know SEO, not sales reps reading scripts.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-bold text-foreground mb-6 mt-12">What Makes Us Different</h3>
          <div className="prose prose-lg max-w-3xl">
            <p className="text-muted-foreground">
              Most link building services are run by people who never ranked a website. They outsource to cheap labor. They use automation. They do not care if you get penalized.
            </p>
            <p className="text-muted-foreground mt-4">
              We are different. We built our own websites. We know what it takes to rank. We use our own service for our projects. If we would not use a publisher for our sites, we do not offer it to you.
            </p>
            <p className="text-muted-foreground mt-4">
              Every publisher in our network goes through a 12-point quality check. Real traffic verification. Manual content review. Backlink profile analysis. Spam score checks. We reject 80% of publishers who apply.
            </p>
            <p className="text-muted-foreground mt-4">
              We have direct relationships with site owners. No middlemen. No resellers. This means better prices, faster turnaround, and guaranteed placement quality.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-white to-white border p-10 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Work With Us</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Browse our inventory of 1000+ vetted publishers. Or contact us for custom outreach. We respond in 12 hours.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/inventory"
              className="rounded-md bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 transition-colors"
            >
              View Inventory
            </Link>
            <Link
              href="/contact"
              className="rounded-md border px-6 py-3 font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              Get Custom Quote
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
