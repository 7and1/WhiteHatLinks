export interface InventoryItem {
  id: string
  niche: string
  dr: number
  traffic: number
  price: number
  region?: string
  status: string
  spamScore?: number
  linkType?: string
  tat?: string | number
}

export function ProductSchema({ items }: { items: InventoryItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": "https://whitehatlink.org/inventory#catalog",
    name: "Premium Backlink Inventory",
    description: "Curated list of high-authority guest post opportunities with transparent metrics. All sites manually vetted for quality.",
    url: "https://whitehatlink.org/inventory",
    numberOfItems: items.length,
    provider: {
      "@id": "https://whitehatlink.org/#organization",
    },
    itemListElement: items.slice(0, 20).map((item, index) => ({
      "@type": "Offer",
      "@id": `https://whitehatlink.org/inventory#offer-${item.id}`,
      position: index + 1,
      itemOffered: {
        "@type": "Service",
        "@id": `https://whitehatlink.org/inventory#service-${item.id}`,
        name: `${item.niche} Guest Post (DR ${item.dr})`,
        description: `Permanent do-follow backlink on a DR ${item.dr} ${item.niche} website with ${item.traffic?.toLocaleString() ?? 'N/A'} monthly organic traffic. Manual outreach, editorial placement.`,
        provider: {
          "@id": "https://whitehatlink.org/#organization",
        },
        areaServed: {
          "@type": "Country",
          name: item.region || "United States",
        },
        serviceType: "Guest Post Link Building",
        category: item.niche,
      },
      price: item.price,
      priceCurrency: "USD",
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: item.status === "Available"
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@id": "https://whitehatlink.org/#organization",
      },
      url: "https://whitehatlink.org/inventory",
      validFrom: new Date().toISOString(),
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function AggregateRatingSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://whitehatlink.org/#service",
    name: "WhiteHatLinks Premium Link Building Service",
    description: "Professional white-hat link building and guest posting service with transparent metrics and manual outreach",
    provider: {
      "@id": "https://whitehatlink.org/#organization",
    },
    serviceType: "SEO Link Building Service",
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
      bestRating: "5",
      worstRating: "1",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "150",
      highPrice: "2500",
      offerCount: "16000",
      availability: "https://schema.org/InStock",
      url: "https://whitehatlink.org/inventory",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface OfferSchemaProps {
  name: string
  description: string
  price: number
  priceDescription?: string
  features: string[]
  url?: string
}

export function OfferSchema({
  name,
  description,
  price,
  priceDescription,
  features,
  url = "https://whitehatlink.org/pricing",
}: OfferSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Offer",
    name,
    description,
    price,
    priceCurrency: "USD",
    priceSpecification: priceDescription ? {
      "@type": "PriceSpecification",
      priceCurrency: "USD",
      price,
      valueAddedTaxIncluded: false,
      description: priceDescription,
    } : undefined,
    availability: "https://schema.org/InStock",
    seller: {
      "@id": "https://whitehatlink.org/#organization",
    },
    itemOffered: {
      "@type": "Service",
      name,
      description,
      provider: {
        "@id": "https://whitehatlink.org/#organization",
      },
      serviceType: "Link Building Service",
      additionalProperty: features.map(feature => ({
        "@type": "PropertyValue",
        name: "Feature",
        value: feature,
      })),
    },
    url,
    validFrom: new Date().toISOString(),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
