import { siteConfig } from '@/config/site'

interface ArticleSchemaProps {
  title: string
  description: string
  url: string
  publishedDate: string
  modifiedDate?: string
  authorName?: string
  image?: string
}

export function ArticleSchema({
  title,
  description,
  url,
  publishedDate,
  modifiedDate,
  authorName = `${siteConfig.name} Team`,
  image,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    url: url,
    datePublished: publishedDate,
    dateModified: modifiedDate || publishedDate,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    ...(image && {
      image: {
        "@type": "ImageObject",
        url: image,
      },
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
