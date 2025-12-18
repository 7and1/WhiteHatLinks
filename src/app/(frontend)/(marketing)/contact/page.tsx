import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@/components/seo'
import { Mail, Clock, Shield, MessageSquare } from 'lucide-react'

// Revalidate every 24 hours
export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Contact WhiteHatLinks - Fast Response, Real People, No BS',
  description:
    'Talk to real link building experts. Get custom quotes within 12 hours. NDA available for agencies. Simple process: message us, get a proposal, start ranking.',
  alternates: {
    canonical: 'https://whitehatlink.org/contact',
  },
  openGraph: {
    title: 'Contact WhiteHatLinks - Fast Response, Real People',
    description: 'Talk to real link building experts. Get custom quotes within 12 hours.',
    url: 'https://whitehatlink.org/contact',
  },
}

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    description: 'hello@whitehatlink.org',
    detail: 'We respond within 12 hours',
  },
  {
    icon: Clock,
    title: 'Response Time',
    description: 'Within 12 hours',
    detail: 'Monday to Friday',
  },
  {
    icon: Shield,
    title: 'Secure',
    description: 'NDA available',
    detail: 'For agency partners',
  },
]

export default function ContactPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://whitehatlink.org' },
          { name: 'Contact', url: 'https://whitehatlink.org/contact' },
        ]}
      />

      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary uppercase tracking-wide">Contact</p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground mt-2">
              Contact WhiteHatLinks
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Real people. Fast answers. No sales pitch.
            </p>
          </div>

          {/* Welcome Section */}
          <div className="mb-12 prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Let&apos;s Talk About Your Link Building
            </h2>
            <p className="text-muted-foreground mb-4">
              Here&apos;s the deal. We don&apos;t do phone calls with a sales team reading scripts.
              We don&apos;t force you into a demo. We just answer your questions like normal humans.
            </p>
            <p className="text-muted-foreground mb-4">
              Fill out the form below. Tell us what you need. We&apos;ll read it personally and get
              back to you within 12 hours on business days. Usually faster.
            </p>
            <p className="text-muted-foreground mb-6">
              Want links for your site? Need guest posts? Looking for agency partnership? Just ask.
              We&apos;ll tell you exactly what we can do and what it costs. Simple.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4 mt-8">
              How This Works
            </h2>
            <div className="space-y-4 mb-6">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">You Send a Message</h3>
                  <p className="text-sm text-muted-foreground">
                    Fill out the form. Tell us your website URL, what kind of links you need,
                    and your budget range. Takes 2 minutes.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">We Review Your Site</h3>
                  <p className="text-sm text-muted-foreground">
                    We check your website. Look at your niche. Figure out which sites in our
                    inventory make sense for you. No cookie-cutter packages.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">You Get a Custom Quote</h3>
                  <p className="text-sm text-muted-foreground">
                    Within 12 hours, we send you a proposal. Real site options. Real prices.
                    Real metrics. Everything transparent.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">You Decide</h3>
                  <p className="text-sm text-muted-foreground">
                    Like the proposal? Great. We start immediately. Need changes? Tell us.
                    Not interested? No problem. No pushy follow-ups.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-4 mt-8">
              What to Expect After You Contact Us
            </h2>
            <p className="text-muted-foreground mb-4">
              Most link building companies make you wait days. Or they spam you with calls. We don&apos;t.
            </p>
            <div className="bg-secondary/50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-foreground mb-3">Our Response Timeline:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>First 12 hours:</strong> Initial response confirming we got your message</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Within 24 hours:</strong> Custom proposal with site options and pricing</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Within 48 hours:</strong> Answer any questions about the proposal</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Same week:</strong> Start your campaign if you approve</span>
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-4 mt-8">
              Who You&apos;re Talking To
            </h2>
            <p className="text-muted-foreground mb-4">
              Not a chatbot. Not a junior sales rep. You get our founder or senior team members
              who actually understand link building. People who have built thousands of links.
              People who know what works and what doesn&apos;t.
            </p>
            <p className="text-muted-foreground mb-6">
              We&apos;ve been doing this for years. We know SEO. We know content. We know outreach.
              And we only sell links we would use ourselves.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4 mt-8">
              Security and Privacy
            </h2>
            <p className="text-muted-foreground mb-4">
              Your information is safe. We use secure forms. We don&apos;t sell your data.
              We don&apos;t spam you with newsletters.
            </p>
            <div className="bg-primary/5 rounded-lg p-6 mb-6 border border-primary/20">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                For Agencies and Resellers:
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                Need an NDA before sharing client details? We get it. Just ask and we&apos;ll send
                one over. Many agencies white-label our services and we keep everything confidential.
              </p>
              <p className="text-sm text-muted-foreground">
                Your clients will never know you work with us. All communication goes through you.
                We&apos;re just the engine behind your results.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-4 mt-8">
              Common Questions Before Contacting
            </h2>
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Do I need to know my exact requirements?
                </h3>
                <p className="text-sm text-muted-foreground">
                  No. Just tell us your goals. Want to rank higher? Need more organic traffic?
                  We&apos;ll recommend what makes sense.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  What&apos;s the minimum budget?
                </h3>
                <p className="text-sm text-muted-foreground">
                  We work with budgets starting at $1,000 per month. But we&apos;ll be honest
                  if that&apos;s not enough for your goals.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Can I see the sites before buying?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Yes. Check our inventory page first. Or we&apos;ll send you specific site
                  options with full metrics in your custom quote.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Do you do contracts?
                </h3>
                <p className="text-sm text-muted-foreground">
                  No long-term contracts. Month to month. Cancel anytime. We keep clients by
                  delivering results, not by locking them in.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-4 mt-8">
              Ready to Start?
            </h2>
            <p className="text-muted-foreground mb-6">
              Fill out the form. We&apos;ll take it from there. If you&apos;re not sure what to write,
              just tell us your website and budget. We&apos;ll ask the right questions in our response.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Contact Form */}
            <div className="rounded-xl border bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground mb-6">Send us a message</h2>
              <form action="/api/inquire" method="POST" className="space-y-6">
                <input type="hidden" name="source" value="contact_page" />
                <input
                  type="text"
                  name="company_name"
                  aria-hidden="true"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Work email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-foreground mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="url"
                    className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm"
                    placeholder="https://your-website.com"
                  />
                </div>

                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-foreground mb-2">
                    Monthly budget
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm"
                  >
                    <option value="">Select a range</option>
                    <option value="1000-3000">$1,000 - $3,000</option>
                    <option value="3000-5000">$3,000 - $5,000</option>
                    <option value="5000-10000">$5,000 - $10,000</option>
                    <option value="10000+">$10,000+</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm resize-none"
                    placeholder="Tell us about your link building goals..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-md bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 transition-colors"
                >
                  Send message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {contactInfo.map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 rounded-xl border bg-white p-6 shadow-sm"
                >
                  <div className="flex-shrink-0">
                    <div className="rounded-full bg-primary/10 p-3">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-primary font-medium">{item.description}</p>
                    <p className="text-sm text-muted-foreground">{item.detail}</p>
                  </div>
                </div>
              ))}

              <div className="rounded-xl border bg-gradient-to-br from-primary/5 to-white p-6">
                <MessageSquare className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Prefer to browse first?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Check out our live inventory and request access to specific sites directly.
                </p>
                <a
                  href="/inventory"
                  className="inline-flex rounded-md border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
                >
                  View inventory
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
