import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@/components/seo'

// Revalidate every 7 days (legal pages change infrequently)
export const revalidate = 604800

export const metadata: Metadata = {
  title: 'Terms of Service - WhiteHatLinks Link Building Services',
  description: 'Clear, simple terms for WhiteHatLinks services. Understand your rights, our guarantees, and what to expect from our link building platform. Updated December 2024.',
  alternates: {
    canonical: 'https://whitehatlink.org/terms',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Terms of Service - WhiteHatLinks',
    description: 'Clear, simple terms for WhiteHatLinks services. Understand your rights and our guarantees.',
    url: 'https://whitehatlink.org/terms',
    type: 'website',
  },
}

export default function TermsPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://whitehatlink.org' },
          { name: 'Terms of Service', url: 'https://whitehatlink.org/terms' },
        ]}
      />

      <div className="container py-16">
        <div className="prose max-w-3xl mx-auto">
          <h1>Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: December 2024</p>

          <p className="lead">
            Look, terms of service are usually boring and full of legal nonsense. We wrote ours in plain English.
            If you use WhiteHatLinks, these are the rules. Simple as that.
          </p>

          <h2>1. Agreement to Terms</h2>
          <p>
            <strong>Plain English:</strong> By using our service, you agree to these rules. Don't like them?
            Don't use our service. It's that simple.
          </p>
          <p>
            When you access or use WhiteHatLinks services, you enter into a legal agreement with us.
            This means you accept and agree to follow all the terms written here. If you disagree with any part,
            you cannot use our services. We're not trying to trick you - we just need clear rules so everyone
            knows what to expect.
          </p>

          <h2>2. What We Do</h2>

          <h3>Our Services</h3>
          <p>
            <strong>Plain English:</strong> We help you get high-quality backlinks from real websites.
            That's it. No tricks, no spam, no black hat tactics.
          </p>
          <p>
            WhiteHatLinks provides link building services. Here's what that means:
          </p>
          <ul>
            <li><strong>Guest Posts:</strong> We get your content published on quality websites with links back to your site</li>
            <li><strong>Link Insertions:</strong> We add relevant links to existing content on publisher websites</li>
            <li><strong>Digital PR Campaigns:</strong> We help you earn links through newsworthy stories and outreach</li>
          </ul>
          <p>
            We connect you with real publishers who own real websites. These are legitimate sites with actual traffic
            and authority. We don't deal with link farms, PBNs, or spam networks. That stuff doesn't work anymore anyway.
          </p>

          <h3>What Makes Us Different</h3>
          <p>
            We built this platform because link building was broken. Most agencies hide their publisher networks,
            use middlemen, and charge crazy markups. We're transparent about pricing and quality. Our inventory
            system lets you see exactly what you're buying before you buy it.
          </p>

          <h2>3. Your Responsibilities</h2>
          <p>
            <strong>Plain English:</strong> Give us accurate info. Pay your bills. Don't use our service for
            anything illegal or shady. Common sense stuff.
          </p>

          <h3>What You Need to Do</h3>
          <ul>
            <li>
              <strong>Tell the truth:</strong> Give us accurate information about your website and what you want to achieve.
              We can't help you if you lie to us.
            </li>
            <li>
              <strong>Follow the law:</strong> Make sure your website complies with applicable laws and regulations.
              We're not your lawyers, but we won't work with illegal sites.
            </li>
            <li>
              <strong>Be ethical:</strong> Don't use our services for scams, spam, or anything harmful.
              We reserve the right to refuse service to anyone doing shady stuff.
            </li>
            <li>
              <strong>Pay on time:</strong> We deliver, you pay. Simple transaction. Late payments cause problems for everyone.
            </li>
            <li>
              <strong>Work with publishers:</strong> When publishers have guidelines for content or anchor text,
              follow them. They're doing us a favor by linking to your site.
            </li>
          </ul>

          <h3>What Happens If You Don't</h3>
          <p>
            If you violate these responsibilities, we can suspend or terminate your account. We'll refund any
            prepaid services that weren't delivered, but we won't refund completed work. Fair is fair.
          </p>

          <h2>4. Service Delivery</h2>
          <p>
            <strong>Plain English:</strong> We'll work fast, but we can't control publishers.
            Expect 2-4 weeks for most orders. Sometimes faster, sometimes slower.
          </p>
          <p>
            We make reasonable efforts to deliver services within estimated timeframes. However, delivery times are
            estimates, not guarantees. Here's why: we work with real publishers who have their own schedules and
            approval processes. Sometimes they're fast. Sometimes they're slow. Sometimes they reject content and
            we need to revise or find an alternative.
          </p>

          <h3>Typical Timelines</h3>
          <ul>
            <li><strong>Link Insertions:</strong> Usually 1-2 weeks</li>
            <li><strong>Guest Posts:</strong> Usually 2-4 weeks (includes content creation and publisher approval)</li>
            <li><strong>Digital PR:</strong> Usually 4-8 weeks (outreach takes time)</li>
          </ul>
          <p>
            Factors outside our control - like holidays, publisher workload, or content revisions - may affect delivery.
            We'll keep you updated throughout the process.
          </p>

          <h2>5. Our Guarantee</h2>
          <p>
            <strong>Plain English:</strong> Links stay live for at least 12 months. If a publisher removes your link
            for no good reason, we'll replace it for free. We stand behind our work.
          </p>
          <p>
            We guarantee that links placed through our service will remain live for a minimum of 12 months from the
            date of delivery. This is our commitment to quality and reliability.
          </p>

          <h3>How the Guarantee Works</h3>
          <p>
            If a link is removed within the 12-month period due to publisher actions (not related to your content
            violating guidelines), we will provide a replacement link of equivalent value at no additional cost.
            "Equivalent value" means similar domain authority, traffic, and relevance to your niche.
          </p>

          <h3>What's Not Covered</h3>
          <p>We won't replace links if:</p>
          <ul>
            <li>The publisher removed it because your content violated their guidelines</li>
            <li>Your website went down or contained harmful content</li>
            <li>The publisher's entire website went offline (rare, but it happens)</li>
            <li>You requested the link be removed</li>
          </ul>
          <p>
            We monitor links regularly, but you should too. If you notice a link is down, contact us immediately
            so we can investigate and resolve the issue.
          </p>

          <h2>6. Payment Terms</h2>
          <p>
            <strong>Plain English:</strong> Pay half upfront, half when we deliver. Simple.
            Don't pay late or we'll suspend your account.
          </p>
          <p>
            Payment is due according to the terms specified in your invoice. Our standard payment structure is:
          </p>
          <ul>
            <li><strong>50% deposit</strong> when you place your order</li>
            <li><strong>50% final payment</strong> upon delivery and verification of links</li>
          </ul>

          <h3>Accepted Payment Methods</h3>
          <p>
            We accept credit cards, debit cards, and bank transfers. All payments are processed securely.
            We don't store your payment information on our servers.
          </p>

          <h3>Late Payments</h3>
          <p>
            Late payments cause real problems. They affect our ability to pay publishers and deliver services to
            other clients. If payment is more than 7 days late, we may:
          </p>
          <ul>
            <li>Suspend your account and pause active orders</li>
            <li>Charge a late fee of 1.5% per month on the outstanding balance</li>
            <li>Cancel your order and retain the deposit to cover costs already incurred</li>
          </ul>
          <p>
            If you're having payment issues, talk to us. We're reasonable people. We can work out a payment plan
            if you communicate with us.
          </p>

          <h2>7. Refund Policy</h2>
          <p>
            <strong>Plain English:</strong> We'll refund you if we don't deliver. But once a link is live,
            no refunds - our replacement guarantee covers you instead.
          </p>
          <p>
            Refunds may be issued at our discretion for services not delivered. Here's how it works:
          </p>

          <h3>Before Delivery</h3>
          <p>
            If we cannot deliver your order within a reasonable timeframe, or if we cannot meet the quality standards
            we promised, you can request a full refund. We'll process it within 10 business days.
          </p>

          <h3>After Delivery</h3>
          <p>
            Once a link is live and verified, no refunds will be provided. Why? Because we've already paid the
            publisher and completed the work. If a link is subsequently removed, our 12-month replacement guarantee
            applies instead. This is fair to everyone involved.
          </p>

          <h3>Partial Refunds</h3>
          <p>
            For bulk orders, if we deliver some links but not others, we'll refund you for the undelivered portion.
            Simple math.
          </p>

          <h2>8. Confidentiality</h2>
          <p>
            <strong>Plain English:</strong> We don't share your information. Your campaigns are private.
            Our publisher network is private too. Everyone's secrets are safe.
          </p>
          <p>
            We take confidentiality seriously. Here's what we keep private:
          </p>

          <h3>Your Information</h3>
          <p>
            We maintain strict confidentiality regarding your link building campaigns. We will not disclose your
            client information, target keywords, or campaign strategies to third parties without your explicit consent.
            The only exception is when required by law (like a court order).
          </p>

          <h3>Publisher Network</h3>
          <p>
            Our publisher domain information is kept confidential. We don't publicly list our publisher network
            because it would allow competitors to contact them directly. However, we do show you relevant details
            (like domain metrics and niche) before you purchase, so you can make informed decisions.
          </p>

          <h3>Data Security</h3>
          <p>
            We use industry-standard security measures to protect your data. This includes encryption, secure servers,
            and regular security audits. We're not perfect, but we take this seriously.
          </p>

          <h2>9. Limitation of Liability</h2>
          <p>
            <strong>Plain English:</strong> We're not responsible for everything that could possibly go wrong.
            If something does go wrong, we'll refund what you paid. That's the maximum we're liable for.
          </p>
          <p>
            WhiteHatLinks shall not be liable for any indirect, incidental, special, consequential, or punitive
            damages resulting from your use of our services. This includes things like:
          </p>
          <ul>
            <li>Lost profits or revenue</li>
            <li>Changes in search engine rankings (we can't control Google)</li>
            <li>Business interruption</li>
            <li>Loss of data or information</li>
            <li>Cost of substitute services</li>
          </ul>

          <h3>Maximum Liability</h3>
          <p>
            Our total liability shall not exceed the amount you paid for the specific service in question.
            If you paid $500 for a link package, the maximum we're liable for is $500. This is standard for
            service businesses and protects both parties from unreasonable claims.
          </p>

          <h3>Why This Matters</h3>
          <p>
            Link building is one part of SEO. We provide quality backlinks, but we can't guarantee specific ranking
            improvements because we don't control search engines. Google changes its algorithm constantly. Your
            rankings depend on many factors beyond backlinks. We're honest about this.
          </p>

          <h2>10. Prohibited Uses</h2>
          <p>
            <strong>Plain English:</strong> Don't use our service for illegal stuff, spam, malware, or harassment.
            Don't violate copyright. Don't be a jerk. We'll ban you immediately.
          </p>
          <p>You may not use our services to promote or distribute:</p>

          <h3>Illegal Content</h3>
          <ul>
            <li>Content that violates federal, state, or local laws</li>
            <li>Illegal drugs, weapons, or controlled substances</li>
            <li>Counterfeit goods or services</li>
            <li>Content that facilitates illegal activities</li>
          </ul>

          <h3>Harmful Content</h3>
          <ul>
            <li>Malware, viruses, or malicious software</li>
            <li>Phishing attempts or fraudulent schemes</li>
            <li>Content that harasses, threatens, or harms individuals or groups</li>
            <li>Hate speech or content that promotes violence</li>
          </ul>

          <h3>Intellectual Property Violations</h3>
          <ul>
            <li>Content that violates copyright, trademark, or patent rights</li>
            <li>Unauthorized use of others' intellectual property</li>
            <li>Plagiarized content (we check for this)</li>
          </ul>

          <h3>Search Engine Violations</h3>
          <ul>
            <li>Tactics that violate Google's Webmaster Guidelines</li>
            <li>Cloaking, hidden text, or deceptive redirects</li>
            <li>Excessive link manipulation schemes</li>
          </ul>

          <p>
            We follow white hat practices. That means quality content, relevant links, and real relationships with
            publishers. If you want black hat services, go somewhere else.
          </p>

          <h2>11. Termination</h2>
          <p>
            <strong>Plain English:</strong> We can end the relationship anytime if you break the rules.
            You can end it anytime too. Either way, we'll settle up fairly.
          </p>

          <h3>Our Right to Terminate</h3>
          <p>
            We reserve the right to terminate or suspend services immediately for violations of these terms.
            This includes:
          </p>
          <ul>
            <li>Using our service for prohibited purposes</li>
            <li>Non-payment or repeated late payments</li>
            <li>Providing false information</li>
            <li>Attempting to abuse or exploit our platform</li>
            <li>Harassing our team or publishers</li>
          </ul>

          <h3>Your Right to Terminate</h3>
          <p>
            You can terminate services at any time by sending written notice to hello@whitehatlink.org.
            Here's what happens:
          </p>
          <ul>
            <li>Any completed work will be invoiced at the agreed rates</li>
            <li>Any prepaid services not yet delivered will be refunded</li>
            <li>Work in progress will be invoiced on a pro-rata basis</li>
            <li>We'll provide a final accounting within 10 business days</li>
          </ul>

          <h3>Effect of Termination</h3>
          <p>
            After termination, you can no longer access our platform or services. However, any links already placed
            remain live (assuming publishers keep them). Our 12-month guarantee continues for existing links.
          </p>

          <h2>12. Changes to Terms</h2>
          <p>
            <strong>Plain English:</strong> We might update these terms. If we make big changes, we'll email you.
            Keep using our service = you accept the new terms.
          </p>
          <p>
            We may modify these terms at any time to reflect changes in our services, legal requirements, or business
            practices. Continued use of our services after changes constitutes acceptance of the new terms.
          </p>

          <h3>How We Notify You</h3>
          <p>
            For material changes (anything that significantly affects your rights or obligations), we will:
          </p>
          <ul>
            <li>Send an email notification to your registered email address</li>
            <li>Post a notice on our website</li>
            <li>Give you at least 30 days to review the changes before they take effect</li>
          </ul>

          <h3>Your Options</h3>
          <p>
            If you don't agree with the new terms, you can terminate your account before they take effect.
            We'll provide a full refund for any prepaid services not yet delivered. If you continue using
            our services after the effective date, you accept the new terms.
          </p>

          <h2>13. Governing Law</h2>
          <p>
            <strong>Plain English:</strong> U.S. law applies to these terms. If we end up in court (hopefully not),
            it'll be in the United States.
          </p>
          <p>
            These terms shall be governed by and construed in accordance with the laws of the United States,
            without regard to conflict of law principles. Any disputes arising from these terms or our services
            shall be resolved in U.S. courts.
          </p>

          <h3>Dispute Resolution</h3>
          <p>
            If we have a disagreement, let's try to work it out like reasonable people first. Most problems
            can be solved with a conversation. If that doesn't work, we'll consider mediation before resorting
            to litigation. Lawyers are expensive and nobody wins except the lawyers.
          </p>

          <h2>14. Contact Information</h2>
          <p>
            <strong>Plain English:</strong> Questions? Problems? Just email us. We're real people and we respond quickly.
          </p>
          <p>
            For questions, concerns, or complaints about these Terms of Service, please contact us at{' '}
            <a href="mailto:hello@whitehatlink.org">hello@whitehatlink.org</a>. We typically respond within
            24 hours during business days.
          </p>

          <h3>What to Include</h3>
          <p>When contacting us, please include:</p>
          <ul>
            <li>Your account email or order number</li>
            <li>A clear description of your question or issue</li>
            <li>Any relevant dates, links, or documentation</li>
            <li>What outcome you're looking for</li>
          </ul>
          <p>
            The more details you provide, the faster we can help you. We're here to make this work for everyone.
          </p>

          <hr className="my-8" />

          <h2>Final Thoughts</h2>
          <p>
            These terms exist to protect both of us. We've tried to make them fair and reasonable.
            We built WhiteHatLinks to provide transparent, quality link building services. We believe in
            clear communication, fair pricing, and doing what we say we'll do.
          </p>
          <p>
            If something here doesn't make sense, ask us. If you think a term is unreasonable, tell us why.
            We're open to feedback. We're building this business for the long term, which means treating
            customers right and standing behind our work.
          </p>
          <p>
            Thanks for reading this far. Most people don't. Now let's build some great backlinks together.
          </p>
        </div>
      </div>
    </>
  )
}
