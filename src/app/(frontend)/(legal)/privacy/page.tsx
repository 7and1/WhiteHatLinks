import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@/components/seo'

// Revalidate every 7 days (legal pages change infrequently)
export const revalidate = 604800

export const metadata: Metadata = {
  title: 'Privacy Policy | How We Protect Your Data at WhiteHatLinks',
  description: 'Simple, transparent privacy policy. Learn exactly what data we collect, why we need it, and how we keep it safe. No legal jargon - just straight talk about your privacy.',
  alternates: {
    canonical: 'https://whitehatlink.org/privacy',
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
          { name: 'Home', url: 'https://whitehatlink.org' },
          { name: 'Privacy Policy', url: 'https://whitehatlink.org/privacy' },
        ]}
      />

      <div className="container py-16">
        <div className="prose max-w-3xl mx-auto">
          <h1>Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: December 2024</p>

          <p className="lead">
            Look, privacy is important. Really important. This policy tells you exactly what data we collect,
            why we need it, and how we keep it safe. No confusing legal talk. Just straight answers.
          </p>

          <h2>Why This Matters</h2>
          <p>
            At WhiteHatLinks, we build high-quality backlinks to help your website rank better. To do that,
            we need some of your information. But here&apos;s the thing - we only collect what we actually need.
            Nothing more. And we protect it like it&apos;s our own.
          </p>
          <p>
            <strong>Bottom line:</strong> We respect your privacy. We don&apos;t sell your data. We don&apos;t
            spam you. We use your information to provide the service you paid for. That&apos;s it.
          </p>

          <h2>What Information We Collect</h2>
          <p>
            We&apos;re transparent about this. Here&apos;s everything we collect and why:
          </p>

          <h3>Information You Give Us Directly</h3>
          <p>
            When you sign up or use our service, you share information with us. This includes:
          </p>
          <ul>
            <li>
              <strong>Contact details:</strong> Your name, email address, and company name. We need
              this to communicate with you about your campaigns.
            </li>
            <li>
              <strong>Website URLs:</strong> The websites you want us to build links for. Obviously,
              we can&apos;t run a link building campaign without knowing which sites to promote.
            </li>
            <li>
              <strong>Payment information:</strong> Credit card details, billing address. We use
              trusted payment processors like Stripe - we never store your full credit card number
              on our servers.
            </li>
            <li>
              <strong>Communication records:</strong> Emails you send us, support tickets, feedback.
              This helps us provide better service and remember your preferences.
            </li>
            <li>
              <strong>Campaign preferences:</strong> Your target keywords, niche requirements, quality
              standards. We need these to deliver links that actually help your rankings.
            </li>
          </ul>

          <h3>Information We Collect Automatically</h3>
          <p>
            Like most websites, we automatically collect some technical data when you visit:
          </p>
          <ul>
            <li>
              <strong>IP address and device info:</strong> This helps us prevent fraud and understand
              where our users are located.
            </li>
            <li>
              <strong>Browser type and version:</strong> So we can make sure our site works properly
              for you.
            </li>
            <li>
              <strong>Pages you visit and time spent:</strong> This tells us which features are useful
              and which need improvement.
            </li>
            <li>
              <strong>Referring websites:</strong> How you found us - whether from Google, a blog post,
              or social media.
            </li>
          </ul>
          <p>
            <strong>Plain English summary:</strong> We collect your contact info to run your campaigns,
            payment info to charge you, and technical data to make the site work better. Nothing sketchy.
          </p>

          <h2>How We Use Your Information</h2>
          <p>
            We use your data for specific purposes. Here&apos;s the complete list:
          </p>
          <ul>
            <li>
              <strong>Deliver our service:</strong> Finding high-quality websites, negotiating
              placements, and securing backlinks for your site.
            </li>
            <li>
              <strong>Process payments:</strong> Charging your card, sending invoices, handling
              refunds if needed.
            </li>
            <li>
              <strong>Keep you updated:</strong> Sending campaign reports, notifying you when new
              links are live, answering your questions.
            </li>
            <li>
              <strong>Provide support:</strong> Helping you when things go wrong or when you have
              questions about your campaigns.
            </li>
            <li>
              <strong>Improve our service:</strong> Analyzing what works and what doesn&apos;t so we
              can build a better product.
            </li>
            <li>
              <strong>Send marketing emails:</strong> Only if you opt in. These might include new
              features, special offers, or SEO tips. You can unsubscribe anytime.
            </li>
            <li>
              <strong>Follow the law:</strong> Sometimes we&apos;re legally required to keep certain
              records or share information with authorities.
            </li>
          </ul>
          <p>
            <strong>Plain English summary:</strong> We use your data to do our job - building links for
            your website. We also use it to send you updates and improve our service. That&apos;s all.
          </p>

          <h2>Who We Share Your Data With</h2>
          <p>
            We don&apos;t sell your data. Period. But we do share it with a few trusted partners who help
            us run the business:
          </p>
          <ul>
            <li>
              <strong>Service providers:</strong> Companies like Stripe (for payments), Cloudflare (for
              hosting), and email services (for sending you updates). These companies are required by
              contract to protect your data and can only use it to help us provide our service.
            </li>
            <li>
              <strong>Publishers:</strong> The website owners who publish your links. We share limited
              info - usually just your website URL and anchor text requirements. We don&apos;t give them
              your full contact details.
            </li>
            <li>
              <strong>Legal authorities:</strong> If required by law or to protect our rights. For example,
              if we receive a valid court order or need to prevent fraud.
            </li>
          </ul>
          <p>
            <strong>Important:</strong> We will never sell your email list to spammers. We will never share
            your payment details with anyone except our payment processor. Your data is not a product we sell.
          </p>
          <p>
            <strong>Plain English summary:</strong> We share your data only with companies that help us
            deliver our service - like payment processors and hosting providers. We never sell your information.
          </p>

          <h2>How We Protect Your Data</h2>
          <p>
            Security is not optional. Here&apos;s what we do to keep your information safe:
          </p>
          <ul>
            <li>
              <strong>Encryption:</strong> All data sent between your browser and our servers is encrypted
              using industry-standard SSL/TLS. Same technology banks use.
            </li>
            <li>
              <strong>Secure servers:</strong> Our infrastructure runs on Cloudflare, which provides
              enterprise-grade security and DDoS protection.
            </li>
            <li>
              <strong>Access controls:</strong> Only authorized team members can access customer data, and
              only when necessary to provide support or fulfill orders.
            </li>
            <li>
              <strong>Regular security updates:</strong> We keep our software up to date with the latest
              security patches.
            </li>
            <li>
              <strong>Payment security:</strong> We don&apos;t store your full credit card numbers. Payment
              data is handled by PCI-compliant processors.
            </li>
          </ul>
          <p>
            No security system is perfect, but we take this seriously. If we ever experience a data breach
            that affects you, we&apos;ll notify you immediately.
          </p>
          <p>
            <strong>Plain English summary:</strong> We use encryption, secure servers, and strict access
            controls to protect your data. Your payment info is handled by certified payment processors,
            not stored on our servers.
          </p>

          <h2>How Long We Keep Your Data</h2>
          <p>
            We don&apos;t keep your data forever. Here&apos;s our retention policy:
          </p>
          <ul>
            <li>
              <strong>Active customers:</strong> We keep your data as long as you&apos;re using our service.
            </li>
            <li>
              <strong>Campaign data:</strong> We typically keep campaign records for 3 years after your
              last order. This helps us provide historical reports and comply with accounting requirements.
            </li>
            <li>
              <strong>Financial records:</strong> Tax laws require us to keep invoices and payment records
              for 7 years.
            </li>
            <li>
              <strong>Marketing emails:</strong> If you unsubscribe, we remove you from our mailing list
              immediately (though we keep a record that you unsubscribed so we don&apos;t accidentally
              email you again).
            </li>
          </ul>
          <p>
            Want us to delete your data earlier? Just ask. We&apos;ll delete what we can while keeping
            what we&apos;re legally required to retain.
          </p>
          <p>
            <strong>Plain English summary:</strong> We keep your data while you&apos;re a customer and for
            3 years after for campaign records. Some financial records must be kept longer for tax purposes.
            You can request deletion anytime.
          </p>

          <h2>Your Rights and Control</h2>
          <p>
            This is your data. You have rights. Here&apos;s what you can do:
          </p>
          <ul>
            <li>
              <strong>Access your data:</strong> Request a copy of all personal information we have about you.
            </li>
            <li>
              <strong>Correct mistakes:</strong> If we have incorrect information, tell us and we&apos;ll
              fix it.
            </li>
            <li>
              <strong>Delete your data:</strong> Ask us to delete your account and associated data. We&apos;ll
              honor this except for data we&apos;re legally required to keep.
            </li>
            <li>
              <strong>Stop processing:</strong> Object to how we&apos;re using your data or ask us to
              restrict certain processing.
            </li>
            <li>
              <strong>Export your data:</strong> Get your data in a portable format that you can transfer
              to another service.
            </li>
            <li>
              <strong>Withdraw consent:</strong> If you opted in to marketing emails, you can opt out anytime.
            </li>
          </ul>
          <p>
            To exercise any of these rights, email us at{' '}
            <a href="mailto:hello@whitehatlink.org">hello@whitehatlink.org</a>. We&apos;ll respond within
            30 days.
          </p>
          <p>
            <strong>Plain English summary:</strong> You can access, correct, delete, or export your data
            anytime. Just email us. These rights are real and we honor them.
          </p>

          <h2>Cookies and Tracking</h2>
          <p>
            Like most websites, we use cookies. These are small files stored on your device. Here&apos;s what
            we use them for:
          </p>
          <ul>
            <li>
              <strong>Essential cookies:</strong> These make the website work. They remember your login
              session and shopping cart. Without these, the site wouldn&apos;t function.
            </li>
            <li>
              <strong>Analytics cookies:</strong> These help us understand how people use our site - which
              pages are popular, where people get stuck, what features people love. We use this to improve
              the product.
            </li>
          </ul>
          <p>
            You can disable cookies in your browser settings. But heads up - some features won&apos;t work
            properly without them.
          </p>
          <p>
            <strong>Plain English summary:</strong> We use cookies to make the site work and understand how
            to improve it. You can turn them off in your browser, but the site might not work as well.
          </p>

          <h2>Links to Other Websites</h2>
          <p>
            Our site contains links to other websites - publisher sites, payment processors, social media.
            We&apos;re not responsible for their privacy practices. When you click those links, you&apos;re
            subject to their privacy policies, not ours.
          </p>
          <p>
            Always read the privacy policy of any site you visit. Don&apos;t assume they have the same
            standards we do.
          </p>

          <h2>Children&apos;s Privacy</h2>
          <p>
            Our service is for businesses and professionals. We don&apos;t market to children and we
            don&apos;t knowingly collect information from anyone under 18. If you&apos;re under 18,
            please don&apos;t use our service or give us your information.
          </p>
          <p>
            If we discover we&apos;ve accidentally collected data from a child, we&apos;ll delete it
            immediately.
          </p>

          <h2>International Data Transfers</h2>
          <p>
            The internet is global. Your data might be processed on servers in different countries.
            We use Cloudflare, which has data centers worldwide. This means your information could be
            transferred to and processed in the United States, Europe, or other regions.
          </p>
          <p>
            We ensure these transfers comply with data protection laws like GDPR. Our service providers
            are required to protect your data regardless of where it&apos;s processed.
          </p>
          <p>
            <strong>Plain English summary:</strong> Your data might be processed in different countries
            because we use global infrastructure. We ensure it&apos;s protected everywhere.
          </p>

          <h2>Updates to This Policy</h2>
          <p>
            We might update this privacy policy occasionally. When we make significant changes, we&apos;ll
            notify you via email or a prominent notice on our website.
          </p>
          <p>
            Minor updates (like fixing typos or adding clarifications) won&apos;t trigger a notification,
            but we&apos;ll always update the &quot;Last updated&quot; date at the top.
          </p>
          <p>
            If you continue using our service after we update the policy, that means you accept the changes.
            If you don&apos;t agree with the new terms, you can stop using the service and request deletion
            of your data.
          </p>

          <h2>Contact Us</h2>
          <p>
            Questions about this privacy policy? Concerns about how we handle your data? Want to exercise
            your rights? Just email us.
          </p>
          <p>
            Email: <a href="mailto:hello@whitehatlink.org">hello@whitehatlink.org</a>
          </p>
          <p>
            We&apos;re real people and we actually read these emails. You&apos;ll get a response from a
            human, not a bot. Usually within 24-48 hours.
          </p>

          <hr />

          <p className="text-sm text-muted-foreground">
            <strong>Final thoughts:</strong> Privacy policies are usually boring and confusing. We tried
            to make this one clear and honest. We collect data we need to run the business. We protect
            it seriously. We don&apos;t sell it. If you have questions, ask us. Simple as that.
          </p>
        </div>
      </div>
    </>
  )
}
