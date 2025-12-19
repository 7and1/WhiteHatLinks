import type { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbSchema, FAQSchema } from '@/components/seo'

// Revalidate every 24 hours
export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Link Building FAQ - Simple Answers to Your Questions | WhiteHatLinks',
  description:
    'Got questions about link building? We have answers. Learn how we build high-quality backlinks, our vetting process, pricing, guarantees, and what makes us different. No BS.',
  alternates: {
    canonical: 'https://whitehatlink.org/faq',
  },
  openGraph: {
    title: 'Link Building FAQ - Simple Answers | WhiteHatLinks',
    description: 'Everything you need to know about professional link building. Straight talk, no jargon.',
    url: 'https://whitehatlink.org/faq',
  },
}

const faqCategories = [
  {
    category: 'About Our Service',
    faqs: [
      {
        question: 'What is WhiteHatLinks?',
        answer:
          'We\'re a link building service that does things the right way. No tricks. No spam. No fake websites. Here\'s what we do: We find real websites with real traffic. Sites people actually visit. Then we get your link placed on those sites through guest posts or link insertions. Every site is checked manually. We look at traffic numbers. We check spam scores. We read the content to make sure it\'s good. Why? Because bad links hurt you. Google is smart. It knows when you\'re gaming the system. We only work with legitimate publishers who care about their content. Think of us as your link building partner who actually gives a damn about quality. We\'ve been doing this since 2018. We\'ve placed over 50,000 links. And we sleep well at night because we do it right.',
      },
      {
        question: 'How do you source your inventory?',
        answer:
          'Simple. We talk to website owners directly. No middlemen. No brokers. Just us and the publisher. Here\'s the process: Our outreach team contacts thousands of website owners every month. We look for sites with good traffic, clean link profiles, and quality content. Most sites don\'t make the cut. We reject about 85% of potential publishers. Why so picky? Because one bad link can hurt your rankings more than ten good links help. The sites that do get approved go through our 12-point vetting process. We check Domain Rating, organic traffic, spam score, content quality, and link profile health. We also verify they have editorial standards and publish regularly. Once approved, we negotiate fair pricing and add them to our inventory. We maintain direct relationships with over 3,000 active publishers across dozens of niches. This direct approach means better prices for you and better quality control for us.',
      },
      {
        question: 'What makes you different from other link building services?',
        answer:
          'Three big things. First: Transparency. You see the metrics before you buy. DR, traffic, niche, region, price. All visible. Most services hide this stuff. We don\'t. Second: Quality control. Every single site is manually vetted. No automated BS. No PBN networks. No sketchy link farms. Real sites only. Third: Accountability. If your link goes down within 12 months, we replace it free. No questions asked. Most services? Good luck getting them to respond after they have your money. We also keep domain names private until you qualify. Why? To protect our publisher relationships from spam. And to ensure fair access to limited inventory. Once you\'re qualified, you get full domain access. Bottom line: We treat this like a real business. Not a quick cash grab. We want you to succeed because that means you\'ll come back and buy more links. It\'s simple economics.',
      },
    ],
  },
  {
    category: 'Quality & Vetting',
    faqs: [
      {
        question: 'How do you vet the sites in your inventory?',
        answer:
          'Our 12-point vetting process is thorough. Here\'s what we check: (1) Traffic verification using Ahrefs and Semrush. We need proof of real organic traffic. (2) Spam score analysis. Anything above 5% gets rejected. (3) Content quality review. We read recent posts. Bad writing? Gone. (4) Link profile check. Too many outbound links? Red flag. (5) Domain age and history. New domains are risky. We prefer sites that have been around. (6) Editorial standards. Does the site have a real editorial process? (7) Publication frequency. Dead blogs don\'t count. (8) Niche relevance. The site must make sense for link building. (9) Design and user experience. Professional sites only. (10) Social signals. Does anyone share their content? (11) Backlink profile quality. Who links to them matters. (12) Publisher verification. We confirm the site owner is legitimate. This process takes time. But it works. The result? Every site in our inventory is something we\'d be proud to get a link from ourselves.',
      },
      {
        question: 'What metrics do you show before purchase?',
        answer:
          'We show you everything you need to make a smart decision. Domain Rating from Ahrefs. This tells you link authority. Most sites in our inventory are DR 30+. We show estimated monthly organic traffic. Real traffic, verified through Ahrefs and Semrush. Not made-up numbers. You see the niche category. Tech, Finance, Health, Marketing, whatever. You see geographic region. US, UK, Canada, Australia, etc. And you see the price upfront. No hidden fees. No surprise charges. What we don\'t show immediately is the actual domain URL. Why? Because we need to protect our publisher relationships. If we showed domains publicly, they\'d get hammered with spam outreach. Once you qualify as a serious buyer, we reveal the full domain. You can verify everything yourself before committing. This system protects publishers while giving you transparency where it matters.',
      },
      {
        question: 'Why do you hide the domain names?',
        answer:
          'Two reasons. Both good ones. First: Publisher protection. When we reveal domains publicly, bad actors start spamming those publishers. They send terrible pitches. They offer $5 guest posts. They ruin the relationship. Publishers get annoyed and stop working with everyone. We protect our publishers so they stay in business and keep accepting quality placements. Second: Fair access to inventory. We have limited slots on popular sites. If we showed domains to everyone, people would try to bypass us and go direct. That\'s fine, but it ruins pricing for everyone and floods publishers with requests. Our qualification process is simple. Contact us. Tell us about your website and your needs. If you\'re serious, we show you domains. Most legitimate buyers have no problem with this. The only people who complain are those trying to game the system. Think of it like a restaurant with a private wine list. You need to be a customer to see it.',
      },
      {
        question: 'What if a link goes down after placement?',
        answer:
          'We have your back. Here\'s our guarantee: If a link gets removed within 12 months of placement, we replace it. Free. No questions asked. No hidden conditions. Why do links go down? Sometimes a publisher sells their site. New owner cleans house. Sometimes a site restructures and removes old content. Sometimes technical issues happen. It\'s rare, but it happens. When it does, we fix it. We monitor all placed links. If we notice one go down, we contact you proactively. You also get a report every quarter showing link status. Replacement links are equivalent quality. Same DR range. Same niche relevance. We don\'t downgrade you. The only exception? If the link was removed because of your content. If you published something that violated the publisher\'s guidelines, that\'s on you. But for everything else, we\'ve got you covered. This guarantee is why we\'re picky about which sites we work with. We only partner with stable, professional publishers who maintain their content.',
      },
    ],
  },
  {
    category: 'Process & Delivery',
    faqs: [
      {
        question: 'How long does it take to get a link placed?',
        answer:
          'Depends on the type of placement. Guest posts: 2-4 weeks typically. Why? Because we need to write quality content, get publisher approval, make revisions, and wait for publication. Publishers have editorial calendars. We can\'t rush them. Link insertions: 1-2 weeks usually. These are faster because we\'re adding a link to existing content. Less work for the publisher means faster turnaround. Digital PR campaigns: 4-6 weeks for first placements. These involve pitching journalists and earning coverage. Can\'t be rushed. Quality takes time. We could promise 48-hour delivery like some services. But that\'s BS. Those services use automated tools and low-quality sites. We don\'t. Real publishers have real processes. We respect that. Want it faster? Choose link insertions. They\'re quicker and often just as effective. Or plan ahead and order guest posts in batches. That way you always have new links going live.',
      },
      {
        question: 'Do you write the content for guest posts?',
        answer:
          'Yes. Every single word. Our writers are native English speakers. Most are based in the US. They have real expertise in their niches. No AI-generated garbage. No cheap offshore content farms. No spinning existing articles. Here\'s our process: You tell us your target keywords and anchor text preferences. We research the topic and create an outline. We write a high-quality article (usually 1,500-2,500 words). We incorporate your link naturally in the content. We submit to the publisher for review. If they want revisions, we handle it. You can provide guidelines. Writing style, topics to cover, keywords to target. The more specific you are, the better. But we handle all the heavy lifting. The content is designed to pass publisher editorial review and provide value to readers. Because that\'s what works. Publishers reject thin content. Readers ignore obvious sponsored posts. We write stuff that actually gets published and read.',
      },
      {
        question: 'Can I choose my own anchor text?',
        answer:
          'You can suggest it. And we\'ll use it if it makes sense. Here\'s the reality: Publishers want links to look natural. "Best CRM software" anchored to your homepage? That looks spammy. Publishers will reject it. Or worse, they\'ll publish it and hurt your rankings. We work with you to find anchor text that satisfies three requirements: (1) It helps your SEO. (2) It looks natural in the content. (3) The publisher approves it. Sometimes that means exact match keywords. Sometimes it means branded anchors. Sometimes it means naked URLs. We have 7 years of experience getting links approved. We know what works. Trust the process. Most clients want to over-optimize anchor text. That\'s a mistake. Google is smart. Diverse, natural anchor text works better than exact match everything. We\'ll suggest modifications when needed. You make the final call. But we strongly recommend listening to our guidance. We\'ve placed 50,000+ links. We know what gets approved and what gets rejected.',
      },
      {
        question: 'How do I track my orders?',
        answer:
          'Complete transparency. Here\'s what you get: After placing an order, you receive a tracking sheet. It\'s a Google Sheet with real-time updates. You see every step: Order received. Content in progress. Submitted to publisher. Approved. Scheduled. Live. Once the link goes live, we send you full details. The live URL where your link appears. The exact anchor text used. Screenshot of the placement. DA/DR metrics. Publication date. Everything documented. We also do quarterly link audits. We check that all your links are still live. We verify they\'re still indexed by Google. If anything is wrong, we fix it proactively. No need to ask for updates. The tracking sheet updates automatically. You can check status anytime. Most services? Radio silence until the link is live. Maybe. We keep you informed every step of the way. Because that\'s how professionals operate.',
      },
    ],
  },
  {
    category: 'Pricing & Payment',
    faqs: [
      {
        question: 'How is pricing determined?',
        answer:
          'Simple formula. Better sites cost more. Here are the factors: Domain Rating matters. A DR 70 site costs more than a DR 30 site. Why? Because higher DR means more link authority. Traffic matters too. A site with 50,000 monthly visitors costs more than one with 5,000 visitors. More eyeballs = more value. Niche competitiveness plays a role. Finance and legal placements cost more than general business blogs. Why? Higher demand, fewer quality publishers. Placement type affects price. Guest posts cost more than link insertions. Guest posts require writing content and publisher coordination. More work = higher price. Geographic focus can change pricing. US-focused sites often cost more than international sites. Typical ranges: DR 30-40 sites start around $200-400. DR 50-60 sites run $500-800. DR 70+ premium sites can be $1,000+. But these are just rough numbers. Every site is priced individually based on its metrics. We don\'t inflate prices arbitrarily. We pay publishers fairly and add our service fee. Transparent pricing. No games.',
      },
      {
        question: 'Do you offer bulk discounts?',
        answer:
          'Yes. Buy more, save more. It\'s that simple. Here\'s how it works: Order 5-10 links per month? You get 10% off. Order 10-20 links per month? You get 15% off. Order 20+ links per month? Let\'s talk custom pricing. We can do better. Why discounts for volume? Because it\'s more efficient for us. We can batch your orders together. We can prioritize you with publishers. We can plan ahead instead of scrambling. Those savings get passed to you. Monthly retainers work best. You commit to a certain number of links per month. We deliver consistently. You get better pricing and priority service. We get predictable revenue. Win-win. Most serious SEO agencies and brands go this route. One-time orders are fine. But if you\'re serious about link building, monthly packages make more sense. Contact us with your volume needs. We\'ll create a custom proposal. No obligation to commit. Just honest pricing for honest volume.',
      },
      {
        question: 'What payment methods do you accept?',
        answer:
          'We make it easy to pay. Wire transfer works. Major credit cards work (Visa, Mastercard, Amex). PayPal works for international clients. Crypto? Not yet, but we\'re considering it. For one-time orders, credit cards are fastest. For monthly retainers, we can do monthly invoicing via wire transfer or ACH. Whatever makes sense for your accounting department. We use Stripe for credit card processing. Secure, encrypted, standard stuff. We don\'t store your card details. PayPal is available for clients outside the US who prefer it. Fees are slightly higher, but it works. For large orders ($5,000+), wire transfer is preferred. Lower fees for both of us. Payment is always invoiced. You get a detailed invoice showing exactly what you\'re paying for. Line items for each link. Clear pricing. No surprises. Need net-30 terms? For established clients with good payment history, we can arrange that. New clients pay upfront or 50/50. That\'s just smart business.',
      },
      {
        question: 'What are your payment terms?',
        answer:
          'Fair and flexible. For new clients: 50% upfront to start work. 50% when the link goes live. Why this structure? Because we invest time and money before the link is live. Writer costs, outreach costs, publisher fees. We need to cover those. The remaining 50% is due when you get results. Link is live and indexed. You verify everything. Then you pay the rest. For established clients with ongoing campaigns: Monthly billing works. We invoice you once per month for all links delivered that month. Payment is due within 15 days. This is much simpler for everyone. For large volume clients: Custom terms are available. Net-30 or net-45 if it makes sense. We\'re flexible when there\'s trust and history. What we don\'t do: Free trials. Deferred payment until rankings improve. Pay-per-performance. Why? Because link building is just one factor in rankings. We can\'t control your site quality, content, technical SEO, or competition. We control link quality. And we guarantee that. Payment terms are stated clearly in every invoice. No hidden fees. No surprise charges. Just straightforward business.',
      },
    ],
  },
  {
    category: 'Industries & Niches',
    faqs: [
      {
        question: 'What niches do you cover?',
        answer:
          'We cover most major industries. Here\'s what we have strong inventory for: SaaS and software companies. We have hundreds of tech sites. Finance and fintech. Banking, investing, crypto, personal finance. Health and wellness. Medical, fitness, nutrition, mental health. Marketing and business. SEO, social media, entrepreneurship, productivity. E-commerce and retail. Online stores, dropshipping, Shopify, Amazon FBA. Legal services. Law firms, legal tech, compliance. Real estate. Property investment, mortgages, home buying. Education and e-learning. Online courses, tutoring, career development. Travel and hospitality. Tourism, hotels, travel tech. We also have smaller inventories for automotive, gaming, pets, home improvement, and other niches. Don\'t see your niche? Contact us. We can usually source quality placements within 2-3 weeks. Our network of 3,000+ publishers covers a lot of ground. Even if we don\'t have existing inventory, we can often build relationships with new publishers in your space. The key is traffic and quality. If legitimate publishers exist in your niche, we can work with them.',
      },
      {
        question: 'Do you work with gambling or adult sites?',
        answer:
          'Limited availability. Here\'s the reality: Most mainstream publishers won\'t link to gambling, adult content, or certain regulated industries. It\'s a risk management decision for them. We do have some specialized inventory for: Online gambling and casinos. CBD and cannabis. Adult entertainment and dating. Payday loans and alternative finance. But availability is limited. Pricing is higher. Usually 2-3x our standard rates. Why the premium? Because publishers take more risk. They limit how many of these placements they accept. Supply and demand. If you\'re in one of these industries, contact us first. We\'ll check availability before you get your hopes up. Sometimes we can help. Sometimes we can\'t. Depends on the specific niche and your website quality. We won\'t take your money if we can\'t deliver. That\'s pointless for everyone. One exception: If your gambling or CBD site is highly professional and legal in your jurisdiction, we have better options. Sketchy sites? We can\'t help. Sorry.',
      },
      {
        question: 'Can you help with local SEO link building?',
        answer:
          'Yes, but with caveats. Our primary focus is national and international link building. That\'s what we do best. For local SEO, you usually want links from local directories, local news sites, local business associations, chamber of commerce, etc. That\'s different from what we typically provide. That said, we can source geo-targeted placements: Regional news sites. Local business blogs. State or city-focused publications. Regional industry associations. If you need links from sites specifically targeting Dallas, Toronto, London, or Sydney, we can often find them. But this is custom work. It takes longer. Availability varies by location. Big cities? Easier. Small towns? Harder. Pricing is usually comparable to our standard rates. Sometimes higher for very specific geographic requirements. Here\'s our recommendation: For local SEO, start with the basics first. Google Business Profile optimization. Local citations (Yelp, YellowPages, etc.). Industry-specific directories. Local sponsorships and partnerships. Those should be your foundation. Then add our geo-targeted placements as a supplement. That\'s the most cost-effective approach. Want to discuss local link building strategy? Contact us. We\'ll be honest about whether we\'re the right fit for your needs.',
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
          { name: 'Home', url: 'https://whitehatlink.org' },
          { name: 'FAQ', url: 'https://whitehatlink.org/faq' },
        ]}
      />
      <FAQSchema faqs={allFaqs} />

      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-wide">Got Questions?</p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground mt-2">
              Link Building FAQ
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Everything you need to know about building backlinks the right way. No jargon. No BS.
              Just straight answers from people who have placed over 50,000 links since 2018.
              We built this service because most link building companies are terrible.
              They use fake sites, deliver late, and disappear when links break. We don&apos;t do that.
              Read below to learn how we actually work.
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
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Still have questions? Just ask.
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Can&apos;t find what you need here? That&apos;s fine. Send us a message.
              We respond to every inquiry within 24 hours. Usually much faster.
              No sales pressure. Just honest answers about whether we can help you.
            </p>
            <Link
              href="/contact"
              className="inline-flex rounded-md bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 transition-colors"
            >
              Talk to us
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
