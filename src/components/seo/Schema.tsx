interface InventoryItem {
  id: string
  niche: string
  dr: number
  traffic: number
  price: number
  region?: string
  status: string
}

export function ProductSchema({ items }: { items: InventoryItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Premium Backlink Inventory",
    description: "Curated list of high-authority guest post opportunities with transparent metrics",
    url: "https://whitehatlinks.io/inventory",
    numberOfItems: items.length,
    provider: {
      "@id": "https://whitehatlinks.io/#organization",
    },
    itemListElement: items.slice(0, 20).map((item, index) => ({
      "@type": "Offer",
      position: index + 1,
      itemOffered: {
        "@type": "Service",
        name: `${item.niche} Guest Post (DR ${item.dr})`,
        description: `Permanent do-follow backlink on a DR ${item.dr} ${item.niche} website with ${item.traffic?.toLocaleString() ?? 'N/A'} monthly organic traffic. Manual outreach, editorial placement.`,
        provider: {
          "@id": "https://whitehatlinks.io/#organization",
        },
        areaServed: {
          "@type": "Country",
          name: item.region || "United States",
        },
        serviceType: "Guest Post Link Building",
      },
      price: item.price,
      priceCurrency: "USD",
      availability: item.status === "Available"
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@id": "https://whitehatlinks.io/#organization",
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
