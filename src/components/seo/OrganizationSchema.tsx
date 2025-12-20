import { siteConfig } from '@/config/site'

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/logo.png`,
      width: 512,
      height: 512,
    },
    description: siteConfig.shortDescription,
    foundingDate: siteConfig.foundingDate,
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.email,
      contactType: "customer service",
      availableLanguage: ["English"],
    },
    areaServed: {
      "@type": "Country",
      name: siteConfig.country,
    },
    knowsAbout: siteConfig.expertise,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
