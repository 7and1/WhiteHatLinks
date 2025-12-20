/**
 * Check actual word count for all published articles
 */
import puppeteer from 'puppeteer'

const articles = [
  'what-is-outreach',
  'types-of-link-building-outreach-which-strategy-wor',
  'building-your-outreach-tech-stack-essential-tools-',
  'how-to-find-contact-emails-for-outreach-12-proven-',
  'writing-outreach-emails-that-get-replies-templates',
  'follow-up-strategies-that-work-get-responses-witho',
  'common-outreach-mistakes-to-avoid-learn-from-faile',
  'scaling-outreach-with-vas-and-teams-from-solo-to-1',
  'personalization-at-scale-send-emails-that-feel-per',
  'outreach-metrics-kpis-track-and-improve-your-numbe',
  'building-long-term-relationships-through-outreach-',
  'outreach-for-different-industries-customize-your-a',
]

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter((word) => word.length > 0).length
}

async function main() {
  console.log('🌐 Launching browser...\n')
  const browser = await puppeteer.launch({
    headless: true,
  })

  const page = await browser.newPage()

  console.log('📊 Checking article word counts...\n')
  console.log('=' .repeat(80))

  const results: Array<{ slug: string; title: string; words: number }> = []

  for (const slug of articles) {
    const url = `https://whitehatlinks.7and1.workers.dev/blog/${slug}`

    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })

      // Get title
      const title = await page.$eval('h1', (el) => el.textContent?.trim() || '')

      // Get article content text
      const content = await page.evaluate(() => {
        // Find the main article content area
        const article = document.querySelector('article') || document.querySelector('main')
        if (!article) return ''

        // Get all text, excluding navigation and footer
        return article.textContent || ''
      })

      const wordCount = countWords(content)
      results.push({ slug, title, words: wordCount })

      console.log(`✅ ${slug}`)
      console.log(`   Title: ${title}`)
      console.log(`   Words: ${wordCount.toLocaleString()}`)
      console.log('')
    } catch (error) {
      console.log(`❌ ${slug}`)
      console.log(`   Error: ${error}`)
      console.log('')
      results.push({ slug, title: 'Error loading', words: 0 })
    }
  }

  await browser.close()

  console.log('=' .repeat(80))
  console.log('\n📊 Summary:\n')

  // Sort by word count
  results.sort((a, b) => b.words - a.words)

  results.forEach((r, i) => {
    const status = r.words >= 2000 ? '✅' : r.words >= 1000 ? '⚠️' : '❌'
    console.log(
      `${i + 1}. ${status} ${r.words.toLocaleString().padStart(5)} words - ${r.title.substring(0, 50)}...`,
    )
  })

  const total = results.reduce((sum, r) => sum + r.words, 0)
  const avg = Math.round(total / results.length)

  console.log(`\n📈 Total: ${total.toLocaleString()} words`)
  console.log(`📈 Average: ${avg.toLocaleString()} words per article`)

  const shortArticles = results.filter((r) => r.words < 2000)
  if (shortArticles.length > 0) {
    console.log(`\n⚠️  ${shortArticles.length} articles under 2000 words`)
  }
}

main().catch(console.error)
