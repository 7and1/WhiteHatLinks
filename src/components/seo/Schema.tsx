import { siteConfig } from '@/config/site'

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
    "@id": `${siteConfig.url}/inventory#catalog`,
    name: "Premium Backlink Inventory",
    description: "Curated list of high-authority guest post opportunities with transparent metrics. All sites manually vetted for quality.",
    url: `${siteConfig.url}/inventory`,
    numberOfItems: items.length,
    provider: {
      "@id": `${siteConfig.url}/#organization`,
    },
    itemListElement: items.slice(0, 20).map((item, index) => ({
      "@type": "Offer",
      "@id": `${siteConfig.url}/inventory#offer-${item.id}`,
      position: index + 1,
      itemOffered: {
        "@type": "Service",
        "@id": `${siteConfig.url}/inventory#service-${item.id}`,
        name: `${item.niche} Guest Post (DR ${item.dr})`,
        description: `Permanent do-follow backlink on a DR ${item.dr} ${item.niche} website with ${item.traffic?.toLocaleString() ?? 'N/A'} monthly organic traffic. Manual outreach, editorial placement.`,
        provider: {
          "@id": `${siteConfig.url}/#organization`,
        },
        areaServed: {
          "@type": "Country",
          name: item.region || siteConfig.country,
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
        "@id": `${siteConfig.url}/#organization`,
      },
      url: `${siteConfig.url}/inventory`,
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
    "@id": `${siteConfig.url}/#service`,
    name: `${siteConfig.name} Premium Link Building Service`,
    description: "Professional white-hat link building and guest posting service with transparent metrics and manual outreach",
    provider: {
      "@id": `${siteConfig.url}/#organization`,
    },
    serviceType: "SEO Link Building Service",
    areaServed: {
      "@type": "Country",
      name: siteConfig.country,
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
      url: `${siteConfig.url}/inventory`,
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
  url = `${siteConfig.url}/pricing`,
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
      "@id": `${siteConfig.url}/#organization`,
    },
    itemOffered: {
      "@type": "Service",
      name,
      description,
      provider: {
        "@id": `${siteConfig.url}/#organization`,
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
