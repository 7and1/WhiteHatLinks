import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@/components/seo'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for WhiteHatLinks link building services.',
  alternates: {
    canonical: 'https://whitehatlinks.io/terms',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://whitehatlinks.io' },
          { name: 'Terms of Service', url: 'https://whitehatlinks.io/terms' },
        ]}
      />

      <div className="container py-16">
        <div className="prose max-w-3xl mx-auto">
          <h1>Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: December 2024</p>

          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing or using WhiteHatLinks services, you agree to be bound by these Terms of
            Service. If you disagree with any part of these terms, you may not access our services.
          </p>

          <h2>2. Description of Services</h2>
          <p>
            WhiteHatLinks provides link building services including guest posts, link insertions,
            and digital PR campaigns. Our services connect clients with publisher websites for the
            purpose of obtaining backlinks.
          </p>

          <h2>3. Client Responsibilities</h2>
          <ul>
            <li>Provide accurate information about your website and link building goals</li>
            <li>Ensure your website complies with applicable laws and regulations</li>
            <li>Not use our services for illegal or unethical purposes</li>
            <li>Pay all invoices within the agreed payment terms</li>
            <li>
              Comply with publisher guidelines for content and anchor text where applicable
            </li>
          </ul>

          <h2>4. Service Delivery</h2>
          <p>
            We make reasonable efforts to deliver services within estimated timeframes. However,
            delivery times are estimates and not guarantees. Factors outside our control, including
            publisher availability and approval processes, may affect delivery.
          </p>

          <h2>5. Quality Guarantee</h2>
          <p>
            We guarantee that links placed through our service will remain live for a minimum of 12
            months. If a link is removed within this period due to publisher actions (not related
            to client content violations), we will provide a replacement link of equivalent value
            at no additional cost.
          </p>

          <h2>6. Payment Terms</h2>
          <p>
            Payment is due according to the terms specified in your invoice. Standard terms are 50%
            upon order and 50% upon delivery. Late payments may incur additional fees and result in
            service suspension.
          </p>

          <h2>7. Refund Policy</h2>
          <p>
            Refunds may be issued at our discretion for services not delivered. Once a link is live
            and verified, no refunds will be provided. If a link is subsequently removed, our
            replacement guarantee applies.
          </p>

          <h2>8. Confidentiality</h2>
          <p>
            We maintain confidentiality regarding client campaigns and do not disclose client
            information to third parties without consent, except as required by law. Publisher
            domain information is kept confidential to protect our network.
          </p>

          <h2>9. Limitation of Liability</h2>
          <p>
            WhiteHatLinks shall not be liable for any indirect, incidental, special, consequential,
            or punitive damages resulting from your use of our services. Our total liability shall
            not exceed the amount paid for the specific service in question.
          </p>

          <h2>10. Prohibited Uses</h2>
          <p>You may not use our services to:</p>
          <ul>
            <li>Promote illegal activities or content</li>
            <li>Violate intellectual property rights</li>
            <li>Distribute malware or engage in phishing</li>
            <li>Harass or harm individuals or groups</li>
            <li>Manipulate search engines in ways that violate their terms of service</li>
          </ul>

          <h2>11. Termination</h2>
          <p>
            We reserve the right to terminate or suspend services at any time for violations of
            these terms. Clients may terminate services with written notice; any completed work
            will be invoiced and remaining balances refunded.
          </p>

          <h2>12. Changes to Terms</h2>
          <p>
            We may modify these terms at any time. Continued use of our services after changes
            constitutes acceptance of the new terms. We will notify clients of material changes
            via email.
          </p>

          <h2>13. Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of the
            United States, without regard to conflict of law principles.
          </p>

          <h2>14. Contact Information</h2>
          <p>
            For questions about these Terms of Service, please contact us at{' '}
            <a href="mailto:hello@whitehatlinks.io">hello@whitehatlinks.io</a>.
          </p>
        </div>
      </div>
    </>
  )
}
