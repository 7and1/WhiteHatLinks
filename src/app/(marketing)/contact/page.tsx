import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@/components/seo'
import { Mail, Clock, Shield, MessageSquare } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us - Get a Custom Quote',
  description:
    'Get in touch with WhiteHatLinks for custom link building quotes, partnership inquiries, or questions about our services.',
  alternates: {
    canonical: 'https://whitehatlinks.io/contact',
  },
  openGraph: {
    title: 'Contact WhiteHatLinks',
    description: 'Get a custom quote for your link building needs.',
    url: 'https://whitehatlinks.io/contact',
  },
}

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    description: 'hello@whitehatlinks.io',
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
          { name: 'Home', url: 'https://whitehatlinks.io' },
          { name: 'Contact', url: 'https://whitehatlinks.io/contact' },
        ]}
      />

      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary uppercase tracking-wide">Contact</p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground mt-2">
              Let&apos;s discuss your link building needs
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you need a custom quote, have questions about our inventory, or want to
              explore a partnership, we&apos;re here to help.
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
