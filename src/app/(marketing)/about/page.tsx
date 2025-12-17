import type { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbSchema } from '@/components/seo'
import { Shield, Target, Users, CheckCircle, Award, Clock } from 'lucide-react'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'About Us - Our Story & Mission',
  description:
    'Learn about WhiteHatLinks, our mission to make safe link acquisition predictable, and our commitment to quality and transparency.',
  alternates: {
    canonical: 'https://whitehatlinks.io/about',
  },
  openGraph: {
    title: 'About WhiteHatLinks',
    description: 'Our mission: make safe link acquisition predictable.',
    url: 'https://whitehatlinks.io/about',
  },
}

const principles = [
  {
    icon: Shield,
    title: 'No PBNs, Ever',
    description:
      'We never use private blog networks. Every site in our inventory is a real website with real traffic and genuine editorial control.',
  },
  {
    icon: Target,
    title: 'Relevance First',
    description:
      'We match placements to your niche. A SaaS link belongs on a tech site, not a random lifestyle blog. Topical relevance maximizes link value.',
  },
  {
    icon: Users,
    title: 'Publisher Relationships',
    description:
      'We build long-term partnerships with quality publishers. This means better placements, faster turnaround, and consistent quality.',
  },
  {
    icon: CheckCircle,
    title: 'Transparent Metrics',
    description:
      'You see DR, traffic, and niche before you buy. No guesswork, no surprises. Domain details revealed after qualification.',
  },
]

const timeline = [
  {
    year: '2021',
    title: 'The Problem',
    description:
      'After rejecting thousands of spammy placements for our own projects, we realized the link building industry was broken.',
  },
  {
    year: '2022',
    title: 'Building the Solution',
    description:
      'We started vetting publishers ourselves, building direct relationships, and developing our 12-point quality check process.',
  },
  {
    year: '2023',
    title: 'Launch',
    description:
      'WhiteHatLinks launched with a curated inventory of 200+ vetted sites. Word spread through referrals.',
  },
  {
    year: '2024',
    title: 'Growing Trust',
    description:
      '500+ campaigns delivered. Agency partnerships formed. Inventory expanded to 1000+ sites across multiple niches.',
  },
]

const stats = [
  { value: '500+', label: 'Campaigns Delivered' },
  { value: '1000+', label: 'Vetted Publishers' },
  { value: '90%', label: 'Outreach Success Rate' },
  { value: '12-Point', label: 'Vetting Process' },
]

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://whitehatlinks.io' },
          { name: 'About', url: 'https://whitehatlinks.io/about' },
        ]}
      />

      <div className="container py-16">
        {/* Hero */}
        <div className="max-w-3xl mb-20">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide">About Us</p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mt-2">
            Why WhiteHatLinks exists
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            We started WhiteHatLinks after rejecting thousands of spammy placements. The link
            building industry was full of PBNs, fake traffic, and opaque pricing. We knew there had
            to be a better way.
          </p>
          <p className="mt-4 text-lg text-muted-foreground">
            Our goal is simple: make safe link acquisition predictable. Real sites. Real traffic.
            Real editorial placements. Transparent metrics. No nonsense.
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
          <h2 className="text-2xl font-bold text-foreground mb-8">Our Principles</h2>
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
          <h2 className="text-2xl font-bold text-foreground mb-4">The Team</h2>
          <p className="text-muted-foreground max-w-2xl mb-8">
            We&apos;re a team of SEOs and content strategists with backgrounds in fintech, SaaS, and
            consumer products. We&apos;ve been on both sides of link building—buying and
            selling—which gives us unique insight into what makes a placement valuable.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-6 rounded-xl border bg-white shadow-sm">
              <Award className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground">SEO Expertise</h3>
              <p className="text-sm text-muted-foreground mt-1">
                10+ years combined experience in technical SEO and link building.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-white shadow-sm">
              <Users className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground">Agency Partnerships</h3>
              <p className="text-sm text-muted-foreground mt-1">
                We work with agencies under NDA, white-labeling our services.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-white shadow-sm">
              <Clock className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground">Fast Response</h3>
              <p className="text-sm text-muted-foreground mt-1">
                We pride ourselves on 12-hour response times and clear communication.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-white to-white border p-10 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Ready to work with us?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Browse our inventory or get in touch for a custom quote.
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
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
