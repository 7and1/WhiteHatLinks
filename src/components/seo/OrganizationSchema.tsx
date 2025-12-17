export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://whitehatlinks.io/#organization",
    name: "WhiteHatLinks",
    url: "https://whitehatlinks.io",
    logo: {
      "@type": "ImageObject",
      url: "https://whitehatlinks.io/logo.png",
      width: 512,
      height: 512,
    },
    description:
      "Premium backlink acquisition service. Vetted, high-authority guest posts and link insertions with transparent metrics. No PBNs, no spam.",
    foundingDate: "2023",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@whitehatlinks.io",
      contactType: "customer service",
      availableLanguage: ["English"],
    },
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    knowsAbout: [
      "Link Building",
      "Guest Posting",
      "SEO",
      "Digital PR",
      "Content Marketing",
      "Backlink Acquisition",
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
