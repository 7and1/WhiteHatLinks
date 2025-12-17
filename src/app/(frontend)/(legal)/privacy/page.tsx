import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@/components/seo'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for WhiteHatLinks - how we collect, use, and protect your data.',
  alternates: {
    canonical: 'https://whitehatlinks.io/privacy',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://whitehatlinks.io' },
          { name: 'Privacy Policy', url: 'https://whitehatlinks.io/privacy' },
        ]}
      />

      <div className="container py-16">
        <div className="prose max-w-3xl mx-auto">
          <h1>Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: December 2024</p>

          <h2>1. Introduction</h2>
          <p>
            WhiteHatLinks (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy
            and is committed to protecting your personal data. This privacy policy explains how we
            collect, use, and safeguard your information when you use our services.
          </p>

          <h2>2. Information We Collect</h2>
          <h3>Information You Provide</h3>
          <ul>
            <li>Contact information (name, email address, company name)</li>
            <li>Website URLs for link building campaigns</li>
            <li>Payment information (processed securely through third-party providers)</li>
            <li>Communication records (emails, support tickets)</li>
            <li>Campaign preferences and requirements</li>
          </ul>

          <h3>Information Collected Automatically</h3>
          <ul>
            <li>IP address and device information</li>
            <li>Browser type and version</li>
            <li>Pages visited and time spent on our site</li>
            <li>Referring website addresses</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use collected information to:</p>
          <ul>
            <li>Provide and manage our link building services</li>
            <li>Process payments and send invoices</li>
            <li>Communicate about your campaigns and orders</li>
            <li>Respond to inquiries and provide customer support</li>
            <li>Improve our services and user experience</li>
            <li>Send relevant marketing communications (with your consent)</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>4. Data Sharing</h2>
          <p>We may share your information with:</p>
          <ul>
            <li>
              <strong>Service Providers:</strong> Third parties who assist in operating our
              business (payment processors, email services)
            </li>
            <li>
              <strong>Publishers:</strong> Limited information necessary to facilitate link
              placements (we do not share full contact details)
            </li>
            <li>
              <strong>Legal Requirements:</strong> When required by law or to protect our rights
            </li>
          </ul>
          <p>We do not sell your personal information to third parties.</p>

          <h2>5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal
            data against unauthorized access, alteration, disclosure, or destruction. These
            measures include encryption, secure servers, and access controls.
          </p>

          <h2>6. Data Retention</h2>
          <p>
            We retain your personal data for as long as necessary to provide our services and
            comply with legal obligations. Campaign data is typically retained for 3 years after
            the last transaction. You may request deletion of your data at any time.
          </p>

          <h2>7. Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate or incomplete data</li>
            <li>Request deletion of your data</li>
            <li>Object to or restrict processing of your data</li>
            <li>Data portability (receive your data in a structured format)</li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p>
            To exercise these rights, contact us at{' '}
            <a href="mailto:hello@whitehatlinks.io">hello@whitehatlinks.io</a>.
          </p>

          <h2>8. Cookies</h2>
          <p>
            We use cookies and similar technologies to enhance your experience on our website.
            These include:
          </p>
          <ul>
            <li>
              <strong>Essential cookies:</strong> Required for website functionality
            </li>
            <li>
              <strong>Analytics cookies:</strong> Help us understand how visitors use our site
            </li>
          </ul>
          <p>You can control cookie preferences through your browser settings.</p>

          <h2>9. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites. We are not responsible for the
            privacy practices of these sites. We encourage you to review their privacy policies.
          </p>

          <h2>10. Children&apos;s Privacy</h2>
          <p>
            Our services are not intended for individuals under 18 years of age. We do not
            knowingly collect personal information from children.
          </p>

          <h2>11. International Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your own.
            We ensure appropriate safeguards are in place for such transfers in compliance with
            applicable data protection laws.
          </p>

          <h2>12. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of significant
            changes via email or website notice. Your continued use of our services after changes
            constitutes acceptance of the updated policy.
          </p>

          <h2>13. Contact Us</h2>
          <p>
            For questions about this privacy policy or our data practices, contact us at:
          </p>
          <p>
            Email: <a href="mailto:hello@whitehatlinks.io">hello@whitehatlinks.io</a>
          </p>
        </div>
      </div>
    </>
  )
}
