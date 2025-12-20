/**
 * Check word counts by fetching HTML directly
 */

const articles = [
  { slug: 'what-is-outreach', shortName: 'What is Outreach' },
  {
    slug: 'types-of-link-building-outreach-which-strategy-wor',
    shortName: 'Types of Outreach',
  },
  {
    slug: 'building-your-outreach-tech-stack-essential-tools-',
    shortName: 'Tech Stack',
  },
  {
    slug: 'how-to-find-contact-emails-for-outreach-12-proven-',
    shortName: 'Find Emails',
  },
  {
    slug: 'writing-outreach-emails-that-get-replies-templates',
    shortName: 'Writing Emails',
  },
  {
    slug: 'follow-up-strategies-that-work-get-responses-witho',
    shortName: 'Follow-up',
  },
  {
    slug: 'common-outreach-mistakes-to-avoid-learn-from-faile',
    shortName: 'Mistakes',
  },
  {
    slug: 'scaling-outreach-with-vas-and-teams-from-solo-to-1',
    shortName: 'Scaling',
  },
  {
    slug: 'personalization-at-scale-send-emails-that-feel-per',
    shortName: 'Personalization',
  },
  {
    slug: 'outreach-metrics-kpis-track-and-improve-your-numbe',
    shortName: 'Metrics',
  },
  {
    slug: 'building-long-term-relationships-through-outreach-',
    shortName: 'Relationships',
  },
  {
    slug: 'outreach-for-different-industries-customize-your-a',
    shortName: 'Industries',
  },
]

function countWords(text: string): number {
  // Remove HTML tags
  const cleanText = text.replace(/<[^>]*>/g, ' ')
  // Remove extra whitespace
  const normalized = cleanText.replace(/\s+/g, ' ').trim()
  // Count words
  return normalized.split(/\s+/).filter((word) => word.length > 0).length
}

function extractTextFromHTML(html: string): string {
  // Find main content area
  const articleMatch =
    html.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
    html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)

  if (!articleMatch) return ''

  let content = articleMatch[1]

  // Remove script and style tags
  content = content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')

  return content
}

async function checkArticle(slug: string, name: string) {
  const url = `https://whitehatlinks.7and1.workers.dev/blog/${slug}`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const html = await response.text()
    const content = extractTextFromHTML(html)
    const wordCount = countWords(content)

    return { name, slug, words: wordCount, error: null }
  } catch (error) {
    return { name, slug, words: 0, error: String(error) }
  }
}

async function main() {
  console.log('📊 Checking article word counts from frontend...\n')
  console.log('='.repeat(70))

  const results = []

  for (const article of articles) {
    const result = await checkArticle(article.slug, article.shortName)
    results.push(result)

    if (result.error) {
      console.log(`❌ ${result.name.padEnd(25)} - Error: ${result.error}`)
    } else {
      const status =
        result.words >= 2000 ? '✅' : result.words >= 1000 ? '⚠️ ' : '❌'
      console.log(
        `${status} ${result.name.padEnd(25)} ${result.words.toLocaleString().padStart(5)} words`,
      )
    }

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  console.log('='.repeat(70))
  console.log('\n📈 Summary:\n')

  // Sort by word count
  const sorted = [...results].sort((a, b) => b.words - a.words)
  sorted.forEach((r, i) => {
    if (r.words > 0) {
      const status = r.words >= 2000 ? '✅' : r.words >= 1000 ? '⚠️' : '❌'
      console.log(
        `${(i + 1).toString().padStart(2)}. ${status} ${r.words.toLocaleString().padStart(5)} words - ${r.name}`,
      )
    }
  })

  const validResults = results.filter((r) => r.words > 0)
  const total = validResults.reduce((sum, r) => sum + r.words, 0)
  const avg = Math.round(total / validResults.length)

  console.log(`\n📊 Statistics:`)
  console.log(`   Total: ${total.toLocaleString()} words`)
  console.log(`   Average: ${avg.toLocaleString()} words per article`)

  const shortArticles = validResults.filter((r) => r.words < 2000)
  const mediumArticles = validResults.filter(
    (r) => r.words >= 2000 && r.words < 3000,
  )
  const longArticles = validResults.filter((r) => r.words >= 3000)

  console.log(`\n📈 Distribution:`)
  console.log(`   🟢 3000+ words: ${longArticles.length} articles`)
  console.log(`   🟡 2000-3000 words: ${mediumArticles.length} articles`)
  console.log(`   🔴 Under 2000 words: ${shortArticles.length} articles`)

  if (shortArticles.length > 0) {
    console.log(`\n⚠️  Articles under 2000 words:`)
    shortArticles.forEach((a) => {
      console.log(`   - ${a.name}: ${a.words.toLocaleString()} words`)
    })
  }
}

main().catch(console.error)
