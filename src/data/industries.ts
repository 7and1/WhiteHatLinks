export interface IndustryData {
  slug: string
  name: string
  title: string
  description: string
  metaDescription: string
  challenges: string[]
  benefits: string[]
  stats: { value: string; label: string }[]
  content: {
    intro: string
    whyHard: string
    solution: string
  }
}

export const industries: Record<string, IndustryData> = {
  saas: {
    slug: 'saas',
    name: 'SaaS',
    title: 'SaaS Link Building & Guest Posting',
    description: 'Premium backlinks for SaaS companies',
    metaDescription:
      'Build high-authority backlinks for your SaaS company. Vetted tech and business sites with real traffic. No PBNs.',
    challenges: [
      'Tech sites often have strict editorial guidelines',
      'Many SaaS blogs are saturated with low-quality guest posts',
      'Finding sites with relevant B2B audiences is difficult',
      'Competitors are aggressively link building',
    ],
    benefits: [
      'Niche-relevant tech and business publications',
      'Sites with B2B decision-maker audiences',
      'DR 50-80+ options in software and tech verticals',
      'Content written by writers who understand SaaS',
    ],
    stats: [
      { value: '200+', label: 'SaaS-relevant sites' },
      { value: 'DR 50+', label: 'Average domain rating' },
      { value: '78%', label: 'Avg. organic traffic lift' },
    ],
    content: {
      intro:
        'SaaS companies face unique link building challenges. Your audience is sophisticated, your competitors are well-funded, and generic placements do nothing for your rankings. You need links from sites that tech decision-makers actually read.',
      whyHard:
        'Most SaaS link building fails because agencies place links on irrelevant lifestyle blogs or low-quality tech sites. Google knows when a link doesn\'t make sense contextually. A project management tool doesn\'t belong on a cooking blog, no matter how high the DR.',
      solution:
        'We maintain a curated inventory of tech publications, business blogs, and industry sites where SaaS content fits naturally. Every site is manually vetted for traffic quality and audience relevance. Your links appear in content that your target customers might actually read.',
    },
  },
  finance: {
    slug: 'finance',
    name: 'Finance',
    title: 'Finance & Fintech Link Building',
    description: 'Premium backlinks for financial services',
    metaDescription:
      'Secure high-authority backlinks for finance and fintech brands. YMYL-safe placements on trusted financial publications.',
    challenges: [
      'Finance is YMYL - Google scrutinizes these sites heavily',
      'Many finance blogs are low-quality affiliate sites',
      'Compliance requirements limit content options',
      'High competition from well-funded fintech companies',
    ],
    benefits: [
      'YMYL-safe placements on established finance sites',
      'Sites with genuine financial news readership',
      'Compliance-friendly content approaches',
      'DR 60+ options in finance and business verticals',
    ],
    stats: [
      { value: '150+', label: 'Finance-relevant sites' },
      { value: 'DR 60+', label: 'Average domain rating' },
      { value: '41%', label: 'Avg. money keyword lift' },
    ],
    content: {
      intro:
        'Finance link building requires extra care. As a Your Money Your Life (YMYL) category, Google applies heightened scrutiny to financial content. Low-quality links can actually hurt your rankings in this vertical.',
      whyHard:
        'The finance niche is flooded with affiliate sites masquerading as legitimate publications. Links from these sites can trigger algorithmic penalties. Additionally, compliance teams often have strict requirements about what content can be associated with your brand.',
      solution:
        'Our finance inventory focuses on established publications with genuine readership and editorial standards. We understand compliance requirements and work with your team to ensure content meets regulatory guidelines. Every placement is on a site you\'d be proud to show your compliance officer.',
    },
  },
  crypto: {
    slug: 'crypto',
    name: 'Crypto',
    title: 'Crypto & Web3 Link Building',
    description: 'Premium backlinks for crypto and blockchain',
    metaDescription:
      'Build authority for your crypto project with placements on trusted blockchain and fintech publications. No PBNs.',
    challenges: [
      'Many crypto sites are fly-by-night operations',
      'High rates of spam and low-quality content in the space',
      'Mainstream publications often refuse crypto content',
      'Regulatory uncertainty affects content acceptance',
    ],
    benefits: [
      'Established crypto and blockchain publications',
      'Sites with genuine community readership',
      'Options for both B2B and consumer crypto audiences',
      'Experience navigating crypto content restrictions',
    ],
    stats: [
      { value: '100+', label: 'Crypto-relevant sites' },
      { value: 'DR 45+', label: 'Average domain rating' },
      { value: '3+ yrs', label: 'Avg. site age' },
    ],
    content: {
      intro:
        'Crypto link building is uniquely challenging. The space is full of low-quality sites, scam projects have made publishers wary, and regulatory uncertainty makes many mainstream publications refuse crypto content entirely.',
      whyHard:
        'Most "crypto guest post" services place links on newly created sites with fake traffic. These links provide no value and can actually signal to Google that you\'re associated with the spam side of crypto. Additionally, many legitimate publications have blanket bans on crypto content.',
      solution:
        'We\'ve built relationships with established crypto publications that have real communities and editorial standards. Our inventory includes sites that have survived multiple market cycles, not fly-by-night operations. We also have access to mainstream finance and tech sites that selectively accept crypto content.',
    },
  },
  health: {
    slug: 'health',
    name: 'Health',
    title: 'Health & Wellness Link Building',
    description: 'Premium backlinks for health brands',
    metaDescription:
      'YMYL-safe link building for health and wellness brands. Placements on trusted health publications with medical review processes.',
    challenges: [
      'Health is highest-scrutiny YMYL category',
      'Google requires E-E-A-T signals for health content',
      'Many health sites lack proper medical review',
      'FTC and FDA guidelines affect content options',
    ],
    benefits: [
      'Sites with medical review processes',
      'Placements that support E-E-A-T signals',
      'Compliance-aware content approaches',
      'Focus on wellness and lifestyle angles',
    ],
    stats: [
      { value: '80+', label: 'Health-relevant sites' },
      { value: 'DR 55+', label: 'Average domain rating' },
      { value: '100%', label: 'Medically reviewed' },
    ],
    content: {
      intro:
        'Health link building requires the highest level of care. Google\'s Quality Rater Guidelines explicitly call out health as a category where low-quality content can cause real-world harm. Links from untrustworthy health sites can devastate your rankings.',
      whyHard:
        'The health space is filled with sites that publish unreviewed medical claims. Google has become extremely sophisticated at identifying these sites. Beyond SEO, there are real regulatory risks - the FTC actively pursues health brands making unsupported claims.',
      solution:
        'Our health inventory focuses on sites with proper medical review processes and genuine editorial oversight. We often recommend wellness and lifestyle angles rather than direct medical claims, which opens up more placement opportunities while keeping you compliant.',
    },
  },
  tech: {
    slug: 'tech',
    name: 'Tech',
    title: 'Technology & Software Link Building',
    description: 'Premium backlinks for tech companies',
    metaDescription:
      'Build authority in the tech space with placements on developer blogs, tech news sites, and industry publications.',
    challenges: [
      'Tech audiences are skeptical of promotional content',
      'Developer communities can be hostile to marketing',
      'Many tech sites have strict no-follow policies',
      'Keeping up with rapidly changing tech topics',
    ],
    benefits: [
      'Developer blogs with engaged audiences',
      'Tech news sites with genuine readership',
      'Industry publications in specific tech verticals',
      'Writers who understand technical topics',
    ],
    stats: [
      { value: '250+', label: 'Tech-relevant sites' },
      { value: 'DR 50+', label: 'Average domain rating' },
      { value: '65%', label: 'Do-follow rate' },
    ],
    content: {
      intro:
        'Tech link building requires understanding your audience. Developers and technical decision-makers can spot marketing content from a mile away. Generic guest posts on low-quality tech blogs won\'t move the needle - you need placements that provide genuine value.',
      whyHard:
        'The tech community values authenticity. Promotional content gets called out on Hacker News and Twitter. Many legitimate tech sites have moved to no-follow links or refuse guest content entirely. And tech topics change so quickly that evergreen content is hard to create.',
      solution:
        'We focus on sites where technical content fits naturally - developer blogs, tech news sites, and industry publications. Our writers have technical backgrounds and can create content that provides real value to readers. We also identify do-follow opportunities that many agencies miss.',
    },
  },
}

export function getIndustryData(slug: string): IndustryData | null {
  return industries[slug.toLowerCase()] || null
}

export function getAllIndustries(): IndustryData[] {
  return Object.values(industries)
}
