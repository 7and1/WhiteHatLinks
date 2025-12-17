interface ServiceItem {
  name: string
  description: string
  url?: string
}

export function ServiceSchema({ services }: { services: ServiceItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Link Building Services",
    provider: {
      "@id": "https://whitehatlinks.io/#organization",
    },
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Link Building Services",
      itemListElement: services.map((service, index) => ({
        "@type": "Offer",
        position: index + 1,
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description,
          ...(service.url && { url: service.url }),
        },
      })),
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
