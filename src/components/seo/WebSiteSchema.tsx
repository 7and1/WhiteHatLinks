export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://whitehatlink.org/#website",
    url: "https://whitehatlink.org",
    name: "WhiteHatLinks",
    description: "Premium backlinks without spam. Vetted, high-authority guest posts.",
    publisher: {
      "@id": "https://whitehatlink.org/#organization",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://whitehatlink.org/inventory?niche={search_term_string}",
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
