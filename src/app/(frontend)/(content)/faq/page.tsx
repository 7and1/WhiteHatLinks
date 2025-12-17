import type { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbSchema, FAQSchema } from '@/components/seo'

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions About Link Building',
  description:
    'Get answers to common questions about our link building services, pricing, process, and quality guarantees.',
  alternates: {
    canonical: 'https://whitehatlinks.io/faq',
  },
  openGraph: {
    title: 'FAQ | WhiteHatLinks',
    description: 'Answers to common questions about our link building services.',
    url: 'https://whitehatlinks.io/faq',
  },
}

const faqCategories = [
  {
    category: 'About Our Service',
    faqs: [
      {
        question: 'What is WhiteHatLinks?',
        answer:
          'WhiteHatLinks is a premium backlink acquisition service. We provide vetted, high-authority guest posts and link insertions on real websites with genuine traffic. Unlike many link building services, we never use PBNs (Private Blog Networks) or low-quality sites.',
      },
      {
        question: 'How do you source your inventory?',
        answer:
          'We build direct relationships with publishers and website owners across multiple niches. Our outreach team vets thousands of sites monthly, and only those that pass our 12-point quality check make it into our inventory.',
      },
      {
        question: 'What makes you different from other link building services?',
        answer:
          'Three things: transparency (you see metrics before you buy), quality (every site is manually vetted), and accountability (links that go down get replaced). We also keep domains private to protect publisher relationships and prevent spam.',
      },
    ],
  },
  {
    category: 'Quality & Vetting',
    faqs: [
      {
        question: 'How do you vet the sites in your inventory?',
        answer:
          'Every site goes through our 12-point vetting process: traffic verification via Ahrefs/Semrush, spam score analysis, content quality review, link profile check, manual review of recent posts, verification of editorial standards, and more.',
      },
      {
        question: 'What metrics do you show before purchase?',
        answer:
          'You see Domain Rating (DR), estimated monthly organic traffic, niche category, geographic region, and price. The actual domain URL is revealed after you qualify and request access, to protect publisher relationships.',
      },
      {
        question: 'Why do you hide the domain names?',
        answer:
          'We keep domains private until qualification for two reasons: to protect our publisher relationships from spam outreach, and to ensure fair access to limited inventory. Once you qualify, you get full domain access.',
      },
      {
        question: 'What if a link goes down after placement?',
        answer:
          'We offer a replacement guarantee. If a link is removed within 12 months of placement for any reason other than your own content issues, we replace it with an equivalent link at no additional cost.',
      },
    ],
  },
  {
    category: 'Process & Delivery',
    faqs: [
      {
        question: 'How long does it take to get a link placed?',
        answer:
          'Guest posts typically take 2-4 weeks from order to live link. Link insertions are faster, usually 1-2 weeks. Digital PR campaigns vary based on scope but typically see first placements within 4-6 weeks.',
      },
      {
        question: 'Do you write the content for guest posts?',
        answer:
          'Yes, all guest post content is written by native English speakers with expertise in the relevant niche. You can provide guidelines, target keywords, and anchor text preferences. We handle the rest.',
      },
      {
        question: 'Can I choose my own anchor text?',
        answer:
          'You can provide preferred anchor text, and we work with publishers to incorporate it naturally. We may suggest modifications to ensure the link looks editorial and natural within the content.',
      },
      {
        question: 'How do I track my orders?',
        answer:
          'After placing an order, you receive a tracking sheet with real-time status updates. Once links are live, we provide full details including the live URL, anchor text used, and screenshot of the placement.',
      },
    ],
  },
  {
    category: 'Pricing & Payment',
    faqs: [
      {
        question: 'How is pricing determined?',
        answer:
          'Pricing varies based on Domain Rating (DR), monthly organic traffic, niche competitiveness, and placement type (guest post vs. insertion). Higher-quality sites with more traffic command premium pricing.',
      },
      {
        question: 'Do you offer bulk discounts?',
        answer:
          'Yes, we offer volume pricing for clients who commit to monthly link building packages. Contact us with your volume needs and we\'ll provide a custom proposal.',
      },
      {
        question: 'What payment methods do you accept?',
        answer:
          'We accept wire transfer, major credit cards (Visa, Mastercard, Amex), and PayPal for international clients. For ongoing partnerships, we can arrange monthly invoicing.',
      },
      {
        question: 'What is your payment terms?',
        answer:
          'We invoice 50% upfront to begin work, and 50% upon live link delivery. For established clients with ongoing campaigns, we can arrange monthly billing.',
      },
    ],
  },
  {
    category: 'Industries & Niches',
    faqs: [
      {
        question: 'What niches do you cover?',
        answer:
          'We have inventory across major verticals including SaaS, Finance, Crypto, Health, Tech, Marketing, E-commerce, Legal, and more. If you have a specific niche requirement, contact us to check availability.',
      },
      {
        question: 'Do you work with gambling or adult sites?',
        answer:
          'We have limited inventory for regulated industries like gambling, CBD, and adult content. Availability varies and pricing is typically higher due to the specialized nature of these placements.',
      },
      {
        question: 'Can you help with local SEO link building?',
        answer:
          'While our primary focus is national/international link building, we can source geo-targeted placements for specific regions. Contact us with your local SEO requirements.',
      },
    ],
  },
]

const allFaqs = faqCategories.flatMap((cat) =>
  cat.faqs.map((faq) => ({
    question: faq.question,
    answer: faq.answer,
  }))
)

export default function FAQPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://whitehatlinks.io' },
          { name: 'FAQ', url: 'https://whitehatlinks.io/faq' },
        ]}
      />
      <FAQSchema faqs={allFaqs} />

      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-wide">FAQ</p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground mt-2">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to know about our link building services.
            </p>
          </div>

          <div className="space-y-12">
            {faqCategories.map((category) => (
              <div key={category.category}>
                <h2 className="text-2xl font-bold text-foreground mb-6">{category.category}</h2>
                <div className="space-y-4">
                  {category.faqs.map((faq) => (
                    <details
                      key={faq.question}
                      className="group rounded-lg border bg-white shadow-sm"
                    >
                      <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold text-foreground">
                        {faq.question}
                        <span className="ml-4 text-primary transition-transform group-open:rotate-180">
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </span>
                      </summary>
                      <div className="px-6 pb-6 text-muted-foreground">{faq.answer}</div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-2xl bg-gradient-to-r from-primary/10 via-white to-white border p-10 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Still have questions?</h2>
            <p className="text-muted-foreground mb-6">
              Can&apos;t find the answer you&apos;re looking for? Our team is happy to help.
            </p>
            <Link
              href="/contact"
              className="inline-flex rounded-md bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 transition-colors"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
