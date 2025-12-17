export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://whitehatlinks.io/#website",
    url: "https://whitehatlinks.io",
    name: "WhiteHatLinks",
    description: "Premium backlinks without spam. Vetted, high-authority guest posts.",
    publisher: {
      "@id": "https://whitehatlinks.io/#organization",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://whitehatlinks.io/inventory?niche={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
